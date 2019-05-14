/**
 * The global and router state selectors
 */

import { createSelector } from 'reselect';

import { DEFAULT_LOCALE, appLocales } from 'i18n';
import isInteger from 'utils/is-integer';
import quasiEquals from 'utils/quasi-equals';

import { initialState } from './reducer';
import {
  SCALES,
  STANDARDS,
  BENCHMARKS,
  REGIONS,
  COUNTRY_SORTS,
  INCOME_GROUPS,
  DIMENSIONS,
  RIGHTS,
  INDICATORS,
  PEOPLE_GROUPS,
  INDICATOR_LOOKBACK,
} from './constants';

// router sub-state
const getRouter = state => state.router;

export const getRouterLocation = createSelector(
  getRouter,
  routerState => routerState.location,
);

export const getRouterSearchParams = createSelector(
  getRouterLocation,
  location => location && new URLSearchParams(location.search),
);
export const getRouterPath = createSelector(
  getRouterLocation,
  location => location && location.pathname,
);
/**
 * Get the language locale
 */
export const getLocale = createSelector(
  getRouterPath,
  path => {
    if (path) {
      const splitPath = path.split('/');
      return splitPath.length > 1 && appLocales.indexOf(splitPath[1]) >= 0
        ? splitPath[1]
        : DEFAULT_LOCALE;
    }
    return DEFAULT_LOCALE;
  },
);

export const getRouterRoute = createSelector(
  getRouterPath,
  path => {
    if (path) {
      const splitPath = path.split('/');
      // should result in ["", "en", "page", "about"]
      return splitPath.length > 2 ? splitPath[2] : '';
    }
    return '';
  },
);
export const getRouterMatch = createSelector(
  getRouterPath,
  path => {
    if (path) {
      const splitPath = path.split('/');
      // should result in ["", "en", "page", "about"]
      return splitPath.length > 3 ? splitPath[3] : '';
    }
    return '';
  },
);

export const getScaleSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('scale') &&
    SCALES.map(s => s.key).indexOf(search.get('scale')) > -1
      ? search.get('scale')
      : SCALES[0].key,
);
export const getStandardSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('as') && STANDARDS.map(s => s.key).indexOf(search.get('as')) > -1
      ? search.get('as')
      : STANDARDS[0].key,
);
export const getBenchmarkSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('pb') &&
    BENCHMARKS.map(s => s.key).indexOf(search.get('pb')) > -1
      ? search.get('pb')
      : BENCHMARKS[0].key,
);
export const getYearESRSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('yesr') && isInteger(search.get('yesr'))
      ? search.get('yesr')
      : false,
);
export const getYearCPRSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('ycpr') && isInteger(search.get('ycpr'))
      ? search.get('ycpr')
      : false,
);
export const getRegionSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('region') && REGIONS.indexOf(search.get('region')) > -1
      ? search.get('region')
      : false,
);
export const getIncomeSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('income') &&
    INCOME_GROUPS.map(s => s.key).indexOf(search.get('income')) > -1
      ? search.get('income')
      : false,
);
export const getGroupSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('group') &&
    PEOPLE_GROUPS.map(s => s.key).indexOf(search.get('group')) > -1
      ? search.get('group')
      : PEOPLE_GROUPS[0].key,
);
export const getSortSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('sort') && COUNTRY_SORTS.indexOf(search.get('sort')) > -1
      ? search.get('sort')
      : COUNTRY_SORTS[0],
);
export const getSortOrderSearch = createSelector(
  getRouterSearchParams,
  search =>
    search.has('dir') && ['asc', 'desc'].indexOf(search.get('dir')) > -1
      ? search.get('dir')
      : 'asc',
);

// global sub-state
const getGlobal = state => state.global || initialState;

export const getCloseTarget = createSelector(
  getGlobal,
  global => global.closeTarget,
);

const getData = createSelector(
  getGlobal,
  global => global.data,
);

const getDataRequested = createSelector(
  getGlobal,
  global => global.dataRequested,
);

