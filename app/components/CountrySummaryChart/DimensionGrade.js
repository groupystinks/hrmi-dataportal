import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, ResponsiveContext } from 'grommet';
import Hint from 'styled/Hint';

import { COLUMNS } from 'containers/App/constants';
import formatScoreMax from 'utils/format-score-max';
import { isMinSize } from 'utils/responsive';
import { getESRGradeForScore } from 'utils/scores';

import DimensionTitle from './DimensionTitle';

const DimensionScoreWrapper = props => (
  <Box {...props} color="esrDark" background="light-2" pad="small" />
);

const BarWrap = props => <Box direction="row" {...props} align="center" />;

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

function DimensionGrade({ data, benchmark, standard }) {
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
              <Box style={{ position: 'relative' }} responsive={false}>
                <DimensionScoreWrapper>
                  <Box direction="row">
                    <Text
                      weight="bold"
                      size={isMinSize(size, 'medium') ? 'large' : 'medium'}
                      color="esrDark"
                    >
                      {dim.value && getESRGradeForScore(dim.value)}
                      {!dim.value && 'N/A'}
                    </Text>
                    <Text
                      size={isMinSize(size, 'medium') ? 'large' : 'medium'}
                      color="esrDark"
                    >
                      &nbsp;
                      {dim.value && ` (${formatScoreMax(dim.value, maxValue)})`}
                    </Text>
                  </Box>
                </DimensionScoreWrapper>
                <Box direction="row">
                  <Hint>
                    <Text size="xsmall">
                      <strong>Grade</strong>
                      &nbsp;(Score)
                    </Text>
                  </Hint>
                </Box>
              </Box>
            </BarWrap>
          </Box>
        </>
      )}
    </ResponsiveContext.Consumer>
  );
}

DimensionGrade.propTypes = {
  benchmark: PropTypes.object,
  standard: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default DimensionGrade;
