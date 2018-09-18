import React, { Component } from 'react';
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
    Alert,
    DeviceEventEmitter,
    NativeModules,
    Platform,
    findNodeHandle,
    AppRegistry,
    NativeEventEmitter,
} from 'react-native';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import TextInputWrapper from 'react-native-text-input-wrapper'
import CreateBadmintonCourse from './CreateBadmintonCourse';
import CreateCustomerPlan from './CreateCustomerPlan';
import CustomerCourseList from './CustomerCourseList';
import ModifyDistribution from './ModifyDistribution';
import StudentInformation from './StudentInformation';
import RecordClass from './RecordClass';
import SignUpModal from '../my/modal/SignUpModal'
import AddGroup from './AddGroup';
import AddClass from  './AddClass';
import ClassSignUp from './ClassSignUp';
import TalkingFarm from './TalkingFarm';
import Camera from '../getCamera';
import AssortFilter from '../../utils/AssortFilter'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import {
    fetchCourses,
    fetchCoursesByCreatorId,
    onCoursesOfCoachUpdate,
    onCoursesUpdate,
    disableCoursesOfCoachOnFresh, enableCoursesOfCoachOnFresh,
    getGroupMember, createCourseGroup, saveOrUpdateBadmintonCourseClassRecords, updateIsHasPhotoStatus,
    establishEveryDayClass,fetchAllCourses,
} from '../../action/CourseActions';
import {
    fetchMaintainedVenue
} from '../../action/MapActions';
import ModalDropdown from 'react-native-modal-dropdown';
import {getAccessToken, onUsernameUpdate, updateUsername,fetchClubList} from '../../action/UserActions';
import BadmintonCourseSignUp from './BadmintonCourseSignUp';
import FaceDetect from '../../native/FaceDetectModule';
import FaceCollection from './FaceCollection';
import OrderClass from './OrderClass';
import proxy from "../../utils/Proxy";
import Config from "../../../config";
import{
    fetchCoaches,
    onCoachUpdate,
} from '../../action/CoachActions';
var FaceViewManager = NativeModules.FaceViewManager;
const NativeModule = new NativeEventEmitter(FaceViewManager);
const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

var { height, width } = Dimensions.get('window');
const dropdownWidth = width/3-20;

