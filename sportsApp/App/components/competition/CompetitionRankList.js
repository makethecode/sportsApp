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
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    ToastAndroid
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import {getAccessToken,} from '../../action/UserActions';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CompetitionTeamPerson from './CompetitionTeamPersonList'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchTeamList,fetchRankList
} from '../../action/CompetitionActions';

var WeChat=require('react-native-wechat');
var {height, width} = Dimensions.get('window');
const dropdownWidth = width/3-20;

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

class CompetitionRankList extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onRefresh() {
        this.setState({isRefreshing: true, fadeAnim: new Animated.Value(0)});
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
        }.bind(this), 500);
        // this.props.dispatch(enableActivityOnFresh());
    }

    renderRow(rowData,sectionId,rowId){

        // {'personId': 1, 'perNum': '云糯糯','team': '海云单打队',
        // 'avatar': 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        // 'scoreCount':10,'lostCount':3}

        var imguri = rowData.avatar;
        var rank = parseInt(rowId)+1

        var row=(
            <View style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}>

                {/*用户名*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{rank}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                    <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:3,justifyContent:'center',alignItems: 'center',textAlign:'left',marginLeft:3,flexDirection:'row'}}>
                    <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.perNum}</Text>
                    </View>
                </View>
                {/*队伍*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.scoreCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>

                </View>
        );

        return row;
    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            ranks: []
        }

    }

    render() {

        var rankListView = null;
        var rankList = this.state.ranks;

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (rankList !== undefined && rankList !== null && rankList.length > 0) {
                rankListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(rankList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        return (
            <View style={{flex:1}}>
                <Toolbar width={width}  title="排行榜" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>
                    {/*内容区*/}
                    <View style={{flex:5,backgroundColor:'#eee'}}>

                        <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row'}}>

                            {/*用户名*/}
                            <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems: 'center'}}>
                                    <Text style={{color:'#999'}}>用户名</Text>
                            </View>
                            {/*队伍*/}
                            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                                <Text style={{color:'#999'}}>队伍</Text>
                            </View>
                            {/*得分*/}
                            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                                <Text style={{color:'#999'}}>得球数</Text>
                            </View>
                            {/*失分*/}
                            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                                <Text style={{color:'#999'}}>失球数</Text>
                            </View>
                        </View>

                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingTop:5,paddingBottom:5,}}>
                            <ScrollView
                                refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                    tintColor="#9c0c13"
                                    title="刷新..."
                                    titleColor="#9c0c13"
                                    colors={['#ff0000', '#00ff00', '#0000ff']}
                                    progressBackgroundColor="#ffff00"
                                />}
                            >
                                {rankListView}
                            </ScrollView>
                        </Animated.View>
                    </View>
                </Toolbar>
            </View>
        );
    }


    componentWillUnmount(){
    }

    componentDidMount(){

        // {'personId': 1, 'perNum': '云糯糯','team': '海云单打队',
        // 'avatar': 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        // 'scoreCount':10,'lostCount':3}

        this.props.dispatch(fetchRankList(this.props.projectId)).then((json)=>{
            if(json.re==1)
            {
                this.setState({ranks:json.data});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })

    }

}

var styles = StyleSheet.create({
    container: {

    },
    siftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        height: 44,
        borderBottomColor: '#cdcdcd',
    },
    viewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        height: 50,
        borderBottomColor: '#cdcdcd',
    },
    siftCell: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewCell: {
        height: 50,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    orderByFont: {
        color:'#5c5c5c',
        marginRight: 5
    },
    paymentItem: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    flexContainer: {
        flexDirection: 'row',
    },
    cell: {
        width:dropdownWidth,
        alignItems:'center',
        flexDirection:'row',
        height:35,
        borderRightColor:'#cdcdcd',
        borderRightWidth:0.7,

    },
    viewcell: {
        width:dropdownWidth-0.7,
        backgroundColor:'#ffffff',
        alignItems:'center',
        height:35,
        justifyContent:'center',
        flexDirection:'row',
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#646464',
        justifyContent:'center',
    },
    dropdownstyle: {
        height: 100,
        width:dropdownWidth,
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
    },
    dropdown_row: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    dropdown_row_text: {
        fontSize: 13,
        color: '#646464',
        textAlignVertical: 'center',
        justifyContent:'center',
        marginLeft: 5,
    },
    dropdown_image: {
        width: 20,
        height: 20,
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionRankList);



