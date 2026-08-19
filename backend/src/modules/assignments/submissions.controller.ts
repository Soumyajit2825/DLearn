import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('assignments/:id/submit')
  @ApiOperation({ summary: 'Submit an assignment' })
  submit(@Param('id') id: string, @Req() req, @Body() dto: SubmitAssignmentDto) {
    return this.submissionsService.submit(id, req.user.id, dto);
  }

  @Get('assignments/:id/submissions')
  @ApiOperation({ summary: 'Get submissions for an assignment (instructor)' })
  getSubmissions(@Param('id') id: string, @Req() req) {
    return this.submissionsService.getSubmissions(id, req.user.id);
  }

  @Patch('submissions/:id/grade')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @ApiOperation({ summary: 'Grade a submission (instructor)' })
  grade(@Param('id') id: string, @Req() req, @Body() dto: GradeSubmissionDto) {
    return this.submissionsService.grade(id, dto, req.user.id);
  }
}
