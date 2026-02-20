import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { UserModel } from 'generated/nestjs-dto/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { Public } from './shared';

@ApiTags('Auth')
@Controller('auth')
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

  // TODO: reset-password
  // @ApiCreatedResponse({
  //   description: 'Password reset done',
  // })
  // @HttpCode(HttpStatus.OK)
  // @Public()
  // @Post('reset-password')
  // resetPassword() {
  //   return this.authService.resetPassword();
  // }
}
