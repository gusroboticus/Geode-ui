// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from './translate.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  tstamp: number;
  value?: React.ReactNode | null;
}

function TimeStampToDate ({ children, className = '', tstamp, value }: Props): React.ReactElement<Props> | null {
//todo: code for params:
    console.log(JSON.stringify(children));
    console.log(JSON.stringify(className));
    console.log(JSON.stringify(value));
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

export default React.memo(TimeStampToDate);
