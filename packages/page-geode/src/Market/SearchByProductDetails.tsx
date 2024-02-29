// Copyright 2017-2023 @polkadot authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Expander, Button, Card } from '@polkadot/react-components';
import { Grid, Divider, Item, Message, Table, Label, Image } from 'semantic-ui-react'
//import CopyInline from '../shared/CopyInline.js';
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';
import { photoLink, t_strong, numBadge, withCopy, withHelp, accountInfo, dateCheck } from './marketutil.js';
import { acctToShort, checkHttp, boolToHuman, hexToHuman, microToGeode } from './marketutil.js';
import { hextoPhoto, numCheck, rateCheck, numToPercent } from './marketutil.js';

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

  type ProductObj = {
    search: string,
    products: Products[],
  }

  type ProfileDetail = {
    ok: ProductObj
  }
  
function SearchByProductDetails ({  className = '', onClear,  
                                    outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    //todo: code for unused params or remove!:
    // console.log(JSON.stringify(className));
    // console.log(JSON.stringify(isAccount));
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));

//    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);

    const [count, setCount] = useState(0);
    const [isAddToCart, setAddToCart] = useState(false);
    const [isAddToList, setAddToList] = useState(false);
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [_filter, setFilter] = useState('none'); // all // digital // physical // in_stock // 
    const [_sort, setSort] = useState('none');

//    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    // const hextoPhoto = (_url: string) => (isHex(_url) ? withHttp(hexToString(_url).trim()) : defaultImage);
    // const acctToShort = (_acct: string) => (_acct.length>7 ? _acct.slice(0,7)+'...' : _acct);
    // const microToGeode = (_num: number) => (_num>-1 ? _num/1000000000000: 0);
    // const boolToHuman = (_bool: boolean) => (_bool? 'Yes': 'No');
    // const numCheck = (_num: number) => (_num>-1 ? _num: 0);
    // const rateCheck = (_num: number) => ((_num>0 && _num<6)? _num: 1);
    // const dateCheck = (_num: number) => (_num>0? timeStampToDate(_num): t('No Date'));
    const rating: string[] = ['','⭐️','⭐️⭐️','⭐️⭐️⭐️','⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️'];
//    const numToPercent = (_num: number) => ((_num>-1 && _num<=100)? _num.toString(): '0')+ ' %';

    const _reset = useCallback(
      () => {setAddToCart(false);
             setAddToList(false);
            },
      []
    )

    const _makeAddToCartUpdate = useCallback(
      () => {setAddToCart(true);
             setAddToList(false);
            },
      []
    )

    const _makeAddToListUpdate = useCallback(
      () => {setAddToCart(false);
             setAddToList(true);
            },
      []
    )

    // function hexToHuman(_hexIn: string): string {
    //     return((isHex(_hexIn))? t(hexToString(_hexIn).trim()): '')
    //   }

    // function numBadge(_num: number): JSX.Element {
    //     return(<>
    //       <Label circular size='small' color='blue'>
    //         {numCheck(_num)}
    //       </Label>
    //     </>)
    //   }
  
    // function timeStampToDate(tstamp: number): JSX.Element {
    //     try {
    //      const event = new Date(tstamp);
    //      return (
    //           <><i>{event.toDateString()}{' '}
    //                {event.toLocaleTimeString()}{' '}</i></>
    //       )
    //     } catch(error) {
    //      console.error(error)
    //      return(
    //          <><i>{t('No Date')}</i></>
    //      )
    //     }
    //  }

    // function photoLink(_url: string, _title: string): JSX.Element {
    //     return(<>
    //     {_url.length>2 &&
    //               <Label as='a' color='orange' circular
    //               href={isHex(_url) ? withHttp(hexToString(_url).trim()) : ''} 
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
    
  // function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
  // function withCopy(_str: string): JSX.Element {return(<>{_str}{' '}<CopyInline value={_str} label={''}/></>)}

  // function withHelp(_str: string, _help: string): JSX.Element {
  //     return(<>
  //     <LabelHelp help={t(_help)} />
  //     {' '}{t(_str)}
  //     </>)
  // }

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

  // function accountInfo(_acct: string): JSX.Element {
  //     return(<>
  //         <IdentityIcon value={_acct}/>
  //         <AccountName value={_acct} withSidebar={true}/>
  //         {acctToShort(_acct)}{' '}
  //         <CopyInline value={_acct} label={''}/>
  //     </>)
  // }
  
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
                                                     {_makeAddToCartUpdate()}</>}}
                                      >{t('Add to Cart')}</Label>
                                      <Label as='a' 
                                             color='orange' 
                                             circular 
                                             onClick={()=>{<>
                                                     {setMessageId(_product.productId)}
                                                     {setUsername(_product.title)}
                                                     {setCount(count + 1)}
                                                     {_makeAddToListUpdate()}</>}}
                                      >{t('Add to List')}</Label>
                                      {photoLink(_product.moreInfoLink, 'More Info')}
                                      </Item.Header>
                                      <Item.Meta>
                                          <h3>{t_strong('Description: ')}<strong>{hexToHuman(_product.description)}</strong></h3>
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
                                                {index+1}{'. '}{dateCheck(_review.timestamp)}{accountInfo(_review.reviewer)}{' | '}{hexToHuman(_review.review)}{' '}{rating[rateCheck(_review.rating)]}<br />
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
      
  function ShowProfile(): JSX.Element {
          try {
            return(
              <div>
              <Table stretch>
              <Table.Header>
                <Table.Row>
                </Table.Row>
              </Table.Header>
                <Table.Cell verticalAlign='top'>
                <h2>{t_strong('Results for Keyword Search: ')}
                        {profileDetail.ok.search.length>2? '"' + hexToHuman(profileDetail.ok.search) + '"': t('All Products')}</h2>
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
              </Table.Cell>
        </Table>
        </div>   
        )
      } catch(e) {
        console.log(e);
        return(
          <div>
            <Card>{t('No Product Data')}</Card>
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
      {isAddToCart && (<>
        <CallSendMessage
                callIndex={0}
                messageId={_messageId}
                username={_username}
                onReset={() => _reset()}
            />      
        </>)}
        {isAddToList && (<>
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
export default React.memo(SearchByProductDetails);
