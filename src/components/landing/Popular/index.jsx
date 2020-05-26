import { CardPost, Container, CustomButton, Row, Subtitle } from 'components/common'
import { graphql, Link, useStaticQuery } from 'gatsby'
import React from 'react'
import { Center, Wrapper } from './styles.js'

export const Popular = () => {
  const {
    popular: { edges },
  } = useStaticQuery(graphql`
    query {
      popular: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: {
          frontmatter: { popular: { eq: true } }
        }
        limit: 3
      ) {
        edges {
          node {
            description: excerpt(pruneLength: 230)
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
  `)

  return (
    <Wrapper as={Container}>
      <Subtitle>Popular articles</Subtitle>
      <Row landing>
        {edges.map(
          ({
            node: {
              id,
              description,
              timeToRead,
              frontmatter: { title, date, path, thumbnail, tags },
            },
          }) => (
            <CardPost
              landing
              key={id}
              description={description}
              timeToRead={timeToRead}
              title={title}
              date={date}
              path={path}
              thumbnail={thumbnail}
              tags={tags}
            />
          )
        )}
      </Row>
      <Center>
        <CustomButton>
          <Link to="/blog/">See more</Link>
        </CustomButton>
      </Center>
    </Wrapper>
  )
}
