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

import JSONlifeAndWork from './life_and_work.json';

interface Props {
  defaultAddress: string;
  onClose: () => void;
}

function Add ({ defaultAddress, onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const _contractName: string = 'Life & Work';
  const { api } = useApi();
  const [address, setAddress] = useState<string | null>(defaultAddress);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [name, isNameValid, setName] = useNonEmptyString(_contractName);
  const _abi: string | null = JSON.stringify(JSONlifeAndWork)
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([_abi, null], null, true);

  const JSONbasepath: string ='polkadotjs/apps-master/geode_contracts/lifeandwork';
  const JSONfilename: string ='claim_registration_v20230314.json';

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
      header={t('Load the Life & Work Contract to your local browser: (just Click Load!)')}
      onClose={onClose}
    >
      <Modal.Content>
      {isTestInfo && (
      <div>
      
      <strong>{'DETAILS: '}</strong>  <br />
        {'json length: '}{_abi.length} <br />
        {'abi: string | null: (length) '}{JSON.stringify(abi).length}<br />
        {'abiName: string | null: '}{'not defined'}<br />
        {'contractAbi: Abi | null: (length) '}{JSON.stringify(contractAbi).length}<br />
        {'errorText: string | null: '}{errorText===null? 'None': errorText}<br />
        {'isAbiError: boolean: '}{isAbiError? 'Yes': 'No'}<br />
        {'isAbiValid: boolean: '}{isAbiValid? 'Yes': 'No'}<br />
        {'isAbiSupplied: boolean: '}{isAbiSupplied? 'Yes': 'No'}<br /><br />

      <strong>{'STEPS: '}</strong>  <br />
      {'(1) Is the Contract Address correct?: '}
          {(isAddressValid)?
            <Badge color='green' icon='thumbs-up'/> : 
            <Badge color='red' icon='x' />}<br />
      {'(2) Is the Contract Name Valid?: '}
          {(isNameValid)? 
            <Badge color='green' icon='thumbs-up' /> : 
            <Badge color='red' icon='x'/>}<br />
      {'(3) Is the Contract Abi loaded?: '}
          {(isAbiValid)?
            <Badge color='green' icon='thumbs-up' />: 
            <Badge color='red' icon='x' />}<br />
      {!isAbiValid && (
          <><br />
          {'NOTE: Load the Life and Work contract from the following local path to your browser.'}<br />
          {'path name: '}{JSONbasepath}{' | '}{'file name: '}{JSONfilename}<br />
          {'Click or drag the file named into the dropbox labeled Load Contract below: '} <br /><br />
          </>
      )}
      {abi && (
        <>
        <br />{'(4) Contract Loaded:'}{'Contract Abi Length: '}{abi?.length}<br /><br />
        </>
      )}

      {'(5) Click Save Below?: '}
          {(isValid)? 
            <Badge color='green' icon='thumbs-up'/> : 
            <Badge color='red' icon='x'/>}<br /><br />
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
