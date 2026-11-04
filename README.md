# WAGMIx 网站设计与双语网页 · V17

![WAGMIx](assets/wagmix.svg)

本项目是 WAGMIx 官网的本地 HTML 设计样稿，包含平台介绍、7709 产品目录、两款产品详情、产品文件阅读器及生态目录。**接手设计请先读 [DESIGN.md](DESIGN.md)**，其中有产品图例、导航层级、响应式规则和对应源码。

V16 使用用户提供的 WagmiX.ai 矢量标志，统一全站文字层级，并按最新获批 Hum Revised 中英文单页更新 SKHY2Lw 的营销内容及网页摘要。7709.W 共用底层行情与投资主题，保留自身的交易准入及权利安排。V17 删除首页底部地区标签和辅助标语，首页与页脚按语言展示获批的新文案；英文口号保留 Define The Next Wave On‑Chain。

本次首页更新与验证结果见 [RELEASE_V17.md](RELEASE_V17.md)，此前产品文件差异见 [RELEASE_V16.md](RELEASE_V16.md)。原始英文白皮书 PDF 与逐条中英文引文未改；最新版单页与原白皮书中的部分安排存在版本差异，网页导读已标明。

**当前 IP 检测为演示模式，不会读取真实 IP，也不会请求第三方定位服务。** 页面上的演示控件可以切换正常访问、美国受限及无法验证三种状态。正式检测及访问限制的接入要求见 [GEO_ACCESS.md](GEO_ACCESS.md)。

| 产品代码 | 底层资产 | 网络 | 页面识别 |
|---|---|---|---|
| **7709.W** | 港交所 7709.HK | BNB Smart Chain（拟部署） | 深色产品页、方形标识，目录首位 |
| **SKHY2Lw** | 港交所 7709.HK | Solana | 浅色产品页、圆形标识 |

### 在本地查看

下载并解压完整仓库，打开 [繁体中文 HTML](WAGMIx_繁體中文_V17.html) 或 [English HTML](WAGMIx_English_V17.html)。`index.html` 同样进入繁中版。页面样式、图片和脚本均已内嵌，PDF 从旁边的 `downloads/` 目录读取，请保留完整目录。行情模块展示 7709.HK 的历史快照，数据截至 2026 年 10 月 28 日。

美国限制示例可通过 `WAGMIx_English_V17.html?geoPreview=US` 或繁中页面的同一参数打开；直接打开页面默认显示正常浏览示例。所有模拟状态都带演示标识。此仓库仅交付设计与代码，不启用 GitHub Pages。

### 修改后重新生成网页

在仓库根目录执行以下命令。构建使用 Python 3 标准库，路由检查使用 Node.js 18 或更高版本。

```sh
python3 build.py
node tools/check.mjs
node tools/check-geoban.mjs
```

| 要修改的内容 | 源文件 |
|---|---|
| 地区限制弹窗、预览状态及服务端检测接入 | [geoban.js](src/scripts/geoban.js) · [geoban.css](src/styles/geoban.css) · [接入说明](GEO_ACCESS.md) |
| 双语顶部菜单、侧栏、语言切换和章节跳转 | [sidebar.js](src/scripts/sidebar.js) |
| 首页、产品目录、生态目录 | [main.js](src/scripts/main.js) · [catalog.js](src/scripts/catalog.js) · [ecosystem.js](src/scripts/ecosystem.js) |
| 7709.W 产品条款及深色详情页 | [adgm.js](src/scripts/adgm.js) · [adgm-v9.css](src/styles/adgm-v9.css) |
| SKHY2Lw 产品页及文件阅读器 | [product.js](src/scripts/product.js) · [docs.js](src/scripts/docs.js) · [白皮书节选](src/scripts/whitepaper-data.js) |
| 品牌色、字号、断点及产品标识 | [样式目录](src/styles) · [标识组件](src/scripts/product-marks.js) · [品牌资源](assets) |
| 全站阅读层级与首页双语版式 | [reading-v16.css](src/styles/reading-v16.css) · [brand-v17.css](src/styles/brand-v17.css) |
| 展示日期、产品顺序及下载文件映射 | [site-config.json](src/data/site-config.json) |
| 可下载文件 | [英文白皮书及双语产品单页](downloads) |

编辑 `src/` 中的源文件后重新构建，两种语言的 HTML 会同步更新。查看产品条款时按产品代码分别进入对应文件。品牌标志、文件及行情数据保留各自来源和权利标识。
