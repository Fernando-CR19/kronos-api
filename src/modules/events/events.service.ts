import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(userUuid: string, dto: CreateEventDto) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const { notification_time, tag_ids, ...eventData } = dto;

    const event = await this.prisma.event.create({
      data: {
        ...eventData,
        user_id: user.id,
        ...(tag_ids && {
          event_tags: {
            create: tag_ids.map((tag_id, index) => ({
              tag_id: tag_id,
              order: index,
            })),
          },
        }),
        ...(notification_time && {
          notification: {
            create: {
              time: notification_time,
            },
          },
        }),
      },
      include: {
        event_tags: { include: { tag: true } },
        notification: true,
      },
    });

    return event;
  }

  async findAllEvents(userUuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.event.findMany({
      where: { user_id: user.id, deleted: false },
      include: {
        event_tags: { include: { tag: true } },
        notification: true,
      },
      orderBy: { start_at: 'asc' },
    });
  }

  async findOneEvent(userUuid: string, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.event.findUnique({
      where: { id, user_id: user.id, deleted: false },
      include: {
        event_tags: { include: { tag: true } },
        notification: true,
        event_exceptions: true,
      },
    });
  }

  async updateEvent(userUuid: string, id: number, dto: UpdateEventDto) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const { tag_ids, notification_time, ...eventData } = dto;

    const event = await this.prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        ...(tag_ids && {
          event_tags: {
            deleteMany: { event_id: id },
            create: tag_ids.map((tagId, index) => ({
              tag_id: tagId,
              order: index,
            })),
          },
        }),
        ...(notification_time && {
          notification: {
            upsert: {
              create: { time: notification_time },
              update: { time: notification_time },
            },
          },
        }),
      },
      include: {
        event_tags: { include: { tag: true } },
        notification: true,
      },
    });

    return event;
  }

  async deleteEvent(userUuid: string, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.event.update({
      where: { id, user_id: user.id },
      data: { deleted: true, active: false },
    });

    return { message: 'Event deleted successfully' };
  }
}
