package com.doccloud.file.controller;

import com.doccloud.common.result.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 健康检查接口：用于验证服务启动、Nacos 注册与网关路由转发是否正常
 */
@RestController
@RequestMapping("/api/file")
public class HealthController {

    /** 服务健康检查 */
    @GetMapping("/health")
    public Result<String> health() {
        return Result.success("doc-cloud-file-service 启动成功");
    }
}
