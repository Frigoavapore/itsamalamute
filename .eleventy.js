const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // Copy static assets
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/images");

  // String includes filter (for nav active state)
  eleventyConfig.addFilter("includes", (str, substr) => {
    if (!str) return false;
    return str.includes(substr);
  });

  // Slice filter for arrays
  eleventyConfig.addFilter("slice", (arr, start, end) => {
    if (!arr) return [];
    return arr.slice(start, end);
  });

  // Reverse filter
  eleventyConfig.addFilter("reverse", (arr) => {
    if (!arr) return [];
    return [...arr].reverse();
  });

  // Date filters
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Collections — IT
  eleventyConfig.addCollection("it_posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/it/**/*.md")
      .filter(item => item.data.type === "post")
      .sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("it_razza", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/it/la-razza/*.md")
      .filter(item => item.data.type === "post")
      .sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("it_addestramento", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/it/addestramento/*.md")
      .filter(item => item.data.type === "post")
      .sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("it_salute", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/it/salute/*.md")
      .filter(item => item.data.type === "post")
      .sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("it_alimentazione", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/it/alimentazione/*.md")
      .filter(item => item.data.type === "post")
      .sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("it_attrezzatura", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/it/attrezzatura/*.md")
      .filter(item => item.data.type === "post")
      .sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("it_allevatori", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/it/allevatori/*.md")
      .filter(item => item.data.type === "post")
      .sort((a, b) => b.date - a.date);
  });

  // Collections — EN
  eleventyConfig.addCollection("en_posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/en/**/*.md")
      .filter(item => item.data.type === "post")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
