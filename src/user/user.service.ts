import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(authDto: AuthDto) {
    try {
      const hashPasword = await argon.hash(authDto.password);
      authDto.password = hashPasword;
      const user = this.repo.create(authDto);
      return this.repo.save(user);
    } catch (error) {
      throw new NotFoundException(
        HttpStatus.CONFLICT,
        'email id is already exist',
      );
    }
  }

  async signin(authDto: AuthDto) {
    const email = authDto.email;
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        HttpStatus.NOT_FOUND,
        'User is not exist in this email',
      );
    }
    const pwMatch = await argon.verify(user.password, authDto.password);
    if (!pwMatch) {
      throw new NotFoundException(
        HttpStatus.NOT_FOUND,
        'User Password is invalid',
      );
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }

  async findById(userId: number) {
    return this.repo.findOne({ where: { id: userId } });
  }
}
