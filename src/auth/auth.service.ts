import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaDbService } from '../prisma_db/prisma_db.service';
import { AuthenticateResultDto, LoginUserDto, RegisterUserDto } from './dto';

const SALT_ROUNDS: number = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaDbService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async register({
    email,
    password,
    name,
  }: RegisterUserDto): Promise<AuthenticateResultDto> {
    try {
      const hashedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);

      const user: User = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      return this.generateToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }

      throw error;
    }
  }

  async login({
    email,
    password,
  }: LoginUserDto): Promise<AuthenticateResultDto> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException('User name or email is incorrect');

    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordMatch)
      throw new ForbiddenException('User name or email is incorrect');

    return this.generateToken(user.id, user.email);
  }

  // TODO
  // async resetPassword() {}

  async generateToken(
    userId: string,
    email: string,
  ): Promise<AuthenticateResultDto> {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '3d',
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return {
      access_token: accessToken,
    };
  }
}
