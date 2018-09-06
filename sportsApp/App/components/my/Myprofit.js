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
const dropdownWidth = width/3-20;
var Popover = require('react-native-popover');

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

            startDate: new Date(2018,7,10),
            endDate: new Date(2018,8,1),
            currentDate:'本月',

            clubName:'俱乐部',
            venueName:'场地',
            typeName:'分类',
            showClubDropdown:false,
            showVenueDropdown:false,
            showTypeDropdown:false,
            clubList:[],clubs:[],
            venueList:[],venues:[],
            typeList:['群活动','课程','商品'],typeSelectName:-1,

            clubId:-1,
            venueId:-1,
            typeId:-1,

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

        //rowData{[clubId][clubName][outTradeNo][payment][perId][perName][timeMakesure][type][venueId][venueName]}

        var defaultImg = require('../../../img/portrait.jpg')
        const courseImg = require('../../../img/course.png')
        const activityImg = require('../../../img/activity.png')
        const goodsImg = require('../../../img/goods.png')

        var type = ''

        switch(rowData.type){
            case 'course':defaultImg = courseImg;type='课程';break;
            case 'activity':defaultImg = activityImg;type='群活动';break;
            case 'goods':defaultImg = goodsImg;type='商品';break;
        }

            return (
            <View style={styles.paymentItem}>
                <Image
                    style={{width: 30, height: 30, marginHorizontal: 15 }}
                    source={defaultImg}
                    resizeMode="stretch"
                />
                <View style={styles.paymentWrapper}>
                    <View style={{justifyContent: 'center', width: width - 60 - 80,flexDirection:'column'}}>
                        <Text style={{color: '#2c2c2c', marginBottom: 10,fontSize:15}} numberOfLines={1}>
                            {rowData.perName} 在 {type} 支出
                        </Text>
                        <Text style={{color: '#666',fontSize: 13, marginBottom: 3}}>
                            账单号：{rowData.outTradeNo}
                        </Text>
                        {rowData.timeMakesure==null?null:
                            <Text style={{color: '#666',fontSize: 12}}>
                                {rowData.timeMakesure.substring(0,4)}年{rowData.timeMakesure.substring(5,7)}月{rowData.timeMakesure.substring(8,10)}日 {rowData.timeMakesure.substring(11,13)}:{rowData.timeMakesure.substring(14,16)}:{rowData.timeMakesure.substring(17,19)}
                            </Text>
                        }
                    </View>
                    <View style={{alignItems:'flex-end',marginRight:10,flexDirection:'row'}}>
                        <Text style={{fontSize:18,color:'#fc3c3f'}}>{rowData.payment}.00 </Text>
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
                var paymentsAfterFilter = ProfitAssortFilter.filter(payments,this.state.clubId,this.state.venueId,this.state.typeId)
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

        let clubicon = this.state.showClubDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');
        let venueicon = this.state.showVenueDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');
        let typeicon = this.state.showTypeDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');

        var clubName_show = this.lengthFilter(this.state.clubName);
        var venueName_show = this.lengthFilter(this.state.venueName);
        var typeName_show = this.lengthFilter(this.state.typeName);

        return (
            <View style={styles.container}>
                <Toolbar ref="menu" width={width} title="我的收益" navigator={this.props.navigator} actions={[{icon:ACTION_SORT,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 this.showPopover('menu');
                             }
                         }}>

                    <View style={styles.flexContainer}>
                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.clubList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_1_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_1_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_1_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {clubName_show}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={clubicon}
                                />
                            </View>
                        </ModalDropdown>

                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.venueList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_2_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_2_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_2_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {venueName_show}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={venueicon}
                                />
                            </View>
                        </ModalDropdown>

                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.typeList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_3_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_3_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_3_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {typeName_show}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={typeicon}
                                />
                            </View>
                        </ModalDropdown>
                        {/*搜索*/}
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    //根据筛选条件进行筛选
                                    var clubflag = false;
                                    var venueflag = false;
                                    var clubId = -1;
                                    var venueId = -1;

                                    for(var i=0;i<this.state.clubs.length;i++)
                                        if(this.state.clubs[i].name == this.state.clubName)
                                        {
                                            clubId=this.state.clubs[i].id;
                                            clubflag = true;
                                        }
                                    if(clubflag==false)clubId = -1;

                                    for(var i=0;i<this.state.venues.length;i++)
                                        if(this.state.venues[i].name == this.state.venueName)
                                        {
                                            venueId = this.state.venues[i].unitId;
                                            venueflag = true
                                        }
                                    if(venueflag==false)venueId = -1;

                                    this.setState({clubId:clubId,venueId:venueId,typeId:this.state.typeSelectName})
                                }}
                            >
                                <Ionicons name='md-search' size={20} color="#5c5c5c"/>
                            </TouchableOpacity>
                        </View>
                        {/*清空*/}
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    var clubId = -1;
                                    var venueId = -1;
                                    var typeId = -1;

                                    this.setState({clubId:clubId,venueId:venueId,typeId:typeId,clubName:'俱乐部',venueName:'场地',typeName:'分类'})
                                }}
                            >
                                <Ionicons name='md-refresh' size={20} color="#5c5c5c"/>
                            </TouchableOpacity>
                        </View>
                    </View>

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

    componentDidMount(){
        //获取所有俱乐部
        this.props.dispatch(fetchClubList()).then((json)=>{
            if(json.re==1)
            {
                var clubDataList = [];
                for(var i=0;i<json.data.length;i++)
                    clubDataList.push(json.data[i].name);
                this.setState({clubList:clubDataList,clubs:json.data});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }

            }
        })

        //获取所有场地
        this.props.dispatch(fetchMaintainedVenue()).then((json)=>{
            if(json.re==1)
            {
                var venueDataList = [];
                for(var i=0;i<json.data.length;i++)
                    venueDataList.push(json.data[i].name);
                this.setState({venueList:venueDataList,venues:json.data});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }

            }
        })
    }

    dropdown_renderRow(rowData, rowID, highlighted){
        return (
            <TouchableOpacity >
                <View style={[styles.dropdown_row]}>
                    <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                        {rowData}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    dropdown_1_onSelect(idx, value) {
        this.setState({
            clubName:value,
        });
    }

    dropdown_2_onSelect(idx, value) {
        this.setState({
            venueName:value,
        });
    }

    dropdown_3_onSelect(idx, value) {
        //typeList:['群活动','课程','商品']
        var select = null

        switch(idx){
            case '0':select='activity';break;
            case '1':select='course';break;
            case '2':select='goods';break;
        }

        this.setState({
            typeName:value,
            typeSelectName:select,
        });
    }

    dropdown_1_willShow() {
        this.setState({
            showClubDropDown:true,
        });
    }

    dropdown_2_willShow() {
        this.setState({
            showVenueDropDown:true,
        });
    }

    dropdown_3_willShow() {
        this.setState({
            showTypeDropDown:true,
        });
    }

    dropdown_1_willHide() {
        this.setState({
            showClubDropDown:false,
        });
    }

    dropdown_2_willHide() {
        this.setState({
            showVenueDropDown:false,
        });
    }

    dropdown_3_willHide() {
        this.setState({
            showTypeDropDown:false,
        });
    }

    lengthFilter(data){
        if(data.length>5){
            data=data.substring(0,4);
            data = data+'...'
        }
        return data;
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
        height:32,
        borderRightColor:'#cdcdcd',
        borderRightWidth:0.7,

    },
    viewcell: {
        width:dropdownWidth-0.7,
        backgroundColor:'#ffffff',
        alignItems:'center',
        height:32,
        justifyContent:'center',
        flexDirection:'row',
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#646464',
        justifyContent:'center',
    },
    dropdownstyle: {
        height: 100,
        width:dropdownWidth,
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
    },
    dropdown_row: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    dropdown_row_text: {
        fontSize: 13,
        color: '#646464',
        textAlignVertical: 'center',
        justifyContent:'center',
        marginLeft: 5,
    },
    dropdown_image: {
        width: 20,
        height: 20,
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