/**
 *
 * Metric
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import { ResponsiveContext, Image as GImage, Paragraph } from 'grommet';
import { withTheme } from 'styled-components';

import { navigate, setAsideLayer } from 'containers/App/actions';
import {
  getCloseTargetMetric,
  getAsideLayer,
  getAsideLayerActiveCode,
} from 'containers/App/selectors';
import { PATHS, IMAGE_PATH, PAGES, RIGHTS } from 'containers/App/constants';
import ChartContainerMetric from 'containers/ChartContainerMetric';
import TabContainer from 'containers/TabContainer';
import AboutMetricContainer from 'containers/AboutMetricContainer';

import Breadcrumb from 'components/Breadcrumb';
import AsideBackground from 'components/AsideBackground';
import Aside from 'components/Aside';
import HINote from 'components/HINote';

import ContentWrap from 'styled/ContentWrap';
import MainColumn from 'styled/MainColumn';
import ContentContainer from 'styled/ContentContainer';
import ContentMaxWidth from 'styled/ContentMaxWidth';
import PageTitle from 'styled/PageTitle';
import ButtonTextIcon from 'styled/ButtonTextIcon';

import getMetricDetails from 'utils/metric-details';
import { isMinSize, isMaxSize } from 'utils/responsive';

import rootMessages from 'messages';
import messages from './messages';

export function PathMetric({
  match,
  intl,
  onMetricClick,
  nav,
  theme,
  onSetAsideLayer,
  asideLayer,
  activeCode,
}) {
  const metricCode = match.params.metric;
  const metric = getMetricDetails(metricCode);
  const metricTitle = intl.formatMessage(
    rootMessages[metric.metricType][metric.key],
  );
  let metricTitleShort;
  let dimensionCode = metricCode;

  const ancestors = [{ key: 'all' }];
  let imageSrc;

  if (metric.metricType === 'dimensions') {
    imageSrc = `${IMAGE_PATH}/dimension_${metricCode}.png`;
  }
  if (metric.metricType === 'rights') {
    metricTitleShort = intl.formatMessage(
      rootMessages[`${metric.metricType}-xshort`][metric.key],
    );
    const right = RIGHTS.find(r => r.key === metricCode);
    imageSrc = right.icon;
    ancestors.push({
      type: 'dimensions',
      key: metric.dimension,
    });
    if (metric.aggregate) {
      ancestors.push({
        type: 'rights-short',
        key: metric.aggregate,
      });
    }
    dimensionCode = metric.dimension;
  }
  if (metric.metricType === 'indicators') {
    imageSrc = `${IMAGE_PATH}/indicator_${metricCode}.png`;
    ancestors.push({
      type: 'dimensions',
      key: 'esr',
    });
    ancestors.push({
      type: 'rights-short',
      key: metric.right,
    });
    dimensionCode = 'esr';
  }
  const onCountryClick = code => {
    if (asideLayer && asideLayer.key === code) {
      onSetAsideLayer(false);
    } else {
      onSetAsideLayer({
        type: 'aboutCountry',
        background: `${dimensionCode}Active`,
        key: code,
        code,
      });
    }
  };
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <ContentWrap>
          <Helmet>
            <title>{metricTitle}</title>
            <meta name="description" content="Description of metric" />
          </Helmet>
          {metric.type === 'esr' && metric.metricType !== 'indicators' && (
            <HINote hasAside={isMinSize(size, 'large')} settingHint />
          )}
          <div style={{ position: 'relative' }}>
            {isMinSize(size, 'large') && <AsideBackground />}
            <ContentContainer direction="column" header>
              <ContentMaxWidth
                header
                height={
                  isMinSize(size, 'large')
                    ? `${theme.sizes.top.height}px`
                    : 'auto'
                }
                hasAside={isMinSize(size, 'large')}
              >
                <MainColumn hasAside={isMinSize(size, 'large')} header hasLinks>
                  <div>
                    <Breadcrumb
                      onItemClick={key => onMetricClick(key)}
                      breadcrumb
                      items={ancestors.map(ancestor => ({
                        key: ancestor.key,
                        label: intl.formatMessage(
                          ancestor.key === 'all'
                            ? rootMessages.labels.allMetrics
                            : rootMessages[ancestor.type][ancestor.key],
                        ),
                      }))}
                    />
                  </div>
                  <div>
                    <PageTitle>{metricTitle}</PageTitle>
                  </div>
                  {messages[metric.metricType][metricCode].header.a && (
                    <Paragraph
                      size={isMaxSize(size, 'sm') ? 'small' : 'medium'}
                    >
                      <FormattedMessage
                        {...messages[metric.metricType][metricCode].header.a}
                      />
                    </Paragraph>
                  )}
                  {messages[metric.metricType][metricCode].header.b && (
                    <Paragraph
                      size={isMaxSize(size, 'sm') ? 'small' : 'medium'}
                    >
                      <FormattedMessage
                        {...messages[metric.metricType][metricCode].header.b}
                      />
                    </Paragraph>
                  )}
                  {messages[metric.metricType][metricCode].link && (
                    <Paragraph
                      size={isMaxSize(size, 'sm') ? 'small' : 'medium'}
                    >
                      <ButtonTextIcon
                        label={intl.formatMessage(
                          messages[metric.metricType][metricCode].link,
                        )}
                        onClick={() =>
                          nav(`${PATHS.PAGE}/${PAGES.methodology.key}`)
                        }
                        size="small"
                        hasIcon
                      />
                    </Paragraph>
                  )}
                </MainColumn>
                {isMinSize(size, 'large') && (
                  <Aside image>
                    <GImage src={imageSrc} fit="cover" />
                  </Aside>
                )}
              </ContentMaxWidth>
            </ContentContainer>
          </div>
          <TabContainer
            size={size}
            tabs={[
              {
                key: 'ChartContainerMetric',
                title: metricTitle,
                titleMobile: metricTitleShort,
                content: props => (
                  <ChartContainerMetric
                    {...props}
                    metric={metric}
                    onCountryClick={onCountryClick}
                    activeCode={activeCode}
                    showHILabel={
                      metric.type === 'esr' &&
                      metric.metricType !== 'indicators'
                    }
                  />
                ),
              },
              {
                aside: true,
                key: 'about',
                title: intl.formatMessage(rootMessages.tabs.about),
                content: props => (
                  <AboutMetricContainer
                    {...props}
                    metricCode={metricCode}
                    ancestors={ancestors}
                    showFAQs
                    showRelated
                    showSources={
                      metric.type === 'esr' ||
                      metric.metricType === 'indicators'
                    }
                  />
                ),
              },
            ]}
          />
        </ContentWrap>
      )}
    </ResponsiveContext.Consumer>
  );
}

PathMetric.propTypes = {
  intl: intlShape.isRequired,
  onMetricClick: PropTypes.func,
  nav: PropTypes.func,
  match: PropTypes.object,
  theme: PropTypes.object,
  onSetAsideLayer: PropTypes.func,
  asideLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  activeCode: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  closeTarget: state => getCloseTargetMetric(state),
  asideLayer: state => getAsideLayer(state),
  activeCode: state => getAsideLayerActiveCode(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onSetAsideLayer: config => {
      dispatch(setAsideLayer(config));
    },
    onMetricClick: code =>
      dispatch(
        navigate(
          {
            pathname:
              code === 'all' ? `/${PATHS.METRICS}` : `/${PATHS.METRIC}/${code}`,
          },
          {
            trackEvent: {
              category: 'Data',
              action: 'Change metric (Metric, header links)',
              value: code,
            },
          },
        ),
      ),
    nav: location => {
      dispatch(
        navigate(location, {
          keepTab: true,
          trackEvent: {
            category: 'Content',
            action: 'Header: navigate',
            value: typeof location === 'object' ? location.pathname : location,
          },
        }),
      );
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(withTheme(PathMetric)));
