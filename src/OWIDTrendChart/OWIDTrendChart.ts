import * as d3 from 'd3';
import * as _ from 'lodash';
import { OWIDChart } from '../OWIDChart/OWIDChart';

import { OWIDTrendChartTooltip } from "./OWIDTrendChartTooltip";
import { config } from './OWIDTrendChartConfig';

export class OWIDTrendChart extends OWIDChart {
  protected _scaleX: d3.ScaleLinear<number, number, never> = d3.scaleLinear();
  protected _scaleY: d3.ScaleLinear<number, number, never> = d3.scaleLinear();
  protected _axisX: d3.Axis<d3.NumberValue> = d3.axisBottom(this._scaleX);
  protected _axisY: d3.Axis<d3.NumberValue> = d3.axisLeft(this._scaleY);
  protected _seriesData: { name: string; data: any; }[] = [];
  protected _selectedYearCallback: any;
  private _years: number[] = [];
  private _values: any[] = [];
  private _maxYear: number | undefined;
  private _visibleValues: number[] = [];

  constructor(data: any, options: any) {
    super(data, options);

    this._dimensions = {
      years: (options && options.years) || this.getDimensionValues("year"),
      entities:
        (options && options.enitites) || this.getDimensionValues("entityName")
    };

    this._marginLeft = options && options.marginLeft;
    this._marginRight = options && options._marginRight;

    this._marginLeft =
      (options && options.marginLeft) || this.calculateMarginLeft();
    this._marginRight =
      (options && options.marginRight) || this.calculateMarginRight();

    this._selectedYearCallback = options && options.selectedYearCallback || function () { };

    this._toolTip = new OWIDTrendChartTooltip({ colorScale: this._colorScale, containerWidth: this._width });

    this._chartContainer.node().appendChild(this._toolTip.render().node());

    this.startupSettings();
    this.render();

  }

  protected startupSettings() {
    super.baseStartupSettings();

    this._marginBottom = config.marginBottom;
    this._height = this._heightTotal - this._marginTop - this._marginBottom;

    this._valuesRange = d3.extent(this._data, (d: any) => d.value);

    this._scaleX = d3.scaleLinear().range([0, this._width]);
    this._scaleY = d3
      .scaleLinear()
      .range([this._height, 0])
      .domain(this._valuesRange);

    this._axisX = d3.axisBottom(this._scaleX).ticks(10, "d");
    this._axisY = d3
      .axisLeft(this._scaleY)
      .ticks(10)
      .tickFormat((d) => `${d} ${this._unit}`);

    // Update left/right margin depending on the length on entitynames & values
    this._marginLeft = this.calculateMarginLeft() > this._marginLeft
      ? this.calculateMarginLeft()
      : this._marginLeft;

    this._marginRight = this.calculateMarginRight() > this._marginRight
      ? this.calculateMarginRight()
      : this._marginRight;

    // Adjust width according to new margins
    this._width = this._widthTotal - this._marginLeft - this._marginRight;

    this._width = this._widthTotal - this._marginLeft - this._marginRight;
    super.baseStartupSettings();

    this._scaleX.range([0, this._width]);
    this._scaleY.range([this._height, 0]);

    this._seriesData = _.chain(this._data)
      .groupBy((d: any) => d.entityName)
      .map((items: any, entityName: string) => ({ name: entityName, data: items }))
      .value();


    if (this._y && this._y.grid) {
      this.showGridY();
    }

    if (this._x && this._x.grid) {
      this.showGridX();
    }

    this._years = _.chain(this._data)
      .map((d: { year: number }) => d.year)
      .uniq()
      .value();

    this._values = _.chain(this._data)
      .map((d: any) => d.value)
      .uniq()
      .value();

    this._maxYear = _.max(this._years);

    this._visibleValues = _.range(
      Math.floor(_.min(this._values) as number),
      Math.ceil(_.max(this._values) as number)
    ).filter((d) => d % 5 == 0);

    this._seriesData = _.chain(this._data)
      .groupBy((d: any) => d.entityName)
      .map((items: any, entityName: any) => ({ name: entityName, data: items }))
      .value();

  }


