import { OWIDTrendChart } from "./OWIDTrendChart/OWIDTrendChart";
import { OWIDBarChart } from "./OWIDBarChart/OWIDBarChart"
import { OWIDChart } from "./OWIDChart/OWIDChart";

export function OWIDPlot(data: any, options: { type: any; }): any {
    const type = options && options.type || "trendChart"

    if (type == "trendChart") {
        let chart = new OWIDTrendChart(data, options);
        return chart.render();
    } else if (type == "barChart") {
        let chart = new OWIDBarChart(data, options);
        return chart.render();
    } else {
        return null;
    }

}

export function trendChart(data: any, options: { type: any; }): any {
    return new OWIDTrendChart(data, options)
}

export function barChart(data: any, options: { type: any; }): any {
    return new OWIDBarChart(data, options)
}


