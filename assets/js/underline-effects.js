// 随机强调色池
const accentColors = [
    '#10b981', // 绿色
    '#3b82f6', // 蓝色
    '#f97316', // 橙色
    '#8b5cf6', // 紫色
    '#ec4899', // 粉色
    '#06b6d4', // 青色
    '#eab308', // 黄色
    '#ef4444'  // 红色
];

const DEFAULT_HOVER_COLOR = 'transparent';

const getRandomColor = () => accentColors[Math.floor(Math.random() * accentColors.length)];

// 将 CSS 变量应用到目标元素，避免频繁插入 <style>
const setUnderlineHoverColor = (element, color) => {
    element.style.setProperty('--underline-hover-color', color);
};

const bindUnderlineEffect = (element) => {
    if (!element || element.dataset.underlineBound === 'true') {
        return;
    }

    element.dataset.underlineBound = 'true';

    element.addEventListener('mouseenter', () => {
        setUnderlineHoverColor(element, getRandomColor());
    });

    element.addEventListener('mouseleave', () => {
        setUnderlineHoverColor(element, DEFAULT_HOVER_COLOR);
    });
};

const setupRandomUnderlineColors = () => {
    document.querySelectorAll('.underline').forEach(bindUnderlineEffect);
};

// 初始绑定
document.addEventListener('DOMContentLoaded', setupRandomUnderlineColors);

// 监听 React 动态渲染，按需为新增节点绑定
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            if (node.matches?.('.underline')) {
                bindUnderlineEffect(node);
            }

            node.querySelectorAll?.('.underline').forEach(bindUnderlineEffect);
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});