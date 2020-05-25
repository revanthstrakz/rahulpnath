import React from 'react';
import { StyledTag } from './styles';

export const Tag = ({ tag, link }) => {
  const tagPrefix = '/blog/tag/';
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
    <StyledTag bg={'#00b6ff'} color={'#fff'} to={`${tagPrefix}${link}`}>
      {tag}
    </StyledTag>
  )
}
