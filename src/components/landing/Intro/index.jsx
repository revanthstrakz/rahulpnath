import { SmallerContainer } from 'components/common'
import { Link } from 'gatsby'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import { Flex, MagicalButton, Wrapper } from './styles'

export const Intro = () => {
  const { theme } = useContext(ThemeContext)
  return (
    <Wrapper theme={theme} as={SmallerContainer}>
      <h1>I'm Rahul Nath</h1>
      <p>
        I am a programmer, blogger, speaker and enjoys running. Blogs are usually technical or about life in general.
      </p>
      <Flex>
        <MagicalButton as={Link} to="/about">
          About me
        </MagicalButton>
      </Flex>
    </Wrapper>
  )
}
