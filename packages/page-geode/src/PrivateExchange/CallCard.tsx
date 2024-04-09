// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from './types.js';
import { Input, Container } from 'semantic-ui-react'

import React, { useCallback, useEffect, useState } from 'react';
import { styled, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';
import { t_strong, GeodeToZeo } from './ExchangeUtil.js';

import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import ViewAllListings from './ViewAllListings.js';
import ViewMyListings from './ViewMyListings.js';
import { getCallMessageOptions } from './util.js';
import { MAX_LISTINGS, MAX_OFFER_COIN, MAX_ASK_COIN, MAX_PAIR, MAX_METHOD, MAX_COUNTRY, MAX_CITY } from './ExchangeConst.js'
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
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const [isCalled, toggleIsCalled] = useToggle(false);
  const [isSaved, setSaved] = useState(false);

  const [formOffer, setFormOffer] = useState<string>('');
  const [formAsk, setFormAsk] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formInventory, setFormInventory] = useState<string>('');
  const [formMethod, setFormMethod] = useState<string>('');
  const [formCountry, setFormCountry] = useState<string>('');
  const [formCity, setFormCity] = useState<string>('');
  const isPasswordDisabled = (RESTRICTED_PUBLIC_KEY.find((_publicKey: string) => _publicKey === accountId))? true: false;

  const isTest: boolean = false;
  //const isTestData: boolean = false; //takes out code elements we only see for test

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
    <Card>
        <h2>{t_strong(' Geode Private Exchange ')}{' '}
        {messageIndex===0 && (
          <>{'- Make A New Listing'}</>
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
          <>
          <br />
          {t_strong(' PLEASE NOTE: ')} 
          <br />{' 🔘 '}{t_strong(' Users looking to trade coin will only see the 58 most recently listed pairs, and the 5 best-priced listings per pair. Please price your listing to be competitive.')}
          <br />{' 🔘 '}{t(' All listings are saved to the Chain but may not be shown. ')}
          <br />{' 🔘 '}{t(' Each account can have a maximum of ')}{MAX_LISTINGS}{t(' listings.')}
          <br /><br />
          <Badge color='blue' icon='1'/>
          {t('Select which of your Accounts is making this listing:')}
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
              label={t('Test Item')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              isDisabled
            />              
            </>
            )}
          </>
        )}
        {messageIndex!=0 && (<>
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

        {messageIndex=== 0 && (
              <>
              <Container>
                    <Badge color='blue' icon='2'/>
                    {t('Please fill out the details for your listing:')}
                    <br /><br />

                    {t_strong('What coin are you offering? ')}{t('(Max Character length is ')}{MAX_OFFER_COIN}{')'}
                    <Input label={formOffer? params[0] = formOffer: ''} type="text" 
                            value={formOffer}
                            onChange={(e)=>{
                              params[0]=e.target.value.slice(0,MAX_OFFER_COIN);
                              setFormOffer(e.target.value.slice(0,MAX_OFFER_COIN));
                              setParams([...params]);
                            }}
                    ><input /></Input>

                    {t_strong('What coin or currency are you asking for? ')}{t('(Max Character length is ')}{MAX_ASK_COIN}{')'}
                    <Input label={formAsk? params[1] = formAsk: ''} type="text" 
                            value={formAsk}
                            onChange={(e)=>{
                              params[1]=e.target.value.slice(0,MAX_ASK_COIN);
                              setFormAsk(e.target.value.slice(0,MAX_ASK_COIN));
                              setParams([...params]);
                            }}
                    ><input /></Input>

                    {t_strong('Price per asking coin')}{t('(Max Character length is ')}{MAX_PAIR}{')'}
                    <Input label={formPrice? params[2] = GeodeToZeo(formPrice) : '0'} type="text"
                        value={formPrice}
                        onChange={(e) => {
                          params[2]=e.target.value.slice(0,MAX_PAIR);
                          setFormPrice(e.target.value.slice(0,MAX_PAIR));
                          setParams([...params]);
                        }}
                      ><input />
                    </Input>

                    {t_strong('Method: Instructions for how buyers can find you, communicate with you and buy coin')}{t('(Max Character length is ')}{MAX_METHOD}{')'}
                    <Input label={formMethod? params[3] = formMethod: ''} type="text" 
                            value={formMethod}
                            onChange={(e)=>{
                              params[3]=e.target.value.slice(0,MAX_METHOD);
                              setFormMethod(e.target.value.slice(0,MAX_METHOD))
                              setParams([...params]);
                            }}
                    ><input /></Input>

                    {t_strong('Inventory: How much coin you have avaialble for sale')}
                    <Input label={formInventory? params[4] = GeodeToZeo(formInventory) : '0'} type="text"
                        value={formInventory}
                        onChange={(e) => {
                          params[4]=e.target.value;
                          setFormInventory(e.target.value);
                          setParams([...params]);
                        }}
                      ><input />
                    </Input>

                    {t_strong('What country do you live in? (for local in person sales)')}{t('(Max Character length is ')}{MAX_COUNTRY}{')'}
                    <Input label={formCountry? params[5] = formCountry : ''} type="text" 
                            value={formCountry}
                            onChange={(e)=>{
                              params[5]=e.target.value.slice(0,MAX_COUNTRY);
                              setFormCountry(e.target.value.slice(0,MAX_COUNTRY));
                              setParams([...params]);
                            }}
                    ><input /></Input>

                    {t_strong('What city do you live in? (for local in person sales)')}{t('(Max Character length is ')}{MAX_CITY}{')'}
                    <Input label={formCity? params[6] = formCity: ''} type="text" 
                            value={formCity}
                            onChange={(e)=>{
                              params[6]=e.target.value.slice(0,MAX_CITY);
                              setFormCity(e.target.value.slice(0,MAX_CITY));
                              setParams([...params]);
                            }}
                    ><input /></Input>

              </Container>
          </>)}

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
            <div>
            <Button
              icon='sign-in-alt'
              isDisabled={formPrice==='' && formInventory==='' &&
                          formMethod==='' && formCountry==='' &&
                          formOffer==='' && formCity==='' && formAsk===''}
              label={t('Save')}
              onClick={()=>{setSaved(true);
                          setParams([...params]);
                      }} 
            />
            <>{(is_FAUCET_ON && isPasswordDisabled)? <>
              {'⭕'}{t(' RESTRICTED ACCOUNT') }</>:
            <>
            <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx || !isSaved}
              label={t('Submit')}
              onStart={onClose}
            /></>}</>
            </div>
          )
        }
        </Card>
        </>)}

        {outcomes.length > 0 && messageIndex === 2 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <ViewAllListings
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex === 3 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <ViewMyListings
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


