/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from "@nestjs/testing";
import type { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

import { UserLikeEntity } from "@model/user-like.entity";
import { UserViewEntity } from "@model/user-view.entity";
import { AlbumLikeEntity } from "@model/album-like.entity";
import { AlbumEntity } from "@model/album.entity";
import { RedisCacheService } from "@core/utils/caching";
import { UserActionService } from "./user-action.service";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
	findOne: jest.fn(),
	update: jest.fn(),
	save: jest.fn(),
	find: jest.fn(),
});

const mockCacheService = {
	getKeys: jest.fn(),
	save: jest.fn(),
}



describe("UserActionService", () => {
  let testUserActionService: UserActionService;
  let userLikeRepo: MockRepository<UserLikeEntity>;
  let userViewRepo: MockRepository<UserViewEntity>;
  let albumLikeRepo: MockRepository<AlbumLikeEntity>;
  let albumRepo: MockRepository<AlbumEntity>;
  let cacheService: RedisCacheService;

  beforeAll(async () => {

    const module = await Test.createTestingModule({
    imports: [],
    providers: [
      UserActionService,
      {
      provide: getRepositoryToken(UserLikeEntity),
      useValue: mockRepository(),
      },
      {
      provide: getRepositoryToken(UserViewEntity),
      useValue: mockRepository(),
      },
      {
      provide: getRepositoryToken(AlbumLikeEntity),
      useValue: mockRepository(),
      },
      {
      provide: getRepositoryToken(AlbumEntity),
      useValue: mockRepository(),
      },
      {
      provide: RedisCacheService,
      useValue: mockCacheService,
      },
      ],
    }).compile();

    testUserActionService = module.get<UserActionService>(UserActionService);
    userLikeRepo = module.get(getRepositoryToken(UserLikeEntity));
    userViewRepo = module.get(getRepositoryToken(UserViewEntity));
    albumLikeRepo = module.get(getRepositoryToken(AlbumLikeEntity));
    albumRepo = module.get(getRepositoryToken(AlbumEntity));
    cacheService = module.get<RedisCacheService>(RedisCacheService);

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
      expect(testUserActionService).toBeDefined();
  });

  it.todo("likeUser");
  it.todo("viewUser");
  it.todo("likeAlbum");
  it.todo("viewUserLike");
  it.todo("viewUserView");
  it.todo("viewAlbumLike");        

});
  