import { Layout, SEO } from 'components/common'
import { Intro, Popular, Skills } from 'components/landing'
import React from 'react'

export default () => (
  <Layout>
    <SEO title="Hello world!" type="Organization" />
    <Intro />
    <Skills />
    <Popular />
  </Layout>
)
