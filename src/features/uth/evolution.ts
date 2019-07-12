import { ScatterPlot, Feature } from "../../plots";
import { add, sub, mul, div, dot } from "numeric";
import { pluck, moveTo, cubicBezier } from "../../utils";

const INF = Number.MAX_VALUE;
const isochronAges = [
  25000,
  50000,
  75000,
  100000,
  150000,
  200000,
  300000,
  INF
];
const ar48iContourValues = [
  0,
  0.25,
  0.5,
  0.75,
  1,
  1.25,
  1.5,
  1.75,
  2.0,
  2.25
];

type Isochron = {
  age: number;
  yIntercept: number;
  slope: number;
  xMin: number;
  yMin: number;
}

export class EvolutionMatrix implements Feature {

  constructor(readonly plot: ScatterPlot) {
  }

  draw(): void {

    const {
      lambda_230,
      lambda_234,
      lambda_238
    } = this.plot.options;

    const mxp = new EvolutionFns(lambda_230, lambda_234, lambda_238);

    const isochrons: Isochron[] = isochronAges.map(age => {
      if (age === INF) {
        return {
          age,
          slope: lambda_230 / lambda_234 - 1,
          yIntercept: lambda_238 / (lambda_230 - lambda_238),
          xMin: mxp.QUTh[2][0] / mxp.QUTh[0][0],
          yMin: mxp.QUTh[1][0] / mxp.QUTh[0][0]
        };
      } else {
        const mxpNegAt = mxp.UTh(-age),
          mxpAt = mxp.UTh(age),
          mxpAtMin = dot(mxpAt, [1, 0, 0]) as number[],
          x = (-mxpAt[2][0]) / mxpAt[2][1];
        return {
          age,
          slope: -mxpNegAt[2][2] / mxpNegAt[2][1],
          yIntercept: dot(mxp.UTh_4(age), [1, x, 0]) as number,
          xMin: mxpAtMin[2] / mxpAtMin[0],
          yMin: mxpAtMin[1] / mxpAtMin[0]
        }
      }
    });

    const nts = 10,
      tv = repmat(linspace(0, 1e6, nts - 1).concat([2e6]), ar48iContourValues.length, 1),
      xy = zeros3d(ar48iContourValues.length, 2, nts),
      dardt = zeros3d(ar48iContourValues.length, 2, nts);

    ar48iContourValues.forEach((contour, i) => {
      tv[i].forEach((t, j) => {
        const n0 = [1, contour * lambda_238 / lambda_234, 0],
          nt = dot(mxp.UTh(t), n0) as number[];

        xy[i][0][j] = nt[2] / nt[0] * lambda_230 / lambda_238;
        xy[i][1][j] = nt[1] / nt[0] * lambda_234 / lambda_238;

        const dar48dnt1 = -nt[1] / nt[0] / nt[0] * lambda_234 / lambda_238,
          dar48dnt2 = 1 / nt[0] * lambda_234 / lambda_238,
          dar48dnt3 = 0,
          dar08dnt1 = -nt[2] / nt[0] / nt[0] * lambda_230 / lambda_238,
          dar08dnt2 = 0,
          dar08dnt3 = 1 / nt[0] * lambda_230 / lambda_238;

        const dardnt = [[dar08dnt1, dar08dnt2, dar08dnt3], [dar48dnt1, dar48dnt2, dar48dnt3]],
          dntdt = dot(dot(mxp.A, mxp.UTh(t)), n0),
          dotProduct = dot(dardnt, dntdt) as number[];

        dardt[i][0][j] = dotProduct[0];
        dardt[i][1][j] = dotProduct[1];
      });
    });

    const contourXLimits = dot(this.plot.x.scale.domain(), lambda_238 / lambda_230) as number[],
      contourYLimits = dot(this.plot.y.scale.domain(), lambda_238 / lambda_234) as number[];

    const slopes = pluck(isochrons, "slope"),
      yIntercepts = pluck(isochrons, "yIntercept");

    const L = add(yIntercepts, dot(slopes, contourXLimits[0]) as number[]),
      R = add(yIntercepts, dot(slopes, contourXLimits[1]) as number[]),
      B = div(sub(contourYLimits[0], yIntercepts), slopes),
      T = div(sub(contourYLimits[1], yIntercepts), slopes);

    let xEndpoints = [
      add(mul(dot(contourXLimits[0], ones(isochrons.length)) as number[], gt(L, contourYLimits[0])), mul(B, le(L, contourYLimits[0]))),
      add(mul(dot(contourXLimits[1], ones(isochrons.length)) as number[], lt(R, contourYLimits[1])), mul(T, ge(R, contourYLimits[1])))
    ];
    let yEndpoints = [
      add(mul(L, gt(L, contourYLimits[0])), mul(dot(contourYLimits[0], ones(isochrons.length)) as number[], le(L, contourYLimits[0]))),
      add(mul(R, lt(R, contourYLimits[1])), mul(dot(contourYLimits[1], ones(isochrons.length)) as number[], ge(R, contourYLimits[1])))
    ]

    // if endpoints extend beyond min possible (n0 = [1 0 0]), truncate them further
    xEndpoints[0] = xEndpoints[0].map((x, i) => Math.max(x, isochrons[i].xMin));  // since isochrons have positive slope, use maximum
    yEndpoints[0] = yEndpoints[0].map((y, i) => Math.max(y, isochrons[i].yMin));

    // transform into activity ratios, svg plot canvas coordinates
    xEndpoints = mul(xEndpoints, lambda_230 / lambda_238);
    yEndpoints = mul(yEndpoints, lambda_234 / lambda_238);

    const xScale = this.plot.x.scale,
          yScale = this.plot.y.scale;

    const isochronLines = this.plot.featureLayer.selectAll(".matrix-isochron")
      .data(isochrons);
    isochronLines.enter()
      .append("line")
      .attr("class", "matrix-isochron")
      .attr("stroke", "red");
    isochronLines
      .attr("x1", (isochron, i) => xScale(xEndpoints[0][i]))
      .attr("y1", (isochron, i) => yScale(yEndpoints[0][i]))
      .attr("x2", (isochron, i) => xScale(xEndpoints[1][i]))
      .attr("y2", (isochron, i) => yScale(yEndpoints[1][i]));
    isochronLines.exit()
      .remove();

    const contourPaths = this.plot.featureLayer.selectAll(".matrix-contour")
      .data(ar48iContourValues);
    contourPaths.enter()
      .append('path')
      .attr('class', 'matrix-contour')
      .attr('fill', 'none')
      .attr('stroke', 'blue');
    contourPaths
      .attr("d", (contour, i) => {
        const path: (string | number)[] = [];
        moveTo(path, [xScale(xy[i][0][0]), yScale(xy[i][1][0])]);
        for (let j = 1; j < nts; j++) {
          const deltaTOver3 = (tv[i][j] - tv[i][j - 1]) / 3,
                p1 = [
                  xScale(xy[i][0][j - 1] + deltaTOver3 * dardt[i][0][j - 1]),
                  yScale(xy[i][1][j - 1] + deltaTOver3 * dardt[i][1][j - 1])
                ] as [number, number],
                p2 = [
                  xScale(xy[i][0][j] - deltaTOver3 * dardt[i][0][j]),
                  yScale(xy[i][1][j] - deltaTOver3 * dardt[i][1][j])
                ] as [number, number],
                p3 = [
                  xScale(xy[i][0][j]),
                  yScale(xy[i][1][j])
                ] as [number, number];
          cubicBezier(path, p1, p2, p3);
        }
        return path.join("");
      });
    contourPaths
      .exit()
      .remove();
    
  }

