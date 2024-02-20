// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { hexToString, isHex } from '@polkadot/util';
import { Label } from 'semantic-ui-react'

interface Props {
    children?: React.ReactNode;
    className?: string;
    url: string;
    title: string;
    value?: React.ReactNode | null;
}

const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

function PhotoLink ({ children, className = '', url, title, value }: Props): React.ReactElement<Props> | null {
//todo: code for params:
    console.log(JSON.stringify(children));
    console.log(JSON.stringify(className));
    console.log(JSON.stringify(value));

return(<>
    {url.length>2 &&
        <Label  as='a' 
                color='orange' 
                circular
                href={isHex(url) ? withHttp(hexToString(url).trim()) : ''} 
                target="_blank" 
                rel="noopener noreferrer">{title}</Label> 
        }
    </>)}

export default React.memo(PhotoLink);