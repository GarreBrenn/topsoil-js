import { dot, transpose } from "numeric";
import * as d3 from "d3";
import { ScatterPlot, Feature } from "../../plots";
import { cubicBezier, moveTo, lineTo, close, Vector2D } from "../../utils";

abstract class ConcordiaPlotFeature implements Feature {
  protected tickScale: d3.scale.Linear<number, number> = d3.scale.linear();

  constructor(readonly plot: ScatterPlot) {
  }

  abstract draw(): void;
  abstract undraw(): void;

  protected addConcordiaToPath(
    path: (string | number)[],
    concordia: ConcordiaFns | EnvelopeFn,
    startAge: number,
    endAge: number
  ) {
    // determine the step size using the number of pieces
    const pieces = 30;
    const stepSize = (endAge - startAge) / pieces;
    // build the pieces
    for (var i = 0; i < pieces; i++) {
      this.approximateSegment(
        path,
        concordia,
        startAge + (stepSize * i),
        startAge + (stepSize * (i + 1))
      );
    }
  }

  protected abstract approximateSegment(
    path: (string | number)[],
    concordia: ConcordiaFns | EnvelopeFn,
    startAge: number,
    endAge: number
  ): void;
}

export class WetherillConcordia extends ConcordiaPlotFeature {
  constructor(readonly plot: ScatterPlot) {
    super(plot);
  }

  draw(): void {
    const {
      x: { scale: xScale },
      y: { scale: yScale },
      options: {
        lambda_235,
        lambda_238,
        concordia_line_fill: lineFill,
        concordia_line_opacity: lineOpacity,
        concordia_envelope_fill: envelopeFill,
        concordia_envelope_opacity: envelopeOpacity
      }
    } = this.plot;

    let envelope = this.plot.featureLayer.select(".wetherill-envelope");
    if (envelope.empty()) {
      envelope = this.plot.featureLayer
        .append("path")
        .attr("class", "wetherill-envelope")
        .attr("stroke", "none")
        .attr("shape-rendering", "geometricPrecision");
    }

    let line = this.plot.featureLayer.select(".wetherill-line");
    if (line.empty()) {
      line = this.plot.featureLayer
        .append("path")
        .attr("class", "wetherill-line")
        .attr("fill", "none")
        .attr("shape-rendering", "geometricPrecision");
    }

    const wetherill = new WetherillFns(lambda_235, lambda_238);

    const xDomain = xScale.domain(),
      xMin = Math.max(0.0, xDomain[0]),
      xMax = Math.min(93.0, xDomain[1]),
      yDomain = yScale.domain(),
      yMin = Math.max(0.0, yDomain[0]),
      yMax = Math.min(2.05, yDomain[1]);

    const minAge = Math.max(
      newtonMethod(wetherill.x, xMin),
      newtonMethod(wetherill.y, yMin)
    );
    const maxAge = Math.min(
      newtonMethod(wetherill.x, xMax),
      newtonMethod(wetherill.y, yMax)
    );
    const upperMinAge = Math.max(
      newtonMethod(wetherill.upperEnvelope.x, xMin),
      newtonMethod(wetherill.upperEnvelope.y, yMin)
    );
    const upperMaxAge = Math.max(
      newtonMethod(wetherill.upperEnvelope.x, xMax),
      newtonMethod(wetherill.upperEnvelope.y, yMax)
    );
    const lowerMinAge = Math.min(
      newtonMethod(wetherill.lowerEnvelope.x, xMin),
      newtonMethod(wetherill.lowerEnvelope.y, yMin)
    );
    const lowerMaxAge = Math.min(
      newtonMethod(wetherill.lowerEnvelope.x, xMax),
      newtonMethod(wetherill.lowerEnvelope.y, yMax)
    );

    const startPoint = wetherill.vector(minAge).scaleBy(xScale, yScale);
    const endPoint = wetherill.vector(maxAge).scaleBy(xScale, yScale);

    // build the concordia line
    line
      .attr("d", () => {
        const path: (string | number)[] = [];
        moveTo(path, startPoint);
        this.addConcordiaToPath(path, wetherill, minAge, maxAge);
        return path.join("");
      })
      .attr("stroke", lineFill)
      .attr("opacity", lineOpacity || 1)
      .attr("stroke-width", 2);

    // build the uncertainty envelope
    envelope
      .attr("d", () => {
        const path: (string | number)[] = [];
        moveTo(
          path,
          wetherill.upperEnvelope
            .vector(upperMinAge)
            .scaleBy(xScale, yScale)
        );
        this.addConcordiaToPath(
          path,
          wetherill.upperEnvelope,
          upperMinAge,
          upperMaxAge
        );
        lineTo(
          path,
          wetherill.lowerEnvelope
            .vector(lowerMaxAge)
            .scaleBy(xScale, yScale)
        );
        this.addConcordiaToPath(
          path,
          wetherill.lowerEnvelope,
          lowerMaxAge,
          lowerMinAge
        );
        close(path);
        return path.join("");
      })
      .attr("fill", envelopeFill)
      .attr("opacity", envelopeOpacity || 1);

    const ageDistance = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));
    const tickValues = this.tickScale.domain([minAge, maxAge]).ticks(Math.max(3, Math.floor(ageDistance / 100)));

    const ticks = this.plot.featureLayer.selectAll(".wetherill-tick")
      .data(tickValues);
    ticks
      .enter()
      .append("circle")
      .attr("class", "wetherill-tick")
      .attr("r", 5)
      .style("stroke-width", 2)
      .style("stroke", "black")
      .style("fill", "white");
    ticks
      .attr("cx", tick => {
        return this.plot.x.scale(wetherill.x.calculate(tick));
      })
      .attr("cy", tick => {
        return this.plot.y.scale(wetherill.y.calculate(tick));
      });
    ticks
      .exit()
      .remove();

    const tickLabels = this.plot.featureLayer.selectAll(".wetherill-tick-label")
      .data(tickValues);
    tickLabels
      .enter()
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("class", "wetherill-tick-label");
    tickLabels
      .text(age => age / 1000000)
      .attr("x", age => xScale(wetherill.x.calculate(age)) + 12)
      .attr("y", age => yScale(wetherill.y.calculate(age)) + 5);
    tickLabels
      .exit()
      .remove();

  }

  undraw(): void {
    this.plot.featureLayer.selectAll(".wetherill-line").remove();
    this.plot.featureLayer.selectAll(".wetherill-envelope").remove();
    this.plot.featureLayer.selectAll(".wetherill-tick").remove();
    this.plot.featureLayer.selectAll(".wetherill-tick-label").remove();
  }

  protected approximateSegment(
    path: (string | number)[],
    concordia: ConcordiaFns | EnvelopeFn,
    startAge: number,
    endAge: number
  ): void {
    const ageRange = endAge - startAge;
    const p1 = concordia
      .vector(startAge)
      .plus(concordia.prime(startAge).times(ageRange / 3))
      .scaleBy(this.plot.x.scale, this.plot.y.scale);
    const p2 = concordia
      .vector(endAge)
      .minus(concordia.prime(endAge).times(ageRange / 3))
      .scaleBy(this.plot.x.scale, this.plot.y.scale);
    const p3 = concordia
      .vector(endAge)
      .scaleBy(this.plot.x.scale, this.plot.y.scale);

    cubicBezier(path, p1, p2, p3);
  }
}

