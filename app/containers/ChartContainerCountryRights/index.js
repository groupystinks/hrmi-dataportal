/**
 *
 * ChartContainerCountryRights
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';
import { Paragraph, Box, Text, ResponsiveContext } from 'grommet';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// import getMetricDetails from 'utils/metric-details';

import { BENCHMARKS, GRADES, COLUMNS } from 'containers/App/constants';

import {
  getDimensionsForCountry,
  getCountry,
  getCountryGrammar,
  getStandardSearch,
  getBenchmarkSearch,
  getReferenceScores,
  getDependenciesReady,
  getRightsForCountry,
} from 'containers/App/selectors';
import { loadDataIfNeeded } from 'containers/App/actions';

import Source from 'components/Source';
import ChartHeader from 'components/ChartHeader';
import ChartBars from 'components/ChartBars';
import NarrativeESR from 'components/CountryNarrative/NarrativeESR';
import NarrativeCPR from 'components/CountryNarrative/NarrativeCPR';
import NarrativeESRStandardHint from 'components/CountryNarrative/NarrativeESRStandardHint';
import NarrativeESRCompAssessment from 'components/CountryNarrative/NarrativeESRCompAssessment';
import NarrativeCPRCompAssessment from 'components/CountryNarrative/NarrativeCPRCompAssessment';

import Hint from 'styled/Hint';

import { getRightsScoresForDimension } from 'utils/scores';
import getMetricDetails from 'utils/metric-details';
import { getMessageGrammar } from 'utils/narrative';
import { isMinSize } from 'utils/responsive';

import rootMessages from 'messages';

const DEPENDENCIES = [
  'countries',
  'countriesGrammar',
  'esrIndicators',
  'cprScores',
  'esrScores',
  'esrIndicatorScores',
];

const getESRDimensionValue = (score, benchmark) => {
  if (score) {
    const col = (benchmark && benchmark.column) || COLUMNS.ESR.SCORE_ADJUSTED;
    return score && parseFloat(score[col]);
  }
  return false;
};
const getCPRDimensionValue = score =>
  score && parseFloat(score[COLUMNS.CPR.MEAN]);

const getDimensionRefs = (score, benchmark) => {
  if (benchmark && benchmark.key === 'adjusted') {
    return [{ value: 100, style: 'dotted', key: 'adjusted' }];
  }
  if (benchmark && benchmark.key === 'best') {
    const col = benchmark.refColumn;
    return [
      { value: 100, style: 'solid', key: 'best' },
      {
        value: score && parseFloat(score[col]),
        style: 'dotted',
        key: 'adjusted',
      },
    ];
  }
  return false;
};
const getBand = score => ({
  lo: score && parseFloat(score[COLUMNS.CPR.LO]),
  hi: score && parseFloat(score[COLUMNS.CPR.HI]),
});

const getMetricLabel = (score, intl) =>
  intl.formatMessage(rootMessages['rights-xshort'][score.key]);

const getDimensionLabel = (score, intl) =>
  intl.formatMessage(rootMessages.dimensions[score.key]);

const prepareData = ({
  scores,
  dimensionCode,
  currentBenchmark,
  standard,
  onClick,
  intl,
  activeCode,
}) =>
  // prettier-ignore
  scores.map(s =>
    dimensionCode === 'esr'
      ? {
        color: dimensionCode,
        refValues: getDimensionRefs(s.score, currentBenchmark),
        value: getESRDimensionValue(s.score, currentBenchmark),
        maxValue: 100,
        unit: '%',
        stripes: standard === 'hi',
        key: s.key,
        label: getMetricLabel(s, intl),
        onClick: () => onClick(s.key, dimensionCode),
        active: activeCode === s.key,
      }
      : {
        color: dimensionCode,
        value: getCPRDimensionValue(s.score),
        maxValue: 10,
        unit: '',
        key: s.key,
        band: getBand(s.score),
        label: getMetricLabel(s, intl),
        onClick: () => onClick(s.key, dimensionCode),
        active: activeCode === s.key,
      }
  );

export function ChartContainerCountryRights({
  type,
  onLoadData,
  country,
  countryCode,
  dimensions,
  dimensionCode,
  dimensionAverages,
  countryGrammar,
  rights,
  standard,
  benchmark,
  dataReady,
  intl,
  onMetricClick,
  activeCode,
}) {
  useEffect(() => {
    onLoadData();
  }, []);

  if (!dataReady) return null;

  const currentBenchmark = BENCHMARKS.find(s => s.key === benchmark);

  const dimension = dimensions[dimensionCode];
  const reference = dimensionAverages[dimensionCode];

  let comparativeScoreESR;
  let comparativeRightsESR;
  if (dimensionCode === 'esr' && dimension && dimension.score) {
    comparativeScoreESR = dimension.score[currentBenchmark.column];
    comparativeRightsESR = 'all';
  }
  if (dimensionCode === 'esr' && dimension && dimension.scoreSome) {
    comparativeScoreESR = dimension.scoreSome[currentBenchmark.column];
    comparativeRightsESR = dimension.scoreSome.metric;
  }
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <div>
          {type === 'esr' && dimension && (
            <>
              <ChartHeader
                chartId="dimension-overview"
                messageValues={{
                  dimension: intl.formatMessage(
                    rootMessages.dimensions[dimensionCode],
                  ),
                }}
                includeChartName
                tools={{
                  howToReadConfig: {
                    key: 'country-dimension-esr',
                    chart: 'Bar',
                    dimension: 'esr',
                  },
                  settingsConfig: {
                    key: 'country-dimension-esr',
                    showStandard: true,
                    showBenchmark: true,
                  },
                }}
              />
              <Box
                margin={{ top: 'small', bottom: 'xsmall' }}
                responsive={false}
              >
                <Text size={isMinSize(size, 'large') ? 'medium' : 'small'}>
                  {currentBenchmark && (
                    <FormattedMessage
                      {...rootMessages.charts.dimensionIntro.esr[
                        currentBenchmark.key
                      ]}
                      values={getMessageGrammar(
                        intl,
                        countryCode,
                        null,
                        countryGrammar,
                      )}
                    />
                  )}
                </Text>
                <NarrativeESRStandardHint
                  country={country}
                  standard={standard}
                  countryGrammar={countryGrammar}
                />
              </Box>
              <Box margin={{ bottom: 'small' }} responsive={false}>
                <ChartBars
                  data={[
                    {
                      color: dimensionCode,
                      refValues: getDimensionRefs(
                        dimension.score,
                        currentBenchmark,
                      ),
                      value: getESRDimensionValue(
                        dimension.score,
                        currentBenchmark,
                      ),
                      maxValue: 100,
                      unit: '%',
                      stripes: standard === 'hi',
                      key: dimension.key,
                      label: getDimensionLabel(dimension, intl),
                      onClick: () => onMetricClick(dimension.key),
                      active: activeCode === dimension.key,
                    },
                  ]}
                  currentBenchmark={currentBenchmark}
                  standard={standard}
                  labelColor={`${dimensionCode}Dark`}
                  padVertical="xsmall"
                  grades={GRADES[type]}
                  gradeLabels={false}
                  level={1}
                  commonLabel={intl.formatMessage(
                    rootMessages.charts.dimensionSummaryLabel,
                  )}
                  listHeader
                  metric={getMetricDetails(dimensionCode)}
                  summaryScore={{
                    score: getESRDimensionValue(
                      dimension.score,
                      currentBenchmark,
                    ),
                    maxValue: 100,
                  }}
                  benchmarkIconOnly
                />
                <ChartBars
                  data={prepareData({
                    scores: getRightsScoresForDimension(rights, 'esr'),
                    dimensionCode,
                    currentBenchmark,
                    standard,
                    onClick: onMetricClick,
                    intl,
                    activeCode,
                  })}
                  currentBenchmark={currentBenchmark}
                  standard={standard}
                  commonLabel={intl.formatMessage(
                    rootMessages.charts.rightsColumnLabel[dimensionCode],
                  )}
                  labelColor={`${dimensionCode}Dark`}
                  grades={GRADES[type]}
                  listHeader
                  metric={getMetricDetails(dimensionCode)}
                  annotateBenchmark={false}
                  annotateMinMax={false}
                />
              </Box>
              <Box margin={{ bottom: 'large' }}>
                <Source />
              </Box>
              <NarrativeESR
                dimensionScore={dimension.score}
                country={country}
                countryGrammar={countryGrammar}
                standard={standard}
              />
              <NarrativeESRCompAssessment
                country={country}
                countryGrammar={countryGrammar}
                comparativeScore={parseFloat(comparativeScoreESR)}
                comparativeRights={comparativeRightsESR}
                groupAverageScore={
                  reference && reference.average && reference.average[benchmark]
                }
                benchmark={currentBenchmark}
              />
              <Paragraph>
                <Hint italic>
                  <FormattedMessage {...rootMessages.hints.settings} />
                </Hint>
              </Paragraph>
            </>
          )}
          {type === 'cpr' && dimension && (
            <>
              <ChartHeader
                chartId="dimension-overview"
                messageValues={{
                  dimension: intl.formatMessage(
                    rootMessages.dimensions[dimensionCode],
                  ),
                }}
                tools={{
                  howToReadConfig: {
                    key: 'country-dimension-cpr',
                    chart: 'Bullet',
                    dimension: dimensionCode,
                  },
                }}
              />
              <Box
                margin={{ top: 'small', bottom: 'xsmall' }}
                responsive={false}
              >
                <Text size={isMinSize(size, 'large') ? 'medium' : 'small'}>
                  <FormattedMessage
                    {...rootMessages.charts.dimensionIntro[dimensionCode]}
                    values={getMessageGrammar(
                      intl,
                      countryCode,
                      null,
                      countryGrammar,
                    )}
                  />
                </Text>
              </Box>
              <Box margin={{ bottom: 'small' }} responsive={false}>
                <ChartBars
                  data={[
                    {
                      color: dimensionCode,
                      value: getCPRDimensionValue(dimension.score),
                      band: getBand(dimension.score),
                      maxValue: 10,
                      key: dimension.key,
                      label: getDimensionLabel(dimension, intl),
                      onClick: () => onMetricClick(dimension.key),
                      active: activeCode === dimension.key,
                    },
                  ]}
                  labelColor={`${dimensionCode}Dark`}
                  padVertical="small"
                  grades={GRADES[type]}
                  gradeLabels={false}
                  level={1}
                  commonLabel="Category"
                  bullet={!!dimension.score}
                  listHeader
                  metric={getMetricDetails(dimensionCode)}
                  summaryScore={{
                    score: getCPRDimensionValue(dimension.score),
                    maxValue: 10,
                  }}
                />
                <ChartBars
                  data={prepareData({
                    scores: getRightsScoresForDimension(rights, dimensionCode),
                    dimensionCode,
                    onClick: onMetricClick,
                    intl,
                    activeCode,
                  })}
                  commonLabel={`${intl.formatMessage(
                    rootMessages.charts.rightsColumnLabel[dimensionCode],
                  )}`}
                  labelColor={`${dimensionCode}Dark`}
                  padVertical="small"
                  grades={GRADES[type]}
                  bullet={!!dimension.score}
                  listHeader
                  annotateMinMax={false}
                />
              </Box>
              <Box margin={{ bottom: 'large' }}>
                <Source />
              </Box>
              <NarrativeCPR
                dimensionKey={dimensionCode}
                score={dimension.score}
                country={country}
                countryGrammar={countryGrammar}
              />
              <NarrativeCPRCompAssessment
                dimensionKey={dimensionCode}
                score={dimension.score}
                country={country}
                countryGrammar={countryGrammar}
                referenceScore={reference.average}
                referenceCount={reference.count}
                start
              />
            </>
          )}
        </div>
      )}
    </ResponsiveContext.Consumer>
  );
}

ChartContainerCountryRights.propTypes = {
  countryCode: PropTypes.string.isRequired,
  dimensionCode: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  country: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  countryGrammar: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onLoadData: PropTypes.func.isRequired,
  dimensions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  standard: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  benchmark: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  dataReady: PropTypes.bool,
  dimensionAverages: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  rights: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onMetricClick: PropTypes.func,
  intl: intlShape.isRequired,
  activeCode: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
const mapStateToProps = createStructuredSelector({
  country: (state, { countryCode }) => getCountry(state, countryCode),
  countryGrammar: (state, { countryCode }) =>
    getCountryGrammar(state, countryCode),
  dataReady: state => getDependenciesReady(state, DEPENDENCIES),
  dimensions: (state, { countryCode }) =>
    getDimensionsForCountry(state, countryCode),
  standard: state => getStandardSearch(state),
  benchmark: state => getBenchmarkSearch(state),
  dimensionAverages: state => getReferenceScores(state),
  rights: (state, { countryCode }) => getRightsForCountry(state, countryCode),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: () =>
      DEPENDENCIES.forEach(key => dispatch(loadDataIfNeeded(key))),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(
  withTheme(injectIntl(ChartContainerCountryRights)),
);
