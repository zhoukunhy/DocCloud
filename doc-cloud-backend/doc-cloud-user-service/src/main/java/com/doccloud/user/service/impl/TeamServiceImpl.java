package com.doccloud.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.doccloud.user.entity.Team;
import com.doccloud.user.mapper.TeamMapper;
import com.doccloud.user.service.TeamService;
import org.springframework.stereotype.Service;

/**
 * 团队业务实现：阶段3仅搭建骨架，团队管理等业务逻辑在业务阶段补充
 */
@Service
public class TeamServiceImpl extends ServiceImpl<TeamMapper, Team> implements TeamService {
}
