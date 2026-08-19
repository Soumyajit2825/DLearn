import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Enroll in a course' })
  enroll(@Req() req, @Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.enroll(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my enrollments' })
  getMyEnrollments(@Req() req) {
    return this.enrollmentsService.getMyEnrollments(req.user.id);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get enrollments for a course (instructor)' })
  getCourseEnrollments(@Param('courseId') courseId: string) {
    return this.enrollmentsService.getCourseEnrollments(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get enrollment by ID' })
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update enrollment progress' })
  updateProgress(@Param('id') id: string, @Body() dto: UpdateProgressDto, @Req() req) {
    return this.enrollmentsService.updateProgress(id, dto, req.user.id);
  }
}
