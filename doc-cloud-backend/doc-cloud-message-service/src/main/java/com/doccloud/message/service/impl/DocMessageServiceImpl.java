package com.doccloud.message.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.doccloud.message.entity.DocMessage;
import com.doccloud.message.mapper.DocMessageMapper;
import com.doccloud.message.service.DocMessageService;
import org.springframework.stereotype.Service;

/**
 * 站内消息业务实现：阶段3仅搭建骨架，消息收发/已读等业务逻辑在业务阶段补充
 */
@Service
public class DocMessageServiceImpl extends ServiceImpl<DocMessageMapper, DocMessage> implements DocMessageService {
}
