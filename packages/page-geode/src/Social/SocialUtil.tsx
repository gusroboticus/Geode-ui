// Copyright 2017-2024 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import CopyInline from '../shared/CopyInline.js';
import { Label } from 'semantic-ui-react';
import { Badge, AccountName, IdentityIcon, LabelHelp } from '@polkadot/react-components';

const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
const numCheck = (_num: number) => (_num>-1 ? _num: 0);
export function numBadge(_num: number): JSX.Element {return(<><Label circular size='small' color='blue'>{numCheck(_num)}</Label></>)}

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
        {<><Badge color='blue' icon='check'/>{t('(endorser No.')}{_index+1}{') '}
                        {' ('}<AccountName value={_acct} withSidebar={true}/>{') '}{shortAccount(_acct)} 
                        </>}
        </>
    )
}

export function msgIndexer (_msg: string, _msgId: string): JSX.Element{
    const { t } = useTranslation();
    return(<>
    {_msgId.length>0?<>
        <CopyInline value={_msgId} label={''}/><i>{t(_msg)}{_msgId}</i>{' '}
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

  