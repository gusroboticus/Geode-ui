// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Badge, Button, AccountName, IdentityIcon, Card } from '@polkadot/react-components';
import { Message, Grid, Table, Label, Image } from 'semantic-ui-react'
import { useToggle } from '@polkadot/react-hooks';
import CallSendMessage from './CallSendMessage.js';
import JSONInterest from '../shared/geode_social_interest.json'


interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    onClose: boolean;
  }

  type ProgramDetail = {
  ok: number[]
  }
  
function MyActivityDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    
    
    const { t } = useTranslation();
   

    const [isPayOut, togglePayOut] = useToggle(false);
    const programDetail: ProgramDetail = Object.create(JSON.parse(stringify(output)));
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    const _myInterest: string[] = JSONInterest;

 
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
      
      function CheckEligibility(): JSX.Element {
        return(<>
            <Message floating content={<>
              {t_strong('Sorry! ')}
              {t('You are not eligible to get coin from the faucet as this time.')}<br /><br />
              {t('Minimum time between drips: ')}{programDetail.ok[1]}{t(' blocks')}<br />
              {t('Limit on drips per IP address: ')}{programDetail.ok[2]}{t(' Limit')}<br />
            </>}/>
        </>)
      }

      function GetCoin(): JSX.Element {
        return(<>
            <Message floating content={<>
              {t_strong('Yes! ')}
              {t('Click this button to get coin: ')}<br /><br />
              <Button
                icon={(isPayOut) ? 'minus' : 'plus'}
                label={t('Get Coin!')}
                onClick={togglePayOut}
              >
              </Button>   
            </>}/>        
        </>)
      }

      function ShowPrograms(): JSX.Element {
        try{
          return(
            <div>
              <Table>
                <Table.Row>
                <Table.Cell verticalAlign='top'>
                {programDetail.ok[0]===1? <>{GetCoin()}</>: <>{CheckEligibility()}</> }
                {programDetail.ok[0]}<br /> 
                {programDetail.ok[1]}<br />
                {programDetail.ok[2]}<br />
                {_myInterest[17]}{_myInterest[23]}<br />
                </Table.Cell>
                </Table.Row>
              </Table>
            </div>
        )
        } catch(e) {
          console.log(e);
          return(
            <div>
              <Card>{t('There is a problem.')}</Card>
            </div>
          )    
        } 
      }        

  return (
    <StyledDiv className={className}>
    <Card>
      <ShowPrograms />
      {isPayOut && (<>
        <CallSendMessage
                callIndex={3}
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
export default React.memo(MyActivityDetails);
