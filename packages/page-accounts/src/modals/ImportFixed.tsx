// Copyright 2017-2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
// packages/page-accounts/src/modals/ImportFixed

import type { Dispatch, SetStateAction } from 'react';
import type { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { HexString } from '@polkadot/util/types';
import type { ModalProps } from '../types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { AddressRow, Button, InputAddress, InputFile, MarkError, MarkWarning, Modal, Password } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { assert, nextTick, u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import ExternalWarning from './ExternalWarning.js';
import restrictedAccount from './restrictedAccount.json'
import { RESTRICTED_PUBLIC_KEY } from '@polkadot/react-components/modals/transferConst.js';
import { dantianSigner } from '@polkadot/react-signer/dantianSigner.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface PassState {
  isPassValid: boolean;
  password: string;
}

const acceptedFormats = ['application/json', 'text/plain'];

function parseFile (file: Uint8Array, setError: Dispatch<SetStateAction<string | null>>, isEthereum: boolean, genesisHash?: HexString | null): KeyringPair | null {
  try {
    const pair = keyring.createFromJson(JSON.parse(u8aToString(file)) as KeyringPair$Json, { genesisHash });

    if (isEthereum) {
      assert(pair.type === 'ethereum', 'JSON File does not contain an ethereum type key pair');
    } else {
      assert(pair.type !== 'ethereum', 'JSON contains an ethereum keytype, this is not available on this network');
    }

    return pair;
  } catch (error) {
    console.error(error);
    setError((error as Error).message ? (error as Error).message : (error as Error).toString());
  }

  return null;
}

function validateAddress(_address: string | undefined): boolean {
  const isAddress = _address? _address: '';
  return(isAddress.length===48? true: false);
}

function Import ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isDevelopment, isEthereum } = useApi();
  const [isBusy, setIsBusy] = useState(false);
  const isShowPairInfo: boolean = false;
  const isShowInputAddress: boolean = false;
  const isShowPassword: boolean =false;
  const isExtWarning: boolean = false;
  
  const apiGenesisHash = useMemo(() => isDevelopment ? null : api.genesisHash.toHex(), [api, isDevelopment]);
  const myfile: string = JSON.stringify(restrictedAccount);
  const mypair = keyring.createFromJson(JSON.parse(myfile) as KeyringPair$Json, { apiGenesisHash });
  const [pair, setPair] = useState<KeyringPair | null>(mypair);
  const [error, setError] = useState<string | null>(null);

  const isPasswordDisabled = validateAddress(mypair.address)? true: false;
  const indexDantian = isPasswordDisabled? RESTRICTED_PUBLIC_KEY.indexOf(mypair.address): 0;
  const _password: string = isPasswordDisabled? dantianSigner(indexDantian): '';

  const [{ isPassValid, password }, setPass] = useState<PassState>({ isPassValid: true, password: _password });
  const differentGenesis = useMemo(() => !!pair?.meta.genesisHash && pair.meta.genesisHash !== apiGenesisHash, [apiGenesisHash, pair]);
    
  const _onChangeFile = useCallback(
    (file: Uint8Array) => setPair(parseFile(file, setError, isEthereum, apiGenesisHash)),
    [apiGenesisHash, isEthereum]
  );

  const _onChangePass = useCallback(
    (password: string) => setPass({ isPassValid: keyring.isPassValid(password), password }),
    []
  );

  const _onSave = useCallback(
    (): void => {
      if (!pair) {
        return;
      }

      setIsBusy(true);
      nextTick((): void => {
        const status: Partial<ActionStatus> = { action: 'restore' };

        try {
          keyring.addPair(pair, password);

          status.status = 'success';
          status.account = pair.address;
          status.message = t('account restored');

          InputAddress.setLastValue('account', pair.address);
        } catch (error) {
          setPass((state: PassState) => ({ ...state, isPassValid: false }));

          status.status = 'error';
          status.message = (error as Error).message;
          console.error(error);
        }

        setIsBusy(false);
        onStatusChange(status as ActionStatus);

        if (status.status !== 'error') {
          onClose();
        }
      });
    },
    [onClose, onStatusChange, pair, password, t]
  );

  return (
    <Modal
      className={className}
      header={t('Load the Faucet Account')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <AddressRow
            defaultName={pair?.meta.name || null}
            noDefaultNameOpacity
            value={pair?.address || null}
          />
        </Modal.Columns>
        <Modal.Columns hint={isShowInputAddress? t('Supply a backed-up JSON file, encrypted with your account-specific password.'): t('The faucet contract is used for transactions with the Faucet contract only.')}>
        {'🔘'}{t(' This modal loads the Faucet account to your accounts page. ')}<br />
        {'🔘'}{t(' You will use this account to complete transactions with the Faucet Contract.')}<br />
        {'🔘'}{t(' Once you have received coin through the Faucet you can delete this account.')}<br /><br />
        {'⭕'}{t(' This is a restricted account.')}<br />
        {isShowInputAddress && <>
            <InputFile
            accept={acceptedFormats}
            className='full'
            isError={!pair}
            label={t('backup file')}
            onChange={_onChangeFile}
            withLabel
          />        
        </>}
        </Modal.Columns>
        <Modal.Columns hint={isShowPassword? t('The password previously used to encrypt this account.'): t('Click the load button to load a Faucet to your accounts page.')}>
        {isShowPassword && <>
            <Password
            autoFocus
            className='full'
            isError={!isPassValid}
            label={t('password')}
            onChange={_onChangePass}
            onEnter={_onSave}
            value={password}
          />        
        </>}
        </Modal.Columns>
        <Modal.Columns>
          {error && (
            <MarkError content={error} />
          )}
          {differentGenesis && (
            <MarkWarning content={t('The network from which this account was originally generated is different than the network you are currently connected to. Once imported ensure you toggle the "allow on any network" option for the account to keep it visible on the current network.')} />
          )}
          {isExtWarning && <ExternalWarning />}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sync'
          isBusy={isBusy}
          isDisabled={!pair || !isPassValid}
          label={t('Load')}
          onClick={_onSave}
        />
      </Modal.Actions>
      {isShowPairInfo && <>
        {'pair: '}{JSON.stringify(pair)}<br /><br />
        {'_pair: '}{JSON.stringify(pair)}<br /><br />      
      </>}
    </Modal>
  );
}

export default React.memo(Import);