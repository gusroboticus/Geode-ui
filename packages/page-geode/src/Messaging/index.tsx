// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { styled, Card, Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { useCodes } from '../useCodes.js';
import { useContracts } from '../useContracts.js';
import ContractsTable from './ContractsTable.js';
import Summary from './Summary.js';

interface Props {
    className?: string;
  }
  
export default function Messaging ({ className = '' }: Props): React.ReactElement {
    const { t } = useTranslation();
    // main_menus
    const [isInBox, toggleInBox] = useToggle(false);
    const [isMyInbox, toggleMyInBox] = useToggle(false);
 
    const [isAcct, toggleAcct] = useToggle(false);
    const [isKeyword, toggleKeyword] = useToggle(false);

    const [isPaidInBox, togglePaidInBox] = useToggle(false);
    const [isUpdate, toggleUpdate] = useToggle(false);
    const [isShowUpdate, toggleShowUpdate] = useToggle(false);
    const [isUpdateUpdate, toggleUpdateUpdate] = useToggle(false);
    const [isAllowedAccount, toggleAllowedAccount] = useToggle();

    const [isGroups, toggleGroups] = useToggle(false);
    const [isMyGroup, toggleMyGroup] = useToggle();
    const [isFindGroups, toggleFindGroups] = useToggle(false);
    const [isJoinGroups, toggleJoinGroups] = useToggle(false);
    const [isLeaveGroups, toggleLeaveGroups] = useToggle();

    const [isLists, toggleLists] = useToggle();
    const [isMyLists, toggleMyLists] = useToggle();
    const isMyPaidLists = false;
    const [isSubLists, toggleSubLists] = useToggle();
    const [isFindLists, toggleFindLists] = useToggle(); 
    const isFindAccts = false;
    const [isGetStats, toggleGetStats] = useToggle();
    // set to TRUE to deploy this app
    const deployApp: boolean = true;

    const refTitle: string[] = 
    [' Load Your Inbox. Search by Keyword or Account. (Click again to close) ', 
     ' Load Your Paid Inbox. Block or Unblock Lists. (Click again to close) ', 
     ' Update your User Settings for Private Messaging. ',
     ' Add, Remove, Block or Unblock Accounts as well as Delete Messages. (Click again to close) ',
     ' Manage Your Message Groups. Find, Make, Join Public and Private Groups. ',
     ' Manage Your Lists. Make, Join, Send or Delete Your Lists or PAID Lists. '];
    const { allCodes, codeTrigger } = useCodes();
    const { allContracts } = useContracts();
    // todo
    console.log(allCodes);
    
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
            <Summary />
            <Card>
            {!deployApp && (<><strong>{'Coming Soon!'}</strong></>)}

        {deployApp && !isLists && !isGroups && !isAllowedAccount && !isPaidInBox && !isUpdate && (
        <><Button
                icon={(isInBox) ? 'minus' : 'plus'}
                label={t('Inbox')}
                isDisabled={isMyInbox || isKeyword || isAcct  }
                onClick={toggleInBox}>
          </Button>
          </>
        )}
        {deployApp && !isLists && !isGroups && !isAllowedAccount && !isInBox && !isUpdate && (
          <>
              <Button
                icon={(isPaidInBox) ? 'minus' : 'plus'}
                label={t('PAID Inbox')}
                onClick={togglePaidInBox}>
              </Button>    
          </>
        )}
        {deployApp && !isLists && !isGroups && !isAllowedAccount && !isInBox && !isPaidInBox && (
          <>
          <Button
            icon={(isUpdate) ? 'minus' : 'plus'}
            label={t('Settings')}
            isDisabled={isUpdateUpdate || isShowUpdate}
            onClick={toggleUpdate}>
          </Button>    
          </>
        )}
        {deployApp && !isLists && !isUpdate && !isGroups && !isInBox && !isPaidInBox && (
          <>
          <Button
            icon={(isAllowedAccount) ? 'minus' : 'plus'}
            label={t('Allowed Accounts')}
            onClick={toggleAllowedAccount}>
          </Button>    
          </>
        )}

        {deployApp && !isLists && !isUpdate && !isAllowedAccount && !isInBox && !isPaidInBox && (
          <>
          <Button
            icon={(isGroups) ? 'minus' : 'plus'}
            label={t('Groups')}
            isDisabled={isMyGroup || isFindGroups || isJoinGroups || isLeaveGroups}
            onClick={toggleGroups}>
          </Button>    
          </>
        )}

        {deployApp && !isUpdate && !isGroups && !isAllowedAccount && !isInBox && !isPaidInBox && (
          <>
          <Button
            icon={(isLists) ? 'minus' : 'plus'}
            label={t('Lists')}
            isDisabled={isMyLists || isMyPaidLists || isSubLists || isFindLists || isFindAccts || isGetStats}
            onClick={toggleLists}>
          </Button>    
          </>
        )}
        {isInBox && (<>{refTitle[0]}</>)}
        {isPaidInBox && (<>{refTitle[1]}</>)}
        {isUpdate && (<>{refTitle[2]}</>)}
        {isAllowedAccount && (<>{refTitle[3]}</>)}
        {isMyGroup && (<>{refTitle[4]}</>)}
        {isLists && (<>{refTitle[5]}</>)}
        </Card>    
        {isUpdate && (<>
        <Card>
        <Button
            icon={(isShowUpdate) ? 'minus' : 'plus'}
            label={t('Show Settings')}
            isDisabled={isUpdateUpdate}
            onClick={toggleShowUpdate}>
          </Button>    
          <Button
            icon={(isUpdateUpdate) ? 'minus' : 'plus'}
            label={t('Update Settings')}
            isDisabled={isShowUpdate}
            onClick={toggleUpdateUpdate}>
          </Button>    
        </Card>
        </>)}

        {isInBox && (<>
        <Card>
          <Button
            icon={(isMyInbox) ? 'minus' : 'plus'}
            label={t('My Inbox')}
            isDisabled={isKeyword || isAcct  }
            onClick={toggleMyInBox}>
          </Button>    
          <Button
            icon={(isKeyword) ? 'minus' : 'plus'}
            label={t('My Groups')}
            isDisabled={isMyInbox || isAcct }
            onClick={toggleKeyword}>
          </Button>    
          <Button
            icon={(isAcct) ? 'minus' : 'plus'}
            label={t('My Lists')}
            isDisabled={isMyInbox || isKeyword }
            onClick={toggleAcct}>
          </Button>       
        </Card>
        </>)}


        {isLists && (<>
        <Card>
          <Button
            icon={(isMyLists) ? 'minus' : 'plus'}
            label={t('My Lists')}
            isDisabled={isMyPaidLists || isSubLists || isFindLists || isFindAccts || isGetStats}
            onClick={toggleMyLists}>
          </Button>    
          <Button
            icon={(isSubLists) ? 'minus' : 'plus'}
            label={t('Subscribed Lists')}
            isDisabled={isMyLists || isMyPaidLists || isFindLists || isFindAccts || isGetStats}
            onClick={toggleSubLists}>
          </Button>    
          <Button
            icon={(isFindLists) ? 'minus' : 'plus'}
            label={t('Find Lists')}
            isDisabled={isMyLists || isMyPaidLists || isSubLists || isFindAccts || isGetStats}
            onClick={toggleFindLists}>
          </Button>    
          <Button
            icon={(isGetStats) ? 'minus' : 'plus'}
            label={t('Statistics')}
            isDisabled={true}
            onClick={toggleGetStats}>
          </Button>    
        </Card>
        </>)}

        {isGroups && (<>
        <Card>
          <Button
            icon={(isMyGroup) ? 'minus' : 'plus'}
            label={t('My Groups')}
            isDisabled={isFindGroups || isLeaveGroups || isJoinGroups  }
            onClick={toggleMyGroup}>
          </Button>    
          <Button
            icon={(isFindGroups) ? 'minus' : 'plus'}
            label={t('Find Groups')}
            isDisabled={isMyGroup || isLeaveGroups || isJoinGroups }
            onClick={toggleFindGroups}>
          </Button>    
          <Button
            icon={(isJoinGroups) ? 'minus' : 'plus'}
            label={t('Join a Group')}
            isDisabled={isMyGroup || isFindGroups || isLeaveGroups}
            onClick={toggleJoinGroups}>
          </Button>       
          <Button
            icon={(isLeaveGroups) ? 'minus' : 'plus'}
            label={t('Leave a Group')}
            isDisabled={isMyGroup || isFindGroups || isJoinGroups }
            onClick={toggleLeaveGroups}>
          </Button>       
        </Card>
        </>)}


        </Table>
        {isUpdateUpdate && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={0}
        />)}

        {/* {isGetStats && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={999}
        />)} */}
        {isShowUpdate && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={30}
        />)}
        {isFindLists && (          
        <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={29}
        />)}
        {isMyLists && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={27}
        />)}
        {isSubLists && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={28}
        />)}
        {isFindAccts && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={999}
        />)}
        {isMyGroup && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={25}
        />)}
        {isAcct && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={32}
        />)}
        {isKeyword && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={33}
        />)}

        {isFindGroups && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={26}
        />)}

        {isMyInbox && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={22}
        />)}
        {isPaidInBox && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={23}
        />)}
        {isAllowedAccount && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={24}
        />)}
        {isJoinGroups && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
          initMessageIndex={10}
        />)}
        {isLeaveGroups && (
          <ContractsTable
          contracts={allContracts}
          updated={codeTrigger}
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
