// Copyright 2017-2023 @polkadot/app-reporting authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString } from '@polkadot/util';
import { styled, Expander, Card, Button } from '@polkadot/react-components';
import { Label, Grid, Input, Table } from 'semantic-ui-react'
import { BNtoGeode, boolToHuman, hexToHuman, idToShort, accountName, t_strong } from './ExchangeUtil.js';

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: CallResult;
}

type ListingObj = {
  listingId: string,
  seller: string,
  offerCoin: string,
  askingCoin: string,
  pair: string[],
  price: number,
  method: string,
  inventory: number,
  country: string,
  city: string,
  notes: string,
  hide: boolean,
}

type AllListingsDetail = {
ok: ListingObj[]
}

function ViewAllListings ({ className = '', outcome: { output } }: Props): React.ReactElement<Props> | null {
   
  const { t } = useTranslation();
  const objOutput: string = stringify(output);
  const _Obj = JSON.parse(objOutput);
  const allListingsDetail: AllListingsDetail = Object.create(_Obj);
  const [searchString, setSearchString] = useState('');

  function ShowAllListings(): JSX.Element {
    try {
      return(
        <div>
        <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              {allListingsDetail.ok.length > 0 && allListingsDetail.ok
              // sort into descending order based on total inventory
              .sort((a, b) => b.inventory - a.inventory) 
               // sort into descending order based on price
               .sort((a, b) => b.price - a.price)   
               // filter
              .filter(obj => (
                hexToString(obj.city).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.country).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.method).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.notes).toLowerCase().includes(searchString.toLowerCase())
                || obj.seller.includes(searchString)
                || hexToString(obj.offerCoin).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.askingCoin).toLowerCase().includes(searchString.toLowerCase())
                )
              )                         
              // map to output
              .map((_out) =>  
              <>
              <Button isCircular icon='gem'/>
              {' '}{t_strong('Offer: ')}{hexToString(_out.offerCoin)}{' | '}{t_strong('Ask: ')}{hexToString(_out.askingCoin)}{' | '}
              {t_strong(' Inventory: ')}{BNtoGeode(_out.inventory)}{t_strong(' Price: ')}{BNtoGeode(_out.price)}{' | '}{accountName(_out.seller)}
              <Expander 
                                          className='productDetails'
                                          isOpen={false}
                                          summary={<Label size={'small'} color='orange' circular> {t('Details: ')}</Label>}>
                                          <Grid columns={1} divided>
                                              <Grid.Column>
                                              {t_strong('Listing ID: ')}{idToShort(_out.listingId)}<br />
                                              {t_strong('Seller: ')}{accountName(_out.seller)}<br />
                                              {t_strong('Country: ')}{hexToHuman(_out.country)}<br />
                                              {t_strong('City: ')}{hexToHuman(_out.city)}<br />
                                              {t_strong('Price: ')}{BNtoGeode(_out.price)}<br />
                                              {t_strong('Available: ')}{BNtoGeode(_out.inventory)}<br />
                                              {t_strong('Method: ')}{hexToHuman(_out.method)}<br />
                                              {t_strong('Notes: ')}{hexToHuman(_out.notes)}<br />
                                              {t_strong('Hidden: ')}{boolToHuman(_out.hide)}<br />
                                              </Grid.Column>
                                          </Grid>
              </Expander>
              <br />
              </>)}
            </Table.Cell>
          </Table.Row>
        </Table>
        </div> 
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Reports To Show')}</Card>
        </div>
      )
    }
  }

  return (
    <StyledDiv className={className}>
    <Card>
      <Input  id="inputSearchString"
              name="inputSearchString"
              type="text"
              placeholder='Search...'
              value={searchString}
              onChange={(e) => {setSearchString(e.target.value)}}
      />
      <ShowAllListings />
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

export default React.memo(ViewAllListings);
