'use strict'

const dayjs = require("dayjs");

const path = require("path");


module.exports = {
  siteMetadata: {
    title: 'VicBlog',
    description: 'A personal blog',
    siteUrl: 'https://viccrubs.me',
    author: {
      name: 'Chen Junda',
      url: 'https://viccrubs.me',
      email: 'smallda@outlook.com'
    },
    lastUpdated: dayjs().format("YYYY/MM/DD HH:mm:ss"),
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        includePaths: [path.join(__dirname, "src/styles")],
      },
    },
    "gatsby-plugin-layout",
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        "@": path.join(__dirname, 'src'),
        "~": path.join(__dirname)
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
                filter: { frontmatter: { ignored: { ne: true } }}
              ) {
                edges {
                  node {
                    excerpt(pruneLength: 250, truncate: true)
                    html
                    frontmatter {
                      title
                      id
                      date
                      tags
                      lang
                    }
                  }
                }
              }
            }
          `,
            serialize: ({ query: { site, allMarkdownRemark } }) => {

              return allMarkdownRemark.edges.map(({ node }) => {
                const path = `/${node.frontmatter.lang}${node.frontmatter.absolute_path || `/articles/${node.frontmatter.id}`}`;
                return {
                  ...node.frontmatter,
                  description: node.excerpt,
                  url: path,
                  guid: path,
                  custom_elements: [{ "content:encoded": node.html }]
                }

              });
            },
            output: "/rss.xml",
            title: "VicBlog RSS",
          },
        ],
      },
    },
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'contents',
        path: `${__dirname}/contents`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `link-anchor`,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem'
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          `gatsby-remark-emoji`,
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              quality: 90,
              linkImagesToOriginal: false
            }
          }
        ]
      }
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://viccrubs.me'
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        include: /assets/
      }
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `#3498DB`,
        // Disable the loading spinner.
        showSpinner: false
      }
    },
    'gatsby-plugin-styled-components',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "VicBlog",
        short_name: "VicBlog",
        start_url: "/",
        background_color: "#FFFFFF",
        theme_color: "#4E96D8",
        display: "minimal-ui",
        icon: "assets/icon.png", // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
    'gatsby-plugin-sitemap'
  ]
}
