import * as d3 from 'd3';
import * as _ from 'lodash';
import { OWIDBaseChart } from '../OWIDBaseChart';

import { OWIDBarChartBars }  from "./OWIDBarChartBars";
import { OWIDBarChartTooltip } from "./OWIDBarChartTooltip";
import { config } from './OWIDBarChartConfig';
import { inlineCSS } from "./OWIDBarChartCSS";


export class OWIDBarChart extends OWIDBaseChart {
  scaleX: d3.ScaleLinear<number, number, never>;
  scaleY: d3.ScaleBand<any>;
  axisX: d3.Axis<d3.NumberValue>;
  axisY: d3.Axis<d3.NumberValue>;
  year: number;
  latestYear: any;
  entities: any[];
  singleYearData: any;
  maxValue: any;

    constructor(data: any, options: any) {
      super(data, options);

      this.latestYear = _.chain(data).map(d => d.year).max().value();
      this.year = options && options.year || this.latestYear;

      this.singleYearData = this.data.filter((d:any): boolean => d.year == this.year);

      this.marginBottom = config.marginBottom;
      this.height = this.heightTotal-this.marginTop-this.marginBottom;

      this.valuesRange = d3.extent(this.data, (d:any) => d.value);




      this.entities = _.chain(this.singleYearData)
        .sortBy(d => d.value)
        .map(d => d.entityName)
        .uniq()
        .value();

      this.maxValue = _.chain(this.singleYearData)
      .map(d=> d.value)
      .max()
      .value();

      this.scaleX = d3.scaleLinear()
        .range([0, this.width])
        .domain([0,this.maxValue]);

      this.scaleY = d3
        .scaleBand()
        .padding(config.barsPadding)
        .range([this.height, 0])
        .domain(this.entities);

      this.axisX = d3.axisBottom(this.scaleX)
        .ticks(10)
        .tickFormat((d) => `${d} ${this.unit}`);
        
      this.axisY = d3
        .axisLeft(this.scaleY)


      // Update left/right margin depending on the length on entitynames & values
      this.marginLeft =
        (options && options.marginLeft) || this.calculateMarginLeft() * 1.5;
      
      this.marginRight =
        (options && options.marginRight) || this.calculateMarginRight() * 1.5;

      // Adjust width according to new margins
      this.width = this.widthTotal-this.marginLeft-this.marginRight;
      // Update dimensions of <svg> inner elements according to updated margins & witdh
      this.updateDimensions();    


      // Update scales ranges
      this.scaleX.range([0, this.width]);
      this.scaleY.range([this.height, 0]);

        
      this.toolTip = new OWIDBarChartTooltip({ colorScale: this.colorScale, containerWidth: this.width });
    
      this.chartContainer.node().appendChild(this.toolTip.render().node());
    
      if (this.y && this.y.grid) {
          this.showGridY();
      }
    
      if (this.x && this.x.grid) {
          this.showGridX();
      }

      this.setupBarsSVGElements()
    }

    setupBarsSVGElements() {

      const mainContainer = this.chartContainer.select("svg").select("g.container")
      
      mainContainer
          .select("rect.backgroundLayer")
          .on("mousemove", (e) => this.handleMouseMove(e))
          .on("mouseleave", () => this.handleMouseLeave());
    

    const chartBars:any = new OWIDBarChartBars(this.singleYearData, {
      unit: this.unit
    });

    const chartContainer = chartBars.render({
      x: this.scaleX,
      y: this.scaleY
    });

    chartContainer
    .append("style")
    .text(inlineCSS);
        
    
    mainContainer.select("g.axis.x").call(this.axisX as any);
    mainContainer.select("g.axis.y").call(this.axisY as any);
        
    const mainContainerNode:any = mainContainer.node();
    mainContainerNode && mainContainerNode.appendChild(chartContainer.node());
    
  }

  handleMouseMove(e: any): void {

  }

  handleMouseLeave(): void {

  }


    getDimensionValues(dimension: string): any {
        return _.chain(this.data)
        .map((d: { [x: string]: any; }) => d[dimension])
        .uniq()
        .value();
    }
    calculateMarginLeft():number {
        const axisScale:any = this.axisY.scale();
        const values = axisScale.domain();

        const tickContent = values.map((d: any) => `${d}`);
        const tickSizes = tickContent.map((d: any) =>
          this.getTextWidth(d, 16.2, "sans-serif")
        );
        const maxSize = _.max(tickSizes) as number;
        return maxSize || 10;
    }
    calculateMarginRight():number {
        const entityNames = this.dimensions.entities;

        const legendContent = entityNames.map((d: any) => `${d}`);
        const legendSized = legendContent.map((d: any) =>
          this.getTextWidth(d, 16.2, "sans-serif")
        );
        const maxSize:number = _.max(legendSized) as number;
        return maxSize || 10;
    }

    getTextWidth(text: any, fontSize: string | number, fontFace: string):number {
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
        const axisScale:any = this.axisX.scale()
        const gridValues = axisScale.ticks();
        this.chartSVG
          .select("g.container")
          .append("g")
          .attr("class", "grid x")
          .selectAll("line")
          .data(gridValues)
          .join("line")
          .attr("class", "grid x")
          .attr("x1", (d: d3.NumberValue) => this.scaleX(d))
          .attr("x2", (d: d3.NumberValue) => this.scaleX(d))
          .attr("y1", 0)
          .attr("y2", this.height)
          .attr("stroke-dasharray", "3,2")
          .attr("stroke-width", 1)
          .attr("stroke", "lightgrey");
    }

    showGridY() {

    }

    getClosestYear(posX:number):number {
        const closestYear = this.dimensions.years.find(
          (d: number) => d == Math.floor(this.scaleX.invert(posX))
        );
    
        return closestYear;
      }

    render() {
        return this.chartContainer.node();
    }

 

    css(): string  {

        const inlineCss = `

        .chartContainer {
          display: block;
          background: white;
          height: auto;
          height: intrinsic;
          max-width: 100%;
        }

        .${this.className} {
            display: block;
            background: white;
            height: auto;
            height: intrinsic;
            max-width: 100%;
        }
        .${this.className} text,
        .${this.className} tspan {
            white-space: pre;
        }
        .${this.className} .axis text {
            white-space: pre;    font-size: 16.2px;
            fill: rgb(102, 102, 102);        
        }

        .${this.className} .axis path {
            display: none
        }
        .${this.className} .axis.y line {
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

