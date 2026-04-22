import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserByUuid(userUuid: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getProfile(userUuid: string) {
    const user = await this.getUserByUuid(userUuid);

    const { password, ...profile } = user;

    return profile;
  }

  async updateProfile(userUuid: string, dto: UpdateProfileDto) {
    const user = await this.getUserByUuid(userUuid);

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { ...dto },
    });

    const { password, ...profile } = updated;

    return profile;
  }
}
