// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import { styled, Card } from '@polkadot/react-components';
import { Label, Grid, Image } from 'semantic-ui-react'
import CallSendMessage from './CallSendMessage.js';
import { photoLink, numBadge,  accountInfo, dateCheck } from './marketutil.js';
import { checkHttp, hexToHuman } from './marketutil.js';
import { hextoPhoto, rateCheck, checkEmptySeller } from './marketutil.js';
import { RATING } from './marketConst.js';

interface Props {
    className?: string;
    _seller: Seller;
    _isOwner: boolean;
  }

  type Seller = {
    sellerAccount: string,
    sellerName: string,
    storeDescription: string,
    sellerLocation: string,
    memberSince: number,
    bannerUrl: string,
    youtubeUrl: string,
    externalLink: string,
    reviewAverage: number,
    reviewCount: number,
    totalOrders: number,
    awaiting: number,
    totalDelivered: number,
    totalDamaged: number,
    totalWrong: number,
    totalNotReceived: number,
    totalResolved: number,
    totalRefused: number
  }
  
function ShowStoreFront ({ className = '',  _seller, _isOwner}: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [count, setCount] = useState(0);
    const [isBookmark, setBookmark] = useState(false);
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    const isEmpty: boolean = (isHex(_seller.sellerName) && hexToString(_seller.sellerName)!='');

    const _reset = useCallback(
      () => {setBookmark(false);
            },
      []
    )

    const _makeBookmark = useCallback(
      () => {setBookmark(true);
            },
      []
    )
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
                   href={isHex(_url) ? checkHttp(hexToString(_url).trim()) : ''} 
                   target="_blank" 
                   rel="noopener noreferrer"
       />      
       </>}
       </>)
     } 

    function renderLink(_link: string): JSX.Element {
      const ilink: string = isHex(_link)? checkHttp(hexToString(_link).trim()): '0x';
      const videoLink: string = (ilink.includes('embed')) ? ilink 
          : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
              : ('https://www.youtube.com/embed/' + ilink.slice(32));
      return(
        <>
        {ilink.trim() != 'http://' ? (<>
          {(ilink).includes('youtu')? (
          <iframe width="150" height="100" src={videoLink +'?autoplay=0&mute=1'}> 
          </iframe>) : (
          showPhoto(_link)
          )}    
        </>) : <>{''}</>}
        <br /></>
      )
    }

function ShowProfile(): JSX.Element {
      try {
        return(
          <div>
              <Grid columns={2} divided>
                <Grid.Row>
                <Grid.Column>
                <h2><strong>
                    <i>{t('Seller: ')}</i></strong>{' '}
                    {checkEmptySeller(_seller.sellerName)}
                </h2><h3>
                   {isEmpty && <>
                    {renderLink(_seller.bannerUrl)}
                    <br />
                    {photoLink(_seller.youtubeUrl,'YouTube')}
                    {photoLink(_seller.externalLink, 'More Info')}   
                    {!_isOwner && <><Label as='a' circular color='orange' 
                    onClick={()=>{<>
                      {setMessageId(_seller.sellerAccount)}
                      {setUsername(_seller.sellerAccount)}
                      {setCount(count + 1)}
                      {_makeBookmark()}</>}}
                    >{'Bookmark Store'}</Label></>}
                       
                    <br />              
                    {t_strong('Account ID: ')}{accountInfo(_seller.sellerAccount)}<br />
                    {t_strong('Seller Rating: ')}{RATING[rateCheck(_seller.reviewAverage)]}<br />
                    {t_strong('Number of Reviews: ')}{numBadge(_seller.reviewCount)}<br />
                    {t_strong('Store Description: ')}{hexToHuman(_seller.storeDescription)}<br />
                    {t_strong('Member since: ')}{dateCheck(_seller.memberSince)}<br />
                    {t_strong('Location: ')}{hexToHuman(_seller.sellerLocation)}<br />
                    </>}
                    </h3>
                </Grid.Column>
                <Grid.Column>
                <h3>
                    {t('Total Orders: ')}{_seller.totalOrders}<br />
                    {t('Total Awaiting: ')}{_seller.awaiting}<br />
                    {t('Total Delivered: ')}{_seller.totalDelivered}<br />
                    {t('Total Damaged: ')}{_seller.totalDamaged}<br />
                    {t('Total Not Received: ')}{_seller.totalNotReceived}<br />
                    {t('Total Refused: ')}{_seller.totalRefused}<br />
                    {t('Total Resolved: ')}{_seller.totalResolved}<br />
                    {t('Total Wrong: ')}{_seller.totalWrong}<br />                
                </h3>
                </Grid.Column>
                </Grid.Row>
                </Grid>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Seller Data')}</Card>
        </div>
      )
    }
}
    

  return (
    <StyledDiv className={className}>
    <Card>
      <ShowProfile />
      {isBookmark && (<>
        <CallSendMessage
                callIndex={1}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
    </Card>
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  align-items: center;
  display: flex;

  .output {
    flex: 1 1;
    margin: 0.25rem 0.5rem;
  }
`;
export default React.memo(ShowStoreFront);
