// Copyright 2017-2023 @blockandpurpose.com
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { styled, Card, Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { useCodes } from '../useCodes.js';
import { useContracts } from '../useContracts.js';
import ContractsTable from './ContractsTable.js';
import ClaimType from './ClaimType.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
}

export default function LifeAndWork ({ className = '' }: Props): React.ReactElement {
const { t } = useTranslation();
const { allCodes, codeTrigger } = useCodes();
const { allContracts } = useContracts();
const [isClaimOpen, toggleClaim] = useToggle();
const [isResumeOpen, toggleResume] = useToggle();
const [isSearch, toggleSearch] = useToggle();

const refTitle: string[] = [' Display your Claims and make new Claims for Education, Expertise, Work History, Good Deeds and Intellectual Property ', ' Enter your claim data below. (Click again to close) ', ' Look up Resumes for specific accounts. (Click again to close) ', ' Search Claims by Keywords. Enter your search keyword below and select Read. (Click again to close) '];
// todo ---> allCodes
console.log(allCodes);

  return (
    <StyledDiv className={className}>

    <Summary  />

      <Card>
        {!isResumeOpen && !isSearch && (
        <><Button
                icon={(isClaimOpen) ? 'minus' : 'cogs'}
                label={t('Make a claim')}
                onClick={toggleClaim}>
          </Button></>
        )}
        {!isClaimOpen && !isSearch && (
          <>
              <Button
                icon={(isResumeOpen) ? 'minus' : 'people-group'}
                label={t('Get Resumes')}
                onClick={toggleResume}>
              </Button>    
          </>
        )}
        {!isClaimOpen && !isResumeOpen && (
          <>
          <Button
            icon={(isSearch) ? 'minus' : 'magnifying-glass'}
            label={t('Search')}
            onClick={toggleSearch}>
          </Button>    
          </>
        )}

        {isResumeOpen && (
          <>{t(refTitle[2])}</>
        )}
        {isClaimOpen && (
          <>{t(refTitle[1])}</>
        )}
        {!isClaimOpen && !isResumeOpen && !isSearch &&(
          <>{t(refTitle[0])}</>
        )}
        {isSearch && (
          <>{t(refTitle[3])}</>
        )}
      </Card>

    {isResumeOpen && (
    <ContractsTable
      contracts={allContracts}
      updated={codeTrigger}
      initMessageIndex={7}
    />)}
    {isClaimOpen && (
    <ClaimType />)}
    {isSearch && (
    <ContractsTable
      contracts={allContracts}
      updated={codeTrigger}
      initMessageIndex={10}
    />)}

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

