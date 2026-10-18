package com.doccloud.common.context;

/**
 * 当前登录用户上下文（基于 ThreadLocal）
 * 由网关鉴权后透传的请求头在业务服务拦截器中填充
 */
public class UserContext {

    private static final ThreadLocal<Long> USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> USERNAME = new ThreadLocal<>();

    private UserContext() {
    }

    /** 填充当前用户信息 */
    public static void set(Long userId, String username) {
        USER_ID.set(userId);
        USERNAME.set(username);
    }

    /** 获取当前用户ID */
    public static Long getUserId() {
        return USER_ID.get();
    }

    /** 获取当前用户名 */
    public static String getUsername() {
        return USERNAME.get();
    }

    /** 请求结束时清理，防止内存泄漏 */
    public static void clear() {
        USER_ID.remove();
        USERNAME.remove();
    }
}
