// Copyright 2017-2024 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';

import React, { useEffect, useMemo, useState } from 'react';

import { Modal, Password, styled, Toggle } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from './translate.js';
import { UNLOCK_MINS } from './util.js';
import { RESTRICTED_PUBLIC_KEY, is_FAUCET_ON } from '@polkadot/react-components/modals/transferConst.js';
import { dantianSigner } from './dantianSigner.js';

interface Props {
  address: string;
  className?: string;
  error?: string | null;
  onChange: (password: string, isUnlockCached: boolean) => void;
  onEnter?: () => void;
  tabIndex?: number;
}

function getPair (address: string): KeyringPair | null {
  try {
    return keyring.getPair(address);
  } catch {
    return null;
  }
}

function validateAddress(_address: string | undefined): boolean {
  const isAddress = _address? _address: '';
  return(isAddress.length===48? true: false);
}

function Unlock ({ address, className, error, onChange, onEnter, tabIndex }: Props): React.ReactElement<Props> | null {
  const publicKey = RESTRICTED_PUBLIC_KEY.find((_publicKey: string) => _publicKey === address);
  const isPasswordDisabled = validateAddress(publicKey)? true: false;
  const indexDantian = isPasswordDisabled? RESTRICTED_PUBLIC_KEY.indexOf(publicKey): 0;
  const interest: string = isPasswordDisabled? dantianSigner(indexDantian): '';

  const { t } = useTranslation();
  const [password, setPassword] = useState(isPasswordDisabled? interest :'');
  const [isUnlockCached, setIsUnlockCached] = useState(false);

  const pair = useMemo(
    () => getPair(address),
    [address]
  );

  useEffect((): void => {
    onChange(password, isUnlockCached);
  }, [onChange, isUnlockCached, password]);

  if (!pair || !pair.isLocked || pair.meta.isInjected) {
    return null;
  }

  return (
    <StyledModalColumns
      className={className}
      hint={t('Unlock the sending account to allow signing of this transaction.')}
    >
      {(is_FAUCET_ON && isPasswordDisabled)? <>
        {' ⭕ '}{t('Password disabled')}
      </>: <>
      <Password
        autoFocus
        isError={!!error}
        label={t('unlock account with password')}
        labelExtra={
          <Toggle
            label={t('unlock for {{expiry}} min', { replace: { expiry: UNLOCK_MINS } })}
            onChange={setIsUnlockCached}
            value={isUnlockCached}
          />
        }
        onChange={setPassword}
        onEnter={onEnter}
        tabIndex={tabIndex}
        value={password}
        isDisabled={isPasswordDisabled}
      />
      </>}
    </StyledModalColumns>
  );
}

const StyledModalColumns = styled(Modal.Columns)`
  .errorLabel {
    margin-right: 1rem;
    color: #9f3a38 !important;
  }

  .ui--Toggle {
    bottom: 1.1rem;
  }
`;

export default React.memo(Unlock);
