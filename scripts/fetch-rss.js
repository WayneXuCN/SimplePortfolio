#!/usr/bin/env node
/**
 * fetch-rss.js
 * 构建前脚本：从远程 Atom/RSS feed 抓取最新文章并写入 `src/data/rss-posts.json`
 *
 * 功能：
 * 1. 读取 src/locales/zh.json 中的 featuredPosts.rss 配置
 * 2. 支持聚合多个 feed
 * 3. 增强的 XML 解析（优先 xml2js，降级正则）
 * 4. 生成确定性的随机图片（picsum seed）
 * 5. 提取所有 categories/tags
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// 尝试加载可选依赖
let xml2js;
try {
  xml2js = require('xml2js');
} catch (e) {
  xml2js = null;
}

// 配置文件路径
const LOCALES_DIR = path.resolve(__dirname, '../src/locales');
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/rss-posts.json');

// 获取指定语言的配置
function getConfig(lang) {
  try {
    const configPath = path.join(LOCALES_DIR, `${lang}.json`);
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const json = JSON.parse(content);
      return json.featuredPosts && json.featuredPosts.rss ? json.featuredPosts.rss : null;
    }
  } catch (e) {
    console.warn(`读取配置文件 ${lang}.json 失败:`, e.message);
  }
  return null;
}

// 从 config.js 解析支持的语言列表
function getLanguagesFromConfig() {
  try {
    const configPath = path.join(LOCALES_DIR, 'config.js');
    if (!fs.existsSync(configPath)) return ['zh', 'en'];

    const content = fs.readFileSync(configPath, 'utf8');
    // 提取 export const locales = { ... } 区块
    const localesMatch = content.match(/export\s+const\s+locales\s*=\s*\{([\s\S]*?)\};/);
    if (!localesMatch) return ['zh', 'en'];

    const body = localesMatch[1];
    const languages = [];
    // 匹配 key: { ... } 形式的键
    const keyRegex = /^\s*(\w+)\s*:\s*\{/gm;
    let match;
    while ((match = keyRegex.exec(body)) !== null) {
      languages.push(match[1]);
    }

    return languages.length > 0 ? languages : ['zh', 'en'];
  } catch (e) {
    console.warn('解析语言配置失败:', e.message);
    return ['zh', 'en'];
  }
}

async function main() {
  const languages = getLanguagesFromConfig();
  console.log(`检测到支持的语言: ${languages.join(', ')}`);

  const allData = {};

  for (const lang of languages) {
    console.log(`
=== 处理语言: ${lang} ===`);
    const config = getConfig(lang);

    // 默认配置
    let feeds = (config && config.feeds) || [];
    const limit = (config && config.limit) || 4;

    if (feeds.length === 0) {
      console.log(`[${lang}] 未配置 RSS feeds，跳过。`);
      allData[lang] = [];
      continue;
    }

    // 规范化 feeds 配置 (支持字符串或对象)
    feeds = feeds.map(f => (typeof f === 'string' ? { url: f, parser: 'default' } : f));

    console.log(`[${lang}] 开始抓取 ${feeds.length} 个 RSS 源...`);

    let langPosts = [];

    for (const feedConfig of feeds) {
      const { url, parser: parserName = 'default' } = feedConfig;
      try {
        console.log(`[${lang}] 正在抓取: ${url} (Parser: ${parserName})`);
        const xml = await fetchUrl(url);

        const parser = PARSERS[parserName] || PARSERS['default'];
        const items = await parser(xml);

        console.log(`  - 发现 ${items.length} 篇文章`);
        langPosts = langPosts.concat(items);
      } catch (err) {
        console.error(`  - 抓取失败 ${url}:`, err.message);
      }
    }

    // 去重 (根据 URL)
    const seen = new Set();
    langPosts = langPosts.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    // 排序 (按时间倒序)
    langPosts.sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
      const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
      return dateB - dateA;
    });

    // 截取前 N 篇
    const displayPosts = langPosts.slice(0, limit).map((item, index) => {
      // 生成确定性随机图片
      const seed = getHash(item.url + item.title);

      return {
        id: `rss-${lang}-${index}-${getHash(item.url)}`,
        title: item.title,
        description: item.description.replace(/<[^>]+>/g, '').substring(0, 200) + '...', // 简单去除 HTML 标签
        url: item.url,
        image: `https://picsum.photos/seed/${seed}/600/350`, // 使用 seed 保证构建一致性
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        categories: item.categories || [],
        overlayColor: 'bg-black',
        overlayOpacity: 'bg-opacity-70',
        isRSS: true, // 标记为 RSS 来源
      };
    });

    allData[lang] = displayPosts;
    console.log(`[${lang}] 成功处理 ${displayPosts.length} 篇文章`);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allData, null, 2), 'utf8');
  console.log(`
所有语言处理完成，数据已写入 ${OUTPUT_PATH}`);
}

main();

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Request Failed. Status Code: ${res.statusCode} URL: ${url}`));
      }
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', chunk => (raw += chunk));
      res.on('end', () => resolve(raw));
    });
    req.on('error', e => reject(e));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request Timeout'));
    });
  });
}

// 简单的哈希函数用于生成确定性的图片 seed
function getHash(str) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, 8);
}

// 增强的正则解析（Fallback）
function simpleParseFeed(xml) {
  const entries = [];
  // 匹配 entry (Atom) 或 item (RSS)
  // 使用 [\s\S] 而不是 . 来匹配跨行内容
  const entryRe = /<(entry|item)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/gi;

  let m;
  while ((m = entryRe.exec(xml)) !== null) {
    const content = m[2];

    const getTag = tag => {
      const re = new RegExp(`<${tag}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const mm = content.match(re);
      return mm ? mm[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim() : null;
    };

    const title = getTag('title') || 'Untitled';

    // 提取 Link
    // 优先匹配 Atom 风格 <link href="..." />
    let link = '#';
    const linkHrefRe = /<link[^>]*href=["']([^"']+)["'][^>]*>/i;
    const linkHrefMatch = content.match(linkHrefRe);
    if (linkHrefMatch) {
      link = linkHrefMatch[1];
    } else {
      // RSS 风格 <link>...</link>
      link = getTag('link') || '#';
    }

    const description = getTag('summary') || getTag('description') || getTag('content') || '';
    const pubDate = getTag('updated') || getTag('pubDate') || getTag('published') || null;

    // 提取 Categories
    const categories = [];
    // Atom: <category term="X" />
    const catTermRe = /<category[^>]*term=["']([^"']+)["'][^>]*>/gi;
    let cm;
    while ((cm = catTermRe.exec(content)) !== null) {
      categories.push(cm[1]);
    }
    // RSS: <category>X</category>
    const catTagRe = /<category(?:\s+[^>]*)?>([\s\S]*?)<\/category>/gi;
    while ((cm = catTagRe.exec(content)) !== null) {
      const cat = cm[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
      if (cat && !categories.includes(cat)) {
        categories.push(cat);
      }
    }

    entries.push({
      title,
      url: link,
      description,
      pubDate,
      categories,
    });
  }
  return entries;
}

// 解析引擎集合
const PARSERS = {
  jekyllFeed: async xml => {
    if (xml2js) {
      try {
        const parser = new xml2js.Parser({
          explicitArray: false,
          explicitCharkey: false,
          trim: true,
        });
        const result = await parser.parseStringPromise(xml);

        let rawItems = [];
        if (result.feed && result.feed.entry) {
          // Atom
          rawItems = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
          return rawItems.map(e => {
            // Link 处理
            let url = '#';
            if (e.link) {
              if (Array.isArray(e.link)) {
                // 寻找 rel="alternate" 或者没有 rel 的 link
                const alt = e.link.find(l => !l.$ || !l.$.rel || l.$.rel === 'alternate');
                if (alt && alt.$.href) url = alt.$.href;
                else if (e.link[0].$ && e.link[0].$.href) url = e.link[0].$.href;
              } else if (e.link.$ && e.link.$.href) {
                url = e.link.$.href;
              } else if (typeof e.link === 'string') {
                url = e.link;
              }
            }

            // Categories 处理
            let categories = [];
            if (e.category) {
              const cats = Array.isArray(e.category) ? e.category : [e.category];
              categories = cats
                .map(c => (c.$ && c.$.term ? c.$.term : typeof c === 'string' ? c : ''))
                .filter(Boolean);
            }

            return {
              title: (e.title && (e.title._ || e.title)) || 'Untitled',
              url,
              description:
                (e.summary && (e.summary._ || e.summary)) ||
                (e.content && (e.content._ || e.content)) ||
                '',
              pubDate: e.updated || e.published || null,
              categories,
            };
          });
        } else if (result.rss && result.rss.channel && result.rss.channel.item) {
          // RSS
          rawItems = Array.isArray(result.rss.channel.item)
            ? result.rss.channel.item
            : [result.rss.channel.item];
          return rawItems.map(e => {
            let categories = [];
            if (e.category) {
              categories = Array.isArray(e.category) ? e.category : [e.category];
            }
            return {
              title: e.title || 'Untitled',
              url: e.link || '#',
              description: e.description || '',
              pubDate: e.pubDate || null,
              categories,
            };
          });
        }
      } catch (e) {
        console.warn('xml2js 解析失败，尝试降级解析:', e.message);
      }
    }
    return simpleParseFeed(xml);
  },
  default: async xml => {
    // 标准 RSS/Atom 解析器
    if (xml2js) {
      try {
        const parser = new xml2js.Parser({
          explicitArray: false,
          explicitCharkey: false,
          trim: true,
        });
        const result = await parser.parseStringPromise(xml);

        let rawItems = [];
        if (result.feed && result.feed.entry) {
          // Standard Atom
          rawItems = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
          return rawItems.map(e => {
            let url = '#';
            if (e.link) {
              // Atom standard: link with rel='alternate' or no rel is the permalink
              const links = Array.isArray(e.link) ? e.link : [e.link];
              const alt = links.find(l => !l.$ || !l.$.rel || l.$.rel === 'alternate');
              if (alt && alt.$.href) url = alt.$.href;
            }

            let categories = [];
            if (e.category) {
              const cats = Array.isArray(e.category) ? e.category : [e.category];
              categories = cats.map(c => (c.$ && c.$.term ? c.$.term : '')).filter(Boolean);
            }

            return {
              title: (e.title && (e.title._ || e.title)) || 'Untitled',
              url,
              description: (e.summary && (e.summary._ || e.summary)) || '',
              pubDate: e.updated || e.published || null,
              categories,
            };
          });
        } else if (result.rss && result.rss.channel && result.rss.channel.item) {
          // Standard RSS 2.0
          rawItems = Array.isArray(result.rss.channel.item)
            ? result.rss.channel.item
            : [result.rss.channel.item];
          return rawItems.map(e => {
            let categories = [];
            if (e.category) {
              categories = Array.isArray(e.category) ? e.category : [e.category];
            }
            return {
              title: e.title || 'Untitled',
              url: e.link || '#',
              description: e.description || '',
              pubDate: e.pubDate || null,
              categories,
            };
          });
        }
      } catch (e) {
        console.warn('Standard parser failed, falling back to simple parser:', e.message);
      }
    }
    return simpleParseFeed(xml);
  },
};
