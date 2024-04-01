// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Expander, Toggle, Card } from '@polkadot/react-components';
import { Grid, Message, Item, Table, Label, Image } from 'semantic-ui-react'
import CallSendMessage from './CallSendMessage.js';
import { useToggle } from '@polkadot/react-hooks';
import { numBadge, withCopy, withHelp, accountInfo,  } from './marketutil.js';
import { messageText, timeStampToDate, idNumberShort,  checkHttp,  hexToHuman, microToGeode } from './marketutil.js';
import { hextoPhoto, numCheck, rateCheck } from './marketutil.js';
import { RATING, numToStatus, numToProblem, numToResolution, orderTitle } from './marketConst.js';

interface Props {
    className?: string;
    onClear?: () => void;
    messageIndex: number;
    outcome: CallResult;
  }

type Order = {
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
    discussion: string[], 
    problem: number, 
    resolution: number, 
    zenoTotal: number
}

  type ProfileDetail = {
  ok: Order[]
  }
  
function SellerAwaitingDetails ({ className = '', messageIndex, outcome: { output } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const profileDetail: ProfileDetail = Object.create(JSON.parse(stringify(output)));
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    const orderIndex: number = (messageIndex>34 && messageIndex<40) ? messageIndex-34: 0;
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');

    const [count, setCount] = useState(0);
    const [isBuyerOrders, toggleBuyerOrders] = useToggle(true);
    const [isUpdateTracking, setUpdateTracking] = useState(false);
    const [isIssueRefund, setIssueRefund] = useState(false);
    const [isReplacement, setReplacement] = useState(false);
    const [isDenyRequest, setDenyRequest] = useState(false);
    const [isRefuseOrder, setRefuseOrder] = useState(false);
    const [isRateBuyer, setRateBuyer] = useState(false);
    const [isMessageBuyer, setMessageBuyer] = useState(false);

    // const [_filter, setFilter] = useState('none'); // all // ordered // delivered // in_stock // 
    // const [_sort, setSort] = useState('none');

    const _reset = useCallback(
      () => {
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
      () => {
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
      () => {
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
      () => {
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
      () => {
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
      () => {
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
      () => {
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
      () => {
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
      
function ShowOrders(_order: Order): JSX.Element {
  return(<>
                <Message>
                <Item.Group>
                        <Item>  
                            <Item.Image as='a' size='tiny' 
                                src={hextoPhoto(_order.image)} 
                                rounded 
                                href={isHex(_order.image) ? checkHttp(hexToString(_order.image).trim()) : ''} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            />                           
                            <Item.Content>
                                <Item.Header as='a'>{hexToHuman(_order.itemName)}<br /><br />
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
                                               {setMessageId(_order.orderId)}
                                               {setUsername(_order.deliverToAccount)}
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
                                    {t_strong('Ship To Address: ')}{withCopy(hexToHuman(_order.deliverToAddress))}<br />
                                    {t_strong('Buyer Rating: ')}{RATING[rateCheck(_order.buyerRating)]}<br />
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
                                          {t_strong('Tracking Info: ')}{hexToHuman(_order.trackingInfo)}<br />
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
            <Table.Cell verticalAlign='top'>
                <h3><strong><i>{(withHelp('Buyer Orders: ', orderTitle[orderIndex]))}</i></strong>
                <Label color='blue' circular size='small'><strong>{profileDetail.ok.length}</strong></Label>
                </h3>
                {profileDetail.ok.length>0? <>
                  <Toggle className='info-toggle'
                            label={<>{t_strong('Show')}{t(orderTitle[orderIndex])}</>}
                            onChange={()=> {<>
                                           {toggleBuyerOrders()}
                                           {_reset()}
                                           </>}}
                            value={isBuyerOrders}
                />
                {isBuyerOrders && <>
                  {profileDetail.ok
                      .sort((a, b) => b.orderTimestamp - a.orderTimestamp)
                      .map((_order)=> <>
                          {ShowOrders(_order)}
                      </>)
                }
                </>}
                </>:<>{'No buyer orders to show.'}</>}
                
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
    <StyledDiv className={className}>
    <Card>
      <ShowProfile />
        {isUpdateTracking && (<>
        <CallSendMessage
                callIndex={13}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRefuseOrder && (<>
        <CallSendMessage
                callIndex={14}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isIssueRefund && (<>
        <CallSendMessage
                callIndex={15}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isReplacement && (<>
        <CallSendMessage
                callIndex={16}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isDenyRequest && (<>
        <CallSendMessage
                callIndex={17}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isMessageBuyer && (<>
        <CallSendMessage
                callIndex={18}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRateBuyer && (<>
        <CallSendMessage
                callIndex={19}
                messageId={_messageId}
                toAcct={_username}
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
export default React.memo(SellerAwaitingDetails);
