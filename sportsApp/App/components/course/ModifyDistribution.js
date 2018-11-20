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
import DatePicker from 'react-native-datepicker';

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

    //选运动类型
    _handlePress2(index) {

        if(index!==0){
            var sportsType = index-1;
            this.setState({course:Object.assign(this.state.course,{sportsType:parseInt(sportsType)})});
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
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

    constructor(props) {
        super(props);
        this.state={
            dialogShow: false,
            course:{courseId:this.props.course.courseId,courseName:this.props.course.courseName,maxNumber:this.props.course.maxNumber,coachId:this.props.course.coachId,trainerId:this.props.course.trainerId,
                classCount:this.props.course.classCount,cost:this.props.course.cost,courseGrade:this.props.course.courseGrade,unitName:this.props.course.unitName,
                costType:this.props.course.costType,detail:this.props.course.detail,coursePlace:this.props.course.coursePlace,unitId:this.props.course.unitId,scheduleDes:this.props.course.scheduleDes,
                sportsType:this.props.course.sportsType,startDate:this.props.course.startDateStr,endDate:this.props.course.endDateStr},
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

        const costTypeButtons=['取消','按人支付','按小时支付','按班支付'];
        const classTypeButtons=['取消','初级班','中级班','高级班'];
        const sportsTypeButtons=['取消','羽毛球','足球','乒乓球','篮球'];//0羽毛球1足球2乒乓球3篮球

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

        var sportsTypeStr = null;
        switch (this.state.course.sportsType){
            case 0:sportsTypeStr = '羽毛球';break;
            case 1:sportsTypeStr = '足球';break;
            case 2:sportsTypeStr = '乒乓球';break;
            case 3:sportsTypeStr = '篮球';break;
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
                                        classTypeStr==null?
                                            <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#888',fontSize:14}}>请选择运动类型 ></Text>
                                            </View> :
                                            <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#444',fontSize:14}}>{sportsTypeStr}</Text>
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