  undraw(): void {
    this.plot.featureLayer.selectAll(".matrix-isochron").remove()
    this.plot.featureLayer.selectAll(".matrix-contour").remove();
  }

}

class EvolutionFns {

  readonly A: number[][];
  readonly QUTh: number[][];
  readonly QinvUTh: number[][];

  constructor(private lambda230: number, private lambda234: number, private lambda238: number) {
    this.A = [
      [-lambda238, 0, 0],
      [lambda238, -lambda234, 0],
      [0, lambda234, -lambda230]
    ];

    this.QUTh = [
      [((lambda230 - lambda238) * (lambda234 - lambda238)) / (lambda234 * lambda238), 0, 0],
      [(lambda230 - lambda238) / lambda234, (lambda230 - lambda234) / lambda234, 0],
      [1, 1, 1]
    ];

    this.QinvUTh = [
      [(lambda234 * lambda238) / ((lambda230 - lambda238) * (lambda234 - lambda238)), 0, 0],
      [-(lambda234 * lambda238) / ((lambda230 - lambda234) * (lambda234 - lambda238)), lambda234 / (lambda230 - lambda234), 0],
      [(lambda234 * lambda238) / ((lambda230 - lambda234) * (lambda230 - lambda238)), -lambda234 / (lambda230 - lambda234), 1]
    ];
  }

