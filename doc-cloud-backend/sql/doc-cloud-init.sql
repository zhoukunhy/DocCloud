-- =============================================================
-- DocCloud 轻量在线文档协作平台 - MySQL 初始化脚本
-- 版本：MySQL 8.0+ ｜ 字符集：utf8mb4 ｜ 引擎：InnoDB
-- 对应阶段3实体：User/Team/TeamMember、Doc/DocVersion、DocFile、DocMessage
-- 执行方式：mysql -uroot -p < doc-cloud-init.sql
-- 说明：主键均为雪花算法生成的 bigint，由 MyBatis-Plus ASSIGN_ID 填充
-- =============================================================

-- =============================================================
-- 1. 用户服务库：doc_user（用户、团队、团队成员）
-- =============================================================
CREATE DATABASE IF NOT EXISTS doc_user DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE doc_user;

-- 用户表
CREATE TABLE IF NOT EXISTS doc_user (
    id          BIGINT       NOT NULL COMMENT '主键ID（雪花算法）',
    username    VARCHAR(50)  NOT NULL COMMENT '用户名（登录账号）',
    password    VARCHAR(100) NOT NULL COMMENT '密码（BCrypt密文）',
    nickname    VARCHAR(50)  DEFAULT NULL COMMENT '昵称（展示用）',
    email       VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    avatar      VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
    status      TINYINT      NOT NULL DEFAULT 0 COMMENT '状态：0-正常 1-禁用',
    create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted     TINYINT      NOT NULL DEFAULT 0 COMMENT '逻辑删除：0-未删除 1-已删除',
    PRIMARY KEY (id),
    UNIQUE KEY uk_username (username) COMMENT '用户名唯一',
    KEY idx_email (email)
) ENGINE = InnoDB COMMENT = '用户表';

-- 团队表
CREATE TABLE IF NOT EXISTS doc_team (
    id          BIGINT       NOT NULL COMMENT '主键ID（雪花算法）',
    name        VARCHAR(100) NOT NULL COMMENT '团队名称',
    description VARCHAR(500) DEFAULT NULL COMMENT '团队简介',
    owner_id    BIGINT       NOT NULL COMMENT '创建人（所有者）用户ID',
    avatar      VARCHAR(255) DEFAULT NULL COMMENT '团队头像URL',
    create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted     TINYINT      NOT NULL DEFAULT 0 COMMENT '逻辑删除：0-未删除 1-已删除',
    PRIMARY KEY (id),
    KEY idx_owner_id (owner_id) COMMENT '按创建人查团队'
) ENGINE = InnoDB COMMENT = '团队表';

-- 团队成员表
CREATE TABLE IF NOT EXISTS doc_team_member (
    id          BIGINT   NOT NULL COMMENT '主键ID（雪花算法）',
    team_id     BIGINT   NOT NULL COMMENT '团队ID',
    user_id     BIGINT   NOT NULL COMMENT '成员用户ID',
    role        TINYINT  NOT NULL DEFAULT 0 COMMENT '角色：0-成员 1-管理员 2-所有者',
    join_time   DATETIME DEFAULT NULL COMMENT '加入时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_team_user (team_id, user_id) COMMENT '同一团队同一用户仅一条记录',
    KEY idx_user_id (user_id) COMMENT '按用户查其加入的团队'
) ENGINE = InnoDB COMMENT = '团队成员表';

-- =============================================================
-- 2. 文档核心服务库：doc_doc（文档、文档版本）
-- =============================================================
CREATE DATABASE IF NOT EXISTS doc_doc DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE doc_doc;

-- 文档表（含目录节点，parent_id 构成目录树）
CREATE TABLE IF NOT EXISTS doc_doc (
    id          BIGINT      NOT NULL COMMENT '主键ID（雪花算法）',
    space_type  TINYINT     NOT NULL DEFAULT 0 COMMENT '空间类型：0-个人空间 1-团队空间',
    owner_id    BIGINT      NOT NULL COMMENT '个人空间所属用户ID（space_type=0时有效）',
    team_id     BIGINT      DEFAULT 0 COMMENT '团队空间ID（space_type=1时有效）',
    parent_id   BIGINT      NOT NULL DEFAULT 0 COMMENT '父目录ID，0表示根节点',
    title       VARCHAR(200) NOT NULL COMMENT '文档/目录标题',
    doc_type    TINYINT     NOT NULL DEFAULT 0 COMMENT '类型：0-文档 1-目录',
    content     MEDIUMTEXT  COMMENT '富文本内容（doc_type=0时有效）',
    version_no  INT         NOT NULL DEFAULT 0 COMMENT '当前版本号（版本管理用，从0起）',
    sort        INT         NOT NULL DEFAULT 0 COMMENT '同级排序值（越小越靠前）',
    creator_id  BIGINT      NOT NULL COMMENT '创建人用户ID',
    create_time DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted     TINYINT     NOT NULL DEFAULT 0 COMMENT '逻辑删除：0-未删除 1-已删除',
    PRIMARY KEY (id),
    KEY idx_space_owner (space_type, owner_id) COMMENT '个人空间文档列表',
    KEY idx_team_id (team_id) COMMENT '团队空间文档列表',
    KEY idx_parent_id (parent_id) COMMENT '按父目录查子节点（目录树）',
    KEY idx_creator_id (creator_id) COMMENT '按创建人查询'
) ENGINE = InnoDB COMMENT = '文档表（含目录节点）';

