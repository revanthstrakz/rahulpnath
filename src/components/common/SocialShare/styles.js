import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0 2rem 0;

  .SocialMediaShareButton {
    margin-right: 1rem;
    cursor: pointer;
  }

  .SocialMediaShareButton:last-child {
    margin-right: unset;
  }
`
export const BuyMeACoffee = styled.a`
  height: 45px;
  width: 191px;
  display: block;
`
