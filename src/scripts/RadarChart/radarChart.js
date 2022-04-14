// Tiré de : https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
// BESOIN DE LE SPECIFIER ?? 

const CATEGORIES = ["Pièces réalisés(x1000)", "Machines", "Taille des commandes(x10)", "Procédés", "Matériaux"];
const radialScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 250]);


/**
* Appends svg graph to the dom.
* @param {number} width The width of the graph
* @param {number} height The height of the graph
* @param {Object} margin The margin of the graph
* @return {Object} svg
*/
function appendToDom(width, height) {

    let svg = d3.select("#radar_chart").append("svg")
        .attr("width", width)
        .attr("height", height)
    return svg;

    // .append("g")
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function drawCircles(svg) {


    let ticks = [2, 4, 6, 8, 10];
    ticks.forEach(t =>
        svg.append("circle")
            .attr("cx", 300)
            .attr("cy", 300)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", radialScale(t))
    );
    ticks.forEach(t =>
        svg.append("text")
            .attr("x", 305)
            .attr("y", 300 - radialScale(t))
            .text(t.toString())
    );

    for (let i = 0; i < CATEGORIES.length; i++) {
        let category_name = CATEGORIES[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / CATEGORIES.length);
        let line_coordinate = angleToCoordinate(angle, 10);

        let value = i == 1 ? 12 : i == 2 ? 13 : 10.5
        let label_coordinate = angleToCoordinate(angle, value);


        svg.append("line")
            .attr("x1", 300)
            .attr("y1", 300)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke", "black");

        svg.append("text")
            .attr("x", label_coordinate.x)
            .attr("y", label_coordinate.y)
            .attr("font-weight", 700)
            .text(category_name);
    }

}

function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return { "x": 300 + x, "y": 300 - y };
}

function getPathCoordinates(data) {
    let coordinates = [];
    for (var i = 0; i < data.length; i++) {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / data.length);
        coordinates.push(angleToCoordinate(angle, data[i]));
    }
    return coordinates;
}

function drawDataShape(formattedData, svg) {


    formattedData[0] /= 1000; // TEST
    formattedData[2] /= 10;
    console.log(formattedData)

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
    let color = "darkorange";


    let coordinates = getPathCoordinates(formattedData);
    console.log(coordinates);

    svg.append("path")
        .datum(coordinates)
        .attr("d", line)
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);

    svg.append("circle")
        .datum(coordinates)
        .attr("d", line)
        .attr("stroke-width", 3)
        .attr("stroke", color)









}



/**
 * @param {Object[]} the data to be used
 */
export function drawGraph(data) {
    console.log(data);
    const formattedData = getFormattedData(data);
    const [width, height, margin] = [600, 600, 0]//graphDimensions()
    const svg = appendToDom(width, height, margin)
    drawCircles(svg);
    drawDataShape(formattedData, svg);

    return svg;
    // return [svg, x, y, data, width, height]
}

// ["Pièces réalisés", "Machines", "Procédés", "Taille des commandes", "Matériaux"];
function getFormattedData(data) {

    const createdPartsNB = getCreatedPartsNB(data);
    const [buildProcessNB, machineNB, materialsNB, avgOrdersSize] = getProcessMachineMaterialSizeNB(data);

    return [createdPartsNB, machineNB, avgOrdersSize, buildProcessNB, materialsNB]
}


// return the number of diferent created parts ( two parts with the same geometry ID are the same part)
function getCreatedPartsNB(data) { //
    let geometriesCounted = [];
    for (let i = 0; i < data.Parts.length; i++) {
        if (!geometriesCounted.includes(data.Parts[i].GeometryId)) {
            geometriesCounted.push(data.Parts[i].GeometryId)
        }
    }
    return geometriesCounted.length;
}


function getProcessMachineMaterialSizeNB(data) {
    let processesCounted = [];
    let machinesCounted = [];
    let materialsCounted = [];
    let allOrdersSize = [];
    for (let i = 0; i < data.Orders.length; i++) {
        let currentOrder = data.Orders[i];
        let orderSize = 0;
        for (let j = 0; j < currentOrder.Builds.length; j++) {
            let currentBuild = currentOrder.Builds[j];
            if (!processesCounted.includes(currentBuild.BuildProcess)) {
                processesCounted.push(currentBuild.BuildProcess)
            }

            if (!machinesCounted.includes(currentBuild.Machine)) {
                machinesCounted.push(currentBuild.Machine)
            }

            if (!materialsCounted.includes(currentBuild.Material)) {
                materialsCounted.push(currentBuild.Material)
            }

            currentBuild.BuiltParts.forEach(part => {
                orderSize += part.Quantity;
            })
        }
        allOrdersSize.push(orderSize);
    }

    let sum = 0;
    allOrdersSize.forEach(nb => sum += nb)

    let avgOrdersSize = sum / allOrdersSize.length;

    return [processesCounted.length, machinesCounted.length, materialsCounted.length, avgOrdersSize];
}