import * as d3 from 'd3';
import { OWIDChart } from '../OWIDChart/OWIDChart';
export declare class OWIDTrendChart extends OWIDChart {
    protected _scaleX: d3.ScaleLinear<number, number, never>;
    protected _scaleY: d3.ScaleLinear<number, number, never>;
    protected _axisX: d3.Axis<d3.NumberValue>;
    protected _axisY: d3.Axis<d3.NumberValue>;
    protected _seriesData: {
        name: string;
        data: any;
    }[];
    protected _selectedYearCallback: any;
    private _years;
    private _values;
    private _maxYear;
    private _visibleValues;
    constructor(data: any, options: any);
    protected startupSettings(): void;
    render(): void;
    handleMouseMove(e: any): void;
    handleMouseLeave(): void;
    getDimensionValues(dimension: string): any;
    calculateMarginLeft(): number;
    calculateMarginRight(): number;
    getTextWidth(text: any, fontSize: string | number, fontFace: string): number;
    showGridX(): void;
    showGridY(): void;
    getClosestYear(posX: number): number;
    node(): any;
    css(): string;
}
