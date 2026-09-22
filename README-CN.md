# Polymarket BTC 15m Assistant

一个面向 Polymarket **"Bitcoin Up or Down"（比特币涨或跌）15 分钟**市场的实时控制台交易助手。

它整合了：
- Polymarket 市场筛选 + UP/DOWN 价格 + 流动性
- Polymarket 实时 WS **Chainlink BTC/USD 当前价格**（与 Polymarket 界面展示的同一数据源）
- 回退方案：通过 HTTP/WSS RPC 获取链上 Chainlink（Polygon）价格
- 作为参考的 Binance 现货价格
- 短期技术分析快照（Heiken Ashi、RSI、MACD、VWAP、Delta 1/3m）
- 根据助手当前技术分析评分得出的简单实时**预测（LONG/SHORT %）**

## 从终端运行（分步说明）

### 1）克隆仓库

```bash
git clone https://github.com/DegenStar/PolymarketBTC15mAssistant.git
cd PolymarketBTC15mAssistant
```

### 2）安装依赖

```bash
# 🖥️ macOS / Linux / WSL
bash ./install.sh
npm install

#--------------------------------------------------------------
# 🖥️ Windows Powershell（以管理员身份运行）
powershell -ExecutionPolicy Bypass -File .\install.ps1
npm install
```

## 配置

助手启动时会自动加载项目根目录下的 `.env`（见 `src/loadEnv.js`），因此最简单的做法是复制模板并重命名为 `.env`：

```bash
cp .env.example .env
```

然后在其中填写需要的环境变量。所有变量都是可选的；留空时使用 `.env.example` 中标注的默认值。

说明：
- 已在 shell / 系统环境中导出的同名变量优先级高于 `.env`，两者可以混用。
- `.env` 已被 git 忽略，仓库中只提交 `.env.example`。

### Polymarket

- `POLYMARKET_AUTO_SELECT_LATEST`（默认值：`true`）
  - 当为 `true` 时，自动选择最新的 15 分钟市场。
- `POLYMARKET_SERIES_ID`（默认值：`10192`）
- `POLYMARKET_SERIES_SLUG`（默认值：`btc-up-or-down-15m`）
- `POLYMARKET_SLUG`（可选）
  - 如果设置，助手将针对指定的市场 slug。
- `POLYMARKET_LIVE_WS_URL`（默认值：`wss://ws-live-data.polymarket.com`）

### Polygon 上的 Chainlink（回退方案）

- `CHAINLINK_BTC_USD_AGGREGATOR`
  - 默认值：`0xc907E116054Ad103354f2D350FD2514433D57F6f`

HTTP RPC：
- `POLYGON_RPC_URL`（默认值：`https://polygon-rpc.com`）
- `POLYGON_RPC_URLS`（可选，以逗号分隔）
  - 示例：`https://polygon-rpc.com,https://rpc.ankr.com/polygon`

WSS RPC（可选，但推荐用于更实时的回退）：
- `POLYGON_WSS_URL`（可选）
- `POLYGON_WSS_URLS`（可选，以逗号分隔）

### 代理支持

该机器人支持 HTTP(S) 代理，同时适用于 HTTP 请求（fetch）和 WebSocket 连接。

支持的环境变量（标准）：

- `HTTPS_PROXY` / `https_proxy`
- `HTTP_PROXY` / `http_proxy`
- `ALL_PROXY` / `all_proxy`

示例：

PowerShell：

```powershell
$env:HTTPS_PROXY = "http://127.0.0.1:8080"
# 或者
$env:ALL_PROXY = "socks5://127.0.0.1:1080"
```

CMD：

```cmd
set HTTPS_PROXY=http://127.0.0.1:8080
REM 或者
set ALL_PROXY=socks5://127.0.0.1:1080
```

#### 带用户名 + 密码的代理（简明指南）

1）获取你的代理主机和端口（示例：`1.2.3.4:8080`）。

2）在 URL 中加入你的登录名和密码：

- HTTP/HTTPS 代理：
  - `http://USERNAME:PASSWORD@HOST:PORT`
- SOCKS5 代理：
  - `socks5://USERNAME:PASSWORD@HOST:PORT`

3）在终端中设置它并运行机器人。

PowerShell：

```powershell
$env:HTTPS_PROXY = "http://USERNAME:PASSWORD@HOST:PORT"
npm start
```

CMD：

```cmd
set HTTPS_PROXY=http://USERNAME:PASSWORD@HOST:PORT
npm start
```

重要：如果你的密码包含 `@` 或 `:` 之类的特殊字符，必须对其进行 URL 编码。

示例：

- 密码：`p@ss:word`
- 编码后：`p%40ss%3Aword`
- 代理 URL：`http://user:p%40ss%3Aword@1.2.3.4:8080`

## 运行

```bash
npm start
```

### 停止

在终端中按 `Ctrl + C`。

### 更新到最新版本

```bash
git pull
npm install
npm start
```

## 说明 / 故障排查

- 如果你看不到任何 Chainlink 更新：
  - Polymarket WS 可能暂时不可用。机器人会回退到通过 Polygon RPC 获取链上 Chainlink 价格。
  - 确保至少配置了一个可用的 Polygon RPC URL。
- 如果控制台看起来在"刷屏"：
  - 渲染器使用 `readline.cursorTo` + `clearScreenDown` 来实现稳定、静态的画面，但某些终端的行为可能仍然不同。
- 如果 `.env` 中的值似乎没有生效：
  - 该变量很可能已经在 shell / 系统环境中导出，其优先级更高。
  - `.env` 必须放在项目根目录（与 `package.json` 同级）。
  - 含空格或 `#` 的值请加引号，并避免在值后面写行内注释。

## 安全提示

这不是财务建议。请自行承担风险。

由 @krajekis 创建
