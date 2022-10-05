import { schemeCategory10 } from "d3-scale-chromatic"
export const baseCSS =  `

.chartContainer {
  display: block;
  background: white;
  height: auto;
  height: intrinsic;
  max-width: 100%;
}

.owidChart{
    display: block;
    background: white;
    height: auto;
    height: intrinsic;
    max-width: 100%;
}
.owidChart text,
.owidChart tspan {
    white-space: pre;
}
.owidChart .axis text {
    white-space: pre;    font-size: 16.2px;
    fill: rgb(102, 102, 102);        
}

.owidChart .axis path {
    display: none
}
.owidChart .axis.y line {
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


`