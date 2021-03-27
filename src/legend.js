'use strict';

import {drawSeries} from './easel.js'
import {yVar, changeEvent} from './header.js'

///////// ELEMENTS /////////
//const batchSelectEl = document.querySelector("nav header #batch-select")
//const sortEls = document.querySelectorAll("nav header .sort")
//const filterEl = document.querySelector("nav header #filter-bar")
const legendItemTemplate = "nav #legend-item-template"
const legend = 'nav ul'

const legendItems = 'nav ul li'

///////// EVENTS ///////////


window.drawLine = function (checkbox) {
    let key = checkbox.parentNode.getAttribute('key')
    if (checkbox.checked) { // draw series line
        let color = generate_next_color()
        drawSeries({key, color, yVar})
        checkbox.parentNode.style.color = color
    } else { // remove line
        document.querySelector(`.line[key="${key}"]`).remove()
        checkbox.parentNode.className = ""
    }
    checkBolds()
}


window.boldSeries = (label) => {
    let checked = label.previousElementSibling.checked
    if (!checked) return

    let key =  label.textContent
    document.querySelectorAll(`[key="${key}"]`).forEach(el => el.classList.toggle('bold'))

    checkBolds()
}

function checkBolds () {
    let bolds = document.querySelectorAll('.line.bold')

    if (bolds.length == 0) { // no bold exists, make all normal
        d3.selectAll('.line').classed('passive', false)
    } else {
        d3.selectAll('.line.bold').classed('passive', false).raise()
        d3.selectAll('.line:not(.bold)').classed('passive', true)
    }
}

//////////// FUNCTIONS ///////////

export function populateLegendItems (dataSeries) {
    dataSeries.forEach( (value, key) => {
        let item = document.querySelector(legendItemTemplate).content.cloneNode(true)
        item.querySelector('label').textContent = key
        item.querySelector('li').setAttribute('key', key)
        document.querySelector(legend).appendChild(item)
    })
}

export function populateNumbers (dataSeries, yVar) {
    document.querySelectorAll(legendItems).forEach(item => {
        let key = item.querySelector('label').textContent
        let value = dataSeries.get(key).slice(-1)[0][yVar]
        item.querySelector('code').textContent = value
    })
}

window.filter = function filter (filterValue) {
    // filter functionality: filter legend items based on filterValue wa:b means has wa in it and it is bold
    let [word, style] = filterValue.split(":")
    let lis = document.querySelectorAll("nav li")
    lis.forEach( (el, i) => {
        let label = el.textContent.trim().toLowerCase()
        label.includes(word)? el.classList.remove("hidden") : el.classList.add("hidden")

        switch (style) {
            case undefined:
                break;
            case 'bold':
                if (! el.classList.contains('bold')) {
                    el.classList.add("hidden")
                }
                break;
            case 'check': 
                if (! el.querySelector('input:checked')) {
                    el.classList.add("hidden")
                }
                break;
            case 'uncheck':
                if (el.querySelector('input:checked')) {
                    el.classList.add("hidden")
                }
                break;
            default:
                if (style.startsWith('top')) {
                    let top = parseInt(style.slice(3))
                    if (i>top) el.classList.add("hidden")
                    break; 
                } else if (style.startsWith('bottom')) {
                    let bottom = parseInt(style.slice(6))
                    if (i < lis.length-bottom) el.classList.add("hidden")
                    break; 
                }
        }
    })
}

window.sort_legend_items = function (by='label', direction='ascending') {
    function score (item, cast=String) {
        if (by=='input') {
            return item.classList.contains('bold') ? 3 : item.querySelector('input').checked ? 2 : 1
        } else {
            return cast(item.querySelector(by).textContent)
        }
    }
    //let by = this.dataset["sort"]
    let cast = {'label': String, 'code': parseFloat}[by]
    let ascend = direction == "ascending" ? 1 : -1
    let items = [...document.querySelectorAll(legendItems)]

    items.sort( (a, b) => score(a, cast) == score(b,cast) ? 0 :
        score(a,cast) > score(b,cast)? ascend :
        score(a, cast) < score(b, cast) ? -ascend : 
        score(a,cast) ? ascend : -ascend ) // if none of above, a or b is NaN
    document.querySelector("nav ul").replaceChildren(...items)

    // toggle hidden class
    document.querySelectorAll('nav header span').forEach(el => {
        el.classList.toggle('hidden')
    })
}

window.batch_select = async function (checked) {
    let checkSelector = checked ? ":not(:checked)" : ":checked" // if checked, select not checked and vice versa

    let checked_inputs = document.querySelectorAll("nav li:not(.hidden)>input" + checkSelector)
    for (let checkbox of checked_inputs) {
		checkbox.checked = checked
        checkbox.dispatchEvent(changeEvent)
    }
}

d3.schemePaired

// sequential color hue generator (number to hue)
function generate_next_color () {
    //let hue = 0;
    //parseInt(j).toString(2).split("").reverse().forEach((d,i) => hue += (parseInt(d))/2**(i+1))
    // let section = parseInt(Math.random()/0.33)
    // let domain = Math.acos(2*Math.random()-1)/3.14
    // let hue = section*120 + domain*120
    // return d3.hsl(hue, .7 + Math.random()/3, .4).toString()
    // return d3.interpolateSinebow(Math.random())
    let r = Math.random() * 255
    let g = Math.random() * 200
    let b = Math.random() * 255
    let l = (r+g+b)/400 // to have lightness of 400
    return d3.rgb(r/l,g/l,b/l).toString()

}

