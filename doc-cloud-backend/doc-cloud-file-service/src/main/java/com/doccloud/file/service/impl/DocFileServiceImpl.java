package com.doccloud.file.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.doccloud.file.entity.DocFile;
import com.doccloud.file.mapper.DocFileMapper;
import com.doccloud.file.service.DocFileService;
import org.springframework.stereotype.Service;

/**
 * 文件业务实现：阶段3仅搭建骨架，上传/下载等业务逻辑在业务阶段补充
 */
@Service
public class DocFileServiceImpl extends ServiceImpl<DocFileMapper, DocFile> implements DocFileService {
}
