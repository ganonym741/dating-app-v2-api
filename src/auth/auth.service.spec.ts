/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import type { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

import { UserEntity } from "@model/user.entity";
import { RedisCacheService } from "@core/utils/caching";
import { AuthService } from "./auth.service";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
	findOne: jest.fn(),
});

const mockJwtService = {
	signAsync: jest.fn(),
}
const mockCacheService = {
	save: jest.fn(),
	delete: jest.fn(),
}

jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("AuthService", () => {
  let testAuthService: AuthService;
  let userRepo: MockRepository<UserEntity>;
  let jwtService: JwtService;
  let cacheService: RedisCacheService;

  beforeAll(async () => {

    const module = await Test.createTestingModule({
    imports: [],
    providers: [
      AuthService,
      {
      provide: getRepositoryToken(UserEntity),
      useValue: mockRepository(),
      },
      {
      provide: JwtService,
      useValue: mockJwtService,
      },
      {
      provide: RedisCacheService,
      useValue: mockCacheService,
      },,
      ],
    }).compile();

    testAuthService = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    jwtService = module.get<JwtService>(JwtService);
    cacheService = module.get<RedisCacheService>(RedisCacheService);

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
      expect(testAuthService).toBeDefined();
  });

  it.todo("login");
  it.todo("logout");
  it.todo("refreshToken");
  it.todo("createToken");
  it.todo("compareHash");        

});
  