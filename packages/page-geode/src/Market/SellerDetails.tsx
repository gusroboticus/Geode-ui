// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Expander, Toggle, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Divider, Message, Item, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';
import { useToggle } from '@polkadot/react-hooks';
import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
  }
  
  type Discussion = {
    messageId: string,
    fromAcct: string,
    toAcct: string,
    orderId: string,
    message: string,
    mediaUrl: string,
    timestamp: number
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
  
  type CurrentOrders = {
    orderId: string,
    cartId: string,
    orderTimestamp: number,
    buyer: string,
    buyerRating: number,
    buyerRatingCount: number,
    seller: string,
    image: string,
    itemId: string,
    itemName: string,
    quantity: number,
    priceEach: number,
    totalOrderPrice: number,
    deliverToAddress: string,
    deliverToAccount: string,
    trackingInfo: string,
    orderStatus: number,
    timeDelivered: number,
    discussion: Discussion[],
    problem: number,
    resolution: number,
    zenoTotal: number,
    zenoBuyers: string[]
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
    digitalFileUrl: string,
    zenoPercent: string,
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
    seller: Seller,
    currentOrders: CurrentOrders[],
    products: Products[],
    services: Services[]
  }

  type ProfileDetail = {
  ok: SellerObj
  }
  
function SellerDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    //todo: code for unused params or remove!:
    console.log(JSON.stringify(className));
    // console.log(JSON.stringify(isAccount));
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));
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

    const numToStatus: string[] = 
    ['Awaiting seller confirmation','Shipped','Delivered','Complete', 'Problem',
     'Refused','','','','',
     '','','','',''];

     const numToProblem: string[] = 
     ['None','Damaged','Wrong Item','Did not receive',
      '','','','','',
      '','','','',''];

    const numToResolution: string[] =
    ['None','Refunded','Replaced','Resolution denied','',''];


    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');

    const [count, setCount] = useState(0);
    const [isBuyerOrders, toggleBuyerOrders] = useToggle(true);
    const [isMyProducts, toggleMyProducts] = useToggle(true);
    const [isMyServices, toggleMyServices] = useToggle(true);

    const [isUpdateProduct, setUpdateProduct] = useState(false);
    const [isUpdateService, setUpdateService] = useState(false);
    const [isUpdateTracking, setUpdateTracking] = useState(false);
    const [isIssueRefund, setIssueRefund] = useState(false);
    const [isReplacement, setReplacement] = useState(false);
    const [isDenyRequest, setDenyRequest] = useState(false);
    const [isRefuseOrder, setRefuseOrder] = useState(false);
    const [isRateBuyer, setRateBuyer] = useState(false);
    const [isMessageBuyer, setMessageBuyer] = useState(false);

    const [_filter, setFilter] = useState('none'); // all // ordered // delivered // in_stock // 
    const [_sort, setSort] = useState('none');

    const _reset = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
             setRefuseOrder(false);
            },
      []
    )

    const _makeProductUpdate = useCallback(
      () => {setUpdateProduct(true);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
             setRefuseOrder(false);
            },
      []
    )

    const _makeServiceUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(true);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
             setRefuseOrder(false);
            },
      []
    )

    const _makeTrackingUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(true);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
             setRefuseOrder(false);
            },
      []
    )

    const _makeIssueRefundUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(true);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
             setRefuseOrder(false);
            },
      []
    )

    const _makeReplacementUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(true);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
             setRefuseOrder(false);
            },
      []
    )

    const _makeDenyRequestUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(true);
             setRateBuyer(false);
             setMessageBuyer(false);
             setRefuseOrder(false);
            },
      []
    )

    const _makeRateBuyerUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(true);
             setMessageBuyer(false);
             setRefuseOrder(false);
            },
      []
    )

    const _makeMessageBuyerUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(true);
             setRefuseOrder(false);
            },
      []
    )

    const _makeRefuseOrderUpdate = useCallback(
      () => {setUpdateProduct(false);
             setUpdateService(false);
             setUpdateTracking(false);
             setIssueRefund(false);
             setReplacement(false);
             setDenyRequest(false);
             setRateBuyer(false);
             setMessageBuyer(false);
             setRefuseOrder(true);
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

    function SortMenu(): JSX.Element {
      const _menu: string[] = ['None','Order Date','Delivery Date','None','New', 
                               'Shipped', 'Delivered', 'Complete', 'Problem', 'Refused'];
      return(<>
            <Label size='big'>{t_strong(' Sort: ')}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('none')}</>}>
                    {_sort==='none'? <u>{t(_menu[0])}</u>: <>{t(_menu[0])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('ordered')}</>}>
                    {_sort==='ordered'? <u>{t(_menu[1])}</u>: <>{t(_menu[1])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setSort('delivered')}</>}>
                    {_sort==='delivered'? <u>{t(_menu[2])}</u>: <>{t(_menu[2])}</>}</Label>
            <Label size='big'>{t_strong(' Filter: ')}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('none')}</>}>
                    {_filter==='none'? <u>{t(_menu[3])}</u>: <>{t(_menu[3])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('seller')}</>}>
                    {_filter==='seller'? <u>{t(_menu[4])}</u>: <>{t(_menu[4])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('shipped')}</>}>
                    {_filter==='shipped'? <u>{t(_menu[5])}</u>: <>{t(_menu[5])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('delivered')}</>}>
                    {_filter==='delivered'? <u>{t(_menu[6])}</u>: <>{t(_menu[6])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('problem')}</>}>
                    {_filter==='problem'? <u>{t(_menu[8])}</u>: <>{t(_menu[8])}</>}</Label>
            <Label as='a' size='big' onClick={()=> <>{_reset()}{setFilter('refused')}</>}>
                    {_filter==='refused'? <u>{t(_menu[9])}</u>: <>{t(_menu[9])}</>}</Label>
      </>)
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
     
  function idNumberShort(_id: string): JSX.Element {return(<>{acctToShort(_id)}{' '}<CopyInline value={_id} label={''}/></>)}
  function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
  function withCopy(_str: string): JSX.Element {return(<>{_str}{' '}<CopyInline value={_str} label={''}/></>)}

  function withHelp(_str: string, _help: string): JSX.Element {
      return(<>
      <LabelHelp help={t(_help)} />
      {' '}{t(_str)}
      </>)
  }

  function numBadge(_num: number): JSX.Element {
    return(<>
      <Label circular size='small' color='blue'>
        {numCheck(_num)}
      </Label>
    </>)
  }

  function messageText(_msg: string, _bfrom: boolean, _url: string): JSX.Element {
    return(<>
    {_bfrom? <>
             <Label circular size='small' color='blue' pointing='left'>{hextoHuman(_msg)}</Label>{photoLink(_url, 'Link')}</>:
             <>
             {photoLink(_url, 'Link')}<Label circular size='small' color='grey' pointing='right'>{hextoHuman(_msg)}</Label>
             </>
    }
    </>)
  }

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
                                      <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_product.productId)}
                                               {setUsername(_product.title)}
                                               {setCount(count + 1)}
                                               {_makeProductUpdate()}</>}}
                                       >{'Update Product'}</Label>
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
                                    <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_service.serviceId)}
                                               {setUsername(_service.title)}
                                               {setCount(count + 1)}
                                               {_makeServiceUpdate()}</>}}
                                       >{'Update Service'}</Label>
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

