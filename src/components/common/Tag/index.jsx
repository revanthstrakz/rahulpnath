import React from 'react'
import { StyledTag } from './styles'

export const Tag = ({ tag, link }) => {
  // const {
  //   tags: { edges },
  // } = useStaticQuery(graphql`
  //   query {
  //     tags: allTagsYaml {
  //       edges {
  //         node {
  //           title
  //           bg
  //           color
  //         }
  //       }
  //     }
  //   }
  // `)

  // const {
  //   node: { bg, color, title },
  // } = edges.find(({ node: { title } }) => title === tag)
  return (
    <StyledTag bg={'#263238'} color={'#fff'} to={link}>
      {tag}
    </StyledTag>
  )
}
