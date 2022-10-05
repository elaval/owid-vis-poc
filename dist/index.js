import { OWIDTrendChart } from "./OWIDTrendChart/OWIDTrendChart";
import { OWIDBarChart } from "./OWIDBarChart/OWIDBarChart";
export function trendChart(data, options) {
    return new OWIDTrendChart(data, options);
}
export function barChart(data, options) {
    return new OWIDBarChart(data, options);
}
