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



If we want to give another step to allow "democratize" visualizations associated to OWID data, we could work on a Javascript library that makes it easy to build and embbed visualizations as poart  

This respository contains a very simple prototype that I developed to play with some ideas.  I imagine an OWID Javascript charting tool that has the following features:

- Is decoupled from the database (can consume data that is provided via Javascript without direct connection to the database)
- Has an architecture and code that is easy to understand, so that other developers can contribute and / or expand its functionalities.
- It is aware of the characteristics of OWID data.  This is not "yeat another charting tool" but a tool that works well with data that is organised with time (years / dates) and gographical entities (countries, continents, grouops of countries) with relevant values metrics (which might have specific units and formatting conventions)
- It is easy to intergrate in other systems.

The core of the tool is to build visualizations that could be embedded in other systems (e.g. blogs or notebooks) or used as components for other developments.  These visualizations will usually be used within a standard "wrapper" that would handle common functionalities (display sources, export data and images, filters, ...), but this wrapper would be a separate development that consumes the core visualizations.

## Characteristics of OWID data

Current OWID Grappher consumes data from a MySQL database that is publicly distributed.  When we look at the data model, we can identify some key concepts 


![owid data model](https://user-images.githubusercontent.com/68602/193713247-772bf1d0-1610-4d5b-ad0a-8703cc15493d.png)


* Datasets: are associated to a specific source and can contain a collection of *variables* (metrics)
* Tags: descriptors that are associates to **datasets** (e.g. "Population Growth").  Tags can have tag parents which allows to build a hierarchical structure of tags (e.g. "Population Growth" is a child of "Population Growth & Vital Statistics")
* Variables: multiple variables can be associated to a **dataset**.  Each variable (e.g. "Fertility Rate") has a unit (e.g. "children per woman") and is associated to a table contains a collection of **data-values** that links values with time (year) and entities (countries, continents, ...).
* Entities have a name (e.g. "United Kingdom") and id (e.g. 1) and a code (e.g. GBR)

Once the user has selected a domain and dataset (e.g. "World Development Indicators - Economic Policy & Debt") and a specific variable from that dataset  (e.g. "GDP per capita, PPP (constant 2011 international $)") then we are dealing with data values that can be exemplefied by the following table:

<img width="462" alt="image" src="https://user-images.githubusercontent.com/68602/193715399-22af89ec-572e-4cbd-a887-9872beaf4108.png">

The key dimensions for our visualization purposes are
* **entity name** (categorical)
* **year** (ordinal / time) 

And we have a numeric variable ("**value**") with ranges, units and format that will depend on the specific variable (%, people, $, ...)

The most common messages that we would like to communicate in our visualizations are:

- Trends:  how the metric evolves on time for a specific entity, and how the trend from different entities can be compared (line charts)
- Rankings: the relative size and order of the metrics for different entities (bar charts)
- Geography: how is the relative size of the metric distributed in the world (maps)


## Anatomy of an OWID visualization

A visualization is a conceptual entity that usually contains the following elements:
- A graphical repesentation in a 2D plane that takes advantage of visual variables (size, position, shape , color) to represent magnitudes, trends, relationships, ...
- Axis that communicate the relationship between domain values (e.g. age, income) and phisical ranges in the chart (vertical / horizontal position)
- Legends that map colors to categorical variables (e.g. countries)
- Titles / subtitles
- Annotations
- Tooltips

In contrete "browser" terms, the visualization is represented as a DOM element (e.g. a <div>) that can be embedded in a html page. Usualli visualizations are created with <svg> elements that offer great flexibility to represent (and manage) visual representations inside an html page.
  
A <svg> element can contain diffrerent visual elements (circles, rectangles, linespaths, text) that are located in a x/y coordinate system within the <svg> container.  We can also insert a <g> container in the <svg> element (or inside another <g> element) which provides a local coordinate system (a rect within a <g> has a positiomn relative to its parent).
  
In general our visualizations will have the following framework:
  
  <img width="1443" alt="image" src="https://user-images.githubusercontent.com/68602/193721282-f277048e-c751-4173-abf6-8137528e4e9c.png">
  
Our chart container is a <div> element that can be embedded in any "html wrapper" that will contain the visualization.

The <svg> element will define the absolute dimensions of the visualization (height & width) and will contain a main <g> container which is ultimately the elemengt where we will *draw* our visual representations.
  
Our <g> container usually has *margins* that define space for axis, labels and titles that are placed out beyond the boundaries of our main visualization.
  
  




