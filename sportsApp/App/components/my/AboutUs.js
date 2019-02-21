
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
    BackAndroid
} from 'react-native';
import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';

import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import {getAccessToken,fetchMyClub} from "../../action/UserActions";
import {fetchMaintainedVenue} from "../../action/MapActions";
var {height, width} = Dimensions.get('window');

class AboutUs extends Component{
    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing:false,
            clubName:null

        };
    }

    render(){

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="关于我们" actions={[]} navigator={this.props.navigator}>

                    <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',
                            borderRadius:10}}>


                        {/*<Image resizeMode="stretch" style={{height:50,width:50,borderRadius:10}} source={require('../../../img/boxiang.jpg')}/>*/}
                        {/*<Image resizeMode="stretch" style={{height:50,width:50,borderRadius:10}} source={require('../../../img/maikexin.png')}/>*/}

                       {/*<Text style={{marginLeft:10}}>山东运动热体育科技有限公司</Text>*/}
                        <Text style={{marginLeft:10,fontSize:19}}>{this.state.clubName}</Text>
                        {/*<Text style={{marginLeft:10}}>迈可欣体育俱乐部</Text>*/}
                    </View>

                    <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#aaa',fontSize:13}}>

                        </Text>
                    </View>

                    <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#aaa',fontSize:13}}>Copyright©2016-2019</Text>
                        <Image resizeMode="stretch" style={{height:50,width:50,borderRadius:10}} source={require('../../../img/icon_sportsapp.png')}/>
                        <Text style={{marginLeft:10}}>山东运动热体育科技有限公司</Text>
                        {/*<Text style={{marginLeft:10}}>{this.state.clubName}</Text>*/}
                        {/*<Text style={{marginLeft:10}}>迈可欣体育俱乐部</Text>*/}
                    </View >


                </Toolbar>
            </View>
        )
    }

    componentDidMount(){
        //获取当前俱乐部
        this.props.dispatch(fetchMyClub(this.props.clubId)).then((json)=>{
            if(json.re==1)
            {
                var data = json.data[0];
                this.setState({clubName:data.name});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
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
    var personInfoAuxi = state.user.personInfoAuxiliary
    const props = {
        username:state.user.user.username,
        perName:personInfo.perName,
        wechat:personInfo.wechat,
        perIdCard:personInfo.perIdCard,
        clubId:personInfoAuxi.clubId
    }
    return props
}

export default connect(mapStateToProps)(AboutUs);


