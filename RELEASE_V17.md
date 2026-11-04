# V17 首页品牌文案更新

日期：2026 年 11 月 4 日。本次仅更新网页品牌表达及首页布局，产品内容、单页 PDF、白皮书及地区限制行为沿用 V16。

- 英文首页及页脚口号：**Define The Next Wave On‑Chain**。
- 英文简介：Powered by institutional liquidity, regulated custody, and 24/7 onchain infrastructure, WAGMIx brings curated Asian assets from leading asset managers to global markets.
- 繁中首页及页脚口号：**引領鏈上新浪潮**。
- 繁中简介：機構級流動性，合規託管，全天候鏈上連接。／WAGMIx 聚焦亞洲精選資產，讓價值鏈接全球。（两句分行展示。）
- 删除首页底部的品牌地区标签及辅助标语，同时移除对应分隔线，收紧首屏留白。
- 根据中英文文案长度调整首屏，保留品牌图片、导航、操作按钮和五项能力入口。
- 品牌文字统一维护在 `src/data/site-config.json`，首页版式在 `src/styles/brand-v17.css`，使用 `python3 build.py` 同步生成双语入口。

交付包含繁中 HTML、英文 HTML、源码及原有下载文件，不启用 GitHub Pages。PDF 仍从同级 `downloads/` 目录读取。

验证沿用双语路由和地区交互检查，并核对中英文首页／页脚文字及下载文件一致性，结果见 `verification.json`。本轮未进行真实浏览器视觉验收。地区限制仍为明确标注的演示模式，真实 IP 和服务端拦截接入状态未变；详见 `GEO_ACCESS.md`。