  render() {

    // Main <g> container where we display the visual elements
    const mainContainer = this._chartContainer.select("svg").select("g.container")

    // Capture mouse events on background rect
    mainContainer
      .select("rect.backgroundLayer")
      .on("mousemove", (e) => this.handleMouseMove(e))
      .on("mouseleave", () => this.handleMouseLeave());

    const rangeYears: [number, number] = <[number, number]>d3.extent(this._years);
    const rangeValues: [number, number] = <[number, number]>d3.extent(this._values);

    this._scaleX.domain(rangeYears);
    this._scaleY.domain(rangeValues);

    mainContainer.select("g.axis.x").call(this._axisX as any);
    mainContainer.select("g.axis.y").call(this._axisY as any);

    const chartContainer = mainContainer.selectAll("g.lineChartContainer")
      .data([null])
      .join("g")
      .attr("class", "lineChartContainer")


    const line = d3
      .line()
      .x((d: any) => this._scaleX(d.year))
      .y((d: any) => this._scaleY(d.value));

    const series = chartContainer
      .selectAll("g.serie")
      .data(this._seriesData, (d: any) => <string>d.name)
      .join("g")
      .attr("class", (d: { name: any; }) => `serie ${d.name}`);

    const lines = series
      .selectAll("path")
      .data((d: { data: any; }) => [d.data])
      .join("path")
      .attr("d", (d: [number, number][] | Iterable<[number, number]>) => line(d))
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", (d: { entityName: any; }[]) => this._scaleColor(d[0].entityName));

    const dots = series
      .selectAll("circle.dot")
      .data((d: { data: any; }) => d.data)
      .join("circle")
      .attr("class", "dot")
      .attr("fill", (d: any) => this._scaleColor(d.entityName))
      .attr("cx", (d: any) => this._scaleX(d.year))
      .attr("cy", (d: any) => this._scaleY(d.value))
      .attr("r", 2);

    const legendMark = series
      .selectAll("g.legendMark")
      .data((d: { data: _.List<unknown> | null | undefined; }) => [_.last(d.data)])
      .join("g")
      .attr("class", "legendMark")
      .attr(
        "transform",
        (d: any) => `translate(${this._scaleX(<number>this._maxYear)},${this._scaleY(d.value)})`
      );

    legendMark
      .selectAll("text")
      .data((d: any) => [d])
      .join("text")
      .attr("dx", 10)
      .attr("text-anchor", "start")
      .attr("font-size", 12)
      .attr("font-weight", 400)
      .attr("fill", (d: { entityName: any; }) => this._scaleColor(d.entityName))
      .text((d: { entityName: any; }) => d.entityName);

  }

  handleMouseMove(e: any): void {
    const pos_relTarget = d3.pointer(e);
    const pos_relContainer = d3.pointer(e, this._chartContainer);

    const selectedYear = this.getClosestYear(pos_relTarget[0]);
    this._chartContent && this._chartContent.showMarker(selectedYear);

    const tooltipData = _.chain(this._seriesData)
      .map((d: { data: any[]; name: any; }) => {
        const yearRecord = d.data.find((d: { year: any; }) => d.year == selectedYear);
        return {
          entityName: d.name,
          value: (yearRecord && yearRecord.value) || "NA"
        };
      })
      .sortBy((d: any) => -d.value)
      .value();

    this._toolTip.show([pos_relContainer[0], this._height * 0.25], {
      year: selectedYear,
      data: tooltipData
    });

    this._selectedYearCallback(selectedYear);
  }

  handleMouseLeave(): void {
    this._chartContent && this._chartContent.hideMarker();
    this._toolTip.hide();
  }


  getDimensionValues(dimension: string): any {
    return _.chain(this._data)
      .map((d: { [x: string]: any; }) => d[dimension])
      .uniq()
      .value();
  }
  calculateMarginLeft(): number {
    const axisScale: any = this._axisY.scale();
    const values = axisScale.ticks();

    const tickContent = values.map((d: any) => `${d} ${this._unit}`);
    const tickSizes = tickContent.map((d: any) =>
      this.getTextWidth(d, 16.2, "sans-serif")
    );
    const maxSize = _.max(tickSizes) as number;
    return maxSize * 1.5 || 10;
  }
  calculateMarginRight(): number {
    const entityNames = this._dimensions.entities;

    const legendContent = entityNames.map((d: any) => `${d}`);
    const legendSized = legendContent.map((d: any) =>
      this.getTextWidth(d, 16.2, "sans-serif")
    );
    const maxSize: number = _.max(legendSized) as number;
    return maxSize * 1.5 || 10;
  }

