import React,{Component} from 'react';
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
    Easing
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MyGroup from '../components/groupActivity/MyGroup';
import MyCourses from '../components/course/MyCourses';
import MyInformation from '../components/my/MyInformation';
import Setting from '../components/my/Setting';
import CustomCourse from '../components/course/MyCustomCourse';
import PortraitModal from '../components/my/modal/PortraitModal';
import VenueInspect from '../components/venue/VenueInspect';
import MyCompentitionList from '../components/competition/MyCompetitionList';
import CoachMessage from '../components/my/MyInformation'
import TeamSignUp from '../components/competition/TeamSignUp';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import {
    downloadPortrait,
    updatePortrait,
    uploadPortrait,
    wechatPay,
    fetchMemberInformation,
    getAccessToken,
} from '../action/UserActions';
import MyCourseRecord from '../components/my/MyCourseRecord'
import MyActivityRecord from '../components/my/MyActivityRecord'

var {height, width} = Dimensions.get('window');
const scaleAnimation = new ScaleAnimation();
var WeChat = require('react-native-wechat');

class My extends Component{

    navigate2MyGroup(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'my_group',
                component: MyGroup,
                params: {
                }
            })
        }
    }

    navigate2Setting(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'setting',
                component: Setting,
                params: {

                }
            })
        }
    }

    //导航-我的定制
    navigate2CustomCourse(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CustomCourse',
                component: CustomCourse,
                params: {

                }
            })
        }
    }

    //导航进我的课程
    navigate2MyCourse(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MyCourseRecord',
                component: MyCourseRecord,
                params: {

                }
            })
        }
    }

    //导航进我的活动
    navigate2MyActivity(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MyActivityRecord',
                component: MyActivityRecord,
                params: {

                }
            })
        }
    }

    navigate2MyInformation()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MyInformation',
                component: MyInformation,
                params: {

                }
            })
        }
    }

    // 我的比赛
    navigate2MyCompetitionList(){
        const {navigator} =this.props;
        if(navigator){
            navigator.push({
                name:'MyCompetitonList',
                component:MyCompentitionList,
                params:{
                }
            })
        }
}

    navigate2VenueInspect()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'VenueInspect',
                component: VenueInspect,
                params: {

                }
            })
        }
    }
    navigate2CoachMessage(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CoachMressage',
                component: CoachMessage,
                params: {

                }
            })
        }
    }

    showPortraitDialog() {
        this.portraitDialog.show();
    }

    setPortrait(portrait){
        this.setState({portrait:portrait});
    }

    getPortrait(){
        this.props.dispatch(downloadPortrait())
            .then((json)=>{
                if(json.re==1){
                    var portrait=json.data;
                    this.setState({portrait:portrait});
                    this.props.dispatch(updatePortrait(portrait));

                }else{

                }

            });
    }

    constructor(props) {
        super(props);
        this.state={
           portrait:null,
            member:{avatar:null,perNum:null,wechat:null,mobilePhone:null,perName:null,sex:null,birthday:null,heightweight:null}
        }
    }

    componentWillMount(){
       //this.getPortrait();
        this.fetchMemberInformation(this.props.personInfo.personId)
    }

    fetchMemberInformation(personId){
        this.props.dispatch(fetchMemberInformation(personId)).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.setState({member:json.data})
            this.props.dispatch(updatePortrait(json.data.avatar));
        }).catch((e)=>{
            alert(e)
        });
    }

    render() {

        var avatar = this.state.member.avatar;

        return (
            <View style={{flex:1}}>
                <View style={{flex:2}}>
                    <Image style={{flex:2,width:width,position:'relative'}} source={require('../../img/tt4@2x.jpeg')} >
                        <View style={{marginTop:30,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>

                            {
                                avatar!==undefined && avatar!==null?

                                <View style={{height:60,width:60}}>
                                    <Image resizeMode="stretch" style={{height:60,width:60,borderRadius:30,borderColor:'#fff',borderWidth:2}} source={{uri:avatar}}/>
                                </View> :
                                    <View style={{height:60,width:60}}>
                                        <Image resizeMode="stretch" style={{height:60,width:60,borderRadius:30,borderColor:'#fff',borderWidth:2}} source={require('../../img/portrait.jpg')}/>
                                    </View>
                            }
                        </View>
                        <View style={{width:width,justifyContent:'center',alignItems:'center'}}>
                        <View style={{alignItems:'center',justifyContent:'center',marginTop:15,width:80,backgroundColor:'#fff',opacity:0.7,borderRadius:5}}>
                            <Text style={{color:'#333',fontSize:14}}>{this.props.personInfo.perNum}</Text>
                        </View>
                        </View>
                    </Image>
                </View>
                <View style={{flex:6,backgroundColor:'#eee'}}>
                    <View style={{flex:12,backgroundColor:'#eee'}}>
                        <TouchableOpacity style={{height:45,backgroundColor:'#fff',flexDirection:'row',padding:2,marginBottom:3,paddingLeft:10}}
                        onPress={()=>{
                            this.navigate2MyGroup();
                        }}>
                            <View style={{flex:1,flexDirection:'row',margin:5,
                            justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="contain" style={{height:25,width:25}} source={require('../../img/group.png')}/>
                            </View>
                            <View style={{flex:12,backgroundColor:'#fff',justifyContent:'center',marginLeft:10,paddingLeft:20}}>
                                <Text>我的群组</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height:45,backgroundColor:'#fff',flexDirection:'row',padding:2,marginBottom:3,paddingLeft:10}}
                                          onPress={()=>{
                                              this.navigate2CoachMessage();
                        }}
                        >

                            <View style={{flex:1,flexDirection:'row',margin:5,
                            justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="contain" style={{height:25,width:25}} source={require('../../img/appointment.png')}/>
                            </View>
                            <View style={{flex:12,backgroundColor:'#fff',justifyContent:'center',marginLeft:10,paddingLeft:20}}>
                                <Text>我的资料</Text>
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity style={{height:45,backgroundColor:'#fff',flexDirection:'row',padding:2,marginBottom:3,paddingLeft:10}}
                                          onPress={()=>{
                                this.navigate2MyCourse();
                            }}
                        >
                            <View style={{flex:1,flexDirection:'row',margin:5,
                                justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="contain" style={{height:25,width:25}} source={require('../../img/course.png')}/>
                            </View>
                            <View style={{flex:12,backgroundColor:'#fff',justifyContent:'center',marginLeft:10,paddingLeft:20}}>
                                <Text>我的课程</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height:45,backgroundColor:'#fff',flexDirection:'row',padding:2,marginBottom:3,paddingLeft:10}}
                                          onPress={()=>{
                                this.navigate2MyActivity();
                            }}
                        >
                            <View style={{flex:1,flexDirection:'row',margin:5,
                            justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="contain" style={{height:25,width:25}} source={require('../../img/ding.png')}/>
                            </View>
                            <View style={{flex:12,backgroundColor:'#fff',justifyContent:'center',marginLeft:10,paddingLeft:20}}>
                                <Text>我的活动</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height:45,backgroundColor:'#fff',flexDirection:'row',padding:2,marginBottom:3,paddingLeft:10}}
                                          onPress={()=>{
                                this.navigate2Setting();
                            }}>
                             <View style={{flex:1,flexDirection:'row',margin:5,
                                            justifyContent:'center',alignItems: 'center'}}>
                                 <Image resizeMode="contain" style={{height:25,width:25}} source={require('../../img/setting.png')}/>
                             </View>
                            <View style={{flex:12,backgroundColor:'#fff',justifyContent:'center',marginLeft:10,paddingLeft:20}}>
                                 <Text>我的设置</Text>
                             </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1,backgroundColor:'#eee'}}>

                    </View>
                </View>

                <PopupDialog
                    ref={(popupDialog) => {
                        this.portraitDialog = popupDialog;
                    }}
                    dialogAnimation={scaleAnimation}
                    actions={[]}
                    width={0.8}
                    height={0.4}
                >

                    <PortraitModal
                        val={this.props.username}
                        onClose={()=>{
                                this.portraitDialog.dismiss();
                            }}
                        onConfirm={(portrait)=>{
                             if (portrait) {
                                this.portraitDialog.dismiss();
                                this.setPortrait(portrait);
                                this.props.dispatch(uploadPortrait(portrait,this.props.personInfo.personId)).then((json)=>{
                                     alert('上传成功');
                                    {/*if(json.re==1){*/}
                                       {/**/}
                                    {/*}*/}
                                })

                             }else{
                                Alert.alert(
                                    '错误',
                                    '请先进行拍照'
                                );
                             }

                        }}
                    />

                </PopupDialog>


            </View>
        );
    }

}

var styles = StyleSheet.create({


});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        username:state.user.user.username,

    })
)(My);
