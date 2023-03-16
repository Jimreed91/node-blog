/* eslint-disable arrow-body-style */

// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require('lodash');

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favouriteLikes = (blogs) => {
  const favorite = blogs.reduce((top, blog) => {
    return blog.likes > top.likes ? blog : top;
  });
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const authors = _.entries(_.countBy(blogs, 'author'));
  const author = _.maxBy(authors, _.last);
  return { author: author[0], blogs: author[1] };
};

const mostLikes = (blogs) => {
  const authors = _(blogs).groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, 'likes'),
    }))
    .value();
  return _.maxBy(authors, 'likes');
};

module.exports = {
  totalLikes,
  favouriteLikes,
  mostBlogs,
  mostLikes,
};
