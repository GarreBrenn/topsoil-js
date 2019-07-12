
import Vector2D from "./vector2D";

export function cubicBezier(
  path: (string | number)[],
  p1: Vector2D | [number, number],
  p2: Vector2D | [number, number],
  p3: Vector2D | [number, number]
): void {
  path.push(
    "C", p1[0], ",", p1[1],
    ",", p2[0], ",", p2[1],
    ",", p3[0], ",", p3[1]
  );
}

// utilities for generating path model elements
export function moveTo(path: (string | number)[], p: Vector2D | [number, number]) {
  path.push("M", p[0], ",", p[1]);
}

export function lineTo(path: (string | number)[], p: Vector2D | [number, number]) {
  path.push("L", p[0], ",", p[1]);
}

export function close(path: (string | number)[]) {
  path.push("Z");
}

export function pluck<T>(maps: { [key: string]: any }[], key: string) {
  var values = [maps.length];
  maps.forEach(function(m, i) {
    values[i] = m[key];
  });
  return values;
}