export class TeraWasserburgConcordia extends ConcordiaPlotFeature {

  constructor(readonly plot: ScatterPlot) {
    super(plot);
  }

  draw(): void {
    const {
      x: { scale: xScale },
      y: { scale: yScale },
      options: {
        lambda_235,
        lambda_238,
        R238_235S,
        concordia_line_fill: lineFill,
        concordia_line_opacity: lineOpacity,
        concordia_envelope_fill: envelopeFill,
        concordia_envelope_opacity: envelopeOpacity
      }
    } = this.plot;

    let envelope = this.plot.featureLayer.select(".tw-envelope");
    if (envelope.empty()) {
      envelope = this.plot.featureLayer
        .append("path")
        .attr("class", "tw-envelope")
        .attr("stroke", "none")
        .attr("shape-rendering", "geometricPrecision");
    }

    let line = this.plot.featureLayer.select(".tw-line")
    if (line === null || line.empty()) {
      line = this.plot.featureLayer
        .append("path")
        .attr("class", "tw-line")
        .attr("fill", "none")
        .attr("shape-rendering", "geometricPrecision");
    }

    const teraWasserburg = new TeraWasserburgFns(
      lambda_235,
      lambda_238,
      R238_235S
    );

    const xDomain = xScale.domain(),
      xMin = Math.max(1, xDomain[0]),
      xMax = Math.min(6500, xDomain[1]),
      yDomain = yScale.domain(),
      yMin = Math.max(0.046, yDomain[0]),
      yMax = Math.min(0.625, yDomain[1]);

    const minAge = Math.max(
      this.constrainAge((Math.log1p(xMax) - Math.log(xMax)) / lambda_238),
      this.constrainAge(teraWasserburg.calculateDate(yMin, 0.0))
    );
    const maxAge = Math.min(
      this.constrainAge((Math.log1p(xMin) - Math.log(xMin)) / lambda_238),
      this.constrainAge(teraWasserburg.calculateDate(yMax, 0.0))
    );

    // const upperMinAge = Math.max(
    //   this.constrainAge(newtonMethodTW(teraWasserburg.upperEnvelope.x, xMin)),
    //   this.constrainAge(newtonMethodTW(teraWasserburg.upperEnvelope.y, yMin))
    // );

    // const upperMaxAge = Math.min(
    //   this.constrainAge(newtonMethodTW(teraWasserburg.upperEnvelope.x, xMax)),
    //   this.constrainAge(newtonMethodTW(teraWasserburg.upperEnvelope.y, yMax))
    // );
    // const lowerMinAge = Math.max(
    //   this.constrainAge(newtonMethodTW(teraWasserburg.lowerEnvelope.x, xMin)),
    //   this.constrainAge(newtonMethodTW(teraWasserburg.lowerEnvelope.y, yMin))
    // );
    // const lowerMaxAge = Math.min(
    //   this.constrainAge(newtonMethodTW(teraWasserburg.lowerEnvelope.x, xMax)),
    //   this.constrainAge(newtonMethodTW(teraWasserburg.lowerEnvelope.y, yMax))
    // );

    const startPoint = teraWasserburg.vector(minAge).scaleBy(xScale, yScale);
    const endPoint = teraWasserburg.vector(maxAge).scaleBy(xScale, yScale);

    line
      .attr("d", () => {
        const path: (string | number)[] = [];
        moveTo(path, startPoint);
        this.addConcordiaToPath(path, teraWasserburg, minAge, maxAge);
        return path.join("");
      })
      .attr("stroke", lineFill)
      .attr("stroke-width", 2)
      .attr("opacity", lineOpacity || 1);

    envelope
      .attr("d", () => {
        const path: (string | number)[] = [];
        moveTo(path, teraWasserburg.upperEnvelope.vector(minAge).scaleBy(xScale, yScale));
        this.addConcordiaToPath(path, teraWasserburg.upperEnvelope, minAge, maxAge);
        lineTo(path, teraWasserburg.lowerEnvelope.vector(maxAge).scaleBy(xScale, yScale));
        this.addConcordiaToPath(path, teraWasserburg.lowerEnvelope, maxAge, minAge);
        close(path);
        return path.join("");
      })
      .attr("fill", envelopeFill)
      .attr("opacity", envelopeOpacity || 1);

    const ageDistance = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));
    const tickValues = this.tickScale.domain([minAge, maxAge]).ticks(Math.max(3, Math.floor(ageDistance / 100)));

    const ticks = this.plot.featureLayer.selectAll(".tw-tick")
      .data(tickValues);
    ticks
      .exit()
      .remove();
    ticks
      .enter()
      .append("circle")
      .attr("class", "tw-tick")
      .attr("r", 5)
      .style("stroke-width", 2)
      .style("stroke", "black")
      .style("fill", "white");
    ticks
      .attr("cx", age => {
        return xScale(teraWasserburg.x.calculate(age));
      })
      .attr("cy", age => {
        return yScale(teraWasserburg.y.calculate(age));
      });
    

    const tickLabels = this.plot.featureLayer.selectAll(".tw-tick-label")
      .data(tickValues);
    tickLabels
      .exit()
      .remove();
    tickLabels
      .enter()
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("class", "tw-tick-label");
    tickLabels
      .text(age => age / 1000000)
      .attr("x", age => xScale(teraWasserburg.x.calculate(age)) + 12)
      .attr("y", age => yScale(teraWasserburg.y.calculate(age)) + 5);  
  }

  undraw(): void {
    this.plot.featureLayer.selectAll(".tw-line").remove();
    this.plot.featureLayer.selectAll(".tw-envelope").remove();
    this.plot.featureLayer.selectAll(".tw-tick").remove();
    this.plot.featureLayer.selectAll(".tw-tick-label").remove();
  }

  protected approximateSegment(
    path: (string | number)[],
    concordia: ConcordiaFns | EnvelopeFn,
    startAge: number,
    endAge: number
  ): void {
    if (startAge === endAge) return;
    const ageRange = endAge - startAge;
    const p1 = concordia
      .vector(startAge)
      .plus(concordia.prime(startAge).times(3 / ageRange))
      .scaleBy(this.plot.x.scale, this.plot.y.scale);
    const p2 = concordia
      .vector(endAge)
      .minus(concordia.prime(endAge).times(3 / ageRange))
      .scaleBy(this.plot.x.scale, this.plot.y.scale);
    const p3 = concordia
      .vector(endAge)
      .scaleBy(this.plot.x.scale, this.plot.y.scale);

    cubicBezier(path, p1, p2, p3);
  }

  private constrainAge(age: number) {
    return Math.max(1000000.0, Math.min(4544000000.0, age));
  }
};

