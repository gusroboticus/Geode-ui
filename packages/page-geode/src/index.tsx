// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TabItem } from '@polkadot/react-components/types';
import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Routes } from 'react-router';
import { Tabs } from '@polkadot/react-components';
import Home from './Home/Home.js';
import Market from './Market/index.js';
import Lifeandwork from './LifeAndWork/index.js';
import Messaging from './Messaging/index.js';
import PrivateExchange from './PrivateExchange/index.js';
import Profile from './Profile/index.js';
import Referrals from './Referrals/index.js';
import Reporting from './Reporting/index.js';
import Social from './Social/index.js'
import { useTranslation } from './translate.js';

function GeodeApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef(createItemsRef(t));

  function createItemsRef (t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'geode',
      text: t('Home')
    },
    {
      //hasParams: true,
      name: 'lifeandwork',
      text: t('Life and Work')
    },
    {
      name: 'profile',
      text: t('Profile')
    },
    {
      name: 'social',
      text: t('Social')
    },
    {
      name: 'messaging',
      text: t('Messaging')
    },
    {
      name: 'market',
      text: t('Market')
    },
    {
      name: 'referrals',
      text: t('Faucet')
    },
    {
      name: 'privateexchange',
      text: t('Private Exchange')
    },
    {
      name: 'reporting',
      text: t('Reporting')
    }
  ];
}

  return (
    <>
    <main className={`${className} geode--App`}>
       <Tabs
         basePath={basePath}
         //hidden={hidden}
         items={itemsRef.current}
       />
       <Routes>
    <Route path={basePath}>
           <Route
             element={<Market />}
             path='market'
        />
           <Route
             element={<Messaging />}
             path='messaging'
        />
           <Route
             element={<Social />}
             path='social'
        />
           <Route
             element={<Lifeandwork />}
             path='lifeandwork'
        />
           <Route
             element={<Profile />}
             path='profile'
        />
           <Route
             element={<Referrals />}
             path='referrals'
        />       
           <Route
             element={<PrivateExchange />}
             path='privateexchange'
        />
           <Route
             element={<Reporting />}
             path='reporting'
        />
           <Route
             element={<Home />}
             //path='geode'
             index
        />
       </Route>
       </Routes>
    </main>
    
    </>
  );
}

export default React.memo(GeodeApp);


