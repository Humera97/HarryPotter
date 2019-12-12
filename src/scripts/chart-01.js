import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

const margin = { top: 50, left: 200, right: 200, bottom: 30 }

const height = 700 - margin.top - margin.bottom

const width = 950 - margin.left - margin.right

const svg = d3
  .select('#chart')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 350])
  .range([0, width])

const yPositionScale = d3
  .scalePoint()
  .range([height, 0])
  .padding(0.0)

// Read in files
d3.csv(require('../data/movie_lines_hp.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.person
    })
    .entries(datapoints)

  // Go through each group, pull out the name of that group
  const person = nested.map(d => d.key)
  // Teach it to the y position scale
  yPositionScale.domain(person)

  // Add a g element for every single city
  // and then let's do something with each of you
  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(0,${yPositionScale(d.key)})`
    })
    .each(function(d) {
      const g = d3.select(this)

      const datapoints = d.values

      const one = d3.max(datapoints, d => d.movie1)
      const three = d3.max(datapoints, d => d.movie3)
      const tip1 = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return ` <span style='color:white'>Sorcerer's Stone: ${one}</span>`
        })

      svg.call(tip1)
      const tip2 = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return ` <span style='color:white'>Prisoner of Azkaban: ${three}</span>`
        })

      svg.call(tip2)

      g.append('line')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xPositionScale(one))
        .attr('x2', xPositionScale(three))
        .attr('stroke', '#BFC8D8')
        .attr('stroke-width', '3')
        .attr('opacity', '.5')

      g.append('circle')
        .attr('r', 8)
        .attr('fill', '#F5EBD5')
        .attr('stroke', '#B1AA9A')
        .attr('cy', 0)
        .attr('cx', xPositionScale(one))
        .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide)

      g.append('circle')
        .attr('r', 8)
        .attr('fill', '#733E5D')
        .attr('stroke', '#B1AA9A')
        .attr('cy', 0)
        .attr('cx', xPositionScale(three))
        .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide)
    })
  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickSize(0)
    .tickPadding(10)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .attr('font-family', 'Averia Libre')
    .attr('font-size', '14')
    .attr('color', '#B1BCCB')
    .attr('opacity', '.75')
  // svg
  //   .append('g')
  //   // .attr('class', 'blackAxis')
  //   .attr('transform', 'translate(0,' + height + ')')
  //   .call(xAxis)
  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(0)
    .tickPadding(20)

  // svg
  //   .append('text')
  //   .attr('class', 'title')
  //   .attr('text-anchor', 'left')
  //   .attr('x', -30)
  //   .attr('y', -100)
  //   .text('Lines Spoken by Characters')
  // svg
  //   .append('text')
  //   .attr('class', 'subtitle')
  //   .attr('text-anchor', 'left')
  //   .attr('x', -30)
  //   .attr('y', -70)
  //   .text('')
  // svg
  //   .append('text')
  //   .attr('class', 'subtitle')
  //   .attr('text-anchor', 'left')
  //   .attr('x', -30)
  //   .attr('y', -50)
  //   .text(
  //     'In the Wizarding World, there are a few key characters we have come to associate with Harry. '
  //   )
  // svg
  //   .append('text')
  //   .attr('class', 'subtitle')
  //   .attr('text-anchor', 'left')
  //   .attr('x', -30)
  //   .attr('y', -30)
  //   .text(
  //     'Potter: his best friends, family, his teachers. From these characters, who talks the most? '
  //   )
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', 'translate(' + 200 + ', 0 + )')
    .call(yAxis)
    .attr('font-family', 'Averia Libre')
    .attr('font-weight', '800')
    .attr('font-size', '16')
    .attr('color', '#CBD2E2')
  function makeYgridlines() {
    return d3.axisLeft(yPositionScale)
  }
  svg
    .append('g')
    .attr('class', 'grid')
    .style('stroke-dasharray', 0.3)
    .style('opacity', 0.2)
    .call(
      makeYgridlines()
        .tickSize(-width)
        .ticks(0)
        .tickFormat('')
    )
    .lower()
  svg.selectAll('.x-axis path').remove()
  svg.selectAll('.y-axis path').remove()
  // svg
  //   .append('g')
  //   .attr('class', 'whiteAxis')
  //   .call(yAxis)
}
