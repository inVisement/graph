'use strict';

import {setupEasel} from './easel.js'


/////// TEMPLATE ELEMENTS /////////////
const optionTemplate = document.createElement('option')

export const changeEvent = document.createEvent("HTMLEvents");
changeEvent.initEvent('change', false, true);

const inputEvent = document.createEvent("HTMLEvents");
inputEvent.initEvent('input', false, true);


////////// ELEMENTS ////////////
const datasetEl = document.querySelector('header .source-input[data-type=dataset]')
const columnEls = document.querySelectorAll('header .column select')


////////// DATA //////////
export var data



///////////// EVENT LISTENERS ///////////



window.readDatasetParams = async function (datasetName) {

    // parse params and add the url query params
    const params = parseQuery(datasetName+window.location.search.replace('?','&'))

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

    setupEasel()

    actions(params)

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



export function actions (params) {
    for (let {key, value} of params) {
        switch (key) {
            case 'filter':
                //filterValue.set(value || "")
                let filterBar = document.querySelector('header #filter-bar')
                filterBar.value = value
                filterBar.dispatchEvent(inputEvent)
                break;
            case 'selectAll':
                batch_select(true)
                break;
            case 'selectNone':
                batch_select(false)
                break;
            case 'select':
                for (let key of value.split(',')) {
                    let checkbox = document.querySelector(`nav li[key="${key}"] input`)
                    checkbox.checked = true
                    checkbox.dispatchEvent(changeEvent)                
                }
                break;
            case 'deselect':
                for (let key of value.split(',')) {
                    let checkbox = document.querySelector(`nav li[key="${key}"] input`)
                    checkbox.checked = false
                    checkbox.dispatchEvent(changeEvent)                
                }
                break;
            case 'bold':
                for (let key of value.split(',')) {
                    let checkbox = document.querySelector(`nav li[key="${key}"] input`)
                    checkbox.checked = true
                    checkbox.dispatchEvent(changeEvent)                
                    let label = document.querySelector(`nav li[key="${key}"] label`)
                    label.click()
                }
                break;
            case 'sort':
                if (value) {
                    let direction = value.includes('-')? 'ascending' : 'descending'
                    sort_legend_items(value.replace('-',''), direction)    
                } else {
                    sort_legend_items('code', 'descending')
                    sort_legend_items('input', 'descending')                    
                }
                break;
            case 'mode':
                if (value='view') {
                    document.querySelector('header').style.display = 'none'
                }
                break;

        }
    }
}
