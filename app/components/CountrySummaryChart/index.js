/**
 *
 * CountrySummaryChart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Heading, Box, ResponsiveContext } from 'grommet';
import { isMinSize } from 'utils/responsive';

import rootMessages from 'messages';
// import messages from './messages';
import { BENCHMARKS } from 'containers/App/constants';
import ScaleToggle from 'containers/Settings/ScaleToggle';
import { getRightsScoresForDimension } from 'utils/scores';

import Source from 'components/Source';

import DimensionChart from './DimensionChart';
import RightsChart from './RightsChart';

const RightsType = styled(Box)`
  margin-bottom: 6px;
  position: relative;
`;
const ChartArea = props => (
  <Box
    direction="column"
    fill="horizontal"
    style={{ position: 'relative' }}
    {...props}
  />
);

// prettier-ignore
const StyledRightsTypeHeading = styled(Heading)`
  font-size: ${({ theme, level = 1 }) => theme.heading.level[level].small.size};
  line-height: ${({ theme, level = 1 }) => theme.heading.level[level].small.height};
  @media (min-width: ${({ theme }) => theme.breakpointsMin.large}) {
    font-size: ${({ theme, level = 1 }) => theme.heading.level[level].medium.size};
    line-height: ${({ theme, level = 1 }) => theme.heading.level[level].medium.height};
  }
`;
const RightsTypeHeading = props => (
  <StyledRightsTypeHeading
    responsive={false}
    level={4}
    margin={{ vertical: 'none' }}
    {...props}
  />
);

const BGScale = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.global.edgeSize.medium};
  right: ${({ theme }) => theme.global.edgeSize.large};
  margin-right: ${({ right }) => right};
  top: 0;
  bottom: 0;
`;

const BGScaleX = styled.div`
  background: rgba(0, 0, 0, 0.04);
  /* border-left: 1px solid rgba(0, 0, 0, 0.2); */
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: ${({ min }) => min}%;
`;

const BGScaleLabel = styled.span`
  position: absolute;
  bottom: 2px;
  font-weight: 600;
  font-size: 0.8em;
  left: 3px;
  opacity: 0.6;
`;
const BGScaleLabelTop = styled(BGScaleLabel)`
  bottom: auto;
  top: 2px;
`;
function CountrySummaryChart({
  dimensions,
  benchmark,
  scale,
  rights,
  standard,
  esrYear,
  cprYear,
}) {
  // const currentStandard = STANDARDS.find(s => s.key === standard);
  const currentBenchmark = BENCHMARKS.find(s => s.key === benchmark);

  // figure out rights scores
  const empowerRights =
    scale === 'r' && getRightsScoresForDimension(rights, 'empowerment');
  const physintRights =
    scale === 'r' && getRightsScoresForDimension(rights, 'physint');
  const esrRights = scale === 'r' && getRightsScoresForDimension(rights, 'esr');

  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Box
          direction="column"
          pad={{ bottom: 'large' }}
          margin={{ bottom: 'large' }}
          border="bottom"
        >
          <Box direction="row">
            <ChartArea>
              <RightsTypeHeading>
                <FormattedMessage {...rootMessages['rights-types'].cpr} />
                {` (${cprYear})`}
              </RightsTypeHeading>
              <RightsType>
                <BGScale right={isMinSize(size, 'medium') ? '200px' : '50px'}>
                  <BGScaleX min="0">
                    <BGScaleLabel>Very Poor</BGScaleLabel>
                  </BGScaleX>
                  <BGScaleX min="50">
                    <BGScaleLabel>Poor</BGScaleLabel>
                  </BGScaleX>
                  <BGScaleX min="63.33">
                    <BGScaleLabel>Fair</BGScaleLabel>
                  </BGScaleX>
                  <BGScaleX min="76.66">
                    <BGScaleLabel>Good</BGScaleLabel>
                  </BGScaleX>
                  <BGScaleX min="90">
                    <BGScaleLabel>Excellent</BGScaleLabel>
                  </BGScaleX>
                </BGScale>
                {scale === 'd' && (
                  <DimensionChart
                    data={dimensions && dimensions.empowerment}
                    scoreWidth={isMinSize(size, 'medium') ? '200px' : '50px'}
                  />
                )}
                {scale === 'd' && (
                  <DimensionChart
                    data={dimensions && dimensions.physint}
                    scoreWidth={isMinSize(size, 'medium') ? '200px' : '50px'}
                  />
                )}
                {scale === 'r' && (
                  <RightsChart
                    data={{
                      rights: empowerRights,
                      type: 'cpr',
                      dimension: 'empowerment',
                    }}
                    scoreWidth={isMinSize(size, 'medium') ? '200px' : '50px'}
                  />
                )}
                {scale === 'r' && (
                  <RightsChart
                    data={{
                      rights: physintRights,
                      type: 'cpr',
                      dimension: 'physint',
                    }}
                    scoreWidth={isMinSize(size, 'medium') ? '200px' : '50px'}
                  />
                )}
              </RightsType>
              <RightsType pad={{ top: 'medium' }} margin={{ top: 'medium' }}>
                <BGScale right={isMinSize(size, 'medium') ? '200px' : '50px'}>
                  <BGScaleX min="0">
                    <BGScaleLabelTop>Very Poor</BGScaleLabelTop>
                  </BGScaleX>
                  <BGScaleX min="75">
                    <BGScaleLabelTop>Poor</BGScaleLabelTop>
                  </BGScaleX>
                  <BGScaleX min="85">
                    <BGScaleLabelTop>Fair</BGScaleLabelTop>
                  </BGScaleX>
                  <BGScaleX min="95">
                    <BGScaleLabelTop>Good</BGScaleLabelTop>
                  </BGScaleX>
                </BGScale>
                {scale === 'd' && (
                  <DimensionChart
                    data={dimensions && dimensions.esr}
                    benchmark={currentBenchmark}
                    standard={standard}
                    scoreWidth={isMinSize(size, 'medium') ? '200px' : '50px'}
                  />
                )}
                {scale === 'r' && (
                  <RightsChart
                    data={{
                      rights: esrRights,
                      type: 'esr',
                      dimension: 'esr',
                    }}
                    benchmark={currentBenchmark}
                    standard={standard}
                    scoreWidth={isMinSize(size, 'medium') ? '200px' : '50px'}
                  />
                )}
              </RightsType>
              <RightsTypeHeading>
                <FormattedMessage {...rootMessages['rights-types'].esr} />
                {` (${esrYear})`}
              </RightsTypeHeading>
              <Box pad={{ top: 'xsmall' }}>
                <ScaleToggle />
              </Box>
            </ChartArea>
          </Box>
          <Source />
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}

CountrySummaryChart.propTypes = {
  rights: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  dimensions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  country: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  scale: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  benchmark: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  standard: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  esrYear: PropTypes.number,
  cprYear: PropTypes.number,
};

export default CountrySummaryChart;
