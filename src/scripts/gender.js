import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 100, bottom: 30 }

var height = 400 - margin.top - margin.bottom

var width = 780 - margin.left - margin.right

var svg = d3
  .select('#gender')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var colorScale = d3.scaleOrdinal().range([ '#879AD6','#7181B4','#546085', '#C1C8D7'])
var xPositionScale = d3
  .scalePoint()
  .domain(["Sorceror's Stone", 'Chamber of Secrets', "Prisoner of Azkaban", 'Total'])
  .range([0, width])
  .padding(0.4)

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(80)

var pie = d3
  .pie()
  .value(function(d) {
    return d.Lines
  })
  .sort(function(d1, d2) {
    return d1.Gender.localeCompare(d2.Gender)
  })

d3.csv(require('/data/gender_lines.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.Movie
    })
    .entries(datapoints)

  var charts = svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      var xPos = xPositionScale(d.key)
      return 'translate(' + xPos + ',' + height / 2 + ')'
    })

  charts.each(function(d) {
    d3.select(this)
      .selectAll('path')
      .data(pie(d.values))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d) {
        console.log(d)
        return colorScale(d.data.Gender)
      })

    d3.select(this)
      .append('text')
      .attr('color', '#CBD2E2')
      .attr('y', 120)
      .text(d.key)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Averia Libre')
     .attr('font-weight', '800')
      .attr('font-size', '16')
      
  })
  
}
