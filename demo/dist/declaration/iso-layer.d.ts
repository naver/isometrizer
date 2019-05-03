import Orientation from "./utils/orientation";
import { Oriented } from "./types";
declare class IsoLayer implements Oriented {
    private _wrapper;
    private _element;
    private _parent;
    private _childs;
    private _panels;
    private _orientation;
    private _transform;
    private _isWrapper;
    private _isLeaf;
    private _spacing;
    readonly orientation: Orientation;
    constructor(el: HTMLElement, parent: Oriented, defaultSpacing: number);
    readonly wrapper: HTMLElement;
    progress(float: number, normal: number, side: number, scale: number, maxBbox: ClientRect): void;
    update(): void;
    addParallelLayer(layer: IsoLayer): void;
    getAllChildLayers(): IsoLayer[];
    private _makePanel;
    private _findChilds;
    private _shouldTraverse;
    private _setTransformOrigin;
}
export default IsoLayer;
