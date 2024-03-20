// Copyright 2017-2024 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import { AccountName, IdentityIcon } from '@polkadot/react-components';
import CopyInline from '../shared/CopyInline.js';

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

  export function accountIdentity(_id: string): JSX.Element {
    return(
        <>
        <IdentityIcon value={_id} />
        <AccountName value={_id} withSidebar={true}/>
        {' - '}{_id}{' '}
        <CopyInline value={_id} label={''}/>                    
        <br />
        </>
    )
}

export function acctToShort (_acct: string): string {
    return (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
}

