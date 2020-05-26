import React from 'react';
import { StyledTag } from './styles';

export const Tag = ({ tag, link }) => {
  const tagPrefix = '/blog/category/';
  return (
    <StyledTag bg={'#358ccb'} color={'#fff'} to={`${tagPrefix}${link}`}>
      {tag}
    </StyledTag>
  )
}
