import React, {Component} from 'react';
import {
    Alert,
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
    BackAndroid
} from 'react-native';
import {connect} from 'react-redux';
import TextInputWrapper from 'react-native-text-input-wrapper';
import QRCode from 'react-native-qrcode'
import {
    wechatPay2,
} from '../../action/UserActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import {getAccessToken,} from '../../action/UserActions';

var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');

class BadmintonCoursePay extends Component{
    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    wechatPay(pay,courseId,isChild){

        this.props.dispatch(wechatPay2(pay,courseId,isChild)).then((json)=>{
            if(json.re==1){
                this.setState({code_url:json.data.data.codeUrl});
                 // this.rnwechatpay(json.data)
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }
            }

        })
        }

        rnwechatpay(repay){
            WeChat.pay(
                {
                    partnerId: repay.mchId,  // 商家向财付通申请的商家id
                    prepayId: repay.prepayId,   // 预支付订单
                    nonceStr: repay.nonceStr,   // 随机串，防重发
                    timeStamp: repay.timeStamp,  // 时间戳，防重发
                    package: repay.package,    // 商家根据财付通文档填写的数据和签名
                    sign: repay.paySign        // 商家根据微信开放平台文档对数据做的签名
                }
            ).then((success)=>{
                //console.log(success)
                alert('支付成功')
            }).catch((error)=>{
                //console.log(error)
                alert('支付失败')
            })

        }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing:false,
            course:this.props.course,
            pay:{payment:this.props.course.cost+"",payType:'2'},
            code_url:null,
            // code_url:'weixin://wxpay/bizpayurl?pr=LU5EYra',
        };
    }

    render(){
        var course = this.props.course;
       // this.setState({pay:Object.assign(this.state.pay,{payment:activity.cost})})

        // course:{classCount: 100,clubName: "山体",coachId: "小吴,邹鹏,",coachLevel: "五星级教练",cost: 150,costType: "1",courseClub: 1,
        // courseGrade: 1,courseId: 29, courseName: "健身场地暖冬畅玩",courseNum: "20180021",createTime: 1521944116000,
        // creatorId: 3,creatorLoginName: "wbh",creatorName: "小吴",creatorPhone: "18254888887",detail: "每小时150",indexNum: 0,
        // isOwner: 1,maxNumber: 100,scheduleDes: "每小时150",signNumber: 0,status: 0,trainerId: "1,35,",unitId: 1,unitName: "山东体育学院羽毛球馆"}

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="二维码收款" actions={[]} navigator={this.props.navigator}>

                    <View style={{flex:1,height:height-100,width:width,backgroundColor:'#66CDAA',padding:5,flexDirection:'column'}}>

                        <View style={{flex:1,padding:10,margin:5,alignItems:'center',justifyContent:'center'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>{course.courseName}</Text>
                            </View>
                        </View>

                        {
                            this.state.code_url==null?
                                <View style={{flex:4,padding:10,margin:5,alignItems:'center',justifyContent:'center'}}>
                                    <View style={{padding:15,backgroundColor:'#fff'}}></View>
                                </View>
                                :
                                <View style={{flex:4,padding:10,margin:5,alignItems:'center',justifyContent:'center'}}>
                                    <View style={{padding:15,backgroundColor:'#fff'}}>
                                        <QRCode
                                            value={this.state.code_url}
                                            size={200}
                                            bgColor='black'
                                            fgColor='white'/>
                                    </View>
                                </View>
                        }

                        <View style={{flex:2,padding:10,margin:5,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:20,color:'#fff'}}>打开微信[扫一扫]</Text>
                            </View>
                            <View style={{flex:2}}>
                                {/*<Text style={{marginLeft:10}}>山东运动热体育科技有限公司</Text>*/}
                                <Text style={{marginLeft:10}}>济南博翔体育俱乐部</Text>
                                {/*<Text style={{marginLeft:10}}>迈可欣体育俱乐部</Text>*/}
                            </View>
                        </View>

                    </View>

                </Toolbar>
            </View>
        )
    }

    componentDidMount(){

        this.wechatPay(this.state.pay,this.props.course.courseId,this.props.isChild);
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#66CDAA'
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
    const props = {
        username:state.user.user.username,
        perName:personInfo.perName,
        wechat:personInfo.wechat,
        perIdCard:personInfo.perIdCard
    }
    return props
}



export default connect(mapStateToProps)(BadmintonCoursePay);



