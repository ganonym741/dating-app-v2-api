/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from "@nestjs/testing";

import { AuthService } from "@/auth/auth.service";
import { AuthController } from "./auth.controller";

const mockAuthService = {
	login: jest.fn(),
	refreshToken: jest.fn(),
	logout: jest.fn(),
}



describe("AuthController", () => {
  let testAuthController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {

    const module = await Test.createTestingModule({
    imports: [],
    providers: [
      AuthController,
      {
      provide: AuthService,
      useValue: mockAuthService,
      },,
      ],
    }).compile();

    testAuthController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
      expect(testAuthController).toBeDefined();
  });

  it.todo("login");
  it.todo("refreshToken");
  it.todo("logout");        

});
  