function ShowOrders(_order: any): JSX.Element {
  return(<>
                  <Message>
                <Item.Group>
                        <Item>  
                            <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_order.image)} 
                                rounded 
                                href={isHex(_order.image) ? withHttp(hexToString(_order.image).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            />                           
                            <Item.Content>
                                <Item.Header as='a'>{hextoHuman(_order.itemName)}<br /><br />
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeTrackingUpdate()}</>}}
                                >{'Update Tracking'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeIssueRefundUpdate()}</>}}
                                >{'Issue Refund'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeReplacementUpdate()}</>}}
                                >{'Replacement'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeDenyRequestUpdate()}</>}}
                                >{'Deny Request'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeRefuseOrderUpdate()}</>}}
                                >{'Refuse Order'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.deliverToAccount)}
                                               {setUsername(_order.buyer)}
                                               {setCount(count + 1)}
                                               {_makeRateBuyerUpdate()}</>}}
                                >{'Rate Buyer'}</Label>
                                <Label as='a' color='orange' circular 
                                       onClick={()=>{<>
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.itemName)}
                                               {setCount(count + 1)}
                                               {_makeMessageBuyerUpdate()}</>}}
                                >{'Message Buyer'}</Label>
                                </Item.Header>
                                <Item.Meta><h3><strong>{'Quantity Ordered: '}</strong>
                                <Label color='blue' circular size='large'><strong>{_order.quantity}</strong></Label></h3></Item.Meta>
                                <Item.Description>
                                    {t_strong('Buyer Account: ')}{accountInfo(_order.buyer)}<br />
                                    {t_strong('Ship To Address: ')}{withCopy(hextoHuman(_order.deliverToAddress))}<br />
                                    {t_strong('Buyer Rating: ')}{rating[rateCheck(_order.buyerRating)]}<br />
                                    {t_strong('Reviews: ')}{numBadge(_order.buyerRatingCount)}<br />
                                    {t_strong('Status: ')}{t(numToStatus[numCheck(_order.orderStatus)])}
                                    {_order.problem>0 && <>{t_strong(' | Problem Type: ')}{t(numToProblem[numCheck(_order.problem)])}{t_strong(' | Resolution: ')}{t(numToResolution[numCheck(_order.resolution)])}</>}
                                    <br />
                                    {t_strong('Order Date: ')}{_order.orderTimestamp>0? timeStampToDate(_order.orderTimestamp): t('No date available.')}<br />
                                    {t_strong('Delivery Date: ')}{_order.timeDelivered>0? timeStampToDate(_order.timeDelivered): t('No date available.')}<br />
                                    {t_strong('Price Each: ')}{microToGeode(_order.priceEach)}{t(' Geode')}<br />
                                    {t_strong('Total Price: ')}{microToGeode(_order.totalOrderPrice)}{t(' Geode')}<br />
                                    {_order.discussion.length>0 && <>
                                      {t_strong('Messages: ')}{numBadge(_order.discussion.length)}
                                        <Expander 
                                        className='detail-expander'
                                        isOpen={false}
                                        summary={<Label size={'small'} color='orange' circular> {t('View: ')}</Label>}>
                                            {_order.discussion.length>0 && _order.discussion.map((_message: any)=> <>
                                            {_order.seller===_message.fromAcct? 
                                              <>{timeStampToDate(_message.timestamp)}{': '}{accountInfo(_message.fromAcct)}{messageText(_message.message, true, _message.mediaUrl)}<br />
                                              </>:
                                              <>{timeStampToDate(_message.timestamp)}{': '}{messageText(_message.message, false, _message.mediaUrl)}{accountInfo(_message.fromAcct)}<br />
                                              </>}
                                            </>)}
                                      </Expander>      
                                      </>}                               
                                </Item.Description>
                                <Item.Extra>
                                <Expander 
                                    className='message'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Details')}</Label>}>
                                      <Grid columns={2} divided>
                                        <Grid.Column>                                          
                                          {t_strong('Order Id: ')}{idNumberShort(_order.orderId)}<br />                                      
                                          {t_strong('Item ID: ')}{idNumberShort(_order.itemId)}<br />
                                          {t_strong('Tracking Info: ')}{hextoHuman(_order.trackingInfo)}<br />
                                          {t_strong('Zeno Total: ')}{microToGeode(_order.zenoTotal)}{t(' Geode')}<br />                                         
                                        </Grid.Column>
                                        <Grid.Column>
                                          {renderLink(_order.image)} 
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
                    <i>{t('Seller Account: ')}</i></strong>{' '}
                    <strong>{isHex(profileDetail.ok.seller.sellerName) ? 
                                autoCorrect(searchWords, hexToString(profileDetail.ok.seller.sellerName)) 
                                : ' '}</strong><br />
                    {renderLink(profileDetail.ok.seller.bannerUrl)}
                    <br />
                    {photoLink(profileDetail.ok.seller.youtubeUrl,'YouTube')}
                    {photoLink(profileDetail.ok.seller.externalLink, 'More Info')}      
                    <br />              
                    {t_strong('Account ID: ')}{accountInfo(profileDetail.ok.seller.sellerAccount)}<br />
                    {t_strong('Seller Rating: ')}{rating[rateCheck(profileDetail.ok.seller.reviewAverage)]}<br />
                    {t_strong('Number of Reviews: ')}{numBadge(profileDetail.ok.seller.reviewCount)}<br />
                    {t_strong('Store Description: ')}{hextoHuman(profileDetail.ok.seller.storeDescription)}<br />
                    {t_strong('Member since: ')}{dateCheck(profileDetail.ok.seller.memberSince)}<br />
                    {t_strong('Location: ')}{hextoHuman(profileDetail.ok.seller.sellerLocation)}<br />
                    <br />
                    {profileDetail.ok.seller.reviews.length>0 && <>
                      <Expander 
                      className='sellerReviews'
                      isOpen={false}
                      summary={<Label size={'small'} color='orange' circular> {t('Seller Reviews: ')}</Label>}>
                      {t_strong('Seller Reviews: ')}<br />
                      {profileDetail.ok.seller.reviews.length>0 && profileDetail.ok.seller.reviews.map((_review, index: number) => <>
                                {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hextoHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br /></>)
                      }
                    </Expander>                    
                    </>}
                    <br />
                    </h2>
                </Grid.Column>
                <Grid.Column>
                <h3>
                    {t('Reviews from Buyers: ')}{profileDetail.ok.seller.reviews.length}<br />
                    {t('Total Orders: ')}{profileDetail.ok.seller.totalOrders}<br />
                    {t('Total Delivered: ')}{profileDetail.ok.seller.totalDelivered}<br />
                    {t('Total Damaged: ')}{profileDetail.ok.seller.totalDamaged}<br />
                    {t('Total Not Received: ')}{profileDetail.ok.seller.totalNotReceived}<br />
                    {t('Total Refused: ')}{profileDetail.ok.seller.totalRefused}<br />
                    {t('Total Resolved: ')}{profileDetail.ok.seller.totalResolved}<br />
                    {t('Total Wrong: ')}{profileDetail.ok.seller.totalWrong}<br />                
                </h3>
                </Grid.Column>
                </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
            <Table.Cell verticalAlign='top'>
                <h2><strong><i>{(withHelp('Buyer Orders: ', ' Your Current Orders. '))}</i></strong>
                <Label color='blue' circular size='small'><strong>{profileDetail.ok.currentOrders.length}</strong></Label>
                {SortMenu()}</h2>
                {profileDetail.ok.currentOrders.length>0 ? <>
                <Toggle className='info-toggle'
                            label={<strong>{t('Show Buyer Orders: ')}</strong>}
                            onChange={()=> {<>
                                           {toggleBuyerOrders()}
                                           {_reset()}
                                           </>}}
                            value={isBuyerOrders}
                />
                {isBuyerOrders && <>
                {_sort==='ordered'? <>
                    {profileDetail.ok.currentOrders.length>0 && profileDetail.ok.currentOrders
                      .filter(_obj => (_filter==='none' && _obj.orderStatus>-1) ||
                                      (_filter==='seller' && _obj.orderStatus===0) || 
                                      (_filter==='shipped' && _obj.orderStatus===1) ||
                                      (_filter==='delivered' && _obj.orderStatus===2) ||
                                      (_filter==='problem' && _obj.orderStatus===4) ||
                                      (_filter==='refused' && _obj.orderStatus===5)) 
                      .sort((a, b) => b.orderTimestamp - a.orderTimestamp)               
                      .map((_order)=> <>{ShowOrders(_order)}
                    </>)} 
                    </>: 
                _sort==='delivered'? <>
                    {profileDetail.ok.currentOrders.length>0 && profileDetail.ok.currentOrders  
                      .filter(_obj => (_filter==='none' && _obj.orderStatus>-1) ||
                                      (_filter==='seller' && _obj.orderStatus===0) || 
                                      (_filter==='shipped' && _obj.orderStatus===1) ||
                                      (_filter==='delivered' && _obj.orderStatus===2) ||
                                      (_filter==='problem' && _obj.orderStatus===4) ||
                                      (_filter==='refused' && _obj.orderStatus===5)) 
                      .sort((a,b) => b.timeDelivered - a.timeDelivered)            
                      .map((_order)=> <>{ShowOrders(_order)}
                      </>)}                                        
                    </>:
                    <>
                    {profileDetail.ok.currentOrders.length>0 && profileDetail.ok.currentOrders              
                      .filter(_obj => (_filter==='none' && _obj.orderStatus>-1) ||
                                      (_filter==='seller' && _obj.orderStatus===0) || 
                                      (_filter==='shipped' && _obj.orderStatus===1) ||
                                      (_filter==='delivered' && _obj.orderStatus===2) ||
                                      (_filter==='problem' && _obj.orderStatus===4) ||
                                      (_filter==='refused' && _obj.orderStatus===5))  
                      .map((_order)=> <>{ShowOrders(_order)}
                      </>)}                          
                    </>}                              
                </>}
                </>: t('You have no orders.')}
                <Divider />
                <h2><strong><i>{withHelp('My Products: ', ' Your Products currently being offered. ')}</i></strong>
                {numBadge(profileDetail.ok.products.length)}
                </h2>
                {profileDetail.ok.products.length>0? <>
                  <Toggle className='info-toggle' label={<strong>{t('Show My Products: ')}</strong>}
                            onChange={()=> {<>
                                           {toggleMyProducts()}
                                           {_reset()}
                                           </>}}
                            value={isMyProducts}
                />
                {isMyProducts && <>
                  {profileDetail.ok.products.length>0 && profileDetail.ok.products.map((_product)=> <>
                  {ShowProduct(_product)}
                </>)}                
                </>}
                </>:t('No Products for this Seller.')}
                <Divider />
                <h2><strong><i>{withHelp('My Services: ', ' Your Services currently being offered. ')}</i></strong>
                {numBadge(profileDetail.ok.services.length)}
                </h2>
                {profileDetail.ok.services.length>0? <>
                  <Toggle className='info-toggle' label={<strong>{t('Show My Services: ')}</strong>}
                            onChange={()=> {<>
                                           {toggleMyServices()}
                                           {_reset()}
                                           </>}}
                            value={isMyServices}
                />
                {isMyServices && <>
                  {profileDetail.ok.services.length>0 && profileDetail.ok.services.map((_services)=> <>
                  {ShowService(_services)}
                </>)}                
                </>}
                </>:t('No Services for this Seller.')}
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
        {isUpdateTracking && (<>
        <CallSendMessage
                callIndex={19}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRefuseOrder && (<>
        <CallSendMessage
                callIndex={20}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isIssueRefund && (<>
        <CallSendMessage
                callIndex={21}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isReplacement && (<>
        <CallSendMessage
                callIndex={22}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isDenyRequest && (<>
        <CallSendMessage
                callIndex={23}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isMessageBuyer && (<>
        <CallSendMessage
                callIndex={24}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRateBuyer && (<>
        <CallSendMessage
                callIndex={25}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isUpdateProduct && (<>
        <CallSendMessage
                callIndex={27}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isUpdateService && (<>
        <CallSendMessage
                callIndex={29}
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
export default React.memo(SellerDetails);
