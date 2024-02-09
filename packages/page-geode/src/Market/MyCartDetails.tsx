// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Divider, Item, Message, Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
  }
  
  type Products = {
    productId: string,
    quantity: number,
    digital: boolean,
    title: string,
    price: number,
    brand: string,
    sellerAccount: string,
    sellerName: string,
    photoOrYoutubeLink1: string,
    inventory: number,
    deliveryInfo: string,
    productLocation: string,
    zenoPercent: number,
    zenoBuyers: number
  }

  type Services = {
    serviceId: string,
    quantity: number,
    online: boolean,
    title: string,
    price: number,
    sellerAccount: string,
    sellerName: string,
    photoOrYoutubeLink1: string,
    inventory: number,
    bookingLink: string,
    serviceLocation: string,
    zenoPercent: number,
    zenoBuyers: number
  }
 
  type CartObj = {
    buyer: string,
    cartTotal: number,
    totalItems: number,
    cartProducts: Products[],
    cartServices: Services[]
  }

  type ProfileDetail = {
  ok: CartObj
  }
  
function MyCartDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
// todo: code for allCodes:
  console.log(JSON.stringify(className));
// other props:
// isAccount,
// message,
// params
// result

    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);

    const [count, setCount] = useState(0);
    const [isUpdateQty, setUpdateQty] = useState(false);
    const [isRemoveItem, setRemoveItem] = useState(false);
    const [isCheckout, setCheckout] = useState(false);
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');

    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    const hextoPhoto = (_url: string) => (isHex(_url) ? withHttp(hexToString(_url).trim()) : defaultImage);
    const acctToShort = (_acct: string) => (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
    const microToGeode = (_num: number) => (_num>-1 ? _num/1000000000000: 0);
    const boolToHuman = (_bool: boolean) => (_bool? 'Yes': 'No');
    const numToPercent = (_num: number) => ((_num>-1 && _num<=100)? _num.toString(): '0')+ ' %';
    const numCheck = (_num: number) => (_num>-1 ? _num: 0);

    const _reset = useCallback(
      () => {setUpdateQty(false);
             setRemoveItem(false);
             setCheckout(false);
            },
      []
    )

    const _makeAddToCartUpdate = useCallback(
      () => {setUpdateQty(true);
             setRemoveItem(false);
             setCheckout(false);
            },
      []
    )

    const _makeAddToListUpdate = useCallback(
      () => {setUpdateQty(false);
             setRemoveItem(true);
             setCheckout(false);
            },
      []
    )

    const _makeCheckoutUpdate = useCallback(
        () => {setUpdateQty(false);
               setRemoveItem(false);
               setCheckout(true);
              },
        []
      )
  
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function hextoHuman(_hexIn: string): string {return((isHex(_hexIn))? t(hexToString(_hexIn).trim()): '')}
    function withCopy(_str: string): JSX.Element {return(<>{_str}{' '}<CopyInline value={_str} label={''}/></>)}

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
    
    function numBadge(_num: number): JSX.Element {
      return(<>
        <Label circular size='small' color='blue'>
          {numCheck(_num)}
        </Label>
      </>)
    }
  
    function accountInfo(_acct: string): JSX.Element {
      return(<>
          <IdentityIcon value={_acct}/>{' | '}
          <AccountName value={_acct} withSidebar={true}/>{' | '}
          {acctToShort(_acct)}{' '}
          <CopyInline value={_acct} label={''}/>
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
                                      <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_product.productId)}
                                               {setUsername(_product.title)}
                                               {setCount(count + 1)}
                                               {_makeAddToCartUpdate()}</>}}
                                      >{t('Update Quantity')}</Label>
                                      <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_product.productId)}
                                               {setUsername(_product.title)}
                                               {setCount(count + 1)}
                                               {_makeAddToListUpdate()}</>}}
                                      >{t('Remove Item')}</Label>
                                      </Item.Header>
                                      <Item.Meta>
                                          <h3>{t_strong('Description: ')}<strong>{hextoHuman(_product.title)}</strong></h3>
                                      </Item.Meta>
                                      <Item.Description>
                                        {t_strong('Quantity: ')}{numBadge(_product.quantity)}<br />
                                        {t_strong('Price: ')}{microToGeode(_product.price)}{' Geode'}<br />
                                        {t_strong('Inventory: ')}{_product.inventory}<br />
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
                                              {t_strong('Seller Name: ')}{hextoHuman(_product.sellerName)}<br />
                                              {t_strong('Location: ')}{hextoHuman(_product.productLocation)}<br />
                                              {t_strong('Brand: ')}{hextoHuman(_product.brand)}<br />
                                              {t_strong('Delivery Info: ')}{hextoHuman(_product.deliveryInfo)}<br />
                                              {t_strong('Digital Product: ')}{boolToHuman(_product.digital)}<br />
                                              {t_strong('Zeno Percent: ')}{numToPercent(_product.zenoPercent)}<br />
                                              {t_strong('Number of Zeno Buyers: ')}{_product.zenoBuyers}<br />
                                              </Grid.Column>
                                              <Grid.Column>
                                              {renderLink(_product.photoOrYoutubeLink1)}
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
                                >{'Update Quantity'}</Label>
                                    <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_service.serviceId)}
                                               {setUsername(_service.title)}
                                               {setCount(count + 1)}
                                               {_makeAddToListUpdate()}</>}}
                                >{'Remove Item'}</Label>
                                    {_service.bookingLink.length>2 && photoLink(_service.bookingLink, 'Book')}
                                    </Item.Header>
                                    <Item.Meta><h3><strong>{t('Description: ')}{hextoHuman(_service.title)}</strong></h3></Item.Meta>
                                    <Item.Description>
                                        {t_strong('Quantity: ')}{numBadge(_service.quantity)}<br />
                                        {t_strong('Price: ')}{microToGeode(_service.price)}{' Geode'}<br />
                                        {t_strong('Inventory: ')}{_service.inventory}<br />
                                        <strong>{withCopy('Service ID: ')}</strong>{acctToShort(_service.serviceId)}<br />
                                    </Item.Description>
                                    <Item.Extra>
                                    <Expander className='details-service' isOpen={false}
                                        summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
                                        <Grid columns={2} divided>
                                            <Grid.Column>
                                            {t_strong('Seller Account: ')}{accountInfo(_service.sellerAccount)}<br />
                                            {t_strong('Seller Name: ')}{hextoHuman(_service.sellerName)}<br />
                                            {t_strong('Location: ')}{hextoHuman(_service.serviceLocation)}<br />
                                            {t_strong('Online: ')}{boolToHuman(_service.online)}<br />
                                            {t_strong('Zeno Percentage: ')}{numToPercent(_service.zenoPercent)}<br />
                                            {t_strong('Number of Zeno Buyers: ')}{_service.zenoBuyers}<br />                                           
                                            </Grid.Column>
                                            <Grid.Column>
                                            {renderLink(_service.photoOrYoutubeLink1)}
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
          //const _bannerUrl: string = (isHex(profileDetail.ok.seller.bannerUrl) ? withHttp(hexToString(profileDetail.ok.seller.bannerUrl).trim()) : defaultImage);
          return(
            <div>
            <Table stretch>
            <Table.Header>
              <Table.Row>
              <Table.HeaderCell>
                <h2><strong>{t('Buyer: ')}</strong>{accountInfo(profileDetail.ok.buyer)}<br /><br />
                <Label  as='a' 
                        color='orange' 
                        size='large'
                        onClick={()=>{<>
                            {setMessageId('')}
                            {setUsername('')}
                            {setCount(count + 1)}
                            {_makeCheckoutUpdate()}</>}}
                        >{t('Checkout')}</Label><br /><br />
                    <strong>{t('Total Amount in Cart: ')}</strong>{microToGeode(profileDetail.ok.cartTotal)}{t(' Geode')}
                    {t(' <--- Enter this value in the Total Amount in Cart input when checking out.')}<br /><br />
                    <strong>{t('Number of Items: ')}</strong>
                    <Label  color='blue' circular size='large'>{profileDetail.ok.totalItems}</Label>
                </h2>
              </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
              <Table.Cell verticalAlign='top'>
                  <h2><LabelHelp help={t(' List of Products currently in Your Cart. ')} />
                  {' '}<strong><i>{t('Products in Cart: ')}</i></strong></h2>
                  {profileDetail.ok.cartProducts.length>0 && 
                      profileDetail.ok.cartProducts.map((_product)=> <>
                  {ShowProduct(_product)}
                  </>)}
                  <Divider />
                  <h2><LabelHelp help={t(' List of Services currently in Your Cart. ')} />
                  {' '}<strong><i>{t('Services in Cart: ')}</i></strong></h2>
                  {profileDetail.ok.cartServices.length>0 && 
                      profileDetail.ok.cartServices.map((_service)=> <>
                  {ShowService(_service)}
                  </>)}
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
    <>
    <Card>
    <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={99}/>
      <ListAccount />
      <ShowProfile />
      {isUpdateQty && (<>
        <CallSendMessage
                callIndex={5}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isRemoveItem && (<>
        <CallSendMessage
                callIndex={4}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isCheckout && (<>
        <CallSendMessage
                callIndex={6}
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
export default React.memo(MyCartDetails);
