import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import emailjs from '@emailjs/browser';

/**
 * ContactForm
 * 联系表单组件，使用 EmailJS 发送邮件
 *
 * 环境变量（Astro 使用 PUBLIC_ 前缀）：
 * - PUBLIC_EMAILJS_SERVICE_ID
 * - PUBLIC_EMAILJS_TEMPLATE_ID
 * - PUBLIC_EMAILJS_PUBLIC_KEY
 */
const ContactForm = ({ content, emailAddress }) => {
  const { formLabels, formPlaceholders, formOptions, formSubmit, actions } = content;

  const form = useRef();
  const statusResetRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [copyStatus, setCopyStatus] = useState('idle'); // idle, success, error

  const scheduleStatusReset = useCallback(() => {
    if (statusResetRef.current) {
      clearTimeout(statusResetRef.current);
    }
    statusResetRef.current = setTimeout(() => {
      setStatus('idle');
      statusResetRef.current = null;
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (statusResetRef.current) {
        clearTimeout(statusResetRef.current);
      }
    };
  }, []);

  const copyToClipboard = useCallback(async text => {
    if (typeof window === 'undefined') return false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }, []);

  const handleCopyEmail = useCallback(
    async e => {
      e.preventDefault();
      const success = await copyToClipboard(emailAddress);
      setCopyStatus(success ? 'success' : 'error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    },
    [copyToClipboard, emailAddress]
  );

  const sendEmail = async e => {
    e.preventDefault();
    if (status === 'sending') return;

    const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS environment variables are missing.');
      setStatus('error');
      scheduleStatusReset();
      return;
    }

    if (!form.current) {
      setStatus('error');
      scheduleStatusReset();
      return;
    }

    setStatus('sending');

    try {
      await emailjs.sendForm(serviceId, templateId, form.current, {
        publicKey,
      });
      setStatus('success');
      form.current.reset();
    } catch (error) {
      console.error('FAILED...', error?.text || error);
      setStatus('error');
    } finally {
      scheduleStatusReset();
    }
  };

  const statusText = useMemo(() => {
    switch (status) {
      case 'sending':
        return formSubmit?.sending || '发送中...';
      case 'success':
        return formSubmit?.success || '发送成功！我会尽快回复';
      case 'error':
        return formSubmit?.error || '发送失败，请稍后重试';
      default:
        return formSubmit?.default || '发送给 Wenjie';
    }
  }, [status, formSubmit]);

  return (
    <form
      ref={form}
      onSubmit={sendEmail}
      className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 space-y-6'
    >
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'
        >
          {formLabels?.name || '称呼'}
        </label>
        <input
          id='name'
          name='user_name'
          type='text'
          required
          className='w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500'
          placeholder={formPlaceholders?.name || '例如：李雷 / 小团队 / 品牌方'}
        />
      </div>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'
        >
          {formLabels?.email || '邮箱'}
        </label>
        <input
          id='email'
          name='user_email'
          type='email'
          required
          className='w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500'
          placeholder={formPlaceholders?.email || 'you@example.com'}
        />
      </div>
      <div>
        <label
          htmlFor='topic'
          className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'
        >
          {formLabels?.topic || '项目类型'}
        </label>
        <select
          id='topic'
          name='topic'
          className='w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500'
        >
          <option value='consulting'>{formOptions?.consulting || '产品 / 体验咨询'}</option>
          <option value='content'>{formOptions?.content || '内容共创'}</option>
          <option value='share'>{formOptions?.share || '生活交友'}</option>
          <option value='other'>{formOptions?.other || '其他想法'}</option>
        </select>
      </div>
      <div>
        <label
          htmlFor='message'
          className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'
        >
          {formLabels?.message || '简要说明'}
        </label>
        <textarea
          id='message'
          name='message'
          rows='5'
          required
          className='w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500'
          placeholder={formPlaceholders?.message || '目标、时间、你期待的成果...'}
        ></textarea>
      </div>
      <button
        type='submit'
        disabled={status === 'sending' || status === 'success'}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          status === 'success'
            ? 'bg-green-600 text-white'
            : status === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-black dark:bg-gray-700 text-white card-hover'
        } disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {statusText}
      </button>
      <span className='sr-only' role='status' aria-live='polite'>
        {statusText}
      </span>
    </form>
  );
};

export default ContactForm;
