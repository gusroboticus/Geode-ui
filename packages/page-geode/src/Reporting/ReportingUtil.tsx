// Copyright 2017-2024 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';

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


