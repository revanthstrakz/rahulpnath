import { PageTitle, SocialShare, Tag } from 'components/common'
import Disqus from 'disqus-react'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import { ArticleDate, ArticleWrapper, Comments, Content, Tags } from './styles'

export const Post = ({ html, frontmatter, timeToRead, fields }) => {
  const { theme } = useContext(ThemeContext)
  const disqusShortName = 'rahulpnath'
  const postIdentifier = `https://rahulpnath.com${fields.slug}`
  const disqusConfig = {
    url: postIdentifier,
    identifier: postIdentifier,
    title: frontmatter.title,
  }
  return (
    <ArticleWrapper theme={theme}>
      <PageTitle>{frontmatter.title}</PageTitle>
      <Tags>
        {frontmatter.tags.map((item, i) => (
          <Tag tag={item} link={`/${item.replace(/\s+/g, '-')}/`} key={i}>
            {item}
          </Tag>
        ))}
      </Tags>
      <ArticleDate>
        <i>{frontmatter.date} -</i>
        <i>{timeToRead} min read</i>
      </ArticleDate>
      <Content dangerouslySetInnerHTML={{ __html: html }} />
      <SocialShare {...frontmatter} />
      <Comments>
        <Disqus.DiscussionEmbed
          shortname={disqusShortName}
          config={disqusConfig}
        />
      </Comments>
    </ArticleWrapper>
  )
}
