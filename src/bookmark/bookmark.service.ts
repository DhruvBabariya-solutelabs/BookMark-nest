import {
  Injectable,
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookMark } from './bookmark.entity';
import { Repository } from 'typeorm';
import { CreateBookMarkDto } from './dto/create-bookmark.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookMark) private repository: Repository<BookMark>,
  ) {}

  async findAll() {
    const bookmarks = await this.repository.find();
    if (bookmarks.length === 0) {
      throw new NotFoundException(
        HttpStatus.NOT_FOUND,
        'BookMark is not found',
      );
    }
    return bookmarks;
  }

  async findById(id: number) {
    const bookmark = await this.repository.findOne({ where: { id } });
    if (!bookmark) {
      throw new NotFoundException(
        HttpStatus.NOT_FOUND,
        'BookMark is not found',
      );
    }
    return bookmark;
  }

  async save(createBookMarkDto: CreateBookMarkDto, user: User) {
    const bookmark = this.repository.create(createBookMarkDto);
    bookmark.user = user;
    const bookmarks = await this.repository.save(bookmark);
    if (!bookmarks) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Bookmark is already exist',
      );
    }
    return bookmarks;
  }

  async update(id: number, attrs: Partial<BookMark>) {
    const bookmark = await this.repository.findOne({ where: { id } });
    if (!bookmark) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, 'Bookmark Not Found');
    }
    Object.assign(bookmark, attrs);
    return this.repository.save(bookmark);
  }

  async remove(id: number) {
    const bookmark = await this.repository.findOne({ where: { id } });
    if (!bookmark) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, 'Bookmark Not Found');
    }
    return this.repository.remove(bookmark);
  }
}
