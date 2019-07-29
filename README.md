# topsoil-js

A TypeScript library for creating d3-driven geochronological data visualizations.

## Installation

TO DO

## Basic Example

TO DO

## API

TO DO

### Variables
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

### Options

TO DO

### Features

TO DO

