# inVisement Graphs
Visualize your data in a minute and share it with whom you like
- or just explore our pre-defined datasets
- https://invisement.github.io/graph/src/

If you have a dataset (in csv format) and want to visualize it and share it, you just say where your data source is and this pure js library will visualize it. Easier than excel to use, Share the url, ultra light and fast, very flexible and powerful, and oh, beautiful and intuitive to use.

## Visualize Public Datasets
https://invisement.github.io/graph/src/
- [US Covid-19 Vaccination by States
    - https://invisement.github.io/graph/src/?mode=view&dataset=us-covid-vaccination
- World Covid-19 Vaccination by Country or Region
    - https://invisement.github.io/graph/src/?mode=view&dataset=world-covid-vaccination
- US Covid Cases and Death
    - https://invisement.github.io/graph/src/?mode=view&dataset=us-states-covid
- DB Rankings
    - https://invisement.github.io/graph/src/?mode=view&dataset=db-ranking

To add new dataset, make an entry in ./src/datasets.js and commit
For now, our graphing only supports time-series databases in csv format. Just say where the data source is and it automatically graphs it 


## Hidden Features
- parameters get fetch from url's query parameters
    - url=../data/db-ranking.csv
    &xVar=month&yVar=value&slicer=db-name&y-log=true&y-min=0.1
    &filter=:top35&selectAll&bold=Google BigQuery,Cassandra&mode=view&filter=&sort
- filter (defined in legend.filter()) specials starts with :
    - :bold, :top10, :bottom30, :check, :uncheck, w:bold, washi
- actions (in params): defined in easel.actions()
    - selectAll, selectNone, sort, sort=-label, filter=whatever, mode=view, bold=this,that, select=this,that, deselect=this,that


