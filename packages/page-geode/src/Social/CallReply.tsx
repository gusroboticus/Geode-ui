// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useContracts } from '../useContracts.js';
import { useCodes } from '../useCodes.js';
import { styled } from '@polkadot/react-components';
//import { Card } from '@polkadot/react-components';
import ContractsModal from './ContractsModal.js';

interface Props {
  className?: string;
  onClear?: () => void;
  messageId: string;
  fromAcct?: string;
  username?: string;
  postMessage: string;

}

function CallReply ({ className = '', messageId,fromAcct,username, postMessage }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();

  //todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
    //console.log(JSON.stringify(onClear));
  
    function MakeReplyPost(): JSX.Element {
    return(
        <div>
            <ContractsModal
              contracts={allContracts}
              updated={codeTrigger}
              initMessageIndex={12}
              messageId={messageId}
              fromAcct={fromAcct}
              username={username}
              postMessage={postMessage}   
            />                
        </div>
    )
}

  return (
    <StyledDiv className={className}>
        <MakeReplyPost />
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

export default React.memo(CallReply);


