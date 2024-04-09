// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Toggle, Badge, Card, CardSummary, SummaryBox, AccountName, LabelHelp, IdentityIcon } from '@polkadot/react-components';
import { useTranslation } from '../shared/translate.js';
import JSONinfo from '../shared/geode_referrals_info.json';
import { useToggle } from '@polkadot/react-hooks';
import { Grid, Label } from 'semantic-ui-react';
import Accounts from '@polkadot/app-accounts/Accounts';
import Contacts from '@polkadot/app-addresses/Contacts';
import Events from '@polkadot/app-explorer/Events';
import FaucetInfo from './FaucetInfo.js';
import { is_FAUCET_ON } from '@polkadot/react-components/modals/transferConst.js';
import { useBlockEvents } from '@polkadot/react-hooks';

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const info: string[] = JSONinfo;
//  const [isShowMore, toggleShowMore] = useToggle(false)
  const [isShowAccounts, toggleShowAccounts] = useToggle(is_FAUCET_ON);
  const [isShowAddresses, toggleShowAddresses] = useToggle(false);
  const [isShowEvents, toggleShowEvents] = useToggle(false);
  const [isShowFaucet, toggleShowFaucet] = useToggle(is_FAUCET_ON);
  const { events } = useBlockEvents();
  const link_polkadot_extension_chrome = 'https://chromewebstore.google.com/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd?pli=1';
  const link_polkadot_extension_firefox = 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/';
  function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

  function t_link(_str: string, title: string): JSX.Element{return(<>
    <Label color='orange' circular size='mini'
       as='a'
       href={_str}
       target="_blank" 
       rel="noopener noreferrer">
       {t(title)}
       </Label>
   </>)}
  function noop (): void {
    // do nothing
  }
  
  return (
    <div>
    <SummaryBox>        
      <CardSummary label={''}>
        {t('Geode Faucet')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
            <Badge icon={'info'} color={'blue'}/>{t(info[0])}{' '}{info[1]}{' '}
            {t_strong('FIRST: Get The Polkadot Extension - ')}
            {t('You MUST be on a laptop or desktop computer (mobile devices do not allow browser extensions). ')}
            {t('The Polkadot Extension lets you make and keep track of your Geode accounts safely and easily right on your device! Click on the right extension for your browser to install: ')}
            {t_link(link_polkadot_extension_chrome,  'Chrome')}
            {t_link(link_polkadot_extension_firefox, 'Firefox')}
            {t_strong(' SECOND: Create an Account - ')}
            {t('Authorize the extension if it asks. ')}
            {t('Make an account by clicking on the + sign in the extension. ')}
            {t('IMPORTANT: Make sure you keep your 12 word seed phrase and password safe! ')}
            
            <br /><br />
            <Grid columns={4} divided>
              <Grid.Row>
              <Grid.Column>
                <Toggle
                  className=''
                  label={t('Faucet Info ')}
                  onChange={toggleShowFaucet}
                  value={isShowFaucet}
                />
              </Grid.Column>
              <Grid.Column>
              <Toggle
                  className=''
                  label={t('My Accounts ')}
                  onChange={toggleShowAccounts}
                  value={isShowAccounts}
                />
              </Grid.Column>
              <Grid.Column>
              <Toggle
                  className=''
                  label={t('My Addresses ')}
                  onChange={toggleShowAddresses}
                  value={isShowAddresses}
                />
              </Grid.Column>
              <Grid.Column>
              <Toggle
                  className=''
                  label={t('Recent Events ')}
                  onChange={toggleShowEvents}
                  value={isShowEvents}
                />
              </Grid.Column> 
              </Grid.Row>
            </Grid>
      {isShowAccounts && (<>
        <Accounts onStatusChange={noop} />
      </>)}    
      {isShowAddresses && (<>
        <Contacts onStatusChange={noop} />
      </>)}    
      {isShowEvents && (<>
        <Events events={events} />
      </>)} 
      {isShowFaucet && (<>
        <FaucetInfo />
      </>)}
    </Card>
    </div>
  );
}

export default React.memo(Summary);
