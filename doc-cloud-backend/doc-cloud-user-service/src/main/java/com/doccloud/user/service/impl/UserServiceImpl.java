package com.doccloud.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.doccloud.user.entity.User;
import com.doccloud.user.mapper.UserMapper;
import com.doccloud.user.service.UserService;
import org.springframework.stereotype.Service;

/**
 * 用户业务实现：阶段3仅搭建骨架，注册/登录等业务逻辑在业务阶段补充
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}
