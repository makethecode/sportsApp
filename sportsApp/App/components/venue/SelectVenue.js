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
    InteractionManager
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements'
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import {
    fetchMaintainedVenue
} from '../../action/MapActions';
import {
    makeTabsHidden,
    makeTabsShown
} from '../../action/TabActions';

import {
    getAccessToken
}from '../../action/UserActions'

import VenueDetail from './VenueDetail';

var {height, width} = Dimensions.get('window');

class SelectVenue extends Component {

    navigate2VenueDetail(rowData){
        this.props.dispatch(makeTabsShown());
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'venueDetail',
                component: VenueDetail,
                params: {
                    venueDetail:rowData
                }
            })
        }
    }

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    _onRefresh() {
        this.setState({ isRefreshing: true, fadeAnim: new Animated.Value(0) });
        setTimeout(function () {
            this.setState({
                isRefreshing: false,
            });
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bounce
                },           // Configuration
            ).start();
        }.bind(this), 2000);
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),

            venues:[],
            venue:null,
            allvenues:[],
        };
    }

    render()
    {

        var venueList = [];
        var {venues}=this.state;

        if(venues&&venues.length>0)
        {

            venues.map((venue,i)=>{
                venueList.push(

                    //[{brief=null, feeDes=每人每次15元, address=世纪大道10600号, yardTotal=6, town=历城区, manager=3, city=济南市, latitude=36.693125,
                    // unitNum=U000001, remark=, province=山东省, phone=18254888887, name=山东体育学院羽毛球馆, unitId=1, attachId=null, longitude=117.200185},

                    <TouchableOpacity key={i} style={{flexDirection:'column',marginTop:4}}
                                      onPress={()=>{
                                          this.navigate2VenueDetail(venue);
                                      }}>

                        <View style={{ padding: 6,flexDirection:'row',marginTop:3}}>
                            <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="contain" style={{height: 50, width: 50}}
                                       source={require('../../../img/venue.png')}/>
                            </View>
                            <View style={{flex:3,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{ color: '#222', fontSize: 14,marginBottom:5}}>{venue.name}</Text>
                                <Text style={{ color: '#666', fontSize: 13}}>场地编号：{venue.unitNum}</Text>
                            </View>
                        </View>

                        <View style={{flex:3,padding:10,flexDirection:'column'}}>
                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#ffffff'}}>联系电话</Text>
                                </View>
                                <View style={{flex:3.5,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{venue.phone}</Text>
                                </View>
                            </View>

                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#ffffff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>详细地址</Text>
                                </View>
                                <View style={{flex:3.5,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{venue.address}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

                    </TouchableOpacity>
                )
            })

        }else{venueList.push(<View/>)}

        return (
            <View style={styles.container}>
                <Toolbar width={width}  title="场馆列表" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>
                    <SearchBar
                        lightTheme
                        onChangeText={
                            //模糊查询
                            (text)=>{
                                this.searchByText(text)
                            }
                        }
                        placeholder='姓名\电话\地点' />
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>场馆名单</Text>
                    </View>
                    <ScrollView style={{ flex: 1, width: width, backgroundColor: '#fff' }}>

                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                            {venueList}
                        </Animated.View>

                    </ScrollView>

                </Toolbar>
            </View>
        )

    }

    searchByText(text){

        //前端实现模糊查询

        if(text==null || text=='')
        {
            var venues = this.state.allvenues;
            this.setState({venues:venues})
        }
        else {
            var venues = this.state.allvenues;
            var venueList = [];

            if (venues && venues.length > 0) {
                venues.map((venue, i) => {
                    if (venue.name) {
                        if (venue.name.indexOf(text) != -1)
                            venueList.push(venue)
                    }
                })
            }

            this.setState({venues: venueList})
        }
    }


    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchMaintainedVenue()).then((json)=>{
                if(json.re==1)
                {
                    var venues = json.data;
                    if(venues!=null)
                    venues.map((venue)=>{
                        venue.checked = false;
                    })
                    this.setState({venues:venues,allvenues:venues});
                    //this.props.dispatch(makeTabsHidden());
                }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                    }
                    this.setState({venues:[],allvenues:[]});

                }
            })
        });
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        coaches:state.coach.coaches,
        venues:state.map.venues,
    })
)(SelectVenue);


