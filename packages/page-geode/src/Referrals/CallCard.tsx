// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/Referrals/CallCard.tsx

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from '../shared/types.js';

import React, { useCallback, useEffect, useState } from 'react';
import { styled, Expander, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';

import MyProgramsDetail from './MyProgramsDetail.js';
import BrowseDetail from './BrowseDetail.js';
import MyActivityDetail from './MyActivityDetail.js';

import { getCallMessageOptions } from '../shared/util.js';

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
  //todo: code for all unused params:
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
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const [isCalled, toggleIsCalled] = useToggle(false);
  
  const isTest: boolean = false;
  
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
  const isClosed = (isCalled && (messageIndex === 9 || messageIndex === 14 || messageIndex===10 || messageIndex===11 || messageIndex===13));
  
  
  return (
    <Card >
        <h2>
        <Badge icon='info' color={'blue'} /> 
        <strong>{t(' Geode Referral Programs ')}</strong>
        {messageIndex===9 && (<>{t(' - Browse Programs')}</>)}
        {messageIndex===10 && (<>{t(' - My Programs')}</>)}
        {messageIndex===11 && (<>{t(' - My Activity (Referrals & Payouts)')}</>)}
        
        </h2>
        <Expander 
            className='viewInfo'
            isOpen={false}
            summary={<strong>{t('Instructions: ')}</strong>}>
              {t('(1) Select the Account to Use')}<br />
            {messageIndex===9 && (<>
              {t('(2) Click View to Show the Available Programs. ')}<br />              
              {t('(3) Browse the Programs Available. ')}<br />          
              {t('(4) Click the Claim button to submit a Claim. ')}
            </>)}
            {messageIndex===10 && (<>
              {t('(2) Click View to Show your Programs. ')}<br />                       
              {t('(3) Fund - Add funding to a Program. ')}<br />
              {t('(4) Update - Change/Update program details. ')}<br />
              {t('(5) Deactivate - Deactivate a Program. ')}<br />
              {t('(6) Reactivate - Reactivate a Program. ')}
            </>)}
            {messageIndex===11 && (<>
              {t('(2) Click View to Show the Available Programs. ')}<br />              
              {t('(3) Browse the Programs Available. ')}<br />          
              {t('(4) Click the Claim button to submit a Claim. ')}
            </>)}

        </Expander>
        {isTest && (
          <InputAddress
          //help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
          />
        )}
        <><br /><br />
        </>
        {!isClosed && (
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
      
        {messageIndex !== null && (
          <>
            {isTest && (
            <>
            <Dropdown
              defaultValue={messageIndex}
              //help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
              isError={message === null}
              label={t('Referral')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              isDisabled
            />              
            </>
            )}
            
            {!isClosed && (<>
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
      
      
      {!isClosed && (
        <>
        <Card>
        {isViaRpc
          ? ( <>
              <Button
              icon='sign-in-alt'
              isDisabled={!isValid}
              label={t('View')}
              onClick={_onSubmitRpc} 
              />
              </>
            ) : (
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
        </Card>    
        </>
        )}
        {outcomes.length > 0 && messageIndex===9 &&  (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <BrowseDetail
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
                onClose={isCalled}
              />
              </>
            ))}
            </div>
        )}        

        {outcomes.length > 0 && messageIndex===10 &&  (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <MyProgramsDetail
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
                onClose={isCalled}
              />
              </>
            ))}
            </div>
        )}        
        {outcomes.length > 0 && messageIndex===11 &&  (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <MyActivityDetail
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
                onClose={isCalled}
              />
              </>
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


