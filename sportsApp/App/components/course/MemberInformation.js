
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
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import TextInputWrapper from 'react-native-text-input-wrapper';
import ActionSheet from 'react-native-actionsheet';
import{
    fetchMemberInformation,getAccessToken
} from '../../action/UserActions';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

var {height, width} = Dimensions.get('window');

class MemberInformation extends Component{

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

    constructor(props) {
        super(props);
        this.state={
            selectBirthday:false,
            //成员信息
            member:{avatar:null,perNum:null,wechat:null,mobilePhone:null,perName:null,sex:null,birthday:null,heightweight:null,coachLevel:null,sportLevel:null,isCoach:null}
        };

    }

    render(){

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="成员资料" actions={[]} navigator={this.props.navigator}>
                    <View style={{flexDirection:'column'}}>

                            <View style={{width:width,height:180,backgroundColor:'#66CDAA',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                            {/*头像*/}
                                <View style={{alignItems:'center',justifyContent:'center',height:100,width:width,marginTop:120}}>
                                    {
                                        this.state.member.avatar&&this.state.member.avatar!=''?
                                            <Image resizeMode="stretch" style={{height: 70, width: 70, borderRadius: 35,borderColor:'#fff',borderWidth:2,alignItems:'center',justifyContent:'center'}}
                                                   source={{uri: this.state.member.avatar}}/>:
                                            <Image resizeMode="stretch" style={{height: 70, width: 70, borderRadius: 35,borderColor:'#fff',borderWidth:2,alignItems:'center',justifyContent:'center'}}
                                                   source={require('../../../img/portrait.jpg')}/>
                                    }
                                </View>

                        {/*用户名*/}
                        <View style={{marginTop:3,justifyContent:'center'}}>
                                {
                                    this.state.member.perNum&&this.state.member.perNum!=''?
                                        <Text style={{color:'#fff',fontSize:20}}>
                                            {this.state.member.perNum}
                                        </Text>:
                                        <Text style={{color:'#fff',fontSize:20}}>
                                            未设置
                                        </Text>
                                }
                        </View>

                                {/*简介*/}
                                <View style={{paddingHorizontal:10,marginTop:10,justifyContent:'center',marginBottom:20}}>
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:13}}>简介：未设置</Text>
                                    </View>
                                </View>

                            </View>

                            <View style={{width:width,height:240,padding:10,backgroundColor:'#fff',flexDirection:'column'}}>

                        {/*真实姓名*/}
                                <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                                    <View style={{flex:1,justifyContent:'center'}}>
                                        <Text style={{color:'#555',fontSize:15}}>
                                            真实姓名
                                        </Text>
                                    </View>
                                    <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                        {
                                            this.state.member.perName&&this.state.member.perName!=''?
                                                <Text style={{color:'#444',fontSize:15}}>
                                                    {this.state.member.perName}
                                                </Text>:
                                                <Text style={{color:'#777',fontSize:15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>


                        {/*性别*/}
                                <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                                    <View style={{flex:1,justifyContent:'center'}}>
                                        <Text style={{color:'#555',fontSize:15}}>
                                            性别
                                        </Text>
                                    </View>
                                    <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                        {
                                            this.state.member.sex&&this.state.member.sex!=''?
                                                <Text style={{color:'#444',fontSize:15}}>
                                                    {this.state.member.sex}
                                                </Text>:
                                                <Text style={{color:'#777',fontSize:15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>


                        {/*出生日期*/}
                                <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                                    <View style={{flex:1,justifyContent:'center'}}>
                                        <Text style={{color:'#555',fontSize:15}}>
                                            出生日期
                                        </Text>
                                    </View>
                                    <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                        {
                                            this.state.member.birthday&&this.state.member.birthday!=''?
                                                <Text style={{color:'#444',fontSize:15}}>
                                                    {this.state.member.birthday}
                                                </Text>:
                                                <Text style={{color:'#777',fontSize:15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>

                            {/*身高体重*/}
                                <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row',borderBottomWidth:1,borderColor:'#eee'}}>
                                    <View style={{flex:1,justifyContent:'center'}}>
                                        <Text style={{color:'#555',fontSize:15}}>
                                            身高体重
                                        </Text>
                                    </View>
                                    <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                        {
                                            this.state.member.heightweight&&this.state.member.heightweight!=''?
                                                <Text style={{color:'#444',fontSize:15}}>
                                                    {this.state.member.heightweight}
                                                </Text>:
                                                <Text style={{color:'#777',fontSize:15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>

                                {/*微信号*/}
                                <View style={{flex:1,padding:12,paddingHorizontal:10,paddingTop:4,flexDirection:'row'}}>
                                    <View style={{flex:1,justifyContent:'center'}}>
                                        <Text style={{color:'#555',fontSize:15}}>
                                            微信号
                                        </Text>
                                    </View>
                                    <View style={{alignItems:'center',justifyContent:'flex-end'}}>
                                        {
                                            this.state.member.wechat&&this.state.member.wechat!=''?
                                                <Text style={{color:'#444',fontSize:15}}>
                                                    {this.state.member.wechat}
                                                </Text>:
                                                <Text style={{color:'#777',fontSize:15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>

                                {/*手机号*/}
                                    <View style={{
                                    flex: 1,
                                    padding: 12,
                                    paddingHorizontal: 10,
                                    paddingTop: 4,
                                    flexDirection: 'row'
                                }}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={{color: '#555', fontSize: 15}}>
                                    手机号
                                    </Text>
                                    </View>
                                    <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                                    {
                                        this.state.member.mobilePhone && this.state.member.mobilePhone != '' ?
                                            <Text style={{color: '#444', fontSize: 15}}>
                                                {this.state.member.mobilePhone}
                                            </Text> :
                                            <Text style={{color: '#777', fontSize: 15}}>
                                                未设置
                                            </Text>
                                    }
                                    </View>
                                    </View>
                        </View>

                    </View>
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
        }).catch((e)=>{
            alert(e)
        });
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
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


module.exports = connect(state=>({
        userType: state.user.user.usertype,
        creatorId:state.user.personInfo.personId
    })
)(MemberInformation);


