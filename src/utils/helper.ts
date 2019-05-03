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
import {
    SELECTOR_NOT_SPECIFIED,
} from "../errors";

export const getElement = (queryOrElement: HTMLElement | string): HTMLElement => {
    if (typeof queryOrElement === "string") {
        return document.querySelector(queryOrElement) as HTMLElement;
    } else if (queryOrElement.nodeType > 0) {
        return queryOrElement;
    } else {
        throw new Error(SELECTOR_NOT_SPECIFIED);
    }
};

export const setWrapperSize = (element: HTMLElement, wrapper: HTMLElement) => {
    const bbox = element.getBoundingClientRect();

    wrapper.style.width = `${bbox.width}px`;
    wrapper.style.height = `${bbox.height}px`;
};

export const wrapElement = (element: HTMLElement, isLeaf: boolean = false): HTMLElement => {
    const wrapper = document.createElement("div");
    const elStyle = getComputedStyle(element);
    const isFirefox = navigator.userAgent.indexOf("Firefox") > 0;

    if (elStyle.position === "absolute" || elStyle.position === "fixed") {
        wrapper.style.position = elStyle.position;
        wrapper.style.top = elStyle.top;
        wrapper.style.left = elStyle.left;
    } else {
        wrapper.style.position = "relative";
    }

    if (elStyle.display !== "inline" &&
        elStyle.display !== "content" &&
        elStyle.display !== "unset") {
        wrapper.style.display = elStyle.display;
    }

    wrapper.style.backfaceVisibility = "hidden";
    wrapper.style.overflow = "visible";
    (wrapper.style as any).willChange = "transform";
    wrapper.style.pointerEvents = elStyle.pointerEvents;

    setWrapperSize(element, wrapper);

    element.parentElement!.replaceChild(wrapper, element);
    wrapper.appendChild(element);

    if (!isLeaf) {
        element.style.transformStyle = "preserve-3d";
    }
    element.style.overflow = "visible";
    if (!isFirefox) {
        (element.style as any).willChange = "transform";
    }
    element.style.position = "absolute";
    element.style.top = "0";
    element.style.left = "0";
    element.style.right = "0";

    return wrapper;
};

export interface ArrayLike<T> {
    length: number;
    [index: number]: T;
}

export function toArray<T>(iterable: ArrayLike<T>): T[] {
    return [].slice.call(iterable);
}
