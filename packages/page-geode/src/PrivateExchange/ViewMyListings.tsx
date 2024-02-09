// Copyright 2017-2023 @polkadot/app-reporting authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Button, AccountName, Card } from '@polkadot/react-components';
import { Table, Label } from 'semantic-ui-react'
import CallSendMessage from './CallSendMessage.js';
import { useToggle } from '@polkadot/react-hooks';

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

type Listings = {
  listings: ListingObj[],
}

type ListingsDetail = {
  ok: Listings
}

function ViewMyListings ({ className = '', outcome: { output } }: Props): React.ReactElement<Props> | null {
  //todo: code for allCodes:
  // console.log(JSON.stringify(from));
  // console.log(JSON.stringify(message));
  // console.log(JSON.stringify(onClear));
  // console.log(JSON.stringify(params));
  // console.log(JSON.stringify(result));
  // console.log(JSON.stringify(when));
  const { t } = useTranslation();
  const objOutput: string = stringify(output);
  const _Obj = JSON.parse(objOutput);
  const listingsDetail: ListingsDetail = Object.create(_Obj);
  
  // useStates for one-click buttons, and any params they pass
  const [isEditListing, setEditListing] = useState(false);
  const [passListingID, setPassListingID] = useState('');
  const [passOfferCoin, setPassOfferCoin] = useState('');
  const [passAskingCoin, setPassAskingCoin] = useState('');
  const [passPrice, setPassPrice] = useState(0);
  const [passMethod, setPassMethod] = useState('');
  const [passInventory, setPassInventory] = useState(0);
  const [passCountry, setPassCountry] = useState('');
  const [passCity, setPassCity] = useState('');
  const [passNotes, setPassNotes] = useState('');
  
  
  // useToggles for secondary buttons on this display
  const [isNewListing, toggleNewListing] = useToggle(false);

  const [count, setCount] = useState(0);
    
  const _reset = useCallback(
    () => {setEditListing(false);
          },
    []
  )
  
  const _editListing = useCallback(
    () => {setEditListing(true);
          },
    []
  )

  function ShowSubMenus(): JSX.Element {
    return(
        <div>
          <Table>
            <Table.Row>
              <Table.Cell>
                <Button
                  icon={isNewListing? 'minus': 'plus'}
                  label={t('New Listing')}
                  //isDisabled={isAddEntity}
                  onClick={()=> {<>{toggleNewListing()}{_reset()}</>}}
                />
             </Table.Cell>
            </Table.Row>
          </Table>
        </div>
  )}

  function BNtoGeode(_num: number): JSX.Element {
    return(<>
        {_num>0? <>{(_num/1000000000000).toString()}</>: <>{'0'}</>}
    </>)
  }

  function booleanToHuman(_bool: boolean): JSX.Element {
    return(<>
    <Label 
      circular
      color='grey'
      >{_bool? 'Hidden': 'Show'}
    </Label>
    </>
    )
  }

  function ShowListings(): JSX.Element {
    try {
      return(
        <div>
        <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              <h3><strong>{t(' My Listings: ')}</strong></h3>
              <br />
              {listingsDetail.ok.listings.map((_listings) =>  
                <div>
                  <strong>{t(' Listing ID: ')}</strong>
                  {_listings.listingId}
                  <br /><strong>{t(' Hide: ')}</strong>
                  <>{booleanToHuman(_listings.hide)}</>
                  <br /><strong>{t(' Seller: ')}</strong>
                  <><AccountName value={_listings.seller} withSidebar={true}/></>
                  <br /><strong>{t(' Offer / Asking: ')}</strong>
                  <>{isHex(_listings.offerCoin) ? hexToString(_listings.offerCoin) : ' '}{t(' / ')}{isHex(_listings.askingCoin) ? hexToString(_listings.askingCoin) : ' '}</>
                  <br /><strong>{t(' Price: ')}</strong>
                  <>{BNtoGeode(_listings.price)}</>
                  <br /><strong>{t(' Inventory: ')}</strong>
                  <>{BNtoGeode(_listings.inventory)}</>
                  <br /><strong>{t(' Location: ')}</strong>
                  <>{isHex(_listings.city) ? hexToString(_listings.city) : ' '}{t(', ')}{isHex(_listings.country) ? hexToString(_listings.country) : ' '}</>
                  <br /><strong>{t(' Method: ')}</strong>
                  <>{isHex(_listings.method) ? hexToString(_listings.method) : ' '}</>
                  <br /><strong>{t(' Notes: ')}</strong>
                  <>{isHex(_listings.notes) ? hexToString(_listings.notes) : ' '}</>

                  <br />
                  <Label as='a' 
                        circular
                        color='orange'
                        onClick={()=>{<>
                          {setPassListingID(_listings.listingId)}
                          {setPassOfferCoin(_listings.offerCoin)}
                          {setPassAskingCoin(_listings.askingCoin)}
                          {setPassPrice(_listings.price)}
                          {setPassMethod(_listings.method)}
                          {setPassInventory(_listings.inventory)}
                          {setPassCountry(_listings.country)}
                          {setPassCity(_listings.city)}
                          {setPassNotes(_listings.notes)}
                          {setCount(count + 1)}
                          {_editListing()}</>}}
                        >{'Edit'}</Label>
                  <br /><br />
              </div>
              )} 
            </Table.Cell>
          </Table.Row>
        </Table>
        </div> 
      )

    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('Nothing To Show')}</Card>
        </div>
      )
    }
  }

  return (
    <StyledDiv className={className}>
    <Card>
      <ShowSubMenus />
      {isNewListing && !isEditListing &&  (
        <CallSendMessage
          callIndex={0}
          onClear={() => _reset()}
        />
      )}
      {!isNewListing && isEditListing &&  (
        <CallSendMessage
          passListingID={passListingID}
          passOfferCoin={passOfferCoin}
          passAskingCoin={passAskingCoin}
          passPrice={passPrice}
          passMethod={passMethod}
          passInventory={passInventory}
          passCountry={passCountry}
          passCity={passCity}
          passNotes={passNotes}
          callIndex={1}
          onClear={() => _reset()}
        />
      )}
      <ShowListings />
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

export default React.memo(ViewMyListings);
