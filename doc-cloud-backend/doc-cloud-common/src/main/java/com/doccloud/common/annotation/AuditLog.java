package com.doccloud.common.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 审计日志注解：标注在需要记录操作日志的接口方法上，
 * 由 AuditLogAspect 统一记录操作人与耗时
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AuditLog {

    /** 所属业务模块，如：文档管理 */
    String module() default "";

    /** 操作描述，如：创建文档 */
    String action() default "";
}
