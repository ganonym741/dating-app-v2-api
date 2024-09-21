/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from "@nestjs/testing";

import { UserActionService } from "./user-action.service";
import { UserActionController } from "./user-action.controller";

const mockUserActionService = {
	likeUser: jest.fn(),
	viewUser: jest.fn(),
	likeAlbum: jest.fn(),
	viewUserLike: jest.fn(),
	viewUserView: jest.fn(),
	viewAlbumLike: jest.fn(),
}



describe("UserActionController", () => {
  let testUserActionController: UserActionController;
  let userActionService: UserActionService;

  beforeAll(async () => {

    const module = await Test.createTestingModule({
    imports: [],
    providers: [
      UserActionController,
      {
      provide: UserActionService,
      useValue: mockUserActionService,
      },,
      ],
    }).compile();

    testUserActionController = module.get<UserActionController>(UserActionController);
    userActionService = module.get<UserActionService>(UserActionService);

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
      expect(testUserActionController).toBeDefined();
  });

  it.todo("likeUser");
  it.todo("viewUser");
  it.todo("likeAlbum");
  it.todo("viewUserLike");
  it.todo("viewUserView");
  it.todo("viewAlbumLike");        

});
  