
function makePlot() {
  const { LABEL, SELECTED, VISIBLE, X, SIGMA_X, Y, SIGMA_Y, RHO } = topsoil.Variable;
  const {
    TITLE,
    X_AXIS,
    Y_AXIS,
    ISOTOPE_SYSTEM,
    UNCERTAINTY,
    POINTS,
    POINTS_FILL,
    ELLIPSES,
    ELLIPSES_FILL,
    ERROR_BARS,
    ERROR_BARS_FILL,
    CONCORDIA_TYPE,
    CONCORDIA_LINE,
    CONCORDIA_ENVELOPE,
    SHOW_UNINCLUDED
  } = topsoil.Option;
  const data = [
    { 
      [LABEL]: "row1", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.165688743, 
      [SIGMA_X]: 1.519417676, 
      [Y]: 0.712165893, 
      [SIGMA_Y]: 1.395116767, 
      [RHO]: 0.918191745
    },
    {
      [LABEL]: "row2", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.165688743,
      [SIGMA_X]: 1.519417676,
      [Y]: 0.712165893,
      [SIGMA_Y]: 1.395116767,
      [RHO]: 0.918191745,
    },
    {
      [LABEL]: "row3", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.031535970,
      [SIGMA_X]: 1.799945600,
      [Y]: 0.714916493,
      [SIGMA_Y]: 1.647075269,
      [RHO]: 0.915069472,
    },
    {
      [LABEL]: "row4", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.002008069,
      [SIGMA_X]: 1.441943510,
      [Y]: 0.709482828,
      [SIGMA_Y]: 1.324922704,
      [RHO]: 0.918845083,
    },
    {
      [LABEL]: "row5", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.203969765,
      [SIGMA_X]: 1.320690194,
      [Y]: 0.707078490,
      [SIGMA_Y]: 1.216231698,
      [RHO]: 0.920906132,
    },
    {
      [LABEL]: "row6", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.194452092,
      [SIGMA_X]: 1.359029744,
      [Y]: 0.709615006,
      [SIGMA_Y]: 1.248057588,
      [RHO]: 0.918344571,
    },
    {
      [LABEL]: "row7", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.293320455,
      [SIGMA_X]: 1.424328137,
      [Y]: 0.710934267,
      [SIGMA_Y]: 1.309135282,
      [RHO]: 0.919124777,
    },
    {
      [LABEL]: "row8", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 28.497489852,
      [SIGMA_X]: 1.353243890,
      [Y]: 0.686951820,
      [SIGMA_Y]: 1.245648095,
      [RHO]: 0.920490463,
    },
    {
      [LABEL]: "row9", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.218573677,
      [SIGMA_X]: 1.383868032,
      [Y]: 0.715702180,
      [SIGMA_Y]: 1.271276031,
      [RHO]: 0.918639641,
    },
    {
      [LABEL]: "row10", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 28.884872020,
      [SIGMA_X]: 1.264304654,
      [Y]: 0.702153693,
      [SIGMA_Y]: 1.164978444,
      [RHO]: 0.921438073,
    },
    {
      [LABEL]: "row11", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 28.863259209,
      [SIGMA_X]: 1.455550200,
      [Y]: 0.700081472,
      [SIGMA_Y]: 1.335582301,
      [RHO]: 0.917579003,
    },
    {
      [LABEL]: "row12", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.014325453,
      [SIGMA_X]: 1.614480021,
      [Y]: 0.701464404,
      [SIGMA_Y]: 1.478394505,
      [RHO]: 0.915709384,
    },
    {
      [LABEL]: "row13", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.917885787,
      [SIGMA_X]: 1.564622589,
      [Y]: 0.725185047,
      [SIGMA_Y]: 1.434906094,
      [RHO]: 0.917094067,
    },
    {
      [LABEL]: "row14", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 30.159907714,
      [SIGMA_X]: 1.488528691,
      [Y]: 0.724886106,
      [SIGMA_Y]: 1.366282212,
      [RHO]: 0.917874287,
    },
    {
      [LABEL]: "row15", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 28.963153308,
      [SIGMA_X]: 1.480754780,
      [Y]: 0.698240706,
      [SIGMA_Y]: 1.359750830,
      [RHO]: 0.918282249,
    },
    {
      [LABEL]: "row16", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.350104553,
      [SIGMA_X]: 1.513999270,
      [Y]: 0.711983592,
      [SIGMA_Y]: 1.384417989,
      [RHO]: 0.914411266,
    },
    {
      [LABEL]: "row17", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.979576581,
      [SIGMA_X]: 1.595745814,
      [Y]: 0.724426340,
      [SIGMA_Y]: 1.458894294,
      [RHO]: 0.914239775,
    },
    {
      [LABEL]: "row18", 
      [SELECTED]: true, 
      [VISIBLE]: true, 
      [X]: 29.344673618,
      [SIGMA_X]: 1.551935035,
      [Y]: 0.714166474,
      [SIGMA_Y]: 1.420060290,
      [RHO]: 0.915025602,
    },
  ];

  data.forEach(row => absToPercent(row, 2));
  
  const options = {
    [TITLE]: "Scatter Plot Demo",
    [X_AXIS]: "X Axis Title",
    [Y_AXIS]: "Y Axis Title",
    [ISOTOPE_SYSTEM]: "Uranium Lead",
    [UNCERTAINTY]: 1,
    [POINTS]: true,
    [POINTS_FILL]: "#4682b4",
    [ELLIPSES]: false,
    [ELLIPSES_FILL]: "#ff0000",
    [ERROR_BARS]: false,
    [ERROR_BARS_FILL]: "#000000",
    [CONCORDIA_TYPE]: "wetherill",
    [CONCORDIA_LINE]: false,
    [CONCORDIA_ENVELOPE]: false,
    [SHOW_UNINCLUDED]: true,
  }

  const Feature = topsoil.Feature;
  const layers = [
    Feature.POINTS, 
    [ Feature.ELLIPSES, Feature.ERROR_BARS ], 
    [ Feature.CONCORDIA, Feature.EVOLUTION ],
  ];

  return new topsoil.ScatterPlot(
    document.getElementById("scatter-plot"),
    data,
    options,
    layers
  );
}

