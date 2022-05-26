import { Component } from 'react';
import { View } from '@tarojs/components';
import { AtButton, AtIcon, AtMessage } from 'taro-ui';
import Taro from '@tarojs/taro';

import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/message.scss";
import "taro-ui/dist/style/components/icon.scss";
import './index.scss';

export default class Index extends Component {

    componentWillMount() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    todo = () => {
        Taro.atMessage({
            message: `请期待！`,
            type: 'info',
        });
    }

    toTalents = () => {
        console.log('talents');
        wx.navigateTo({
            url: '/pages/talents/index'
        });
    }

    toRanking = () => {
        console.log('ranking');
        // wx.navigateTo({
        //     url: 'ranking'
        // });
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
        return (
            <View className="container">
                <AtMessage />
                <View className="top-right">
                    <AtButton size="small" onClick={this.todo} className="btn">
                        鸣谢
                    </AtButton>
                    <AtButton size="small" onClick={this.todo} className="btn">
                        成就
                    </AtButton>
                </View>
                <View className="title">人生轮回模拟器</View>
                <View className="sub-title">这垃圾人生一秒也不想呆了</View>
                <View className="btn-view">
                    <AtButton onClick={this.toTalents} className="btn">
                        <AtIcon value={'reload'} size="30" className="icon" />
                        立即重开
                    </AtButton>
                </View>
            </View>
        )
    }
}
