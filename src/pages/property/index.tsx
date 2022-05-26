import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import { AtButton, AtMessage, AtForm, AtInputNumber } from 'taro-ui';
import { computeTalentsStatus, computeUseableProp, randomProp } from '../../utils/liferestart/data/dataUtils';

import "taro-ui/dist/style/components/button.scss"
import "taro-ui/dist/style/components/input-number.scss";
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/icon.scss";
import './index.scss'

export default class Property extends Component {

    state = {
        propertyResidue: 0,
        propertyCHR: 0,
        propertyINT: 0,
        propertySTR: 0,
        propertyMNY: 0,
        propertyCHRMAX: 10,
        propertyINTMAX: 10,
        propertySTRMAX: 10,
        propertyMNYMAX: 10,
        propertyMaxInit: 0,
        selectedTalentsID: [],
        selectedTalents: []
    }

    componentWillMount() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
        this.computeProperty();
    }

    randomProperty = () => {
        const arr = randomProp(this.state.propertyMaxInit, [10, 10, 10, 10])
        // console.log('randomProperty', t, arr)
        this.setState({
            propertyCHR: 10 - arr[0],
            propertyINT: 10 - arr[1],
            propertySTR: 10 - arr[2],
            propertyMNY: 10 - arr[3],
            propertyCHRMAX: 10 - arr[0],
            propertyINTMAX: 10 - arr[1],
            propertySTRMAX: 10 - arr[2],
            propertyMNYMAX: 10 - arr[3],
            propertyResidue: 0

        })
    }

    born = () => {
        const { propertyResidue, propertyCHR, propertyINT, propertySTR, propertyMNY } = this.state
        if (propertyResidue > 0) {
            Taro.atMessage({
                message: `你还有${propertyResidue}属性点没有分配完`,
                type: 'error',
            });
            return;
        }

        wx.setStorage({
            key: 'propertyCHR',
            data: propertyCHR,
        });

        wx.setStorage({
            key: 'propertyINT',
            data: propertyINT,
        });

        wx.setStorage({
            key: 'propertySTR',
            data: propertySTR,
        });

        wx.setStorage({
            key: 'propertyMNY',
            data: propertyMNY,
        });

        wx.redirectTo({
            url: '/pages/trajectory/index',
        })
    }

    onChange = (id: string) => (value: number) => {
        const { propertyMaxInit, propertyCHR, propertyINT, propertySTR, propertyMNY } = this.state;
        switch (id) {
            case 'propertyCHR':
                this.setState({
                    propertyCHR: value,
                })
                break
            case 'propertyINT':
                this.setState({
                    propertyINT: value,
                })
                break
            case 'propertySTR':
                this.setState({
                    propertySTR: value,
                })
                break
            case 'propertyMNY':
                this.setState({
                    propertyMNY: value,
                })
                break
        }

        var max = propertyMaxInit
            - propertyCHR
            - propertyINT
            - propertySTR
            - propertyMNY;
        max = max < 0 ? 0 : max;

        this.setState({
            propertyResidue: max < 0 ? 0 : max,
            propertyCHRMAX: max + propertyCHR >= 10 ? 10 : max + propertyCHR,
            propertyINTMAX: max + propertyINT >= 10 ? 10 : max + propertyINT,
            propertySTRMAX: max + propertySTR >= 10 ? 10 : max + propertySTR,
            propertyMNYMAX: max + propertyMNY >= 10 ? 10 : max + propertyMNY,
        });
    }

    computeProperty() {
        const selectedTalents = wx.getStorageSync('selectedTalents')
        const selectedTalentsID = wx.getStorageSync('selectedTalentsID')
        console.log('selectedTalents', selectedTalents)
        var status = computeTalentsStatus(selectedTalents)
        // console.log('status', status)
        var proNum = computeUseableProp(20, status)
        this.setState({
            propertyResidue: proNum,
            propertyMaxInit: proNum,
            selectedTalents: selectedTalents,
            selectedTalentsID: selectedTalentsID
        })
        // console.log('proNum', proNum)
    }

    onShareTimeline() {
        return {
            title: "人生重开模拟器",
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
            propertyResidue,
            selectedTalents,
            propertyCHR,
            propertyCHRMAX,
            propertyINT,
            propertyINTMAX,
            propertySTR,
            propertySTRMAX,
            propertyMNY,
            propertyMNYMAX,
        } = this.state;

        const formData = [
            { label: '颜值', id: 'propertyCHR', max: propertyCHRMAX, value: propertyCHR },
            { label: '智力', id: 'propertyINT', max: propertyINTMAX, value: propertyINT },
            { label: '体质', id: 'propertySTR', max: propertySTRMAX, value: propertySTR },
            { label: '家境', id: 'propertyMNY', max: propertyMNYMAX, value: propertyMNY },
        ]

        return (
            <View className="container">
                <AtMessage />
                <View className="title">调整初始属性</View>
                <View className="sub-title">可用属性点：{propertyResidue}</View>
                <View className="main">
                    <AtForm
                        className="form"
                    >
                        {formData.map(item => (
                            <View className="line">
                                <View>{item.label}</View>
                                <AtInputNumber
                                    min={0}
                                    max={item.max}
                                    step={1}
                                    value={item.value}
                                    onChange={this.onChange(item.id)}
                                    type="number"
                                />
                            </View>
                        ))}
                    </AtForm>
                    <View className="talent-view">
                        <View className="sub-title">已选天赋</View>
                        <View className="talents-table">
                            {selectedTalents.map(st => (
                                <View className="talent-item" key={st.name}>{st.name}({st.description})</View>
                            ))}
                        </View>
                    </View>
                </View>
                <View className="footer">
                    <View className="footer-view">
                        <AtButton onClick={this.randomProperty} className="btn">随机分配</AtButton>
                        <AtButton onClick={this.born} className="btn">开启新人生</AtButton>
                    </View>
                </View>
            </View >
        )
    }
}
