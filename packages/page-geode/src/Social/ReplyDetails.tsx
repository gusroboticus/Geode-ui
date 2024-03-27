// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled } from '@polkadot/react-components';
import { Table, Image } from 'semantic-ui-react';
import { idToShort, linker, replyHeader, hextoHuman } from './SocialUtil.js';
import { ZERO_MSG_ID } from './SocialConst.js'

interface Props {
    className?: string;
    outcome: CallResult;
    messageId: string;
    acctBlocked: string[];
    isShowMsgID: boolean;
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
  
  type FeedDetail = {
  ok: MessageObj[]
  }
  
function ReplyDetails ({ className = '', isShowMsgID, acctBlocked, outcome: { output } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const feedDetail: FeedDetail = Object.create(JSON.parse(stringify(output)));
    const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);
    function t_strong(_str: string): JSX.Element{return(<><strong>{t(_str)}</strong></>)}

function blockAccount(_acct: string): boolean {
  const _blocked: boolean = ((acctBlocked.length>0 ? acctBlocked : []).find(_blk => _blk === _acct))
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
      <iframe width="350" height="245" src={videoLink +'?autoplay=0&mute=1'}> 
      </iframe>) : (
      <Image bordered rounded src={ilink} size='large' />
      )}    
    </>) : <>{''}</>}
    <br /></>
  )
}

function ShowReplies(): JSX.Element {
try {
    return(
      <>
                 {feedDetail.ok.length>0 && feedDetail.ok
                    // filter out duplicates
                    .filter((value, index, array) => index == array.findIndex(item => item.messageId == value.messageId))
                    // filter out all blocked accts
                    //.filter(_blkFeed => acctBlocked.map(_blkd => _blkFeed.fromAcct != _blkd)) 
                    // sort into descending order based on timestamp
                    .sort((a, b) => b.timestamp - a.timestamp)
                    // sort message replys below original messages
                    .sort((a, b) => (a.messageId === b.replyTo)? -1 : 1)
                    //.sort((a, b) => (a.replyTo === b.replyTo)? 1 : -1)
                    .map((_feed) =>
                      <>
                      {!blockAccount(_feed.fromAcct)? (<>
                        <Table.Row>
                            <Table.Cell>
                              <strong>{t('Reply ')}</strong>
                              {replyHeader(_feed.username, _feed.fromAcct, _feed.timestamp)}
                                  <br />
                                  {isShowMsgID && 
                                  (<>    
                                  {(_feed.replyTo != ZERO_MSG_ID) &&
                                   (<>{t_strong('Reply to MessageId: ')}{idToShort( _feed.replyTo)}<br />
                                      {t_strong('MessageId: ')}{idToShort(_feed.messageId)}</>) 
                                  }
                                  <br />
                                    </>)} 
                                  <br />      
                              {renderLink(_feed.link)}
                              {(_feed.link != '0x') ? (
                              <>
                              {hextoHuman(_feed.message)}{' '}
                              {linker(_feed.link2)}
                              </>) : (
                            <>{hextoHuman(_feed.message)}
                          {' '}</>
                          )}
                        <br /> 
                        </Table.Cell>
                      </Table.Row>  
                      </>): <>{t('Reply is from a Blocked Account. To see this reply go to Settings and unblock the account.')}</>}
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
    <div>
        <ShowReplies/>
    </div>
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
export default React.memo(ReplyDetails);


