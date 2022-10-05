# A Javascript tool for building visualizations with data from Our World in Data 
## A Proof of concept

Our World in Data (OWID) is an initiative that aims at **research and data to make progress against the world’s largest problems**.  They collect and mantain hundreds of datasets from worlwide public data that is transformed into meaningful information via evidence based articles and data visualisations.

They currently have a visualization tool - OWID Grapher (https://github.com/owid/owid-grapher) - that has been designed to easily create, and publish, visualizations in a consistent format for different datasets.

But Grapher authors mention that

> "This repo is currently not well-designed for reuse as a visualization library, nor for reproducing the full production environment we have at Our World in Data, as our tools are tightly coupled with our database structure."

My objective with **owid-vis-pc** is to explore an alterantive approach for creating a suite of visualization components that would:
* Allow for easy reutilization (a javascrip library that can be easily applied to projects)
* Decouple the visualization tools from the database
* Be designed specially for OWID data (mainy data that has year / entity dimensions and numeric values)
* Be simple to understand and easily expanded vi visualization developers

## Quick overview

My idea is that we would develop a javascript library that will be easily distributed by standard channels (e.g. nmp @elaval/owid-vis-poc) and when imported in a javascript project it can be used as easily as:

<pre>

  // Let's assume thet we have already retreived the data for a specific varaible
  const data = [
    {entityName: "United Kingdom", year: 1990, value:73.2},
    ...
  ]

  const chartEL = owidVis.lineChart(data).unit("years").node():
  document.getElementById("owidChart").appendChild(chartEL);
  
  &lt;div id="owidChart">&lt;/div>

</pre>

<img width="933" alt="image" src="https://user-images.githubusercontent.com/68602/194140362-e61b3a0f-6c05-49bc-ae90-491a99d59dce.png">

You can see this in action in a html page with pure Javascript at [https://elaval.github.io/owid-vis-demo-basic/index.html](https://elaval.github.io/owid-vis-demo-basic/index.html)

And you can access a notebook that exemplifies how to retreive OWID data and render trend & barcharts in Observable.com at:
https://observablehq.com/@elaval/owid-visualisation-components-poc


## Library architecture

### Data structure
 We will assume that the visualization library will consume datasets with a standard format (but the library itself will not be responsible for retreiving / producing the data).  *Below we give an overview on OWID data model*.

The assumption is that all data will have records with, at least, **entitiName**, **year** and **value**
<img width="462" alt="image" src="https://user-images.githubusercontent.com/68602/193715399-22af89ec-572e-4cbd-a887-9872beaf4108.png">

Also the data will have a "unit" description that can should be part of the respective dataset metadata.

### Library classes
The visualization library will export an object - **owidVIS** - that will provide a collection of chart building functions. For example:

* **OWIDTrendChart**: Creates a line chart with entities values over years
* **OWIDBarChart**: Creates a bar chart with entities values for a specific year
* **OWIDMap**: Creates a world map with entities (countries) values for a specific year
...

Note: This POC illustrates the concept with TrendChart and BarChart classes

In the source code all visualization are Javascript (actually TypeScript) classes that are derived from a parent **OWIDChart** class which provides elements and functions that are common to all visualizations.

Visualizations are represented as visual elements on the DOM which include a \<div> wrapper that contains a \<svg> element which alos contains a \<g> element that will be the main container for all elements that are especific to each chart (e.g. lines for TrendChart, rectangles for BarChart, ...)  

<img width="1443" alt="image" src="https://user-images.githubusercontent.com/68602/193721282-f277048e-c751-4173-abf6-8137528e4e9c.png">

Most of the visual elements are created, configured and transformed using D3js (https://d3js.org/) which has became the de-facto library for data visualization.

Each Visualization class provides a series of methods that allow the user to provide specific configuration.  

For example, to create a trendChart that has "years" as the unit and a total width of 1000 pixels, we would use:
<pre>
const myTrendChart = owidVis.OWIDTrendChart(data).unit("years").width(1000)
</pre>

The *node()* method will export the DOM element (\<div>) that can be embedded in a html document.
  
 owidVis.OWIDTrendChart(data).node()


## Characteristics of OWID data

Current OWID Grappher consumes data from a MySQL database that is publicly distributed.  When we look at the data model, we can identify some key concepts 


![owid data model](https://user-images.githubusercontent.com/68602/193713247-772bf1d0-1610-4d5b-ad0a-8703cc15493d.png)


* Datasets: are associated to a specific source and can contain a collection of *variables* (metrics)
* Tags: descriptors that are associates to **datasets** (e.g. "Population Growth").  Tags can have tag parents which allows to build a hierarchical structure of tags (e.g. "Population Growth" is a child of "Population Growth & Vital Statistics")
* Variables: multiple variables can be associated to a **dataset**.  Each variable (e.g. "Fertility Rate") has a unit (e.g. "children per woman") and is associated to a table contains a collection of **data-values** that links values with time (year) and entities (countries, continents, ...).
* Entities have a name (e.g. "United Kingdom") and id (e.g. 1) and a code (e.g. GBR)

Once the user has selected a domain and dataset (e.g. "World Development Indicators - Economic Policy & Debt") and a specific variable from that dataset  (e.g. "GDP per capita, PPP (constant 2011 international $)") then we are dealing with data values that can be exemplefied by the following table:


The key dimensions for our visualization purposes are
* **entity name** (categorical)
* **year** (ordinal / time) 

And we have a numeric variable ("**value**") with ranges, units and format that will depend on the specific variable (%, people, $, ...)

The most common messages that we would like to communicate in our visualizations are:

- Trends:  how the metric evolves on time for a specific entity, and how the trend from different entities can be compared (line charts)
- Rankings: the relative size and order of the metrics for different entities (bar charts)
- Geography: how is the relative size of the metric distributed in the world (maps)





