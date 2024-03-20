// Copyright 2017-2023 @polkadot/app-referrals authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { ContractLink } from './types.js';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Card, Button, Table } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../shared/translate.js';
import ContractAdd from './Add.js';
import CallCard from './CallCard.js';
import CallModal from './CallModal.js';
import Contract from './Contract.js';
import { getContractForAddress } from './util.js';

// uncomment for test configuration - - - - >
import JSONContractAddress from '../shared/geode_contracts_test.json';
// uncomment for production chain - - - - >
// import JSONContractAddress from '../shared/geode_contracts.json';

export interface Props {
  contracts: string[];
  updated: number;
  initMessageIndex: number;
  passListingID?: string;
  passOfferCoin?: string;
  passAskingCoin?: string;
  passPrice?: number;
  passMethod?: string;
  passInventory?: number;
  passCountry?: string;
  passCity?: string;
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

function ContractsTable ({  contracts: keyringContracts, initMessageIndex, 
                            passListingID, passOfferCoin, passAskingCoin, passPrice, passMethod, 
                            passInventory, passCountry, passCity
                          }: Props): React.ReactElement<Props> {
  const _initIndex: number = (initMessageIndex > -1) ? initMessageIndex: 0;
  let _initContractIndex: number = 0;
  const { t } = useTranslation();
  const { api } = useApi();
  const newBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);
  const [{ contractIndex, messageIndex, onCallResult }, setIndexes] = useState<Indexes>({ contractIndex: _initContractIndex, messageIndex: _initIndex });
  const [isCallOpen, setIsCallOpen] = useState(true);
  const [contractLinks, setContractLinks] = useState<Record<string, ContractLink[]>>({});
  
  const isTableOpen: boolean = false;
  const [isLoadContract, toggleIsLoad] = useToggle();
  // set to true to test contracts functionality
  const isTest: boolean = false;
  // set default after contract load to chain
  const contractAddress: string = (JSONContractAddress[5])? JSONContractAddress[5] :'5DX3kBiBhFEY5sTdxbppewVzE85wTNSs8AA6b78eforsDuac';
  console.log(contractIndex);

  const headerRef = useRef<[string?, string?, number?][]>([
    [t('Geode Private Exchange'), 'start'],
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
      {!contract && (
        <Card>
          {t('Load The Geode Private Exchange Smart Contract')}
          <Button
            icon={(isLoadContract) ? 'plus' : 'sign-in-alt'}
            label={t('Load')}
            onClick={toggleIsLoad} 
          />
        <br />
        </Card>
      )}
      {!contract && isLoadContract && (
        <ContractAdd 
            onClose={toggleIsLoad} 
            defaultAddress ={contractAddress}/>
      )}
      {isTest && contract && (
        <Card>
          {'Contract Test Code Here!'}
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
      
      {isCallOpen && contract 
                  && (messageIndex ===0 || messageIndex ===2 || messageIndex ===3)
                  && (
        <CallCard
          contract={contract}
          messageIndex={messageIndex}
          onCallResult={onCallResult}
          onChangeMessage={_setMessageIndex}
        />
      )}
      
      {isCallOpen && contract 
                  && messageIndex ===1
                  && (
        <CallModal
         contract={contract}
         messageIndex={messageIndex}
         onCallResult={onCallResult}
         onChangeMessage={_setMessageIndex}
         passListingID={passListingID}
         passOfferCoin={passOfferCoin}
         passAskingCoin={passAskingCoin}
         passPrice={passPrice}
         passMethod={passMethod}
         passInventory={passInventory}
         passCountry={passCountry}
         passCity={passCity}
         onClose={_toggleCall}
         />
      )
      }
    </>
  );
}

export default React.memo(ContractsTable);


