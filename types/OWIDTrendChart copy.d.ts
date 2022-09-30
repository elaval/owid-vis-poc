import * as d3 from 'd3';
export declare class OWIDTrendChart {
    data: [];
    container: d3.Selection<any, any, any, any>;
    height: number;
    width: number;
    marginTop: number;
    marginBottom: number;
    y: {
        grid: any;
    };
    x: {
        grid: any;
    };
    chartType: String;
    unit: String;
    className: string;
    filter: any;
    filteredData: [];
    valuesRange: [any, any];
    dimensions: {
        years: any;
        entities: any;
    };
    scaleX: d3.ScaleLinear<number, number, never>;
    scaleY: d3.ScaleLinear<number, number, never>;
    scaleColor: d3.ScaleOrdinal<string, string, never>;
    axisX: d3.Axis<any>;
    axisY: d3.Axis<any>;
    marginLeft: any;
    marginRight: any;
    seriesData: any;
    chartContainer: d3.Selection<any, undefined, null, undefined>;
    chartSVG: any;
    toolTip: any;
    colorScale: any;
    chartContent: any;
    markEL: any;
    ariaLabel: any;
    ariaDescription: any;
    constructor(data: any, options: any);
    setupSVGElements(): d3.Selection<SVGSVGElement, undefined, null, undefined>;
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
