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
import { styled, Expander, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared/index.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';

import FeedDetails from './FeedDetails.js';
import PaidFeedDetails from './PaidFeedDetails.js';
import StatDetails from './StatDetails.js';
import SearchDetails from './SearchDetails.js';
import KeywordDetails from './KeywordDetails.js';
import AccountFollowDetails from './AccountFollowDetails.js'
import AccountFollowerDetails from './AccountFollowerDetails.js'
import AccountBlockedDetails from './AccountBlockedDetails.js'

import { getCallMessageOptions } from '../shared/util.js';
import JSONhelp from '../shared/geode_social_help.json';
import JSONnote from '../shared/geode_social_note.json';
import JSONTitle from '../shared/geode_social_card_titles.json';
import JSONTier1Help from '../shared/geode_social_tier1_help.json';
import JSONTier2Help from '../shared/geode_social_tier2_help.json';

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
  const isClosed = (isCalled && ( messageIndex === 9 || messageIndex === 14 || 
                                  messageIndex===10 || messageIndex===11 || 
                                  messageIndex===13 || messageIndex===16 ||
                                  messageIndex===29 || messageIndex===31 ));
  const _help: string[] = JSONhelp;
  const _note: string[] = JSONnote;
  const _title: string[] = JSONTitle;
  const _tierOne: string[] = JSONTier1Help;
  const _tierTwo: string[] = JSONTier2Help;

  
  return (
    <Card >
        <h2>
        <Badge icon='info' color={'blue'} /> 
        <strong>{t(' Geode Social ')}</strong>
        {t(_title[messageIndex])}
        </h2>
        <Expander 
            className='viewInfo'
            isOpen={false}
            summary={<strong>{t('Instructions: ')}</strong>}>
            {t(_help[messageIndex])}<br /><br />
            {t(_note[messageIndex])}<br /><br />
            <Badge color='blue' icon='info'/>
            {t(_tierOne[messageIndex])}<br />
            <Badge color='blue' icon='info'/>
            {t(_tierTwo[messageIndex])}

        </Expander>
        {isTest && (
          <InputAddress
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
              isError={message === null}
              label={t('Profile Item')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              isDisabled
            />              
            </>
            )}
            
            {!isClosed && messageIndex!=1 && 
                          messageIndex!=8 && 
                          messageIndex!=13 && 
                          messageIndex!=29 && 
                          messageIndex!=31 && (<>
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

      {!isClosed && (messageIndex===29 || messageIndex===31) && (<>
        <strong>{t('Account Public Key: ')}</strong><br />
        {params[0] = accountId}<br />
      </>)}


      {messageIndex===8 && (<>
        {t('Username: ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
        {t('My Interests: ')}<br />
        <Input label={''} type="text"
        value={params[1]}
        onChange={(e) => {
          params[1] = e.target.value;
          setParams([...params]);
        }}
      />
        {t('Number of Posts to Show in my Feed: ')}<br />
        <Input label={''} type="text"
        value={params[2]}
        onChange={(e) => {
          params[2] = e.target.value;
          setParams([...params]);
        }}
      />
        {t('Number of Paid Posts to Show in my Paid Feed: ')}<br />
        <Input label={''} type="text"
        value={params[3]}
        onChange={(e) => {
          params[3] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}

    {!isClosed && messageIndex===13 && (<>
        {t('Keyword(s) to Search: ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
    </>)}


    {messageIndex===1 && (<>
        {t('Paid Post Message: ')}<br />
        <Input label={''} type="text"
        value={params[0]}
        onChange={(e) => {
          params[0] = e.target.value;
          setParams([...params]);
        }}
      />
        {t('Photo or YouTube Link: ')}<br />
        <Input label={''} type="text"
        value={params[1]}
        onChange={(e) => {
          params[1] = e.target.value;
          setParams([...params]);
        }}
      />
        {t('Website or Document Link: ')}<br />
        <Input label={''} type="text"
        value={params[2]}
        onChange={(e) => {
          params[2] = e.target.value;
          setParams([...params]);
        }}
        />
        {t('Maximum Number of Paid Endorsers: ')}<br />
        <Input label={''} type="text"
        value={params[3]}
        onChange={(e) => {
          params[3] = e.target.value;
          setParams([...params]);
        }}
        />
        {t('Target Interests: ')}<br />
        <Input label={''} type="text"
        value={params[4]}
        onChange={(e) => {
          params[4] = e.target.value;
          setParams([...params]);
        }}
        />
        {t('Total Geode to spend across all Endorsers: ')}<br />
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
              <FeedDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
                onClose={isCalled}
              
              />
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===10 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <PaidFeedDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===11 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <SearchDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===13 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <KeywordDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===14 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <StatDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              </>
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===16 && (
            <div>{outcomes.map((outcome, index): React.ReactNode => (
              <><AccountBlockedDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              /></>
            ))}</div>
        )}
        {outcomes.length > 0 && messageIndex===29 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <AccountFollowDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
              </>
            ))}
            </div>
        )}     
        {outcomes.length > 0 && messageIndex===31 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <>
              <AccountFollowerDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
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


