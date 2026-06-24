/**
 * carousel.js — 轮播图模块
 * 功能：自动播放、手动切换（上一张/下一张）、指示器点击跳转
 * 使用 ES6 class 封装
 */
class Carousel {
  /**
   * @param {string} trackSelector  - 轮播轨道 CSS 选择器
   * @param {string} indicatorSelector - 指示器容器 CSS 选择器
   * @param {number} interval   - 自动播放间隔（毫秒）
   */
  constructor(trackSelector, indicatorSelector, interval = 4000) {
    this.track = document.querySelector(trackSelector);
    this.slides = this.track ? this.track.children : [];
    this.indicators = document.querySelectorAll(`${indicatorSelector} span`);
    this.totalSlides = this.slides.length;
    this.currentIndex = 0;
    this.interval = interval;
    this.timer = null;
    this.isTransitioning = false;

    // 如果没有轮播项，直接返回
    if (this.totalSlides === 0) return;

    // 绑定按钮事件
    this.prevBtn = document.querySelector('.carousel-btn.prev');
    this.nextBtn = document.querySelector('.carousel-btn.next');

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPrev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToNext());
    }

    // 绑定指示器点击事件
    this.indicators.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // 鼠标悬停暂停自动播放
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
      carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    // 键盘支持（左右箭头）
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.goToPrev();
      if (e.key === 'ArrowRight') this.goToNext();
    });

    // 启动自动播放
    this.startAutoPlay();
  }

  /**
   * 切换到指定索引的幻灯片
   * @param {number} index - 目标索引
   */
  goToSlide(index) {
    // 边界检查和过渡锁
    if (this.isTransitioning) return;
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;
    if (index === this.currentIndex) return;

    this.isTransitioning = true;
    this.currentIndex = index;

    // 移动轨道
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // 更新指示器状态
    this.indicators.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });

    // 过渡结束后解锁
    const onTransitionEnd = () => {
      this.isTransitioning = false;
      this.track.removeEventListener('transitionend', onTransitionEnd);
    };
    this.track.addEventListener('transitionend', onTransitionEnd);
  }

  /** 上一张 */
  goToPrev() {
    this.goToSlide(this.currentIndex - 1);
    this.resetAutoPlay();
  }

  /** 下一张 */
  goToNext() {
    this.goToSlide(this.currentIndex + 1);
    this.resetAutoPlay();
  }

  /** 启动自动播放 */
  startAutoPlay() {
    if (this.timer) return;
    this.timer = setInterval(() => this.goToNext(), this.interval);
  }

  /** 停止自动播放 */
  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** 重置自动播放（用户手动切换后重新计时） */
  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// 页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
  new Carousel('.carousel-track', '.carousel-indicators');
});
