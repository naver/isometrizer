const isometrizer = new Isometrizer("#isometrizer", {
	spacing: 0,
	orientation: Isometrizer.ISO_VERTICAL | Isometrizer.ISO_LEFT,
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

const movies = [
	'<iframe width="800" height="800" src="https://www.youtube.com/embed/K6BEcoM0zik?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
	'<iframe width="800" height="800" src="https://www.youtube.com/embed/wb49-oV0F78?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
	'<iframe width="800" height="800" src="https://www.youtube.com/embed/Vr_jR90k944?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
	'<iframe width="800" height="800" src="https://www.youtube.com/embed/Pcv0aoOlsLM?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
	'<iframe width="800" height="800" src="https://www.youtube.com/embed/t9QePUT-Yt8?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
	'<iframe width="800" height="800" src="https://www.youtube.com/embed/wrBEDEmUceM?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
];

let movieToPlay = movies[0];

const timeline = new mojs.Timeline({
	onComplete: () => {
		const movieLeft = document.getElementById("movie-left");

		movieLeft.innerHTML = movieToPlay;
	},
}).add(controls.rotateAll)
.append(controls.rotateChildAll)
.append(controls.float)

const imageWrapper = document.getElementById("movie-images");
const _movieImages = imageWrapper.getElementsByTagName("img");
const movieImages = []
for (const img of _movieImages) {
	movieImages.push(img);
}

for (const [index, img] of movieImages.entries()) {
	img.selected = false;

	img.onclick = () => {
		img.selected = true;
		movieToPlay = movies[index];
		img.classList.toggle("selected");
		for (const otherImage of movieImages) {
			otherImage.onclick = undefined;
			if (otherImage.selected) continue;

			otherImage.classList.toggle("disabled");
		}
		timeline.play();
	}
}
