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
import { styled, Expander, AccountName, IdentityIcon, Button, Dropdown, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isHex, stringToHex, hexToString, BN, BN_ONE, BN_ZERO } from '@polkadot/util';
import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import { getCallMessageOptions } from '../shared/util.js';

interface Props {
  className?: string;
  messageId: string;
  fromAcct?: string;
  username?: string;
  postMessage: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function CallModal ({ className = '', messageId, fromAcct, username, postMessage, contract, messageIndex, onCallResult, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];

  const [accountId, setAccountId] = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  let [params, setParams] = useState<unknown[]>([]);
  
  const [isViaCall, toggleViaCall] = useToggle();

  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const isReply: boolean = (messageId===zeroMessageId)? false: true; 

  // for test
  const isShow: boolean = false;
  const isShowParams: boolean = true;

  function hextoHuman(_hexIn: string): string {
    const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
    return(_Out)
  }

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

    // v2 contract --
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
      header={(messageIndex===2 || messageIndex===3)? 
              t('Geode - Make an Endorsement'):
              (postMessage)? t('Geode - Make a Reply'):
                             t('Geode - Make a Post')}
      onClose={onClose}
    >
      <Modal.Content>
      <Expander 
         className='paramsExpander'
         isOpen={false}
         summary={'Instructions: '}>
        {messageIndex !== null && (messageIndex===2 || messageIndex===3) && (<>
          <h2><strong>{t('Social - Endorse a Post')}</strong></h2><br />
            <strong>{t('Instructions for Endorsing a Post: ')}</strong><br />
            {'(1) '}{t('Make Sure the (account to use) is NOT the owner of the Post')}<br /> 
            {'(2) '}{t('Click Submit button to sign and submit this transaction')}
            <br /><br />
            {t('⚠️ Please Note: You can not endorse your own posts.')}
          </>)}
        {messageIndex !== null && messageIndex === 0 && !postMessage && (<>
            <h2><strong>{t('Social - Make a Post ')}{' '}</strong></h2><br />
            <strong>{t('Instructions for Posting: ')}</strong><br />
            {'(1) '}{t('Call from Account - This is Your Account. ')}<br /> 
            {'(2) '}{t('Enter your Post message in the text field. ')}<br />
            {'(3) '}{t('Photo or YouTube Link -  Enter a valid Photo or YouTube Link.')}<br />
            {'(4) '}{t('Website or Document Link - Enter your Website or Document Link for further information.')}<br />
            <br /><br />
            {t("⚠️ Please Note: Don't Forget to Click Submit when done! ")}<br /><br />
          </>)}
        {messageIndex !== null && messageIndex === 0 && postMessage && (<>
            <h2><strong>{t('Social - Reply to a Post ')}{' '}</strong></h2><br />
            <strong>{t('Instructions for Replying to a Post: ')}</strong><br />
            {'(1) '}{t('Call from Account - Your Account for Post Originator. ')}<br /> 
            {'(2) '}{t('Enter your Post message in the text field. ')}<br />
            {'(3) '}{t('Photo or YouTube Link -  Enter a valid Photo or YouTube Link.')}<br />
            {'(4) '}{t('Website or Document Link - Enter your Website or Document Link for further information.')}<br />
            <br /><br />
            {t("⚠️ Please Note: Don't Forget to Click Submit when done! ")}<br /><br />
          </>)}
        </Expander>
        
        {isShow && (<>
          <InputAddress
          //help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
        />        
        </>)}

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
 
        {messageIndex===0 && (<>
        {isReply? (
        <>
        {t('Reply Message: ')}
          <Input label='' type="text"
            value={params[0]}
            onChange={(e) => {
              params[0] = e.target.value;
              //params[3] = messageId;
              setParams([...params]);
            }}
          />
          </>
        ):
        <>
        {t('Post Message: ')}
          <Input label='' type="text"
          onChange={(e) => {
            params[0] = stringToHex(e.target.value);
            //params[3] = messageId;
            setParams([...params]);
          }}/>
        </>}
        {t('Photo or YouTube Link: ')}
          <Input label='' type='text'
          onChange={(e) => {
            params[1] = stringToHex(e.target.value.trim());
            setParams([...params]);}}/>
        {t('Website Link, Document or other Link: ')}
          <Input label='' type='text'
          onChange={(e) => {
            params[2] = stringToHex(e.target.value.trim());
            setParams([...params]);}}/>
        </>)}

        {(messageIndex===2 || messageIndex===3) && (<>
          <br />{t(' Message ID : ')}{JSON.stringify(params=[messageId])}
          <h3>
        <strong>{t(' Owner of Post: ')}</strong>
        {fromAcct && (
              <>
              <IdentityIcon size={32} value={fromAcct} />
              <AccountName value={fromAcct} withSidebar={true}/>
              </>)}        
        {username && (
              <>
              {' @'}{hextoHuman(username)}
              </>)}  
              <br /><br />
        {postMessage && (<>
          <strong>{t(' Post: ')}</strong>
          <h5>{hextoHuman(postMessage)}</h5> <br />     
        </>)} 
        </h3>
        <br />        
        </>)}

        {messageIndex===12 && (<>
          {t('Post Reply Message: ')}
          <Input label='' type="text"
          onChange={(e) => {
            params[0] = stringToHex(e.target.value);
            params[3] = messageId;
            setParams([...params]);
          }}/>
          {t('Photo or YouTube Link: ')}
          <Input label='' type='text'
          onChange={(e) => {
            params[1] = stringToHex(e.target.value.trim());
            setParams([...params]);}}/>
        {t('Website Link, Document or other Link: ')}
          <Input label='' type='text'
          onChange={(e) => {
            params[2] = stringToHex(e.target.value.trim());
            setParams([...params]);}}/>
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