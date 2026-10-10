# HelloWorld 网站（Node.js）

我的第一个 AI 开发的网站。使用 Node.js 内置模块实现，**无需安装任何第三方依赖**，直接可运行。

## 功能

1. 浏览器访问时显示：`Hello World！我是【你的名字】，我的第一个AI开发的网站`
2. 页面同时显示当前服务器时间（每 1 秒实时刷新）

## 项目结构

```
hello-world/
├── package.json          # 项目配置与启动脚本
├── server.js             # Node.js HTTP 服务器（入口）
├── README.md             # 本说明文件
└── public/               # 静态资源目录
    ├── index.html        # 页面模板
    ├── style.css         # 页面样式
    └── app.js            # 前端脚本（定时刷新服务器时间）
```

## 运行方式

### 环境要求
- 已安装 Node.js（14 或更高版本）

### 步骤

```bash
# 1. 进入项目目录
cd hello-world

# 2. 启动服务器
node server.js
# 或者使用 npm： npm start
```

### 访问

浏览器打开：<http://localhost:3000>

- 局域网内其他设备访问：`http://<你的IP>:3000`

### 修改你的名字

编辑 `server.js` 顶部：

```js
const SITE_OWNER = '【你的名字】';   // 改成你的真实名字
```

## 自定义端口

默认端口为 3000，可通过环境变量修改：

```bash
PORT=8080 node server.js
```
