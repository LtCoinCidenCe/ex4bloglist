const dummy = (blogs) =>
{
  return 1;
}

const totalLikes = (blogs) =>
{
  const total = blogs.reduce(
    (value1, value2) => { return value1 + value2.likes; },
    0);
  return total;
}

const favoriteBlog = (blogs) =>
{
  let initValue = blogs[0];
  delete initValue.url;
  const favorite = blogs.reduce(
    (mostLikes, newBlog) =>
    {
      if (mostLikes.likes < newBlog.likes)
      {
        const copy = {
          title: newBlog.title,
          author: newBlog.author,
          likes: newBlog.likes
        }
        return copy;
      }
      else
      {
        return mostLikes
      }
    }
    , initValue);
  return favorite;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
