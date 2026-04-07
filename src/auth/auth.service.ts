import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

import { Role, User } from 'generated/prisma/client';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaDbService } from '../prisma_db/prisma_db.service';
import { MessageResultDto } from '../shared/dto';
import {
  AuthenticateResultDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordConfirmDto,
  ResetPasswordDto,
} from './dto';

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

      return this.generateToken(user.id, user.email, user.role);
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
      throw new ForbiddenException('Email or password is incorrect');

    return this.generateToken(user.id, user.email, user.role);
  }

  async resetPassword({ email }: ResetPasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const rawToken: string = randomBytes(32).toString('hex');
      const hashedToken: string = createHash('sha256')
        .update(rawToken)
        .digest('hex');

      await this.prisma.user.update({
        where: { email },
        data: {
          resetTokenHash: hashedToken,
          // 1 hour token
          resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      const resetLink: string = `https://.../reset-password?token=${rawToken}`;

      // TODO - email queues
    }
  }

  async resetPasswordConfirm({
    token: confirmToken,
    password,
  }: ResetPasswordConfirmDto): Promise<MessageResultDto> {
    const inputHash: string = createHash('sha256')
      .update(confirmToken)
      .digest('hex');

    const user = await this.prisma.user.findUnique({
      where: {
        resetTokenHash: inputHash,
      },
    });

    if (!user || !user.resetTokenExpiresAt) {
      throw new BadRequestException('Token expired.');
    }

    if (user.resetTokenExpiresAt < new Date()) {
      await this.prisma.user.update({
        where: {
          resetTokenHash: inputHash,
        },
        data: {
          resetTokenHash: null,
          resetTokenExpiresAt: null,
        },
      });
      throw new BadRequestException('Token expired.');
    }

    const hashedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    return { message: 'Password reset successful.' };
  }

  async generateToken(
    userId: string,
    email: string,
    role: Role,
  ): Promise<AuthenticateResultDto> {
    const payload = {
      sub: userId,
      email,
      role,
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
