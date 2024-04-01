// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import CopyInline from '../shared/CopyInline.js';
import { AccountName, IdentityIcon, LabelHelp } from '@polkadot/react-components';
import { Label } from 'semantic-ui-react';

export function hexToHuman (_hexIn: string): string {
    const { t } = useTranslation();
    return(isHex(_hexIn)? t(hexToString(_hexIn).trim()): '');
}

export function checkHttp ( url: string ): string {
    const withHttp: string = url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    return withHttp;
}

export function boolToHuman (_bool: boolean): string {
    const { t } = useTranslation();
    return (_bool? t('Yes'): t('No'));
} 

export function acctToShort (_acct: string): string {
    return (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
}

export function microToGeode (_num: number): number {
    return (_num>-1 ? _num/1000000000000: 0);
}

export function rateCheck (_num: number): number {
    return ((_num>0 && _num<6)? _num: 1);
}

export function numToPercent (_num: number): string {
    return ((_num>-1 && _num<=100)? _num.toString(): '0')+ ' %';
}

export function numCheck (_num: number): number {
    return (_num>-1 ? _num: 0);
}

export function hextoPhoto (_url: string): string {
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    return (isHex(_url) ? withHttp(hexToString(_url).trim()) : defaultImage);
}

export function dateCheck (_num: number): JSX.Element {
    const event = new Date(_num);
    const { t } = useTranslation();
    return (
        _num>0?
             <><i>{event.toDateString()}{' '}
                  {event.toLocaleTimeString()}{' '}</i></>:
            <><i>{t('No Date')}</i></>
        )
}

export function accountInfo(_acct: string): JSX.Element {
    return(<>
        <IdentityIcon value={_acct} size={20}/>
        <AccountName value={_acct} withSidebar={true}/>{' | '}
        {acctToShort(_acct)}{' '}
        <CopyInline value={_acct} label={''}/>
    </>)
}

export function withCopy(_str: string): JSX.Element {
    return(<>
    {_str}{' '}
    <CopyInline value={_str} label={''}/>
    </>)
}

export function withHelp(_str: string, _help: string): JSX.Element {
    const { t } = useTranslation();
    return(<>
    <LabelHelp help={t(_help)} />
    {' '}{t(_str)}
    </>)
}

export function numBadge(_num: number): JSX.Element {
    return(<>
      <Label circular size='small' color='blue'>
        {numCheck(_num)}
      </Label>
    </>)
  }

export function t_strong(_str: string): JSX.Element{
    const { t } = useTranslation();
    return(<><strong>{t(_str)}</strong></>)
  }

export function photoLink(_url: string, _title: string): JSX.Element {
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    return(<>
    {_url.length>2 &&
              <Label as='a' color='orange' circular
              href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
              target="_blank" 
              rel="noopener noreferrer">{_title}</Label> 
              }
    </>)
}

export function idNumberShort(_id: string): JSX.Element {
    return(<>
            {acctToShort(_id)}{' '}
            <CopyInline value={_id} label={''}/>
        </>)
}

export function timeStampToDate(tstamp: number): JSX.Element {
    const { t } = useTranslation();
    const noTime: string = t('No date available.');
    try {
     const event = new Date(tstamp);
     return (
          tstamp!=0?
          <><i> {event.toDateString()}{' '}
                {event.toLocaleTimeString()}{' '}</i></>:
          <><i> {noTime}</i></>
      )
    } catch(error) {
     console.error(error)
     return(
         <><i>{t('No Date')}</i></>
     )
    }
 }

 export function messageText(_msg: string, _bfrom: boolean, _url: string): JSX.Element {
    return(<>
    {_bfrom? <>
             <Label circular size='small' color='blue' pointing='left'>{hexToHuman(_msg)}</Label>{photoLink(_url, 'Link')}</>:
             <>
             {photoLink(_url, 'Link')}<Label circular size='small' color='grey' pointing='right'>{hexToHuman(_msg)}</Label>
             </>
    }
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

export function expose(_try: number, _want: number): JSX.Element {
    return(<>
    {t_strong('TEST ONLY: ')}
    {'Remove from Final Code:: '}<br />
    {'Message Index is '}
    {_try===_want ? <>{t_strong('Correct!')}</>:<>{t_strong('Incorrect!!')}</>}<br />
    {'Value: '}{_try}
    </>)

}

export function checkEmptySeller(_sellerName: string): JSX.Element {
    const { t } = useTranslation();
    const NO_ACCOUNT: string = t('A Seller Account for this user has not been created. Go to Update Settings to create a Store Front.');
    return(
        <>
            {(isHex(_sellerName) && hexToString(_sellerName)!='') ? 
                  <>
                  <strong>{hexToString(_sellerName)}</strong>
                  </>: 
                  <>
                      <br />{' ⚠️ '}{NO_ACCOUNT}<br />
                  </>}
        </>
    )
  }

