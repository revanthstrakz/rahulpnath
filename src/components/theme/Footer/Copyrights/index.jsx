import gatsbyIcon from 'assets/footer/gatsby.svg'
import zeitIcon from 'assets/footer/zeit-black.svg'
import zeitWhiteIcon from 'assets/footer/zeit-white.svg'
import { GithubIcon, SmallerContainer } from 'components/common'
import { Link } from 'gatsby'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import { Item, Links, Wrapper } from './styles'

export default () => {
  const { theme } = useContext(ThemeContext)
  return (
    <Wrapper as={SmallerContainer} theme={theme}>
      <Links>
        ©{' '}
        <Item as={Link} to="/">
          Rahul Nath
        </Item>{' '}
        2016-{`${new Date().getFullYear()} `}
        Built with
        <a
          href="https://www.gatsbyjs.org"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Item src={gatsbyIcon} img alt="Gatssby js" />
        </a>
        Open sourced on
        <a
          href="https://github.com/rahulpnath/rahulpnath.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Item
            as={GithubIcon}
            img
            width="24"
            height="24"
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </a>
        and deployed on
        <a
          href="https://www.netlify.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Item
            src={theme === 'light' ? zeitIcon : zeitWhiteIcon}
            img
            css="width:24px;"
            alt="Netlify"
          />
        </a>
      </Links>
    </Wrapper>
  )
}
