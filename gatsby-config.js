"use strict"

const { DateTime } = require("luxon");
const path = require("path");

module.exports = {
  siteMetadata: {
    name: "ddadaal.me",
    description: 'A personal website',
    siteUrl: 'https://ddadaal.me',
    author: {
      name: 'Chen Junda',
      url: 'https://ddadaal.me',
      email: 'ddadaal@outlook.com'
    },
    lastUpdated: DateTime.utc().toString(),
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        sassOptions: {
          includePaths: [path.join(__dirname, "src/styles")],
        }
      },
    },
    {
      resolve: 'gatsby-plugin-styled-components',
      options: {
        minify: true,
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
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            query: `
            {
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] },
                filter: { frontmatter: { ignored_in_list: { ne: true } }}
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
                const path = `${node.frontmatter.absolute_path || `/articles/${node.frontmatter.id}`}/${node.frontmatter.lang}`;
                return {
                  title: node.frontmatter.title,
                  date: DateTime.fromSQL(node.frontmatter.date, { zone: "Asia/Shanghai" }).toString(),
                  url: site.siteMetadata.siteUrl + path,
                  categories: node.frontmatter.tags || [],
                  guid: path,
                  custom_elements: [{ "content:encoded": node.html }]
                };
              });
            },
            output: "/rss.xml",
            title: "ddadaal.me RSS",
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
    `gatsby-transformer-json`,
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem'
            }
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              inlineCodeMarker: "±",
            }
          },
          `gatsby-remark-emoji`,
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: "static",
              // ignoreFileExtensions: [],
            }
          },
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              quality: 90,
              showCaptions: true,
              linkImagesToOriginal: false
            }
          },
          // {
          //   resolve: `gatsby-remark-images-medium-zoom`,
          //   options: {
          //     background: "#222",
          //     zIndex: 1040,
          //   }
          // }
        ]
      }
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://ddadaal.me'
      }
    },
    {
      resolve: `gatsby-plugin-baidu-analytics`,
      options: {
        siteId: "af77eb4861784c5af85b2cfe05250ff1",
        head: false,
      },
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
        showSpinner: false,
      }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "ddadaal.me",
        short_name: "ddadaal",
        start_url: "/",
        background_color: "#FFFFFF",
        theme_color: "#3498DB",
        display: "minimal-ui",
        icon: "assets/icon.png", // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-remove-serviceworker`,
    'gatsby-plugin-sitemap'
  ]
}
