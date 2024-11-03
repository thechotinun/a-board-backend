import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '@modules/post/controllers/post.controller';
import { PostService } from '@modules/post/services/post.service';
import { HttpStatus } from '@nestjs/common';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const mockPostService = {
      paginate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: mockPostService }],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  describe('paginate', () => {
    it('should return message: OK response', async () => {
      const mockPaginationResult = {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
        status: { code: HttpStatus.OK, message: 'OK' },
      };

      jest
        .spyOn(postService, 'paginate')
        .mockResolvedValue(mockPaginationResult);

      const result = await postController.paginate({ page: 1, limit: 10 }, {});

      expect(result).toEqual({
        data: [],
        meta: mockPaginationResult.meta,
        status: { code: HttpStatus.OK, message: 'OK' },
      });
    });
  });
});
