import * as d3 from "d3";
import * as _ from "lodash";
import { config } from "./OWIDBarChartConfig";

export class OWIDBarChartBars {
    unit: any;
    entities: any;
    data: any;
    scales: any;
    chartContainer: any;

    constructor( data:[], options:any) {
      this.data = data;
      this.unit = options && options.unit;
      this.entities = this.data = data;
  

    }
    
    render(scales: { x: { (arg0: any): number; (arg0: any): number; domain: any; }; y: { (arg0: any): number; (arg0: any): number; domain: any; }; }, context: any) {
      this.scales = scales;
  
      this.chartContainer = d3.create("svg:g");
  
      const bars = this.chartContainer
        .selectAll("rect.entity")
        .data(this.data, (d:any) => d.entityName)
        .join("rect")
        .attr("class","entity")
        .attr("fill", "cyan")
        .attr("y", (d:any) => this.scales.y(d.entityName))
        .attr("height", this.scales.y.bandwidth())
        .attr("width", (d: { value: any; }) => this.scales.x(d.value));
  
        const text = this.chartContainer
        .selectAll("text.value")
        .data(this.data, (d:any) => d.entityName)
        .join("text")
        .attr("class","value barLabel")
        .attr("x", (d: { value: any; }) => this.scales.x(d.value))
        .attr("y", (d:any) => this.scales.y(d.entityName))
        .attr("dy", this.scales.y.bandwidth()/2 + config.valueFontSize/2)
        .attr("dx", config.textValueDx)
        .attr("font-size", config.valueFontSize)
        .attr("text-anchor", "start")
        .text((d: { value: any; }) => `${d.value} ${this.unit}`)

        
      return this.chartContainer;
    }
  }