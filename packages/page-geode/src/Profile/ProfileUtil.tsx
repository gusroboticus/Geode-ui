// Copyright 2017-2024 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import CopyInline from '../shared/CopyInline.js';
import { LabelHelp, AccountName, IdentityIcon } from '@polkadot/react-components';
import { Label } from 'semantic-ui-react';

export function paramsToAddress(_param: any): string {
    return(
       _param? JSON.stringify(_param).slice(1, _param.length+1): '5CsCgrqDCtC3zyGr1uJNA2SzyFXqqtVcmwGqzk18xYG6JSfW'
    )
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

export function withHelp(_str: string, _help: string): JSX.Element {
    const { t } = useTranslation();
    return(<>
    <LabelHelp help={t(_help)} />
    {' '}{t(_str)}
    </>)
}

export function hexToHuman (_hexIn: string): string {
    const { t } = useTranslation();
    return(isHex(_hexIn)? t(hexToString(_hexIn).trim()): '');
}

export function withHttp ( url: string ): string {
    const withHttp: string = url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    return withHttp;
}

export function acctToShort (_acct: string): string {
    return (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
}

export function linkToShort (_link: string): string {
    return (_link.length>25? _link.slice(0,25)+'...': _link);
}

export function t_strong(_str: string): JSX.Element{
    const { t } = useTranslation();
    return(<><strong>{t(_str)}</strong></>)
  }


export function accountTitle(_id: string, _title: string): JSX.Element {
    const { t } = useTranslation();
    return(
        <>
        <IdentityIcon value={_id} />
        <strong>{t(_title)}</strong>
        <AccountName value={_id} withSidebar={true}/>
        {' - '}{acctToShort(_id)}{' '}
        <CopyInline value={_id} label={''}/>                    
        <br />
        </>
    )
}

export function accountDetail(_id: string): JSX.Element {
    //const { t } = useTranslation();
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

export function linker(_link: string): JSX.Element {
    return(
        <>
        {_link != 'http://' && (
                  <>
                  <Label  as='a'
                  color='orange'
                  circular
                  href={_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  >{'Link'}
                  </Label>{' '}
                  {linkToShort(_link)}
                  </>
                )}
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

export function showLink(_link: number): JSX.Element {
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
        return(<>
        {isHex(_link)? 
            <>
            <Label  as='a'
              color='orange'
              circular
              href={isHex(_link) ? withHttp(hexToString(_link).trim()) : ''} 
              target="_blank" 
              rel="noopener noreferrer"
              >{'Link'}
              </Label>{' '}
              {isHex(_link) ? linkToShort(withHttp(hexToString(_link).trim())) : ''}
              <br />    
            </>:
            <>{''}</>}   
    </>)
}