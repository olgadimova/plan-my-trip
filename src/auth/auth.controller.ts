import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { UserModel } from 'generated/nestjs-dto/user.entity';
import { MessageResultDto } from '../shared/dto';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordConfirmDto,
  ResetPasswordDto,
} from './dto';
import { Public } from './shared';

@ApiTags('Auth')
@Controller('auth')
@Throttle({
  short: { limit: 5, ttl: 10000 },
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User created',
    type: UserModel,
  })
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @ApiCreatedResponse({
    description: 'User logged in',
  })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @ApiResponse({
    type: MessageResultDto,
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('reset-password/confirm')
  resetPasswordConfirm(@Body() body: ResetPasswordConfirmDto) {
    return this.authService.resetPasswordConfirm(body);
  }
}
