# WAGMIx 双语网页设计说明

客户从「產品」菜单认出底层资产 **7709.HK**，再用 **7709.W** 或 **SKHY2Lw** 选择产品。菜单、目录与详情页分别承担这三个层次的信息。下载仓库后，可直接打开[繁中入口](index.html)或[英文入口](WAGMIx_English_V14.html)查看完整交互。

| <img src="assets/7709.W.svg" width="72" height="72" alt="7709.W 深蓝方形图标"> | <img src="assets/SKHY2Lw.svg" width="72" height="72" alt="SKHY2Lw 蓝银圆形图标"> |
|:---|:---|
| **7709.W** 采用深蓝方形。首页和列表中优先展示，详情页使用深色背景与透明反白 WAGMIx 字标。 | **SKHY2Lw** 采用银边蓝色圆形。浅色详情页使用标准 WAGMIx 字标，日期与 Solana 入口随本产品展示。 |

### 菜单与侧栏分别负责选页和定位章节

- 全站顶部保留「關於 WAGMIx」「產品」「生態」、语言切换及联系方式。「產品」下拉卡先显示品类，再用两行排出交易所及底层代码、底层产品正式名称。整卡可点击。
- 首页五项能力按平台、托管、流动性、架构、投研排序，导航始终展开。产品列表按产品代码、网络、状态排列，每行都可进入详情。
- 两款详情页均依序展示产品总览、底层行情、投资主题、核心卖点、产品资料与权利、产品文件。桌面侧栏显示产品代码和六个章节，窄屏目录可收起。切换语言时保留所在产品和章节。
- 生态页按产品与网络组合筛选。卡片默认只显示标志和名称，悬停、键盘聚焦或触屏点按后显示机构简介和来源。

### 版式用颜色和轮廓区分产品

基础正文色为 `#071E3B`，品牌蓝为 `#086BE8`，浅蓝底为 `#EEF6FF`。7709.W 详情使用 `#070C13` 深色底与高对比文字，页头和页脚的反白字标直接贴背景。两枚产品图标均只刻「7709」，旁边的文本显示完整代码。图标单独使用时，以完整代码作为无障碍名称。

产品目录桌面主标题随视口在 35–60 px 间缩放，菜单品类名为 19 px，下面两行底层资料为 15–16 px。系统按 Inter、系统西文字体及繁体中文字体回退。宽度 ≤900 px 时，顶部导航收起，产品表改为逐项标注的卡片。生态目录在 ≤780 px 时由三列改为两列。深色页的环形动效应响应系统的减少动态效果设置。

两种语言首页使用英文品牌口号 **Define The Next Wave On‑Chain.**，宽屏分为两行，≤600 px 分为三行。保留 `On‑Chain` 中的连字符、句末句点和英文语言标记，字号规则位于 `home-v9.css`。

首页直接从口号开始，下方仅显示以下英文介绍，再接操作按钮。两种语言使用完全相同的介绍：

> Powered by elite liquidity and regulated custody, WAGMIx bridges institutions and assets 24/7 on-chain—making regional value globally tradable.

两张首页产品横幅共用组件与尺寸规则，7709.W 深色在上，SKHY2Lw 浅色在下。桌面均为左侧文字、右侧图标，共用内边距、图标容器、文字层级及查看产品入口；手机采用相同的堆叠结构。外层网格使两张横幅保持等高，并允许内容随字号及视口增长。

### 生态简介使用官网口径，并区分品牌与法律主体

机构卡片的标志和简介采用下列官方来源。Finloop 的白色 SVG 使用 `#071a2e` 深色底板。Finloop 集团品牌与 Finloop Finance Limited 持牌子公司分别表述；复星证券简介说明其与复星财富控股的从属关系及所用集团标志。

| 条目 | 官方介绍 |
|---|---|
| CSOP | https://www.csopasset.com/en/about/overview |
| Fosun International Securities | https://www.fosunwealth.hk/us?index=1 |
| Finloop | https://finloop.global/en/about |
| Beosin | https://www.beosin.com/ |
| BNB Smart Chain | https://www.bnbchain.org/en/bnb-smart-chain |
| Solana | https://solana.com/ |

机构简介仅说明自身业务，具体合作关系、合约审计范围及产品部署以对应产品文件为依据。筛选中的产品与网络关系单独维护于 `v9EcoRelations`，不得由一般官网介绍推断。Finloop 标志来自 https://finloop.global/assets/finloop-logo.svg 。

### 网络、行情与权利采用各自的披露口径

7709.W 的网络标示为「BNB Smart Chain（擬部署）」。产品状态「即將上線」与网络部署状态分别呈现。SKHY2Lw 的 Solana 交易入口在有正式链接后才可启用。两款页面引用的历史行情均属 **7709.HK**，展示行情日期及币种。

发行架构名称仅出现于「產品資料與權利」和「產品文件」及其导读。两款产品的赎回资格、结算安排和文件应分别维护。SKHY2Lw 产品单页按当前语言下载，白皮书统一下载英文 PDF，中文译文仅供参考。

V14 的 SKHY2Lw 营销文字采用 R2 产品单页。参数表同时列明计划交易对、适用申贖费用、托管费基数、每笔一级交易最低数量及例外；完整权利以英文白皮书及最终交易文件为准。首页 T0 脚注明确适用于 SKHY2Lw；7709.W 的申赎资格及结算安排仍使用其独立产品文件。两款产品共享的 HBM 标题采用 2026 年第二季全球营收排名口径。

下载映射在 `site-config.json` 中维护：单页使用 `WAGMIx_SKHY2Lw_Factsheet_ZH_R2_Brand.pdf` 和 `WAGMIx_SKHY2Lw_Factsheet_EN_R2_Brand.pdf` 文件。品牌口号位于单页底部的「关于 WAGMIx」右侧，官网链接靠右排列。白皮书提供英文原文。构建会检查下载文件为有效 PDF 文件头，路由检查同时核对语言对应的下载路径及关键产品条件。

页面和交互在 [src/scripts](src/scripts/)，样式在 [src/styles](src/styles/)，内容、数据和配置在 [src/data](src/data/)。更新图标时，同步核对[独立图标](assets/)与网页内嵌版本；更新网页后，用同一组产品与章节链接复核两个语言入口。
