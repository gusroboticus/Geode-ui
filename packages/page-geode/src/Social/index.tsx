// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { styled, Card, Button,Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { useCodes } from '../useCodes.js';
import { useContracts } from '../useContracts.js';
import ContractsTable from './ContractsTable.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
}

export default function Social ({ className = '' }: Props): React.ReactElement {

const { t } = useTranslation();
const { allCodes, codeTrigger } = useCodes();
const { allContracts } = useContracts();
const [isSearch, toggleSearch] = useToggle();
const [isSettings, toggleSettings] = useToggle();
const [isYourFeed, toggleYourFeed] = useToggle();
const [isPaidFeed, togglePaidFeed] = useToggle();
const [isAccountSearch, toggleAccountSearch] = useToggle();
const [isKeywordSearch, toggleKeywordSearch] = useToggle();
const [isUpdate, toggleUpdate] = useToggle();
const [isFollow, toggleFollow] = useToggle();
const [isUnFollow, toggleUnFollow] = useToggle();
const [isBlock, toggleBlock] = useToggle();
const [isUnBlock, toggleUnBlock] = useToggle();

const refTitle: string[] = 
[' Display a feed of all public messages and endorsed public messages from all accounts that you follow, sorted by most recent. (Click again to close) ', 
 ' - deleted - Make a Post or a paid Post. (Click again to close) ', 
 ' Look up individual accounts or Search by keyword. ',
 ' Update your settings, follow, unfollow, block and unblock other accounts',
 ' - deleted - Get your Public Feed. (Click again to close) ',
 ' Get your Paid Feed. (Click again to close)',
 ' Make a Post (Click again to close)',
 ' Make a Paid Post (Click again to close)',
 ' Search by Account (Click again to close) ',
 ' Search by Keyword (Click again to close)',
 ' Update Settings including Username, Interests and other settings.',
 ' Include Accounts in your feed to follow.',
 ' Unfollow selected Accounts.',
 ' Block an Account from showing in your feed',
 ' Unblock an Account'];

// todo
console.log(allCodes);
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
          <Summary />
          {!isAccountSearch && !isKeywordSearch 
                            && !isFollow && !isUnFollow 
                            && !isBlock && !isUnBlock
                            && !isUpdate && (<>
            <Card>
            {!isPaidFeed && !isSettings && !isSearch && (
            <><Button
                icon={(isYourFeed) ? 'minus' : 'plus'}
                label={t('Your Feed')}
                onClick={toggleYourFeed}>
              </Button>
              {isYourFeed && (<>{refTitle[0]}</>)}</>
          )}
            {!isYourFeed && !isSettings && !isSearch && (
            <><Button
              icon={(isPaidFeed) ? 'minus' : 'plus'}
              label={t('Paid Feed')}
              onClick={togglePaidFeed}>
            </Button>
            {isPaidFeed && (<>{refTitle[5]}</>)}</>
          )}

            {!isPaidFeed && !isYourFeed && !isAccountSearch && !isKeywordSearch && !isSettings && (
            <><Button
                icon={(isSearch) ? 'minus' : 'plus'}
                label={t('Search')}
                onClick={toggleSearch}>
            </Button>
            {isSearch && (<>{refTitle[2]}</>)}</>
            )}
            {!isPaidFeed && !isYourFeed && !isUpdate && !isFollow && !isUnFollow && !isBlock && !isUnBlock && !isSearch && (
            <><Button
                icon={(isSettings) ? 'minus' : 'plus'}
                label={t('Settings')}
                onClick={toggleSettings}>
            </Button>
            {isSettings && (<>{refTitle[3]}</>)}</>
            )}  
            </Card>  
          </>)}

        {isSearch && (
        <><Card>
          {!isKeywordSearch && (
            <><Button
                icon={(isAccountSearch) ? 'minus' : 'plus'}
                label={t('Account Lookup')}
                onClick={toggleAccountSearch}>
              </Button></>
          )}
          {!isAccountSearch && (
            <><Button
              icon={(isKeywordSearch) ? 'minus' : 'plus'}
              label={t('By Keyword')}
              onClick={toggleKeywordSearch}>
            </Button></>
          )}
          {isAccountSearch && (<>{refTitle[8]}</>)}
          {isKeywordSearch && (<>{refTitle[9]}</>)}
          </Card></>
        )}
        {isSettings && (
        <><Card>
          {!isFollow && !isUnFollow && !isBlock && !isUnBlock && (
            <><Button
                icon={(isUpdate) ? 'minus' : 'plus'}
                label={t('Update Settings')}
                onClick={toggleUpdate}>
              </Button></>
          )}
          {!isUpdate && !isUnFollow && !isBlock && !isUnBlock && (
            <><Button
              icon={(isFollow) ? 'minus' : 'plus'}
              label={t('Follow')}
              onClick={toggleFollow}>
            </Button></>
          )}
          {!isFollow && !isUpdate && !isBlock && !isUnBlock && (
            <><Button
                icon={(isUnFollow) ? 'minus' : 'plus'}
                label={t('Unfollow')}
                onClick={toggleUnFollow}>
              </Button></>
          )}
          {!isFollow && !isUnFollow && !isUpdate && !isUnBlock && (
            <><Button
                icon={(isBlock) ? 'minus' : 'plus'}
                label={t('Block')}
                onClick={toggleBlock}>
              </Button></>
          )}
          {!isFollow && !isUnFollow && !isBlock && !isUpdate && (
            <><Button
                icon={(isUnBlock) ? 'minus' : 'plus'}
                label={t('Unblock')}
                onClick={toggleUnBlock}>
              </Button></>
          )}
          {isUpdate && (<>{refTitle[10]}</>)}
          {isFollow && (<>{refTitle[11]}</>)}
          {isUnFollow && (<>{refTitle[12]}</>)}
          {isBlock && (<>{refTitle[13]}</>)}
          {isUnBlock && (<>{refTitle[14]}</>)}
          </Card></>
        )}
        </Table>

        {isFollow && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={4}
        />)}
        {isUnFollow && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={5}
        />)}
        {isBlock && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={6}
        />)}
        {isUnBlock && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={7}
        />)}
        {isUpdate && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={8}
        />)}
        {isYourFeed && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={9}
        />)}
        {isPaidFeed && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={10}
        />)}
        {isAccountSearch && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={11}
        />)}
        {isKeywordSearch && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            messageId={''}
            postMessage={''}
            initMessageIndex={13}
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
