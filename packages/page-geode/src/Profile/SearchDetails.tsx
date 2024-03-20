// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, LabelHelp, Card } from '@polkadot/react-components';
import { Table, Image } from 'semantic-ui-react'
import { accountDetail, timeStampToDate, accountTitle, withHttp, autoCorrect, showLink } from './ProfileUtil.js';
import JSONprohibited from '../shared/geode_prohibited.json';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    searchKeyword: string;
    msgIndex: number;
    useAccount: string;
  }
  
  type ProfileObj = {
    account: string,
    displayName: number,
    location: number,
    tags: number,
    bio: number,
    photoUrl: number,
    websiteUrl1: number,
    websiteUrl2: number,
    websiteUrl3: number,
    lifeAndWork: string,
    social: string,
    privateMessaging: string,
    marketplace: string,
    makePrivate: boolean,
    timestamp: number
  }
  
  type ProfileDetail = {
  ok: ProfileObj[]
  }

function SearchDetails ({ className = '', searchKeyword, msgIndex, useAccount, outcome: { output, when } }: Props): React.ReactElement<Props> | null {
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const profileDetail: ProfileDetail = Object.create(JSON.parse(stringify(output)));
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}


function ListSearchResult(): JSX.Element {
      return(
        <div>
        <Table>
          <Table.Row>
          <Table.Cell>
            {msgIndex===4? <>
              <h2>{t('Search Account: ')}<strong>{accountDetail(useAccount)}</strong></h2>
            </>: <> <h2>{t('Search Keyword: ')}<strong>{searchKeyword}</strong></h2></>}
          </Table.Cell>
          </Table.Row>
        </Table>
      </div>
)}

function ShowProfile(): JSX.Element {
try{
  return(
    <div>
    {profileDetail.ok.filter(_t => !_t.makePrivate).map((_out) => 
      <div>
      <Table stretch>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            <h2><strong>{isHex(_out.displayName) ? 
            autoCorrect(searchWords, hexToString(_out.displayName)) 
            : ' '}</strong></h2>
          </Table.HeaderCell>
          <Table.HeaderCell>
            <h2>{_out.account}</h2>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Row>
        <Table.Cell verticalAlign='top'>
            {(isHex(_out.photoUrl) ? withHttp(hexToString(_out.photoUrl).trim()) : defaultImage) !='' ? 
            (<><Image src={(isHex(_out.photoUrl) ? withHttp(hexToString(_out.photoUrl).trim()) : defaultImage)} size='small' circular /></>
            ) : (<><Image src={defaultImage} size='small' circular /></>)}
            <br /><br />
            <i>{isHex(_out.location) ?
                  autoCorrect(searchWords, hexToString(_out.location)) 
                  : ' '}</i><br /><br />
            <strong>{isHex(_out.tags) ? 
                  autoCorrect(searchWords, hexToString(_out.tags))
                  : ' '}</strong>
                  <br /><br />
                  <h3><LabelHelp help={t(' Web sites associated with this profile. ')} />                
              {t_strong(' My Web Site(s): ')}</h3>        
              {showLink(_out.websiteUrl1)}                          
              {showLink(_out.websiteUrl2)}
              {showLink(_out.websiteUrl3)}

        </Table.Cell>
        <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t(' Profile Acount Biography. ')} />
            {t_strong(' Bio: ')}</h3> 
            {isHex(_out.bio) ? 
              autoCorrect(searchWords, hexToString(_out.bio))
              : ' '}
            <br /><br />        
            <h3><LabelHelp help={t(' Accounts associated with the other Geode Applications. ')} />
            {t_strong(' Find Me On Geode Apps: ')}</h3><br />      
            {profileDetail.ok[0].account && (<>{accountTitle(_out.account, ' Profile: ')} </>)}     
            {profileDetail.ok[0].lifeAndWork && (<>{accountTitle(_out.lifeAndWork, ' Life and Work: ')} </>)} 
            {profileDetail.ok[0].social && (<>{accountTitle(_out.social, ' Social: ')} </>)}     
            {profileDetail.ok[0].privateMessaging && (<>{accountTitle(_out.privateMessaging, ' Private Messaging: ')} </>)} 
            {profileDetail.ok[0].marketplace && (<>{accountTitle(_out.marketplace, ' Market Place: ')} </>)}     
            <h3><LabelHelp help={t(' Date when account was created or last updated. ')} />
            {t_strong(' Updated: ')}{timeStampToDate(_out.timestamp)}</h3>
            <br />    
        </Table.Cell>
      </Table.Row>
  </Table>
  </div>   
  )
}
</div>)
} catch(error) {
  console.error(error)
  return(
    <div>

    <Table>
      <Table.Row>
        <Table.Cell>
        <strong>{t('Too many profiles to display. Please refine your search criteria.')}</strong>
        </Table.Cell>
        <Table.Cell>
        <strong>{t('Date/Time: ')}</strong>
          {' '}{when.toLocaleDateString()} 
          {' '}{when.toLocaleTimeString()} 
        </Table.Cell>
      </Table.Row>
    </Table>

    </div>
  )
}}

return (
    <StyledDiv className={className}>
    <Card>
      <ListSearchResult />
      <ShowProfile />
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
export default React.memo(SearchDetails);
