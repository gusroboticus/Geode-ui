// Copyright 2017-2024 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import CopyInline from '../shared/CopyInline.js';
import { Table, Label } from 'semantic-ui-react';
import { Button, Badge, AccountName, IdentityIcon, LabelHelp } from '@polkadot/react-components';

const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
const numCheck = (_num: number) => (_num>-1 ? _num: 0);

export function boolToHuman (_bool: boolean): string {
  const { t } = useTranslation();
  return (_bool? t('Yes'): t('No'));
} 

export function numBadge(_num: number): JSX.Element {return(<><Label circular size='small' color='blue'>{numCheck(_num)}</Label></>)}

export function idToShort (_list: string): JSX.Element {
  return(<>
      {_list.length>10 ? _list.slice(0,10)+'...' : _list}{' '}<CopyInline value={_list} label={''}/>{}
      </>);
}

export function infoMessage(_msg: string, _target: string): JSX.Element {
  const { t } = useTranslation();
  return(<>
            <Badge icon='info'color={'blue'} />{t(_msg)}{' ('}<strong>{hextoHuman(_target)}</strong>{') '}
  </>)
}

export function infoBlocked(_num: number): JSX.Element {
  const { t } = useTranslation();
  return(<>
    <Badge icon='hand'color={'red'}/>{t(' Blocked: ')}<strong>{_num}</strong>
    </>)
}

export function geodeToZeo(_string: string): string {
  const _num = +_string * 1000000000000;
  return(_num.toString())
}

export function BNtoGeode(_num: number): JSX.Element {
  return(<>
      {_num>0? <>{(_num/1000000000000).toString()}</>: <>{'0'}</>}
  </>)
}

export function unitToGeode(_unitIn: number): string{
    const _convert: number = 1000000000000;
    const _Out: string = (_unitIn / _convert).toString();
    return(_Out)
}

export function hextoHuman(_hexIn: string): string {
    const { t } = useTranslation();
    const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
    return(_Out)
  }

  export function paramtoAccount(_param: string): JSX.Element {
    const ACCOUNTIDLENGTH: number = 48;
    const { t } = useTranslation();
    const _acct: string = _param.slice(2, _param.length-2);
    return(<>
    {_acct.length>ACCOUNTIDLENGTH -1 ? <>
        <IdentityIcon value={_acct}/>
        {' | '}<AccountName value={_acct} withSidebar={true}/>{' | '}{shortAccount(_acct)} 
    </> : <> {t('Not a Valid Account ID')}</>}
    </>)
  }

export function endorserBadge(_acct: string, _index: number): JSX.Element{
    const { t } = useTranslation();
    return(
        <>
        {<><Badge color='blue' icon='check'/>{t('(endorser No.')}{_index}{') '}
                        {' ('}<AccountName value={_acct} withSidebar={true}/>{') '}{shortAccount(_acct)} 
                        </>}
        </>
    )
}

export function msgIndexer (_msg: string, _msgId: string): JSX.Element{
    const { t } = useTranslation();
    return(<>
    {_msgId.length>0?<>
        <CopyInline value={_msgId} label={''}/><i>{t(_msg)}{_msgId.slice(0,7)+'...'}</i>{' '}
        <LabelHelp help={t('Copy Message ID. ')} />
        <br />
    </>:
    <>{t(_msg)}{t('No Message Index')}</>}
    </>)
}


  export function shortAccount (_acct: string): JSX.Element {
    const { t } = useTranslation();
    return (<>
    <>
    {_acct.length>0 ? <>
        {_acct.length>7 ? _acct.slice(0,7)+'...' : _acct}
        {' '}
        <CopyInline value={_acct} label={''}/>
    </>: <>{t('No Account')}</>}
    </>
    </>) 
}

export function accountInfo(_acct: string): JSX.Element {
    return(<>
        <IdentityIcon value={_acct}/>{' | '}
        <AccountName value={_acct} withSidebar={true}/>{' | '}
        {shortAccount(_acct)}{' '}
    </>)
}

