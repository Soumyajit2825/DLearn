import { Controller, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './questions/create-question.dto';
import { UpdateQuestionDto } from './questions/update-question.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('quizzes/:id/questions')
  @ApiOperation({ summary: 'Add a question to quiz (instructor)' })
  create(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    return this.questionsService.create(id, dto);
  }

  @Patch('questions/:id')
  @ApiOperation({ summary: 'Update a question (instructor)' })
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.update(id, dto);
  }

  @Delete('questions/:id')
  @ApiOperation({ summary: 'Delete a question (instructor)' })
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
