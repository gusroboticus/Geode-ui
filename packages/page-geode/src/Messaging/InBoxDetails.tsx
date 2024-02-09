// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Badge, Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Divider, Table, Label } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { useToggle } from '@polkadot/react-hooks';
import CallSendMessage from './CallSendMessage.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type ConversationObj = {
    messageId: string,
    fromAcct: string,
    fromUsername: string,
    toAcct: string,
    message: string,
    fileHash: string,
    fileUrl: string,
    timestamp: number
  }

  type List_messagesObj = {
    messageId: string,
    fromAcct: string,
    username: string,
    toListId: string,
    toListName: string,
    message: string,
    fileHash: string,
    fileUrl: string,
    timestamp: number
  }

  type PeopleObj = {
    allowedAccount: string,
    username: string,
    conversation: ConversationObj[]
  }
  
  type GroupObj = {
    allowedList: string,
    listName: string,
    listMessages: List_messagesObj[]
  }

  type ListsObj = {
    allowedList: string,
    listName: string,
    listMessages: List_messagesObj[]
  }

  type InBoxObj = {
    blockedAccts: string[],
    people: PeopleObj[],
    groups: GroupObj[],
    lists: ListsObj[]
  }

  type InBoxDetail = {
  ok: InBoxObj
  }
  
function InBoxDetails ({  className = '', onClear, 
                          outcome: { from, output, when } }: 
                          Props): React.ReactElement<Props> | null {
    //todo: code for unused params or remove!:
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));

    const { t } = useTranslation();

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const inBoxDetail: InBoxDetail = Object.create(_Obj);

    const [_toAcct, setToAcct] = useState('');
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [isMessage, setMessage] = useState(false);
    const [isStartConversation, toggleStartConversation] = useToggle(false);
    const [isDelete, setDelete] = useState(false);
    const [isGroupMsg, setGroupMsg] = useState(false);

    const [count, setCount] = useState(0);
    const [countInbox, setCountInbox] = useState(0);
    const [countLists, setCountLists] = useState(0);
    const [countGroups, setCountGroups] = useState(0);

    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    const _reset = useCallback(
      () => {setMessage(false);
             setDelete(false);
             setGroupMsg(false);
            },
      []
    )
    
    const _makeMessage = useCallback(
      () => {setMessage(true);
             setDelete(false);
             setGroupMsg(false);
            },
      []
    )

    const _makeDeleteMsg = useCallback(
      () => {setMessage(false);
             setDelete(true);
             setGroupMsg(false);
            },
      []
    )
    const _makeGroupMsg = useCallback(
      () => {setMessage(false);
             setDelete(false);
             setGroupMsg(true);
            },
      []
    )

    function hextoHuman(_hexIn: string): string {
      const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
      return(_Out)
    }
    
    function timeStampToDate(tstamp: number): JSX.Element {
      try {
       const event = new Date(tstamp);
       return (
            <><i>{event.toDateString()}{' '}
                 {event.toLocaleTimeString()}{' '}</i></>
        )
      } catch(error) {
       console.error(error)
       return(
           <><i>{t('No Date')}</i></>
       )
      }
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
                  icon={'plus'}
                  label={t(' Start Conversation ')}
                  onClick={()=> {<>
                                  {toggleStartConversation()}
                                  {_reset()}</>}}/>
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}  

