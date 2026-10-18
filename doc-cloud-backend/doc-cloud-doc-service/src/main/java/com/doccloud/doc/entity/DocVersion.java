package com.doccloud.doc.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 文档版本实体（对应表 doc_doc_version）
 * <p>每次保存文档时落一条版本快照，支持版本回溯与对比</p>
 */
@Data
@TableName("doc_doc_version")
public class DocVersion implements Serializable {

    /** 主键 ID（雪花算法） */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /** 文档 ID */
    private Long docId;

    /** 快照标题 */
    private String title;

    /** 快照富文本内容 */
    private String content;

    /** 版本号（自增序，从 1 开始） */
    private Integer versionNo;

    /** 保存人用户 ID */
    private Long creatorId;

    /** 创建时间（即保存时间） */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
