// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/LifeAndWork/CallCard.tsx
import { Input } from 'semantic-ui-react'
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from './types.js';

import React, { useCallback, useEffect, useState } from 'react';
import { styled, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import Details from './Details.js';
import { getCallMessageOptions } from './util.js';

interface Props {
  className?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function CallCard ({ className = '', contract, messageIndex, onCallResult, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
    //todo: code for unused params:
    console.log(JSON.stringify(className));

  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];
  const [accountId, setAccountId] = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [isViaCall, toggleViaCall] = useToggle();
  const [isCalled, toggleIsCalled] = useToggle(true);
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const isTest: boolean =false;
  
  useEffect((): void => {
    setEstimatedWeight(null);
    setEstimatedWeightV2(null);
    setParams([]);
  }, [contract, messageIndex]);

  useEffect((): void => {
    value && message.isMutating && setExecTx((): SubmittableExtrinsic<'promise'> | null => {
      try {
        return contract.tx[message.method](
          { gasLimit: weight.isWeightV2 ? weight.weightV2 : weight.weight, storageDepositLimit: null, value: message.isPayable ? value : 0 },
          ...params
        );
      } catch (error) {
        return null;
      }
    });
  }, [accountId, contract, message, value, weight, params]);

  useEffect((): void => {
    if (!accountId || !message || !dbParams || !dbValue) {
      return;
    }
    
  // contract v2 --
  contract
  .query[message.method](accountId, { gasLimit: -1, storageDepositLimit: null, value: message.isPayable ? dbValue : 0 }, ...dbParams)
  .then(({ gasRequired, result }) => {
    if (weight.isWeightV2) {
      setEstimatedWeightV2(
        result.isOk
          ? api.registry.createType('WeightV2', gasRequired)
          : null
      );
    } else {
      setEstimatedWeight(
        result.isOk
          ? gasRequired.refTime.toBn()
          : null
      );
    }
  })
  .catch(() => {
    setEstimatedWeight(null);
    setEstimatedWeightV2(null);
  });
}, [api, accountId, contract, message, dbParams, dbValue, weight.isWeightV2]);

  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !message || !value || !weight) {
        return;
      }
      //{setIsMenu(true)}
      {toggleIsCalled()}
      contract
        .query[message.method](
          accountId,
          { gasLimit: weight.isWeightV2 ? weight.weightV2 : weight.isEmpty ? -1 : weight.weight, storageDepositLimit: null, value: message.isPayable ? value : 0 },
          ...params
        )
        .then((result): void => {
          setOutcomes([{
            ...result,
            from: accountId,
            message,
            params,
            when: new Date()
          }, ...outcomes]);
          onCallResult && onCallResult(messageIndex, result);
        })
        .catch((error): void => {
          console.error(error);
          onCallResult && onCallResult(messageIndex);
        });
    },
    [accountId, contract.query, message, messageIndex, onCallResult, outcomes, params, value, weight]
  );

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) =>
      () => setOutcomes([...outcomes.filter((_, index) => index !== outcomeIndex)]),
    [outcomes]
  );

  const isValid = !!(accountId && weight.isValid && isValueValid);
  const isViaRpc = (isViaCall || (!message.isMutating && !message.isPayable));      

  return (
    <Card >
        {messageIndex===0 && (<>
        <h2><strong>{'Make an Experience Claim'}</strong></h2>
        </>)}
        {messageIndex===2 && (<>
        <h2><strong>{'Make an Education Claim'}</strong></h2>
        </>)}

        {messageIndex===1 && (<>
        <h2><strong>{'Make a Work History Claim'}</strong></h2>
        </>)}

        {messageIndex===3 && (<>
        <h2><strong>{'Make a Good Deed Claim'}</strong></h2>
        </>)}

        {messageIndex===4 && (<>
        <h2><strong>{'Make a Claim for Intellectual Property'}</strong></h2>
        </>)}

        {isTest && (
          <InputAddress
          //help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
          />
        )}
        {isCalled && messageIndex !== null && messageIndex<5 && (
          <><br /><br />
          <Badge color='blue' icon='1'/>
          {t('Select the AccountID for this Claim:')}
          </>)}
        {isCalled && messageIndex !== null && messageIndex===7 && (
          <><br /><br />
          <Badge color='blue' icon='1'/>
          {t('Select which of your Accounts is asking for this Resume:')}
          </>)}
        {isCalled && messageIndex===10 && (<>
          <Badge color='blue' icon='1'/>
          {t('Select the Account to Use for Search: ')}
          </>)}
        {isCalled && (
          <>
        <InputAddress
          defaultValue={accountId}
          //help={t('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
          label={t('account to use')}
          labelExtra={
            <Available
              label={t('transferrable')}
              params={accountId}
            />
          }
          onChange={setAccountId}
          type='account'
          value={accountId}
          />
          </>
        )}

        {isCalled && messageIndex !== null && (
          <>
            {isTest && (
            <>
            <Dropdown
              defaultValue={messageIndex}
              //help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
              isError={message === null}
              label={t('claim type')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              isDisabled
            />              
            </>
            )}
            {isCalled && messageIndex !== null && messageIndex===7 && (
              <>
              <Badge color='blue' icon='2'/>
              {t('Select the Account whose Resume you want to view:')}
              </>)}

          {messageIndex!=0 && messageIndex!=1 
                           && messageIndex!=2 
                           && messageIndex!=3 
                           && messageIndex!=10 && (<>
              <Params
              onChange={setParams}
              params={
                message
                  ? message.args
                  : undefined
              }              
              registry={contract.abi.registry}
            />
          
          </>)}
          </>
        )}

{messageIndex===0 && (<>
        <Badge color='blue' icon='2'/>
        {t('Enter Your Expertise Keywords and/or Description : ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
        <Badge color='blue' icon='3'/>
        {t('Link to Additional Expertise Information: ')}<br />
        <Input label={''} type="text"
        value={params[1]}
        onChange={(e) => {
          params[1] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}
    {messageIndex===1 && (<>
        <Badge color='blue' icon='2'/>
        {t('Enter Your Work History Keywords and/or Description : ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
        <Badge color='blue' icon='3'/>
        {t('Link to Additional Work History Information: ')}<br />
        <Input label={' '} type="text"
        value={params[1]}
        onChange={(e) => {
          params[1] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}
    {messageIndex===2 && (<>
        <Badge color='blue' icon='2'/>
        {t('Enter Your Education Keywords and/or Description : ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
        <Badge color='blue' icon='3'/>
        {t('Link to Additional Education Information: ')}<br />
        <Input label={' '} type="text"
        value={params[1]}
        onChange={(e) => {
          params[1] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}
    {messageIndex===3 && (<>
        <Badge color='blue' icon='2'/>
        {t('Enter Your Good Deed Keywords and/or Description : ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
        <Badge color='blue' icon='3'/>
        {t('Link to Additional Good Deed Information: ')}<br />
        <Input label={' '} type="text"
        value={params[1]}
        onChange={(e) => {
          params[1] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}
    {isCalled && messageIndex===10 && (<>
        <Badge color='blue' icon='2'/>
        {t('Enter Keywords to Search : ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}


        {message.isPayable && (
          <InputBalance
            //help={t('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
            isError={!isValueValid}
            isZeroable
            label={t('value')}
            onChange={setValue}
            value={value}
          />
        )}
        {isTest && (
        <>
        <Badge color='green' icon='hand'/>
          {t('Gas Required - Information Only')}
        <InputMegaGas
          estimatedWeight={message.isMutating ? estimatedWeight : MAX_CALL_WEIGHT}
          estimatedWeightV2={message.isMutating
            ? estimatedWeightV2
            : api.registry.createType('WeightV2', {
              proofSize: new BN(1_000_000),
              refTIme: MAX_CALL_WEIGHT
            })
          }
          isCall={!message.isMutating}
          weight={weight}
        />
        {message.isMutating && (
          <Toggle
            className='rpc-toggle'
            label={t('read contract only, no execution')}
            onChange={toggleViaCall}
            value={isViaCall}
          />
        )}        
        </>
        )}
        
        {isCalled && (
          <>
        {isViaRpc
          ? (
            <Button
            icon='sign-in-alt'
            isDisabled={!isValid}
            label={t('View')}
            onClick={_onSubmitRpc} 
            />
          )
          : (
            <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t('Submit')}
              onStart={onClose}
            />
          )
        }          
        </>
        )}
        
        {outcomes.length > 0 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <Details
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                isAccount={messageIndex===10 ? true: false}
                outcome={outcome}
              />
            ))}
            </div>
        )}
        </Card>
  );
}

export default React.memo(styled(CallCard)`
  .rpc-toggle {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  .clear-all {
    float: right;
  }
  .outcomes {
    margin-top: 1rem;
  }
`);

