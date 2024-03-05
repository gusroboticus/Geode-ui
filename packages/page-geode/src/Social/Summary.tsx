// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Toggle, Badge, Card, CardSummary, SummaryBox, AccountName, LabelHelp, IdentityIcon } from '@polkadot/react-components';
import { useTranslation } from '../shared/translate.js';
import JSONinfo from '../shared/geode_social_info.json';
import { useToggle } from '@polkadot/react-hooks';
import { Grid } from 'semantic-ui-react'
import Accounts from '@polkadot/app-accounts/Accounts';
import Contacts from '@polkadot/app-addresses/Contacts';
import Events from '@polkadot/app-explorer/Events';
import { useBlockEvents } from '@polkadot/react-hooks';

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const info: string[] = JSONinfo;
  const [isShowMore, toggleShowMore] = useToggle(false)
  const [isShowAccounts, toggleShowAccounts] = useToggle(false);
  const [isShowAddresses, toggleShowAddresses] = useToggle(false);
  const [isShowEvents, toggleShowEvents] = useToggle(false);
  const { events } = useBlockEvents();

  function noop (): void {
    // do nothing
  }
  
  function showAccount(str: string): JSX.Element { 
   try{
    return(  <>
      {str.length>0 && (<>
        <IdentityIcon value={str} />
        {' ('}<AccountName value={str} withSidebar={true}/>{') '}
      </>)}
      </>
      )
   } catch(e) {
    console.log(e);
    return(<>
    {t('No accounts to show')}
    </>)
   }
  }

    return (
    <div>
    <SummaryBox>        
      <CardSummary label={''}>
        {t('Geode Social')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
    <Badge icon={'info'} color={'blue'}/> 
      {t(info[0]+info[1])}             
      <br /><br />
      <Grid columns={4} divided>
              <Grid.Row>
                <Grid.Column>
                <Toggle
                  className=''
                  label={t('Recommended Accounts ')}
                  onChange={toggleShowMore}
                  value={isShowMore}
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
      {isShowMore && (<>
        <LabelHelp help={t('Click on the Icon or Open the Side Car for Copying the Account Address.')} />
        {' '}{t(info[2])}{' '}
        {' '}{showAccount(info[3])}
        
      </>)}    
      {isShowAccounts && (<>
        <Accounts onStatusChange={noop} />
      </>)}    

      {isShowAddresses && (<>
        <Contacts onStatusChange={noop} />
      </>)}    
      {isShowEvents && (<>
        <Events events={events} />
        
      </>)} 
    </Card>
    </div>
  );
}

export default React.memo(Summary);
