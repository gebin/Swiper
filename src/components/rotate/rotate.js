/**
 * 旋转按钮
 */
import $ from '../../utils/dom';
import Utils from '../../utils/utils';

const Rotate = { 
  init() {
    const swiper = this;
    const params = swiper.params.rotate;
    if (!(params.nextEl || params.prevEl)) return;

    let $nextEl;
    let $prevEl;

    if (params.nextEl) {
      $nextEl = $(params.nextEl);
      if (
        swiper.params.uniqueNavElements &&
        typeof params.nextEl === 'string' &&
        $nextEl.length > 1 &&
        swiper.$el.find(params.nextEl).length === 1
      ) {
        $nextEl = swiper.$el.find(params.nextEl);
      }
    }

    if (params.prevEl) {
      $prevEl = $(params.prevEl);
      if (
        swiper.params.uniqueNavElements &&
        typeof params.prevEl === 'string' &&
        $prevEl.length > 1 &&
        swiper.$el.find(params.prevEl).length === 1
      ) {
        $prevEl = swiper.$el.find(params.prevEl);
      }
    }

    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        var currentSlideImage = $(swiper.slides[swiper.activeIndex]).find('img');
        swiper.rotate.currentAngle = swiper.rotate.currentAngle + 90;
        currentSlideImage.transition(400).transform(`translate3d(0,0,0) scale(${swiper.zoom.currentScale}) rotateZ(${swiper.rotate.currentAngle}deg)`);
        return false;
      });
    }
    
    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        var currentSlideImage = $(swiper.slides[swiper.activeIndex]).find('img');
        swiper.rotate.currentAngle = swiper.rotate.currentAngle - 90; 
        currentSlideImage.transition(400).transform(`translate3d(0,0,0) scale(${swiper.zoom.currentScale}) rotateZ(${swiper.rotate.currentAngle}deg)`);
        return false;
      });
    }

    Utils.extend(swiper.rotate, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0],
    });
  },
  destroy() {
    const swiper = this;
    const { $nextEl, $prevEl } = swiper.rotate;
    if ($nextEl && $nextEl.length) {
      $nextEl.off('click');
    }
    if ($prevEl && $prevEl.length) {
      $prevEl.off('click');
    }
  },
  onTransitionEnd() {
    const swiper = this;
    const rotate = swiper.rotate;
    const currentIndex = (swiper.previousIndex === undefined) ? swiper.activeIndex : swiper.previousIndex;

    if (swiper.previousIndex !== swiper.activeIndex) {
      rotate.currentAngle = 0;
      var currentSlideImage = $(swiper.slides[currentIndex]).find('img');
      currentSlideImage.transition(400).transform('translate3d(0,0,0) scale(1) rotateZ(0)');
    }
  },
};

export default {
  name: 'rotate',
  params: {
    rotate: {
      enabled: true,
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      hiddenClass: 'swiper-button-hidden',
    },
  },
  create() {
    const swiper = this;
    Utils.extend(swiper, {
      rotate: {
        enabled: true,
        currentAngle : 0,
        // angle : 0,
        init: Rotate.init.bind(swiper), 
        destroy: Rotate.destroy.bind(swiper),
        onTransitionEnd: Rotate.onTransitionEnd.bind(swiper),
      },
    });
  },
  on: {
    init() {
      const swiper = this;
      swiper.rotate.init(); 
    }, 
    destroy() {
      const swiper = this;
      swiper.rotate.destroy();
    },
    click(e) {
      const swiper = this;
      const { $nextEl, $prevEl } = swiper.rotate;
      if (
        swiper.params.rotate.hideOnClick &&
        !$(e.target).is($prevEl) &&
        !$(e.target).is($nextEl)
      ) {
        if ($nextEl) $nextEl.toggleClass(swiper.params.rotate.hiddenClass);
        if ($prevEl) $prevEl.toggleClass(swiper.params.rotate.hiddenClass);
      }
    }, 
    transitionEnd() {
      const swiper = this;
      if (swiper.rotate.enabled && swiper.params.rotate.enabled) {
        swiper.rotate.onTransitionEnd();
      }
    },
  },
};
