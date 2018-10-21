import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory, Link } from "react-router"
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts';
// 雷达图的用法
// import highchartsMore from 'highcharts-more';
//treemap的用法
import heatmaps from 'highcharts/modules/treemap';
import treemaps from 'highcharts/modules/map';
import Highlight from 'react-highlight'//高亮插件
import "../css/ControlChart.css"
import AbcHeader from "./common/header"
import { getChartList, getChartData, getChartOne, getChartTwo, getChartThree, getChartFour, getChartFive, getChartSix } from "../api"
import classnames from 'classnames'
import { DatePicker, message } from 'antd'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import moment from 'moment';
@inject('listStore')
@observer
export default class Detailchart extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			list: [],
			num: 0,
			chartConfigList: [],
			chart_one: {},
			chart_two: {},
			chart_three: {},
			chart_four: {},
			chart_five: {},
			chart_six: {},
			nullData: {
				credits: {
					enabled: false
				},
				title: {
					text: '暂无数据',
					align: 'center'
				},
				series: [],
				responsive: {
					rules: [{
						condition: {
							maxWidth: 500
						},
						chartOptions: {
							legend: {
								layout: 'horizontal',
								align: 'center',
								verticalAlign: 'bottom'
							}
						}
					}]
				}
			},
			placeholder: '2018-1-19',
			datetimepicker: {
				"lang": {
					"placeholder": "Select date",
					"rangePlaceholder": [
						"Start date",
						"End date"
					],
					"today": "Today",
					"now": "Today",
					"backToToday": "Back to today",
					"ok": "Sure",
					"clear": "Clear",
					"month": "Month",
					"year": "Year",
					"timeSelect": "Select data",
					"dateSelect": "Select date",
					"monthSelect": "Choose a month",
					"yearSelect": "Choose a year",
					"decadeSelect": "Choose a decade",
					"yearFormat": "YYYY",
					"dateFormat": "M/D/YYYY",
					"dayFormat": "D",
					"dateTimeFormat": "M/D/YYYY HH:mm:ss",
					"monthFormat": "MMMM",
					"monthBeforeYear": true,
					"previousMonth": "Previous month (PageUp)",
					"nextMonth": "Next month (PageDown)",
					"previousYear": "Last year (Control + left)",
					"nextYear": "Next year (Control + right)",
					"previousDecade": "Last decade",
					"nextDecade": "Next decade",
					"previousCentury": "Last century",
					"nextCentury": "Next century"
				},
				"timePickerLocale": {
					"placeholder": "Select time"
				}
			},
			isClearTime: false
		}
	}
	async componentDidMount() {
		//获取左侧list数据
		const { listStore } = this.props;
		const res = await getChartList();
		if (!res) {
			message.error('获取图表列表数据失败');
		} else {
			this.setState({
				list: res.data.data
			})
		}
		/*
		 * 首次加载渲染总看板数据
		 */
		var chart_one, chart_two, chart_three, chart_four, chart_five, chart_six;
		const chartList = this.state.list;
		const totalChartindex = chartList[0].class_index;
		//第一次请求chart数据 传默认的时间即可
		const respchartone = await getChartOne(totalChartindex, 'MAN_MAIN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
		const respchartTwo = await getChartTwo(totalChartindex, 'TOTAL_AND_SYN_LINE', listStore.chartStarttime, listStore.chartEndtime);
		const respchartThree = await getChartThree(totalChartindex, 'SYN_COVER_PIE', listStore.chartStarttime, listStore.chartEndtime);
		const respchartFour = await getChartFour(totalChartindex, 'SYN_COVER_LINE', listStore.chartStarttime, listStore.chartEndtime);
		const respchartFive = await getChartFive(totalChartindex, 'NEW_SYN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
		const respchartSix = await getChartSix(totalChartindex, 'NEW_MAIN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
		if (!respchartone) {
			message.error('获取MAN_MAIN_COLUMN图表失败');
		} else if (respchartone.data.success && respchartone.data.status === 0) {
			chart_one = respchartone.data.data.chart_config;
		} else if (respchartone.data.success && respchartone.data.status === -1) {
			message.info(resp.data.msg);
		}
		this.setState({
			chart_one: chart_one
		})
		if (!respchartTwo) {
			message.error('获取TOTAL_AND_SYN_LINE图表失败');
		} else if (respchartTwo.data.success && respchartTwo.data.status === 0) {
			chart_two = respchartTwo.data.data.chart_config;
		} else if (respchartTwo.data.success && respchartTwo.data.status === -1) {
			message.info(resp.data.msg);
		}
		this.setState({
			chart_two: chart_two
		})
		if (!respchartThree) {
			message.error('获取SYN_COVER_PIE图表失败');
		} else if (respchartThree.data.success && respchartThree.data.status === 0) {
			chart_three = respchartThree.data.data.chart_config;
		} else if (respchartThree.data.success && respchartThree.data.status === -1) {
			message.info(resp.data.msg);
		}
		this.setState({
			chart_three: chart_three
		})
		if (!respchartFour) {
			message.error('获取SYN_COVER_LINE图表失败');
		} else if (respchartFour.data.success && respchartFour.data.status === 0) {
			chart_four = respchartFour.data.data.chart_config;
		} else if (respchartFour.data.success && respchartFour.data.status === -1) {
			message.info(resp.data.msg);
		}
		this.setState({
			chart_four: chart_four
		})
		if (!respchartFive) {
			message.error('获取NEW_SYN_COLUMN图表失败');
		} else if (respchartFive.data.success && respchartFive.data.status === 0) {
			chart_five = respchartFive.data.data.chart_config;
		} else if (respchartFive.data.success && respchartFive.data.status === -1) {
			message.info(resp.data.msg);
		}
		this.setState({
			chart_five: chart_five
		})
		if (!respchartSix) {
			message.error('获取NEW_MAIN_COLUMN图表失败')
		} else if (respchartSix.data.success && respchartSix.data.status === 0) {
			chart_six = respchartSix.data.data.chart_config;
		} else if (respchartSix.data.success && respchartSix.data.status === -1) {
			message.info(resp.data.msg);
		}
		this.setState({
			chart_six: chart_six
		})
	}
	showChart = (class_index, index) => {
		/* 切换侧边栏重新获取数据画图 */
		const { listStore } = this.props;
		this.setState({
			num: index
		}, async () => {
			//保存classIndex
			var chart_one, chart_two, chart_three, chart_four, chart_five, chart_six;
			listStore.classIndex = class_index;
			const respchartone = await getChartOne(class_index, 'MAN_MAIN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
			const respchartTwo = await getChartTwo(class_index, 'TOTAL_AND_SYN_LINE', listStore.chartStarttime, listStore.chartEndtime);
			const respchartThree = await getChartThree(class_index, 'SYN_COVER_PIE', listStore.chartStarttime, listStore.chartEndtime);
			const respchartFour = await getChartFour(class_index, 'SYN_COVER_LINE', listStore.chartStarttime, listStore.chartEndtime);
			const respchartFive = await getChartFive(class_index, 'NEW_SYN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
			const respchartSix = await getChartSix(class_index, 'NEW_MAIN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
			if (!respchartone) {
				message.error('获取MAN_MAIN_COLUMN图表失败');
			} else if (respchartone.data.success && respchartone.data.status === 0) {
				chart_one = respchartone.data.data.chart_config;
			} else if (respchartone.data.success && respchartone.data.status === -1) {
				message.info(resp.data.msg);
			}
			this.setState({
				chart_one: chart_one
			})
			if (!respchartTwo) {
				message.error('获取TOTAL_AND_SYN_LINE图表失败');
			} else if (respchartTwo.data.success && respchartTwo.data.status === 0) {
				chart_two = respchartTwo.data.data.chart_config;
			} else if (respchartTwo.data.success && respchartTwo.data.status === -1) {
				message.info(resp.data.msg);
			}
			this.setState({
				chart_two: chart_two
			})
			if (!respchartThree) {
				message.error('获取SYN_COVER_PIE图表失败');
			} else if (respchartThree.data.success && respchartThree.data.status === 0) {
				chart_three = respchartThree.data.data.chart_config;
			} else if (respchartThree.data.success && respchartThree.data.status === -1) {
				message.info(resp.data.msg);
			}
			this.setState({
				chart_three: chart_three
			})
			if (!respchartFour) {
				message.error('获取SYN_COVER_LINE图表失败');
			} else if (respchartFour.data.success && respchartFour.data.status === 0) {
				chart_four = respchartFour.data.data.chart_config;
			} else if (respchartFour.data.success && respchartFour.data.status === -1) {
				message.info(resp.data.msg);
			}
			this.setState({
				chart_four: chart_four
			})
			if (!respchartFive) {
				message.error('获取NEW_SYN_COLUMN图表失败');
			} else if (respchartFive.data.success && respchartFive.data.status === 0) {
				chart_five = respchartFive.data.data.chart_config;
			} else if (respchartFive.data.success && respchartFive.data.status === -1) {
				message.info(resp.data.msg);
			}
			this.setState({
				chart_five: chart_five
			})
			if (!respchartSix) {
				message.error('获取NEW_MAIN_COLUMN图表失败')
			} else if (respchartSix.data.success && respchartSix.data.status === 0) {
				chart_six = respchartSix.data.data.chart_config;
			} else if (respchartSix.data.success && respchartSix.data.status === -1) {
				message.info(resp.data.msg);
			}
			this.setState({
				chart_six: chart_six
			})

		})
	}
	callback = () => {
		//ReactHighcharts的回调函数
	}
	timeStartChange = (date, dateString) => {
		const { listStore } = this.props;
		listStore.chartStarttime = dateString;
		this.cleanTime();
	}
	timeEndChange = (date, dateString) => {
		const { listStore } = this.props;
		listStore.chartEndtime = dateString;
		this.cleanTime();
	}
	cleanTime = async () => {
		const { listStore } = this.props;
		const { isClearTime } = this.state;
		if (isClearTime) {
			if (listStore.chartStarttime == '' || listStore.chartEndtime == '') {
				//如果时间清空一个或者俩个都清空显示默认的数据
				var chart_one, chart_two, chart_three, chart_four, chart_five, chart_six;
				const respchartone = await getChartOne(listStore.classIndex, 'MAN_MAIN_COLUMN', '', '');
				const respchartTwo = await getChartTwo(listStore.classIndex, 'TOTAL_AND_SYN_LINE', '', '');
				const respchartThree = await getChartThree(listStore.classIndex, 'SYN_COVER_PIE', '', '');
				const respchartFour = await getChartFour(listStore.classIndex, 'SYN_COVER_LINE', '', '');
				const respchartFive = await getChartFive(listStore.classIndex, 'NEW_SYN_COLUMN', '', '');
				const respchartSix = await getChartSix(listStore.classIndex, 'NEW_MAIN_COLUMN', '', '');
				if (!respchartone) {
					message.error('获取MAN_MAIN_COLUMN图表失败');
				} else if (respchartone.data.success && respchartone.data.status === 0) {
					chart_one = respchartone.data.data.chart_config;
				} else if (respchartone.data.success && respchartone.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_one: chart_one
				})
				if (!respchartTwo) {
					message.error('获取TOTAL_AND_SYN_LINE图表失败');
				} else if (respchartTwo.data.success && respchartTwo.data.status === 0) {
					chart_two = respchartTwo.data.data.chart_config;
				} else if (respchartTwo.data.success && respchartTwo.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_two: chart_two
				})
				if (!respchartThree) {
					message.error('获取SYN_COVER_PIE图表失败');
				} else if (respchartThree.data.success && respchartThree.data.status === 0) {
					chart_three = respchartThree.data.data.chart_config;
				} else if (respchartThree.data.success && respchartThree.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_three: chart_three
				})
				if (!respchartFour) {
					message.error('获取SYN_COVER_LINE图表失败');
				} else if (respchartFour.data.success && respchartFour.data.status === 0) {
					chart_four = respchartFour.data.data.chart_config;
				} else if (respchartFour.data.success && respchartFour.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_four: chart_four
				})
				if (!respchartFive) {
					message.error('获取NEW_SYN_COLUMN图表失败');
				} else if (respchartFive.data.success && respchartFive.data.status === 0) {
					chart_five = respchartFive.data.data.chart_config;
				} else if (respchartFive.data.success && respchartFive.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_five: chart_five
				})
				if (!respchartSix) {
					message.error('获取NEW_MAIN_COLUMN图表失败')
				} else if (respchartSix.data.success && respchartSix.data.status === 0) {
					chart_six = respchartSix.data.data.chart_config;
				} else if (respchartSix.data.success && respchartSix.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_six: chart_six
				})
			}
		}
	}
	confirmSelect = () => {
		//确认时间选择OK事件
		const { listStore } = this.props;
		const { isClearTime } = this.state;
		if (listStore.chartStarttime != '' && listStore.chartEndtime === '') {
			// message.info('请选择结束时间');
		} else if (listStore.chartStarttime === '' && listStore.chartEndtime != '') {
			// message.info('请选择开始时间');
		} else if (listStore.chartStarttime != '' && listStore.chartEndtime != '') {
			this.setState({
				isClearTime: true
			}, async () => {
				//重新请求chart数据渲染
				var chart_one, chart_two, chart_three, chart_four, chart_five, chart_six;
				const respchartone = await getChartOne(listStore.classIndex, 'MAN_MAIN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
				const respchartTwo = await getChartTwo(listStore.classIndex, 'TOTAL_AND_SYN_LINE', listStore.chartStarttime, listStore.chartEndtime);
				const respchartThree = await getChartThree(listStore.classIndex, 'SYN_COVER_PIE', listStore.chartStarttime, listStore.chartEndtime);
				const respchartFour = await getChartFour(listStore.classIndex, 'SYN_COVER_LINE', listStore.chartStarttime, listStore.chartEndtime);
				const respchartFive = await getChartFive(listStore.classIndex, 'NEW_SYN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
				const respchartSix = await getChartSix(listStore.classIndex, 'NEW_MAIN_COLUMN', listStore.chartStarttime, listStore.chartEndtime);
				if (!respchartone) {
					message.error('获取MAN_MAIN_COLUMN图表失败');
				} else if (respchartone.data.success && respchartone.data.status === 0) {
					chart_one = respchartone.data.data.chart_config;
				} else if (respchartone.data.success && respchartone.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_one: chart_one
				})
				if (!respchartTwo) {
					message.error('获取TOTAL_AND_SYN_LINE图表失败');
				} else if (respchartTwo.data.success && respchartTwo.data.status === 0) {
					chart_two = respchartTwo.data.data.chart_config;
				} else if (respchartTwo.data.success && respchartTwo.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_two: chart_two
				})
				if (!respchartThree) {
					message.error('获取SYN_COVER_PIE图表失败');
				} else if (respchartThree.data.success && respchartThree.data.status === 0) {
					chart_three = respchartThree.data.data.chart_config;
				} else if (respchartThree.data.success && respchartThree.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_three: chart_three
				})
				if (!respchartFour) {
					message.error('获取SYN_COVER_LINE图表失败');
				} else if (respchartFour.data.success && respchartFour.data.status === 0) {
					chart_four = respchartFour.data.data.chart_config;
				} else if (respchartFour.data.success && respchartFour.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_four: chart_four
				})
				if (!respchartFive) {
					message.error('获取NEW_SYN_COLUMN图表失败');
				} else if (respchartFive.data.success && respchartFive.data.status === 0) {
					chart_five = respchartFive.data.data.chart_config;
				} else if (respchartFive.data.success && respchartFive.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_five: chart_five
				})
				if (!respchartSix) {
					message.error('获取NEW_MAIN_COLUMN图表失败')
				} else if (respchartSix.data.success && respchartSix.data.status === 0) {
					chart_six = respchartSix.data.data.chart_config;
				} else if (respchartSix.data.success && respchartSix.data.status === -1) {
					message.info(resp.data.msg);
				}
				this.setState({
					chart_six: chart_six
				})
			})
		}
	}
	render() {
		const tabbar = this.state.list.map((item, index) => {
			return <div key={index} className={this.state.num == index ? 'tabbarListClick' : 'tabbarList'} onClick={() => { this.showChart(item.class_index, index) }}>{item.class_name}</div>
		})
		return (
			<div className="controllContainer">
				<AbcHeader {...this.props} />
				<div className='container'>
					<div className="sideTabbar">
						{tabbar}
					</div>
					<div className="chartContainer">
						<div className="chartInnerContainer">
							<div className="time-line">
								<span className="time-line-span">自选时间</span>
								<DatePicker
									showTime
									allowClear={true}
									locale={this.state.datetimepicker}
									placeholder={this.state.placeholder}
									onChange={this.timeStartChange}
									onOk={this.confirmSelect}
								/>
								<span className="time-line-span">至</span>
								<DatePicker
									showTime
									allowClear={true}
									locale={this.state.datetimepicker}
									// placeholder={moment(new Date()).format("YYYY-MM-DD")}
									placeholder={moment(new Date(new Date().getTime() - 24*60*60*1000)).format("YYYY-MM-DD")}
									onChange={this.timeEndChange}
									onOk={this.confirmSelect}
								/>
							</div>
							<div className="eachChartBottom">
								{/* <ReactHighcharts config={this.state.chart_two} callback={this.callback}></ReactHighcharts> */}
								{this.state.chart_two.series ? <ReactHighcharts config={this.state.chart_two} callback={this.callback}></ReactHighcharts> : <ReactHighcharts config={this.state.nullData} callback={this.callback}></ReactHighcharts>}
							</div>
							<div className="eachChartLeft">
								{/* <ReactHighcharts config={this.state.chart_three} callback={this.callback}></ReactHighcharts> */}
								{this.state.chart_three.series ? <ReactHighcharts config={this.state.chart_three} callback={this.callback}></ReactHighcharts> : <ReactHighcharts config={this.state.nullData} callback={this.callback}></ReactHighcharts>}
							</div>
							<div className="eachChartRight">
								{/* <ReactHighcharts config={this.state.chart_four} callback={this.callback}></ReactHighcharts> */}
								{this.state.chart_four.series ? <ReactHighcharts config={this.state.chart_four} callback={this.callback}></ReactHighcharts> : <ReactHighcharts config={this.state.nullData} callback={this.callback}></ReactHighcharts>}
							</div>
							<div className="eachChartLeft">
								{/* <ReactHighcharts config={this.state.chart_six} callback={this.callback}></ReactHighcharts> */}
								{this.state.chart_six.series ? <ReactHighcharts config={this.state.chart_six} callback={this.callback}></ReactHighcharts> : <ReactHighcharts config={this.state.nullData} callback={this.callback}></ReactHighcharts>}
							</div>
							<div className="eachChartRight">
								{/* <ReactHighcharts config={this.state.chart_five} callback={this.callback}></ReactHighcharts> */}
								{this.state.chart_five.series ? <ReactHighcharts config={this.state.chart_five} callback={this.callback}></ReactHighcharts> : <ReactHighcharts config={this.state.nullData} callback={this.callback}></ReactHighcharts>}
							</div>
							<div className="eachChartBottom">
								{/* <ReactHighcharts config={this.state.chart_one} callback={this.callback}></ReactHighcharts> */}
								{this.state.chart_one.series ? <ReactHighcharts config={this.state.chart_one} callback={this.callback}></ReactHighcharts> : <ReactHighcharts config={this.state.nullData} callback={this.callback}></ReactHighcharts>}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
Detailchart.propTypes = {
	//id: React.PropTypes.string
}
