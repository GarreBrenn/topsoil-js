import { Plot } from "./plot";

export type DataEntry = { [key in Variable]?: any }
export type Config = { [key in Option]?: any }

export const enum Variable {

  LABEL = "label",

  X = "x",
  SIGMA_X = "sigma_x",
  Y = "y",
  SIGMA_Y = "sigma_y",
  RHO = "rho",

  SELECTED = "selected",
  VISIBLE = "visible"

}

export const enum Option {
  TITLE = "title",

  X_AXIS = "x_axis",
  X_MIN = "x_min",
  X_MAX = "x_max",

  Y_AXIS = "y_axis",
  Y_MIN = "y_min",
  Y_MAX = "y_max",

  ISOTOPE_SYSTEM = "isotope_system",
  UNCERTAINTY = "uncertainty",
  LAMBDA_230 = "lambda_230",
  LAMBDA_234 = "lambda_234",
  LAMBDA_235 = "lambda_235",
  LAMBDA_238 = "lambda_238",
  R238_235S = "R238_235S",

  SHOW_UNINCLUDED = "show_unincluded",

  POINTS = "points",
  POINTS_FILL = "points_fill",
  POINTS_OPACITY = "points_opacity",

  ELLIPSES = "ellipses",
  ELLIPSES_FILL = "ellipses_fill",
  ELLIPSES_OPACITY = "ellipses_opacity",

  ERROR_BARS = "error_bars",
  ERROR_BARS_FILL = "error_bars_fill",
  ERROR_BARS_OPACITY = "error_bars_opacity",

  MCLEAN_REGRESSION = "regression_mclean",
  MCLEAN_REGRESSION_ENVELOPE = "regression_mclean_envelope",

  CONCORDIA_TYPE = "concordia_type",
  CONCORDIA_LINE = "concordia_line",
  CONCORDIA_LINE_FILL = "concordia_line_fill",
  CONCORDIA_LINE_OPACITY = "concordia_line_opacity",
  CONCORDIA_ENVELOPE = "concordia_envelope",
  CONCORDIA_ENVELOPE_FILL = "concordia_envelope_fill",
  CONCORDIA_ENVELOPE_OPACITY = "concordia_envelope_opacity",

  EVOLUTION = "evolution"
}

export enum Feature {
  POINTS = "points",
  ELLIPSES = "ellipses",
  ERROR_BARS = "unctbars",
  CONCORDIA = "concordia",
  EVOLUTION = "evolution",
  MCLEAN_REGRESSION = "mclean-regression",
  CIRCLE = "circle"
}
