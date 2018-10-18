
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
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CoachList from '../components/course/CoachList';
import Venue from '../components/venue/SelectVenue';

class Found extends Component{

    navigate2CoachList(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'coachList',
                component: CoachList,
                params: {

                }
            })
        }
    }

    navigate2Venue(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'venue',
                component: Venue,
                params: {

                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state={
            venues:this.props.venues,
        }
    }

    render() {

        return (
            <View style={{flex:1}}>
                <View style={{flex:2}}>
                    <Image style={{flex:2,width:width,position:'relative'}} source={require('../../img/tt3@2x.jpeg')} >

                    </Image>
                </View>

                <View style={{flex:6,backgroundColor:'#eee'}}>
                    <View style={{flex:12,backgroundColor:'#eee'}}>
                        <TouchableOpacity style={{height:45,backgroundColor:'#fff',flexDirection:'row',padding:2,marginBottom:3,paddingLeft:10}}
                                          onPress={()=>{
                            this.navigate2CoachList();
                        }}>
                            <View style={{flex:1,flexDirection:'row',margin:5,
                            justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="contain" style={{height:30,width:30}} source={require('../../img/coach.png')}/>
                            </View>
                            <View style={{flex:12,backgroundColor:'#fff',justifyContent:'center',paddingLeft:20}}>
                                <Text>教练列表</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height:45,backgroundColor:'#fff',flexDirection:'row',padding:2,marginBottom:3,paddingLeft:10}}
                                          onPress={()=>{
                            this.navigate2Venue();
                        }}
                        >

                            <View style={{flex:1,flexDirection:'row',margin:5,
                            justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="contain" style={{height:30,width:30}} source={require('../../img/venue.png')}/>
                            </View>
                            <View style={{flex:12,backgroundColor:'#fff',justifyContent:'center',paddingLeft:20}}>
                                <Text>场馆列表</Text>
                            </View>

                        </TouchableOpacity>


                    </View>

                    <View style={{flex:1,backgroundColor:'#eee'}}>

                    </View>
                </View>

            </View>
        );
    }

}

var styles = StyleSheet.create({


});

const mapStateToProps = (state, ownProps) => {

    const props = {
        venues:state.map.venues,
    }
    return props
}

export default connect(mapStateToProps)(Found);
