# 地区访问限制：交互与正式接入

本仓库交付可离线打开的双语 HTML 设计稿。V15 默认运行 **preview** 模式，没有实际 IP 定位，没有生产访问限制，也不会向第三方发送访客信息。演示开关用于验收设计；不能作为正式访问授权。

## 已确认的美国示例文案

英文：

> The products and services on this website are not intended for individuals in the United States. Nothing on this website is intended to be construed as a solicitation of any individual in the United States.

繁中：

> 本網站所載產品及服務並非面向位於美國的人士。本網站的任何內容均不應被解讀為向任何位於美國的人士作出招攬。

这是一项站点访问规则的示例，不是对访客国籍、居民身份或投资者资格的认定。当前限制清单只有 `US`。其他地区的限制及法律文案需单独确认。

## 本地演示

- 正常访问：默认状态，或 `?geoPreview=ALLOW`。
- 美国受限：`?geoPreview=US`。
- 无法验证：`?geoPreview=UNKNOWN`。
- 页面提供有明确演示标识的状态选择，切换语言时保留状态和当前章节。
- 美国受限与无法验证时，主体不可操作，背景点击及 Escape 不解除限制；可切换语言、重试或通过邮箱、X、Telegram 联系。
- 未知结果不会显示为美国。正式模式不接受演示参数或客户端选择的国家作为授权依据。

## 接手 agent 的服务端接入要求

配置在 `src/data/site-config.json` 的 `geoAccess`：

```json
{
  "mode": "preview",
  "endpoint": "",
  "restrictedCountries": ["US"],
  "timeoutMs": 6000
}
```

正式部署使用 `mode: "server"`，并配置同源 HTTPS 检测端点，例如 `/api/geo-access`。成功响应应为 JSON：

```json
{"country":"US"}
```

`country` 应为服务端可信定位结果的 ISO 3166-1 alpha-2 大写代码；无法确定时返回 `null` 或适当错误。前端在结果为空、格式无效、超时或接口错误时显示无法验证状态并暂停访问，不自行放行。接口返回 `Cache-Control: private, no-store`；CDN 不得跨访客缓存地区判定。端点只需返回国家代码，不必返回完整 IP。

后端应从部署平台或 CDN 提供的可信请求信息读取地区，不能信任浏览器提交的国家代码，也不能无条件信任可伪造的转发请求头。若使用 Cloudflare，应确保源站访问受到保护、相关请求确实经过可信边缘层。

**前端检测和遮罩不是访问控制边界。** 正式规则必须在服务器或 CDN 对页面、API、交易入口和受限制下载文件的请求同时执行。直接访问 PDF、关闭 JavaScript、删除遮罩或改变前端状态均不得获取受限制资源。当前已嵌入 HTML 的内容，以及公开 GitHub 仓库内的 PDF，仍然公开；部署规则不能收回已公开的副本。

如采用全站边缘拦截，可返回与弹窗相同品牌和措辞的独立限制页面。若先提供公共外壳再检测，则在服务器批准之前不应下发受限制的正文或文件。联系入口及所需静态品牌资源应保持可用。

IP 定位只是连接位置估计，不等同于国籍、住所或投资者资格。此原型不包含 KYC、反代理识别或身份验证。

## 验收

检查繁中及英文的三种状态、语言切换、键盘焦点、Escape/背景点击、路由变化、重试、超时、错误响应和服务端模式忽略演示参数。Node 检查使用模拟 DOM，不替代真实浏览器视觉验收。当前环境的本地网页访问策略限制了实机视觉验收；正式接手时应在获准的部署环境完成桌面及手机验收。

官方接入参考：[Cloudflare IP geolocation](https://developers.cloudflare.com/network/ip-geolocation/) · [按地区拦截请求](https://developers.cloudflare.com/waf/custom-rules/use-cases/block-by-geographical-location/)。
