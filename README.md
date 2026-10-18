# DocCloud 轻量在线文档协作平台

类语雀的轻量知识库系统：个人空间 / 团队空间、富文本文档、目录树、版本管理、文档分享、全文检索、站内消息。前后端分离 + Java 微服务架构，可本地一键完整启动，适合面试展示与个人长期知识管理。

## 技术栈

| 端 | 技术 |
|----|------|
| 后端 | Java 17 · Spring Boot 3.2.5 · Spring Cloud 2023.0.1 · Spring Cloud Alibaba 2023.0.1.2 · MyBatis-Plus · Spring Security(BCrypt) + JWT · SpringDoc OpenAPI |
| 中间件 | Nacos（注册/配置） · MySQL 8 · Redis · RocketMQ · Elasticsearch 8 · MinIO · Sentinel |
| 前端 | Vue 3.5（`<script setup>`，JS 不用 TS） · Vite 5 · Pinia · Vue Router 4 · Axios · Element Plus · WangEditor 5 |
| 部署 | Maven 多模块 · Docker Compose |

## 架构

```
                         ┌────────────────────────────┐
        Vue3 前端        │      doc-cloud-gateway      │      业务微服务
   doc-cloud-web ──────▶│  :8080  JWT统一鉴权/路由     │
   (Vite5 :5173)        │  /api/** 保留完整路径转发     │──▶ doc-cloud-user-service    :8081  用户/团队
        │ /api 代理      └────────────────────────────┘──▶ doc-cloud-doc-service     :8082  文档核心/版本/编辑锁
        ▼                            │                ──▶ doc-cloud-file-service    :8083  文件存储(MinIO)
   Nacos :8848 ◀─────────────────────┘ 注册发现          doc-cloud-search-service  :8084  ES 全文检索
                                                        doc-cloud-message-service :8085  站内消息
   中间件：MySQL:3306(4库7表) Redis:6379 RocketMQ:9876 ES:9200 MinIO:9000/9001
   异步链路：doc-service 保存文档 ──RocketMQ──▶ search-service 同步 ES；message-service 消费 MQ 发站内信
```

**关键技术设计**（面试要点）：

- **两层鉴权**：网关全局过滤器统一校验 JWT（白名单放行），剥离伪造的 `X-User-Id` 头后透传用户身份；业务层对资源做**二次权限校验**
- **编辑互斥**：Redis 分布式锁实现文档编辑互斥（非 OT 协同的简化方案），锁非本人返回 423
- **异步解耦**：文档保存后 RocketMQ 异步同步 ES 与消息通知，消费端幂等处理
- **文件存储**：MinIO 对象存储，`uk_object_name` 唯一键防重

## 目录结构

```
DocCloud
├── docker-compose.yml            # 六大中间件一键拉起
├── 接口约定.md                    # 前后端 RESTful 接口契约（配套交付物）
├── 任务完成记录.md                # 六阶段进度与踩坑备忘
├── doc-cloud-backend             # Maven 多模块父工程 doc-cloud-parent
│   ├── doc-cloud-common          # 公共模块：Result/异常/JWT/审计AOP
│   ├── doc-cloud-gateway         # 网关：鉴权过滤器/路由/CORS
│   ├── doc-cloud-user-service    # 8081 用户&团队
│   ├── doc-cloud-doc-service     # 8082 文档核心
│   ├── doc-cloud-file-service    # 8083 文件存储
│   ├── doc-cloud-search-service  # 8084 ES 检索（无 MySQL）
│   ├── doc-cloud-message-service # 8085 站内消息
│   ├── sql/doc-cloud-init.sql    # 建表 SQL（4 库 7 表）
│   └── docker/rocketmq/broker.conf
└── doc-cloud-web                 # Vue3 前端（路由/Pinia/axios 封装/12 页面骨架）
```

## 快速启动

### ① 启动中间件（需先安装 Docker Desktop）

```bash
docker compose up -d        # 一键拉起 MySQL/Redis/Nacos/RocketMQ/ES/MinIO
docker compose ps           # 全部 healthy 即就绪
```

MySQL 容器**首次启动自动执行** `sql/doc-cloud-init.sql` 建 4 库 7 表。

### ② 启动后端（JDK 17）

```bash
cd doc-cloud-backend
mvn clean install -DskipTests          # 首次编译
# 依次启动 6 个启动类（或在 IDEA 中运行）：
# doc-cloud-gateway / user-service / doc-service / file-service / search-service / message-service
```

各服务启动后自动注册到 Nacos；网关路由 `/api/{service}/** → lb://doc-cloud-{service}-service`。

### ③ 启动前端

```bash
cd doc-cloud-web
npm install
npm run dev        # http://localhost:5173
```

## 访问入口

| 入口 | 地址 | 说明 |
|------|------|------|
| 前端页面 | http://localhost:5173 | 主入口，`/api` 经 Vite 代理转发网关 |
| 网关 | http://localhost:8080 | 统一鉴权与路由 |
| 接口文档 | http://localhost:8081~8085/swagger-ui.html | 各服务 SpringDoc（8082 即 `/swagger-ui.html`） |
| Nacos 控制台 | http://localhost:8848/nacos | 服务列表与配置 |
| MinIO 控制台 | http://localhost:9001 | minioadmin/minioadmin |
| RocketMQ/ES | 9876 / 9200 | 无独立控制台（未部署 Dashboard） |

## 演示动线（面试/自用）

1. 注册 → 登录（JWT 签发，前端 axios 拦截器自动携带）
2. 工作台新建文档 → 目录树组织 → 富文本编辑，1s 防抖自动保存，粘贴图片直传 MinIO
3. 编辑期间第二人打开同一文档 → Redis 编辑锁生效，仅一人可编辑
4. 「历史版本」查看版本列表 → 版本对比（LCS 行级 diff）→ 一键恢复
5. 「分享」生成访客链接，无痕浏览器打开 `/share/{shareId}` 验证免登录只读
6. 「全文检索」关键词搜索（ES 高亮）；他人编辑/分享产生「站内消息」，侧边栏角标提醒

## 当前状态

六阶段脚手架全部完成（详见 [任务完成记录.md](任务完成记录.md)）：后端 8 模块编译通过、前端 `npm run dev` 验证通过、中间件 compose 就绪。前端接口层当前为 mock 数据，业务阶段按 [接口约定.md](接口约定.md) 逐个开发并替换（前端每个 api 函数注释了对应写法，替换一行即可切换）。
