import { Container } from 'components/common'
import { Link } from 'gatsby'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import Copyrights from './Copyrights'
import Social from './Social'
import { Brand, FooterContainer, FullContainer, List, Wrapper } from './styles'

export const Footer = () => {
  const { theme } = useContext(ThemeContext)

  return (
    <FooterContainer theme={theme}>
      <FullContainer>
        <Wrapper as={Container}>
          <List>
            <li>
              <Brand as={Link} to="/">
                {/* <StyledLogo as={Logo} color="#fff" strokeWidth="2" />  */}
                Rahul Nath
              </Brand>
            </li>
          </List>
          <List>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/blog/">Blog</Link>
            </li>
            <li>
              <a
                href="https://www.youtube.com/user/rahulnathp/"
                rel="noopener noreferrer"
                target="_blank"
              >
                YouTube
              </a>
            </li>
          </List>
          <List>
            <li>Follow me on</li>
            <Social />
          </List>
        </Wrapper>
      </FullContainer>
      <Copyrights />
    </FooterContainer>
  )
}
