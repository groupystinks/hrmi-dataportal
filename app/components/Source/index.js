import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Hint from 'styled/Hint';

import messages from './messages';

const Styled = styled(Hint)`
  font-size: 12px;
  line-height: 16px;
  text-align: ${({ center }) => (center ? 'center' : 'left')};
  @media (min-width: ${({ theme }) => theme.breakpointsMin.medium}) {
    font-size: 14px;
    line-height: 20px;
  }
`;

function Source({ center = false }) {
  return (
    <Styled center={center}>
      <div>
        <FormattedMessage {...messages.source} />
      </div>
    </Styled>
  );
}

Source.propTypes = {
  intl: intlShape.isRequired,
  center: PropTypes.bool,
};

export default injectIntl(Source);
