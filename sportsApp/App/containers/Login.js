import React, {Component} from 'react';
import {
    Alert,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    TabBarIOS,
    TouchableOpacity,
    Dimensions,
    Modal,
    Platform,
    Animated
} from 'react-native';
import {fetchGames,enableCompetitionItemOnFresh} from '../action/CompetitionActions';
import { connect } from 'react-redux';
import {
    doLogin,doGetType,getAccessToken,wechatregisterUser,wechatGetOpenid,wechatGetUserInfo,setWechatInfo,ForgetPwd,
} from '../action/UserActions';
import PreferenceStore from '../utils/PreferenceStore';
import {
    PAGE_REGISTER,
} from '../constants/PageStateConstants';
import {
    updatePageState
} from '../action/PageStateActions';
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextInputWrapper from 'react-native-text-input-wrapper'
var wechat=require('react-native-wechat');
var {height, width} = Dimensions.get('window');
var Proxy = require('../utils/Proxy');

var Login =React.createClass({

    navigate2Register:function(){
        //TODO:dispatch a action
        this.props.dispatch(updatePageState(
            {state:PAGE_REGISTER}))
    },

    getInitialState:function(){
        return ({
            user:{},
            modalVisible:false,
            showProgress:false,
            loginDot:'.',
            fadeCancel: new Animated.Value(0),
            fadePassword:new Animated.Value(0),
            unionid:null,

            isInstalled:false,
            //微信开放平台接口
            appid : 'wx9068ac0e88c09e7a',
            secret : '3ea1d52ac88a6861472f279bd4010fc3',
            wechat:{openid:null,nickname:null,sex:null,province:null,city:null,country:null,headimgurl:null,unionid:null},
        });
    },

    WXregister(){
        //微信获取用户信息：1.unionid2.headimgurl3.appopenid（必得）

        //（授权作用域）获取用户信息
        let scope = 'snsapi_userinfo';
        let state = '12361231267312';
        //判断微信是否安装
        wechat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    //发送授权登录请求,获得code
                    wechat.sendAuthRequest(scope,state)
                        .then(responseCode => {
                            //返回code码，通过code获取access_token
                            appid=this.state.appid;
                            secret=this.state.secret;
                            //this.props.dispatch(getAccessToken(true));
                            var access_token = null;
                            var openid = null;
                            var unionid = null;
                            var headimgurl = null;
                            var nickname = null;
                            var sex = 1;
                            var province = null;
                            var city = null;
                            var country = null;
                            var url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appid+"&secret="+secret+"&code="+responseCode.code+"&grant_type=authorization_code";
                            this.props.dispatch(wechatGetOpenid(url))
                                .then((json)=>{
                                    access_token=json.access_token;
                                    openid=json.openid;
                                    var url1="https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+openid;
                                    this.props.dispatch(wechatGetUserInfo(url1))
                                        .then((json)=>{
                                            //{openid,nickname,sex,province,city,country,headimgurl,privilege,unionid}
                                            openid = json.openid;
                                            //nickname=EmojiFilter.filter(json.nickname);
                                            nickname = json.nickname.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
                                            sex = json.sex;
                                            province = json.province;
                                            city = json.city;
                                            country = json.country;
                                            headimgurl = json.headimgurl;
                                            unionid=json.unionid;

                                            this.setState({wechat:Object.assign(this.state.wechat,
                                                {
                                                    openid:openid,
                                                    nickname:nickname,
                                                    sex:sex,
                                                    province:province,
                                                    city:city,
                                                    country:country,
                                                    headimgurl:headimgurl,
                                                    unionid:unionid,
                                                })});

                                            //存入props.user.wechat中
                                            this.props.dispatch(setWechatInfo(this.state.wechat))

                                            this.navigate2Register();

                                        })
                                        .catch((e)=>{
                                            alert(e);
                                        })

                                })
                                .catch((e)=>{
                                    alert(e);
                                })

                        })
                        .catch(err => {
                            Alert.alert('登录授权发生错误：', err.message, [
                                {text: '确定'}
                            ]);
                        })
                } else {
                    Platform.OS == 'ios' ?
                        Alert.alert('没有安装微信', '请先安装微信', [
                            {text: '确定'}
                        ]) :
                        Alert.alert('没有安装微信', '请先安装微信', [
                            {text: '确定'}
                        ])
                }
            })
    },

    ForgetPwd(username){

        this.props.dispatch(ForgetPwd(username))
            .then((json)=>{
                if(json.re==1){
                    this.setState({user: Object.assign(this.state.user, {password: json.data})})
                }
                else{
                    Alert.alert('失败','您输入的用户名不存在！')
                }
            })
            .catch((e)=>{
                alert(e);
            })

    },

    WXLogin(){
        let scope = 'snsapi_userinfo';
        let state = '12361231267312';
        //判断微信是否安装
        wechat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    //发送授权请求
                    wechat.sendAuthRequest(scope,state)
                        .then(responseCode => {
                            //返回code码，通过code获取access_token
                            var appid=this.state.appid;
                            var secret=this.state.secret;
                            //this.props.dispatch(getAccessToken(true));
                            var access_token=null;
                            var openid=null;
                            var unionid=null;
                            var nickname=null;
                            var url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appid+"&secret="+secret+"&code="+responseCode.code+"&grant_type=authorization_code";
                            this.props.dispatch(wechatGetOpenid(url))
                                .then((json)=>{
                                    access_token=json.access_token;
                                    openid=json.openid;
                                    var url1="https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+openid;
                                    this.props.dispatch(wechatGetUserInfo(url1))
                                        .then((json)=>{
                                            unionid=json.unionid;
                                            nickname="wx"+json.nickname;
                                            this.props.dispatch((wechatregisterUser(unionid,nickname)))
                                                .then((json)=>{

                                                if(json.re==1) {
                                                    //存在微信帐号,直接登录
                                                    var nickname = json.data.nickName;
                                                    var password = json.data.password;
                                                    this.setState({showProgress: true});
                                                    this.props.dispatch(doLogin(nickname,password))
                                                        .then((json)=>{
                                                            this.setState({showProgress: false,user:{}});
                                                            if(json.re==-1){
                                                                setTimeout(()=>{
                                                                    alert(json.data);
                                                                },900)

                                                            }
                                                            if(json.re==-100){
                                                                this.setState({showProgress: false,user:{}});
                                                            }
                                                        })
                                                        .catch((e)=>{
                                                            alert(e);
                                                        })

                                                    this.setState({
                                                        user: Object.assign(this.state.user, {
                                                            username: nickname,
                                                            password: password
                                                        })
                                                    })
                                                }else{
                                                    //不存在微信帐号
                                                    Alert.alert('失败！','')
                                                }
                                                }).catch((e)=>{
                                                alert(e);
                                            })
                                        })
                                        .catch((e)=>{
                                            alert(e);
                                        })

                                })
                                .catch((e)=>{
                                    alert(e);
                                })

                        })
                        .catch(err => {
                            Alert.alert('登录授权发生错误：', err.message, [
                                {text: '确定'}
                            ]);
                        })
                } else {
                    Platform.OS == 'ios' ?
                        Alert.alert('没有安装微信', '是否安装微信？', [
                            {text: '取消'},
                            {text: '确定'}
                        ]) :
                        Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
                            {text: '确定'}
                        ])
                }
            })
    },

    render:function () {

        return (
            <View style={[styles.container,{backgroundColor:'#eee'}]}>

                <Image resizeMode="stretch" source={require('../../img/beijing@2x.png')} style={{width:width,height:height}}>

                    <View style={{backgroundColor:'transparent',flex:2,justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode="contain" source={require('../../img/loginlogo.png')} style={{justifyContent:'center',alignItems:'center',width:400,height:200,marginLeft:150,marginTop:50}}/>
                    </View>

                    <View style={{paddingVertical:2,paddingHorizontal:25,backgroundColor:'transparent',flex:3,alignItems:'center'}} >

                        {/*输入用户名*/}
                        <View style={{flexDirection:'row',height:45,marginBottom:10,backgroundColor:'rgba(255,255,255,0.2)',margin:10,padding:3,borderRadius:5}}>

                            <View style={{flex:6}}>
                                <View style={{flex:1,flexDirection:'row'}}>

                                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:4
                                        ,marginLeft:0,paddingHorizontal:2}}>
                                        <Icon size={18} name="user-o" color="#eee"></Icon>
                                    </View>


                                    <View style={{flex:6,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                        <TextInputWrapper
                                            textInputStyle={{color:'#eee'}}
                                            placeholder="请输入帐号/手机号"
                                            val={this.state.user.username}
                                            onChangeText={(value)=>{
                                                this.setState({user:Object.assign(this.state.user,{username:value})})
                                            }}
                                            onCancel={
                                                ()=>{this.setState({user:Object.assign(this.state.user,{username:''})});}
                                            }
                                        />

                                    </View>
                                </View>
                            </View>

                        </View>

                        {/*输入密码*/}
                        <View style={{flexDirection:'row',height:45,marginTop:10,backgroundColor:'rgba(255,255,255,0.2)',margin:10,padding:3,borderRadius:5}}>

                            <View style={{flex:6}}>
                                <View style={{flex:1,flexDirection:'row'}}>

                                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:4,
                                        paddingHorizontal:2,marginLeft:0}}>
                                        <Icon size={20} name="lock" color="#eee"></Icon>
                                    </View>

                                    <View style={{flex:6,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                        <TextInput
                                            style={{height: 42,flex:1,paddingLeft:0,paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:16,color:'#eee'}}
                                            onChangeText={(password) => {

                                              if( password&&password!='')//不为空
                                              {
                                                Animated.timing(
                                                    this.state.fadePassword,
                                                    {toValue: 1},
                                                ).start();
                                              }else{
                                                     Animated.timing(
                                                    this.state.fadePassword,
                                                    {toValue: 0},
                                                 ).start();

                                              }
                                                this.state.user.password=password;
                                                this.setState({user:this.state.user});
                                            }}

                                            onBlur={()=>{
                                               if(this.state.fadePassword==0)
                                               {}
                                               else{
                                                         Animated.timing(
                                                        this.state.fadePassword,
                                                        {toValue: 0},
                                                     ).start();
                                               }
                                            }}
                                            secureTextEntry={true}
                                            value={this.state.user.password}
                                            placeholder='请输入密码'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />

                                        <Animated.View style={{opacity: this.state.fadePassword,backgroundColor:'transparent',padding:4,marginRight:8}}>
                                            <TouchableOpacity onPress={()=>{

                                                this.setState({user:Object.assign(this.state.user,{password:''})});
                                                 Animated.timing(
                                                        this.state.fadePassword,
                                                        {toValue: 0},
                                                     ).start();
                                            }}>
                                                <Ionicons name='md-close-circle' size={18} color="red"/>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    </View>

                                </View>
                            </View>
                        </View>

                        {/*登录按钮*/}
                        <TouchableOpacity style={{flexDirection:'row',height:45,margin:10,marginBottom:5,backgroundColor:'#eee',marginTop:20,padding:3,borderRadius:5}}
                                          onPress={()=>{
                                              if(this.state.user&&
                                                  this.state.user.username&&this.state.user.username!=''&&
                                                  this.state.user.password&&this.state.user.password!='')
                                              {
                                                  this.setState({showProgress: true});
                                                  this.props.dispatch(doLogin(this.state.user.username,this.state.user.password))
                                                      .then((json)=>{
                                                          this.setState({showProgress: false,user:{}});
                                                          if(json.re==-1){
                                                              setTimeout(()=>{
                                                                  alert(json.data);
                                                              },900)
                                                          }
                                                          if(json.re==-100){
                                                              this.setState({showProgress: false,user:{}});
                                                          }
                                                      })
                                                      .catch((e)=>{
                                                          alert(e);
                                                      })
                                              }
                                          }}>
                            <View style={{flex:1}}>
                                    <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'flex-start'}}>
                                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                            <Text style={{color:'#66CDAA',fontSize:16,fontWeight:'bold'}}>登录</Text>
                                        </View>
                                </View>

                            </View>
                        </TouchableOpacity>

                        {/*微信登录*/}
                        {
                            this.state.isInstalled === true?
                            <TouchableOpacity style={{flexDirection:'row',height:45,backgroundColor:'transparent',margin:10,marginBottom:30,padding:3,borderRadius:5,
                                borderWidth:1,borderColor:'#eee'}}
                                              onPress={()=>{
                                                  this.WXLogin();
                                              }}>
                                <View style={{flex:1}}>
                                    <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'flex-start'}}>
                                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                            <Text style={{color:'#eee',fontSize:16,fontWeight:'bold'}}>微信登录</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>:null
                        }



                            <TouchableOpacity style={{width: width, justifyContent: 'center', alignItems: 'center'}}
                                              onPress={() => {
                                                  this.ForgetPwd(this.state.user.username);
                                              }}>
                                <Text style={{color: '#eee', fontSize: 13, marginTop: 3}}>忘记密码</Text>
                            </TouchableOpacity>

                    </View>


                    <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'column',paddingHorizontal:28}}>

                        {/*注册按钮*/}
                        <TouchableOpacity style={{flexDirection:'row',height:45,backgroundColor:'transparent',margin:10,marginBottom:30,padding:3,borderRadius:5,
                        borderWidth:1,borderColor:'#eee'}}
                                          onPress={()=>{
                                              this.WXregister();
                                          }}>
                            <View style={{flex:1}}>
                                <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'flex-start'}}>
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{color:'#eee',fontSize:16,fontWeight:'bold'}}>注册</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/*loading模态框*/}
                        <Modal animationType={"fade"} transparent={true} visible={this.state.showProgress}>

                            <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                              onPress={()=>{
                                            //TODO:cancel this behaviour

                                          }}>

                                <View style={{width:width*2/3,height:80,backgroundColor:'rgba(60,60,60,0.9)',position:'relative',
                                        justifyContent:'center',alignItems:'center',borderRadius:6}}>
                                    <ActivityIndicator
                                        animating={true}
                                        style={[styles.loader, {height: 40,position:'absolute',top:8,right:20,transform: [{scale: 1.6}]}]}
                                        size="large"
                                        color="#00BFFF"
                                    />
                                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                        <Text style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>
                                            登录中...
                                        </Text>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>

                </Image>

            </View>
        );

    },

    componentDidMount() {


        var username=null;
        var password=null;
        PreferenceStore.get('username').then((val)=>{
            username=val;
            return PreferenceStore.get('password');
        }).then((val)=>{
            password=val;
            if(username!==undefined&&username!==null&&username!=''
                &&password!==undefined&&password!==null&&password!='')
            {
                //TODO:auto-login
                this.setState({user:{
                    username:username,
                    password:password
                }})
            }
        })


    },
    componentWillUnmount() {

    },

    componentWillMount(){
        wechat.registerApp('wx9068ac0e88c09e7a').then(function (res) {

        })

        wechat.isWXAppInstalled().then((isInstall)=>{
            if(isInstall){
                //this.state.isInstalled=true;
                this.setState({isInstalled:true});
            }
        }).catch((er)=>{
            alert(er)
        })
    }

});


export default connect(
    (state) => ({
    })
)(Login);

var styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'transparent',
        margin:0,
        padding:0
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'rgba(0,0,0,0.3)'
    },
    logo: {
        width: 80,
        height:80,
        resizeMode:'cover',
        backgroundColor:'transparent',
    },
    loader: {
        marginTop: 10
    },
    row:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});