  GUTh(age: number): number[][] {
    return this.diag(Math.exp(-this.lambda238 * age), Math.exp(-this.lambda234 * age), Math.exp(-this.lambda230 * age));
  }

  UTh(age: number): number[][] {
    return dot(dot(this.QUTh, this.GUTh(age)), this.QinvUTh) as number[][];
  }

  UTh_0(age: number): number[][] {
    // For the 230 concentration only (to solve for root)
    return dot(dot(this.QUTh[2], this.GUTh(age)), this.QinvUTh) as number[][];
  }

  UTh_4(age: number): number[][] {
    // For the 234 concentration only (to solve for root)
    return dot(dot(this.QUTh[1], this.GUTh(age)), this.QinvUTh) as number[][];
  }

  private diag(x: number, y: number, z: number): number[][] {
    return [
      [x, 0, 0],
      [0, y, 0],
      [0, 0, z]
    ];
  }
}

function zeros3d(d1: number, d2: number, d3: number): number[][][] {
  const matrix: number[][][] = [];
  for (let i = 0; i < d1; i++) {
    matrix.push(zeros2d(d2, d3));
  }
  return matrix;
}
function zeros2d(d1: number, d2: number): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < d1; i++) {
    matrix.push(zeros1d(d2));
  }
  return matrix;
}
function zeros1d(d1: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < d1; i++) {
    arr.push(0);
  }
  return arr;
}

function ones(length: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(1);
  }
  return arr;
}

function any(arr: number[]) {
  return arr.reduce((prev, curr) => {
    return prev || curr === 1;
  }, false);
}

function mean(arr: number[]) {
  let mean = 0;
  for (let i = 0; i < arr.length; i++) {
    mean += arr[i];
  }
  return mean / arr.length;
}

// function find(arr: number[]): number[] {
//   const result: number[] = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] !== 0) {
//       result.push(i);
//     }
//   }
//   return result;
// }

function select(indexes: number[], arr: number[]): number[] {
  const result: number[] = [];
  indexes.forEach(i => {
    result.push(arr[i]);
  });
  return result;
}

function fzero(fn: (x: number) => number, x0: number) {
  const epsilon = 0.0001;
  const df = (x: number) => {
    return (fn(x + epsilon) - fn(x)) / epsilon;
  }

  let x = x0;
  for (let i = 0; i < 100; i++) {
    const decrement = fn(x) / df(x);
    if (decrement === Infinity || isNaN(decrement)) {
      break;
    }
    x -= decrement;
  }
  return x;
}

function repmat(mat: number[], rows: number, cols: number): number[][] {
  const result: number[][] = [];

  for (let i = 0; i < rows; i++) {
    result.push([]);
    for (let j = 0; j < cols; j++) {
      result[i] = result[i].concat(mat);
    }
  }
  return result;
}

function linspace(x1: number, x2: number, n: number): number[] {
  const arr: number[] = [];
  const interval = (x2 - x1) / (n - 1);
  for (let i = 0; i < n; i++) {
    arr.push(x1 + (i * interval));
  }
  return arr;
}

function max(a: number, b: number[]): number[] {
  const result: number[] = [];
  b.forEach(value => {
    result.push((a > value) ? a : value);
  });
  return result;
}

function indicatorCompare(fn: (a: number, b: number) => boolean): (arr: number[], value: number) => number[] {
  return (arr: number[], value: number): number[] => {
    const result: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(fn(arr[i], value) ? 1 : 0)
    }
    return result;
  }
}

const ge = indicatorCompare((a: number, b: number): boolean => {
  return a >= b;
});
const gt = indicatorCompare((a: number, b: number): boolean => {
  return a > b;
});
const le = indicatorCompare((a: number, b: number): boolean => {
  return a <= b;
});
const lt = indicatorCompare((a: number, b: number): boolean => {
  return a < b;
});