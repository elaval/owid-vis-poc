import { OWIDTrendChart } from "./OWIDTrendChart/OWIDTrendChart";
import { OWIDBarChart } from "./OWIDBarChart/OWIDBarChart";
import { OWIDMap } from "./OWIDMap/OWIDMap";
export function trendChart(data, options) {
    return new OWIDTrendChart(data, options);
}
export function barChart(data, options) {
    return new OWIDBarChart(data, options);
}
export function map(data, options) {
    return new OWIDMap(data, options);
}
