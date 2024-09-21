/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from "@nestjs/testing";
import type { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

import { UserEntity } from "@model/user.entity";
import { RedisCacheService } from "@core/utils/caching";
import { UserService } from "./user.service";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
	create: jest.fn(),
	save: jest.fn(),
	find: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
});

const mockCacheService = {
	getKeys: jest.fn(),
}

describe("UserService", () => {
  let testUserService: UserService;
  let userRepo: MockRepository<UserEntity>;
  let cacheService: RedisCacheService;

  beforeAll(async () => {

    const module = await Test.createTestingModule({
    imports: [],
    providers: [
      UserService,
      {
      provide: getRepositoryToken(UserEntity),
      useValue: mockRepository(),
      },
      {
      provide: RedisCacheService,
      useValue: mockCacheService,
      },,
      ],
    }).compile();

    testUserService = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    cacheService = module.get<RedisCacheService>(RedisCacheService);

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
      expect(testUserService).toBeDefined();
  });

  it.todo("create");
  it.todo("findMany");
  it.todo("findOne");
  it.todo("update");
  it.todo("remove");        

});
  