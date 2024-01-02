import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/index';
import { BookmarkService } from './bookmark.service';
import { Getuser } from 'src/auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

@Post()
createbookmark(@Getuser('id') userId : number,
               @Body() dto : CreateBookmarkDto
               ) {}

@Get() 
getBookmark(@Getuser('id') userId : number) {}

@Get(':id') 
getbyid(@Getuser('id') userId : number,
        @Param('id', ParseIntPipe) bookmardid : number
        ) {}

@Patch(':id')
editbyid(@Getuser('id') userId : number,
@Body() dto : EditBookmarkDto
) {}

@Delete(':id')
deletebyid(@Getuser('id') userId : number,
@Param('id', ParseIntPipe) bookmardid : number
) {}

}