function newtonMethod(fn: ComponentFn, shiftValue?: number): number {
  // bounce around until the derivative at x1 is nonzero
  let x0,
    x1 = 1;
  let derivative = fn.prime(x1);
  while (fn.prime(x1) === 0) {
    x1 += Math.random();
  }
  for (let i = 0; i < 200; i++) {
    x0 = x1;
    if (Math.abs(fn.prime(x0)) < Number.EPSILON) {
      break;
    }
    x1 -= (fn.calculate(x0) - shiftValue) / fn.prime(x0);
  }
  return x1;
}

abstract class ConcordiaFns {
  x: ComponentFn;
  y: ComponentFn;

  upperEnvelope: EnvelopeFn;
  lowerEnvelope: EnvelopeFn;

  protected Σ_λ: number[][];

  vector(age: number): Vector2D {
    return new Vector2D(this.x.calculate(age), this.y.calculate(age));
  }

  prime(age: number): Vector2D {
    return new Vector2D(this.x.prime(age), this.y.prime(age));
  }

  protected abstract J_xyλ(age: number): number[][];

  protected deltaX(age: number): number {
    return (
      2 *
      Math.cos(Math.atan(-this.x.prime(age) / this.y.prime(age))) *
      Math.sqrt(this.variance(age))
    );
  }

