package com.doccloud.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.doccloud.user.entity.TeamMember;
import com.doccloud.user.mapper.TeamMemberMapper;
import com.doccloud.user.service.TeamMemberService;
import org.springframework.stereotype.Service;

/**
 * 团队成员业务实现：阶段3仅搭建骨架，成员管理等业务逻辑在业务阶段补充
 */
@Service
public class TeamMemberServiceImpl extends ServiceImpl<TeamMemberMapper, TeamMember> implements TeamMemberService {
}
