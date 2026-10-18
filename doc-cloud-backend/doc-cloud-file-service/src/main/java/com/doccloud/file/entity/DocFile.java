package com.doccloud.file.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 文件实体（对应表 doc_file）
 * <p>文件本体存 MinIO，本表只存元数据；文件不可变，无更新/逻辑删除场景</p>
 */
@Data
@TableName("doc_file")
public class DocFile implements Serializable {

    /** 主键 ID（雪花算法） */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /** 原始文件名 */
    private String fileName;

    /** MinIO 对象键（bucket 内唯一路径） */
    private String objectName;

    /** 存储桶名称 */
    private String bucketName;

    /** 文件大小（字节） */
    private Long fileSize;

    /** 文件类型（Content-Type） */
    private String contentType;

    /** 访问 URL */
    private String url;

    /** 上传人用户 ID */
    private Long uploadUserId;

    /** 创建时间（即上传时间） */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
