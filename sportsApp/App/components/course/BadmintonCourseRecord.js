
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

var FaceViewManager = NativeModules.FaceViewManager;
const NativeModule = new NativeEventEmitter(FaceViewManager);
const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });
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


import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
var { height, width } = Dimensions.get('window');
import {
    fetchCourses,
    fetchCoursesByCreatorId,
    onCoursesOfCoachUpdate,
    onCoursesUpdate,
    disableCoursesOfCoachOnFresh, enableCoursesOfCoachOnFresh,
    getGroupMember, createCourseGroup, saveOrUpdateBadmintonCourseClassRecords, updateIsHasPhotoStatus,
    establishEveryDayClass,fetchAllCourses,
} from '../../action/CourseActions';

import {getAccessToken, onUsernameUpdate, updateUsername,} from '../../action/UserActions';

import BadmintonCourseSignUp from './BadmintonCourseSignUp';
import FaceDetect from '../../native/FaceDetectModule';
import FaceCollection from './FaceCollection';
import OrderClass from './OrderClass';
import proxy from "../../utils/Proxy";
import Config from "../../../config";
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
        return (
            <TouchableOpacity style={{ flexDirection: 'column', borderBottomWidth: 1, borderColor: '#ddd', marginTop: 4 }}
                              onPress={()=>{


                              }}
            >
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <View style={{ padding: 4, paddingHorizontal: 12 ,flexDirection:'row',}}>

                        <View style={{padding:4,flex:1,alignItems:'center',flexDirection:'row'}}>
                            <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>
                                {rowData.courseName}
                            </Text>
                        </View>


                        <View style={{padding:4,marginLeft:10,flexDirection:'row',alignItems:'center'}}>
                            <CommIcon name="account-check" size={24} color="#0adc5e" style={{backgroundColor:'transparent',}}/>
                            <Text style={{ color: '#444', fontWeight: 'bold', fontSize: 13,paddingTop:-2 }}>
                                {rowData.creatorName}教练
                            </Text>
                        </View>
                    </View>

                    <View style={{ padding: 3, paddingHorizontal: 12 }}>
                        <Text style={{ color: '#444', fontSize: 13 }}>
                            {rowData.detail}
                        </Text>
                    </View>

                    <View style={{ paddingTop: 12, paddingBottom: 4, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#f00', fontSize: 12, width: 50 }}>
                            ￥{rowData.cost}
                        </Text>

                        <View style={{ backgroundColor: '#66CDAA', borderRadius: 6, padding: 4, paddingHorizontal: 6, marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>
                                {rowData.classCount}课次
                            </Text>
                        </View>

                        <View style={{ backgroundColor: '#ff4730', borderRadius: 6, padding: 4, paddingHorizontal: 6, marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>
                                {rowData.unitName}
                            </Text>
                        </View>
                    </View>
                </View>

                {/*<View style={{ width: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name={'angle-right'} size={34} color="#444" style={{ backgroundColor: 'transparent', marginTop: -10 }} />
                </View>*/}

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
                                          this.navigate2StudentInformation(rowData.courseId);
                                      }
                                      }>
                        <Text style={{color: '#66CDAA', fontSize: 12}}>学员信息</Text>
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
                                          this.setState({course:rowData});

                                          this.props.dispatch(establishEveryDayClass(rowData)).then((json)=>{
                                              this.sharetoSomeone.show();
                                          }).catch((e)={

                                          });


                                      }
                                      }>
                        <Text style={{color: '#66CDAA', fontSize: 12}}>上课签到</Text>
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
                                              this.navigate2ModifyDistribution(rowData);
                                          }
                                          }>
                            <Text style={{color: '#66CDAA', fontSize: 12}}>编辑课程</Text>
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
                                                  this.navigate2TalkingFarm(rowData.courseId);
                                              }
                                              }>
                                <Text style={{color: '#66CDAA', fontSize: 12}}>讨论组</Text>
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
                                              this.navigate2AddClass1(rowData);
                                          }
                                          }>
                            <Text style={{color: '#66CDAA', fontSize: 12}}>添加小课</Text>
                        </TouchableOpacity>:null
                    }

                </View>




            </TouchableOpacity>




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
        //es5语法中可写作:
        //var coursesOfCoach = this.props.coursesOfCoach
        //var coursesOfCoachOnFresh = this.props.coursesOfCoachOnFresh
        //var competitionList=this.state.competitionList;
        if(coursesOfCoachOnFresh==true)
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
                coursesOfCoachListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        //列表中数据
                        dataSource={ds.cloneWithRows(coursesOfCoach)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="上课记录" actions={[]} navigator={this.props.navigator}>

                    {<View style={{flex:5,backgroundColor:'#eee'}}>
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
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#66CDAA',
                    position:'absolute',bottom:8}}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#66CDAA',justifyContent:'center',alignItems: 'center',
                        padding:10,margin:5}}/* onPress={()=>{this.navigate2MyActivity(myEvents,'我的活动');}}*/>
                        {/* <Text style={{color:'#fff',}}>我发起的活动</Text>*/}
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#66CDAA',justifyContent:'center',alignItems: 'center',
                        padding:10,margin:5}} /*onPress={()=>{this.navigate2AddClass();}}*/>
                        {/* <Text style={{color:'#fff',}}>我要添加课程</Text>*/}
                    </TouchableOpacity>

                </View>
                <View style={{height:50,width:50,borderRadius:25,position:'absolute',bottom:8,left:width*0.5-25}}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems: 'center',padding:5,
                        borderWidth:1,borderColor:'#eee',borderRadius:50}}
                                      onPress={()=>{this.navigate2AddCourse();}}>
                        <Icon name={'plus-circle'} size={35} color='#66CDAA'/>
                    </TouchableOpacity>
                </View>

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
                                                      {/*test();*/}
                                                  }else{
                                                      FaceViewManager.getFaceView("test");
                                                  }
                                              }}
                            >
                                <Icon name={'user-circle'} size={45} color='#00CD00'/>
                                <Text>现场签到</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
                            <TouchableOpacity style={{flex:1,alignItems:"center",justifyContent:"center"}}
                                              onPress={()=>{
                                                  this.sharetoSomeone.dismiss();
                                                  this.navigate2OrderClass();

                                              }}
                            >
                                <CommIcon name="account-check" size={45} color="#0adc5e" />
                                <Text>预约签到</Text>
                            </TouchableOpacity>
                        </View>

                    </View>


                </PopupDialog>
            </View>
        )
    }

    componentDidMount()
    {

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
        backgroundColor: '#fff'
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
    }
});


module.exports = connect(state=>({
        userType: state.user.usertype.perTypeCode,
        coursesOfCoach:state.course.coursesOfCoach,
        coursesOfCoachOnFresh:state.course.coursesOfCoachOnFresh,
        creatorId:state.user.personInfo.personId
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