// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { Container } from 'semantic-ui-react'

import type { ApiPromise } from '@polkadot/api';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { ContractLink } from '../shared/types.js';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Card, Table } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../shared/translate.js';
import ContractAdd from './Add.js';
import CallCard from './CallCard.js';
import CallModal from './CallModal.js';
import Contract from '../shared/Contract.js';
import { getContractForAddress } from '../shared/util.js';

// * * * * * * * * * * * * * * * * * * * * * * * *
// * uncomment for test configuration - - - - >  *
import JSONContractAddress from '../shared/geode_contracts_test.json';
// * uncomment for production chain - - - - - >  *
//import JSONContractAddress from '../shared/geode_contracts.json';
// * * * * * * * * * * * * * * * * * * * * * * * *

export interface Props {
  contracts: string[];
  updated: number;
  initMessageIndex: number;
  toAcct?: string;
  messageId: string;
  username?: string;
  onReset?: () => void;
}

interface Indexes {
  contractIndex: number;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome) => void;
}

function filterContracts (api: ApiPromise, keyringContracts: string[] = []): ContractPromise[] {
  return keyringContracts
    .map((address) => getContractForAddress(api, address.toString()))
    .filter((contract): contract is ContractPromise => !!contract);
}

function ContractsModal ({ contracts: keyringContracts, initMessageIndex, toAcct, messageId, username }: Props): React.ReactElement<Props> {
  const _initIndex: number = (initMessageIndex > -1) ? initMessageIndex: 0;
  let _initContractIndex: number = 0;
  const { t } = useTranslation();
  const { api } = useApi();
  const newBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);
  const [{ contractIndex, messageIndex, onCallResult }, setIndexes] = useState<Indexes>({ contractIndex: _initContractIndex, messageIndex: _initIndex });
  const [isCallOpen, setIsCallOpen] = useState(true);
  const [contractLinks, setContractLinks] = useState<Record<string, ContractLink[]>>({});
  console.log(contractIndex);

  const isTableOpen = false;
  const [isLoadContract, toggleIsLoad] = useToggle();
  // set to true to test contracts functionality
  const isTest: boolean = false;
  // set default after contract load to chain
  // for Private Messaging index === 3
  const contractAddress: string = (JSONContractAddress[4])? JSONContractAddress[4] :'5Cw4X12ZVo1tpxp1mFkAVgmacDJJfcUrdZjTj6tCryXBHLee';

  const headerRef = useRef<[string?, string?, number?][]>([
    [t('Add claims for Geode Market'), 'start'],
    [undefined, undefined, 3],
    [t('status'), 'start'],
    []
  ]);

  useEffect((): void => {
    if (newBlock) {
      const exts = newBlock.block.extrinsics
        .filter(({ method }) => api.tx.contracts.call.is(method))
        .map(({ args }): ContractLink | null => {
          const contractId = keyringContracts.find((a) => args[0].eq(a));
          if (!contractId) {
            return null;
          }
          return {
            blockHash: newBlock.block.header.hash.toHex(),
            blockNumber: formatNumber(newBlock.block.header.number),
            contractId
          };
        })
        .filter((value): value is ContractLink => !!value);

      exts.length && setContractLinks((links): Record<string, ContractLink[]> => {
        exts.forEach((value): void => {
          links[value.contractId] = [value].concat(links[value.contractId] || []).slice(0, 3);
        });

        return { ...links };
      });
    }
  }, [api, keyringContracts, newBlock]);

  const contracts = useMemo(
    () => filterContracts(api, keyringContracts),
    [api, keyringContracts]
  );

  const _onCall = useCallback(
    (contractIndex: number, messageIndex: number, onCallResult: (messageIndex: number, result?: ContractCallOutcome) => void): void => {
      setIndexes({ contractIndex, messageIndex, onCallResult });
      setIsCallOpen(true);
    },
    []
  );

  const _toggleCall = useCallback(
    () => <>
    {setIsCallOpen((isCallOpen) => !isCallOpen)}
    </>,
    []
  );

  const _setMessageIndex = useCallback(
    (messageIndex: number) => setIndexes((state) => ({ ...state, messageIndex })),
    []
  );

 const _initIndexIndex = ((contracts) ? contracts.findIndex( x => x.address.toString() === contractAddress ): 0);  
 const contract = contracts[_initIndexIndex] || null;

 return (
    <>
      {isTest && !contract && isLoadContract && (
        <ContractAdd 
            onClose={toggleIsLoad} 
            defaultAddress ={contractAddress}/>
      )}
      {isTest && contract && (
        <Card>
            {'Test Code here!'}
        </Card>)}

      {isTableOpen && <Table
        empty={t('No contracts available')}
        header={headerRef.current}
      >
        {contracts.map((contract, index): React.ReactNode => (
          <Contract
            contract={contract}
            index={index}
            key={contract.address.toString()}
            links={contractLinks[contract.address.toString()]}
            onCall={_onCall}
          />
        ))}
      </Table>}

      {(messageIndex===0  || messageIndex===1  || 
        messageIndex===2  || messageIndex===3  || 
        messageIndex===4  ||
        messageIndex===5  || messageIndex===6  ||
        messageIndex===7  || messageIndex===8  ||
        messageIndex===9  || messageIndex===10 ||
        messageIndex===11 ||
        messageIndex===12 || messageIndex===13 ||
        messageIndex===14 || messageIndex===15 ||
        messageIndex===16 || messageIndex===17 ||
        messageIndex===18 || messageIndex===19 || 
        messageIndex===20 ||
        messageIndex===21 ||
        messageIndex===22 || messageIndex===23 ||
        messageIndex===24 || messageIndex===25 ||
        messageIndex===27 || messageIndex===29 ||
        messageIndex===39 ) 
        && isCallOpen && contract &&(
      <CallModal 
        contract={contract}
        messageIndex={messageIndex}
        onCallResult={onCallResult}
        onChangeMessage={_setMessageIndex}
        toAcct={toAcct}
        messageId={messageId}
        username={username}
        onClose={_toggleCall}
      />
      )}
      {(messageIndex===99) && isCallOpen && contract &&(
        <Container>
            <CallCard 
                contract={contract}
                messageIndex={messageIndex}
                onChangeMessage={_setMessageIndex}
                onClose={_toggleCall}
          />
      </Container>
      )}
    </>
  );
}

export default React.memo(ContractsModal);


