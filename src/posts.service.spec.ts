import { PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;

  beforeEach(() => {
    postsService = new PostsService();
  });

  describe('.findMany', () => {
    const posts = [
      { text: 'Post 1' },
      { text: 'Post 2' },
      { text: 'Post 3' },
      { text: 'Post 4' },
    ];

    const allPosts = [
      { id: '1', text: 'Post 1' },
      { id: '2', text: 'Post 2' },
      { id: '3', text: 'Post 3' },
      { id: '4', text: 'Post 4' },
    ];

    beforeEach(() => {
      posts.forEach((post) => postsService.create(post));
    });

    it('should return all posts if called without options', () => {
      expect(postsService.findMany()).toEqual(allPosts);
    });

    it('should return correct posts for skip and limit options', () => {
      // skip применяется раньше limit: пропускаем 1, затем берём 2
      expect(postsService.findMany({ skip: 1, limit: 2 })).toEqual([
        { id: '2', text: 'Post 2' },
        { id: '3', text: 'Post 3' },
      ]);
    });

    it('should return all posts if options object is empty', () => {
      expect(postsService.findMany({})).toEqual(allPosts);
    });

    it('should return posts after skipped ones if only skip is passed', () => {
      expect(postsService.findMany({ skip: 2 })).toEqual([
        { id: '3', text: 'Post 3' },
        { id: '4', text: 'Post 4' },
      ]);
    });

    it('should return first posts if only limit is passed', () => {
      expect(postsService.findMany({ limit: 2 })).toEqual([
        { id: '1', text: 'Post 1' },
        { id: '2', text: 'Post 2' },
      ]);
    });

    it('should return all posts if skip is 0', () => {
      expect(postsService.findMany({ skip: 0 })).toEqual(allPosts);
    });

    it('should return an empty array if limit is 0', () => {
      expect(postsService.findMany({ limit: 0 })).toEqual([]);
    });

    it('should return an empty array if skip is greater than posts count', () => {
      expect(postsService.findMany({ skip: 10 })).toEqual([]);
    });

    it('should return all posts if limit is greater than posts count', () => {
      expect(postsService.findMany({ limit: 10 })).toEqual(allPosts);
    });

    it('should return fewer posts than limit if not enough posts remain after skip', () => {
      expect(postsService.findMany({ skip: 3, limit: 5 })).toEqual([
        { id: '4', text: 'Post 4' },
      ]);
    });

    it('should not change stored posts between calls', () => {
      postsService.findMany({ skip: 1, limit: 1 });

      expect(postsService.findMany()).toEqual(allPosts);
    });
  });
});