import config from 'data/config'
import React from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import BuyMeACoffeeImage from '../../../assets/images/buymecoffee.webp'
import { BuyMeACoffee, Wrapper } from './styles'

export const SocialShare = ({ title, path, iconSize = 45 }) => (
  <>
    <BuyMeACoffee
      href="https://www.buymeacoffee.com/rahulpnath"
      target="_blank"
    >
      <img src={BuyMeACoffeeImage} alt="Buy Me A Coffee" />
    </BuyMeACoffee>
    <Wrapper>
      <RedditShareButton url={`${config.url}${path}`} title={title}>
        <RedditIcon round size={iconSize} />
      </RedditShareButton>
      <TwitterShareButton
        url={`${config.url}${path}`}
        title={`${title} via @rahulpnath`}
      >
        <TwitterIcon round size={iconSize} />
      </TwitterShareButton>
      <FacebookShareButton url={`${config.url}${path}`} quote={title}>
        <FacebookIcon round size={iconSize} />
      </FacebookShareButton>
      <LinkedinShareButton
        url={`${config.url}${path}`}
        title={title}
        description={title}
      >
        <LinkedinIcon round size={iconSize} />
      </LinkedinShareButton>
      <TelegramShareButton url={`${config.url}${path}`}>
        <TelegramIcon round size={iconSize} />
      </TelegramShareButton>
    </Wrapper>
  </>
)
