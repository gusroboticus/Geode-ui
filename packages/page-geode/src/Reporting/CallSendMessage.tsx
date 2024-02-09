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
  removeAccountID?: string;
  callIndex: number;
}

function CallSendMessage ({ className = '', removeAccountID, callIndex,
                          }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();

    //todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
    //console.log(JSON.stringify(onClear));

    function SendMessage(): JSX.Element {
    return(
        <div>
             <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                removeAccountID={removeAccountID}
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


