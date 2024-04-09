// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify } from '@polkadot/util';
import { styled, Button, Card } from '@polkadot/react-components';
import { Message } from 'semantic-ui-react'
import { useToggle } from '@polkadot/react-hooks';
import CallSendMessage from './CallSendMessage.js';

interface Props {
    className?: string;
    isAccount?: boolean;
    outcome: CallResult;
    onClear?: () => void;
    onClose?: boolean;
  }

  type ProgramDetail = {
  ok: string[]
  }
  
function MyActivityDetails ({ className = '', onClear, onClose, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const PER_MINUTE = 1/60000;
    const isShowMeDetails = false;
    const [isPayOut, togglePayOut] = useToggle(false);
    const programDetail: ProgramDetail = Object.create(JSON.parse(stringify(output)));
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
      
      function CheckEligibility(): JSX.Element {
        return(<>
            <Message floating>
            {t_strong('Sorry! ')}
              {t('You are not eligible to get coin from the faucet at this time.')}<br /><br />
              {t('Minimum time between drips: ')}{+programDetail.ok[1]*PER_MINUTE}{t(' minutes')}<br />
              {t('Limit on Accounts per IP address: ')}{programDetail.ok[2]}{t(' Accounts')}<br />
            </Message>
        </>)
      }

      function GetCoin(): JSX.Element {
        return(<>
        {!isPayOut && <>
          <Message floating>
              {t_strong('Yes! ')}
              {t('Click this button to get coin: ')}<br /><br />
              <Button
                icon={(isPayOut) ? 'minus' : 'plus'}
                label={t('Get Coin!')}
                onClick={togglePayOut}
              >
              </Button>   
          </Message>
            </>}</>)
      }

      function ShowPrograms(): JSX.Element {
        try{
          return(
            <div>
                {+programDetail.ok[0]===1? <>{GetCoin()}</>: <>{CheckEligibility()}</> }
                {isShowMeDetails && <>
                      {programDetail.ok[0]}<br /> 
                      {programDetail.ok[1]}<br />
                      {programDetail.ok[2]}<br />
                      {programDetail.ok[3]}<br />
                      {'Faucet: '}{programDetail.ok[4]}<br />
                      {'Call from: '}{from}
                </>}
            </div>
        )
        } catch(e) {
          console.log(e);
          return(
            <div>
              {t('There is a problem.')}
            </div>
          )    
        } 
      }        

  return (
    <StyledDiv className={className}>
    <Card>
      <ShowPrograms />
      {isPayOut && (<>
        <Message floating content>
        {t_strong('Click (Get Started) to close this form.')}{' TIME: '}{when.toLocaleTimeString()}
        </Message> 
            <CallSendMessage
                callIndex={3}
                payAccount={from}
                callAccount={programDetail.ok[4]? programDetail.ok[4]: ''}
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
