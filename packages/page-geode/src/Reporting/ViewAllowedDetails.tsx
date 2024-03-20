// Copyright 2017-2023 @polkadot/app-reporting authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Button, AccountName, Card } from '@polkadot/react-components';
import { Table, Label } from 'semantic-ui-react'
import CallSendMessage from './CallSendMessage.js';
import { useToggle } from '@polkadot/react-hooks';
import { t_strong } from './ReportingUtil.js';

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: CallResult;
}

type EntityObj = {
  userAcct: string,
  name: string,
  organization: string,
  phone: string,
  email: string,
}

type EntityDetail = {
  ok: EntityObj[]
}



function ViewAllowedDetails ({ className = '', onClear, outcome: { output } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const objOutput: string = stringify(output);
  const _Obj = JSON.parse(objOutput);
  const entityDetail: EntityDetail = Object.create(_Obj);
  
  // useStates for one-click buttons, and any params they pass
  const [isRemoveDelegate, setRemoveDelegate] = useState(false);
  const [isRemoveEntity, setRemoveEntity] = useState(false);
  const [removeAccountID, setRemoveAccountID] = useState('');
  
  // useToggles for secondary buttons on this display
  const [isAddDelegate, toggleAddDelegate] = useToggle(false);
  const [isAddEntity, toggleAddEntity] = useToggle(false);

  const [count, setCount] = useState(0);
    
  const _reset = useCallback(
    () => {setRemoveDelegate(false);
           setRemoveEntity(false);
          },
    []
  )
  
  const _removeDelegate = useCallback(
    () => {setRemoveDelegate(true);
          setRemoveEntity(false);
          },
    []
  )

  function ShowSubMenus(): JSX.Element {
    return(
        <div>
          <Table>
            <Table.Row>
              <Table.Cell>
                <Button
                  icon={isAddDelegate? 'minus': 'plus'}
                  label={t('Add A Delegate')}
                  isDisabled={isAddEntity}
                  onClick={()=> {<>{toggleAddDelegate()}{_reset()}</>}}
                />
             </Table.Cell>
            </Table.Row>
          </Table>
        </div>
  )}

  function ShowEntities(): JSX.Element {
    try {
      return(
        <div>
        <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              <h3>{t_strong(' Geode Legal Team Delegates: ')}</h3>
              <br />
              {entityDetail.ok.map((_delegates) =>  
                <div>
                  {t_strong(' Name: ')}
                  {isHex(_delegates.name) ? hexToString(_delegates.name) : ' '}
                  <br />{t_strong(' Account: ')}
                  <><AccountName value={_delegates.userAcct} withSidebar={true}/></>
                  <br />{t_strong(' Organization: ')}
                  <>{isHex(_delegates.organization) ? hexToString(_delegates.organization) : ' '}</>
                  <br />{t_strong(' Phone: ')}
                  <>{isHex(_delegates.phone) ? hexToString(_delegates.phone) : ' '}</>
                  <br />{t_strong(' Email: ')}
                  <>{isHex(_delegates.email) ? hexToString(_delegates.email) : ' '}</>
                  <br />
                  <Label as='a' 
                        circular
                        color='orange'
                        onClick={()=>{<>
                          {setRemoveAccountID(_delegates.userAcct)}
                          {setCount(count + 1)}
                          {_removeDelegate()}</>}}
                        >{'Remove'}</Label>
                  <br /><br />
              </div>
              )} 
            </Table.Cell>
          </Table.Row>
        </Table>
        </div> 
      )

    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('Nothing To Show')}</Card>
        </div>
      )
    }
  }

  return (
    <StyledDiv className={className}>
    <Card>
      <ShowSubMenus />
      {isAddDelegate && !isAddEntity && !isRemoveDelegate && !isRemoveEntity &&  (
        <CallSendMessage
          callIndex={2}
          onClear={() => _reset()}
        />
      )}
      {!isAddDelegate && isAddEntity && !isRemoveDelegate && !isRemoveEntity &&  (
        <CallSendMessage
          callIndex={4}
          onClear={() => _reset()}
        />
      )}
      <ShowEntities />
      {!isAddDelegate && !isAddEntity && isRemoveDelegate && !isRemoveEntity && (
        <CallSendMessage 
          removeAccountID={removeAccountID}
          callIndex={3}
          onClear={() => _reset()}
        />
      )}
      {!isAddDelegate && !isAddEntity && !isRemoveDelegate && isRemoveEntity && (
        <CallSendMessage 
          removeAccountID={removeAccountID}
          callIndex={5}
          onClear={() => _reset()}
        />
      )}
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

export default React.memo(ViewAllowedDetails);
