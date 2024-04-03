// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Badge, Card, CardSummary, SummaryBox } from '@polkadot/react-components';
import { useTranslation } from '../shared/translate.js';
import JSONinfo from '../shared/geode_referrals_info.json';

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const info: string[] = JSONinfo;

    return (
    <div>
    <SummaryBox>        
      <CardSummary label={''}>
        {t('Geode Faucet')} 
      </CardSummary> 
    </SummaryBox>
    <Card> 
    <Badge icon={'info'} color={'blue'}/>{t(info[0])}{' '}{info[1]}
    </Card>
    </div>
  );
}

export default React.memo(Summary);
