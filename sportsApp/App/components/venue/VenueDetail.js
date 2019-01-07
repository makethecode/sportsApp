/**
 * Created by dingyiming on 2017/7/31.
 */

import React,{Component} from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_MAP} from 'react-native-toolbar-wrapper';
import VenueMap from './VenueMap';

var IMGS = [
    require('../../../img/v1.jpg'),
    require('../../../img/v2.jpg'),
    require('../../../img/v3.jpg'),
];

var {height, width} = Dimensions.get('window');

class VenueDetail extends Component{

    constructor(props) {
        super(props);
        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});
        this.state={
            venueDetail:this.props.venueDetail,
            dataSource:ds.cloneWithPages(IMGS),
        }
    }

    _renderPage(data,pageID){
        return (
            <View style={{width:width}}>
                <Image
                    source={data}
                    style={{width:width,flex:3}}
                    resizeMode={"stretch"}
                />
            </View>
        );
    }

    navigate2VenueMap(venueDetail){

        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'VenueMap',
                component: VenueMap,
                params: {
                    venueDetail:venueDetail
                }
            })
        }
    }

    render() {

        //[{brief=null, feeDes=每人每次15元, address=世纪大道10600号, yardTotal=6, town=历城区, manager=3, city=济南市, latitude=36.693125,
        // unitNum=U000001, remark=, province=山东省, phone=18254888887, name=山东体育学院羽毛球馆, unitId=1, attachId=null, longitude=117.200185},

        var venueDetail = this.state.venueDetail;
        return (
            <View style={{flex:1}}>

                <Toolbar width={width} title='场馆详情' navigator={this.props.navigator} actions={[{icon:ACTION_MAP,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             this.navigate2VenueMap(venueDetail)
                         }}>
                    <View style={{width:width,height:160}}>
                        <ViewPager
                            style={this.props.style}
                            dataSource={this.state.dataSource}
                            renderPage={this._renderPage}
                            isLoop={true}
                            autoPlay={true}
                        />
                    </View>

                    <View style={{width:width,height:340,padding:10,backgroundColor:'#fff'}}>

                        {/*场馆名称*/}
                        <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{color:'#555',fontSize:15}}>
                                    场馆名称
                                </Text>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                {
                                    this.state.venueDetail.name&&this.state.venueDetail.name!=''?
                                        <Text style={{color:'#444',fontSize:15}}>
                                            {this.state.venueDetail.name}
                                        </Text>:
                                        <Text style={{color:'#777',fontSize:15}}>
                                            未设置
                                        </Text>
                                }
                            </View>
                        </View>

                        {/*场馆编号*/}
                        <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{color:'#555',fontSize:15}}>
                                    场馆编号
                                </Text>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                {
                                    this.state.venueDetail.unitNum&&this.state.venueDetail.unitNum!=''?
                                        <Text style={{color:'#444',fontSize:15}}>
                                            {this.state.venueDetail.unitNum}
                                        </Text>:
                                        <Text style={{color:'#777',fontSize:15}}>
                                            未设置
                                        </Text>
                                }
                            </View>
                        </View>

                        {/*平台合作*/}
                        <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{color:'#555',fontSize:15}}>
                                    平台合作
                                </Text>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={{color:'#444',fontSize:15}}>
                                            合作场地
                                        </Text>
                            </View>
                        </View>

                        {/*场地总数*/}
                        <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{color:'#555',fontSize:15}}>
                                    场地总数
                                </Text>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                {
                                    this.state.venueDetail.yardTotal&&this.state.venueDetail.yardTotal!=''?
                                        <Text style={{color:'#444',fontSize:15}}>
                                            {this.state.venueDetail.yardTotal}
                                        </Text>:
                                        <Text style={{color:'#777',fontSize:15}}>
                                            未设置
                                        </Text>
                                }
                            </View>
                        </View>

                        {/*负责人*/}
                        <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{color:'#555',fontSize:15}}>
                                    负责人
                                </Text>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                {
                                    this.state.venueDetail.managerName&&this.state.venueDetail.managerName!=''?
                                        <Text style={{color:'#444',fontSize:15}}>
                                            {this.state.venueDetail.managerName}
                                        </Text>:
                                        <Text style={{color:'#777',fontSize:15}}>
                                            未设置
                                        </Text>
                                }
                            </View>
                        </View>

                        {/*详细地址*/}
                        <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{color:'#555',fontSize:15}}>
                                    详细地址
                                </Text>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                {
                                    this.state.venueDetail.address&&this.state.venueDetail.address!=''?
                                        <Text style={{color:'#444',fontSize:15}}>
                                            {this.state.venueDetail.address}
                                        </Text>:
                                        <Text style={{color:'#777',fontSize:15}}>
                                            未设置
                                        </Text>
                                }
                            </View>
                        </View>

                        {/*收费模式*/}
                        <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{color:'#555',fontSize:15}}>
                                    收费模式
                                </Text>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                {
                                    this.state.venueDetail.feeDes&&this.state.venueDetail.feeDes!=''?
                                        <Text style={{color:'#444',fontSize:15}}>
                                            {this.state.venueDetail.feeDes}
                                        </Text>:
                                        <Text style={{color:'#777',fontSize:15}}>
                                            未设置
                                        </Text>

                                }
                            </View>
                        </View>

                        {/*联系电话*/}
                        <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{color:'#555',fontSize:15}}>
                                    联系电话
                                </Text>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                {
                                    this.state.venueDetail.phone&&this.state.venueDetail.phone!=''?
                                        <Text style={{color:'#444',fontSize:15}}>
                                            {this.state.venueDetail.phone}
                                        </Text>:
                                        <Text style={{color:'#777',fontSize:15}}>
                                            未设置
                                        </Text>
                                }
                            </View>
                        </View>

                    </View>
                </Toolbar>

            </View>
        );
    }

}

var styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize:14
    }
});

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        coaches:state.coach.coaches,
    })
)(VenueDetail);
