// 封装一些用的API，不用把URL写在页面中，直接调用即可
import http from "../utils/request.js";

// 设置个对象，就不用一个个暴露了，直接暴露对象
// 在页面引用的时候就可以用apiFun.方法的方式
const apiFun = {};

/**
 * @param {登录} params
 * @returns
 */
apiFun.login = function (params) {
  return http.post("/uaa/api/v1/uaa/login", params);
};
/**
 * 获取策略列表
 * @param {*} params
 * @returns
 */
apiFun.getStrategyList = function (params) {
  let { strategy_status } = params;
  return http.get(`/kd-strategy-manage/api/v1/strategy/?strategy_status=${strategy_status}`);
};

/**
 * 获取策略绩效
 */
apiFun.getStrategyPerformance = function (params) {
    let { start_cal_dt, end_cal_dt, strategy_id } = params;
    return http.get(`kd-strategy-manage/api/v1/strategy/performance/statistic?start_cal_dt=${start_cal_dt}&end_cal_dt=${end_cal_dt}&strategy_id=${strategy_id}`);
}

/**
 * 策略信号
 * @param {} params
 * @returns
 */
apiFun.strategyTradeSignal = function (params) {
    let { strategy_id = "", start_data_dt, end_data_dt } = params;
    return http.get(`kd-strategy-manage/api/v1/strategy/trade-signal?strategy_id=${strategy_id}&start_data_dt=${start_data_dt}&end_data_dt=${end_data_dt}`);
}
/**
 * 获取组合列表
 * @param {*} params
 * @returns
 */
apiFun.getPortfolioList = function (params) {
    let { portfolio_status } = params;
    return http.get(`/kd-strategy-manage/api/v1/portfolio/?portfolio_status=${portfolio_status}`);
}
/**
 * 组合信号
 * @param {} params
 * @returns
 */
apiFun.portfolioTradeSignal = function (params) {
    let { portfolio_id = "", start_data_dt, end_data_dt } = params;
    return http.get(`kd-strategy-manage/api/v1/portfolio/trade-signal?portfolio_id=${portfolio_id}&start_data_dt=${start_data_dt}&end_data_dt=${end_data_dt}`);
}

 /**
   * 获取组合绩效
   */
apiFun.getPortfolioPerformance = function (params) {
    let { start_cal_dt, end_cal_dt, portfolio_id } = params;
    return http.get(`kd-strategy-manage/api/v1/portfolio/performance/statistic?start_cal_dt=${start_cal_dt}&end_cal_dt=${end_cal_dt}&portfolio_id=${portfolio_id}`);
}

// 暴露出这个对象
export default apiFun;
