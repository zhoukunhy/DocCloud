package com.doccloud.file.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 公共字段自动填充：插入时填充创建时间
 */
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    /** 插入填充 */
    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
    }

    /** 更新填充（文件不可变，当前无更新场景） */
    @Override
    public void updateFill(MetaObject metaObject) {
        // 无更新时间字段，留空
    }
}
