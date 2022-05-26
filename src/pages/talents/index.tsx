import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { AtButton, AtMessage } from 'taro-ui';
import { randomTalents, computeTalentsStatus, computeUseableProp, randomProp } from '../../utils/liferestart/data/dataUtils';

import "taro-ui/dist/style/components/button.scss"
import "taro-ui/dist/style/components/checkbox.scss";
import "taro-ui/dist/style/components/message.scss";
import './index.scss'

export default class Talent extends Component {

    state = {
        talentsArray: [],
        selectedTalentsID: [],
        selectedTalents: [],
        showSelectTalents: false,
    }

    componentWillMount() {
        console.log('telents page onLoad')
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.clearStorage()
        this.loadTalents()
    }

    clearStorage() {
        this.setState({
            talentsArray: [],
            selectedTalentsID: [],
            selectedTalents: []
        });
        wx.removeStorageSync('selectedTalentsID')
        wx.removeStorageSync('selectedTalents')
        wx.removeStorageSync('propertyCHR')
        wx.removeStorageSync('propertyINT')
        wx.removeStorageSync('propertySTR')
        wx.removeStorageSync('propertyMNY')
        wx.removeStorageSync('currentRecord')
        wx.removeStorageSync('trajectory')
    }

    loadTalents = () => {
        const talentsArray = randomTalents(10)
        // console.log('telents page loadTalents', talentsArray)
        this.setState({
            talentsArray,
        });
    };

    onSelectTalents = (selectedId: number | string) => () => {
        const { selectedTalentsID, talentsArray } = this.state;
        selectedTalentsID.includes(selectedId) ? selectedTalentsID.splice(selectedTalentsID.indexOf(selectedId), 1) : selectedTalentsID.push(selectedId);

        if (selectedTalentsID.length > 3) {
            Taro.atMessage({
                message: '最多选择3个天赋',
                type: 'error',
            });
            selectedTalentsID.length = 3;
        }
        const selectedTalents = talentsArray.filter(talent => selectedTalentsID.includes(talent._id));
        this.setState({
            selectedTalentsID,
            selectedTalents,
        }, () => {
            wx.setStorage({
                key: 'selectedTalentsID',
                data: this.state.selectedTalentsID
            })
            wx.setStorage({
                key: 'selectedTalents',
                data: this.state.selectedTalents
            })
        });
    }

    showTalents = () => {
        this.setState({
            showSelectTalents: true,
        });
    }

    randomLife = () => {
        const selectedTalents = randomTalents(3)
        const selectedTalentsID = selectedTalents.map(function (item) {
            return item._id
        });
        const status = computeTalentsStatus(selectedTalents)
        // console.log('status', status)
        const proNum = computeUseableProp(20, status)
        const arr = randomProp(proNum, [10, 10, 10, 10])
        console.log('selectedTalentsID', selectedTalentsID, proNum, arr)
        wx.setStorage({
            key: 'selectedTalentsID',
            data: selectedTalentsID
        })
        wx.setStorage({
            key: 'selectedTalents',
            data: selectedTalents
        })
        wx.setStorage({
            key: 'propertyCHR',
            data: arr[0]
        })
        wx.setStorage({
            key: 'propertyINT',
            data: arr[1]
        })
        wx.setStorage({
            key: 'propertySTR',
            data: arr[2]
        })
        wx.setStorage({
            key: 'propertyMNY',
            data: arr[3]
        })
        wx.redirectTo({
            url: '/pages/trajectory/index'
        })
    }

    toProperty = () => {
        if (this.state.selectedTalents.length < 3) {
            Taro.atMessage({
                message: '请选择三个天赋',
                type: 'error',
            });
        } else {
            wx.redirectTo({
                url: '/pages/property/index'
            })
        }
    }
    onShareTimeline(e) {
        return {
            title: "人生重开模拟器",
            imageUrl: "../../../images/liferestart_cover.jpg",
        }
    }
    onShareAppMessage() {
        return {
            title: '人生重开模拟器',
            imageUrl: '../../../images/liferestart_cover.jpg',
            path: '/pages/index/index',
        }
    }

    render() {
        const { showSelectTalents, talentsArray, selectedTalentsID } = this.state;

        return (
            <View className="container">
                <AtMessage />
                <View className="title">天赋抽卡</View>
                {showSelectTalents ? (
                    <View className="main">
                        <View>
                            {talentsArray.map(item => {
                                return (
                                    <Button
                                        key={item._id}
                                        className={`talent-item grade${item.grade}b ${selectedTalentsID.includes(item._id) ? 'selected' : ''}`}
                                        onClick={this.onSelectTalents(item._id)}>
                                        {item.name}({item.description})
                                    </Button>
                                )
                            })}
                        </View>
                        <View className="footer">
                            <AtButton onClick={this.toProperty} className="btn">
                                请选择3个
                            </AtButton>
                        </View>
                    </View>
                ) : (
                    <View className="btn-view">
                        <AtButton className="btn" onClick={this.randomLife}>
                            盲盒人生
                        </AtButton>
                        <AtButton className="btn" onClick={this.showTalents}>
                            十连抽
                        </AtButton>
                    </View>
                )
                }
            </View>
        )
    }
}
