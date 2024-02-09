// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useState, useEffect } from "react";
import { useTranslation } from '../translate.js';
import { styled } from '@polkadot/react-components';

import axios from "axios";

interface Props {
    className?: string;
  }
  
function IpAddress ({ className = ''}: Props): React.ReactElement {
    const { t } = useTranslation();
    const JSONaxios: string = 'https://api.ipify.org/?format=json';
    //const _JSONaxios: string = 'https://ipapi.co/json'
    const [ip, setIP] = useState("");

    const getData = async () => {
        const res = await axios.get(JSONaxios);
        console.log(res.data);
        setIP(res.data.ip);
      };
    
      useEffect(() => {
        getData();
      }, []);
  
return (
    <StyledDiv className={className}>
        <div>
            <strong>{t(' ')}</strong>{ip}{' '}
        </div>
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  align-items: center;
  display: flex;

  .output {
    flex: 1 1;
    margin: 0.25rem 0.5rem;
  }
`;
export default React.memo(IpAddress);
