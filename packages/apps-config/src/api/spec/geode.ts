// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
    types: [
      {
        // on all versions
        minmax: [0, undefined],
        types:
        {
          CurrencyId: {
            _enum: [
              'GEODE'
            ]
          },
          CurrencyIdOf: 'CurrencyId',
          Amount: 'i128',
          AmountOf: 'Amount',
          AccountInfo: 'AccountInfoWithDualRefCount'
        }
      }
    ]
  };
  

export default definitions;
