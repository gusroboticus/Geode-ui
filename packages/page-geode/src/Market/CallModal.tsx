// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
import { Input, Label } from 'semantic-ui-react'

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import React, { useEffect, useState } from 'react';

import { Expander, LabelHelp, Dropdown, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isHex, hexToString, BN, BN_ONE, BN_ZERO } from '@polkadot/util';
import Params from '../shared/Params.js';
import InputMegaGas from '../shared/InputMegaGas.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import { getCallMessageOptions } from './util.js';

import { MAX_PRODUCT_BRAND, MAX_PRODUCT_CATEGORY, MAX_PRODUCT_DESCRIPTION, MAX_PHOTO_LINK } from './marketConst.js'
import { MAX_MORE_INFO_LINK, MAX_DELIVERY_INFO, MAX_PRODUCT_LOCATION } from './marketConst.js'
import { MAX_SERVICE_CATEGORY, MAX_SERVICE_DESCRIPTION, MAX_BOOKING_LINK, MAX_SERVICE_LOCATION, MAX_MESSAGE, MAX_MEDIA_URL } from './marketConst.js'
import { MAX_BUYER_NAME, MAX_BUYER_LOCATION } from './marketConst.js'
import { MAX_REVIEW } from './marketConst.js'
import { MAX_DELIVERY_TO_ADDR, MAX_TRACKING_INFO } from './marketConst.js'
import { refModalHeader } from './marketConst.js';
import { INST_TITLE, INST_SUB_TITLE, INSTRUCTION, INST_NOTE } from './marketInstructions.js';
import { RESTRICTED_PUBLIC_KEY, is_FAUCET_ON } from '@polkadot/react-components/modals/transferConst.js';


