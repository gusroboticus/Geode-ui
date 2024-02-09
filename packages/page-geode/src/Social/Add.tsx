// Copyright 2017-2023 @polkadot/app-contracts authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0


import type { ActionStatus } from '@polkadot/react-components/Status/types';
import React, { useCallback, useState } from 'react';

import { Badge, AddressRow, Button, Input, Modal } from '@polkadot/react-components';
import { useApi, useNonEmptyString } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import { ABI, InputName } from '../shared/index.js';
import { useTranslation } from '../translate.js';
import useAbi from '../useAbi.js';
import ValidateAddr from '../shared/ValidateAddr.js';

import JSONgeodeProfile from './geode_social.json';

interface Props {
  defaultAddress: string;
  onClose: () => void;
}

function Add ({ defaultAddress, onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const _contractName: string = 'Geode Social';
  const { api } = useApi();
  const [address, setAddress] = useState<string | null>(defaultAddress);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [name, isNameValid, setName] = useNonEmptyString(_contractName);
  const _abi: string | null = JSON.stringify(JSONgeodeProfile)
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([_abi, null], null, true);

  const isTestInfo: boolean = false;

  const _onAdd = useCallback(
    (): void => {
      const status: Partial<ActionStatus> = { action: 'create' };
      
      if (!address || !abi || !name) {
        return;
      }
    
      try {       
        let json = {
          contract: {
            abi,
            genesisHash: api.genesisHash.toHex()
          },
          name,
          tags: []
        };
      
        keyring.saveContract(address, json);

        status.account = address;
        status.status = address ? 'success' : 'error';
        status.message = 'contract added';

        onClose();
      } catch (error) {
        console.error(error);

        status.status = 'error';
        status.message = (error as Error).message;
      }
    },
    [abi, address, api, name, onClose]
  );

  const _onGetAdd = useCallback(
    (): void => {
      const status: Partial<ActionStatus> = { action: 'create' };
      
      if (!address || !abi || !name) {
        return;
      }
    
      try {       
        let json = {
          contract: {
            abi,
            genesisHash: api.genesisHash.toHex()
          },
          name,
          tags: []
        };
      
        keyring.saveContract(address, json);

        status.account = address;
        status.status = address ? 'success' : 'error';
        status.message = 'contract added';

        onClose();
      } catch (error) {
        console.error(error);

        status.status = 'error';
        status.message = (error as Error).message;
      }
    },
    [abi, address, api, name, onClose]
  );


  const isValid = isAddressValid && isNameValid && isAbiValid;
  
  return (
    <Modal
      header={t('Load the Geode Social Contract to your local browser: (just Click Load!)')}
      onClose={onClose}
    >
      <Modal.Content>
      {isTestInfo && (
      <div>
          {'test data as necessary'} 
            <Badge color='green' icon='thumbs-up'/> : 
      </div>
      )}            
        <AddressRow
          defaultName={name}
          isValid
          value={address || null}
        >
          <Input
            autoFocus
            isError={!isAddressValid}
            label={t('contract address')}
            onChange={setAddress}
            value={address || ''}
          />
          <ValidateAddr
            address={address}
            onChange={setIsAddressValid}
          />
          <InputName
            isContract
            isError={!isNameValid}
            onChange={setName}
            value={name || undefined}
          />
          {isTestInfo && (
          <ABI
          contractAbi={contractAbi}
          errorText={errorText}
          isError={isAbiError || !isAbiValid}
          isSupplied={isAbiSupplied}
          isValid={isAbiValid}
          onChange={onChangeAbi}
          onRemove={onRemoveAbi}
        />
          )}
        </AddressRow>
      </Modal.Content>
      <Modal.Actions>
      {isTestInfo && (
        <Button
          icon='save'
          isDisabled={!isValid}
          label={t('Save')}
          onClick={_onAdd}
        />)}
        <Button
          icon='plus'
          //isDisabled={!isValid}
          label={t('Load')}
          onClick={_onGetAdd}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Add);
