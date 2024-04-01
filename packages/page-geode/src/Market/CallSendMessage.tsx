// Copyright 2017-2023 @blockandpurpose.com
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useContracts } from '../useContracts.js';
import { useCodes } from '../useCodes.js';
import ContractsTable from './ContractsTable.js';
import ContractsModal from './ContractsModal.js';

interface Props {
  className?: string;
  onClear?: () => void;
  messageId: string;
  fromAcct?: string;
  toAcct?: string;
  username?: string;
  postMessage?: string;
  onReset?: () => void;
  callIndex: number;
}

function CallSendMessage ({ className = '',  messageId, toAcct, username, callIndex }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();
//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
    console.log(JSON.stringify(className));
// other props:
// onClear,
// fromAcct,
// postMessage
// onReset
    function SendMessage(): JSX.Element {
    return(
        <div>
          {(callIndex===0  || callIndex===1  || 
            callIndex===2  || callIndex===3  || 
            callIndex===4  || 
            callIndex===5  || callIndex===6  ||
            callIndex===7  || callIndex===8  ||
            callIndex===9  || callIndex===10 ||
            callIndex===11 ||
            callIndex===12 || callIndex===13 ||
            callIndex===14 || callIndex===15 ||
            callIndex===16 || callIndex===17 ||
            callIndex===18 || callIndex===20 ||
            callIndex===19 || callIndex===21 ||
            callIndex===22 || callIndex===23 ||
            callIndex===24 || callIndex===25 ||
            callIndex===27 || callIndex===29 ||
            callIndex===39 ) ? <>
            <ContractsModal
                toAcct={toAcct}
                messageId={messageId}
                username={username}
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={callIndex}
            />                                   
            </>: <>
            <ContractsTable
                contracts={allContracts}
                updated={codeTrigger}
                initMessageIndex={callIndex}
            />                                   
            </>}
        </div>
    )
}

  return (
    <>
      <SendMessage />
    </>
  );
}

// const StyledDiv = styled.div`
//   align-items: center;
//   display: flex;

//   .output {
//     flex: 1 1;
//     margin: 0.25rem 0.5rem;
//   }
// `;

export default React.memo(CallSendMessage);


