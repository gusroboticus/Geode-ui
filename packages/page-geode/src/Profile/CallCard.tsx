// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import { Input, Label } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from '../shared/types.js';
import React, { useCallback, useEffect, useState } from 'react';

import { styled, LabelHelp, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import Details from './Details.js';
import SearchDetails from './SearchDetails.js';
import { getCallMessageOptions } from '../shared/util.js';
import { paramsToAddress, t_strong } from './ProfileUtil.js';
import { MAX_URL, MAX_PHOTO_URL, MAX_BIO, MAX_TAGS, MAX_LOCATION, MAX_DISPLAY_NAME } from './ProfileConst.js';
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
  const [isSaved, setSaved] = useState(false);

  const [searchKeywordOne, setSearchKeywordOne] = useState<string | unknown>();
  const [searchKeywordTwo, setSearchKeywordTwo] = useState<string | unknown>();
  const [searchKeywordThree, setSearchKeywordThree] = useState<string | unknown>();

  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const [isCalled, toggleIsCalled] = useToggle(false);
  const [_displayName, setDisplayName] = useState('');
  const [_location, setLocation] = useState('');
  const [_tags, setTags] = useState('');
  const [_bio, setBio] = useState('');
  const [_photoUrl, setPhotoUrl] = useState('');
  const [_websiteUrl1, setWebsiteUrl1] = useState('');
  const [_websiteUrl2, setWebsiteUrl2] = useState('');
  const [_websiteUrl3, setWebsiteUrl3] = useState('');
  const [_lifeAndWork, setLifeAndWork] = useAccountId();
  const [_social, setSocial] = useAccountId();
  const [_privateMessage, setPrivateMessage] = useAccountId();
  const [_marketPlace, setMarketPlace] = useAccountId();
  const [_makePrivate, toggleMakePrivate] = useToggle(false);
  const isPasswordDisabled = (RESTRICTED_PUBLIC_KEY.find((_publicKey: string) => _publicKey === accountId))? true: false;

  const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';
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

  const isValid = (messageIndex===3? !!(accountId && weight.isValid && isValueValid && searchKeywordOne && searchKeywordTwo && searchKeywordThree):
  !!(accountId && weight.isValid && isValueValid ));
  const isViaRpc = (isViaCall || (!message.isMutating && !message.isPayable));      
  const isClosed = (isCalled && (messageIndex === 1 || messageIndex === 2 || messageIndex === 3 || messageIndex === 4));

  return (
    <Card >
        <h2><strong>{t(' Geode Profile ')}{' '}</strong>
        {messageIndex===0 && (
          <>
            {'- Enter Your Profile Data'}</>
        )}
        {messageIndex===2 && (
          <>{'- View Profiles'}</>
        )}
        {messageIndex===3 && (
          <>{'- Search Profiles by Keyword'}</>
        )}
        {messageIndex===4 && (
          <>{'- Search Profiles by Account ID'}</>
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
        {!isClosed && (<>
        {messageIndex !== null && (messageIndex===0 || messageIndex===2) && (
          <><br /><br />
          <Badge color='blue' icon='1'/>
          {t('Select which of your Accounts to use for this Transaction:')}
          </>)}
        {messageIndex !== null && (messageIndex===1 || messageIndex===3) && (
          <><br /><br />
          <Badge color='blue' icon='1'/>
          {t('Select the Account for this Profile:')}
          </>)}
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

            {messageIndex !== null && messageIndex===2 && (
              <>
              <Badge color='blue' icon='2'/>
              {t('Select the Account whose Profile you want to view:')}
              </>)}

            {messageIndex=== 0 && (
              <>
                <Badge color='blue' icon='2'/>
                {t('Enter Your Profile Data. Don`t forget to click SAVE before you submit your Profile. To make updates and changes to your profile go to Account Look up and click the Update button.')}
              </>)}
            
            </>)}

            {messageIndex===3 && (
              <>
              <Badge color='blue' icon='2'/>
              {t('Enter your search keyword (Add two additional words to refine your search):')}<br /><br />
              </>)}

            {messageIndex!=0 && messageIndex!=3 &&  (<>
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

          {messageIndex===3 && (<>
          
          {t('Enter a Keyword to Search : ')}<br />
          <Input label={''} type="text"
          value={params[0]}
          onChange={(e) => {
            params[0] = e.target.value;
            setParams([...params]);
            setSearchKeywordOne(params[0]);
            setSearchKeywordTwo(params[1]);
            setSearchKeywordThree(params[2]);
          }}
          />
          {t('Narrow Search with a Second Keyword : ')}<br />
          <Input label={''} type="text"
          value={params[1]}
          onChange={(e) => {
            params[1] = e.target.value;
            setParams([...params]);
            setSearchKeywordOne(params[0]);
            setSearchKeywordTwo(params[1]);
            setSearchKeywordThree(params[2]);
          }}
          />
          {t('Narrow Search with a Third Keyword : ')}<br />
          <Input label={''} type="text"
          value={params[2]}
          onChange={(e) => {
            params[2] = e.target.value;
            setParams([...params]);
            setSearchKeywordOne(params[0]);
            setSearchKeywordTwo(params[1]);
            setSearchKeywordThree(params[2]);
          }}
          />
          </>)}

          {messageIndex===0 && (<>
          <br /><br /><br />
          <LabelHelp help={t('Enter the Display Name.')}/>{' '}          
          {t_strong('Display Name: ')}{t('(Max Character length is ')}{MAX_DISPLAY_NAME}{')'}
          <Input 
            label={_displayName.length>0? params[0]=_displayName: params[0]=''}
            type="text"
            value={_displayName}
            onChange={(e) => {
              setDisplayName(e.target.value.slice(0,MAX_DISPLAY_NAME));
              setParams([...params]);
            }}
            ><input />
            <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t('Enter your Location (You can leave this blank if you wish).')}/>{' '} 
          {t_strong('Location: ')}{t('(Max Character length is ')}{MAX_LOCATION}{')'}         
          <Input
            label={_location.length>0? params[1]=_location: params[1]=''}
            type="text"
            value={_location}
            onChange={(e) => {
              setLocation(e.target.value.slice(0,MAX_LOCATION));
              setParams([...params]);
            }}
            ><input />
            <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t('Enter your expertise and/or experience tags).')}/>{' '}          
          {t_strong('Experience and Expertise Tags: ')}{t('(Max Character length is ')}{MAX_TAGS}{')'}         
          <Input 
            label={_tags.length>0? params[2]=_tags: params[2]=''}
            type="text"
            value={_tags}
            onChange={(e) => {
              setTags(e.target.value.slice(0,MAX_TAGS));
              setParams([...params]);
            }}
            ><input />
            <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t('Enter your Bio.')}/>{' '}          
          {t_strong('Bio: ')}{t('(Max Character length is ')}{MAX_BIO}{')'}         
          <Input 
            label={_bio.length>0? params[3]=_bio: params[3]=''}
            type="text"
            value={_bio}
            onChange={(e) => {
              setBio(e.target.value.slice(0,MAX_BIO));
              setParams([...params]);
            }}
            ><input />
            <Label color={params[3]? 'blue': 'grey'}>
                    {params[3]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t('Enter your Photo URL (Link to a Photo).')}/>{' '}          
          {t_strong('Photo Url: ')}{t('(Max Character length is ')}{MAX_PHOTO_URL}{')'}         
          <Input 
            label={_photoUrl.length>0? params[4]=_photoUrl: params[4]=''}
            type="text"
            value={_photoUrl}
            onChange={(e) => {
              setPhotoUrl(e.target.value.slice(0,MAX_PHOTO_URL));
              setParams([...params]);
            }}
            ><input />
            <Label color={params[4]? 'blue': 'grey'}>
                    {params[4]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t('Enter your First Website Link.')}/>{' '}          
          {t_strong('Website Link 1: ')}{t('(Max Character length is ')}{MAX_URL}{')'}         
          <Input 
            label={_websiteUrl1.length>0? params[5]=_websiteUrl1: params[5]=''}
            type="text"
            value={_websiteUrl1}
            onChange={(e) => {
              setWebsiteUrl1(e.target.value.slice(0,MAX_URL));
              setParams([...params]);
            }}
            ><input />
            <Label color={params[5]? 'blue': 'grey'}>
                    {params[5]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t('Enter your Second Website Link.')}/>{' '}          
          {t_strong('Website Link 2: ')}{t('(Max Character length is ')}{MAX_URL}{')'}         
          <Input 
            label={_websiteUrl2.length>0? params[6]=_websiteUrl2: params[6]=''}
            type="text"
            value={_websiteUrl2}
            onChange={(e) => {
              setWebsiteUrl2(e.target.value.slice(0,MAX_URL));
              setParams([...params]);
            }}
            ><input />
            <Label color={params[6]? 'blue': 'grey'}>
                    {params[6]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t('Enter your Third Website Link.')}/>{' '}          
          {t_strong('Website Link 3: ')}{t('(Max Character length is ')}{MAX_URL}{')'}         
          <Input 
            label={_websiteUrl3.length>0? params[7]=_websiteUrl3: params[7]=''}
            type="text"
            value={_websiteUrl3}
            onChange={(e) => {
              setWebsiteUrl3(e.target.value.slice(0,MAX_URL));
              setParams([...params]);
            }}
            ><input />
            <Label color={params[7]? 'blue': 'grey'}>
                    {params[7]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
          </Input>

          <LabelHelp help={t('Select Your Life and Work Account.')}/>{' '}          
          <strong>{t('Life and Work Account: ')}</strong>{' '}
          {params[8] = _lifeAndWork}<br />
          <InputAddress
            defaultValue={accountId}
            label={t('Life and Work Account')}
            labelExtra={
            <Available
                label={t('transferrable')}
                params={_lifeAndWork}
            />
            }
            onChange={setLifeAndWork}
            type='account'
            value={_lifeAndWork}
          />

          <LabelHelp help={t('Select Your Social Account.')}/>{' '}          
          <strong>{t('Social Account: ')}</strong>{' '}
          {params[9] = _social}<br />
          <InputAddress
            defaultValue={accountId}
            label={t('Social Account')}
            labelExtra={
            <Available
                label={t('transferrable')}
                params={_social}
            />
            }
            onChange={setSocial}
            type='account'
            value={_social}
          />

          <LabelHelp help={t('Select Your Private Messaging Account.')}/>{' '}          
          <strong>{t('Private Messaging Account: ')}</strong>{' '}
          {params[10] = _privateMessage}<br />
          <InputAddress
            defaultValue={accountId}
            label={t('Private Messaging Account')}
            labelExtra={
            <Available
                label={t('transferrable')}
                params={_privateMessage}
            />
            }
            onChange={setPrivateMessage}
            type='account'
            value={_privateMessage}
          />

          <LabelHelp help={t('Select Your Market Place Account.')}/>{' '}          
          <strong>{t('Market Place Account: ')}</strong>{' '}
          {params[11] = _marketPlace}<br />
          <InputAddress
            defaultValue={accountId}
            label={t('Market Place Account')}
            labelExtra={
            <Available
                label={t('transferrable')}
                params={_marketPlace}
            />
            }
            onChange={setMarketPlace}
            type='account'
            value={_marketPlace}
          />

          <br /><br />
          <LabelHelp help={t('Select Yes/No to Hide Your Account.')}/> {' '}         
          <strong>{t('Hide Account: ')}</strong>
          <br /><br />
          <Toggle
            className='booleantoggle'
            label={<strong>{t(boolToString(params[12] = _makePrivate))}</strong>}
            onChange={() => {
              toggleMakePrivate()
              params[12] = !_makePrivate;
              setParams([...params]);
            }}
            value={_makePrivate}
          />
          <br />
          </>)}
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

        {!isClosed && (<>
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
          : (<>
            {messageIndex===0 && (<>
              <Button
              icon='sign-in-alt'
              //isDisabled={!isValid}
              label={t('Save')}
              onClick={()=>{setSaved(true);
                            setParams([...params]);
                           }} 
            />            
            </>)}
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
          </>)
        }
        </Card></>)}

        {outcomes.length > 0 && messageIndex < 3 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <Details
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                isAccount={messageIndex===3 ? true: false}
                outcome={outcome}
              />
            ))}
            </div>
        )}
        {outcomes.length > 0 && (messageIndex === 3 || messageIndex === 4) &&(
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <SearchDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                isAccount={messageIndex > 1 ? true: false}
                searchKeyword={<>{searchKeywordOne? searchKeywordOne: ''}{' '}
                                 {searchKeywordTwo? searchKeywordTwo: ''}{' '}
                                 {searchKeywordThree? searchKeywordThree: ''}</>}
                msgIndex={messageIndex}
                useAccount={paramsToAddress(params[0])}
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


