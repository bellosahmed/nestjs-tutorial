import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtGuard } from './../auth/guard/index';
import { BookmarkService } from './bookmark.service';
import { Getuser } from './../auth/decorator/index';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  createbookmark(
    @Getuser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createbookmark(userId, dto);
  }

  @Get()
  getBookmark(@Getuser('id') userId: number) {
    return this.bookmarkService.getBookmark(userId);
  }

  @Get(':id')
  getbyid(
    @Getuser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getbyid(userId, bookmarkId);
  }

  @Patch(':id')
  editbyid(
    @Getuser('id') userId: number,
    @Body() dto: EditBookmarkDto,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.editbyid(userId, dto, bookmarkId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletebyid(
    @Getuser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deletebyid(userId, bookmarkId);
  }
}
