import * as d3 from "d3";
export declare class OWIDBarChartTooltip {
    colorScale: any;
    tooltipContainer: d3.Selection<any, undefined, null, undefined>;
    toolTip: any;
    containerWidth: any;
    constructor(options: any);
    render(): d3.Selection<any, undefined, null, undefined>;
    show(pos: any[], options: {
        year: any;
        data: any;
    }): void;
    hide(): void;
}
