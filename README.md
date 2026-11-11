# WAGMIx 网站设计与双语网页 · V31 审阅版

![WAGMIx](assets/wagmix-uppercase.png)

本项目包含平台介绍、产品目录、7709w 和 SKHY2Lw 产品详情、文件阅读器、生态目录及联系页。它是可交接给设计与开发 agent 的 HTML 样稿和源码，未启用 GitHub Pages。

V31 将已发布 Launch 的做市、资产上链、团队专长及联系文案同步到完整版。平台通用脚注使用底层资产交易时段，并保留交收顺延条件。首页及独立联系页按 X、Telegram、电子邮件纵向排列。英文为默认入口，页首可切换繁体中文。具体差异见 [V31 修改对照](RELEASE_V31.md)。

本版沿用 V8 产品单页与原白皮书。产品披露和脚标见 [V21 修改记录](RELEASE_V21.md)，地区提示见 [V20 修改记录](RELEASE_V20.md)。

## 打开交付文件

克隆仓库或下载并解压 GitHub ZIP，再打开 [English HTML](WAGMIx_English_V31.html) 或 [繁体中文 HTML](WAGMIx_繁體中文_V31.html)。`index.html` 为英文入口。字体、图片、样式和脚本均内嵌。正式 PDF 位于旁边的 `downloads/` 目录。根目录的 favicon 和分享预览图片供托管网站读取。

| 产品代码 | 底层资产 | 网络 | 页面识别 |
|---|---|---|---|
| 7709w | 港交所 7709.HK | BNB Smart Chain（拟部署） | 深色页面、方形标识 |
| SKHY2Lw | 港交所 7709.HK | Solana | 浅色页面、圆形标识 |

旧 7709.W 路径保留跳转。产品目录展示一段通用免责声明，两款产品详情各自展示适用声明。Cocoa 可单独打开 [繁中版](Cocoa_Issuer_繁體中文.html) 或 [英文版](Cocoa_Issuer.html)，示例 PDF 内嵌于文件页。正式发行人页面路径预留 `/issuer/cocoa1`。7709w 产品页的正式 Prospectus 入口状态为待提供。

**行情仍为截至 2026 年 10 月 28 日的历史快照。IP 检测仍为演示模式，没有接入真实 IP 服务。** 演示控件可切换正常浏览、地区提示及检测失败。地区提示可以关闭，不封锁内容或 PDF 下载。真实检测需配置同源服务端接口，详见 [GEO_ACCESS.md](GEO_ACCESS.md)。

## 修改与构建

```sh
python3 build.py
node tools/check.mjs
node tools/check-geoban.mjs
node tools/check-footnotes.mjs
```

| 内容 | 源文件 |
|---|---|
| 五项能力、四卖点、来源脚注及免责声明 | [content-map.json](src/data/content-map.json) |
| 版本、品牌文案、产品顺序、下载文件 | [site-config.json](src/data/site-config.json) |
| 顶部菜单、侧栏、语言切换和旧链接跳转 | [sidebar.js](src/scripts/sidebar.js) |
| 首页能力展示 | [capability-orbit.js](src/scripts/capability-orbit.js) · [capability-orbit.css](src/styles/capability-orbit.css) |
| 首页与产品目录 | [main.js](src/scripts/main.js) · [catalog.js](src/scripts/catalog.js) |
| 联络页布局 | [contact-layout.css](src/styles/contact-layout.css) |
| SKHY2Lw 产品与共用行情／主题 | [product.js](src/scripts/product.js) |
| 7709w 产品与权利 | [adgm.js](src/scripts/adgm.js) |
| 生态、联系与独立发行人页 | [ecosystem.js](src/scripts/ecosystem.js) · [contact.js](src/scripts/contact.js) · [issuer.js](src/scripts/issuer.js) · [build.py](build.py) |
| 基础版式 | [interface-v19.css](src/styles/interface-v19.css) · [home-v19.css](src/styles/home-v19.css) · [product-v19.css](src/styles/product-v19.css) |
| 首页图标与白底生态页 | [home-v22.css](src/styles/home-v22.css) · [ecosystem-v22.css](src/styles/ecosystem-v22.css) |
| 地区提示 | [geoban.js](src/scripts/geoban.js) · [GEO_ACCESS.md](GEO_ACCESS.md) |
| 正式白皮书封面、目录和逐条原文 | [docs.js](src/scripts/docs.js) · [whitepaper-data.js](src/scripts/whitepaper-data.js) |
| V8 双语单页、英文原白皮书 | [downloads](downloads) |

网页沿用 Geist 与 Noto Sans TC，字体以 WOFF 子集内嵌，许可证在 assets/fonts。添加新字符时需更新子集或使用已配置的系统字体后备。

双语页面已通过路由、披露、下载和地区提示逻辑检查。
