// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify } from '@polkadot/util';
import { styled, Card } from '@polkadot/react-components';
import AccountHeader from '../shared/AccountHeader.js';
import { Message, Image, Grid, Divider, Table, Label } from 'semantic-ui-react'
import { withHelp } from './marketutil.js';
import { hexToString, isHex } from '@polkadot/util';
import CallSendMessage from './CallSendMessage.js';
import { hextoPhoto, rateCheck, checkEmptySeller } from './marketutil.js';
import { photoLink, numBadge,  accountInfo, dateCheck } from './marketutil.js';
import { checkHttp, hexToHuman } from './marketutil.js';
import { RATING } from './marketConst.js';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
  }

  type Stores = {
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
    awaiting: number
    totalDelivered: number,
    totalDamaged: number,
    totalWrong: number,
    totalNotReceived: number,
    totalResolved: number,
    totalRefused: number
  }

  type SearchObj = {
    search: string[],
    stores: Stores[]
  }

  type ProfileDetail = {
  ok: SearchObj
  }
  
function SearchByStoreDetails ({ className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const profileDetail: ProfileDetail = Object.create(JSON.parse(stringify(output)));
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');

    const [count, setCount] = useState(0);
    const [isBookmark, setBookmark] = useState(false);
    const [_sort, setSort] = useState('none');

    const _reset = useCallback(
      () => {   setBookmark(false);
                
            },
      []
    )

    const _makeBookmarkUpdate = useCallback(
      () => {   setBookmark(true);
                
            },
      []
    )
  
    function SortMenu(): JSX.Element {
      const _menu: string[] = ['None','Rating','Reviews','Orders','Delivered','MemberSince'];  
      return(<>
            <Label size='big'>{t_strong(' Sort: ')}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('none')}</>}>
                    {_sort==='none'? <u>{t(_menu[0])}</u>: <>{t(_menu[0])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('rate')}</>}>
                    {_sort==='rate'? <u>{t(_menu[1])}</u>: <>{t(_menu[1])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('review')}</>}>
                    {_sort==='review'? <u>{t(_menu[2])}</u>: <>{t(_menu[2])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('order')}</>}>
                    {_sort==='order'? <u>{t(_menu[3])}</u>: <>{t(_menu[3])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('delivery')}</>}>
                    {_sort==='delivery'? <u>{t(_menu[4])}</u>: <>{t(_menu[4])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('since')}</>}>
                    {_sort==='since'? <u>{t(_menu[5])}</u>: <>{t(_menu[5])}</>}</Label>
      </>)
    }

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
       /></>}</>)
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

function ShowStoreFront(_seller: Stores): JSX.Element {
  const isEmpty: boolean = (isHex(_seller.sellerName) && hexToString(_seller.sellerName)!='');
  try {
    return(
      <div>
        <Message>
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
                <Label as='a' circular color='orange' 
                onClick={()=>{<>
                  {setMessageId(_seller.sellerAccount)}
                  {setUsername(_seller.sellerAccount)}
                  {setCount(count + 1)}
                  {_makeBookmarkUpdate()}</>}}
                >{'Bookmark Store'}</Label>
                   
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
                {t('Total Awaiting Delivery: ')}{_seller.awaiting}<br />
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
        </Message>
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



function ShowProfile(): JSX.Element {
      try {
        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
              <h2>{t_strong('Results for Keyword Search: ')}
                        
                        
                        {profileDetail.ok.search[0].length>2? <>{' '} {hexToHuman(profileDetail.ok.search[0])}
                                                     {' '}{hexToHuman(profileDetail.ok.search[1])}
                                                     {' '}{hexToHuman(profileDetail.ok.search[2])}</> : t('All Stores')}</h2>
                        
               </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
            <Table.Cell verticalAlign='top'>
                <h2><strong><i>{withHelp('Seller Accounts: ', ' Search results: List of Seller Accounts. ')}</i></strong>
                <Label circular color='blue' size='large'>{profileDetail.ok.stores.length}</Label>
                {SortMenu()}</h2>
                {profileDetail.ok.stores.length>0 && <>

              {_sort==='rate'? <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores
                .sort((a, b) => b.reviewAverage - a.reviewAverage)               
                .map((_store)=> <>{ShowStoreFront(_store)}
              </>)} 
              </>: 
              _sort==='review'? <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores  
                .sort((a,b) => b.reviewCount - a.reviewCount)            
                .map((_store)=> <>{ShowStoreFront(_store)}
                </>)}                                        
              </>:
             _sort==='order'? <>
             {profileDetail.ok.stores.length>0 && profileDetail.ok.stores  
               .sort((a,b) => b.totalOrders - a.totalOrders)            
               .map((_store)=> <>{ShowStoreFront(_store)}
               </>)}                                        
             </>:              
              _sort==='delivery'? <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores  
                .sort((a,b) => b.totalDelivered - a.totalDelivered)            
                .map((_store)=> <>{ShowStoreFront(_store)}
                </>)}                                        
              </>:
              _sort==='since'? <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores  
                .sort((a,b) => a.memberSince - b.memberSince)            
                .map((_store)=> <>{ShowStoreFront(_store)}
                </>)}                                        
              </>:
             
             <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores              
                .map((_store)=> <>{ShowStoreFront(_store)}
                </>)}                          
              </>}
            </>}
        <Divider />

            </Table.Cell>
      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('WARNING: Your Search is too Broad. Try adding additional keywords for your search.')}</Card>
        </div>
      )
    }
}
    
  return (
    <StyledDiv className={className}>
    <Card>
    <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={403}/>
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
export default React.memo(SearchByStoreDetails);
