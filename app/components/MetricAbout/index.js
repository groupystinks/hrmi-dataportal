/**
 *
 * MetricAbout
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Heading, Box } from 'grommet';
import styled from 'styled-components';
import { STANDARDS } from 'containers/App/constants';
import MetricSources from 'containers/MetricSources';
import ReadMore from 'components/ReadMore';
import UL from 'styled/UL';
import rootMessages from 'messages';
import messages from './messages';

const StyledUL = styled(UL)`
  margin-top: 0;
`;
function MetricAbout({
  metric,
  metricInfo,
  standard,
  intl,
  fullInfo,
  title,
  aside,
  onSelectMetric,
}) {
  const { metricType } = metric;
  return (
    <Box
      direction="column"
      pad={{
        horizontal: aside ? 'medium' : 'small',
        bottom: 'medium',
        top: 'small',
      }}
    >
      <Heading
        responsive={false}
        level={aside ? 5 : 3}
        margin={{ vertical: 'xsmall' }}
      >
        {title}
        {!title && <FormattedMessage {...messages.title[metricType]} />}
      </Heading>
      {rootMessages[`${metricType}-about`] && fullInfo && (
        <div>
          <FormattedMessage
            {...rootMessages[`${metricType}-about`][metric.key]}
          />
        </div>
      )}
      {rootMessages[`${metricType}-about`] && !fullInfo && (
        <ReadMore
          message={intl.formatMessage(
            rootMessages[`${metricType}-about`][metric.key],
          )}
        />
      )}
      {metricType !== 'indicators' && !aside && (
        <Box>
          <MetricSources
            metric={metric}
            indicatorInfo={metricInfo}
            onSelectMetric={onSelectMetric}
          />
        </Box>
      )}
      {metricType === 'indicators' && metricInfo && (
        <Box margin={{ top: 'medium' }}>
          <Heading responsive={false} level={5} margin={{ vertical: 'xsmall' }}>
            <FormattedMessage {...messages.titleStandards} />
          </Heading>
          <Box>
            {metricInfo.standard === 'Both' && (
              <StyledUL>
                {STANDARDS.map(s => (
                  <li key={s.key}>
                    <FormattedMessage
                      {...rootMessages.settings.standard[s.key]}
                    />
                  </li>
                ))}
              </StyledUL>
            )}
            {metricInfo.standard !== 'Both' && standard && (
              <StyledUL>
                <li>
                  <FormattedMessage
                    {...rootMessages.settings.standard[standard.key]}
                  />
                </li>
              </StyledUL>
            )}
            <MetricSources
              metric={metric}
              indicatorInfo={metricInfo}
              onSelectMetric={onSelectMetric}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

MetricAbout.propTypes = {
  metric: PropTypes.object,
  metricInfo: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  fullInfo: PropTypes.bool,
  aside: PropTypes.bool,
  standard: PropTypes.object,
  title: PropTypes.string,
  intl: intlShape.isRequired,
  onSelectMetric: PropTypes.func,
};

export default injectIntl(MetricAbout);
