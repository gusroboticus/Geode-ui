// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Badge, Button, AccountName, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Table, Label, Image } from 'semantic-ui-react'

import AccountHeader from '../shared/AccountHeader.js';
import CallSendMessage from './CallSendMessage.js';

interface Props {
    className?: string;
    onClear?: () => void;
    isAccount?: boolean;
    outcome: CallResult;
    onClose: boolean;
  }

  type BranchsObj = {
    branchId: string,
    programId: string,
    branch: string[]
  }

  type PayoutsObj = {
    payoutId: string,
    programId: string,
    claimId: string,
    childAccount: string,
    childPayout: number,
    parentAccount: string,
    parentPayout: number,
    grandparentAccount: string,
    grandparentPayout: number,
    timestamp: number,
    totalPayout: number
  }

  type ClaimsObj = {
    programId: string,
    claimId: string,
    parent: string,
    parentIp: string,
    child: string,
    childIp: string,
    timestamp: number,
    grandparent: string,
    branch: string[],
    payIn: number,
    endorsedBy: string,
    payoutId: string,
    status: number
  }
  
  type ProgramObj = {
    programId: string,
    title: string,
    description: string,
    moreInfoLink: string,
    photo: string,
    firstLevelReward: number,
    secondLevelReward: number,
    maximumRewards: number,
    rewardsGiven: number,
    ownerApprovalRequired: boolean,
    payInMinimum: number,
    claims: ClaimsObj[],
    payouts: PayoutsObj[],
    branches: BranchsObj[],
  }
  
  type Program = {
    activity: ProgramObj[]
  }

  type ProgramDetail = {
  ok: Program
  }
  
function MyActivityDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    //todo: code for all unused params:
    // console.log(JSON.stringify(onClose));
    // console.log(JSON.stringify(isAccount));
    // console.log(JSON.stringify(message));    
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));    
    
    const { t } = useTranslation();
    const [useProgramId, setProgramId] = useState('');
    const [useTitle, setTitle] = useState('');
    const [useDescription, setDescription] = useState('');
    const [useClaimId, setClaimId] = useState('');
    const [count, setCount] = useState(0);

    const [isEndorse, setEndorse] = useState(false);
        
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const programDetail: ProgramDetail = Object.create(_Obj);
    
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    //const shortAccount = (_acctAddrs: string) => _acctAddrs.length>0? _acctAddrs.slice(0, 5)+'..': '';
    
    const _reset = useCallback(
      () => {setEndorse(false);
            },
      [isEndorse]
    )
    
    const _makeEndorse = useCallback(
      () => {setEndorse(true);
            },
      [isEndorse]
    )
    
    function statusToHuman(_status: number): JSX.Element {
      const _ref: string[] = ['Claim Made', 'Waiting approval', 'Approved', 'Rejected']
      return(<>
        {(_status>-1 && _status<4)? <>{_ref[_status]}</>: <>{'None'}</>}
      </>)
    }

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

     function renderLink(_link: string): JSX.Element {
        const ilink: string = isHex(_link)? withHttp(hexToString(_link).trim()): '0x';
        const videoLink: string = (ilink.includes('embed')) ? ilink 
                : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
                  : ('https://www.youtube.com/embed/' + ilink.slice(32));
      
        return(
          <>
          {ilink.trim() != 'http://' ? (<>
            {(ilink).includes('youtu')? (
            <iframe width="250" height="145" src={videoLink +'?autoplay=0&mute=1'}> 
            </iframe>) : (
            <Image bordered rounded src={ilink} size='small' />
            )}    
          </>) : <>{''}</>}
          <br /></>
        )
      }
      
      function BNtoGeode(_num: number): JSX.Element {
        return(<>
            {_num>0? <>{(_num/1000000000000).toString()}{' Geode'}</>: <>{'0'}</>}
        </>)
      }

      function booleanToHuman(_bool: boolean): JSX.Element {
        return(<>
        <Badge 
                isSmall
                icon={_bool? 'thumbs-up': 'thumbs-down'}
                color={_bool? 'blue': 'red'}
                info={_bool? 'Yes': 'No'}              
               />
        </>
        )
      }

      function linkToButton(_link: string): JSX.Element {
        return(<>
          <Label  as='a'
                  color='orange'
                  circular
                  size={'mini'}
                  href={isHex(_link) ? withHttp(hexToString(_link).trim()) : ''} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  >{t('Link')}
          </Label>
        </>)
      }

      function hextoHuman(_hexIn: string): string {
        const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
        return(_Out)
      }
      
    function ShowSubMenus(): JSX.Element {
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
      
      function ShowPrograms(): JSX.Element {
        try{
          return(
            <div>
              <Table>
                <Table.Row>
                <Table.Cell verticalAlign='top'>
                {programDetail.ok.activity.length>0 && programDetail.ok.activity.map((_programs) => <>
                  <Grid columns={4} divided>
                    <Grid.Row>
                      <Grid.Column>
                        {renderLink(_programs.photo)}
                      </Grid.Column>
                      <Grid.Column>
                      <h3><strong>{t('Title: ')}</strong>{hextoHuman(_programs.title)}</h3>
                          <strong>{t('Description: ')}</strong>{hextoHuman(_programs.description)}<br />
                          <strong>{t('1st level reward: ')}</strong>{BNtoGeode(_programs.firstLevelReward)}<br />
                          <strong>{t('2nd level reward: ')}</strong>{BNtoGeode(_programs.secondLevelReward)}<br />
                          <strong>{t('Maximum number of rewards: ')}</strong>{_programs.maximumRewards}<br />
                          <strong>{t('Rewards Given: ')}</strong>{_programs.rewardsGiven}<br />
                          <strong>{t('Owner approval needed to trigger reward: ')}</strong>{booleanToHuman(_programs.ownerApprovalRequired)}<br />
                          <strong>{t('Pay It Forward Minimum: ')}</strong>{BNtoGeode(_programs.payInMinimum)}<br />
                          <strong>{t('More Info Link: ')}</strong>{linkToButton(_programs.moreInfoLink)}<br />
                         
                      </Grid.Column>
                      <Grid.Column>
                      {_programs.claims.length>0 && (<><h3><Label color='blue' tag >{t('Claims: ')}</Label></h3></>)}
                      {_programs.claims.length>0 && _programs.claims.map(_claim =>
                        <>
                        {timeStampToDate(_claim.timestamp)}<br />
                        {t('Status: ')}{statusToHuman(_claim.status)}<br />
                        <strong>{t('Parent: ')}</strong>
                        <IdentityIcon value={_claim.parent} />
                        <AccountName value={_claim.parent} withSidebar={true}/>
                        <strong>{' -> '}</strong>
                        <strong>{t('Child: ')}</strong>
                        <IdentityIcon value={_claim.child} />
                        <AccountName value={_claim.child} withSidebar={true}/>
                        <br /><br />
                        {_claim.status===0 &&from===_claim.child && (<>
                          <Label as='a' size='small' 
                                color={'orange'}
                                onClick={()=>{<>
                                       {setProgramId(_programs.programId)}
                                       {setTitle(_programs.title)}
                                       {setDescription(_programs.description)}
                                       {setClaimId(_claim.claimId)}
                                       {setCount(count + 1)}
                                       {_makeEndorse()}
                          </>}} >{t('Endorse')}</Label>
                        </>)}
                        <br /><br />
                        </>
                      )}
                      {_programs.payouts.length>0 && (<><h3><Label color='blue' tag >{t('Payouts: ')}</Label></h3></>)} 
                      {_programs.payouts.length>0 && _programs.payouts.map(_payouts => <>
                        {timeStampToDate(_payouts.timestamp)}<br />
                        <strong>{t('Child: ')}</strong>
                        <IdentityIcon value={_payouts.childAccount} />
                        <AccountName value={_payouts.childAccount} withSidebar={true}/>
                        {' '}{BNtoGeode(_payouts.childPayout)}<br />
                        <strong>{t('Parent: ')}</strong>
                        <IdentityIcon value={_payouts.parentAccount} />
                        <AccountName value={_payouts.parentAccount} withSidebar={true}/>
                        {' '}{BNtoGeode(_payouts.parentPayout)}<br />
                        <strong>{t('GrandParent: ')}</strong>
                        <IdentityIcon value={_payouts.grandparentAccount} />
                        <AccountName value={_payouts.grandparentAccount} withSidebar={true}/>
                        {' '}{BNtoGeode(_payouts.grandparentPayout)}<br />

                        <br /><br />
                      </>)}
                      {_programs.branches.length>0 && (<><h3><Label color='blue' tag >{t('Branches: ')}</Label></h3></>)}
                      {_programs.branches.length>0 && _programs.branches.map(_branches => <>
                          <IdentityIcon value={_branches.branch[0]} />
                          <AccountName value={_branches.branch[0]} withSidebar={true}/>
                          {' -> '}
                          <IdentityIcon value={_branches.branch[1]} />
                          <AccountName value={_branches.branch[1]} withSidebar={true}/>
                          {' -> '}
                          <IdentityIcon value={_branches.branch[2]} />
                          <AccountName value={_branches.branch[2]} withSidebar={true}/>
                          <br />
                       </>)}

                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                      </>)}
                </Table.Cell>
                </Table.Row>
              </Table>
            </div>
        )
        } catch(e) {
          console.log(e);
          return(
            <div>
              <Card>{t('No Programs to Show')}</Card>
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
      <ShowSubMenus />
      {isEndorse && (
        <CallSendMessage
         programID={useProgramId}
         title={useTitle}
         description={useDescription}
         claimId={useClaimId}
         callIndex={1}
         isModal={true}
         onReset={() => _reset()}
        />
      )}
      <ShowPrograms />
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
export default React.memo(MyActivityDetails);
