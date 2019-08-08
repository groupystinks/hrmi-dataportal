import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text, ResponsiveContext } from 'grommet';
import { COLUMNS } from 'containers/App/constants';

import BarMultiple from 'components/Bars/BarMultiple';
import AnnotateBetter from 'components/AnnotateBetterWorse';
import Hint from 'styled/Hint';
import { isMinSize } from 'utils/responsive';
import DimensionTitle from './DimensionTitle';
import RightsScoreItem from './RightsScoreItem';
import GradationItem from './GradationItem';

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

const getDimensionRefs = (score, standard, benchmark) => {
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

function RightsChart({ data, standard, benchmark, scoreWidth, grades }) {
  if (!data) return null;
  const dataMultiple = {
    color: data.dimension,
    stripes: data.type === 'esr' && standard === 'hi',
    unit: data.type === 'esr' ? '%' : '',
    maxValue: data.type === 'cpr' ? 10 : 100,
    benchmark: benchmark && benchmark.key,
    data:
      data.rights &&
      data.rights.map(right => ({
        key: right.key,
        value: getDimensionValue(right, benchmark),
        refValues:
          right.type === 'esr' &&
          getDimensionRefs(right.score, standard, benchmark),
      })),
  };
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Box>
          <DimensionTitle dimensionKey={data.dimension} />
          <Box
            direction="row"
            align="center"
            style={{
              marginTop:
                isMinSize(size, 'medium') || data.type !== 'esr'
                  ? '-24px'
                  : '-6px',
            }}
          >
            <Box
              fill="horizontal"
              pad={{ vertical: '24px' }}
              responsive={false}
            >
              <Box
                pad={{ vertical: 'xsmall', left: 'medium', right: 'large' }}
                fill="horizontal"
                style={{ position: 'relative' }}
                responsive={false}
              >
                <BarMultiple
                  dataMultiple={dataMultiple}
                  grades={grades}
                  showLabels
                  totalHeight={36}
                  annotateBenchmarkAbove={data.type === 'esr'}
                />
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
                        <Text size="xsmall">{grade.grade}</Text>
                      </GradeMin>
                    ))}
                  </WrapAnnotateBetter>
                )}
              </Box>
            </Box>
            {!grades && (
              <Box flex={{ shrink: 0 }} width={scoreWidth}>
                <Text size="xsmall" style={{ margin: '-24px 0 24px' }}>
                  <Hint>
                    <strong>Scores</strong>
                  </Hint>
                </Text>
                <RightsScoresWrapperTable>
                  {dataMultiple.data &&
                    dataMultiple.data.map(right => (
                      <RightsScoreItem
                        key={right.key}
                        dimensionKey={data.dimension}
                        maxValue={dataMultiple.maxValue}
                        right={{
                          key: right.key,
                          value: right.value,
                        }}
                      />
                    ))}
                </RightsScoresWrapperTable>
              </Box>
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
          </Box>
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}

RightsChart.propTypes = {
  benchmark: PropTypes.object,
  grades: PropTypes.array,
  standard: PropTypes.string,
  scoreWidth: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default RightsChart;