  protected deltaY(age: number): number {
    return (
      2 *
      Math.sin(Math.atan(-this.x.prime(age) / this.y.prime(age))) *
      Math.sqrt(this.variance(age))
    );
  }

  private variance(age: number): number {
    const I_2 = [[1, 0], [0, 1]],
          top = dot(dot(dot(dot(dot(I_2, this.v(age)), this.J_xyλ(age)), this.Σ_λ), transpose(this.J_xyλ(age))), this.v(age)) as number,
          bottom = dot(this.v(age), this.v(age)) as number;
    return top / bottom;
  }

  private v(age: number) {
    return [-this.y.prime(age), this.x.prime(age)];
  }
}

interface ComponentFn {
  calculate(age: number): number;
  prime(age: number): number;
}
interface EnvelopeFn {
  x: ComponentFn;
  y: ComponentFn;
  vector(age: number): Vector2D;
  prime(age: number): Vector2D;
}

class WetherillFns extends ConcordiaFns {
  constructor(private lambda235: number, private lambda238: number) {
    super();

    this.Σ_λ = [
      [Math.pow(lambda235 * 0.068031 / 100, 2), 0],
      [0, Math.pow(lambda238 * 0.053505 / 100, 2)]
    ];

    this.x = {
      calculate(age: number): number {
        return Math.exp(lambda235 * age) - 1;
      },
      prime(age: number): number {
        return lambda235 * Math.exp(lambda235 * age);
      }
    };

    this.y = {
      calculate(age: number): number {
        return Math.exp(lambda238 * age) - 1;
      },
      prime(age: number): number {
        return lambda238 * Math.exp(lambda238 * age);
      }
    };

    const xCalculate = this.x.calculate.bind(this),
          yCalculate = this.y.calculate.bind(this),
          deltaX = this.deltaX.bind(this),
          deltaY = this.deltaY.bind(this),
          xPrime = this.x.prime.bind(this),
          yPrime = this.y.prime.bind(this),
          prime = this.prime.bind(this);

    this.upperEnvelope = {
      x: {
        calculate(age: number): number {
          return xCalculate(age) - deltaX(age);
        },
        prime: xPrime
      },
      y: {
        calculate(age: number): number {
          return yCalculate(age) - deltaY(age);
        },
        prime: yPrime
      },
      vector(age: number): Vector2D {
        return new Vector2D(
          this.x.calculate(age),
          this.y.calculate(age)
        );
      },
      prime: prime
    };

    this.lowerEnvelope = {
      x: {
        calculate(age: number): number {
          return xCalculate(age) + deltaX(age);
        },
        prime: xPrime
      },
      y: {
        calculate(age: number): number {
          return yCalculate(age) + deltaY(age);
        },
        prime: yPrime
      },
      vector(age: number): Vector2D {
        return new Vector2D(
          this.x.calculate(age),
          this.y.calculate(age)
        );
      },
      prime: prime
    };
  }

