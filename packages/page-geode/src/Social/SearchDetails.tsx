// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Expander, Toggle, Badge, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Grid, Image, Divider, List, Table, Label } from 'semantic-ui-react';
import CopyInline from '../shared/CopyInline.js';
import { useToggle } from '@polkadot/react-hooks';
import AccountHeader from '../shared/AccountHeader.js';
import CallEndorse from './CallEndorse.js';
import CallPost from './CallPost.js';
import CallFollow from './CallFollow.js';
import JSONprohibited from '../shared/geode_prohibited.json';

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
    replyCount: number,
    timestamp: number,
    endorsers: string[]
  }

  type FeedObj = {
    searchedAccount: string,
    username: string,
    followers: string[],
    following: string[],
    messageList: MessageObj[],
  }
  
  type FeedDetail = {
  ok: FeedObj
  }
  
function SearchDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    // todo -> code unused params
    console.log(JSON.stringify(message));
    console.log(JSON.stringify(params));
    console.log(JSON.stringify(result));
    
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const zeroMessageId: string = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const maxIndex = 25;

    const [isShowFollowers, toggleShowFollowers] = useToggle(false);
    const [isShowFollowing, toggleShowFollowing] = useToggle(false);
    const [isShowEndorsers, toggleShowEndorse] = useToggle(false);
    const [isShowMessageID, toggleShowMsgId] = useToggle(false);

    const [postToEndorse, setPostToEndorse] = useState(['','','','']);
    const [isEndorse, setEndorse] =useState(false);
    const [isPostReply, setPostReply] = useState(false);
    const [isAcctFollow, setAcctFollow] = useState(false);

    const [countPost, setCountPost] = useState(0);
    const [pgIndex, setPgIndex] = useState(1);

    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

   function PagePager(): JSX.Element {
    const currPgIndex: number = (pgIndex > 0) ? pgIndex : (pgIndex < countPost) ? pgIndex : countPost;
    const _indexer: number = maxIndex;
    return(
      <div>
        {countPost>0 && (<>
        <Table>
          <Table.Row>
            <Table.Cell>
             <Button icon={'minus'} 
              label={t('Prev Page')}
              isDisabled={currPgIndex===1}
              onClick={()=> {<>{setPgIndex((currPgIndex-_indexer)>0 ? currPgIndex-_indexer : 1)}{_reset()}</>}} />
             <Button icon={'plus'} 
              label={t('Next Page')}
              isDisabled={currPgIndex>countPost}
              onClick={()=> {<>{setPgIndex(currPgIndex<countPost-1 ? currPgIndex+_indexer : countPost)}{_reset()}</>}}/>
             <LabelHelp help={t(' Use these buttons to page through Posts.')} /> 
            </Table.Cell>
          </Table.Row>
        </Table>
        </>)}
      </div>
    )
   }

   function PageIndexer(): JSX.Element {
    try {
      const _rtnIsFollowing: boolean = feedDetail.ok.followers.includes(from);
      const currPgIndex: number = (pgIndex > 0) ? pgIndex : (pgIndex < countPost) ? pgIndex : countPost;
      const _indexer: number = 1;  
      return (
        <div>
          <Table>
            <Table.Row>
              <Table.Cell>
              <Button
                icon='times'
                label={t('Close')}
                onClick={onClear}
              />
               <Button icon={'home'} 
                isDisabled={countPost===0}
                onClick={()=> {<>{setPgIndex(1)}{_reset()}</>}}/>
               <Button icon={'minus'} 
                isDisabled={countPost===0}
                onClick={()=> {<>{setPgIndex((currPgIndex-_indexer)>0? currPgIndex-_indexer : 1)}{_reset()}</>}}/>
               <Button icon={'plus'} 
                isDisabled={countPost===0}
                onClick={()=> {<>{setPgIndex(currPgIndex<countPost-1? currPgIndex+_indexer : countPost)}{_reset()}</>}}/>
               <Button icon={'sign-in-alt'}
                isDisabled={countPost===0}
                onClick={()=> {<>{setPgIndex((countPost>0)? countPost: 1)}{_reset()}</>}}/>
               {!_rtnIsFollowing && (<>
                {' | '}
               <Button icon={isAcctFollow? 'minus': 'plus'} label={'Follow'}
                onClick={()=>{!isAcctFollow? _makeFollow(): _reset()}}/>               
               </>)}
               <strong>{t(' | Showing Post: ')}{pgIndex<countPost? pgIndex: countPost}{' thru '}{
               (pgIndex+maxIndex) < countPost? pgIndex+maxIndex: countPost}</strong>
               <LabelHelp help={t(' Use these buttons to page through your Posts.')} /> 
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>
      )  
    } catch(e) {
      console.log(e)
      return(<>{'Nothing to show.'}</>)
    }
   }


    function autoCorrect(arr: string[], str: string): JSX.Element {
        arr.forEach(w => str = str.replaceAll(w, '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0).toUpperCase() + w.slice(1), '****'));
        arr.forEach(w => str = str.replaceAll(w.charAt(0) + w.slice(1).toUpperCase, '****'));        
        arr.forEach(w => str = str.replaceAll(w.toUpperCase(), '****'));
        return (
        <>{t(str)}</>)
    }
  
    function hextoHuman(_hexIn: string): string {
      const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): ''
      return(_Out)
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
         setPostReply(false);
         setAcctFollow(false);
        },
  []
)

