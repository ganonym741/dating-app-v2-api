/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from "@nestjs/testing";

import { AlbumService } from "./album.service";
import { AlbumController } from "./album.controller";

const mockAlbumService = {
	create: jest.fn(),
	findByUserId: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
}



describe("AlbumController", () => {
  let testAlbumController: AlbumController;
  let albumService: AlbumService;

  beforeAll(async () => {

    const module = await Test.createTestingModule({
    imports: [],
    providers: [
      AlbumController,
      {
      provide: AlbumService,
      useValue: mockAlbumService,
      },,
      ],
    }).compile();

    testAlbumController = module.get<AlbumController>(AlbumController);
    albumService = module.get<AlbumService>(AlbumService);

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
      expect(testAlbumController).toBeDefined();
  });

  it.todo("create");
  it.todo("findByUserId");
  it.todo("findMine");
  it.todo("update");
  it.todo("remove");        

});
  