// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Expander, Toggle, Button, Badge, AccountName, LabelHelp, Card } from '@polkadot/react-components';
import { Grid, List, Table, Label, Image, Divider } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';
import { useToggle } from '@polkadot/react-hooks';
import AccountHeader from '../shared/AccountHeader.js';
import JSONprohibited from '../shared/geode_prohibited.json';
import CallEndorse from './CallEndorse.js';
import CallPost from './CallPost.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
    onClose: boolean;
    onReset?: boolean;
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
    replyCount: number,
    timestamp: number,
    endorsers: string[]
  }

  type FeedObj = {
    maxfeed: number,
    blocked: string[],
    myfeed: MessageObj[],
  }
  
  type FeedDetail = {
  ok: FeedObj
  }
  
function FeedDetails ({ className = '', onReset, onClear, onClose, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    console.log(JSON.stringify(onClose));
    console.log(JSON.stringify(message));
    console.log(JSON.stringify(params));
    console.log(JSON.stringify(result));

    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const [countPost, setCountPost] = useState(0);
    const [postToEndorse, setPostToEndorse] = useState(['','','','']);
    const [isEndorse, setEndorse] =useState(false);
    const [isReply, setReply] = useState(false);
    const [isPost, setPost] = useState(false);
    const [isShowEndorsers, toggleShowEndorsers] = useToggle(false);
    const [isShowMsgID, toggleShowMsgID] = useToggle(false);
    const [isShowBlockedAccounts, toggleShowBlockedAccounts] = useToggle(false);
    const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t(str)}</>)
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

function blockAccount(_acct: string): boolean {
  const _blocked: boolean = ((feedDetail.ok.blocked.length>0 ? feedDetail.ok.blocked : []).find(_blk => _blk === _acct))
   ? true : false
  return(_blocked)
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
      <iframe width="450" height="345" src={videoLink +'?autoplay=0&mute=1'}> 
      </iframe>) : (
      <Image bordered rounded src={ilink} size='large' />
      )}    
    </>) : <>{''}</>}
    <br /></>
  )
}

function hextoHuman(_hexIn: string): string {
  const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
  return(_Out)
}

const _reset = useCallback(
  () => {setEndorse(false);
         setReply(false);
         setPost(false);
        },
  []
)

const _makeEndorse = useCallback(
  () => {setEndorse(true);
         setReply(false);
         setPost(false);
        },
  []
)

const _makePost = useCallback(
  () => {setEndorse(false);
    setReply(false);
    setPost(true);
   },
[]
)

const _makeReply = useCallback(
  () => {setEndorse(false);
    setReply(true);
    setPost(false);
   },
[]
)

