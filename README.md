# Isometrizer
Isometrizer turns your DOM elements into isometric projection

![MAP DEMO](./asset/map.gif)

# Introduction

Isometrizer is a Javascript library that has features like

- 4 projection types combining
  - `ISO_VERTICAL` or `ISO_HORIZONTAL`
  - `ISO_LEFT` or `ISO_RIGHT`
- Hierarchical flotation of childs
- Rotating specific child
- Side / Top plane drawing

# Quick Start
```js
new Isometrizer(
    el: HTMLElement | string,
    options: {
        spacing: number,
        orientation: number
    }
)
```
- `el` is an DOM element itself or element query string.
- `options` consists of:
    - `spacing`: Default spacing for child floatation, in px. (default: 40)
    - `orientation`: Element rotate direction. (default: ISO_VERTICAL | ISO_RIGHT)

### Example
```js
const isometrizer = new Isometrizer("#iso", {
    spacing: 80,
    orientation: Isometrizer.ISO_HORIZONTAL | Isometrizer.ISO_LEFT
});
```

# Methods
Instance of `Isometrizer` provides 3 methods you can use.

#### `on()`
Immediately turns into isometric projection.

#### `off()`
Immediately turns into original projection.

#### `progress(props)`
Progressively turns into isometric projection.

You can combine other libraries like [mojs](https://github.com/legomushroom/mojs), or use `requestAnimationFrame()` to animate projection change.

##### props
All following props are from `0`(off) to `1`(on)
- `normal`: rotate direction `ISO_HORIZONTAL` or `ISO_VERTICAL`
- `side`: rotate direction `ISO_LEFT` or `ISO_RIGHT`
- `scale`: scales from 1 to sqrt(2)
- `float`: floats all childs from 0 to their own spacing
- `childNormal`: rotate direction `ISO_HORIZONTAL` or `ISO_VERTICAL` of childs
- `childSide`: rotate direction `ISO_LEFT` or `ISO_RIGHT` of childs

# DOM Attributes
You can set some attributes per child to manipulate it. Following are available attributes you can set.

#### Child Floating
- `iso-spacing={number}`: Set spacing value from its parent for this element.
- `iso-wrap-spacing={number}`: Set spacing value from its parent for this element, and stop traversing its children to improve performance.
- `iso-no-spacing`: Set spacing valye from its parent to 0, and stop traversing its children to improve performance.

#### Child Rotating
- `iso-rotation="vertical | horizontal | left | right"`: Set projection type for this element. Value can be `vertical`, `horizontal`, `left`, `right`, and can be combined with `"|"`
  - So, values can be like `"vertical"`, `"right"`, `"horizontal | right"`

#### Side panels
Setting any of values below will create Top / Side panels.
- `iso-top-background={string}`: Set css `background` property for top plane. You can set color for it like `"#FFFFFF"`, or image like `"url(/images/some_image.png)"`
- `iso-side-background={string}`: Same with `iso-top-background`, but for side panel.
- `iso-side-length={number}`: Set Top / Side panel's length, in px.

#### DOM structure
- `iso-parallel`: Transform parallel DOM structure into nested structure.
```html
<div iso-parallel>
    <div>1</div>
    <div>2</div>
    <div>3</div>
</div>
```
Above DOM structure will turn into
```html
<div iso-parallel>
    <div>
        1
        <div>
            2
            <div>
                3
            </div>
        </div>
    </div>
</div>
```

# Contributing
This project uses [gitmoji](https://gitmoji.carloscuesta.me/), try using it!

## Installing
```
npm install
```

## Running the tests
### Linting
```
npm run lint
```

## Building
```
npm run build
npm run demo:build
```
