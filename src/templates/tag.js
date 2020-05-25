import { CardPost, Container, Layout, PageTitle, Row, SEO } from 'components/common'
import { graphql } from 'gatsby'
import React from 'react'

export default ({ data: { tag, posts } }) => (
  <Layout>
    <Container>
      <SEO type="Organization" title={tag.title} location={`/${tag.title}`} />
      <Row>
        <PageTitle>Articles related to {tag.title}</PageTitle>
        {posts.edges.map(
          ({
            node: {
              id,
              description,
              timeToRead,
              fields: { slug },
              frontmatter: { title, date, thumbnail, tags },
            },
          }) => (
            <CardPost
              key={id}
              description={description}
              timeToRead={timeToRead}
              title={title}
              date={date}
              path={slug}
              thumbnail={thumbnail}
              tags={tags}
            />
          )
        )}
      </Row>
    </Container>
  </Layout>
)

export const postQuery = graphql`
  query($slug: String!) {
    tag: tagsYaml(title: { eq: $slug }) {
      title
    }
    posts: allMarkdownRemark(
      filter: { frontmatter: { type: { ne: "legal" }, tags: { in: [$slug] } } }
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 200
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
                ...imageFields
              }
            }
          }
        }
      }
    }
  }
`