function ShowFeed(): JSX.Element {
      setCountPost(0)
      try {
        const maxIndex: number = feedDetail.ok.maxfeed>0 ? feedDetail.ok.maxfeed: 10;
        
        return(
          <div>
          {onReset && (<>{_reset()}</>)}
            <Table stretch>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                <Button
                  icon='times'
                  label={t('Close')}
                  onClick={onClear}
                />
                <Button
                  icon={'plus'}
                  label={t('Post')}
                  onClick={() => {<>{setPostToEndorse(['','','',''])}{_makePost()}</>}}
                />
                {t(' Number of Posts: ')}<strong>{countPost}</strong>
                {t(' |  Number of Posts to show: ')}<strong>{maxIndex}</strong>
                <LabelHelp help={t('Go to User Settings to change the number of Posts to show.')} />
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
                          onChange={()=> <>{toggleShowEndorsers()}{_reset()}</>}
                          value={isShowEndorsers}
                        />
                        <Toggle
                          className=''
                          label={<> <Badge icon='copy' color={isShowMsgID? 'orange': 'gray'}/> {t('Show Message IDs ')} </>}
                          onChange={()=> <>{toggleShowMsgID()}{_reset()}</>}
                          value={isShowMsgID}
                        />
                      </Grid.Column>
                      {feedDetail.ok.blocked.length>0 && (
                      <><Grid.Column>
                        <Toggle
                          className=''
                          label={<> <Badge icon='hand' color={isShowBlockedAccounts? 'red': 'gray'}/> {t('Show Blocked Accounts ')} </>}
                          onChange={()=> <>{toggleShowBlockedAccounts()}{_reset()}</>}
                          value={isShowBlockedAccounts}
                        />
                      </Grid.Column></>)}
                    </Grid.Row>
                  </Grid>
                  {feedDetail.ok.blocked.length>0 && isShowBlockedAccounts &&(
                  <><br />
                    <Badge icon='hand' color={'red'}/> 
                    {t(' Blocked: ')}<strong>{feedDetail.ok.blocked.length}</strong>
                    {feedDetail.ok.blocked.map(_blkd =>
                    <>{' ('}<AccountName value={_blkd} withSidebar={true}/>{') '}</>)}
                    </>
                  )}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top' >
                {feedDetail.ok.myfeed.length>0 && feedDetail.ok.myfeed
                    // filter out duplicates
                    .filter((value, index, array) => index == array.findIndex(item => item.messageId == value.messageId))
                    // filter out all replies
                    .filter(_subFeed => _subFeed.replyTo === zeroMessageId)
                    // sort into descending order based on timestamp
                    .sort((a, b) => b.timestamp - a.timestamp)
                    // sort message replys below original messages
                    .sort((a, b) => (a.messageId === b.replyTo)? -1 : 1)
                    //.sort((a, b) => (a.replyTo === b.replyTo)? 1 : -1)
                    .map((_feed, index: number) =>
                    <>
                    {index < maxIndex && (
                    <>
                    <h3> 
                            <strong>{t('@')}</strong>
                            <strong>{autoCorrect(searchWords, hextoHuman(_feed.username))}</strong>
                              {' ('}<AccountName value={_feed.fromAcct} withSidebar={true}/>{') '}
                              {' '}<Label color='blue' circular>{_feed.endorserCount}</Label>
                              {' '}{timeStampToDate(_feed.timestamp)}{' '}
                              {' '}
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
                     </h3>
                     {isShowEndorsers && _feed.endorserCount > 0 && (
                    <>
                    <List divided inverted >
                      {_feed.endorsers.length>0 && _feed.endorsers.map((name, i: number) => <List.Item key={name}> 
                        {(i > 0) && (<><Badge color='blue' icon='check'/>{t('(endorser No.')}{i}{') '}
                        {' ('}<AccountName value={name} withSidebar={true}/>{') '}{name} 
                        </>)}
                      </List.Item>)}
                    </List>     
                    </>
                    )}
                    {isShowMsgID && 
                      (<>    
                      {(_feed.replyTo != zeroMessageId)
                      ? (<><CopyInline value={_feed.replyTo} label={''}/><i>{t('reply to: ')}{_feed.replyTo}</i><br />
                           <CopyInline value={_feed.messageId} label={''}/><i>{t('message Id: ')}{_feed.messageId}</i></>) 
                      : (<><CopyInline value={_feed.messageId} label={''}/><i>{t('message Id: ')}{_feed.messageId}</i></>)
                      }
                      <LabelHelp help={t('Copy Message ID. ')} />
                      <br />
                        </>)} 
                        <br />      
                        {renderLink(_feed.link)}
                {(_feed.link != '0x') ? (
                <>
                    {autoCorrect(searchWords, hextoHuman(_feed.message))}{' '}
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
                        ) : ' '}</>
                    ) : (
                    <>{autoCorrect(searchWords, hextoHuman(_feed.message))}{' '}</>
                    )}
                    {' '}

                    <Label as='a' 
                           color='orange' 
                           circular
                           onClick={() => {<>{setPostToEndorse([
                            _feed.messageId,
                            _feed.username,
                            _feed.fromAcct,
                            _feed.message
                          ])}{_makeReply()}
                           
                           </>}}
                           >{'Reply'}</Label>
                    
                    <br /><br />
                    <Expander 
                    className='replymessage'
                    isOpen={false}
                    summary={<Label color='orange' circular> {'Replies: '}{_feed.replyCount}</Label>}>
                    {ShowReplies(_feed.messageId)}
                    </Expander>                    
                    <Divider />                        
                    </>)}
                    {setCountPost(index+1)}
              </>
            )}
             </Table.Cell>
            </Table.Row>
        </Table> 
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

function ShowReplies(replyMessageId: string): JSX.Element {
try {
    return(
      <>
                 {feedDetail.ok.myfeed.length>0 && feedDetail.ok.myfeed
                    // filter out duplicates
                    .filter((value, index, array) => index == array.findIndex(item => item.messageId == value.messageId))
                    // filter out all blocked accts
                    //.filter(_blkFeed => feedDetail.ok.blocked.map(_blkd => _blkFeed.fromAcct != _blkd)) 
                    // filter out all replies
                    .filter(_subFeed => _subFeed.replyTo === replyMessageId)
                    // sort into descending order based on timestamp
                    .sort((a, b) => b.timestamp - a.timestamp)
                    // sort message replys below original messages
                    .sort((a, b) => (a.messageId === b.replyTo)? -1 : 1)
                    //.sort((a, b) => (a.replyTo === b.replyTo)? 1 : -1)
                    .map((_replyFeed) =>
                      <>
                      {!blockAccount(_replyFeed.fromAcct) && (<>
                        <Table.Row>
                            <Table.Cell>
                              <strong>{t('Reply - @')}</strong>
                              <strong>{hextoHuman(_replyFeed.username)}</strong>
                              {' ('}<AccountName value={_replyFeed.fromAcct} withSidebar={true}/>{') '}
                              {' '}<Label color='blue' circular>{_replyFeed.endorserCount}</Label>
                              {' '}{timeStampToDate(_replyFeed.timestamp)}{' '}
                              
                              {(_replyFeed.fromAcct===from || _replyFeed.endorsers.includes(from))? (<>
                                <Badge icon='thumbs-up' color='gray'/>
                              </>) : (<>
                                <Badge icon='thumbs-up' color={'blue'}
                                  onClick={() => {<>
                                    {setPostToEndorse([
                                      _replyFeed.messageId,
                                      _replyFeed.username,
                                      _replyFeed.fromAcct,
                                      _replyFeed.message
                                    ])}
                                    {_makeEndorse()}
                                    </>
                                  }}/>                              
                              </>)}
                              
                              {isShowEndorsers && _replyFeed.endorserCount > 0 && (
                                  <>
                                  <List divided inverted >
                                    {_replyFeed.endorsers.length>0 && _replyFeed.endorsers.map((name, i: number) => <List.Item key={name}> 
                                    {(i > 0) && (<><Badge color='blue' icon='check'/>{t('(endorser No.')}{i}{') '}
                                    {' ('}<AccountName value={name} withSidebar={true}/>{') '}{name} 
                                    </>)}
                                  </List.Item>)}
                                  </List>     
                                  </>
                                  )}

                                  {isShowMsgID && 
                                  (<><br />{(_replyFeed.replyTo != zeroMessageId)
                                  ? (<><CopyInline value={_replyFeed.replyTo} label={''}/><i>{t('reply to: ')}{_replyFeed.replyTo}</i><br />
                                  <CopyInline value={_replyFeed.messageId} label={''}/><i>{t('message Id: ')}{_replyFeed.messageId}</i><br /></>) 
                                  : (<><CopyInline value={_replyFeed.messageId} label={''}/><i>{t('message Id: ')}{_replyFeed.messageId}</i><br /></>)}
                                  </>)} 
                                  <br />      
                              {renderLink(_replyFeed.link)}
                              {(_replyFeed.link != '0x') ? (
                              <>
                              {autoCorrect(searchWords,hextoHuman(_replyFeed.message))}{' '}
                            <Label  as='a'
                            color='orange'
                            circular
                            href={isHex(_replyFeed.link2) ? withHttp(hexToString(_replyFeed.link2).trim()) : ''} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >{t('Link')}
                          </Label>{' '}
                          {isHex(_replyFeed.link2) ? (
                            <LabelHelp help={withHttp(hexToString(_replyFeed.link2).trim())} />
                            ) : ''}</>) : (
                          <>{autoCorrect(searchWords, hextoHuman(_replyFeed.message))}
                          {' '}</>
                          )}
                        <br /> 

                        </Table.Cell>
                      </Table.Row>  
                      </>)}
                      </>
                    )}                          
      </>)
} catch(e) {
  console.log(e);
    return(
      <>
      {t('No Replies for this message.')}
      </>
    )
}
}
    
  return (
    <StyledDiv className={className}>
    <Card>
      <AccountHeader fromAcct={from} timeDate={when} callFrom={3}/>
      <ShowFeed />
      {!isPost && !isReply && isEndorse && postToEndorse[0] && (
        <CallEndorse
        isPost={true}
        messageId={postToEndorse[0]}
        username={postToEndorse[1]}
        fromAcct={postToEndorse[2]}
        postMessage={postToEndorse[3]}
        onClear={() => _reset()}
        />
      )}
      {!isPost && isReply && !isEndorse && (
        <CallPost
        isPost={true}
        messageId={postToEndorse[0]}
        username={postToEndorse[1]}
        fromAcct={postToEndorse[2]}
        postMessage={postToEndorse[3]}
        onClear={() => _reset()}
        />
      )}
      {isPost && !isReply && !isEndorse && (
        <CallPost
        isPost={true}
        messageId={zeroMessageId}
        username={''}
        fromAcct={''}
        postMessage={''}
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
export default React.memo(FeedDetails);


