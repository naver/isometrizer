import Orientation from "./utils/orientation";
import { IsoOptions, IsoProgres, Oriented } from "./types";
declare class Isometrizer implements Oriented {
    static readonly ISO_LEFT: number;
    static readonly ISO_RIGHT: number;
    static readonly ISO_HORIZONTAL: number;
    static readonly ISO_VERTICAL: number;
    private _element;
    private _wrapper;
    private _prevProgress;
    private _defaultSpacing;
    private _orientation;
    private _layers;
    private _allLayers;
    readonly orientation: Orientation;
    constructor(el: HTMLElement | string, options?: IsoOptions);
    on(): this;
    off(): this;
    progress(props?: IsoProgres): this;
    private _resize(originalBbox, maxBbox);
    private _findLayers();
    private _getAllLayers();
    private _rotate(props);
    private _calcScale(val);
}
export default Isometrizer;
