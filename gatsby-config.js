'use strict'
module.exports = {
  siteMetadata: {
    title: 'VicBlog',
    description: 'A personal blog',
    siteUrl: 'https://viccrubs.tk',
    author: {
      name: 'Chen Junda',
      url: 'https://viccrubs.tk',
      email: 'smallda@outlook.com'
    }
  },
  plugins: [
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
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(({ node }) => {
                const url = node.frontmatter.absolute_path || `/articles/${node.frontmatter.id_name}`;
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  url: url,
                  guid: url,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: {frontmatter: { ignored: { ne: true } }}
                ) {
                  edges {
                    node {
                      excerpt(pruneLength: 250)
                      html
                      frontmatter {
                        title
                        id_name
                        date
                      }
                    }
                  }
                }
              }
            `,
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
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem'
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
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
        siteUrl: 'https://viccrubs.tk'
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
        background_color: "#222222",
        theme_color: "#3498DB",
        display: "minimal-ui",
        icon: "assets/icon.png", // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`
  ]
}
