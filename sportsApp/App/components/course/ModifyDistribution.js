import React,{Component} from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    Modal,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputWrapper from 'react-native-text-input-wrapper';
import CourseTimeModal from './CourseTimeModal';
import VenueInspect from '../../components/venue/VenueInspect';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import ActionSheet from 'react-native-actionsheet';
import SelectVenue from '../../components/venue/SelectVenue';
import{
    distributeCourse,
    modifyCourse,
    enableCoursesOfCoachOnFresh
} from '../../action/CourseActions';
import {getAccessToken,} from '../../action/UserActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SelectCoach from './SelectCoach';

var {height, width} = Dimensions.get('window');
const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

class ModifyBadmintonCourse extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    //选类型
    _handlePress(index) {

        if(index!==0){
            var costType = index;
            this.setState({course:Object.assign(this.state.course,{costType:costType.toString()})});
        }

    }
    //选等级
    _handlePress1(index) {

        if(index!==0){
            var classType = index;
            this.setState({course:Object.assign(this.state.course,{courseGrade:parseInt(classType)})});
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
    }


    show1(actionSheet1) {
        this[actionSheet1].show();
    }


    setCoursePlace(coursePlace)
    {
        this.setState({course:Object.assign(this.state.course,{unitId:parseInt(coursePlace.unitId),unitName:coursePlace.name})});
    }

    setCourseCoach(field,coachId)
    {
        this.setState({course:Object.assign(this.state.course,{coachId:field,trainerId:coachId})});
    }

    navigate2VenueInspect()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'VenueInspect',
                component: VenueInspect,
                params: {
                    setPlace:this.setCoursePlace.bind(this)
                }
            })
        }
    }

    navigate2SelectCoach()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'SelectCoach',
                component: SelectCoach,
                params: {
                    setCoach:this.setCourseCoach.bind(this)
                }
            })
        }
    }

    searchMember(info){
        this.props.dispatch(searchMember(info)).then((json)=>{
            if(json.re==1){
                this.setState({member:json.data});
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }else{
                    alert('该用户未注册，是否邀请');
                    //TODO:微信分享邀请好友
                }
            }
        });
    }

    removeMember(timeList,rowData) {

        var index=-1;
        timeList.map((time, i) => {
            if(time.id==rowData.id){
                index = i;
            }
        });
        if(index!==-1){
            timeList.splice(index, 1);
            this.setState({timeList:timeList});
        }
    }

    renderRow(rowData,sectionId,rowId){

        var dayMap=['周一','周二','周三','周四','周五','周六','周日']
        var dayStr=dayMap[rowData.day-1]

        var row=(
            <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff',marginBottom:5,padding:5,borderBottomWidth:1,
                borderColor:'#eee',borderRadius:8,margin:5}}>

                <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',}}>
                    <View style={{flex:1}}>
                        <Text style={{color:'#888'}}>{rowData.id}.</Text>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={{color:'#888'}}>{dayStr}</Text>
                    </View>
                    <View style={{flex:2,}}>
                        <Text style={{color:'#aaa'}}>{rowData.startTime}   -</Text>
                    </View>
                    <View style={{flex:2,marginLeft:5}}>
                        <Text style={{color:'#aaa'}}>{rowData.endTime}</Text>
                    </View>
                </View>

                <TouchableOpacity style={{flex:1}}
                                  onPress={()=>{
                                      this.removeMember(this.state.timeList,rowData);
                                  }}>
                    <Icon name={'minus-circle'} size={20} color="#FF4040"/>
                </TouchableOpacity>
            </View>
        );
        return row;
    }

    constructor(props) {
        super(props);
        this.state={
            dialogShow: false,
            modalVisible:false,
            course:{courseId:this.props.course.courseId,courseName:this.props.course.courseName,maxNumber:this.props.course.maxNumber,coachId:this.props.course.coachId,trainerId:this.props.course.trainerId,
                classCount:this.props.course.classCount,cost:this.props.course.cost,courseGrade:this.props.course.courseGrade,unitName:this.props.course.unitName,
                costType:this.props.course.costType,detail:this.props.course.detail,coursePlace:this.props.course.coursePlace,unitId:this.props.course.unitId,scheduleDes:this.props.course.scheduleDes},
            doingFetch: false,
            isRefreshing: false,
            time:null,
            timeList:[],
            costTypeButtons:['取消','按人支付','按小时支付','按班支付'],
            venue:this.props.course.venue
        }
        this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }


    render() {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const CANCEL_INDEX1 = 0;
        const DESTRUCTIVE_INDEX1 = 1;

        const costTypeButtons=['取消','按人支付','按小时支付','按班支付'];
        const classTypeButtons=['取消','初级班','中级班','高级班'];

        var timeList = this.state.timeList;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if(timeList!==undefined&&timeList!==null&&timeList.length>0)
        {
            timeList=(
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(timeList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        var costTypeStr = null;
        switch(this.state.course.costType){
            case '1':costTypeStr = '按人支付';break;
            case '2':costTypeStr = '按小时支付';break;
            case '3':costTypeStr = '按班支付';break;
            default:costTypeStr = '请选择支付方式';break;
        }

        var classTypeStr = null;
        switch (this.state.course.courseGrade){
            case 1:classTypeStr = '初级班';break;
            case 2:classTypeStr = '中级班';break;
            case 3:classTypeStr = '高级班';break;
        }


        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="编辑课程" actions={[]} navigator={this.props.navigator}>
                    <KeyboardAwareScrollView style={{height:height-180,width:width,padding:5}}>
                        <View style={{flex:5,backgroundColor:'#eee'}}>

                            <View style={{height:30,width:width,justifyContent:'center',textAlign:'left'}}>
                                <Text style={{color:'#666',fontSize:13}}>课程基本信息</Text>
                            </View>


                            {/*课程名称*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>课程名称</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3}}
                                        placeholder={this.props.course.courseName}
                                        value={this.state.course.courseName}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({course:Object.assign(this.state.course,{courseName:value})})
                                            }}
                                    />
                                </View>
                            </View>

                            {/*课程类型*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>课程等级</Text>
                                </View>
                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}
                                                  onPress={()=>{ this.show('actionSheet1'); }}>
                                    {
                                        classTypeStr==null?
                                            <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#888',fontSize:14}}>请选择课程等级 ></Text>
                                            </View> :
                                            <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#444',fontSize:14}}>{classTypeStr}</Text>
                                            </View>

                                    }
                                    <ActionSheet
                                        ref={(p) => {
                                            this.actionSheet1 =p;
                                        }}
                                        title="请选择课程类型"
                                        options={classTypeButtons}
                                        cancelButtonIndex={CANCEL_INDEX1}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX1}
                                        onPress={
                                            (data)=>{ this._handlePress1(data); }
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            {/*课程目标*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>课程目标</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3}}
                                        placeholder={this.props.course.detail}
                                        value={this.state.course.detail}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({course:Object.assign(this.state.course,{detail:value})})
                                            }}
                                    />
                                </View>
                            </View>

                            {/*上课时间描述*/}
                            <View style={{height:120,width:width,flexDirection:'column',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{height:40,width:width,justifyContent:'center',textAlign:'left'}}>
                                    <Text style={{color:'#343434'}}>课程安排</Text>
                                </View>
                                <TextInput
                                    style={{height:80,width:width,fontSize:14,marginTop:5,borderRadius:5,backgroundColor:'#fff'}}
                                    onChangeText={(text) =>
                                    {
                                        this.setState({course:Object.assign(this.state.course,{scheduleDes:text})});
                                    }}
                                    value={this.state.course.scheduleDes}
                                    placeholder={this.props.course.scheduleDes}
                                    placeholderTextColor="#888"
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                />
                            </View>

                            <View style={{height:30,width:width,justifyContent:'center',textAlign:'left'}}>
                                <Text style={{color:'#666',fontSize:13}}>授课信息</Text>
                            </View>

                            {/*课程人数*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>课程容量</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3}}
                                        placeholder={this.props.course.maxNumber+''}
                                        value={this.state.course.maxNumber+''}
                                        onChangeText={
                                            (value)=>{
                                                value==''?
                                                    this.setState({course:Object.assign(this.state.course,{maxNumber:''})}):
                                                    this.setState({course:Object.assign(this.state.course,{maxNumber:parseInt(value)})})
                                            }}
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>

                            {/*课次*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>授课课次</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3}}
                                        placeholder={this.props.course.classCount+''}
                                        value={this.state.course.classCount+''}
                                        onChangeText={
                                            (value)=>{
                                                value==''?
                                                this.setState({course:Object.assign(this.state.course,{classCount:''})}):
                                                this.setState({course:Object.assign(this.state.course,{classCount:parseInt(value)})})
                                            }}
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>

                            {/*课程场馆*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>授课场地</Text>
                                </View>

                                {
                                    this.state.course.unitName==null?
                                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                            borderRadius:10}}
                                                          onPress={()=>{
                                                              this.navigate2VenueInspect();
                                                          }}>
                                            <Text style={{fontSize:14,color:'#888'}}>
                                                {this.state.course.unitName}
                                            </Text>
                                        </TouchableOpacity>:

                                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                            borderRadius:10}}
                                                          onPress={()=>{
                                                              this.navigate2VenueInspect();
                                                          }}>
                                            <View style={{flex:3,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row',textAlign:'right'}}>
                                                <Text style={{color:'#222',fontSize:14}}>{this.state.course.unitName}</Text>
                                            </View>
                                        </TouchableOpacity>
                                }

                            </View>

                            {/*课程教练*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>授课教练</Text>
                                </View>

                                {
                                    this.state.course.coachId==null?
                                        <TouchableOpacity style={{flex:3,height:28,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',textAlign:'right',
                                            borderRadius:10}}
                                                          onPress={()=>{
                                                              this.navigate2SelectCoach();
                                                          }}>
                                            <Text style={{fontSize:14,color:'#888'}}>
                                                {this.props.course.coachId.substring(0,this.props.course.coachId.length-1)}
                                            </Text>
                                        </TouchableOpacity>:

                                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',textAlign:'right',
                                            borderRadius:10}}
                                                          onPress={()=>{
                                                              this.navigate2SelectCoach();
                                                          }}>
                                            <View style={{flex:3,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row',textAlign:'right'}}>
                                                <Text style={{color:'#222',fontSize:14}}>{this.state.course.coachId.substring(0,this.props.course.coachId.length-1)}</Text>
                                            </View>
                                        </TouchableOpacity>

                                }
                            </View>

                            <View style={{height:30,width:width,justifyContent:'center',textAlign:'left'}}>
                                <Text style={{color:'#666',fontSize:13}}>收费信息</Text>
                            </View>

                            {/*支付方式*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text>支付方式</Text>
                                </View>
                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}
                                                  onPress={()=>{ this.show('actionSheet'); }}>
                                            <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#444',fontSize:14}}>{costTypeStr}</Text>
                                            </View>
                                    <ActionSheet
                                        ref={(p) => {
                                            this.actionSheet =p;
                                        }}
                                        title="请选择支付方式"
                                        options={costTypeButtons}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={
                                            (data)=>{ this._handlePress(data); }
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            {/*课程花费*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>支付费用</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3}}
                                        placeholder={this.props.course.cost+''}
                                        value={this.state.course.cost+''}
                                        onChangeText={
                                            (value)=>{
                                                value==''?
                                                this.setState({course:Object.assign(this.state.course,{cost:''})}):
                                                this.setState({course:Object.assign(this.state.course,{cost:parseInt(value)})})
                                            }}
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>

                    <View style={{backgroundColor:'#fff',padding:10}}>
                        <Text style={{color:'#aaa',fontSize:11}}>
                            温馨提示：您发布的内容应合法、真实、健康、共创文明的网络环境
                        </Text>
                    </View>
                </View>

                <View style={{flexDirection:'row',height:60,justifyContent:'center',alignItems:'center',width:width,marginBottom:10,backgroundColor:'#fff'}}>
                    <TouchableOpacity style={{width:width*1/3,backgroundColor:'#fc6254',padding:10,flexDirection:'row',
                        justifyContent:'center'}}
                                      onPress={()=>{
                                          if(this.props.memberId!==null&&this.props.memberId!==undefined){
                                              this.props.dispatch(modifyCourse(this.props.course,this.state.venue,parseInt(this.props.memberId),parseInt(this.props.demandId)))
                                                  .then((json)=>{
                                                      if(json.re==1){
                                                          Alert.alert('信息','课程编辑成功',[{text:'确认',onPress:()=>{
                                                              this.goBack();
                                                          }}]);
                                                      }else{
                                                          if(json.re==-100){
                                                              this.props.dispatch(getAccessToken(false));
                                                          }
                                                      }
                                                  })
                                          }else{
                                              this.props.dispatch(modifyCourse(this.state.course,this.state.venue,null))
                                                  .then((json)=>{
                                                      if(json.re==1){
                                                          Alert.alert('信息','课程编辑成功',[{text:'确认',onPress:()=>{
                                                              this.goBack();
                                                          }}]);
                                                      }else{
                                                          if(json.re==-100){
                                                              this.props.dispatch(getAccessToken(false));
                                                          }
                                                      }
                                                  })
                                          }

                                      }}>
                        <Text style={{color:'#fff',fontSize:15}}>确定修改</Text>
                    </TouchableOpacity>
                </View>
                    </KeyboardAwareScrollView>

                {/* Add CourseTime Modal*/}
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.");
                    }}
                >
                    <CourseTimeModal
                        onClose={()=>{
                            this.setState({modalVisible:false});
                        }}
                        accessToken={this.props.accessToken}
                        setTime={(time)=>{
                            if(this.state.timeList!==null&&this.state.timeList!==undefined){
                                var timeList = this.state.timeList;
                                timeList.push(time);
                                this.setState({timeList:timeList});
                            }
                        }}
                        timeListLength={(this.state.timeList!==null&&this.state.timeList!==undefined)?this.state.timeList.length:0}

                    />
                </Modal>

                <PopupDialog
                    ref={(popupDialog) => {
                        this.scaleAnimationDialog = popupDialog;
                    }}
                    dialogAnimation={scaleAnimation}
                    actions={[

                    ]}
                >
                    <View style={styles.dialogContentView}>
                        <CourseTimeModal
                            onClose={()=>{
                                this.scaleAnimationDialog.dismiss();
                                // this.setState({modalVisible:false});
                            }}
                            accessToken={this.props.accessToken}
                            setTime={(time)=>{
                                if(this.state.timeList!==null&&this.state.timeList!==undefined){
                                    var timeList = this.state.timeList;
                                    timeList.push(time);
                                    this.setState({timeList:timeList});
                                    this.scaleAnimationDialog.dismiss();
                                }
                            }}
                            timeListLength={(this.state.timeList!==null&&this.state.timeList!==undefined)?this.state.timeList.length:0}

                        />
                    </View>
                </PopupDialog>

                </Toolbar>
            </View>
        );
    }
    componentDidMount()
    {
        this.venueListener=DeviceEventEmitter.addListener('on_venue_confirm', (data)=>{
            if(data)
                this.setState({venue:data})
        });
    }

    componentWillUnmount()
    {
        if(this.venueListener)
            this.venueListener.remove();
    }

    componentWillUnmount(){
        this.props.dispatch(enableCoursesOfCoachOnFresh());
    }

}

var styles = StyleSheet.create({
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        myGroupList:state.activity.myGroupList,
        groupOnFresh:state.activity.groupOnFresh,
        coached:state.coach,
        venue:state.map.venues,
    })
)(ModifyBadmintonCourse);


