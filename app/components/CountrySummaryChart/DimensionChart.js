import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text, ResponsiveContext } from 'grommet';

import Bar from 'components/Bars/Bar';
import BarSteps from 'components/Bars/BarSteps';
import { COLUMNS } from 'containers/App/constants';
import AnnotateBetter from 'components/AnnotateBetterWorse';
import Hint from 'styled/Hint';
import formatScoreMax from 'utils/format-score-max';
import { isMinSize } from 'utils/responsive';
import { getESRGradeForScore } from 'utils/scores';

import DimensionTitle from './DimensionTitle';
import GradationItem from './GradationItem';
const DimensionScoreWrapper = props => <Box {...props} flex={{ shrink: 0 }} />;

const BarWrap = props => <Box direction="row" {...props} align="center" />;

const RightsScoresWrapperTable = styled.div`
  display: table;
  margin: -24px 0;
`;

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
  text-align: right;
  padding-right: 5px;
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

  // prettier-ignore
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
                        {dim.value &&
                          getESRGradeForScore(dim.value) === grade.grade && (
                          <Text weight="bold">{grade.grade}</Text>
                        )}
                        {!dim.value ||
                          getESRGradeForScore(dim.value) !== grade.grade && (
                            <Text size="xsmall">{grade.grade}</Text>
                          )}
                      </GradeMin>
                    ))}
                  </WrapAnnotateBetter>
                )}
              </Box>
              {!grades && (
                <DimensionScoreWrapper width={scoreWidth}>
                  <Text size="xsmall">
                    <Hint>
                      <strong>Score</strong>
                    </Hint>
                  </Text>
                  <Text
                    weight="bold"
                    size={isMinSize(size, 'medium') ? 'large' : 'medium'}
                    color={`${data.key}Dark`}
                  >
                    {dim.value && formatScoreMax(dim.value, maxValue)}
                    {!dim.value && 'N/A'}
                  </Text>
                </DimensionScoreWrapper>
              )}
              {grades && (
                <Box flex={{ shrink: 0 }} width={scoreWidth}>
                  <Box direction="row" style={{ margin: '-24px 0 24px' }}>
                    <Text size="xsmall">
                      <Hint>
                        <strong>Grade brackets</strong>
                      </Hint>
                    </Text>
                  </Box>
                  <RightsScoresWrapperTable>
                    {[...grades].reverse().map(grade => (
                      <GradationItem
                        key={grade.grade}
                        dimensionKey={data.dimension}
                        right={{
                          key: grade.grade,
                          value: grade.min,
                          grade: grade.grade,
                        }}
                      />
                    ))}
                  </RightsScoresWrapperTable>
                </Box>
              )}
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
