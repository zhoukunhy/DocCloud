package com.doccloud.common.util;

import com.doccloud.common.constant.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 工具类：生成 / 校验 / 解析令牌
 */
public class JwtUtils {

    private static final SecretKey KEY =
            Keys.hmacShaKeyFor(SecurityConstants.JWT_SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * 生成 JWT 令牌
     *
     * @param userId   用户ID
     * @param username 用户名
     * @return 签名后的 token
     */
    public static String createToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        Date now = new Date();
        return Jwts.builder()
                .claims(claims)
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(new Date(now.getTime() + SecurityConstants.TOKEN_EXPIRE * 1000))
                .signWith(KEY)
                .compact();
    }

    /**
     * 解析令牌，签名或过期不合法时抛出异常
     */
    public static Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 校验令牌是否合法
     */
    public static boolean validate(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /** 从令牌中获取用户ID */
    public static Long getUserId(String token) {
        return parseToken(token).get("userId", Long.class);
    }

    /** 从令牌中获取用户名 */
    public static String getUsername(String token) {
        return parseToken(token).get("username", String.class);
    }
}
