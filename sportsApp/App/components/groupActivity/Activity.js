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
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import activityAssortFilter from '../../utils/activityAssortFilter'
import ModalDropdown from 'react-native-modal-dropdown';
import {
    fetchMaintainedVenue
} from '../../action/MapActions';
import Ionicons from 'react-native-vector-icons/Ionicons';

var WeChat=require('react-native-wechat');
var {height, width} = Dimensions.get('window');
const dropdownWidth = width/3-20;

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

    renderAllAvatars(avatars){
        var allAvatars = [];
        if(avatars==null)return null;
        for(var i=0;i<avatars.length;i++) {
            var model = avatars[i]
            var item = this.getImageViewItem(model)
            allAvatars.push(item);
        }
        return allAvatars;
    }

    getImageViewItem(model){

        return (
            <View style={{flex:1,padding:1}}>
            <Image resizeMode="stretch" style={{height:25,width:25,borderRadius:13}} source={{uri:model}}/>
            </View>
        );
    }

    renderRow(rowData,sectionId,rowId){

        var imguri = rowData.avatar;
        var avatars = rowData.avatarList;

        var avatarList = (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                bounces ={false}
                showsHorizontalScrollIndicator  ={true}
                ref={(scrollView) => { this._scrollView = scrollView; }}
                horizontal={true}
            >
                {this.renderAllAvatars(avatars)}
            </ScrollView>
        );

        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}>
                <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row'}}>

                        <View style={{backgroundColor:'#fca482',borderRadius:5,padding:5}}><Text style={{color:'#ffffff'}}>组织者</Text></View>
                                <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.creatorName}</Text>
                    </View>

                     <View style={{flex:2,marginRight:3,justifyContent:'center',alignItems:'flex-end'}}>
                         {
                             rowData.status==1?
                                 //已结束1
                                 <View style={{flexDirection:'row'}}>
                                     <View style={{backgroundColor:'#fc6254',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>活动已结束</Text></View>
                                     <TouchableOpacity style={{justifyContent:'center',alignItems: 'center',padding:5,marginLeft:5}}
                                                       onPress={()=>{this.deleteActivity(rowData.activityId)}}>
                                         <Image style={{width: 20, height: 20}} source={require('../../../img/delete_icon.png')}></Image>
                                     </TouchableOpacity>
                                 </View>
                                 :
                                 //正在报名0
                                 <View style={{flexDirection:'row'}}>
                                     <View style={{backgroundColor:'#66CDAA',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>接受报名中</Text></View>
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
                <View style={{flex:1,flexDirection:'column',padding:10,borderTopWidth:1,borderColor:'#ddd'}}>

                    <View style={{flexDirection:'row',flex:2.5,alignItems:'flex-start'}}>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>

                        <View style={{backgroundColor:'#ffffff',borderRadius:5,padding:5}}><Text style={{color:'#fca482'}}>已报名</Text></View>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.nowNumber}/{rowData.maxNumber}人</Text>
                    </View>

                        <View style={{flex:4,backgroundColor:'#fff',justifyContent:'flex-start',marginBottom:3}}>
                            <TouchableOpacity onPress={()=>{this.navigate2ActivityMember(rowData.activityId)}}>
                        {avatarList}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{backgroundColor:'#fca482',borderRadius:5,padding:5}}><Text style={{color:'#ffffff'}}>已支付</Text></View>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.nowPayment}元</Text>

                        <TouchableOpacity style={{flex:2,justifyContent:'center',alignItems:'flex-end'}}
                                          onPress={()=>{this.navigate2ActivityPay(rowData)}}>
                            <View style={{backgroundColor:'#fc6254',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>收款</Text></View>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
        return row;
    }

    fetchData(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchActivityList()).then((json)=> {
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

            venueName:'场地',
            dateName:'日期',
            statusName:'状态',
            showDateDropdown:false,
            showVenueDropdown:false,
            showStatusDropdown:false,
            venueList:[],venues:[],
            dateList:['今天','明天','后天','一周内'],dateIdx:-1,
            statusList:['正在报名','已结束'],statusIdx:-1,

            venueId:-1,
            dateId:-1,
            statusId:-1
        }
    }

    render() {

        let venueicon = this.state.showVenueDropdown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');
        let dateicon = this.state.showDateDropdown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');
        let statusicon = this.state.showStatusDropdown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');

        var venueName_show = this.lengthFilter(this.state.venueName);
        var dateName_show = this.lengthFilter(this.state.dateName);
        var statusName_show = this.lengthFilter(this.state.statusName);

        var activityListView=null;
        var {activityList,activityOnFresh,visibleEvents,myEvents,myTakenEvents}=this.props;
        if(activityOnFresh==true)
        {
            if(this.state.doingFetch==false)
                //显示的是从今天起所有的活动
                this.fetchData();
        }else {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (activityList !== undefined && activityList !== null && activityList.length > 0) {
                var activityAfterFilter = activityAssortFilter.filter(activityList,this.state.venueId,this.state.dateId,this.state.statusId)
                activityListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(activityAfterFilter)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        return (
            <View style={{flex:1}}>
                <Toolbar width={width} title="群活动" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 //清空筛选记录
                                 var venueId = -1;
                                 var dateId = -1;
                                 var statusId = -1;

                                 this.setState({venueId:venueId,dateId:dateId,statusId:statusId,dateIdx:-1,statusIdx:-1,venueName:'场地',dateName:'日期',statusName:'状态'})
                                 this.navigate2AddActivity()}
                         }}>
                    {/*内容区*/}
                    <View style={styles.flexContainer}>
                        {/*场馆*/}
                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.venueList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_1_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_1_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_1_willHide.bind(this)}
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
                        {/*日期*/}
                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.dateList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_2_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_2_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_2_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {dateName_show}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={dateicon}
                                />
                            </View>
                        </ModalDropdown>
                        {/*状态*/}
                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.statusList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_3_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_3_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_3_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {statusName_show}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={statusicon}
                                />
                            </View>
                        </ModalDropdown>
                        {/*搜索*/}
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    //根据筛选条件进行筛选
                                    var venueflag = false;
                                    var dateflag = false;
                                    var statusflag = false;
                                    var venueId = -1;
                                    var dateId = -1;
                                    var statusId = -1;

                                    for(var i=0;i<this.state.venues.length;i++)
                                        if(this.state.venues[i].name == this.state.venueName)
                                        {
                                            venueId = this.state.venues[i].unitId;
                                            venueflag = true
                                        }
                                    if(venueflag==false)venueId = -1;

                                    //dateList:['今天','明天','后天','一周内']
                                    //statusList:['已结束','正在报名']
                                    dateId = this.state.dateIdx;
                                    statusId = this.state.statusIdx;

                                    this.setState({venueId:venueId,dateId:dateId,statusId:statusId})
                                }}
                            >
                                <Ionicons name='md-search' size={20} color="#5c5c5c"/>
                            </TouchableOpacity>
                        </View>
                        {/*清空*/}
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    var venueId = -1;
                                    var dateId = -1;
                                    var statusId = -1;

                                    this.setState({venueId:venueId,dateId:dateId,statusId:statusId,dateIdx:-1,statusIdx:-1,venueName:'场地',dateName:'日期',statusName:'状态'})
                                }}
                            >
                                <Ionicons name='md-refresh' size={20} color="#5c5c5c"/>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{flex:5,backgroundColor:'#eee'}}>
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
                                />}
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
                </Toolbar>
            </View>
        );
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
            venueName:value,
        });
    }

    dropdown_2_onSelect(idx, value) {
        this.setState({
            dateName:value,
            dateIdx:idx,
        });
    }

    dropdown_3_onSelect(idx, value) {
        this.setState({
            statusName:value,
            statusIdx:idx,
        });
    }

    dropdown_1_willShow() {
        this.setState({
            showVenueDropDown:true,
        });
    }

    dropdown_2_willShow() {
        this.setState({
            showDateDropDown:true,
        });
    }

    dropdown_3_willShow() {
        this.setState({
            showStatusDropDown:true,
        });
    }

    dropdown_1_willHide() {
        this.setState({
            showVenueDropDown:false,
        });
    }

    dropdown_2_willHide() {
        this.setState({
            showDateDropDown:false,
        });
    }

    dropdown_3_willHide() {
        this.setState({
            showStatusDropDown:false,
        });
    }

    lengthFilter(data){
        if(data.length>5){
            data=data.substring(0,4);
            data = data+'...'
        }
        return data;
    }

    componentWillUnmount(){
        this.props.dispatch(enableActivityOnFresh());
    }

    componentDidMount(){
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
    viewcell: {
        width:dropdownWidth-0.7,
        backgroundColor:'#ffffff',
        alignItems:'center',
        height:35,
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
        trainer:state.user.trainer,
        activityList:state.activity.activityList,
        myEvents:state.activity.myEvents,
        myTakenEvents:state.activity.myTakenEvents,
        visibleEvents:state.activity.visibleEvents,
        activityOnFresh:state.activity.activityOnFresh,
    })
)(Activity);



