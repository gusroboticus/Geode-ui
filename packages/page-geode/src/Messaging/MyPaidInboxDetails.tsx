// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Divider, Table, Label } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';
import AccountHeader from '../shared/AccountHeader.js';

import CallSendMessage from './CallSendMessage.js';


interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }

  type MessagesObj = {
    messageId: string,
    fromAcct: string,
    username: string,
    toListId: string,
    toListName: string,
    message: string,
    fileUrl: string,
    timestamp: number
  }

  type MyPaidInBoxObj = {
    blockedLists: string[],
    messages: MessagesObj[],
  }

  type MyPaidInBoxDetail = {
  ok: MyPaidInBoxObj
  }
  
function MyPaidInBoxDetails ({  className = '', onClear, 
                                outcome: { from, output, when } }: 
                                Props): React.ReactElement<Props> | null {

    //todo: code for unused params or remove!:
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));

    const { t } = useTranslation();
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const myPaidInBoxDetail: MyPaidInBoxDetail = Object.create(_Obj);

    const [_toListId, setListId] = useState('');
    const [_listname, setListname] = useState('');
    const [isBlock, setBlock] = useState(false);
    const [isUnBlock, setUnBlock] = useState(false);

    const [count, setCount] = useState(0);

    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    const _reset = useCallback(
      () => {setBlock(false);
             setUnBlock(false);
            },
      []
    )
    
    const _makeBlocked = useCallback(
      () => {setBlock(true);
             setUnBlock(false);
            },
      []
    )

    const _makeUnBlocked = useCallback(
      () => {setBlock(false);
             setUnBlock(true);
            },
      []
    )

    function hextoHuman(_hexIn: string): string {
      const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
      return(_Out)
    }
    
    function blockedLists(_acct: string): boolean {
      const _blocked: boolean = ((myPaidInBoxDetail.ok.blockedLists.length>0 ? myPaidInBoxDetail.ok.blockedLists : []).find(_blk => _blk === _acct))
       ? true : false
      return(_blocked)
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
              
                <Expander 
                    className='blockedlists'
                    isOpen={false}
                    summary={<Label size={'medium'} color={myPaidInBoxDetail.ok.blockedLists.length>0? 'orange': 'grey'} > 
                            {t(' Blocked Lists: ')}
                            {myPaidInBoxDetail.ok.blockedLists.length}</Label>}>
                        {myPaidInBoxDetail.ok.blockedLists.length>0 && 
                        myPaidInBoxDetail.ok.blockedLists.map((_blockedId)=> <>
                        <CopyInline value={_blockedId} label={''}/>
                        {_blockedId}
                        <LabelHelp help={t('Click UnBlock Button to Unblock this List.')}/>{' '}
                        <Label as='a' color='orange' size='small'
                        onClick={()=>{<>
                            {setListId(_blockedId)}
                            {setListname('')}
                            {setCount(count + 1)}
                            {_makeUnBlocked()}</>}}>
                        {t('Unblock')}</Label>
                        <br />
                        </>)}
                </Expander>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t(' You get paid for receiving these messages. ')} />
                <strong>{t(' PAID Inbox: ')}</strong></h3> 
          
                {myPaidInBoxDetail.ok.messages.length>0 && 
                  myPaidInBoxDetail.ok.messages.map((_messages)=> <>
                  {!blockedLists(_messages.toListId) && <>
                    
                    <h2><strong>{'@'}
                        {hextoHuman(_messages.toListName)}
                       </strong> {' '}{' '} 
                       <Label color='blue' size='mini'>{'Paid'}</Label>
                  </h2>
                  {_messages.message.length>0 && (<>
                    {' '}<LabelHelp help={t('List Id: ' + _messages.toListId)}/>
                         
                    {' '}<strong>{timeStampToDate(_messages.timestamp)}{' '}</strong><br />
                    <br />
                    <Expander 
                    className='message'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {'message ✉️'}</Label>}>
                      <h3>
                        <i>
                        <IdentityIcon value={_messages.fromAcct} />
                        {' @'}{hextoHuman(_messages.username)}
                        {' ('}<AccountName value={_messages.fromAcct} withSidebar={true}/>{') '}
                        </i>
                        <Label color='blue' pointing='left'>{hextoHuman(_messages.message)}</Label>
                        {(_messages.fileUrl != '0x') && (
                            <>
                            <LabelHelp help={t(isHex(_messages.fileUrl) ? withHttp(hexToString(_messages.fileUrl).trim()) : '')} />
                            <Label  as='a' color='orange' circular size={'mini'}
                                href={isHex(_messages.fileUrl) ? withHttp(hexToString(_messages.fileUrl).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                >{t('Link')}
                            </Label>{' '}
                            </>)} 
 
                      </h3>
                      <Label as='a' color='orange'
                      onClick={()=>{<>
                        {setListId(_messages.toListId)}
                        {setListname(_messages.toListName)}
                        {setCount(count + 1)}
                        {_makeBlocked()}</>}}>
                      {t('Block')}</Label>
                      <br />
                   </Expander>
                  </>)}
                  <Divider />
                  </>}
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
          <Card>{t('No Messages in your Paid InBox')}</Card>
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
        {isBlock && (<>
        <CallSendMessage
                callIndex={24}
                toAcct={_toListId}
                messageId={''}
                username={_listname}
                onReset={() => _reset()}
            />      
        </>)}
        {isUnBlock && (<>
        <CallSendMessage
                callIndex={25}
                toAcct={_toListId}
                messageId={''}
                username={''}
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
export default React.memo(MyPaidInBoxDetails);
