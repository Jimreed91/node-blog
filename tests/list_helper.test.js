const listHelper = require('../utils/list_helper');
const { blogs } = require('./testBlogs');

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '352342342351',
      title: 'test blog to test testing',
      author: 'Curtis E. Bear',
      url: 'https://www.google.com',
      likes: 7,
      __v: 0,
    },
  ];
  test('when list is one blog long, equals blog likes', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(7);
  });
});

describe('favourite likes', () => {
  test('returns one of the blogs with the most likes', () => {
    const result = listHelper.favouriteLikes(blogs);
    expect(result).toEqual(
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      },
    );
  });
});

describe('most blogs', () => {
  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 3,
      },
    );
  });
});

describe('most likes', () => {
  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 17,
      },
    );
  });
});
