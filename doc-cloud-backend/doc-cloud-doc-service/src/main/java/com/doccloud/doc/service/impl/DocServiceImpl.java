package com.doccloud.doc.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.doccloud.doc.entity.Doc;
import com.doccloud.doc.mapper.DocMapper;
import com.doccloud.doc.service.DocService;
import org.springframework.stereotype.Service;

/**
 * 文档业务实现：阶段3仅搭建骨架，文档CRUD/目录树/编辑锁等业务逻辑在业务阶段补充
 */
@Service
public class DocServiceImpl extends ServiceImpl<DocMapper, Doc> implements DocService {
}
