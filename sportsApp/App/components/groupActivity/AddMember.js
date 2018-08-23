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
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputWrapper from 'react-native-text-input-wrapper';
import CourseTimeModal from '../../components/course/CourseTimeModal';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import ActionSheet from 'react-native-actionsheet';
import {getAccessToken,} from '../../action/UserActions';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {setMemberList,addMemberList} from '../../action/ActivityActions'

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });
const {height, width} = Dimensions.get('window');

class AddMember extends Component{

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
            member:{name:null,mobilePhone:null,numMember:null},
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
                <Toolbar width={width} title="邀请成员" navigator={this.props.navigator} actions={[{}]}>
                <KeyboardAwareScrollView style={{height:height-200,width:width,backgroundColor:'#fff',padding:5}}>
                <View style={{flex:5,backgroundColor:'#fff'}}>

                    {/*成员姓名*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>成员姓名：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入成员姓名"
                                val={this.state.member.name}
                                onChangeText={
                                    (value)=>{
                                        this.setState({member:Object.assign(this.state.member,{name:value})})
                                    }}
                                onCancel={
                                    ()=>{
                                        this.setState({member:Object.assign(this.state.member,{name:null})});}
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
                                val={this.state.member.mobilePhone}
                                onChangeText={
                                    (value)=>{
                                        this.setState({member:Object.assign(this.state.member,{mobilePhone:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({member:Object.assign(this.state.member,{mobilePhone:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*携带人数*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,marginTop:10,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>携带人数：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入携带人数"
                                val={this.state.member.numMember}
                                onChangeText={
                                    (value)=>{
                                        this.setState({member:Object.assign(this.state.member,{numMember:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({member:Object.assign(this.state.member,{numMember:null})});}
                                }
                            />
                        </View>
                    </View>
                </View>
                    <View style={{flexDirection:'row',height:60,justifyContent:'center',alignItems:'center',width:width}}>
                        <TouchableOpacity style={{width:width*2/3,backgroundColor:'#66CDAA',borderRadius:10,padding:10,flexDirection:'row',
                            justifyContent:'center'}}
                                          onPress={()=>{
                                              this.addMember(this.props.activityId,this.state.member)
                                          }}>
                            <Text style={{color:'#fff',fontSize:15}}>确定</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAwareScrollView>
                </Toolbar>
            </KeyboardAvoidingView>
        );
    }

    addMember(activityId,member)
    {

        this.props.dispatch(addMemberList(activityId,member)).then((json)=>{
            if(json.re==1){


            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));

                }
            }
            alert('hi');
            this.goBack();
        });
    }

    componentWillUnmount()
    {
        this.props.dispatch(setMemberList(this.props.memberList));
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
        creatorId:state.user.personInfo.personId,
        memberList:state.activity.memberList,
    })
)(AddMember);


