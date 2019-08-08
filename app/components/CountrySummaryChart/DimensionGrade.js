import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, ResponsiveContext } from 'grommet';
import Hint from 'styled/Hint';
import formatScoreMax from 'utils/format-score-max';

import { COLUMNS } from 'containers/App/constants';
import { isMinSize } from 'utils/responsive';
import { getESRGradeForScore } from 'utils/scores';

import DimensionTitle from './DimensionTitle';

const DimensionScoreWrapper = props => (
  <Box
    {...props}
    color="esrDark"
    pad={{ top: 'hair', bottom: 'xsmall' }}
    fill="horizontal"
    responsive={false}
  />
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

function DimensionGrade({ data, benchmark, standard, scoreWidth }) {
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
            <Hint>
              <Text size="xsmall">
                <strong>Grade for category</strong>
              </Text>
            </Hint>
            <BarWrap>
              <Box
                style={{ position: 'relative' }}
                responsive={false}
                fill="horizontal"
                pad={{ right: 'large' }}
                direction="row"
              >
                <DimensionScoreWrapper>
                  <Box
                    direction="column"
                    style={{
                      textAlign: 'center',
                      width: '20%',
                    }}
                  >
                    <Text
                      weight="bold"
                      size={isMinSize(size, 'medium') ? 'xxlarge' : 'xlarge'}
                      color="esrDark"
                    >
                      {dim.value && getESRGradeForScore(dim.value)}
                      {!dim.value && 'N/A'}
                    </Text>
                    <Text size="small">&nbsp;</Text>
                  </Box>
                </DimensionScoreWrapper>
              </Box>
              <Box
                flex={{ shrink: 0 }}
                width={scoreWidth}
                style={{ marginTop: '-66px' }}
              >
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
  scoreWidth: PropTypes.string,
};

export default DimensionGrade;
