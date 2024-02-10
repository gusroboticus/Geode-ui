// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { ContractLink } from '../shared/types.js';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge, InputAddress, Card, Button, Table } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../shared/translate.js';
import ContractAdd from './Add.js';
import CallCard from './CallCard.js';
import CallModal from './CallModal.js';
import CallSubCard from './CallSubCard.js';
import Contract from '../shared/Contract.js';
import { getContractForAddress } from '../shared/util.js';

// * * * * * * * * * * * * * * * * * * * * * * * *
// * uncomment for test configuration - - - - >  *
// import JSONContractAddress from '../shared/geode_contracts_test.json';
// * uncomment for production chain - - - - - >  *
import JSONContractAddress from '../shared/geode_contracts.json';
// * * * * * * * * * * * * * * * * * * * * * * * *

export interface Props {
  contracts: string[];
  updated: number;
  initMessageIndex: number;
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

function ContractsTable ({ contracts: keyringContracts, initMessageIndex }: Props): React.ReactElement<Props> {
  const _initIndex: number = (initMessageIndex > -1) ? initMessageIndex: 0;
  let _initContractIndex: number = 0;
  const { t } = useTranslation();
  const { api } = useApi();
  const newBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);
  const [{ contractIndex, messageIndex, onCallResult }, setIndexes] = useState<Indexes>({ contractIndex: _initContractIndex, messageIndex: _initIndex });
  const [isCallOpen, setIsCallOpen] = useState(true);
  const [contractLinks, setContractLinks] = useState<Record<string, ContractLink[]>>({});
  
  const [isTableOpen, toggleTable] = useToggle();
  const [isLoadContract, toggleIsLoad] = useToggle();
  // set to true to test contracts functionality
  const isTest: boolean = false;
  // set default after contract load to chain
  // for Private Messaging index === 3
  const contractAddress: string = (JSONContractAddress[3])? JSONContractAddress[3] :'5Gun25WYTUoEE2YUHGH4bnbV3V314u8Gwkn2cTsaE8ALXNAv';

  const headerRef = useRef<[string?, string?, number?][]>([
    [t('Add claims for Geode Private Messaging'), 'start'],
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
          {t('Load Geode Private Messaging Contract')}
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
            {'(1) Default Geode Private Messaging Contract Address: '}{contractAddress}{' | '}
            {(contractAddress)?
            <Badge color='green' icon='thumbs-up'/> : 
            <Badge color='red' icon='x' />}<br />
            <InputAddress
              //help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
              label={t('contract to use')}
              type='contract'
              value={contractAddress}          
            />
            {'(2) Set Contract Address: '}{contract.address.toString()}{' | '}
            {(contract.address)?
            <Badge color='green' icon='thumbs-up'/> : 
            <Badge color='red' icon='x' />}<br />
            <InputAddress
              //help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
              label={t('contract to use')}
              type='contract'
              value={contract.address}
            />
            {'(3) Is API Loaded?: '}
            {(api)?
              <Badge color='green' icon='thumbs-up'/> : 
              <Badge color='red' icon='x' />}<br />
            {'API size: '}{JSON.stringify(api).length}<br /><br />
            {'(4) Is Geode Private Messaging Contract Loaded?: '}
            {(contract)?
              <Badge color='green' icon='thumbs-up'/> : 
              <Badge color='red' icon='x' />}<br />
            {'Profile contract size: '}{JSON.stringify(contract).length}<br />
            {'Contract Index: '}{contractIndex}<br /><br />
            {'(5) All Contracts Loaded?: '}
            {(contracts)?
              <Badge color='green' icon='thumbs-up'/> : 
              <Badge color='red' icon='x' />}<br />
            {'Profile contract size: '}{JSON.stringify(contracts).length}<br /><br />
            <Button
              icon={(isTableOpen) ? 'minus' : 'plus'}
              label={t('View Contracts')}
              onClick={toggleTable} 
            />
            <br />
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
      {(messageIndex===1) && isCallOpen && contract &&(
        <CallModal 
        contract={contract}
        messageIndex={messageIndex}
        onCallResult={onCallResult}
        onChangeMessage={_setMessageIndex}
        onClose={_toggleCall}

      />
      )}
      {(
        messageIndex===3  || messageIndex===4  ||
        messageIndex===5  || messageIndex===6  || 
        messageIndex===8  || messageIndex===22) && isCallOpen && contract && (
        <CallSubCard
          contract={contract}
          messageIndex={messageIndex}
          onChangeMessage={_setMessageIndex}
        />
      )}
      {(messageIndex===0  || messageIndex===10 ||
        messageIndex===13 ||
        messageIndex===26 || 
        messageIndex===27 || messageIndex===28 || 
        messageIndex===29 || messageIndex===30 ||
        messageIndex===31 || messageIndex===32 ||
        messageIndex===33 || messageIndex===36 ||
        messageIndex===35 || messageIndex===34 || 
        messageIndex===37 || messageIndex===38 ||
        messageIndex===39) 
        && isCallOpen && contract && (
        <CallCard
          contract={contract}
          messageIndex={messageIndex}
          onCallResult={onCallResult}
          onChangeMessage={_setMessageIndex}
        />
      )}
    </>
  );
}

export default React.memo(ContractsTable);


