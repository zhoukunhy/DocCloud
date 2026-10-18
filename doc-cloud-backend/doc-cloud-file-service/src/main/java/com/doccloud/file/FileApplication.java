package com.doccloud.file;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 文件存储服务启动类
 * <p>scanBasePackages 扩大到 com.doccloud，以装配 common 模块的全局异常处理、审计日志等组件</p>
 */
@SpringBootApplication(scanBasePackages = "com.doccloud")
@EnableDiscoveryClient
@MapperScan("com.doccloud.file.mapper")
public class FileApplication {

    public static void main(String[] args) {
        SpringApplication.run(FileApplication.class, args);
    }
}
