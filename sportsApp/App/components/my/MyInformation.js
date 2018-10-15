
import React, {Component} from 'react';
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
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import DatePicker from 'react-native-datepicker';
import DateFilter from '../../utils/DateFilter';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_CHECK} from 'react-native-toolbar-wrapper'
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import TextInputWrapper from 'react-native-text-input-wrapper';
import ActionSheet from 'react-native-actionsheet';
import UsernameModal from './modal/UsernameModal';
import PerNameModal from './modal/PerNameModal';
import MobilePhoneModal from './modal/MobilePhoneModal';
import ValidateMobilePhoneModal from './modal/ValidateMobilePhoneModal';
import WxModal from './modal/WxModal';
import IdCardModal from './modal/IdCardModal';
import SexModal from './modal/SexModal';
import UniversityModal from './modal/UniversityModal';
import HeightWeightModal from './modal/HeightWeightModal';
import WorkCityModal from './modal/WorkCityModal';
import MajorModal from './modal/MajorModal';
import SportLevelModal from './modal/sportsLevelModal';
import CoachLevelModal from './modal/CoachLevel';
import CoachBriefModal from './modal/CoachBriefModal';
import CoachPhotoModal from './modal/CoachPhotoModal';
import{
    updateUsername,
    updateSelfLevel,
    updateSportLevel,
    onSportLevelUpdate,
    onUsernameUpdate,
    onSelfLevelUpdate,
    updatePerName,
    onPerNameUpdate,
    updateWeChat,
    onWeChatUpdate,
    updateGenderCode,
    onGenderCodeUpdate,
    updatePerBirthday,
    onPerBirthdayUpdate,
    updatePerIdCard,
    onPerIdCardUpdate,
    onMobilePhoneUpdate,
    verifyMobilePhone,
    updateMobilePhone,
    updateUniversity,
    onUniversityUpdate,
    updateHeightWeight,
    onHeightWeightUpdate,
    updateWorkCity,
    onWorkCityUpdate,
    updateMajor,
    onMajorUpdate,
    updateCoachBrief,
    onCoachBriefUpdate,
    updateCoachLevel,
    onCoachLevelUpdate,
    updateCoachPhoto0,
    updateCoachPhoto1,
    updateCoachPhoto2,
    updateCoachPhoto3,
    onCoachPhoto0Update,
    onCoachPhoto1Update,
    onCoachPhoto2Update,
    onCoachPhoto3Update,
    fetchMemberInformation,
    getAccessToken,
    modifyUser,
    uploadImage
} from '../../action/UserActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Config from '../../../config'

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

var {height, width} = Dimensions.get('window');
const server = 'http://192.168.1.103:8080/'