const plot = makePlot();
Object.values(topsoil.Option).forEach(option => {
  const element = document.getElementById(option);
  if (element && plot.options[option]) {
    if (element.type === "checkbox") element.checked = plot.options[option];
    else element.value = plot.options[option];
  }
});

const SPLIT_SIZES_KEY = "topsoil-js_SCATTER-PLOT-DEMO_split-sizes";

const sizes = sessionStorage.getItem(SPLIT_SIZES_KEY);
const split = Split(["#scatter-plot", "#options-panel"], {
  direction: "horizontal",
  sizes: sizes ? JSON.parse(sizes) : [70, 30],
  minSize: [0, 350],
  onDrag: (_) => plot.resize(),
  onDragEnd: (sizes) => {
    sessionStorage.setItem(SPLIT_SIZES_KEY, JSON.stringify(sizes));
  },
});
window.addEventListener("resize", () => plot.resize());
plot.resize();

function setOption(event) {
  const control = event.target;
  const option = topsoil.Option[control.name.toUpperCase()];
  let value;
  if (control.type === "checkbox") value = Boolean(control.checked);
  else value = control.value;
  plot.options = Object.assign(plot.options, { [option]: value });
}

function absToPercent(row, srcMultiplier = 1) {
  const { X, SIGMA_X, Y, SIGMA_Y } = topsoil.Variable;
  if (SIGMA_X in row) row[SIGMA_X] = row[X] * ((row[SIGMA_X] / srcMultiplier) / 100);
  if (SIGMA_Y in row) row[SIGMA_Y] = row[Y] * ((row[SIGMA_Y] / srcMultiplier) / 100);
}
