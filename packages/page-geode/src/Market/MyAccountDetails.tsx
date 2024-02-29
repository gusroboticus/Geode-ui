// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Toggle, Expander, Button, Card } from '@polkadot/react-components';
//import { AccountName, LabelHelp, IdentityIcon } from '@polkadot/react-components';
import { Grid, Divider, Item, Message, Table, Label, Image } from 'semantic-ui-react'
//import CopyInline from '../shared/CopyInline.js';
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';
import { useToggle } from '@polkadot/react-hooks';
//import { idNumberShort, photoLink, t_strong, numBadge, withCopy, withHelp, accountInfo, dateCheck, checkHttp, boolToHuman, hexToHuman, microToGeode, hextoPhoto, numCheck, rateCheck, numToPercent } from './marketutil.js';
import { idNumberShort, photoLink, t_strong, numBadge, withCopy, withHelp, accountInfo, dateCheck } from './marketutil.js';
import { checkHttp, boolToHuman, hexToHuman, microToGeode } from './marketutil.js';
import { hextoPhoto, numCheck, rateCheck, numToPercent } from './marketutil.js';


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

  type Buyer = {
    buyerAccount: string,
    buyerName: string,
    buyerLocation: string,
    memberSince: number,
    reviewAverage: number,
    reviewCount: number,
    reviews: Review[],
    totalCarts: number,
    totalOrders: number,
    totalDelivered: number,
    totalDamaged: number,
    totalWrong: number,
    totalNotReceived: number,
    totalResolved: number,
    totalRefused: number
  }

  type Orders = {
    orderId: string,
    cartId: string,
    orderTimestamp: number,
    buyer: string,
    buyerRating: number,
    buyerRatingCount: number,
    seller: string,
    sellerName: string,
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
    zenoTotal: number
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
    deliveryInfo: string,
    serviceLocation: string,
    digitalFileUrl: string,
    zenoPercent: number,
    zenoBuyers: string[]
  }

  type Download = {
    productId: string,
    title: string,
    brand: string,
    sellerAccount: string,
    sellerName: string,
    description: string,
    photo: string,
    moreInfo: string,
    fileUrl: string
  }

  type ProductList = {
    owner: string,
    listId: string,
    listName: string,
    items: Products[]
  }

  type ServiceList = {
    owner: string,
    listId: string,
    listName: string,
    items: Services[]
  }

  type AccountObj = {
    buyer: Buyer,
    productLists: ProductList[],
    serviceLists: ServiceList[],
    bookmarkedStores: Seller[],
    digitalDownloads: Download[],
    orders: Orders[]
  }

  type ProfileDetail = {
  ok: AccountObj
  }
  
function MyAccountDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
// todo: code for allCodes:
//  console.log(JSON.stringify(className));
// other props:
// isAccount,
// message,
// params
// result

//    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);

    const [count, setCount] = useState(0);
    const [isShowReviews, toggleShowReviews] = useToggle(true);
    const [isShowProductLists, toggleShowProductLists] = useToggle(true);
    const [isShowServiceLists, toggleShowServiceLists] = useToggle(true);
    const [isShowBookmarks, toggleShowBookmarks] = useToggle(true);
    const [isShowDownloads, toggleShowDownloads] = useToggle(true);
    const [isShowItems, toggleShowItems] = useToggle(true);

    const [isUpdate, setUpdate] = useState(false);
    const [isRemoveProductItem, setRemoveProductItem] = useState(false);
    const [isRemoveServiceItem, setRemoveServiceItem] = useState(false);
    const [isCheckout, setCheckout] = useState(false);
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [isRemoveProductList, setRemoveProductList] = useState(false);
    const [isRemoveServiceList, setRemoveServiceList] = useState(false);
    const [isRateItem, setRateItem] = useState(false);
    const [isMessage, setMessage] = useState(false);
    const [isDamaged, setDamaged] = useState(false);
    const [isWrong, setWrong] = useState(false);
    const [isNotReceived, setNotReceived] = useState(false);
    const [isRemoveBookmark, setRemoveBookmark] = useState(false);

