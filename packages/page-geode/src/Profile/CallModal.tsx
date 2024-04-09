// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
import { Input, Label } from 'semantic-ui-react'
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import CopyInline from '../shared/CopyInline.js';
import React, { useEffect, useState } from 'react';
import { styled, Expander, LabelHelp, AccountName, IdentityIcon, Button, Dropdown, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isHex, hexToString, BN, BN_ONE, BN_ZERO } from '@polkadot/util';
import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import { getCallMessageOptions } from '../shared/util.js';
import { t_strong } from './ProfileUtil.js';
import { MAX_URL, MAX_PHOTO_URL, MAX_BIO, MAX_TAGS, MAX_LOCATION, MAX_DISPLAY_NAME } from './ProfileConst.js'
import { RESTRICTED_PUBLIC_KEY, is_FAUCET_ON } from '@polkadot/react-components/modals/transferConst.js';

interface Props {
  className?: string;
  myAccount?: string;
  displayName?: number;
  location?: number;
  tags?: number;
  bio?: number;
  photoUrl?: number;
  websiteUrl1?: number;
  websiteUrl2?: number;
  websiteUrl3?: number;
  lifeAndWork?: string;
  social?: string;
  privateMessage?: string;
  marketPlace?: string;
  moreInfo?: number;
  makePrivate?: boolean;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const paramToNum = (_num: number|undefined) => _num? _num : 0; 
const paramToString = (_string: string|undefined) => _string? _string : '';
const paramToBool = (_bool: boolean|undefined) => _bool? _bool: false;
const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';

function CallModal ({ className = '', myAccount, displayName, 
                      location, tags, bio, photoUrl, 
                      websiteUrl1, websiteUrl2, websiteUrl3, 
                      lifeAndWork, social, privateMessage,
                      marketPlace, moreInfo, makePrivate, 
                      contract, messageIndex, onChangeMessage,
                      onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];

  const [accountId, setAccountId] = useAccountId();
  
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  
    //const from passing default props
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
    //const [_moreInfo, setMoreInfo] = useState('');
    const [_makePrivate, toggleMakePrivate] = useToggle(paramToBool(makePrivate));
   
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [isSaved, setSaved] = useState(false);
  
  const [isViaCall, toggleViaCall] = useToggle();

  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const isPasswordDisabled = (RESTRICTED_PUBLIC_KEY.find((_publicKey: string) => _publicKey === accountId))? true: false;


  // for test
  const isShow: boolean = false;
  const isShowParams: boolean = true;

    function hextoString(_hexIn: number): string {
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
 

  const isValid = !!(accountId && weight.isValid && isValueValid);

  return (
    <>
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={t('Geode Profile - Update Your Profile')}
      onClose={onClose}
    >
      <Modal.Content>
      <h2>
      <strong>{t('Account: ')}</strong>
          {myAccount}<br />
      </h2>
      <Expander 
         className='paramsExpander'
         isOpen={false}
         summary={'Instructions: '}>

        {messageIndex !== null && messageIndex === 1 && (<>
            <strong>{t('Instructions for Updating Your Profile Information: ')}</strong><br />
            {'(1) '}{t('Select the Account to use for this transaction (call from account). ')}<br /> 
            {'(2) '}{t('Enter your Location (leave blank if you wish). ')}<br />
            {'(3) '}{t('Enter experience, education, expertise or other tags. ')}<br />
            {'(4) '}{t('Enter your Bio. A sentence, a paragraph or more about you. ')}<br />
            {'(5) '}{t('Your Photo -  Enter a valid Photo Link that represents you.')}<br />
            {'(6) '}{t('Websites give other users links to find out more about you. You can add up to three.')}<br />
            {'(7) '}{t('Enter your account addresses for other Geode Apps (Life and Work, Social, Private Messaging and Market Place.)')}<br />
            {'(8) '}{t('Use the Hide toggle to make your profile visible (or not) to other users.  ')}<br />
            <br /><br />
            {t('⚠️ Important: Don`t forget to click Submit when completed.')} <br /><br />        
          </>)}
        </Expander>
        
        {isShow && (<>
          <InputAddress
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
        />        
        </>)}
        <br /><strong>{t('Account to Use: ')}</strong><br />
        <InputAddress
          defaultValue={accountId}
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
   
        {messageIndex===1 && (<>
          <br />
          <LabelHelp help={t('This is your Profile Account.')}/>{' '}          
          <strong>{t('Profile Account: ')}</strong>
          {myAccount}{' '}  
          <IdentityIcon value={myAccount} />{' '}
          <AccountName value={myAccount} withSidebar={true}/>{' '}
          <CopyInline value={myAccount} label={''}/>{' '}<br /><br />

          <LabelHelp help={t('Enter the Display Name.')}/>{' '}    
          {t_strong('Display Name: ')}{t('(Max Character length is ')}{MAX_DISPLAY_NAME}{')'}
          <Input 
            label={_displayName.length>0? params[0]=_displayName: params[0]=hextoString(paramToNum(displayName))}
            type="text"
            defaultValue={hextoString(paramToNum(displayName))}
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
            label={_location.length>0? params[1]=_location: params[1]=hextoString(paramToNum(location))}
            type="text"
            defaultValue={hextoString(paramToNum(location))}
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
            label={_tags.length>0? params[2]=_tags: params[2]=hextoString(paramToNum(tags))}
            type="text"
            defaultValue={hextoString(paramToNum(tags))}
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
            label={_bio.length>0? params[3]=_bio: params[3]=hextoString(paramToNum(bio))}
            type="text"
            defaultValue={hextoString(paramToNum(bio))}
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
            label={_photoUrl.length>0? params[4]=_photoUrl: params[4]=hextoString(paramToNum(photoUrl))}
            type="text"
            defaultValue={hextoString(paramToNum(photoUrl))}
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
            label={_websiteUrl1.length>0? params[5]=_websiteUrl1: params[5]=hextoString(paramToNum(websiteUrl1))}
            type="text"
            defaultValue={hextoString(paramToNum(websiteUrl1))}
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
            label={_websiteUrl2.length>0? params[6]=_websiteUrl2: params[6]=hextoString(paramToNum(websiteUrl2))}
            type="text"
            defaultValue={hextoString(paramToNum(websiteUrl2))}
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
            label={_websiteUrl3.length>0? params[7]=_websiteUrl3: params[7]=hextoString(paramToNum(websiteUrl3))}
            type="text"
            defaultValue={hextoString(paramToNum(websiteUrl3))}
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
            defaultValue={paramToString(lifeAndWork)}
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
            defaultValue={paramToString(social)}
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
            defaultValue={paramToString(privateMessage)}
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
            defaultValue={paramToString(marketPlace)}
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

        {isShow && (
          <>
        {message.isPayable && (
          <InputBalance
            isError={!isValueValid}
            isZeroable
            label={t('value')}
            onChange={setValue}
            value={value}
          />
        )}

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
        <Button
            icon='sign-in-alt'
            //isDisabled={!isValid}
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
