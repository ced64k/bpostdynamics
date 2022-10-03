module.exports = function(eleventyConfig) {
  // Return your Object options:
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.setUseGitIgnore(false); 
  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public"
    }
  }
};