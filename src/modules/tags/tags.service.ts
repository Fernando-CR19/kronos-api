import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserId(userUuid: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user.id;
  }

  async createTag(userUuid: string, dto: CreateTagDto) {
    const userId = await this.getUserId(userUuid);

    return this.prisma.tag.create({
      data: {
        ...dto,
        user_id: userId,
      },
    });
  }

  async findAllTags(userUuid: string) {
    const userId = await this.getUserId(userUuid);

    return await this.prisma.tag.findMany({
      where: {
        user_id: userId,
        deleted: false,
        OR: [{ user_id: userId }, { is_default: true }],
      },
      orderBy: [{ is_default: 'desc' }, { name: 'asc' }],
    });
  }

  async updateTag(userUuid: string, id: number, dto: UpdateTagDto) {
    const userId = await this.getUserId(userUuid);

    const tag = await this.prisma.tag.findUnique({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!tag) throw new BadRequestException('Tag not found');

    return this.prisma.tag.update({
      where: { id },
      data: { ...dto },
    });
  }

  async deleteTag(userUuid: string, id: number) {
    const userId = await this.getUserId(userUuid);

    const tag = await this.prisma.tag.findUnique({
      where: { id, user_id: userId },
    });

    if (!tag) throw new BadRequestException('Tag not found');

    await this.prisma.tag.update({
      where: { id },
      data: {
        deleted: true,
        active: false,
      },
    });

    return { Message: 'Tag deleted successfully' };
  }
}
