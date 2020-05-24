import { Layout, Post, SEO, SmallerContainer } from 'components/common'
import { graphql } from 'gatsby'
import React from 'react'
import './highlight.css'

export default ({ data: { post } }) => (
  <Layout>
    <SmallerContainer>
      <SEO
        type="NewsArticle"
        title={post.frontmatter.title}
        articleBody={post.description}
        datePublished={post.frontmatter.normalDate}
        dateModified={
          post.frontmatter.edited
            ? post.frontmatter.edited
            : post.frontmatter.date
        }
        cover={post.frontmatter.thumbnail.childImageSharp.fluid.originalImg}
        location=''
        description={post.description}
        readTime={post.timeToRead}
      />
      <Post {...post} />
    </SmallerContainer>
  </Layout>
)

export const postQuery = graphql`
  query($path: String!) {
    post: markdownRemark(fields: { slug: { eq: $path } }) {
      html
      description: excerpt(pruneLength: 105)
      timeToRead
      frontmatter {
        normalDate: date
        date(formatString: "MMMM DD, YYYY")
        edited(formatString: "MMMM DD, YYYY")
        title
        id
        tags
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 700) {
              originalImg
            }
          }
        }
      }
    }
  }
`
