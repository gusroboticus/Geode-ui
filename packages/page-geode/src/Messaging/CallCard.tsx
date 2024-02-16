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

import { styled, Expander, LabelHelp, Badge, Card, Button, Dropdown, InputAddress, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import InputMegaGas from '../shared/InputMegaGas.js';
import Params from '../shared/Params.js';
import { useTranslation } from '../shared/translate.js';
import useWeight from '../useWeight.js';
import AllowedDetails from './AllowedDetails.js';
import SettingsDetails from './SettingsDetails.js';

import { getCallMessageOptions } from '../shared/util.js';
import InBoxDetails from './InBoxDetails.js';
import MyListsDetails from './MyListsDetails.js';
import FindListsDetails from './FindListsDetails.js';
import SubListsDetails from './SubListsDetails.js';
import MyPaidListsDetails from './MyPaidListsDetails.js';
import MyPaidInBoxDetails from './MyPaidInboxDetails.js';
import MyGroupsDetails from './MyGroupsDetails.js';
import FindGroupsDetails from './FindGroupsDetails.js';
import SearchAccountDetails from './SearchAccountDetails.js';
import SearchKeywordDetails from './SeacrhKeywordDetails.js';
import FindAccountDetails from './FindAccountDetails.js';
import UserSettingsDetails from './UserSettingsDetails.js';

interface Props {
  className?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function CallCard ({ className = '', contract, messageIndex, 
                    onCallResult, onChangeMessage, onClose }: 
                    Props): React.ReactElement<Props> | null {
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
  const boolToString = (_bool: boolean) => _bool? 'Yes': 'No';

  const [_username, setUsername] = useState<string>('');
  const [_myInterest, setMyInterest] = useState<string>('');
  const [_feeBalance, setFeeBalance] = useState<string>('');
  const [_fileURL, setFileURL] = useState<string>('');
  const [_isHide, toggleIsHide] = useToggle(false);

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
  const isClosed = (isCalled && (messageIndex===26 || messageIndex===27 || 
                                 messageIndex===28 || messageIndex===29 ||
                                 messageIndex===30 || messageIndex===31 ||
                                 messageIndex===32 || messageIndex===33 ||
                                 messageIndex===35 || messageIndex===34 ||
                                 messageIndex===36 || messageIndex===37 ||
                                 messageIndex===38 || messageIndex===39));
                               
  return (
    <Card >
        <h2>
        <Badge icon='info' color={'blue'} />   
        <strong>{t(' Geode Private Messaging ')}{' '}</strong>
        </h2>
        <Expander 
            className='viewInfo'
            isOpen={false}
            summary={<strong>{t('Instructions: ')}</strong>}>
              {messageIndex===39 && (<>
                <h2><strong>{t('Private Messaging - Settings Analysis')}</strong></h2><br />
                <strong>{t('Instructions for Settings Analysis: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction. ')}<br /> 
                {'(2) '}{t('Click View ')}<br />
                <br />
              </>)}
              {messageIndex===38 && (<>
                <h2><strong>{t('Private Messaging - Settings Analysis')}</strong></h2><br />
                <strong>{t('Instructions for Settings Analysis: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction. ')}<br /> 
                {'(2) '}{t('Click View ')}<br />
                <br />
              </>)}
              {messageIndex===37 && (<>
                <h2><strong>{t('Private Messaging - Find Accounts by Interest Words')}</strong></h2><br />
                <strong>{t('Instructions for Finding Accounts based on Interest Words: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction. ')}<br /> 
                {'(2) '}{t('Enter the Interest word to Search (⚠️ NOTE: this is Case Sensitive)')}<br />
                {'(3) '}{t('Click View ')}<br />
                <br />
              </>)}
              {messageIndex===36 && (<>
                <h2><strong>{t('Private Messaging - Find a List by Keyword.')}</strong></h2><br />
                <strong>{t('Instructions for Finding a List by using a Search Keyword: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction. ')}<br /> 
                {'(2) '}{t('Enter a Search Keyword (⚠️ NOTE: this is Case Sensitive)')}<br />
                {'(3) '}{t('Click View ')}<br /><br />
                {t('⚠️ Note: You can Unsubscribe from a List by clicking the Unsubscribe Button or Join the List by Clicking Join List.')}
                <br />
              </>)}
              {messageIndex===35 && (<>
                <h2><strong>{t('Private Messaging - Your Subscribed Lists')}</strong></h2><br />
                <strong>{t('Instructions for getting your Subscribed Lists: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction. ')}<br /> 
                {'(2) '}{t('Click View ')}<br /><br />
                {t('⚠️ Note: You can Unsubscribe from a List by clicking the Unsubscribe Button.')}

                <br />
              </>)}
              {messageIndex===34 && (<>
                <h2><strong>{t('Private Messaging - Paid Lists')}</strong></h2><br />
                <strong>{t('Instructions for Managing Your Paid Lists: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction and then Click View')}<br /> 
                {'(2) '}{t('You can create New Paid Lists, Send Messages or Delete existing Paid Lists.')}<br />
                <br />
                {t('⚠️ Please Note: To view your Paid Lists got to your PAID Inbox.')}
              </>)}

              {messageIndex===33 && (<>
                <h2><strong>{t('Private Messaging - My Lists')}</strong></h2><br />
                <strong>{t('Instructions for Managing Your Lists: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction and then Click View')}<br /> 
                {'(2) '}{t('You can create New Lists or Delete existing Lists.')}<br />
                <br />
                {t('⚠️ Please Note: To view your Lists got to your inbox.')}
              </>)}
              {messageIndex===32 && (<>
                <h2><strong>{t('Private Messaging - Search for Groups by Keyword')}</strong></h2><br />
                <strong>{t('Instructions for Searching for Groups by Keywords: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t('Enter the Keyword you wish to Search for Groups.')}<br />
                {'(3) '}{t('Click View')}<br />
              </>)}
              {messageIndex===31 && (<>
                <h2><strong>{t('Private Messaging - Search Inbox by Accounts')}</strong></h2><br />
                <strong>{t('Instructions for Searching your Inbox by Accounts: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t('Select the Account you wish to Search for in your Inbox.')}<br />
                {'(3) '}{t('Click View')}<br />
              </>)}
              {messageIndex===30 && (<>
                <h2><strong>{t('Private Messaging - Search Inbox by Keywords')}</strong></h2><br />
                <strong>{t('Instructions for Searching your Inbox by Keywords: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t('Enter Keywords you wish to Search for in your Inbox.')}<br />
                {'(3) '}{t('Click View')}<br />
              </>)}
              {messageIndex===29 && (<>
                <h2><strong>{t('Private Messaging - Managing Your Groups')}</strong></h2><br />
                <strong>{t('Instructions for Managing Your Groups: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t('Click View')}<br /><br />
              </>)}
              {messageIndex===28 && (<>
                <h2><strong>{t('Private Messaging - Managing Your Inbox')}</strong></h2><br />
                <strong>{t('Instructions for Managing the Allowed Accounts in Your Inbox: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t('Click View')}<br /><br />
              </>)}
              {messageIndex===27 && (<>
                <h2><strong>{t('Private Messaging - MyPaid Inbox')}</strong></h2><br />
                <strong>{t('Instructions for Getting your PAID Inbox: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t('Click View')}<br /><br />
                {t('! IMPORTANT: You Get Paid for receiving these messages. To Block messages from your Inbox click the Block Button. ')}

              </>)}
              {messageIndex===26 && (<>
                <h2><strong>{t('Private Messaging - Get Your Inbox')}</strong></h2><br />
                <strong>{t('Instructions for Getting your Inbox: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br /> 
                {'(2) '}{t('Click View')}<br /><br />
                {t('NOTE: ')}<br />
                {t(' Go to Allowed Accounts to Add people to your Inbox.')}<br />
                {t(' To Start a conversation with a person in your Allowed Accounts click Start Conversation.')}<br />
                {t(' Important: To send a message to another account the recipient of the message must add you to their allowed acounts.')}<br />
              </>)}

              {messageIndex===16 && (<>
                <strong>{t('Instructions for Making a List: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br />
                {'(2) '}{t('Create an @List Name for this New List.')}<br /> 
                {'(3) '}{t('Select Private (Yes) or Public (No). ')}<br /> 
                {'(4) '}{t('Add a List description. ')}            
                <br /><br />
                {t('⚠️ Please Note: Click Submit to execute this transaction. ')}
              </>)}
              {messageIndex===13 && (<>
                <strong>{t('Instructions for Leaving a Group: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br />
                {'(2) '}{t('Enter the Group ID.')}<br /> 
                {'(3) '}{t('Click Submit')}<br /> 
               </>)}
              {messageIndex===10 && (<>
                <strong>{t('Instructions for Joining a Group: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br />
                {'(2) '}{t('Enter the Group ID.')}<br /> 
                {'(3) '}{t('Click Submit')}<br /> 
               </>)}
               {messageIndex===9 && (<>
                <strong>{t('Instructions for Making a New Group: ')}</strong><br />
                {'(1) '}{t('Select the Account to use for this transaction.')}<br />
                {'(2) '}{t('Enter the name of the New Group.')}<br /> 
                {'(3) '}{t('Select whether this will be a Public or Private Group.')}<br /> 
                {'(4) '}{t('Enter a Description for the New Group.')}<br /> 
                {'(5) '}{t('Enter the First Message to send to the Group.')}<br />
                {'(6) '}{t('You can add a URL to File or leave blank.')}<br />
                {'(7) '}{t('Click Submit')}
                <br /><br />
                {t('⚠️ Note: You can update your Group as necessary by clicking the Update Group button in My Groups. ')}
               </>)}
              {messageIndex===0 && (<>
                <strong>{t('Instructions for Updating Your User Settings: ')}</strong><br />
                {'(1) '}{t('Enter your new user name.')}<br />
                {'(2) '}{t('Enter interest words if you wish to receive PAID messages. (Seperate Interest words by commas.)')}<br /> 
                {'(3) '}{t('Enter the Fee you wish to charge for receiving PAID messages.')}<br />
                {'(4) '}{t('Select Private (Yes) or Public (No) for you Account. Private Accounts are not visible in Searches. ')}<br /> 
                {'(5) '}{t('Click Submit')}            
                <br /><br />
                {t('⚠️ Note: You can change or update your account whenever you wish. ')}
              </>)}
        </Expander>
        <br />
        {isTest && (
          <InputAddress
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
          />
        )}

        {!isClosed && (<>
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
              label={t('Profile Item')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
              isDisabled
            />              
            </>
            )}
            {messageIndex!=0  && messageIndex!=9 && 
             messageIndex!=16 && !isClosed && (<>             
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

            {messageIndex===0 && (<>
              <LabelHelp help={t('Enter your user name.')}/>{' '}          
              <strong>{t('User Name: ')}</strong>
              <Input 
                  label={_username.length>0? params[0]=_username: params[0]=''}
                  type="text"
                  value={_username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{'OK'}</>:<>{'Enter Value'}</>}</Label>
              </Input>

              <LabelHelp help={t('Enter your interest words seperated by a comma.')}/>{' '}          
              <strong>{t('Interest Words: ')}</strong>
              <Input 
                  label={_myInterest.length>0? params[1]=_myInterest: params[1]=''}
                  type="text"
                  value={_myInterest}
                  onChange={(e) => {
                    setMyInterest(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[1]? 'blue': 'grey'}>
                    {params[1]? <>{'OK'}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
            
              <LabelHelp help={t('Enter your Fee Balance.')}/>{' '}          
              <strong>{t('Fee Balance: ')}</strong>
              <Input 
                  label={_feeBalance.length>0? params[2]=_feeBalance: params[2]=''}
                  type="text"
                  value={_feeBalance}
                  onChange={(e) => {
                    setFeeBalance(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{'OK'}</>:<>{t('Enter Value')}</>}</Label>
              </Input>

              <br /><br />
              <LabelHelp help={t('Select Yes/No to Hide Your Account.')}/> {' '}         
              <strong>{t('Hide Your Account: ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t(boolToString(params[3] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[3] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
            </>)}

            {messageIndex===9 && (<>
              <LabelHelp help={t('Enter your New Group name.')}/>{' '}          
              <strong>{t('New Group Name: ')}</strong>
              <Input 
                  label={_username.length>0? params[0]=_username: params[0]=''}
                  type="text"
                  value={_username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>

              <br /><br />
              <LabelHelp help={t('Select Yes/No to Make this Group Private/Public.')}/> {' '}         
              <strong>{t('Make Group Private (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t(boolToString(params[1] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[1] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
              <br /><br />
              <LabelHelp help={t('Enter the Group description.')}/>{' '}          
              <strong>{t('Group Description: ')}</strong>
              <Input 
                  label={_myInterest.length>0? params[2]=_myInterest: params[2]=''}
                  type="text"
                  value={_myInterest}
                  onChange={(e) => {
                    setMyInterest(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br /><br />
              <LabelHelp help={t('Enter the First Message to this Group.')}/>{' '}          
              <strong>{t('First Group Message: ')}</strong>
              <Input 
                  label={_feeBalance.length>0? params[3]=_feeBalance: params[3]=''}
                  type="text"
                  value={_feeBalance}
                  onChange={(e) => {
                    setFeeBalance(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[3]? 'blue': 'grey'}>
                    {params[3]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
              <br /><br />
              <LabelHelp help={t('Enter a File URL.')}/>{' '}          
              <strong>{t('File URL: ')}</strong>
              <Input 
                  label={_fileURL.length>0? params[4]=_fileURL: params[4]=''}
                  type="text"
                  value={_fileURL}
                  onChange={(e) => {
                    setFileURL(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[4]? 'blue': 'grey'}>
                    {params[4]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>
            
            </>)}



            {messageIndex===16 && (<>
              <LabelHelp help={t('Enter your New List name.')}/>{' '}          
              <strong>{t('New List Name: ')}</strong>
              <Input 
                  label={_username.length>0? params[0]=_username: params[0]=''}
                  type="text"
                  value={_username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[0]? 'blue': 'grey'}>
                    {params[0]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
              </Input>

              <br /><br />
              <LabelHelp help={t('Select Yes/No to Make this Private/Public.')}/> {' '}         
              <strong>{t('Make List Private (Yes/No): ')}</strong>
              <br /><br />
              <Toggle
                className='booleantoggle'
                label={<strong>{t(boolToString(params[1] = _isHide))}</strong>}
                onChange={() => {
                  toggleIsHide()
                  params[1] = !_isHide;
                  setParams([...params]);
                }}
                value={_isHide}
              />
              <br /><br />
              <LabelHelp help={t('Enter the List description.')}/>{' '}          
              <strong>{t('List Description: ')}</strong>
              <Input 
                  label={_myInterest.length>0? params[2]=_myInterest: params[2]=''}
                  type="text"
                  value={_myInterest}
                  onChange={(e) => {
                    setMyInterest(e.target.value);
                    setParams([...params]);
                  }}
              ><input />
              <Label color={params[2]? 'blue': 'grey'}>
                    {params[2]? <>{t('OK')}</>:<>{t('Enter Value')}</>}</Label>
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

        {outcomes.length > 0 && messageIndex===39 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <UserSettingsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===38 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <SettingsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===37 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <FindAccountDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===36 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <FindListsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===35 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <SubListsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===34 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <MyPaidListsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===33 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <MyListsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===32 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <FindGroupsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===31 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <SearchAccountDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===30 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <SearchKeywordDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===29 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <MyGroupsDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}
        {outcomes.length > 0 && messageIndex===28 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <AllowedDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===27 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <MyPaidInBoxDetails
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
            </div>
        )}

        {outcomes.length > 0 && messageIndex===26 && (
            <div>
            {outcomes.map((outcome, index): React.ReactNode => (
              <InBoxDetails
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


