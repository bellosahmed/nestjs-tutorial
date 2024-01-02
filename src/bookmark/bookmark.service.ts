import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class BookmarkService {

    constructor(private prisma : PrismaService) {}
    
   async  createbookmark(userId : number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
        data : {
            userId,
            ...dto
        }
    })
    return bookmark;
   }  
    
    getBookmark(userId : number) {
        return this.prisma.bookmark.findMany({
            where : {
                userId
            }
        })
    }
    
    
    getbyid(userId : number, bookmarkId : number) {
        return this.prisma.bookmark.findFirst({
            where : {
                id : bookmarkId,
                userId
            }
        })
    }
    
    
  async editbyid(userId : number, dto: EditBookmarkDto, bookmarkId : number) {
    // find the bookmark id
        const bookmark = await this.prisma.bookmark.findUnique({
            where : {
               id :  bookmarkId
            }
        })
    // if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId) 
        throw new ForbiddenException('Access denied')
    
    // edit the bookmark
    return this.prisma.bookmark.update({
        where : {
            id : bookmarkId
        }, 
        data : {
            ...dto,
        }
    })
    }
    
    
   async deletebyid(userId : number,  bookmarkId : number) {
     // find the bookmark id
     const bookmark = await this.prisma.bookmark.findUnique({
        where : {
           id :  bookmarkId
        }
    })
// if user owns the bookmark
if (!bookmark || bookmark.userId !== userId) 
    throw new ForbiddenException('Access denied')

    // can delete the bookmark
    await this.prisma.bookmark.delete({
        where : {
            id : bookmarkId
        }
    })
   }
    }
