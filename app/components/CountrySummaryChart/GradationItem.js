import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text } from 'grommet';

const RightsScoresWrapperRow = styled.div`
  display: table-row;
  line-height: 12px;
  border-bottom-color: ${({ theme }) => theme.global.colors['light-5']};
  &:last-child {
    border-bottom-color: transparent;
  }
`;
const RightsScoresWrapperCellScore = styled.div`
  width: ${props => (props.wide ? 65 : 50)}px;
  display: table-cell;
  border-bottom: 1px solid;
  border-bottom-color: inherit;
  text-align: center;
  vertical-align: middle;
  padding: 3px 0;
  @media (min-width: ${({ theme }) => theme.breakpointsMin.medium}) {
    text-align: left;
  }
`;
const RightsScoresWrapperCellLabel = styled.div`
  display: none;
  @media (min-width: ${({ theme }) => theme.breakpointsMin.medium}) {
    vertical-align: middle;
    border-bottom: 1px solid;
    padding: 3px 0;
    border-bottom-color: inherit;
    display: table-cell;
  }
`;
const RightScoreText = props => <Text weight="bold" size="small" {...props} />;
const RightLabelText = styled.span`
  font-size: 12px;
`;

function RightsScoresItem({ dimensionKey, right }) {
  return (
    <RightsScoresWrapperRow>
      <RightsScoresWrapperCellScore wide={!!right.grade}>
        <RightScoreText color={`${dimensionKey}Dark`}>
          {right.grade}
        </RightScoreText>
      </RightsScoresWrapperCellScore>
      <RightsScoresWrapperCellLabel>
        <RightLabelText color={`${dimensionKey}Dark`}>
          {`${right.value !== 100 ? '> ' : ''}${right.value}%`}
        </RightLabelText>
      </RightsScoresWrapperCellLabel>
    </RightsScoresWrapperRow>
  );
}

RightsScoresItem.propTypes = {
  dimensionKey: PropTypes.string,
  right: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default RightsScoresItem;
