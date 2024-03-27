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
import { numBadge, accountInfo, paramtoAccount } from './SocialUtil.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
    onReset?: boolean;
  }
  
type FeedDetail = {
  ok: string[]
  }
  
function AccountFollowDetail ({ className = '', outcome: { from, output, params, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    // function noop (): void {// do nothing
    // }

    const feedDetail: FeedDetail = Object.create(JSON.parse(stringify(output)));
    const [count, setCount] = useState(0);

function ShowFeed(): JSX.Element {
      try {
        return(
          <div>
            <Table stretch>
            <Table.Row>
              <Table.Cell verticalAlign='top' >
              <h3> {t_strong('Accounts Followed for: ')}<br />
                   {paramtoAccount(stringify(params))}</h3>
              <h3> {t_strong('Number of Accounts Followed: ')}{numBadge(count)}</h3>
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
      <AccountHeader fromAcct={from} timeDate={when} callFrom={201}/>
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


