import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { EditUserDto } from './dto/index';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    // Ensure userId is provided and not null
    if (!userId) {
      throw new Error('User ID must be provided');
    }

    // Ensure dto contains necessary properties for updating a user
    if (!dto || Object.keys(dto).length === 0) {
      throw new Error('EditUserDto must contain properties for updating user');
    }

    try {
      // Update the user using Prisma
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });

      // Remove sensitive information before returning the user
      delete user.hash;

      return user;
    } catch (error) {
      // Handle any errors that may occur during the update
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}