class BadmintonCourseRecord extends Component {
    navigate2OrderClass() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'OrderClass',
                component: OrderClass,
                params: {
                    course:this.state.course
                }
            })
        }
    }

    //导航至定制（for 教练）
    navigate2AddCourse() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateBadmintonCourse',
                component: CreateBadmintonCourse,
                params: {
                    setMyCourseList:this.setMyCourseList.bind(this)
                }
            })
        }
    }
    //添加分组
    navigate2AddGroup(course,memberId) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'AddGroup',
                component: AddGroup,
                params: {
                    course:course,
                    memberId:memberId
                }
            })
        }
    }


    //照片采集
    navigate2FaceCollection(course,img) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'FaceCollection',
                component: FaceCollection,
                params: {
                    course:course,
                 img:img
                }
            })
        }
    }


    //导航至定制（for 用户）
    navigate2BadmintonCourseForUser() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateCustomerPlan',
                component: CreateCustomerPlan,
                params: {

                }
            })
        }
    }

    navigate2ModifyDistribution(course){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'ModifyDistribution',
                component: ModifyDistribution,
                params: {
                    course:course
                }
            })
        }
    }

    navigate2TalkingFarm(courseId){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'TalkingFarm',
                component: TalkingFarm,
                params: {
                    courseId:courseId
                }
            })
        }
    }

    //导航至定制列表（for 教练）
    navigate2CustomCourseList(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name:'CustomerCourseList',
                component:CustomerCourseList,
                params: {

                }
            })
        }
    }

    navigate2RecordClass(rowData){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name:'RecordClass',
                component:RecordClass,
                params: {
                    courseId:rowData.courseId,
                    course:rowData
                }
            })
        }
    }

    navigate2CourseRecord()
    {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'BadmintonCourseRecord',
                component: BadmintonCourseRecord,
                params: {

                }
            })
        }
    }

    navigate2ClassSignUp(rowData)
    {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'BadmintonCourseRecord',
                component: ClassSignUp,
                params: {
                        course:rowData,
                }
            })
        }
    }

    navigate2AddClass(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateBadmintonCourse',
                component: CreateBadmintonCourse,
                params: {
                    //setMyCourseList:this.setMyCourseList.bind(this)
                }
            })
        }
    }

    navigate2Camera(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'Camera',
                component: Camera,
                params: {
                    //setMyCourseList:this.setMyCourseList.bind(this)
                }
            })
        }
    }

    navigate2AddClass1(rowData){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'AddClass',
                component: AddClass,
                params: {
                    course:rowData,
                }
            })
        }
    }

    navigate2StudentInformation(courseId){
    const { navigator } = this.props;
        if (navigator) {
        navigator.push({
        name: 'StudentInformation',
        component: StudentInformation,
        params: {
                 courseId:courseId
              }
         })
      }
    }


    goBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    setMyCourseList()
    {
        if(this.props.userType=='M'){
            this.props.dispatch(fetchAllCourses()).then((json)=>{
                if(json.re==1)
                {
                    this.props.dispatch(onCoursesOfCoachUpdate(json.data))
                }else{
                    if(json.re==-100){
                        this.props.dispatch(getAccessToken(false));
                    }
                }
            })
        }
        else{
            this.props.dispatch(fetchCoursesByCreatorId(creatorId)).then((json)=>{
                if(json.re==1)
                {
                    this.props.dispatch(onCoursesOfCoachUpdate(json.data))
                }else{
                    if(json.re==-100){
                        this.props.dispatch(getAccessToken(false));
                    }
                }
            })
        }
    }

    renderRow(rowData, sectionId, rowId) {

        var avatar = require('../../../img/portrait.jpg');
        if(rowData.creatorId==3)avatar = require('../../../img/coach3.jpg');
        if(rowData.creatorId==154)avatar = require('../../../img/coach74.jpg');

        if(rowData.detail==null)rowData.detail='暂无简介'

        return (
            <View style={{ flexDirection: 'column', borderBottomWidth: 1, borderColor: '#ddd', marginTop: 4 ,backgroundColor:'#fff'}}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:5}}>
                    <View style={{ padding: 6, paddingHorizontal: 10 ,flexDirection:'row',}}>
                        <View style={{padding:4,flex:1,alignItems:'center',flexDirection:'row'}}>
                            <Text style={{ color: '#222', fontSize: 19 }}>
                                {rowData.courseName}
                            </Text>
                        </View>

                        {
                            rowData.status==1?
                            <View style={{padding: 4, marginLeft: 10, flexDirection: 'row', alignItems: 'center',backgroundColor:'#fc3c3f',borderRadius: 6}}>
                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 13, paddingTop: -2}}>
                                已完成
                                </Text>
                            </View>:
                                <View style={{padding: 4, marginLeft: 10, flexDirection: 'row', alignItems: 'center',backgroundColor:'#80ccba',borderRadius: 6}}>
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 13, paddingTop: -2}}>
                                        已发布
                                    </Text>
                                </View>
                        }
                    </View>

                    <View style={{ padding:6, paddingHorizontal: 12,flexDirection:'column'}}>
                        <Text style={{ color: '#666', fontSize: 13}}>
                            {rowData.detail}
                        </Text>
                    </View>

                    <View style={{ padding: 6, paddingHorizontal:6,flexDirection:'row',marginTop:3}}>
                        <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                            <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={avatar}/>
                        </View>
                        <View style={{flex:4,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{ color: '#222', fontSize: 17,marginBottom:5}}>{rowData.creatorName}</Text>
                    <Text style={{ color: '#666', fontSize: 13}}>{rowData.coachLevel}</Text>
                        </View>
                    <View style={{flex:1,flexDirection:'column'}}>
                        <Text style={{ color: '#222', fontSize: 16,marginBottom:5}}>课时</Text>
                        <Text style={{ color: '#555', fontSize: 16}}>{rowData.classCount}次</Text>
                    </View>
                    </View>

                    <View style={{ paddingTop: 12, paddingBottom: 4, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center',marginBottom:5}}>
                        {/*俱乐部*/}
                        <View style={{backgroundColor: '#efb66a', borderRadius: 6, padding: 4, paddingHorizontal: 6 }}>
                            <Text style={{ color: '#fff', fontSize: 13 }}>
                                {rowData.clubName}
                            </Text>
                        </View>
                        {/*场地*/}
                        <View style={{backgroundColor: '#fc3c3f', borderRadius: 6, padding: 4, paddingHorizontal: 6,marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 13 }}>
                                {rowData.unitName}
                            </Text>
                        </View>
                        {/*价格*/}
                        <View style={{padding: 4, paddingHorizontal: 6,flex:1,alignItems:'flex-end'}}>
                            <Text style={{ color: '#f00', fontSize: 20}}>
                                ￥{rowData.cost}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{flex:1,flexDirection:'row',padding:10,borderTopWidth:1,borderColor:'#ddd'}}>
                    {
                        rowData.isOwner===1?
                    <TouchableOpacity style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#66CDAA',
                        padding: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 6,
                        marginLeft:10,
                        marginRight:30
                    }}
                    onPress={() => {
                        //清空筛选记录
                        var clubId = -1;
                        var venueId = -1;
                        var coachId = -1;

                        this.setState({clubId:clubId,venueId:venueId,coachId:coachId,clubName:'俱乐部',venueName:'场地',coachName:'教练'})
                        this.navigate2StudentInformation(rowData.courseId);}
                    }>
                        <Text style={{color: '#66CDAA', fontSize: 14}}>学员信息</Text>
                    </TouchableOpacity>:null
                    }

                    <TouchableOpacity style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#66CDAA',
                        padding: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 6,
                        marginRight:30
                    }}
                    onPress={() => {
                        //清空筛选记录
                        var clubId = -1;
                        var venueId = -1;
                        var coachId = -1;

                        this.setState({clubId:clubId,venueId:venueId,coachId:coachId,clubName:'俱乐部',venueName:'场地',coachName:'教练',course:rowData})
                        this.props.dispatch(establishEveryDayClass(rowData)).then((json)=>{
                        //人脸识别
                        this.sharetoSomeone.show();
                        }).catch((e)={});
                    }
                    }>
                        <Text style={{color: '#66CDAA', fontSize: 14}}>上课签到</Text>
                    </TouchableOpacity>

                    {
                        rowData.isOwner==1?
                        <TouchableOpacity style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#66CDAA',
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 6,
                            marginRight: 30
                        }}
                        onPress={() => {
                            //清空筛选记录
                            var clubId = -1;
                            var venueId = -1;
                            var coachId = -1;

                            this.setState({clubId:clubId,venueId:venueId,coachId:coachId,clubName:'俱乐部',venueName:'场地',coachName:'教练'})
                            this.navigate2ModifyDistribution(rowData);
                            }
                        }>
                            <Text style={{color: '#66CDAA', fontSize: 14}}>编辑课程</Text>
                        </TouchableOpacity>:null
                    }
                    {
                        rowData.isOwner === 1 ?
                            <TouchableOpacity style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: '#66CDAA',
                                padding: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 6,
                            }}

                                              onPress={() => {
                                                  //清空筛选记录
                                                  var clubId = -1;
                                                  var venueId = -1;
                                                  var coachId = -1;

                                                  this.setState({clubId:clubId,venueId:venueId,coachId:coachId,clubName:'俱乐部',venueName:'场地',coachName:'教练'})
                                                  this.navigate2TalkingFarm(rowData.courseId);
                                              }
                                              }>
                                <Text style={{color: '#66CDAA', fontSize: 14}}>讨论组</Text>
                            </TouchableOpacity>:null
                    }

                    {
                        rowData.isOwner===1?
                        <TouchableOpacity style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#66CDAA',
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 6,
                            marginLeft: 30
                        }}
                                          onPress={() => {
                                              //清空筛选记录
                                              var clubId = -1;
                                              var venueId = -1;
                                              var coachId = -1;

                                              this.setState({clubId:clubId,venueId:venueId,coachId:coachId,clubName:'俱乐部',venueName:'场地',coachName:'教练'})
                                              this.navigate2AddClass1(rowData);
                                          }
                                          }>
                            <Text style={{color: '#66CDAA', fontSize: 14}}>添加小课</Text>
                        </TouchableOpacity>:null
                    }
                </View>
            </View>
        )
    }

    fetchCoursesByCreatorId(creatorId){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchCoursesByCreatorId(creatorId)).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disableCoursesOfCoachOnFresh());
            this.setState({doingFetch:false,isRefreshing:false})
        }).catch((e)=>{
            this.props.dispatch(disableCoursesOfCoachOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }

    fetchAllCourses(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchAllCourses()).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disableCoursesOfCoachOnFresh());
            this.setState({doingFetch:false,isRefreshing:false})
        }).catch((e)=>{
            this.props.dispatch(disableCoursesOfCoachOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
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
        this.props.dispatch(enableCoursesOfCoachOnFresh());

    }

    constructor(props) {
        super(props);
        this.state = {
            course:null,
            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),

            clubName:'俱乐部',
            venueName:'场地',
            coachName:'教练',
            showClubDropdown:false,
            showVenueDropdown:false,
            showCoachDropdown:false,
            clubList:[],clubs:[],
            venueList:[],venues:[],
            coachList:[],coaches:[],

            clubId:-1,
            venueId:-1,
            coachId:-1,

        };
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }
    showUserNameDialog() {
        this.SignUpDialog.show();
    }

    render() {
        var coursesOfCoachListView=null;
        var {coursesOfCoach,coursesOfCoachOnFresh}=this.props;

        if(coursesOfCoachOnFresh==true )
        {
            if(this.state.doingFetch==false) {
                if(this.props.userType=='M')
                    this.fetchAllCourses();
                else
                    this.fetchCoursesByCreatorId(this.props.creatorId);
            }
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (coursesOfCoach !== undefined && coursesOfCoach !== null && coursesOfCoach.length > 0)
            {
                var coursesAfterFilter = AssortFilter.filter(coursesOfCoach,this.state.clubId,this.state.venueId,this.state.coachId)
                coursesOfCoachListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        //列表中数据
                        dataSource={ds.cloneWithRows(coursesAfterFilter)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        let clubicon = this.state.showClubDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');
        let venueicon = this.state.showVenueDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');
        let coachicon = this.state.showCoachDropDown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');

        var clubName_show = this.lengthFilter(this.state.clubName);
        var venueName_show = this.lengthFilter(this.state.venueName);
        var coachName_show = this.lengthFilter(this.state.coachName);

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="课程记录" navigator={this.props.navigator} actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 //清空筛选记录
                                 var clubId = -1;
                                 var venueId = -1;
                                 var coachId = -1;

                                 this.setState({clubId:clubId,venueId:venueId,coachId:coachId,clubName:'俱乐部',venueName:'场地',coachName:'教练'})

                                 this.navigate2AddCourse()}
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
                            options={this.state.coachList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_3_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_3_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_3_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {coachName_show}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={coachicon}
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
                                var coachflag = false;
                                var clubId = -1;
                                var venueId = -1;
                                var coachId = -1;
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

                                for(var i=0;i<this.state.coaches.length;i++)
                                    if(this.state.coaches[i].perName == this.state.coachName)
                                    {
                                        coachId = this.state.coaches[i].personId;
                                        coachflag = true
                                    }
                                if(coachflag==false)coachId = -1;

                                this.setState({clubId:clubId,venueId:venueId,coachId:coachId})
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
                                    var coachId = -1;

                                    this.setState({clubId:clubId,venueId:venueId,coachId:coachId,clubName:'俱乐部',venueName:'场地',coachName:'教练'})
                                }}
                            >
                                <Ionicons name='md-refresh' size={20} color="#5c5c5c"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {<View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-100,paddingTop:5,paddingBottom:5,}}>
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
                                {coursesOfCoachListView}
                                {
                                    coursesOfCoachListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }
                            </ScrollView>
                        </Animated.View>
                    </View>}
                </Toolbar>

                {/*保存用户名*/}
                <PopupDialog
                    ref={(popupDialog) => {
                        this.SignUpDialog = popupDialog;
                    }}
                    dialogAnimation={scaleAnimation}
                    actions={[]}
                    width={0.8}
                    height={0.3}
                >
                    <SignUpModal
                        val={this.props.SignUp}
                        onClose={()=>{
                            this.SignUpDialog.dismiss();
                        }}
                        onConfirm={(val)=>{
                            this.props.dispatch(getGroupMember(this.state.course.courseId,val))
                                .then((json)=>{
                                    if(json.re==1){
                                        this.SignUpDialog.dismiss();
                                        Alert.alert("友情提示","签到成功",[{text:"取消"},
                                            {text:"确认",onPress:()=>this.navigate2AddGroup(this.state.course)}]);

                                    }
                                })
                                .catch((e)=>{
                                    Alert.alert("签到失败");
                                })
                        }}
                    />

                </PopupDialog>
                <PopupDialog
                    ref={(popupDialog) => {
                        this.sharetoSomeone = popupDialog;
                    }}
                    dialogAnimation={scaleAnimation}
                    actions={[]}
                    width={0.8}
                    height={0.25}
                >
                    <View style={{flex:1,padding:10,alignItems:"center",flexDirection:"row",justifyContent:"center"}}>

                        <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                            <TouchableOpacity style={{flex:1,alignItems:"center",justifyContent:"center"}}
                                              onPress={()=>{
                                                  if(Platform.OS=== 'android'){
                                                      this.sharetoSomeone.dismiss();
                                                      FaceDetect.faceDetect();
                                                  }else{
                                                      FaceViewManager.getFaceView("test");
                                                  }
                                              }}
                            >
                                <Image resizeMode="stretch" style={{height:40,width:40}} source={require('../../../img/sign.png')}/>
                                <Text style={{marginTop:10,fontSize:13}}>现场签到</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                            <TouchableOpacity style={{flex:1,alignItems:"center",justifyContent:"center"}}
                                              onPress={()=>{
                                                  this.sharetoSomeone.dismiss();
                                                  this.navigate2OrderClass();

                                              }}
                            >
                                <Image resizeMode="stretch" style={{height:40,width:40}} source={require('../../../img/appointment.png')}/>
                                <Text style={{marginTop:10,fontSize:13}}>预约签到</Text>
                            </TouchableOpacity>
                        </View>

                    </View>


                </PopupDialog>
            </View>
        )
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
        this.setState({
            coachName:value,
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
            showCoachDropDown:true,
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
            showCoachDropDown:false,
        });
    }

    lengthFilter(data){
        if(data.length>5){
            data=data.substring(0,4);
            data = data+'...'
        }
        return data;
    }

    componentWillMount(){
        NativeModule.addListener('EventName',(data)=>{
           // alert("asdadasd");
        });

        DeviceEventEmitter.addListener('EventName',(img)=>{

            proxy.postes({
                url: Config.server + '/func/allow/aipface',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    img:img
                }
            }).then((json) => {
                var data = json.data;
                if(data=="您不属于这个课程"){
                    Alert.alert('信息','采集照片成功，请选择对应学员上传照片',[{text:'确认',onPress:()=>{
                            this.navigate2FaceCollection(this.state.course,img);

                        }}]);
                }else{
                    var dataint=parseInt(data);
                    var data1=new Array();
                    data1.push({"memberId":dataint,"select":true});
                    this.props.dispatch(saveOrUpdateBadmintonCourseClassRecords(data1,this.state.course.courseId)).then((json)=>{
                        if(json.re==1){
                            //this.goBack();

                            Alert.alert('信息','学号为'+dataint+'的学生签到成功!',[{text:'确认',onPress:()=>{
                                    this.navigate2AddGroup(this.state.course,dataint);
                                    // this.props.setClassRecord(this.props.courseId,);

                                }}]);
                        }else{
                            if(json.re==-100){
                                this.props.dispatch(getAccessToken(false));
                            }
                        }
                    })
                    //alert("学号为"+dataint+"的学生签到成功");
                }
            }).catch((err) => {
                alert(err);
            });
        })
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

        //获取所有教练
        this.props.dispatch(fetchCoaches()).then((json)=>{
            if(json.re==1)
            {
                var coachDataList = [];
                for(var i=0;i<json.data.length;i++)
                    coachDataList.push(json.data[i].perName);
                this.setState({coachList:coachDataList,coaches:json.data});
            }
            else{
                if(ison.re=-100) {
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

    componentWillUnmount()
    {
        this.props.dispatch(enableCoursesOfCoachOnFresh());
    }

    showState()
    {
        this.setState({content:'已经收到了原生模块发送来的事件'})
    }

}

async function test() {
    try {
        var {
            user_id,
        } = await FaceDetect.tryPromise("success");

        alert(user_id);
    } catch (e) {
        console.error(e);
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection:'column'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: 14
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
        userType: state.user.usertype.perTypeCode,
        coursesOfCoach:state.course.coursesOfCoach,
        coursesOfCoachOnFresh:state.course.coursesOfCoachOnFresh,
        creatorId:state.user.personInfo.personId,
    })
)(BadmintonCourseRecord);

export default class NextSecond extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <NavigatorIOS
                initialRoute={{
                    component: BadmintonCourseRecord,
                    title: 'BadmintonCourseRecord',
                    passProps:{text: this.props.text}
                }}
                barTintColor= 'cyan'
                style={{flex: 1}}
            />
        );
    }
}

AppRegistry.registerComponent('NextSecond', ()=> NextSecond);