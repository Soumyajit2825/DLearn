import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Discussions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new discussion' })
  create(@Req() req, @Body() dto: CreateDiscussionDto) {
    return this.discussionsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discussions' })
  findAll(@Query('courseId') courseId?: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.discussionsService.findAll(courseId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a discussion by ID' })
  findOne(@Param('id') id: string) {
    return this.discussionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a discussion' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateDiscussionDto) {
    return this.discussionsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a discussion' })
  remove(@Req() req, @Param('id') id: string) {
    return this.discussionsService.remove(id, req.user.id);
  }

  @Post('reply')
  @ApiOperation({ summary: 'Add a reply to a discussion' })
  addReply(@Req() req, @Body() dto: CreateReplyDto) {
    return this.discussionsService.addReply(req.user.id, dto);
  }
}
