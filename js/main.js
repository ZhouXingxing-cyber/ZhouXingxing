/* ============ 进入界面 ============ */
(function initEntrance() {
  'use strict';

  const overlay = document.getElementById('entranceOverlay');
  if (!overlay) return;

  const chars = document.querySelectorAll('.title-char');
  const fadeItems = document.querySelectorAll('.entrance-fade-item');
  const btn = document.getElementById('entranceBtn');
  const body = document.body;

  // 阻止滚动
  body.classList.add('entrance-active');

  // 入场动画序列
  function playEntranceAnimation() {
    // 副标题
    const subtitle = document.getElementById('entranceSubtitle');
    if (subtitle) subtitle.classList.add('visible');

    // 文字逐个显现
    chars.forEach((char, index) => {
      setTimeout(() => {
        char.classList.add('visible');
      }, 400 + index * 150);
    });

    // 分割线
    const divider = document.querySelector('.entrance-divider');
    if (divider) {
      setTimeout(() => {
        divider.classList.add('visible');
      }, 1100);
    }

    // 标语
    const tagline = document.getElementById('entranceTagline');
    if (tagline) {
      setTimeout(() => {
        tagline.classList.add('visible');
      }, 1400);
    }

    // 描述
    const desc = document.getElementById('entranceDesc');
    if (desc) {
      setTimeout(() => {
        desc.classList.add('visible');
      }, 1600);
    }

    // 按钮
    if (btn) {
      setTimeout(() => {
        btn.classList.add('visible');
      }, 1800);
    }

    // 底部提示
    const hint = document.getElementById('entranceHint');
    if (hint) {
      setTimeout(() => {
        hint.classList.add('visible');
      }, 2200);
    }
  }

  // 关闭进入界面
  function dismissEntrance() {
    if (!overlay) return;

    // 阻止重复点击
    if (btn) btn.style.pointerEvents = 'none';

    // 添加隐藏类触发 CSS 过渡
    overlay.classList.add('hidden');

    // 恢复页面滚动
    body.classList.remove('entrance-active');
    document.documentElement.style.scrollBehavior = 'smooth';

    // 触发进入后的回调
    if (window.onEntranceComplete) {
      window.onEntranceComplete();
    }

    // 过场完成后销毁 DOM
    setTimeout(() => {
      overlay.remove();
    }, 1000);
  }

  // 启动入场动画
  playEntranceAnimation();

  // 点击按钮进入
  if (btn) {
    btn.addEventListener('click', dismissEntrance);
  }

  // 键盘支持 - Enter 键也可以进入
  if (btn) {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismissEntrance();
      }
    });
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('role', 'button');
  }

  // 自动进入（备用：如果用户不点击，6秒后自动进入）
  let autoEnterTimer = setTimeout(() => {
    if (!overlay.classList.contains('hidden')) {
      dismissEntrance();
    }
  }, 6000);

  // 用户点击后取消自动进入
  if (btn) {
    btn.addEventListener('click', () => clearTimeout(autoEnterTimer));
  }

  // 暴露给全局（供 GSAP 模块使用）
  window.dismissEntrance = dismissEntrance;
  window.entranceActive = true;
})();
/**
 * main.js — 主交互模块
 * 功能：
 *   1. 移动端导航菜单切换
 *   2. 平滑滚动到各锚点
 *   3. 动态加载游客评价（模拟异步数据）
 *   4. 页面滚动导航高亮效果
 *   5. 回到顶部按钮
 */

/* ============ 设置日期输入框最小值为今天 ============ */
(function setDateMin() {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    // 默认设为明天
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const ty = tomorrow.getFullYear();
    const tm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const td = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${ty}-${tm}-${td}`;
  }
})();

/* ============ 图片加载失败回退 ============ */
(function initImageFallback() {
  document.addEventListener('error', function (e) {
    const target = e.target;
    if (target.tagName === 'IMG' && !target.dataset.fallbackAttempted) {
      target.dataset.fallbackAttempted = 'true';
      // 尝试使用 picsum 占位图
      const width = target.naturalWidth || 400;
      const height = target.naturalHeight || 300;
      target.src = `https://picsum.photos/seed/fallback${Math.random().toString(36).slice(2,8)}/${width}/${height}`;
      console.warn('图片加载失败，已切换为占位图:', target.alt);
    }
  }, true);
})();