export const getDataRequestedByKey = createSelector(
  (state, key) => key,
  getDataRequested,
  (key, requested) => requested[key],
);

const getContent = createSelector(
  getGlobal,
  global => global.content,
);

const getContentRequested = createSelector(
  getGlobal,
  global => global.contentRequested,
);

export const getContentRequestedByKey = createSelector(
  (state, key) => key,
  getContentRequested,
  (key, requested) => requested[key],
);
export const getContentByKey = createSelector(
  (state, key) => key,
  getContent,
  (key, content) => content[key],
);

export const getCountries = createSelector(
  getData,
  data => data.countries,
);
export const getCountry = createSelector(
  (store, code) => code,
  getCountries,
  (code, countries) =>
    countries && countries.find(c => c.country_code === code),
);
export const getESRScores = createSelector(
  getData,
  data => data.esrScores,
);
export const getCPRScores = createSelector(
  getData,
  data => data.cprScores,
);
export const getAuxIndicators = createSelector(
  getData,
  data => data.auxIndicators,
);
export const getESRIndicators = createSelector(
  getData,
  data => data.esrIndicators,
);
export const getESRIndicatorScores = createSelector(
  getData,
  data => data.esrIndicatorScores,
);
export const getAtRiskData = createSelector(
  getData,
  data => data.atRisk,
);

const sortByNumber = (data, column, asc = true) => {
  const reverse = asc ? 1 : -1;
  return data.sort(
    (a, b) =>
      reverse * (parseInt(a[column], 10) < parseInt(b[column], 10) ? 1 : -1),
  );
};
const calcMaxYear = scores =>
  scores && scores.length > 0 && sortByNumber(scores, 'year')[0].year;
const calcMinYear = scores =>
  scores && scores.length > 0 && sortByNumber(scores, 'year', false)[0].year;

export const getMaxYearESR = createSelector(
  getESRScores,
  scores => calcMaxYear(scores),
);
export const getMinYearESR = createSelector(
  getESRScores,
  scores => calcMinYear(scores),
);
export const getMaxYearCPR = createSelector(
  getCPRScores,
  scores => calcMaxYear(scores),
);
export const getMinYearCPR = createSelector(
  getCPRScores,
  scores => calcMinYear(scores),
);

export const getCountriesFiltered = createSelector(
  getCountries,
  getRegionSearch,
  getIncomeSearch,
  (countries, region, income) =>
    countries &&
    countries
      .filter(c => !region || c.region_code === region)
      .filter(
        c =>
          !income ||
          (INCOME_GROUPS.find(i => i.key === income) &&
            quasiEquals(
              c.high_income_country,
              INCOME_GROUPS.find(i => i.key === income).value,
            )),
      ),
);

const getESRYear = createSelector(
  getYearESRSearch,
  getMaxYearESR,
  (searchYear, maxYear) => parseInt(searchYear || maxYear, 10),
);
const getCPRYear = createSelector(
  getYearCPRSearch,
  getMaxYearCPR,
  (searchYear, maxYear) => parseInt(searchYear || maxYear, 10),
);

export const getESRIndicatorsForStandard = createSelector(
  getESRIndicators,
  getStandardSearch,
  (indicators, standard) =>
    indicators &&
    indicators.filter(
      i =>
        i.standard === 'Both' ||
        i.standard === STANDARDS.find(as => as.key === standard).code,
    ),
);

// single metric
// single dimension, multiple countries, single year
export const getESRDimensionScores = createSelector(
  (state, metric) => metric,
  getESRScores,
  getCountriesFiltered,
  getRegionSearch,
  getIncomeSearch,
  getStandardSearch,
  getESRYear,
  (metric, scores, countries, region, income, standard, year) =>
    scores &&
    countries &&
    scores.filter(
      s =>
        STANDARDS.find(as => as.key === standard) &&
        DIMENSIONS.find(d => d.key === 'esr') &&
        s.standard === STANDARDS.find(as => as.key === standard).code &&
        s.metric_code === DIMENSIONS.find(d => d.key === 'esr').code &&
        quasiEquals(s.year, year) &&
        (!(region || income) ||
          countries.map(c => c.country_code).indexOf(s.country_code) > -1),
    ),
);