class MyInformation extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

   getDate(tm){
       var tt=new Date(parseInt(tm)*1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
       return tt;
    }

    showCoachPhotoDialog(){
        this.CoachPhotoDialog.show()
    }
    showCoachPhoto1Dialog(){
        this.CoachPhoto1Dialog.show()
    }
    showCoachPhoto2Dialog(){
        this.CoachPhoto2Dialog.show()
    }
    showCoachPhoto3Dialog(){
        this.CoachPhoto3Dialog.show()
    }
    show(actionSheet) {
        this[actionSheet].show();
    }

    //教练星级设置
    _handlePress1(index) {

        if(index>1){
            var coachLevel = this.state.coachLevelButtons[index];
            var coachLevelCode = index-1;
            this.setState({member:Object.assign(this.state.member,{coachLevel:coachLevel}),coachLevelCode:coachLevelCode});
        }else if(index==1)
        {
            //设置'无'
            this.setState({member:Object.assign(this.state.member,{coachLevel:null}),coachLevelCode:null});
        }else{}

    }

    //运动水平设置
    _handlePress2(index)
    {
        if(index>1){
            var sportLevel = this.state.sportLevelButtons[index];
            var sportLevelCode = index-1;
            this.setState({member:Object.assign(this.state.member,{sportLevel:sportLevel}),sportLevelCode:sportLevelCode});
        }else if(index==1)
        {
            //设置'无'
            this.setState({member:Object.assign(this.state.member,{sportLevel:null}),sportLevelCode:null});
        }else{}
    }


    constructor(props) {
        super(props);
        this.state={
            isRefreshing:false,
            selectBirthday:false,
            sportLevelButtons:['取消','无','体育本科','国家一级运动员','国家二级运动员','国家三级运动员'],
            coachLevelButtons:['取消','无','一星级教练','二星级教练','三星级教练','四星级教练','五星级教练'],

            //个人信息
            //{birthday=1991-10-18, workcity=济南市，日照市, university=还没, sex=男, wechat=, perIdCard=gghh ,
            // perNum=wbh, avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
            // coachLevel=五星级教练, heightweight=, mobilePhone=18254888887, perName=小吴, sportLevel=国家一级运动员, coachPhoto4=4,
            // coachPhoto1=1, coachBrief=, coachPhoto3=3, isCoach=1, coachPhoto2=2}

            member:{
                personId:this.props.personId,
                avatar:null,
                perNum:null,
                wechat:null,
                mobilePhone:null,
                perName:null,
                sex:null,
                birthday:null,
                heightweight:null,
                sportLevel:this.props.sportLevel,
                coachLevel:this.props.coachLevel,
                perIdCard:null,
                coachBrief:null,
                coachPhoto:'',
                coachPhoto1:'',
                coachPhoto2:'',
                coachPhoto3:'',
                workcity:null,
                university:null,
            },

            coachPhotoUrl:server+'file/coach'+this.props.personId+'/1.jpg',
            coachPhoto1Url:server+'file/coach'+this.props.personId+'/2.jpg',
            coachPhoto2Url:server+'file/coach'+this.props.personId+'/3.jpg',
            coachPhoto3Url:server+'file/coach'+this.props.personId+'/4.jpg',

            isUpload:false,
        };

    }

    render(){

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        // var photo = server + this.state.member.coachPhoto;
        // var photo1 = server + this.state.member.coachPhoto;
        // var photo2 = server+'/file/coach'+this.props.personId+'/3.jpg';
        // var photo3 = server+'/file/coach'+this.props.personId+'/4.jpg';
        //
        // var defaultCoachPhoto = Config.server+'/file/coachPhoto.jpg';

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="我的资料" actions={[{icon:ACTION_CHECK,show:OPTION_SHOW}]} navigator={this.props.navigator}
                         onPress={(i)=>{
                             this.props.dispatch(modifyUser(this.state.member))
                                 .then((json)=>{
                                     if(json.re==1){
                                         Alert.alert('信息','个人资料修改成功',[{text:'确认',onPress:()=>{
                                             this.goBack();
                                         }}]);
                                     }else{
                                         if(json.re==-100){
                                             this.props.dispatch(getAccessToken(false));
                                         }
                                     }
                                 })
                         }}
                         >
                    <View style={{flexDirection:'column'}}>
                    <View style={{backgroundColor:'#fff'}}>
                        <KeyboardAwareScrollView style={{height:height-140,width:width,backgroundColor:'#fff'}}>

                            <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',backgroundColor:'#eee',paddingHorizontal:10}}>
                                <Text style={{color:'#666',fontSize:13}}>基本信息</Text>
                            </View>

                            {/*头像*/}
                            <View style={{flexDirection:'row',padding:12,paddingHorizontal:10,paddingTop:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        头像
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    {
                                        this.state.member.avatar&&this.state.member.avatar!=''?
                                            <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                                   source={{uri: this.state.member.avatar}}/>:
                                            <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                                   source={require('../../../img/portrait.jpg')}/>
                                    }
                                </View>
                            </View>

                        {/*用户名*/}
                        <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'#555',fontSize:14}}>
                                    用户名
                                </Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                <TextInput
                                    placeholderTextColor='#888'
                                    style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                    placeholder={this.props.username}
                                    value={this.state.member.perNum}
                                    onChangeText={
                                        (value)=>{
                                            this.setState({member:Object.assign(this.state.member,{perNum:value})})
                                        }}
                                    underlineColorAndroid={'transparent'}
                                />
                            </View>
                        </View>

                        {/*真实姓名*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        真实姓名
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                        placeholder={this.props.perName}
                                        value={this.state.member.perName}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{perName:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>


                        {/*性别*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        性别
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:1,padding:0}}
                                        placeholder={
                                            this.props.genderCode==1?'男':'女'
                                        }
                                        value={this.state.member.sex}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{sex:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>


                        {/*出生日期*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'#555',fontSize:14}}>
                                    出生日期
                                </Text>
                            </View>
                            <View style={{flex:2,marginLeft:30,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                             <Text style={{color:'#444',fontSize:15}}>{this.state.member.birthday}</Text>
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
                                    minDate={"1957-00-00"}
                                    confirmBtnText="确认"
                                    cancelBtnText="取消"
                                    showIcon={true}
                                    iconComponent={
                                        <View style={{height:40,width:40,justifyContent:'center',alignItems:'center'}}>
                                            <Icon name={'calendar'} size={20} color="#888"/>
                                        </View>}
                                    onDateChange={(date) => {
                                        this.setState({member:Object.assign(this.state.member,{birthday:date})})
                                    }}
                                />
                            </View>
                        </View>

                            {/*身高体重*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        身高体重
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                        placeholder={
                                            this.props.heightweight
                                        }
                                        value={this.state.member.heightweight}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{heightweight:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>

                            {/*身份证*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        身份证
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                        placeholder={
                                            this.props.perIdCard
                                        }
                                        value={this.state.member.perIdCard}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{perIdCard:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>

                            <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',backgroundColor:'#eee',paddingHorizontal:10}}>
                                <Text style={{color:'#666',fontSize:13}}>联系方式</Text>
                            </View>

                            {/*微信号*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        微信号
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                        placeholder={this.props.wechat}
                                        value={this.state.member.wechat}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{wechat:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>

                            {/*手机号*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        手机号
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                        placeholder={this.props.mobilePhone}
                                        value={this.state.member.mobilePhone}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{mobilePhone:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>

                            <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',backgroundColor:'#eee',paddingHorizontal:10}}>
                                <Text style={{color:'#666',fontSize:13}}>教练信息</Text>
                            </View>

                        {/*教练星级*/}
                        <TouchableOpacity style={{flexDirection:'row',padding:12,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}
                                          onPress={()=>{
                                              this.show('actionSheet1');
                                              }}
                        >
                            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'#555',fontSize:14}}>
                                    教练星级
                                </Text>
                            </View>
                            <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                <Text style={{color:'#444',fontSize:15}}>{this.state.member.coachLevel}</Text>
                                <ActionSheet
                                    ref={(o) => {
                                        this.actionSheet1 = o;
                                    }}
                                    title="请选择教练星级"
                                    options={this.state.coachLevelButtons}
                                    cancelButtonIndex={CANCEL_INDEX}
                                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                    onPress={
                                        (data)=>{ this._handlePress1(data); }
                                    }
                                />
                            </View>
                        </TouchableOpacity>

                            {/*运动水平*/}
                            <TouchableOpacity style={{flexDirection:'row',padding:12,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}
                                              onPress={()=>{
                                                  this.show('actionSheet2');
                                              }}
                            >
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        运动水平
                                    </Text>
                                </View>
                                <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <Text style={{color:'#444',fontSize:15}}>{this.state.member.sportLevel}</Text>
                                    <ActionSheet
                                        ref={(o) => {
                                            this.actionSheet2 = o;
                                        }}
                                        title="请选择运动水平"
                                        options={this.state.sportLevelButtons}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={
                                            (data)=>{ this._handlePress2(data); }
                                        }
                                    />
                                </View>
                            </TouchableOpacity>

                            {/*服务城市*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        服务城市
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                        placeholder={
                                            this.props.workcity
                                        }
                                        value={this.state.member.workcity}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{workcity:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>

                            {/*毕业院校*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        毕业院校
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                        placeholder={
                                            this.props.university
                                        }
                                        value={this.state.member.university}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{university:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>

                        {/*教练简介*/}
                            <View style={{flexDirection:'row',height:40,width:width,paddingHorizontal:10,borderBottomWidth:1,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        教练简介
                                    </Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                        placeholder={
                                            this.props.coachBrief
                                        }
                                        value={this.state.member.coachBrief}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({member:Object.assign(this.state.member,{coachBrief:value})})
                                            }}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                            </View>

                            {/*上传教练图片*/}
                            <View style={{flexDirection:'column'}}>
                            <View style={{flexDirection:'row',padding:12,paddingHorizontal:10,borderColor:'#eee'}}>
                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'#555',fontSize:14}}>
                                        上传教练图片
                                    </Text>
                                    <Icon />
                                </View>
                            </View>


                             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                 <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,}}
                                                   onPress={()=>{
                                                        this.showCoachPhotoDialog();
                                              }}
                                 >
                                     <View style={{alignItems:'center',width:width*0.22,height:width*0.22}}>
                                         {this.state.member.coachPhoto==null||this.state.member.coachPhoto==''||this.state.member.coachPhoto==undefined?

                                             <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                     source={require('../../../img/coachPhoto.jpg')}
                                             />:
                                             <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22,}}
                                                    source={{uri:this.state.coachPhotoUrl}}
                                         />

                                         }
                                     </View>
                                 </TouchableOpacity>

                                 <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderColor:'#eee'}}
                                                   onPress={()=>{
                                                        this.showCoachPhoto1Dialog();
                                              }}
                                 >
                                     <View style={{flexDirection:'row',alignItems:'center'}}>
                                         {this.state.member.coachPhoto1==null||this.state.member.coachPhoto1==''||this.state.member.coachPhoto1==undefined?

                                             <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                     source={require('../../../img/coachPhoto.jpg')}/>:
                                             <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                     source={{uri:this.state.coachPhoto1Url}}
                                             />

                                         }
                                     </View>
                                 </TouchableOpacity>

                                 <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderColor:'#eee'}}
                                                   onPress={()=>{
                                                        this.showCoachPhoto2Dialog();
                                              }}
                                 >
                                     <View style={{flexDirection:'row',alignItems:'center'}}>
                                         {this.state.member.coachPhoto2==null||this.state.member.coachPhoto2==''||this.state.member.coachPhoto2==undefined?

                                             <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                     source={require('../../../img/coachPhoto.jpg')}/>:
                                             <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                     source={{uri:this.state.coachPhoto2Url}}
                                             />

                                         }
                                     </View>
                                 </TouchableOpacity>

                                 <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderColor:'#eee'}}
                                                   onPress={()=>{
                                                        this.showCoachPhoto3Dialog();
                                              }}
                                 >
                                     <View style={{flexDirection:'row',alignItems:'center'}}>
                                         {this.state.member.coachPhoto3==null||this.state.member.coachPhoto3==''||this.state.member.coachPhoto3==undefined?

                                             <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                     source={require('../../../img/coachPhoto.jpg')} />:
                                             <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                     source={{uri:this.state.coachPhoto3Url}}
                                             />

                                         }
                                     </View>
                                 </TouchableOpacity>
                             </View>
                            </View>

                        </KeyboardAwareScrollView>
                    </View>
                    </View>

                    {/*上传教练图片1*/}
                    <PopupDialog
                        ref={(popupDialog) => {
                        this.CoachPhotoDialog = popupDialog;
                    }}
                        dialogAnimation={scaleAnimation}
                        actions={[]}
                        width={0.8}
                        height={0.45}
                    >
                        <CoachPhotoModal
                            val={this.state.coachPhotoUrl}
                            onClose={()=>{
                                this.CoachPhotoDialog.dismiss();
                            }}
                            onConfirm={(val)=>{

                                let params = {
                                    userId:this.props.personId+'',
                                    path:val,
                                    idx:1,
                                }

                                this.props.dispatch(uploadImage(params))
                                    .then((json)=>{
                                        if(json.re==1){
                                            //上传图片并将地址保存到数据库,返回member.photo对应类型的uri
                                            //file/coach4/1.jpg
                                            alert('上传成功')
                                            this.setState({member:Object.assign(this.state.member,{coachPhoto:json.data}),coachPhotoUrl:val})
                                        }else{
                                            if(json.re==-100){
                                                this.props.dispatch(getAccessToken(false));
                                            }
                                        }
                                    })
                            }}
                        />
                    </PopupDialog>

                    {/*上传教练图片2*/}
                    <PopupDialog
                        ref={(popupDialog) => {
                            this.CoachPhoto1Dialog = popupDialog;
                        }}
                        dialogAnimation={scaleAnimation}
                        actions={[]}
                        width={0.8}
                        height={0.45}
                    >
                        <CoachPhotoModal
                            val={this.state.coachPhoto1Url}
                            onClose={()=>{
                                this.CoachPhoto1Dialog.dismiss();
                            }}
                            onConfirm={(val)=>{

                                let params = {
                                    userId:this.props.personId+'',
                                    path:val,
                                    idx:2,
                                }

                                this.props.dispatch(uploadImage(params))
                                    .then((json)=>{
                                        if(json.re==1){
                                            alert('上传成功')
                                            this.setState({member:Object.assign(this.state.member,{coachPhoto1:json.data}),coachPhoto1Url:val})
                                        }else{
                                            if(json.re==-100){
                                                this.props.dispatch(getAccessToken(false));
                                            }
                                        }
                                    })
                            }}
                        />
                    </PopupDialog>

                    {/*上传教练图片3*/}
                    <PopupDialog
                        ref={(popupDialog) => {
                            this.CoachPhoto2Dialog = popupDialog;
                        }}
                        dialogAnimation={scaleAnimation}
                        actions={[]}
                        width={0.8}
                        height={0.45}
                    >
                        <CoachPhotoModal
                            val={this.state.coachPhoto21Url}
                            onClose={()=>{
                                this.CoachPhoto2Dialog.dismiss();
                            }}
                            onConfirm={(val)=>{

                                let params = {
                                    userId:this.props.personId+'',
                                    path:val,
                                    idx:3,
                                }

                                this.props.dispatch(uploadImage(params))
                                    .then((json)=>{
                                        if(json.re==1){
                                            alert('上传成功')
                                            this.setState({member:Object.assign(this.state.member,{coachPhoto2:json.data}),coachPhoto2Url:val})
                                        }else{
                                            if(json.re==-100){
                                                this.props.dispatch(getAccessToken(false));
                                            }
                                        }
                                    })
                            }}
                        />
                    </PopupDialog>

                    {/*上传教练图片2*/}
                    <PopupDialog
                        ref={(popupDialog) => {
                            this.CoachPhoto3Dialog = popupDialog;
                        }}
                        dialogAnimation={scaleAnimation}
                        actions={[]}
                        width={0.8}
                        height={0.45}
                    >
                        <CoachPhotoModal
                            val={this.state.coachPhoto31Url}
                            onClose={()=>{
                                this.CoachPhoto3Dialog.dismiss();
                            }}
                            onConfirm={(val)=>{

                                let params = {
                                    userId:this.props.personId+'',
                                    path:val,
                                    idx:4,
                                }

                                this.props.dispatch(uploadImage(params))
                                    .then((json)=>{
                                        if(json.re==1){
                                            alert('上传成功')
                                            this.setState({member:Object.assign(this.state.member,{coachPhoto3:json.data}),coachPhoto3Url:val})
                                        }else{
                                            if(json.re==-100){
                                                this.props.dispatch(getAccessToken(false));
                                            }
                                        }
                                    })
                            }}
                        />
                    </PopupDialog>

                </Toolbar>
            </View>
        )
    }

    componentWillMount()
    {
        this.fetchMemberInformation(this.props.personId)
    }

    fetchMemberInformation(personId){
        this.props.dispatch(fetchMemberInformation(personId)).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.setState({member:json.data})
            this.setState({coachPhotoUrl:server + this.state.member.coachPhoto,
                           coachPhoto1Url:server + this.state.member.coachPhoto1,
                           coachPhoto2Url:server + this.state.member.coachPhoto2,
                           coachPhoto3Url:server+this.state.member.coachPhoto3})

        }).catch((e)=>{
            alert(e)
        });
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize:14
    }
});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo
    var trainerInfo=state.user.trainer
    var personInfoAuxiliary=state.user.personInfoAuxiliary
    var chuo=personInfo.perBirthday;
    var time=new Date(chuo);
    var year=time.getFullYear();
    var month=time.getMonth()+1;
    var day=time.getDate();
    var tt1=year+'-'+month+'-'+day;

    const props = {
        personId:personInfo.personId,
        username:state.user.user.username,
        perName:personInfo.perName,
        mobilePhone:personInfo.mobilePhone,
        wechat:personInfo.wechat,
        perIdCard:personInfo.perIdCard,
        selfLevel:personInfoAuxiliary.selfLevel,
        userType:parseInt(state.user.user.usertype),
        checkedMobile:personInfoAuxiliary.checkedMobile,
        genderCode:personInfo.genderCode,
        perBirthday:tt1,
        sportLevel:trainerInfo.sportLevel,
        heightweight:trainerInfo.heightweight,
        workcity:trainerInfo.workcity,
        major:trainerInfo.major,
        university:trainerInfo.university,
        coachLevel:trainerInfo.coachLevel,
        coachBrief:trainerInfo.brief,
    }

    if(trainerInfo)
        props.sportLevel=trainerInfo.sportLevel
    return props
}

export default connect(mapStateToProps)(MyInformation);


