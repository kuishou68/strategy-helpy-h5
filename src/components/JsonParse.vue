<script setup>
import { reactive } from 'vue'
import moment from 'moment';
import newArr from './common/postman_test_run.js';
import strageList from './common/strage_list.js';
import apiFun from '../../src/utils/api.js';
import { AppleOutlined, AndroidOutlined, DownloadOutlined } from '@ant-design/icons-vue';

const state = reactive({
    yesterdayDate: moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD'),
    startDate: moment(new Date()).subtract(2, 'year').format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    strategyList: [], // 策略列表
    strategySignal: [], // 策略信号
    portfolioList: [], // 组合列表
    portfolioSignal: [], // 组合信号
    performanceList: [], // 绩效列表
    activeKey: "1",
    strategyID: "",
    portfolioID: "",
    strategyColumns: [
        { title: "方向", dataIndex: "trade_type", key: "trade_type", filters: [
            { text: '买入', value: '买入' },
            { text: '卖出', value: '卖出' },
        ],
        onFilter: (value, record) => record.trade_type.indexOf(value) === 0,
        sortDirections: ['descend', 'ascend'] },
        { title: '名称', dataIndex: 'stock_name', key: 'stock_name' },
        { title: '代码', dataIndex: 'stock_code', key: 'stock_code', sorter: (a, b) => a.stock_code - b.stock_code },
        { title: '日期', dataIndex: 'trade_dt', key: 'trade_dt', width: 120 },
        // { title: "仓位", dataIndex: "model_target_weight", key: "action" },
        { title: '状态', dataIndex: 'trade_status', key: 'stock_code' }
    ]
});


// 获取登录token
function getToken() {
    // 需要传入的参数
    const params = {
        accountId: "admin",
        password: "506@Kandian"
    }
    // 调用
    apiFun.login(params).then((res) => {
        // 无论失败与否都直接输出结果
        console.log("token==>", res);
    })
}

/**
 * 获取策略列表
 */
function getStrategyList() {
    let params = { strategy_status: 1 };
    apiFun.getStrategyList(params).then((res) => {
        console.log("策略列表==>", res.items);
        state.strategyList = res.items;
        // exportCSV(res.items, "策略列表");
        // console.log(strategyList);
        if (res.items && res.items.length > 0) {
            getStrategyPerformance();
        }
    });
}

/**
 * 获取策略年化收益
 */
function getStrategyPerformance() {
    let { startDate, endDate, strategyList, performanceList } = state;
    console.log("state.strategyList==>", strategyList);
    let params = {
        start_cal_dt: startDate,
        end_cal_dt: endDate,
        strategy_id: ""
    };
    console.log(performanceList);
    strategyList.forEach((item, index) => {
        setTimeout(() => {
            // console.log(item.strategy_id);
            params.strategy_id = item.strategy_id;
            apiFun.getStrategyPerformance(params).then((res) => {
                res[0]["策略ID"] = item.strategy_id;
                performanceList.splice(index, 1, res[0]);
                console.log(performanceList);
                if (index == strategyList.length - 1) {
                    exportCSV(performanceList, `策略绩效${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}`);
                }
            });
        }, 5000);
    });


}

/**
 * 获取策略信号
 */
function getStrategyTradeSignal() {
    let { yesterdayDate, endDate, strategyID } = state;
    let params = {
        strategy_id: strategyID,
        start_data_dt: yesterdayDate,
        end_data_dt: endDate
    };
    console.log(strategyID);
    if(strategyID){
        apiFun.strategyTradeSignal(params).then((res) => {
            console.log(res);
            state.strategySignal = res;
        });
    }
}

/**
 * 获取组合列表
 */
function getPortfolioList() {
    let params = { portfolio_status: 1 };
    apiFun.getPortfolioList(params).then((res) => {
        console.log("组合列表==>", res.items);
        state.portfolioList = res.items;
        // this.exportCSV(res.items, "组合列表");
        // console.log(strategyList);
        if (res.items && res.items.length > 0) {
            getPortfolioPerformance();
        }
    });
}

