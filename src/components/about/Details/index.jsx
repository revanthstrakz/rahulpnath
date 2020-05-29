import { Container } from 'components/common'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import { Text, Wrapper } from './styles'

export default () => {
  const { theme } = useContext(ThemeContext)
  const { AboutImage } = useStaticQuery(graphql`
  query AboutImageQuery {
    AboutImage: imageSharp(fluid: { originalName: { eq: "us.jpg" } }) {
      ...imageFields
    }
  }
`)
  return (
    <Wrapper as={Container}>
      <a href={AboutImage.fluid.src}>
            <Img fluid={AboutImage.fluid} alt="Rahul, Parvathy and Gautham at The Farm, Byron Bay" />
      </a>
      <br />
      <Text theme={theme}>
        Hey, it's Rahul. I am a software engineer, currently working in Brisbane, Australia. 
        Thank you for reading my blog and checking out more about me as a person. I am the guy (on the left) in the above picture and next to me is my wife Parvathy. 
        The little guy is my son Gautham. This picture was taken at <a href="https://thefarm.com.au/">The Farm, Byron Bay</a> during one
        of <a href="/blog/category/travelogue/">our weekend trips.</a>
        </Text>
        
        <Text theme={theme}>
        
        I currently work with 
        <a
          href="https://www.telstra.com.au/business-enterprise/services/telstra-purple"
          rel="noopener noreferrer" target="_blank"
        >
          {' '}
          Telstra Purple.
        </a>
      </Text>
      
      <Text theme={theme}>
        <strong>This blog and its contents are all opinions of my own.</strong>
      </Text>
      <Text theme={theme}>
        If you want to drop a mail, feel free to sent it to <a href="mailto:hello@rahulpnath.com?subject=Hello Rahul!">hello@rahulpnath.com</a>.
      </Text>
    </Wrapper>
  )
}
