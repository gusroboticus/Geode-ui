// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../translate.js';
import type { CallResult } from '../shared/types.js';
//import styled from 'styled-components';
import { stringify } from '@polkadot/util';
import { useToggle } from '@polkadot/react-hooks';
import { Button, AccountName, IdentityIcon, Card, styled } from '@polkadot/react-components';
import { Table} from 'semantic-ui-react'
import CallSendMessage from './CallSendMessage.js';

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
  
function AllowedDetails ({ className = '', onClear, 
                           outcome: { output, when } 
                                    }: Props): React.ReactElement<Props> | null {
    //todo: code for unused params or remove!:
    // console.log(JSON.stringify(from));
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));

    const { t } = useTranslation();
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const allowBlockDetail: AllowBlockDetail = Object.create(_Obj);
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
                  icon='times'
                  label={t('Close')}
                  onClick={onClear}
                />
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
            <strong>{t('Allowed Accounts: ')}</strong><br />
            {allowBlockDetail.ok.allowedAccounts.map((_out) => 
            <>
              <IdentityIcon value={_out} />
              {' ('}<AccountName value={_out} withSidebar={true}/>{') '}
              {' '}{_out}{' '}<br />
            </>)}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
            <Table.Cell verticalAlign='top'>
            <strong>{t('Blocked Accounts: ')}</strong><br />
            {allowBlockDetail.ok.blockedAccounts.map((_out) => 
            <>
              <IdentityIcon value={_out} />
              {' ('}<AccountName value={_out} withSidebar={true}/>{') '}
              {' '}{_out}{' '}<br />
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
        <strong>{t('There are no allowewd or blocked accounts.')}</strong>
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
