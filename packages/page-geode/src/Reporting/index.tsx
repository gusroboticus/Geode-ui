// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { styled, Card, Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '../shared/translate.js';
import { useCodes } from '../useCodes.js';
import { useContracts } from '../useContracts.js';
import ContractsTable from './ContractsTable.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
}

const StyledDiv = styled.div`
  .ui--Table td > article {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
`;

export default function Reporting ({ className = '' }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [isMakeReport, toggleMakeReport] = useToggle();
  const [isViewReports, toggleViewReports] = useToggle();
  const [isViewAllowedAccounts, toggleViewAllowedAccounts] = useToggle();
  const [isFaq, toggleFaq] = useToggle();
  const refTitle: string[] = 
  [' Anyone - Report illegal activity. (Click again to close) ', 
   ' Allowed Accounts Only - View current list of reports. (Click again to close) ', 
   ' Geode Legal Team Only - View allowed accounts. (Click again to close) ',
  ];
  const { allCodes, codeTrigger } = useCodes();
  const { allContracts } = useContracts();
  console.log(allCodes);
  
  return (
    <StyledDiv className={className}>
    <div>
        <Table >
          <Summary />
          <Card>
            {!isViewReports && !isViewAllowedAccounts && !isFaq && (
            <><Button
                    icon={(isMakeReport) ? 'minus' : 'plus'}
                    label={t('Report Illegal Activity')}
                    onClick={toggleMakeReport}>
              </Button>
              </>
            )}
            {!isMakeReport && !isViewAllowedAccounts && !isFaq && (
              <>
                  <Button
                    icon={(isViewReports) ? 'minus' : 'plus'}
                    label={t('View Reports')}
                    onClick={toggleViewReports}>
                  </Button>    
              </>
            )}
            {!isMakeReport && !isViewReports && !isFaq && (
              <>
              <Button
                icon={(isViewAllowedAccounts) ? 'minus' : 'plus'}
                label={t('Allowed Accounts')}
                onClick={toggleViewAllowedAccounts}>
              </Button>    
              </>
            )}
            {!isMakeReport && !isViewReports && !isViewAllowedAccounts && (
              <>
              <Button
                icon={(isFaq) ? 'minus' : 'plus'}
                label={t('FAQ')}
                onClick={toggleFaq}>
              </Button>    
              </>
            )}
            {isMakeReport && (<>{refTitle[0]}</>)}
            {isViewReports && (<>{refTitle[1]}</>)}
            {isViewAllowedAccounts && (<>{refTitle[2]}</>)}
            {isFaq && (
              <>
              <h3>{t('FREQUENTLY ASKED QUESTIONS')}</h3>
              <br /><strong>{t('What Information Goes Into A Report?')}</strong><br />
              {t('The Make A Report Form will ask for: Your Geode Account public key, Your legal name, Your phone number, The Geode Account public key (user) you are reporting, The Geode app on which you witnessed the alleged crime, The id hash of the Life And Work claim, the Social post, Marketplace product,  or other relevant activity wherein you witnessed the alleged crime (pick one or list several), The type of crime you are alleging, A detailed description of the alleged crime, The city and/or other location data about the Accused user (Caution! What is illegal in your locality might not be illegal in a different locality. Be certain that what you are reporting is actually illegal in THEIR locality.)')}<br />
              <br /><strong>{t('Where do these reports go?')}</strong><br />
              {t('These reports are available for any law enforcement entity that asks for them. In some cases, where evidence is clear, the report will be sent to the appropriate law enforcement entities to make them aware, without them asking.')}<br />
              <br /><strong>{t('Will the accused be notified?')}</strong><br />
              {t('No. If your account is accused of illegal activity, you will not necessarily be notified by any Geode user. You may, however, be contacted by the relevant law enforcement entities in your locality.')}<br />
              <br /><strong>{t('Will the reporter be notified if action is taken?')}</strong><br />
              {t('It will be up to the relevant law enforcement authorities to notify the reporter, or to ask for the reporter’s testimony, should they choose to.')}<br />
              <br /><strong>{t('Why do I have to give you my name and other data to make a report?')}</strong><br />
              {t('This app if for legal matters, not for grievances. Falsely reporting a crime, or falsely accusing someone of a crime, is itself a crime in many localities. You may be held accountable by relevant authorities. So be sure to be truthful and certain of what you are reporting.')}<br />
              <br /><strong>{t('Why can’t I see the reports people have made?')}</strong><br />
              {t('Making these reports public jeopardizes the reporter (in the case of a true report) and it jeopardizes the accused (in the case of a false report). It is best for all parties (including law enforcement) that these reports are kept private.')}<br />
              <br /><strong>{t('Who CAN see these reports?')}</strong><br />
              {t('Relevant law enforcement authorities may request data from this app by contacting the Geode Legal team directly. See http://geodechain.com/legal/ for more information')}<br />
              </>
            )}
          </Card>       
        </Table>
        {isMakeReport && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={0}
        />)}
        {isViewReports && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={4}
        />)}
        {isViewAllowedAccounts && (
          <ContractsTable
            contracts={allContracts}
            updated={codeTrigger}
            initMessageIndex={5}
        />)}

    </div>
    </StyledDiv>
  );
}

