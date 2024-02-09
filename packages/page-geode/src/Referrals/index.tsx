// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { styled, Card, Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { useCodes } from '../useCodes.js';
import { useContracts } from '../useContracts.js';
import ContractsTable from './ContractsTable.js';
import Summary from './Summary.js';

interface Props {
    className?: string;
  }
  
export default function Referrals ({ className = '' }: Props): React.ReactElement {
    const { t } = useTranslation();
    const [isBrowse, toggleBrowse] = useToggle();
    const [isMyPrograms, toggleMyPrograms] = useToggle();
    const [isMyReferrals, toggleMyReferrals] = useToggle();
    const refTitle: string[] = 
    [' Browse Available Referral Programs (Click again to close) ', 
     ' Create and Manage Your Referral Programs (Click again to close) ', 
     ' Review your current Referral Program Activity (Click again to close) '];
    const { allCodes, codeTrigger } = useCodes();
    const { allContracts } = useContracts();
    // todo
    console.log(allCodes);

    const deployApp: boolean = true;
    
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
            <Summary />
            <Card>
        {!deployApp && (<><strong>{'Coming Soon!'}</strong></>)}
        {deployApp && (
        <>
          <Button
                icon={(isBrowse) ? 'minus' : 'plus'}
                label={t('Browse')}
                onClick={toggleBrowse}
                isDisabled={(isMyReferrals || isMyPrograms)}>
          </Button>
          </>
        )}
        {deployApp &&  (
          <>
              <Button
                icon={(isMyPrograms) ? 'minus' : 'plus'}
                label={t('My Programs')}
                onClick={toggleMyPrograms}
                isDisabled={(isBrowse || isMyReferrals)}>
              </Button>    
          </>
        )}
        {deployApp &&  (
          <>
          <Button
            icon={(isMyReferrals) ? 'minus' : 'plus'}
            label={t('My Referrals & Payouts')}
            onClick={toggleMyReferrals}
            isDisabled={(isBrowse || isMyPrograms)}>
          </Button>    
          </>
        )}
        {isBrowse && (<>{refTitle[0]}</>)}
        {isMyPrograms && (<>{refTitle[1]}</>)}
        {isMyReferrals && (<>{refTitle[2]}</>)}
        </Card>                     
        </Table>
        {isBrowse && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={9}
        />)}
        {isMyPrograms && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={10}
        />)}
        {isMyReferrals && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={11}
        />)}

    </div>
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  .ui--Table td > article {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
`;
