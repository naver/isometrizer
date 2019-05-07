const isometrizer = new Isometrizer("#isometrizer", {
	spacing: 50,
	orientation: Isometrizer.ISO_VERTICAL | Isometrizer.ISO_RIGHT,
});

const controls = {
    rotateV90: new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                normal: progress,
                side: progress * 2,
            })
        }
    }),

    rotateAll: new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                normal: progress,
                side: progress,
            })
        }
    }),

    unrotateAll: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                normal: 1 - progress,
                side: 1 - progress,
            })
        }
    }),

    rotateH:  new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.quart.out,
        onUpdate: function (progress) {
            isometrizer.progress({
                normal: progress,
            })
        }
    }),

    rotateV: new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.quart.out,
        onUpdate: function (progress) {
            isometrizer.progress({
                side: progress,
            })
        }
    }),

    scaleAndFloat: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                scale: progress,
                float: progress
            })
        }
    }),

    rotateChildH: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                childNormal: progress,
            })
        }
    }),

    rotateChildV: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                childSide: progress,
            })
        }
    }),

    rotateChildAll: new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.quart.out,
        onUpdate: function (progress) {
            isometrizer.progress({
                childNormal: progress,
                childSide: progress,
            })
        }
    }),

    rotateChildAllAndFloat: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                childNormal: progress,
                childSide: progress,
                float: progress,
            })
        }
    }),

    float: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                float: progress,
            })
        }
    }),

    fastFloat: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.expo.out,
        onUpdate: function (progress) {
            isometrizer.progress({
                float: progress,
            })
        }
    }),

    unfloat: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                float: 1 - progress,
            })
        }
    }),

    unrotateAndUnfloat: new mojs.Tween({
        duration: 1000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                normal: 1 - progress,
                side: 1 - progress,
                float: 1 - progress,
            })
        }
    }),

    rotateAndScaleDown: new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                normal: progress,
                side: progress,
                scale: 1 - progress,
            })
        }
    }),

    scaleUp: new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                scale: progress
            })
        }
    }),

    allAtOnce: new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.expo.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                normal: progress,
                side: progress,
                scale: progress,
                float: progress,
                childNormal: progress,
                childSide: progress,
            })
        }
    }),

    reverse: new mojs.Tween({
        duration: 2000,
        easing: mojs.easing.quart.inout,
        onUpdate: function (progress) {
            isometrizer.progress({
                normal: 1 - progress,
                side: 1 - progress,
                scale: 1 - progress,
                float: 1 - progress,
                childNormal: 1 - progress,
                childSide: 1 - progress,
            })
        }
    }),
};

const timeline = new mojs.Timeline()
    .add(controls.rotateAll)
    .append(controls.scaleUp)
    .append(controls.rotateChildH)
    .append(controls.rotateChildV)
    .append(controls.float)

timeline.play();
// isometrizer.on();

const sliders = document.getElementsByTagName("input");
for (const slider of sliders) {
	slider.oninput = () => {
		const valueObj = {};
		const id = slider.id;

		valueObj[id] = slider.value / 100;

		isometrizer.progress(valueObj);
	}
}
