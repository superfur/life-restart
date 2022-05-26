import { Component } from 'react';
import { View, ScrollView, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import Life from "../../utils/liferestart/life";
import Property from "../../utils/liferestart/property";

import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/flex.scss";

import './index.scss'

export default class Trajectory extends Component {
    private property;
    private life;
    private timer;

    state = {
        propertyCHR: 0,
        propertyINT: 0,
        propertySTR: 0,
        propertyMNY: 0,
        selectedTalentsID: [],
        isEnd: false,
        items: [],
    }

    componentWillMount() {
        this.initialData();
    }

    initialData() {
        const items = [...this.state.items];
        const propertyCHR = wx.getStorageSync('propertyCHR')
        const propertyINT = wx.getStorageSync('propertyINT')
        const propertySTR = wx.getStorageSync('propertySTR')
        const propertyMNY = wx.getStorageSync('propertyMNY')
        const selectedTalentsID = wx.getStorageSync('selectedTalentsID')

        this.property = new Property();
        this.life = new Life();
        this.life.initial();

        this.life.restart({
            CHR: propertyCHR,
            INT: propertyINT,
            STR: propertySTR,
            MNY: propertyMNY,
            SPR: 5,
            TLT: selectedTalentsID,
        });
        var trajectory = this.life.next()

        wx.setStorage({
            key: 'currentRecord',
            data: this.life.getRecord(),
        })
        const { age, content, isEnd } = trajectory;

        items.push(trajectory);

        const newprop = this.life.getLastRecord()
        this.setState({
            items: items,
            selectedTalentsID: selectedTalentsID,
            propertyCHR: newprop.CHR,
            propertyINT: newprop.INT,
            propertySTR: newprop.STR,
            propertyMNY: newprop.MNY,
            scrollTopVal: 0,
            isEnd: isEnd,
        })

    }

    autoGoNext = () => {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.nextAge();
        }, 500);
    }

    onViewClick = () => {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.nextAge();
    }

    nextAge = () => {
        const { isEnd, items } = this.state;

        if (!isEnd) {
            var trajectory = this.life.next();
            const { age, content, isEnd } = trajectory;
            items.push(trajectory);
            const newprop = this.life.getLastRecord();
            this.setState({
                items: items,
                propertyCHR: newprop.CHR,
                propertyINT: newprop.INT,
                propertySTR: newprop.STR,
                propertyMNY: newprop.MNY,
                scrollTopVal: items.length * 999,
                isEnd: isEnd,
            });
        } else {
            if (this.timer) {
                clearInterval(this.timer);
            }
        }
    }

    toSummary = () => {
        wx.setStorage({
            key: 'currentRecord',
            data: this.life.getRecord(),
        });
        wx.setStorage({
            key: 'trajectory',
            data: this.state.items,
        });
        wx.redirectTo({
            url: '/pages/summary/index',
        });
    }

    render() {
        const {
            propertyCHR,
            propertyINT,
            propertySTR,
            propertyMNY,
            isEnd,
            items,
        } = this.state;

        const properties = [
            { label: '颜值', value: propertyCHR },
            { label: '智力', value: propertyINT },
            { label: '体质', value: propertySTR },
            { label: '家境', value: propertyMNY },
            { label: '快乐', value: propertyMNY },
        ]

        return (
            <View className="container">
                <View className="top">
                    <View className="at-row">
                        <View className="at-col at-col-2"></View>
                        {properties.map((item) => {
                            return (
                                <View className="at-col at-col-2">
                                    <View className="life-property">
                                        <View className="life-property-label">
                                            {item.label}
                                        </View>
                                        <View className="life-property-value">
                                            {item.value}
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View
                    className="main"
                    onClick={this.onViewClick}
                >
                    <ScrollView
                        scrollY
                        scrollWithAnimation
                        scrollTop={0}
                        style={{
                            height: wx.getSystemInfoSync().windowHeight - 150,
                        }}
                        scrollIntoView={`year-${items.length - 1}`}
                    >
                        {items.map((item, index) => {
                            return (
                                <View className="year" id={`year-${index}`}>
                                    <View className="label right">
                                        {item.age}岁:
                                    </View>
                                    <View className="content">
                                        {item.content.map(ct => {
                                            if (ct.type === 'TLT') {
                                                return (
                                                    <View>
                                                        天赋【{ct.name}】发动：{ct.description}
                                                    </View>
                                                )
                                            } else if (ct.type === 'EVT') {
                                                return (
                                                    <View>
                                                        {ct.description}
                                                        {ct.postEvent}
                                                    </View>
                                                )
                                            }
                                        })}
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
                <View className="footer">
                    {isEnd ? <AtButton type="primary" onClick={this.toSummary}>
                        人生总结
                    </AtButton> : <AtButton type="primary" onClick={this.autoGoNext}>
                        自动
                    </AtButton>}
                </View>
            </View >
        )
    }
}
