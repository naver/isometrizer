const isometrizer = new Isometrizer("#isometrizer", {
	spacing: 120,
	orientation: Isometrizer.ISO_VERTICAL | Isometrizer.ISO_RIGHT,
});

var opened = false;
var opening = false;
const images = document.getElementsByTagName("img");
const wrappers = document.getElementsByClassName("img-wrapper");

const complete = () => {
	if (!opened) {
		for (const image of wrappers) {
			image.classList.toggle("open");
		}
	}
	opened = !opened;
	opening = false;
}

var openTimeline = new mojs.Timeline({
	onComplete: complete,
}).add(
    new mojs.Tween({
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
    })
)

var closeTimeline = new mojs.Timeline({
	onComplete: complete,
}).add(
    new mojs.Tween({
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
    })
)

for (const wrapper of wrappers) {
	wrapper.onclick = () => {
		if (opening) return;
		opening = true;

		if (opened) {
			for (const image of wrappers) {
				image.classList.toggle("open");
			}
		}

		if (!opened) {
			openTimeline.play();
		} else {
            isometrizer.off();
			closeTimeline.play();
		}
	}
}
