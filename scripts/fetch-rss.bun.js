#!/usr/bin/env bun
/**
 * fetch-rss.bun.js
 * Bun 版 RSS 抓取脚本
 * 
 * 功能：
 * 1. 读取 src/locales/zh.json 和 en.json 中的 featuredPosts.rss 配置
 * 2. 使用 Bun 原生 fetch API 抓取 RSS/Atom feeds
 * 3. 解析 XML 并提取文章信息
 * 4. 生成确定性的随机图片（picsum seed）
 * 5. 输出到 src/data/rss-posts.json
 * 
 * 使用方法：
 *   bun run scripts/fetch-rss.bun.js
 */

import { file, write } from 'bun';
import { resolve, join } from 'path';

// ============================================================================
// 配置
// ============================================================================

const SCRIPT_DIR = import.meta.dir;
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..');
const LOCALES_DIR = join(PROJECT_ROOT, 'src/locales');
const OUTPUT_PATH = join(PROJECT_ROOT, 'src/data/rss-posts.json');

const USER_AGENT = 'LandingPage-RSS-Fetcher/2.0 (Bun; +https://waynexucn.github.io)';
const FETCH_TIMEOUT = 15000; // 15 秒超时
const MAX_RETRIES = 3;

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成确定性哈希（用于图片 seed）
 * 使用 Bun 原生的 CryptoHasher
 */
function getHash(str) {
  const hasher = new Bun.CryptoHasher('md5');
  hasher.update(str);
  return hasher.digest('hex').substring(0, 8);
}

/**
 * 带重试和超时的 fetch
 */
async function fetchWithRetry(url, options = {}) {
  const { retries = MAX_RETRIES, timeout = FETCH_TIMEOUT } = options;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
        signal: controller.signal,
        redirect: 'follow',
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      
      const isAborted = error.name === 'AbortError';
      const errorMsg = isAborted ? '请求超时' : error.message;
      
      if (attempt < retries) {
        const delay = 500 * Math.pow(2, attempt - 1);
        console.warn(`  ⚠️ 尝试 ${attempt}/${retries} 失败: ${errorMsg}，${delay}ms 后重试...`);
        await Bun.sleep(delay);
      } else {
        throw new Error(`抓取失败 (${retries} 次尝试后): ${errorMsg}`);
      }
    }
  }
}

/**
 * 简单的 HTML 标签清理
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * 从 XML 中提取标签内容
 */
