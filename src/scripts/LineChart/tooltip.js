/**
 * @param {*} svg
 * @return {*} 
 */
function tooltip(svg) {
    return  svg
    .append("g")
    .attr("class", "focus")
    .style("display", "none");
}

/**
 * circle will display when hovering.
 * @param {*} tooltip
 */
function createCircles(tooltip) {
    tooltip.append("circle")
    .attr("r", 5);
}

/**
 * create the box that will be contain all the information
 */
function container(tooltip) { 
    tooltip.append("rect")
    .attr("class", "tooltip")
    .attr("width", 200)
    .attr("height", 50)
    .attr("x", 10)
    .attr("y", -22)
    .attr("rx", 4)
    .attr("ry", 4);
}

/**
 * adding the information inside the box.
 * @param {*} tooltip
 */
function setContent(tooltip) {
    tooltip.append("text")
    .attr("class", "tooltip-quantity")
    .attr("x", 176)
    .attr("y", 2)

    tooltip.append("text")
    .attr("x", 18)
    .attr("y", 18)
    .text("Taille d'une commande :")

    tooltip.append("text")
    .attr("x", 18)
    .attr("y", 2)
    .text("Quantité d'une commande :");


    tooltip.append("text")
    .attr("class", "tooltip-numberOrder")
    .attr("x", 160)
    .attr("y", 18)
    .text("Taille d'une commande : ")
}

/**
 * displaying circle & the container while hovering
 * @param {*} tooltip
 * @param {*}  svg
 * @param {*} x
 * @param {*} y 
 * @param {Object[]} data,
 * @param {Number}  width,
 * @param {Number}  height
 */
function eventHandler(svg, tooltip, x,y, data, width, height) {
    svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", mousemove);
    const bisect  = d3.bisector(function(d) { return d[0]; }).left

    
    function mousemove() {
        const x0 = x.invert(d3.mouse(this)[0])
        const i = bisect(data, x0, 1)
        let d = data[i - 1]
        tooltip.attr("transform", "translate(" + x(parseInt(d[0])) + "," + y(d[1]) + ")");
        tooltip.select(".tooltip-quantity").text((d[0]));
        tooltip.select(".tooltip-numberOrder").text((d[1]));
    }
}


/**
 * wrapper function
 * @param {*} tooltip
 * @param {*}  svg
 * @param {*} x
 * @param {*} y 
 * @param {Object[]} data,
 * @param {Number}  width,
 * @param {Number}  height
 */
export function wrapperTooltip(svg, x,y, data, width, height) {
    const tool = tooltip(svg)
    createCircles(tool)
    container(tool)
    setContent(tool)
    eventHandler(svg, tool, x,y, data, width, height)
}      
      