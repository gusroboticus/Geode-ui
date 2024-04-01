// Copyright 2017-2023 @polkadot authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify } from '@polkadot/util';
import { styled, Card, Expander } from '@polkadot/react-components';
import AccountHeader from '../shared/AccountHeader.js';
import { Message, Item, Image, Grid, Divider, Table, Label } from 'semantic-ui-react'
import { withHelp } from './marketutil.js';
import { hexToString, isHex } from '@polkadot/util';
import CallSendMessage from './CallSendMessage.js';
import { hextoPhoto, rateCheck, checkEmptySeller } from './marketutil.js';
import { photoLink, numBadge,  accountInfo, dateCheck } from './marketutil.js';
import { checkHttp, hexToHuman } from './marketutil.js';
import { withCopy, boolToHuman, microToGeode, acctToShort, numCheck, numToPercent } from './marketutil.js';
import { RATING } from './marketConst.js';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    onReset?: () => void;
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
    awaiting: number
    totalDelivered: number,
    totalDamaged: number,
    totalWrong: number,
    totalNotReceived: number,
    totalResolved: number,
    totalRefused: number
  }

  type Products = {
    productId: string,
    digital: boolean,
    title: string,
    price: number,
    brand: string,
    category: string,
    sellerAccount: string,
    sellerName: string,
    description: string,
    reviewAverage: number,
    reviewCount: number,
    inventory: number,
    photoOrYoutubeLink1: string,
    photoOrYoutubeLink2: string,
    photoOrYoutubeLink3: string,
    moreInfoLink: string,
    deliveryInfo: string,
    productLocation: string,
    zenoPercent: number,
    zenoBuyers: string[]
  }

  type Services = {
    serviceId: string,
    online: boolean,
    title: string,
    price: number,
    category: string,
    sellerAccount: string,
    sellerName: string,
    description: string,
    reviewAverage: number,
    reviewCount: number,
    inventory: number,
    photoOrYoutubeLink1: string,
    photoOrYoutubeLink2: string,
    photoOrYoutubeLink3: string,
    bookingLink: string,
    serviceLocation: string,
    zenoPercent: number,
    zenoBuyers: string[]
  }

  type SellerObj = {
    owner: Seller,
    products: Products[],
    services: Services[]
  }

  type ProfileDetail = {
  ok: SellerObj
  }
  
