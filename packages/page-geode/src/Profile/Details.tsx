// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Button, LabelHelp, Card } from '@polkadot/react-components';
import { Table, Image, TableCell } from 'semantic-ui-react'
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';
import JSONprohibited from '../shared/geode_prohibited.json';
import { timeStampToDate, linker, accountTitle, withHttp, autoCorrect } from './ProfileUtil.js';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
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
  ok: ProfileObj[];
  }
  
function Details ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const profileDetail: ProfileDetail = Object.create(JSON.parse(stringify(output)));
    const [isUpdate, setUpdate] = useState<boolean>(false);
    const [count, setCount] = useState(0);
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

    const _reset = useCallback(
      () => {setUpdate(false);
            },
      [isUpdate]
    )
    const _makeUpdate = useCallback(
      () => {setUpdate(true);
            },
      [isUpdate]
    )

    function matchAccounts(_from: string): boolean{
      try {
        const _acct = profileDetail.ok[0].account;
        return(_from===_acct? true: false)
      } catch(e) {
        console.log(e);
        return(false)
      }
    }

    function OpenModal(): JSX.Element{
      try {
        return(
          <>
            <CallSendMessage
              callIndex={1}
              myAccount={profileDetail.ok[0].account}
              displayName={profileDetail.ok[0].displayName}
              location={profileDetail.ok[0].location}
              tags={profileDetail.ok[0].tags}
              bio={profileDetail.ok[0].bio}
              photoUrl={profileDetail.ok[0].photoUrl}
              websiteUrl1={profileDetail.ok[0].websiteUrl1}
              websiteUrl2={profileDetail.ok[0].websiteUrl2}
              websiteUrl3={profileDetail.ok[0].websiteUrl3}
              lifeAndWork={profileDetail.ok[0].lifeAndWork}
              social={profileDetail.ok[0].social}
              privateMessage={profileDetail.ok[0].privateMessaging}
              marketPlace={profileDetail.ok[0].marketplace}
              moreInfo={profileDetail.ok[0].timestamp}
              makePrivate={profileDetail.ok[0].makePrivate}
              onReset={() => _reset()}
          />
          </>)
          
      } catch(e) {
        console.log(e)
        
        return(<>{'Modal not called'}</>)
      }
    }

    function ListAccount(): JSX.Element {
      return(
          <div>
              {matchAccounts(from) && (<>
                <Table>
              <Table.Row>
              <Table.Cell>
                <Button
                  icon='plus'
                  label={t('Update')}
                  onClick={()=>{<>{setCount(count + 1)}
                                  {_makeUpdate()}</>}}
                />              
              </Table.Cell>
              </Table.Row>
            </Table>        
              </>)}            
          </div>
      )}
      
function ShowProfile(): JSX.Element {
      try {
        const avatarImage: string = (isHex(profileDetail.ok[0].photoUrl) ? withHttp(hexToString(profileDetail.ok[0].photoUrl).trim()) : defaultImage);
        const link1: string = (isHex(profileDetail.ok[0].websiteUrl1) ? withHttp(hexToString(profileDetail.ok[0].websiteUrl1).trim()) : '');
        const link2: string = (isHex(profileDetail.ok[0].websiteUrl2) ? withHttp(hexToString(profileDetail.ok[0].websiteUrl2).trim()) : '');
        const link3: string = (isHex(profileDetail.ok[0].websiteUrl3) ? withHttp(hexToString(profileDetail.ok[0].websiteUrl3).trim()) : '');
        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <h2><strong>{isHex(profileDetail.ok[0].displayName) ? 
                    autoCorrect(searchWords, hexToString(profileDetail.ok[0].displayName)) : ' '}
                    </strong></h2>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Row>
            <TableCell>
            <Table.Cell verticalAlign='top'>
            {avatarImage !='' ? 
                (<><Image src={avatarImage} size='small' circular /></>
                ) : (
                 <><Image src={defaultImage} size='small' circular /></>)
                }
                <br /><br />
                <i>{isHex(profileDetail.ok[0].location) ?
                      autoCorrect(searchWords, hexToString(profileDetail.ok[0].location)) 
                      : ' '}</i><br /><br />
                <strong>{isHex(profileDetail.ok[0].tags) ? 
                      autoCorrect(searchWords, hexToString(profileDetail.ok[0].tags))
                      : ' '}</strong>
                      <br /><br />
                      <h3><LabelHelp help={t(' Web sites associated with this profile. ')} />                
                <strong>{t(' My Web Site(s): ')}</strong></h3>                  
                {linker(link1)}
                {linker(link2)}
                {linker(link3)}
            </Table.Cell>
            <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t(' Profile Acount Biography. ')} />
                {t_strong(' Bio: ')}</h3> 
                {isHex(profileDetail.ok[0].bio) ? 
                  autoCorrect(searchWords, hexToString(profileDetail.ok[0].bio))
                  : ' '}
                <br /><br />        
                <h3><LabelHelp help={t(' Accounts associated with the other Geode Applications. ')} />
                {t_strong(' Find Me On Geode Apps: ')}</h3><br />
                {profileDetail.ok[0].account && (<>{accountTitle(profileDetail.ok[0].account, ' Profile: ')} </>)}     
                {profileDetail.ok[0].lifeAndWork && (<>{accountTitle(profileDetail.ok[0].lifeAndWork, ' Life and Work: ')} </>)} 
                {profileDetail.ok[0].social && (<>{accountTitle(profileDetail.ok[0].social, ' Social: ')} </>)}     
                {profileDetail.ok[0].privateMessaging && (<>{accountTitle(profileDetail.ok[0].privateMessaging, ' Private Messaging: ')} </>)} 
                {profileDetail.ok[0].marketplace && (<>{accountTitle(profileDetail.ok[0].marketplace, ' Market Place: ')} </>)}     
                <h3><LabelHelp help={t(' Date when account was created or last updated. ')} />
                {t_strong(' Updated: ')}{timeStampToDate(profileDetail.ok[0].timestamp)}</h3>
                <br />    
            </Table.Cell>
            </TableCell>
          </Table.Row>
      </Table>
      </div>   
      )
    } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Profile Data')}</Card>
        </div>
      )
    }
}
    

  return (
    <StyledDiv className={className}>
    <Card>
    <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={100}/>
      <ListAccount />
      <ShowProfile />
      {isUpdate && (<>
        <OpenModal />
      </>)}
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
export default React.memo(Details);
