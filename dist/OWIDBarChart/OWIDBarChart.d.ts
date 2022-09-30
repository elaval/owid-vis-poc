import * as d3 from 'd3';
import { OWIDBaseChart } from '../OWIDBaseChart';
export declare class OWIDBarChart extends OWIDBaseChart {
    scaleX: d3.ScaleLinear<number, number, never>;
    scaleY: d3.ScaleBand<any>;
    axisX: d3.Axis<d3.NumberValue>;
    axisY: d3.Axis<d3.NumberValue>;
    year: number;
    latestYear: any;
    entities: any[];
    singleYearData: any;
    maxValue: any;
    constructor(data: any, options: any);
    setupBarsSVGElements(): void;
    handleMouseMove(e: any): void;
    handleMouseLeave(): void;
    getDimensionValues(dimension: string): any;
    calculateMarginLeft(): number;
    calculateMarginRight(): number;
    getTextWidth(text: any, fontSize: string | number, fontFace: string): number;
    showGridX(): void;
    showGridY(): void;
    getClosestYear(posX: number): number;
    render(): any;
    css(): string;
}
