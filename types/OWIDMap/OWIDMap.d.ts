import { OWIDChart } from '../OWIDChart/OWIDChart';
export declare class OWIDMap extends OWIDChart {
    protected _year: number;
    protected _latestYear: any;
    protected _entities: any[];
    protected _singleYearData: any;
    protected _maxValue: any;
    private _dictValues;
    private _scaleValues;
    constructor(data: any, options: any);
    protected startupSettings(): void;
    render(): void;
    /**
   * Gets / sets the year that is a target for our data
   * @param year
   * @returns
   */
    year(year: number): OWIDMap | number;
    highlightCountry(countryName: any): void;
    unHighlightCountry(countryName: any): void;
    handleMouseEnter(e: any, d: any, el: any): void;
    handleMouseMove(e: any, d: any, el: any): void;
    handleMouseLeave(e: any, d: any, el: any): void;
    getDimensionValues(dimension: string): any;
    getTextWidth(text: any, fontSize: string | number, fontFace: string): number;
    node(): any;
}
