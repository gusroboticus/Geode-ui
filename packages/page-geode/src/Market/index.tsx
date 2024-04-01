// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { styled, Card, Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { useCodes } from '../useCodes.js';
import { useContracts } from '../useContracts.js';
import ContractsTable from './ContractsTable.js';
import { Label } from 'semantic-ui-react'
import Summary from './MarketSummary.js';
import { refTitle } from './marketConst.js';

interface Props {
    className?: string;
  }
  
export default function Market ({ className = 'market_index' }: Props): React.ReactElement {
    const { t } = useTranslation();
    const [isGotoStore, toggleGotoStore] = useToggle();
    const [isFindStore, toggleFindStore] = useToggle();
    const [isFindProducts, toggleFindProducts] = useToggle();
    const [isFindServices, toggleFindServices] = useToggle();
    const [isMyAccount, toggleMyAccount]=useToggle();
    const [isMyCart, toggleMyCart] = useToggle();
    const [isSellerAcct, toggleSellerAcct] = useToggle();

    const [isUpdateSet, toggleUpdateSet] = useToggle();
    const [isAddProduct, toggleAddProduct] = useToggle();
    const [isAddService, toggleAddService] = useToggle();
    const [isSellerOrders, toggleSellerOrders] = useToggle();

    const [isSellerAwaiting, setSellerAwaiting] = useState(false);
    const [isSellerShipped, setSellerShipped] = useState(false);
    const [isSellerDelivered, setSellerDelivered] = useState(false);
    const [isSellerResolved, setSellerResolved] = useState(false);
    const [isSellerProblem, setSellerProblem] = useState(false);
    const [isSellerRefused, setSellerRefused] = useState(false);
    const { allCodes, codeTrigger } = useCodes();
    const { allContracts } = useContracts();
    // todo
    console.log(allCodes);
    //todo
    const deployApp: boolean = true;
        
  return (
    <StyledDiv className={className}>
 
    <div>
        <Table >
            <Summary />
            <Card>
            {!deployApp && (<><strong>{'Coming Soon!'}</strong></>)}

        {deployApp && !isFindServices && !isFindStore
                   && !isMyAccount && !isMyCart 
                   && !isSellerAcct && !isFindProducts && (
        <><Button
                icon={(isGotoStore) ? 'minus' : 'unlock'}
                label={t('Go to Store')}
                onClick={toggleGotoStore}>
          </Button>
          </>
        )}

        {deployApp && !isFindServices && !isFindStore
                   && !isMyAccount && !isMyCart 
                   && !isSellerAcct && !isGotoStore && (
        <><Button
                icon={(isFindProducts) ? 'minus' : 'wrench'}
                label={t('Find Products')}
                onClick={toggleFindProducts}>
          </Button>
          </>
        )}
        {deployApp && !isFindProducts && !isFindStore
                   && !isMyAccount && !isMyCart 
                   && !isSellerAcct && !isGotoStore && (
          <>
              <Button
                icon={(isFindServices) ? 'minus' : 'people-arrows'}
                label={t('Find Services')}
                onClick={toggleFindServices}>
              </Button>    
          </>
        )}
        {deployApp && !isFindProducts && !isFindServices
                   && !isMyAccount && !isMyCart 
                   && !isSellerAcct && !isGotoStore && (
          <>
              <Button
                icon={(isFindStore) ? 'minus' : 'file'}
                label={t('Find Stores')}
                onClick={toggleFindStore}>
              </Button>    
          </>
        )}

        {deployApp && !isFindProducts && !isFindStore
                   && !isFindServices && !isMyCart 
                   && !isSellerAcct && !isGotoStore && (
          <>
          <Button
            icon={(isMyAccount) ? 'minus' : 'user'}
            label={t('My Account')}
            onClick={toggleMyAccount}>
          </Button>    
          </>
        )}
        {deployApp && !isFindProducts && !isFindStore
                   && !isFindServices && !isMyAccount 
                   && !isSellerAcct && !isGotoStore && (
          <>
          <Button
            icon={(isMyCart) ? 'minus' : 'shopping-basket'}
            label={t('My Cart')}
            onClick={toggleMyCart}>
          </Button>    
          </>
        )}
        {deployApp && !isFindProducts && !isFindStore
                   && !isFindServices && !isMyAccount 
                   && !isMyCart && !isGotoStore && (
          <>
          <Button
            icon={(isSellerAcct) ? 'minus' : 'building'}
            label={t('Seller Account')}
            isDisabled={isUpdateSet || isAddProduct || isAddService || isSellerOrders}
            onClick={toggleSellerAcct}>
          </Button>    
          </>
        )}

        {isFindProducts && (<>{refTitle[0]}</>)}
        {isFindServices && (<>{refTitle[1]}</>)}
        {isMyAccount && (<>{refTitle[3]}</>)}
        {isMyCart && (<>{refTitle[4]}</>)}
        {isSellerAcct && (<>{refTitle[5]}</>)}
        {isFindStore && (<>{refTitle[6]}</>)}
        {isGotoStore && (<>{refTitle[7]}</>)}
        </Card> 

        {isSellerAcct && (
        <>
          <Card>
            <>
              <Button
                icon={(isUpdateSet) ? 'minus' : 'plus'}
                label={t('Update Settings')}
                isDisabled={isAddProduct || isAddService || isSellerOrders}
                onClick={toggleUpdateSet}>
              </Button>    
            </>
            <>
              <Button
                icon={(isAddProduct) ? 'minus' : 'plus'}
                label={t('Add Product')}
                isDisabled={isUpdateSet || isAddService || isSellerOrders}
                onClick={toggleAddProduct}>
              </Button>    
            </>
            <>
              <Button
                icon={(isAddService) ? 'minus' : 'plus'}
                label={t('Add Service')}
                isDisabled={isUpdateSet || isAddProduct || isSellerOrders}
                onClick={toggleAddService}>
              </Button>    
            </>
            <>
              <Button
                icon={(isSellerOrders) ? 'minus' : 'plus'}
                label={t('Seller Orders')}
                isDisabled={isUpdateSet || isAddService || isAddProduct }
                onClick={()=> {<>{toggleSellerOrders()}
                                 {setSellerAwaiting(false)}
                                 {setSellerShipped(false)}
                                 {setSellerDelivered(false)}
                                 {setSellerResolved(false)}
                                 {setSellerProblem(false)}
                                 {setSellerRefused(false)}</>}}>
              </Button>    
            </>
          </Card>
        </>
        )}
        {isSellerOrders && isSellerAcct && (
        <>
          <Card>
            <>
            <Label as='a' circular color={isSellerAwaiting? 'blue': 'orange'} onClick={()=> <>{isSellerAwaiting? setSellerAwaiting(false): setSellerAwaiting(true)}</>}>Awaiting</Label>
            <Label as='a' circular color={isSellerShipped? 'blue': 'orange'} onClick={()=> <>{isSellerShipped? setSellerShipped(false): setSellerShipped(true)}</>}>Shipped</Label>
            <Label as='a' circular color={isSellerDelivered? 'blue': 'orange'} onClick={()=> <>{isSellerDelivered? setSellerDelivered(false): setSellerDelivered(true)}</>}>Delivered</Label>
            <Label as='a' circular color={isSellerResolved? 'blue': 'orange'} onClick={()=> <>{isSellerResolved? setSellerResolved(false): setSellerResolved(true)}</>}>Resolved</Label>
            <Label as='a' circular color={isSellerProblem? 'blue': 'orange'} onClick={()=> <>{isSellerProblem? setSellerProblem(false): setSellerProblem(true)}</>}>Problem</Label>
            <Label as='a' circular color={isSellerRefused? 'blue': 'orange'} onClick={()=> <>{isSellerRefused? setSellerRefused(false): setSellerRefused(true)}</>}>Refused</Label>
            </>
          </Card>
        </>
        )}
        </Table>
        {isFindProducts && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={26}
        />)}
        {isFindServices && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={27}
        />)}
        {isFindStore && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={28}
        />)}

        {isUpdateSet && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={12}
        />)}
        {isMyAccount && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={30}
        />)}

        {isAddProduct && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={20}
        />)}
        {isAddService && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={22}
        />)}
        {isMyCart && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={31}
        />)}
        {isGotoStore && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={32}
        />)}

        {isSellerAwaiting && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={34}
        />)}
        {isSellerShipped && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={35}
        />)}
        {isSellerDelivered && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={36}
        />)}
        {isSellerResolved && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={37}
        />)}
        {isSellerProblem && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={38}
        />)}
        {isSellerRefused && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={39}
        />)}
        {isSellerAcct && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={33}
        />)}
    </div>
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  .ui--Table td > article {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
`;