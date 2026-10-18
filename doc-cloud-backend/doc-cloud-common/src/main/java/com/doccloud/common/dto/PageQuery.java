package com.doccloud.common.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 分页查询基础参数，业务分页 DTO 继承复用
 */
@Data
public class PageQuery implements Serializable {

    /** 当前页码，默认第 1 页 */
    private Long current = 1L;
    /** 每页大小，默认 10 条 */
    private Long size = 10L;
}
