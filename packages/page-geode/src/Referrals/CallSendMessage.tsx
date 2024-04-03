// Copyright 2017-2023 @blockandpurpose.com
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useContracts } from '../useContracts.js';
import { useCodes } from '../useCodes.js';
import { styled, Card } from '@polkadot/react-components';
import ContractsTable from './ContractsTable.js';
import { Message } from 'semantic-ui-react';

interface Props {
  className?: string;
  callIndex: number;
  onReset?: () => void;
}

function CallSendMessage ({ className = '', callIndex }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();

//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));

    function SendMessage(): JSX.Element {
    return(
        <Card>
         
                  <Message floating>
                    <ContractsTable
                    contracts={allContracts}
                    updated={codeTrigger}
                    initMessageIndex={callIndex}
                  />
                  </Message>
               
        </Card>
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


