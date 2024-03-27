// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Toggle, Button, Badge, LabelHelp, Card } from '@polkadot/react-components';
import { Grid, List, Table, Label, Image, Divider } from 'semantic-ui-react'
import { useToggle } from '@polkadot/react-hooks';
import AccountHeader from '../shared/AccountHeader.js';
import CallEndorse from './CallEndorse.js';
import CallPost from './CallPost.js';
import CallStats from './CallStats.js';
import { infoMessage, infoBlocked, blockedAccount, paidAcctHeader, paidEndorseHeader, endorserBadge, msgIndexer, postHeader, replyHeader, hextoHuman } from './SocialUtil.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
type MessageObj = {
    messageId: string,
    replyTo: string,
    fromAcct: string,
    username: string,
    message: string,
    link: string,
    link2: string,
    endorserCount: number,
    timestamp: number,
    paidEndorserMax: number,
    endorserPayment: number,
    targetInterests: string,
    totalStaked: number,
    endorsers: string[]
  }

  type FeedObj = {
    maxfeed: number,
    myinterests: string,
    blocked: string[],
    mypaidfeed: MessageObj[],
  }
  
  type FeedDetail = {
  ok: FeedObj
  }
  
function PaidFeedDetails ({ className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    // todo -> code unused params

    const { t } = useTranslation();
    const [countPost, setCountPost] = useState(0);
    const [isShowBlockedAccounts, toggleShowBlockedAccounts] = useToggle(false);
    const [isShowMyInterest, toggleShowInterest] = useToggle(false);
    const [isShowEndorsers, toggleShowEndorsers] = useToggle(false);
    const [isShowAdInterest, toggleShowAdInterest] = useToggle(false);
    const [isShowMsgID, toggleShowMsgID] = useToggle(false);
    const [postToEndorse, setPostToEndorse] = useState(['','','','']);
    const [isEndorse, setEndorse] =useState(false);
    const [isPaidPost, setPaidPost] =useState(false);
    const [isTarget, setTarget] =useState(false);
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}
    function _strong(_num: number): JSX.Element{return(<><strong>{_num}</strong></>)}

function renderLink(_link: string): JSX.Element {
  const ilink: string = isHex(_link)? withHttp(hexToString(_link).trim()): '0x';
  const videoLink: string = (ilink.includes('embed')) ? ilink 
		  : ilink.includes('youtu.be') ? ('https://www.youtube.com/embed/' + ilink.slice(17))
      	  : ('https://www.youtube.com/embed/' + ilink.slice(32));

  return(
    <>
    {ilink.trim() != 'http://' ? (<>
      {(ilink).includes('youtu')? (
      <iframe width="450" height="345" src={videoLink +'?autoplay=0&mute=1'}> 
      </iframe>) : (
      <Image bordered rounded src={ilink} size='large' />
      )}    
    </>) : <>{''}</>}
    <br /></>
  )
}

const _reset = useCallback(
  () => {setEndorse(false);
         setPaidPost(false);
         setTarget(false);},
  []
)

const _makeEndorse = useCallback(
  () => {setEndorse(true);
         setPaidPost(false);
         setTarget(false);},
  []
)

const _makePaidPost = useCallback(
  () => {setEndorse(false);
         setPaidPost(true);
         setTarget(false);},
  []
)

const _makeTarget = useCallback(
  () => {setEndorse(false);
         setPaidPost(false);
         setTarget(true);},
  []
)

function ShowFeed(): JSX.Element {
    setCountPost(0)
    try {
      const maxIndex: number = feedDetail.ok.maxfeed>0 ? feedDetail.ok.maxfeed: 0;
      return(
          <div>
            <div>
            <Table stretch>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Button
                    icon={isPaidPost? 'minus': 'plus'}
                    label={t('Paid Post')}
                    onClick={()=>{isPaidPost? _reset(): _makePaidPost()}}
                  />
                  <Button
                    icon={isTarget? 'minus': 'plus'}
                    label={t('Endorse Paid Ad')}
                    onClick={()=>{isTarget? _reset(): _makeTarget()}}
                  />
                  {t(' Number of Posts: ')}{_strong(countPost)}
                  {t(' | Number of Posts to show: ')}{_strong(maxIndex)}
                  <br />
                </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                <Table.HeaderCell>
                <Grid columns={5} divided>
                  <Grid.Row>
                    <Grid.Column>
                      <Toggle
                        className=''
                        label={<> <Badge icon='check' color={isShowEndorsers? 'blue': 'gray'}/> {t('Show Endorsers ')} </>}
                        onChange={()=> {<>{toggleShowEndorsers()}{_reset()}</>}}
                        value={isShowEndorsers}
                      />
                      <Toggle
                        className=''
                        label={<> <Badge icon='copy' color={isShowMsgID? 'orange': 'gray'}/> {t('Show Message IDs ')} </>}
                        onChange={()=> {<>{toggleShowMsgID()}{_reset()}</>}}
                        value={isShowMsgID}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Toggle
                        className=''
                        label={<> <Badge icon='thumbs-up' color={isShowAdInterest? 'blue': 'gray'}/> {t('Show Ad Interests ')} </>}
                        onChange={()=> {<>{toggleShowAdInterest()}{_reset()}</>}}
                        value={isShowAdInterest}
                      />
                      <Toggle
                        className=''
                        label={<> <Badge icon='info' color={isShowMyInterest? 'blue': 'gray'}/> {t('Show My Interests ')} </>}
                        onChange={()=> {<>{toggleShowInterest()}{_reset()}</>}}
                        value={isShowMyInterest}
                      />
                    </Grid.Column>    
                    {feedDetail.ok.blocked.length>0 && (
                    <>
                    <Grid.Column>
                    <Toggle
                        className=''
                        label={<> <Badge icon='hand' color={isShowBlockedAccounts? 'red': 'gray'}/> {t('Show Blocked Accounts ')} </>}
                        onChange={()=> {<>{toggleShowBlockedAccounts()}{_reset()}</>}}
                        value={isShowBlockedAccounts}
                      />
                    </Grid.Column>            
                    </>)}
                  </Grid.Row>
                </Grid>    
                {isShowMyInterest && feedDetail.ok.myinterests.length>0 && (<>
                  <br />{infoMessage('Your Interests: ', feedDetail.ok.myinterests)}
                </>)}
                {feedDetail.ok.blocked.length>0 && isShowBlockedAccounts &&(<>
                  <br />{infoBlocked(feedDetail.ok.blocked.length)}
                  
                  {feedDetail.ok.blocked.map(_blkd =>
                  <>{blockedAccount(_blkd)}
                  </>)}
                </>)}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top'>
                {feedDetail.ok.mypaidfeed.length>0 && feedDetail.ok.mypaidfeed
                    // filter out duplicates
                    .filter((value, index, array) => index == array.findIndex(item => item.messageId == value.messageId))
                    // filter out all replies
                    //.filter(_subFeed => _subFeed.replyTo === zeroMessageId)
                    // sort into descending order based on timestamp
                    .sort((a, b) => b.timestamp - a.timestamp)
                    // sort message replys below original messages
                    //.sort((a, b) => (a.messageId === b.replyTo)? -1 : 1)
                    //.sort((a, b) => (a.replyTo === b.replyTo)? 1 : -1)
                    .map((_feed, index: number) =>   
                    <>
                    {index < maxIndex && (
                    <>
                    <h3> {paidAcctHeader(_feed.username, _feed.fromAcct, _feed.endorserCount, _feed.timestamp)}

                              {(_feed.fromAcct===from || _feed.endorsers.includes(from))? (<>
                                <Badge icon='thumbs-up' color='gray'/>
                              </>) : (<>
                                <Badge 
                                  icon='thumbs-up' 
                                  color={'blue'}
                                  onClick={() => {<>
                                    {setPostToEndorse([
                                      _feed.messageId,
                                      _feed.username,
                                      _feed.fromAcct,
                                      _feed.message
                                    ])}
                                    {_makeEndorse()}
                                    </>
                                  }}/>                              
                              </>)}
                          <LabelHelp help={t('Use the Thumbs Up button to Endorse Paid Ads and Get Paid! ')} />

                    </h3>{paidEndorseHeader(_feed.endorserPayment, _feed.paidEndorserMax, _feed.endorserCount)}<br />
                    {isShowMsgID && _feed.messageId && (<><br />{msgIndexer(' Message ID: ', _feed.messageId)}</>)}
                    {isShowEndorsers && _feed.endorserCount > 0 && (
                    <><List divided inverted >
                      {_feed.endorsers.length>0 && _feed.endorsers.map((name, i: number) => <List.Item key={name}> 
                        {(i > 0) && (<>
                         {endorserBadge(name, i)}                        
                        </>)}
                      </List.Item>)}
                    </List></>
                    )}
                    {isShowAdInterest && (<><br />{infoMessage(' Ad Target Interest: ', _feed.targetInterests)}</>)} 
                <br />      
                {renderLink(_feed.link)}
                {(_feed.link != '0x') ? (
                <>
                    {hextoHuman(_feed.message)}{' '}
                    <Label  as='a'
                    color='orange'
                    circular
                    href={isHex(_feed.link2) ? withHttp(hexToString(_feed.link2).trim()) : ''} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >{t('Link')}
                    </Label>{' '}
                    {isHex(_feed.link2) ? (
                        <LabelHelp help={withHttp(hexToString(_feed.link2).trim())} />
                        ) : ''}</>
                    ) : (
                    <>{(hextoHuman(_feed.message))}{' '}</>
                    )}

                    <br /> 
                    {setCountPost(index+1)}
                    <Divider />       
                    </>)}
                </>
            )}
             </Table.Cell>
            </Table.Row>
        </Table>
        </div>   
      </div>)
          } catch(e) {
      console.log(e);
      return(
        <div>
          <Card>{t('No Social Data')}</Card>
        </div>
      )
    }
}

    
  return (
    <StyledDiv className={className}>
    <Card>
    <AccountHeader fromAcct={from} timeDate={when} callFrom={203}/>
      {!isEndorse && !isPaidPost && isTarget && (
        <CallStats />
      )}
      {!isEndorse && isPaidPost && !isTarget &&(
        <CallPost
        isPost={false}
        messageId={postToEndorse[0]}
        username={postToEndorse[1]}
        fromAcct={postToEndorse[2]}
        postMessage={postToEndorse[3]}
        onClear={() => _reset()}
        />
      )}
      
      <ShowFeed />
      {isEndorse && !isPaidPost && postToEndorse[0] && !isTarget && (
        <CallEndorse
        isPost={false}
        messageId={postToEndorse[0]}
        username={postToEndorse[1]}
        fromAcct={postToEndorse[2]}
        postMessage={postToEndorse[3]}
        onClear={() => _reset()}
        />
      )}
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
export default React.memo(PaidFeedDetails);
