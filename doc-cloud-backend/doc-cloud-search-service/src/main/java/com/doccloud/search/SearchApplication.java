package com.doccloud.search;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 检索服务启动类
 * <p>scanBasePackages 扩大到 com.doccloud，以装配 common 模块的全局异常处理、审计日志等组件；
 * 无 MySQL 数据源，索引数据经 RocketMQ 异步同步。</p>
 */
@SpringBootApplication(scanBasePackages = "com.doccloud")
@EnableDiscoveryClient
public class SearchApplication {

    public static void main(String[] args) {
        SpringApplication.run(SearchApplication.class, args);
    }
}
