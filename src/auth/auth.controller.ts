import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { Serialize } from './interceptor/serealize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Serialize(UserDto)
  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    return this.userService.signup(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() authDto: AuthDto) {
    return this.userService.signin(authDto);
  }
}
