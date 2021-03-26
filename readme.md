

## TODO
- [X] draw series
    - when clicked on checkbox in legend-item, it draws colorful series
        - "" in yVar makes parseFloat(yVra) become 0 or NaN.
- [X] sort function
    - when clicking on sort icons, sort legend items by name or score
        - problem: casting number and string, NaN in numbers
        - resolution: change sort function
- [X] add bold
    - when click on label, if drawn, make legend item and series bold
        - make all non-bolds passive
        - when removed, make passives active
- [X] add horizontal annotation
- [X] add mouse-over on series 
    - when mouse over, both legend item and line become bold
- [X] legendCheckboxHandler can be done when creating legend item from template
- [X] move all event handlers to inline in html
    - each template element should have the event handlers
    - why? then we do not need to worry about if the element populated when deploying the event handler
- [X] change sort function to have sort(by, direction) and make it inline for readability
- [ ] rewrite legend.filter function
    - get condition and then apply to list of nodes
    - right now, for each element, it evaluates the condition
- [X] git commit to invisement and tmo
- [X] change of y-axis to logarithm
    - working data: db-ranking
    - problems: y-axis range too wide, double-click: error
    - added manual entries for x and y range
    - changed double-click to closest row
- [X] draw upon reading query parameters
    - setup easel
    - read params and do actions
- [X] create view mode that does not have the header

- [ ] reading from url
- [ ] read from url with shortening url for datasets
- [ ] add title, x label, y label
- [ ] use it for tmo operational chart
- [ ] upload it for public view
- [ ] add tooltip (title) to mouse on points

## Markdown editor

## summary table

## reference cell and data in markdown

## table editor (excel in markdow)

## add query parameter ui

# how to use
parameters get fetch from url's query parameters
- example: url=../data/db-ranking.csv
    &xVar=month&yVar=value&slicer=db-name&y-log=true&y-min=0.1
    &filter=:top35&selectAll&bold=Google BigQuery,Cassandra&mode=view&filter=
- filter (defined in legend.filter()) specials starts with :
    - :bold, :top10, :bottom30, :check, :uncheck, w:bold, washi
- actions (in params): defined in easel.actions()
    - selectAll, selectNone, filter=whatever, mode=view, bold=this,that, select=this,that 



