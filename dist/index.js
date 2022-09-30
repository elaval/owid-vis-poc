import { OWIDTrendChart } from "./OWIDTrendChart/OWIDTrendChart";
import { OWIDBarChart } from "./OWIDBarChart/OWIDBarChart";
import { OWIDBaseChart } from "./OWIDBaseChart";
export function OWIDPlot(data, options) {
    const type = options && options.type || "trendChart";
    if (type == "trendChart") {
        let chart = new OWIDTrendChart(data, options);
        return chart.render();
    }
    else if (type == "barChart") {
        let chart = new OWIDBarChart(data, options);
        return chart.render();
    }
    else {
        return null;
    }
}
export function OWIDPlotBase(data, options) {
    const type = options && options.type || "trendChart";
    let chart = new OWIDBaseChart(data, options);
    return chart.render();
}
