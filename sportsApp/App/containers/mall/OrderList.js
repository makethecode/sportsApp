import React, { Component } from 'react';
import {
    Dimensions,
    TextInput,
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
    Easing,
    Modal,
    NetInfo,
    TouchableHighlight,
    ActivityIndicator,
    WebView,
    Alert,
    AlertIOS,
    DeviceEventEmitter, // android
    NativeAppEventEmitter, // ios
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import TextInputWrapper from 'react-native-text-input-wrapper'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD,ACTION_BARCODE} from 'react-native-toolbar-wrapper'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { IndicatorViewPager,PagerTitleIndicator } from 'rn-viewpager'
import Proxy from '../../utils/Proxy'
import Config from '../../../config';
import OrderDetail from './OrderDetail'

var { height, width } = Dimensions.get('window');


class OrderList extends Component {

    goBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    navigate2OrderDetail(order)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'OrderDetail',
                component: OrderDetail,
                params: {
                    order:order
                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),
            bgColor: new Animated.Value(0),

            orderList:[],
            uncheckedOrderList:[],
            checkedOrderList:[],

            choose:[],

            showProgress:false,
        };
    }

    renderGoodsRow(rowData,sectionId,rowId){

        var remarks = '暂无补充'
        if(rowData.remarks!=null && rowData.remarks!='')remarks=rowData.remarks

        var row=(
            <View>
                <View style={{flex:3,padding:10,flexDirection:'row'}}>
                    <View style={{flex:1}}><Image resizeMode="contain" style={{ width:90,height:90}} source={{uri:rowData.thumburl}} /></View>
                    <View style={{flex:1,flexDirection:'column',alignItems:'flex-start'}}>
                        <Text style={{fontSize:15,color:'#222'}}>{rowData.name}</Text>
                        <Text style={{fontSize:13,color:'#888',marginTop:5}}>{rowData.type}</Text>
                        <View style={{backgroundColor:'#fc6254',padding:3,marginTop:5}}><Text style={{fontSize:12,color:'#fff'}}>折扣 {rowData.discount/100}</Text></View>
                        <Text style={{fontSize:12,color:'#888',marginTop:10}}>{remarks}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'column',alignItems:'flex-end'}}>
                        <Text style={{fontSize:15,color:'#222'}}>￥{rowData.goodsprice/100}</Text>
                        <Text style={{fontSize:13,color:'#888',marginTop:5}}>x{rowData.goodsnumber}</Text>
                    </View>
                </View>
                <View style={{height:1,width:width,backgroundColor:'#eee'}}/>
            </View>
        );

        return row;
    }

    renderRow(rowData, sectionId, rowId) {

        var status = '交易待确认';
        if(rowData.status==1)status='交易成功';

        var goodsListView = null;
        var goodsList = rowData.goods;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (goodsList !== undefined && goodsList !== null && goodsList.length > 0) {
            goodsListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(goodsList)}
                    renderRow={this.renderGoodsRow.bind(this)}
                />
            );
        }

        // 参考淘宝订单界面
        return (
        <TouchableOpacity
            style={{flexDirection:'column',marginTop:10,backgroundColor:'#fff'}}
            onPress={()=>{
                this.navigate2OrderDetail(rowData)
            }}>

            {/*购买者+状态*/}
            <View style={{flex:1,padding:10,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Ionicons name='md-person' size={15} color="#fca482"/>
                <View style={{flex:1,marginLeft:10}}><Text style={{fontSize:12,color:'#666'}}>{rowData.personName}</Text></View>
                <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}><Text style={{color:'#333'}}>{status}</Text></View>
            </View>

            {/*略缩图+简介+规格+价格+数量*/}
            {goodsListView}

            <View style={{height:1,width:width,backgroundColor:'#eee'}}/>

            {/*合计*/}
            <View style={{flex:1,padding:10,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                <Text style={{color:'#333',fontSize:13}}>共{rowData.number}件商品 合计:</Text>
                <Text style={{color:'red',fontSize:17}}> {rowData.sum/100} </Text>
                <Text style={{color:'#333',fontSize:13}}>元</Text>
            </View>

            <View style={{height:1,width:width,backgroundColor:'#eee'}}/>

            {/*确认订单按钮*/}
            {
                rowData.status==1?null:
                <View style={{
                    flex: 1,
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity style={{backgroundColor: '#fc6254', padding: 5, paddingHorizontal: 15}}
                    onPress={()=>{
                        this.checkOrder(rowData.orderId)
                    }}>
                        <Text style={{color: '#fff', fontSize: 13,}}>确认</Text></TouchableOpacity>
                </View>
            }
            <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

        </TouchableOpacity>
    )}

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    render() {
        var uncheckedOrderListView=null;
        var uncheckedOrderList = this.state.uncheckedOrderList;

            var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (uncheckedOrderList !== undefined && uncheckedOrderList !== null && uncheckedOrderList.length > 0)
            {
                uncheckedOrderListView = (
                    <View><ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds1.cloneWithRows(uncheckedOrderList)}
                        renderRow={this.renderRow.bind(this)}
                    /></View>
                );
            }
            else{
                uncheckedOrderListView=(
                    <View style={{width:width,height:height,alignItems:'center',justifyContent:'center'}}><Text>已加载完毕</Text></View>
                )
            }

        var checkedOrderListView=null;
        var checkedOrderList = this.state.checkedOrderList;

        var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (checkedOrderList !== undefined && checkedOrderList !== null && checkedOrderList.length > 0)
        {
            checkedOrderListView = (
                <View><ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds2.cloneWithRows(checkedOrderList)}
                    renderRow={this.renderRow.bind(this)}
                /></View>
            );
        }else{
            checkedOrderListView=(
                <View style={{width:width,height:height,alignItems:'center',justifyContent:'center'}}><Text>已加载完毕</Text></View>
            )
        }

        return (

        <View style={styles.container}>
            <Toolbar width={width} title="订单列表" actions={[]} navigator={this.props.navigator}>
                    {
                        <View style={{flex:1,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingBottom:5,}}>
                            <IndicatorViewPager
                                style={{flex:1,flexDirection: 'column-reverse'}}
                                indicator={this._renderTitleIndicator()}
                                onPageScroll={this._onPageScroll.bind(this)}
                            >
                                {uncheckedOrderListView}
                                {checkedOrderListView}
                            </IndicatorViewPager>
                        </Animated.View>
                        </View>
                    }

                {/*loading模态框*/}
                <Modal animationType={"fade"} transparent={true} visible={this.state.showProgress}>
                    <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                      onPress={()=>{
                                          //TODO:cancel this behaviour

                                      }}>
                        <View style={{width:width*2/3,height:80,backgroundColor:'transparent',position:'relative',
                            justifyContent:'center',alignItems:'center',borderRadius:6}}>
                            <ActivityIndicator
                                animating={true}
                                style={{marginTop:10,height: 40,position:'absolute',transform: [{scale: 1.6}]}}
                                size="large"
                            />
                            <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                <Text style={{color:'#666',fontSize:13}}>
                                    加载中...
                                </Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                </Toolbar>
            </View>
        )
    }

    _renderTitleIndicator () {
        return (
            <PagerTitleIndicator
                style={styles.indicatorContainer}
                trackScroll={true}
                itemTextStyle={styles.indicatorText}
                itemStyle={{width:width/2}}
                selectedItemStyle={{width:width/2}}
                selectedItemTextStyle={styles.indicatorSelectedText}
                selectedBorderStyle={styles.selectedBorderStyle}
                titles={['待确认', '已确认']}
            />
        )
    }

    _onPageScroll (scrollData) {
        let {offset, position} = scrollData
        if (position < 0 || position > 1) return
    }

    componentDidMount()
    {
        this.fetchOrderList()
    }

    componentWillUnmount(){
    }

    fetchOrderList(){

        Proxy.postes({
            url: Config.server + '/func/node/fetchOrderList',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
            }
        }).then((json)=>{

            var orderList = [];
            if(json.data!=null)orderList = json.data;
            var uncheckedOrderList = [];
            var checkedOrderList = [];

            for(var i=0;i<orderList.length;i++) {
                var order = orderList[i];
                switch (order.status) {
                    case 1:
                        checkedOrderList.push(order);
                        break;
                    case 0:
                        uncheckedOrderList.push(order);
                        break;
                }

                this.setState({orderList:orderList,uncheckedOrderList:uncheckedOrderList,checkedOrderList:checkedOrderList,showProgress:false})
            }
        }).catch((e)=>{
        })
    }

    checkOrder(orderId){
        Proxy.postes({
            url: Config.server + '/func/node/checkOrder',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderId:orderId
            }
        }).then((json)=>{
            if(json.re==1){
                this.fetchOrderList()
            }
        }).catch((e)=>{})
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: 14
    },
    indicatorContainer: {
        backgroundColor: '#66CDAA',
        height: 48
    },
    indicatorText: {
        fontSize: 14,
        color: 0xFFFFFF99
    },
    indicatorSelectedText: {
        fontSize: 14,
        color: 0xFFFFFFFF
    },
    selectedBorderStyle: {
        height: 3,
        backgroundColor: 'white'
    },
    statusBar: {
        height: 24,
        backgroundColor: 0x00000044
    },
    toolbarContainer: {
        height: 56,
        backgroundColor: 0x00000020,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    backImg: {
        width: 16,
        height: 17
    },
    titleTxt: {
        marginLeft: 36,
        color: 'white',
        fontSize: 20
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'transparent'
    },
});

module.exports = connect(state=>({
        userType: state.user.user.usertype,
        creatorId:state.user.personInfo.personId
    })
)(OrderList);