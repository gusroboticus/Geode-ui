// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled, Button, Card } from '@polkadot/react-components';
import { Message, Table } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { numBlueButton, paidMessageBox, idToShort, linker, timeStampToDate } from './MsgUtil.js';
import CallSendMessage from './CallSendMessage.js';


interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }

  type PaidMessagesObj = {
    messageId: string,
    fromAcct: string,
    fromUsername: string,
    toAcct: string,
    message: string,
    fileUrl: string,
    timestamp: number,
    bid: number
  }

  type MyPaidInBoxDetail = {
  ok: PaidMessagesObj[]
  }
  
function MyPaidInBoxDetails ({  className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {

    const { t } = useTranslation();
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function noop (): void {// do nothing
    }
    const myPaidInBoxDetail: MyPaidInBoxDetail = Object.create(JSON.parse(stringify(output)));
    const [isPaidMessage, setPaidMessage] = useState(false);
    const [isPayClear, setPayClear] = useState(false);

    const [count, setCount] = useState(0);

    const _reset = useCallback(
      () => {
             setPaidMessage(false);
             setPayClear(false);
            },
      []
    )

    const _makePaidMessage = useCallback(
      () => {
             setPaidMessage(true);
             setPayClear(false);
            },
      []
    )

    const _makePayClear = useCallback(
      () => {
             setPaidMessage(false);
             setPayClear(true);
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
                  icon={isPaidMessage? 'minus': 'plus'}
                  label={t(' Send a Paid Message')}
                  onClick={()=> {<>{_makePaidMessage()}</>}}
                />
              <Button
                  icon={isPaidMessage? 'minus': 'plus'}
                  label={t(' Pay & Clear My Inbox')}
                  onClick={()=> {<>{_makePayClear()}</>}}
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


          <Table.Row>
            <Table.Cell verticalAlign='top'>

            <h3><Button isCircular onClick={noop} icon='coins'/>{t_strong(' PAID Inbox: ')}{' '}{t(' Total Paid Messages: ')}{' '}
                {numBlueButton(count)}{' '}</h3> 
          
                {myPaidInBoxDetail.ok.length>0 && 
                  myPaidInBoxDetail.ok.map((_paid, index)=> <>
                  <Message floating content>
                  {timeStampToDate(_paid.timestamp)}<br />
                  {paidMessageBox(_paid.message, _paid.fromAcct, _paid.fromUsername, _paid.bid)}
                  {linker(_paid.fileUrl)}<br />
                  {t_strong('Message Id:')}{idToShort(_paid.messageId)}
                  </Message>
                  {setCount(index+1)}
                  </>)}
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
            callFrom={311}/>
      <ListAccount/>
      <GetMessages />
        {isPaidMessage && (<>
        <CallSendMessage
                callIndex={21}
                toAcct={from}
                messageId={''}
                username={''}
                onReset={() => _reset()}
            />      
        </>)}
        {isPayClear && (<>
        <CallSendMessage
                callIndex={39}
                toAcct={from}
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