export const getCPRDimensionScores = createSelector(
  (state, metric) => metric,
  getCPRScores,
  getCountriesFiltered,
  getRegionSearch,
  getIncomeSearch,
  getCPRYear,
  (metric, scores, countries, region, income, year) =>
    scores &&
    countries &&
    scores.filter(
      s =>
        !!metric && // make sure a metric is set
        DIMENSIONS.find(d => d.key === metric) &&
        s.metric_code === DIMENSIONS.find(d => d.key === metric).code &&
        quasiEquals(s.year, year) &&
        (!(region || income) ||
          countries.map(c => c.country_code).indexOf(s.country_code) > -1),
    ),
);

// single right, multiple countries, single year
export const getESRRightScores = createSelector(
  (state, metric) => metric,
  getESRScores,
  getCountriesFiltered,
  getRegionSearch,
  getIncomeSearch,
  getStandardSearch,
  getGroupSearch,
  getESRYear,
  (metric, scores, countries, region, income, standard, group, year) =>
    scores &&
    countries &&
    scores.filter(
      s =>
        !!metric &&
        RIGHTS.find(d => d.key === metric) &&
        s.group === PEOPLE_GROUPS.find(g => g.key === group).code &&
        s.standard === STANDARDS.find(as => as.key === standard).code &&
        s.metric_code === RIGHTS.find(d => d.key === metric).code &&
        quasiEquals(s.year, year) &&
        (!(region || income) ||
          countries.map(c => c.country_code).indexOf(s.country_code) > -1),
    ),
);

// single right, multiple countries, single year
export const getCPRRightScores = createSelector(
  (state, metric) => metric,
  getCPRScores,
  getCountriesFiltered,
  getRegionSearch,
  getIncomeSearch,
  getCPRYear,
  (metric, scores, countries, region, income, year) =>
    scores &&
    countries &&
    scores.filter(
      s =>
        !!metric && // make sure a metric is set
        RIGHTS.find(d => d.key === metric) &&
        s.metric_code === RIGHTS.find(d => d.key === metric).code &&
        quasiEquals(s.year, year) &&
        (!(region || income) ||
          countries.map(c => c.country_code).indexOf(s.country_code) > -1),
    ),
);
// single indicator, multiple countries, single year
export const getIndicatorScores = createSelector(
  (state, metric) => metric,
  getESRIndicatorScores,
  getCountriesFiltered,
  getRegionSearch,
  getIncomeSearch,
  getGroupSearch,
  getESRYear,
  (metric, scores, countries, region, income, group, year) => {
    if (scores && countries) {
      if (metric && INDICATORS.find(d => d.key === metric)) {
        // first filter by group, metric, countries
        const filtered = scores.filter(
          s =>
            s.group === PEOPLE_GROUPS.find(g => g.key === group).code &&
            s.metric_code === INDICATORS.find(d => d.key === metric).code &&
            (!(region || income) ||
              countries.map(c => c.country_code).indexOf(s.country_code) > -1),
        );
        // then get the most recent year for each country
        // figure out most recent data by country
        const countryYears = filtered.reduce((memo, s) => {
          const result = memo;
          const country = s.country_code;
          if (
            typeof result[country] === 'undefined' ||
            (parseInt(s.year, 10) > result[country] &&
              parseInt(s.year, 10) <= year)
          ) {
            result[country] = parseInt(s.year, 10);
          }
          return result;
        }, {});
        // finally filter by year or most recent year
        const filteredYear = filtered.filter(
          s =>
            quasiEquals(s.year, year) ||
            quasiEquals(s.year, countryYears[s.country_code]),
        );
        return filteredYear;
      }
      return [];
    }
    return false;
  },
);

