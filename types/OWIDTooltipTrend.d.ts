import * as d3 from "d3";
export declare class OWIDTooltipTrend {
    colorScale: any;
    tooltipContainer: d3.Selection<any, undefined, null, undefined>;
    toolTip: any;
    constructor(options: any);
    render(): d3.Selection<any, undefined, null, undefined>;
    show(pos: any[], options: {
        year: any;
        data: any;
    }): void;
    hide(): void;
}
