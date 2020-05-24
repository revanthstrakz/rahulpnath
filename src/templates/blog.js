import React from 'react'
import {
  Layout,
  Container,
  SEO,
  PageTitle,
  CardPost,
  Row,
  Pagination,
} from 'components/common'

export default ({ pageContext }) => {
  const { group, index, pageCount, pathPrefix } = pageContext
  const previousUrl = index - 1 === 1 ? '/' : (index - 1).toString()
  const nextUrl = (index + 1).toString()

  return (
    <Layout>
      <Container>
        <SEO title="Blog" type="Organization" location="/blog" />
        <Row>
          <PageTitle>Recent articles</PageTitle>
          <Pagination
            pathPrefix={pathPrefix}
            index={index}
            pageCount={pageCount}
            previousUrl={previousUrl}
            nextUrl={nextUrl}
          />
          {group.map(
            ({
              node: {
                id,
                description,
                timeToRead,
                fields : {slug},
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
          <Pagination
            pathPrefix={pathPrefix}
            index={index}
            pageCount={pageCount}
            previousUrl={previousUrl}
            nextUrl={nextUrl}
          />
        </Row>
      </Container>
    </Layout>
  )
}
