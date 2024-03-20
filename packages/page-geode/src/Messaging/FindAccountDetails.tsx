// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0
// *** DEPRICATED ***
//import React from 'react';
// import React, { useState } from 'react';
// import { useTranslation } from '../shared/translate.js';
// import type { CallResult } from '../shared/types.js';
// import { stringify, hexToString, isHex } from '@polkadot/util';
// import { styled, Button, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
// import { Divider, Table, Label } from 'semantic-ui-react'
// import AccountHeader from '../shared/AccountHeader.js';

// interface Props {
//     className?: string;
//     onClear?: () => void;
//     outcome: CallResult;
//   }
  
//   type Account = {
//     userAccount: string,
//     username: string,
//     interests: string,
//     inboxFee: number,
//     hideFromSearch: boolean,
//     lastUpdate: number
//   }
  
//   type AccountObj = {
//     search: string,
//     accounts: Account[]
//   }

//   type AccountDetail = {
//   ok: AccountObj
//   }
  
// function FindAccountDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
//     //todo: code for unused params or remove!:
//     // console.log(JSON.stringify(message));
//     // console.log(JSON.stringify(params));
//     // console.log(JSON.stringify(result));

//     const { t } = useTranslation();
//     const objOutput: string = stringify(output);
//     const _Obj = JSON.parse(objOutput);
//     const accountsDetail: AccountDetail = Object.create(_Obj);

//     const [countInbox, setCountInbox] = useState(0);

//     function hextoHuman(_hexIn: string): string {
//       const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
//       return(_Out)
//     }
    
//     function booltoHuman(_bool: boolean): string {
//       const _Out: string = (_bool? t('Private'): t('Public') );
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
//                 {t(' Number of Accounts Found: ')}{countInbox}{' '}
                
//                 {accountsDetail.ok.search && (<>
//                   <h3>
//                       <strong>{t(' Search Results for Keyword: ')}</strong>
//                       {hextoHuman(accountsDetail.ok.search)}
//                   </h3>             
//                 </>)}
//               </Table.HeaderCell>
//             </Table.Row>
//           </Table.Header>

//           <Table.Row>
//             <Table.Cell verticalAlign='top'>
//             <h2><LabelHelp help={t(' These are the Accounts that have a match to your Search Keyword. ')} />
//                 <strong>{t(' Accounts: ')}</strong>
//                 <Label circular color='blue' size='small'>{countInbox}</Label>
//             </h2> 
          
//                 {accountsDetail.ok.accounts.length>0 && 
//                   accountsDetail.ok.accounts
//                   .sort((a, b) => b.lastUpdate - a.lastUpdate) //most recent on top
//                   .map((_account, inbox: number)=> <>
//                         <h2>
//                         <strong>{'@'}{hextoHuman(_account.username)}</strong>
//                         {' ('}<AccountName value={_account.userAccount} withSidebar={true}/>{') '}
//                         <IdentityIcon value={_account.userAccount} />
//                         </h2>
//                         <strong>{t('Interests: ')}</strong>{hextoHuman(_account.interests)}<br />
//                         <strong>{t('Inbox Fee: ')}</strong>{_account.inboxFee}<br />
//                         <strong>{t('Account: ')}</strong>{booltoHuman(_account.hideFromSearch)}<br />
//                         <strong>{t('Last Updated: ')}</strong>
//                           {setCountInbox(inbox+1)}{timeStampToDate(_account.lastUpdate)}<br />
//                       </>)}
//                   <Divider />

//             </Table.Cell>
//           </Table.Row>

//       </Table>
//       </div>   
//       )
//     } catch(e) {
//       console.log(e);
//       return(
//         <div>
//           <Card>{t('No Data Returned')}</Card>
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
// export default React.memo(FindAccountDetails);
