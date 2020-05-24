import { PageTitle, SocialShare, Tag } from 'components/common'
import Disqus from 'disqus-react'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import { ArticleDate, ArticleWrapper, Comments, Content, Tags } from './styles'

export const Post = ({ html, frontmatter, timeToRead }) => {
  const { theme } = useContext(ThemeContext)
  const disqusShortName = 'rahulpnath'
  const disqusConfig = {
    url: `https://rahulpnath  .com${frontmatter.path}`,
    identifier: frontmatter.id,
    title: frontmatter.title,
  }
  return (
    <ArticleWrapper theme={theme}>
      <PageTitle>{frontmatter.title}</PageTitle>
      <Tags>
        {frontmatter.tags.map((item, i) => (
          <Tag tag={item} link={`/${item}/`} key={i}>
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
