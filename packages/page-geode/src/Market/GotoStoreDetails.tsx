// Copyright 2017-2023 @polkadot authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Divider, Message, Item, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';

import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
  }
  
  type Review = {
    reviewId: string,
    accountId: string,
    reviewer: string,
    rating: number,
    review: string,
    timestamp: number
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
    reviews: Review[],
    totalOrders: number,
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
    reviews: Review[],
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
    reviews: Review[],
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
  
function GotoStoreDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
// todo: code for allCodes:
  console.log(JSON.stringify(className));
// other props:
// isAccount,
// message,
// params
// result
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);

    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    const boolToHuman = (_bool: boolean) => (_bool? 'Yes': 'No');
    const hextoHuman = (_hexIn: string) => (isHex(_hexIn)? t(hexToString(_hexIn).trim()): '');
    const hextoPhoto = (_url: string) => (isHex(_url) ? withHttp(hexToString(_url).trim()) : defaultImage);
    const acctToShort = (_acct: string) => (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
    const microToGeode = (_num: number) => (_num>-1 ? _num/1000000000000: 0);
    const numCheck = (_num: number) => (_num>-1 ? _num: 0);
    const rateCheck = (_num: number) => ((_num>0 && _num<6)? _num: 1);
    const dateCheck = (_num: number) => (_num>0? timeStampToDate(_num): t('No Date'));
    const numToPercent = (_num: number) => ((_num>-1 && _num<=100)? _num.toString(): '0')+ ' %';
    const rating: string[] = ['','⭐️','⭐️⭐️','⭐️⭐️⭐️','⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️'];

    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [count, setCount] = useState(0);
    const [isAddToCart, setAddToCart] = useState(false);
    const [isAddProductToList, setAddProductToList] = useState(false);
    const [isAddServiceToList, setAddServiceToList] = useState(false);

    const [_filter, setFilter] = useState('none'); // all // digital // physical // in_stock // 
    const [_sort, setSort] = useState('none');

    const _reset = useCallback(
        () => {setAddToCart(false);
               setAddProductToList(false);
               setAddServiceToList(false);
              },
        []
      )
  
      const _makeAddToCartUpdate = useCallback(
        () => {setAddToCart(true);
               setAddProductToList(false);
               setAddServiceToList(false);
              },
        []
      )
  
      const _makeAddProductToListUpdate = useCallback(
        () => {setAddToCart(false);
               setAddProductToList(true);
               setAddServiceToList(false);
              },
        []
      )

      const _makeAddServiceToListUpdate = useCallback(
        () => {setAddToCart(false);
               setAddProductToList(false);
               setAddServiceToList(true);
              },
        []
      )
  
    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t(str)}</>)
    }

    function accountInfo(_acct: string): JSX.Element {
        return(<>
            <IdentityIcon value={_acct}/>
            <AccountName value={_acct} withSidebar={true}/>{' | '}
            {acctToShort(_acct)}{' '}
            <CopyInline value={_acct} label={''}/>
        </>)
    }
    
    function photoLink(_url: string, _title: string): JSX.Element {
        return(<>
        {_url.length>2 &&
                  <Label as='a' color='orange' circular
                  href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
                  target="_blank" 
                  rel="noopener noreferrer">{_title}</Label> 
                  }
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
                   href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
                   target="_blank" 
                   rel="noopener noreferrer"
       />      
       </>}
       </>)
     } 

    function renderLink(_link: string): JSX.Element {
      const ilink: string = isHex(_link)? withHttp(hexToString(_link).trim()): '0x';
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

    function numBadge(_num: number): JSX.Element {
      return(<>
        <Label circular size='small' color='blue'>
          {numCheck(_num)}
        </Label>
      </>)
    }

    function t_strong(_str: string): JSX.Element{
      return(<><strong>{t(_str)}</strong></>)
    }

    function timeStampToDate(tstamp: number): JSX.Element {
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

     function withCopy(_str: string): JSX.Element {
        return(<>
        {_str}{' '}
        <CopyInline value={_str} label={''}/>
        </>)
    }
  
    function withHelp(_str: string, _help: string): JSX.Element {
        return(<>
        <LabelHelp help={t(_help)} />
        {' '}{t(_str)}
        </>)
    }
  
    function ListAccount(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon='times'
                  label={t('Close')}
                  onClick={onClear}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}

function ShowProduct(_product: any): JSX.Element {
  return(<>
                  <Message>
                    <Item.Group>
                    <Item>
                    <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_product.photoOrYoutubeLink1)} 
                                rounded 
                                href={isHex(_product.photoOrYoutubeLink1) ? withHttp(hexToString(_product.photoOrYoutubeLink1).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                    /> 
                    <Item.Content>
                                <Item.Header as='a'>{hextoHuman(_product.title)+' '}
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_product.productId)}
                                               {setUsername(_product.title)}
                                               {setCount(count + 1)}
                                               {_makeAddToCartUpdate()}</>}}
                                >{'Add to Cart'}</Label>
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_product.productId)}
                                               {setUsername(_product.title)}
                                               {setCount(count + 1)}
                                               {_makeAddProductToListUpdate()}</>}}
                                >{'Add to List'}</Label>
                                {photoLink(_product.moreInfoLink, 'More Info')}
                                </Item.Header>
                                <Item.Meta>
                                    <h3>{t_strong('Description: ')}<strong>{hextoHuman(_product.description)}</strong></h3>
                                </Item.Meta>
                                <Item.Description>
                                  {t_strong('Price: ')}{microToGeode(_product.price)}{' Geode'}<br />
                                  {t_strong('Inventory: ')}{_product.inventory}<br />
                                  {t_strong('Product Rating: ')}{rating[rateCheck(_product.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_product.reviewCount)}<br />
                                  <strong>{withCopy('Product ID: ')}</strong>{acctToShort(_product.productId)}<br />
                                  {_product.reviews.length>0 && <>
                                    <Expander className='productReviews' isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Reviews: ')}</Label>}>
                                    <strong>{t('Reviews: ')}</strong><br />
                                      {_product.reviews.length>0 && 
                                      _product.reviews.map((_review: any, index: number)=> <>
                                          {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
                                      </>)}
                                    </Expander>                                  
                                  </>}
                                </Item.Description>
                                <Item.Extra>
                                <Expander 
                                    className='productDetails'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
                                    <Grid columns={2} divided>
                                        <Grid.Column>
                                        {t_strong('Seller Account: ')}{accountInfo(_product.sellerAccount)}<br />
                                        {t_strong('Seller Name: ')}{hextoHuman(_product.sellerName)}<br />
                                        {t_strong('Location: ')}{hextoHuman(_product.productLocation)}<br />
                                        {t_strong('Brand: ')}{hextoHuman(_product.brand)}<br />
                                        {t_strong('Category: ')}{hextoHuman(_product.category)}<br />
                                        {t_strong('Delivery Info: ')}{hextoHuman(_product.deliveryInfo)}<br />
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

function ShowService(_service: any): JSX.Element {
    return(<>
                    <Message>
                    <Item.Group>
                    <Item>
                    <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_service.photoOrYoutubeLink1)} 
                                rounded 
                                href={isHex(_service.photoOrYoutubeLink1) ? withHttp(hexToString(_service.photoOrYoutubeLink1).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                    /> 
                    <Item.Content>
                                <Item.Header as='a'>{hextoHuman(_service.title)+' '}
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_service.serviceId)}
                                               {setUsername(_service.title)}
                                               {setCount(count + 1)}
                                               {_makeAddToCartUpdate()}</>}}
                                >{'Add to Cart'}</Label>
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_service.serviceId)}
                                               {setUsername(_service.title)}
                                               {setCount(count + 1)}
                                               {_makeAddServiceToListUpdate()}</>}}
                                >{'Add to List'}</Label>
                                {_service.bookingLink.length>2 && photoLink(_service.bookingLink, 'Book')}
                                </Item.Header>
                                <Item.Meta><h3><strong>{t('Description: ')}{hextoHuman(_service.description)}</strong></h3></Item.Meta>
                                <Item.Description>
                                    {t_strong('Price: ')}{microToGeode(_service.price)}{' Geode'}<br />
                                    {t_strong('Inventory: ')}{_service.inventory}<br />
                                    {t_strong('Location: ')}{hextoHuman(_service.serviceLocation)}<br />
                                    {t_strong('Service Rating: ')}{rating[rateCheck(_service.reviewAverage)]}<br />
                                    {t_strong('Number of Reviews: ')}{numBadge(_service.reviewCount)}<br />
                                    <strong>{withCopy('Service ID: ')}</strong>{acctToShort(_service.serviceId)}<br />
                                    {_service.reviews.length>0 && <>
                                      <Expander   className='productReviews' isOpen={false}
                                                summary={<Label size={'small'} color='orange' circular> {t('Reviews: ')}</Label>}>
                                            <strong>{t('Reviews: ')}</strong><br />
                                            {_service.reviews.length>0 && _service.reviews.map((_review: any, index: number)=> <>
                                                {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
                                      </>)}
                                    </Expander>                                    
                                    </>}
                                </Item.Description>
                                <Item.Extra>
                                <Expander className='details-service' isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
                                    <Grid columns={2} divided>
                                        <Grid.Column>
                                        {t_strong('Seller Account: ')}{accountInfo(_service.sellerAccount)}<br />
                                        {t_strong('Seller Name: ')}{hextoHuman(_service.sellerName)}<br />
                                        {t_strong('Category: ')}{hextoHuman(_service.category)}<br />
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
              <Grid columns={2} divided>
                <Grid.Row>
                <Grid.Column>
                <h2><strong>
                    <i>{withHelp(' ', 'Store Details, Products and Services')}</i></strong>
                    {profileDetail.ok.owner.sellerName.length>0? <>
                      <strong>{ isHex(profileDetail.ok.owner.sellerName) ? 
                                autoCorrect(searchWords, hexToString(profileDetail.ok.owner.sellerName)) 
                                : ' '}</strong><br />
                    </>: t('No Store Name.')}
                    {profileDetail.ok.owner.bannerUrl.length>0 && renderLink(profileDetail.ok.owner.bannerUrl)}
                    <br />
                    {photoLink(profileDetail.ok.owner.youtubeUrl,'YouTube')}
                    {photoLink(profileDetail.ok.owner.externalLink, 'More Info')}      
                    <br />              
                    {t_strong('Account ID: ')}{accountInfo(profileDetail.ok.owner.sellerAccount)}<br />
                    {t_strong('Seller Rating: ')}{rating[rateCheck(profileDetail.ok.owner.reviewAverage)]}<br />
                    {t_strong('Number of Reviews: ')}{numBadge(profileDetail.ok.owner.reviewCount)}<br />
                    {t_strong('Member since: ')}{dateCheck(profileDetail.ok.owner.memberSince)}<br />
                    {t_strong('Location: ')}{hextoHuman(profileDetail.ok.owner.sellerLocation)}<br />
                    {t_strong('Store Description: ')}{hextoHuman(profileDetail.ok.owner.storeDescription)}
                    <br />
                    {profileDetail.ok.owner.reviews.length>0 && <>
                      <Expander 
                      className='sellerReviews'
                      isOpen={false}
                      summary={<Label size={'small'} color='orange' circular> {t('Seller Reviews: ')}</Label>}>
                      <strong>{t('Seller Reviews: ')}</strong><br />
                      {profileDetail.ok.owner.reviews.length>0 && 
                          profileDetail.ok.owner.reviews.map((_review, index: number) => <>
                                {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />                          
                          </>)
                      }
                    </Expander>
                    <br />                    
                    </>}
                    </h2>
                </Grid.Column>
                <Grid.Column>
                <h2>
                    {t('Reviews from Buyers: ')}{profileDetail.ok.owner.reviews.length}<br />
                    {t('Total Orders: ')}{profileDetail.ok.owner.totalOrders}<br />
                    {t('Total Delivered: ')}{profileDetail.ok.owner.totalDelivered}<br />
                    {t('Total Damaged: ')}{profileDetail.ok.owner.totalDamaged}<br />
                    {t('Total Not Received: ')}{profileDetail.ok.owner.totalNotReceived}<br />
                    {t('Total Refused: ')}{profileDetail.ok.owner.totalRefused}<br />
                    {t('Total Resolved: ')}{profileDetail.ok.owner.totalResolved}<br />
                    {t('Total Wrong: ')}{profileDetail.ok.owner.totalWrong}<br />                
                </h2>
                </Grid.Column>
                </Grid.Row>
                </Grid>
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
          <Card>{t('No Seller Data')}</Card>
        </div>
      )
    }
}
    

  return (
    <>
    <Card>
    <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={99}/>
      <ListAccount />
      <ShowProfile />
      {isAddToCart && (<>
        <CallSendMessage
                callIndex={0}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isAddProductToList && (<>
        <CallSendMessage
                callIndex={1}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isAddServiceToList && (<>
        <CallSendMessage
                callIndex={2}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}

    </Card>
    </>
  );
}
// const StyledDiv = styled.css`
//   align-items: center;
//   display: flex;

//   .output {
//     flex: 1 1;
//     margin: 0.25rem 0.5rem;
//   }
// `;
export default React.memo(GotoStoreDetails);
