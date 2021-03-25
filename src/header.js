'use strict';

import {setupEasel} from "./easel.js"

/////// TEMPLATE ELEMENTS /////////////
const optionTemplate = document.createElement('option')
export const changeEvent = document.createEvent("HTMLEvents");
changeEvent.initEvent('change', false, true);


////////// ELEMENTS ////////////
const datasetEl = document.querySelector('header .source-input[data-type=dataset]')
const variableEls = document.querySelectorAll('header .variable select')
const drawEl = document.querySelector('header button#draw')
const sourceTypeEl = document.querySelectorAll('header input[name=source-type]')

const getVar = id => document.getElementById(id).value


////////// DATA //////////
var data, xVar, yVar, slicer

export {yVar}


///////////// EVENT LISTENERS ///////////

datasetEl.addEventListener("change", async function() {
    const params = parseQuery(this.value)

    data = await d3.csv(params.get('url'))
    const columns = Object.keys(data[0])

    variableEls.forEach(el => {
        for (let column of columns) {
            let option = optionTemplate.cloneNode()
            option.textContent = column
            el.appendChild(option)    
        }
        el.value = params.get(el.id)
    })


})

drawEl.addEventListener("click", function() {
    xVar = getVar('xVar')
    yVar = getVar('yVar')
    slicer = getVar('slicer')
    setupEasel({data, xVar, yVar, slicer})


})

sourceTypeEl.forEach(el => {
    el.addEventListener("click", function() {
        switchDataSource(this.value)
    })
})



//////////////// FUNCTIONS /////////////////

async function fillDatasetSelections () {
    const dataset = await import('./datasets.js') 

    for (let [name, value] of Object.entries(dataset.dataSources)) {
        let option = optionTemplate.cloneNode()
        option.value = value
        option.textContent = name
        datasetEl.appendChild(option)
    }

    datasetEl.dispatchEvent(changeEvent)

}
fillDatasetSelections()


function switchDataSource (sourceType) {
    document.querySelectorAll('.source-input').forEach(el => {
        el.style.display = 'none';
    })
    document.querySelector(`.source-input[data-type=${sourceType}`).style.display = "block";
}
switchDataSource('dataset')


function parseQuery (query) {
    var params = query.split("&").map(x => {
        let [key, value] = x.trim().split("=",2)
        return {key, value}
    })
    params.constructor.prototype.get = function(key) {
        return this.find(pair => pair.key == key)?.value
    }
    return params
}


