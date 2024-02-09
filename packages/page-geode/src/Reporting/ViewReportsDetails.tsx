// Copyright 2017-2023 @polkadot/app-reporting authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from './types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, AccountName, Card } from '@polkadot/react-components';
import { Input, Table } from 'semantic-ui-react'

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: CallResult;
}

type ReportObj = {
  reportId: string,
  reporterAccount: string,
  reporterLegalName: string,
  reporterPhone: string,
  accusedAccount: string,
  geodeApps: string,
  activityIdList: string,
  crimeCategory: string,
  crimeDescription: string,
  accusedLocation: string,
  timestamp: number,
}

type ReportDetail = {
ok: ReportObj[]
}

function ViewReportsDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
  //todo: code for allCodes:
  console.log(JSON.stringify(from));
  console.log(JSON.stringify(onClear));
  console.log(JSON.stringify(message));
  console.log(JSON.stringify(params));
  console.log(JSON.stringify(result));
  console.log(JSON.stringify(when));

  const { t } = useTranslation();
  const objOutput: string = stringify(output);
  const _Obj = JSON.parse(objOutput);
  const reportDetail: ReportDetail = Object.create(_Obj);
  const [searchString, setSearchString] = useState('');

  function timeStampToDate(tstamp: number): JSX.Element {
    try {
     const event = new Date(tstamp);
     return (
          <><i>{event.toDateString()}{' '}
               {event.toLocaleTimeString()}{' '}</i></>
      )
    } catch(error) {
     console.error(error)
     return(
         <><i>{t('No Date')}</i></>
     )
    }
 }
    
  function ShowReports(): JSX.Element {
    try {
      return(
        <div>
        <Table stretch>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              {reportDetail.ok.length > 0 && reportDetail.ok
              // keyword filter
              .filter(obj => 
                (hexToString(obj.crimeCategory).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.crimeDescription).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.accusedLocation).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.activityIdList).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.geodeApps).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.reporterLegalName).toLowerCase().includes(searchString.toLowerCase())
                || hexToString(obj.reporterPhone).toLowerCase().includes(searchString.toLowerCase())
                || obj.reportId === searchString
                || obj.accusedAccount.includes(searchString)
                || obj.reporterAccount.includes(searchString)
                )
              )
              // sort into descending order based on timestamp
              .sort((a, b) => b.timestamp - a.timestamp)                          
              // map to output
              .map((_out) =>  
              <div>
              <strong>{t(' Location: ')}</strong>
              <>
              {isHex(_out.accusedLocation) ? hexToString(_out.accusedLocation) : ' '}
              </>
              <br /><strong>{t(' Timestamp: ')}</strong>
              <>
              {timeStampToDate(_out.timestamp)}
              </>
              <br /><strong>{t(' Accused Account: ')}</strong>
              <>
              <AccountName value={_out.accusedAccount} withSidebar={true}/>
              </>
              <br /><strong>{t(' Report ID: ')}</strong>
              <>
              {_out.reportId}
              </>
              <br /><strong>{t(' Crime Category: ')}</strong>
              <>
              {isHex(_out.crimeCategory) ? hexToString(_out.crimeCategory) : ' '}
              </>
              <br /><strong>{t(' Crime Description: ')}</strong>
              <>
              {isHex(_out.crimeDescription) ? hexToString(_out.crimeDescription) : ' '}
              </>
              <br /><strong>{t(' Geode App: ')}</strong>
              <>
              {isHex(_out.geodeApps) ? hexToString(_out.geodeApps) : ' '}
              </>
              <br /><strong>{t(' App Activity ID: ')}</strong>
              <>
              {isHex(_out.activityIdList) ? hexToString(_out.activityIdList) : ' '}
              </>
              <br /><strong>{t(' Reporter Account: ')}</strong>
              <>
              <AccountName value={_out.reporterAccount} withSidebar={true}/>
              </>
              <br /><strong>{t(' Reporter Legal Name: ')}</strong>
              <>
              {isHex(_out.reporterLegalName) ? hexToString(_out.reporterLegalName) : ' '}
              </>
              <br /><strong>{t(' Reporter Phone: ')}</strong>
              <>
              {isHex(_out.reporterPhone) ? hexToString(_out.reporterPhone) : ' '}
              </>
              <br /><br />
              </div>
              )}     
            </Table.Cell>
          </Table.Row>
        </Table>
        </div> 
      )

    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Reports To Show')}</Card>
        </div>
      )
    }
  }

  return (
    <StyledDiv className={className}>
    <Card>
      <Input  id="inputSearchString"
              name="inputSearchString"
              type="text"
              placeholder='Search...'
              value={searchString}
              onChange={(e) => {setSearchString(e.target.value)}}
      />
      <ShowReports />
    </Card>
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

export default React.memo(ViewReportsDetails);
