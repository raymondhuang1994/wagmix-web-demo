# 地区提示与 IP 检测接入 · V20

V20 将地区逻辑改为可关闭的信息提示。网页不会因为正在检测、命中地区、超时或检测失败而持续封锁。当前交付仍默认 `preview` 模式，没有接入真实 IP 检测服务。

## 用户可见内容

标题：**地區提示 / Jurisdiction Notice**。

英文正文：

> The products and services described on this website are not intended for persons located in restricted jurisdictions. Nothing on this website is intended to constitute an offer or solicitation to persons in those jurisdictions.
>
> Access to this website does not establish eligibility for any product or service.

繁中正文：

> 本網站所述產品及服務並非面向位於受限制司法管轄區的人士。本網站的任何內容均不應被解讀為向該等地區的任何人士作出要約或招攬。
>
> 瀏覽本網站並不代表您符合任何產品或服務的參與資格。

弹窗不展示国家／地区清单，不提供“查看具体地区”、展开清单或相关跳转，也不显示访客具体地区。规则在配置中维护，不作为弹窗内容。

主按钮为 **我已了解 / I Understand**。右上角 ×、Esc 和背景点击均可关闭。关闭只代表已提示，不代表确认投资资格或取消产品自身限制。

## 交互

- 检测在后台进行，页面正常展示和操作。
- 命中地区时显示可关闭的提示。
- 弹窗打开时采用正常的焦点循环和临时背景滚动管理；所有关闭方式均解除这些状态并恢复焦点。
- 检测失败、超时或返回无法识别的国家代码时，页面继续可用，仅显示可关闭的失败提示及重试入口，不猜测访客所在国家。
- 同一会话内，已关闭的同一地区、同一文案版本提示不因刷新或页面／语言切换反复弹出。地区或文案版本变化时可重新提示。
- 浏览器存储不可用时使用内存降级，不因保存失败封锁页面。离线文件的跨文件会话存储行为取决于浏览器。
- 前端不显示或保存完整 IP，只使用国家代码结果和本地提示状态。

## 规则清单（仅供配置与交接）

以下为客户提供的 17 项，不是 IP 服务商对法律适用范围的判断。下表不会显示在弹窗。

| 客户指定地区 | 匹配方式 |
|---|---|
| Abu Dhabi Global Market（ADGM） | 与 DIFC、阿联酋其余地区合并匹配 AE |
| British Virgin Islands（英屬維爾京群島） | VG |
| Dubai International Financial Centre（DIFC） | AE |
| European Economic Area（歐洲經濟區） | 下列 30 个成员国代码 |
| Hong Kong（香港） | HK |
| Kingdom of Bahrain（巴林） | BH |
| Macau（澳門） | MO |
| Malaysia（馬來西亞） | MY |
| People’s Republic of China（中國內地，不含港澳台） | CN；HK、MO、TW 分别配置 |
| Qatar（卡塔爾，含 QFC） | QA |
| Saudi Arabia（沙特阿拉伯） | SA |
| Singapore（新加坡） | SG |
| Taiwan（台灣） | TW |
| Thailand（泰國） | TH |
| United Arab Emirates（阿聯酋，不含 DIFC 和 ADGM） | AE；与以上两金融区合并覆盖阿联酋 |
| United Kingdom（英國） | GB |
| United States（美國） | US |

EEA 为欧盟 27 国加冰岛、列支敦士登和挪威，配置为：

```text
AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO
```

另有 14 个国家／地区代码：

```text
AE VG HK BH MO MY CN QA SA SG TW TH GB US
```

合计 44 个独立代码。BVI 不匹配美属维尔京群岛 VI；英国使用 GB。名单不自动延伸至未列出的海外属地。普通国家级 IP 结果不用于推断 ADGM、DIFC 或 QFC 的具体区内位置。

参考：[EEA 范围（EFTA）](https://www.efta.int/eea) · [IP 定位及精度限制（Cloudflare）](https://developers.cloudflare.com/network/ip-geolocation/)。

## 接入正式检测

配置位于 `src/data/site-config.json` 的 `geoAccess`，包括 `mode`、`endpoint`、`restrictedCountries`、`timeoutMs`、`noticeVersion`。

正式部署时使用 `mode: "server"`，配置网站同源 HTTPS 接口，例如 `/api/geo-access`。接口由部署平台可信的国家信息或既有 IP 定位服务返回：

```json
{"country":"US"}
```

只返回 ISO 3166-1 alpha-2 大写国家代码；无法确定时返回 `null`。地区来自请求的可信服务端信息，不能使用浏览器自报国家或未经验证的代理请求头。

建议接口响应为 `Cache-Control: private, no-store`，防止不同访客共用检测结果。前端验证同源 HTTPS、响应状态及代码格式，设置超时；任何失败仅影响提示，不影响网页可用性。正式模式忽略演示参数。

本模块负责提示，不实施页面、API、交易或 PDF 下载封锁。它不代替发行人或交易平台自身的投资者资格规则。当前项目没有服务器／CDN 拦截部署，本次也不创建此类拦截。已存在于其他系统的访问规则不由本前端修改。

## 本地演示和验收

使用页面上的“正常瀏覽 / 地區提示 / 檢測失敗”控件验收；演示不请求真实 IP。

验收需覆盖中英文通用文案、没有地区清单入口、44 个代码匹配、关闭按钮／×／Esc／背景、刷新和语言切换、存储不可用、地区变化、超时、错误响应及重试。桌面和手机均须能关闭，长内容不得把关闭入口挤出可操作范围。

自动化检查为逻辑检查，不能替代实际浏览器视觉验收。原有 V19 强制锁页方案已由本文件取代。
