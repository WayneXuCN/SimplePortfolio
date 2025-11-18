import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

const container = document.getElementById('root');

if (!container) {
  throw new Error('未找到 id 为 root 的容器节点');
}

const root = createRoot(container);
root.render(<App />);
