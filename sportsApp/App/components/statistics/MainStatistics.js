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
    fetchTodayCourseAndActivity,
    fetchNowLoginNumber,
    fetchNowPayments,
    fetchDetailPayments,
} from '../../action/UserActions';
import DetailProfit from '../my/DetailProfit';
import MyVenueProfit from '../my/MyVenueProfit';
import ModalDropdown from 'react-native-modal-dropdown';
const {height, width} = Dimensions.get('window');
import Echarts from 'native-echarts';
import DatePicker from 'react-native-datepicker';

class MainStatistics extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={

            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),

            currentDate:'2018年9月1日',

            //取最新的三条消息
            payNotices : [
                {name:'陈海云',time:'15:22:24'},
                {name:'蓝忘机',time:'12:42:38'},
                {name:'魏无羡',time:'08:10:56'},
            ],
            numberNotice:[],
            noticeHeight:130,
            noticeWrapperHeight:160,
            addTimes:1,
            //1:账单2:线上
            type:1,

            currentOption:null,
            chartInfo:null,
            timeList:['8点前','8','9','10','11','12','13','14','15','16','17','18','19','20点后'],
            personList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            chartWidth : width,
            //某天课程活动人数饼状图
            pie:[{value:0, name:'课程'},{value:0, name:'活动'}],
            courseNumber:0,
            activityNumber:0,
            //各时间段课程、活动人数柱状图
            courseNumberList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            activityNumberList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            //截至目前账单折线图
            coursePayList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            activityPayList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            goodsPayList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            //截至目前账单饼状图
            payPie:[{value:0, name:'课程'},{value:0, name:'活动'},{value:0, name:'商品'}],
            coursePay:0,
            activityPay:0,
            goodsPay:0,
        };
    }

    setNewOption(option) {
        this.chart.setNewOption(option);
    }


    renderRow(rowData, sectionId, rowId) {
            //{time:8,type:'activity',detailTime:'08:23:49',payment:15}
        var type = '';

        switch (rowData.type){
            case 'course':type='课程';break;
            case 'activity':type='群活动';break;
            case 'goods':type='商品';break;
        }
        if(this.state.type==1) {
            return (
                <View style={styles.noticeItem}>
                    <View style={styles.noticeWrapper}>
                        <View style={{justifyContent: 'center', width: width - 60 - 80, flexDirection: 'row'}}>
                            <Text style={{color: '#5c5c5c', fontSize: 13}} numberOfLines={1}>
                                {rowData.personName} 在 {type} 支出了
                            </Text>
                            <Text style={{color: 'red', fontSize: 13}} numberOfLines={1}>
                                {rowData.payment}
                            </Text>
                            <Text style={{color: '#5c5c5c', fontSize: 13}} numberOfLines={1}>
                                元
                            </Text>
                        </View>
                        <View style={{alignItems: 'flex-end', marginRight: 5}}>
                            <Text style={{fontSize: 13, color: '#5c5c5c'}}>{rowData.detailTime}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        if(this.state.type==2){
            return(
            <View style={styles.noticeItem}>
                <View style={styles.noticeWrapper}>
                    <View style={{justifyContent: 'center', width: width - 60 - 80, flexDirection: 'row'}}>
                        <Text style={{color: '#5c5c5c', fontSize: 13}} numberOfLines={1}>
                            {rowData.name} {rowData.detailStartTime} ~ {rowData.detailEndTime}
                        </Text>
                    </View>
                </View>
            </View>
            )
        }
    }

    render()
    {

        var NoticesListView = null;
        var notices = null;
        switch (this.state.type){
            case 1:notices = this.state.payNotices;break;
            case 2:notices = this.state.numberNotice;break;
        }

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (notices !== undefined && notices !== null && notices.length > 0)
        {
            NoticesListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    //列表中数据
                    dataSource={ds.cloneWithRows(notices)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //支付情况折线图
        var option1=
            {
                title: {
                },
                tooltip: {trigger:'axis'},
                legend: {
                    data:['课程','活动','商品']
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
                color:['#fef894','#fbd193','#f78ea0'],
                series: [
                    {name:'课程',type:'line',data:this.state.coursePayList},
                    {name:'活动',type:'line',data:this.state.activityPayList},
                    {name:'商品',type:'line',data:this.state.goodsPayList},
                ]
            }
        //支付情况饼状图
        var option2={
            tooltip: {    //定义环形图item点击弹框
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c}元 ({d}%)"
            },
            legend: {
            },
            series: [{
                name: '今日账单',
                type: 'pie',
                hoverAnimation: false,
                radius: ['30%', '75%'],     //设置环形图展示半径空心圆环
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {               //设置点击展示环形图内部文本样式
                        show: true,
                        textStyle: {
                            color:'#666666',
                            fontSize: '16',
                        }
                    }
                },

                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: this.state.payPie,    //这里的data是定义环形图的展示内容

                color: ['#fef894', '#fbd193', '#f78ea0']
            }]
        }
        //活动课程折线图
        var option3={
            title: {
            },
            tooltip: {trigger:'axis'},
            legend: {
                data:['课程','活动']
            },
            xAxis: {
                boundaryGap:true,
                type : 'category',
                name : '时间',
                data: this.state.timeList,
            },
            yAxis: {
                name:'数量',
                type:'value'
            },
            color:['#fbd193','#f78ea0'],
            series: [
                {name:'课程',type:'line',data:this.state.courseNumberList},
                {name:'活动',type:'line',data:this.state.activityNumberList},
            ]
        }
        //活动课程饼状图
        var option4={
            tooltip: {    //定义环形图item点击弹框
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
            },
            series: [{
                type: 'pie',
                hoverAnimation: false,
                radius: ['30%', '75%'],     //设置环形图展示半径空心圆环
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {               //设置点击展示环形图内部文本样式
                        show: true,
                        textStyle: {
                            color:'#666666',
                            fontSize: '16',
                        }
                    }
                },

                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: this.state.pie,    //这里的data是定义环形图的展示内容

                color: ['#fbd193','#f78ea0']
            }]
        }


        return (
            <View style={styles.statisticsContainer}>
                <Toolbar width={width} title="统计" actions={[]} navigator={this.props.navigator}>

                    <View style={{flexDirection:'row',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor:'#fff'}}>
                        <View style={[styles.siftWrapper, {zIndex: 1},{flex:1},]}>
                            <TouchableOpacity style={[styles.siftCell]}
                                              onPress={()=>{
                                                  this.setState({type:1,currentOption:option1})
                                              }}>
                                <Text style={styles.orderByFont}>账单</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.siftWrapper, {zIndex: 1},{flex:1}]}>
                        <TouchableOpacity style={styles.siftCell}
                                          onPress={()=>{
                                            //  this.setState({type:2,currentOption:option3})
                                          }}>
                            <Text style={styles.orderByFont}>线上</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={[styles.siftWrapper, {zIndex: 1},{flex:1}]}>
                            <TouchableOpacity style={styles.siftCell}
                                              onPress={()=>{

                                              }}>
                                <Text style={styles.orderByFont}>用户</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems:'flex-end',justifyContent:'center',paddingHorizontal:10,flex:3}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.getDetailPayment(this.state.currentDate)
                                }}
                            >
                                <Ionicons name='md-refresh' size={25} color="#fff"/>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <ScrollView>
                            <View
                                style={[styles.viewWrapper, {zIndex: 1}, {marginTop: 5}]}>
                                <View style={styles.viewCell}>
                                    <Text style={{
                                        marginRight: 5,
                                        fontSize: 18,
                                        color: '#fff'
                                    }}>{this.state.currentDate}</Text>
                                    <TouchableOpacity style={{padding: 3}}
                                                      onPress={() => {
                                                          if(this.state.type==1)this.setState({currentOption: option1})
                                                          if(this.state.type==2)this.setState({currentOption: option3})
                                                      }}>
                                        <Ionicons name='md-trending-up' size={15} color="#fff"/></TouchableOpacity>
                                    <TouchableOpacity style={{padding: 3}}
                                                      onPress={() => {
                                                          if(this.state.type==1)this.setState({currentOption: option2})
                                                          if(this.state.type==2)this.setState({currentOption: option4})
                                                      }}>
                                        <Ionicons name='md-pie' size={15} color="#fff"/></TouchableOpacity>
                                </View>
                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <View style={{
                                        height: 35,
                                        marginRight: 15,
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
                                            minDate={"2008年00月00日"}
                                            confirmBtnText="确认"
                                            cancelBtnText="取消"
                                            showIcon={true}
                                            iconComponent={<Ionicons name='md-time' size={22} color="#fff"/>}
                                            onDateChange={(date) => {
                                                if(this.state.type==1)
                                                this.getDetailPayment(date)
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                    {/*图表卡片*/}
                    <View style={{marginTop:5,height:320,width:this.state.chartWidth,padding:10,justifyContent:'center',alignItems:'center',}}>
                        <View style={{height:300,width:this.state.chartWidth-40,backgroundColor:'#fff',borderRadius:15,justifyContent:'center',alignItems:'center',}}>
                        <Echarts option={this.state.currentOption} height={300} width={this.state.chartWidth-40} ref={e => this.chart = e}/>
                        </View>
                    </View>

                    <View
                        style={[styles.viewWrapper, {zIndex: 1}]}>
                        <View style={styles.viewCell}>
                            <Text style={{marginRight:5,fontSize:18,color:'#fff',marginTop:8}}>消息列表</Text>
                        </View>
                    </View>
                    {/*消息列表*/}
                        <View style={{height:this.state.noticeWrapperHeight,width:this.state.chartWidth,padding:10,justifyContent:'center',alignItems:'center',}}>
                            <View style={{height:this.state.noticeHeight,width:this.state.chartWidth-40,backgroundColor:'#fff',borderRadius:15,justifyContent:'center',alignItems:'center',padding:10}}>
                                {NoticesListView}
                                {
                                    this.state.addTimes==0?null:
                                    <TouchableOpacity style={{justifyContent: 'flex-end', marginRight: 5}}
                                                      onPress={() => {
                                                          var noticeWrapperHeight = this.state.noticeWrapperHeight + 130
                                                          var noticeHeight = this.state.noticeHeight + 130
                                                          var addTimes = this.state.addTimes - 1
                                                          this.setState({
                                                              noticeHeight: noticeHeight,
                                                              noticeWrapperHeight: noticeWrapperHeight,
                                                              addTimes:addTimes,
                                                          })
                                                      }}>
                                        <Text style={{color: 'red', fontSize: 13}}>更多>></Text></TouchableOpacity>
                                }
                            </View>
                        </View>
                    </ScrollView>
                </Toolbar>
            </View>
        )

    }

    componentWillUnmount()
    {
    }

    componentDidMount(){
            //获得用户今日截至目前的在线人数（动态）
            // this.props.dispatch(fetchNowLoginNumber()).then((json)=>{
            //     if(json.re==1)
            //     {
            //         //返回各个时间段用户人数
            //     }
            //     else {
            //         if(json.re=-100){
            //             this.props.dispatch(getAccessToken(false))
            //         }
            //
            //     }
            // })

            //获得用户今日参与活动和课程的情况（静态）
            this.props.dispatch(fetchTodayCourseAndActivity()).then((json)=>{
                if(json.re==1)
                {
                    //{detailEndTime=2018-09-06 23:59:59, name=周末班, startTime=10, detailStartTime=2018-09-06 10:23:13, endTime=23, type=course}
                    var list = json.data
                    var courseList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    var activityList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    var courseNumber = 0
                    var activityNumber = 0

                    //降序排列
                    list.sort(function(a,b){
                        if(b.detailStartTime>a.detailStartTime)return 1;
                        else return -1;});

                    for(i=0;i<list.length;i++)
                    {
                        var startIdx = 0;
                        var startTime = parseInt(list[i].startTime);
                        if(startTime>=20)startIdx = 13;
                        else if(startTime>=8)startIdx = startTime-7;

                        var endIdx = 0;
                        var endTime = parseInt(list[i].endTime);
                        if(endTime>=20)endIdx = 13;
                        else if(endTime>=8)endIdx = endTime-7;

                        if(list[i].type=='activity')
                        {
                            activityNumber++
                            for(j=startIdx;j<=endIdx;j++)activityList[j]++
                        }
                        else if(list[i].type=='course')
                        {
                            courseNumber++
                            for(j=startIdx;j<=endIdx;j++)courseList[j]++
                        }
                    }

                    var pie = this.state.pie
                    pie.map((number,i)=>{
                        switch(i){
                            case 0:number.value=courseNumber;break;
                            case 1:number.value=activityNumber;break;
                        }
                    })
                }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                    }
                }
                this.setState({activityNumberList:activityList,courseNumberList:courseList,pie:pie,numberNotice:list})
            })

            //获取今日截至目前的收益情况（动态）
            this.props.dispatch(fetchNowPayments()).then((json)=>{
                if(json.re==1)
                {
                    //{time:8,type:'activity',detailTime:'08:23:49',payment:15,personName:'wbh'}
                    var list = json.data
                    var courseList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    var activityList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    var goodsList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    var coursePay = 0
                    var activityPay = 0
                    var goodsPay = 0

                    //降序排列
                    list.sort(function(a,b){
                        if(b.detailTime>a.detailTime)return 1;
                    else return -1;});

                    for(i=0;i<list.length;i++)
                    {
                        var idx = 0;
                        var time = list[i].time;
                        if(time>=8)idx = time-7

                        if(list[i].type=='activity'){activityList[idx]+=list[i].payment;activityPay+=list[i].payment}
                        else if(list[i].type=='course'){courseList[idx]+=list[i].payment;coursePay+=list[i].payment}
                        else if(list[i].type=='goods'){goodsList[idx]+=list[i].payment;goodsPay+=list[i].payment}
                    }

                    var payPie = this.state.payPie
                    payPie.map((pay,i)=>{
                        switch(i){
                            case 0:pay.value=coursePay;break;
                            case 1:pay.value=activityPay;break;
                            case 2:pay.value=goodsPay;break;
                        }
                    })

                    var optionOrigin=
                        {
                            title: {
                            },
                            tooltip: {trigger:'axis'},
                            legend: {
                                data:['课程','活动','商品']
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
                            color:['#fef894','#fbd193','#f78ea0'],
                            series: [
                                {name:'课程',type:'line',data:courseList},
                                {name:'活动',type:'line',data:activityList},
                                {name:'商品',type:'line',data:goodsList},
                            ]
                        }

                    this.setState({activityPayList:activityList,coursePayList:courseList,goodsPayList:goodsList,payPie:payPie,
                        payNotices:list,currentOption:optionOrigin,type:1})

                }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                    }

                }
            })
            this.getNowFormatDate()
    }

    getNowFormatDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + '年' + month + '月' + strDate + '日'
    this.setState({currentDate:currentdate})
    }

    getDetailPayment(currentDate){
        this.props.dispatch(fetchDetailPayments(currentDate)).then((json)=>{
            if(json.re==1)
            {
                //{time:8,type:'activity',detailTime:'08:23:49',payment:15}
                var list = json.data
                var courseList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                var activityList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                var goodsList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                var coursePay = 0
                var activityPay = 0
                var goodsPay = 0

                //降序排列
                list.sort(function(a,b){
                    if(b.detailTime>a.detailTime)return 1;
                    else return -1;});

                for(i=0;i<list.length;i++)
                {
                    var idx = 0;
                    var time = list[i].time;
                    if(time>=8)idx = time-7

                    if(list[i].type=='activity'){activityList[idx]+=list[i].payment;activityPay+=list[i].payment}
                    else if(list[i].type=='course'){courseList[idx]+=list[i].payment;coursePay+=list[i].payment}
                    else if(list[i].type=='goods'){goodsList[idx]+=list[i].payment;goodsPay+=list[i].payment}
                }

                var payPie = this.state.payPie
                payPie.map((pay,i)=>{
                    switch(i){
                        case 0:pay.value=coursePay;break;
                        case 1:pay.value=activityPay;break;
                        case 2:pay.value=goodsPay;break;
                    }
                })

                var optionOrigin=
                    {
                        title: {
                        },
                        tooltip: {trigger:'axis'},
                        legend: {
                            data:['课程','活动','商品']
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
                        color:['#fef894','#fbd193','#f78ea0'],
                        series: [
                            {name:'课程',type:'line',data:courseList},
                            {name:'活动',type:'line',data:activityList},
                            {name:'商品',type:'line',data:goodsList},
                        ]
                    }

                this.setState({activityPayList:activityList,coursePayList:courseList,goodsPayList:goodsList,payPie:payPie,
                    payNotices:list,currentDate:currentDate,currentOption:optionOrigin})

            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }

            }
        })
    }

}

const styles = StyleSheet.create({

    statisticsContainer: {
        flex: 1,
        flexDirection:'column',
        backgroundColor:'#66CDAA'
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
        backgroundColor: '#66CDAA',
        height: 44,
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
        color:'#fff'
    },
    noticeItem: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#5c5c5c',
    },
    noticeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 30,
        paddingHorizontal: 10,
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
)(MainStatistics);