/**
 * 获取组合年化收益
 */
function getPortfolioPerformance() {
    let { startDate, endDate, portfolioList, performanceList } = state;
    console.log("state.portfolioList==>", portfolioList);
    let params = {
        start_cal_dt: startDate,
        end_cal_dt: endDate,
        strategy_id: ""
    };
    console.log(performanceList);
    portfolioList.forEach((item, index) => {
        setTimeout(() => {
            // console.log(item.portfolio_id);
            params.portfolio_id = item.portfolio_id;
            apiFun.getPortfolioPerformance(params).then((res) => {
                res[0]["组合ID"] = item.portfolio_id;
                performanceList.splice(index, 1, res[0]);
                console.log(performanceList);
                if (index == portfolioList.length - 1) {
                    exportCSV(performanceList, `组合绩效${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}`);
                }
            });
        }, 5000);
    });
}

/**
 * 获取组合信号
 */
function getPortfolioTradeSignal() {
    let { yesterdayDate, endDate, portfolioID } = state;
    console.log(portfolioID);
    let params = {
        portfolio_id: portfolioID,
        start_data_dt: yesterdayDate,
        end_data_dt: endDate
    };
    if(portfolioID){
        apiFun.portfolioTradeSignal(params).then((res) => {
            console.log(res);
            state.portfolioSignal = res;
        });
    }
}

//数组导出CSV文件
function exportCSV(jsonData, fileName) {
    if (!jsonData || jsonData.length == 0) {
        return;
    }
    if (!fileName) {
        fileName = "exportCSV.csv";
    }
    let one = jsonData[0];
    let csvText = "";
    for (let key in one) {
        csvText += key + ","
    }
    csvText = trim(csvText, ",") + "\n";
    //增加\t为了不让表格显示科学计数法或者其他格式
    for (let i = 0; i < jsonData.length; i++) {
        let row = "";
        for (let item in jsonData[i]) {
            row += `${jsonData[i][item] + '\t'},`;
        }
        csvText += trim(row, ",") + '\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvText);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//trim函数
function trim(str, char) {
    if (char) {
        str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return str.replace(/^\s+|\s+$/g, '');
}



</script>

<template>
    <div>
        <a-button @click="getToken">获取token</a-button>
        <a-tabs v-model:activeKey="state.activeKey">
            <a-tab-pane key="1">
                <template #tab>
                    <span>
                        <apple-outlined />
                        策略
                    </span>
                </template>
                <div style="display: flex; justify-content: center;">
                    <a-button type="primary" :size="size" @click="getStrategyList" style="margin-right: 10px;">
                        <template #icon>
                        <DownloadOutlined />
                        </template>
                        下载绩效
                    </a-button>
                    <a-input-search v-model:value="state.strategyID" placeholder="输入策略id" allow-clear
                        @search="getStrategyTradeSignal()" />
                </div>
                <a-table v-if="state.strategySignal && state.strategySignal.length > 0" :dataSource="state.strategySignal" :pagination="false"
                    :scroll="{ x: 500, y: 700 }" :columns="state.strategyColumns" />
            </a-tab-pane>
            <a-tab-pane key="2">
                <template #tab>
                    <span>
                        <android-outlined />
                        组合
                    </span>
                </template>
                <div style="display: flex; justify-content: center;">
                    <a-button type="primary" :size="size" @click="getPortfolioList" style="margin-right: 10px;">
                        <template #icon>
                        <DownloadOutlined />
                        </template>
                        下载绩效
                    </a-button>
                    <a-input-search v-model:value="state.portfolioID" placeholder="输入组合id" allow-clear
                        @search="getPortfolioTradeSignal()" />
                </div>
                <a-table v-if="state.portfolioSignal && state.portfolioSignal.length > 0" :pagination="false"
                    :scroll="{ x: 500, y: 700 }" :dataSource="state.portfolioSignal" :columns="state.strategyColumns" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<style scoped lang='less'></style>