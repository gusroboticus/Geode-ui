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

const StyledDiv = styled.div`
  .ui--Table td > article {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
`;

export default function Reporting ({ className = '' }: Props): React.ReactElement {
  const { t } = useTranslation();

  const [isViewAllListings, toggleViewAllListings] = useToggle();
  const [isViewMyListings, toggleViewMyListings] = useToggle();

  const refTitle: string[] = 
  [' See all commodity coins avialable for sale. ', 
   ' See my listings, edit and make new listings. ', 
  ];
  const { allCodes, codeTrigger } = useCodes();
  const { allContracts } = useContracts();
  console.log(allCodes);
  
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
          <Summary />
          <Card>
            {!isViewMyListings && (
            <><Button
                    icon={(isViewAllListings) ? 'minus' : 'plus'}
                    label={t('Browse Listings')}
                    onClick={toggleViewAllListings}>
              </Button>
              </>
            )}
            {!isViewAllListings && (
              <>
                  <Button
                    icon={(isViewMyListings) ? 'minus' : 'plus'}
                    label={t('View My Listings')}
                    onClick={toggleViewMyListings}>
                  </Button>    
              </>
            )}

            {isViewAllListings && (<>{refTitle[0]}</>)}
            {isViewMyListings && (<>{refTitle[1]}</>)}
 
          </Card>       
        </Table>

        {isViewAllListings && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={2}
        />)}
        {isViewMyListings && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={3}
        />)}

    </div>
    </StyledDiv>
  );
}