const _makeEndorse = useCallback(
  () => {setEndorse(true);
         setPostReply(false);
         setAcctFollow(false);
        },
  []
)

const _makeReply = useCallback(
  () => {setEndorse(false);
    setPostReply(true);
    setAcctFollow(false);
   },
[]
)

const _makeFollow = useCallback(
  () => {setEndorse(false);
    setPostReply(false);
    setAcctFollow(true);
   },
[]
)


function ShowAccount(): JSX.Element {
  try{
    const noFollowers: number = feedDetail.ok.followers.length>0 ? feedDetail.ok.followers.length: 0;
    const noFollowing: number = feedDetail.ok.following.length>0 ? feedDetail.ok.following.length: 0;
    const _username: string = feedDetail.ok.searchedAccount.length>0 ? hextoHuman(feedDetail.ok.username): '';
    const _rtnIsFollowing: boolean = feedDetail.ok.followers.includes(from);
    return (<>
            <Table stretch verticalAlign='top'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell verticalAlign='top'>
                {feedDetail.ok.searchedAccount.length>0 && (
                  <><h2>
                    <IdentityIcon size={32} value={feedDetail.ok.searchedAccount} />
                    {' '}
                    <AccountName value={feedDetail.ok.searchedAccount} withSidebar={true}/>
                    {' '}
                    {_username.trim()!='' && (<><strong>{'@'}{_username}</strong></>)}
                    {' '}
                    {_rtnIsFollowing? (<>
                      <Label color='blue' circular>{'Following'}</Label>
                    </>): (<>
                      <Label as='a' circular 
                           color={!isAcctFollow? 'orange' : 'blue'}
                           onClick={() => {!isAcctFollow? _makeFollow(): _reset()}}
                    >{t('Follow')}</Label>
                    <LabelHelp help={t(' Use the orange Follow button to follow this account. Click again to Close the Modal. ')} /> 
                    
                    </>)}
                  </h2>
                  {t('Number of Posts: ')}<strong>{countPost}</strong>
                  </>
                )}                
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row>
              <Table.Cell verticalAlign='top'>
               <Grid columns={5} divided>
                <Grid.Row>
                  <Grid.Column>
                  <Toggle
                    className=''
                    label={<> <Badge icon='check' color={isShowEndorsers? 'blue': 'gray'}/> {t('Show Endorsers ')} </>}
                    onChange={()=> <>{toggleShowEndorse()}{_reset()}</>}
                    value={isShowEndorsers}
                  />
                  </Grid.Column>
                  <Grid.Column>
                  <Toggle
                    className=''
                    label={<> <Badge icon='copy' color={isShowMessageID? 'orange': 'gray'}/> {t('Show Message IDs ')} </>}
                    onChange={()=> <>{toggleShowMsgId()}{_reset()}</>}
                    value={isShowMessageID}
                  />
                  </Grid.Column>
                </Grid.Row>
               </Grid>
                <br />
                {feedDetail.ok.followers.length>0 ? (
                  <>
                  <Badge
                    icon='info'
                    color={(isShowFollowers) ? 'blue' : 'gray'}
                    onClick={()=> <>{toggleShowFollowers()}{_reset()}</>}/> 
                {t(' Followers: ')}<strong>{noFollowers}</strong>
                
                {isShowFollowers && feedDetail.ok.followers.length>0 && (
                  <>
                  {feedDetail.ok.followers.map(_followers =>
                  <>{' ('}<AccountName value={_followers} withSidebar={true}/>{') '}
                  </>)}

                  </>
                )}
                </>) : <>
                    <Badge icon='info' color='red' />
                    {t('This Account has no Followers')}</> }
                <br /><br />
                {feedDetail.ok.following.length>0 ? (
                <>
                <Badge
                icon='info'
                color={(isShowFollowing) ? 'blue' : 'gray'}
                onClick={()=><>{toggleShowFollowing()}{_reset()}</>}/> 
                {t(' Following: ')}<strong>{noFollowing}</strong>
                {isShowFollowing && feedDetail.ok.following.length>0 && (
                  <>
                  {feedDetail.ok.following.map(_following =>
                  <>{' ('}<AccountName value={_following} withSidebar={true}/>{') '}
                  </>)}
                  </>
                )}
                </>): 
                <>
                <Badge icon='info' color='red' />
                {t('This Account is not following other Accounts')}</> }
              </Table.Cell>
            </Table.Row>
            </Table>
          </>)
    }catch(e){
    console.log(e)
    return(<>
    <Table>
      <Table.Row>
        <Table.Cell>
        <strong>{t('No Accounts Found')}</strong>      
        </Table.Cell>
      </Table.Row>
    </Table>
    </>)
  }
}

  function ShowFeed(): JSX.Element {
    try {
      setCountPost(0)
      return(
        <div>
          <div>
          <Table stretch> 
          <Table.Row>
            <Table.Cell verticalAlign='top'>
              {feedDetail.ok.messageList.length>0 && feedDetail.ok.messageList
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
                  {index >= pgIndex -1 && index < pgIndex + maxIndex && (
                  <>
                  <h3> 
                          <strong>{t('@')}</strong>
                          <strong>{hextoHuman(_feed.username)}</strong>
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
                  {isShowMessageID && 
                    (<>{(_feed.replyTo != zeroMessageId)
                    ? (<><i>{t('reply to: ')}{_feed.replyTo}</i>
                         {' '}<CopyInline value={_feed.replyTo} label={''}/><br />
                         <i>{t('message Id: ')}{_feed.messageId}</i>
                         {' '}<CopyInline value={_feed.messageId} label={''}/><br />
                         </>) 
                    : (<><i>{t('message Id: ')}{_feed.messageId}</i>
                         {' '}<CopyInline value={_feed.messageId} label={''}/><br />
                         </>)}
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
                      ) : ''}</>
                  ) : (
                  <>{autoCorrect(searchWords, hextoHuman(_feed.message))}{' '}</>
                  )}{' '}
                    <Label as='a' color={'orange'} circular
                           onClick={() => {<>{setPostToEndorse([
                            _feed.messageId,
                            _feed.username,
                            _feed.fromAcct,
                            _feed.message
                          ])}{_makeReply()}</>}}
                           >{'Reply'}
                    </Label>
                  <br /> <br />
                  
                  <Expander 
                    className='replymessage'
                    isOpen={false}
                    summary={<Label color='orange' circular> {'Replies: '}{_feed.replyCount}</Label>}>
                    {ShowReplies(_feed.messageId)}
                    </Expander>    
                  <Divider />                        
                  </>)}
            {setCountPost(index+1)}</>
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

function ShowReplies(replyMessageId: string): JSX.Element {
  try {
      return(
              <>
                {feedDetail.ok.messageList.length>0 && feedDetail.ok.messageList
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
                                <br />                         
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
  
                                    {isShowMessageID && 
                                    (<><br />{(_replyFeed.replyTo != zeroMessageId)
                                    ? (<><i>{t('reply to: ')}{_replyFeed.replyTo}</i>
                                    {' '}<CopyInline value={_replyFeed.replyTo} label={''}/> <br />
                                    <i>{t('message Id: ')}{_replyFeed.messageId}</i>
                                    {' '}<CopyInline value={_replyFeed.messageId} label={''}/><br /></>) 
                                    : (<><i>{t('message Id: ')}{_replyFeed.messageId}</i>
                                    {' '}<CopyInline value={_replyFeed.messageId} label={''}/> <br /></>)}
                                    </>)} 
                                    <br />      
                                {renderLink(_replyFeed.link)}
                                {(_replyFeed.link != '0x') ? (
                                <>
                                {autoCorrect(searchWords, hextoHuman(_replyFeed.message))}{' '}
                              <Label  as='a'
                              color='orange'
                              circular
                              href={isHex(_replyFeed.link) ? withHttp(hexToString(_replyFeed.link).trim()) : ''} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >{t('Link')}
                            </Label>{' '}
                            {isHex(_replyFeed.link) ? (
                              <LabelHelp help={withHttp(hexToString(_replyFeed.link).trim())} />
                              ) : ''}</>) : (
                            <>
                            {autoCorrect(searchWords, hextoHuman(_replyFeed.message))}
                            </>
                            )}
                          <br /><br /> 
                          </Table.Cell>
                        </Table.Row>  
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
    <Card >
        <AccountHeader fromAcct={from} timeDate={when} callFrom={3}/>
        <ShowAccount />
        {isAcctFollow && !isPostReply && !isEndorse && (
          <CallFollow />
        ) }
        <PageIndexer />
        <ShowFeed />
        <PagePager />

        {!isAcctFollow && !isPostReply && isEndorse && postToEndorse[0] && (
        <CallEndorse
            isPost={true}
            messageId={postToEndorse[0]}
            username={postToEndorse[1]}
            fromAcct={postToEndorse[2]}
            postMessage={postToEndorse[3]}
            onClear={() => _reset()}
        />
        )}
        {!isAcctFollow && isPostReply && !isEndorse && postToEndorse[0] && (
        <CallPost
            isPost={true}
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
export default React.memo(SearchDetails);