interface Props {
  className?: string;
  messageId: string;
  fromAcct?: string;
  toAcct?: string;
  username?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
  //onOpen: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function CallModal ({ className = '', messageId, toAcct, username, contract, messageIndex, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
// additional props:
// fromAcct,
// onCallResult,
  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];

  const [accountId, setAccountId] = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [recipientValue, setRecipientValue] = useAccountId(toAcct);

  const [_messageId, setMessageId] = useState('');

  const [messageValue, setMessageValue] = useState<string>('');
  //const [titleValue, setTitleValue] = useState<string>('');
  const [priceValue, setPriceValue] = useState<string>('');
  const [brandValue, setBrandValue] = useState<string>('');
  const [categoryValue, setCategoryValue] = useState<string>('');
  const [descriptionValue, setDescriptionValue] = useState<string>('');
  const [inventoryValue, setInventoryValue] = useState<string>('');
  const [photo1Value, setPhoto1Value] = useState<string>('');
  const [photo2Value, setPhoto2Value] = useState<string>('');
  const [photo3Value, setPhoto3Value] = useState<string>('');
  const [moreInfoValue, setMoreInfoValue] = useState<string>('');
  const [deliveryInfoValue, setDeliveryInfoValue] = useState<string>('');
  const [locationValue, setLocationValue] = useState<string>('');

  const [_isHide, toggleIsHide] = useToggle(false);
  const [_isDelivered, toggleIsDelivered] = useToggle(false);
  const isPasswordDisabled = (RESTRICTED_PUBLIC_KEY.find((_publicKey: string) => _publicKey === accountId))? true: false;

  const [isViaCall, toggleViaCall] = useToggle();
  
  const paramToString = (_string: string|undefined) => _string? _string : '';
  const hexToHuman =(_string: string|undefined) => isHex(_string)? hexToString(_string): '';
  const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';
  const geodeToZeo = (_string: string) => _string.length>0? (+_string * 1000000000000).toString(): '0';
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  // NOTE!:
  // for test set to true
  const isShow: boolean = false;

  function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

  function withHelp(_str: string, _help: string): JSX.Element {
    return(<>
    <LabelHelp help={t(_help)} />
    {' '}{t(_str)}
    </>)
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
  const isOpen: boolean = true;

  return (
    <>
    {isOpen && <>
    
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={(messageIndex!== null)? 
              t('Geode - ' + refModalHeader[messageIndex]):
              t('Geode')}
      onClose={onClose}
      
    >
      <Modal.Content>
      <Expander 
         className='paramsExpander'
         isOpen={false}
         summary={'Instructions: '}>
            {(messageIndex>-1 && messageIndex<42) && (<>
                <h2>{t_strong(INST_TITLE[messageIndex])}</h2><br />
                    {t_strong(INST_SUB_TITLE[messageIndex])}<br />
                    {t(INSTRUCTION[messageIndex])}<br /><br />
                    {t(INST_NOTE[messageIndex])}
              </>)}

        </Expander>
        
        <br />
        {isShow && (<>
          <InputAddress
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
        />        
        </>)}
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
              <Params
              onChange={setParams}
              params={message? message.args: undefined}
              registry={contract.abi.registry}
            />    
            </>)}  
            {messageIndex===25 && <>
                <LabelHelp help={t('Delete this Service from Your Store.')}/>{' '}          
                {t_strong('Delete a Service: ')}{hexToHuman(username)}<br /><br />
                <LabelHelp help={t('This is the Service ID')}/>{' '}   
                {t_strong('Service Id: ')}{' '}
                {params[0] = messageId}<br />                  
              <br /><br />
            </>}

            {messageIndex===24 && <>
                <LabelHelp help={t('Delete this Product from Your Store.')}/>{' '}          
                {t_strong('Delete a Product: ')}{hexToHuman(username)}<br /><br />
                <LabelHelp help={t('This is the Product ID')}/>{' '}  
                {t_strong('Product Id: ')}{' '}
                {params[0] = messageId}<br />                  
              <br /><br />
            </>}

            {messageIndex===23 && <>
                
              <LabelHelp help={t('Service to Update.')}/>{' '}          
                {t_strong('Update a Sevice: ')}{hexToHuman(username)}<br /><br />
                {t_strong('Service Id: ')}{' '}
                {params[0] = messageId}<br />                  
              
              <br /><br />
              <LabelHelp help={t('Enter the price of the service.')}/>{' '}          
              <strong>{t(' Service Price: ')}</strong>
              <Input 
                label={priceValue? params[1]=geodeToZeo(priceValue): params[1]=''}
                type="text"
                value={priceValue}
                onChange={(e) => {
                  setPriceValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter the category of the service.')}/>{' '}          
              {t_strong(' Service Catagory: ')}{t('(Max Character length is ')}{MAX_SERVICE_CATEGORY}{')'}
              <Input 
                label={categoryValue? params[2]=categoryValue: params[2]=''}
                type="text"
                value={categoryValue}
                onChange={(e) => {
                  setCategoryValue(e.target.value.slice(0,MAX_SERVICE_CATEGORY));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a the service description.')}/> {' '}         
              {t_strong(' Service Description: ')}{t('(Max Character length is ')}{MAX_SERVICE_DESCRIPTION}{')'}
              <Input 
                label={descriptionValue? params[3]=descriptionValue: params[3]=''}
                type="text"
                value={descriptionValue}
                onChange={(e) => {
                  setDescriptionValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[3]? 'blue': 'grey'}>
                    {params[3]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter the number of services in inventory.')}/> {' '}         
              <strong>{t(' Service Inventory: ')}</strong>
              <Input 
                label={inventoryValue? params[4]=inventoryValue: params[4]=''}
                type="text"
                value={inventoryValue}
                onChange={(e) => {
                  setInventoryValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[4]? 'blue': 'grey'}>
                    {params[4]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a photo or YouTube link.')}/> {' '}         
              {t_strong('Photo or YouTube Link: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={photo1Value? params[5]=photo1Value: params[5]=''}
                type="text"
                value={photo1Value}
                onChange={(e) => {
                  setPhoto1Value(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[5]? 'blue': 'grey'}>
                    {params[5]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a photo or YouTube link.')}/> {' '}         
              {t_strong('Photo or YouTube Link: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={photo2Value? params[6]=photo2Value: params[6]=''}
                type="text"
                value={photo2Value}
                onChange={(e) => {
                  setPhoto2Value(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[6]? 'blue': 'grey'}>
                    {params[6]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a photo or YouTube link.')}/> {' '}         
              {t_strong('Photo or YouTube Link: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={photo3Value? params[7]=photo3Value: params[7]=''}
                type="text"
                value={photo3Value}
                onChange={(e) => {
                  setPhoto3Value(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[7]? 'blue': 'grey'}>
                    {params[7]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a link for booking information.')}/> {' '}         
              {t_strong('Booking Link: ')}{t('(Max Character length is ')}{MAX_BOOKING_LINK}{')'}
              <Input 
                label={moreInfoValue? params[8]=moreInfoValue: params[8]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value.slice(0,MAX_BOOKING_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[8]? 'blue': 'grey'}>
                    {params[8]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter the service location.')}/> {' '}         
              {t_strong('Service Location: ')}{t('(Max Character length is ')}{MAX_SERVICE_LOCATION}{')'}
              <Input 
                label={locationValue? params[9]=locationValue: params[9]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_SERVICE_LOCATION));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[9]? 'blue': 'grey'}>
                    {params[9]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
            </>}

            {messageIndex===21 && <>
              <LabelHelp help={t('Product to Update.')}/>{' '}          
                <strong>{t('Update a Product: ')}{hexToHuman(username)}</strong><br /><br />
                <strong>{t('Product Id: ')}</strong>{' '}
                {params[0] = messageId}<br />                  
              <br /><br />
              <LabelHelp help={t('Enter the price of the product.')}/>{' '}          
              <strong>{t(' Product Price: ')}</strong>
              <Input 
                label={priceValue? params[1]=geodeToZeo(priceValue): params[1]=''}
                type="text"
                value={priceValue}
                onChange={(e) => {
                  setPriceValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter the brand of the product.')}/>{' '}          
              {t_strong(' Product Brand: ')}{t('(Max Character length is ')}{MAX_PRODUCT_BRAND}{')'}
              <Input 
                label={brandValue? params[2]=brandValue: params[2]=''}
                type="text"
                value={brandValue}
                onChange={(e) => {
                  setBrandValue(e.target.value.slice(0,MAX_PRODUCT_BRAND));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter the category of the product.')}/>{' '}          
              {t_strong('Category: ')}{t('(Max Character length is ')}{MAX_PRODUCT_CATEGORY}{')'}
              <Input 
                label={categoryValue? params[3]=categoryValue: params[3]=''}
                type="text"
                value={categoryValue}
                onChange={(e) => {
                  setCategoryValue(e.target.value.slice(0,MAX_PRODUCT_CATEGORY));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[3]? 'blue': 'grey'}>
                    {params[3]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a the product description.')}/> {' '}         
              {t_strong('Description: ')}{t('(Max Character length is ')}{MAX_PRODUCT_DESCRIPTION}{')'}
              <Input 
                label={descriptionValue? params[4]=descriptionValue: params[4]=''}
                type="text"
                value={descriptionValue}
                onChange={(e) => {
                  setDescriptionValue(e.target.value.slice(0,MAX_PRODUCT_DESCRIPTION));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[4]? 'blue': 'grey'}>
                    {params[4]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter the number of products in inventory.')}/> {' '}         
              <strong>{t(' Product Inventory: ')}</strong>
              <Input 
                label={inventoryValue? params[5]=inventoryValue: params[5]=''}
                type="text"
                value={inventoryValue}
                onChange={(e) => {
                  setInventoryValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[5]? 'blue': 'grey'}>
                    {params[5]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a photo or YouTube link.')}/> {' '}         
              {t_strong('Photo or YouTube Link: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={photo1Value? params[6]=photo1Value: params[6]=''}
                type="text"
                value={photo1Value}
                onChange={(e) => {
                  setPhoto1Value(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[6]? 'blue': 'grey'}>
                    {params[6]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a photo or YouTube link.')}/> {' '}         
              {t_strong('Photo or YouTube Link: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={photo2Value? params[7]=photo2Value: params[7]=''}
                type="text"
                value={photo2Value}
                onChange={(e) => {
                  setPhoto2Value(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[7]? 'blue': 'grey'}>
                    {params[7]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a photo or YouTube link.')}/> {' '}         
              {t_strong('Photo or YouTube Link: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={photo3Value? params[8]=photo3Value: params[8]=''}
                type="text"
                value={photo3Value}
                onChange={(e) => {
                  setPhoto3Value(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[8]? 'blue': 'grey'}>
                    {params[8]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter a link to further product information.')}/> {' '}         
              {t_strong('Further Information Link: ')}{t('(Max Character length is ')}{MAX_MORE_INFO_LINK}{')'}
              <Input 
                label={moreInfoValue? params[9]=moreInfoValue: params[9]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value.slice(0,MAX_MORE_INFO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[9]? 'blue': 'grey'}>
                    {params[9]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter the product delivery information if applicable.')}/> {' '}         
              {t_strong('Delivery Information: ')}{t('(Max Character length is ')}{MAX_DELIVERY_INFO}{')'}
              <Input 
                label={deliveryInfoValue? params[10]=deliveryInfoValue: params[10]=''}
                type="text"
                value={deliveryInfoValue}
                onChange={(e) => {
                  setDeliveryInfoValue(e.target.value.slice(0,MAX_DELIVERY_INFO));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[10]? 'blue': 'grey'}>
                    {params[10]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Enter the location of the product if applicable.')}/> {' '}         
              {t_strong('Product Location: ')}{t('(Max Character length is ')}{MAX_PRODUCT_LOCATION}{')'}
              <Input 
                label={locationValue? params[11]=locationValue: params[11]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_PRODUCT_LOCATION));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[11]? 'blue': 'grey'}>
                    {params[11]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <LabelHelp help={t('Select Yes/No to Make this product Digital.')}/> {' '}         
              <strong>{t('Product Digital (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t(boolToString(params[12] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[12] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
            </>}

            {messageIndex===19 && (<>
              <LabelHelp help={t('Order ID')}/>{' '}                    
              {t_strong('Order Id: ')}{params[3]=messageId}<br /><br />
              <LabelHelp help={t('Select Buyer Account to Rate.')}/>{' '}          
              {t_strong('Buyer Account to Rate: ')}{' '}
              {params[0] = recipientValue}<br />
              <InputAddress
                defaultValue={paramToString(toAcct)}
                label={t('Buyer Account to Rate')}
                labelExtra={
                <Available
                    label={t('transferrable')}
                    params={recipientValue}
                />}
                onChange={setRecipientValue}
                type='account'
                value={recipientValue}
              />


              <LabelHelp help={t('Enter a Buyer Review Rating 1-5 Stars.')}/> {' '}         
              <strong>{t(' Buyer Rating 1-5 Stars: ')}</strong>
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,1));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br />

              <LabelHelp help={t('Enter a Review.')}/> {' '}         
              {t_strong(' Enter a Review: ')}{t('(Max Character length is ')}{MAX_REVIEW}{')'}
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value.slice(0,MAX_REVIEW));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br />
            </>)}     
              
                
            {messageIndex===18 && (<>
                <LabelHelp help={t('Send a message to the Buyer.')}/>{' '}          
                {t_strong('Send Message for this Item: ')}{hexToHuman(username)}<br /><br />
                <LabelHelp help={t('Order Id for this message.')}/>{' '} 
                {t_strong('Order ID: ')}{params[0]=messageId}<br />
                <br />                  
              <LabelHelp help={t('Enter a photo or YouTube URL.')}/> {' '}         
              {t_strong(' Photo or YouTube URL: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br />
              <LabelHelp help={t('Enter message.')}/> {' '}         
              {t_strong(' Message: ')}{t('(Max Character length is ')}{MAX_MESSAGE}{')'}
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value.slice(0,MAX_MESSAGE));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>


            </>)}       
            {messageIndex===17 && (<>          
                <LabelHelp help={t('Seller to deny a resolution request.')}/>{' '}          
                {t_strong('Item to Deny Resolution Request: ')}{hexToHuman(username)}<br /><br />
                <LabelHelp help={t('Order ID for Item.')}/>{' '}       
                {t_strong('Order ID: ')}{params[0]=messageId}<br />
                <br />                  
            </>)}       

            {messageIndex===16 && (<>
                <LabelHelp help={t('Seller Issue a Replacement.')}/>{' '}          
                {t_strong('Item to Issue a Replacement: ')}{hexToHuman(username)}<br /><br />
                <LabelHelp help={t('Order ID for Item.')}/>{' '}   
                {t_strong('Order ID: ')}{params[0]=messageId}<br />
                <br />                  
              <LabelHelp help={t('Enter a new Tracking Update.')}/> {' '}         
              {t_strong(' Tracking Update: ')}{t('(Max Character length is ')}{MAX_TRACKING_INFO}{')'}
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_TRACKING_INFO));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br />
            </>)}       

            {messageIndex===15 && (<>
              <LabelHelp help={t('Seller Issue a Refund.')}/>{' '}          
                {t_strong('Item to Issue a Refund: ')}{hexToHuman(username)}<br /><br />
                <LabelHelp help={t('Order ID for Item.')}/>{' '} 
                {t_strong('Order ID: ')}{params[0]=messageId}<br />
                <br />                  
            </>)}       

            {messageIndex===14 && (<>
              <LabelHelp help={t('Refuse an Order.')}/>{' '}          
                <strong>{t('Item to Refuse Order: ')}{hexToHuman(username)}</strong><br /><br />
                <LabelHelp help={t('Order ID for Item.')}/>{' '} 
                <strong>{t('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  
            </>)}       

            {messageIndex===13 && (<>
              <LabelHelp help={t('Update Tracking Information.')}/>{' '}          
                <strong>{t('Update Tracking Information: ')}{hexToHuman(username)}</strong><br /><br />
                <LabelHelp help={t('Order ID for Item.')}/>{' '} 
                <strong>{t('Order ID: ')}</strong>{params[0]=messageId}<br />
                <br />                  

              <LabelHelp help={t('Enter a new Tracking Update.')}/> {' '}         
              {t_strong(' Tracking Update: ')}{t('(Max Character length is ')}{MAX_TRACKING_INFO}{')'}
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_TRACKING_INFO));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br />
              <LabelHelp help={t('Select Yes/No if this product has shipped.')}/> {' '}         
              <strong>{t('Product Shipped (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t(boolToString(params[2] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[2] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
              <br />
              <LabelHelp help={t('Select Yes/No if this product has been delivered.')}/> {' '}         
              <strong>{t('Product Delivered (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle2'
                label={<strong>{t(boolToString(params[3] = _isDelivered))}</strong>}
                onChange={() => {
                  toggleIsDelivered()
                  params[3] = !_isDelivered;
                  setParams([...params]);
                }}
                value={_isDelivered}
              />
      </>)}       

            {messageIndex===11 && (<>
              
              <LabelHelp help={t('Update Buyer Account.')}/>{' '}          
                {t_strong('Update Buyer Account: ')}{hexToHuman(username)}
                <br /><br />
                <LabelHelp help={t('Update Buyer Account.')}/>{' '} 
                {t_strong('Account ID: ')}{messageId}
                <br /><br />                   
              <LabelHelp help={t('Enter a new Buyer Name.')}/> {' '}         
                {t_strong(' Buyer Name: ')}{t('(Max Character length is ')}{MAX_BUYER_NAME}{')'}
              <Input 
                label={locationValue? params[0]=locationValue: params[0]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_BUYER_NAME));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              
              <LabelHelp help={t('Enter your Location.')}/> {' '}         
              {t_strong(' Location: ')}{t('(Max Character length is ')}{MAX_BUYER_LOCATION}{')'}
              <Input 
                label={moreInfoValue? params[1]=moreInfoValue: params[1]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value.slice(0,MAX_BUYER_LOCATION));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
      </>)}       

            {messageIndex===10 && (<>
             
              <LabelHelp help={t('Message the Seller.')}/>{' '}          
              {t_strong('Send a Message for Item: ')}{hexToHuman(username)}
              <br /><br />

                <LabelHelp help={t('Enter a Photo Link.')}/> {' '}   
              {t_strong('Item Id: ')}{' '}{params[0] = messageId}<br />                  
              <br /><br />

              <LabelHelp help={t('Enter a Photo Link.')}/> {' '}         
              {t_strong(' Photo Link: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br /><br />

              <LabelHelp help={t('Enter a message.')}/> {' '}         
              {t_strong(' Message: ')}{t('(Max Character length is ')}{MAX_MESSAGE}{')'}
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value.slice(0,MAX_MESSAGE));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
      </>)}       

      {(messageIndex===7 || messageIndex===8 || messageIndex===9) && (<>
              
              <LabelHelp help={t('Report a Problem.')}/>{' '}          
                {t_strong('Item Name: ')}{hexToHuman(username)}
                <br /><br />
              <LabelHelp help={t('Order ID')}/>{' '}  
                {t_strong('Order ID: ')}{params[0]=messageId}                
                <br /><br />
              <LabelHelp help={t('Enter a Photo or YouTube URL.')}/> {' '}         
              {t_strong(' Photo or YouTube URL: ')}{t('(Max Character length is ')}{MAX_PHOTO_LINK}{')'}
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_PHOTO_LINK));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br /><br />
              <LabelHelp help={t('Enter a comment about the problem.')}/> {' '}         
              {t_strong(' Problem Comment: ')}{t('(Max Character length is ')}{MAX_MESSAGE}{')'}
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value.slice(0,MAX_MESSAGE));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>

            </>)}       

            {messageIndex===6 && (<>
              
              <LabelHelp help={t('Item Rating.')}/>{' '}          
                {t_strong('Rate a Product or Service: ')}{hexToHuman(username)}
                <br /><br />
                <strong>{t('Item Id: ')}</strong>{' '}{params[0] = messageId}<br />                  
                <br /><br />
              <LabelHelp help={t('Enter a Item Rating (1 to 5 Stars).')}/> {' '}         
              {t_strong(' Product or Service Rating (1 to 5 Stars): ')}
              <Input 
                label={locationValue? params[1]=locationValue: params[1]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,1));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br /><br />
              <LabelHelp help={t('Enter a comment.')}/> {' '}         
              {t_strong(' Comment: ')}{t('(Max Character length is ')}{MAX_REVIEW}{')'}
              <Input 
                label={moreInfoValue? params[2]=moreInfoValue: params[2]=''}
                type="text"
                value={moreInfoValue}
                onChange={(e) => {
                  setMoreInfoValue(e.target.value.slice(0,MAX_REVIEW));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
      </>)}       


      {messageIndex===5 && (<>
              <LabelHelp help={t('Enter the delivery address of the Items in your Cart.')}/> {' '}         
              {t_strong(' Delivery Address: ')}{t('(Max Character length is ')}{MAX_DELIVERY_TO_ADDR}{')'}
              <Input 
                label={locationValue? params[0]=locationValue: params[0]=''}
                type="text"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value.slice(0,MAX_DELIVERY_TO_ADDR));
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
             
              <LabelHelp help={t('Enter the Total Price Amount of Items in Your Cart.')}/> {' '}         
              {t_strong(' Total Amount in Cart: ')}
      </>)}       

      {messageIndex===4 && (<>
          
              <LabelHelp help={t('Update Item Quantity.')}/>{' '}          
              {t_strong('Item Name: ')}{hexToHuman(username)}
              <br /><br />
              <LabelHelp help={t('This is the Item Id.')}/>{' '}          
              {t_strong('Item Id: ')}{' '}{params[0] = messageId}
              <br /><br />
              <LabelHelp help={t('Enter a the number of items to Order.')}/>{' '}          
              {t_strong('Quantity: ')}
              <Input 
                label={messageValue? params[1]=messageValue: params[1]=''}
                type="text"
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>       
        </>)}                  

        {messageIndex===3 && (<>
              <LabelHelp help={t('Remove Item from Cart.')}/>{' '}          
              {t_strong('Item Name: ')}{hexToHuman(username)}
              <br /><br />
              <LabelHelp help={t('This is the Item Id.')}/>{' '}          
              {t_strong('Item Id: ')}{' '}{params[0] = messageId}
        </>)}                  

        {messageIndex===2 && (<>
              <strong>{withHelp('Remove Store Bookmark: ', 'Remove a Bookmark store account.')}{hexToHuman(username)}</strong>
              <br /><br />
              <strong>{withHelp('Store Account: ', 'Select the store Account.')}</strong>{' '}
              {params[0] = recipientValue}<br />
              <InputAddress
                defaultValue={messageId}
                label={t('Store Account')}
                labelExtra={
                <Available
                    label={t('transferrable')}
                    params={recipientValue}
                />}
                onChange={setRecipientValue}
                type='account'
                value={recipientValue}
              />
        </>)}                  

        {messageIndex===1 && (<>
          
              <strong>{withHelp('Bookmark Store: ', 'Bookmark a store account.')}{hexToHuman(username)}</strong><br /><br />
              <strong>{withHelp('Store Account: ', 'Select the store Account.')}</strong>{' '}
              {params[0] = recipientValue}<br />
              <InputAddress
                defaultValue={messageId}
                label={t('Store Account')}
                labelExtra={
                <Available
                    label={t('transferrable')}
                    params={recipientValue}
                />}
                onChange={setRecipientValue}
                type='account'
                value={recipientValue}
              />
        </>)}                  

 
      {messageIndex===0 && (<>
              <LabelHelp help={t('Add Item to Your Cart.')}/>{' '}          
              <strong>{t('Item Name: ')}{hexToHuman(username)}</strong><br /><br />
              <LabelHelp help={t('This is the Item Id.')}/>{' '}          
              <strong>{t('Item Id: ')}</strong>{' '}
              {params[0] = messageId}<br /><br />
          <LabelHelp help={t('Enter a the number of items to Order.')}/>{' '}          
          <strong>{t('Quantity: ')}</strong>
          <Input 
                label={messageValue? params[1]=messageValue: params[1]=''}
                type="text"
                value={messageValue}
                onChange={(e) => {
                  setMessageValue(e.target.value);
                  setParams([...params]);
                }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>       
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
      </Modal.Actions>
    </Modal>
    </>}
  </>);
}

export default React.memo(CallModal);