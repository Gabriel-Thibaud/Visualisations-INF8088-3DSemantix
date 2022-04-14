/**
 * Sets the domain and range of the X scale.
 * @param {object[]} data The data to be used
 * @param {number} width The width of the graph
 */
function XScale (data, width) {
    return d3.scaleLinear().domain([0,120]).range([0,width]); 
}
  
/**
* Sets the domain and range of the Y scale.
* @param {object[]} data The data to be used
* @param {number} height The height of the graph
*/
function YScale (data, height) {
    return d3.scaleLinear().domain(d3.extent(data, d => d[1])).range([height,0]);            
}

/**
* Sets the name for the Y label.
* @param {number} width The width of the graph
* @param {number} height The height of the graph
* @param {Object} margin The margin of the graph
* @param {Object} svg
*/
function labelYName (margin, height, svg) {
    svg.append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style('font-weight', "bold")
        .attr("transform", "translate("+ (margin.left - 100 ) +","+(height/2)+")rotate(-90)")  
        .text("Taille d'une commande");
}

/**
* Sets the name for the X label.
* @param {number} width The width of the graph
* @param {number} height The height of the graph
* @param {Object} margin The margin of the graph
* @param {Object} svg
*/
function labelXName (width, margin, height, svg) {
    svg.append("text")
        .style("font-size", "14px")
        .style('font-weight', "bold")
        .attr("text-anchor", "middle") 
        .attr("transform", "translate("+ (width/2) +","+(height-(margin.bottom -74))+")")
        .text("Quantité d'une commande");
}

/**
* Sets the name of the graph.
* @param {number} width The width of the graph
* @param {number} height The height of the graph
* @param {Object} margin The margin of the graph
* @param {Object} svg
*/
function graphTitle(width, margin, svg) {
    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 5 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style('font-weight', "bold")
    .style("font-size", "16px") 
    .text("Nombre de pièces en fonction de la taille de la commande");
}

/**
* Appends svg graph to the dom.
* @param {number} width The width of the graph
* @param {number} height The height of the graph
* @param {Object} margin The margin of the graph
* @return {Object} svg
*/
function appendToDom(width, height, margin) {
    return d3.select("#curved_line").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

/**
 * Draws the x axis at the bottom.
 * @param {*} xScale The scale to use for the x axis
 * @param {number} height The height of the graph
 * @param {Object} svg
 */
function drawXAxis(svg, xScale,height) {
    svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).scale(xScale).ticks(10));
}

/**
 * Draws the y axis.
 * @param {Object} svg
 * @param {*} yScale The scale to use for the y axis
 */
export function drawYAxis (svg, yScale) {
    svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yScale).scale(yScale).ticks(10));
}

/**
 * set the dimensions and margins of the graph
 * @return {Object[]} the dimensions and margins of the graph
 */
function graphDimensions() {
    const margin = {top: 40, right: 60, bottom: 40, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    return [width, height, margin];
}
/**
* plot dots on the graph
* @param {Object} svg
* @param {object[]} data The data to be used 
* @param {*} xScale
* @param {*} yScale
 */
function plotCircles(svg, data, x, y) {
    svg.selectAll("myCircles")
    .data(data)
    .enter()
    .append("circle")
      .attr("fill", "black")
      .attr("stroke", "none")
      .attr("cx", function(d) { return x(d[0]) })
      .attr("cy", function(d) { return y(d[1]) })
      .attr("r", 2)
}

/**
* plot the graph
* @param {Object} svg
* @param {object[]} data The data to be used 
* @param {*} xScale
* @param {*} yScale
 */
function drawCurveLine(svg, data, x, y) {
    svg.append("path")
        .datum(data)
        .attr("class", "line")
            .attr("fill", "#fff")
        .attr("stroke", "#f2a808")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
    .curve(d3.curveBasis)
      .x(function(d) { return x(d[0]) })
      .y(function(d) { return y(d[1]) }))
}

/**
 * @param {Object[]} the data to be used
 */
export function drawGraph(data) {
    const [width, height, margin] = graphDimensions()
    const svg = appendToDom(width, height, margin) 
    const x = XScale(data, width)
    const y = YScale(data, height)    
    drawCurveLine(svg, data, x, y)
    drawXAxis(svg, x, height)
    drawYAxis(svg, y)
    labelXName(width, margin, height, svg)
    labelYName(margin, height, svg)
    graphTitle(width, margin, svg)
    plotCircles(svg, data, x, y)
    return [svg, x,y, data, width, height]
}
        
  
  