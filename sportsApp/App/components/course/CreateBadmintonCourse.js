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
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputWrapper from 'react-native-text-input-wrapper';
import CourseTimeModal from './CourseTimeModal';
import VenueInspect from '../../components/venue/VenueInspect';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import ActionSheet from 'react-native-actionsheet';
import SelectVenue from '../../components/venue/SelectVenue';
import SelectCoach from './SelectCoach';
import InputScrollView from 'react-native-input-scroll-view'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import{
    distributeCourse,
    enableCoursesOfCoachOnFresh
} from '../../action/CourseActions';
import {getAccessToken,} from '../../action/UserActions';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });
var {height, width} = Dimensions.get('window');

class CreateBadmintonCourse extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    //选支付方式
    _handlePress(index) {

        if(index!==0){
            var costTypeStr = this.state.costTypeButtons[index];
            var costType = index;
            this.setState({course:Object.assign(this.state.course,{costType:costType.toString(),costTypeStr:costTypeStr})});
        }

    }
    //选等级
    _handlePress1(index) {

        if(index!==0){
            var classTypeStr = this.state.classTypeButtons[index];
            var classType = index;
            this.setState({course:Object.assign(this.state.course,{classType:parseInt(classType).toString(),classTypeStr:classTypeStr})});
        }

    }
    //选运动类型
    _handlePress2(index) {

        if(index!==0){
            var sportsTypeStr = this.state.sportsTypeButtons[index];
            var sportsType = index;
            this.setState({course:Object.assign(this.state.course,{sportsType:parseInt(sportsType)-1,sportsTypeStr:sportsTypeStr})});
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    setCoursePlace(coursePlace)
    {
        var place = coursePlace;
        place.unitId = parseInt(coursePlace.unitId);

        this.setState({venue:place});

    }

    setCourseCoach(field,coachId)
    {
        var field = field;
        //place.unitId = parseInt(coursePlace.unitId);

        this.setState({coached:field});
        this.setState({coachId:coachId});

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
            course:{courseName:null,maxNumber:null,classCount:null,cost:null,costType:null,classType:null,
                detail:null,coursePlace:null,unitId:null,scheduleDes:'',sportsType:null,sportsTypeStr:null,
                startDate:null,endDate:null},
            docouingFetch: false,
            isRefreshing: false,
            time:null,
            timeList:[],
            costTypeButtons:['取消','按人支付','按小时支付','按班支付'],
            classTypeButtons:['取消','初级班','中级班','高级班'],
            sportsTypeButtons:['取消','羽毛球','足球','乒乓球','篮球'],//0羽毛球1足球2乒乓球3篮球
            venue:null,
            coached:null,
            coachId:null,
        }
        this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }


    render() {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const costTypeButtons=['取消','按人支付','按小时支付','按班支付'];
        const classTypeButtons=['取消','初级班','中级班','高级班'];
        const sportsTypeButtons=['取消','羽毛球','足球','乒乓球','篮球'];

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

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="创建课程" actions={[]} navigator={this.props.navigator}>
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
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入课程名称"
                                value={this.state.course.className}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({course:Object.assign(this.state.course,{courseName:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*课程等级*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>课程等级</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet1'); }}>
                            {
                                this.state.course.classTypeStr==null?
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:14}}>请选择课程等级 ></Text>
                                    </View> :
                                    <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.course.classTypeStr}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet1 =p;
                                }}
                                title="请选择课程等级"
                                options={classTypeButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress1(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*运动类型*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>运动类型</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet2'); }}>
                            {
                                this.state.course.sportsTypeStr==null?
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:14}}>请选择运动类型 ></Text>
                                    </View> :
                                    <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.course.sportsTypeStr}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet2 =p;
                                }}
                                title="请选择运动类型"
                                options={sportsTypeButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress2(data); }
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
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入课程目标"
                                value={this.state.course.detail}
                                underlineColorAndroid={'transparent'}
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
                            style={{height:80,width:width,fontSize:14,marginTop:5,borderRadius:5,backgroundColor:'#fff',padding:0}}
                            onChangeText={(text) =>
                            {
                                this.setState({course:Object.assign(this.state.course,{scheduleDes:text})});
                            }}
                            value={this.state.course.scheduleDes}
                            placeholder='请描述课程时间安排'
                            placeholderTextColor="#888"
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                        />
                    </View>

                    <View style={{height:30,width:width,justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>授课信息</Text>
                    </View>

                    {/*开始时间*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>开始时间</Text>
                        </View>
                        <View style={{flex:2,marginLeft:30,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={{color:'#444',fontSize:15}}>{this.state.course.startDate}</Text>
                        </View>
                        <View style={{height:40,marginRight:0,flexDirection:'row',alignItems:'center'}}>
                            <DatePicker
                                style={{width:40,marginLeft:0,borderWidth:0,justifyContent:'center',alignItems:'center'}}
                                customStyles={{
                                    placeholderText:{color:'transparent',fontSize:12},
                                    dateInput:{height:30,borderWidth:0},
                                    dateTouchBody:{marginRight:0,height:25,borderWidth:0},
                                }}
                                mode="date"
                                placeholder="选择"
                                format="YYYY-MM-DD"
                                minDate={"2018-01-01"}
                                confirmBtnText="确认"
                                cancelBtnText="取消"
                                showIcon={true}
                                iconComponent={
                                    <View style={{height:40,width:40,justifyContent:'center',alignItems:'center'}}>
                                        <Icon name={'calendar'} size={20} color="#888"/>
                                    </View>}
                                onDateChange={(date) => {
                                    this.setState({course:Object.assign(this.state.course,{startDate:date})})
                                }}
                            />
                        </View>
                    </View>

                    {/*结束时间*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>结束时间</Text>
                        </View>
                        <View style={{flex:2,marginLeft:30,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={{color:'#444',fontSize:15}}>{this.state.course.endDate}</Text>
                        </View>
                        <View style={{height:40,marginRight:0,flexDirection:'row',alignItems:'center'}}>
                            <DatePicker
                                style={{width:40,marginLeft:0,borderWidth:0,justifyContent:'center',alignItems:'center'}}
                                customStyles={{
                                    placeholderText:{color:'transparent',fontSize:12},
                                    dateInput:{height:30,borderWidth:0},
                                    dateTouchBody:{marginRight:0,height:25,borderWidth:0},
                                }}
                                mode="date"
                                placeholder="选择"
                                format="YYYY-MM-DD"
                                minDate={"2018-01-01"}
                                confirmBtnText="确认"
                                cancelBtnText="取消"
                                showIcon={true}
                                iconComponent={
                                    <View style={{height:40,width:40,justifyContent:'center',alignItems:'center'}}>
                                        <Icon name={'calendar'} size={20} color="#888"/>
                                    </View>}
                                onDateChange={(date) => {
                                    this.setState({course:Object.assign(this.state.course,{endDate:date})})
                                }}
                            />
                        </View>
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
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入课程容量"
                                value={this.state.course.maxNumber}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
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
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入授课课次"
                                value={this.state.course.classCount}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
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
                            this.state.venue==null?
                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}
                                                  onPress={()=>{
                                                      this.navigate2VenueInspect();
                                                  }}>
                                    <Text style={{fontSize:14,color:'#888'}}>
                                        请选择授课场地 >
                                    </Text>
                                </TouchableOpacity>:

                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}
                                                  onPress={()=>{
                                                      this.navigate2VenueInspect();
                                                  }}>
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row',textAlign:'right'}}>
                                        <Text style={{color:'#222',fontSize:14}}>{this.state.venue.name}</Text>
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
                            this.state.coached==null?
                                <TouchableOpacity style={{flex:3,height:28,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',textAlign:'right',
                                    borderRadius:10}}
                                                  onPress={()=>{
                                                      this.navigate2SelectCoach();
                                                  }}>
                                    <Text style={{fontSize:14,color:'#888'}}>
                                        请选择授课教练 >
                                    </Text>
                                </TouchableOpacity>:

                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',textAlign:'right',
                                    borderRadius:10}}
                                                  onPress={()=>{
                                                      this.navigate2SelectCoach();
                                                  }}>
                                    <View style={{flex:3,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row',textAlign:'right'}}>
                                        <Text style={{color:'#222',fontSize:14}}>{this.state.coached}</Text>
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
                            {
                                this.state.course.costTypeStr==null?
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:14}}>请选择支付方式 ></Text>
                                    </View> :
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.course.costTypeStr}</Text>
                                    </View>

                            }
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
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入支付费用"
                                value={this.state.course.cost}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
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
                    <View style={{flexDirection:'row',height:50,justifyContent:'center',alignItems:'center',width:width,backgroundColor:'#fff',marginBottom:20}}>
                        <TouchableOpacity style={{width:width*1/3,backgroundColor:'#fc6254',padding:10,flexDirection:'row',
                            justifyContent:'center'}}
                                          onPress={()=>{
                                              if(this.props.memberId!==null&&this.props.memberId!==undefined){
                                                  this.props.dispatch(distributeCourse(this.state.course,this.state.venue,parseInt(this.props.memberId),this.state.coachId))
                                                      .then((json)=>{
                                                          if(json.re==1){
                                                              Alert.alert('信息','课程已发布成功',[{text:'确认',onPress:()=>{
                                                                  this.goBack();
                                                                  this.props.setMyCourseList();
                                                              }}]);
                                                          }else{
                                                              if(json.re==-100){
                                                                  this.props.dispatch(getAccessToken(false));
                                                              }
                                                          }
                                                      })
                                              }else{
                                                  this.props.dispatch(distributeCourse(this.state.course,this.state.venue,null,this.state.coachId))
                                                      .then((json)=>{
                                                          if(json.re==1){
                                                              Alert.alert('信息','课程已发布成功',[{text:'确认',onPress:()=>{
                                                                  this.goBack();
                                                                  //this.props.setMyCourseList();
                                                              }}]);
                                                          }else{
                                                              if(json.re==-100){
                                                                  this.props.dispatch(getAccessToken(false));
                                                              }
                                                          }
                                                      })
                                              }

                                          }}>
                            <Text style={{color:'#fff',fontSize:15}}>发布</Text>
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
        clubId:state.user.personInfoAuxiliary.clubId,
    })
)(CreateBadmintonCourse);