function GetMessages(): JSX.Element {
      try {

        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t(' Total InBox: ')}{countInbox}{' '}
                {t(' Total Lists: ')}{countLists}{' '}
                {t(' Total Groups: ')}{countGroups}{' '}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t(' This is your Inbox. Send messages to people directly by clicking on the blue envelop icon. ')} />
                <strong>{t(' People: ')}</strong>
                <Label circular color='blue' size='small'>{countInbox}</Label>
                </h2> 
          
                {inBoxDetail.ok.people.length>0 && 
                  inBoxDetail.ok.people
                    // filter out all empty conversations
                  .filter(_sub => _sub.conversation.length>0)
                  .map((_people, inbox: number)=> <>

                  <h2><strong>{'@'}{hextoHuman(_people.username)}</strong>
                  {' ('}<AccountName value={_people.allowedAccount} withSidebar={true}/>{') '}
                  <Badge icon='envelope' color={'blue'}
                                  onClick={()=>{<>
                                  {setToAcct(_people.allowedAccount)}
                                  {setCount(count + 1)}
                                  {_makeMessage()}</>}}/>                        
                  </h2>
                  {_people.conversation.length>0 && (<>
                    <Expander 
                    className='message'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {t('Messages ✉️')}</Label>}>
                  {_people.conversation.length>0 &&
                    _people.conversation
                      .sort((a, b) => b.timestamp - a.timestamp) //most recent on top
                      .map((_conversation) => <>
                      {timeStampToDate(_conversation.timestamp)}{' '}<br />
                      {_conversation.toAcct===from? (<>
                        <Label 
                          color='blue' textAlign='left' pointing= 'right'>
                          {hextoHuman(_conversation.message)}{' '}
                        </Label>
                        <IdentityIcon value={_conversation.fromAcct} />
                        {' ('}<AccountName value={_conversation.fromAcct} withSidebar={true}/>{') '}
                      </>): (<>
                        <IdentityIcon value={_conversation.fromAcct} />
                        {' ('}<AccountName value={_conversation.fromAcct} withSidebar={true}/>{') '}
                        <Label  color='grey' textAlign='left' pointing='left'>
                          {hextoHuman(_conversation.message)}{' '}
                        </Label>
                        <Label as='a' color='orange' circular size='mini'
                                onClick={()=>{<>
                                  {setMessageId(_conversation.messageId)}
                                  {setUsername(_conversation.message)}
                                  {setCount(count + 1)}
                                  {_makeDeleteMsg()}</>}}>
                          <strong>{'X'}</strong></Label>
                      </>)}
                      {(_conversation.fileUrl != '0x') && (
                      <>
                        <Label  as='a' color='orange' circular size={'mini'}
                        href={isHex(_conversation.fileUrl) ? withHttp(hexToString(_conversation.fileUrl).trim()) : ''} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >{t('Link')}
                        </Label>{' '}
                      </>)}                     
                      <br /><br />
                    </>)}
                   </Expander>
                   
                  {setCountInbox(inbox+1)}
                  </>)}
                  <Divider />
                </>)
                }
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t(' This is your subscribed Lists. ')} />
                <strong>{t(' Lists: ')}</strong>
                <Label circular color='blue' size='small'>{countLists}</Label>
                </h2> 
                {inBoxDetail.ok.lists.length>0 &&
                 inBoxDetail.ok.lists.map((_lists, index: number) =>
                <>
                  <h2>{_lists.listName && <>
                    <strong>{'@'}{hextoHuman(_lists.listName)}{' '}</strong></>}
                  
                  
                  </h2>  
                  {_lists.listMessages.length>0 && (<>
                    <Expander 
                    className='listMessage'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {'Messages ✉️'}</Label>}>
                    
                    {_lists.listMessages
                    .sort((a, b) => b.timestamp - a.timestamp) //most recent message at the top
                    .map((_message) => <>
                      {timeStampToDate(_message.timestamp)}<br />
                      <IdentityIcon value={_message.fromAcct} />
                      {' ('}<AccountName value={_message.fromAcct} withSidebar={true}/>{') '}
                      {hextoHuman(_message.username)}
                      <Label color='blue' textAlign='left' pointing='left'>
                          {hextoHuman(_message.message)}
                      </Label>
                      {(_message.fileUrl != '0x') && (
                      <>
                        <Label  as='a' color='orange' circular size={'mini'}
                        href={isHex(_message.fileUrl) ? withHttp(hexToString(_message.fileUrl).trim()) : ''} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >{t('Link')}
                        </Label>{' '}
                      </>)} <br /><br />
                    </>)}
                  </Expander>
                  
                  </>)}       
                  {setCountLists(index+1)}   
                  <Divider />         
                </>)
                }
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t(' These are your public and private Groups. Send a message to the Group by clicking the blue envelop icon. ')} />
                <strong>{t(' Groups: ')}</strong>
                <Label circular color='blue' size='small'>{countGroups}</Label>
                </h2> 
                {inBoxDetail.ok.groups.length>0 &&
                 inBoxDetail.ok.groups.map((_groups, index: number) =>
                <>
                  <h2>{_groups.listName && <>
                    <strong>{'@'}{hextoHuman(_groups.listName)}{' '}</strong></>}
                  
                    <Badge icon='envelope' color={'blue'}
                                  onClick={()=>{<>
                                  {setToAcct(_groups.allowedList)}
                                  {setUsername(_groups.listName)}
                                  {setCount(count + 1)}
                                  {_makeGroupMsg()}</>}}/>                  
                  
                  </h2>  
                  {_groups.listMessages.length>0 && (<>
                    <Expander 
                    className='listMessage'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {'Messages ✉️'}</Label>}>
                    
                    {_groups.listMessages
                      .sort((a, b) => b.timestamp - a.timestamp) //most recent at the top
                      .map((_message) => <>
                      {timeStampToDate(_message.timestamp)}<br />
                      <IdentityIcon value={_message.fromAcct} />
                      {' ('}<AccountName value={_message.fromAcct} withSidebar={true}/>{') '}
                      {hextoHuman(_message.username)}
                      <Label color='blue' textAlign='left' pointing='left'>
                          {hextoHuman(_message.message)}
                      </Label>
                      {(_message.fileUrl != '0x') && (
                      <>
                        <Label  as='a' color='orange' circular size={'mini'}
                        href={isHex(_message.fileUrl) ? withHttp(hexToString(_message.fileUrl).trim()) : ''} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >{t('Link')}
                        </Label>{' '}
                      </>)} <br /><br />
                    </>)}
                  </Expander>
                  
                  </>)}       
                  {setCountGroups(index+1)}   
                  <Divider />         
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
          <Card>{t('No Data in your InBox')}</Card>
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
      <GetMessages />
      {isMessage && (<>
        <CallSendMessage
                callIndex={1}
                toAcct={_toAcct}
                messageId={''}
                onReset={() => _reset()}
            />      
        </>)}
        {isStartConversation && (<>
        <CallSendMessage
                callIndex={1}
                messageId={''}
                toAcct={''}
                onReset={() => _reset()}
            />      
        </>)}
        {isDelete && (<>
        <CallSendMessage
                callIndex={7}
                toAcct={''}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isGroupMsg && (<>
        <CallSendMessage
                callIndex={2}
                toAcct={_toAcct}
                messageId={''}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
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
export default React.memo(InBoxDetails);
