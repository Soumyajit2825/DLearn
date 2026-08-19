import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics (alias)' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.adminService.getUsers(page, limit);
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get all courses' })
  getCourses(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.adminService.getCourses(page, limit);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  getTransactions(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.adminService.getTransactions(page, limit);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  getAuditLogs(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAuditLogs(page, limit);
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user' })
  banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }
}
