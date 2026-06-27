/**
 * form.js — 预约表单前端验证模块
 * 功能：非空校验 / 姓名、电话、邮箱格式验证 / 实时反馈
 */
class FormValidator {
  /**
   * @param {string} formSelector - 表单 CSS 选择器
   */
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;

    // 获取所有需要验证的字段
    this.fields = {
      name: {
        element: this.form.querySelector('#name'),
        validator: (val) => {
          if (!val.trim()) return '请输入您的姓名';
          if (val.trim().length < 2) return '姓名至少2个字符';
          if (val.trim().length > 20) return '姓名不能超过20个字符';
          return '';
        }
      },
      phone: {
        element: this.form.querySelector('#phone'),
        validator: (val) => {
          if (!val.trim()) return '请输入您的手机号';
          if (!/^1[3-9]\d{9}$/.test(val.trim())) return '请输入正确的11位手机号';
          return '';
        }
      },
      email: {
        element: this.form.querySelector('#email'),
        validator: (val) => {
          if (!val.trim()) return '请输入您的邮箱';
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim())) {
            return '请输入正确的邮箱地址（如 user@example.com）';
          }
          return '';
        }
      },
      date: {
        element: this.form.querySelector('#date'),
        validator: (val) => {
          if (!val) return '请选择预约日期';
          const selected = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) return '预约日期不能早于今天';
          return '';
        }
      },
      people: {
        element: this.form.querySelector('#people'),
        validator: (val) => {
          if (!val) return '请选择人数';
          const num = parseInt(val);
          if (num < 1 || num > 20) return '人数范围为 1~20 人';
          return '';
        }
      },
      attraction: {
        element: this.form.querySelector('#attraction'),
        validator: (val) => {
          if (!val) return '请选择您想参观的景点';
          return '';
        }
      },
      message: {
        element: this.form.querySelector('#message'),
        validator: (val) => {
          if (val.trim().length > 200) return '留言不能超过200个字符';
          return ''; // 留言为选填
        }
      }
    };

    this.bindEvents();
  }

  /** 绑定输入事件（实时校验）和提交事件 */
  bindEvents() {
    // 实时校验 — blur 和 input 时触发
    Object.values(this.fields).forEach(({ element, validator }) => {
      if (!element) return;

      // 失焦时校验
      element.addEventListener('blur', () => {
        this.validateField(element, validator);
      });

      // 输入时清除错误状态（如果已经错误）
      element.addEventListener('input', () => {
        const formGroup = element.closest('.form-group');
        if (formGroup && formGroup.classList.contains('error')) {
          formGroup.classList.remove('error');
        }
      });
    });

    // 表单提交
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // 成功消息关闭按钮
    const closeBtn = this.form.querySelector('.form-success .close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const success = this.form.querySelector('.form-success');
        if (success) success.classList.remove('show');
      });
    }
  }

  /**
   * 校验单个字段
   * @param {HTMLElement} element   - 表单字段元素
   * @param {Function}    validator - 校验函数
   * @returns {boolean} 是否通过校验
   */
  validateField(element, validator) {
    const formGroup = element.closest('.form-group');
    const errorMsg = formGroup ? formGroup.querySelector('.error-msg') : null;
    const message = validator(element.value);

    if (message) {
      if (formGroup) formGroup.classList.add('error');
      if (errorMsg) errorMsg.textContent = message;
      return false;
    } else {
      if (formGroup) formGroup.classList.remove('error');
      return true;
    }
  }

  /** 校验整个表单 */
  validateAll() {
    let isValid = true;

    Object.values(this.fields).forEach(({ element, validator }) => {
      if (!element) return;
      if (!this.validateField(element, validator)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /** 提交处理 */
  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateAll()) {
      // 滚动到第一个错误字段
      const firstError = this.form.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 收集表单数据
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log('表单提交数据:', data);

    // 显示成功消息
    const formContent = this.form.querySelector('.booking-form-content');
    const successMsg = this.form.querySelector('.form-success');
    if (formContent) formContent.style.display = 'none';
    if (successMsg) successMsg.classList.add('show');

    // 模拟提交到服务器
    setTimeout(() => {
      if (successMsg) successMsg.classList.remove('show');
      if (formContent) {
        formContent.style.display = 'block';
        this.form.reset();
      }
    }, 5000);
  }
}

// 页面加载完成后初始化表单验证
document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('#bookingForm');
});
