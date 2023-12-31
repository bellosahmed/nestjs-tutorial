import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "./../prisma/prisma.service";
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
        ) {}
    
    async register(dto:AuthDto) {
        // generate hash password
        const hash = await argon.hash(dto.password);
        // save user to the database
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                 }
                // select: {
                //     email : true,
                //     id : true,
                //     createdAt : true
                // }
            });
    
            // delete user.hash;
            // return saved user
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') { // when created the same user
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
        
    }

   async login(dto: AuthDto) {

        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })
        //throw error if no user found
        if(!user) throw new ForbiddenException('Email is not valid')
        // compare password
        const passMatch = await argon.verify(user.hash,
             dto.password)
        //else error in password
        if(!passMatch) throw new ForbiddenException('Password is not correct');
        // user can login
        // delete user.hash;
        return this.signToken(user.id, user.email);
 }
    
async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub : userId,
            email
        };
        const secret = this.config.get('jwtsecert')

        const token = await this.jwt.signAsync(payload,{
            expiresIn: '15m',
            secret: secret
        });
        
        return {
            access_token: token,
        }
 }
} 