import { useEffect } from 'react';

/**
 * UnderlineEffects
 * 为带有 .underline 类的元素添加悬停变色效果
 */
const UnderlineEffects = () => {
  useEffect(() => {
    const accentColors = [
      '#10b981', // 绿色
      '#3b82f6', // 蓝色
      '#f97316', // 橙色
      '#8b5cf6', // 紫色
      '#ec4899', // 粉色
      '#06b6d4', // 青色
      '#eab308', // 黄色
      '#ef4444', // 红色
    ];

    const DEFAULT_HOVER_COLOR = 'transparent';
    const getRandomColor = () => accentColors[Math.floor(Math.random() * accentColors.length)];

    // 使用 WeakMap 存储监听器，避免内存泄漏
    const elementListeners = new WeakMap();

    const bindUnderlineEffect = element => {
      if (!element || element.dataset.underlineBound === 'true') {
        return;
      }

      element.dataset.underlineBound = 'true';

      const onMouseEnter = () => {
        element.style.setProperty('--underline-hover-color', getRandomColor());
      };

      const onMouseLeave = () => {
        element.style.setProperty('--underline-hover-color', DEFAULT_HOVER_COLOR);
      };

      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);

      // 存储监听器以便清理
      elementListeners.set(element, { onMouseEnter, onMouseLeave });
    };

    const unbindUnderlineEffect = element => {
      const listeners = elementListeners.get(element);
      if (!listeners) return;

      element.removeEventListener('mouseenter', listeners.onMouseEnter);
      element.removeEventListener('mouseleave', listeners.onMouseLeave);
      elementListeners.delete(element);
      delete element.dataset.underlineBound;
    };

    // 初始化设置
    const initialElements = document.querySelectorAll('.underline');
    initialElements.forEach(bindUnderlineEffect);

    // 监听动态内容变化
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // 处理新增节点
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          if (node.matches?.('.underline')) {
            bindUnderlineEffect(node);
          }
          node.querySelectorAll?.('.underline').forEach(bindUnderlineEffect);
        });

        // 处理删除节点，清理监听器
        mutation.removedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          if (node.matches?.('.underline')) {
            unbindUnderlineEffect(node);
          }
          node.querySelectorAll?.('.underline').forEach(unbindUnderlineEffect);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 清理函数
    return () => {
      observer.disconnect();
      // 清理所有已绑定的监听器
      document
        .querySelectorAll('.underline[data-underline-bound="true"]')
        .forEach(unbindUnderlineEffect);
    };
  }, []);

  return null;
};

export default UnderlineEffects;
