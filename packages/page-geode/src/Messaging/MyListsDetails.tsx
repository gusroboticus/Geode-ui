// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Table, Label} from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { useToggle } from '@polkadot/react-hooks';

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
    listAccounts: string[]
  }

  type ListsDetail = {
  ok: ListsObj[]
  }
  
function MyListsDetails ({  className = '', onClear, 
                            outcome: { from, output, when } }: 
                            Props): React.ReactElement<Props> | null {
                              
    //todo: code for unused params or remove!:
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));

    const { t } = useTranslation();

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const listsDetail: ListsDetail = Object.create(_Obj);

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


    function hextoHuman(_hexIn: string): string {
      return((isHex(_hexIn))? t(hexToString(_hexIn).trim()): '')
    }
    
    function booltoPrivate(_bool: boolean): string {
      return(_bool? t('Private'): t('Public'))
    }

    function ListAccount(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon='times'
                  label={t(' Close ')}
                  onClick={onClear}
                />
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
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t(' Total Lists: ')} {listCount}               
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t(' Your Lists ')} />
                <strong>{t('Your Lists: ')}</strong></h3> 
                
                {listsDetail.ok.length>0 &&  
                  listsDetail.ok.map((_lists, index: number)=> <>
                  <h2><strong>{'@'}{hextoHuman(_lists.listName)}</strong>
                  {' ('}<AccountName value={_lists.owner} withSidebar={true}/>{') '}                      
                  </h2>
                  <strong>{t('List ID: ')}</strong>{}
                  {_lists.listId}<br />
                  <strong>{t('Description: ')}</strong>{}
                  {hextoHuman(_lists.description)}<br />
                  <strong>{t('List Type: ')}</strong>
                  {booltoPrivate(_lists.hideFromSearch)}
                  <br /><br />
                <Expander 
                    className='listAccounts'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {'Accounts'}</Label>}>
                    {_lists.listAccounts.length>0  &&
                       _lists.listAccounts.map(_listAccounts => <>
                       {_listAccounts}
                       <IdentityIcon value={_listAccounts} />
                       {' ('}<AccountName value={_listAccounts} withSidebar={true}/>{') '}
                    </>)}
                </Expander><br /><br />
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
            callFrom={2}/>
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