// single country
// single country, all dimensions, single year
export const getDimensionScoresForCountry = createSelector(
  (state, country) => country,
  getESRScores,
  getCPRScores,
  getESRYear,
  getCPRYear,
  (country, esrScores, cprScores, esrYear, cprYear) =>
    country &&
    esrScores &&
    cprScores && {
      esr: esrScores.filter(
        s =>
          s.country_code === country &&
          // quasiEquals(s.year, esrYear) &&
          s.metric_code === DIMENSIONS.find(d => d.key === 'esr').code,
      ),
      cpr: cprScores.filter(
        s =>
          s.country_code === country &&
          quasiEquals(s.year, cprYear) &&
          DIMENSIONS.filter(d => d.type === 'cpr')
            .map(d => d.code)
            .indexOf(s.metric_code) > -1,
      ),
    },
);

// single country, all rights, single year
export const getRightScoresForCountry = createSelector(
  (state, country) => country,
  getESRScores,
  getCPRScores,
  getGroupSearch,
  getESRYear,
  getCPRYear,
  (country, esrScores, cprScores, group, esrYear, cprYear) =>
    country &&
    esrScores &&
    cprScores && {
      esr: esrScores.filter(
        s =>
          s.country_code === country &&
          quasiEquals(s.year, esrYear) &&
          s.group === PEOPLE_GROUPS.find(g => g.key === group).code &&
          RIGHTS.filter(d => d.type === 'esr')
            .map(d => d.code)
            .indexOf(s.metric_code) > -1,
      ),
      cpr: cprScores.filter(
        s =>
          s.country_code === country &&
          quasiEquals(s.year, cprYear) &&
          RIGHTS.filter(d => d.type === 'cpr')
            .map(d => d.code)
            .indexOf(s.metric_code) > -1,
      ),
    },
);

// single country, all indicators, single year
export const getIndicatorScoresForCountry = createSelector(
  (state, country) => country,
  getESRIndicatorScores,
  getESRIndicators, // ForStandard,
  getGroupSearch,
  getESRYear,
  (country, scores, indicators, group, year) => {
    if (scores && country && indicators) {
      // first filter by country and group
      const filteredByGroup = scores.filter(
        s =>
          s.country_code === country &&
          s.group === PEOPLE_GROUPS.find(g => g.key === group).code,
      );
      // filter by standard
      const filteredByStandard = filteredByGroup.filter(s =>
        indicators.find(i => i.metric_code === s.metric_code),
      );
      // then get the most recent year for each metric
      // figure out most recent data by metric
      const metricYears = filteredByStandard.reduce((memo, s) => {
        const result = memo;
        const metric = s.metric_code;
        if (
          parseInt(s.year, 10) >= year - INDICATOR_LOOKBACK &&
          (typeof memo[metric] === 'undefined' ||
            (parseInt(s.year, 10) > result[metric] &&
              parseInt(s.year, 10) <= year))
        ) {
          result[metric] = parseInt(s.year, 10);
        }
        return result;
      }, {});
      // filter by year or most recent year
      const filteredByYear = filteredByStandard.filter(
        s =>
          quasiEquals(s.year, year) ||
          quasiEquals(s.year, metricYears[s.metric_code]),
      );
      return filteredByYear;
    }
    return false;
  },
);
export const getIndicatorsForCountry = createSelector(
  getIndicatorScoresForCountry,
  getESRIndicators,
  getStandardSearch,
  (scores, indicators, standard) => {
    const standardCode = STANDARDS.find(as => as.key === standard).code;
    return (
      scores &&
      indicators &&
      INDICATORS.reduce((memo, i) => {
        const details = indicators.find(id => id.metric_code === i.code);
        if (details.standard === 'Both' || details.standard === standardCode) {
          return {
            [i.key]: {
              score: scores.find(s => s.metric_code === i.code),
              details,
              ...i,
            },
            ...memo,
          };
        }
        return memo;
      }, {})
    );
  },
);

