import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Quiz Attempts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('quizzes/:id/attempt')
  @ApiOperation({ summary: 'Attempt a quiz' })
  attempt(@Param('id') id: string, @Req() req, @Body() dto: CreateAttemptDto) {
    return this.attemptsService.attempt(id, req.user.id, dto);
  }

  @Get('attempts/:id')
  @ApiOperation({ summary: 'Get attempt by ID' })
  findOne(@Param('id') id: string) {
    return this.attemptsService.findOne(id);
  }

  @Get('quizzes/:id/my-attempts')
  @ApiOperation({ summary: 'Get my attempts for a quiz' })
  getMyAttempts(@Param('id') id: string, @Req() req) {
    return this.attemptsService.getMyAttempts(id, req.user.id);
  }
}
