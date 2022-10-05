import * as d3 from 'd3';
import { OWIDChart } from '../OWIDChart/OWIDChart';
/** Creates a Trend Chart (Line Chart with values by year with series for each entity) */
export declare class OWIDBarChart extends OWIDChart {
    protected _scaleX: d3.ScaleLinear<number, number, never>;
    protected _scaleY: d3.ScaleBand<any>;
    protected _axisX: d3.Axis<d3.NumberValue>;
    protected _axisY: d3.Axis<d3.NumberValue>;
    protected _year: number;
    protected _latestYear: any;
    protected _entities: any[];
    protected _singleYearData: any;
    protected _maxValue: any;
    /**
     * Creates a TrendChart for OWID data.
     *
     * @remarks
     * Requires data records with {entityName:string, year:number, value:number}.
     *
     * @param data - Array with pata points
     * @param options - Options for chart configuration (e.g. {"unit": "people"})
     */
    constructor(data: any, options: any);
    /**
     * Configures properties that are reuqired prior to rendering the visualization
     * @returns void
     */
    protected startupSettings(): void;
    render(): void;
    /**
     * Gets / sets the year that is a target for our data
     * @param year
     * @returns
     */
    year(year: number): OWIDBarChart | number;
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
