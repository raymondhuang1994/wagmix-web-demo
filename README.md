# WAGMIx 网站设计与双语网页 · V24

![WAGMIx](assets/wagmix.svg)

本项目包含首页 X 形揭幕动画、平台介绍、产品目录、7709w 和 SKHY2Lw 产品详情、文件阅读器、生态目录及联系页。它是可交接给设计与开发 agent 的 HTML 样稿和源码，未启用 GitHub Pages。

V24 将「探索 WAGMIx」的导语扩到内容区全宽，将团队平均经验与专长合为标题下的一段介绍。

本版沿用 V8 产品单页与原白皮书。产品披露和脚标见 [V21 修改记录](RELEASE_V21.md)，地区提示见 [V20 修改记录](RELEASE_V20.md)。

## 打开交付文件

下载并解压完整仓库，打开 [繁体中文 HTML](WAGMIx_繁體中文_V24.html) 或 [English HTML](WAGMIx_English_V24.html)。`index.html` 同为繁中入口。字体、图片、样式和脚本均内嵌；PDF 位于旁边的 `downloads/` 目录，请保留完整目录。

| 产品代码 | 底层资产 | 网络 | 页面识别 |
|---|---|---|---|
| 7709w | 港交所 7709.HK | BNB Smart Chain（拟部署） | 深色页面、方形标识 |
| SKHY2Lw | 港交所 7709.HK | Solana | 浅色页面、圆形标识 |

旧 7709.W 路径保留跳转。两款产品的资格、权利和文件分别维护；7709w 采用专用免责声明。Prospectus 仍为待提供的禁用入口，没有实际文件下载。网页 AP 展示口径按本轮确认修改，正式产品文件仍需另行统一。

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
| V8 五项能力、四卖点、来源脚注及免责声明 | [content-map.json](src/data/content-map.json) |
| 版本、品牌文案、产品顺序、下载文件 | [site-config.json](src/data/site-config.json) |
| 顶部菜单、侧栏、语言切换和旧链接跳转 | [sidebar.js](src/scripts/sidebar.js) |
| 首页与产品目录 | [main.js](src/scripts/main.js) · [catalog.js](src/scripts/catalog.js) |
| SKHY2Lw 产品与共用行情／主题 | [product.js](src/scripts/product.js) |
| 7709w 产品与权利 | [adgm.js](src/scripts/adgm.js) |
| 生态和联系页 | [ecosystem.js](src/scripts/ecosystem.js) · [contact.js](src/scripts/contact.js) |
| 基础版式 | [interface-v19.css](src/styles/interface-v19.css) · [home-v19.css](src/styles/home-v19.css) · [product-v19.css](src/styles/product-v19.css) |
| 首页图标与白底生态页 | [home-v22.css](src/styles/home-v22.css) · [ecosystem-v22.css](src/styles/ecosystem-v22.css) |
| 地区提示 | [geoban.js](src/scripts/geoban.js) · [GEO_ACCESS.md](GEO_ACCESS.md) |
| 原白皮书与导读 | [docs.js](src/scripts/docs.js) · [whitepaper-data.js](src/scripts/whitepaper-data.js) |
| V8 双语单页、英文原白皮书 | [downloads](downloads) |

网页沿用 Geist 与 Noto Sans TC，字体以 WOFF 子集内嵌，许可证在 assets/fonts。添加新字符时需更新子集或使用已配置的系统字体后备。

源码生成的网页已通过路由、内容、下载和地区弹窗逻辑检查。本次未进行浏览器截图验证，模拟宽度检查不能代替真实设备视觉验收。原白皮书与新单页的既有版本差异已在阅读器标注。
