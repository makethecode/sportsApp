/**
 * Created by dingyiming on 2017/7/31.
 */

import React,{Component} from 'react';
import {
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
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import {
    fetchMaintainedVenue,
    fetchVenueCourseProfitByUnitId,
    fetchVenueEventProfitByUnitId,
} from '../../action/MapActions';
import {
    getAccessToken
}from '../../action/UserActions'

class MyVenueProfitDetail extends Component{

    constructor(props) {
        super(props);
        this.state={
            MyVenueProfitDetail:this.props.MyVenueProfitDetail,
            coursePay:0,
            eventPay:0,
        }
    }

    render() {

        var MyVenueProfitDetail = this.state.MyVenueProfitDetail;
        return (
            <View style={{flex:1}}>

                <Toolbar width={width} title={this.state.MyVenueProfitDetail.name} navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                         }}>

                    <View style={{flex:1,padding:10,marginTop:10,backgroundColor:'#fff'}}>
                        <View style={{flexDirection:'row',marginBottom:3}}>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems: 'flex-start'}}>
                                <Icon name={'star'} size={16} color="#66CDAA"/>
                                <Text style={{color:'#343434',justifyContent:'flex-start',alignItems: 'center'}}>课程收入：</Text>
                            </View>
                            <View style={{flex:5,color:'#343434',justifyContent:'flex-start',alignItems: 'flex-start'}}>
                                <Text style={{color:'#343434',justifyContent:'flex-start'}}>{this.state.coursePay}元</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',marginBottom:3}}>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems: 'flex-start'}}>
                                <Icon name={'star'} size={16} color="#66CDAA"/>
                                <Text style={{color:'#343434',justifyContent:'flex-start',alignItems: 'center'}}>活动收入：</Text>
                            </View>
                            <View style={{flex:5,color:'#343434',justifyContent:'flex-start',alignItems: 'flex-start'}}>
                                <Text style={{color:'#343434',justifyContent:'flex-start'}}>{this.state.eventPay}元</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',marginBottom:3}}>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems: 'flex-start'}}>
                                <Icon name={'star'} size={16} color="#66CDAA"/>
                                <Text style={{color:'#343434',justifyContent:'flex-start',alignItems: 'center'}}>总收入：</Text>
                            </View>
                            <View style={{flex:5,color:'#343434',justifyContent:'flex-start',alignItems: 'flex-start'}}>
                                <Text style={{color:'#343434',justifyContent:'flex-start'}}>{this.state.coursePay+this.state.eventPay}元</Text>
                            </View>
                        </View>

                    </View>

                </Toolbar>

            </View>
        );
    }

    componentWillMount(){
        var coursepay=0;
        var eventpay=0;

        this.props.dispatch(fetchVenueCourseProfitByUnitId(this.props.MyVenueProfitDetail.unitId)).then((json) => {
            if (json.re == 1) {
                for(var i=0;i<json.data.length;i++)coursepay+=json.data[i].payment;
                this.setState({coursePay:coursepay});
            }
            else {
                if (json.re = -100) {
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })

        // this.props.dispatch(fetchVenueEventProfitByUnitId(this.props.MyVenueProfitDetail.unitId)).then((json) => {
        //     if (json.re == 1) {
        //         for(var i=0;i<json.data.length;i++)eventpay+=json.data[i].payment;
        //         this.setState({eventPay:eventpay})
        //         //this.props.dispatch(makeTabsHidden());
        //     }
        //     else {
        //         if (json.re = -100) {
        //             this.props.dispatch(getAccessToken(false))
        //         }
        //
        //     }
        // })
    }
}

var styles = StyleSheet.create({
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        coaches:state.coach.coaches,
    })
)(MyVenueProfitDetail);
