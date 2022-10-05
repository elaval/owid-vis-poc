export declare class OWIDTrendChartLines {
    unit: any;
    entities: any;
    data: any;
    dotSizeStandard: number;
    dotSizeHighlighted: number;
    scaleColor: any;
    years: any;
    values: any;
    maxYear: any;
    visibleValues: any;
    seriesData: any;
    scales: any;
    chartContainer: any;
    constructor(data: [], options: any);
    getScaleColor(): any;
    renderMarker(pos: any[]): void;
    showMarker(year: any): void;
    hideMarker(): void;
    selectedYear(pos: any[]): any;
    render(scales: {
        x: {
            (arg0: any): number;
            (arg0: any): number;
            domain: any;
        };
        y: {
            (arg0: any): number;
            (arg0: any): number;
            domain: any;
        };
    }, context: any): any;
}
