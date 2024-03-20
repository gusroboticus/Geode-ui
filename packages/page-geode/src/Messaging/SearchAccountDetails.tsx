// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// *** DEPRICATED *** 
// import React, { useState, useCallback } from 'react';
// import { useTranslation } from '../shared/translate.js';
// import type { CallResult } from '../shared/types.js';
// import { stringify, hexToString, isHex } from '@polkadot/util';
// import { styled, Badge, Expander, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
// import { Divider, Table, Label } from 'semantic-ui-react'
// import AccountHeader from '../shared/AccountHeader.js';
// import CallSendMessage from './CallSendMessage.js';

// interface Props {
//     className?: string;
//     onClear?: () => void;
//     outcome: CallResult;
//   }
  
//   type PrivateMessages = {
//     messageId: string,
//     fromAcct: string,
//     fromUsername: string,
//     toAcct: string,
//     message: string,
//     fileUrl: string,
//     timestamp: number
//   }
  
//   type GroupMessages = {
//     messageId: string,
//     fromAcct: string,
//     username: string,
//     toListId: string,
//     toListName: string,
//     message: string,
//     fileUrl: string,
//     timestamp: number
//   }

//   type ListMessages = {
//     messageId: string,
//     fromAcct: string,
//     username: string,
//     toListId: string,
//     toListName: string,
//     message: string,
//     fileUrl: string,
//     timestamp: number
//   }

//   type InBoxObj = {
//     search: string,
//     username: string,
//     privateMessages: PrivateMessages[],
//     groupMessages: GroupMessages[],
//     listMessages: ListMessages[]
//   }

//   type InBoxDetail = {
//   ok: InBoxObj
//   }
  
// function SearchAccountDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
      
//     const { t } = useTranslation();

//     const objOutput: string = stringify(output);
//     const _Obj = JSON.parse(objOutput);
//     const inBoxDetail: InBoxDetail = Object.create(_Obj);

//     const [_toAcct, setToAcct] = useState('');
//     const [_username, setUsername] = useState('');
//     const [isMessage, setMessage] = useState(false);
//     const [isListMsg, setListMsg] = useState(false);
//     const [isGroupMsg, setGroupMsg] = useState(false);

//     const [count, setCount] = useState(0);
//     const [countInbox, setCountInbox] = useState(0);
//     const [countLists, setCountLists] = useState(0);
//     const [countGroups, setCountGroups] = useState(0);

//     const withHttp = (url: string) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `http://${nonSchemmaUrl}`);

//     const _reset = useCallback(
//       () => {setMessage(false);
//              setListMsg(false);
//              setGroupMsg(false);
//             },
//       []
//     )
    
//     const _makeMessage = useCallback(
//       () => {setMessage(true);
//              setListMsg(false);
//              setGroupMsg(false);
//             },
//       []
//     )

//     const _makeGroupMsg = useCallback(
//       () => {setMessage(false);
//              setListMsg(false);
//              setGroupMsg(true);
//             },
//       []
//     )

//     function hextoHuman(_hexIn: string): string {
//       const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
//       return(_Out)
//     }
    
//     function timeStampToDate(tstamp: number): JSX.Element {
//       try {
//        const event = new Date(tstamp);
//        return (
//             <><i>{event.toDateString()}{' '}
//                  {event.toLocaleTimeString()}{' '}</i></>
//         )
//       } catch(error) {
//        console.error(error)
//        return(
//            <><i>{t('No Date')}</i></>
//        )
//       }
//    }

//     function ListAccount(): JSX.Element {
//       return(
//           <div>
//             <Table>
//               <Table.Row>
//               <Table.Cell>
//               <Button
//                   icon='times'
//                   label={t(' Close ')}
//                   onClick={onClear}
//                 />
//               </Table.Cell>
//               </Table.Row>
//             </Table>
//           </div>
//       )}  

// function GetMessages(): JSX.Element {
//       try {

//         return(
//           <div>
//           <Table stretch>
//           <Table.Header>
//             <Table.Row>
//               <Table.HeaderCell>
//                 {t(' Total InBox: ')}{countInbox}{' '}
//                 {t(' Total Lists: ')}{countLists}{' '}
//                 {t(' Total Groups: ')}{countGroups}{' '}
//                 {inBoxDetail.ok.search && (<>
//                   <h3>
//                       <strong>{t(' Search Results for Account: ')}</strong>
//                       <IdentityIcon value={inBoxDetail.ok.search} />
//                       {' ('}<AccountName value={inBoxDetail.ok.search} withSidebar={true}/>{') '}
//                       {'@'}{hextoHuman(inBoxDetail.ok.username)}{' '}<br />
//                       {inBoxDetail.ok.search}
//                   </h3>             
//                 </>)}
//               </Table.HeaderCell>
//             </Table.Row>
//           </Table.Header>

