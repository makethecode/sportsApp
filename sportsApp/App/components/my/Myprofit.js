/**
 * Created by youli on 2017/9/13.
 */
/**
 * Created by dingyiming on 2017/8/1.
 */
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
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import{
    fetchPayment,
    onPaymentUpdate,
    fetchAllPayment,
    enablePaymentsOnFresh,
    disablePaymentsOnFresh,
    fetchAllPaymentByTime,
    fetchCoursePayment,
    fetchActivityPayment,
} from '../../action/MyProfitActions';
import {
    getAccessToken,
} from '../../action/UserActions';
import CoachDetail from '../course/CoachDetail'
import {PricingCard} from 'react-native-elements'
import {fetchCoursesByCreatorId, onCoursesOfCoachUpdate} from "../../action/CourseActions";
import CompetitionSignUp from "../competition/CompetitionSignUp";
import DetailProfit from './DetailProfit';
import MyVenueProfit from './MyVenueProfit';
import ModalDropdown from 'react-native-modal-dropdown';
import ProfitAssortFilter from '../../utils/ProfitAssortFilter'
const {height, width} = Dimensions.get('window');
import Calendar from 'react-native-calendar-select';

class Myprofit extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    show(){
        alert("asd")
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
            payments:[],
            datePayments:[],
            sortPayments:[],
            showDropDown:false,
            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),
            typeList:['群活动','课程','全部'],
            currentType:'分类',
            sortList:['按时间升序↑','按时间降序↓','按价格升序↑','按价格降序↓'],
            currentSort:'排序',
            startDate: new Date(2018, 4, 8),
            endDate: new Date(2018, 4, 20),
            currentDate:'本月',
            isChooseSort:false,
            isChooseDate:false,
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
                // this.props.dispatch(onPaymentUpdate(json.data))
                var dataList = json.data;
                var sum = 0;
                for(i=0;i<dataList.length;i++){
                    sum+=dataList[i].payment;
                }
                this.setState({totals:sum,currentDate:currentTime,datePayments:dataList});

                if(this.state.isChooseSort){
                    var sortList = this.state.sortPayments;
                    var dateList = this.state.datePayments;
                    //对sortList和dateList进行交操作
                    for(i=0;i<sortList.length;i++)
                        for(j=0;j<dateList.length;j++)
                        {
                            if(sortList[i].outTradeNo==dateList[j].outTradeNo)
                            {
                                resList.push(sortList[i])
                                continue
                            }

                        }

                    this.setState({payments:resList})
                }else{
                    this.setState({payments:this.state.datePayments})
                }
                this.setState({isChooseDate:true})

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
            this.setState({doingFetch:false,isRefreshing:false,payments:this.props.payments})
        }).catch((e)=>{
            this.props.dispatch(disablePaymentsOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }

    renderRow(rowData, sectionId, rowId) {

        const defaultImg = require('../../../img/portrait.jpg')
        const imgSrc = require('../../../img/portrait.jpg')

        // const imgSrc = rowData.hasAvatar ? {uri: food.thumb_image_url} : defaultImg
            return (
            <TouchableOpacity
                activeOpacity={0.75}
                style={styles.paymentItem}
                onPress={this._onPress}
            >
                <Image
                    style={{width: 40, height: 40, marginHorizontal: 10, borderRadius: 20}}
                    source={imgSrc}
                    defaultSource={defaultImg}
                />
                <View style={styles.paymentWrapper}>
                    <View style={{justifyContent: 'center', width: width - 60 - 80,flexDirection:'column'}}>
                        <Text style={{color: '#2c2c2c', marginBottom: 10,fontSize:15}} numberOfLines={1}>
                            {rowData.attach}
                        </Text>
                        <Text style={{color: '#666',fontSize: 13, marginBottom: 3}}>
                            账单号：{rowData.outTradeNo}
                        </Text>
                        {rowData.timeEnd==null?null:
                            <Text style={{color: '#666',fontSize: 12}}>
                                {rowData.timeEnd.substring(0,4)}年{rowData.timeEnd.substring(4,6)}月{rowData.timeEnd.substring(6,8)}日 {rowData.timeEnd.substring(8,10)}:{rowData.timeEnd.substring(10,12)}
                            </Text>
                        }
                    </View>
                    <View style={{alignItems:'flex-end',marginRight:5}}>
                        <Text style={{fontSize:18,color:'#2c2c2c'}}>{rowData.payment}.00</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render()
    {
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
        var {paymentsOnFresh,total}=this.props;

        let typeicon = this.state.showDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');

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
                var paymentsAfterFilter = payments;
                paymentsListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        //列表中数据
                        dataSource={ds.cloneWithRows(ProfitAssortFilter.filter(paymentsAfterFilter,this.props.club,this.props.venueId,this.props.typeId))}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="我的收益" actions={[]} navigator={this.props.navigator}>

                    <View
                        style={[styles.siftWrapper, {zIndex: 1},{borderBottomWidth: StyleSheet.hairlineWidth}]}>

                        <ModalDropdown
                            style={styles.siftCell}
                            textStyle={styles.orderByFont}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.typeList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_1_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_willHide.bind(this)}
                        >
                            <View style={styles.siftCell}>
                                <Text style={styles.orderByFont}>
                                    {this.state.currentType}
                                </Text>
                                <Image
                                    style={{width: 16, height: 16}}
                                    source={typeicon}
                                />
                            </View>
                        </ModalDropdown>

                            <ModalDropdown
                                style={styles.siftCell}
                                textStyle={[styles.orderByFont,{color:'#FD545E'}]}
                                dropdownStyle={styles.sortdropdownstyle}
                                options={this.state.sortList}
                                renderRow={this.dropdown_renderRow.bind(this)}
                                onSelect={(idx, value) => this.dropdown_2_onSelect(idx, value)}>
                                <View style={styles.siftCell}>
                                    <Text style={[styles.orderByFont,{color:'#FD545E'}]}>
                                        {this.state.currentSort}
                                    </Text>
                                </View>
                            </ModalDropdown>

                    </View>

                    <View
                        style={[styles.viewWrapper, {zIndex: 1},{borderBottomWidth: StyleSheet.hairlineWidth}]}>
                        <View style={styles.viewCell}>
                            <Text style={{marginRight:5,fontSize:16,color:'#2c2c2c',marginTop:8}}>{this.state.currentDate}</Text>
                            <Text style={{marginRight:5,fontSize:12,color:'#666',marginTop:5}}>收入 ￥{total}.00</Text>
                        </View>
                        <TouchableOpacity style={{width: 22, height: 22, alignItems:'flex-end'}} onPress={this.openCalendar}>
                        <Image
                            style={{width: 22, height: 22, alignItems:'flex-end'}}
                            source={require('../../../img/canlendar.png')}
                        ></Image>
                        </TouchableOpacity>
                        <Calendar
                            i18n="en"
                            ref={(calendar) => {this.calendar = calendar;}}
                            customI18n={customI18n}
                            color={color}
                            format="YYYYMMDD"
                            minDate="20180401"
                            maxDate="20180601"
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onConfirm={this.confirmDate}
                        />
                    </View>

                    {<View style={{flex:5,backgroundColor:'#fff'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingTop:5,paddingBottom:5,}}>
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
            </View>
        )

    }

    componentWillUnmount()
    {
        this.props.dispatch(enablePaymentsOnFresh());
    }

    dropdown_renderRow(rowData, rowID, highlighted){
        return (
            <TouchableOpacity >
                <View style={[styles.dropdownrowstyle]}>
                    <Text style={[styles.dropdownFont, highlighted && {color: 'mediumaquamarine'}]}>
                        {rowData}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    dropdown_1_onSelect(idx, value) {
        this.setState({
            currentType:value,
        });

        var dateList = this.props.payments;
        var resList=[];

        switch (idx){
            case '0':
                //群活动
                this.props.dispatch(fetchActivityPayment()).then((json)=>{
                    if(json.re==1)
                    {
                        var dataList = json.data;
                        var sum = 0;
                        for(i=0;i<dataList.length;i++){
                            sum+=dataList[i].payment;
                        }
                        this.setState({totals:sum,sortPayments:dataList});

                        if(this.state.isChooseDate){
                            var dateList = this.state.datePayments;
                            var sortList = this.state.sortPayments;
                            //对sortList和dateList进行交操作
                            for(i=0;i<sortList.length;i++)
                                for(j=0;j<dateList.length;j++)
                                {
                                    if(sortList[i].outTradeNo==dateList[j].outTradeNo)
                                    {
                                        resList.push(sortList[i])
                                        continue
                                    }

                                }

                            this.setState({payments:resList})
                        }else
                        {
                            this.setState({payments:this.state.sortPayments})
                        }

                        this.setState({isChooseSort:true})

                    }else{
                        if(json.re==-100){
                            this.props.dispatch(getAccessToken(false));
                        }
                    }
                })
                break;
            case '1':
                //课程
                this.props.dispatch(fetchCoursePayment()).then((json)=>{
                    if(json.re==1)
                    {
                        var dataList = json.data;
                        var sum = 0;
                        for(i=0;i<dataList.length;i++){
                            sum+=dataList[i].payment;
                        }
                        this.setState({totals:sum,sortPayments:dataList});

                        if(this.state.isChooseDate){
                            var dateList = this.state.datePayments;
                            var sortList = this.state.sortPayments;
                            //对sortList和dateList进行交操作
                            for(i=0;i<sortList.length;i++)
                                for(j=0;j<dateList.length;j++)
                                {
                                    if(sortList[i].outTradeNo==dateList[j].outTradeNo)
                                    {
                                        resList.push(sortList[i])
                                        continue
                                    }

                                }

                            this.setState({payments:resList})
                        }else
                            {
                                this.setState({payments:this.state.sortPayments})
                            }

                        this.setState({isChooseSort:true})

                    }else{
                        if(json.re==-100){
                            this.props.dispatch(getAccessToken(false));
                        }
                    }
                })
                break;
            default:
                this.props.dispatch(fetchAllPayment()).then((json)=>{
                    if(json.re==1)
                    {
                        var dataList = json.data;
                        var sum = 0;
                        for(i=0;i<dataList.length;i++){
                            sum+=dataList[i].payment;
                        }
                        this.setState({totals:sum,sortPayments:dataList});

                        if(this.state.isChooseDate){
                            var dateList = this.state.datePayments;
                            var sortList = this.state.sortPayments;
                            //对sortList和dateList进行交操作
                            for(i=0;i<sortList.length;i++)
                                for(j=0;j<dateList.length;j++)
                                {
                                    if(sortList[i].outTradeNo==dateList[j].outTradeNo)
                                    {
                                        resList.push(sortList[i])
                                        continue
                                    }

                                }

                            this.setState({payments:resList})
                        }else
                        {
                            this.setState({payments:this.state.sortPayments})
                        }

                        this.setState({isChooseSort:true})

                    }else{
                        if(json.re==-100){
                            this.props.dispatch(getAccessToken(false));
                        }
                    }
                })
                break;
        }
    }

    dropdown_willShow() {
        this.setState({
            showDropDown:true,
        });
    }

    dropdown_willHide() {
        this.setState({
            showDropDown:false,
        });
    }

    dropdown_2_onSelect(idx, value) {
        var sortPayments = this.state.payments;
        this.setState({
            currentSort:value,
        });

        switch (idx)
        {
            case '0':
                //时间升序
                sortPayments.sort(function(a,b){
                    return a.timeEnd-b.timeEnd});
            break;
            case '1':
                //时间降序
                sortPayments.sort(function(a,b){
                    return b.timeEnd-a.timeEnd});
            break;
            case '2':
                //价格升序
                sortPayments.sort(function(a,b){
                    return a.payment-b.payment});
            break;
            case '3':
                //价格降序
                sortPayments.sort(function(a,b){
                    return b.payment-a.payment});
            break;
        }

        this.setState({payments:sortPayments})
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection:'column',
    },
    siftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        height: 44,
        borderBottomColor: '#cdcdcd',
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
    siftCell: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewCell: {
        height: 50,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    orderByFont: {
        fontSize: 13,
        marginRight: 5
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
    dropdownstyle: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
        width:80,
     },
    dropdownFont: {
        fontSize: 13,
        marginRight: 5,
        marginLeft:5,
    },
        dropdownrowstyle: {
        height: 33,
        flexDirection: 'row',
        alignItems: 'center'
        },
    sortdropdownstyle: {
        height: 133,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
        width:120,
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