'use strict'

import {populateLegendItems, populateNumbers} from './legend.js'
import {data} from './header.js'

// VARS
const 
    svgEl = '#graph-easel',
    margin = {left: 40, bottom: 20, right: 20, top: 10},
    width = 800, height = 400

var svg, xScale, yScale, line, dataSeries

export var xVar, yVar, slicer

const getVar = id => document.getElementById(id).value



export function setupEasel () {

    xVar = getVar('xVar')
    yVar = getVar('yVar')
    slicer = getVar('slicer')

    let yMin = getVar('y-min')
    let yMax = getVar('y-max')
    let yLog = document.querySelector('header #y-log').checked


    // append the graph template to its container
    let template = document.querySelector('template#pj-graph')
    let container = document.querySelector("#graph-container")
    container.innerHTML = ""
    container.appendChild(template.content.cloneNode(true))


    // cast types
    for (let d of data) {
        d[xVar] = new Date(d[xVar])
        d[yVar] = parseFloat(d[yVar])
        d[slicer] = d[slicer].replaceAll(/["]/ig, '-') // get rid of troubling characters
    }
    // create series: Map(slicer => [{col:value}])
    dataSeries = d3.group(data, d=>d[slicer]) 


    // append the svg object to graph-div
    svg = 
        d3
        .select(svgEl)
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("viewBox", `-${margin.left} -${margin.top+height} ${width+margin.left+margin.right} ${height + margin.top + margin.bottom}`)


    // determine max and min for axis range
    yMin = yMin || d3.min(data, d=>d[yVar])
    yMax = yMax || d3.max(data, d=>d[yVar])

    ////// define scalers
    // x scaler (it's a date)
    xScale = 
        d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d[xVar] }))
        .nice()
        .range([ 0, width ]);
    // y scaler
    yScale = yLog ? d3.scaleLog() : d3.scaleLinear()
    yScale
        .domain([yMin, yMax])
        .nice()
        .range([0, -height ]); // reverse direction
    // line function
    line = 
        d3.line()
        .y(d => yScale(d[yVar]))
        .x(d => xScale(d[xVar]))
        .curve(d3.curveBasis)


    // add x axis
    svg.append("g")
        .call(d3.axisBottom(xScale))

    // add y axis
    svg.append("g")
        .call(
            d3.axisLeft(yScale)
            .ticks(5, ".2s")
        )


    populateLegendItems(dataSeries)
    populateNumbers(dataSeries, yVar)
      
    svg.on('dblclick', e => {
        let [xPosition, yPosition] = d3.pointer(e)
        let x = xScale.invert(xPosition)
        //let y = yScale.invert(yPosition)
        
        document.querySelectorAll('nav li').forEach (li => {
            let key = li.getAttribute('key')
            let goal = x
            var closestRow = dataSeries.get(key).reduce(function(prev, curr) {
                return (Math.abs(curr[xVar] - goal) > Math.abs(prev[xVar] - goal) ? prev : curr);
            })
                    
            li.querySelector('code').innerText = closestRow?.[yVar]
        })

        // remove old annotation line and draw a new one
        svg.select("line.annotation").remove()
        
        svg
        .append('line')
        .classed("annotation", true)
        .attr("x1", xPosition)
        .attr("y1", 0)
        .attr("x2", xPosition)
        .attr("y2", yPosition)

    })
}

export function drawSeries ({key, color, yVar}) {
    let values = dataSeries.get(key).filter(v => !isNaN(v[yVar]))
    let legendItem = document.querySelector(`nav li[key="${key}"]`)


    // Draw the line
    let path = svg
    .datum(values)
    .append("path")
    .attr("fill", "none")
    .attr("d", values => line(values))
    .attr("key", key)
    .style("stroke", color)
    .classed("line", true)
    .classed("series", true)
    .on('mouseover', function() {
        legendItem.classList.add('mouseover')    
    })
    .on('mouseout', function () {
        legendItem.classList.remove('mouseover')
    })

    // if mouseover legend item, mouseover effect on line series
    legendItem.addEventListener('mouseover', function() {
        path.classed("mouseover", true)
    })
    legendItem.addEventListener('mouseout', function() {
        path.classed("mouseover", false)
    })

}
