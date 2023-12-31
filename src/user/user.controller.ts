import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { Getuser } from './../auth/decorator/index';
import { JwtGuard } from './../auth/guard/index';

@Controller('user')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('profile')
    getprofile(@Getuser() user: User) {
        
        return user;
    };

    @Patch()
    editUser() {

    };
}