function getTagContent(xml, tagName) {
  const regex = new RegExp(`<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  if (!match) return null;
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
}

/**
 * 从 XML 中提取 link href 属性
 */
function getLinkHref(xml) {
  // Atom 风格: <link href="..." />
  const hrefMatch = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (hrefMatch) return hrefMatch[1];
  
  // RSS 风格: <link>...</link>
  const linkContent = getTagContent(xml, 'link');
  return linkContent || '#';
}

/**
 * 提取所有 category 标签
 */
function getCategories(xml) {
  const categories = [];
  
  // Atom: <category term="X" />
  const termRegex = /<category[^>]*term=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = termRegex.exec(xml)) !== null) {
    if (!categories.includes(match[1])) {
      categories.push(match[1]);
    }
  }
  
  // RSS: <category>X</category>
  const tagRegex = /<category(?:\s+[^>]*)?>([\s\S]*?)<\/category>/gi;
  while ((match = tagRegex.exec(xml)) !== null) {
    const cat = stripHtml(match[1]);
    if (cat && !categories.includes(cat)) {
      categories.push(cat);
    }
  }
  
  return categories;
}

// ============================================================================
// RSS/Atom 解析器
// ============================================================================

/**
 * 通用 RSS/Atom 解析器（纯正则实现，兼容 Bun）
 */
function parseFeed(xml) {
  const entries = [];
  
  // 匹配 entry (Atom) 或 item (RSS)
  const entryRegex = /<(entry|item)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/gi;
  
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const content = match[2];
    
    const title = getTagContent(content, 'title') || 'Untitled';
    const link = getLinkHref(content);
    const description = getTagContent(content, 'summary') 
      || getTagContent(content, 'description') 
      || getTagContent(content, 'content') 
      || '';
    const pubDate = getTagContent(content, 'updated') 
      || getTagContent(content, 'pubDate') 
      || getTagContent(content, 'published') 
      || null;
    const categories = getCategories(content);
    
    entries.push({
      title: stripHtml(title),
      url: link,
      description: stripHtml(description),
      pubDate,
      categories,
    });
  }
  
  return entries;
}

// ============================================================================
// 配置读取
// ============================================================================

/**
 * 从 config.js 解析支持的语言列表
 */
async function getLanguagesFromConfig() {
  try {
    const configPath = join(LOCALES_DIR, 'config.js');
    const configFile = file(configPath);
    
    if (!(await configFile.exists())) {
      return ['zh', 'en'];
    }
    
    const content = await configFile.text();
    
    // 提取 locales 对象的键
    const localesMatch = content.match(/export\s+const\s+locales\s*=\s*\{([\s\S]*?)\};/);
    if (!localesMatch) return ['zh', 'en'];
    
    const body = localesMatch[1];
    const languages = [];
    const keyRegex = /^\s*(\w+)\s*:\s*\{/gm;
    
    let match;
    while ((match = keyRegex.exec(body)) !== null) {
      languages.push(match[1]);
    }
    
    return languages.length > 0 ? languages : ['zh', 'en'];
  } catch (error) {
    console.warn('⚠️ 解析语言配置失败:', error.message);
    return ['zh', 'en'];
  }
}

/**
 * 获取指定语言的 RSS 配置
 */
async function getConfig(lang) {
  try {
    const configPath = join(LOCALES_DIR, `${lang}.json`);
    const configFile = file(configPath);
    
    if (!(await configFile.exists())) {
      return null;
    }
    
    const json = await configFile.json();
    return json.featuredPosts?.rss || null;
  } catch (error) {
    console.warn(`⚠️ 读取配置文件 ${lang}.json 失败:`, error.message);
    return null;
  }
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  console.log('🚀 Bun RSS Fetcher v2.0');
  console.log('========================\n');
  
  const startTime = performance.now();
  const languages = await getLanguagesFromConfig();
  console.log(`📋 检测到支持的语言: ${languages.join(', ')}\n`);
  
  const allData = {};
  
  for (const lang of languages) {
    console.log(`\n=== 处理语言: ${lang.toUpperCase()} ===`);
    
    const config = await getConfig(lang);
    
    // 获取配置
    let feeds = config?.feeds || [];
    const limit = config?.limit || 4;
    
    if (feeds.length === 0) {
      console.log(`  ℹ️ 未配置 RSS feeds，跳过。`);
      allData[lang] = [];
      continue;
    }
    
    // 规范化 feeds 配置
    feeds = feeds.map(f => typeof f === 'string' ? { url: f, parser: 'default' } : f);
    
    console.log(`  📡 开始抓取 ${feeds.length} 个 RSS 源...`);
    
    let langPosts = [];
    
    for (const feedConfig of feeds) {
      const { url, parser: parserName = 'default' } = feedConfig;
      
      try {
        console.log(`  → 抓取: ${url}`);
        const xml = await fetchWithRetry(url);
        const items = parseFeed(xml);
        
        console.log(`    ✓ 发现 ${items.length} 篇文章`);
        langPosts = langPosts.concat(items);
      } catch (error) {
        console.error(`    ✗ 失败: ${error.message}`);
      }
    }
    
    // 去重（根据 URL）
    const seen = new Set();
    langPosts = langPosts.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
    
    // 排序（按时间倒序）
    langPosts.sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
      const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
      return dateB - dateA;
    });
    
    // 截取并格式化
    const displayPosts = langPosts.slice(0, limit).map((item, index) => {
      const seed = getHash(item.url + item.title);
      const description = item.description.substring(0, 200) + (item.description.length > 200 ? '...' : '');
      
      return {
        id: `rss-${lang}-${index}-${getHash(item.url)}`,
        title: item.title,
        description,
        url: item.url,
        image: `https://picsum.photos/seed/${seed}/600/350`,
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        categories: item.categories,
        overlayColor: 'bg-black',
        overlayOpacity: 'bg-opacity-70',
        isRSS: true,
      };
    });
    
    allData[lang] = displayPosts;
    console.log(`  ✅ 成功处理 ${displayPosts.length} 篇文章`);
  }
  
  // 写入输出文件
  const outputJson = JSON.stringify(allData, null, 2);
  await write(OUTPUT_PATH, outputJson);
  
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log(`\n========================`);
  console.log(`✅ 完成！数据已写入 ${OUTPUT_PATH}`);
  console.log(`⏱️  耗时: ${elapsed}s`);
}

// 执行主函数
main().catch(error => {
  console.error('\n❌ 脚本执行失败:', error);
  process.exit(1);
});
