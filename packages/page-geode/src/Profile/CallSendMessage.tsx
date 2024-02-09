// Copyright 2017-2023 @blockandpurpose.com
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useContracts } from '../useContracts.js';
import { useCodes } from '../useCodes.js';
import { styled } from '@polkadot/react-components';
import ContractsModal from './ContractsModal.js';

interface Props {
  className?: string;
  myAccount?: string;
  displayName?: number;
  location?: number;
  tags?: number;
  bio?: number;
  photoUrl?: number;
  websiteUrl1?: number;
  websiteUrl2?: number;
  websiteUrl3?: number;
  lifeAndWork?: string;
  social?: string;
  privateMessage?: string;
  marketPlace?: string;
  moreInfo?: number;
  makePrivate?: boolean;
  onReset?: () => void;
  callIndex: number;
}

function CallSendMessage ({ className = '', myAccount, displayName, 
                            location, tags, bio, photoUrl, 
                            websiteUrl1, websiteUrl2, websiteUrl3, 
                            lifeAndWork, social, privateMessage,
                            marketPlace, moreInfo, makePrivate,
                            callIndex }: Props): React.ReactElement<Props> | null {
    const { allContracts } = useContracts();
    const { allCodes, codeTrigger } = useCodes();

//todo: code for allCodes:
    console.log(JSON.stringify(allCodes));
    //console.log(JSON.stringify(onReset));

    function SendMessage(): JSX.Element {
    return(
        <div>
              <ContractsModal
                myAccount={myAccount}
                displayName={displayName}
                location={location}
                tags={tags}
                bio={bio}
                photoUrl={photoUrl}
                websiteUrl1={websiteUrl1}
                websiteUrl2={websiteUrl2}
                websiteUrl3={websiteUrl3}
                lifeAndWork={lifeAndWork}
                social={social}
                privateMessage={privateMessage}
                marketPlace={marketPlace}
                moreInfo={moreInfo}
                makePrivate={makePrivate}
                contracts={allContracts}
                updated={codeTrigger}
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


