import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto/index';
import { EditUserDto } from '../src/user/dto/index';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { inspect } from 'util';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
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
      email: 'bello@a.com',
      password: '123'
    };

    describe('Register', () => {
      it('will throw error if email is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });

      it('will throw error if password is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });

      it('will throw error if no body provided', () => {
        return pactum
          .spec()
          .post('auth/register')
          .expectStatus(400);
      });

      it('Should register', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('Should login', () => {
        return pactum
          .spec()
          .post('auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });

      it('will throw error if email is empty', () => {
        return pactum
          .spec()
          .post('auth/login')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });

      it('will throw error if password is empty', () => {
        return pactum
          .spec()
          .post('auth/login')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });

      it('will throw error if no body provided', () => {
        return pactum
          .spec()
          .post('auth/login')
          .expectStatus(400);
      });
    });
  });

  describe('User', () => {
    describe('Profile', () => {
      it('should get profile', () => {
        return pactum
          .spec()
          .get('user/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: "Bello",
          email: "bello@d.com",
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
  });

  describe('Bookmark', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          //.inspect()
          .expectBody([]);
      });
    });

    describe('Create', () => {
      it('should create bookmark', () => {
        const dto : CreateBookmarkDto = {
          title : 'Hello World',
          link : 'http://www.youtube.com'
        }
        return pactum
          .spec()
          .post('bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
          //.inspect();
      });
    });

    describe('Get bookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1)
      });
    });

    describe('Edit by id', () => {
      it('should edit bookmark by id', () => {
        const dto : EditBookmarkDto = {
          description : 'ielwkgsnlkwegsolznkagnznaklnpjwegsdpojdas',
          title : ' Me'
        }
        return pactum
        .spec()
        .patch('bookmark/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.title)
        .expectBodyContains(dto.description);
      });
    });

    describe('Get by id', () => {
      it('should get bookmark by id', () => {
        return pactum
        .spec()
        .get('bookmark/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{bookmarkId}')
      });
    });

    describe('Delete by id', () => {
      it('should delete bookmark by id', () => {
        return pactum
        .spec()
        .delete('bookmark/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(204)
    });

    it('should return empty bookmark', () => {
      return pactum
          .spec()
          .get('bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0)
    })
  });
});
});
