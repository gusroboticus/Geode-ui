// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Toggle, Badge, Card, CardSummary, SummaryBox, AccountName, LabelHelp, IdentityIcon } from '@polkadot/react-components';
import { useTranslation } from '../shared/translate.js';
import JSONinfo from '../shared/geode_referrals_info.json';
import { useToggle } from '@polkadot/react-hooks';


function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const info: string[] = JSONinfo;
  const [isShowMore, toggleShowMore] = useToggle(false)

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
        {t('Geode Referrals')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
    <Badge icon={'info'} color={'blue'}/> 
      <strong> {t('Info for Referrals')} </strong>
        {': '}{t(info[0]+info[1])}       
      <br /><br />

    <Toggle
            className=''
            label={t('Recommended Accounts ')}
            onChange={toggleShowMore}
            value={isShowMore}
          />
      {isShowMore && (<>
        <LabelHelp help={t('Click on the Icon or Open the Side Car for Copying the Account Address.')} />
        {' '}{t(info[2])}{' '}
        {' '}{showAccount(info[3])}
        {' '}{showAccount(info[4])}
      </>)}    
    </Card>
    </div>
  );
}

export default React.memo(Summary);