function GotoStoreDetails ({ className = '', outcome: { output, from, when  } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const profileDetail: ProfileDetail = Object.create(JSON.parse(stringify(output)));
    const [_filter, setFilter] = useState('none'); // all // digital // physical // in_stock // 
    const [_sort, setSort] = useState('none');
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [count, setCount] = useState(0);
    const [isBookmark, setBookmark] = useState(false);
    const [isAddToCart, setAddToCart] = useState(false);
   
    const _reset = useCallback(
      () => { setAddToCart(false);
              setBookmark(false);
            },
      []
    )

    const _makeBookmark = useCallback(
      () => { setAddToCart(false);
              setBookmark(true);
            },
      []
    )

    const _makeAddToCartUpdate = useCallback(
      () => { setAddToCart(true);
              setBookmark(false);
              
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

  

    function SortMenu(_productBool: boolean): JSX.Element {
      const _menu: string[] = _productBool? 
            ['None','Rating','Price','All','Digital','Physical','In Stock']:
            ['None','Rating','Price','All','Online','In Person','In Stock'];
      return(<>
            <Label size='big'>{t_strong(' Sort: ')}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('none')}</>}>
                    {_sort==='none'? <u>{t(_menu[0])}</u>: <>{t(_menu[0])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('rating')}</>}>
                    {_sort==='rating'? <u>{t(_menu[1])}</u>: <>{t(_menu[1])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('price')}</>}>
                    {_sort==='price'? <u>{t(_menu[2])}</u>: <>{t(_menu[2])}</>}</Label>
            <Label size='big'>{t_strong(' Filter: ')}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('none')}</>}>
                    {_filter==='none'? <u>{t(_menu[3])}</u>: <>{t(_menu[3])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('digital')}</>}>
                    {_filter==='digital'? <u>{t(_menu[4])}</u>: <>{t(_menu[4])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('physical')}</>}>
                    {_filter==='physical'? <u>{t(_menu[5])}</u>: <>{t(_menu[5])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('in_stock')}</>}>
                    {_filter==='in_stock'? <u>{t(_menu[6])}</u>: <>{t(_menu[6])}</>}</Label>
      </>)
    }

    function ShowStoreFront(_seller: Seller): JSX.Element {
      const isEmpty: boolean = (isHex(_seller.sellerName) && hexToString(_seller.sellerName)!='');
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
                    <Label as='a' circular color='orange' 
                    onClick={()=>{<>
                      {setMessageId(_seller.sellerAccount)}
                      {setUsername(_seller.sellerAccount)}
                      {setCount(count + 1)}
                      {_makeBookmark()}</>}}
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

function ShowProduct(_product: Products): JSX.Element {
  return(<>
                 <Message>
                    <Item.Group>
                    <Item>
                    <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_product.photoOrYoutubeLink1)} 
                                rounded 
                                href={isHex(_product.photoOrYoutubeLink1) ? checkHttp(hexToString(_product.photoOrYoutubeLink1).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                    /> 
                    <Item.Content>
                                <Item.Header as='a'>{hexToHuman(_product.title)+' '}
                                
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setUsername(_product.title)}
                                               {setMessageId(_product.productId)}
                                               {setCount(count + 1)}
                                               {_makeAddToCartUpdate()}</>}}
                                               
                                >{'Add to Cart'}</Label>
                          
                                {photoLink(_product.moreInfoLink, 'More Info')}
                                </Item.Header>
                                <Item.Meta>
                                    <h3>{t_strong('Description: ')}<strong>{hexToHuman(_product.description)}</strong></h3>
                                </Item.Meta>
                                <Item.Description>
                                  {t_strong('Price: ')}{microToGeode(_product.price)}{' Geode'}<br />
                                  {t_strong('Inventory: ')}{_product.inventory}<br />
                                  {t_strong('Product Rating: ')}{RATING[rateCheck(_product.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_product.reviewCount)}<br />
                                  <strong>{withCopy('Product ID: ')}</strong>{acctToShort(_product.productId)}<br />
                                </Item.Description>
                                <Item.Extra>
                                <Expander 
                                    className='productDetails'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
                                    <Grid columns={2} divided>
                                        <Grid.Column>
                                        {t_strong('Seller Account: ')}{accountInfo(_product.sellerAccount)}<br />
                                        {t_strong('Seller Name: ')}{hexToHuman(_product.sellerName)}<br />
                                        {t_strong('Location: ')}{hexToHuman(_product.productLocation)}<br />
                                        {t_strong('Brand: ')}{hexToHuman(_product.brand)}<br />
                                        {t_strong('Category: ')}{hexToHuman(_product.category)}<br />
                                        {t_strong('Delivery Info: ')}{hexToHuman(_product.deliveryInfo)}<br />
                                        {t_strong('Digital Product: ')}{boolToHuman(_product.digital)}<br />
                                        {t_strong('Zeno Percent: ')}{numToPercent(_product.zenoPercent)}<br />
                                        {t_strong('Number of Zeno Accounts: ')}{numCheck(_product.zenoBuyers.length)}<br />
                                        </Grid.Column>
                                        <Grid.Column>
                                        {renderLink(_product.photoOrYoutubeLink1)}
                                        {renderLink(_product.photoOrYoutubeLink2)}
                                        {renderLink(_product.photoOrYoutubeLink3)}
                                        </Grid.Column>
                                    </Grid>
                                  </Expander>
                                </Item.Extra>
                            </Item.Content>
                    </Item>
                    </Item.Group>
                    </Message>
  </>)
}

