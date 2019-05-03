/*
Copyright 2019-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import IsoLayer from "./iso-layer";
import Orientation from "./utils/orientation";
import Transform from "./utils/transform";

import { getElement, wrapElement, toArray } from "./utils/helper";
import {
    SQRT_2,
    ISO_NONE, ISO_LEFT, ISO_RIGHT, ISO_HORIZONTAL, ISO_VERTICAL,
    ISO_DEFAULT_SPACING, ISO_DEFAULT_ORIENTATION,
} from "./constants";
import { IsoOptions, IsoProgres, Oriented } from "./types";

class Isometrizer implements Oriented {
    static get ISO_LEFT() { return ISO_LEFT; }
    static get ISO_RIGHT() { return ISO_RIGHT; }
    static get ISO_HORIZONTAL() { return ISO_HORIZONTAL; }
    static get ISO_VERTICAL() { return ISO_VERTICAL; }

    private _element: HTMLElement;
    private _wrapper: HTMLElement;
    private _prevProgress: IsoProgres;
    private _defaultSpacing: number;
    private _orientation: Orientation;
    private _layers: IsoLayer[];
    private _allLayers: IsoLayer[];

    public get orientation() { return this._orientation; }

    constructor(el: HTMLElement | string, options: IsoOptions = {
        spacing: ISO_DEFAULT_SPACING,
        orientation: ISO_DEFAULT_ORIENTATION,
    }) {
        this._element = getElement(el);

        this._prevProgress = {
            normal: 0,
            side: 0,
            scale: 0,
            float: 0,
            childNormal: 0,
            childSide: 0,
        };

        this._defaultSpacing = options.spacing || ISO_DEFAULT_SPACING;
        this._orientation = new Orientation(options.orientation || ISO_DEFAULT_ORIENTATION);

        this._wrapper = wrapElement(this._element);

        this._element.style.transformStyle = "preserve-3d";
        (this._wrapper.style as any).willChange = "transform";

        this._layers = this._findLayers();
        this._allLayers = this._getAllLayers();

        // Initialize
        this.off();
    }

    public on(): this {
        this.progress({
            normal: 1,
            side: 1,
            scale: 1,
            float: 1,
            childNormal: 1,
            childSide: 1,
        });
        return this;
    }

    public off(): this {
        this.progress({
            normal: 0,
            side: 0,
            scale: 0,
            float: 0,
            childNormal: 0,
            childSide: 0,
        });
        return this;
    }

    public progress(props = this._prevProgress): this {
        props.normal = props.normal || this._prevProgress.normal;
        props.side = props.side || this._prevProgress.side;
        props.scale = props.scale || this._prevProgress.scale;
        props.float = props.float || this._prevProgress.float;
        props.childNormal = props.childNormal || this._prevProgress.childNormal;
        props.childSide = props.childSide || this._prevProgress.childSide;

        const THRESHOLD = 0.001;

        if (props.normal < THRESHOLD) props.normal = 0;
        if (props.side < THRESHOLD) props.side = 0;
        if (props.scale < THRESHOLD) props.scale = 0;
        if (props.float < THRESHOLD) props.float = 0;
        if (props.childNormal < THRESHOLD) props.childNormal = 0;
        if (props.childSide < THRESHOLD) props.childSide = 0;

        const parentBbox = this._wrapper.getBoundingClientRect() as DOMRect;
        const originalBbox = this._element.getBoundingClientRect() as DOMRect;
        const maxBbox = {
            top: originalBbox.top,
            bottom: originalBbox.bottom,
            left: originalBbox.left,
            right: originalBbox.right,
        } as DOMRect;
        const calculatedScale = this._calcScale(props.scale);

        for (const layer of this._layers) {
            layer.progress(
                props.float,
                props.childNormal,
                props.childSide,
                calculatedScale,
                maxBbox,
            );
        }

        // 순서대로 프로퍼티 적용
        this._rotate({
            normal: props.normal,
            side: props.side,
            scale: props.scale,
        });

        for (const layer of this._allLayers) {
            layer.update();
        }

        this._resize(parentBbox, maxBbox);

        // Update prev values
        this._prevProgress.normal = props.normal;
        this._prevProgress.side = props.side;
        this._prevProgress.scale = props.scale;
        this._prevProgress.float = props.float;
        this._prevProgress.childNormal = props.childNormal;
        this._prevProgress.childSide = props.childSide;

        return this;
    }

    private _resize(originalBbox: DOMRect, maxBbox: DOMRect): void {
        maxBbox.width = maxBbox.right - maxBbox.left;
        maxBbox.height = maxBbox.bottom - maxBbox.top;

        const parentElement = this._wrapper;
        const marginTop = originalBbox.top - maxBbox.top;
        const marginBottom = maxBbox.bottom - originalBbox.bottom;
        const leftDiff = originalBbox.left - maxBbox.left;
        const rightDiff = maxBbox.right - originalBbox.right;

        const widthDiff = Math.max(leftDiff, 0) - Math.max(rightDiff, 0);
        const marginRight = Math.max(leftDiff + (rightDiff < 0 ? rightDiff : 0), 0);
        const marginLeft = Math.max(rightDiff + (leftDiff < 0 ? leftDiff : 0), 0);

        parentElement.style.marginRight = `${marginRight}px`;
        parentElement.style.marginLeft = `${marginLeft}px`;
        parentElement.style.marginTop = `${marginTop}px`;
        parentElement.style.marginBottom = `${marginBottom}px`;
        // parentElement.style.height = `${maxBbox.height}px`;
        parentElement.style.transform = `translateX(${widthDiff}px)`; // translateY(${heightDiff}px)`;
    }

    private _findLayers(): IsoLayer[] {
        const layers = [];

        for (const child of toArray(this._element.children)) {
            const layer = new IsoLayer(child as HTMLElement, this, this._defaultSpacing);

            layers.push(layer);
        }
        return layers;
    }

    private _getAllLayers(): IsoLayer[] {
        const layers: IsoLayer[] = [];

        for (const layer of this._layers) {
            layers.push(layer);
            layers.push(...layer.getAllChildLayers());
        }

        return layers;
    }

    private _rotate(props: {
        normal: number;
        side: number;
        scale: number;
    }): void {
        const normal = props.normal;
        const side = props.side;
        const scale = props.scale;

        const transform = new Transform(this._orientation, new Orientation(ISO_NONE));

        // Should be in order of scale -> rotate
        transform.setScale(this._calcScale(scale));
        transform.rotateTo({normal, side});

        this._element.style.transform = transform.toString();
    }

    private _calcScale(val: number): number {
        const maxScale = SQRT_2;
        const scaleAmount = 1 + val * (maxScale - 1);

        return scaleAmount;
    }
}

export default Isometrizer;
