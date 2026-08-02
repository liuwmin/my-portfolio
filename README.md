# 个人作品站（摄影师 / AI 创作者 / 影像制作者）

这是一个用 **Next.js + Tailwind CSS** 搭建的暗黑科幻金属风个人作品展示网站。
你**完全不需要懂编程**就能维护它——所有内容都集中放在 `content/` 文件夹里的几个 JSON 文件中，改完文件刷新页面即可。

---

## 一、目录结构（你只需要关心 content/）

```
my-portfolio/
├── content/              ← ★ 你平时只改这里 ★
│   ├── site.json         # 名字、邮箱、社交链接、首页大图
│   ├── photos.json       # 摄影作品
│   ├── ai-works.json     # AI 作品
│   ├── videos.json       # 视频作品（用外部链接）
│   └── posts.json        # 博客文章
├── app/                  # 页面（一般不用动）
├── components/           # 组件（一般不用动）
├── public/               # 放本地图片的地方（见下文）
├── next.config.ts        # 网站配置（一般不用动）
└── package.json          # 依赖清单（一般不用动）
```

---

## 二、如何修改网站内容

打开 `content/` 文件夹里的 JSON 文件，按下面的说明改：

### 1. site.json（基本信息）
```json
{
  "profile": {
    "name": "你的名字",
    "tagline": "PHOTOGRAPHER & AI ARTIST & FILMMAKER",
    "bio": "你的个人简介……",
    "email": "you@example.com",
    "avatar": "头像图片链接",
    "social": {
      "instagram": "https://instagram.com/你的账号",
      "twitter": "https://twitter.com/你的账号",
      "youtube": "https://youtube.com/@你的账号",
      "github": "https://github.com/你的账号"
    }
  },
  "hero": {
    "backgroundImage": "首页背景大图链接",
    "title": "你的名字",
    "subtitle": "首页副标题"
  }
}
```

### 2. photos.json / ai-works.json / videos.json / posts.json
每个文件里都是一个数组（用 `[ ]` 包裹的列表）。
- **加一条**：复制数组里已有的一项，改里面的文字和链接即可。
- **删一条**：把那一项（包括前后的逗号）整段删掉。
- **改一条**：直接改对应字段的文字。

> ⚠️ JSON 格式很严格：字符串必须用英文双引号 `"`，各项之间用逗号 `,` 分隔，最后一个后面**不能**有逗号。改完保存即可。

### 图片 / 视频链接怎么填？
- **用网络图床 / 云存储**：把 JSON 里的链接换成你的图片直链。
- **用本地图片**：把图片文件拖进 `public/works/` 文件夹，然后在 JSON 里写 `/works/你的图.jpg`。
- **视频**：必须使用外部链接（不建议放本地，文件太大）。把视频上传到 YouTube / Bilibili / 网盘等，把播放页或直链填进 `videoUrl`。

---

## 三、本地预览（看效果）

需要先安装 [Node.js 18+](https://nodejs.org)（如果还没装的话）。

在终端进入项目目录后运行：

```bash
npm install      # 第一次需要，安装依赖（只需一次）
npm run dev      # 启动本地预览
```

然后浏览器打开 http://localhost:3000 就能看到网站。
改完 `content/` 里的文件，保存后网页会自动刷新。

停止预览：在终端按 `Ctrl + C`。

---

## 四、部署到互联网（推荐 Vercel，免费）

1. 注册 [GitHub](https://github.com) 账号，新建一个仓库，把整个 `my-portfolio` 文件夹上传上去。
2. 注册 [Vercel](https://vercel.com)（用 GitHub 登录即可），点击 **"Add New Project"**。
3. 选择你的 GitHub 仓库，框架选 **Next.js**，点击 **Deploy**。
4. 等待 1–2 分钟，你会得到一个 `xxx.vercel.app` 的网址，任何人都能访问。
5. 以后每次修改 JSON 或代码并推送到 GitHub，网站会**自动更新**。

---

## 五、常见问题

- **页面打不开 / 白屏**：先确认 `npm install` 已成功跑完，再运行 `npm run dev`。
- **图片不显示**：检查 JSON 里的图片链接是否能直接在浏览器打开；本地图片要放在 `public/works/` 下，路径写 `/works/xxx.jpg`。
- **改了内容没变化**：确认保存了文件；本地预览一般有热更新，若没有就刷新浏览器。

---

祝你玩得开心 ✨ 有任何想调整的地方（配色、布局、加页面等），都可以随时让帮你建站的人改。
