# topsoil-js

A TypeScript library for creating d3-driven geochronological data visualizations.

## Table of Contents

- [Installation](#installation)
- [Basic Example](#basic-example)
- [API](#api)
  - [ScatterPlot](#scatter-plot)
  - [Data Variables](#variables)
  - [Plot Options](#options)
- [Java Interaction](#java)
- [More Topsoil](#more-topsoil)

## <a name="installation"></a> Installation

`npm install CIRDLES/topsoil-js`

## <a name="basic-example"></a> Basic Example

```javascript
const data = [
  { label: "row1", selected: true, x: 27.9, sigma_x: 1.3, y: 0.71, sigma_y: 0.02, rho: 0.89 }
];

const options = {
  title: "Example Plot",
  points: true,
  points_fill: "#00ff00",
  ellipses: true,
  concordia_type: "wetherill",
  concordia_line: true,
  concordia_envelope: true
}

const layers = ["points", ["ellipses", "error_bars"], ["concordia", "evolution"]];

const plot = new ScatterPlot(
  document.getElementById("plot"),
  data,
  options,
  layers
);
```

## <a name="api"></a> API

### <a name="scatter-plot"></a> ScatterPlot

#### Properties
Name               | Type                              | Access    | Description
-------------------|-----------------------------------|-----------|--------------------------------------------------------
`root`             | `HTMLDivElement`                  | readonly  | The element in which the plot is drawn.
`data`             | `{}[]`                            | get/set   | An array of data objects (see [Data Variables](#variables))
`options`          | `{}`                              | get/set   | An object of plot options (see [Plot Options](#options))
`x.axis`           | `d3.svg.Axis`                     | readonly  | The plot's X axis.
`x.scale`          | `d3.scale.Linear<number, number>` | readonly  | The scale responsible for mapping X axis values to X coordinates.
`y.axis`           | `d3.svg.Axis`                     | readonly  | The plot's Y axis.
`y.scale`          | `d3.scale.Linear<number, number>` | readonly  | The scale responsible for mapping Y axis values to Y coordinates.

#### `new ScatterPlot(root: HTMLDivElement, data: {}[], options: {}, layers?: [])`
Draws a plot in the specified `root` element. 

Data is defined as an array of objects in which the keys are in the enum `Variable`. (For possible values, see [Data Variables](#variables)). 

Options are defined as an object in which the keys are in the enum `Option`. (For possible values, see [Plot Options](#options)). 

Layers are optional, and may be defined as an array that represents the order of each of the plot features, where the first feature is drawn on top, and the last feature is drawn on the bottom. Features may also be grouped; for example, the following array specifies that data points will appear on top, followed by a group containing both error ellipses and error bars, followed by another group containing the concordia and the evolution matrix:
```javascript
const layers = ["points", ["ellipses", "error_bars"], ["concordia", "evolution"]];
```
String value | Enum value
-------------|-------------------
"points"     | Feature.POINTS
"ellipses"   | Feature.ELLIPSES
"error_bars" | Feature.ERROR_BARS
"concordia"  | Feature.CONCORDIA
"evolution"  | Feature.EVOLUTION

#### `.setDataFromJSON(data: string)`: `void`
Sets the plot's data from the provided JSON string.

#### `.setOptionsFromJSON(options: string)`: `void`
Sets the plot's options from the provided JSON string.

#### `.getDataExtents()`: `number[]`
Returns an array containing the minimum and maximum data values for each axis at the following indices:
<br/>[0] Minimum X value
<br/>[1] Maximum X value
<br/>[2] Minimum Y value
<br/>[3] Maximum Y value

#### `.changeAxisExtents(xMin: number, xMax: number, yMin: number, yMax: number, doInterpolate?: boolean = false)`: `void`
Sets the plot's axes to the provided extents. If `doInterpolate` is true, then the transition will be animated.

#### `.resetView()`: `void`
Zooms the plot to fit the data extents.

#### `.snapToConcordia()`: `void`
Zooms the plot so that the Wetherill concordia passes through the lower-left and upper-right corners.

### <a name="variables"></a> Data Variables
Data rows are defined as objects in which the keys are in the enum `Variable`. For example:
```
{
  "label": "row1",
  "selected": true,
  "x": 27.4,
  "sigma_x": 1.3,
  "y": 0.7,
  "sigma_y": 0.014,
  "rho": 0.89
}
```

#### "label" (`Variable.LABEL`) : `string`
> default: ""

The label describing a row.

#### "selected" (`Variable.SELECTED`) : `boolean`
> default: true

Rows may be selected or deselected in order to modify the appearance of certain plot features. For example, if a row is deselected, the error ellipse for that row will be grayed out.

#### "x" (`Variable.X`) : `number`
> required for ScatterPlot

The value used for the X component of the row.

#### "sigma_x" (`Variable.SIGMA_X`) : `number`
> default: 0.0

The value used for error/uncertainty along the X axis. This must be provided in 1-sigma absolute format.

#### "y" (`Variable.Y`) : `number`
> required for ScatterPlot

The value used for the Y component of the row.

#### "sigma_y" (`Variable.SIGMA_Y`) : `number`
> default: 0.0

The value used for error/uncertainty along the Y axis. This must be provided in 1-sigma absolute format.

#### "rho" (`Variable.RHO`) : `number`
> default: 0.0

The rho value, or the correlation coefficient, used to calculate error ellipses. This must be a value between -1.0 and 1.0, inclusive.

### <a name="options"></a> Plot Options

#### "title" (`Option.TITLE`) : `string`
> default: "New Plot"

#### "x_axis" (`Option.X_AXIS`) : `string`
> default: "X Axis"

The title of the plot's X axis.

#### "x_min" (`Option.X_MIN`) : `number`
> default: 0.0

The lower bound of the plot's X axis.

#### "x_max" (`Option.X_MAX`) : `number`
> default: 1.0

The upper bound of the plot's X axis.

#### "y_axis" (`Option.Y_AXIS`) : `string`
> default: "Y Axis"

The title of the plot's X axis.

#### "y_min" (`Option.Y_MIN`) : `number`
> default: 0.0

The lower bound of the plot's Y axis.

#### "y_max" (`Option.Y_MAX`) : `number`
> default: 1.0

The upper bound of the plot's Y axis.

#### "isotope_system" (`Option.ISOTOPE_SYSTEM`) : `string`
> default: "Generic"

The isotope system of the plot. Can be "Generic", "Uranium Lead", or "Uranium Thorium".

#### "uncertainty" (`Option.UNCERTAINTY`) : `number`
> default: 1.0

The multiplier used to calculate error values. An uncertainty value of 2.0 would yield 2-sigma values.

#### "points" (`Option.POINTS`) : `boolean`
> default: true

Determines whether or not to display data points for each row.

#### "points_fill" (`Option.POINTS_FILL`) : `string`
> default: "#4682b4"

The color of the plot's data points.

#### "points_opacity" (`Option.POINTS_OPACITY`) : `number`
> default: 1.0

The opacity of the plot's data points, a value between 0.0 and 1.0, inclusive.

#### "ellipses" (`Option.ELLIPSES`) : `boolean`
> default: false

Determines whether or not to display error ellipses for each row.

#### "ellipses_fill" (`Option.ELLIPSES_FILL`) : `string`
> default: "#ff0000"

The fill color of the plot's selected error ellipses.

#### "ellipses_opacity" (`Option.ELLIPSES_OPACITY`) : `number`
> default: 1.0

The opacity of the plot's error ellipses.

#### "error_bars" (`Option.ERROR_BARS`) : `boolean`
> default: false

Determines whether or not to display error bars for each row.

#### "error_bars_fill" (`Option.ERROR_BARS_FILL`) : `string`
> default: "#000000"

The fill color of the plot's selected error bars.

#### "error_bars_opacity" (`Option.ERROR_BARS_OPACITY`) : `number`
> default: 1.0

The opacity of the plot's error bars.

#### "concordia_type" (`Option.CONCORDIA_TYPE`) : `string`
> default: "none"

The type of concordia to display. Valid values include `"none"`, `"wetherill"`, and `"tera-wasserburg"`.

#### "concordia_line" (`Option.CONCORDIA_LINE`) : `boolean`
> default: false

Determines whether or not to show a concordia line.

#### "concordia_line_fill" (`Option.CONCORDIA_LINE_FILL`) : `string`
> default: "#0000ff"

The color of the concordia line.

#### "concordia_line_opacity" (`Option.CONCORDIA_LINE_OPACITY`) : `number`
> default: 1.0

The opacity of the concordia line. May be between 0.0 and 1.0, inclusive.

#### "concordia_envelope" (`Option.CONCORDIA_ENVELOPE`) : `boolean`
> default: false

Determines whether or not to show a concordia error envelope.

#### "concordia_envelope_fill" (`Option.CONCORDIA_ENVELOPE_FILL`) : `string`
> default: "#0000ff"

The color of the concordia error envelope.

#### "concordia_envelope_opacity" (`Option.CONCORDIA_ENVELOPE_OPACITY`) : `number`
> default: 1.0

The opacity of the concordia error envelope. May be between 0.0 and 1.0, inclusive.

#### "evolution" (`Option.EVOLUTION`) : `boolean`
> default: false

Determines whether or not to draw an evolution matrix.

#### "lambda_230" (`Option.LAMBDA_230`) : `number`
> default: 9.1705E-6

#### "lambda_234" (`Option.LAMBDA_234`) : `number`
> default: 2.82206E-6

#### "lambda_235" (`Option.LAMBDA_235`) : `number`
> default: 9.8485e-10

#### "lambda_238" (`Option.LAMBDA_238`) : `number`
> default: 1.55125e-10

#### "R238_235S" (`Option.R238_235S`) : `number`
> default: 137.88

## <a name="java"></a> Java Interaction
Using a JavaFX WebView, it is possible to execute JavaScript within a Java application, as is done in the desktop version of Topsoil. In order to support upcalls from JavaScript to Java, the optional `javaBridge` member may be set on a plot object.

## <a name="more-topsoil"></a> More Topsoil
- [Topsoil (desktop)](https://github.com/CIRDLES/Topsoil) - Java application and library
- [Topsoil (web)](http://cirdles.cs.cofc.edu/topsoil) - Web application
