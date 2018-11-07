import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    TextInput,
    BackAndroid,
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import CountDownTimer from 'react_native_countdowntimer'
import GridView from 'react-native-super-grid'
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import Config from "../../../config";
import Proxy from "../../utils/Proxy";
import ViewPager from 'react-native-viewpager';
import Ionicons from 'react-native-vector-icons/Ionicons'
import proxy from "../../utils/Proxy";
import Echarts from 'native-echarts';
import DatePicker from 'react-native-datepicker';
import GoodsList from './GoodsList'
import ScannerList from './ScannerList'

var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');

class MallPage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2goodsList(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'GoodsList',
                component: GoodsList,
                params: {

                }
            })
        }
    }

    navigate2ScannerList()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ScannerList',
                component: ScannerList,
                params: {
                }
            })
        }
    }

    _onRefresh() {
        this.setState({isRefreshing: true, fadeAnim: new Animated.Value(0)});

        setTimeout(function () {
            this.setState({
                isRefreshing: false,
            });
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bounce
                },           // Configuration
            ).start();
        }.bind(this), 3000);
    }

    constructor(props) {
        super(props);
        this.state={
            itemList:[
                {'title':'库存','icon':require('../../../img/kucun.png')},
                {'title':'订单','icon':require('../../../img/dingdan.png')},
                {'title':'收益','icon':require('../../../img/shouyi.png')},
                {'title':'收银台','icon':require('../../../img/shouyintai.png')},],

            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            noticeFresh:true,
            doingFetch:false,

            currentDate:'2018年9月1日',

            //收益消息列表[]
            notices:[
                {personName:'陈海云',goodName:'球拍',payment:50,detailTime:'2018-10-10 19:20:55'},
                {personName:'邓养吾',goodName:'球鞋',payment:400,detailTime:'2018-11-11 08:00:00'},
            ],

            noticeHeight:130,
            noticeWrapperHeight:160,
            addTimes:1,

            chartInfo:null,
            timeList:['8点前','8','9','10','11','12','13','14','15','16','17','18','19','20点后'],
            chartWidth : width,
            option:null,

            //截至目前账单折线图
            goodsList:[0,8,3,1,7,9,0,0,2,2,8,5,4,6],

        };
    }

    render(){

        var NoticesListView = null;
        var notices = this.state.notices;
        var option = {
            title: {
            },
            tooltip: {trigger:'axis'},
            legend: {
                data:['总收益']
            },
            xAxis: {
                boundaryGap:true,
                type : 'category',
                name : '时间',
                data: this.state.timeList,
            },
            yAxis: {
                name:'金额/元',
                type:'value'
            },
            color:['#fc6254'],
            series: [
                {name:'总收益',type:'line',data:this.state.goodsList},
            ]
        }

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (notices !== undefined && notices !== null && notices.length > 0)
        {
            NoticesListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    //列表中数据
                    dataSource={ds.cloneWithRows(notices)}
                    renderRow={this.renderNoticesRow.bind(this)}
                />
            );
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="商城" actions={[]} navigator={this.props.navigator}>

                    <ScrollView style={{flex:1,height:height,width:width,backgroundColor:'#fff',flexDirection:'column'}}>

                        {/*功能栏*/}
                        <View style={{height:width/4+10,width:width,alignItems:'center',justifyContent:'center'}}>
                            <GridView
                                itemDimension={width/4-20}
                                items={this.state.itemList}
                                style={styles.gridView}
                                renderItem={this.renderRow.bind(this)}
                            />
                        </View>

                        {/*统计*/}
                            <View
                                style={[styles.viewWrapper, {marginTop: 5}]}>
                                <View style={{ flex:1,flexDirection: 'row',alignItems: 'center',}}>
                                    <Text style={{marginRight: 5, fontSize: 14,color: '#666'}}>{this.state.currentDate}</Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <View style={{
                                        height: 35,
                                        marginRight: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <DatePicker
                                            style={{width: 60, marginLeft: 0, borderWidth: 0}}
                                            customStyles={{
                                                placeholderText: {color: 'transparent', fontSize: 12},
                                                dateInput: {height: 30, borderWidth: 0},
                                                dateTouchBody: {marginRight: 0, height: 25, borderWidth: 0},
                                            }}
                                            mode="date"
                                            placeholder="选择"
                                            format="YYYY年MM月DD日"
                                            minDate={"2018年01月01日"}
                                            confirmBtnText="确认"
                                            cancelBtnText="取消"
                                            showIcon={true}
                                            iconComponent={<Ionicons name='md-time' size={20} color="#666"/>}
                                            onDateChange={(date) => {
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/*图表卡片*/}
                            <View style={{marginTop:5,height:320,width:this.state.chartWidth,padding:10,justifyContent:'center',alignItems:'center',}}>
                                <View style={{height:300,width:this.state.chartWidth-40,backgroundColor:'#fff',borderRadius:15,justifyContent:'center',alignItems:'center',}}>
                                    <Echarts option={option} height={300} width={this.state.chartWidth-40} ref={e => this.chart = e}/>
                                </View>
                            </View>

                            <View
                                style={[styles.viewWrapper,]}>
                                <View style={{ flex:1,flexDirection: 'row',alignItems: 'center',}}>
                                    <Text style={{marginRight: 5, fontSize: 14,color: '#666'}}>消息列表</Text>
                                </View>
                            </View>

                            {/*消息列表*/}
                            <View style={{width:width,justifyContent:'center',alignItems:'center',}}>
                                <View style={{width:width,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',padding:10}}>
                                    {NoticesListView}
                                </View>
                            </View>

                    </ScrollView>
                </Toolbar>
            </View>
        );
    }

    renderRow(rowData,rowId)
    {
        return(
            <TouchableOpacity style={{height:width/4,width:width/4-20,flexDirection:'column'}}
                              onPress={()=>{
                                  switch(rowId){
                                      case 0:this.navigate2goodsList();break;//库存
                                      case 1:break;//订单
                                      case 2:break;//收益
                                      case 3:this.navigate2ScannerList();break;//收银台
                                  }
                              }}
            >
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:60,width:60,padding:10,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{height:35,width:35}}
                               source={rowData.icon} resizeMode={'stretch'}/>
                    </View>
                    <Text style={{flex:1,marginTop:5,color:'#666',fontSize:13}}>{rowData.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderNoticesRow(rowData, sectionId, rowId) {
            return (
                <View style={{flex:1, flexDirection: 'row',alignItems: 'center',justifyContent:'center',backgroundColor: '#fff',
                    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#5c5c5c',}}>
                    <View style={{flexDirection: 'column',alignItems: 'center',justifyContent: 'center',width:width,height:35, paddingHorizontal: 10,}}>
                        <View style={{flex:1,justifyContent: 'center', flexDirection: 'row'}}>
                            <View style={{alignItems: 'center',justifyContent: 'center',flexDirection:'row'}}>
                            <Text style={{color: '#343434', fontSize: 14}} numberOfLines={1}>
                                {rowData.personName} 购买 {rowData.goodName} 共支出
                            </Text>
                            <Text style={{color: 'red', fontSize: 14}} numberOfLines={1}>
                                {rowData.payment}
                            </Text>
                            <Text style={{color: '#343434', fontSize: 14}} numberOfLines={1}>
                                元
                            </Text>
                            </View>
                            <View style={{flex:1,alignItems: 'flex-end',justifyContent: 'center',marginRight: 5}}>
                                <Text style={{fontSize: 12, color: '#5c5c5c'}}>{rowData.detailTime}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
    }

    componentWillMount(){

    }


    componentWillUnmount(){
    }
}

const styles = StyleSheet.create({
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight:'bold'
    },
    itemCode: {
        fontSize: 12,
        color: '#fff',
    },
    itemPlayer: {
        fontSize: 13,
        color: '#fff',
    },
    itemContainer: {
        flex:1,
        justifyContent: 'flex-end',
    },
    gridView: {
        flex: 1
    },
    container:{
        flex:1,
        backgroundColor:'#fff'
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
    },
    itemStyle:{
        height: 150,
        width:150,
        padding:5
    },
    cardItemTimeRemainTxt:{
        fontSize:13,
        color:'#666'
    },
    statisticsContainer: {
        flex: 1,
        flexDirection:'column',
        backgroundColor:'#eee'
    },
    siftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        height: 44,
        borderBottomColor: '#f5f5f5',
    },
    viewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#eee',
        height: 35,
        borderBottomColor: '#f5f5f5',
    },
    siftCell: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center'
    },
    viewCell: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    orderByFont: {
        fontSize: 18,
        marginRight: 5,
        color:'#eee'
    },
    orderByFontBold: {
        fontSize: 18,
        marginRight: 5,
        color:'#fff',
        fontWeight:'bold'
    },
    noticeItem: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#5c5c5c',
    },
    noticeWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        paddingHorizontal: 10,
    },
});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo

    const props = {
        username:state.user.user.username,
        perName:personInfo.perName,
        personId:personInfo.personId,
        wechat:personInfo.wechat,
        perIdCard:personInfo.perIdCard,
    }
    return props
}



export default connect(mapStateToProps)(MallPage);



