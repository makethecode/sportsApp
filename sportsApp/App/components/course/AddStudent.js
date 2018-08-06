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
var {height, width} = Dimensions.get('window');
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
const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

import{
    distributeCourse,
    enableCoursesOfCoachOnFresh,
    addStudents,
    enableStudentsOnFresh,
} from '../../action/CourseActions';

import {getAccessToken,} from '../../action/UserActions';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class AddStudent extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    //选是否有照片
    _handlePress1(index) {

        if(index!==0){
            var isHasPhoto = this.state.isHasPhotoButtons[index];
            var isHasPhotoCode = index;
            this.setState({student:Object.assign(this.state.student,{isHasPhotoCode:parseInt(isHasPhotoCode),isHasPhoto:isHasPhoto})});
        }

    }

    //选状态(报名、结业)
    _handlePress2(index) {

        if(index!==0){
            var state = this.state.stateButtons[index];
            var stateCode = index;
            this.setState({student:Object.assign(this.state.student,{state:state,stateCode:stateCode})});
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
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
            student:{perName:null,perIdCard:null,mobilePhone:null,createTime:null,heightweight:null,
                buyCount:null,joinTime:null,payTradeNum:null,isHasPhoto:null,isHasPhotoCode:null,state:null,stateCode:null,remark:null},
            isRefreshing: false,
            isHasPhotoButtons:['取消','是','否'],
            stateButtons:['取消','报名','结业'],

        }
        this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }


    render() {

        const CANCEL_INDEX1 = 0;
        const DESTRUCTIVE_INDEX1 = 1;

        const isHasPhotoButtons=['取消','是','否'];
        const stateButtons=['取消','报名','结业'];

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
            <KeyboardAvoidingView style={{flex:1}} behavior="padding">
                <View style={{height:55,width:width,paddingTop:20,flexDirection:'row',justifyContent:'center',alignItems: 'center',
                backgroundColor:'#66CDAA',borderBottomWidth:1,borderColor:'#66CDAA'}}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                      onPress={()=>{this.goBack();}}>
                        <Icon name={'angle-left'} size={30} color="#fff"/>
                    </TouchableOpacity>
                    <View style={{flex:3,justifyContent:'center',alignItems: 'center',}}>
                        <Text style={{color:'#fff',fontSize:18}}>增加学员</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center',}}>

                    </View>
                </View>
                <KeyboardAwareScrollView style={{height:height-200,width:width,backgroundColor:'#fff',padding:5}}>
                <View style={{flex:5,backgroundColor:'#fff'}}>

                    {/*学生id*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>学生姓名：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入学生姓名"
                                val={this.state.student.perName}
                                onChangeText={
                                    (value)=>{
                                        this.setState({student:Object.assign(this.state.student,{perName:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({student:Object.assign(this.state.student,{perName:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*身份证号*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>身份证号：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入身份证号"
                                val={this.state.student.perIdCard}
                                onChangeText={
                                    (value)=>{
                                        this.setState({student:Object.assign(this.state.student,{perIdCard:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({student:Object.assign(this.state.student,{perIdCard:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*身高体重*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>身高/体重：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入身高/体重"
                                val={this.state.student.heightweight}
                                onChangeText={
                                    (value)=>{
                                        this.setState({student:Object.assign(this.state.student,{heightweight:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({student:Object.assign(this.state.student,{heightweight:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*联系方式*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>联系方式：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入联系方式"
                                val={this.state.student.mobilePhone}
                                onChangeText={
                                    (value)=>{
                                        this.setState({student:Object.assign(this.state.student,{mobilePhone:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({student:Object.assign(this.state.student,{mobilePhone:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*购买课次*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>购买课次：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入购买课次"
                                val={this.state.student.buyCount}
                                onChangeText={
                                    (value)=>{
                                        this.setState({student:Object.assign(this.state.student,{buyCount:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({student:Object.assign(this.state.student,{buyCount:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*报名时间*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>报名时间：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            {
                                this.state.student.joinTime&&this.state.student.joinTime!=''?
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:13}}>
                                            {this.state.student.joinTime}
                                        </Text></View>:
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:13}}>
                                            请选择报名时间
                                        </Text></View>
                            }
                            <View style={{height:35,marginRight:15,flexDirection:'row',alignItems:'center'}}>
                                <DatePicker
                                    style={{width:60,marginLeft:0,borderWidth:0}}
                                    customStyles={{
                                        placeholderText:{color:'transparent',fontSize:12},
                                        dateInput:{height:30,borderWidth:0},
                                        dateTouchBody:{marginRight:0,height:25,borderWidth:0},
                                    }}
                                    mode="date"
                                    placeholder="选择"
                                    format="YYYY-MM-DD"
                                    minDate={"1957-00-00"}
                                    confirmBtnText="确认"
                                    cancelBtnText="取消"
                                    showIcon={true}
                                    iconComponent={<Icon name={'calendar'} size={30} color="#888"/>}
                                    onDateChange={(date) => {
                                        this.setState({student:Object.assign(this.state.student,{joinTime:date})})
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    {/*有无照片*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:5,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>有无照片：</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet1'); }}>
                            {
                                this.state.student.isHasPhoto==null?
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:13}}>是否有照片</Text>
                                    </View> :
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:13}}>{this.state.student.isHasPhoto}</Text>
                                    </View>

                            }
                            <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems: 'center',marginLeft:20}}>
                                <Icon name={'angle-right'} size={30} color="#fff"/>
                            </View>
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet1 =p;
                                }}
                                title="该学生是否有照片"
                                options={isHasPhotoButtons}
                                cancelButtonIndex={CANCEL_INDEX1}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX1}
                                onPress={
                                    (data)=>{ this._handlePress1(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*状态*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:5,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>学生状态：</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet2'); }}>
                            {
                                this.state.student.state==null?
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:13}}>请选择学生状态</Text>
                                    </View> :
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:13}}>{this.state.student.state}</Text>
                                    </View>

                            }
                            <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems: 'center',marginLeft:20}}>
                                <Icon name={'angle-right'} size={30} color="#fff"/>
                            </View>
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet2 =p;
                                }}
                                title="请选择该学生状态"
                                options={stateButtons}
                                cancelButtonIndex={CANCEL_INDEX1}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX1}
                                onPress={
                                    (data)=>{ this._handlePress2(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*补充*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>补充信息：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入补充信息"
                                val={this.state.student.remark}
                                onChangeText={
                                    (value)=>{
                                        this.setState({student:Object.assign(this.state.student,{remark:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({student:Object.assign(this.state.student,{remark:null})});}
                                }
                            />
                        </View>
                    </View>

                </View>
                    <View style={{flexDirection:'row',height:60,justifyContent:'center',alignItems:'center',width:width}}>
                        <TouchableOpacity style={{width:width*2/3,backgroundColor:'#66CDAA',borderRadius:10,padding:10,flexDirection:'row',
                            justifyContent:'center'}}
                                          onPress={()=>{
                                              this.props.dispatch(addStudents(this.props.courseId,this.state.student))
                                                  .then((json)=>{
                                                      if(json.re==1){
                                                          Alert.alert('信息','已成功增加该学员',[{text:'确认',onPress:()=>{
                                                              this.goBack();
                                                              this.props.setMyCourseList(this.props.courseId);
                                                          }}]);
                                                      }else{
                                                          if(json.re==-100){
                                                              this.props.dispatch(getAccessToken(false));
                                                          }
                                                      }
                                                  })
                                          }}>
                            <Text style={{color:'#fff',fontSize:15}}>确定</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAwareScrollView>

            </KeyboardAvoidingView>
        );
    }

    componentWillUnmount()
    {
        this.props.dispatch(enableStudentsOnFresh());
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
        userType: state.user.usertype.perTypeCode,
        students:state.course.studentsOfCourse,
        studentsOnFresh:state.course.studentsOnFresh,
        creatorId:state.user.personInfo.personId
    })
)(AddStudent);


