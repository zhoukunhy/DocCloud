# DocCloud 前端（doc-cloud-web）

DocCloud 轻量在线文档协作平台前端，Vue3 + Vite5 + Element Plus + WangEditor。

## 技术栈

- Vue 3.5（`<script setup>` 组合式 API，JS 不使用 TS）
- Vite 5 / Vue Router 4 / Pinia / Axios
- Element Plus（全量引入 + 全局图标注册，中文 locale）
- WangEditor 5（富文本编辑，预留图片粘贴上传钩子）

## 启动

```bash
npm install      # 安装依赖
npm run dev      # 开发环境：http://localhost:5173
npm run build    # 生产构建
```

## 接口联调说明

- 阶段5 为纯 mock 预览：`src/api/*Api.js` 中所有函数返回 mock 数据，每个函数注释了业务阶段的真实接口写法，替换一行即可。
- 真实联调时：`/api/**` 经 vite proxy 转发到后端网关 `http://127.0.0.1:8080`，网关按路由转发到各微服务（user/doc/file/search/message-service）。
- 统一返回 `Result{code, message, data, timestamp}`：`code=200` 成功解包 data；`401` 清凭证跳登录（见 `src/api/request.js`）。
- 鉴权：路由前置守卫校验 localStorage 的 `doc_cloud_token`，免登录白名单 `/login`、`/register`、`/share/:shareId`。

## 目录速览

```
src/
├── api/        # axios 封装 + 5 个业务 api 模块（当前 mock）
├── assets/     # 全局样式 / 图片
├── components/ # Layout 布局组、DocTree、DocEditor、ShareModal、FileUpload 等
├── hooks/      # useDocTree / useAutoSave / useShare
├── router/     # 路由表 + 前置守卫
├── stores/     # userStore / workspaceStore / messageStore
├── utils/      # auth(token) / format(时间、文件大小) / diff(版本对比 LCS)
└── views/      # 12 个页面（login/workspace/doc/team/message/search/share/user）
```
