// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, {useState, useCallback} from 'react';
import { styled, Card, Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { useCodes } from '../useCodes.js';
import { useContracts } from '../useContracts.js';
import ContractsTable from './ContractsTable.js';
import Summary from './Summary.js';
import { is_FAUCET_ON } from '@polkadot/react-components/modals/transferConst.js';


interface Props {
    className?: string;
  }
  
export default function Referrals ({ className = '' }: Props): React.ReactElement {
    const { t } = useTranslation();
    const [isMyPrograms, toggleMyPrograms] = useToggle();
    const { allCodes, codeTrigger } = useCodes();
    const { allContracts } = useContracts();
    const [isCallOpen, setIsCallOpen] = useState(false);

    // todo
    console.log(allCodes);

    const deployApp: boolean = is_FAUCET_ON;
    const _toggleCall = useCallback(
      () => <>
      {setIsCallOpen((isCallOpen) => !isCallOpen)}
      </>,
      []
    );

    
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
            <Summary />
            <Card>
        {!deployApp && (<><strong>{'Coming Soon!'}</strong></>)}
       
        {!isCallOpen && deployApp &&  (
          <>
              <Button
                icon={(isMyPrograms) ? 'minus' : 'plus'}
                label={t('Get Started')}
                onClick={toggleMyPrograms}
              >
              </Button>    
              <br />
             
          </>
        )}
 
        {isMyPrograms && <>{' '}</>}
      
        </Card>                     
        </Table>

        {isMyPrograms && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={2}
            callAccount={''}
            payAccount={''}
            onClose={_toggleCall}
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
