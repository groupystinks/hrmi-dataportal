/**
 *
 * ChartCountrySnapshot
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import { Heading, Box, Text, Button, ResponsiveContext } from 'grommet';

import { COLUMNS, GRADES } from 'containers/App/constants';

import ChartBars from 'components/ChartBars';
import Active from 'components/ChartBars/styled/Active';

import Source from 'components/Source';

import getMetricDetails from 'utils/metric-details';
import { isMinSize, isMaxSize } from 'utils/responsive';

import rootMessages from 'messages';

const Dimension = styled(Box)`
  margin-bottom: 6px;
  position: relative;
`;

const ChartArea = props => (
  <Box direction="column" fill="horizontal" {...props} />
);

// prettier-ignore
const StyledDimensionHeading = styled(Heading)`
  font-size: ${({ theme, level = 1 }) => theme.heading.level[level].small.size};
  line-height: ${({ theme, level = 1 }) => theme.heading.level[level].small.height};
  @media (min-width: ${({ theme }) => theme.breakpointsMin.large}) {
    font-size: ${({ theme, level = 1 }) => theme.heading.level[level].medium.size};
    line-height: ${({ theme, level = 1 }) => theme.heading.level[level].medium.height};
    min-width: 180px;
    padding-right: 10px;
  }
`;
const DimensionHeading = props => (
  <StyledDimensionHeading
    responsive={false}
    level={4}
    margin={{ vertical: 'none' }}
    {...props}
  />
);

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
    // const col = benchmark.refColumn;
    return [
      { value: 100, style: 'solid', key: 'best' },
      // {
      //   value: score && parseFloat(score[col]),
      //   style: 'dotted',
      //   key: 'adjusted',
      // },
    ];
  }
  return false;
};

const getMetricLabel = (score, intl) =>
  intl.formatMessage(rootMessages['rights-xshort'][score.key]);

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
        hasScoreAlternate: s.hasScoreAlternate,
        hasScoreIndicators: s.hasScoreIndicators,
        hasScoreIndicatorsAlternate: s.hasScoreIndicatorsAlternate,
        active: activeCode === s.key,
      }
      : {
        color: dimensionCode,
        value: getCPRDimensionValue(s.score),
        maxValue: 10,
        unit: '',
        key: s.key,
        label: getMetricLabel(s, intl),
        onClick: () => onClick(s.key, dimensionCode),
        active: activeCode === s.key,
      }
  );

function ChartCountrySnapshot({
  type,
  dimensionCode,
  dimensionScore,
  currentBenchmark,
  rights,
  standard,
  year,
  maxValue,
  onMetricClick,
  intl,
  source,
  grammar,
  activeCode,
}) {
  const [hover, setHover] = useState(false);
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Box
          direction="column"
          pad={{ bottom: 'small' }}
          margin={{ bottom: 'small' }}
        >
          <Box direction="row">
            <ChartArea>
              <Dimension>
                <Box
                  direction={isMaxSize(size, 'sm') ? 'column' : 'row'}
                  align={isMaxSize(size, 'sm') ? 'start' : 'center'}
                >
                  <Button
                    onClick={() => onMetricClick(dimensionCode)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={{ position: 'relative' }}
                    margin={{ right: 'ms' }}
                  >
                    {(hover || activeCode === dimensionCode) && (
                      <Active color={`${dimensionCode}Active`} />
                    )}

                    <DimensionHeading
                      color={
                        hover || activeCode === dimensionCode
                          ? `${dimensionCode}Active`
                          : `${dimensionCode}Dark`
                      }
                    >
                      <FormattedMessage
                        {...rootMessages.dimensions[dimensionCode]}
                      />
                    </DimensionHeading>
                  </Button>
                  <Text size={isMinSize(size, 'large') ? 'small' : 'xsmall'}>
                    <FormattedMessage {...rootMessages['rights-types'][type]} />
                    {` (${year})`}
                  </Text>
                </Box>
                <Box
                  margin={{ top: 'small', bottom: 'xsmall' }}
                  responsive={false}
                >
                  <Text size={isMinSize(size, 'large') ? 'medium' : 'small'}>
                    {type === 'esr' && currentBenchmark && (
                      <FormattedMessage
                        {...rootMessages.charts.dimensionIntro.esr[
                          currentBenchmark.key
                        ]}
                        values={grammar}
                      />
                    )}
                    {type === 'cpr' && (
                      <FormattedMessage
                        {...rootMessages.charts.dimensionIntro[dimensionCode]}
                        values={grammar}
                      />
                    )}
                  </Text>
                </Box>
                <ChartBars
                  summaryScore={
                    dimensionScore ? { score: dimensionScore, maxValue } : null
                  }
                  data={prepareData({
                    scores: rights,
                    dimensionCode,
                    currentBenchmark,
                    standard,
                    onClick: onMetricClick,
                    intl,
                    activeCode,
                  })}
                  currentBenchmark={type === 'esr' && currentBenchmark}
                  standard={type === 'esr' && standard}
                  commonLabel={`${intl.formatMessage(
                    rootMessages.charts.rightsColumnLabel[dimensionCode],
                  )}`}
                  labelColor={`${dimensionCode}Dark`}
                  padVertical="small"
                  grades={GRADES[type]}
                  listHeader
                  metric={getMetricDetails(dimensionCode)}
                  annotateBetter={false}
                  benchmarkIconOnly
                />
              </Dimension>
            </ChartArea>
          </Box>
          {source && <Source />}
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}

ChartCountrySnapshot.propTypes = {
  intl: intlShape.isRequired,
  rights: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  dimensionScore: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  currentBenchmark: PropTypes.object,
  grammar: PropTypes.object,
  standard: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  year: PropTypes.number,
  maxValue: PropTypes.number,
  type: PropTypes.string,
  dimensionCode: PropTypes.string,
  activeCode: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onMetricClick: PropTypes.func,
  source: PropTypes.bool,
};

export default injectIntl(ChartCountrySnapshot);
