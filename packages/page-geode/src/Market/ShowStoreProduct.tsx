// Copyright 2017-2023 @polkadot authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// *** DEPRICATED ***
// import React, { useState, useCallback } from 'react';
// import { useTranslation } from '../shared/translate.js';
// import {hexToString, isHex } from '@polkadot/util';
// import { styled, Expander, Card } from '@polkadot/react-components';
// import { Grid, Item,  Label, Image } from 'semantic-ui-react'
// import CallSendMessage from './CallSendMessage.js';
// import { photoLink, numBadge, withCopy, accountInfo, checkHttp, boolToHuman, hexToHuman, microToGeode, hextoPhoto, acctToShort, numCheck, rateCheck, numToPercent } from './marketutil.js';
// import { RATING } from './marketConst.js';

// interface Props {
//     className?: string;
//     _product: Products;
//     onReset?: () => void;
//   }

//   type Products = {
//     productId: string,
//     digital: boolean,
//     title: string,
//     price: number,
//     brand: string,
//     category: string,
//     sellerAccount: string,
//     sellerName: string,
//     description: string,
//     reviewAverage: number,
//     reviewCount: number,
//     inventory: number,
//     photoOrYoutubeLink1: string,
//     photoOrYoutubeLink2: string,
//     photoOrYoutubeLink3: string,
//     moreInfoLink: string,
//     deliveryInfo: string,
//     productLocation: string,
//     zenoPercent: number,
//     zenoBuyers: string[]
//   }
  
// function ShowStoreProduct ({ className = '', _product }: Props): React.ReactElement<Props> | null {
//     const { t } = useTranslation();
//     const [_username, setUsername] = useState('');
//     const [_messageId, setMessageId] = useState('');
//     const [count, setCount] = useState(0);
//     const [isAddToCart, setAddToCart] = useState(false);
//     function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

//     const _reset = useCallback(
//         () => { setAddToCart(false);
//                 setMessageId('');
//               },
//         []
//       )
  
//       const _makeAddToCartUpdate = useCallback(
//         () => { setAddToCart(true);
//                 setMessageId(_product.productId);
//               },
//         []
//       )

//     function showPhoto(_url: string): JSX.Element {
//        return(<>
//        {_url.length>2 && 
//        <> 
//          <Image as='a' 
//                    size='tiny' 
//                    width={150}
//                    height={150}
//                    src={hextoPhoto(_url)} 
//                    rounded 
//                    href={isHex(_url) ? checkHttp(hexToString(_url).trim()) : ''} 
//                    target="_blank" 
//                    rel="noopener noreferrer"
//        />      
//        </>}
//        </>)
//      } 

//     function renderLink(_link: string): JSX.Element {
//       const ilink: string = isHex(_link)? checkHttp(hexToString(_link).trim()): '0x';
//       const videoLink: string = (ilink.includes('embed')) ? ilink 
//           : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
//               : ('https://www.youtube.com/embed/' + ilink.slice(32));
//       return(
//         <>
//         {ilink.trim() != 'http://' ? (<>
//           {(ilink).includes('youtu')? (
//           <iframe width="150" height="100" src={videoLink +'?autoplay=0&mute=1'}> 
//           </iframe>) : (
//           showPhoto(_link)
//           )}    
//         </>) : <>{''}</>}
//         <br /></>
//       )
//     }


// function ShowProduct(): JSX.Element {
//   return(<>
                 
//                     <Item.Group>
//                     <Item>
//                     <Item.Image as='a' size='tiny' 
//                                 src={hextoPhoto(_product.photoOrYoutubeLink1)} 
//                                 rounded 
//                                 href={isHex(_product.photoOrYoutubeLink1) ? checkHttp(hexToString(_product.photoOrYoutubeLink1).trim()) : ''} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                     /> 
//                     <Item.Content>
//                                 <Item.Header as='a'>{hexToHuman(_product.title)+' '}
                                
//                                 <Label as='a' 
//                                        color='orange' 
//                                        circular 
//                                        onClick={()=>{<>
//                                                {/* {setMessageId(_product.productId)} */}
//                                                {setUsername(_product.title)}
//                                                {setCount(count + 1)}
//                                                {_makeAddToCartUpdate()}</>}}
//                                 >{'Add to Cart'}</Label>
                          
//                                 {photoLink(_product.moreInfoLink, 'More Info')}
//                                 </Item.Header>
//                                 <Item.Meta>
//                                     <h3>{t_strong('Description: ')}<strong>{hexToHuman(_product.description)}</strong></h3>
//                                 </Item.Meta>
//                                 <Item.Description>
//                                   {t_strong('Price: ')}{microToGeode(_product.price)}{' Geode'}<br />
//                                   {t_strong('Inventory: ')}{_product.inventory}<br />
//                                   {t_strong('Product Rating: ')}{RATING[rateCheck(_product.reviewAverage)]}<br />
//                                   {t_strong('Number of Reviews: ')}{numBadge(_product.reviewCount)}<br />
//                                   <strong>{withCopy('Product ID: ')}</strong>{acctToShort(_product.productId)}<br />
//                                 </Item.Description>
//                                 <Item.Extra>
//                                 <Expander 
//                                     className='productDetails'
//                                     isOpen={false}
//                                     summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
//                                     <Grid columns={2} divided>
//                                         <Grid.Column>
//                                         {t_strong('Seller Account: ')}{accountInfo(_product.sellerAccount)}<br />
//                                         {t_strong('Seller Name: ')}{hexToHuman(_product.sellerName)}<br />
//                                         {t_strong('Location: ')}{hexToHuman(_product.productLocation)}<br />
//                                         {t_strong('Brand: ')}{hexToHuman(_product.brand)}<br />
//                                         {t_strong('Category: ')}{hexToHuman(_product.category)}<br />
//                                         {t_strong('Delivery Info: ')}{hexToHuman(_product.deliveryInfo)}<br />
//                                         {t_strong('Digital Product: ')}{boolToHuman(_product.digital)}<br />
//                                         {t_strong('Zeno Percent: ')}{numToPercent(_product.zenoPercent)}<br />
//                                         {t_strong('Number of Zeno Accounts: ')}{numCheck(_product.zenoBuyers.length)}<br />
//                                         </Grid.Column>
//                                         <Grid.Column>
//                                         {renderLink(_product.photoOrYoutubeLink1)}
//                                         {renderLink(_product.photoOrYoutubeLink2)}
//                                         {renderLink(_product.photoOrYoutubeLink3)}
//                                         </Grid.Column>
//                                     </Grid>
//                                   </Expander>
//                                 </Item.Extra>
//                             </Item.Content>
//                     </Item>
//                     </Item.Group>
//   </>)
// }

//   return (
//     <StyledDiv className={className}>
//     <Card>
//       <ShowProduct />
//       {isAddToCart && (<>
//         <CallSendMessage
//                 callIndex={0}
//                 messageId={_messageId}
//                 username={_username}
//                 onReset={() => _reset()}
//             />      
//         </>)}
//     </Card>

//     </StyledDiv>
//   );
// }
// const StyledDiv = styled.div`
//   align-items: center;
//   display: flex;

//   .output {
//     flex: 1 1;
//     margin: 0.25rem 0.5rem;
//   }
// `;
// export default React.memo(ShowStoreProduct);
