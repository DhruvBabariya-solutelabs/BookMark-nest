import {
  Post,
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateBookMarkDto } from './dto/create-bookmark.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/user.entity';
import { UpdateBookMarkDto } from './dto/update-bookmark.dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  getAllBookMarks() {
    return this.bookmarkService.findAll();
  }

  @Get(':id')
  findBookMarkById(@Param('id') id: string) {
    return this.bookmarkService.findById(+id);
  }

  @Post('create')
  createBookMark(
    @Body() createBookMarkDto: CreateBookMarkDto,
    @GetUser() user: User,
  ) {
    return this.bookmarkService.save(createBookMarkDto, user);
  }

  @Put(':id')
  updateBookMark(
    @Param('id') id: string,
    @Body() updatebookmarkDto: UpdateBookMarkDto,
  ) {
    return this.bookmarkService.update(+id, updatebookmarkDto);
  }

  @Delete(':id')
  removeBookMark(@Param('id') id: string) {}
}
