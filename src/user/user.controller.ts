import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';     
import { Getuser } from './../auth/decorator/index';
import { JwtGuard } from './../auth/guard/index';
import { EditUserDto } from './dto/index';
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
@UseGuards(JwtGuard)
editUser(
  @Getuser() user: User,
  @Body() dto: EditUserDto,
) {
  return this.userService.editUser(user.id, dto);
}
    }
  