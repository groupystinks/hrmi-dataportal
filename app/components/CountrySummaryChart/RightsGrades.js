import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text, ResponsiveContext } from 'grommet';
import { FormattedMessage } from 'react-intl';

import { COLUMNS } from 'containers/App/constants';

import Hint from 'styled/Hint';
import { isMinSize } from 'utils/responsive';
import { getESRGradeForScore } from 'utils/scores';
import rootMessages from 'messages';

import DimensionTitle from './DimensionTitle';
import RightsScoreItem from './RightsScoreItem';

const RightsScoresWrapperTable = styled.div`
  display: table;
  margin: -24px 0;
`;

const DimensionScoreWrapper = props => (
  <Box
    {...props}
    color="esrDark"
    pad={{ top: 'hair', bottom: 'xsmall' }}
    responsive={false}
    fill="horizontal"
  />
);

const BarWrap = props => <Box direction="row" {...props} />;

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

function RightsChart({ data, standard, benchmark, scoreWidth }) {
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
        <>
          <DimensionTitle dimensionKey={data.dimension} />
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
            <Hint>
              <Text size="xsmall">
                <strong>
                  {dataMultiple.data &&
                    `Grades for ${dataMultiple.data.length} Rights`}
                </strong>
              </Text>
            </Hint>
            <BarWrap>
              <Box
                style={{ position: 'relative' }}
                responsive={false}
                direction="row"
                fill="horizontal"
                pad={{ right: 'medium' }}
              >
                {dataMultiple.data &&
                  dataMultiple.data.map((right, index) => (
                    <DimensionScoreWrapper>
                      <Box
                        direction="column"
                        style={{
                          textAlign: 'center',
                          borderRight: `1px solid ${
                            index === dataMultiple.data.length - 1
                              ? 'transparent'
                              : 'lightGrey'
                          }`,
                        }}
                      >
                        <Text
                          weight="bold"
                          size={
                            isMinSize(size, 'medium') ? 'xxlarge' : 'xlarge'
                          }
                          color="esrDark"
                        >
                          {right.value && getESRGradeForScore(right.value)}
                          {!right.value && 'N/A'}
                        </Text>
                        <Text size="small">
                          <FormattedMessage
                            {...rootMessages['rights-short'][right.key]}
                          />
                        </Text>
                      </Box>
                    </DimensionScoreWrapper>
                  ))}
              </Box>
              <Box flex={{ shrink: 0 }} width={scoreWidth}>
                <Box direction="row" style={{ margin: '-24px 0 24px' }}>
                  <Text size="xsmall">
                    <Hint>
                      <strong>Grades</strong>
                      &nbsp;(Scores)
                    </Hint>
                  </Text>
                </Box>
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
                          grade: getESRGradeForScore(right.value),
                        }}
                      />
                    ))}
                </RightsScoresWrapperTable>
              </Box>
            </BarWrap>
          </Box>
        </>
      )}
    </ResponsiveContext.Consumer>
  );
}

RightsChart.propTypes = {
  benchmark: PropTypes.object,
  standard: PropTypes.string,
  scoreWidth: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default RightsChart;
