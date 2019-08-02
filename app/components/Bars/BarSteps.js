/**
 *
 * Bar
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { getNoDataMessage, getIncompleteDataActionMessage } from 'utils/scores';
import NoDataHint from 'components/NoDataHint';

import Wrapper from './styled/BarWrapper';

const BarWrapper = styled.div``;

const BarReference = styled.div`
  position: relative;
  display: block;
  height: ${props => props.height}px;
  width: 100%;
  background-color: ${props =>
    props.noData ? 'transparent' : props.theme.global.colors['light-2']};
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: transparent;
`;

const BarNoValue = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: ${props => props.height}px;
  width: 100%;
  border: 1px solid;
  border-color: ${props => props.theme.global.colors['light-4']};
`;

// prettier-ignore
const BarStep = styled.div`
  position: absolute;
  left: 0;
  top: -1px;
  height: ${props => props.height}px;
  background-color: ${props =>
    !props.on || props.stripes ? 'transparent' : props.theme.global.colors[props.color]};
  opacity: ${props => props.active ? 0.8 : 1};
  border-right: 2px solid white;
  ${props =>
    props.on && props.stripes &&
    css`
      background-image: linear-gradient(
        135deg,
        ${props.theme.global.colors[props.color]} 30%,
        ${props.theme.global.colors[`${props.color}Trans`]} 30%,
        ${props.theme.global.colors[`${props.color}Trans`]} 50%,
        ${props.theme.global.colors[props.color]} 50%,
        ${props.theme.global.colors[props.color]} 80%,
        ${props.theme.global.colors[`${props.color}Trans`]} 80%,
        ${props.theme.global.colors[`${props.color}Trans`]} 100%
      );
      background-size: 5px 5px;
      background-repeat: repeat;
    `}
`;

// level:
const HEIGHT = [50, 36, 20, 12];

function BarSteps({
  data,
  level = 1,
  showIncompleteAction = true,
  height,
  scoreOnHover = false,
  grades,
}) {
  const [hover, setHover] = useState(false);
  const [touched, setTouched] = useState(false);
  const { color, value, stripes = false } = data;
  const hasValue = !!value || value === 0;
  const h = height || HEIGHT[level];

  // prettier-ignore
  return (
    <Wrapper
      responsive={false}
    >
      <BarWrapper
        onTouchStart={() => {
          if (scoreOnHover) setTouched(true);
          setTimeout(() => setTouched(false), 1000);
          if (scoreOnHover) setHover(!hover);
          setTimeout(() => setHover(false), 5000);
        }}
        onClick={evt => {
          if (touched) {
            if (evt) evt.preventDefault();
            if (evt) evt.stopPropagation();
          }
        }}
        onMouseEnter={() => scoreOnHover && setHover(true) }
        onMouseLeave={() => setHover(false)}
      >
        <BarReference height={h} noData={!hasValue}>
          {!hasValue && <BarNoValue height={h} color={color} />}
          {hasValue && grades.map((grade, index) => (
            <BarStep
              height={h}
              on={value >= grade.min}
              color={color}
              style={{
                width: `${100 / grades.length}%`,
                left: `${(index * 100) / grades.length}%`,
              }}
              stripes={stripes}
            />
          ))}
          {!hasValue && data && level < 3 && (
            <NoDataHint
              hints={[
                getNoDataMessage(data),
                showIncompleteAction
                  ? getIncompleteDataActionMessage(data)
                  : null,
              ]}
            />
          )}
        </BarReference>
      </BarWrapper>
    </Wrapper>
  );
}

BarSteps.propTypes = {
  data: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  grades: PropTypes.array,
  height: PropTypes.number,
  level: PropTypes.number,
  showIncompleteAction: PropTypes.bool,
  scoreOnHover: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default BarSteps;
