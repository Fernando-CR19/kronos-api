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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEvent(@Req() req: any, @Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(req.user.uuid, createEventDto);
  }

  @Get()
  async findAllEvents(@Req() req: any) {
    return this.eventService.findAllEvents(req.user.uuid);
  }

  @Get(':id')
  async findOneEvent(@Req() req: any, @Param('id') id: string) {
    return this.eventService.findOneEvent(req.user.uuid, +id);
  }

  @Put(':id')
  async updateEvent(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(req.user.uuid, +id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteEvent(@Req() req: any, @Param('id') id: string) {
    return this.eventService.deleteEvent(req.user.uuid, +id);
  }
}