export const getDimensionsForCountry = createSelector(
  getDimensionScoresForCountry,
  getRightScoresForCountry,
  getIndicatorScoresForCountry,
  getESRIndicators,
  getStandardSearch,
  (scores, rightScores, indicatorScores, indicators, standard) => {
    // scores && console.log('getDimensionsForCountry', scores, standard)
    const standardCode = STANDARDS.find(as => as.key === standard).code;
    return (
      scores &&
      rightScores &&
      indicatorScores &&
      indicators &&
      DIMENSIONS.reduce((memo, d) => {
        if (d.type === 'cpr') {
          return {
            [d.key]: {
              score: scores.cpr.find(s => s.metric_code === d.code),
              ...d,
            },
            ...memo,
          };
        }
        // esr
        const score = scores.esr.find(s => s.standard === standardCode);
        if (score) {
          return {
            [d.key]: {
              score,
              ...d,
            },
            ...memo,
          };
        }
        // without dimension score
        const indicatorsStandard = indicators
          .filter(i => i.standard === 'Both' || i.standard === standardCode)
          .map(i => i.metric_code);
        const indicatorsAlternate = indicators
          .filter(i => i.standard !== 'Both' && i.standard !== standardCode)
          .map(i => i.metric_code);
        return {
          [d.key]: {
            score: false,
            hasScoreAlternate: !!scores.esr.find(
              s => s.standard !== standardCode,
            ),
            hasScoreRights: !!rightScores.esr.find(
              s => s.standard === standardCode,
            ),
            hasScoreRightsAlternate: !!rightScores.esr.find(
              s => s.standard !== standardCode,
            ),
            hasScoreIndicators: !!indicatorScores.find(
              s => indicatorsStandard.indexOf(s.metric_code) > -1,
            ),
            hasScoreIndicatorsAlternate: !!indicatorScores.find(
              s => indicatorsAlternate.indexOf(s.metric_code) > -1,
            ),
            ...d,
          },
          ...memo,
        };
      }, {})
    );
  },
);

export const getRightsForCountry = createSelector(
  getRightScoresForCountry,
  getIndicatorScoresForCountry,
  getESRIndicators,
  getStandardSearch,
  (scores, indicatorScores, indicators, standard) => {
    const standardCode = STANDARDS.find(as => as.key === standard).code;
    return (
      scores &&
      indicatorScores &&
      indicators &&
      RIGHTS.reduce((memo, r) => {
        if (r.type === 'cpr') {
          return {
            [r.key]: {
              score: scores.cpr.find(s => s.metric_code === r.code),
              ...r,
            },
            ...memo,
          };
        }
        // esr
        const score = scores.esr.find(
          s => s.standard === standardCode && s.metric_code === r.code,
        );
        if (score) {
          return {
            [r.key]: {
              score,
              ...r,
            },
            ...memo,
          };
        }
        // without dimension score
        // get indicator definitions (to know right relationship)
        const indicatorDetailsRight = INDICATORS.filter(
          i => i.right === r.key,
        ).map(i => i.code);
        // get indicator look up info (to know standard info)
        const indicatorsRight = indicators.filter(
          i => indicatorDetailsRight.indexOf(i.metric_code) > -1,
        );
        const indicatorsStandard = indicatorsRight
          .filter(i => i.standard === 'Both' || i.standard === standardCode)
          .map(i => i.metric_code);
        const indicatorsAlternate = indicatorsRight
          .filter(i => i.standard !== 'Both' && i.standard !== standardCode)
          .map(i => i.metric_code);

        return {
          [r.key]: {
            score: false,
            hasScoreAlternate: !!scores.esr.find(
              s => s.standard !== standardCode && s.metric_code === r.code,
            ),
            hasScoreIndicators: !!indicatorScores.find(
              s => indicatorsStandard.indexOf(s.metric_code) > -1,
            ),
            hasScoreIndicatorsAlternate: !!indicatorScores.find(
              s => indicatorsAlternate.indexOf(s.metric_code) > -1,
            ),
            ...r,
          },
          ...memo,
        };
      }, {})
    );
  },
);

// at risk
// single country, single right, single year
export const getPeople = () => null;
