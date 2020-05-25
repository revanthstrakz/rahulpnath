import { Layout, SEO } from 'components/common'
import { Intro, Popular, Skills, Work } from 'components/landing'
import React from 'react'

export default () => (
  <Layout>
    <SEO title="" type="Organization" />
    <Intro />
    <Work />
    <Skills />
    <Popular />
  </Layout>
)
