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
import Transform from "./utils/transform";
import Orientation from "./utils/orientation";
import Panel from "./panel";
import {
    ISO_DEFAULT_SIDE_COLOR,
    ISO_DEFAULT_TOP_COLOR,
    ISO_HORIZONTAL,
    ISO_RIGHT,
    ISO_LEFT,
    ISO_VERTICAL,
} from "./constants";
import { wrapElement, toArray } from "./utils/helper";
import { Oriented } from "./types";

class IsoLayer implements Oriented {
    private _wrapper: HTMLElement;
    private _element: HTMLElement;
    private _parent: Oriented;
    private _childs: IsoLayer[];
    private _panels: Panel[];
    private _orientation: Orientation;
    private _transform: Transform;
    private _isWrapper: boolean;
    private _isLeaf: boolean;
    private _spacing: number;

    public get orientation() { return this._orientation; }

    constructor(el: HTMLElement, parent: Oriented, defaultSpacing: number) {
        this._element = el;
        this._parent = parent;
        this._childs = [];
        this._orientation = parent.orientation;

        const wrapSpacing = el.getAttribute("iso-wrap-spacing");

        this._isWrapper = (wrapSpacing !== null);
        this._isLeaf = (el.getAttribute("iso-no-spacing") !== null) || this._isWrapper;

        if (this._isWrapper) {
            this._spacing = Number(wrapSpacing) || defaultSpacing;
        } else if (!this._isLeaf) {
            const spacing = el.getAttribute("iso-spacing");

            this._spacing = spacing !== null ?
                Number(spacing) : defaultSpacing;
        } else {
            // no-spacing
            this._spacing = 0;
        }

        const rotations = el.getAttribute("iso-rotation");

        if (rotations !== null) {
            this._orientation = Orientation.fromString(rotations);
            if (!(this._orientation.isNormal)) {
                this._orientation.merge(parent.orientation.normal);
            }
            if (!(this._orientation.isSide)) {
                this._orientation.merge(parent.orientation.side);
            }
        }
        this._transform = new Transform(this._orientation, this._parent.orientation);

        this._wrapper = wrapElement(this._element, this._isLeaf);
        if (!this._isLeaf) {
            this._wrapper.style.transformStyle = "preserve-3d";
        }

        this._setTransformOrigin();

        if (this._shouldTraverse()) {
            this._findChilds(defaultSpacing);
        }

        if (this._childs.length <= 0) this._isLeaf = true;

        this._panels = this._makePanel();
    }

    get wrapper() { return this._wrapper; }

    public progress(float: number, normal: number, side: number, scale: number, maxBbox: ClientRect) {
        this._transform.reset();
        this._transform.setFloat(float * this._spacing);
        if (!this._orientation.match(this._parent.orientation)) {
            this._transform.rotateTo({
                normal,
                side,
            });
        }

        const additionalOffset = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };

        for (const panel of this._panels) {
            panel.progress(float, scale, this._orientation);

            const panelOffset = panel.offset;

            additionalOffset.top = additionalOffset.top || panelOffset.top;
            additionalOffset.bottom = additionalOffset.bottom || panelOffset.bottom;
            additionalOffset.left = additionalOffset.left || panelOffset.left;
            additionalOffset.right = additionalOffset.right || panelOffset.right;
        }

        const bbox = this._element.getBoundingClientRect();

        if (bbox.top - additionalOffset.top < maxBbox.top) {
            maxBbox.top = bbox.top - additionalOffset.top;
        }
        if (bbox.bottom + additionalOffset.bottom > maxBbox.bottom) {
            maxBbox.bottom = bbox.bottom + additionalOffset.bottom;
        }
        if (bbox.left - additionalOffset.left < maxBbox.left) {
            maxBbox.left = bbox.left - additionalOffset.left;
        }
        if (bbox.right + additionalOffset.right > maxBbox.right) {
            maxBbox.right = bbox.right - additionalOffset.right;
        }

