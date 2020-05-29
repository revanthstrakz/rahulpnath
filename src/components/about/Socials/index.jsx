import React, { useContext } from 'react'
import { ThemeContext } from 'providers/ThemeProvider'
import Social from './Social'
import Creative from './Creative'
import { Wrapper, Title } from './styles'

export default () => {
  const { theme } = useContext(ThemeContext)

  return (
    <Wrapper>
      <Title theme={theme}>Follow me!</Title>
      <Social theme={theme} />
      <Creative theme={theme} />
    </Wrapper>
  )
}
