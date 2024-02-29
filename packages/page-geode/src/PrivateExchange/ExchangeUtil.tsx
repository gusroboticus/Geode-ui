// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import CopyInline from '../shared/CopyInline.js';
import { AccountName, IdentityIcon } from '@polkadot/react-components';
import { Label } from 'semantic-ui-react'

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
