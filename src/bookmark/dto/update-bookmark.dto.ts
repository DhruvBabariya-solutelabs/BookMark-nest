import { PartialType } from '@nestjs/mapped-types';
import { CreateBookMarkDto } from './create-bookmark.dto';

export class UpdateBookMarkDto extends PartialType(CreateBookMarkDto) {}
