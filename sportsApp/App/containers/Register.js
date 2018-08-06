import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    TextInput,
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
    Modal,
    KeyboardAvoidingView,
} from 'react-native';

import {connect} from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
    PAGE_LOGIN,
} from '../constants/PageStateConstants';
import {
    updatePageState
} from '../action/PageStateActions';

import PreferenceStore from '../utils/PreferenceStore';
import {
    registerUser,
    uploadPersonIdCard,
    updatePerBirthday,
    onPerBirthdayUpdate,
    fetchClubList,
} from '../action/UserActions';
import Camera from 'react-native-camera';
var ImagePicker = require('react-native-image-picker');
import TextInputWrapper from '../../App/encrypt/TextInputWrapper';

import ActionSheet from 'react-native-actionsheet'
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/**
 * userType:0为用户 1为教练
 */

class Register extends Component {

    showImagePicker() {
        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            title: '请选择',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '图库',
            cancelButtonTitle: '取消',


        };
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};
                this.setState({portrait: source});

            }
        });
    }


    pictureStore(path) {
        var data = new FormData();
        data.append('file', {uri: path, name: 'portrait.jpg', type: 'multipart/form-data'});
        //限定为jpg后缀
        Proxy.post({
            url: Config.server + '/svr/request?request=uploadPortrait&suffix=jpg',
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'multipart/form-data',
            },
            body: data,
        }, (json) => {
            if (json.re == 1) {
                if (json.data !== undefined && json.data !== null) {
                    console.log('...');
                }
            }

        }, (err) => {
            Alert.alert(
                'error',
                err
            );
        });
    }

    register() {
        var {info} = this.state;
        this.props.dispatch(registerUser(info)).then((json) => {
            if (json.re == 1) {

                PreferenceStore.put('username', info.username);
                PreferenceStore.put('password', info.password);

                Alert.alert(
                    '信息',
                    '注册成功！是否要直接登录？',
                    [
                        {text: 'OK', onPress: () => this.navigate2Login()},
                    ]
                )
            } else {

                if (json.re == 2) {
                    Alert.alert(
                        '信息',
                        '注册失败,该用户名已存在',
                        [
                            {text: 'OK', onPress: () => console.log('注册失败，该用户名已存在')},
                        ]
                    )
                }
                Alert.alert(
                    '注册失败',
                    '用户名重复'
                )
            }
        }).catch((e) => {
            alert(e);
        })
    }

    navigate2Login() {
        //TODO:dispatch a action
        this.props.dispatch(updatePageState({state: PAGE_LOGIN}))
    }

    //选性别类型
    _handlePress1(index) {

        if(index!==0){
            var sexType = this.state.sexTypeButtons[index];
            var sexTypeCode = index;
            this.setState({info:Object.assign(this.state.info,{sexType:sexType,sexTypeCode:sexTypeCode})});
        }

    }
    //选俱乐部类型
    _handlePress2(index) {

        if(index!==0){
            var clubType = this.state.clubTypeButtons[index];
            var clubTypeCode = index;
            this.setState({info:Object.assign(this.state.info,{clubType:clubType,clubId:clubTypeCode})});
        }

    }
    //选教练资质类型
    _handlePress3(index) {

        if(index!==0){
            var sportLevel = this.state.sportLevelButtons[index];
            var sportLevelCode = index;
            this.setState({info:Object.assign(this.state.info,{sportLevel:sportLevel,sportLevelCode:sportLevelCode})});
        }

    }
    //选教练星级类型
    _handlePress4(index) {

        if(index!==0){
            var coachLevel = this.state.coachLevelButtons[index];
            var coachLevelCode = index;
            this.setState({info:Object.assign(this.state.info,{coachLevel:coachLevel,coachLevelCode:coachLevelCode})});
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    constructor(props) {
        super(props);
        this.state = {
            info: {
                userType: 1,
                //基本信息
                mobilePhone: '',
                username: '',
                password: '1',
                name:'',
                sexType:null,
                birthday:null,
                idCard:null,
                address:null,
                QQ:null,
                email:null,
                wechat:null,
                //教练信息
                clubType:null,
                clubId:null,
                sportLevel: null,
                coachLevel:null,
                heightweight:null,
                workcity:null,
                graduate:null,
            },
            sexTypeButtons:['取消','男','女'],
            clubTypeButtons:['取消','吴教练俱乐部'],
            sportLevelButtons:['取消', '无', '体育本科', '国家一级运动员', '国家二级运动员', '国家三级运动员'],
            coachLevelButtons:['取消', '一星级教练', '二星级教练', '三星级教练', '四星级教练', '五星级教练'],
            selectBirthday:false,
            portrait: null,
            fadeCancel: new Animated.Value(0),
            fadeNickNameCancel: new Animated.Value(0),
            fadePasswordCancel: new Animated.Value(0),
            fadeSportsLevel: new Animated.Value(0),
            doingFetch:false,
        }
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    render() {


        var options = ['取消', '无', '体育本科', '国家一级运动员', '国家二级运动员', '国家三级运动员']
        const CANCEL_INDEX = 0
        const DESTRUCTIVE_INDEX = 1

        const sexTypeButtons=['取消','男','女'];
        var clubTypeButtons=['取消'];
        const sportLevelButtons=['取消', '无', '体育本科', '国家一级运动员', '国家二级运动员', '国家三级运动员'];
        const coachLevelButtons=['取消','一星级教练', '二星级教练', '三星级教练', '四星级教练', '五星级教练'];

        if(this.state.doingFetch==false)
        {
            this.props.dispatch(fetchClubList()).then((json)=>{
             if(json.re==1)
             {
                    this.setState({clubType:null});
                    var clubTypes = ['取消'];
                    for(var i=0;i<json.data.length;i++)
                        clubTypes.push(json.data[i].name);
                    clubTypeButtons=clubTypes;
                    this.setState({clubTypeButtons:clubTypes,doingFetch:true});
             }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                 }

                }
            })
        }

        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{
                    height: 55,
                    width: width,
                    paddingTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#66CDAA',
                    borderBottomWidth: 1,
                    borderColor: '#ddd'
                }}>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}
                                      onPress={() => {
                                          this.navigate2Login();
                                      }}>
                        <Icon name={'angle-left'} size={30} color="#fff"/>
                    </TouchableOpacity>
                    <View style={{flex: 3, justifyContent: 'center', alignItems: 'center',}}>
                        <Text style={{color: '#fff', fontSize: 18}}>注册</Text>
                    </View>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                        {/*<Text style={{color:'#fff',fontSize:15}}>下一步</Text>*/}
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView style={{height:height-200,width:width,backgroundColor:'#fff',padding:5}}>

                    <View style={{height:30,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <Text>基本信息</Text>
                        <Text style={{color:'#aaa',fontSize:11}}>(带*必填)</Text>
                    </View>

                    {/*用户名*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*用户名：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入用户名"
                                val={this.state.info.username}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{username:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{username:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*密码*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*密码：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入密码"
                                val={this.state.info.password}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{password:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{password:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*姓名*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*姓名：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入姓名"
                                val={this.state.info.name}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{name:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{name:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*性别*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*性别：</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet1'); }}>
                            {
                                this.state.info.sexType==null?
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:13}}>请选择性别</Text>
                                    </View> :
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:13}}>{this.state.info.sexType}</Text>
                                    </View>

                            }
                            <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems: 'center',marginLeft:20}}>
                                <Icon name={'angle-right'} size={30} color="#fff"/>
                            </View>
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet1 =p;
                                }}
                                title="请选择性别"
                                options={sexTypeButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress1(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*出生日期*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*出生日期：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            {
                                this.state.info.birthday&&this.state.info.birthday!=''?
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                    <Text style={{color:'#444',fontSize:13}}>
                                        {this.state.info.birthday}
                                    </Text></View>:
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                    <Text style={{color:'#888',fontSize:13}}>
                                        请选择出生日期
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
                                        this.setState({info:Object.assign(this.state.info,{birthday:date})})
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    {/*手机号*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*手机号：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入手机号"
                                val={this.state.info.mobilePhone}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{mobilePhone:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{mobilePhone:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*身份证号*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*身份证号：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入身份证号"
                                val={this.state.info.idCard}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{idCard:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{idCard:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*地址*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>地址：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入地址"
                                val={this.state.info.address}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{address:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{address:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*qq号*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>QQ：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入QQ号"
                                val={this.state.info.QQ}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{QQ:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{QQ:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*email*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>email：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入email"
                                val={this.state.info.email}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{email:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{email:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*微信号*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>微信号：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入微信号"
                                val={this.state.info.wechat}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{wechat:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{wechat:null})});}
                                }
                            />
                        </View>
                    </View>

                    <View style={{height:30,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <Text>教练信息</Text>
                        <Text style={{color:'#aaa',fontSize:11}}>(带*必填)</Text>
                    </View>

                    {/*俱乐部*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*俱乐部：</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet2'); }}>
                            {
                                this.state.info.clubType==null?
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:13}}>请选择俱乐部</Text>
                                    </View> :
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:13}}>{this.state.info.clubType}</Text>
                                    </View>

                            }
                            <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems: 'center',marginLeft:20}}>
                                <Icon name={'angle-right'} size={30} color="#fff"/>
                            </View>
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet2 =p;
                                }}
                                title="请选择俱乐部"
                                options={this.state.clubTypeButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{
                                        this._handlePress2(data);
                                    }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*教练资质*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*教练资质：</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet3'); }}>
                            {
                                this.state.info.sportLevel==null?
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:13}}>请选择教练资质</Text>
                                    </View> :
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:13}}>{this.state.info.sportLevel}</Text>
                                    </View>

                            }
                            <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems: 'center',marginLeft:20}}>
                                <Icon name={'angle-right'} size={30} color="#fff"/>
                            </View>
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet3 =p;
                                }}
                                title="请选择教练资质"
                                options={sportLevelButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress3(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*教练星级*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*教练星级：</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet4'); }}>
                            {
                                this.state.info.coachLevel==null?
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:13}}>请选择教练星级</Text>
                                    </View> :
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:13}}>{this.state.info.coachLevel}</Text>
                                    </View>

                            }
                            <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems: 'center',marginLeft:20}}>
                                <Icon name={'angle-right'} size={30} color="#fff"/>
                            </View>
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet4 =p;
                                }}
                                title="请选择教练星级"
                                options={coachLevelButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress4(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*身高体重*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>*身高体重：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入身高/体重"
                                val={this.state.info.heightweight}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{heightweight:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{heightweight:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*服务城市*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>服务城市：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入服务城市"
                                val={this.state.info.workcity}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{workcity:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{workcity:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*毕业院校*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:5}}>
                        <View style={{flex:1}}>
                            <Text>毕业院校：</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入毕业院校"
                                val={this.state.info.graduate}
                                onChangeText={
                                    (value)=>{
                                        this.setState({info:Object.assign(this.state.info,{graduate:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({info:Object.assign(this.state.info,{graduate:null})});}
                                }
                            />
                        </View>
                    </View>

                    <View style={{flex:1,backgroundColor:'#fff',padding:10}}>
                        <Text style={{color:'#aaa',fontSize:11}}>
                            温馨提示：您发布的内容应合法、真实、健康、共创文明的网络环境
                        </Text>
                    </View>
                    <TouchableOpacity style={{
                        height: 40,
                        width: width * 0.4,
                        marginLeft: width * 0.3,
                        marginTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 3,
                        backgroundColor: '#66CDAA'
                    }}
                                      onPress={() => {
                                          this.register();
                                      }}>
                        <Text style={{color: '#fff', fontSize: 15}}>完成</Text>
                    </TouchableOpacity>
                    <View style={{marginTop:20}}/>
                </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

}

var styles = StyleSheet.create({

    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    typeButton: {
        padding: 5,
    },
    flashButton: {
        padding: 5,
    },
    buttonsSpace: {
        width: 10,
    },
    imageStyle: {
        width: 70,
        height: 70,
        marginTop: 10,
        borderWidth: 2,
    },
});

const mapStateToProps = (state, ownProps) => {

    const props = {
        userType: 1,
        //基本信息
        mobilePhone:state.mobilePhone,
        username:state.username,
        password:state.password,
        name:state.name,
        sexType:state.sexType,
        birthday:state.birthday,
        idCard:state.idCard,
        address:state.address,
        QQ:state.QQ,
        email:state.email,
        wechat:state.wechat,
        //教练信息
        clubType:state.clubType,
        clubId:state.clubId,
        sportLevel: state.sportLevel,
        coachLevel:state.coachLevel,
        venue:state.venue,
        heightweight:state.heightweight,
        workcity:state.workcity,
        graduate:state.graduate,
    }
    return props
}

export default connect(mapStateToProps)(Register);

