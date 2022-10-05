import * as d3 from "d3";

export class OWIDTrendChartTooltip {
  colorScale: any;
  toolTip: any;
  containerWidth: any;

  constructor(options: any) {
    this.colorScale =
      (options && options.colorScale) || d3.scaleOrdinal(d3.schemeCategory10);
    this.containerWidth = (options && options.containerWidth) || 800;

    this.toolTip = d3.create("div")
      .attr("class", "Tooltip")
      .style("display", "none")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("left", `${0}px`)
      .style("top", `${0}px`)
      .style("white-space", "nowrap")
      .style("background-color", "rgba(255, 255, 255, 0.95)")
      .style(
        "box-shadow",
        "rgba(0, 0, 0, 0.12) 0px 2px 2px, rgba(0, 0, 0, 0.35) 0px 0px 1px"
      )
      .style("border-radius", "2px")
      .style("text-align", "left")
      .style("font-size", "0.9em")
      .style("padding", "0.3em").html(`
      <table>
        <thead>
          <tr><td colspan="3">DUMMY YEAR<td><tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      `);

    this.toolTip
      .append("table")
      .style("font-size", "0.9em")
      .style("line-height", "1.4em")
      .style("white-space", "normal")
      .call((table: { append: (arg0: string) => any; }) => table.append("thead"))
      .call((table: { append: (arg0: string) => any; }) => table.append("tbody"));
  }

  render() {
    return this.toolTip;
  }

  show(pos: any[], options: { year: any; data: any; }) {
    const year = options && options.year;
    const data = options && options.data;


    this.toolTip
      .style("display", "block")
      .style("top", `${pos[1]}px`)
      .style("left", `${pos[0]}px`);

    // Add year information on table header
    this.toolTip.select("thead").select("td").text(year);

    // Add rows with entityName, value data
    this.toolTip
      .select("tbody")
      .selectAll("tr")
      .data(data)
      .join(
        (enter: { append: (arg0: string) => { (): any; new(): any; call: { (arg0: (tr: any) => any): { (): any; new(): any; call: { (arg0: (tr: any) => any): { (): any; new(): any; call: { (arg0: (tr: any) => any): void; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) => {
          enter
            .append("tr")
            .call((tr) => tr
              .append("td")
              .attr("class", "symbol")
              .append("div")
              .attr(
                "style",
                "width: 10px; height: 10px; border-radius: 5px; background-color: grey; display: inline-block; margin-right: 2px;"
              )
            )
            .call((tr) => tr.append("td").attr("class", "entityName"))
            .call((tr) => tr.append("td").attr("class", "value"));
        },
        (update: { selectAll: (arg0: string) => { (): any; new(): any; style: { (arg0: string, arg1: (d: any) => any): void; new(): any; }; }; select: (arg0: string) => { (): any; new(): any; select: { (arg0: string): { (): any; new(): any; style: { (arg0: string, arg1: (d: any) => any): void; new(): any; }; }; new(): any; }; text: { (arg0: { (d: any): any; (d: any): any; }): void; new(): any; }; }; }) => {
          update
            .selectAll("td")
            .style("color", (d) => this.colorScale(d.entityName));

          update
            .select("td.symbol")
            .select("div")
            .style("background-color", (d) => this.colorScale(d.entityName));
          update.select("td.entityName").text((d) => d.entityName);
          update.select("td.value").text((d) => d.value);
        }
      );

          // Check if tooltip goes beyond right border
      const tooltipWidth = this.toolTip
      .node()
      .getBoundingClientRect().width;

      if (pos[0] > this.containerWidth - tooltipWidth) {
        this.toolTip.style("left", `${pos[0] - tooltipWidth - 30}px`);
      }
  }

  hide() {
    this.toolTip.style("display", "none");
  }
}