/* ============ 移动端导航切换 ============ */
(function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      // 汉堡图标动画（通过 toggle class 实现）
      menuToggle.classList.toggle('active');
    });

    // 点击导航链接后自动关闭菜单
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }
})();

/* ============ 平滑滚动（锚点导航） ============ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight || 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();

/* ============ 滚动时导航高亮 ============ */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-70px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
})();

/* ============ 动态加载游客评价 ============ */
(function initDynamicReviews() {
  const reviewList = document.querySelector('.review-list');
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (!reviewList) return;

  // 游客评价数据池
  const reviewDataPool = [
    {
      name: '草原旅人',
      rating: '★★★★★',
      text: '呼和浩特太美了！大召寺的建筑精美绝伦，希拉穆仁草原一望无际，羊肉更是鲜嫩多汁，强烈推荐大家来感受草原文化！',
      date: '2024-08-15'
    },
    {
      name: '背包客小张',
      rating: '★★★★☆',
      text: '内蒙古博物院非常值得一去，恐龙化石和蒙古族文化展品丰富。昭君墓的历史感很厚重，建议请个讲解员会更深入。',
      date: '2024-07-22'
    },
    {
      name: '摄影爱好者',
      rating: '★★★★★',
      text: '五塔寺的日落绝了！金色的阳光洒在塔尖上，拍出来的照片张张都是大片。呼和浩特的天空特别蓝，空气清新。',
      date: '2024-09-03'
    },
    {
      name: '文化探索者',
      rating: '★★★★★',
      text: '第一次体验蒙古包住宿，晚上看星空太震撼了。奶茶和手把肉都是地道美味，内蒙古人民的热情好客让人感动。',
      date: '2024-08-28'
    },
    {
      name: '家庭出游',
      rating: '★★★★☆',
      text: '带着孩子来的，孩子在内蒙博物院学到了很多知识，在大草原上骑马特别开心。建议夏天来，草最绿、气候最舒适。',
      date: '2024-07-10'
    },
    {
      name: '自驾游阿明',
      rating: '★★★★★',
      text: '从北京开车到呼和浩特很方便，高速公路4个多小时。城市干净整洁，景点集中，周末短途旅行首选！',
      date: '2024-09-18'
    },
    {
      name: '美食猎人',
      rating: '★★★★★',
      text: '呼和浩特的烧卖（稍美）是一绝！还有莜面、奶皮子、烤羊排，每一样都让人回味。为了吃也值得专门来一趟！',
      date: '2024-10-05'
    },
    {
      name: '历史迷小王',
      rating: '★★★★☆',
      text: '昭君博物院修复得很用心，了解王昭君的故事后再看相关文物，感触很深。大召寺的银佛和壁画是艺术瑰宝。',
      date: '2024-09-25'
    }
  ];

  let loadedCount = 0;
  const batchSize = 4; // 每次加载4条

  /**
   * 渲染一条评价卡片
   * @param {Object} review - 评价数据
   * @returns {HTMLElement}
   */
  function createReviewCard(review) {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.style.animation = 'slideUp 0.4s ease forwards';
    div.style.opacity = '0';

    div.innerHTML = `
      <div class="review-header">
        <h4>👤 ${review.name}</h4>
        <span class="rating">${review.rating}</span>
      </div>
      <p class="review-text">"${review.text}"</p>
      <div class="review-date">📅 ${review.date}</div>
    `;

    return div;
  }

  /**
   * 加载下一批评价
   */
  function loadMoreReviews() {
    const remaining = reviewDataPool.length - loadedCount;
    if (remaining <= 0) {
      if (loadMoreBtn) {
        loadMoreBtn.textContent = '— 已加载全部评价 —';
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.cursor = 'default';
        loadMoreBtn.style.opacity = '0.5';
      }
      return;
    }

    const toLoad = Math.min(batchSize, remaining);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < toLoad; i++) {
      const review = reviewDataPool[loadedCount + i];
      if (review) {
        fragment.appendChild(createReviewCard(review));
      }
    }

    reviewList.appendChild(fragment);
    loadedCount += toLoad;

    // 为每个新卡片添加延迟动画
    const newCards = reviewList.querySelectorAll('.review-item:last-of-type');
  }

  // 初始加载第一批
  loadMoreReviews();

  // 绑定"加载更多"按钮
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreReviews);
  }
})();

