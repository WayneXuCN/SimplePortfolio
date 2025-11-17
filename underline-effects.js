// 定义一组美观的强调色
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

// 生成随机颜色的函数
function getRandomColor() {
    return accentColors[Math.floor(Math.random() * accentColors.length)];
}

// 为所有下划线元素添加事件监听器
function setupRandomUnderlineColors() {
    const underlineElements = document.querySelectorAll('.underline');

    underlineElements.forEach(element => {
        // 鼠标悬停事件
        element.addEventListener('mouseover', function () {
            const randomColor = getRandomColor();
            // 创建一个临时样式规则来修改伪元素
            const styleId = 'temp-underline-color-' + Date.now();
            let styleElement = document.getElementById(styleId);

            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }

            // 为当前元素创建特定的选择器，使用唯一标识
            const uniqueSelector = `#${this.id || this.className.split(' ').join('.')}`;
            const selector = `p span.underline:hover::after, [dangerouslySetInnerHTML] span.underline:hover::after, .underline:hover::after`;

            styleElement.textContent = `${selector} { background-color: ${randomColor} !important; }`;

            // 存储样式元素引用，以便稍后移除
            this._tempStyleElement = styleElement;
        });

        // 鼠标离开事件
        element.addEventListener('mouseout', function () {
            // 移除临时样式
            if (this._tempStyleElement && this._tempStyleElement.parentNode) {
                this._tempStyleElement.parentNode.removeChild(this._tempStyleElement);
                this._tempStyleElement = null;
            }
        });
    });
}

// 在页面加载完成后执行
document.addEventListener('DOMContentLoaded', setupRandomUnderlineColors);

// 当React内容更新后重新设置（因为内容是动态加载的）
const observer = new MutationObserver(() => {
    setupRandomUnderlineColors();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});