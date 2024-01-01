import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { EditUserDto } from '../src/user/dto/edituser.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = 
    await Test.createTestingModule({
      imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    }),
  );
  await app.init();
  await app.listen(5000);

  prisma = app.get(PrismaService);
  await prisma.cleanDb();
  pactum.request.setBaseUrl('http://localhost:5000/');
});

  afterAll(() => {
  app.close();
});

  describe('Auth', () => {
    const dto: AuthDto = {
      email : 'bello@a.com',
      password : '123'
    }
    describe('Register', () => {
      it('will throw error if email is empty', () => {
        return pactum
        .spec()
        .post(
          'auth/register', 
          ).withBody({
            password : dto.password
          }).expectStatus(400);
          //.inspect();
      });
      it('will throw error if password is empty ', () => {
        return pactum
        .spec()
        .post(
          'auth/register', 
          ).withBody({
            email : dto.email
          }).expectStatus(400);
          //.inspect();
      });
      it('will throw error if no body provided', () => {
        return pactum
        .spec()
        .post(
          'auth/register', 
          ).expectStatus(400);
          //.inspect();
      });
      it('Should register', () => {
        return pactum
        .spec()
        .post(
          'auth/register', 
          ).withBody(dto).expectStatus(201);
          //.inspect();
      });
      
    });

    describe('Login', () => {
      it('Should login', () => {
        return pactum
        .spec()
        .post(
          'auth/login', 
          ).withBody(dto).expectStatus(201)
          .stores('userAt', 'access_token');
         // .inspect();
      });
      it('will throw error if email is empty', () => {
        return pactum
        .spec()
        .post(
          'auth/login', 
          ).withBody({
            password : dto.password
          }).expectStatus(400);
          //.inspect();
      });
      it('will throw error if password is empty ', () => {
        return pactum
        .spec()
        .post(
          'auth/login', 
          ).withBody({
            email : dto.email
          }).expectStatus(400);
          //.inspect();
      });
      it('will throw error if no body provided', () => {
        return pactum
        .spec()
        .post(
          'auth/login', 
          ).expectStatus(400);
          //.inspect();
      });
    });
  });

  describe('User', () => {

    describe('Profile', () => { 
      it('should get profile', () => {
        return pactum
        .spec()
        .get(
          'user/profile', 
          ).withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200);  
      });
     });

     describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Bello',
          email: 'bello@d.com',
        };
        return pactum
          .spec()
          .patch('user/edit')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });

    describe('Delete User', () => { });
  });

  describe('Bookmark', () => {

    describe('Create', () => { });

    describe('Edit by id', () => { });

    describe('Delete by id', () => { });

    describe('Get by id', () => { });

    describe('Get bookmarks', () => { });
   });

});
