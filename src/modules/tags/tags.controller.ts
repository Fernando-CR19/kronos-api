import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../public/auth/guard/jwt-auth.guard';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTag(@Req() req: any, @Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(req.user.uuid, createTagDto);
  }

  @Get()
  async findAllTags(@Req() req: any) {
    return this.tagService.findAllTags(req.user.uuid);
  }

  @Put(':id')
  async updateTag(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.updateTag(req.user.uuid, +id, updateTagDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTag(@Req() req: any, @Param('id') id: string) {
    return this.tagService.deleteTag(req.user.uuid, +id);
  }
}
