package com.doccloud.doc.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.doccloud.doc.entity.DocVersion;
import com.doccloud.doc.mapper.DocVersionMapper;
import com.doccloud.doc.service.DocVersionService;
import org.springframework.stereotype.Service;

/**
 * 文档版本业务实现：阶段3仅搭建骨架，版本管理业务逻辑在业务阶段补充
 */
@Service
public class DocVersionServiceImpl extends ServiceImpl<DocVersionMapper, DocVersion> implements DocVersionService {
}
