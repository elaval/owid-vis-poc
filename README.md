# owidVis : A Javascript library for building visualizations with data from Our World in Data 
## A Proof of concept

Our World in Data (OWID) is an initiative that aims at **research and data to make progress against the world’s largest problems**.  They collect and mantain hundreds of public datasets which are the source of evidence based articles and data visualisations.

They currently have a visualization tool - OWID Grapher (https://github.com/owid/owid-grapher) - that has been designed to easily create, and publish, visualizations in a consistent format for different datasets.

But Grapher authors mention that

> "This repo is currently not well-designed for reuse as a visualization library, nor for reproducing the full production environment we have at Our World in Data, as our tools are tightly coupled with our database structure."

My objective with **owid-vis-poc** (aka owidVis) is to explore a potential approach for creating a suite of visualization components that would:
* Allow for easy reutilization (a light weight javascript library that can use in web developments and publications)
* Decouple visualizations from the database
* Be designed for OWID data (assumes geographical & time dimensions)
* Be accesible for visualization developers to contribute and extend it

## Quick overview

My idea is that we would develop a javascript library that will be distributed via standard channels (e.g. nmp @elaval/owid-vis-poc). 

<pre>

  // Let's assume thet we have already retreived the data for a specific variable (e.g. Life Expectancy)
  const data = [
    {entityName: "United Kingdom", year: 1990, value:75.7},
    ...
  ]

  const chartEL = owidVis.lineChart(data).unit("years").node():
  document.getElementById("owidChart").appendChild(chartEL);
  
  &lt;div id="owidChart">&lt;/div>

</pre>

<img width="939" alt="image" src="https://user-images.githubusercontent.com/68602/194190358-7a0465fa-768c-4379-9629-202acda714c7.png">
You can see this in action in a html page with pure Javascript at https://elaval.github.io/owid-vis-demo-basic/index.html.
<br><br>

I suggest to visit this notebook that exemplifies how to retreive OWID data and render trend & barcharts in Observable.com:
https://observablehq.com/@elaval/owid-visualisation-components-poc

## Library architecture

### Data structure
 We will assume that the visualization library will consume datasets with a standard format (the library itself will not be responsible for retreiving / producing the data).

The assumption is that all data will have records with, at least, **entityName**, **year** and **value**
<img width="462" alt="image" src="https://user-images.githubusercontent.com/68602/193715399-22af89ec-572e-4cbd-a887-9872beaf4108.png">

The data should also have an associated "unit" description that is part of the respective dataset metadata.

### Library classes
The visualization library will export an object - **owidVIS** - that will provide a collection of chart building functions. For example:

* **OWIDTrendChart()**: Creates a line chart with values over years for available entities (countries)
* **OWIDBarChart()**: Creates a bar chart with values for different entities in a specific year
* **OWIDMap()**: Creates a world map with values for entities in a specific year
...

In the source code, all visualization are Javascript (actually TypeScript) classes that are derived from a parent class - **OWIDChart** - which provides elements and functions that are common to all visualizations.

Visualizations are represented as visual elements in the DOM which include a \<div> wrapper that contains a \<svg> element which contains a \<g> element.  This \<g> element will be the main container for all visual elements that constitute a specific chart (e.g. lines for TrendChart, rectangles for BarChart, axis, ...)  

<img width="1443" alt="image" src="https://user-images.githubusercontent.com/68602/193721282-f277048e-c751-4173-abf6-8137528e4e9c.png">

Most of the visual elements are created, configured and transformed using D3js (https://d3js.org/) which has became a de-facto library for data visualization.

Each visualization class provides a series of methods that allow the user to provide specific configurations.  

For example, to create a trendChart that has "years" as the unit and a total width of 1000 pixels, we would use:
<pre>
const myTrendChart = owidVis.OWIDTrendChart(data).unit("years").width(1000)
</pre>

The *node()* method will return the DOM element (\<div>) that contains the visualization and can be embedded in any html document.
 
<pre>
owidVis.OWIDTrendChart(data).node()
</pre>

## Building the library

You can download the code from this respository and then

Install dependencies: 
<pre>
$ npm i
</pre>

Build javascript code from Typescript sources (we use rolloutjs to create umd bundles)
$ npm run build

Distribution library can be found at *dist/owid-vis-poc.umd.js* or *dist/owid-vis-poc.umd.min.js*

The library depends on "lodash" (which is included in the bundel) and d3js (which is **not** included in the bundle)

Users are expected to import d3.js in their projects

## Characteristics of OWID data

Current OWID Grappher consumes data from a MySQL database that is publicly distributed.  When we look at the data model, we can identify some key concepts 

![owid data model](https://user-images.githubusercontent.com/68602/193713247-772bf1d0-1610-4d5b-ad0a-8703cc15493d.png)

* Datasets: are associated to a specific source and can contain a collection of *variables* (metrics)
* Tags: descriptors that are associated to **datasets** (e.g. "Population Growth").  Tags can have tag parents which allows to build a hierarchical structure of tags (e.g. "Population Growth" is a child of "Population Growth & Vital Statistics")
* Variables: multiple variables can be associated to a **dataset**.  Each variable (e.g. "Fertility Rate") has a unit (e.g. "children per woman") and is associated to a table that contains a collection of **data-values** 
* Data-Values: the actual data for a specific variable.  Collection of records with **values** associated to time (**year**) and **entities** (countries, continents, ...).
* Entities have a name (e.g. "United Kingdom") and id (e.g. 1) and a code (e.g. GBR)

Once the user has selected a domain and dataset (e.g. "World Development Indicators - Economic Policy & Debt") and a specific variable from that dataset  (e.g. "GDP per capita, PPP (constant 2011 international $)") then we are dealing with a selection of data values that will be used for visualizations.

The original Data Model has a normalized structure with a relationship between data-values and entities
<img width="522" alt="image" src="https://user-images.githubusercontent.com/68602/194168102-a19095a6-9f4c-449b-a5c2-d494f2f049a8.png">

For visualization purposes we will assume that data will be provided to the visualization in a denormalized form:
<img width="349" alt="image" src="https://user-images.githubusercontent.com/68602/194169112-fb1dde6d-635f-488d-a70b-779774efd9f3.png">





