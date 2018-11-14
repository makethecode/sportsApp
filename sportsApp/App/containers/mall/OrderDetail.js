
import React,{Component} from 'react';
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
    Easing
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewPager from 'react-native-viewpager';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_QR_SCANNER,ACTION_BARCODE,ACTION_BOOK} from 'react-native-toolbar-wrapper'
import Ionicons from 'react-native-vector-icons/Ionicons';

var {height, width} = Dimensions.get('window');

class OrderDetail extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            // orderId:this.props.orderId,
            // order:{
            // //订单信息
            // personId:726,personName:'陈海云',personTel:'13866130667',personAvatar:'https://wx.qlogo.cn/mmopen/vi_32/wYAWGqDRRfxQRw8eWibZHxQt2BGtWVY2heQYjhkiaDqiaCjBGOWwaWOUHPiaOuk1BKka4SszEj2QcW7wBwmq1RicDCg/132',
            // creatorId:3,creatorName:'邹鹏教练',creatorTel:'15165062853',creatorAvatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIXPsVAeIvH4lxLtQXGpr2oXF4J6dpVJwMYCytibIcFfPEp5xicSLTm2Tmc0TZm4ZbKNyOAznvlt0Jg/132',
            // payType:'微信支付',orderNum:'199610291524',timeMakesure:'2018-11-11 08:30:30',timeCreate:'2018-11-11 08:00:00',status:1,sum:1000,number:2,
            // //商品信息
            //     goods:[
            //         {name:'一只球拍',brief:'球拍简介',thumburl:'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=2b22c90bb50e7bec23da04e71715de05/4b90f603738da9772b315b2fbd51f8198618e39c.jpg',
            //     type:'37码,黑色',price:100.00,number:3,discount:0.7,priceReal:210,},
            //         {name:'一双球鞋',brief:'球鞋简介',thumburl:'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=2b22c90bb50e7bec23da04e71715de05/4b90f603738da9772b315b2fbd51f8198618e39c.jpg',
            //     type:'L,粉红色',price:300.00,number:5,discount:0.9,priceReal:499.9,},
            // ]
            // },
            order:this.props.order
        }
    }

    renderRow(rowData,sectionId,rowId){

        var remarks = '暂无补充'
        if(rowData.remarks!=null && rowData.remarks!='')remarks=rowData.remarks

        var row=(
        <View>
            <View style={{flex:3,padding:10,flexDirection:'row'}}>
                <View style={{flex:1}}><Image resizeMode="contain" style={{ width:90,height:90}} source={{uri:rowData.thumburl}} /></View>
                <View style={{flex:1,flexDirection:'column',alignItems:'flex-start'}}>
                    <Text style={{fontSize:15,color:'#222'}}>{rowData.brief}</Text>
                    <Text style={{fontSize:13,color:'#888',marginTop:5}}>{rowData.type}</Text>
                    <View style={{backgroundColor:'#fc6254',padding:3,marginTop:5}}><Text style={{fontSize:12,color:'#fff'}}>折扣 {rowData.discount}</Text></View>
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

    render() {

        var order = this.state.order;
        var status = '';
        if(order.status==1)status='交易成功'
        else status='交易待确认'

        var goodsListView = null;
        var goodsList = this.state.order.goods;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (goodsList !== undefined && goodsList !== null && goodsList.length > 0) {
            goodsListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(goodsList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="订单详情" actions={[]} navigator={this.props.navigator}>
                <ScrollView style={{width:width,height:height,backgroundColor:'#eee'}}>

                        <View style={{paddingVertical:18,backgroundColor:'#fc6254',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}><Text style={{color:'#fff',fontSize:16}}>{status}</Text></View>
                            <View style={{flex:2}}/>
                            <View style={{flex:1}}><Image source={require('../../../img/jiaoyi.png')} style={{width:42,height:42}} resizeMode={'stretch'}/></View>
                        </View>

                    {/*订单相关人*/}
                    <View style={{marginTop:1,padding:5,backgroundColor:'#eee'}}>
                        {/*支付人*/}
                        <View style={{marginTop:1,padding:10,backgroundColor:'#fff',flexDirection:'row'}}>
                            <View style={{flex:1,jusifyContent:'center'}}>
                                <Image source={{uri:order.personAvatar}} style={{width:35,height:35,borderRadius:17}} resizeMode={"stretch"} />
                            </View>

                            <View style={{flex:5,jusifyContent:'center',alignItems:'flex-start',flexDirection:'column'}}>
                                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                    <Ionicons name='md-person' size={12} color="#fca482"/>
                                    <Text style={{fontSize:14,color:'#333',marginLeft:5}}>{order.personName}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:2}}>
                                    <Ionicons name='md-call' size={12} color="#fca482"/>
                                    <Text style={{fontSize:12,color:'#999',marginLeft:5}}>{order.personTel}</Text>
                                </View>
                            </View>

                            <View style={{flex:1,jusifyContent:'center',alignItems:'center',}}>
                                <View style={{borderWidth:1,borderColor:'#fca482',padding:3}}>
                                    <Text style={{fontSize:12,color:'#fca482'}}>付款方</Text></View>
                            </View>
                        </View>
                        {/*上传人*/}
                        <View style={{marginTop:1,padding:10,backgroundColor:'#fff',flexDirection:'row'}}>
                            <View style={{flex:1,jusifyContent:'center'}}>
                                <Image source={{uri:order.creatorAvatar}} style={{width:35,height:35,borderRadius:17}} resizeMode={"stretch"} />
                            </View>

                            <View style={{flex:5,jusifyContent:'center',alignItems:'flex-start',flexDirection:'column'}}>
                                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                    <Ionicons name='md-person' size={12} color="#fca482"/>
                                    <Text style={{fontSize:14,color:'#333',marginLeft:5}}>{order.creatorName}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:2}}>
                                    <Ionicons name='md-call' size={12} color="#fca482"/>
                                    <Text style={{fontSize:12,color:'#999',marginLeft:5}}>{order.creatorTel}</Text>
                                </View>
                            </View>

                            <View style={{flex:1,jusifyContent:'center',alignItems:'center',}}>
                                <View style={{borderWidth:1,borderColor:'#fca482',padding:3}}>
                                    <Text style={{fontSize:12,color:'#fca482'}}>收款方</Text></View>
                            </View>
                        </View>
                    </View>

                    {/*订单详情*/}
                    <View style={{padding:5,paddingTop:0,backgroundColor:'#eee'}}>
                        <View style={{flexDirection:'column',marginTop:4,backgroundColor:'#fff'}}>

                            {/*购买者+状态*/}
                            <View style={{flex:1,padding:10,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                <Ionicons name='md-person' size={15} color="#fca482"/>
                                <View style={{flex:1,marginLeft:10}}><Text style={{fontSize:12,color:'#666'}}>{order.personName}</Text></View>
                                <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}><Text style={{color:'#333'}}>{status}</Text></View>
                            </View>

                            {goodsListView}

                            {/*合计*/}
                            <View style={{flex:1,padding:10,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                <Text style={{color:'#333',fontSize:13}}>共{order.number}件商品 合计:</Text>
                                <Text style={{color:'red',fontSize:17}}> {order.sum/100} </Text>
                                <Text style={{color:'#333',fontSize:13}}>元</Text>
                            </View>
                        </View>
                    </View>

                    {/*支付情况*/}
                    <View style={{marginTop:2,backgroundColor:'#fff',marginBottom:20}}>
                        <View style={{padding:10,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <View style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}><Text style={{color:'#666',fontSize:14}}>实际付款</Text></View>
                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}><Text style={{color:'#222',fontSize:16}}>￥{order.sum/100}</Text></View>
                        </View>
                        <View style={{height:1,width:width,backgroundColor:'#eee'}}/>

                        <View style={{padding:10,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <View style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}><Text style={{color:'#666',fontSize:14}}>下单时间</Text></View>
                                <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}><Text style={{color:'#222',fontSize:14}}>{order.timeOrder}</Text></View>
                        </View>
                        <View style={{height:1,width:width,backgroundColor:'#eee'}}/>

                        <View style={{padding:10,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <View style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}><Text style={{color:'#666',fontSize:14}}>完成时间</Text></View>
                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}><Text style={{color:'#222',fontSize:14}}>{order.timeCompletion}</Text></View>
                        </View>
                        <View style={{height:1,width:width,backgroundColor:'#eee'}}/>

                        <View style={{padding:10,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <View style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}><Text style={{color:'#666',fontSize:14}}>订单编号</Text></View>
                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}><Text style={{color:'#222',fontSize:14}}>{order.orderNum}</Text></View>
                        </View>
                        <View style={{height:1,width:width,backgroundColor:'#eee'}}/>
                    </View>

                </ScrollView>
                </Toolbar>
            </View>
        );
    }

    componentDidMount(){

    }

}

var styles = StyleSheet.create({

});

const mapStateToProps = (state, ownProps) => {

    const props = {

    }
    return props
}

export default connect(mapStateToProps)(OrderDetail);