//           <Table.Row>
//             <Table.Cell verticalAlign='top'>
//             <h2><LabelHelp help={t(' This is your Inbox. Send messages to people directly by clicking on the blue envelop icon. ')} />
//                 <strong>{t(' People: ')}</strong>
//                 <Label circular color='blue' size='small'>{countInbox}</Label>
//             </h2> 
          
//                 {inBoxDetail.ok.privateMessages.length>0 && 
//                   inBoxDetail.ok.privateMessages
//                   .sort((a, b) => b.timestamp - a.timestamp) //most recent on top
//                   .map((_people, inbox: number)=> <>
//                         <h2><strong>{'@'}{hextoHuman(_people.fromUsername)}</strong>
//                         {' ('}<AccountName value={_people.fromAcct} withSidebar={true}/>{') '}
//                         <Badge icon='envelope' color={'blue'}
//                                   onClick={()=>{<>
//                                   {setToAcct(_people.fromAcct)}
//                                   {setCount(count + 1)}
//                                   {_makeMessage()}</>}}/>                        
//                         </h2>
//                   {_people.message.length>0 && 
//                       (<>
//                           <Expander 
//                             className='message'
//                             isOpen={false}
//                             summary={<Label size={'small'} color='orange' circular> {t('Messages ✉️')}</Label>}>                  
//                             {timeStampToDate(_people.timestamp)}{' '}<br />
//                             {_people.toAcct===from? (<>
//                               <Label 
//                                 color='blue' textAlign='left' pointing= 'right'>
//                                 {hextoHuman(_people.message)}{' '}
//                               </Label>
//                               <IdentityIcon value={_people.fromAcct} />
//                               {' ('}<AccountName value={_people.fromAcct} withSidebar={true}/>{') '}
//                             </>): (<>
//                               <IdentityIcon value={_people.fromAcct} />
//                               {' ('}<AccountName value={_people.fromAcct} withSidebar={true}/>{') '}
//                               <Label  color='grey' textAlign='left' pointing='left'>
//                                 {hextoHuman(_people.message)}{' '}
//                               </Label>
//                             </>)}
//                             {(_people.fileUrl != '0x') && (<>
//                               <Label  as='a' color='orange' circular size={'mini'}
//                               href={isHex(_people.fileUrl) ? withHttp(hexToString(_people.fileUrl).trim()) : ''} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               >{t('Link')}
//                               </Label>{' '}
//                             </>)}                     
//                             <br /><br />
//                           </Expander>
//                           {setCountInbox(inbox+1)}
//                       </>)}
//                   <Divider />
//                 </>)}

//             </Table.Cell>
//           </Table.Row>

//           <Table.Row>
//             <Table.Cell verticalAlign='top'>
//             <h2><LabelHelp help={t(' This is your subscribed Lists. ')} />
//                 <strong>{t(' Lists: ')}</strong>
//                 <Label circular color='blue' size='small'>{countLists}</Label>
//                 </h2> 
//                 {inBoxDetail.ok.listMessages.length>0 &&
//                  inBoxDetail.ok.listMessages
//                  .sort((a, b) => b.timestamp - a.timestamp) //most recent on top
//                  .map((_lists, index: number) =>
//                 <>
//                   <h2>{_lists.toListName && <>
//                     <strong>{'@'}{hextoHuman(_lists.toListName)}{' '}</strong></>}                
                  
//                   </h2>  
//                   {_lists.message.length>0 && (<>
//                     <Expander 
//                     className='listMessage'
//                     isOpen={false}
//                     summary={<Label size={'small'} color='orange' circular> {'Messages ✉️'}</Label>}>
//                       {timeStampToDate(_lists.timestamp)}<br />
//                       <IdentityIcon value={_lists.fromAcct} />
//                       {' ('}<AccountName value={_lists.fromAcct} withSidebar={true}/>{') '}
//                       {hextoHuman(_lists.username)}
//                       <Label color='blue' textAlign='left' pointing='left'>
//                           {hextoHuman(_lists.message)}
//                       </Label>
//                       {(_lists.fileUrl != '0x') && (
//                       <>
//                         <Label  as='a' color='orange' circular size={'mini'}
//                         href={isHex(_lists.fileUrl) ? withHttp(hexToString(_lists.fileUrl).trim()) : ''} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         >{t('Link')}
//                         </Label>{' '}
//                       </>)} <br /><br />
                  
