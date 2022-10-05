import * as d3 from 'd3';
export declare class OWIDBaseChart {
    protected _data: [];
    protected _height: number;
    protected _width: number;
    protected _marginTop: number;
    protected _marginBottom: number;
    protected _marginLeft: number;
    protected _marginRight: number;
    protected _heightTotal: number;
    protected _widthTotal: number;
    protected _unit: String;
    protected _className: string;
    protected _valuesRange: [any, any];
    protected _dimensions: {
        years: any;
        entities: any;
    };
    protected _scaleColor: d3.ScaleOrdinal<string, string, never>;
    protected _chartContainer: d3.Selection<any, undefined, null, undefined>;
    protected _chartSVG: any;
    protected _toolTip: any;
    protected _colorScale: any;
    protected _chartContent: any;
    protected _x: any;
    protected _y: any;
    constructor(data: any, options: any);
    setupSVGElements(svg: d3.Selection<any, any, any, any>): any;
    /**
     * updateSizeAndMargins
     * Updated charts internat height / width dimensons based on current margins
     */
    updateSizeAndMargins(): void;
    handleMouseMove(e: any): void;
    handleMouseLeave(): void;
    protected getDimensionValues(dimension: string): any;
    protected getTextWidth(text: any, fontSize: string | number, fontFace: string): number;
    render(): any;
    css(): string;
}
