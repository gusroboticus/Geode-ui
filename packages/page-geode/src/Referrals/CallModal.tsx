// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// 
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from '../shared/types.js';

import React, { useCallback, useEffect, useState } from 'react';
import { styled, Expander, Badge, Button, Dropdown, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import { getCallMessageOptions } from '../shared/util.js';
import axios from "axios";

interface Props {
  className?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
  callAccount: string;
  payAccount: string;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function CallModal ({ className = '', callAccount, contract, messageIndex, payAccount, onCallResult, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];

  const [accountId, setAccountId] = useAccountId(payAccount);
  function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);

  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [isSaved, setSaved] = useState(false);
  
  const [isViaCall, toggleViaCall] = useToggle();

  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);

  // for test
  const isShow: boolean = false;
  const isShowParams: boolean = false;

  const JSONaxios: string = 'https://api.ipify.org/?format=json';
  const [ip, setIP] = useState('172.56.96.175');

  const getData = async () => {
      const res = await axios.get(JSONaxios);
      console.log(res.data);
      setIP(res.data.ip);
    };
  
    useEffect(() => {
      getData();
    }, []);

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

  return (
    <>
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={t('Geode Faucet')}
      onClose={onClose}
    >
      <Modal.Content>
      <h2>
      {t_strong('Faucet Deposit: ')}<br />
      </h2>
        
        {isShow && (<>
          <InputAddress
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
        />        
        </>)}
      
        <br />{messageIndex===3 && <><Badge color='blue' icon='1'/>{t_strong('Select the Destination Account of your Coin')}</>}
        <InputAddress
          defaultValue={payAccount}
          label={t('deposit coin in the following account:')}
          labelExtra={
            <Available
              label={t('transferrable')}
              params={payAccount}
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
              isError={message === null}
              label={t('message to send')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
            />            
            </>)}
        {isShow && (
        <>
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

        {(messageIndex===3) && (<>
              <br />
              <Badge color='blue' icon='2'/>
                  {t_strong('Your Public Key: ')}{params[0]=accountId}<br /><br />
              <Badge color='blue' icon='3'/>{t_strong('Your Ip Address: ')}{params[1]=ip.trim()}<br /><br />
              <Badge color='blue' icon='4'/>{t_strong('IMPORTANT: ')}{t(' Verify the deposit Account is correct. Then click ')}
              {t_strong('OK')}{t(' and ')}{t_strong('Submit')}
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
            {messageIndex===3 && (<>
              <Button
              icon='sign-in-alt'
              //isDisabled={!isValid}
              label={t('OK')}
              onClick={()=>{setSaved(true);
                            setParams([...params]);
                           }} 
            />            
            </>)}
            { <TxButton
              isUnsigned={false}
              accountId={messageIndex===3? callAccount: accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx || !isSaved}
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
