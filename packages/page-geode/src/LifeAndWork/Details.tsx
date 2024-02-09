// Copyright 2017-2023 @blockandpurpose.com
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import { Grid, Table, List, Label } from 'semantic-ui-react'

import type { CallResult } from './types.js';
import { useToggle } from '@polkadot/react-hooks';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Toggle, AccountName, Badge,  LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import CopyInline from '../shared/CopyInline.js';
import JSONprohibited from '../shared/geode_prohibited.json';

import Endorsements from './Endorsements.js';
import ShowHideClaims from './ShowHideClaims.js';
import AccountHeader from '../shared/AccountHeader.js';

interface Props {
  className?: string;
  onClear?: () => void;
  isAccount: boolean;
  outcome: CallResult;
}

type ClaimObj = {
  claimtype: number,
  claimant: string,
  claim: string,
  claimId: string,
  endorserCount: number,
  show: boolean,
  endorsers: string[]
  link: string
}

type ClaimDetail = {
ok: ClaimObj[]
}

type ClaimList = {
  claimIndex: number,
  noClaims: string
}

function Details ({ className = '', onClear, isAccount, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
  //todo: code for unused params:
  console.log(JSON.stringify(onClear));
  // console.log(JSON.stringify(message));
  // console.log(JSON.stringify(params));
  // console.log(JSON.stringify(result));
  const { t } = useTranslation();
  const claimIdRef: string[] = [' ', 'work history', 'education', 'expertise', 'good deeds', 'intellectual property', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  const searchWords: string[] = JSONprohibited;
  const [isShowEndorse, toggleShowEndorse] = useToggle(false);
  const [isShowHide, toggleShowHide] = useToggle(false);
  const [isShowForm, toggleShowForm] = useToggle(false);
  const [isShowClaimId, toggleShowClaimId] = useToggle(false);
  const [isShowLinkAddr, toggleShowLinkAddr] = useToggle(false);
  const [isShowHidden, toggleShowHidden] = useToggle(false);

  const [claimToEndorse, setClaimToEndorse] = useState(['','','','']);
  const [claimToHide, setClaimToHide] = useState(['','','','']);

  const objOutput2: string = stringify(output);
  const _Obj2 = JSON.parse(objOutput2);
  const claimDetail: ClaimDetail = Object.create(_Obj2);
  
  function autoCorrect(arr: string[], str: string): JSX.Element {
    arr.forEach(w => str = str.replaceAll(w, '****'));
    arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
    arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
    arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
    return (
    <>{t(str)}</>)
}

const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

const _resetEndorse = useCallback(
  () => {setClaimToEndorse([])
         toggleShowForm()},
  []
);

const _resetShowHide = useCallback(
  () => {setClaimToHide([])
         toggleShowHide()
        },
  []
)

function ListClaims(props:ClaimList): JSX.Element {
  if (claimDetail.ok) {
    return(
      <div>
      <List divided inverted relaxed >
        {claimDetail.ok.filter(_type => _type.claimtype===props.claimIndex ).map((_out) => 
        <List.Item> 
          {!_out.show && (isShowHidden || isShowHide) && (from===_out.claimant) && (<>
              <Label  
                color='grey'
                >{isHex(_out.claim) ? autoCorrect(searchWords, hexToString(_out.claim)) : ' '}</Label> {' '}                  
              <Label circular color='blue'> {_out.endorserCount} </Label> 
              <Label circular color='red'>{'Hidden'}</Label>  

          {isShowHide && (<>
                <Label as='a' 
                       color='blue' 
                       circular
                       onClick={() => setClaimToHide([
                        _out.claimId, 
                        _out.claim, 
                        _out.claimant,
                        'true' ])}                       
                       >{'Show'}
                       </Label>                            
              </>)}
          </>)}

          {_out.show && isAccount && (
              <>
              <IdentityIcon value={_out.claimant} />
              <AccountName value={_out.claimant} withSidebar={true}/>
              <br /><br />
              </>)}

          {_out.show && (<>
                <Label  
                color='grey'
                >{isHex(_out.claim) ? autoCorrect(searchWords, hexToString(_out.claim)) : ' '}</Label> {' '}                  
              <Label circular color='blue'> {_out.endorserCount} </Label> 
              </>)}
              
          {_out.show && hexToString(_out.link)!='' && (
              <>
              {!isShowLinkAddr && (<>
                <Label  as='a'
                color='orange'
                circular
                href={isHex(_out.link) ? withHttp(hexToString(_out.link).trim()) : ' '}
                target="_blank" 
                rel="noopener noreferrer"
                >{'Link'}
              </Label>              
              </>)}
              </>
              )}

          {_out.show && isShowHide && (<>
            <Label as='a' 
                       color='red' 
                       circular
                       onClick={() => setClaimToHide([
                        _out.claimId, 
                        _out.claim, 
                        _out.claimant,
                        'false' ])}                       
                       >{'Hide'}
                       </Label>                            
              </>)}

          {_out.show && isShowForm && (<>
              {_out.endorsers.includes(from)? (<>
                <Badge icon='thumbs-up' color='gray' />
              </>): 
              (<>
                <Badge icon='thumbs-up' color='blue'
                    onClick={() => setClaimToEndorse([
                        _out.claimId, 
                        _out.claim, 
                        _out.claimant,
                        claimIdRef[_out.claimtype] ])}/>              
              </>)}
                            
              </>)}
              
          {_out.show && isShowClaimId && (<>
                <br /><br />
                <CopyInline value={_out.claimId} label={''} />
                <strong>{' ClaimId: '}</strong>{_out.claimId}{' '}
              </>)}

          {_out.show && isShowLinkAddr && (<>
                {hexToString(_out.link)!='' && (
                  <>
                    <br />
                    <Badge color='orange' icon='link'/>{' '}
                    {isHex(_out.link) ? withHttp(hexToString(_out.link).trim()) : ' '}
                    <Label  as='a'
                      color='orange'
                      circular
                      href={isHex(_out.link) ? withHttp(hexToString(_out.link).trim()) : ' '}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >{'Link'}
                    </Label>
                </>
              )} 
              </>)}

          {_out.show && isShowEndorse && (<>
                <List divided inverted bulleted>
                  {_out.endorsers.map((name, i: number) => <List.Item key={name}> 
                  {(i === 0) ? 
                  <><strong>{t('Claim Endorsements:')}</strong>{t('(self)')} {name}</> : 
                  <><Badge color='blue' icon='check'/>{t('(endorser No.')}{i}{') '}
                  {' ('}<AccountName value={name} withSidebar={true}/>{') '}
                  {name} </>}
              </List.Item>)}
              </List>     
              </>)}
        </List.Item>)}
      </List>
      </div>   
  )
} else {
  return(
    <div>{t(props.noClaims)}</div>
  )
}
}

function EndorsementCard(): JSX.Element {
  try {
  return(<>
        {isShowForm && (<>
        <List>
          <List.Item>
              <Badge icon={'thumbs-up'} color={'blue'} />
                {t('Click the Endorse icon on any Claim to Endorse')}
          </List.Item>
          <List.Item>
            <strong>{t('NOTE: ')}</strong>
            {t("You can't Endorse your own Claims.  ")}
          </List.Item>
        </List>
        </>)}
      
      {claimToEndorse[2]===from && (<>
        <Label color='orange'>{'WARNING:'}</Label> {' The Endorsing account and the Claim Account Owner are the same.'}
        <br />
        </>)}
          {isShowForm && claimToEndorse[0] && 
          claimToEndorse[2]!=from && (<>
            <Endorsements 
                  claimId={claimToEndorse[0]}
                  claim={claimToEndorse[1]}
                  claimant={claimToEndorse[2]}   
            />
          </>)}  
  </>)
  } catch(e) {
    console.log(e)
    return(
      <>{' - No Claims to Endorse'}</>
    )
  }
}

function HideClaimCard(): JSX.Element {
  try {
  return(<>
      {isShowHide && (<>
        <List>
          <List.Item>
          <Label color='blue' circular>{'Show'}</Label>
          <Label color='red' circular>{'Hide'}</Label>
            {t(' Click the Show/Hide Buttons on the Claim to Show or Hide')}
          </List.Item>
        </List>
        </>)}
          {isShowHide && claimToHide[0] && (<>
            <ShowHideClaims 
                  claimId={claimToHide[0]}
                  claim={claimToHide[1]}
                  claimant={claimToHide[2]}
                  showBool={(claimToHide[3]==='true')? true: false }
            />
          </>)}  
  </>)
  }catch(e){
    console.log(e)
    return(
      <>{' There are no claims to Hide/Show.'}</>
    )
  }
}

function ToggleCard(): JSX.Element {
    try{
      return(
        <div>
        <Table>
          <Table.Row>
            <Table.Cell>
            <Grid columns={5} divided>
              <Grid.Row>
                <Grid.Column>
                  <Toggle
                    className=''
                    label={t('Endorse Claims')}
                    onChange={_resetEndorse}
                    value={isShowForm}
                    isDisabled={isShowHide}
                  />
                  <Toggle
                    className=''
                    label={t('Show Endorsements')}
                    onChange={toggleShowEndorse}
                    value={isShowEndorse}
                    isDisabled={isShowForm || isShowHide}
                  />
                </Grid.Column>
                {!isAccount && (<>
                  <Grid.Column>
                  <Toggle
                    className=''
                    label={t('Hide/Show Claims')}
                    onChange={_resetShowHide}
                    value={isShowHide}
                    isDisabled={isShowForm}
                  />
                  <Toggle
                    className=''
                    label={t('Show Hidden Claims')}
                    onChange={toggleShowHidden}
                    value={isShowHidden}
                    isDisabled={isShowForm || isShowHide}
                  />
                </Grid.Column>            
                </>)}
                <Grid.Column>
                <Toggle
                    className=''
                    label={t('Show Link Addresses')}
                    onChange={toggleShowLinkAddr}
                    value={isShowLinkAddr}
                    isDisabled={isShowForm || isShowHide}
                  />
                <Toggle
                    className=''
                    label={t('Show Claim IDs')}
                    onChange={toggleShowClaimId}
                    value={isShowClaimId}
                    isDisabled={isShowForm || isShowHide}
                  />
                </Grid.Column>
            </Grid.Row>
          </Grid>
          </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              {isShowForm && <EndorsementCard />}
              {isShowHide && claimDetail.ok[0] && (<>
                {(from===claimDetail.ok[0].claimant)? (<>
                <HideClaimCard />
                </>): (<>
                  <Label color='orange'>{t(' WARNING ')}</Label>
                  {t(" You can't Hide or Show a Claim unless you are the Claim Owner.")}</>)}
              </>)}
              {isShowHidden && claimDetail.ok[0] && (<>
              {(from!=claimDetail.ok[0].claimant) && (<>
                  <Label color='orange'>{t(' WARNING ')}</Label>
                  {t(" This is NOT Your Resume. You can't see hidden claims.")}</>)}
              </>)}
              
            </Table.Cell>
          </Table.Row>
        </Table>
        </div>
          )
    }catch(e){
      console.log(e)
      return(
        <>
        {'- Make Claims for this Account.'}
        </>
      )        
    }
  
}

function ListAccount(): JSX.Element {
try {
  return (
    <div>
      <Table>
        <Table.Row>
        <Table.Cell>
          {!isAccount && (
          <>
          <h2>
          <strong>{t('Resume of: ')}</strong>
          <IdentityIcon size={32} value={claimDetail.ok[0].claimant} />  
          <AccountName value={claimDetail.ok[0].claimant} withSidebar={true}/> 
          <LabelHelp help={t(' Account of the resume. ')} /> 
          </h2>
          </>
          )}
          </Table.Cell>
        </Table.Row>
      </Table>
    </div>
  )
} catch(error) {
  console.error(error)
  return(
    <>
    <strong>{t('There are no claims available.')}</strong>
    </>
  )
}}

  return (
    <StyledDiv className={className}>
    <Card>  
        <AccountHeader 
            fromAcct={from} 
            timeDate={when} 
            callFrom={1}/>
        <ListAccount />
        
        <ToggleCard />
        <Table verticalAlign='top'>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              <LabelHelp help={t(' Claims for Subject Matter Expertise')} /> 
              <strong>{t(' Expertise:')}</strong><br /><br />
              <ListClaims
                claimIndex={3}
                noClaims={t('There are no Expertise Claims for this account')}
               />
            </Table.Cell>
            <Table.Cell verticalAlign='top'>
              <LabelHelp help={t(' Claims for Education and Specialized Training')} /> 
              <strong>{t(' Education:')}</strong><br /><br />
              <ListClaims
                claimIndex={2}
                noClaims={t('There are no Education Claims for this account')}
               />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
          <Table.Cell verticalAlign='top'>
              <LabelHelp help={t(' Claims for Work History, Past and Current Employment')} /> 
              <strong>{t(' Work History:')}</strong><br /><br />
              <ListClaims
                claimIndex={1}
                noClaims={t('There are no Work History Claims for this account')}
               />
            </Table.Cell>
            <Table.Cell verticalAlign='top'>
            <LabelHelp help={t(' Claims for Good Deeds and Contributions to Society and Public Welfare')} /> 
              <strong>{t(' Good Deeds:')}</strong><br /><br />
              <ListClaims
                claimIndex={4}
                noClaims={t('There are no Good Deed Claims for this account')}
               />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <LabelHelp help={t(' Claims for Original Intellectual Property including Books, Music, Art, Research Papers, Engineering Documents and/or other Patentable Materials')} /> 
              <strong>{t(' Intellectual Property:')}</strong><br /><br />
              <ListClaims
                claimIndex={5}
                noClaims={t('There are no Intellectual Property Claims for this account')}
               />
            </Table.Cell>
            <Table.Cell>
              <strong>{' '}</strong><br /><br />
              <div>
                {' '}
              </div>
            </Table.Cell>
          </Table.Row>
        </Table>
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
