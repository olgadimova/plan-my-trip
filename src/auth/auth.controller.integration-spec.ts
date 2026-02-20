import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaDbModule } from '../prisma_db/prisma_db.module';
import { PrismaDbService } from '../prisma_db/prisma_db.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticateResultDto, RegisterUserDto } from './dto';
import { JwtStrategy } from './strategy';

describe('Auth controller and service integration', () => {
  let authController: AuthController;
  let prisma: PrismaDbService;
  let authModuleRef: TestingModule;
  const data: RegisterUserDto = {
    email: 'test@test.com',
    password: '123456',
  };

  beforeAll(async () => {
    authModuleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({}),
        PrismaDbModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile();

    authController = authModuleRef.get(AuthController);
    prisma = authModuleRef.get(PrismaDbService);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await authModuleRef.close();
  });

  describe('User registration', () => {
    it('registers new user', async () => {
      const token: AuthenticateResultDto = await authController.register(data);

      expect(token).toHaveProperty('access_token');
    });

    it('throws an error if user already exists', async () => {
      await authController.register(data);

      await expect(authController.register(data)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('User login', () => {
    it('returns access token for a registered user', async () => {
      await authController.register(data);

      const loginToken = await authController.login(data);
      expect(loginToken).toHaveProperty('access_token');
    });

    it('throws an error if user does not exist', async () => {
      await expect(authController.login(data)).rejects.toThrow(
        'User name or email is incorrect',
      );
    });

    it('throws an error if password is incorrect', async () => {
      await authController.register(data);

      await expect(
        authController.login({ ...data, password: '345' }),
      ).rejects.toThrow('User name or email is incorrect');
    });
  });
});
