import { OWIDTrendChart } from "./OWIDTrendChart/OWIDTrendChart";
import { OWIDBarChart } from "./OWIDBarChart/OWIDBarChart"

export function trendChart(data: any, options: { type: any; }): any {
    return new OWIDTrendChart(data, options)
}

export function barChart(data: any, options: { type: any; }): any {
    return new OWIDBarChart(data, options)
}