function ShowService(_service: Services): JSX.Element {
  return(<>
            <Message>
                  <Item.Group>
                  <Item>
                  <Item.Image as='a' size='tiny' 
                              src={hextoPhoto(_service.photoOrYoutubeLink1)} 
                              rounded 
                              href={isHex(_service.photoOrYoutubeLink1) ? checkHttp(hexToString(_service.photoOrYoutubeLink1).trim()) : ''} 
                              target="_blank" 
                              rel="noopener noreferrer"
                  /> 
                  <Item.Content>
                              <Item.Header as='a'>{hexToHuman(_service.title)+' '}
                              <Label as='a' 
                                     color='orange' 
                                     circular 
                                     onClick={()=>{<>
                                             {setMessageId(_service.serviceId)}
                                             {setUsername(_service.title)}
                                             {setCount(count + 1)}
                                             {_makeAddToCartUpdate()}</>}}
                              >{'Add to Cart'}</Label>
                             
                              {_service.bookingLink.length>2 && photoLink(_service.bookingLink, 'Book')}
                              </Item.Header>
                              <Item.Meta><h3><strong>{t('Description: ')}{hexToHuman(_service.description)}</strong></h3></Item.Meta>
                              <Item.Description>
                                  {t_strong('Price: ')}{microToGeode(_service.price)}{' Geode'}<br />
                                  {t_strong('Inventory: ')}{_service.inventory}<br />
                                  {t_strong('Location: ')}{hexToHuman(_service.serviceLocation)}<br />
                                  {t_strong('Service Rating: ')}{RATING[rateCheck(_service.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_service.reviewCount)}<br />
                                  <strong>{withCopy('Service ID: ')}</strong>{acctToShort(_service.serviceId)}<br />
                              </Item.Description>
                              <Item.Extra>
                              <Expander className='details-service' isOpen={false}
                                  summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
                                  <Grid columns={2} divided>
                                      <Grid.Column>
                                      {t_strong('Seller Account: ')}{accountInfo(_service.sellerAccount)}<br />
                                      {t_strong('Seller Name: ')}{hexToHuman(_service.sellerName)}<br />
                                      {t_strong('Category: ')}{hexToHuman(_service.category)}<br />
                                      {t_strong('Online: ')}{boolToHuman(_service.online)}<br />
                                      {t_strong('Zeno Percentage: ')}{numToPercent(_service.zenoPercent)}<br />
                                      {t_strong('Number of Zeno Accounts: ')}{numCheck(_service.zenoBuyers.length)}<br />
                                      </Grid.Column>
                                      <Grid.Column>
                                      {renderLink(_service.photoOrYoutubeLink1)}
                                      {renderLink(_service.photoOrYoutubeLink2)}
                                      {renderLink(_service.photoOrYoutubeLink3)}
                                      </Grid.Column>
                                  </Grid>                                    
                              </Expander>
                              </Item.Extra>
                          </Item.Content>
                  </Item>
                  </Item.Group>
                  </Message>
  </>)
}

function ShowProfile(): JSX.Element {
      try {
        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
              {ShowStoreFront(profileDetail.ok.owner)}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
            <Table.Cell verticalAlign='top'>
            {profileDetail.ok.products.length>0 && <>
              <h2><strong><i>{withHelp('Products: ', ' Products currently being offered by this store. ')}</i></strong>                
              {SortMenu(true)}</h2>

              {_sort==='price'? <>
              {profileDetail.ok.products.length>0 && profileDetail.ok.products
                .filter(_obj => (_filter==='digital' && _obj.digital===true) || 
                (_filter==='in_stock' && _obj.inventory>0) ||
                (_filter==='none' && _obj.inventory>-1) ||
                (_filter==='physical' && _obj.digital===false)) 
                .sort((a, b) => a.price - b.price)               
                .map((_product)=> <>{ShowProduct(_product)}
                </>)} 
              </>: 
              _sort==='rating'? <>
              {profileDetail.ok.products.length>0 && profileDetail.ok.products  
                .filter(_obj => (_filter==='digital' && _obj.digital===true) || 
                                (_filter==='in_stock' && _obj.inventory>0) ||
                                (_filter==='none' && _obj.inventory>-1) ||
                                (_filter==='physical' && _obj.digital===false)) 
                .sort((a,b) => b.reviewAverage - a.reviewAverage)            
                .map((_product)=> <>{ShowProduct(_product)}
                </>)}                                        
              </>:
              <>
              {profileDetail.ok.products.length>0 && profileDetail.ok.products              
                .filter(_obj => (_filter==='digital' && _obj.digital===true) || 
                (_filter==='in_stock' && _obj.inventory>0) ||
                (_filter==='none' && _obj.inventory>-1) ||
                (_filter==='physical' && _obj.digital===false)) 
                .map((_product)=> <>{ShowProduct(_product)}
                </>)}                          
              </>}
            </>}
        <Divider />
                {profileDetail.ok.services.length>0 && <>
                  <h2><strong><i>{withHelp('Services: ', ' Services currently being offered. ')}</i></strong>
                  {SortMenu(false)}</h2>
              {_sort==='price'? <>
              {profileDetail.ok.services.length>0 && profileDetail.ok.services
                .filter(_obj => (_filter==='digital' && _obj.online===true) || 
                                (_filter==='in_stock' && _obj.inventory>0) ||
                                (_filter==='none' && _obj.inventory>-1) ||
                                (_filter==='physical' && _obj.online===false)) 
                .sort((a, b) => a.price - b.price)               
                .map((_service)=> <>{ShowService(_service)}
              </>)} 
              </>: 
              _sort==='rating'? <>
              {profileDetail.ok.services.length>0 && profileDetail.ok.services  
                .filter(_obj => (_filter==='digital' && _obj.online===true) || 
                                (_filter==='in_stock' && _obj.inventory>0) ||
                                (_filter==='none' && _obj.inventory>-1) ||
                                (_filter==='physical' && _obj.online===false)) 
                .sort((a,b) => b.reviewAverage - a.reviewAverage)            
                .map((_service)=> <>{ShowService(_service)}
                </>)}                                        
              </>:
              <>
              {profileDetail.ok.services.length>0 && profileDetail.ok.services              
                .filter(_obj => (_filter==='digital' && _obj.online===true) || 
                                (_filter==='in_stock' && _obj.inventory>0) ||
                                (_filter==='none' && _obj.inventory>-1) ||
                                (_filter==='physical' && _obj.online===false)) 
                .map((_service)=> <>{ShowService(_service)}
                </>)}                          
              </>}
              </>}
            </Table.Cell>
      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Seller Data. Check the account of the seller you wish to view.')}</Card>
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
            callFrom={400}/>
      <ShowProfile />
      {isBookmark && (<>
        <CallSendMessage
                callIndex={1}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isAddToCart && (<>
        <CallSendMessage
                callIndex={0}
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
export default React.memo(GotoStoreDetails);
