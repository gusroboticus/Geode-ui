// Copyright 2017-2023 @blockandpurpose.com
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
  claimId?: string;
  claimant?: string;
  claim?: string;
}

function Endorsements ({ className = '', claimId, claimant, claim }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
    //todo: code for unused params:
//    console.log(JSON.stringify(onClear));
    console.log(JSON.stringify(allCodes));

function MakeEndorsement(): JSX.Element {
    return(
        <div>
            
            <ContractsTable
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={5}
                        claimId={claimId}
                        claimant={claimant}
                        claim={claim}
                        showBool={true}
             />
        </div>
    )
}

  return (
    <StyledDiv className={className}>
    <>  
      <MakeEndorsement />
    </>
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

export default React.memo(Endorsements);


