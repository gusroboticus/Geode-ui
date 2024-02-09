// Copyright 2017-2024 @polkadot/apps-routing authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-geode';
import { assertReturn } from '@polkadot/util';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    // needs storageDepositLimit
    return assertReturn(api.tx.contracts.instantiateWithCode.meta.args.length === 6, 'Invalid args');
  } catch {
    console.warn('Geode App interface does not support storageDepositLimit, disabling route');

    return false;
  }
}

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.reporting.instantiateWithCode'
      ],
      needsApiCheck
    },
    group: 'geode',
    icon: 'compress',
    name: 'reporting',
    text: t('nav.reporting', 'Reporting', { ns: 'apps-routing' })
  };
}
