/**
 *
 * CountryNarrative
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Heading, Box, Paragraph } from 'grommet';

import rootMessages from 'messages';

import { BENCHMARKS, STANDARDS } from 'containers/App/constants';
import { getRightsScoresForDimension, hasCPR } from 'utils/scores';

import messages from './messages';
import CPRAccordion from './Accordions/CPRAccordion';
import ESRAccordion from './Accordions/ESRAccordion';
import NarrativeCPR from './NarrativeCPR';
import NarrativeESR from './NarrativeESR';
import NarrativeAtRisk from './NarrativeAtRisk';
import NarrativeCPRCompAssessment from './NarrativeCPRCompAssessment';
import NarrativeESRCompAssessment from './NarrativeESRCompAssessment';

const Styled = props => <Box direction="column" {...props} />;

const RightsType = styled(Box)`
  padding-bottom: 50px;
`;
const Dimension = styled(Box)`
  padding-bottom: 30px;
`;

const RightsTypeHeading = props => (
  <Heading
    responsive={false}
    level={3}
    margin={{ vertical: '5px' }}
    {...props}
  />
);

// const isDefaultStandard = (standard, country) =>
//   (standard === 'hi' && country.high_income_country === '1') ||
//   (standard === 'core' && country.high_income_country === '0');

const getDefaultStandard = country =>
  country.high_income_country === '1' ? 'hi' : 'core';

const getIncomeCategory = country =>
  country.high_income_country === '1' ? 'hi' : 'lmi';

const renderStandardHint = (intl, standard, country) => (
  <Paragraph>
    <strong>
      <FormattedMessage
        {...messages.esr.changeStandardNote}
        values={{
          otherStandard: intl.formatMessage(
            rootMessages.settings.standard[standard],
          ),
          defaultStandard: intl.formatMessage(
            rootMessages.settings.standard[getDefaultStandard(country)],
          ),
          incomeCategory: intl.formatMessage(
            rootMessages.income[getIncomeCategory(country)],
          ),
        }}
      />
    </strong>
  </Paragraph>
);

function CountryNarrative({
  dimensions,
  rights,
  indicators,
  benchmark,
  onMetricClick,
  country,
  atRiskData,
  onAtRiskClick,
  standard,
  intl,
  reference,
  type,
}) {
  if (!dimensions || !rights || !indicators) {
    return null;
  }

  const currentStandard = STANDARDS.find(s => s.key === standard);
  const hasSomeIndicatorScores = Object.values(indicators)
    .filter(s => {
      if (!s.details) return false;
      return (
        s.details.standard === 'Both' ||
        s.details.standard === currentStandard.code
      );
    })
    .reduce((m, s) => m || !!s.score, false);
  return (
    <Styled>
      {type === 'cpr' && (
        <RightsType>
          {dimensions.empowerment && dimensions.empowerment.score && (
            <Dimension>
              <CPRAccordion
                dimension={dimensions.empowerment}
                rights={getRightsScoresForDimension(
                  rights,
                  'empowerment',
                  true,
                )}
                onMetricClick={onMetricClick}
              />
              <NarrativeCPR
                dimensionKey="empowerment"
                score={dimensions.empowerment && dimensions.empowerment.score}
                country={country}
              />
            </Dimension>
          )}
          {dimensions.physint && dimensions.physint.score && (
            <Dimension>
              <CPRAccordion
                dimension={dimensions.physint}
                rights={getRightsScoresForDimension(rights, 'physint', true)}
                onMetricClick={onMetricClick}
              />
              <NarrativeCPR
                dimensionKey="physint"
                score={dimensions.physint && dimensions.physint.score}
                country={country}
              />
            </Dimension>
          )}
          {!hasCPR(dimensions) && <NarrativeCPR noData country={country} />}
        </RightsType>
      )}
      {type === 'esr' && (
        <RightsType>
          <Dimension>
            {getDefaultStandard(country) !== standard &&
              renderStandardHint(intl, standard, country)}
            <ESRAccordion
              dimension={dimensions.esr}
              rights={getRightsScoresForDimension(rights, 'esr')}
              benchmark={BENCHMARKS.find(s => s.key === benchmark)}
              indicators={Object.values(indicators)}
              onMetricClick={onMetricClick}
              standard={standard}
              hasAtRisk={hasCPR(dimensions)}
            />
            <NarrativeESR
              score={dimensions.esr && dimensions.esr.score}
              country={country}
              someData={hasSomeIndicatorScores}
            />
          </Dimension>
        </RightsType>
      )}
      {hasCPR(dimensions) && (
        <RightsType>
          <RightsTypeHeading>
            <FormattedMessage {...messages.atRiskSectionTitle} />
          </RightsTypeHeading>
          <NarrativeAtRisk
            country={country}
            noData={!hasCPR(dimensions)}
            data={atRiskData.filter(dim => dim.type === type)}
            onAtRiskClick={onAtRiskClick}
          />
        </RightsType>
      )}
      {(hasCPR(dimensions) || (dimensions.esr && dimensions.esr.score)) && (
        <RightsType>
          <RightsTypeHeading>
            <FormattedMessage
              {...messages.compAssessmentSectionTitle}
              values={{
                country: intl.formatMessage(
                  rootMessages.countries[country.country_code],
                ),
              }}
            />
          </RightsTypeHeading>
          {type === 'cpr' && hasCPR(dimensions) && (
            <Paragraph>
              {reference.empowerment && (
                <NarrativeCPRCompAssessment
                  dimensionKey="empowerment"
                  score={dimensions.empowerment && dimensions.empowerment.score}
                  country={country}
                  referenceScore={reference.empowerment.average}
                  referenceCount={reference.empowerment.count}
                  start
                />
              )}
              {reference.physint && (
                <NarrativeCPRCompAssessment
                  conjunct
                  dimensionKey="physint"
                  score={dimensions.physint && dimensions.physint.score}
                  country={country}
                  referenceScore={reference.physint.average}
                  referenceCount={reference.physint.count}
                />
              )}
            </Paragraph>
          )}
          {type === 'esr' &&
            dimensions.esr &&
            dimensions.esr.score &&
            getDefaultStandard(country) !== standard &&
            renderStandardHint(intl, standard, country)}
          {type === 'esr' && dimensions.esr && reference && reference.esr && (
            <Paragraph>
              <NarrativeESRCompAssessment
                country={country}
                score={dimensions.esr.score}
                referenceScore={reference.esr[standard].average[benchmark]}
                referenceCount={reference.esr[standard].count}
                benchmark={BENCHMARKS.find(s => s.key === benchmark)}
              />
            </Paragraph>
          )}
        </RightsType>
      )}
    </Styled>
  );
}

CountryNarrative.propTypes = {
  onMetricClick: PropTypes.func,
  onAtRiskClick: PropTypes.func,
  reference: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  atRiskData: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  dimensions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  rights: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  indicators: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  country: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  benchmark: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  standard: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  intl: intlShape.isRequired,
  year: PropTypes.number,
  type: PropTypes.string,
};

export default injectIntl(CountryNarrative);
