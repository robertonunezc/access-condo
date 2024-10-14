
export default async function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    
};

export const config = {
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
    dir: {
        input: "src", //where is the source code
        output: "_site", // where the final site live
        include: "_includes" //where the templates to includes live
    }
};
