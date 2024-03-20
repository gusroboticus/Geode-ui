// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled, Button, Card } from '@polkadot/react-components';
import { Message, Table, Label } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { accountIdentity, hexToHuman, numBlueButton, idToShort } from './MsgUtil.js';
import CallSendMessage from './CallSendMessage.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type ListObj = {
    listId: string,
    owner: string,
    listName: string,
    description: string
  }

  type SubDetail = {
  ok: ListObj[];
  }
  
function SubListsDetails ({ className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    
    const { t } = useTranslation();
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function noop (): void {// do nothing
    }
    const subDetail: SubDetail = Object.create(JSON.parse(stringify(output)));

    const [isUnsubscribe, setUnsubscribe] = useState(false);
    const [_listId, setListId] = useState<string>('');
    const [_listName, setListName] = useState<string>('');

    const [count, setCount] = useState(0);
    const [listCount, setListCount] = useState(0);

    const _reset = useCallback(
      () => {setUnsubscribe(false);
            },
      []
    )

      const _unsubscribe = useCallback(
        () => {setUnsubscribe(true);
              },
        []
      )
      
function GetLists(): JSX.Element {
      try {

        return(
          <div>
          <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><Button isCircular onClick={noop} icon='address-card'/>{t_strong(' Your Subscribed Lists ')}{' '}{t(' Total Lists: ')}{' '}
            {numBlueButton(listCount)}
            {' '}</h3> 
                {subDetail.ok.length>0 &&  
                  subDetail.ok.map((_lists, index: number)=> <>

                  <Message floating content>
                  <h3><strong>{'@'}{hexToHuman(_lists.listName)}</strong></h3>
                  {t_strong('List Owner: ')}{accountIdentity(_lists.owner)}
                  {t_strong('List ID: ')}{idToShort(_lists.listId)}<br />
                  {t_strong('Description: ')}{hexToHuman(_lists.description)}<br />
                  </Message>

                {setListCount(index+1)}
                <Label color='orange' as='a'
                       onClick={()=>{<>
                         {setListId(_lists.listId)}
                         {setListName(_lists.listName)}
                         {setCount(count + 1)}
                         {_unsubscribe()}</>}}
                >{'Unsubscribe'}
                </Label>
                <br /><br />
                </>)
                }
            </Table.Cell>
          </Table.Row>
      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Data in your Subscribed Lists')}</Card>
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
            callFrom={310}/>
        {isUnsubscribe && (<>
        <CallSendMessage
                callIndex={20}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
            />      
        </>)}

      <GetLists />
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
export default React.memo(SubListsDetails);
