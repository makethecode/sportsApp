
import React,{Component} from 'react';
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
    DeviceEventEmitter,
    Easing,
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD,ACTION_LOCATE} from 'react-native-toolbar-wrapper';
import SelectVenue from './SelectVenue';

import {
    MapView,
    MapTypes,
    Geolocation
} from 'react-native-baidu-map';
import {
    localSearch,
    fetchMaintainedVenue
} from '../../action/MapActions';
import{
    getAccessToken
}from '../../action/UserActions'

var {height, width} = Dimensions.get('window');

class VenueMap extends Component{
    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2SelectVenue()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'VenueInspect',
                component: SelectVenue,
                params: {
                    setPlace:this.props.setPlace
                }
            })
        }
    }


    constructor(props) {
        super(props);
        //this.props.venueDetail
        //[{brief=null, feeDes=每人每次15元, address=世纪大道10600号, yardTotal=6, town=历城区, manager=3, city=济南市, latitude=36.693125,
        // unitNum=U000001, remark=, province=山东省, phone=18254888887, name=山东体育学院羽毛球馆, unitId=1, attachId=null, longitude=117.200185},

        this.state={
            mayType: MapTypes.NORMAL,
            zoom: 12,
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            center: {
                latitude: props.center.latitude,
                longitude: props.center.longitude,
            },
            marker: {
                latitude: props.center.latitude,
                longitude: props.center.longitude,
                title: '您的位置'
            },
            center:props.center,
            detailPosition:new Animated.Value(0),
            detail:props.venueDetail,
            detailMarker:[{
                latitude: props.venueDetail.latitude,
                longitude: props.venueDetail.longitude,
                title: props.venueDetail.name,
            }],
        }
    }

    render()
    {
        return(
            <View style={styles.container}>

                <Toolbar width={width} title="查看地图" navigator={this.props.navigator}
                         actions={[{icon:ACTION_LOCATE,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             //重新定位
                             Geolocation.getCurrentPosition()
                                 .then(data => {

                                     console.warn(JSON.stringify(data));

                                     this.setState({
                                         zoom: 15,
                                         marker: {
                                             latitude: data.latitude,
                                             longitude: data.longitude,
                                             title: '您的位置'
                                         },
                                         center: {
                                             latitude: data.latitude,
                                             longitude: data.longitude,
                                             rand: Math.random()
                                         }
                                     });
                                 }).catch(e =>{})
                         }}>
                <View style={{flex:1}}>
                    <MapView
                        trafficEnabled={this.state.trafficEnabled}
                        baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                        zoom={this.state.zoom}
                        mapType={this.state.mapType}
                        center={this.state.center}
                        marker={this.state.marker}
                        markers={this.state.detailMarker}
                        style={styles.map}>
                    </MapView>

                    {
                        this.state.detail.name!==null&&this.state.detail.name!==undefined?

                            <View style={[{flexDirection:'row',width:width,height:100,alignItems:'center',
                                backgroundColor:'#fff',borderTopWidth:1,borderColor:'#ddd',position:'absolute',bottom:3},
                               ]}>
                                <View style={{flex:1,flexDirection:'column',padding:6}}>

                                    <View style={{flex:1,flexDirection:'row',padding:6,paddingBottom:10}}>
                                        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                            <Text style={{fontSize:16}}>
                                                {this.state.detail.name}
                                            </Text>
                                        </View>

                                    </View>

                                    <View style={{flexDirection:'column',padding:3,marginBottom:10,justifyContent:'flex-start'}}>
                                        <View style={{flexDirection:'row',marginBottom:6}}>
                                        <Text style={{fontSize:13,color:'#f00'}}>详细地址 </Text>
                                        <Text style={{fontSize:13,color:'#888'}}>{this.state.detail.address}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',marginBottom:6}}>
                                        <Text style={{fontSize:13,color:'#f00'}}>联系电话 </Text>
                                        <Text style={{fontSize:13,color:'#888'}}>{this.state.detail.phone}</Text>
                                        </View>
                                    </View>
                                </View>

                            </View>:null
                    }
                </View>
                </Toolbar>

            </View>
        )
    }

    componentDidMount()
    {}
}


var styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    map: {
        width: Dimensions.get('window').width,
        flex:1,
        marginBottom: 0,
        justifyContent:'flex-end'
    }
});

const mapStateToProps = (state, ownProps) => {

    const props = {
        center:state.map.center
    }
    return props
}


export default connect(mapStateToProps)(VenueMap);