/* ============ 回到顶部按钮 ============ */
(function initBackToTop() {
  // 创建回到顶部按钮
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', '回到顶部');
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--primary, #1a5276);
    color: white;
    font-size: 1.4rem;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
    border: 2px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  document.body.appendChild(btn);

  // 滚动监听
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(20px)';
      btn.style.pointerEvents = 'none';
    }
  });

  // 点击回到顶部
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 悬停效果
  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'var(--accent, #d4a017)';
    btn.style.transform = 'translateY(-3px)';
    btn.style.boxShadow = '0 6px 20px rgba(212, 160, 23, 0.4)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'var(--primary, #1a5276)';
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
  });
})();

/* ============ 景点详情视频数据 ============ */
const attractionVideoData = {
  '大召寺': {
    bvid: 'BV1Ky4y1F7uw',
    title: '大召寺介绍',
    duration: '4:12'
  },
  '希拉穆仁草原': {
    bvid: 'BV1cF411U78y',
    title: '希拉穆仁草原',
    duration: '4:33'
  },
  '内蒙古博物院': {
    bvid: 'BV1dq421F7ur',
    title: '内蒙古博物院',
    duration: '4:03'
  },
  '昭君博物院': {
    bvid: 'BV1gB4y1771C',
    title: '昭君博物院',
    duration: '3:23'
  },
  '五塔寺': {
    bvid: 'BV19C4y1R7eW',
    title: '五塔寺',
    duration: '2:54'
  },
  '伊斯兰风情街': {
    bvid: 'BV17E421w7td',
    title: '伊斯兰风情街',
    duration: '5:29'
  }
};

