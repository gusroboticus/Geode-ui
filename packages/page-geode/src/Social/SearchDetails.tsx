// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Expander, Toggle, Badge, AccountName, LabelHelp, Card } from '@polkadot/react-components';
import { Grid, Image, Divider, Table, Label } from 'semantic-ui-react';
import { useToggle } from '@polkadot/react-hooks';
import AccountHeader from '../shared/AccountHeader.js';
import CallEndorse from './CallEndorse.js';
import CallPost from './CallPost.js';
import CallFollow from './CallFollow.js';
import JSONprohibited from '../shared/geode_prohibited.json';
import { msgIndexer, searchHeader, autoCorrect, hextoHuman, userInfo } from './SocialUtil.js';
import { MAX_FEED_INDEX, ZERO_MSG_ID } from './SocialConst.js'

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
    timestamp: number
  }

  type FeedObj = {
    searchedAccount: string,
    username: string,
    followers: number,
    following: string[],
    messageList: MessageObj[],
  }
  
  type FeedDetail = {
  ok: FeedObj
  }
  
function SearchDetails ({ className = '', outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    
    const { t } = useTranslation();
    const searchWords: string[] = JSONprohibited;
    const [isShowFollowing, toggleShowFollowing] = useToggle(false);
    const [isShowMessageID, toggleShowMsgId] = useToggle(false);

    const [postToEndorse, setPostToEndorse] = useState(['','','','']);
    const [isEndorse, setEndorse] =useState(false);
    const [isPostReply, setPostReply] = useState(false);
    const [isAcctFollow, setAcctFollow] = useState(false);

    const [countPost, setCountPost] = useState(0);

    const feedDetail: FeedDetail = Object.create(JSON.parse(stringify(output)));
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

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
    const noFollowing: number = feedDetail.ok.following.length>0 ? feedDetail.ok.following.length: 0;
    return (<>
            <Table stretch verticalAlign='top'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell verticalAlign='top'>
                {feedDetail.ok.searchedAccount.length>0 && (
                  <><h2>
                      {userInfo(feedDetail.ok.searchedAccount, feedDetail.ok.username)}
                      <Label as='a' circular 
                           color={!isAcctFollow? 'orange' : 'blue'}
                           onClick={() => {!isAcctFollow? _makeFollow(): _reset()}}
                          >{t('Follow')}</Label>
                          <LabelHelp help={t(' Use the orange Follow button to follow this account. Click again to Close the Modal. ')} /> 
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
                    label={<> <Badge icon='copy' color={isShowMessageID? 'orange': 'gray'}/> {t('Show Message IDs ')} </>}
                    onChange={()=> <>{toggleShowMsgId()}{_reset()}</>}
                    value={isShowMessageID}
                  />
                  </Grid.Column>
                </Grid.Row>
               </Grid>
                <br />
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
                  // filter out zero message Ids
                  .filter(a => a.messageId != ZERO_MSG_ID)
                  // filter out all replies
                  .filter(a => a.replyTo === ZERO_MSG_ID)
                  // sort into descending order based on timestamp
                  .sort((a, b) => b.timestamp - a.timestamp)
                  // sort message replys below original messages
                  .sort((a, b) => (a.messageId === b.replyTo)? -1 : 1)
                  //.sort((a, b) => (a.replyTo === b.replyTo)? 1 : -1)
                  .map((_feed, index: number) =>
                  <>
                  {index <= MAX_FEED_INDEX && (
                  <>
                  <h3> 
                            {searchHeader('@', _feed.username, _feed.fromAcct, _feed.endorserCount, _feed.timestamp)}
                            {(_feed.fromAcct===from)? (<>
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
                   {isShowMessageID && 
                    (<>{(_feed.replyTo != ZERO_MSG_ID)
                    ? (<>{msgIndexer('reply to: ', _feed.replyTo)}<br />
                         {msgIndexer('message Id: ', _feed.messageId)}<br />
                    </>) 
                    : (<>{msgIndexer('message Id: ', _feed.messageId)}</>)}
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
                  {_feed.replyCount>0 && (<>
                    <Expander 
                    className='replymessage'
                    isOpen={false}
                    summary={<Label color='orange' circular> {'Replies: '}{_feed.replyCount}</Label>}>
                    {ShowReplies(_feed.messageId)}
                    </Expander>   
                  </>)}
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

                              {searchHeader('Reply - @', _replyFeed.username, _replyFeed.fromAcct, _replyFeed.endorserCount, _replyFeed.timestamp)}

                                {(_replyFeed.fromAcct===from)? (<>
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
                                {isShowMessageID && 
                                (<>{(_replyFeed.replyTo != ZERO_MSG_ID)
                                ? (<>{msgIndexer('reply to: ', _replyFeed.replyTo)}<br />
                                    {msgIndexer('message Id: ', _replyFeed.messageId)}<br />
                                </>) 
                                : (<>{msgIndexer('message Id: ', _replyFeed.messageId)}</>)}
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
        <AccountHeader fromAcct={from} timeDate={when} callFrom={202}/>
        <ShowAccount />
        {isAcctFollow && !isPostReply && !isEndorse && (
        <CallFollow />
        ) }
        <ShowFeed />
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
