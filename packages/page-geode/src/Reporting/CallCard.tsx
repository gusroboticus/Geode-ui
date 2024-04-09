// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// packages/page-geode/src/LifeAndWork/CallCard.tsx

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from './types.js';

import React, { useCallback, useEffect, useState } from 'react';
import { Input } from 'semantic-ui-react'
import { styled, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import ViewReportsDetails from './ViewReportsDetails.js';
import ViewAllowedDetails from './ViewAllowedDetails.js';
import { getCallMessageOptions } from './util.js';
import { MAX_REPORTER_LEGAL_NAME, MAX_REPORTER_PHONE, MAX_GEODE_APPS, MAX_ACTIVITY_ID_LIST, MAX_CRIME_CATEGORY } from './ReportingConst.js'
import { MAX_CRIME_DESCRIPTION, MAX_ACCUSED_LOCATION, MAX_NAME, MAX_ORGANIZATION, MAX_PHONE, MAX_EMAIL } from './ReportingConst.js'
import { RESTRICTED_PUBLIC_KEY, is_FAUCET_ON } from '@polkadot/react-components/modals/transferConst.js';

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
  //todo: code for allCodes:
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
  function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
  const isPasswordDisabled = (RESTRICTED_PUBLIC_KEY.find((_publicKey: string) => _publicKey === accountId))? true: false;

  const isTest: boolean = false;
  //const isTestData: boolean = false; //takes out code elements we only see for test

  const [accusedAccountId, setAccusedAccountId] = useAccountId();

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

  return (
    <Card >
        <h2><strong>{t(' Geode Reporting ')}{' '}</strong>
        {messageIndex===0 && (
          <>{'- Report Illegal Activity'}</>
        )}
        {messageIndex===2 && (
          <>{'- Add A Delegate To The Legal Team (Legal Root User Only)'}</>
        )}
        {messageIndex===4 && (
          <>{'- View All Reports'}</>
        )}
        {messageIndex===5 && (
          <>{'- View Legal Team And Allowed Law Enforcement Entities'}</>
        )}
        
        </h2>
        {isTest && (
          <InputAddress
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
          />
        )}
        {messageIndex !== null && messageIndex===0 && (
          <><br /><br />
          <Badge color='blue' icon='1'/>
          {t('Select which of your Accounts is making this report:')}
          </>)}
        {messageIndex !== null && messageIndex===2 && (
          <><br /><br />
          <Badge color='blue' icon='1'/>
          {t('Select which of your Accounts is making this transaction:')}
          </>)}
        {messageIndex !== null && messageIndex===5 && (
          <><br /><br />
          <Badge color='blue' icon='i'/>
          {t('Only Legal Team Accounts Can See This:')}
          </>)}
        {!isCalled && (
        <>
        <InputAddress
          defaultValue={accountId}
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
        </>)}
        
        {messageIndex !== null && (
          <>
            {isTest && (
            <>
            <Dropdown
              defaultValue={messageIndex}
              isError={message === null}
              label={t('Reporting Item')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              isDisabled
            />              
            </>
            )}

            {messageIndex=== 2 && (
              <>
                <Badge color='blue' icon='2'/>
                {t('Please fill out the folowing fields:')}
                <br /><br />
                {t_strong('Account Id')}
                <InputAddress
                    label={t('Account Id')}
                    defaultValue={accusedAccountId}
                    labelExtra={
                      <Available
                        label={t('transferrable')}
                        params={accusedAccountId}
                      />
                      }
                    onChange={setAccusedAccountId}
                    type='account'
                    value={params[0]=accusedAccountId}
                />
                {t_strong('Name ')}{t('(Max Character length is ')}{MAX_NAME}{')'}
                    <Input label='' type="text" 
                            value={params[1]}
                            onChange={(e)=>{
                              params[1]=e.target.value.slice(0,MAX_NAME);
                              setParams([...params]);
                            }}
                    ></Input>
                                
                {t_strong('Organization ')}{t('(Max Character length is ')}{MAX_ORGANIZATION}{')'}
                    <Input label='' type="text" 
                            value={params[2]}
                            onChange={(e)=>{
                              params[2]=e.target.value.slice(0,MAX_ORGANIZATION);
                              setParams([...params]);
                            }}
                    ></Input>

                {t_strong('Phone Number ')}{t('(Max Character length is ')}{MAX_PHONE}{')'}
                    <Input label='' type="text" 
                            value={params[3]}
                            onChange={(e)=>{
                              params[3]=e.target.value.slice(0,MAX_PHONE);
                              setParams([...params]);
                            }}
                    ></Input>

                {t_strong('Email ')}{t('(Max Character length is ')}{MAX_EMAIL}{')'}
                    <Input label='' type="text" 
                            value={params[4]}
                            onChange={(e)=>{
                              params[4]=e.target.value.slice(0,MAX_EMAIL);
                              setParams([...params]);
                            }}
                    ></Input>    
              
              </>)}


            {messageIndex=== 0 && (
              <>
                <Badge color='blue' icon='2'/>
                {t('Please fill out the folowing fields:')}
                <br /><br />
                {t_strong('Your Legal Name')}{t('(Max Character length is ')}{MAX_REPORTER_LEGAL_NAME}{')'}
                    <Input label='' type="text" 
                            value={params[0]}
                            onChange={(e)=>{
                              params[0]=e.target.value.slice(0,MAX_REPORTER_LEGAL_NAME);
                              setParams([...params]);
                            }}
                    ></Input>
                
                {t_strong('Your Phone Number')}{t('(Max Character length is ')}{MAX_REPORTER_PHONE}{')'}
                    <Input label='' type="text" 
                            value={params[1]}
                            onChange={(e)=>{
                              params[1]=e.target.value.slice(0,MAX_REPORTER_PHONE);
                              setParams([...params]);
                            }}
                    ></Input>

                {t_strong('Accused Account')}
                <InputAddress
                    label={t('Accused Account')}
                    defaultValue={accusedAccountId}
                    labelExtra={
                      <Available
                        label={t('transferrable')}
                        params={accusedAccountId}
                      />
                      }
                    onChange={setAccusedAccountId}
                    type='account'
                    value={params[2]=accusedAccountId}
                />
                
                {t_strong('Geode Apps Where The Crime Happened')}{t('(Max Character length is ')}{MAX_GEODE_APPS}{')'}
                    <Input label='' type="text" 
                            value={params[3]}
                            onChange={(e)=>{
                              params[3]=e.target.value.slice(0,MAX_GEODE_APPS);
                              setParams([...params]);
                            }}
                    ></Input>

                {t_strong('Activity ID List (Hash IDs for the post, product, etc in question)')}{t('(Max Character length is ')}{MAX_ACTIVITY_ID_LIST}{')'}
                    <Input label='' type="text" 
                            value={params[4]}
                            onChange={(e)=>{
                              params[4]=e.target.value.slice(0,MAX_ACTIVITY_ID_LIST);
                              setParams([...params]);
                            }}
                    ></Input>

                {t_strong('Crime Category (What kind of crime is this?)')}{t('(Max Character length is ')}{MAX_CRIME_CATEGORY}{')'}
                    <Input label='' type="text" 
                            value={params[5]}
                            onChange={(e)=>{
                              params[5]=e.target.value.slice(0,MAX_CRIME_CATEGORY);
                              setParams([...params]);
                            }}
                    ></Input>

                {t_strong('Crime Description (Put the details of the crime here)')}{t('(Max Character length is ')}{MAX_CRIME_DESCRIPTION}{')'}
                    <Input label='' type="text" 
                            value={params[6]}
                            onChange={(e)=>{
                              params[6]=e.target.value.slice(0,MAX_CRIME_DESCRIPTION);
                              setParams([...params]);
                            }}
                    ></Input>

                {t_strong('Accused User Location (What is the country, state and city of the accused user?)')}{t('(Max Character length is ')}{MAX_ACCUSED_LOCATION}{')'}
                    <Input label='' type="text" 
                            value={params[7]}
                            onChange={(e)=>{
                              params[7]=e.target.value.slice(0,MAX_ACCUSED_LOCATION);
                              setParams([...params]);
                            }}
                    ></Input>    
              
              </>)}

              {messageIndex != 0 && messageIndex != 2 && 
              ( <Params
              onChange={setParams}
              params={
                message
                  ? message.args
                  : undefined
              }              
              registry={contract.abi.registry}
            />)}
          </>
        )}

        {message.isPayable && (
          <InputBalance
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

        {!isCalled && (
        <>
        <Card>
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
            <>{(is_FAUCET_ON && isPasswordDisabled)? <>
              {'⭕'}{t(' RESTRICTED ACCOUNT') }</>:
            <>
            <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t('Submit')}
              onStart={onClose}
            /></>}</>
          )
        }
        </Card>
        </>)}

        {outcomes.length > 0 && messageIndex === 4 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <ViewReportsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex === 5 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <ViewAllowedDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
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


