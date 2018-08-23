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
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    ToastAndroid
} from 'react-native';
import {connect} from 'react-redux';
import DateFilter from '../../utils/DateFilter';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddActivity from './AddActivity';
import MyActivity from './MyActivity';
import ActivityDetail from './ActivityDetail';
import ActivityPay from './ActivityPay';
import ChooseField from './ChooseField';
import GroupJPush from './GroupJPush';
import goFieldOrder from './FieldOrder'
import activityMember from './ActivityMember';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import QrcodeModal from './QrcodeModal';
import {
    fetchActivityList,disableActivityOnFresh,enableActivityOnFresh,signUpActivity,fetchEventMemberList,exitActivity,exitFieldTimeActivity,deleteActivity,
} from '../../action/ActivityActions';

import {getAccessToken,} from '../../action/UserActions';
import WechatShare from '../WechatShare';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import AssortFilter from '../../utils/AssortFilter'
import ModalDropdown from 'react-native-modal-dropdown';

var WeChat=require('react-native-wechat');
var {height, width} = Dimensions.get('window');

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

/**
 * 群活动
 */

class Activity extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
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
        this.props.dispatch(enableActivityOnFresh());
    }

    setMyActivityList()
    {
        this.props.dispatch(enableActivityOnFresh());
    }

    navigate2AddActivity(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'add_activity',
                component: AddActivity,
                params: {

                }
            })
        }
    }

    navigate2goFieldOrder(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'go_FieldOrder',
                component: goFieldOrder,
                params: {

                }
            })
        }
    }

    navigate2ActivityMember(activityId){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'activityMember',
                component: activityMember,
                params: {
                    activityId:activityId
                }
            })
        }
    }

    navigate2MyActivity(myEvents,flag){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'my_activity',
                component: MyActivity,
                params: {
                    myEvents:myEvents,
                    flag:flag
                }
            })
        }
    }



    navigate2ActivityDetail(rowData,flag){

        this.props.dispatch(fetchEventMemberList(rowData.eventId))
            .then((json)=> {
                if(json.re==1){

                    var memberList = json.data;
                    rowData.memberList = memberList;
                    const { navigator } = this.props;
                    if(navigator) {
                        navigator.push({
                            name: 'activity_detail',
                            component: ActivityDetail,
                            params: {
                                activity:rowData,
                                flag:flag,
                                signUpActivity:this.signUpActivity.bind(this)
                            }
                        })
                    }
                }else{
                    if(json.re==-100){
                        this.props.dispatch(getAccessToken(false));
                    }
                }
            })
    }

    navigate2ActivityPay(activity)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ActivityPay',
                component: ActivityPay,
                params: {
                    activity:activity
                }
            })
        }
    }


    navigate2ActivityChooseField(event){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ChooseField',
                component:ChooseField,
                params: {
                    activity:event
                }
            })
        }

    }
    signUpActivity(event,eventNowMemNum)
    {
        if(event.eventMaxMemNum<=eventNowMemNum){
            alert('该活动人数已满！');

        }else{
            //
            // this.navigate2ActivityPay(event);
            // this.setMyActivityList();
            this.props.dispatch(signUpActivity(event.eventId)).then((json)=>{
                if(json.re==1){
                        this.navigate2ActivityPay(event);
                        this.setMyActivityList();
                }else{
                    if(json.re==-100){
                        this.props.dispatch(getAccessToken(false));
                    }
                }
            })
        }
    }

    exitActivity(event)
    {

            this.props.dispatch(exitActivity(event.eventId)).then((json)=>{
                if(json.re==1){
                    Alert.alert('信息','退出报名成功',[{text:'确认',onPress:()=>{
                        // this.setMyActivityList();
                        //this.goBack();
                        this.setMyActivityList();
                    }},
                    ]);
                }else{
                    if(json.re==-100){
                        this.props.dispatch(getAccessToken(false));
                    }
                }
            })

    }

    exitFieldTimeActivity(event)
    {

        this.props.dispatch(exitActivity(event.eventId)).then((json)=>{
            if(json.re==1){
                this.props.dispatch(exitFieldTimeActivity(event.eventId)).then((json)=>{
                    Alert.alert('信息','退出报名成功',[{text:'确认',onPress:()=>{
                        // this.setMyActivityList();
                        //this.goBack();
                        this.setMyActivityList();
                    }},
                    ]);
                })

            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }
            }
        })

    }
    isActivityPay(event){
        Alert.alert('信息','您已成功报名，但未支付，是否现在支付？',[{text:'是',onPress:()=>{
            // this.setMyActivityList();
            this.navigate2ActivityPay(event);
        }},
            {text:'否',onPress:()=>{

                //this.goBack();
                //this.setMyActivityList();
            }},
        ]);

    }

    renderRow(rowData,sectionId,rowId){

        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}>
                <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={require('../../../img/portrait.jpg')}/>
                    </View>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row'}}>

                        <View style={{backgroundColor:'#fca482',borderRadius:5,padding:5}}><Text style={{color:'#ffffff'}}>组织者</Text></View>
                                <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.creatorName}</Text>
                    </View>

                     <View style={{flex:2,marginRight:3,justifyContent:'center',alignItems:'flex-end'}}>
                         {
                             rowData.isOngoing==1?
                                 <View style={{flexDirection:'row'}}>
                                     <View style={{backgroundColor:'#fc6254',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>接受报名中</Text></View>
                                     <TouchableOpacity style={{justifyContent:'center',alignItems: 'center',padding:5,marginLeft:5}}
                                                       onPress={()=>{this.deleteActivity(rowData.activityId)}}>
                                         <Image style={{width: 20, height: 20}} source={require('../../../img/delete_icon.png')}></Image>
                                     </TouchableOpacity>
                                 </View> :
                                 <View style={{flexDirection:'row'}}>
                                 <View style={{backgroundColor:'#fc6254',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>活动已结束</Text></View>
                                     <TouchableOpacity style={{justifyContent:'center',alignItems: 'center',padding:5,marginLeft:5}}
                                                       onPress={()=>{this.deleteActivity(rowData.activityId)}}>
                                         <Image style={{width: 20, height: 20}} source={require('../../../img/delete_icon.png')}></Image>
                                     </TouchableOpacity>
                                 </View>
                         }
                     </View>

                </View>
                <View style={{flex:3,padding:10}}>
                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                            <Text style={{color:'#ffffff'}}>名称</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.name}</Text>
                        </View>
                    </View>

                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#ffffff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>地点</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.placeName}</Text>
                        </View>
                    </View>

                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                            <Text style={{color:'#ffffff'}}>时间</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.timeStart+'--'+rowData.timeEnd.substring(11,19)}</Text>
                        </View>
                    </View>
                    {
                        rowData.brief!=undefined&&rowData.brief!=null&&rowData.brief!=''?
                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>简介</Text>
                                </View>
                                <View style={{flex:7,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.brief}</Text>
                                </View>
                            </View>
                            :
                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>简介</Text>
                                </View>
                                <View style={{flex:7,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>无</Text>
                                </View>
                            </View>
                    }

                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                            <Text style={{color:'#ffffff'}}>费用</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.cost}元/人</Text>
                        </View>
                    </View>


                </View>
                <View style={{flex:1,flexDirection:'row',padding:10,borderTopWidth:1,borderColor:'#ddd'}}>

                    <View style={{flexDirection:'row',flex:2.5,alignItems:'flex-start'}}>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>

                        <View style={{backgroundColor:'#ffffff',borderRadius:5,padding:5}}><Text style={{color:'#fca482'}}>已报名</Text></View>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.nowNumber}/{rowData.maxNumber}人</Text>
                    </View>

                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>

                        <View style={{backgroundColor:'#fca482',borderRadius:5,padding:5}}><Text style={{color:'#ffffff'}}>已支付</Text></View>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.nowPayment}元</Text>
                    </View>
                    </View>

                    <View style={{justifyContent:'flex-end',flexDirection:'row',flex:1}}>
                    <TouchableOpacity style={{flex:2,justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>{this.navigate2ActivityMember(rowData.activityId)}}
                    >
                    <View style={{backgroundColor:'#fc6254',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>查看</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:2,justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>{this.navigate2ActivityPay(rowData)}}
                    >
                    <View style={{backgroundColor:'#fff',borderRadius:5,padding:5}}><Text style={{color:'#fc6254'}}>收款</Text></View>
                    </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
        return row;
    }

    sharetoPyq(rowData){
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                WeChat.shareToTimeline({
                    type: 'news',
                    title:rowData.eventName,
                    description:'活动'+rowData.eventName+'在'+rowData.eventPlaceName+'举行，'+'活动时间为'+rowData.startTimeStr+'---'+rowData.endTimeStr,
                    thumbImage:'https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike72%2C5%2C5%2C72%2C24/sign=f96438a8b1389b502cf2e800e45c8eb8/d043ad4bd11373f04db74d29ac0f4bfbfaed04ff.jpg',
                    webpageUrl:'http://211.87.225.204:8080/badmintionhot/ShareTimeLine.html',
                })
                    .catch((error) => {
                        console(error.message);
                    });
            } else {
                console('没有安装微信软件，请您安装微信之后再试');
            }
        });
    }

    sharetoperson(rowData){
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                WeChat.shareToSession({
                    type: 'news',
                    title:rowData.eventName,
                    description:'活动'+rowData.eventName+'在'+rowData.eventPlaceName+'举行，'+'活动时间为'+rowData.startTimeStr+'---'+rowData.endTimeStr,
                    thumbImage:'https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike72%2C5%2C5%2C72%2C24/sign=f96438a8b1389b502cf2e800e45c8eb8/d043ad4bd11373f04db74d29ac0f4bfbfaed04ff.jpg',
                    webpageUrl:'http://211.87.225.204:8080/badmintionhot/ShareTimeLine.html',
                })
                    .catch((error) => {
                        console(error.message);
                    });
            } else {
                console('没有安装微信软件，请您安装微信之后再试');
            }
        });
    }
    fetchData(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchActivityList()).then((json)=> {
            if(json.re==1){
                this.setState({activityList:json.data})
            }
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disableActivityOnFresh());
            this.setState({doingFetch:false,isRefreshing:false,})
        }).catch((e)=>{
            this.props.dispatch(disableActivityOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            signupedShow:false,
            //myTakenEvents:{isSignUp:null,eventId:null,eventId:null,eventBrief:null,money:null,eventName:null},
            myTakenEvents:{},
            share:{},
            event:{eventName:null,startTimeStr:null,endTimeStr:null,eventPlaceName:null,isChooseYardTime:null,eventBrief:'',eventType:null,eventPlace:null,unitId:null,feeDes:null,yardTotal:null,eventMaxMemNum:null,
                memberLevel:null,hasCoach:0,hasSparring:0,coachId:null,coachName:null,sparringId:null,sparringName:null,costTotal:null,isSignUp:null,eventMember:null,isNeedCoach:null,isNeedSparring:null,isHasPay:null,
                ManagerLoginName:null,groupName:null,groupId:null,cost:null,costType:null,field:null,filedNum:null,time:{startTime:null,endTime:null,eventWeek:null,isSchedule:null,},},

            statusList:['报名中','已结束','全部'],
            dateList:['今天','明天','后天','一周内','全部'],
            currentStatus:'状态',
            currentDate:'日期',
            showStatusDropDown:false,
            showDateDropDown:false,
            activityList:[],
            activityStatusList:[],
            activityDateList:[],
            isChooseDate:false,
            isChooseStatus:false,
        }
    }

    render() {

        let statusicon = this.state.showStatusDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');
        let dateicon = this.state.showDateDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');

        var activityListView=null;
        var {activityList,activityOnFresh,visibleEvents,myEvents,myTakenEvents}=this.props;
        if(activityOnFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var allActivityList = this.state.activityList;
            if (allActivityList !== undefined && allActivityList !== null && allActivityList.length > 0) {
                var allActivityListAfterFilter = allActivityList;
                activityListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(AssortFilter.filter(allActivityListAfterFilter,this.props.clubId,this.props.venueId,this.props.typeId))}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        return (

            <View style={{flex:1}}>
                <Toolbar width={width} title="群活动" actions={[]} navigator={this.props.navigator}>
                    {/*内容区*/}
                    <View style={{flexDirection:'row',}}>
                    <View style={[styles.siftWrapper, {zIndex: 1},{flex:1}]}>
                        <ModalDropdown
                            style={styles.siftCell}
                            textStyle={styles.orderByFont}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.statusList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_1_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_1_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_1_willHide.bind(this)}
                        >
                            <View style={styles.siftCell}>
                                <Text style={styles.orderByFont}>
                                    {this.state.currentStatus}
                                </Text>
                                <Image
                                    style={{width: 16, height: 16}}
                                    source={statusicon}
                                />
                            </View>
                        </ModalDropdown>
                    </View>

                        <View style={[styles.siftWrapper, {zIndex: 1},{flex:1}]}>
                            <ModalDropdown
                                style={styles.siftCell}
                                textStyle={styles.orderByFont}
                                dropdownStyle={styles.dropdownstyle2}
                                options={this.state.dateList}
                                renderRow={this.dropdown_renderRow.bind(this)}
                                onSelect={(idx, value) => this.dropdown_2_onSelect(idx, value)}
                                onDropdownWillShow={this.dropdown_2_willShow.bind(this)}
                                onDropdownWillHide={this.dropdown_2_willHide.bind(this)}
                            >
                                <View style={styles.siftCell}>
                                    <Text style={styles.orderByFont}>
                                        {this.state.currentDate}
                                    </Text>
                                    <Image
                                        style={{width: 16, height: 16}}
                                        source={dateicon}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>

                        <View style={{alignItems:'flex-end',justifyContent:'center',paddingHorizontal:10,flex:3}}>
                        <TouchableOpacity
                            onPress={()=>{this.navigate2AddActivity()}}
                        >
                        <Image
                            source={ require('../../../img/create_activity.png')}
                            style={{width:30,height:30}}
                            resizeMode={"stretch"}
                        />
                        </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-130,paddingTop:5,paddingBottom:5,}}>
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
                                {activityListView}

                                {
                                    activityListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>
                        </Animated.View>
                    </View>

                    {/*<View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#66CDAA',*/}
                            {/*position:'absolute',bottom:8}}>*/}
                        {/*<TouchableOpacity style={{flex:1,backgroundColor:'#66CDAA',justifyContent:'center',alignItems: 'center',*/}
                            {/*padding:10,margin:5}} onPress={()=>{this.navigate2MyActivity(myEvents,'我的活动');}}>*/}
                            {/*<Text style={{color:'#fff',}}>我发起的活动</Text>*/}
                        {/*</TouchableOpacity>*/}

                        {/*<TouchableOpacity style={{flex:1,backgroundColor:'#66CDAA',justifyContent:'center',alignItems: 'center',*/}
                            {/*padding:10,margin:5}} onPress={()=>{this.navigate2AddActivity();}}>*/}
                            {/*<Text style={{color:'#fff',}}>我要创建活动</Text>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}


                    {/*<View style={{height:50,width:50,borderRadius:25,position:'absolute',bottom:8,left:width*0.5-25}}>*/}
                        {/*<TouchableOpacity style={{flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems: 'center',padding:5,*/}
                        {/*borderWidth:1,borderColor:'#eee',borderRadius:50}}*/}
                        {/*>*/}
                            {/*<Icon name={'plus-circle'} size={35} color='#66CDAA'/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}

                    {/*<PopupDialog*/}
                        {/*ref={(popupDialog) => {*/}
                        {/*this.usernameDialog = popupDialog;*/}
                    {/*}}*/}
                        {/*dialogAnimation={scaleAnimation}*/}
                        {/*actions={[]}*/}
                        {/*width={0.8}*/}
                        {/*height={0.3}*/}
                    {/*>*/}

                        {/*<QrcodeModal*/}
                            {/*onClose={()=>{*/}
                                {/*this.usernameDialog.dismiss();*/}
                            {/*}}*/}
                        {/*/>*/}

                    {/*</PopupDialog>*/}


                    {/*<PopupDialog*/}
                        {/*ref={(popupDialog) => {*/}
                        {/*this.sharetoSomeone = popupDialog;*/}
                    {/*}}*/}
                        {/*dialogAnimation={scaleAnimation}*/}
                        {/*actions={[]}*/}
                        {/*width={0.8}*/}
                        {/*height={0.25}*/}
                    {/*>*/}
                    {/*<View style={{flex:1,padding:10,alignItems:"center",flexDirection:"row",justifyContent:"center"}}>*/}

                        {/*<View style={{flex:1,flexDirection:"column",alignItems:"center"}}>*/}
                            {/*<TouchableOpacity style={{flex:1,alignItems:"center",justifyContent:"center"}}*/}
                                {/*onPress={()=>{*/}
                                    {/*this.sharetoSomeone.dismiss();*/}
                                    {/*this.sharetoperson(this.state.share);*/}

                                {/*}}*/}
                            {/*>*/}
                            {/*<Icon name={'user-circle'} size={45} color='#00CD00'/>*/}
                            {/*<Text>好友</Text>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                        {/*<View style={{flex:1,flexDirection:"column",alignItems:"center"}}>*/}
                            {/*<TouchableOpacity style={{flex:1,alignItems:"center",justifyContent:"center"}}*/}
                                {/*onPress={()=>{*/}
                                    {/*this.sharetoPyq(this.state.share);*/}
                                    {/*this.sharetoSomeone.dismiss();*/}
                                {/*}}*/}
                            {/*>*/}
                            {/*<Icon name={'wechat'} size={45} color='#00CD00'/>*/}
                            {/*<Text>朋友圈</Text>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}

                    {/*</View>*/}
                    {/*</PopupDialog>*/}
                </Toolbar>
            </View>
        );
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
            currentStatus:value,
        });

        var resList = [];
        var statusList = [];
        var dateList = this.state.activityDateList;
        var activityList = this.props.activityList;

        switch (idx){
            case '0':
                //接受报名中
                for(i=0;i<activityList.length;i++)
                    if(activityList[i].isOngoing==1)statusList.push(activityList[i]);
                break;
            case '1':
                //已结束
                for(i=0;i<activityList.length;i++)
                    if(activityList[i].isOngoing==0)statusList.push(activityList[i]);
                break;
            case '2':
                //全部
                statusList=activityList;
                break;
        }

        if(this.state.isChooseDate){
            for(i=0;i<statusList.length;i++)
                for(j=0;j<dateList.length;j++)
                    if(statusList[i].activityId==dateList[j].activityId)
                    {resList.push(statusList[i]);break;}
        }else{resList=statusList;}

        this.setState({activityStatusList:statusList,activityList:resList,isChooseStatus:true})
    }

    dropdown_1_willShow() {
        this.setState({
            showStatusDropDown:true,
        });
    }

    dropdown_1_willHide() {
        this.setState({
            showStatusDropDown:false,
        });
    }

    dropdown_2_onSelect(idx, value) {
        this.setState({
            currentDate:value,
        });

        var resList = [];
        var statusList = this.state.activityStatusList;
        var dateList = [];
        var activityList = this.props.activityList;

        var now   = new Date();
        var selectedDate = new Date();

        switch (idx){
            case '0':
                //今天
                selectedDate.setDate(now.getDate());

                for(i=0;i<activityList.length;i++){
                    var activity_time = activityList[i].timeStart.substring(0,10)
                    var selected_time = this.getNowFormatDate(selectedDate)

                    if(activity_time == selected_time)
                        dateList.push(activityList[i])
                }
                break;
            case '1':
                //明天
                selectedDate.setDate(now.getDate()+1);

                for(i=0;i<activityList.length;i++){
                    var activity_time = activityList[i].timeStart.substring(0,10)
                    var selected_time = this.getNowFormatDate(selectedDate)

                    if(activity_time == selected_time)
                        dateList.push(activityList[i])
                }
                break;
            case '2':
                //后天
                selectedDate.setDate(now.getDate()+2);

                for(i=0;i<activityList.length;i++){
                    var activity_time = activityList[i].timeStart.substring(0,10)
                    var selected_time = this.getNowFormatDate(selectedDate)

                    if(activity_time == selected_time)
                        dateList.push(activityList[i])
                }
                break;
            case '3':
                //一周内
                selectedDate.setDate(now.getDate()+7);

                for(i=0;i<activityList.length;i++){
                    var activity_time = activityList[i].timeStart.substring(0,10)

                    var start_time = this.getNowFormatDate(now)
                    var end_time = this.getNowFormatDate(selectedDate)

                    if(activity_time >= start_time && activity_time <= end_time)
                        dateList.push(activityList[i])
                }
                break;
            case '4':
                //全部
                dateList=activityList;
                break;
        }

        if(this.state.isChooseStatus){
            for(i=0;i<statusList.length;i++)
                for(j=0;j<dateList.length;j++)
                    if(statusList[i].activityId==dateList[j].activityId)
                    {resList.push(statusList[i]);break;}
        }else{resList=dateList;}

        this.setState({activityDateList:dateList,activityList:resList,isChooseDate:true})
    }

    dropdown_2_willShow() {
        this.setState({
            showDateDropDown:true,
        });
    }

    dropdown_2_willHide() {
        this.setState({
            showDateDropDown:false,
        });
    }

    componentWillUnmount(){
        this.props.dispatch(enableActivityOnFresh());
    }

    //时间格式YYYY-MM-DD
    getNowFormatDate(date) {
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var formatdate = year + seperator1 + month + seperator1 + strDate;
    return formatdate;
}

    deleteActivity(idActivity)
    {
        this.props.dispatch(deleteActivity(idActivity)).then((json)=>{
            if(json.re==1){
                alert('活动撤销成功！');
                this.props.dispatch(enableActivityOnFresh());
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }
            }
        });

    }

}

var styles = StyleSheet.create({
    container: {

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
        color:'#5c5c5c',
        marginRight: 5
    },
    paymentItem: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    dropdownstyle: {
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
        width:80,
    },
    dropdownstyle2: {
        height: 200,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
        width:100,
    },
    dropdownFont: {
        color:'#5c5c5c',
        marginRight: 5,
        marginLeft:5,
    },
    dropdownrowstyle: {
        height: 40,
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
        trainer:state.user.trainer,
        activityList:state.activity.activityList,
        myEvents:state.activity.myEvents,
        myTakenEvents:state.activity.myTakenEvents,
        visibleEvents:state.activity.visibleEvents,
        activityOnFresh:state.activity.activityOnFresh,
    })
)(Activity);



