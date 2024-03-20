// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled, Button, Card } from '@polkadot/react-components';
import { Message, Table, Label } from 'semantic-ui-react';
import AccountHeader from '../shared/AccountHeader.js';
import { useToggle } from '@polkadot/react-hooks';
import { searchResults, hexToHuman, numBlueButton, idToShort } from './MsgUtil.js';
import CallSendMessage from './CallSendMessage.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
  type GroupObj = {
    groupId: string,
    groupName: string,
    description: string,
    subscribers: number 
  }

  type SearchObj = {
    search: string[],
    groups: GroupObj[]
  }

  type GroupsDetail = {
  ok: SearchObj
  }
  
function FindGroupsDetails ({ className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {

    const { t } = useTranslation();
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function noop (): void {// do nothing
    }

    const groupsDetail: GroupsDetail = Object.create(JSON.parse(stringify(output)));

    const [isMake, toggleMake] = useToggle(false);
    const [isSendGroup, setSendGroup] = useState(false);
    const [isleaveGroup, setLeaveGroup] = useState(false);

    const [_listId, setListId] = useState<string>('');
    const [_listName, setListName] = useState<string>('');

    const [count, setCount] = useState(0);
    const [groupCount, setGroupCount] = useState(0);

    const _reset = useCallback(
      () => { setSendGroup(false);
              setLeaveGroup(false);
            },
      []
    )

    const _sendGroup = useCallback(
        () => { setSendGroup(true);
                setLeaveGroup(false);
              },
        []
      )

      const _leaveGroup = useCallback(
        () => { setSendGroup(false);
                setLeaveGroup(true);
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
                  icon={isMake? 'minus': 'plus'}
                  label={t(' Make a Group')}
                  onClick={()=> {<>{toggleMake()}
                                   {_reset()}
                                   </>}}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}  
      
function GetGroups(): JSX.Element {
      try {

        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {searchResults(groupsDetail.ok.search)}        
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h3><Button isCircular onClick={noop} icon='people-group'/>{t_strong(' Groups: ')}{' '}{t(' Total Groups: ')}{' '}
            {numBlueButton(groupCount)}
            {' '}</h3> 
            
                {groupsDetail.ok.groups.length>0 &&  
                  groupsDetail.ok.groups.map((_groups, index: number)=> <>
                  
                  <Message floating content>
                  <h3><strong>{'@'}{hexToHuman(_groups.groupName)}</strong></h3>
                  {t_strong('Group ID: ')}
                  {idToShort(_groups.groupId)}<br />
                  {t_strong('Description: ')}
                  {hexToHuman(_groups.description)}<br />
                  </Message>

                  {setGroupCount(index+1)}
                  <Label color='orange' as='a'
                   onClick={()=>{<>
                        {setListId(_groups.groupId)}
                        {setListName(_groups.groupName)}
                        {setCount(count + 1)}
                        {_sendGroup()}</>}}>{t('Join this Group')}
                  </Label>
                  <Label color='orange' as='a'
                  onClick={()=>{<>
                        {setListId(_groups.groupId)}
                        {setListName(_groups.groupName)}
                        {setCount(count + 1)}
                        {_leaveGroup()}</>}}>{t('Leave Group')}
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
            callFrom={37}/>
      <ListAccount />
      {!isSendGroup && !isleaveGroup && isMake && (<>
        <CallSendMessage
                callIndex={9}
                messageId={_listId}
                onReset={() => _reset()}
            />      
        </>)}
      {!isleaveGroup && !isMake && isSendGroup && (<>
        <CallSendMessage
                callIndex={10}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      {isleaveGroup && !isMake && !isSendGroup && (<>
        <CallSendMessage
                callIndex={13}
                messageId={_listId}
                username={_listName}
                onReset={() => _reset()}
        />
      </>)}
      <GetGroups />
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
export default React.memo(FindGroupsDetails);
