// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled, Button, Card } from '@polkadot/react-components';
import { Message, Table, Label} from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { accountIdentity, searchResults, hexToHuman, numBlueButton, idToShort, booltoPublic } from './MsgUtil.js';
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
    hideFromSearch: boolean,
    description: string,
    listAccounts: number
  }

  type SearchObj = {
    search: string[];
    lists: ListObj[];
  }

  type SearchDetail = {
  ok: SearchObj;
  }
  
function FindListsDetails ({  className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {

    const { t } = useTranslation();
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function noop (): void {// do nothing
    }
    const searchDetail: SearchDetail = Object.create(JSON.parse(stringify(output)));

    const [isJoinList, setJoinList] = useState(false);
    const [isUnsubscribe, setUnsubscribe] = useState(false);
    const [_listId, setListId] = useState<string>('');
    const [_listName, setListName] = useState<string>('');

    const [count, setCount] = useState(0);
    const [listCount, setListCount] = useState(0);

    const _reset = useCallback(
      () => {setJoinList(false);
             setUnsubscribe(false);
            },
      []
    )

    const _joinList = useCallback(
        () => {setJoinList(true);
               setUnsubscribe(false);
              },
        []
      )

      const _unsubscribe = useCallback(
        () => {setJoinList(false);
               setUnsubscribe(true);
              },
        []
      )
      
function GetLists(): JSX.Element {
      try {

        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
              {searchResults(searchDetail.ok.search)}        
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><Button isCircular onClick={noop} icon='people-group'/>{t_strong(' Lists ')}{' '}{t(' Total Lists: ')}{' '}
            {numBlueButton(listCount)}
            {' '}</h3> 
                {searchDetail.ok.lists.length>0 &&  
                  searchDetail.ok.lists.map((_lists, index: number)=> <>

                  <Message floating content>
                  <h3><strong>{'@'}{hexToHuman(_lists.listName)}</strong></h3>
                  {t_strong('List Owner: ')}{accountIdentity(_lists.owner)}
                  {t_strong('List ID: ')}{idToShort(_lists.listId)}<br />
                  {t_strong('Description: ')}{hexToHuman(_lists.description)}<br />
                  {t_strong('List Type: ')} {booltoPublic(_lists.hideFromSearch)}<br />
                  </Message>

                {setListCount(index+1)}
                <Label color='orange' as='a'
                       onClick={()=>{<>
                         {setListId(_lists.listId)}
                         {setListName(_lists.listName)}
                         {setCount(count + 1)}
                         {_joinList()}</>}}
                >{'Join List'}
                </Label>
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
          <Card>{t('Please refine your keyword search.')}</Card>
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
            callFrom={39}/>
      {!isUnsubscribe && isJoinList && (<>
        <CallSendMessage
                callIndex={19}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
            />      
        </>)}
        {isUnsubscribe && !isJoinList && (<>
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
export default React.memo(FindListsDetails);
