// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import CopyInline from '../shared/CopyInline.js';
import { LabelHelp, AccountName, IdentityIcon } from '@polkadot/react-components';
import { Label } from 'semantic-ui-react'

export function paramToString(_param: string) :string {
    const { t } = useTranslation();
        return(
                _param.length>2? hexToHuman(_param).trim(): t('No data set.')
        )
}

export function linker(_link: string) : JSX.Element {
    const { t } = useTranslation();
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
        return(<>
                {hexToString(_link).length>5 && <>
                    <Label  as='a' color='orange' circular size={'mini'}
                        href={isHex(_link) ? withHttp(hexToString(_link).trim()) : ''} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >{t('Link')}
                    </Label>{' '}                
                </>}
        </>)
}

export function removeSpaces(arr: string[]) {
    return arr.map(_w => (_w.trim()).toLowerCase() // Normalize
    .replace(/["“”(\[{}\])]|\B['‘]([^'’]+)['’]/g, '$1') // Strip quotes and brackets
    .replace(/[‒–—―…]|--|\.\.\./g, ' ') // Strip dashes and ellipses
    .replace(/[!?;:.,]\B/g, '')); // Strip punctuation marks
}

export function removeDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

export function feeAverage(_fee: number[]): string {
    return(_fee.reduce((a,b) => a+b)/_fee.length).toString()
}

export function hexToHuman (_hexIn: string): string {
    const { t } = useTranslation();
    return(isHex(_hexIn)? t(hexToString(_hexIn).trim()): '');
}

export function withCopy(_str: string): JSX.Element {
    return(<>
    {_str}{' '}
    <CopyInline value={_str} label={''}/>
    </>)
}

export function GeodeToZeo(_string: string): string {
    const _num = +_string * 1000000000000;
    return(_num.toString())
  }

export function BNtoGeode(_num: number): JSX.Element {
    return(<>
        {_num>0? <>{(_num/1000000000000).toString()}</>: <>{'0'}</>}
    </>)
}

export function acctToShort (_acct: string): string {
    return (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
}

export function idToShort (_list: string): JSX.Element {
    return(<>
        {_list.length>10 ? _list.slice(0,10)+'...' : _list}{' '}<CopyInline value={_list} label={''}/>{}
        </>);
}

export function t_strong(_str: string): JSX.Element{
    const { t } = useTranslation();
    return(<><strong>{t(_str)}</strong></>)
}

export function boolToHuman (_bool: boolean): string {
    const { t } = useTranslation();
    return (_bool? t('Yes'): t('No'));
} 

export function booltoPublic(_bool: boolean): string {
    const { t } = useTranslation();
    return(_bool? t('Private'): t('Public'))
}


export function booleanToHuman(_bool: boolean): JSX.Element {
    return(<>
    <Label 
      circular
      color='grey'
      >{_bool? 'Hidden': 'Show'}
    </Label>
    </>
    )
  }

export function accountName(_id: string): JSX.Element {
    return(
        <>
        <AccountName value={_id} withSidebar={true}/>
        {' - '}{acctToShort(_id)}{' '}
        <CopyInline value={_id} label={''}/>                    
        
        </>
    )
}

export function allowedAccounts(_acct: string): JSX.Element {
    return(<>
                  <IdentityIcon value={_acct} />
              {' ('}<AccountName value={_acct} withSidebar={true}/>{') '}
              {' '}{_acct}{' '}
              <CopyInline value={_acct} label={''}/>  
              <br />
    
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

 export function ShowOrderByAlpha(inStr: string, inArr: string[]): JSX.Element {
    return(
            <>{inArr.map((_word) => 
                      <>
                      {_word.trim()!='' && (
                          <div>
                          <CopyInline value={_word.trim()} label={''}/>
                          {inStr.split(_word.trim()).length - 1 > 0 ? (
                          <>
                          <strong>{_word.trim()}{': '}</strong>
                          <Label color={inStr.split(_word.trim()).length - 1 < 2 ? 'grey' : 'blue'} 
                              circular>
                              {inStr.split(_word.trim()).length - 1}
                          </Label>
                          </>
                          ) : (
                          <>{_word.trim()}</>
                          )
                      }
                      <br />
                      </div>
                )}</>)}</>
              )
  }

  export function messageBox(msg: string, fromAcct: string, point: string): JSX.Element {
    return(<>
      {point==='right'? <>
                    <Label color='blue' textAlign='left' pointing= 'right'>
                            {hexToHuman(msg)}{' '}
                    </Label>
                    <IdentityIcon size={22} value={fromAcct} />
            </>: <>
                    <IdentityIcon size={22} value={fromAcct} />
                    <Label color='grey' textAlign='left' pointing= 'left'>
                            {hexToHuman(msg)}{' '}
                    </Label>
                    
            </>}
    </>)
  }

  export function listMessageBox(message: string, fromAcct: string, username: string): JSX.Element {
    return(<>
                {hexToHuman(message).length>0 && <>
                    <IdentityIcon value={fromAcct} />
                      {' ('}<AccountName value={fromAcct} withSidebar={true}/>{') '}
                      {hexToHuman(username)}
                      <Label color='blue' textAlign='left' pointing='left'>
                          {hexToHuman(message)}
                      </Label>
                </>}
    </>)
  }

  export function userIdentity(_username: string, _acct: string): JSX.Element {
    return(<>
                <IdentityIcon size={22} value={_acct} />{' '}
                <strong>{' @'}{hexToHuman(_username)}</strong>
                {' ('}<AccountName value={_acct} withSidebar={true}/>{') '}
    </>)
  }

  export function listName(_username: string): JSX.Element {
    return(<>
            <strong>{' @'}{hexToHuman(_username)}</strong>
    </>)
  }

  export function numBlueButton(_num: number): JSX.Element {
    return( <Label circular color='blue' size='small'>{_num}</Label> )
  }

  export function numGreyButton(_num: number): JSX.Element {
    return( <Label circular color='grey' size='small'>{_num}</Label> )
}

export function searchResults(_str: string[]): JSX.Element {
    const { t } = useTranslation();
    return(<>
    <LabelHelp help={t(' Search Results - You can refine your search by adding up to three keywords. ')}/>{' '}
    {t_strong(' Search Results for: ')}{' '}
    {_str.length>0 ? <>
        {' '}{hexToHuman(_str[0])}{' '}{hexToHuman(_str[1])}{' '}{hexToHuman(_str[2])}
    </>:<>{' '}{t_strong(' Search Results for: ')}{' ? '}</>}
    
    </>)
}
