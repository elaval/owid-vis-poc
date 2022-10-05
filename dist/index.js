import { OWIDTrendChart } from "./OWIDTrendChart/OWIDTrendChart";
import { OWIDBarChart } from "./OWIDBarChart/OWIDBarChart";
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
export function trendChart(data, options) {
    return new OWIDTrendChart(data, options);
}
export function barChart(data, options) {
    return new OWIDBarChart(data, options);
}
