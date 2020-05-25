module.exports = `
{
  legal: allMarkdownRemark(
    filter: { frontmatter: { type: { eq: "legal" } } }
  ) {
    edges {
      node {
        id
        fields {
          slug
        }
      }
    }
  }
  posts: allMarkdownRemark(
    filter: { frontmatter: { type: { ne: "legal" }, draft: { ne: true } } }
    sort: { order: DESC, fields: [frontmatter___date] }
  ) {
    edges {
      node {
        description: excerpt(pruneLength: 260)
        id
        timeToRead
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "MMM DD, YYYY")
          tags
          thumbnail {
            childImageSharp {
              fluid {
                aspectRatio
                base64
                originalImg
                originalName
                presentationHeight
                presentationWidth
                sizes
                src
                srcSet
                srcSetWebp
                srcWebp
                tracedSVG
              }
            }
          }
        }
      }
    }
  }
  tags: allTagsYaml {
    edges {
      node {
        title
      }
    }
  }
}
`
