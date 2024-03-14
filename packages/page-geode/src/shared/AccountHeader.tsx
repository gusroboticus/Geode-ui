// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from '../translate.js';
import { styled, Toggle, Badge, AccountName, LabelHelp, IdentityIcon, Card } from '@polkadot/react-components';
import { Item, Label } from 'semantic-ui-react'
import CopyInline from '../shared/CopyInline.js';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
    className?: string;
    onClear?: () => void;
    fromAcct: string;
    timeDate: Date;
    callFrom?: number;
  }
  
function AccountHeader ({ className = '', onClear, fromAcct, timeDate, callFrom }: Props): React.ReactElement<Props> | null {
    //todo: code for params:
    console.log(JSON.stringify(onClear));
    const { t } = useTranslation();
    const [isShowInfo, toggleShowInfo] = useToggle(false);

function ListAccount(): JSX.Element {
  try {
    return (
      <div>
        <Item.Content>
          <Item.Header>
          <h2>

             <IdentityIcon size={32} value={fromAcct} />
             {' '}
             <AccountName value={fromAcct} withSidebar={true}/>
             <LabelHelp help={t(' The account calling the information. ')} /> 
             </h2>
          </Item.Header>
          <Item.Meta>            
            
          </Item.Meta>
          <Item.Description> 
          
          {' '}{timeDate.toLocaleDateString()} 
          {' '}{timeDate.toLocaleTimeString()} 
          
          </Item.Description>
        </Item.Content>
        <br />
        {callFrom!=99 && (<>
          <Toggle
            className='info-toggle'
            label={<><strong>{t(' Key: ')}</strong>
            {isShowInfo && (
              <>
                {(callFrom===1 || callFrom===2 || callFrom===0) && (<>
                {t(' Link to See More: ')}
                <Label circular color='orange'> Link </Label>  
                </>)}
                {(callFrom===1 || callFrom===0) && (<>
                {t(' No. of Endorsements: ')}
                <Label circular color='blue'>{'#'}</Label>  
                {t(' Endorse a Post: ')}
                <Badge icon='thumbs-up' color='blue' /> 
                {t(' Copy a message ID: ')}
                <Badge icon='copy' color='orange' /> 
                </>)}
                {callFrom===2 && (<>
                {t(' Copy Address: ')}
                <Badge icon='copy' color='orange' /> 
                </>)}
                {callFrom===3 && (<>
                {t(' Link to See More: ')}
                <Label circular color='orange'> Link </Label>
                {t(' No. of Endorsements: ')}
                <Label circular color='blue'>{'#'}</Label>  
                {t(' See Replies: ')}
                <Label color='orange' circular >{'Replies #'}</Label>  
                {t(' Endorse a Post: ')}
                <Badge icon='thumbs-up' color='blue' />
                {t(' Copy Message ID: ')}
                <CopyInline value={' '} label={''}/>  
                {t('Reply to a Post')}
                <Label color='orange' circular>{'Reply'}</Label>              
                </>)}
                {callFrom===1 && (<><br />
                <strong>{'NOTE: '}</strong>
                {t('You can have 20 claims for each claim type except for Work History where you can have 10.  ')}<br />
                {t('All claims greater than the limit will be stored on chain but are not displayed. ')}
                </>)}
              </>
            )}
            </>}
            onChange={toggleShowInfo}
            value={isShowInfo}
            />
        </>)}

      </div>
    )
  } catch(error) {
    console.error(error)
    return(
      <div>
          <strong>{t('There are no posts available.')}</strong>
          <strong>{t(' | Date/Time: ')}</strong>
            {' '}{timeDate.toLocaleDateString()} 
            {' '}{timeDate.toLocaleTimeString()} 
      </div>
    )
  }}

  
return (
    <StyledDiv className={className}>
    <Card>
    <ListAccount />
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
export default React.memo(AccountHeader);
