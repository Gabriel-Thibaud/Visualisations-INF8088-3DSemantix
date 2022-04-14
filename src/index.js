
// import * as legend from './scripts/legend.js'
// import * as tooltip from './scripts/tooltip.js'

// import d3Tip from 'd3-tip'
import * as preprocess from './scripts/preprocess.js'
import * as viz from './scripts/LineChart/viz.js'
import * as tooltips from './scripts/LineChart/tooltip'
import * as radar from './scripts/RadarChart/radarChart'

/**
 * @file This file is the entry-point for the the code for final project(with 3DSemantix) for the course INF8808.
 * @author Equipe 18 (Omar, Aymen, Skander, Gabriel)
 * @version v1.0.0
 */

(async function () {
    const data = await preprocess.getOccurrenceOrder()
    const [svg, x, y, d, width, height] = viz.drawGraph(data)
    tooltips.wrapperTooltip(svg, x, y, d, width, height)

    const rawData = await preprocess.getData();
    radar.drawGraph(rawData);

})(d3)
