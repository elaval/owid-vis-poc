import * as d3 from 'd3';
export declare class OWIDBaseChart {
    data: [];
    height: number;
    width: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    heightTotal: number;
    widthTotal: number;
    unit: String;
    className: string;
    valuesRange: [any, any];
    dimensions: {
        years: any;
        entities: any;
    };
    scaleColor: d3.ScaleOrdinal<string, string, never>;
    chartContainer: d3.Selection<any, undefined, null, undefined>;
    chartSVG: any;
    toolTip: any;
    colorScale: any;
    chartContent: any;
    x: any;
    y: any;
    constructor(data: any, options: any);
    setupSVGElements(svg: d3.Selection<any, any, any, any>): any;
    /**
     * updateDimensions
     * Updated charts internat height / width dimensons based on current margins
     */
    updateDimensions(): void;
    handleMouseMove(e: any): void;
    handleMouseLeave(): void;
    getDimensionValues(dimension: string): any;
    getTextWidth(text: any, fontSize: string | number, fontFace: string): number;
    render(): any;
    css(): string;
}
