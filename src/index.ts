import { OWIDTrendChart } from "./OWIDTrendChart/OWIDTrendChart";
import { OWIDBarChart } from "./OWIDBarChart/OWIDBarChart"
import { OWIDMap } from "./OWIDMap/OWIDMap";

export function trendChart(data: any, options: { type: any; }): any {
    return new OWIDTrendChart(data, options)
}

export function barChart(data: any, options: { type: any; }): any {
    return new OWIDBarChart(data, options)
}

export function map(data: any, options: { type: any; }): any {
    return new OWIDMap(data, options)
}



