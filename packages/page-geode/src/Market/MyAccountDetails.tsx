// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Toggle, Expander, Card } from '@polkadot/react-components';
import { Grid, Divider, Item, Message, Table, Label, Image } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';
import { useToggle } from '@polkadot/react-hooks';
import { idNumberShort, photoLink, numBadge, withHelp, accountInfo, dateCheck } from './marketutil.js';
import { messageText, checkHttp, hexToHuman, microToGeode } from './marketutil.js';
import { timeStampToDate, hextoPhoto, numCheck, rateCheck } from './marketutil.js';
import { RATING, numToStatus, numToProblem, numToResolution } from './marketConst.js';

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

  type Buyer = {
    buyerAccount: string,
    buyerName: string,
    buyerLocation: string,
    memberSince: number,
    reviewAverage: number,
    reviewCount: number,
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

  type AccountObj = {
    buyer: Buyer,
    bookmarkedStores: Seller[],
    digitalDownloads: Download[],
    orders: Orders[]
  }

  type ProfileDetail = {
  ok: AccountObj
  }
  
function MyAccountDetails ({ className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {

    const { t } = useTranslation();

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);

    const [count, setCount] = useState(0);
    const [isShowBookmarks, toggleShowBookmarks] = useToggle(true);
    const [isShowDownloads, toggleShowDownloads] = useToggle(true);
    const [isShowItems, toggleShowItems] = useToggle(true);

    const [isUpdate, setUpdate] = useState(false);
    const [isCheckout, setCheckout] = useState(false);
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [isRateItem, setRateItem] = useState(false);
    const [isMessage, setMessage] = useState(false);
    const [isDamaged, setDamaged] = useState(false);
    const [isWrong, setWrong] = useState(false);
    const [isNotReceived, setNotReceived] = useState(false);
    const [isRemoveBookmark, setRemoveBookmark] = useState(false);
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

    const _reset = useCallback(
      () => {setUpdate(false);
             setCheckout(false);
             setRateItem(false);
             setMessage(false);
             setDamaged(false);
             setWrong(false);
             setNotReceived(false);
             setRemoveBookmark(false);
            },
      []
    )

    const _makeRateItemUpdate = useCallback(
      () => { setUpdate(false);
              setCheckout(false);
              setRateItem(true);
              setMessage(false);
              setDamaged(false);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
             },
      []
    )

    const _makeMessageUpdate = useCallback(
      () => { setUpdate(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(true);
              setDamaged(false);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
             },
      []
    )

    const _makeDamagedUpdate = useCallback(
      () => { setUpdate(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(false);
              setDamaged(true);
              setWrong(false);
              setNotReceived(false);
              setRemoveBookmark(false);
             },
      []
    )

    const _makeWrongUpdate = useCallback(
      () => { setUpdate(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(false);
              setDamaged(false);
              setWrong(true);
              setNotReceived(false);
              setRemoveBookmark(false);
             },
      []
    )

    const _makeNotReceivedUpdate = useCallback(
      () => { setUpdate(false);
              setCheckout(false);
              setRateItem(false);
              setMessage(false);
              setDamaged(false);
              setWrong(false);
              setNotReceived(true);
              setRemoveBookmark(false);
             },
      []
    )


    const _makeAccountUpdate = useCallback(
        () => { setUpdate(true);
                setCheckout(false);
                setRateItem(false);
                setMessage(false);
                setDamaged(false);
                setWrong(false);
                setNotReceived(false);
                setRemoveBookmark(false);
                 },
        []
      )

      const _makeRemoveBookmarkUpdate = useCallback(
        () => { setUpdate(false);
                setCheckout(false);
                setRateItem(false);
                setMessage(false);
                setDamaged(false);
                setWrong(false);
                setNotReceived(false);
                setRemoveBookmark(true);
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
                  <h3><strong><i>{withHelp('My Orders: ', 'List of all your ordered Items.')}</i></strong>
                  {numBadge(profileDetail.ok.orders.length)}</h3>
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
                                  {t_strong('Seller Rating: ')}{RATING[rateCheck(_store.reviewAverage)]}<br />
                                  {t_strong('Number of Reviews: ')}{numBadge(_store.reviewCount)}<br />
                                  {t_strong('Member since: ')}{dateCheck(_store.memberSince)}<br />
                                  </Item.Meta>
                                  <Item.Description>
                                  {t_strong('Store Description: ')}{hexToHuman(_store.storeDescription)}<br />
                                  {t_strong('Location: ')}{hexToHuman(_store.sellerLocation)}<br />
                                  </Item.Description>
                                  <Item.Extra>
                                  </Item.Extra>
                              </Item.Content>
                      </Item>
                      </Item.Group>
                  </Message>
                  </>)}</>}</>: t('No Booked Marked Stores.')}
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
                  <h3><strong>{withHelp('Buyer: ','This is your user Account. Check your account details, reviews from sellers, product and service lists, and ordered items here.')}</strong>
                  <Label  as='a' circular color='orange' size='small'
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
                    {t_strong('Buyer Rating: ')}{RATING[rateCheck(profileDetail.ok.buyer.reviewAverage)]}<br />
                    {t_strong('Number of Reviews: ')}{numBadge(profileDetail.ok.buyer.reviewCount)}<br />
                </h3>
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
            callFrom={404}/>

      <ShowProfile />
      {isUpdate && (<>
        <CallSendMessage
                callIndex={11}
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
                callIndex={6}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isDamaged && (<>
        <CallSendMessage
                callIndex={7}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isWrong && (<>
        <CallSendMessage
                callIndex={8}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isNotReceived && (<>
        <CallSendMessage
                callIndex={9}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}

        {isMessage && (<>
        <CallSendMessage
                callIndex={10}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}

        {isRemoveBookmark && (<>
        <CallSendMessage
                callIndex={2}
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