  getTextWidth(text: any, fontSize: string | number, fontFace: string): number {
    const canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");

    let textWidth = null;

    if (context) {
      context.font = fontSize + "px " + fontFace;
      textWidth = context.measureText(text).width
    }


    return textWidth as number;

  }
  showGridX() {
    const axisScale: any = this._axisX.scale()
    const gridValues = axisScale.ticks();
    this._chartSVG
      .select("g.container")
      .append("g")
      .attr("class", "grid x")
      .selectAll("line")
      .data(gridValues)
      .join("line")
      .attr("class", "grid x")
      .attr("x1", (d: d3.NumberValue) => this._scaleX(d))
      .attr("x2", (d: d3.NumberValue) => this._scaleX(d))
      .attr("y1", 0)
      .attr("y2", this._height)
      .attr("stroke-dasharray", "3,2")
      .attr("stroke-width", 1)
      .attr("stroke", "lightgrey");
  }

  showGridY() {
    const axisScale: any = this._axisY.scale();
    const gridValues = axisScale.ticks();

    this._chartSVG
      .select("g.container")
      .append("g")
      .attr("class", "grid y")
      .selectAll("line")
      .data(gridValues)
      .join("line")
      .attr("class", "grid y")
      .attr("x1", 0)
      .attr("x2", this._width)
      .attr("y1", (d: d3.NumberValue) => this._scaleY(d))
      .attr("y2", (d: d3.NumberValue) => this._scaleY(d))
      .attr("stroke-dasharray", "3,2")
      .attr("stroke-width", 1)
      .attr("stroke", "lightgrey");
  }

  getClosestYear(posX: number): number {
    const closestYear = this._dimensions.years.find(
      (d: number) => d == Math.round(this._scaleX.invert(posX))
    );

    return closestYear;
  }


  node() {
    return this._chartContainer.node();
  }


  css(): string {

    const inlineCss = `

        .chartContainer {
          display: block;
          background: white;
          height: auto;
          height: intrinsic;
          max-width: 100%;
        }

        .${this._className} {
            display: block;
            background: white;
            height: auto;
            height: intrinsic;
            max-width: 100%;
        }
        .${this._className} text,
        .${this._className} tspan {
            white-space: pre;
        }
        .${this._className} .axis text {
            white-space: pre;    font-size: 16.2px;
            fill: rgb(102, 102, 102);        
        }

        .${this._className} .axis path {
            display: none
        }
        .${this._className} .axis.y line {
            display: none
        }

        .GrapherComponent {
            display: inline-block;
            border-bottom: none;
            border-radius: 2px;
            text-align: left;

            line-height: 1em;

            background: white;
            color: #333;

            position: relative;

            /* Hidden overflow x so that tooltips don't cause scrollbars 
            overflow: hidden;

            border-radius: 2px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px 0px,
                rgba(0, 0, 0, 0.25) 0px 2px 2px 0px;
            z-index: $zindex-chart;

            * {
                box-sizing: border-box;
            }

            button {
                background: none;
                border: none;
            }

            .btn {
                font-size: 0.8em;
                white-space: normal;
            }

            .flash {
                margin: 10px;
            }

            .clickable {
                cursor: pointer;

                a {
                    text-decoration: none;
                    &:visited {
                        color: initial;
                    }
                }
            }
            input[type="checkbox"] {
                cursor: pointer;
            }

            /* Make World line slightly thicker 
            svg .key-World_0 polyline {
                stroke-width: 2 !important;
            }

            .projection .nv-line {
                stroke-dasharray: 3, 3;
            }

            .projection .nv-point {
                fill: #fff;
                stroke-width: 1;
                opacity: 0.5;
            }

            .projection .nv-point.hover {
                stroke-width: 4;
            }

            a {
                cursor: pointer;
                color: #0645ad;
                fill: #0645ad;
                border-bottom: none;
            }

            h2 {
                font-size: 2em;
                margin-top: 0;
                margin-bottom: 0.8em;
                font-weight: 500;
                line-height: 1.1;
            }

            .unstroked {
                display: none;
            }

            .DownloadTab,
            .tableTab,
            .sourcesTab {
                z-index: $zindex-tab;
            }
        }


        `;
    return inlineCss;
  }



}

