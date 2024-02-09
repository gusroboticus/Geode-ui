// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import { Input } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from '../shared/types.js';

import React, { useCallback, useEffect, useState } from 'react';
import { styled, Expander, Button, Dropdown, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { hexToString, BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import { getCallMessageOptions } from '../shared/util.js';

interface Props {
  className?: string;
  passListingID?: string;
  passOfferCoin?: string;
  passAskingCoin?: string;
  passPrice?: number;
  passMethod?: string;
  passInventory?: number;
  passCountry?: string;
  passCity?: string;
  passNotes?: string;
  hideThisListing?: boolean;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const BNtoGeode = (_num: number|undefined) => _num? _num/1000000000000: 0;
const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';

function CallModal ({ className = '', passListingID, passOfferCoin, passAskingCoin, passPrice, passMethod, 
                      passInventory, passCountry, passCity, passNotes, hideThisListing, 
                      contract, messageIndex, onCallResult, onChangeMessage,
                      onClose }: Props): React.ReactElement<Props> | null {
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
  const [isHideListing, toggleHideListing] = useToggle();

  const [formPrice, setFormPrice] = useState<string>();
  const [formInventory, setFormInventory] = useState<string>();
  const [formMethod, setFormMethod] = useState<string>();
  const [formCountry, setFormCountry] = useState<string>();
  const [formCity, setFormCity] = useState<string>();
  const [formNotes, setFormNotes] = useState<string>();

  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);

  // for test
  const isShow: boolean = false;
  const isShowParams: boolean = true;

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

  const isValid = !!(accountId && weight.isValid && isValueValid);
  const isViaRpc = (isViaCall || (!message.isMutating && !message.isPayable));

  function GeodeToZeo(_string: string): string {
    const _num = +_string * 1000000000000;
    return(_num.toString())
  }

  return (
    <>
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={t('Geode Private Exchange ')}
      onClose={onClose}
    >
      <Modal.Content>
        
        {isShow && (<>
          <InputAddress
          //help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
        />        
        </>)}
        <br /><strong>{t('Account to Use: ')}</strong><br />
        <InputAddress
          defaultValue={accountId}
          //help={t('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
          label={t('call from account')}
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
        {messageIndex !== null && (
          <>
            {isShow && (<>
              <Dropdown
              defaultValue={messageIndex}
              //help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
              isError={message === null}
              label={t('message to send')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              />            
            </>)}
            {isShow && (<>
              <Expander 
                className='paramsExpander'
                isOpen={false}
                summary={'See Params List'}>
                {isShowParams && (<>
                  <Params
                  onChange={setParams}
                  params={message? message.args: undefined}
                  registry={contract.abi.registry}
                  />            
                </>)}
              </Expander>   
            </>
            )}
        </>
        )}

        {/* custom modal for this contract message... */}
        {messageIndex===1 && (<>
          <br />       
          <strong>{t('Editing This Listing ID: ')}</strong><br />
          {params[0] = passListingID}
          <br /><h2><strong>{hexToString(passOfferCoin)}{t('/')}{hexToString(passAskingCoin)}</strong></h2>
          <br />

          <strong>{t('Price per coin in ')}{hexToString(passAskingCoin)}</strong>
          <Input label={formPrice? params[1] = GeodeToZeo(formPrice): params[1] = passPrice} type="text"
                defaultValue={BNtoGeode(passPrice)}
                value={formPrice}
                onChange={(e) => {
                    setFormPrice(e.target.value);
                }}
                ><input /> 
          </Input>

          <strong>{t('Method: explain how you want buyers to communicate with you, etc. ')}</strong>
          <Input label={formMethod? params[2] = formMethod: params[2] = hexToString(passMethod)} type="text" 
              value={formMethod}
              defaultValue={hexToString(passMethod)}
              onChange={(e)=>{
                setFormMethod(e.target.value);
              }}
          ><input /></Input>

          <strong>{t('Inventory: how much of the offer coin do you have for sale?')}</strong>
          <Input label={formInventory? params[3] = GeodeToZeo(formInventory) : params[3] = passInventory} type="text"
                  value={formInventory}
                  defaultValue={BNtoGeode(passInventory)}
                  onChange={(e) => {
                    setFormInventory(e.target.value);
                  }}
                ><input />
          </Input>

          <strong>{t('Country: what country do you live in (for local sales)')}</strong>
          <Input label={formCountry? params[4] = formCountry: params[4] = hexToString(passCountry)} type="text" 
              value={formCountry}
              defaultValue={hexToString(passCountry)}
              onChange={(e)=>{
              setFormCountry(e.target.value);
              }}
          ><input /></Input>

          <strong>{t('City: what city do you live in (for local sales)')}</strong>
          <Input label={formCity? params[5] = formCity: params[5] = hexToString(passCity)} type="text" 
              value={formCity}
              defaultValue={hexToString(passCity)}
              onChange={(e)=>{
              setFormCity(e.target.value);
              }}
          ><input /></Input>

          <strong>{t('Notes: what else should buyers know?')}</strong>
          <Input label={formNotes? params[6] = formNotes: params[6] = hexToString(passNotes)} type="text" 
              value={formNotes}
              defaultValue={hexToString(passNotes)}
              onChange={(e)=>{
              setFormNotes(e.target.value);
              }}
          ><input /></Input>

          <strong>{t('Hide This Listing?')}</strong>
          <br />
          <Toggle
            className='booleantoggle'
            label={<strong>{t(boolToString(isHideListing))}</strong>}
            onChange={() => {
              toggleHideListing()
              params[7] = !isHideListing;
              setParams([...params]);
            }}
            value={isHideListing}
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
        {isShow && (
          <>
        <InputMegaGas
          estimatedWeight={message.isMutating ? estimatedWeight : MAX_CALL_WEIGHT}
          estimatedWeightV2={message.isMutating
            ? estimatedWeightV2
            : api.registry.createType('WeightV2', {
              proofSize: new BN(1_000_000),
              refTIme: MAX_CALL_WEIGHT
            })
          }
          help={t('The maximum amount of gas to use for this contract call. If the call requires more, it will fail.')}
          isCall={!message.isMutating}
          weight={weight}
        />          
        </>
        )}
        {isShow && message.isMutating && (
          <Toggle
            className='rpc-toggle'
            label={t('read contract only, no execution')}
            onChange={toggleViaCall}
            value={isViaCall}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
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
            <>
            { <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t('Submit')}
              onStart={onClose}
            />
            }
            </>
          )
        }
      </Modal.Actions>
    </Modal>
  </>);
  
}

export default React.memo(styled(CallModal)`
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
