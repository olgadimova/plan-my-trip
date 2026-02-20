import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { RegisterUserDto } from '../src/auth/dto';
import { CreateDestinationDto } from '../src/destinations/dto';
import { PrismaDbService } from '../src/prisma_db/prisma_db.service';

const TEST_PORT: number = 3333;

describe('AppModule e2e', () => {
  let app: INestApplication<App>;
  let prisma: PrismaDbService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(TEST_PORT);

    prisma = app.get(PrismaDbService);

    try {
      await prisma.cleanDb();
    } catch (err) {
      console.log(err);
    }

    pactum.request.setBaseUrl(`http://localhost:${TEST_PORT}`);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Auth', () => {
    const data: RegisterUserDto = {
      email: 'test@test.com',
      password: '123456',
    };

    describe('Registration', () => {
      it('throws an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ password: data.password })
          .expectStatus(400);
      });

      it('throws an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: data.email })
          .expectStatus(400);
      });

      it('registers user', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(data)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('throws an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: data.password })
          .expectStatus(400);
      });

      it('throws an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: data.email })
          .expectStatus(400);
      });

      it('throws error if password does not match', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...data, password: '345' })
          .expectStatus(400);
      });

      it('logs in user', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(data)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
    });
  });

  describe('Destination', () => {
    const data: CreateDestinationDto = {
      title: 'Paris',
      description: 'My first trip',
      due_date: new Date(),
    };
    const updatedData: CreateDestinationDto = {
      title: 'New York',
      description: 'My second trip',
      due_date: new Date(),
    };

    it('get all user destinations', () => {
      return pactum
        .spec()
        .get('/destinations')
        .withHeaders({ Authorization: `Bearer $S{userToken}` })
        .expectStatus(200)
        .expectBody({
          destinations: [],
        });
    });

    it('adds user destination', () => {
      return pactum
        .spec()
        .post('/destinations')
        .withHeaders({ Authorization: `Bearer $S{userToken}` })
        .withBody(data)
        .expectStatus(201)
        .expectBodyContains(data.title)
        .expectBodyContains(data.description)
        .stores('destinationId', 'id');
    });

    it('updates user destination', () => {
      return pactum
        .spec()
        .patch(`/destinations/$S{destinationId}`)
        .withHeaders({ Authorization: `Bearer $S{userToken}` })
        .withBody(updatedData)
        .expectStatus(200)
        .expectBodyContains(updatedData.title)
        .expectBodyContains(updatedData.description);
    });

    it('returns user destination info', () => {
      return pactum
        .spec()
        .get(`/destinations/$S{destinationId}`)
        .withHeaders({ Authorization: `Bearer $S{userToken}` })
        .withBody(data)
        .expectStatus(200)
        .expectBodyContains(updatedData.title)
        .expectBodyContains(updatedData.description);
    });

    it('delete user destination', () => {
      return pactum
        .spec()
        .delete(`/destinations/$S{destinationId}`)
        .withHeaders({ Authorization: `Bearer $S{userToken}` })
        .withBody(data)
        .expectStatus(200);
    });

    it('returns empty user destinations after delete', () => {
      return pactum
        .spec()
        .get(`/destinations`)
        .withHeaders({ Authorization: `Bearer $S{userToken}` })
        .expectStatus(200)
        .expectBody({
          destinations: [],
        });
    });
  });
});
