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
    //'Alexandrite': 'wss://geodeapps.com/alexandrite',
    'Citrine': 'wss://geodeapps.com/citrine2',
    //'Beryl': 'wss://geodeapps.com/beryl',
    //'Jade': 'wss://geodeapps.com/jade',
    'light client': 'light://substrate-connect/geode'
  },
  //teleport: getTeleports(prodParasGeodeCommon),
  text: 'Geode Main Net',
  ui: {
    //color: '#e6007a',
    identityIcon: 'polkadot',
    logo: chainsGeodePNG
  }
};
