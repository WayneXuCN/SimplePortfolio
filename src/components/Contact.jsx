import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import HeaderBar from './HeaderBar.jsx';
import Hero from './Hero.jsx';
import SocialLink from './SocialLink.jsx';

const Contact = ({ content }) => {
  const { header, contact, footer } = content;
  const {
    hero,
    cards,
    form: formContent,
    services,
    actions,
    formLabels,
    formPlaceholders,
    formOptions,
    formSubmit,
  } = contact;
  const form = useRef();
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(cards.email.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('sending');

    // 使用环境变量获取配置
    // 请确保在 .env 文件中配置了这些变量
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS 环境变量未配置');
      setStatus('error');
      return;
    }

    emailjs
      .sendForm(serviceId, templateId, form.current, {
        publicKey: publicKey,
      })
      .then(
        () => {
          setStatus('success');
          form.current.reset();
          setTimeout(() => setStatus('idle'), 5000);
        },
        (error) => {
          console.error('FAILED...', error.text);
          setStatus('error');
          setTimeout(() => setStatus('idle'), 5000);
        }
      );
  };

  return (
    <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
      <HeaderBar header={header} />

      <Hero
        subtitle={hero.subtitle}
        title={hero.title}
        description={hero.description}
      />

      <section className="mb-12 sm:mb-16 md:mb-20 grid md:grid-cols-2 gap-8">
        <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-3xl card-hover flex flex-col justify-between h-full group bg-white dark:bg-gray-800 relative overflow-hidden">
          {/* 装饰背景 Icon */}
          <div className="absolute -right-6 -top-6 text-9xl text-gray-50 dark:text-gray-700 opacity-50 group-hover:opacity-100 group-hover:text-gray-100 dark:group-hover:text-gray-600 transition-all duration-500 pointer-events-none select-none">
            <i className="far fa-envelope"></i>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">
                {cards.email.subtitle}
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-800">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Open to Connect
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-semibold break-all mb-3 text-gray-900 dark:text-gray-100">
                {cards.email.address.split('@')[0]}
                <span className="text-gray-300 dark:text-gray-600">@</span>
                {cards.email.address.split('@')[1]}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {cards.email.note}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <a
              href={`mailto:${cards.email.address}`}
              className="flex-1 bg-black dark:bg-gray-700 text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
            >
              {actions?.writeEmail || '写邮件'}
            </a>
            <button
              onClick={handleCopyEmail}
              className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            >
              {copied ? (
                <span className="text-green-600 dark:text-green-400">
                  <i className="fas fa-check mr-2"></i>
                  {actions?.copied || '已复制'}
                </span>
              ) : (
                <span>
                  <i className="far fa-copy mr-2"></i>
                  {actions?.copy || '复制'}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-3xl card-hover bg-white dark:bg-gray-800">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 mb-6">
            {cards.social.subtitle}
          </p>
          <ul className="space-y-3">
            {cards.social.items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 -mx-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-500">
                      <i
                        className={`${item.icon || 'fas fa-link'} text-lg text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </h4>
                      {item.handle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.handle}
                        </p>
                      )}
                    </div>
                  </div>
                  <i className="fas fa-arrow-up-right-from-square text-gray-300 dark:text-gray-600 text-sm group-hover:text-black dark:group-hover:text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-12 sm:mb-16 md:mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">
              {formContent.subtitle}
            </p>
            <h2 className="text-3xl font-semibold display-font">
              {formContent.title}
            </h2>
          </div>
          <span
            className="text-sm text-gray-400 dark:text-gray-500"
            dangerouslySetInnerHTML={{ __html: formContent.note }}
          ></span>
        </div>
        <form
          ref={form}
          onSubmit={sendEmail}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
            >
              {formLabels?.name || '称呼'}
            </label>
            <input
              id="name"
              name="user_name"
              type="text"
              required
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500"
              placeholder={
                formPlaceholders?.name || '例如：李雷 / 小团队 / 品牌方'
              }
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
            >
              {formLabels?.email || '邮箱'}
            </label>
            <input
              id="email"
              name="user_email"
              type="email"
              required
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500"
              placeholder={formPlaceholders?.email || 'you@example.com'}
            />
          </div>
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
            >
              {formLabels?.topic || '项目类型'}
            </label>
            <select
              id="topic"
              name="topic"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500"
            >
              <option value="consulting">
                {formOptions?.consulting || '产品 / 体验咨询'}
              </option>
              <option value="content">
                {formOptions?.content || '内容共创'}
              </option>
              <option value="friend">
                {formOptions?.friend || '生活交友'}
              </option>
              <option value="other">{formOptions?.other || '其他想法'}</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
            >
              {formLabels?.message || '简要说明'}
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500"
              placeholder={
                formPlaceholders?.message || '目标、时间、你期待的成果...'
              }
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              status === 'success'
                ? 'bg-green-600 text-white'
                : status === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-black dark:bg-gray-700 text-white card-hover'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {status === 'sending'
              ? formSubmit?.sending || '发送中...'
              : status === 'success'
                ? formSubmit?.success || '发送成功！我会尽快回复'
                : status === 'error'
                  ? formSubmit?.error || '发送失败，请稍后重试'
                  : formSubmit?.default || '发送给 Wenjie'}
          </button>
        </form>
      </section>

      <section className="mb-12 sm:mb-16 md:mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {services.items.map((item) => (
            <article
              key={item.title}
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-3xl card-hover"
            >
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-2">
                {item.subtitle}
              </p>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="pt-12 sm:pt-16 pb-6 sm:pb-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center flex-col md:flex-row gap-6 md:gap-0">
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg text-center md:text-left">
            {footer.copyright}
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            {footer.socialLinks.map((link) => (
              <SocialLink key={link.url} link={link} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
