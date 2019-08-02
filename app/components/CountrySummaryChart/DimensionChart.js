import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text, ResponsiveContext } from 'grommet';

import Bar from 'components/Bars/Bar';
import BarSteps from 'components/Bars/BarSteps';
import { COLUMNS } from 'containers/App/constants';
import AnnotateBetter from 'components/AnnotateBetterWorse';
import formatScoreMax from 'utils/format-score-max';
import { isMinSize } from 'utils/responsive';

import DimensionTitle from './DimensionTitle';

const DimensionScoreWrapper = props => <Box {...props} flex={{ shrink: 0 }} />;
const BarWrap = props => <Box direction="row" {...props} align="center" />;

const WrapAnnotateBetter = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.global.edgeSize.medium};
  right: ${({ theme }) => theme.global.edgeSize.large};
  top: 100%;
  margin-top: -4px;
`;

const GradeMin = styled.div`
  position: absolute;
  top: 0;
`;

const getDimensionRefs = (score, benchmark) => {
  if (benchmark && benchmark.key === 'adjusted') {
    return [{ value: 100, style: 'dotted', key: 'adjusted' }];
  }
  if (benchmark && benchmark.key === 'best') {
    return [{ value: 100, style: 'solid', key: 'best' }];
  }
  return false;
};

const getDimensionValue = (data, benchmark) => {
  if (data.type === 'cpr' && data.score) {
    return parseFloat(data.score[COLUMNS.CPR.MEAN]);
  }
  if (data.type === 'esr' && data.score) {
    const col = (benchmark && benchmark.column) || COLUMNS.ESR.SCORE_ADJUSTED;
    return parseFloat(data.score[col]);
  }
  return false;
};

function DimensionChart({ data, benchmark, standard, scoreWidth, grades }) {
  if (!data) return null;
  const maxValue = data.type === 'cpr' ? 10 : 100;
  const dim = {
    ...data,
    color: data.key,
    value: getDimensionValue(data, benchmark),
    refValues: data.type === 'esr' && getDimensionRefs(data.score, benchmark),
    maxValue,
    stripes: data.type === 'esr' && standard === 'hi',
    unit: data.type === 'esr' ? '%' : '',
  };
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <>
          <DimensionTitle dimensionKey={data.key} />
          <Box
            pad={{ vertical: '24px' }}
            style={{
              marginTop:
                isMinSize(size, 'medium') || data.type !== 'esr'
                  ? '-24px'
                  : '-6px',
            }}
            responsive={false}
          >
            <BarWrap>
              <Box
                pad={{ vertical: 'xsmall', left: 'medium', right: 'large' }}
                fill="horizontal"
                style={{ position: 'relative' }}
                responsive={false}
              >
                {!grades && (
                  <Bar
                    data={dim}
                    showLabels
                    annotateBenchmarkAbove
                    showBenchmark
                  />
                )}
                {grades && <BarSteps data={dim} grades={grades} />}
                {!grades && (
                  <WrapAnnotateBetter>
                    <AnnotateBetter absolute />
                  </WrapAnnotateBetter>
                )}
                {grades && (
                  <WrapAnnotateBetter>
                    {grades.map((grade, index) => (
                      <GradeMin
                        style={{
                          width: `${100 / grades.length}%`,
                          left: `${(index * 100) / grades.length}%`,
                        }}
                      >
                        <Text size="xsmall">{`> ${grade.min}%`}</Text>
                      </GradeMin>
                    ))}
                  </WrapAnnotateBetter>
                )}
              </Box>
              <DimensionScoreWrapper width={scoreWidth}>
                <Text
                  weight="bold"
                  size={isMinSize(size, 'medium') ? 'large' : 'medium'}
                  color={`${data.key}Dark`}
                >
                  {dim.value && formatScoreMax(dim.value, maxValue)}
                  {!dim.value && 'N/A'}
                </Text>
              </DimensionScoreWrapper>
            </BarWrap>
          </Box>
        </>
      )}
    </ResponsiveContext.Consumer>
  );
}

DimensionChart.propTypes = {
  grades: PropTypes.array,
  benchmark: PropTypes.object,
  standard: PropTypes.string,
  scoreWidth: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default DimensionChart;
