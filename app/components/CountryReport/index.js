/**
 *
 * CountryReport
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import CountryNarrative from 'components/CountryNarrative';
import LoadingIndicator from 'components/LoadingIndicator';
import MainColumn from 'styled/MainColumn';

function CountryReport({
  dimensions,
  rights,
  benchmark,
  standard,
  indicators,
  country,
  onMetricClick,
  atRiskData,
  onAtRiskClick,
  reference,
  year,
  type,
  dataReady,
  hasAside,
}) {
  return (
    <MainColumn hasAside={hasAside}>
      {!dataReady && <LoadingIndicator />}
      {dataReady && (
        <CountryNarrative
          dimensions={dimensions}
          rights={rights}
          indicators={indicators}
          country={country}
          benchmark={benchmark}
          standard={standard}
          onMetricClick={onMetricClick}
          atRiskData={atRiskData}
          onAtRiskClick={onAtRiskClick}
          reference={reference}
          year={year}
          type={type}
        />
      )}
    </MainColumn>
  );
}

CountryReport.propTypes = {
  type: PropTypes.string,
  onMetricClick: PropTypes.func,
  onAtRiskClick: PropTypes.func,
  hasAside: PropTypes.bool,
  reference: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  atRiskData: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  indicators: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  rights: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  dimensions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  country: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  standard: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  benchmark: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  year: PropTypes.number,
  dataReady: PropTypes.bool,
};

export default CountryReport;