        for (const child of this._childs) {
            child.progress(float, normal, side, scale, maxBbox);
        }
    }

    public update() {
        const isFirefox = navigator.userAgent.indexOf("Firefox") > 0;

        if (!isFirefox) {
            if (this._isLeaf) {
                if (this._transform.changed) {
                    this._wrapper.style.transformStyle = "preserve-3d";
                } else {
                    this._wrapper.style.transformStyle = "flat";
                }
            }
        } else {
            this._wrapper.style.transformStyle = "preserve-3d";
        }

        this._wrapper.style.transform = this._transform.toString();
        for (const panel of this._panels) {
            panel.update();
        }
    }

    public addParallelLayer(layer: IsoLayer) {
        this._wrapper.appendChild(layer.wrapper);
        this._childs.push(layer);
    }

    public getAllChildLayers(): IsoLayer[] {
        const layers = [];

        for (const child of this._childs) {
            layers.push(child);
            layers.push(...child.getAllChildLayers());
        }

        return layers;
    }

    private _makePanel() {
        const element = this._element;
        const spacing = this._spacing;
        const orientation = this._orientation;

        let topBackground = element.getAttribute("iso-top-background");
        let sideBackground = element.getAttribute("iso-side-background");
        const sideLengthStr = element.getAttribute("iso-side-length");

        const hasPanel = topBackground !== null || sideBackground !== null || sideLengthStr !== null;

        const sideLength = sideLengthStr ? Number(sideLengthStr) : Number(spacing);

        const panels = [];

        if (hasPanel) {
            topBackground = topBackground || ISO_DEFAULT_TOP_COLOR;
            sideBackground = sideBackground || ISO_DEFAULT_SIDE_COLOR;

            const topPanelOrientation = orientation.isHorizontal ?
                new Orientation(ISO_HORIZONTAL | ISO_RIGHT) :
                new Orientation(ISO_HORIZONTAL | ISO_LEFT);

            const sidePanelOrientation = orientation.isLeft ?
                new Orientation(ISO_VERTICAL | ISO_RIGHT) :
                new Orientation(ISO_VERTICAL | ISO_LEFT);

            const topPanel = new Panel(element, sideLength, topPanelOrientation);
            const sidePanel = new Panel(element, sideLength, sidePanelOrientation);

            topPanel.background = topBackground;
            sidePanel.background = sideBackground;

            panels.push(topPanel);
            panels.push(sidePanel);
        }

        return panels;
    }

    private _findChilds(defaultSpacing: number) {
        const isParallel = (this._element.getAttribute("iso-parallel") !== null);

        if (!this._element.children[0]) return;

        if (isParallel) {
            let parentLayer = new IsoLayer(this._element.children[0] as HTMLElement, this, defaultSpacing);

            this._childs.push(parentLayer);

            while (this._element.children[1]) {
                const layer = new IsoLayer(this._element.children[1] as HTMLElement, parentLayer, defaultSpacing);

                parentLayer.addParallelLayer(layer);
                parentLayer = layer;
            }
        } else {
            for (const child of toArray(this._element.children)) {
                const layer = new IsoLayer(child as HTMLElement, this, defaultSpacing);

                this._childs.push(layer);
            }
        }
    }

    private _shouldTraverse() {
        const tag = this._element.tagName.toLowerCase();

        if (this._isWrapper) { return false; }
        if (this._isLeaf) { return false; }
        if (tag === "a") { return false; }
        if (tag === "iframe") { return false; }
        return true;
    }

    private _setTransformOrigin() {
        const orientation = this._orientation;
        const parentOrientation = this._parent.orientation;
        let xOrigin = 0;
        let yOrigin = 0;

        if (parentOrientation.isVertical && parentOrientation.isLeft) {
            xOrigin = 100;
        }

        if (parentOrientation.isHorizontal) {
            if (orientation.isHorizontal) {
                xOrigin = 50;
                yOrigin = 50;
            } else {
                xOrigin = parentOrientation.isRight ? 100 : 0;
                yOrigin = 100;
            }
        }

        this._wrapper.style.transformOrigin = `${xOrigin}% ${yOrigin}%`;
    }
}

export default IsoLayer;
