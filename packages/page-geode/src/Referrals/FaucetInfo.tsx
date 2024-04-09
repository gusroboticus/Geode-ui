// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Badge, styled, Card, Table } from '@polkadot/react-components';
import { useTranslation } from '../shared/translate.js';
import { is_FAUCET_ON } from '@polkadot/react-components/modals/transferConst.js';

interface Props {
    className?: string;
  }
  
export default function FaucetInfo ({ className = '' }: Props): React.ReactElement {
    const { t } = useTranslation();
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

    const deployApp: boolean = is_FAUCET_ON;
   
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
        <Card>
        {!deployApp? (<><strong>{'Coming Soon!'}</strong></>):
        <>
        {t_strong('GET SOME COIN HERE!: Check your eligibility and get coin from the Faucet')}<br /><br />
        <Badge color='blue' icon='1'/>{' '}{t('Click on the ')}{t_strong('MY ACCOUNTS')}{t(' toggle and open the accounts page. ')}<br />
        <Badge color='blue' icon='2'/>{' '}{t('If visible, click on the ')}{t_strong('LOAD FAUCET')}{t(' button to load your faucet transaction account.')}<br  />
        {t( ' - If the button is not visible you will need to go to the settings menu and change your in-browser account creation settings to ')}
        {t_strong('Allow local in-browser account storage.')}<br />
        <br />
        {t_strong('ALL SET! CLICK GET STARTED')}<br />
        </>}
        </Card>                     
        </Table>
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
