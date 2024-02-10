// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
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

  type Owner = {
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

  type Stores ={
    owner: Owner,
    products: Products[],
    services: Services[]
  }

  type SearchObj = {
    search: string,
    stores: Stores[]
  }

  type ProfileDetail = {
  ok: SearchObj
  }
  
function SearchByStoreDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
        //todo: code for unused params or remove!:
        console.log(JSON.stringify(className));
        // console.log(JSON.stringify(isAccount));
        // console.log(JSON.stringify(message));
        // console.log(JSON.stringify(params));
        // console.log(JSON.stringify(result));
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();

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
    const [isBookmark, setBookmark] = useState(false);
    const [isAddToCart, setAddToCart] = useState(false);
    const [isAddToProductList, setAddToProductList] = useState(false);
    const [isAddToServiceList, setAddToServiceList] = useState(false);
    const [_sort, setSort] = useState('none');

    const _reset = useCallback(
      () => {   setBookmark(false);
                setAddToCart(false);
                setAddToProductList(false);
                setAddToServiceList(false);
            },
      []
    )

    const _makeBookmarkUpdate = useCallback(
      () => {   setBookmark(true);
                setAddToCart(false);
                setAddToProductList(false);
                setAddToServiceList(false);
            },
      []
    )

    const _makeAddToCartUpdate = useCallback(
        () => { setBookmark(false);
                setAddToCart(true);
                setAddToProductList(false);
                setAddToServiceList(false);
        },
      []
    )

    const _makeAddToProductListUpdate = useCallback(
        () => { setBookmark(false);
                setAddToCart(false);
                setAddToProductList(true);
                setAddToServiceList(false);
        },
      []
    )

    const _makeAddToServiceListUpdate = useCallback(
      () => { setBookmark(false);
              setAddToCart(false);
              setAddToProductList(false);
              setAddToServiceList(true);
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
       /></>}</>)
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
     
  function numBadge(_num: number): JSX.Element {return(<><Label circular size='small' color='blue'>{numCheck(_num)}</Label></>)}
  function withCopy(_str: string): JSX.Element {return(<>{_str}{' '}<CopyInline value={_str} label={''}/></>)}     
  function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
  function withHelp(_str: string, _help: string): JSX.Element {return(<><LabelHelp help={t(_help)} />{' '}{t(_str)}</>)}
  
  function ListAccount(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button icon='times' label={t('Close')} onClick={onClear}/>
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}

  function ShowStore(_store: any): JSX.Element {
  return(<>
          <Message>
                <Item.Group>
                        <Item>  
                            <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_store.owner.bannerUrl)} 
                                rounded 
                                href={isHex(_store.owner.bannerUrl) ? withHttp(hexToString(_store.owner.bannerUrl).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            />                           
                            <Item.Content>
                                <Item.Header as='a'>{hextoHuman(_store.owner.sellerName)}<br /><br />
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_store.owner.sellerAccount)}
                                               {setUsername(_store.owner.sellerName)}
                                               {setCount(count + 1)}
                                               {_makeBookmarkUpdate()}</>}}
                                >{t('Bookmark Store')}</Label>
                                {photoLink(_store.owner.externalLink, 'More Info')}
                                </Item.Header>
                                <Item.Meta><h3>
                                    {t_strong('Ordered: ')}{numBadge(_store.owner.totalOrders)}<br />
                                    {t_strong('Delivered: ')}{numBadge(_store.owner.totalDelivered)}<br />
                                </h3></Item.Meta>
                                <Item.Description>
                                    {t_strong('Seller Account: ')}{accountInfo(_store.owner.sellerAccount)}<br />
                                    {t_strong('Location: ')}{hextoHuman(_store.owner.sellerLocation)}<br />
                                    {t_strong('Member Since: ')}{_store.owner.memberSince>0? timeStampToDate(_store.owner.memberSince): t(' New Member')}<br />
                                    {t_strong('Seller Rating: ')}{rating[rateCheck(_store.owner.reviewAverage)]}<br />
                                    {t_strong('Number of Reviews: ')}{numBadge(_store.owner.reviewCount)}<br />

                                    {_store.owner.reviews.length>0 && <>
                                      <Expander 
                                        className='Reviews-expander'
                                        isOpen={false}
                                        summary={<Label size={'small'} color='orange' circular> {t('View Reviews')}</Label>}>
                                        <strong>{t('Seller Reviews: ')}</strong><br />
                                        {_store.owner.reviews.length>0 && 
                                            _store.owner.reviews.map((_review: any, index: number) => <>
                                            {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />                            
                                        </>)}
                                    </Expander>                                    
                                    </>}
                                </Item.Description>
                                <Item.Extra>
                                <Expander 
                                    className='item-extra-stores'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('View Details')}</Label>}>
                                    <Grid columns={2} divided>
                                        <Grid.Row>
                                            <Grid.Column>
                                            {t_strong('Total Orders: ')}{_store.owner.totalOrders}<br />
                                            {t_strong('Total Delivered: ')}{_store.owner.totalDelivered}<br />
                                            {t_strong('Total Damaged: ')}{_store.owner.totalDamaged}<br />
                                            {t_strong('Total Not Received: ')}{_store.owner.totalNotReceived}<br />
                                            {t_strong('Total Refused: ')}{_store.owner.totalRefused}<br />
                                            {t_strong('Total Resolved: ')}{_store.owner.totalResolved}<br />
                                            {t_strong('Total Wrong: ')}{_store.owner.totalWrong}<br />                
                                            </Grid.Column>
                                            <Grid.Column>
                                            {renderLink(_store.owner.bannerUrl)}                                    
                                            {renderLink(_store.owner.youtubeUrl)}                                    
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Expander>

                                </Item.Extra>
                                <Expander 
                                    className='item-stores-products'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('See Offerings')}</Label>}>
                                {_store.products.length>0? <>
                                  <h2><strong><i>{withHelp('Products: ', ' List of Products currently being offered by this Store Account. ')}</i></strong></h2>
                                  {_store.products.length>0 && _store.products.map((_product: any)=> <>
                                  {ShowProduct(_product)}
                                  </>)}
                                </>: 'No Products to Offer from this Seller.'}
                                <Divider />
                                {_store.services.length>0? <>
                                  <h2><strong><i>{withHelp('Services: ', ' List of Services currently being offered. ')}</i></strong></h2>
                                  {_store.services.length>0 && _store.services.map((_service: any)=> <>
                                  {ShowService(_service)}                    
                                  </>)}
                                </>: 'No Services to offer from this Seller.'}
                                <Divider />
                                </Expander>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Message>
  </>)
}
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
                                               {_makeAddToProductListUpdate()}</>}}
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
                                               {_makeAddToServiceListUpdate()}</>}}
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
              <h2>{t_strong('Results for Keyword Search: ')}
                        {profileDetail.ok.search.length>2? '"' + hextoHuman(profileDetail.ok.search) + '"': t('All Stores')}</h2>
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
                .sort((a, b) => b.owner.reviewAverage - a.owner.reviewAverage)               
                .map((_store)=> <>{ShowStore(_store)}
              </>)} 
              </>: 
              _sort==='review'? <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores  
                .sort((a,b) => b.owner.reviewCount - a.owner.reviewCount)            
                .map((_store)=> <>{ShowStore(_store)}
                </>)}                                        
              </>:
             _sort==='order'? <>
             {profileDetail.ok.stores.length>0 && profileDetail.ok.stores  
               .sort((a,b) => b.owner.totalOrders - a.owner.totalOrders)            
               .map((_store)=> <>{ShowStore(_store)}
               </>)}                                        
             </>:              
              _sort==='delivery'? <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores  
                .sort((a,b) => b.owner.totalDelivered - a.owner.totalDelivered)            
                .map((_store)=> <>{ShowStore(_store)}
                </>)}                                        
              </>:
              _sort==='since'? <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores  
                .sort((a,b) => a.owner.memberSince - b.owner.memberSince)            
                .map((_store)=> <>{ShowStore(_store)}
                </>)}                                        
              </>:
             
             <>
              {profileDetail.ok.stores.length>0 && profileDetail.ok.stores              
                .map((_store)=> <>{ShowStore(_store)}
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
        {isBookmark && (<>
        <CallSendMessage
                callIndex={3}
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
        {isAddToProductList && (<>
        <CallSendMessage
                callIndex={1}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isAddToServiceList && (<>
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
// const StyledDiv = styled.div`
//   align-items: center;
//   display: flex;

//   .output {
//     flex: 1 1;
//     margin: 0.25rem 0.5rem;
//   }
// `;
export default React.memo(SearchByStoreDetails);
