// Copyright 2017-2023 @blockandpurpose.com
// SPDX-License-Identifier: Apache-2.0

import {INTEREST_WORDS} from './interestWords.js';
import {DANTIAN} from './signerConst.js';

export function dantianSigner (_index: number): string {
const _interests: string = (_index>-1 && _index<DANTIAN.length)? DANTIAN[_index]: '';
const _dInt_one: number = +(_interests[4]+_interests[5]);
const _dInt_two: number = +(_interests[6]+_interests[7]);
const _dInt_three: number = +(_interests[8]+_interests[9]);
const _dInt_four: number = +(_interests[10]+_interests[11]);
    return(_interests[0]==='2'? INTEREST_WORDS[_dInt_one]+INTEREST_WORDS[_dInt_two]: 
                                INTEREST_WORDS[_dInt_one]+INTEREST_WORDS[_dInt_two]+INTEREST_WORDS[_dInt_three]+INTEREST_WORDS[_dInt_four]) ;
}

