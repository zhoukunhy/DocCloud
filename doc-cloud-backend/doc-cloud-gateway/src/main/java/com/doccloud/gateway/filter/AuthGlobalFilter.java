package com.doccloud.gateway.filter;

import com.doccloud.common.constant.SecurityConstants;
import com.doccloud.common.result.Result;
import com.doccloud.common.result.ResultCode;
import com.doccloud.common.util.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

/**
 * 全局鉴权过滤器：
 * 1. 白名单路径直接放行（登录、注册、分享访客页等）
 * 2. 其余请求校验 JWT，非法返回 401 统一 JSON
 * 3. 校验通过后剥离外部伪造头，向下游透传 X-User-Id / X-Username
 */
@Slf4j
@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // 白名单直接放行
        if (isWhiteList(path)) {
            return chain.filter(exchange);
        }

        // 解析并校验 Token
        String token = resolveToken(exchange.getRequest());
        if (token == null || !JwtUtils.validate(token)) {
            log.warn("鉴权失败，路径：{}", path);
            return unauthorized(exchange);
        }

        // 剥离外部可能伪造的用户头，再透传网关解析出的用户信息
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .headers(headers -> {
                    headers.remove(SecurityConstants.HEADER_USER_ID);
                    headers.remove(SecurityConstants.HEADER_USERNAME);
                })
                .header(SecurityConstants.HEADER_USER_ID, String.valueOf(JwtUtils.getUserId(token)))
                .header(SecurityConstants.HEADER_USERNAME, JwtUtils.getUsername(token))
                .build();
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    /** 匹配网关放行白名单 */
    private boolean isWhiteList(String path) {
        return SecurityConstants.WHITE_LIST.stream()
                .anyMatch(pattern -> PATH_MATCHER.match(pattern, path));
    }

    /** 从请求头解析 Bearer Token */
    private String resolveToken(ServerHttpRequest request) {
        String auth = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (auth != null && auth.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            return auth.substring(SecurityConstants.TOKEN_PREFIX.length());
        }
        return null;
    }

    /** 返回 401 统一 JSON 响应 */
    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        try {
            byte[] bytes = MAPPER.writeValueAsBytes(Result.fail(ResultCode.UNAUTHORIZED));
            DataBuffer buffer = response.bufferFactory().wrap(bytes);
            return response.writeWith(Mono.just(buffer));
        } catch (Exception e) {
            log.error("序列化 401 响应失败", e);
            return response.setComplete();
        }
    }

    /** 最高优先级，先于路由过滤器执行 */
    @Override
    public int getOrder() {
        return -100;
    }
}
