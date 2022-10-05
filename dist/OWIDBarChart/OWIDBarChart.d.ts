import * as d3 from 'd3';
import { OWIDBaseChart } from '../OWIDBaseChart';
export declare class OWIDBarChart extends OWIDBaseChart {
    protected _scaleX: d3.ScaleLinear<number, number, never>;
    protected _scaleY: d3.ScaleBand<any>;
    protected _axisX: d3.Axis<d3.NumberValue>;
    protected _axisY: d3.Axis<d3.NumberValue>;
    protected _year: number;
    protected _latestYear: any;
    protected _entities: any[];
    protected _singleYearData: any;
    protected _maxValue: any;
    constructor(data: any, options: any);
    private startupSettings;
    render(): any;
    year(year: number): this;
    handleMouseMove(e: any): void;
    handleMouseLeave(): void;
    getDimensionValues(dimension: string): any;
    private calculateMarginLeft;
    private calculateMarginRight;
    protected getTextWidth(text: any, fontSize: string | number, fontFace: string): number;
    showGridX(): void;
    showGridY(): void;
    private getClosestYear;
    node(): any;
}