//                   </Expander>
                  
//                   </>)}       
//                   {setCountLists(index+1)}   
//                   <Divider />         
//                 </>)
//                 }
//             </Table.Cell>
//           </Table.Row>

//           <Table.Row>
//             <Table.Cell verticalAlign='top'>
//             <h2><LabelHelp help={t(' These are your public and private Groups. Send a message to the Group by clicking the blue envelop icon. ')} />
//                 <strong>{t(' Groups: ')}</strong>
//                 <Label circular color='blue' size='small'>{countGroups}</Label>
//                 </h2> 
//                 {inBoxDetail.ok.groupMessages.length>0 &&
//                  inBoxDetail.ok.groupMessages
//                  .sort((a, b) => b.timestamp - a.timestamp) //most recent on top
//                  .map((_groups, index: number) =>
//                 <>
//                   <h2>{_groups.toListName && <>
//                     <strong>{'@'}{hextoHuman(_groups.toListName)}{' '}</strong></>}
                  
//                     <Badge icon='envelope' color={'blue'}
//                                   onClick={()=>{<>
//                                   {setToAcct(_groups.fromAcct)}
//                                   {setUsername(_groups.toListName)}
//                                   {setCount(count + 1)}
//                                   {_makeGroupMsg()}</>}}/>                  
                  
//                   </h2>  
//                   {_groups.message.length>0 && (<>
//                     <Expander 
//                     className='listMessage'
//                     isOpen={false}
//                     summary={<Label size={'small'} color='orange' circular> {'Messages ✉️'}</Label>}>
                    
//                       {timeStampToDate(_groups.timestamp)}<br />
//                       <IdentityIcon value={_groups.fromAcct} />
//                       {' ('}<AccountName value={_groups.fromAcct} withSidebar={true}/>{') '}
//                       {hextoHuman(_groups.username)}
//                       <Label color='blue' textAlign='left' pointing='left'>
//                           {hextoHuman(_groups.message)}
//                       </Label>
//                       {(_groups.fileUrl != '0x') && (
//                       <>
//                         <Label  as='a' color='orange' circular size={'mini'}
//                         href={isHex(_groups.fileUrl) ? withHttp(hexToString(_groups.fileUrl).trim()) : ''} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         >{t('Link')}
//                         </Label>{' '}
//                       </>)} <br /><br />
                    
//                   </Expander>
                  
//                   </>)}       
//                   {setCountGroups(index+1)}   
//                   <Divider />         
//                 </>)
//                 }
//             </Table.Cell>
//           </Table.Row>

//       </Table>
//       </div>   
//       )
//     } catch(e) {
//       console.log(e);
//       return(
//         <div>
//           <Card>{t('No Data in your InBox')}</Card>
//         </div>
//       )
//     }
// }
    

//   return (
//     <StyledDiv className={className}>
//     <Card>
//     <AccountHeader 
//             fromAcct={from} 
//             timeDate={when} 
//             callFrom={2}/>
//       <ListAccount />
//       <GetMessages />
//       {isMessage && (<>
//         <CallSendMessage
//                 callIndex={1}
//                 toAcct={_toAcct}
//                 messageId={''}
//                 onReset={() => _reset()}
//             />      
//         </>)}
//         {isListMsg && (<>
//         <CallSendMessage
//                 callIndex={15}
//                 toAcct={_toAcct}
//                 username={_username}
//                 messageId={''}
//                 onReset={() => _reset()}
//             />      
//         </>)}
//         {isGroupMsg && (<>
//         <CallSendMessage
//                 callIndex={2}
//                 toAcct={_toAcct}
//                 username={_username}
//                 messageId={''}
//                 onReset={() => _reset()}
//             />      
//         </>)}
//     </Card>
//     </StyledDiv>
//   );
// }
// const StyledDiv = styled.div`
//   align-items: center;
//   display: flex;

//   .output {
//     flex: 1 1;
//     margin: 0.25rem 0.5rem;
//   }
// `;
// export default React.memo(SearchAccountDetails);
