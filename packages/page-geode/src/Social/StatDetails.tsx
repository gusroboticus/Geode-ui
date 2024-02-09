// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../shared/translate.js';
import type { CallResult } from '../shared/types.js';
import { stringify, hexToString, isHex } from '@polkadot/util';
import { styled, Toggle, Card, Button, Badge } from '@polkadot/react-components';
import { Segment, Grid, Table, Label, Divider } from 'semantic-ui-react';
import CopyInline from '../shared/CopyInline.js';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
    className?: string;
    onClear?: () => void;
    outcome: CallResult;
}
  
type FeedDetail = {
  ok: string[];
}
  
function StatDetails ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
    // todo -> code unused params
    console.log(JSON.stringify(onClear));
    console.log(JSON.stringify(from));
    console.log(JSON.stringify(message));
    console.log(JSON.stringify(params));
    console.log(JSON.stringify(result));
    console.log(JSON.stringify(when));

    const { t } = useTranslation();
    const [isByUser, toggleByUser] = useToggle(false);
    const [isByFreq, toggleByFreq] = useToggle(true);
    const [isByGraph, toggleByGraph] = useToggle(false);
    const [isFilter, toggleFilter] = useToggle(false);
    const [isUnique, toggleUnique] = useToggle(false);
    const isShowFilter = (isByFreq);
    const objOutput: string = stringify(output);
    const _Obj = JSON.parse(objOutput);
    const feedDetail: FeedDetail = Object.create(_Obj);
    
function hextoHuman(_hexIn: string): string {
        const _Out: string = (isHex(_hexIn))? t(hexToString(_hexIn).trim()): ''
        return(_Out)
}

function removeDuplicates(arr: string[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

function sortDesend(arr: string[]) {
  const _arr: string[] = isFilter ? (arr.sort()) : (arr)
  return(_arr)
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
                        <>{_word.trim()}{': '}<strong>{0}</strong></>
                        )
                    }
                    <br />
                    </div>
              )}</>)}</>
            )
}

function ShowOrderByFreq(inStr: string, inArr: string[]): JSX.Element {
  const arr = orderByFrequency(inStr, inArr);
  return (
  <>
  {arr.map((_word) => 
      <>
       {_word.freq != 0 ? (
        <>
        <CopyInline value={_word.interest} label={''}/>
          <strong>{_word.interest.trim()}</strong>{': '}
            <Label color={_word.freq < 2 ? 'grey' : 'blue'} 
                    circular>
                    {_word.freq}
            </Label>
          <br />
        </>
       ) : ''}
      </>)
    }    
  </>
    )
}

function orderByFrequency(inStr: string, inArr: string[]) {
  return inArr.map(_word => _word !='' ? 
        {"interest": _word, "freq": (inStr.split(_word).length - 1) } :
        {"interest": '', "freq": 0})
        .sort((a, b) => b.freq - a.freq)
}


function ShowStat(): JSX.Element {
    try {
    const maxIndex: number = feedDetail.ok.length;
    const modArr: string[] = (feedDetail.ok.map(_w => hextoHuman(_w).trimStart() + ', ')).concat();
    const strArr: string = JSON.stringify(modArr.toString().split(','));
    const strObj: string[] = removeDuplicates(removeSpaces(JSON.parse(strArr)));
        return(
          <div>
            <Segment raised color='grey'>
            <Table stretch>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell >
                <>
                <Button
                  icon={(isByFreq) ? 'minus' : 'plus'}
                  label={t(' By Frequency ')}
                  onClick={toggleByFreq}
                />
                <Button
                  icon={(isByUser) ? 'minus' : 'plus'}
                  label={t(' By User ')}
                  onClick={toggleByUser}
                />
                <Button
                  icon={(isByGraph) ? 'minus' : 'plus'}
                  label={t(' Graph ')}
                  onClick={toggleByGraph}
                />
                </>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Row >
              <Table.Cell verticalAlign='top'>
              <strong>{'Interest Word Analysis :'}</strong>{(' (Select Analysis Above) ')}<br /><br />
              {t('(1) Total Number of Users In Data: ') } <strong>{maxIndex}</strong><br />
              {t('(2) Total Number of Unique Words/Phrases: ')}<strong>{strObj.length}</strong><br /><br />
              {isByUser && (
                  <>
                  <br />
                  <Badge icon='info' color={'blue'} />
                  <strong>{t(' Interest Words by User Accounts:')}</strong><br /><br />
                    <CopyInline value={'copy'} label={''}/>
                    {t(' Use the Copy button to copy the Interest Words from individual Users.')}
                    <br /><br />
                  
                  {feedDetail.ok.map((_word) => 
                    <>
                    <CopyInline value={hextoHuman(_word)} label={''}/>
                    {hextoHuman(_word)}<br /><br />
                    </>)
                  }    
                <Divider />
              </>)}
              {isByGraph && (
                <>
                <Badge color='red' icon='thumbs-up'/>
                <strong>{t(' Graph Analysis to be added in future upgrade.')}</strong><br /><br />
                <Divider />
                </>
              )}
              {isByFreq && (
                <>
                <Badge icon='info' color={'blue'} />
                <strong>{t(' Frequency Analysis: ')}</strong>{' '}
                {isShowFilter && (
                <>
                <br /><br />
                <Grid columns={5} divided>
                  <Grid.Row>
                    <Grid.Column>
                      <Toggle className=''
                        label={<> <Badge icon='check' color={isFilter? 'blue': 'gray'}/> {t(' Sort Alphabetic ')} </>}
                        onChange={toggleFilter}
                        value={isFilter}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Toggle className=''
                        label={<> <Badge icon='check' color={isUnique? 'blue': 'gray'}/> {t(' Show Unique Words ')} </>}
                        onChange={toggleUnique}
                        value={isUnique}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                </> 
                )}
                <br /><br />

                    <CopyInline value={'copy'} label={''}/>
                    {t('Use the Copy button to copy the Interest Words from individual Users.')}
                    <br /><br />

                <strong>{t('Unique Words: ')}</strong>
                {sortDesend(strObj).map((_word) => (
                  <>
                    {isUnique && (<>{' "'}{_word}{'", '}</>)}
                  </>
                ))}
                <br /><br />

        <Table>
          <Table.Cell>
            <u><strong>{t('Frequency Order: ')}</strong></u><br />
                {ShowOrderByFreq(strArr, strObj)} 
          </Table.Cell>
          <br /><br />
          <Table.Cell>
            {isFilter && (<>
              <u><strong>{t('Alphabetic Order: ')}</strong></u><br />
                {ShowOrderByAlpha(strArr, strObj)}            
            </>)}
                
          </Table.Cell>
        </Table>        
                </>
              )}
             </Table.Cell>
            </Table.Row>
        </Table>  
        </Segment>

      </div>)
          } catch(e) {
      console.log(e);
      return(
        <div>
          <>{t('No Social Data')}</>
        </div>
      )
    }
}

  return (
    <StyledDiv className={className}>
    <Card>
      
      <ShowStat />
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
export default React.memo(StatDetails);
