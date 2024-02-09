// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';
import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';
import JSONprohibited from '../shared/geode_prohibited.json';

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
    moreInfo: number,
    makePrivate: boolean
  }
  
  type ProfileDetail = {
  ok: ProfileObj
  }
  
function Details ({ className = '', onClear, isAccount, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
  //todo: code for all unused params:
  console.log(JSON.stringify(isAccount));
  console.log(JSON.stringify(message));
  console.log(JSON.stringify(params));
  console.log(JSON.stringify(result));

    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    const [isUpdate, setUpdate] = useState<boolean>(false);
    const [count, setCount] = useState(0);

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


    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t(str)}</>)
    }

    function matchAccounts(_from: string): boolean{
      try {
        const _acct = profileDetail.ok.account;
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
              callIndex={0}
              myAccount={profileDetail.ok.account}
              displayName={profileDetail.ok.displayName}
              location={profileDetail.ok.location}
              tags={profileDetail.ok.tags}
              bio={profileDetail.ok.bio}
              photoUrl={profileDetail.ok.photoUrl}
              websiteUrl1={profileDetail.ok.websiteUrl1}
              websiteUrl2={profileDetail.ok.websiteUrl2}
              websiteUrl3={profileDetail.ok.websiteUrl3}
              lifeAndWork={profileDetail.ok.lifeAndWork}
              social={profileDetail.ok.social}
              privateMessage={profileDetail.ok.privateMessaging}
              marketPlace={profileDetail.ok.marketplace}
              moreInfo={profileDetail.ok.moreInfo}
              makePrivate={profileDetail.ok.makePrivate}
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
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon='times'
                  label={t('Close')}
                  onClick={onClear}
                />
              {matchAccounts(from) && (<>
                <Button
                  icon='plus'
                  label={t('Update')}
                  onClick={()=>{<>{setCount(count + 1)}
                                  {_makeUpdate()}</>}}
                />              
              </>)}
              
             
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}
      
function ShowProfile(): JSX.Element {
      try {
        const avatarImage: string = (isHex(profileDetail.ok.photoUrl) ? withHttp(hexToString(profileDetail.ok.photoUrl).trim()) : defaultImage);
        const link1: string = (isHex(profileDetail.ok.websiteUrl1) ? withHttp(hexToString(profileDetail.ok.websiteUrl1).trim()) : '');
        const link2: string = (isHex(profileDetail.ok.websiteUrl2) ? withHttp(hexToString(profileDetail.ok.websiteUrl2).trim()) : '');
        const link3: string = (isHex(profileDetail.ok.websiteUrl3) ? withHttp(hexToString(profileDetail.ok.websiteUrl3).trim()) : '');
            
        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <h2><strong>{isHex(profileDetail.ok.displayName) ? 
                autoCorrect(searchWords, hexToString(profileDetail.ok.displayName)) 
                : ' '}</strong></h2>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <h2>{profileDetail.ok.account}</h2>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
                {avatarImage !='' ? 
                (
                  <>
                    <Image src={avatarImage} size='small' circular />
                  </>
                ) : (
                  <>
                    <Image src={defaultImage} size='small' circular />
                  </>
                )
                }
                <br /><br />
                <i>{isHex(profileDetail.ok.location) ?
                      autoCorrect(searchWords, hexToString(profileDetail.ok.location)) 
                      : ' '}</i><br /><br />
                <strong>{isHex(profileDetail.ok.tags) ? 
                      autoCorrect(searchWords, hexToString(profileDetail.ok.tags))
                      : ' '}</strong>
                      <br /><br />
                      <h3><LabelHelp help={t(' Web sites associated with this profile. ')} />                
                <strong>{t(' My Web Site(s): ')}</strong></h3>                  
                
                {link1 != 'http://' && (
                  <>
                  <Label  as='a'
                  color='orange'
                  circular
                  href={link1} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  >{'Link'}
                  </Label>{' '}
                  {link1}
                  </>
                )}<br />
                
                {link2 != 'http://' && (
                  <>
                  <Label  as='a'
                  color='orange'
                  circular
                  href={isHex(profileDetail.ok.websiteUrl2) ? hexToString(profileDetail.ok.websiteUrl2) : ' '}
                  target="_blank" 
                  rel="noopener noreferrer"
                  >{'Link'}
                  </Label>{' '}
                  {link2}
                  </>
                )}<br />
                 
                {link3 != 'http://' && (
                  <>
                  <Label  as='a'
                  color='orange'
                  circular
                  href={isHex(profileDetail.ok.websiteUrl3) ? hexToString(profileDetail.ok.websiteUrl3) : ' '}
                  target="_blank" 
                  rel="noopener noreferrer"
                  >{'Link'}
                  </Label>{' '}
                  {link3}
                  </>
                )}<br />


            </Table.Cell>
            <Table.Cell verticalAlign='top'>
                <h3><LabelHelp help={t(' Profile Acount Biography. ')} />
                <strong>{t(' Bio: ')}</strong></h3> 
                {isHex(profileDetail.ok.bio) ? 
                  autoCorrect(searchWords, hexToString(profileDetail.ok.bio))
                  : ' '}
                <br /><br />        

                <h3><LabelHelp help={t(' Accounts associated with the other Geode Applications. ')} />
                <strong>{t(' Find Me On Geode Apps: ')}</strong></h3><br />
                {profileDetail.ok.account && (
                    <>
                    <IdentityIcon value={profileDetail.ok.account} />
                    <strong>{t('  Profile:  ')}</strong>
                    <AccountName value={profileDetail.ok.account} withSidebar={true}/>
                    {' - '}{profileDetail.ok.account}{' '}
                    <CopyInline value={profileDetail.ok.account} label={''}/>
                    <br />
                    </>
                )}                
                {profileDetail.ok.lifeAndWork && (
                    <>
                    <IdentityIcon value={profileDetail.ok.lifeAndWork} />
                    <strong>{t('  Life and Work:  ')}</strong>
                    <AccountName value={profileDetail.ok.lifeAndWork} withSidebar={true}/>
                    {' - '}{profileDetail.ok.lifeAndWork}{' '}
                    <CopyInline value={profileDetail.ok.lifeAndWork} label={''}/>
                    <br />
                    </>
                )}
                {profileDetail.ok.social && (
                    <>
                    
                    <IdentityIcon value={profileDetail.ok.social} />
                    <strong>{t('  Social:  ')}</strong>
                    <AccountName value={profileDetail.ok.social} withSidebar={true}/>
                    {' - '}{profileDetail.ok.social}{' '}
                    <CopyInline value={profileDetail.ok.social} label={''}/>
                    <br />
                    </>
                )}
                {profileDetail.ok.privateMessaging && (
                    <>
                    <IdentityIcon value={profileDetail.ok.privateMessaging} />
                    <strong>{t('  Private Messaging:  ')}</strong>
                    <AccountName value={profileDetail.ok.privateMessaging} withSidebar={true}/>
                    {' - '}{profileDetail.ok.privateMessaging}{' '}
                    <CopyInline value={profileDetail.ok.privateMessaging} label={''}/>                    
                    <br />
                    </>
                )}
                {profileDetail.ok.marketplace && (
                    <>
                    <IdentityIcon value={profileDetail.ok.marketplace} />
                    <strong>{t('  Market Place:  ')}</strong>
                    <AccountName value={profileDetail.ok.marketplace} withSidebar={true}/>
                    {' - '}{profileDetail.ok.marketplace}
                    <CopyInline value={profileDetail.ok.marketplace} label={''}/>                    
                    <br />
                    </>
                )}
                <h3><LabelHelp help={t(' Additional Profile Information. ')} />
                <strong>{t(' More Info: ')}</strong></h3>
                {isHex(profileDetail.ok.moreInfo) ? 
                      autoCorrect(searchWords, hexToString(profileDetail.ok.moreInfo)) : ' '}
                <br />    
            </Table.Cell>
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
            callFrom={2}/>
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
