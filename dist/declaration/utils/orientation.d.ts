export default class Orientation {
    static fromString(orientationStr: string): Orientation;
    private _val;
    constructor(val: number);
    readonly isLeft: boolean;
    readonly isRight: boolean;
    readonly isHorizontal: boolean;
    readonly isVertical: boolean;
    readonly isSide: boolean;
    readonly isNormal: boolean;
    readonly normal: Orientation;
    readonly side: Orientation;
    checkMutualExclusion(): void;
    has(other: Orientation): boolean;
    match(other: Orientation): boolean;
    merge(other: Orientation): void;
}
