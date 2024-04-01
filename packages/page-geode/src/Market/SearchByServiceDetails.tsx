// Copyright 2017-2023 @polkadot authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Expander, Card } from '@polkadot/react-components';
import { Message, Grid, Divider, Item, Table, Label, Image } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';
import { photoLink, t_strong, numBadge, withCopy, withHelp, accountInfo } from './marketutil.js';
import { acctToShort, checkHttp, boolToHuman, hexToHuman, microToGeode } from './marketutil.js';
import { hextoPhoto, numCheck, rateCheck, numToPercent } from './marketutil.js';
import { RATING } from './marketConst.js';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
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

  type ServiceObj = {
    search: string,
    services: Services[],
  }

  type ProfileDetail = {
  ok: ServiceObj
  }
  
function SearchByServiceDetails ({ className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
 
    const { t } = useTranslation();
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);
    const [count, setCount] = useState(0);
    const [isAddToCart, setAddToCart] = useState(false);
    const [_username, setUsername] = useState('');
    const [_messageId, setMessageId] = useState('');
    const [_filter, setFilter] = useState('none'); // all // digital // physical // in_stock // 
    const [_sort, setSort] = useState('none');

    const _reset = useCallback(
      () => {setAddToCart(false);
            },
      []
    )

    const _makeAddToCartUpdate = useCallback(
      () => {setAddToCart(true);
            },
      []
    )

    function showPhoto(_url: string): JSX.Element {
      return(<>
      {_url.length>2 && 
      <><Image as='a' size='tiny' 
              width={150} height={150}
              src={hextoPhoto(_url)} rounded 
              href={isHex(_url) ? checkHttp(hexToString(_url).trim()) : ''} 
              target="_blank" rel="noopener noreferrer"
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
                                <Label as='a' 
                                       color='orange' 
                                       circular 
                                       onClick={()=>{<>
                                               {setMessageId(_service.serviceId)}
                                               {setUsername(_service.title)}
                                               {setCount(count + 1)}
                                               {_makeAddToCartUpdate()}</>}}
                                >{'Add to Cart'}</Label>
                               
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
              <Table.Cell verticalAlign='top'>
              <h2>{t_strong('Results for Keyword Search: ')}
              {profileDetail.ok.search[0].length>2? <>{' '} {hexToHuman(profileDetail.ok.search[0])}
                                                     {' '}{hexToHuman(profileDetail.ok.search[1])}
                                                     {' '}{hexToHuman(profileDetail.ok.search[2])}</> : t('All Services')}</h2>

              {profileDetail.ok.services.length>0 && <>
              <h2><strong><i>{withHelp('Services: ', ' Services currently being offered. ')}</i></strong>
              {SortMenu(false)}</h2>
              {_sort==='price'? <>
              {profileDetail.ok.services.length>0 && profileDetail.ok.services
                .filter(_obj => (_filter==='digital' && _obj.online===true) || 
                                (_filter==='in_stock' && _obj.inventory>0) ||
                                (_filter==='none' && _obj.inventory>-1) ||
                                (_filter==='physical' && _obj.online===false)) 
                .sort((a, b) => a.price - b.price)               
                .map((_service)=> <>{ShowService(_service)}
              </>)} 
              </>: 
              _sort==='rating'? <>
              {profileDetail.ok.services.length>0 && profileDetail.ok.services  
                .filter(_obj => (_filter==='digital' && _obj.online===true) || 
                                (_filter==='in_stock' && _obj.inventory>0) ||
                                (_filter==='none' && _obj.inventory>-1) ||
                                (_filter==='physical' && _obj.online===false)) 
                .sort((a,b) => b.reviewAverage - a.reviewAverage)            
                .map((_service)=> <>{ShowService(_service)}
                </>)}                                        
              </>:
              <>
              {profileDetail.ok.services.length>0 && profileDetail.ok.services              
                .filter(_obj => (_filter==='digital' && _obj.online===true) || 
                                (_filter==='in_stock' && _obj.inventory>0) ||
                                (_filter==='none' && _obj.inventory>-1) ||
                                (_filter==='physical' && _obj.online===false)) 
                .map((_service)=> <>{ShowService(_service)}
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
            <Card>{t('WARNING: Your Search is too Broad. Try adding additional keywords for your search.')}</Card>
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
            callFrom={402}/>
      <ShowProfile />
      {isAddToCart && (<>
        <CallSendMessage
                callIndex={0}
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
export default React.memo(SearchByServiceDetails);