/* ============ 卡片点击展开详情页面（含视频） ============ */
(function initCardClick() {
  document.querySelectorAll('.attraction-card').forEach(card => {
    card.addEventListener('click', function () {
      const title = this.querySelector('.card-body h3')?.textContent || '景点';
      const desc = this.querySelector('.card-body .desc')?.textContent || '';
      const badge = this.querySelector('.card-badge')?.textContent || '';
      const imgSrc = this.querySelector('.card-img img')?.src || '';
      const infoRows = this.querySelectorAll('.card-body .info-row');
      
      let infoHtml = '';
      infoRows.forEach(row => {
        infoHtml += `<div style="display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px;">${row.innerHTML}</div>`;
      });

      const videoData = attractionVideoData[title] || { bvid: 'BV1aM4y1V7vA', title: `${title}介绍`, duration: '0:00' };

      const modal = document.createElement('div');
      modal.className = 'attraction-detail-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(8, 46, 37, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 3000;
        overflow-y: auto;
        opacity: 0;
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;

      modal.innerHTML = `
        <div class="detail-page" style="
          min-height: 100vh;
          padding: 60px 24px;
          display: flex;
          justify-content: center;
        ">
          <div class="detail-content" style="
            max-width: 900px;
            width: 100%;
            background: white;
            border-radius: var(--radius-xl);
            overflow: hidden;
            box-shadow: 0 30px 100px rgba(0,0,0,0.4);
            transform: translateY(30px);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <div class="detail-header" style="
              position: relative;
              height: 320px;
              overflow: hidden;
            ">
              <img src="${imgSrc}" alt="${title}" style="
                width: 100%;
                height: 100%;
                object-fit: cover;
              ">
              <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(to bottom, rgba(8, 46, 37, 0.3), rgba(8, 46, 37, 0.7) 70%, rgba(8, 46, 37, 0.9));
              "></div>
              
              <button class="detail-close" style="
                position: absolute;
                top: 20px;
                right: 20px;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255,255,255,0.3);
                font-size: 1.2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 20;
                color: white;
              ">✕</button>

              <div style="
                position: absolute;
                bottom: 40px;
                left: 40px;
                right: 40px;
                color: white;
              ">
                ${badge ? `<span style="
                  display: inline-block;
                  background: var(--accent);
                  color: var(--bg-dark);
                  padding: 4px 16px;
                  border-radius: 16px;
                  font-size: 0.75rem;
                  font-weight: 700;
                  margin-bottom: 12px;
                  letter-spacing: 1px;
                ">${badge}</span>` : ''}
                <h1 style="
                  font-family: var(--font-heading);
                  font-size: 2.5rem;
                  font-weight: 900;
                  margin-bottom: 8px;
                  letter-spacing: 2px;
                  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
                ">${title}</h1>
                <p style="opacity: 0.9; font-size: 1.05rem; font-weight: 300;">探索呼和浩特的自然与人文之美</p>
              </div>
            </div>

            <div class="detail-body" style="padding: 48px;">
              <div class="detail-video-section" style="
                margin-bottom: 40px;
                background: var(--bg-dark);
                border-radius: var(--radius-lg);
                overflow: hidden;
                position: relative;
              ">
                <div style="
                  padding: 20px 24px;
                  border-bottom: 1px solid rgba(255,255,255,0.1);
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                ">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.5rem;">🎬</span>
                    <span style="color: var(--accent-light); font-weight: 600; font-size: 1.1rem;">景点介绍视频</span>
                  </div>
                  <span style="color: rgba(240, 235, 227, 0.5); font-size: 0.85rem;">${videoData.duration}</span>
                </div>
                <div class="video-container" style="
                  position: relative;
                  padding-bottom: 56.25%;
                  height: 0;
                  background: #000;
                ">
                  <iframe
                    src="https://player.bilibili.com/player.html?isOutside=true&bvid=${videoData.bvid}&p=1&autoplay=0"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    title="${videoData.title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style="
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      border: none;
                    "
                  ></iframe>
                </div>
                <div style="padding: 16px 24px; background: rgba(0,0,0,0.3);">
                  <p style="color: rgba(240, 235, 227, 0.5); font-size: 0.8rem; text-align: center;">
                    🎥 点击播放按钮观看 ${videoData.title}
                  </p>
                </div>
              </div>

              <div class="detail-info-section" style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-bottom: 36px;
              ">
                <div style="
                  background: var(--bg-light);
                  padding: 24px;
                  border-radius: var(--radius-md);
                  border-left: 4px solid var(--accent);
                ">
                  <h3 style="
                    font-family: var(--font-heading);
                    color: var(--primary);
                    margin-bottom: 16px;
                    font-size: 1.1rem;
                  ">📍 基本信息</h3>
                  ${infoHtml}
                </div>
                <div style="
                  background: var(--bg-light);
                  padding: 24px;
                  border-radius: var(--radius-md);
                  border-left: 4px solid var(--primary-light);
                ">
                  <h3 style="
                    font-family: var(--font-heading);
                    color: var(--primary);
                    margin-bottom: 16px;
                    font-size: 1.1rem;
                  ">⭐ 景点特色</h3>
                  <ul style="color: var(--text-dark); font-size: 0.9rem; line-height: 2;">
                    <li>✓ 历史文化底蕴深厚</li>
                    <li>✓ 自然风光优美</li>
                    <li>✓ 独特民族风情</li>
                    <li>✓ 拍照打卡胜地</li>
                  </ul>
                </div>
              </div>

              <div class="detail-desc-section" style="
                padding: 32px;
                background: linear-gradient(135deg, rgba(13, 74, 60, 0.03), rgba(201, 169, 110, 0.03));
                border-radius: var(--radius-md);
                border: 1px solid rgba(201, 169, 110, 0.1);
              ">
                <h3 style="
                  font-family: var(--font-heading);
                  color: var(--primary);
                  margin-bottom: 16px;
                  font-size: 1.3rem;
                  display: flex;
                  align-items: center;
                  gap: 10px;
                ">
                  <span>📖</span> 景点介绍
                </h3>
                <p style="
                  color: var(--text-dark);
                  line-height: 2;
                  font-size: 1rem;
                  text-align: justify;
                ">${desc}</p>
              </div>

              <div class="detail-action" style="
                margin-top: 40px;
                display: flex;
                gap: 16px;
                justify-content: center;
              ">
                <a href="#booking" class="detail-book-btn" style="
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                  padding: 16px 40px;
                  background: var(--gold-gradient);
                  background-size: 200% 100%;
                  color: var(--bg-dark);
                  border-radius: var(--radius-lg);
                  font-size: 1.1rem;
                  font-weight: 700;
                  text-decoration: none;
                  transition: all 0.3s ease;
                  letter-spacing: 1px;
                  box-shadow: 0 4px 20px rgba(201, 169, 110, 0.3);
                ">
                  <span>📋</span> 立即预约
                </a>
                <button class="detail-share-btn" style="
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                  padding: 16px 32px;
                  background: transparent;
                  border: 2px solid var(--accent);
                  color: var(--accent-dark);
                  border-radius: var(--radius-lg);
                  font-size: 1.1rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  letter-spacing: 1px;
                ">
                  <span>🔗</span> 分享景点
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      requestAnimationFrame(() => {
        modal.style.opacity = '1';
        const content = modal.querySelector('.detail-content');
        if (content) {
          content.style.transform = 'translateY(0)';
        }
      });

      const closeModal = () => {
        modal.style.opacity = '0';
        const content = modal.querySelector('.detail-content');
        if (content) {
          content.style.transform = 'translateY(30px)';
        }
        setTimeout(() => modal.remove(), 400);
      };

      const closeBtn = modal.querySelector('.detail-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.background = '#e74c3c';
          closeBtn.style.transform = 'scale(1.1)';
        });
        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.background = 'rgba(255,255,255,0.2)';
          closeBtn.style.transform = 'scale(1)';
        });
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      const escHandler = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);

      const bookBtn = modal.querySelector('.detail-book-btn');
      if (bookBtn) {
        bookBtn.addEventListener('mouseenter', () => {
          bookBtn.style.backgroundPosition = 'right center';
          bookBtn.style.transform = 'translateY(-3px)';
          bookBtn.style.boxShadow = '0 8px 30px rgba(201, 169, 110, 0.5)';
        });
        bookBtn.addEventListener('mouseleave', () => {
          bookBtn.style.backgroundPosition = 'left center';
          bookBtn.style.transform = 'translateY(0)';
          bookBtn.style.boxShadow = '0 4px 20px rgba(201, 169, 110, 0.3)';
        });
        bookBtn.addEventListener('click', () => {
          closeModal();
        });
      }

      const shareBtn = modal.querySelector('.detail-share-btn');
      if (shareBtn) {
        shareBtn.addEventListener('mouseenter', () => {
          shareBtn.style.background = 'var(--accent)';
          shareBtn.style.color = 'var(--bg-dark)';
        });
        shareBtn.addEventListener('mouseleave', () => {
          shareBtn.style.background = 'transparent';
          shareBtn.style.color = 'var(--accent-dark)';
        });
        shareBtn.addEventListener('click', () => {
          const shareText = `推荐您来呼和浩特旅游！🏛️ ${title} — ${desc.substring(0, 30)}...`;
          if (navigator.share) {
            navigator.share({
              title: `${title} - 青城之旅`,
              text: shareText,
              url: window.location.href
            });
          } else {
            navigator.clipboard.writeText(shareText + '\n\n' + window.location.href);
            shareBtn.innerHTML = '<span>✓</span> 已复制到剪贴板';
            setTimeout(() => {
              shareBtn.innerHTML = '<span>🔗</span> 分享景点';
            }, 2000);
          }
        });
      }
    });
  });
})();