//    const hexToHuman = (_hexIn: string) => (isHex(_hexIn)? t(hexToString(_hexIn).trim()): '');

    //const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    // const hextoPhoto = (_url: string) => (isHex(_url) ? checkHttp(hexToString(_url).trim()) : defaultImage);
    //const acctToShort = (_acct: string) => (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
    // const microToGeode = (_num: number) => (_num>-1 ? _num/1000000000000: 0);
    // const boolToHuman = (_bool: boolean) => (_bool? 'Yes': 'No');
    // const rateCheck = (_num: number) => ((_num>0 && _num<6)? _num: 1);
    // const dateCheck = (_num: number) => (_num>0? timeStampToDate(_num): t('No Date'));
    // const numToPercent = (_num: number) => ((_num>-1 && _num<=100)? _num.toString(): '0')+ ' %';
    const rating: string[] = ['','⭐️','⭐️⭐️','⭐️⭐️⭐️','⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️'];
    // const numCheck = (_num: number) => (_num>-1 ? _num: 0);

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


    const _reset = useCallback(
      () => {setUpdate(false);
             setRemoveProductItem(false);
             setRemoveServiceItem(false);
             setCheckout(false);
             setRateItem(false);
             setMessage(false);
             setDamaged(false);
             setWrong(false);
             setNotReceived(false);
             setRemoveBookmark(false);
             setRemoveProductList(false);
             setRemoveServiceList(false);
            },
      []
    )

    const _makeRateItemUpdate = useCallback(
      () => { setUpdate(false);
              setRemoveProductItem(false);
              setRemoveServiceItem(false);
              setCheckout(false);
              setRateItem(true);
              setMessage(false);
              setDamaged(false);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
              setRemoveProductList(false);
              setRemoveServiceList(false);
             },
      []
    )

    const _makeMessageUpdate = useCallback(
      () => { setUpdate(false);
              setRemoveProductItem(false);
              setRemoveServiceItem(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(true);
              setDamaged(false);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
              setRemoveProductList(false);
              setRemoveServiceList(false);
             },
      []
    )

    const _makeDamagedUpdate = useCallback(
      () => { setUpdate(false);
              setRemoveProductItem(false);
              setRemoveServiceItem(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(false);
              setDamaged(true);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
              setRemoveProductList(false);
              setRemoveServiceList(false);
             },
      []
    )

    const _makeWrongUpdate = useCallback(
      () => { setUpdate(false);
              setRemoveProductItem(false);
              setRemoveServiceItem(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(false);
              setDamaged(false);
              setWrong(true);
              setNotReceived(false);
              setRemoveBookmark(false);
              setRemoveProductList(false);
              setRemoveServiceList(false);
             },
      []
    )

    const _makeNotReceivedUpdate = useCallback(
      () => { setUpdate(false);
              setRemoveProductItem(false);
              setRemoveServiceItem(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(false);
              setDamaged(false);
              setWrong(false);
              setNotReceived(true);
              setRemoveBookmark(false);
              setRemoveProductList(false);
              setRemoveServiceList(false);
             },
      []
    )

    const _makeAddToCartUpdate = useCallback(
      () => { setUpdate(false);
              setRemoveProductItem(false);
              setRemoveServiceItem(false);
              setCheckout(true);
              setRateItem(false);
              setMessage(false);
              setDamaged(false);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
              setRemoveProductList(false);
              setRemoveServiceList(false);
             },
      []
    )

    const _makeRemoveProductItemUpdate = useCallback(
      () => { setUpdate(false);
              setRemoveProductItem(true);
              setRemoveServiceItem(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(false);
              setDamaged(false);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
              setRemoveProductList(false);
              setRemoveServiceList(false);
             },
      []
    )

    const _makeRemoveServiceItemUpdate = useCallback(
      () => { setUpdate(false);
              setRemoveProductItem(false);
              setRemoveServiceItem(true);
              setCheckout(false);
              setRateItem(false);
              setMessage(false);
              setDamaged(false);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
              setRemoveProductList(false);
              setRemoveServiceList(false);
             },
      []
    )

    const _makeAccountUpdate = useCallback(
        () => { setUpdate(true);
                setRemoveProductItem(false);
                setRemoveServiceItem(false);
                setCheckout(false);
                setRateItem(false);
                setMessage(false);
                setDamaged(false);
                setWrong(false);
                setNotReceived(false);
                setRemoveBookmark(false);
                setRemoveProductList(false);
                setRemoveServiceList(false);
                 },
        []
      )

      const _makeRemoveBookmarkUpdate = useCallback(
        () => { setUpdate(false);
                setRemoveProductItem(false);
                setRemoveServiceItem(false);
                setCheckout(false);
                setRateItem(false);
                setMessage(false);
                setDamaged(false);
                setWrong(false);
                setNotReceived(false);
                setRemoveBookmark(true);
                setRemoveProductList(false);
                setRemoveServiceList(false);
                 },
        []
      )

      const _makeRemoveProductListUpdate = useCallback(
        () => { setUpdate(false);
                setRemoveProductItem(false);
                setRemoveServiceItem(false);
                setCheckout(false);
                setRateItem(false);
                setMessage(false);
                setDamaged(false);
                setWrong(false);
                setNotReceived(false);
                setRemoveBookmark(false);
                setRemoveProductList(true);
                setRemoveServiceList(false);
                 },
        []
      )

      const _makeRemoveServiceListUpdate = useCallback(
        () => { setUpdate(false);
                setRemoveProductItem(false);
                setRemoveServiceItem(false);
                setCheckout(false);
                setRateItem(false);
                setMessage(false);
                setDamaged(false);
                setWrong(false);
                setNotReceived(false);
                setRemoveBookmark(false);
                setRemoveProductList(false);
                setRemoveServiceList(true);
                 },
        []
      )

    // function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

    // function photoLink(_url: string, _title: string): JSX.Element {
    //     return(<>
    //     {_url.length>2 &&
    //               <Label as='a' color='orange' circular
    //               href={isHex(_url) ? checkHttp(hexToString(_url).trim()) : ''} 
    //               target="_blank" 
    //               rel="noopener noreferrer">{_title}</Label> 
    //               }
    //     </>)
    // }

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

  // function accountInfo(_acct: string): JSX.Element {
  //     return(<>
  //         <IdentityIcon value={_acct}/>{' | '}
  //         <AccountName value={_acct} withSidebar={true}/>{' | '}
  //         {acctToShort(_acct)}{' '}
  //         <CopyInline value={_acct} label={''}/>
  //     </>)
  // }

  //function idNumberShort(_id: string): JSX.Element {return(<>{acctToShort(_id)}{' '}<CopyInline value={_id} label={''}/></>)}
  //function withCopy(_str: string): JSX.Element {return(<>{_str}{' '}<CopyInline value={_str} label={''}/></>)}
  //function withHelp(_str: string, _help: string): JSX.Element {return(<><LabelHelp help={t(_help)} />{' '}{t(_str)}</>)}
  //function numBadge(_num: number): JSX.Element {return(<><Label circular size='small' color='blue'>{numCheck(_num)}</Label></>)}

  function messageText(_msg: string, _bfrom: boolean, _url: string): JSX.Element {
    return(<>
    {_bfrom? <>
             <Label circular size='small' color='blue' pointing='left'>{hexToHuman(_msg)}</Label>{photoLink(_url, 'Link')}</>:
             <>
             {photoLink(_url, 'Link')}<Label circular size='small' color='grey' pointing='right'>{hexToHuman(_msg)}</Label>
             </>
    }
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
      
  function ShowDigitalDownLoads(): JSX.Element {
    return(<>
                      <h2><strong><i>{withHelp('Digital Downloads: ', 'List of your Digital Downloads.')}</i></strong>
                  {numBadge(profileDetail.ok.digitalDownloads.length)}</h2>
                  {profileDetail.ok.digitalDownloads.length>0? <>
                    <Toggle className='show-digitaldownloads-toggle'
                        label={<strong>{t('Show Downloads: ')}</strong>}
                        onChange={()=> {<>{toggleShowDownloads()}{_reset()}</>}}
                        value={isShowDownloads}
                    />
                  {isShowDownloads && <>
                    {profileDetail.ok.digitalDownloads.length>0 && profileDetail.ok.digitalDownloads.map((_digital)=> <>
                  <Message>
                      <Item.Group>
                      <Item>
                      <Item.Image as='a' size='tiny' 
                                  src={hextoPhoto(_digital.photo)} 
                                  rounded 
                                  href={isHex(_digital.photo) ? checkHttp(hexToString(_digital.photo).trim()) : ''} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                /> 
                      <Item.Content>
                                  <Item.Header as='a' >{t_strong(hexToHuman(_digital.title))}{' '}
                                  {photoLink(_digital.fileUrl, 'Get Download')}
                                  {photoLink(_digital.moreInfo, 'More Info')}
                                  </Item.Header>
                                  <Item.Meta>
                                  <h3>{t_strong('Account ID: ')}{accountInfo(_digital.sellerAccount)}</h3>
                                  {t_strong('Seller Name: ')}{hexToHuman(_digital.sellerName)}<br />
                                  </Item.Meta>
                                  <Item.Description>
                                  {t_strong('Brand: ')}{hexToHuman(_digital.brand)}<br />
                                  {t_strong('Description: ')}{hexToHuman(_digital.description)}<br />
                                  </Item.Description>
                                  <Item.Extra>
                                  </Item.Extra>
                              </Item.Content>
                      </Item>
                      </Item.Group>
                  </Message>
                  </>)}</>}</>: t('No Digital Downloads.')}
    </>)
  }

  function ShowMyOrders(): JSX.Element {
    return(<>
                  <h2><strong><i>{withHelp('My Orders: ', 'List of all your ordered Items.')}</i></strong>
                  {numBadge(profileDetail.ok.orders.length)}</h2>
                  {profileDetail.ok.orders.length>0? <>
                  <Toggle className='items-toggle'
                            label={<strong>{t('Show Ordered Items: ')}</strong>}
                            onChange={()=> {<>{toggleShowItems()}{_reset()}</>}}
                            value={isShowItems}
                    />
                  {isShowItems && <>
                  {profileDetail.ok.orders.length>0 && profileDetail.ok.orders.map((_cart) => <>
                            <Message>
                                <Item.Group>
                                <Item>
                                <Item.Image as='a' size='tiny' 
                                  src={hextoPhoto(_cart.image)} 
                                  rounded 
                                  href={isHex(_cart.image) ? checkHttp(hexToString(_cart.image).trim()) : ''} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                /> 
                                <Item.Content>
                                  <Item.Header as='a'>{hexToHuman(_cart.itemName)}{' '}
                                  <Label as='a' color='orange' circular 
                                         onClick={()=>{<>
                                               {setMessageId(_cart.itemId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeRateItemUpdate()}</>}}
                                  >{t('Rate Item')}</Label>
                                  <Label as='a' color='orange' circular 
                                         onClick={()=>{<>
                                               {setMessageId(_cart.orderId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeMessageUpdate()}</>}}
                                  >{t('Message Seller')}</Label>
                                    <Label as='a' color='orange' circular 
                                           onClick={()=>{<>
                                               {setMessageId(_cart.orderId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeDamagedUpdate()}</>}}
                                    >{t('Item Damaged')}</Label>
                                    <Label as='a' color='orange' circular 
                                           onClick={()=>{<>
                                               {setMessageId(_cart.orderId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeWrongUpdate()}</>}}
                                    >{t('Wrong Item')}</Label>
                                    <Label as='a' color='orange' circular 
                                           onClick={()=>{<>
                                               {setMessageId(_cart.orderId)}
                                               {setUsername(_cart.itemName)}
                                               {setCount(count + 1)}
                                               {_makeNotReceivedUpdate()}</>}}
                                    >{t('Not Received')}</Label>
                                  </Item.Header>
                                  <Item.Meta>
                                      <h3><strong>{'Status: '}<i>{t(numToStatus[numCheck(_cart.orderStatus)])}</i></strong></h3>
                                  </Item.Meta>
                                  <Item.Description>
                                      {t_strong('Quantity: ')}
                                      <Label color='blue' circular size='large'>
                                            {_cart.quantity}
                                      </Label><br />
                                      {t_strong('Price: ')}{microToGeode(_cart.priceEach)}{t(' Geode')}<br />
                                      {t_strong('Total Order Price: ')}{microToGeode(_cart.totalOrderPrice)}{t(' Geode')}<br />
                                      {t_strong('Seller Account: ')}{accountInfo(_cart.seller)}<br />
                                      {t_strong('Seller Name: ')}{hexToHuman(_cart.sellerName)}<br />
                                      {t_strong('Ordered on: ')}{timeStampToDate(_cart.orderTimestamp)}<br />
                                      {_cart.discussion.length>0 && <>
                                      {t_strong('Messages: ')}{numBadge(_cart.discussion.length)}
                                        <Expander 
                                        className='detail-expander'
                                        isOpen={false}
                                        summary={<Label size={'small'} color='orange' circular> {t('View: ')}</Label>}>
                                            {_cart.discussion.length>0 && _cart.discussion.map((_message)=> <>
                                            {_cart.buyer===_message.fromAcct? 
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
                                    className='detail-expander'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Details')}</Label>}>
                                    <Grid columns={2} divided>
                                      <Grid.Column>
                                      {t_strong('Order Id: ')}{idNumberShort(_cart.orderId)}<br />
                                      {t_strong('Product Id: ')}{idNumberShort(_cart.itemId)}<br />
                                      {t_strong('Delivery To Account: ')}{accountInfo(_cart.deliverToAccount)}<br />
                                      {t_strong('Deliver To Address: ')}{hexToHuman(_cart.deliverToAddress)}<br />
                                      {t_strong('Problems Identified: ')}{t(numToProblem[numCheck(_cart.problem)])}<br />
                                      {t_strong('Resolution: ')}{t(numToResolution[numCheck(_cart.resolution)])}<br />
                                      {t_strong('Tracking Info: ')}{hexToHuman(_cart.trackingInfo)}<br />
                                      {t_strong('Delivery Date: ')}{_cart.timeDelivered>0? timeStampToDate(_cart.timeDelivered): t('Not Delivered Yet')}<br />
                                      {t_strong('Zeno Total: ')}{microToGeode(_cart.zenoTotal)}{t(' Geode')}<br />
                                      </Grid.Column>
                                      <Grid.Column>
                                      {renderLink(_cart.image)}
                                      </Grid.Column>
                                    </Grid>
                                    </Expander>
                                  </Item.Extra>
                              </Item.Content>
                      </Item>
                      </Item.Group>
                  </Message>                  
                  </>)}</>}</>: t('No Ordered Items.')}    
    </>)
  }

  function ShowBookmarks(): JSX.Element {
    return(<>
                      <h2><strong><i>{withHelp('Bookmarked Stores: ', 'List of your Bookmarked Stores.')}</i></strong>
                  {numBadge(profileDetail.ok.bookmarkedStores.length)}</h2>
                  {profileDetail.ok.bookmarkedStores.length>0? <>
                    <Toggle className='show-bookmarked-toggle'
                        label={<strong>{t('Show Bookmarks: ')}</strong>}
                        onChange={()=> {<>{toggleShowBookmarks()}{_reset()}</>}}
                        value={isShowBookmarks}
                    />
                  {isShowBookmarks && <>
                    {profileDetail.ok.bookmarkedStores.length>0 && profileDetail.ok.bookmarkedStores.map((_store)=> <>
                  <Message>
                      <Item.Group>
                      <Item>
                      <Item.Image as='a' size='tiny' 
                                  src={hextoPhoto(_store.bannerUrl)} 
                                  rounded 
                                  href={isHex(_store.bannerUrl) ? checkHttp(hexToString(_store.bannerUrl).trim()) : ''} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                /> 
                      <Item.Content>
                                  <Item.Header as='a' >{t_strong(hexToHuman(_store.sellerName))}{' '}
                                  {photoLink(_store.externalLink, 'More Info')}
                                  <Label  as='a' color='orange' size='medium' circular
                                          onClick={()=>{<>
                                          {setMessageId(_store.sellerAccount)}
                                          {setUsername(_store.sellerName)}
                                          {setCount(count + 1)}
                                          {_makeRemoveBookmarkUpdate()}</>}}
                                  >{t('Remove Bookmark')}</Label>
                                  </Item.Header>
                                  <Item.Meta>
                                  <h3>{t_strong('Account ID: ')}{accountInfo(_store.sellerAccount)}</h3>
                                  {t_strong('Seller Rating: ')}{rating[rateCheck(_store.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_store.reviewCount)}<br />
                                  {t_strong('Member since: ')}{dateCheck(_store.memberSince)}<br />
                                  </Item.Meta>
                                  <Item.Description>
                                  {t_strong('Store Description: ')}{hexToHuman(_store.storeDescription)}<br />
                                  {t_strong('Location: ')}{hexToHuman(_store.sellerLocation)}<br />
                                  </Item.Description>
                                  <Item.Extra>
                                  {_store.reviews.length>0 && <>
                                    <Expander 
                                    className='seller-Reviews'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Reviews: ')}</Label>}>
                                      {_store.reviews.length>0 && 
                                      _store.reviews.map((_review, index: number)=> <>
                                          {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hexToHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
                                      </>)}
                                    </Expander>                                  
                                  </>}
                                  </Item.Extra>
                              </Item.Content>
                      </Item>
                      </Item.Group>
                  </Message>
                  </>)}</>}</>: t('No Booked Marked Stores.')}
    </>)
  }

  function ShowProductList(): JSX.Element {
    return(<>
                  <h2><strong><i>{withHelp('Products Lists: ', 'Product Lists, use the copy button to add to this List.')}</i></strong>
                  {numBadge(profileDetail.ok.productLists.length)}</h2>
                  {profileDetail.ok.productLists.length>0? <>
                    <Toggle className='product-list-toggle'
                            label={<strong>{t('Show Lists: ')}</strong>}
                            onChange={()=> {<>
                                           {toggleShowProductLists()}
                                           {_reset()}
                                           </>}}
                            value={isShowProductLists}
                    />
                  {isShowProductLists && <>
                  {profileDetail.ok.productLists.length>0 && profileDetail.ok.productLists.map((_list)=> <>
                      <h2><strong>{withCopy(hexToHuman(_list.listName))}</strong>{numBadge(_list.items.length)}
                      <Label as='a' color='orange' circular 
                                    onClick={()=>{<>
                                      {setMessageId(_list.listId)}
                                      {setUsername(_list.listName)}
                                      {setCount(count + 1)}
                                      {_makeRemoveProductListUpdate()}</>}}
                      >{t('Delete List')}</Label></h2>
                  {_list.items.length>0 && 
                      _list.items.map((_product)=> <>                      
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
                                  <Item.Header as='a'>{hexToHuman(_product.title)}{' '}
                                  <Label as='a' color='orange' circular size='small'
                                         onClick={()=>{<>
                                            {setMessageId(_product.productId)}
                                            {setUsername(_product.title)}
                                            {setCount(count + 1)}
                                            {_makeAddToCartUpdate()}</>}}
                                      >{t('Add to Cart')}</Label>
                                  <Label  as='a' circular color='orange' size='small'
                                          onClick={()=>{<>
                                            {setMessageId(_product.productId)}
                                            {setUsername(_list.listId)}
                                            {setCount(count + 1)}
                                            {_makeRemoveProductItemUpdate()}</>}}
                                  >{t('Remove Item')}</Label>
                                  {photoLink(_product.moreInfoLink, 'More Info')}
                                  </Item.Header>
                                  <Item.Meta>
                                    <h3>{t_strong('Description: ')}{hexToHuman(_product.description)}</h3>
                                  </Item.Meta>
                                  <Item.Description>
                                  {t_strong('Price: ')}{microToGeode(_product.price)}{' Geode'}<br />
                                  {t_strong('Rating:')}{rating[rateCheck(_product.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_product.reviewCount)}<br />
                                  {t_strong('Product ID: ')}{idNumberShort(_product.productId)}<br />
                                  {_product.reviews.length>0 && <>
                                    <Expander 
                                    className='productReviews'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Reviews: ')}</Label>}>
                                      {_product.reviews.length>0 && 
                                      _product.reviews.map((_review, index: number)=> <>
                                          {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hexToHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
                                      </>)}
                                    </Expander>                                  
                                  </>}
                                  </Item.Description>
                                  <Item.Extra>
                                  <Expander 
                                    className='productReviews'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
                                    <Grid columns={2} divided>
                                        <Grid.Column>
                                        {t_strong('Seller Account: ')}{accountInfo(_product.sellerAccount)}<br />
                                        {t_strong('Seller Name: ')}{hexToHuman(_product.sellerName)}<br />
                                        {t_strong('Location: ')}{hexToHuman(_product.productLocation)}<br />
                                        {t_strong('Brand: ')}{hexToHuman(_product.brand)}<br />
                                        {t_strong('Category: ')}{hexToHuman(_product.category)}<br />
                                        {t_strong('Inventory: ')}{_product.inventory}<br />
                                        {t_strong('Delivery Info: ')}{hexToHuman(_product.deliveryInfo)}<br />
                                        {t_strong('Zeno Percent: ')}{numToPercent(_product.zenoPercent)}<br />
                                        {t_strong('Number of Zeno Buyers: ')}{_product.zenoBuyers.length}<br />
                                        {t_strong('Digital Product: ')}{boolToHuman(_product.digital)}<br />
                                        {_product.digital && <>
                                          {t_strong('File Url: ')}{' '}{ photoLink(_product.digitalFileUrl, 'Link')}<br />
                                        </>}
                                        </Grid.Column>
                                        <Grid.Column>
                                        {renderLink(_product.photoOrYoutubeLink1)}<br />
                                        {renderLink(_product.photoOrYoutubeLink2)}<br />
                                        {renderLink(_product.photoOrYoutubeLink3)}<br />
                                        </Grid.Column>
                                    </Grid>
                                  </Expander>
                                  </Item.Extra>
                              </Item.Content>
                      </Item>
                      </Item.Group>
                  </Message>
                  </>)}
                  </>)}</>}
                  </>: t('No Product Lists.')}    
    </>)
  }

  function ShowServiceList(): JSX.Element {
    return(<>
                  <h2><strong><i>{withHelp('Service Lists: ', 'Service Lists, use the copy button to add to this List.')}</i></strong>
                  {numBadge(profileDetail.ok.serviceLists.length)}</h2>
                  {profileDetail.ok.serviceLists.length>0? <>
                    <Toggle className='service-list-toggle'
                            label={<strong>{t('Show Lists: ')}</strong>}
                            onChange={()=> {<>{toggleShowServiceLists()}{_reset()}</>}}
                            value={isShowServiceLists}
                    />
                  {isShowServiceLists && <>
                    {profileDetail.ok.serviceLists.length>0 && profileDetail.ok.serviceLists.map((_list)=> <>
                      <h2><strong>{withCopy(hexToHuman(_list.listName))}</strong>{numBadge(_list.items.length)}
                      <Label as='a' color='orange' circular 
                                    onClick={()=>{<>
                                      {setMessageId(_list.listId)}
                                      {setUsername(_list.listName)}
                                      {setCount(count + 1)}
                                      {_makeRemoveServiceListUpdate()}</>}}
                      >{t('Delete List')}</Label></h2>
                  {_list.items.length>0 && 
                      _list.items.map((_service)=> <>
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
                                  <Item.Header as='a'>{hexToHuman(_service.title)}{' '}
                                  <Label as='a' color='orange' circular size='small'
                                         onClick={()=>{<>
                                            {setMessageId(_service.serviceId)}
                                            {setUsername(_service.title)}
                                            {setCount(count + 1)}
                                            {_makeAddToCartUpdate()}</>}}
                                      >{t('Add to Cart')}</Label>
                                  <Label  as='a' circular color='orange' size='small'
                                          onClick={()=>{<>
                                            {setMessageId(_service.serviceId)}
                                            {setUsername(_list.listId)}
                                            {setCount(count + 1)}
                                            {_makeRemoveServiceItemUpdate()}</>}}
                                  >{t('Remove Item')}</Label>
                                  {photoLink(_service.bookingLink, 'Booking Link')}
                                  </Item.Header>
                                  <Item.Meta>
                                      <h3>{t_strong('Description: ')}{hexToHuman(_service.description)}</h3>
                                  </Item.Meta>
                                  <Item.Description>
                                  {t_strong('Price: ')}{microToGeode(_service.price)}{' Geode'}<br />
                                  {t_strong('Rating:')}{rating[rateCheck(_service.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_service.reviewCount)}<br />
                                  {t_strong('Product ID: ')}{idNumberShort(_service.serviceId)}<br />
                                  {_service.reviews.length>0 && <>
                                    <Expander 
                                    className='serviceReviews'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Reviews: ')}</Label>}>
                                      {_service.reviews.length>0 && 
                                      _service.reviews.map((_review, index: number)=> <>
                                          {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hexToHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
                                      </>)}
                                    </Expander>                                  
                                  </>}
                                  </Item.Description>
                                  <Item.Extra>
                                  <Expander 
                                    className='serviceReviews'
                                    isOpen={false}
                                    summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
                                    <Grid columns={2} divided>
                                        <Grid.Column>
                                        {t_strong('Seller Account: ')}{accountInfo(_service.sellerAccount)}<br />
                                        {t_strong('Seller Name: ')}{hexToHuman(_service.sellerName)}<br />
                                        {t_strong('Location: ')}{hexToHuman(_service.serviceLocation)}<br />
                                        {t_strong('Online: ')}{boolToHuman(_service.online)}<br />
                                        {t_strong('Inventory: ')}{_service.inventory}<br />
                                        {t_strong('Zeno Percent: ')}{numToPercent(_service.zenoPercent)}<br />
                                        {t_strong('Number of Zeno Buyers:')}{_service.zenoBuyers.length}
                                        </Grid.Column>
                                        <Grid.Column>
                                        {renderLink(_service.photoOrYoutubeLink1)}<br />
                                        {renderLink(_service.photoOrYoutubeLink2)}<br />
                                        {renderLink(_service.photoOrYoutubeLink3)}<br />
                                        </Grid.Column>
                                    </Grid>
                                  </Expander>
                                  </Item.Extra>
                              </Item.Content>
                      </Item>
                      </Item.Group>
                  </Message>
                  </>)}
                  </>)}</>}                
                  </>: t('No Service Lists.')}    
    </>)
  }

  function ShowReviews(): JSX.Element {
    return(<>
                  <h2><strong><i>{withHelp('Buyer Reviews from Sellers: ', 'Buyer Reviews for this Account.')}</i></strong>
              {numBadge(profileDetail.ok.buyer.reviews.length)}<br />
              </h2>
              {profileDetail.ok.buyer.reviews.length>0 && <>
                <Toggle className='show-review-toggle'
                        label={<strong>{t('Show Reviews: ')}</strong>}
                        onChange={()=> {<>{toggleShowReviews()}{_reset()}</>}}
                        value={isShowReviews}
                />
              {isShowReviews && <>
                    {profileDetail.ok.buyer.reviews.length>0 && 
                        profileDetail.ok.buyer.reviews.map((_review, index: number) => <>
                              {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hexToHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
                        </>)
                    }
              </>}</>}
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
                  <Grid.Column>
                  <h2><strong>{withHelp('ACCOUNT: ','This is your user Account. Check your account details, reviews from sellers, product and service lists, and ordered items here.')}</strong>
                  <Label  as='a' color='orange' size='large'
                        onClick={()=>{<>
                            {setMessageId(profileDetail.ok.buyer.buyerAccount)}
                            {setUsername(profileDetail.ok.buyer.buyerName)}
                            {setCount(count + 1)}
                            {_makeAccountUpdate()}</>}}
                        >{t('Update Settings')}</Label>
                  <br /><br />
                    {t_strong('Name: ')}{hexToHuman(profileDetail.ok.buyer.buyerName)}<br />
                    {t_strong('Account ID: ')}{accountInfo(profileDetail.ok.buyer.buyerAccount)}<br />
                    {t_strong('Location: ')}{hexToHuman(profileDetail.ok.buyer.buyerLocation)}<br />
                    {t_strong('Member since: ')}{dateCheck(profileDetail.ok.buyer.memberSince)}<br />
                    {t_strong('Buyer Rating: ')}{rating[rateCheck(profileDetail.ok.buyer.reviewAverage)]}<br />
                    {t_strong('Number of Reviews: ')}{numBadge(profileDetail.ok.buyer.reviewCount)}<br />
                </h2>
                  </Grid.Column>
                  <Grid.Column>
                  <h3>
                    {t('Total Orders: ')}{profileDetail.ok.buyer.totalOrders}<br />
                    {t('Total Delivered: ')}{profileDetail.ok.buyer.totalDelivered}<br />
                    {t('Total Damaged: ')}{profileDetail.ok.buyer.totalDamaged}<br />
                    {t('Total Wrong: ')}{profileDetail.ok.buyer.totalWrong}<br />
                    {t('Total NotReceived: ')}{profileDetail.ok.buyer.totalNotReceived}<br />
                    {t('Total Resolved: ')}{profileDetail.ok.buyer.totalResolved}<br />
                    {t('Total Refused: ')}{profileDetail.ok.buyer.totalRefused}<br />   
                  </h3>    
                  </Grid.Column>
                </Grid>
              </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
              <Table.Cell verticalAlign='top'>
              {ShowDigitalDownLoads()}
              <Divider />    
              {ShowMyOrders()}
              <Divider />
              {ShowBookmarks()}
              <Divider />
              {ShowProductList()}
              <Divider />
              {ShowServiceList()}
              <Divider />
              {ShowReviews()}
              <Divider />
              </Table.Cell>
        </Table>
        </div>   
        )
      } catch(e) {
        console.log(e);
        return(
          <div>
            <Card>{t('No Cart Data')}</Card>
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
            callFrom={99}/>
      <ListAccount />
      <ShowProfile />
      {isUpdate && (<>
        <CallSendMessage
                callIndex={13}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRemoveProductItem && (<>
        <CallSendMessage
                callIndex={14}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRemoveServiceItem && (<>
        <CallSendMessage
                callIndex={15}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isCheckout && (<>
        <CallSendMessage
                callIndex={0}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRateItem && (<>
        <CallSendMessage
                callIndex={7}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isDamaged && (<>
        <CallSendMessage
                callIndex={9}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isWrong && (<>
        <CallSendMessage
                callIndex={10}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isNotReceived && (<>
        <CallSendMessage
                callIndex={11}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}

        {isMessage && (<>
        <CallSendMessage
                callIndex={12}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRemoveProductList && (<>
        <CallSendMessage
                callIndex={16}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRemoveServiceList && (<>
        <CallSendMessage
                callIndex={17}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}

        {isRemoveBookmark && (<>
        <CallSendMessage
                callIndex={39}
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
export default React.memo(MyAccountDetails);
