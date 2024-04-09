// Copyright 2017-2023 @blockandpurpose Home.tsx authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Segment, Grid, Image, Label } from 'semantic-ui-react';
import { styled, Card, CardSummary, SummaryBox, LabelHelp } from '@polkadot/react-components';
import { useTranslation } from '../shared/translate.js';
import { is_FAUCET_ON } from '@polkadot/react-components/modals/transferConst.js';


interface Props {
  className?: string;
}

export default function Home ({ className = ''}: Props): React.ReactElement {
const { t } = useTranslation();
const  icon_lifeandwork = 'http://geodechain.com/wp-content/uploads/2023/04/geode_app_icon_lifeandwork.png'
const  icon_market = 'http://geodechain.com/wp-content/uploads/2023/04/geode_app_icon_market.png';
const  icon_messaging = 'http://geodechain.com/wp-content/uploads/2023/04/geode_app_icon_messaging.png';
const  icon_private_exchange = 'http://geodechain.com/wp-content/uploads/2023/06/Geode-App-Icons.007.png';
const  icon_profile = 'http://geodechain.com/wp-content/uploads/2023/04/geode_app_icon_profile.png';
const  icon_referrals = 'http://geodechain.com/wp-content/uploads/2023/06/Geode-App-Icons.008.png';
const  icon_social = 'http://geodechain.com/wp-content/uploads/2023/04/geode_app_icon_social.png';
const  icon_sar = 'http://geodechain.com/wp-content/uploads/2023/04/geode_app_icon_sar.png';
const link_polkadot_extension_chrome = 'https://chromewebstore.google.com/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd?pli=1';
const link_polkadot_extension_firefox = 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/';
const make_an_account_youtube_video = 'https://www.youtube.com/watch?v=leIM-J7g3Vs';

const _help = [" Register your claims of expertise, work history, education/training, good deeds and original intellectual property to the Geode Blockchain. Endorse the authenticity of other users’ claims. Look up resumes by account. Search claims by keyword to discover people and their contributions to the world.",
" Set or update your Geode Profile, look up the profile for a specific account, and search profiles by keyword.",
" Buy and sell products and services on the Geode Market where there is no middleman taking a cut of your profits! Books, Music, NFTs, Clothing, Food, Services of all kinds, even Housing! Buy and sell all the things you need to live your best life right here on Geode.",
" Follow your favorite accounts and post your own public broadcast messages that cannot be deleted, altered or censored! While you are at it, isn't it time you got paid directly for your time and attention? Let people know what you are interested in seeing and let advertisers pay YOU directly to include their posts in your feed.",
" Private short form messaging between Geode accounts! While you are at it, isn't it time you got paid for your time and attention? Let people know what you are interested in seeing and let advertisers, recruiters, and others pay YOU directly to send DMs to your inbox.",
" Report Suspicious activity.",
" Buy GEODE coin to use the apps here in the ecosystem, to increase your voting power on community decisions, to stake yourself as a validator or nominator, and to buy and sell products and services on the network. The GEODE coin is NOT a currency, security, or an investment of any kind and should not be used for speculation.",
" Until GEODE is available on exchanges, you can buy it from people who already have it. This link allows you to buy GEODE directly from Sparticle Concepts LLC, the founders of Geode. This is a personal transaction between you and them. You can also buy GEODE coin from others on the network who are willing to sell. Discuss that directly with them.",
" ⚠️ IMPORTANT: By making a Geode account and using the applications, you certify that you are of legal age to enter into a contract in your locality.",
" ⚠️ IMPORTANT: You must use Chrome or Firefox for the Polkadot Extension. ",
" We recommend using Chrome with the Geode Blockchain Ecosystem. ",
" ",
" Just click Watch Video to start.  ",
" Buy and sell cryptocurrencies privately among the community. No escrow. List what you are selling and what you want for it. Message to finalized the deal and then handle transactions offline.  ",
" Use the Geode Faucet app to get a little coin to get you started on Geode dApps! Check your eligibility, then get some coin. 💰💰 ",
" Artists: link your songs and podcasts and get paid directly from your fans at rates FAR above centralized platforms. Fans: pay your favorite musicians and podcasters DIRECTLY as you enjoy your favorite playlists, podcasts and more! No more middleman. Just direct fan connections and real earning for artists. ",
];

const CardContainer = () => (
<>

  <Grid columns={3}>
    <Grid.Column height={5}>
      <Segment raised textAlign='center' vertical height={5}>
      <h2>{t('Step ')}
        <Label color='orange' circular size='huge'>1</Label></h2>
        <h2><strong>{t(' Get The Polkadot ')}<br />
                    {t(' Chrome Extension ')}</strong> 
        <LabelHelp help={t(_help[9]+' '+_help[10])} /> </h2>
        <br />

        <Label color='blue' size='large'
        href={link_polkadot_extension_chrome}
        target="_blank" 
        rel="noopener noreferrer">
        <h2>{t(' Chrome ')}</h2>
        </Label>
        {' '}
        <Label color='blue' size='large'
        href={link_polkadot_extension_firefox}
        target="_blank" 
        rel="noopener noreferrer">
        <h2>{t(' Firefox ')}</h2>
        </Label>

      </Segment>
    </Grid.Column>

    <Grid.Column height={5}>
    <Segment raised textAlign='center' vertical height={5}>
      <h2>{t('Step ')}
      <Label color='orange' circular size='huge'>2</Label></h2>
        <h2><strong>{t(' Make a ')}<br />
                    {t(' Geode Account ')}</strong> 
        <LabelHelp help={t(_help[11]+' '+_help[12]+' '+_help[8])} /></h2>
        <br />
        
        <Label as='a' color='blue'
          href={make_an_account_youtube_video}
          target="_blank" 
          rel="noopener noreferrer">
          <h2>{t('Watch Video')}</h2>
        </Label>
        
      </Segment>
    </Grid.Column>

    <Grid.Column height={5}>
    <Segment raised textAlign='center' vertical height={5}>
    <h2>{t('Step ')}
      <Label color='orange' circular size='huge'>3</Label></h2>
        <h2><strong>{t(' Get GEODE Coins ')} <br />
                    {t(' to Use in the Ecosystem ')}</strong> 
        <LabelHelp help={t(_help[6]+' '+_help[7])} /></h2>
        <br />
        <Label color='blue'
          as='a' 
          href='https://kathryncolleen.com/studio/geode-blockchain/'
          target="_blank" 
          rel="noopener noreferrer"
          >
            <h2>{t(' Buy GEODE ')}</h2>
          </Label>
          {is_FAUCET_ON && <>
            {' '}<strong><u>{t(' OR ')}</u></strong>{' '}
          <Label color='blue'
          as='a' 
          href='#/geode/referrals'
          target="_blank" 
          rel="noopener noreferrer"
          >
            <h2>{t(' Use Faucet ')}</h2>
          </Label> 
          
          </>}
          
          <br />
      </Segment>
    </Grid.Column>
  </Grid>
  </>
)

const LinkContainer = () => {
  return(
  <div>
    <Grid columns={6} textAlign={'left'}>
    <Grid.Row stretched >
      <Grid.Column width={1}>
        <Image src={icon_lifeandwork} size='tiny'
            href={'#/geode/lifeAndWork'}>
        </Image> 
      </Grid.Column >
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t('Life and Work')}</strong></h2>
        {_help[0]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_profile} size='tiny'
            href={'#/geode/profile'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t('Profile')}</strong></h2>
        {_help[1]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_social} size='tiny'
            href={'#/geode/social'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t('Social')}</strong></h2>
        {_help[3]}
      </Grid.Column>

      </Grid.Row>
      <Grid.Row stretched>

      <Grid.Column width={1}>
      <Image src={icon_messaging} size='tiny'
            href={'#/geode/messaging'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t('Messaging')}</strong></h2>
        {_help[4]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_market} size='tiny'
            href={'#/geode/market'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t('Market')}</strong></h2>
        {_help[2]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_referrals} size='tiny'
            href={'#/geode/referrals'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={5}>
        <h2><strong>{t('Faucet')}</strong></h2>
        {_help[14]}
      </Grid.Column>
      </Grid.Row>

      <Grid.Row stretched>
      <Grid.Column width={1}>
      <Image src={icon_private_exchange} size='tiny'
            href={'#/geode/privateexchange'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={4}>
        <h2><strong>{t('Private Exchange')}</strong></h2>
        {_help[13]}
      </Grid.Column>

      <Grid.Column width={1}>
      <Image src={icon_sar} size='tiny'
            href={'#/geode/reporting'}>
        </Image> 
      </Grid.Column>
      <Grid.Column verticalAlign={'top'} textAlign={'left'} width={5}>
        <h2><strong>{t('Reporting')}</strong></h2>
        {_help[5]}
      </Grid.Column>

      </Grid.Row>
    </Grid>
    </div>
  )
}

const ButtonContainer = () => {
  return(
    <div>
      <Label as='a' color='orange' size='huge'
          href={'https://geodechain.com/announcements/'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t(' Announcements ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          href={'https://discord.com/invite/ryMvuWMnbt'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t(' Discord ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          href={'http://geodechain.com/'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t(' Help & Info ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          href={'http://geodechain.com/wp-content/uploads/2023/04/Geode-Blockchain-Whitepaper-V2023_03_20.pdf'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t(' Whitepaper ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          href={'http://geodechain.com/tos/'}
          target="_blank"
          rel="noopener noreferrer"
          >
          <h2>{t(' TOS ')}</h2>
      </Label>
      <Label as='a' color='orange' size='huge'
          href={'https://github.com/geodechain'}
          target="_blank" 
          rel="noopener noreferrer"
          >
          <h2>{t(' GitHub ')}</h2>
      </Label>
    </div>
  )
}

  return (
    <StyledDiv className={className}>
      <div>
      <SummaryBox>        
        <CardSummary label={''}>
          {t(' Welcome to Geode! - Getting Started ')}
        </CardSummary> 
      </SummaryBox>
      <Card>
        <CardContainer />
      </Card>
      <SummaryBox>        
        <CardSummary label={''}>
          {t(' Geode Ecosystem ')}
        </CardSummary> 
      </SummaryBox>
      <Card>
        <LinkContainer/>
      </Card>
      <SummaryBox>        
        <CardSummary label={''}>
          {t(' Useful Links ')}
        </CardSummary> 
      </SummaryBox>
      <Card>
        <ButtonContainer />
      </Card>
      </div>
    </StyledDiv>

  );
}

const StyledDiv = styled.div`
  align-items: center;
  display: flex;

  .output {
    flex: 1 1;
    margin: 0.25rem 0.5rem;
  }
`;
