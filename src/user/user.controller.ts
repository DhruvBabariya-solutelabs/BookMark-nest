import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from './user.entity';
import { Serialize } from 'src/auth/interceptor/serealize.interceptor';
import { UserDto } from 'src/auth/dto/user.dto';

@Serialize(UserDto)
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
