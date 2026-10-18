package com.doccloud.common.constant;

import java.util.List;

/**
 * 安全相关常量（JWT、网关白名单）
 */
public interface SecurityConstants {

    /** 请求头中的 Token 字段 */
    String TOKEN_HEADER = "Authorization";
    /** Token 前缀 */
    String TOKEN_PREFIX = "Bearer ";

    /** 网关向下游透传用户信息的请求头 */
    String HEADER_USER_ID = "X-User-Id";
    String HEADER_USERNAME = "X-Username";

    /** JWT 密钥，生产环境请通过 Nacos 配置覆盖 */
    String JWT_SECRET = "doccloud-jwt-secret-key-please-change-in-production-2026";
    /** 令牌有效期：7 天（秒） */
    long TOKEN_EXPIRE = 7 * 24 * 60 * 60L;

    /** 网关放行白名单 */
    List<String> WHITE_LIST = List.of(
            "/api/user/login",
            "/api/user/register",
            "/api/share/**",
            "/doc.html",
            "/swagger-ui/**",
            "/v3/api-docs/**"
    );
}
