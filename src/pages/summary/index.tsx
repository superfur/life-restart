import { Component } from 'react';
import { View, OpenData } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { buildSummary, finalSummary } from "../../utils/liferestart/data/dataUtils";

import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/flex.scss";
import './index.scss'

export default class Summary extends Component {

    state = {
        summaryCHR: {},
        summaryINT: {},
        summarySTR: {},
        summaryMNY: {},
        summarySPR: {},
        summaryAGE: {},
        summaryFinal: {},
    }

    componentWillMount() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
        this.initData();
    }

    initData() {
        var nickName = "神秘人"
        var avatarUrl = ""
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo
                nickName = userInfo.nickName
                avatarUrl = userInfo.avatarUrl
            }
        })
        const record = wx.getStorageSync('currentRecord')
        const recordCHR = buildSummary(record, 'CHR')
        const recordINT = buildSummary(record, 'INT');
        const recordSTR = buildSummary(record, 'STR');
        const recordMNY = buildSummary(record, 'MNY');
        const recordSPR = buildSummary(record, 'SPR');
        const recordAGE = buildSummary(record, 'AGE');
        const recordFinal = finalSummary(record)

        this.setState({
            summaryCHR: recordCHR,
            summaryINT: recordINT,
            summarySTR: recordSTR,
            summaryMNY: recordMNY,
            summarySPR: recordSPR,
            summaryAGE: recordAGE,
            summaryFinal: recordFinal
        })
        console.log('initData', this.state.summaryFinal)
    }

    again = () => {
        wx.redirectTo({
            url: '/pages/index/index',
        })
    }

    onShareTimeline() {
        return {
            title: "人生重开模拟器",
            // TODO:
            imageUrl: "../../../images/liferestart_cover.jpg",
        }
    }
    onShareAppMessage = () => {
        return {
            title: '人生重开模拟器',
            imageUrl: '../../../images/liferestart_cover.jpg',
            path: '/pages/index/index',
        }
    }

    render() {
        const {
            summaryCHR,
            summaryINT,
            summarySTR,
            summaryMNY,
            summarySPR,
            summaryAGE,
            summaryFinal,
        } = this.state;
        const items = [
            { label: '颜值', grade: summaryCHR.grade, value: summaryCHR.value, judge: summaryCHR.judge },
            { label: '智力', grade: summaryINT.grade, value: summaryINT.value, judge: summaryINT.judge },
            { label: '体质', grade: summarySTR.grade, value: summarySTR.value, judge: summarySTR.judge },
            { label: '家境', grade: summaryMNY.grade, value: summaryMNY.value, judge: summaryMNY.judge },
            { label: '快乐', grade: summarySPR.grade, value: summarySPR.value, judge: summarySPR.judge },
            { label: '享年', grade: summaryAGE.grade, value: summaryAGE.value, judge: summaryAGE.judge },
            { label: '总评', grade: summaryFinal.grade, value: summaryFinal.value, judge: summaryFinal.judge },
        ]

        return (
            <View className="container">
                <View className="title">人生总结</View>
                <View className="at-row">
                    <View className="at-col at-col-3">
                        <View className="userinfo-avatar">
                            <OpenData type='userAvatarUrl' />
                            {/* <open-data type="userAvatarUrl"></open-data> */}
                        </View>
                    </View>
                    <View className="at-col at-col-9">
                        <View className="userinfo">
                            <OpenData type='userNickName' /> 的来生
                            {/* <open-data type="userNickName"></open-data> 的来生 */}
                        </View>
                    </View>
                </View>


                <View>
                    {items.map((item) => {
                        return (
                            <View className={`at-row summary-row grade${item.grade}b`}>
                                {item.label}: {item.value} {item.judge}
                            </View>
                        )
                    })}
                </View>
                <View className="footer">
                    <AtButton className="btn" onClick={this.again}>
                        再来一次
                    </AtButton>
                </View>
            </View>
        )
    }
}
