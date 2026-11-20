/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'birajbuddhacharya.com.np', // Replace with your site’s URL
  generateRobotsTxt: true, // Automatically generates a robots.txt file
  exclude: ['/studio-7f3c9a/*'], // keep the private area out of sitemap.xml
};