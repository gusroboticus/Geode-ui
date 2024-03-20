// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useContracts } from '../useContracts.js';
import { useCodes } from '../useCodes.js';
import { styled } from '@polkadot/react-components';
import ContractsTable from './ContractsTable.js';

interface Props {
  className?: string;
  onClear?: () => void;
  passListingID?: string;
  passOfferCoin?: string;
  passAskingCoin?: string;
  passPrice?: number;
  passMethod?: string;
  passInventory?: number;
  passCountry?: string;
  passCity?: string;
  callIndex: number;
}

function CallSendMessage ({ className = '', passListingID, passOfferCoin, passAskingCoin, 
                          passPrice, passMethod, passInventory, passCountry, passCity,
                          callIndex,
                          }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();

    //todo: code for allCodes:
    console.log(JSON.stringify(allCodes));

    function SendMessage(): JSX.Element {
    return(
        <div>
             <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                passListingID={passListingID}
                passOfferCoin={passOfferCoin}
                passAskingCoin={passAskingCoin}
                passPrice={passPrice}
                passMethod={passMethod}
                passInventory={passInventory}
                passCountry={passCountry}
                passCity={passCity}
                initMessageIndex={callIndex}
             />
        </div>
    )
    }

  return (
    <StyledDiv className={className}>
      <SendMessage />
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

export default React.memo(CallSendMessage);


