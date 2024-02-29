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
  
export default function Profile ({ className = '' }: Props): React.ReactElement {
    const { t } = useTranslation();
    const [isNew, toggleNew] = useToggle();
    const [isLookUp, toggleLookUp] = useToggle();
    const [isSearch, toggleSearch] = useToggle();
    const [isByAccount, toggleByAccount] = useToggle();
    const [isByKeyword, toggleByKeyword] = useToggle();
    const refTitle: string[] = 
    [' Create your Profile. (Click again to close) ', 
     ' Update your account (Click again to close.)',
     ' Lookup an account and display its profile. (Click again to close) ', 
     ' Search for Profiles by Keyword or by Account. ',
     ' Search by Account, Enter Account Public Key below. (Click again to close) ',
     ' Search by Keyword, Enter a Keyword to search all available Public Profiles.'];
    const { allCodes, codeTrigger } = useCodes();
    const { allContracts } = useContracts();
    // todo
    console.log(allCodes);
    
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
            <Summary />
            <Card>
        {!isByKeyword && !isByAccount && !isLookUp && !isSearch && (
        <><Button
                icon={(isNew) ? 'minus' : 'plus'}
                label={t('Create Your Profile')}
                onClick={toggleNew}>
          </Button>
          </>
        )}
        {!isByKeyword && !isByAccount && !isNew && !isSearch && (
          <>
              <Button
                icon={(isLookUp) ? 'minus' : 'plus'}
                label={t('Account Lookup')}
                onClick={toggleLookUp}>
              </Button>    
          </>
        )}
        {!isByKeyword && !isByAccount && !isNew && !isLookUp && (
          <>
          <Button
            icon={(isSearch) ? 'minus' : 'plus'}
            label={t('Search')}
            onClick={toggleSearch}>
          </Button>    
          </>
        )}
        {isNew && (<>{refTitle[0]}</>)}
        {isLookUp && (<>{refTitle[2]}</>)}
        {isSearch && (<>{refTitle[3]}</>)}
        </Card>                     
        {isSearch && (
        <>
          <Card>
          {!isByKeyword && (
            <>
              <Button
                icon={(isByAccount) ? 'minus' : 'plus'}
                label={t('By Account')}
                onClick={toggleByAccount}>
              </Button>    
            </>
          )}
          {!isByAccount && (
            <>
            <Button
              icon={(isByKeyword) ? 'minus' : 'plus'}
              label={t('By Keyword')}
              onClick={toggleByKeyword}>
            </Button>    
            </>
          )}
          {isByAccount && (<>{refTitle[4]}</>)}
          {isByKeyword && (<>{refTitle[5]}</>)}
          </Card>
        </>
        )}
        </Table>
        {isNew && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={0}
        />)}
        {isLookUp && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={2}
        />)}
        {isByAccount && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={4}
        />)}
        {isByKeyword && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={3}
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
