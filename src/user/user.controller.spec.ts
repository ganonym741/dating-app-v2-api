/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from "@nestjs/testing";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";

const mockUserService = {
	create: jest.fn(),
	findMany: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
}

jest.mock("class-transformer");

describe("UserController", () => {
  let testUserController: UserController;
  let userService: UserService;

  beforeAll(async () => {

    const module = await Test.createTestingModule({
    imports: [],
    providers: [
      UserController,
      {
      provide: UserService,
      useValue: mockUserService,
      },,
      ],
    }).compile();

    testUserController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
      expect(testUserController).toBeDefined();
  });

  it.todo("create");
  it.todo("findAll");
  it.todo("findOne");
  it.todo("update");
  it.todo("remove");        

});
  