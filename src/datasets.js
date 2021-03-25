

export const cssVars = [
    {
        label: "line width",
        name: "--line-width",
        value: 2,
        min: 1,
        max: 5,
        type: "range"
    },
    {
        label: "passive line width",
        name: "--passive-line-width",
        value: 1,
        min: 1,
        max: 5,
        type: "range"
    },
    {
        label: "active line width",
        name: "--active-line-width",
        value: 4,
        min: 1,
        max: 6,
        type: "range"
    },
    {
        label: "background",
        name: "--background-color",
        value: "#f0f0f0",
        type: "color",
    }
]

export const dataSources = {
    "US covid vaccination": `url=https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/us_state_vaccinations.csv
        &xVar=date&yVar=total_vaccinations_per_hundred&slicer=location&name=covid-vaccination
        &selectAll&bold=United-States,Texas,California,Washington&filter=:bold
        `,
        "World covid vaccination": `url=https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv
        &xVar=date&yVar=people_vaccinated_per_hundred&slicer=location&name=covid-vaccination
        &selectAll&bold=United-States,World,Israel,United-Kingdom&filter=:bold
        `,
        "DB Ranking": `url=../data/db-ranking.csv
        &xVar=month&yVar=value&slicer=db-name
        &select=Google-BigQuery&`,
    
}


