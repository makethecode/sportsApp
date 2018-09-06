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
import {wechatGoodsPay,goodsPaySuccess} from '../../action/UserActions';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import {getAccessToken,} from '../../action/UserActions';
var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');

class ProductPay extends Component{
    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    wechatPay(pay,goods){

        this.props.dispatch(wechatGoodsPay(pay,goods)).then((json)=>{
            if(json.re==1){
                this.setState({code_url:json.data.code_url});
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }
            }

        })
        }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing:false,
            goods:this.props.goods,
            money:this.props.money,
            pay:{payment:this.props.money+"",payType:'2'},
            code_url:null,
        };
    }

    render(){
        var goods = this.props.goods;
       // this.setState({pay:Object.assign(this.state.pay,{payment:activity.cost})})

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="二维码收款" actions={[]} navigator={this.props.navigator}>

                    <View style={{flex:1,height:height-100,width:width,backgroundColor:'#66CDAA',padding:5,flexDirection:'column'}}>

                        <View style={{flex:1,padding:10,margin:5,alignItems:'center',justifyContent:'center'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>商品购买</Text>
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
                                            value={'weixin://wxpay/bizpayurl?pr=LU5EYra'}
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
                                <Text style={{fontSize:13,color:'#fff'}}>山东体育热有限公司</Text>
                            </View>
                        </View>

                    </View>

                </Toolbar>
            </View>
        )
    }

    componentDidMount(){
        //逻辑不完整
        //this.wechatPay(this.state.pay,this.state.goods);
    }

    componentWillUnmount(){
        //判断是否支付成功
        Alert.alert(
            '是否支付成功？',
            '',
            [
                {text: '否', onPress: () =>{
                }},
                {text: '是', onPress: () =>
                {

                    // this.props.dispatch(goodsPaySuccess(this.state.goods)).then((json)=>{
                    // })

                }},
            ],
        )
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



export default connect(mapStateToProps)(ProductPay);



