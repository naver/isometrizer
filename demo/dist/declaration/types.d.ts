import Orientation from "./utils/orientation";
export interface IsoOptions {
    spacing: number;
    orientation: number;
}
export interface IsoProgres {
    normal: number;
    side: number;
    scale: number;
    float: number;
    childNormal: number;
    childSide: number;
}
export interface Oriented {
    readonly orientation: Orientation;
}