export function userInfo(_searchedAccount:string, _username: string): JSX.Element {
    return(<>
        <IdentityIcon size={32} value={_searchedAccount} />
        {' '}
        <AccountName value={_searchedAccount} withSidebar={true}/>
        {' '}
        {hextoHuman(_username).trim()!='' && (<><strong>{'@'}{hextoHuman(_username)}</strong></>)}
        {' '}
    </>)
}


export function acctToShort (_acct: string): string {
  return (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
}

export function blockedAccount(_blkd: string): JSX.Element {
  return(<>
      {_blkd.length>0? <>{' ('}<AccountName value={_blkd} withSidebar={true}/>{') '}</>: <>{''}</>}
  </>)
}

export function paidAcctHeader(_username: string, _fromAcct: string, _endorserCount: number, _timeStamp: number): JSX.Element {
  const { t } = useTranslation();
  return(<>
  <strong>{t('@')}</strong>
                         <strong>{hextoHuman(_username)}</strong>
                              {' ('}<AccountName value={_fromAcct} withSidebar={true}/>{') '}
                              {' '}<Label color='blue' circular>{_endorserCount}</Label>
                              {' '}{timeStampToDate(_timeStamp)}{' '}
  </>)
}

export function paidEndorseHeader(_endorserPayment: number, _paidEndorserMax: number, _endorserCount: number): JSX.Element {
  const { t } = useTranslation();
  return(<>
     {_endorserPayment<=0? <>{t('There are no payments for this Ad')}</>:<>
          {(_paidEndorserMax-_endorserCount)<=0? <>{t('This Ad has been paid out!')}</>:<>
          {' 💰 '}<i><strong>{t('Payment: ')}{BNtoGeode(_endorserPayment)}{' Geode'}{t(', Paid Endorsements Left: ')}{_paidEndorserMax-_endorserCount}</strong></i>
          </>} 
    </>}                    
    </>)
}

export function accountIdentity(_id: string): JSX.Element {
  return(
      <>
      <IdentityIcon value={_id} />
      <AccountName value={_id} withSidebar={true}/>
      {' - '}{acctToShort(_id)}{' '}
      <CopyInline value={_id} label={''}/>                    
      <br />
      </>
  )
}

export function autoCorrect(arr: string[], str: string): JSX.Element {
    const { t } = useTranslation();
    arr.forEach(w => str = str.replaceAll(w, '****'));
    arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
    arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
    arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
    return (
    <>{t(str)}</>)
}

export function timeStampToDate(tstamp: number): JSX.Element {
    const { t } = useTranslation();
    try {
     const event = new Date(tstamp);
     return (
          <><i>{event.toDateString()}{' '}
               {event.toLocaleTimeString()}{' '}</i></>
      )
    } catch(error) {
     console.error(error)
     return(
         <><i>{t('No Date')}</i></>
     )
    }
}

export function hexToHuman (_hexIn: string): string {
    const { t } = useTranslation();
    return(isHex(_hexIn)? t(hexToString(_hexIn).trim()): '');
}

export function t_strong(_str: string): JSX.Element{
    const { t } = useTranslation();
    return(<><strong>{t(_str)}</strong></>)
  }

export function postHeader(_username: string, _fromAcct: string, _endorserCount: number, _timestamp: number ): JSX.Element {
    const { t } = useTranslation();
            return(
            <>
            {_username.length>0? 
            <><strong>{t('@')}</strong>
              <strong>{hextoHuman(_username)}</strong>
              {' ('}<AccountName value={_fromAcct} withSidebar={true}/>{') '}
              {' '}<Label color='blue' circular>{_endorserCount}</Label>
              {' '}{timeStampToDate(_timestamp)}{' '}
              {' '}</>:
            <>{t('No User Account Found')}</>}
              </>            
            )
}

export function searchHeader(_title: string, _username: string, _fromAcct: string, _endorserCount: number, _timestamp: number): JSX.Element {
  const { t } = useTranslation();
            return(<>
             <strong>{t(_title)}</strong>
                          <strong>{hextoHuman(_username)}</strong>
                            {' ('}<AccountName value={_fromAcct} withSidebar={true}/>{') '}
                            {' '}<Label color='blue' circular>{_endorserCount}</Label>
                            {' '}{timeStampToDate(_timestamp)}{' '}
                            {' '}
            </>)
}

export function replyHeader(_username: string, _fromAcct: string, _timestamp: number ): JSX.Element {
    const { t } = useTranslation();
            return(
            <>
            {_username.length>0? 
            <><strong>{t('@')}</strong>
              <strong>{hextoHuman(_username)}</strong>
              {' ('}<AccountName value={_fromAcct} withSidebar={true}/>{') '}
              {' '}{timeStampToDate(_timestamp)}{' '}
              {' '}</>:
            <>{t('No User Account Found')}</>}
              </>            
            )
}

export function linker(_link2: string): JSX.Element{
    const { t } = useTranslation();
    return(<>
            {' '}
            <Label  as='a'
                    color='orange'
                    circular
                    href={isHex(_link2) ? withHttp(hexToString(_link2).trim()) : ''} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >{t('Link')}
                    </Label>{' '}
                    {isHex(_link2) ? (
                        <LabelHelp help={withHttp(hexToString(_link2).trim())} />
                        ) : ' '}
    </>)
}
           
export function showAccount(str: string): JSX.Element { 
    const { t } = useTranslation();
    try{
     return(  <>
       {str.length>0 && (<>
         <IdentityIcon value={str} />
         {' ('}<AccountName value={str} withSidebar={true}/>{') '}
       </>)}
       </>
       )
    } catch(e) {
     console.log(e);
     return(<>
     {t('No accounts to show')}
     </>)
    }
   }

export function pagePager(pgIndex: number, maxIndex: number, countPost: number): JSX.Element {
    const currPgIndex: number = (pgIndex > 0) ? pgIndex : (pgIndex < countPost) ? pgIndex : countPost;
    const _indexer: number = maxIndex;
    const { t } = useTranslation();
    return(
      <div>
        {countPost>0 && (<>
        <Table>
          <Table.Row>
            <Table.Cell>
             <Button icon={'minus'} 
              label={t('Prev Page')}
              isDisabled={currPgIndex===1}
              onClick={()=> {<>{currPgIndex-_indexer>0 ? pgIndex=currPgIndex-_indexer : 1}</>}} />
             <Button icon={'plus'} 
              label={t('Next Page')}
              isDisabled={currPgIndex>countPost}
              onClick={()=> {<>{currPgIndex<countPost-1 ? currPgIndex+_indexer : countPost}</>}}/>
             <LabelHelp help={t(' Use these buttons to page through Posts.')} /> 
            </Table.Cell>
          </Table.Row>
        </Table>
        </>)}
      </div>
    )
   }

export function pageIndexer(pgIndex: number, maxIndex: number, countPost: number): JSX.Element {
    try {
      const currPgIndex: number = (pgIndex > 0) ? pgIndex : (pgIndex < countPost) ? pgIndex : countPost;
      const _indexer: number = 1;  
      const { t } = useTranslation();
      return (
        <div>
          <Table>
            <Table.Row>
              <Table.Cell>
               <Button icon={'home'} 
                isDisabled={countPost===0}
                onClick={()=> {<>{pgIndex= 1}</>}}/>
               <Button icon={'minus'} 
                isDisabled={countPost===0}
                onClick={()=> {<>{currPgIndex-_indexer>0? pgIndex=currPgIndex-_indexer : 1}</>}}/>
               <Button icon={'plus'} 
                isDisabled={countPost===0}
                onClick={()=> {<>{currPgIndex<countPost-1? pgIndex=currPgIndex+_indexer : countPost}</>}}/>
               <Button icon={'sign-in-alt'}
                isDisabled={countPost===0}
                onClick={()=> {<>{(countPost>0? pgIndex=countPost: 1)}</>}}/>
               <strong>{t(' | Showing Post: ')}{pgIndex<countPost? pgIndex: countPost}{' thru '}{
               (pgIndex+maxIndex) < countPost? pgIndex+maxIndex: countPost}</strong>
               <LabelHelp help={t(' Use these buttons to page through your Posts.')} /> 
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>
      )  
    } catch(e) {
      console.log(e)
      return(<>{'Nothing to show.'}</>)
    }
   }


  