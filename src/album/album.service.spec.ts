/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from "@nestjs/testing";
import type { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

import { AlbumEntity } from "@model/album.entity";
import { AlbumService } from "./album.service";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
	save: jest.fn(),
	find: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
});




describe("AlbumService", () => {
  let testAlbumService: AlbumService;
  let albumRepo: MockRepository<AlbumEntity>;

  beforeAll(async () => {

    const module = await Test.createTestingModule({
    imports: [],
    providers: [
      AlbumService,
      {
      provide: getRepositoryToken(AlbumEntity),
      useValue: mockRepository(),
      },,
      ],
    }).compile();

    testAlbumService = module.get<AlbumService>(AlbumService);
    albumRepo = module.get(getRepositoryToken(AlbumEntity));

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
      expect(testAlbumService).toBeDefined();
  });

  it.todo("create");
  it.todo("findByUserId");
  it.todo("update");
  it.todo("remove");        

});
  