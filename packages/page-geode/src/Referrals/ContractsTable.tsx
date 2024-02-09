// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { ContractLink } from '../shared/types.js';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Card, Button, Table} from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../shared/translate.js';
import ContractAdd from './Add.js';
import Contract from '../shared/Contract.js';

import CallCard from './CallCard.js';
import CallSubCard from './CallSubCard.js';
import CallModal from './CallModal.js';
import { getContractForAddress } from '../shared/util.js';

// uncomment for test configuration - - - - >
import JSONContractAddress from '../shared/geode_contracts_test.json';
// uncomment for production chain - - - - >
//import JSONContractAddress from '../shared/geode_contracts.json';

export interface Props {
  contracts: string[];
  updated: number;
  initMessageIndex: number;
  programID?: string;
  title?: string;
  description?: string;
  moreInfoLink?: string;
  photo?: string;
  firstLevelReward?: number;
  secondLevelReward?: number;
  maximumReward?: number;
  ownerApprovedRequired?: boolean;
  payInMinimum?: number;
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

function ContractsTable ({ contracts: keyringContracts, initMessageIndex, programID, title, description, moreInfoLink, photo, firstLevelReward, secondLevelReward, maximumReward, ownerApprovedRequired, payInMinimum }: Props): React.ReactElement<Props> {
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
  const _defaultAddress: string = '5HJjHKgw4hupcKizpwyLm5VAK23nm6qEGEaaRrHK9FGsMxj9';
  const contractAddress: string = (JSONContractAddress[6])? JSONContractAddress[6] :_defaultAddress;
  console.log(contractIndex);

  const headerRef = useRef<[string?, string?, number?][]>([
    [t('Geode Referral'), 'start'],
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
      { !contract && (
        <Card>
          {t('Load Geode Referral Contract')}
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
          {'Test code here!'}
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

      {isCallOpen && contract && 
      (messageIndex===0 || messageIndex===1 || 
       messageIndex===3 || messageIndex===4 || 
       messageIndex===5 || messageIndex===6) && (
        <CallModal
          programID={programID}
          title={title}
          description={description}
          moreInfoLink={moreInfoLink}
          photo={photo}
          firstLevelReward={firstLevelReward}
          secondLevelReward={secondLevelReward}
          maximumReward={maximumReward}
          ownerApprovedRequired={ownerApprovedRequired}
          payInMinimum={payInMinimum}
          contract={contract}
          messageIndex={messageIndex}
          onCallResult={onCallResult}
          onChangeMessage={_setMessageIndex}
          onClose={_toggleCall}
        />
      )}

      {isCallOpen && contract && 
      (messageIndex===9 || messageIndex===10 || messageIndex===11) && (
        <CallCard
          contract={contract}
          messageIndex={messageIndex}
          onCallResult={onCallResult}
          onChangeMessage={_setMessageIndex}
        />
      )}
      {isCallOpen && contract && 
      messageIndex===2 && (
        <CallSubCard
          contract={contract}
          messageIndex={messageIndex}
          //onCallResult={onCallResult}
          onChangeMessage={_setMessageIndex}
        />
      )}
    </>
  );
}

export default React.memo(ContractsTable);


