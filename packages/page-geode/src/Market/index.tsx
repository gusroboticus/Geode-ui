// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
//import styled from 'styled-components';
import { styled, Card, Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { useCodes } from '../useCodes.js';
import { useContracts } from '../useContracts.js';
import ContractsTable from './ContractsTable.js';
//import { Button, styled } from '@polkadot/react-components';
// todo - here can't resolve !!!
//import ContractsTable from './ContractsTable.jsx';
import Summary from './MarketSummary.js';



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

    const refTitle: string[] = 
    [' Find Geode Market Products (Click again to close) ', 
     ' Find Geode Market Services. (Click again to close) ', 
     ' List of My Orders (Click again to close). ',
     ' List My Account. (Click again to close) ',
     ' View My Cart (Click again to close). ',
     ' Manage Your Seller Account (Click again to close).',
     ' Find Geode Market Sellers (Click again to close).',
     ' Go to a Sellers Store (Click again to close).'];
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
                icon={(isGotoStore) ? 'minus' : 'plus'}
                label={t('Go to Store')}
                onClick={toggleGotoStore}>
          </Button>
          </>
        )}

        {deployApp && !isFindServices && !isFindStore
                   && !isMyAccount && !isMyCart 
                   && !isSellerAcct && !isGotoStore && (
        <><Button
                icon={(isFindProducts) ? 'minus' : 'plus'}
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
                icon={(isFindServices) ? 'minus' : 'plus'}
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
                icon={(isFindStore) ? 'minus' : 'plus'}
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
            icon={(isMyAccount) ? 'minus' : 'plus'}
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
            icon={(isMyCart) ? 'minus' : 'plus'}
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
            icon={(isSellerAcct) ? 'minus' : 'plus'}
            label={t('Seller Account')}
            isDisabled={isUpdateSet || isAddProduct || isAddService}
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
                isDisabled={isAddProduct || isAddService}
                onClick={toggleUpdateSet}>
              </Button>    
            </>
            <>
              <Button
                icon={(isAddProduct) ? 'minus' : 'plus'}
                label={t('Add Product')}
                isDisabled={isUpdateSet || isAddService}
                onClick={toggleAddProduct}>
              </Button>    
            </>
            <>
              <Button
                icon={(isAddService) ? 'minus' : 'plus'}
                label={t('Add Service')}
                isDisabled={isUpdateSet || isAddProduct}
                onClick={toggleAddService}>
              </Button>    
            </>
          </Card>
        </>
        )}
        </Table>
        {isFindProducts && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={30}
        />)}
        {isFindServices && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={31}
        />)}
        {isFindStore && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={32}
        />)}

        {isUpdateSet && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={18}
        />)}
        {isMyAccount && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={34}
        />)}

        {isAddProduct && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={26}
        />)}
        {isAddService && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={28}
        />)}
        {isMyCart && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={35}
        />)}
        {isGotoStore && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={36}
        />)}
        {isSellerAcct && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={37}
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