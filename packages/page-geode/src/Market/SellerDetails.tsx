// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import type { CallResult } from './types.js';
import { stringify } from '@polkadot/util';
import { Divider,Table } from 'semantic-ui-react'
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { hexToString, isHex } from '@polkadot/util';
import { styled, Toggle, Expander, Card } from '@polkadot/react-components';
import { Grid, Message, Item, Label, Image } from 'semantic-ui-react'
import CallSendMessage from './CallSendMessage.js';
import { photoLink, numBadge, withCopy, accountInfo } from './marketutil.js';
import { acctToShort, checkHttp, boolToHuman, hexToHuman, microToGeode } from './marketutil.js';
import { withHelp, hextoPhoto, numCheck, rateCheck, numToPercent } from './marketutil.js';
import { RATING } from './marketConst.js'
import ShowStoreFront from './ShowStoreFront.js';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
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
  
function SellerDetails ({ className = '', outcome: { output } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);
    const [isMyProducts, toggleMyProducts] = useToggle(true);
    const [isMyServices, toggleMyServices] = useToggle(true);

    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [count, setCount] = useState(0);
    const [isUpdateProduct, setUpdateProduct] = useState(false);
    const [isDeleteProduct, setDeleteProduct] = useState(false);
    const [isUpdateService, setUpdateService] = useState(false);
    const [isDeleteService, setDeleteService] = useState(false);


    const _reset = useCallback(
      () => { setUpdateProduct(false);
              setDeleteProduct(false);
              setUpdateService(false);
              setDeleteService(false); 
            },
      []
    )

    const _makeProductUpdate = useCallback(
      () => { setUpdateProduct(true);
              setDeleteProduct(false);
              setUpdateService(false);
              setDeleteService(false); 
            },
      []
    )

    const _makeProductDelete = useCallback(
      () => { setUpdateProduct(false);
              setDeleteProduct(true);
              setUpdateService(false);
              setDeleteService(false); 
            },
      []
    )

    const _makeServiceUpdate = useCallback(
      () => { setUpdateProduct(false);
              setDeleteProduct(false);
              setUpdateService(true);
              setDeleteService(false);
            },
      []
    )

    const _makeServiceDelete = useCallback(
      () => { setUpdateProduct(false);
              setDeleteProduct(false);
              setUpdateService(false);
              setDeleteService(true);
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
                                    
                                      <Label as='a' color='orange' circular 
                                     onClick={()=>{<>
                                             {setMessageId(_product.productId)}
                                             {setUsername(_product.title)}
                                             {setCount(count + 1)}
                                             {_makeProductUpdate()}</>}}
                                     >{' Update '}</Label>
                                    <Label as='a' color='orange' circular 
                                     onClick={()=>{<>
                                             {setMessageId(_product.productId)}
                                             {setUsername(_product.title)}
                                             {setCount(count + 1)}
                                             {_makeProductDelete()}</>}}
                                     >{' Delete '}</Label>
                                   
                                   
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
                                  <Label as='a' color='orange' circular 
                                     onClick={()=>{<>
                                             {setMessageId(_service.serviceId)}
                                             {setUsername(_service.title)}
                                             {setCount(count + 1)}
                                             {_makeServiceUpdate()}</>}}
                                     >{' Update '}</Label>
                                     <Label as='a' color='orange' circular 
                                     onClick={()=>{<>
                                             {setMessageId(_service.serviceId)}
                                             {setUsername(_service.title)}
                                             {setCount(count + 1)}
                                             {_makeServiceDelete()}</>}}
                                     >{' Delete '}</Label>
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
              <ShowStoreFront _seller={profileDetail.ok.owner} _isOwner={true}/>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Cell verticalAlign='top'>
                <Divider />
                <h2><strong><i>{withHelp('My Products: ', ' Your Products currently being offered. ')}</i></strong>
                {numBadge(profileDetail.ok.products.length)}
                </h2>
                {profileDetail.ok.products.length>0? <>
                  <Toggle className='info-toggle' label={<strong>{t('Show My Products: ')}</strong>}
                            onChange={()=> {<>
                                           {toggleMyProducts()}
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
                                           </>}}
                            value={isMyServices}
                />
                {isMyServices && <>
                  {profileDetail.ok.services.length>0 && profileDetail.ok.services.map((_service)=> <>
                  {ShowService(_service)}
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
    <StyledDiv className={className}>
    <Card>
      <ShowProfile />
      {isUpdateProduct && (<>
        <CallSendMessage
                callIndex={21}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isDeleteProduct && (<>
        <CallSendMessage
                callIndex={24}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isUpdateService && (<>
        <CallSendMessage
                callIndex={23}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isDeleteService && (<>
        <CallSendMessage
                callIndex={25}
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
export default React.memo(SellerDetails);
