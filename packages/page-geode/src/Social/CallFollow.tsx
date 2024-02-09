// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { styled, Card } from '@polkadot/react-components';
import { useContracts } from '../useContracts.js';
import { useCodes } from '../useCodes.js';
import ContractsModal from './ContractsModal.js';

interface Props {
  className?: string;
  onClear?: () => void;
  messageId?: string;
  fromAcct?: string;
  username?: string;
  postMessage?: string;
}

function CallFollow ({ className = '', onClear, messageId, fromAcct, username, postMessage }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for unused params:
    console.log(JSON.stringify(allCodes));
    console.log(JSON.stringify(onClear));
    console.log(JSON.stringify(messageId));
    console.log(JSON.stringify(fromAcct));
    console.log(JSON.stringify(username));
    console.log(JSON.stringify(postMessage));

    function MakeAccountFollow(): JSX.Element {
    return(
        <div>
                <ContractsModal
                        contracts={allContracts}
                        updated={codeTrigger}
                        messageId={''}
                        postMessage={''}
                        initMessageIndex={4}
                    />                       
        </div>
    )
}

  return (
    <StyledDiv className={className}>
      <Card>
      <MakeAccountFollow />
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

export default React.memo(CallFollow);


