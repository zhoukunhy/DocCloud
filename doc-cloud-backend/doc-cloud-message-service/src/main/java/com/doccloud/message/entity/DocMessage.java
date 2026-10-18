package com.doccloud.message.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 站内消息实体（对应表 doc_message）
 */
@Data
@TableName("doc_message")
public class DocMessage implements Serializable {

    /** 主键 ID（雪花算法） */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /** 接收人用户 ID */
    private Long receiverId;

    /** 发送人用户 ID（系统消息为 0） */
    private Long senderId;

    /** 消息类型：0-系统通知 1-分享 2-团队邀请 3-文档变更 */
    private Integer type;

    /** 消息标题 */
    private String title;

    /** 消息内容 */
    private String content;

    /** 关联业务 ID（如文档 ID、团队 ID） */
    private Long relatedId;

    /** 是否已读：0-未读 1-已读 */
    private Integer isRead;

    /** 阅读时间 */
    private LocalDateTime readTime;

    /** 创建时间（即发送时间） */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
