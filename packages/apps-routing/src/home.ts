// Copyright 2017-2024 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-settings';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {},
    group: 'geode',
    icon: 'cogs',
    name: 'home',
    text: t('nav.home', 'Home', { ns: 'apps-routing' }),
    useCounter
  };
}
