# BSV100 iOS 移植 · GPT 交接文档

> 用途：用户今晚在 Windows 笔记本上继续做 iOS 打包时，把本文档（或仓库链接）发给 GPT，GPT 直接按本文档接手，不用再问背景。

## 一、项目是什么

- App 名称：**BSV100配置**（内部代号 vai-app，车载监控平台 App）
- 用途：配置车载监控终端设备——查看设备信息（IMEI/IMSI/MAC/CPUID）、全局配置（RabbitMQ 消息总线、升级服务、心跳服务、4G 模组）、NVR 配置（视频存储、摄像头列表）、高精度定位（GPS、差分服务器）、WebRTC 推流配置、终端注册/注销、恢复出厂、重启。
- 技术：DCloud **H5+ 应用**（纯 HTML/JS/CSS + MUI 框架 + MQTT/STOMP），不是 uni-app Vue 工程。
- 来源：源码从安卓版 APK（base.apk，v1.0.0，2024-12-13 打包）**完整提取**，不是反编译重构，是原封不动的 www 资源。
- DCloud AppID：`H51EFA51C`；版本 1.0.0（code 83）；启动页 `index.html`；竖屏、满屏。

## 二、仓库现状（xuekaima271-prog/bsv100-ios-，公开库，main 分支）

已推上的内容（52 个文本文件）：

- 全部 HTML/JS/CSS、`manifest.json`、`Info.plist`、`README.md`。
- `manifest.json` 已改好：
  - iOS 包名（Bundle ID）：`com.bsv100.config`
  - iOS 隐私说明（`plus.distribute.apple.privacyDescription`）已填 9 条：相机（扫码）、麦克风、语音识别、相册读取、相册写入、蓝牙（2 条）、使用期间定位、本地网络。
- `Info.plist`（工程根目录）：`NSAppTransportSecurity → NSAllowsArbitraryLoads = true`，放行明文 HTTP。
- 图标 `icon.png`（1024×1024，BSV100 字样）已生成，manifest 里 `icons.72` 引用它。

**不在仓库里的东西**（GitHub 接口推不了二进制）：

- 素材包 `bsv100-ios-assets.zip`（已在聊天里发给用户）：内含 `icon.png`、`img/`（18 张图）、`fonts/mui.ttf`。拿到工程后解压到工程根目录即完整。

## 三、关键技术事实

- App 连的服务器：`http://192.168.10.1:9998`（写在 `js/baseConfig.js` 里，另有一行注释掉的 `192.168.0.100` 备用地址）。是局域网地址，**手机必须跟 BSV100 设备连同一个 Wi-Fi 才能用**。
- 通信：MQTT（`mqtt.js` / `mqtt.min.js` / `stomp.js` / `mq.js`）+ HTTP。
- 用到的原生模块（manifest permissions）：Barcode（扫码）、Bluetooth（蓝牙）、Speech（讯飞语音）、Maps（地图）、Messaging、Cache、Console、Events。
- 打包目标：iPhone/iPad（manifest `@platforms` 已声明），universal。

## 四、今晚要做的事（用户在 Windows 笔记本上操作）

1. 克隆仓库：`git clone https://github.com/xuekaima271-prog/bsv100-ios-.git`（已公开，直接克隆；或用 GitHub Desktop）。
2. 解压 `bsv100-ios-assets.zip` 到工程根目录。
3. 装 HBuilderX（Windows 版，标准版免费，dcloud.io 下载），登录 DCloud 账号（免费注册）。
4. HBuilderX 打开工程（文件 → 打开目录 → 选克隆下来的文件夹）。
5. 准备证书——**免费路线**：用 AppUploader（或香蕉云编）在 Windows 上生成开发证书：Bundle ID 填 `com.bsv100.config`，绑定手机 UDID，导出 `.p12` + `.mobileprovision`，记好 p12 密码。Apple ID 用用户自己的国内账号（已开双重认证）。
   - 免费证书限制：有效期 7 天、最多 3 台设备、每 7 天最多 10 个 App ID。
   - 备选：买共享证书（store.appphb.net，¥39.9 秒出，90 天售后），会掉签、不退款，用户已决定不买。
6. 云打包：HBuilderX → 发行 → 原生App-云打包 → iOS → 选“使用苹果证书”，上传 `.p12`、填密码、上传 `.mobileprovision`，Bundle ID 填 `com.bsv100.config` → 提交 → 下载 `.ipa`。免费账号云打包每天约 6 次。
7. 安装：手机连电脑，爱思助手 → 应用游戏 → 安装本地应用 → 选 `.ipa`；然后手机 设置 → 通用 → VPN与设备管理 → 信任这个开发者证书。
8. 测试：手机连设备同一 Wi-Fi，打开 App，看能不能加载摄像头列表、连上服务器。

## 五、续签（每 7 天一次）

- 证书到期后 App 打不开。续签不用重新打包：爱思助手 → 工具箱 → IPA签名 → 用同一个 Apple ID 给原来的 `.ipa` 重新签名 → 重新安装。`.ipa` 文件留在笔记本上别删。

## 六、分享给别人

- 免费证书：最多 3 台设备（含自己的），要对方 UDID；生成证书时把对方 UDID 加进去，重签 `.ipa` 发给对方，对方用爱思助手装 + 信任证书。
- 想分给更多人：付费开发者账号（688 元/年）走 TestFlight（最多 1 万人，不用 UDID），或买共享证书。
- 注意：别人拿到 App 也得跟 BSV100 设备在同一局域网才有用。

## 七、已知风险点（已处理，实测为准）

- 明文 HTTP：已在 Info.plist 放行；如果真机上连不上服务器，先查 Wi-Fi 是否同一局域网，再查 ATS。
- 隐私说明：已按模块填好；如果打开扫码/蓝牙/语音时闪退，把报错截图发出来，缺哪项补哪项。
- 图标/启动图：iOS 各尺寸图标位目前是空的，打包时 HBuilderX 会用默认图或提示上传 1024 图（`icon.png` 已备好）。

## 八、用户情况

- 用户：何志武，大四学生；电脑是 Windows 笔记本（i5-13500HX + RTX 4050）；手机是 iPhone；Apple ID 是国内账号，已开双重认证。
- 沟通习惯：中文、短句、结论先行；喜欢一步步照着做，卡住会截图问。
- 今天（2026-11-09）是他去博能报到的第一天，白天在公司，晚上回笔记本上操作。
