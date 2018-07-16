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
    Button
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
var {height, width} = Dimensions.get('window');
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import{
    fetchPayment,
    onPaymentUpdate,
    fetchPaymentByTime,
} from '../../action/MyProfitActions';
import Calendar from 'react-native-calendar-select';
import {
    getAccessToken,
} from '../../action/UserActions';

import CoachDetail from '../course/CoachDetail'
import {List,ListItem} from 'react-native-elements'
import {fetchCoursesByCreatorId, onCoursesOfCoachUpdate} from "../../action/CourseActions";
import CompetitionSignUp from "../competition/CompetitionSignUp";
class DetailProfit extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }
    show(){
        alert("asd")
    }

    navigateCompetitionSignUp(rowData)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CompetitionSignUp',
                component: CompetitionSignUp,
                params: {
                    rowData:rowData,
                }
            })
        }
    }

    _data=[{payername:'张三',paynum:'10',paytime:'2017-1-9 10:00',paymethod:'微信',paytype:'群活动'},
        {payername:'李思',paynum:'25',paytime:'2017-3-23 23:33',paymethod:'手机',paytype:'购物'},
        {payername:'王武',paynum:'90',paytime:'2017-4-13 12:34',paymethod:'手机',paytype:'群活动'},
        {payername:'赵奎',paynum:'80',paytime:'2017-1-1 12:56',paymethod:'微信',paytype:'群活动'}
    ]
    constructor(props) {
        super(props);
        this.state={
            totals:0,
            activitys:0,
            courses:0,
            startDate: new Date(2017, 6, 12),
            endDate: new Date(2017, 8, 2),
        };
        this.confirmDate = this.confirmDate.bind(this);
        this.openCalendar = this.openCalendar.bind(this);
    }
    confirmDate({startDate, endDate, startMoment, endMoment}) {
        this.setState({
            startDate,
            endDate
        });

        this.props.dispatch(fetchPaymentByTime(this.props.clubId,startDate,endDate)).then((json)=>{
            if(json.re==1)
            {
                // this.props.dispatch(onPaymentUpdate(json.data))
                var dataList = json.data;
                var sum = 0;
                for(i=0;i<dataList.length;i++){
                    sum+=dataList[i].payment;
                }
                this.setState({totals:sum});
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
    renderRow (rowData, sectionID) {
        return (
            <ListItem
                roundAvatar
                key={sectionID}
                title={rowData.name}
                subtitle={rowData.subtitle}
                avatar={{uri:rowData.avatar_url}}
            />
        )
    }

    render()
    {
        let customI18n = {
            'w': ['', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
            'weekday': ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'text': {
                'start': 'Check in',
                'end': 'Check out',
                'date': 'Date',
                'save': 'Confirm',
                'clear': 'Reset'
            },
            'date': 'DD / MM'  // date format
        };
        // optional property, too.
        let color = {
            subColor: '#f0f0f0'
        };

        return (
       <View style={styles.container}>

                <View style={{height:55,width:width,paddingTop:20,flexDirection:'row',
                    backgroundColor:'#66CDAA',borderBottomWidth:1,borderColor:'#66CDAA'}}>
                    <TouchableOpacity style={{justifyContent:'center',alignItems: 'center',marginLeft:20}}
                                      onPress={()=>{this.goBack();}}>
                        <Icon name={'angle-left'} size={30} color="#fff"/>
                    </TouchableOpacity>
                    <View style={{marginLeft:90,justifyContent:'center',alignItems: 'center',}}>
                        <Text style={{color:'#fff',fontSize:18}}>我的收益</Text>
                    </View>
                </View>

                <View style={{ padding: 4, paddingHorizontal: 12 ,flexDirection:'row',}}>

                <View style={{padding:4,flex:1,alignItems:'center',flexDirection:'row'}}>
                   <Text style={{ color: '#222', fontSize: 18 }}>
                       总收入：{this.state.totals}元
                   </Text>
                </View>

               <View style={{padding:10,marginLeft:8,flexDirection:'row',alignItems:'center' }}>
                   <Button title="选择时间" onPress={this.openCalendar}></Button>
                   <Calendar
                       i18n="en"
                       ref={(calendar) => {this.calendar = calendar;}}
                       customI18n={customI18n}
                       color={color}
                       format="YYYYMMDD"
                       minDate="20170510"
                       maxDate="20180312"
                       startDate={this.state.startDate}
                       endDate={this.state.endDate}
                       onConfirm={this.confirmDate}
                   />
                </View>
                </View>

                <ScrollView>
                <List containerStyle={{marginBottom: 20}}>
                    {
                        this.props.payments.map((l, i) => (
                            <ListItem
                                roundAvatar
                                avatar={{uri:"https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"}}
                                key={i}
                                title={"订单号"+l.outTradeNo+"收款金额： "+l.payment}
                            />
                        ))
                    }
                </List>
                </ScrollView>
                {/*<List>*/}
                    {/*<ListView*/}
                        {/*renderRow={this.renderRow}*/}
                        {/*dataSource={this.props.payments}*/}
                    {/*/>*/}
                {/*</List>*/}
            </View>
        )

    }
    componentDidMount(){

        this.props.dispatch(fetchPayment(this.props.clubId)).then((json)=>{
            if(json.re==1)
            {
                //this.setState({total:json.data});
                var dataList = json.data;
                var sum = 0;
                for(i=0;i<dataList.length;i++){
                    sum+=dataList[i].payment;
                }
                this.setState({totals:sum});
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }
            }
        })
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

});

module.exports = connect(state=>({
//UI组件中的payments与state中的payments间的映射
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        clubId:state.user.personInfoAuxiliary.clubId,
        coaches:state.coach.coaches,
        payments:state.myprofit.payments,
        total:state.myprofit.total,
        qunhuodong:state.myprofit.qunhuodong,
        total1:state.myprofit.total1,
        huaxiao:state.myprofit.huaxiao,
        total2:state.myprofit.total2,
        tel1:state.myprofit.tel1,
        tel2:state.myprofit.tel2,
        wx1:state.myprofit.wx1,
        wx2:state.myprofit.wx2,
    })
)(DetailProfit);