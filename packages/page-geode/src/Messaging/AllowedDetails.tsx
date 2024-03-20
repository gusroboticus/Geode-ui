// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { useToggle } from '@polkadot/react-hooks';
import { Button, Card, styled } from '@polkadot/react-components';
import { Table} from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';
import { allowedAccounts } from './MsgUtil.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
    onClose?: () => void;
  }
  
  type AllowBlockObj = {
    allowedAccounts: string[],
    blockedAccounts: string[]
  }
  
  type AllowBlockDetail = {
  ok: AllowBlockObj
  }
  
function AllowedDetails ({ className = '', outcome: { output, when, from } }: Props): React.ReactElement<Props> | null {

    const { t } = useTranslation();
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

    const allowBlockDetail: AllowBlockDetail = Object.create(JSON.parse(stringify(output)));
    const [isAdd, toggleAdd] = useToggle(false);
    const [isBlock, toggleBlock] = useToggle(false);
    const [isDelete, toggleDelete] = useToggle(false);
    const [isRemove, toggleRemove] = useToggle(false);
    const [isUnBlock, toggleUnBlock] = useToggle(false);
        
    function ListAccount(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon={isAdd? 'minus': 'plus'}
                  label={t('Add')}
                  onClick={()=> {<>{toggleAdd()}</>}}
                  isDisabled={(isRemove || isBlock || isUnBlock || isDelete) }
                />
              <Button
                  icon={isRemove? 'minus': 'plus'}
                  label={t('Remove')}
                  onClick={()=> {<>{toggleRemove()}</>}}
                  isDisabled={(isAdd || isBlock || isUnBlock || isDelete) }
                />
              <Button
                  icon={isBlock? 'minus': 'plus'}
                  label={t('Block')}
                  onClick={()=> {<>{toggleBlock()}</>}}
                  isDisabled={(isRemove || isAdd || isUnBlock || isDelete) }
                />
              <Button
                  icon={isUnBlock? 'minus': 'plus'}
                  label={t('Unblock')}
                  onClick={()=> {<>{toggleUnBlock()}</>}}
                  isDisabled={(isRemove || isBlock || isAdd || isDelete) }
                />
              <Button
                  icon={isDelete? 'minus': 'plus'}
                  label={t('Delete Messages')}
                  onClick={()=> {<>{toggleDelete()}</>}}
                  isDisabled={(isRemove || isBlock || isUnBlock || isAdd) }
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}

function ShowAllowBlock(): JSX.Element {
try{
  return(
    <div>
      
      <div>
        <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
            {t_strong('Allowed Accounts: ')}<br />
            {allowBlockDetail.ok.allowedAccounts.map((_out) => 
            <>
              {allowedAccounts(_out)}
            </>)}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
            <Table.Cell verticalAlign='top'>
            {t_strong('Blocked Accounts: ')}<br />
            {allowBlockDetail.ok.blockedAccounts.map((_out) => 
            <>
              {allowedAccounts(_out)}
            </>)}
        </Table.Cell>
      </Table.Row>
      </Table>
      </div>   
</div>)
} catch(error) {
  console.error(error)
  return(
    <div>

    <Table>
      <Table.Row>
        <Table.Cell>
        <strong>{t('There are no allowed or blocked accounts.')}</strong>
        </Table.Cell>
        <Table.Cell>
        <strong>{t('Date/Time: ')}</strong>
          {' '}{when.toLocaleDateString()} 
          {' '}{when.toLocaleTimeString()} 
        </Table.Cell>
      </Table.Row>
    </Table>

    </div>
  )
}}

return (
    <StyledDiv className={className}>
    <Card>
    <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={33}/>
    <ListAccount />

    {isAdd && !isBlock && !isDelete && !isRemove && !isUnBlock &&(
      <CallSendMessage 
      messageId=''
      callIndex={3}
      />
      )}

    {!isAdd && isBlock && !isDelete && !isRemove && !isUnBlock &&(
      <CallSendMessage 
      messageId=''
      callIndex={5}
      />
      )}
    
    {!isAdd && !isBlock && isDelete && !isRemove && !isUnBlock &&(
      <CallSendMessage 
      messageId=''
      callIndex={8}
      />
      )}
      
    {!isAdd && !isBlock && !isDelete && isRemove && !isUnBlock &&(
      <CallSendMessage
      messageId=''
      callIndex={4}
      />
    )}

    {!isAdd && !isBlock && !isDelete && isUnBlock && !isRemove &&(
      <CallSendMessage
      messageId=''
      callIndex={6}
      />
    )}
    <ShowAllowBlock />
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
export default React.memo(AllowedDetails);
