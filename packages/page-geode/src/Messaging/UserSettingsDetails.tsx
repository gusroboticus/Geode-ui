// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Button, LabelHelp, Card } from '@polkadot/react-components';
import { Label, Table, Divider } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';
import AccountHeader from '../shared/AccountHeader.js';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
  }
  
type SettingsObj = {
    callerInterests: string,
    callerInboxFee: number,
    callerLastUpdate: number,
    callerHide: boolean,
    callerUsername: string
    interests: string[],
    inboxFee: number[],
    lastUpdate: number[]
  }

type SettingsDetail = {
  ok: SettingsObj
  }
  
function UserSettingsDetails ({ className = '', onClear, outcome: { from, output, when } }: Props): React.ReactElement<Props> | null {
    //todo: code for unused params or remove!:
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(params));
    // console.log(JSON.stringify(result));

    const { t } = useTranslation();
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const settingsDetail: SettingsDetail = Object.create(_Obj);

    function feeAverage(_fee: number[]): string {
        return(_fee.reduce((a,b) => a+b)/_fee.length).toString()
    }

    function booltoHuman(_bool: boolean): string {
        return(_bool? t('Private'): t('Public'))
    }

    function hextoHuman(_hexIn: string): string {
      const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): '';
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

   function removeDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }
    
  function removeSpaces(arr: string[]) {
    return arr.map(_w => (_w.trim()).toLowerCase() // Normalize
    .replace(/["“”(\[{}\])]|\B['‘]([^'’]+)['’]/g, '$1') // Strip quotes and brackets
    .replace(/[‒–—―…]|--|\.\.\./g, ' ') // Strip dashes and ellipses
    .replace(/[!?;:.,]\B/g, '')); // Strip punctuation marks
  }
  
  function ShowOrderByAlpha(inStr: string, inArr: string[]): JSX.Element {
    return(
            <>{inArr.map((_word) => 
                      <>
                      {_word.trim()!='' && (
                          <div>
                          <CopyInline value={_word.trim()} label={''}/>
                          {inStr.split(_word.trim()).length - 1 > 0 ? (
                          <>
                          <strong>{_word.trim()}{': '}</strong>
                          <Label color={inStr.split(_word.trim()).length - 1 < 2 ? 'grey' : 'blue'} 
                              circular>
                              {inStr.split(_word.trim()).length - 1}
                          </Label>
                          </>
                          ) : (
                          <>{_word.trim()}</>
                          )
                      }
                      <br />
                      </div>
                )}</>)}</>
              )
  }

    function ListAccount(): JSX.Element {
      return(
          <div>
            <Table>
              <Table.Row>
              <Table.Cell>
              <Button
                  icon='times'
                  label={t(' Close ')}
                  onClick={onClear}
                />
              </Table.Cell>
              </Table.Row>
            </Table>
          </div>
      )}  
      
function ShowData(): JSX.Element {
      try {
        const maxIndex: number = settingsDetail.ok.interests.length;
        const averageFee: string = feeAverage(settingsDetail.ok.inboxFee);
        const modArr: string[] = (settingsDetail.ok.interests.map(_w => hextoHuman(_w).trimStart() + ', ')).concat();
        const strArr: string = JSON.stringify(modArr.toString().split(','));
        const strObj: string[] = removeDuplicates(removeSpaces(JSON.parse(strArr)));
    
        return(
          <div>
          <Table stretch>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <h2><strong>{t('Your Settings:')}</strong></h2>
                <strong>{t('User Name: ')}</strong>{hextoHuman(settingsDetail.ok.callerUsername)}<br />
                <strong>{t('Last Update: ')}</strong>{timeStampToDate(settingsDetail.ok.callerLastUpdate)}<br />
                <strong>{t('Paid Inbox Fee: ')}</strong>{settingsDetail.ok.callerInboxFee}{' Geode'}<br />
                <strong>{t('Account Type: ')}</strong>{booltoHuman(settingsDetail.ok.callerHide)}< br />
                <strong>{t('Interests: ')}</strong>
                {hexToString(settingsDetail.ok.callerInterests)}
                
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t(' Interest Areas: ')} />
                <strong>{t(' Interests: ')}</strong></h2> 


            <strong>{'Interest Word Analysis :'}</strong><br /><br />
              {t('(1) Total Number of Users In Data: ') } <strong>{maxIndex}</strong><br />
              {t('(2) Total Number of Unique Words/Phrases: ')}<strong>{strObj.length}</strong><br /><br />

              <>
                  <br />
                  <u><strong>{t(' Interest Words by User Accounts:')}</strong></u><br /><br />
                  
                  {settingsDetail.ok.interests.map((_word) => 
                    <>
                    <CopyInline value={hextoHuman(_word)} label={''}/>
                    {hextoHuman(_word)}<br />
                    </>)
                  }    
                <Divider />
                </>

                <>
                <br /><br />

                <u><strong>{t('Interest Words: ')}</strong></u><br /><br />
                {ShowOrderByAlpha(strArr, strObj)}            
                <br /><br />
                </> 

            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t(' InBox Fees: ')} />
                <strong>{t(' Fees: ')}</strong>
                {t('Average Fee: ')}<strong>{averageFee}</strong>
            </h2> 
                <br />
                <u><strong>{t('Fees by Users: ')}</strong></u><br /><br />
                {settingsDetail.ok.inboxFee.length>0 && 
                  settingsDetail.ok.inboxFee.map((_data)=> <>
                  <CopyInline value={_data.toString()} label={''}/>

                  <strong>{_data}{' Geode'}</strong><br />
                </>)
                }
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell verticalAlign='top'>
            <h2><LabelHelp help={t(' Last Updates: ')} />
                <strong>{t(' Last Updates: ')}</strong>
            </h2> <br />
                <u><strong>{t('Updates by Users: ')}</strong></u><br /><br />
                {settingsDetail.ok.lastUpdate.length>0 && 
                  settingsDetail.ok.lastUpdate.map((_data)=> <>
                  <strong>{timeStampToDate(_data)}</strong><br />
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
          <Card>{t('No Data in your InBox')}</Card>
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
      <ListAccount />
      <ShowData />
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
export default React.memo(UserSettingsDetails);
