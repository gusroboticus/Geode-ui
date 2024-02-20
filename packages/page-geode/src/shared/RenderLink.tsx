// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { hexToString, isHex } from '@polkadot/util';
import { Image } from 'semantic-ui-react'

interface Props {
    children?: React.ReactNode;
    className?: string;
    link: string;
    value?: React.ReactNode | null;
}

const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
const hextoPhoto = (_url: string) => (isHex(_url) ? withHttp(hexToString(_url).trim()) : defaultImage);
const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

function showPhoto(_url: string): JSX.Element {
    return(<>
    {_url.length>2 && 
    <> 
    <Image as='a' 
        size='tiny' 
        width={150}
        height={150}
        src={hextoPhoto(_url)} 
        rounded 
        href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
        target="_blank" 
        rel="noopener noreferrer"
    />
    </>}
    </>)
}

function RenderLink ({ children, className = '', link, value }: Props): React.ReactElement<Props> | null {
    //todo: code for params:
    console.log(JSON.stringify(children));
    console.log(JSON.stringify(className));
    console.log(JSON.stringify(value));
    
    const ilink: string = isHex(link)? withHttp(hexToString(link).trim()): '0x';
    const videoLink: string = (ilink.includes('embed')) ? ilink 
    : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
    : ('https://www.youtube.com/embed/' + ilink.slice(32));

    return(
    <>
    {ilink.trim() != 'http://' ? (<>
        {(ilink).includes('youtu')? (
        <iframe width="150" height="100" src={videoLink +'?autoplay=0&mute=1'}> 
        </iframe>) : (
            showPhoto(link)
        )}
    </>) : <>{''}</>}
    <br /></>
    )
}

export default React.memo(RenderLink);