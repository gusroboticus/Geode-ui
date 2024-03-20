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
import CallSendMessage from './CallSendMessage.js';
import { linker, userIdentity, listMessageBox, timeStampToDate} from './MsgUtil.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type ConversationObj = {
    messageId: string,
    fromAcct: string,
    username: string,
    toListId: string,
    toListName: string,
    message: string,
    fileUrl: string,
    timestamp: number
  }
  
  type GroupObj = {
    allowedList: string,
    listName: string,
    listMessages: ConversationObj[]
  }

  type InBoxDetail = {
  ok: GroupObj[]
  }
  
function ShowGroupDetails ({  className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {

    const { t } = useTranslation();
      // local helper functions
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function noop (): void {// do nothing
    }

    const inBoxDetail: InBoxDetail = Object.create(JSON.parse(stringify(output)));
    const [_toAcct, setToAcct] = useState('');
    const [_username, setUsername] = useState('');
    const [isGroupMsg, setGroupMsg] = useState(false);
    const [count, setCount] = useState(0);
    const [countGroups, setCountGroups] = useState(0);

    const _reset = useCallback(
      () => {
             setGroupMsg(false);
            },
      []
    )
    
    const _makeGroupMsg = useCallback(
      () => {
             setGroupMsg(true);
            },
      []
    )

function GetMessages(): JSX.Element {

      try {
        return(
          <div>
          <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><Button isCircular onClick={noop} icon='address-card'/>{t_strong(' Groups: ')}{' '}{t(' Total Number of Groups you follow: ')}{' '}
            <Label circular color='blue' size='small'>{countGroups}</Label>
           {' '}</h3> 
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
                {inBoxDetail.ok.length>0 &&
                 inBoxDetail.ok.map((_groups, index: number) =>
                <>
                  <h4>{_groups.listName && <>
                    {userIdentity(_groups.listName, _groups.allowedList)}</>}
                    
                    <Badge icon='envelope' color={'blue'}
                                  onClick={()=>{<>
                                  {setToAcct(_groups.allowedList)}
                                  {setUsername(_groups.listName)}
                                  {setCount(count + 1)}
                                  {_makeGroupMsg()}</>}}/>                  
                  
                  </h4>  
                  
                  {_groups.listMessages.length>0 && (<>
                    <Message color='grey'>
                    <Expander 
                    className='listMessage'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {'Messages ✉️'}</Label>}>
                    
                    {_groups.listMessages
                      .sort((a, b) => b.timestamp - a.timestamp) //most recent at the top
                      .map((_message) => <>

                      {timeStampToDate(_message.timestamp)}<br />
                      {listMessageBox(_message.message, _message.fromAcct, _message.username)}
                      {(_message.fileUrl != '0x') && (<>{linker(_message.fileUrl)}</>)}
                      <br /><br />
                    </>)}
                  </Expander>
                  </Message> 
                  {setCountGroups(index+1)}  
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
          <Card>{t('No Data in your Group InBox')}</Card>
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
            callFrom={34}/>
      <GetMessages />
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
export default React.memo(ShowGroupDetails);
