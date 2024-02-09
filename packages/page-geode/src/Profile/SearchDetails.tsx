// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Table, Label, Image } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';

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
  ok: ProfileObj[]
  }

function SearchDetails ({ className = '', onClear, outcome: { output, when } }: Props): React.ReactElement<Props> | null {
    //todo: code for all unused params:
    // console.log(JSON.stringify(from));
    // console.log(JSON.stringify(isAccount));
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));
    const defaultImage: string ='https://react.semantic-ui.com/images/wireframe/image.png';
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;

    let _Obj: Object = { Ok: [ { "account": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "displayName": "Alice", "location": "test location", "tags": "test expertise", "bio": "test bio", "photoUrl": "https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2240,c_limit/Monkey-Selfie.jpg", "websiteUrl1": "https://www.newyorker.com/news/daily-comment/monkey-see-monkey-click", "websiteUrl2": "https://www.newyorker.com/news/daily-comment/monkey-see-monkey-click", "websiteUrl3": "https://www.newyorker.com/news/daily-comment/monkey-see-monkey-click", "lifeAndWork": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "social": "5E7kfe5zUG6WhVexEtAFB2YLfq2BV8kS4SaAWjA1RKBR388a", "privateMessaging": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "marketplace": "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy", "moreInfo": "Monkey", "makePrivate": false } ] }
    const objOutput: string = stringify(output);
    _Obj = JSON.parse(objOutput);
    const profileDetail: ProfileDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);


    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t(str)}</>)
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
            (
              <>
                <Image src={(isHex(_out.photoUrl) ? withHttp(hexToString(_out.photoUrl).trim()) : defaultImage)} size='small' circular />
              </>
            ) : (
              <>
                <Image src={defaultImage} size='small' circular />
              </>
            )
            }
            <br /><br />
            <i>{isHex(_out.location) ?
                  autoCorrect(searchWords, hexToString(_out.location)) 
                  : ' '}</i><br /><br />
            <strong>{isHex(_out.tags) ? 
                  autoCorrect(searchWords, hexToString(_out.tags))
                  : ' '}</strong>
                  <br /><br />
                  <h3><LabelHelp help={t(' Web sites associated with this profile. ')} />                
            <strong>{t(' My Web Site(s): ')}</strong></h3>                                  
              <Label  as='a'
              color='orange'
              circular
              href={isHex(_out.websiteUrl1) ? withHttp(hexToString(_out.websiteUrl1).trim()) : ''} 
              target="_blank" 
              rel="noopener noreferrer"
              >{'Link'}
              </Label>{' '}
              {isHex(_out.websiteUrl1) ? withHttp(hexToString(_out.websiteUrl1).trim()) : ''}
              <br />                
              <Label  as='a'
              color='orange'
              circular
              href={isHex(_out.websiteUrl2) ? withHttp(hexToString(_out.websiteUrl2).trim()) : ''}
              target="_blank" 
              rel="noopener noreferrer"
              >{'Link'}
              </Label>{' '}
              {isHex(_out.websiteUrl2) ? withHttp(hexToString(_out.websiteUrl2).trim()) : ''}
              <br />                
              <Label  as='a'
              color='orange'
              circular
              href={isHex(_out.websiteUrl3) ? withHttp(hexToString(_out.websiteUrl3).trim()) : ''}
              target="_blank" 
              rel="noopener noreferrer"
              >{'Link'}
              </Label>{' '}
              {isHex(_out.websiteUrl3) ? withHttp(hexToString(_out.websiteUrl3).trim()) : ''}
              <br />
        </Table.Cell>
        <Table.Cell verticalAlign='top'>
            <h3><LabelHelp help={t(' Profile Acount Biography. ')} />
            <strong>{t(' Bio: ')}</strong></h3> 
            {isHex(_out.bio) ? 
              autoCorrect(searchWords, hexToString(_out.bio))
              : ' '}
            <br /><br />        
            <h3><LabelHelp help={t(' Accounts associated with the other Geode Applications. ')} />
            <strong>{t(' Find Me On Geode Apps: ')}</strong></h3><br />
            {profileDetail.ok[0].account && (
                <>
                <IdentityIcon value={_out.account} />
                <strong>{t('  Profile:  ')}</strong>
                <AccountName value={_out.account} withSidebar={true}/>
                {' - '}{_out.account}{' '}
                <CopyInline value={_out.account} label={''}/>
                <br />
                </>
            )}                
            {profileDetail.ok[0].lifeAndWork && (
                <>
                <IdentityIcon value={_out.lifeAndWork} />
                <strong>{t('  Life and Work:  ')}</strong>
                <AccountName value={_out.lifeAndWork} withSidebar={true}/>
                {' - '}{_out.lifeAndWork}{' '}
                <CopyInline value={_out.lifeAndWork} label={''}/>
                <br />
                </>
            )}
            {_out.social && (
                <>
                
                <IdentityIcon value={_out.social} />
                <strong>{t('  Social:  ')}</strong>
                <AccountName value={_out.social} withSidebar={true}/>
                {' - '}{_out.social}{' '}
                <CopyInline value={_out.social} label={''}/>
                <br />
                </>
            )}
            {_out.privateMessaging && (
                <>
                <IdentityIcon value={_out.privateMessaging} />
                <strong>{t('  Private Messaging:  ')}</strong>
                <AccountName value={_out.privateMessaging} withSidebar={true}/>
                {' - '}{_out.privateMessaging}{' '}
                <CopyInline value={_out.privateMessaging} label={''}/>                    
                <br />
                </>
            )}
            {_out.marketplace && (
                <>
                <IdentityIcon value={_out.marketplace} />
                <strong>{t('  Market Place:  ')}</strong>
                <AccountName value={_out.marketplace} withSidebar={true}/>
                {' - '}{_out.marketplace}
                <CopyInline value={_out.marketplace} label={''}/>                    
                <br />
                </>
            )}
            <h3><LabelHelp help={t(' Additional Profile Information. ')} />
            <strong>{t(' More Info: ')}</strong></h3>
            {isHex(_out.moreInfo) ? 
                  autoCorrect(searchWords, hexToString(_out.moreInfo)) : ' '}
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
        <strong>{t('There are no profiles available.')}</strong>
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
    <ListAccount />
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
