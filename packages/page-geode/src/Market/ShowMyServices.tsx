// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// *** DEPRICATED ***
// import React, { useState, useCallback } from 'react';
// import { useTranslation } from '../shared/translate.js';
// import { hexToString, isHex } from '@polkadot/util';
// import { styled, Expander, Card } from '@polkadot/react-components';
// import { Grid, Message, Item, Label, Image } from 'semantic-ui-react'

// import CallSendMessage from './CallSendMessage.js';

// import { photoLink, numBadge, withCopy, accountInfo } from './marketutil.js';
// import { acctToShort, checkHttp, boolToHuman, hexToHuman, microToGeode } from './marketutil.js';
// import { hextoPhoto, numCheck, rateCheck, numToPercent } from './marketutil.js';
// import { RATING } from './marketConst.js'

// interface Props {
//     className?: string;
//     onClear?: () => void;
//     isAccount?: boolean;
//     _service: Services;
//   }

//   type Services = {
//     serviceId: string,
//     online: boolean,
//     title: string,
//     price: number,
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
//     bookingLink: string,
//     serviceLocation: string,
//     zenoPercent: number,
//     zenoBuyers: string[]
//   }

  
// function ShowMyServices ({ className = '', _service }: Props): React.ReactElement<Props> | null {
//     //todo: code for unused params or remove!:
//     console.log(JSON.stringify(className));

//     const { t } = useTranslation();
//     function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

//     const [_username, setUsername] = useState('');
//     const [_messageId, setMessageId] = useState('');
//     const [count, setCount] = useState(0);
//     const [isUpdateService, setUpdateService] = useState(false);
//     const [isDeleteService, setDeleteService] = useState(false);

//     const _reset = useCallback(
//       () => {
//              setUpdateService(false);
//              setDeleteService(false);
//             },
//       []
//     )

//     const _makeServiceUpdate = useCallback(
//       () => {
//              setUpdateService(true);
//              setDeleteService(false);
//             },
//       []
//     )

//     const _makeServiceDelete = useCallback(
//       () => {
//              setUpdateService(false);
//              setDeleteService(true);
//             },
//       []
//     )

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
      
//   function ShowService(): JSX.Element {
//     return(<>
//                     <Message>
//                     <Item.Group>
//                     <Item>
//                     <Item.Image as='a' size='tiny' 
//                                 src={hextoPhoto(_service.photoOrYoutubeLink1)} 
//                                 rounded 
//                                 href={isHex(_service.photoOrYoutubeLink1) ? checkHttp(hexToString(_service.photoOrYoutubeLink1).trim()) : ''} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                     /> 
//                     <Item.Content>
//                                 <Item.Header as='a'>{hexToHuman(_service.title)+' '}
//                                 <Label as='a' color='orange' circular 
//                                    onClick={()=>{<>
//                                            {setMessageId(_service.serviceId)}
//                                            {setUsername(_service.title)}
//                                            {setCount(count + 1)}
//                                            {_makeServiceUpdate()}</>}}
//                                    >{' Update '}</Label>
//                                    <Label as='a' color='orange' circular 
//                                    onClick={()=>{<>
//                                            {setMessageId(_service.serviceId)}
//                                            {setUsername(_service.title)}
//                                            {setCount(count + 1)}
//                                            {_makeServiceDelete()}</>}}
//                                    >{' Delete '}</Label>
//                                 {_service.bookingLink.length>2 && photoLink(_service.bookingLink, 'Book')}
//                                 </Item.Header>
//                                 <Item.Meta><h3><strong>{t('Description: ')}{hexToHuman(_service.description)}</strong></h3></Item.Meta>
//                                 <Item.Description>
//                                     {t_strong('Price: ')}{microToGeode(_service.price)}{' Geode'}<br />
//                                     {t_strong('Inventory: ')}{_service.inventory}<br />
//                                     {t_strong('Location: ')}{hexToHuman(_service.serviceLocation)}<br />
//                                     {t_strong('Service Rating: ')}{RATING[rateCheck(_service.reviewAverage)]}<br />
//                                     {t_strong('Number of Reviews: ')}{numBadge(_service.reviewCount)}<br />
//                                     <strong>{withCopy('Service ID: ')}</strong>{acctToShort(_service.serviceId)}<br />
//                                 </Item.Description>
//                                 <Item.Extra>
//                                 <Expander className='details-service' isOpen={false}
//                                     summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
//                                     <Grid columns={2} divided>
//                                         <Grid.Column>
//                                         {t_strong('Seller Account: ')}{accountInfo(_service.sellerAccount)}<br />
//                                         {t_strong('Seller Name: ')}{hexToHuman(_service.sellerName)}<br />
//                                         {t_strong('Category: ')}{hexToHuman(_service.category)}<br />
//                                         {t_strong('Online: ')}{boolToHuman(_service.online)}<br />
//                                         {t_strong('Zeno Percentage: ')}{numToPercent(_service.zenoPercent)}<br />
//                                         {t_strong('Number of Zeno Accounts: ')}{numCheck(_service.zenoBuyers.length)}<br />
//                                         </Grid.Column>
//                                         <Grid.Column>
//                                         {renderLink(_service.photoOrYoutubeLink1)}
//                                         {renderLink(_service.photoOrYoutubeLink2)}
//                                         {renderLink(_service.photoOrYoutubeLink3)}
//                                         </Grid.Column>
//                                     </Grid>                                    
//                                 </Expander>
//                                 </Item.Extra>
//                             </Item.Content>
//                     </Item>
//                     </Item.Group>
//                 </Message>
//     </>)
// }

//   return (
//     <StyledDiv className={className}>
//     <Card>
//       <ShowService />
//         {isUpdateService && (<>
//         <CallSendMessage
//                 callIndex={23}
//                 messageId={_messageId}
//                 username={_username}
//                 onReset={() => _reset()}
//             />      
//         </>)}
//         {isDeleteService && (<>
//         <CallSendMessage
//                 callIndex={25}
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
// export default React.memo(ShowMyServices);
