const gotoProductPage = (slug) => {
  console.log("slug: ", slug);
  window.open("https://le-fabre.com/products/" + slug, "_blank");
};
module.exports = {
  gotoProductPage,
};