  protected J_xyλ(age: number) {
    return [
      [age * Math.exp(this.lambda235 * age), 0],
      [0, age * Math.exp(this.lambda238 * age)]
    ];
  }
}

class TeraWasserburgFns extends ConcordiaFns {
  constructor(
    private lambda235: number,
    private lambda238: number,
    private r238_235s: number
  ) {
    super();

    this.Σ_λ = [
      [Math.pow(lambda235 * 0.068031 / 100, 2), 0],
      [0, Math.pow(lambda238 * 0.053505 / 100, 2)]
    ];

    this.x = {
      calculate(age: number): number {
        return 1 / (Math.exp(lambda238 * age) - 1);
      },
      prime(age: number): number {
        return -lambda238 * Math.exp(-lambda238 * age);
      }
    };
    this.y = {
      calculate(age: number): number {
        return (
          (1 / r238_235s) *
          ((Math.exp(lambda235 * age) - 1) / (Math.exp(lambda238 * age) - 1))
        );
      },
      prime(age: number): number {
        return (
          (lambda238 * Math.exp(lambda238 * age) -
            lambda235 * Math.exp(lambda235 * age) +
            (lambda235 - lambda238) * Math.exp((lambda235 + lambda238) * age)) /
          (Math.pow(Math.exp(lambda238 * age) - 1, 2) * r238_235s)
        );
      }
    };

    const xCalculate = this.x.calculate.bind(this),
          yCalculate = this.y.calculate.bind(this),
          deltaX = this.deltaX.bind(this),
          deltaY = this.deltaY.bind(this),
          xPrime = this.x.prime.bind(this),
          yPrime = this.y.prime.bind(this),
          prime = this.prime.bind(this);

    this.upperEnvelope = {
      x: {
        calculate(age: number): number {
          return xCalculate(age) - deltaX(age);
        },
        prime: xPrime
      },
      y: {
        calculate(age: number): number {
          return yCalculate(age) - deltaY(age);
        },
        prime: yPrime
      },
      vector(age: number): Vector2D {
        return new Vector2D(
          this.x.calculate(age),
          this.y.calculate(age)
        );
      },
      prime: prime
    };

    this.lowerEnvelope = {
      x: {
        calculate(age: number): number {
          return xCalculate(age) + deltaX(age);
        },
        prime: xPrime
      },
      y: {
        calculate(age: number): number {
          return yCalculate(age) + deltaY(age);
        },
        prime: yPrime
      },
      vector(age: number): Vector2D {
        return new Vector2D(
          this.x.calculate(age),
          this.y.calculate(age)
        );
      },
      prime: prime
    };
  }

  /* jacobian matrix for derivatives with respect to the lambdas
    Format of matrix:
    Row:0 Col:0 value is derivative of x with respect to lambda235
    Row:0 Col:1 value is derivative of x with respect to lambda238
    Row:1 Col:0 value is derivative of y with respect to lambda235
    Row:1 Col:1 value is derivative of y with respect to lambda238
  */
  protected J_xyλ(age: number) {
    return [
      [0, -age * Math.exp(-this.lambda238 * age)],
      [
        (age * Math.exp(this.lambda235 * age)) /
        ((Math.exp(this.lambda238 * age) - 1) * this.r238_235s),
        (-age *
          Math.exp(this.lambda238 * age) *
          (Math.exp(this.lambda235 * age) - 1)) /
        (Math.pow(Math.exp(this.lambda238 * age) - 1, 2) * this.r238_235s)
      ]
    ];
  }

  calculateDate(r207_206r: number, startDate: number): number {
    let xn = startDate;
    if (xn <= 0.0) {
      xn = 10.0e9 * (4.5695 - 5.3011 * Math.exp(-5.4731 * r207_206r));
    }
    let expLambda235xnMinus1, expLambda238xnMinus1, new10, new11;
    for (let i = 0; i < 35; i++) {
      expLambda235xnMinus1 = Math.expm1(this.lambda235 * xn);
      expLambda238xnMinus1 = Math.expm1(this.lambda238 * xn);

      new10 =
        (expLambda235xnMinus1 / expLambda238xnMinus1 / this.r238_235s) -
        r207_206r;
      new11 = ((this.r238_235s * expLambda238xnMinus1 * this.lambda235
        * (1.0 + expLambda235xnMinus1))
        - (expLambda235xnMinus1 * this.r238_235s * this.lambda238 * (1.0 + expLambda238xnMinus1)))
        / this.r238_235s
        / this.r238_235s
        / expLambda238xnMinus1
        / expLambda238xnMinus1;

      xn -= (new10 / new11);
    }
    return xn;
  }
}
