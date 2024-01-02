import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {@Post()
    
    createbookmark(userId : number, dto: CreateBookmarkDto) {}
    
    
    getBookmark(userId : number) {}
    
    
    getbyid(userId : number, bookmarkId : number) {}
    
    
    editbyid(userId : number, dto: EditBookmarkDto) {}
    
    
    deletebyid(userId : number) {}
    }
