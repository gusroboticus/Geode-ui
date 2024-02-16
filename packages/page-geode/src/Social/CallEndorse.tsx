// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useContracts } from '../useContracts.js';
import { useCodes } from '../useCodes.js';
import ContractsModal from './ContractsModal.js';
import { styled } from '@polkadot/react-components';

interface Props {
  className?: string;
  onClear?: () => void;
  isPost: boolean;
  messageId: string;
  fromAcct?: string;
  username?: string;
  postMessage: string;
}

function CallEndorse ({ className = '', isPost, messageId, fromAcct, username, postMessage }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
//    console.log(JSON.stringify(onClear));

    function MakePost(): JSX.Element {
    return(
        <div>
  
              {isPost? (<>
                <ContractsModal
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={2}
                        messageId={messageId}
                        fromAcct={fromAcct}
                        username={username}
                        postMessage={postMessage}   
                    />                       
              </>) : (<>
                <ContractsModal
                        contracts={allContracts}
                        updated={codeTrigger}
                        initMessageIndex={3}
                        messageId={messageId}
                        fromAcct={fromAcct}
                        username={username}
                        postMessage={postMessage}   
                    />                              
              </>)}
        </div>
    )
}

  return (
    <StyledDiv className={className}>
      <MakePost />
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

export default React.memo(CallEndorse);


