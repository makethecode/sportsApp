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
import CoachDetail from '../course/CoachDetail'
import {PricingCard} from 'react-native-elements'
import {fetchCoursesByCreatorId, onCoursesOfCoachUpdate} from "../../action/CourseActions";
import CompetitionSignUp from "../competition/CompetitionSignUp";
import DetailProfit from './DetailProfit';
import MyVenueProfit from './MyVenueProfit';
import ModalDropdown from 'react-native-modal-dropdown';
import ProfitAssortFilter from '../../utils/ProfitAssortFilter'
import Calendar from 'react-native-calendar-select';
import {
    fetchMaintainedVenue
} from '../../action/MapActions';

const {height, width} = Dimensions.get('window');
const dropdownWidth = width/3;
var Popover = require('react-native-popover');
var Overlay = require('react-native-overlay')

class Myprofit extends Component {

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
                    if(a.timeMakesure>b.timeMakesure)return 1
                    else return -1})
                break;
            case '1':
                //时间降序
                payments.sort(function(a,b){
                    if(a.timeMakesure>b.timeMakesure)return -1
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

    navigateDetailProfit()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'DetailProfit',
                component: DetailProfit,
                params: {
                    payments:this.state.payments,
                    total:this.state.total,
                }
            })
        }
    }

    navigate2MyVenueProfit(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MyVenueProfit',
                component: MyVenueProfit,
                params: {

                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state={
            total:0,
            //本月的收益和筛选过日期的收益
            payments:[],

            showDropDown:false,
            sortList:['按时间升序↑','按时间降序↓','按价格升序↑','按价格降序↓'],

            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),

            nowDate:new Date().getTime(),
            startDate: new Date(new Date().getTime() - 7*24*3600*1000),
            endDate: new Date(),
            currentDate:'本月',

            typeId:-1,//1活动2课程3商品

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

        var resList=[];

        this.props.dispatch(fetchAllPaymentByTime(startDate,endDate)).then((json)=>{
            if(json.re==1)
            {
                var dataList = json.data;
                var sum = 0;
                for(i=0;i<dataList.length;i++){
                    sum+=dataList[i].payment;
                }

                //时间降序
                dataList.sort(function(a,b){
                    if(a.timeMakesure>b.timeMakesure)return -1
                    else return 1})

                this.setState({total:sum,currentDate:currentTime,payments:dataList});
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }
            }
        })
    }

    openCalendar() {
        this.calendar && this.calendar.open();
    }

    fetchAllPays(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchAllPayment()).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disablePaymentsOnFresh());
            var total = 0;
            var payments = json.data;

            for(i=0;i<json.data.length;i++)total += payments[i].payment;

            //时间降序
            payments.sort(function(a,b){
                if(a.timeMakesure>b.timeMakesure)return -1
                else return 1})

            this.setState({doingFetch:false,isRefreshing:false,payments:payments,total:total})
        }).catch((e)=>{
            this.props.dispatch(disablePaymentsOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }

    renderRow(rowData, sectionId, rowId) {

        //perName,name,avatar,outTradeNo,timeMakesure,payment,typeId

        var type = ''

        switch(rowData.typeId){
            case 1:type='活动';break;
            case 2:type='课程';break;
            case 3:type='商品';break;
        }

            return (
            <View style={styles.paymentItem}>
                <Image
                    style={{width: 30, height: 30, marginHorizontal: 15 }}
                    source={{uri:rowData.avatar}}
                    resizeMode="stretch"
                />
                <View style={styles.paymentWrapper}>
                    <View style={{justifyContent: 'center', width: width - 60 - 80,flexDirection:'column'}}>
                        <Text style={{color: '#2c2c2c', marginBottom: 10,fontSize:14}} numberOfLines={1}>
                            {rowData.perName} 在 {rowData.name} 支出
                        </Text>
                        <Text style={{color: '#666',fontSize: 12, marginBottom: 3}}>
                            账单号：{rowData.outTradeNo}
                        </Text>
                        {rowData.timeMakesure==null?null:
                            <Text style={{color: '#666',fontSize: 12}}>
                                {rowData.timeMakesure.substring(0,4)}年{rowData.timeMakesure.substring(5,7)}月{rowData.timeMakesure.substring(8,10)}日 {rowData.timeMakesure.substring(11,13)}:{rowData.timeMakesure.substring(14,16)}:{rowData.timeMakesure.substring(17,19)}
                            </Text>
                        }
                    </View>
                    <View style={{alignItems:'flex-end',marginRight:10,flexDirection:'row'}}>
                        <Text style={{fontSize:18,color:'#fc3c3f'}}>{rowData.payment} </Text>
                        <Text style={{fontSize:18,color:'#2c2c2c'}}>元</Text>
                    </View>
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
        var {payments,paymentsOnFresh,total}=this.props;

        if(paymentsOnFresh==true)
        {
            if(this.state.doingFetch==false) {
                //筛选获得本月的账单,并按照最近排序
                this.fetchAllPays();
            }
        }else{
            var payments = this.state.payments;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (payments !== undefined && payments !== null && payments.length > 0)
            {
                var paymentsAfterFilter = ProfitAssortFilter.filter(payments,this.state.typeId)
                paymentsListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        //列表中数据
                        dataSource={ds.cloneWithRows(paymentsAfterFilter)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        return (
            <View style={styles.container}>

                <Toolbar ref="menu" width={width} title="收益" navigator={this.props.navigator} actions={[{icon:ACTION_SORT,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 if(Platform.OS=='ios')
                                 this.showPopover('menu');
                             }
                         }}>

                    <View style={{width:width,height:1,backgroundColor:'#fff'}}/>
                    <View style={styles.flexContainer}>
                            <TouchableOpacity
                                style={{ width:dropdownWidth-1, backgroundColor:'#66CDAA',alignItems:'center',height:35,justifyContent:'center',flexDirection:'row',}}
                                onPress={()=>{
                                    this.setState({typeId:1})//活动
                                }}>
                                <Text style={{fontSize: 14,textAlign: 'center',color:'#fff',justifyContent:'center',}}>
                                    活动
                                </Text>
                            </TouchableOpacity>

                        <View style={{width:1,backgroundColor:'#fff'}}/>

                        <TouchableOpacity
                            style={{ width:dropdownWidth-1, backgroundColor:'#66CDAA',alignItems:'center',height:35,justifyContent:'center',flexDirection:'row',}}
                            onPress={()=>{
                                this.setState({typeId:2})//活动
                            }}>
                            <Text style={{fontSize: 14,textAlign: 'center',color:'#fff',justifyContent:'center',}}>
                                课程
                            </Text>
                        </TouchableOpacity>

                        <View style={{width:1,backgroundColor:'#fff'}}/>

                        <TouchableOpacity
                            style={{ width:dropdownWidth-1, backgroundColor:'#66CDAA',alignItems:'center',height:35,justifyContent:'center',flexDirection:'row',}}
                            onPress={()=>{
                                this.setState({typeId:3})//活动
                            }}>
                            <Text style={{fontSize: 14,textAlign: 'center',color:'#fff',justifyContent:'center',}}>
                                商品
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{width:width,height:1,backgroundColor:'#fff'}}/>

                    <View
                        style={[styles.viewWrapper, {zIndex: 1},{borderBottomWidth: StyleSheet.hairlineWidth}]}>
                        <View style={styles.viewCell}>
                            <Text style={{marginRight:5,fontSize:16,color:'#2c2c2c',marginTop:8}}>{this.state.currentDate}</Text>
                            <Text style={{marginRight:5,fontSize:12,color:'#666',marginTop:5}}>收入 ￥{this.state.total}.00</Text>
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

    componentDidMount() {

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
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    paymentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(194,194,198)',
        height: 80,
        width: width - 60,
        paddingRight: 10,
        marginLeft:5,
    },
    flexContainer: {
        flexDirection: 'row',
    },
    cell: {
        width:dropdownWidth,
        alignItems:'center',
        flexDirection:'row',
        height:35,
        borderRightColor:'#cdcdcd',
        borderRightWidth:0.7,

    },
});

module.exports = connect(state=>({

        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        clubId:state.user.personInfoAuxiliary.clubId,
        coaches:state.coach.coaches,
        total:state.myprofit.total,
        qunhuodong:state.myprofit.qunhuodong,
        total1:state.myprofit.total1,
        huaxiao:state.myprofit.huaxiao,
        total2:state.myprofit.total2,
        tel1:state.myprofit.tel1,
        tel2:state.myprofit.tel2,
        wx1:state.myprofit.wx1,
        wx2:state.myprofit.wx2,

        payments:state.myprofit.payments,
        paymentsOnFresh:state.myprofit.paymentsOnFresh,
    })
)(Myprofit);