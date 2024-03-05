// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled, Button, Card } from '@polkadot/react-components';
import { Table } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { numBadge, accountInfo, t_strong, paramtoAccount } from './SocialUtil.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
    onReset?: boolean;
  }
  
type FeedDetail = {
  ok: string[]
  }
  
function AccountFollowDetail ({ className = '', onClear, outcome: { from, output, params, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const feedDetail: FeedDetail = Object.create(JSON.parse(stringify(output)));
    const [count, setCount] = useState(0);

function ShowFeed(): JSX.Element {
      try {
        return(
          <div>
            <Table stretch>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                <Button
                  icon='times'
                  label={t('Close')}
                  onClick={onClear}
                />
                </Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top' >
              <h2> {t_strong('For Account: ')}</h2>
                {paramtoAccount(stringify(params))}
              <h2> {t_strong('Number of Accounts Followed: ')}{numBadge(count)}</h2>
                {feedDetail.ok.length>0 && feedDetail.ok
                    .map((_feed, index: number) =>
                    <>
                    {setCount(index+1)}
                    {accountInfo(_feed)} <br />
                    </>
                )}
             </Table.Cell>
            </Table.Row>
        </Table> 
      </div>)
          } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Account Follow Data')}</Card>
        </div>
      )
    }
}

    
  return (
    <StyledDiv className={className}>
    <Card>
      <AccountHeader fromAcct={from} timeDate={when} callFrom={99}/>
      <ShowFeed />
    </Card>
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
export default React.memo(AccountFollowDetail);


