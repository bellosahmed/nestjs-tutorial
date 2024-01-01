import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';     
import { Getuser } from './../auth/decorator/index';
import { JwtGuard } from './../auth/guard/index';
import { EditUserDto } from './dto/edituser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService : UserService) {}
    @UseGuards(JwtGuard)
    @Get('profile')
    getprofile(@Getuser() user: User) {
        
        return user;
    };

    @Patch('edit')
      editUser(
        @Getuser('id') userId: number,
        @Body() dto: EditUserDto,
      ) {
        return this.userService.editUser(userId, dto);
      }
    }
  