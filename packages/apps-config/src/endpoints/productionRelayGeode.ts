// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { GEODE_GENESIS } from '../api/constants.js';
import { chainsGeodePNG } from '../ui/logos/chains/index.js';
//import { getTeleports } from './util.js';

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * ! TO DO - > UPDATE FOR GEODE CHAINS !
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text

export const prodRelayGeode: EndpointOption = {
  dnslink: 'geode',
  genesisHash: GEODE_GENESIS,
  info: 'geode',
  linked: [],
  providers: {
    // 'Geometry Labs': 'wss://polkadot.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
    //'Alexandrite': 'wss://geodeapps.com',
    'Citrine': 'wss://geodeapps.com/citrine2',
    //'Beryl': 'wss://geodeapps.com',
    //'Jade': 'wss://geodeapps.com',
    'light client': 'light://substrate-connect/polkadot'
  },
  //teleport: getTeleports(prodParasGeodeCommon),
  text: 'Geode Main Net',
  ui: {
    color: '#e6007a',
    identityIcon: 'polkadot',
    logo: chainsGeodePNG
  }
};