-- 文档版本表（每次保存落一条快照）
CREATE TABLE IF NOT EXISTS doc_doc_version (
    id          BIGINT      NOT NULL COMMENT '主键ID（雪花算法）',
    doc_id      BIGINT      NOT NULL COMMENT '文档ID',
    title       VARCHAR(200) NOT NULL COMMENT '快照标题',
    content     MEDIUMTEXT  COMMENT '快照富文本内容',
    version_no  INT         NOT NULL COMMENT '版本号（文档内自增，从1开始）',
    creator_id  BIGINT      NOT NULL COMMENT '保存人用户ID',
    create_time DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（即保存时间）',
    PRIMARY KEY (id),
    UNIQUE KEY uk_doc_version (doc_id, version_no) COMMENT '同一文档版本号唯一',
    KEY idx_doc_id (doc_id) COMMENT '按文档查版本列表'
) ENGINE = InnoDB COMMENT = '文档版本表';

-- =============================================================
-- 3. 文件服务库：doc_file（文件元数据，文件本体存 MinIO）
-- =============================================================
CREATE DATABASE IF NOT EXISTS doc_file DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE doc_file;

-- 文件表（文件不可变，无更新/逻辑删除场景）
CREATE TABLE IF NOT EXISTS doc_file (
    id             BIGINT       NOT NULL COMMENT '主键ID（雪花算法）',
    file_name      VARCHAR(255) NOT NULL COMMENT '原始文件名',
    object_name    VARCHAR(500) NOT NULL COMMENT 'MinIO对象键（bucket内唯一路径）',
    bucket_name    VARCHAR(100) NOT NULL COMMENT '存储桶名称',
    file_size      BIGINT       NOT NULL DEFAULT 0 COMMENT '文件大小（字节）',
    content_type   VARCHAR(100) DEFAULT NULL COMMENT '文件类型（Content-Type）',
    url            VARCHAR(500) DEFAULT NULL COMMENT '访问URL',
    upload_user_id BIGINT       NOT NULL COMMENT '上传人用户ID',
    create_time    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（即上传时间）',
    PRIMARY KEY (id),
    UNIQUE KEY uk_object_name (object_name) COMMENT '对象键唯一',
    KEY idx_upload_user_id (upload_user_id) COMMENT '按上传人查文件'
) ENGINE = InnoDB COMMENT = '文件表（MinIO元数据）';

-- =============================================================
-- 4. 消息服务库：doc_message（站内信）
-- =============================================================
CREATE DATABASE IF NOT EXISTS doc_message DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE doc_message;

-- 站内消息表
CREATE TABLE IF NOT EXISTS doc_message (
    id          BIGINT       NOT NULL COMMENT '主键ID（雪花算法）',
    receiver_id BIGINT       NOT NULL COMMENT '接收人用户ID',
    sender_id   BIGINT       NOT NULL DEFAULT 0 COMMENT '发送人用户ID（系统消息为0）',
    type        TINYINT      NOT NULL DEFAULT 0 COMMENT '消息类型：0-系统通知 1-分享 2-团队邀请 3-文档变更',
    title       VARCHAR(200) NOT NULL COMMENT '消息标题',
    content     VARCHAR(1000) DEFAULT NULL COMMENT '消息内容',
    related_id  BIGINT       DEFAULT NULL COMMENT '关联业务ID（如文档ID、团队ID）',
    is_read     TINYINT      NOT NULL DEFAULT 0 COMMENT '是否已读：0-未读 1-已读',
    read_time   DATETIME     DEFAULT NULL COMMENT '阅读时间',
    create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（即发送时间）',
    PRIMARY KEY (id),
    KEY idx_receiver_read (receiver_id, is_read) COMMENT '收件箱未读/已读列表',
    KEY idx_receiver_time (receiver_id, create_time) COMMENT '收件箱按时间排序'
) ENGINE = InnoDB COMMENT = '站内消息表';
