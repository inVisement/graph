'use strict';

import {setupEasel, actions} from "./easel.js"

/////// TEMPLATE ELEMENTS /////////////
const optionTemplate = document.createElement('option')
export const changeEvent = document.createEvent("HTMLEvents");
changeEvent.initEvent('change', false, true);


////////// ELEMENTS ////////////
const datasetEl = document.querySelector('header .source-input[data-type=dataset]')
const columnEls = document.querySelectorAll('header .column select')

const getVar = id => document.getElementById(id).value


////////// DATA //////////
var data, xVar, yVar, slicer

export {yVar}


///////////// EVENT LISTENERS ///////////

window.readDatasetParams = async function (datasetName) {
    const params = parseQuery(datasetName)

    data = await d3.csv(params.get('url'))
    const columns = Object.keys(data[0])

    columnEls.forEach(el => {
        for (let column of columns) {
            let option = optionTemplate.cloneNode()
            option.textContent = column
            el.appendChild(option)    
        }
        //el.value = params.get(el.id)
    })

    document.querySelectorAll('header .variables input, header .variables select')
    .forEach(el => params.get(el.id) && (el.value = params.get(el.id)))

    document.querySelectorAll('header .variables input[type=checkbox]')
    .forEach(el => el.checked = params.get(el.id)=='true')

    setup_easel()

    actions(params)

}

window.setup_easel = function() {
    xVar = getVar('xVar')
    yVar = getVar('yVar')
    slicer = getVar('slicer')
    let yMin = getVar('y-min')
    let yMax = getVar('y-max')
    let yLog = document.querySelector('header #y-log').checked
    setupEasel({data, xVar, yVar, slicer, yMin, yMax, yLog})

}



//////////////// FUNCTIONS /////////////////

async function fillDatasetSelections (datasetName) {
    const dataset = await import('./datasets.js') 

    for (let [name, value] of Object.entries(dataset.dataSources)) {
        let option = optionTemplate.cloneNode()
        option.value = value
        option.textContent = name
        datasetEl.appendChild(option)
        if (datasetName && name.toLowerCase()==datasetName.toLowerCase()) {
            option.selected = true
        }
    }


    datasetEl.dispatchEvent(changeEvent)

}
fillDatasetSelections(parseQuery(window.location.search.slice(1)).get('dataset'))



window.switchDataSource = function(sourceType) {
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


