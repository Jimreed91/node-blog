/* eslint-disable arrow-body-style */
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

module.exports = {
  totalLikes,
  favouriteLikes,
};
