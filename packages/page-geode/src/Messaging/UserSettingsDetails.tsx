// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled, Button, Card } from '@polkadot/react-components';
import { Message, Table } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { paramToString, t_strong, accountIdentity, booltoPublic, timeStampToDate, BNtoGeode} from './MsgUtil.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
}

type SettingsObj = {
  userAccount: string,
  username: string,
  interests: string,
  inboxFee: number,
  hideFromSearch: boolean,
  lastUpdate: number
}

type SettingsDetail = {
  ok: SettingsObj
}
  
function UserSettingsDetails ({ className = '', outcome: { output, from, when } }: Props): React.ReactElement<Props> | null {
const { t } = useTranslation();
const settingsDetail: SettingsDetail = Object.create(JSON.parse(stringify(output)));
const MessageAccount = () => (<Message floating content={<>
      {t_strong('User Account: ')}{accountIdentity(settingsDetail.ok.userAccount)}</>} />)
const MessageUserSettings = () => (<Message floating content={<>
      {t_strong('User Name: ')}{(paramToString(settingsDetail.ok.username))}<br />
      {t_strong('Last Update: ')}{timeStampToDate(settingsDetail.ok.lastUpdate)}<br />
      {t_strong('Paid Inbox Fee: ')}{BNtoGeode(settingsDetail.ok.inboxFee)}{' Geode'}<br />
      {t_strong('Account Type: ')}{booltoPublic(settingsDetail.ok.hideFromSearch)}< br />
      {t_strong('Interests: ')}{paramToString(settingsDetail.ok.interests)}
      </>} />)
      
function noop (): void {
        // do nothing
      }

function ShowData(): JSX.Element {
      try {
        return(
        <div>
          <Table stretch>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <h2><Button isCircular onClick={noop} icon='building'/>{t_strong('Settings')}</h2>
                  <MessageAccount/>
                  <MessageUserSettings/>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Data in Settings')}</Card>
        </div>
      )
    }
}
  return (
    <StyledDiv className={className}>
      <Card>
        <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={32}/>
        <ShowData />
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
export default React.memo(UserSettingsDetails);
