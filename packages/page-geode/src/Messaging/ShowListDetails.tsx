// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled,  Expander, Button, Card } from '@polkadot/react-components';
import { Message, Table, Label } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import { linker, userIdentity, listMessageBox, timeStampToDate } from './MsgUtil.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }

  type List_messagesObj = {
    messageId: string,
    fromAcct: string,
    username: string,
    toListId: string,
    toListName: string,
    message: string,
    fileUrl: string,
    timestamp: number
  }

  type ListsObj = {
    allowedList: string,
    listName: string,
    listMessages: List_messagesObj[]
  }

  type Lists = {
    lists: ListsObj[]
  }

  type InBoxDetail = {
  ok: Lists
  }
  
function ShowListDetails ({  className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {

    const { t } = useTranslation();
    const inBoxDetail: InBoxDetail = Object.create(JSON.parse(stringify(output)));
    const [countLists, setCountLists] = useState(0);
      // local helper functions
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function noop (): void {// do nothing
    }
 

function GetMessages(): JSX.Element {

      try {
        return(
          <div>
          <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><Button isCircular onClick={noop} icon='timeline'/>{t_strong(' Lists: ')}{' '}{t(' Total Number of Active Lists: ')}{' '}
            <Label circular color='blue' size='small'>{countLists}</Label>
           {' '}</h3> 
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
                {inBoxDetail.ok.lists.length>0 &&
                 inBoxDetail.ok.lists.map((_lists, index: number) =>
                <>
                  <h4>{_lists.listName && <>
                    {userIdentity(_lists.listName, _lists.allowedList)}</>}
                  </h4>  
                  
                  {_lists.listMessages.length>0 && (<>
                  <Message color='grey'>
                  <Expander 
                    className='listMessage'
                    isOpen={false}
                    summary={<Label size={'small'} color='orange' circular> {'Messages ✉️'}</Label>}>
                    {_lists.listMessages
                    .sort((a, b) => b.timestamp - a.timestamp) //most recent message at the top
                    .map((_message) => <>
                      {timeStampToDate(_message.timestamp)}<br />
                      {listMessageBox(_message.message, _message.fromAcct, _message.username)}
                      {(_message.fileUrl != '0x') && (<>{linker(_message.fileUrl)}</>)}
                      <br /><br />
                    </>)}
                  </Expander>
                  </Message>
                  {setCountLists(index+1)} 
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
          <Card>{t('No Data in your List InBox')}</Card>
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
            callFrom={35}/>
        <GetMessages />
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
export default React.memo(ShowListDetails);
