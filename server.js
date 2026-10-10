/**
 * HelloWorld 网站 - 服务器入口
 * 使用 Node.js 内置 http 模块，无需安装任何第三方依赖，直接可运行。
 *
 * 功能：
 *   1. 浏览器访问时显示"Hello World！我是【你的名字】，我的第一个AI开发的网站"
 *   2. 页面同时显示当前服务器时间
 *
 * 运行方式：
 *   node server.js
 *   然后浏览器打开 http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// 服务器端口
const PORT = process.env.PORT || 3000;

// 站点名称（把这里改成你的名字即可，页面会同步更新）
const SITE_OWNER = '【你的名字】';

// 公共静态资源目录
const PUBLIC_DIR = path.join(__dirname, 'public');

// 记录服务器启动时间
const START_TIME = new Date();

/**
 * 获取当前服务器时间的格式化字符串（北京时间 UTC+8）
 */
function getServerTime() {
  const now = new Date();
  return now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
}

/**
 * 读取 index.html 模板并注入服务器渲染的数据
 */
function renderIndex() {
  const template = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');
  return template
    .replace(/{{OWNER}}/g, SITE_OWNER)
    .replace(/{{SERVER_TIME}}/g, getServerTime())
    .replace(/{{START_TIME}}/g, START_TIME.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }));
}

/**
 * 根据请求路径安全地解析出 public 目录下的文件路径，
 * 防止路径穿越（path traversal）攻击。
 */
function resolveStaticPath(urlPath) {
  let cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  if (cleanPath === '/') cleanPath = '/index.html';
  const filePath = path.normalize(path.join(PUBLIC_DIR, cleanPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return null; // 试图访问 public 目录之外，拒绝
  }
  return filePath;
}

/**
 * 根据文件扩展名返回对应的 Content-Type
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
  };
  return map[ext] || 'application/octet-stream';
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // ---- API：返回当前服务器时间（JSON）----
  if (urlPath === '/api/time' && req.method === 'GET') {
    const body = JSON.stringify({
      serverTime: getServerTime(),
      timestamp: Date.now(),
    });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(body);
    return;
  }

  // ---- 主页：返回渲染后的 HTML ----
  if (urlPath === '/' || urlPath === '/index.html') {
    try {
      const html = renderIndex();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('服务器渲染页面出错：' + err.message);
    }
    return;
  }

  // ---- 静态资源：提供 public 目录下的文件 ----
  const filePath = resolveStaticPath(urlPath);
  if (filePath) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 未找到：' + urlPath);
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('服务器错误：' + err.message);
        }
        return;
      }
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(data);
    });
    return;
  }

  // ---- 其他路径：404 ----
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 未找到：' + urlPath);
});

// 启动服务器
server.listen(PORT, () => {
  console.log('==============================================');
  console.log('  HelloWorld 网站已启动！');
  console.log('  本地访问地址: http://localhost:' + PORT);
  console.log('  局域网访问地址: http://<你的IP>:' + PORT);
  console.log('  服务器启动时间: ' + START_TIME.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }));
  console.log('  按 Ctrl + C 停止服务器');
  console.log('==============================================');
});
