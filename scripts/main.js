window.curSlide = 1;

function swiper(el, callback) {
    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 100,
        restraint = 200,
        allowedTime = 500,
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {
        }

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime()
        e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function (e) {
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX
        distY = touchobj.pageY - startY
        elapsedTime = new Date().getTime() - startTime
        if (elapsedTime <= allowedTime) {
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                swipedir = (distX < 0) ? 'left' : 'right'
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
                swipedir = (distY < 0) ? 'up' : 'down'
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}

function Timer(callback, delay) {
    let args = arguments,
        self = this,
        timer, start;

    this.clear = function () {
        clearTimeout(timer);
    };

    this.pause = function () {
        this.clear();
        delay -= new Date() - start;
    };

    this.resume = function () {
        start = new Date();
        timer = setTimeout(function () {
            callback.apply(self, Array.prototype.slice.call(args, 2, args.length));
        }, delay);
    };

    this.resume();
}

const startInterval = function () {

    window.timer = new Timer(function () {
        changeSlide('forward');
    }, 4000);

    document.querySelector(`div.slider__line_${window.curSlide}`).classList.add('--active-slider');
};

window.addEventListener("load", () => {
    const burgerMenu = document.querySelector('a.burger-menu');
    burgerMenu.addEventListener('click', (event) => {
        event.preventDefault();
        const mobileMenu = document.querySelector('ul.mobile-menu');
        const body = document.querySelector('body');
        const burgerIcon = document.querySelector('.burger-icon');
        mobileMenu.classList.toggle('hidden');
        burgerIcon.classList.toggle('--close');
        body.classList.toggle('no-scroll');
    });

    document.querySelectorAll('.mobile-menu__link').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('ul.mobile-menu').classList.add('hidden');
            document.querySelector('.burger-icon').classList.remove('--close');
            document.querySelector('body').classList.remove('no-scroll');
        });
    })

    const arrowRight = document.querySelector('svg.arrow-right');
    arrowRight.addEventListener('click', (event) => {
        changeSlide('forward');
    });

    const arrowLeft = document.querySelector('svg.arrow-left');
    arrowLeft.addEventListener('click', (event) => {
        changeSlide('backward');
    });

    const slider = document.querySelector('div.slides');

    slider.addEventListener('touchstart', () => {
        console.log("slider touchstart")
        timer.pause();
        document.querySelector('.--active-slider').classList.add('animation-pause')
    })

    slider.addEventListener('touchend', () => {
        timer.resume();
        document.querySelector('.--active-slider').classList.remove('animation-pause')
    })

    swiper(slider, function (dir) {
        if (dir === 'right') changeSlide('backward');
        else if (dir === 'left') changeSlide('forward');
    })

    document.querySelectorAll('div.slider__item').forEach(function (el) {
        el.addEventListener('mouseenter', (event) => {
            event.stopPropagation();
            timer.pause();
            document.querySelector('.--active-slider').classList.add('animation-pause')
        });

        el.addEventListener('mouseleave', (event) => {
            timer.resume();
            document.querySelector('.--active-slider').classList.remove('animation-pause')
        });
    });

    startInterval();

});

window.addEventListener("resize", () => {
    document.querySelector('ul.mobile-menu').classList.add('hidden');
});


function changeSlide(dir = 'forward') {
    timer.clear();

    window.curSlide = (dir === 'forward') ? window.curSlide + 1 : window.curSlide - 1;
    if (window.curSlide === 0) window.curSlide = 3;
    else if (window.curSlide === 4) window.curSlide = 1;

    document.querySelectorAll('div.slider__item').forEach(function (el) {
        el.classList.remove('--visible');
    });

    document.querySelectorAll('div.slider__line').forEach(function (el) {
        el.classList.remove('--active-slider');
    });

    document.querySelector(`div.slide_${window.curSlide}`).classList.add('--visible');

    startInterval();
}
