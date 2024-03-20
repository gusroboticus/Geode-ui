// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled, Badge, Expander, Button, Card } from '@polkadot/react-components';
import { Message, Table, Label } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { useToggle } from '@polkadot/react-hooks';
import CallSendMessage from './CallSendMessage.js';
import { numBlueButton, linker, userIdentity, messageBox, timeStampToDate } from './MsgUtil.js';

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
    fileUrl: string,
    timestamp: number
  }

  type PeopleObj = {
    allowedAccount: string,
    username: string,
    conversation: ConversationObj[]
  }

  type InBoxDetail = {
  ok: PeopleObj[]
  }
  
function InBoxDetails ({  className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
 
    const { t } = useTranslation();
      // local helper functions
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function noop (): void {// do nothing
    }
    const inBoxDetail: InBoxDetail = Object.create(JSON.parse(stringify(output)));
    const [_toAcct, setToAcct] = useState('');
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [isMessage, setMessage] = useState(false);
    const [isStartConversation, toggleStartConversation] = useToggle(false);
    const [isDelete, setDelete] = useState(false);
   
    const [count, setCount] = useState(0);
    const [countInbox, setCountInbox] = useState(0);

    const _reset = useCallback(
      () => {setMessage(false);
             setDelete(false);
            },
      []
    )
    
    const _makeMessage = useCallback(
      () => {setMessage(true);
             setDelete(false);
            },
      []
    )

    const _makeDeleteMsg = useCallback(
      () => {setMessage(false);
             setDelete(true);
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
          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><Button isCircular onClick={noop} icon='people-group'/>{t_strong(' People: ')}{' '}{t(' Total Conversations: ')}{' '}
            {numBlueButton(countInbox)}
            {' '}</h3> 
                {inBoxDetail.ok.length>0 && 
                  inBoxDetail.ok
                    // filter out all empty conversations
                  .filter(_sub => _sub.conversation.length>0)
                  .map((_people, inbox: number)=> <>
                  <h4>
                  {userIdentity(_people.username, _people.allowedAccount)}
                  <Badge icon='envelope' color={'blue'}
                    onClick={()=>{<>
                    {setToAcct(_people.allowedAccount)}
                    {setCount(count + 1)}
                    {_makeMessage()}</>}}/>       
                  </h4>                
                                       
                  
                  {_people.conversation.length>0 && (<>
                    <Message color='grey'>
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
                        {(_conversation.fileUrl != '0x') && (<>{linker(_conversation.fileUrl)}</>)}
                        {messageBox(_conversation.message, _conversation.fromAcct, 'right')}
                         
                      </>): (<>
                        {messageBox(_conversation.message, _conversation.fromAcct, 'left')}
                        <Label as='a' color='orange' circular size='mini'
                                onClick={()=>{<>
                                  {setMessageId(_conversation.messageId)}
                                  {setUsername(_conversation.message)}
                                  {setCount(count + 1)}
                                  {_makeDeleteMsg()}</>}}>
                          <strong>{'X'}</strong></Label>
                          {(_conversation.fileUrl != '0x') && (<>{linker(_conversation.fileUrl)}</>)}
                      </>)}
                                          
                      <br /><br />
                    </>)}
                   </Expander>
                   </Message>
                      {setCountInbox(inbox+1)}
                  </>)}
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
            callFrom={31}/>
      <ListAccount />
      <GetMessages />
      {(isStartConversation || isMessage) && (<>
        <CallSendMessage
                callIndex={1}
                toAcct={_toAcct}
                messageId={''}
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
