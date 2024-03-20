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
import { useToggle } from '@polkadot/react-hooks';
import { idToShort, accountIdentity, booltoPublic, hexToHuman, numBlueButton } from './MsgUtil.js';
import CallSendMessage from './CallSendMessage.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type ListsObj = {
    listId: string,
    owner: string,
    listName: string,
    hideFromSearch: boolean,
    description: string,
    listAccounts: number
  }

  type ListsDetail = {
  ok: ListsObj[]
  }
  
function MyListsDetails ({  className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {

    const { t } = useTranslation();
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function noop (): void {// do nothing
    }
    const listsDetail: ListsDetail = Object.create(JSON.parse(stringify(output)));

    const [isMakeList, toggleMakeList] = useToggle(false);
    const [isDeleteList, setDeleteList] = useState(false);
    const [isSendMsg, setSendMsg] = useState(false);

    const [_listId, setListId] = useState<string>('');
    const [_listName, setListName] = useState<string>('');

    const [count, setCount] = useState(0);
    const [listCount, setListCount] = useState(0);

    const _reset = useCallback(
      () => {setDeleteList(false);
             setSendMsg(false);
            },
      []
    )

    const _deleteList = useCallback(
        () => {setDeleteList(true);
               setSendMsg(false);
              },
        []
      )

      const _sendList = useCallback(
        () => {setDeleteList(false);
               setSendMsg(true);
              },
        []
      )

    function ListAccount(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon={isMakeList? 'minus': 'plus'}
                  label={t(' Make a New List')}
                  onClick={()=> {<>{toggleMakeList()}
                                   {_reset()}
                                   </>}}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}  
      
function GetLists(): JSX.Element {
      try {
        return(
          <div>
          <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
                <h3><Button isCircular onClick={noop} icon='people-group'/>{t_strong(' Your Lists: ')}{' '}{t(' Total Lists: ')}{' '}
                {numBlueButton(listCount)}
                {' '}</h3> 
                {listsDetail.ok.length>0 &&  
                  listsDetail.ok.map((_lists, index: number)=> <>
                  <h3><strong>{'@'}{hexToHuman(_lists.listName)}</strong>                 
                  </h3>
                  <Message floating content>
                  {t_strong('List Owner: ')}
                  {accountIdentity(_lists.owner)}<br />
                  {t_strong('List ID: ')}
                  {idToShort(_lists.listId)}<br />
                  {t_strong('Description: ')}
                  {hexToHuman(_lists.description)}<br />
                  {t_strong('List Type: ')}
                  {booltoPublic(_lists.hideFromSearch)}<br />
                  {t_strong('Number of Accounts: ')}
                  {numBlueButton(_lists.listAccounts)}
                  <br />
                  </Message>
                {setListCount(index+1)}
                <Label color='orange' as='a'
                onClick={()=>{<>
                        {setListId(_lists.listId)}
                        {setListName(_lists.listName)}
                        {setCount(count + 1)}
                        {_sendList()}</>}}>{t('Send to List')}
                </Label>
                <Label color='orange' as='a'
                onClick={()=>{<>
                        {setListId(_lists.listId)}
                        {setListName(_lists.listName)}
                        {setCount(count + 1)}
                        {_deleteList()}</>}}>{t('Delete a List')}
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
          <Card>{t('No Data in your Lists')}</Card>
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
            callFrom={38}/>
      <ListAccount />
      {!isSendMsg && !isDeleteList && isMakeList && (<>
        <CallSendMessage
                callIndex={16}
                messageId={''}
                onReset={() => _reset()}
            />      
        </>)}
      {!isSendMsg && !isMakeList && isDeleteList && (<>
        <CallSendMessage
                callIndex={18}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      {isSendMsg && !isMakeList && !isDeleteList && (<>
        <CallSendMessage
                callIndex={15}
                toAcct={_listId}
                messageId={''}
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
export default React.memo(MyListsDetails);
