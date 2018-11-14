import React, {Component} from 'react';
import {
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
    InteractionManager,
    Button,
    Platform,
    DeviceEventEmitter, // android
    NativeAppEventEmitter, // ios
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_SORT} from 'react-native-toolbar-wrapper';
import{
    fetchPayment,
    onPaymentUpdate,
    fetchAllPayment,
    enablePaymentsOnFresh,
    disablePaymentsOnFresh,
    fetchAllPaymentByTime,
    fetchCoursePayment,
    fetchActivityPayment,
    fetchFirstAllPayment
} from '../../action/MyProfitActions';
import {
    getAccessToken,
    fetchClubList
} from '../../action/UserActions';
import Calendar from 'react-native-calendar-select';
import {fetchGoodsProfits} from '../../action/MyProfitActions'

const {height, width} = Dimensions.get('window');
var Popover = require('react-native-popover');
var Overlay = require('react-native-overlay')

class ProfitList extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
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
        }.bind(this), 500);

        this.props.dispatch(enablePaymentsOnFresh());
    }

    closePopover() {//关闭搜索方式
        this.setState({menuVisible: false});
    }

    showPopover(ref) {
            this.setState({
                menuVisible: true,
                buttonRect: {x: width-100, y: 20, width: 100, height: 40},
                displayArea: {x: width-100, y: 20 + 40, width: 100 + 40, height: 40 + 40},
            });
    }

    renderRow_sort(rowData,sectionId, rowId) {
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.closePopover();
                    this.onSortSelect(rowId,rowData);
                }}>

                    <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                        <Text style={{fontSize: 13,color:'#343434'}}>
                            {rowData}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    onSortSelect(idx, value) {
        var payments = this.state.payments;

        switch (idx)
        {
            case '0':
                //时间升序
                payments.sort(function(a,b){
                    if(a.timeCompletion>b.timeCompletion)return 1
                    else return -1})
                break;
            case '1':
                //时间降序
                payments.sort(function(a,b){
                    if(a.timeCompletion>b.timeCompletion)return -1
                    else return 1})
                break;
            case '2':
                //价格升序
                payments.sort(function(a,b){
                    return a.payment-b.payment});
                break;
            case '3':
                //价格降序
                payments.sort(function(a,b){
                    return b.payment-a.payment});
                break;
        }

        this.setState({payments:payments})
    }

    constructor(props) {
        super(props);
        this.state={
            total:300,
            //本月的收益和筛选过日期的收益
            //rowData{avatar,perName,clubName,orderNum,timeCompletion,payment,type}
            payments:[],
            allPayments:[],

            showDropDown:false,
            sortList:['按时间升序↑','按时间降序↓','按价格升序↑','按价格降序↓'],

            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),

            nowDate:new Date().getTime(),
            startDate: new Date(new Date().getTime() - 7*24*3600*1000),
            endDate: new Date(),
            currentDate:'本月',

            menuVisible:false,
        };
        this.confirmDate = this.confirmDate.bind(this);
        this.openCalendar = this.openCalendar.bind(this);
    }

    confirmDate({startDate, endDate, startMoment, endMoment}) {
        this.setState({
            startDate,
            endDate
        });

        var startTime = startDate.getMonth()+1+'月'+startDate.getDate()+'日';
        var endTime = endDate.getMonth()+1+'月'+endDate.getDate()+'日';
        var currentTime = startTime+'~'+endTime;

        var dataList=[];
        var allPayments = this.state.allPayments;

        var Syear = startDate.getFullYear();
        var Smonth = (startDate.getMonth()+1)<10?'0'+(startDate.getMonth()+1):(startDate.getMonth()+1)+'';
        var Sdate = startDate.getDate()<10?'0'+ startDate.getDate():startDate.getDate()+'';
        var Eyear = endDate.getFullYear();
        var Emonth = (endDate.getMonth()+1)<10?'0'+(endDate.getMonth()+1):(endDate.getMonth()+1)+'';
        var Edate = endDate.getDate()<10?'0'+ endDate.getDate():endDate.getDate()+'';
        var startTimeStr = Syear+'-'+Smonth+'-'+Sdate+' 00:00:00'
        var endTimeStr = Eyear+'-'+Emonth+'-'+Edate+' 23:59:59'

        for(var i=0;i<allPayments.length;i++){
            var p = allPayments[i];
            if(p.timeCompletion>=startTimeStr && p.timeCompletion<=endTimeStr)dataList.push(p);
        }

                var sum = 0;
                for(i=0;i<dataList.length;i++){
                    sum+=dataList[i].payment;
                }

                //时间降序
                dataList.sort(function(a,b){
                    if(a.timeCompletion>b.timeCompletion)return -1
                    else return 1})

                this.setState({total:sum,currentDate:currentTime,payments:dataList})
    }

    openCalendar() {
        this.calendar && this.calendar.open();
    }

    fetchAllPays(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchGoodsProfits()).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disablePaymentsOnFresh());

            //{personName:'陈海云',personId:726,orderNum:'19961029',clubName:'山体',clubId:1,
            //timeCompletion:'2018-10-10 08:44:23',payment:12000,
            //avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIv3gkJ4uclR4jhNGBibZicnZL68p4Kw5icyTRgSNGibqGBsWAEzLHA1SfoKMlVeoHj9ZT65vWGaWDiahg/132'},

            var total = 0;
            var payments = json.data;

            if (payments !== undefined && payments !== null ) {
                for (var i = 0; i < payments.length; i++)total += payments[i].payment;

                //时间降序
                payments.sort(function (a, b) {
                    if (a.timeCompletion > b.timeCompletion)return -1
                    else return 1
                })
            }

            this.setState({doingFetch:false,isRefreshing:false,payments:payments,allPayments:payments,total:total})
        }).catch((e)=>{
            this.props.dispatch(disablePaymentsOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }

    renderRow(rowData, sectionId, rowId) {

            return (
            <View style={{height: 80, flexDirection: 'row', alignItems: 'center', paddingVertical: 15, backgroundColor: '#fff',borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgb(194,194,198)',}}>
                <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
                <Image
                    style={{width: 40, height: 40,borderRadius:20}}
                    source={{uri:rowData.avatar}}
                    resizeMode="stretch"
                />
                </View>

                <View style={{ flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start',flex:3,paddingRight: 10,marginLeft:5,}}>
                    <View style={{justifyContent: 'center',alignItems: 'flex-start', flex:1,flexDirection:'column'}}>
                        <Text style={{color: '#2c2c2c', marginBottom: 10,fontSize:15}} numberOfLines={1}>
                            {rowData.personName} 在 {rowData.clubName} 支出
                        </Text>
                        <Text style={{color: '#666',fontSize: 13, marginBottom: 3}}>
                            订单编号：{rowData.orderNum}
                        </Text>
                        {rowData.timeCompletion==null?null:
                            <Text style={{color: '#666',fontSize: 12}}>
                                {rowData.timeCompletion.substring(0,4)}年{rowData.timeCompletion.substring(5,7)}月{rowData.timeCompletion.substring(8,10)}日 {rowData.timeCompletion.substring(11,13)}:{rowData.timeCompletion.substring(14,16)}:{rowData.timeCompletion.substring(17,19)}
                            </Text>
                        }
                    </View>
                </View>

                <View style={{alignItems:'center',flex:1,marginRight:10,flexDirection:'row',justifyContent:'flex-end'}}>
                    <Text style={{fontSize:18,color:'#fc3c3f'}}>{rowData.payment/100}</Text>
                    <Text style={{fontSize:18,color:'#2c2c2c'}}>元</Text>
                </View>

            </View>
        )
    }

    render()
    {
        var data = this.state.sortList;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var sortList =
            <ScrollView>
                <ListView
                    dataSource={ds.cloneWithRows(data)}
                    renderRow={this.renderRow_sort.bind(this)}
                />
            </ScrollView>;

        let customI18n = {
            'w': ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            'weekday': ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
            'text': {
                'start': '起始日期',
                'end': '结束日期',
                'date': '日期',
                'save': '确认',
                'clear': '重置'
            },
            'date': 'DD / MM'  // date format
        };
        // optional property, too.
        let color = {
            subColor: '#f0f0f0'
        };

        var paymentsListView=null;
        var {paymentsOnFresh}=this.props;

        if(paymentsOnFresh==true)
        {
            if(this.state.doingFetch==false) {
                //筛选获得本月的账单,并按照最近排序
                this.fetchAllPays();
            }
        }else{
            var payments = this.state.payments;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (payments !== undefined && payments !== null )
            {
                paymentsListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        //列表中数据
                        dataSource={ds.cloneWithRows(payments)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        return (
            <View style={styles.container}>

                <Toolbar ref="menu" width={width} title="商品收益" navigator={this.props.navigator} actions={[{icon:ACTION_SORT,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 if(Platform.OS=='ios')
                                 this.showPopover('menu');
                             }
                         }}>

                    <View
                        style={[styles.viewWrapper, {zIndex: 1},{borderBottomWidth: StyleSheet.hairlineWidth}]}>
                        <View style={styles.viewCell}>
                            <Text style={{marginRight:5,fontSize:16,color:'#2c2c2c',marginTop:8}}>{this.state.currentDate}</Text>
                            <Text style={{marginRight:5,fontSize:12,color:'#666',marginTop:5}}>收入 ￥{this.state.total/100}</Text>
                        </View>
                        <TouchableOpacity style={{width: 22, height: 22, alignItems:'flex-end'}} onPress={this.openCalendar}>
                        <Image
                            style={{width: 22, height: 22, alignItems:'flex-end'}}
                            source={require('../../../img/canlendar.png')}
                        />
                        </TouchableOpacity>
                        <Calendar
                            i18n="en"
                            ref={(calendar) => {this.calendar = calendar;}}
                            customI18n={customI18n}
                            color={color}
                            format="YYYYMMDD"
                            minDate="20180101"
                            maxDate="20190101"
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onConfirm={this.confirmDate}
                        />
                    </View>

                    {<View style={{flex:5,backgroundColor:'#fff'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-200,paddingTop:5,paddingBottom:5,}}>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                        tintColor="#9c0c13"
                                        title="刷新..."
                                        titleColor="#9c0c13"
                                        colors={['#ff0000', '#00ff00', '#0000ff']}
                                        progressBackgroundColor="#ffff00"
                                    />
                                }
                            >
                                {paymentsListView}
                                {
                                    paymentsListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>

                        </Animated.View>
                    </View>}

                </Toolbar>

                <Popover
                    isVisible={this.state.menuVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={this.state.displayArea}
                    placement="bottom"
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <View style={{height: 140}}>
                        {sortList}
                    </View>
                </Popover>

            </View>
        )

    }

    componentWillUnmount()
    {
        this.props.dispatch(enablePaymentsOnFresh());
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection:'column',
    },
    viewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        height: 50,
        borderBottomColor: '#cdcdcd',
    },
    viewCell: {
        height: 50,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    paymentItem: {

    },
    paymentWrapper: {

    },
    flexContainer: {
        flexDirection: 'row',
    },
});

module.exports = connect(state=>({

        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        clubId:state.user.personInfoAuxiliary.clubId,

        payments:state.myprofit.payments,
        paymentsOnFresh:state.myprofit.paymentsOnFresh,
    })
)(ProfitList);