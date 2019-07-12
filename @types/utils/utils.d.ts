import Vector2D from "./vector2D";
export declare function cubicBezier(path: (string | number)[], p1: Vector2D | [number, number], p2: Vector2D | [number, number], p3: Vector2D | [number, number]): void;
export declare function moveTo(path: (string | number)[], p: Vector2D | [number, number]): void;
export declare function lineTo(path: (string | number)[], p: Vector2D | [number, number]): void;
export declare function close(path: (string | number)[]): void;
export declare function pluck<T>(maps: {
    [key: string]: any;
}[], key: string): number[];
