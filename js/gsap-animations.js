/**
 * gsap-animations.js — GSAP 页面动画模块
 * 依赖：GSAP 3.12+ / ScrollTrigger 插件
 * 功能：页面加载入场 / 滚动触发动画 / 视差效果
 */

// 等待 GSAP 加载完成
function initGSAP() {
  // 检查 GSAP 是否可用
  if (typeof gsap === 'undefined') {
    // 如果 GSAP 没加载成功，静默退出（不影响页面基本功能）
    console.warn('GSAP 未加载，动画已跳过');
    return;
  }

  // 注册 ScrollTrigger 插件
  gsap.registerPlugin(ScrollTrigger);

  // ================================================================
  // 1. 页面加载入场动画
  // ================================================================
  function pageLoadAnimations() {
    // 页面整体渐入
    gsap.from('body', { opacity: 0, duration: 0.3 });

    // 导航栏从上方滑入
    gsap.from('.header', {
      y: -80,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.1
    });

    // 导航菜单项从左依次出现
    gsap.from('.nav-menu a', {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(1.4)',
      delay: 0.3
    });

    // Logo 渐入
    gsap.from('.logo', {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.2
    });
  }

  // ================================================================
  // 2. 导航栏滚动效果
  // ================================================================
  function navScrollEffect() {
    gsap.to('.header', {
      scrollTrigger: {
        trigger: 'body',
        start: '60px top',
        toggleActions: 'play none none reverse'
      },
      backgroundColor: 'rgba(11, 46, 63, 0.98)',
      boxShadow: '0 4px 25px rgba(0,0,0,0.25)',
      duration: 0.3,
      ease: 'power1.out'
    });

    // 导航链接高亮放大效果（当前激活项）
    gsap.utils.toArray('.nav-menu a').forEach(link => {
      ScrollTrigger.create({
        trigger: link,
        start: 'top center',
        end: 'bottom center',
        onToggle: self => {
          if (self.isActive) {
            gsap.to(link, { scale: 1.05, color: '#f5d76e', duration: 0.3 });
          } else {
            gsap.to(link, { scale: 1, color: 'rgba(255,255,255,0.85)', duration: 0.3 });
          }
        }
      });
    });
  }

  // ================================================================
  // 3. 景点卡片 — 滚动入场 (stagger + 弹性缓动)
  // ================================================================
  function cardEntrance() {
    const cards = document.querySelectorAll('.attraction-card');

    if (cards.length === 0) return;

    // 先设置初始状态
    gsap.set(cards, {
      y: 80,
      opacity: 0,
      scale: 0.95
    });

    // 卡片滚动入场 — 整批进入
    gsap.to(cards, {
      scrollTrigger: {
        trigger: '.attractions-grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        once: true
      },
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'back.out(1.8)'
    });

    // 卡片悬浮增强效果（配合 CSS hover）
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          boxShadow: '0 12px 35px rgba(0,0,0,0.18)',
          duration: 0.35,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          duration: 0.35,
          ease: 'power2.out'
        });
      });
    });
  }

  // ================================================================
  // 4. 文化区 — 左右交替入场 + 图标旋转
  // ================================================================
  function cultureEntrance() {
    const items = document.querySelectorAll('.culture-item');

    if (items.length === 0) return;

    items.forEach((item, index) => {
      // 交替方向：左→右，右→左
      const fromX = index % 2 === 0 ? -80 : 80;

      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
          once: true
        },
        x: fromX,
        opacity: 0,
        duration: 0.7,
        delay: index * 0.12,
        ease: 'power3.out'
      });

      // 图标旋转
      const icon = item.querySelector('.icon-circle');
      if (icon) {
        gsap.from(icon, {
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            once: true
          },
          rotation: -180,
          scale: 0,
          duration: 0.6,
          delay: index * 0.12 + 0.2,
          ease: 'back.out(2)'
        });
      }
    });
  }

  // ================================================================
  // 5. 预约表单 — 左右滑入交汇
  // ================================================================
  function bookingEntrance() {
    const infoPanel = document.querySelector('.booking-info');
    const formPanel = document.querySelector('.booking-form');

    if (infoPanel) {
      gsap.from(infoPanel, {
        scrollTrigger: {
          trigger: '.booking-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          once: true
        },
        x: -100,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    if (formPanel) {
      gsap.from(formPanel, {
        scrollTrigger: {
          trigger: '.booking-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          once: true
        },
        x: 100,
        opacity: 0,
        duration: 0.7,
        delay: 0.15,
        ease: 'power3.out'
      });
    }
  }

  // ================================================================
  // 6. 游客评价 — 错开入场
  // ================================================================
  function reviewEntrance() {
    // 监听 review-list 的变化（动态加载）
    const reviewList = document.querySelector('.review-list');

    if (!reviewList) return;

    // 使用 MutationObserver 监听新加载的评价卡片
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains('review-item')) {
            // 对新添加的卡片做入场动画
            gsap.from(node, {
              y: 40,
              opacity: 0,
              scale: 0.95,
              duration: 0.5,
              ease: 'back.out(1.4)'
            });
          }
        });
      });
    });

    observer.observe(reviewList, { childList: true, subtree: false });
  }

  // ================================================================
  // 7. 回到顶部按钮 — GSAP 增强
  // ================================================================
  function backToTopAnimation() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      if (scrollY > 400) {
        gsap.to(btn, {
          opacity: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: 0.4,
          ease: 'back.out(2)'
        });
      } else {
        gsap.to(btn, {
          opacity: 0,
          y: 20,
          pointerEvents: 'none',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.15,
        boxShadow: '0 8px 30px rgba(212, 160, 23, 0.5)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }

  // ================================================================
  // 11. 按钮波纹效果（点击反馈）
  // ================================================================
  function buttonRippleEffect() {
    document.querySelectorAll('button, .submit-btn, .load-more-btn, a[href="#booking"]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          top: ${y}px;
          left: ${x}px;
          width: 10px;
          height: 10px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          transform: scale(0);
          pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        gsap.to(ripple, {
          scale: 4,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        });
      });
    });
  }

  // ================================================================
  // 8. 轮播标题动画增强
  // ================================================================
  function carouselTextEnhance() {
    // 轮播切换时，让标题文本有更丰富的入场
    // 监听轮播按钮点击
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    function animateSlideText() {
      const activeSlide = document.querySelector('.carousel-slide .slide-text');
      if (!activeSlide) return;

      const h2 = activeSlide.querySelector('h2');
      const p = activeSlide.querySelector('p');

      if (h2) {
        gsap.fromTo(h2,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform' }
        );
      }
      if (p) {
        gsap.fromTo(p,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.15, ease: 'power3.out', clearProps: 'transform' }
        );
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', animateSlideText);
    if (nextBtn) nextBtn.addEventListener('click', animateSlideText);

    // 指示器点击同样触发
    document.querySelectorAll('.carousel-indicators span').forEach(dot => {
      dot.addEventListener('click', animateSlideText);
    });
  }

  // ================================================================
  // 9. 表单提交成功动画
  // ================================================================
  function formSuccessAnimation() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      // 延迟检查成功消息（表单验证通过后）
      setTimeout(() => {
        const successMsg = form.querySelector('.form-success');
        if (successMsg && successMsg.classList.contains('show')) {
          gsap.from(successMsg, {
            scale: 0.8,
            opacity: 0,
            y: 30,
            duration: 0.5,
            ease: 'back.out(2)'
          });
        }
      }, 100);
    });
  }

  // ================================================================
  // 10. 页脚 — 底部信息淡入
  // ================================================================
  function footerEntrance() {
    gsap.from('.footer-grid > div', {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%',
        toggleActions: 'play none none reverse',
        once: true
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }

  // ================================================================
  // 启动所有动画
  // ================================================================
  function startAnimations() {
    // 检查是否在进入界面状态
    if (window.entranceActive) {
      // 注册入场完成回调
      window.onEntranceComplete = function() {
        runAllAnimations();
      };
    } else {
      // 直接启动
      runAllAnimations();
    }
  }

  function runAllAnimations() {
    pageLoadAnimations();
    navScrollEffect();
    cardEntrance();
    cultureEntrance();
    bookingEntrance();
    reviewEntrance();
    backToTopAnimation();
    buttonRippleEffect();
    carouselTextEnhance();
    formSuccessAnimation();
    footerEntrance();

    ScrollTrigger.refresh();
  }

  // 页面完全加载后启动
  if (document.readyState === 'complete') {
    startAnimations();
  } else {
    window.addEventListener('load', startAnimations);
  }
}

// 启动
initGSAP();

