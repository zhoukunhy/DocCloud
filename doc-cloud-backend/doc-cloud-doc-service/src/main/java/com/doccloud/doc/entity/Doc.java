package com.doccloud.doc.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 文档实体（对应表 doc_doc）
 * <p>spaceType 区分个人/团队空间；docType 区分文档/目录，parentId 构成目录树</p>
 */
@Data
@TableName("doc_doc")
public class Doc implements Serializable {

    /** 主键 ID（雪花算法） */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /** 空间类型：0-个人空间 1-团队空间 */
    private Integer spaceType;

    /** 个人空间所属用户 ID */
    private Long ownerId;

    /** 团队空间 ID（spaceType=1 时有效） */
    private Long teamId;

    /** 父目录 ID，0 表示根节点 */
    private Long parentId;

    /** 文档/目录标题 */
    private String title;

    /** 类型：0-文档 1-目录 */
    private Integer docType;

    /** 富文本内容（docType=0 时有效） */
    private String content;

    /** 当前版本号（版本管理用） */
    private Integer versionNo;

    /** 同级排序值 */
    private Integer sort;

    /** 创建人用户 ID */
    private Long creatorId;

    /** 创建时间 */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /** 更新时间 */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /** 逻辑删除：0-未删除 1-已删除 */
    @TableLogic
    private Integer deleted;
}
