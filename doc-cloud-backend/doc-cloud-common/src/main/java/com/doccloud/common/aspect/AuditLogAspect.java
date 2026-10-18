package com.doccloud.common.aspect;

import com.doccloud.common.annotation.AuditLog;
import com.doccloud.common.context.UserContext;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * 审计日志切面：拦截 @AuditLog 注解方法，
 * 记录操作人、方法、入参与耗时（后续可扩展异步落库）
 */
@Slf4j
@Aspect
@Component
public class AuditLogAspect {

    @Around("@annotation(auditLog)")
    public Object around(ProceedingJoinPoint joinPoint, AuditLog auditLog) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return joinPoint.proceed();
        } finally {
            long cost = System.currentTimeMillis() - start;
            log.info("[审计日志] 模块：{} | 操作：{} | 操作人：{} | 方法：{} | 参数：{} | 耗时：{}ms",
                    auditLog.module(),
                    auditLog.action(),
                    UserContext.getUserId(),
                    joinPoint.getSignature().toShortString(),
                    Arrays.toString(joinPoint.getArgs()),
                    cost);
        }
    }
}
