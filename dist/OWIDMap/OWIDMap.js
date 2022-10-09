import * as d3 from 'd3';
import * as projections from 'd3-geo-projection';
import * as _ from 'lodash';
import { OWIDChart } from '../OWIDChart/OWIDChart';
import { OWIDMapTooltip } from "./OWIDMapTooltip";
import { worldTopojson } from './OWIDMapWorldTopoJson';
import * as topojson from "topojson-client";
import { config } from './OWIDMapConfig';
export class OWIDMap extends OWIDChart {
    _year;
    _latestYear;
    _entities = [];
    _singleYearData;
    _maxValue;
    _dictValues = {};
    _scaleValues;
    constructor(data, options) {
        super(data, options);
        this._year = options && options.year;
        this._toolTip = new OWIDMapTooltip({ colorScale: this._colorScale, containerWidth: this._width });
        this._chartContainer.node().appendChild(this._toolTip.render().node());
        this._scaleValues = d3.scaleLinear();
        this.startupSettings();
        this.render();
    }
    startupSettings() {
        /**
         * Maps  will focus on multiple values for a single year
         *
         * If the year has been specified in options ({year: 2020}) or via the year function( .year(2020)) we will use
         * the specified year to filter the data to be plotted.
         *
         * If the year has not been specified, we will use the latest year in the data
         */
        this._latestYear = _.chain(this._data).map((d) => d.year).max().value();
        this._year = this._year || this._latestYear;
        /** _singleYearData is the dataset we use for building the Chart */
        this._singleYearData = this._data.filter((d) => d.year == this._year);
        /** creates a dictionary for direct access to an entity value (identified by entityName) */
        this._dictValues = {};
        this._singleYearData.forEach((d) => {
            this._dictValues[d.entityName] = d.value || 0;
        });
        // maps possible values to a [0,1] range
        this._scaleValues.domain(d3.extent(this._singleYearData, (d) => d.value));
        // Update the overal <svg> & <g> main container dimensiosn and positions in case with / margings have been changed
        super.baseStartupSettings();
        /** _entities for whish we will render geo data */
        this._entities = _.chain(this._singleYearData)
            .sortBy(d => d.value)
            .map(d => d.entityName)
            .uniq()
            .value();
        // Update the overal <svg> & <g> main container dimensions and positions
        super.baseStartupSettings();
    }
    render() {
        const self = this;
        // Main <g> container where we display the visual elements
        const mainContainer = this._chartContainer.select("svg").select("g.container");
        const projection = projections.geoRobinson();
        const pathBuilder = d3.geoPath(projection);
        const world = topojson.feature(worldTopojson, worldTopojson.objects.world);
        const features = world.features;
        const countriesPaths = features.map((d) => ({ country: d.id, path: pathBuilder(d) }));
        mainContainer
            .selectAll("path.country")
            .data(countriesPaths)
            .join("path")
            .attr("class", "country")
            .attr("id", (d) => d.country.replace(" ", "_"))
            .attr("d", (d) => d.path)
            .attr("stroke", (d) => "grey")
            .attr("stroke-width", config.strokeWidthUnhighligthed)
            .attr("fill", (d) => {
            const value = this._dictValues[d.country]; // gets the value for the country
            const relativeValue = this._scaleValues(value); // normalized value to [0,1] range
            return value && d3.interpolateBlues(relativeValue) || "none";
        })
            .on("mouseenter", function (e, d) { self.handleMouseEnter(e, d, this); })
            .on("mousemove", function (e, d) { self.handleMouseMove(e, d, this); })
            .on("mousleave", function (e, d) { self.handleMouseLeave(e, d, this); });
    }
    /**
   * Gets / sets the year that is a target for our data
   * @param year
   * @returns
   */
    year(year) {
        if (arguments.length) {
            this._year = year;
            this.startupSettings();
            this.render();
            return this;
        }
        else {
            return this._year;
        }
    }
    highlightCountry(countryName) {
        const mainContainer = this._chartSVG.select("g.container");
        const countryId = countryName.replace(" ", "_");
        // Unhighlight all countries (set border to default with)
        mainContainer.selectAll("path.country")
            .attr("stroke-width", config.strokeWidthUnhighligthed);
        // Highlight the referenced country (set border to highlighted width)
        mainContainer.selectAll(`path.country#${countryId}`)
            .attr("stroke-width", config.strokeWidthHighligthed);
    }
    unHighlightCountry(countryName) {
        const mainContainer = this._chartSVG.select("g.container");
        const countryId = countryName.replace(" ", "_");
        // Highlight the referenced country (set border to highlighted width)
        mainContainer.selectAll(`path.country#${countryId}`)
            .attr("stroke-width", config.strokeWidthUnhighligthed);
    }
    handleMouseEnter(e, d, el) {
        const countryName = d && d.country;
        this.highlightCountry(countryName);
    }
    handleMouseMove(e, d, el) {
        const pos_relTarget = d3.pointer(e);
        const value = this._dictValues[d.country];
        this._toolTip.show([pos_relTarget[0], pos_relTarget[1]], {
            country: d.country,
            value: value && `${d3.format(".1f")(value)} ${this._unit}` || `N/A`,
            year: this._year
        });
    }
    handleMouseLeave(e, d, el) {
        const countryName = d && d.country;
        this.unHighlightCountry(countryName);
        this._toolTip.hide();
    }
    getDimensionValues(dimension) {
        return _.chain(this._data)
            .map((d) => d[dimension])
            .uniq()
            .value();
    }
    getTextWidth(text, fontSize, fontFace) {
        const canvas = document.createElement("canvas"), context = canvas.getContext("2d");
        let textWidth = null;
        if (context) {
            context.font = fontSize + "px " + fontFace;
            textWidth = context.measureText(text).width;
        }
        return textWidth;
    }
    node() {
        return this._chartContainer.node();
    }
}
