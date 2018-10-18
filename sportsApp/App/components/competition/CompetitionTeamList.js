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
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchTeamList
} from '../../action/CompetitionActions';

var WeChat=require('react-native-wechat');
var {height, width} = Dimensions.get('window');
const dropdownWidth = width/3-20;

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

class CompetitionTeamList extends Component {

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

    navigate2CompetitionTeamPerson(teamId)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionTeamPerson',
                component: CompetitionTeamPerson,
                params: {
                    teamId:teamId
                }
            })
        }
    }

    setCompetitionList()
    {
        // this.props.dispatch(enableActivityOnFresh());
    }

    renderAllAvatars(avatars){
        var allAvatars = [];
        if(avatars==null)return null;
        for(var i=0;i<avatars.length;i++) {
            var model = avatars[i]
            var item = this.getImageViewItem(model)
            allAvatars.push(item);
        }
        return allAvatars;
    }

    getImageViewItem(model){

        return (
            <View style={{flex:1,padding:1}}>
            <Image resizeMode="stretch" style={{height:25,width:25,borderRadius:13}} source={{uri:model}}/>
            </View>
        );
    }

    renderRow(rowData,sectionId,rowId){

        // {'teamId': 1, 'teamName': '热爱羽毛球小分队','teamNum': '20181010','personId':3,'personNum':'wbh','maxNum':10,'nowNum':3,
        // 'avatar': 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //     'avatarList':
        //     [   'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //         'https://wx.qlogo.cn/mmopen/vi_32/OpqHHsgWiaSQWXiaQExFffsLqTnZWCU2BnfJsYzO59DaFoBaicEYbaCnZdThAj2xf32ZMqYsq0oHZsaWAGoPuZz5A/132',
        //         'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132']
        // }

        var imguri = rowData.avatar;
        var avatars = rowData.avatarList;

        var avatarList = (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                bounces ={false}
                showsHorizontalScrollIndicator  ={true}
                ref={(scrollView) => { this._scrollView = scrollView; }}
                horizontal={true}
            >
                {this.renderAllAvatars(avatars)}
            </ScrollView>
        );

        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}>
                <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:4,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row'}}>
                        <View style={{backgroundColor:'#fca482',borderRadius:5,padding:5}}><Text style={{color:'#ffffff'}}>队长</Text></View>
                                <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.personNum}</Text>
                    </View>
                </View>
                <View style={{flex:3,padding:10}}>
                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                            <Text style={{color:'#ffffff'}}>队名</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.teamName}</Text>
                        </View>
                    </View>

                    <View style={{flex:3,flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#ffffff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>编号</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.teamNum}</Text>
                        </View>
                    </View>
                </View>

                <View style={{flex:1,flexDirection:'column',padding:10,borderTopWidth:1,borderColor:'#ddd'}}>

                    <View style={{flexDirection:'row',flex:2.5,alignItems:'flex-start'}}>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>

                        <View style={{backgroundColor:'#ffffff',borderRadius:5,padding:5}}><Text style={{color:'#fca482'}}>队员</Text></View>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.nowNum}/{rowData.maxNum}人</Text>
                    </View>

                        <View style={{flex:4,backgroundColor:'#fff',justifyContent:'flex-start',marginBottom:3}}>
                            <TouchableOpacity onPress={()=>{
                                this.navigate2CompetitionTeamPerson(rowData.teamId)
                            }}>
                        {avatarList}
                            </TouchableOpacity>
                        </View>
                    </View>
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
            teams: []
        }

    }

    render() {

        var teamListView = null;
        var teamList = this.state.teams;

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (teamList !== undefined && teamList !== null && teamList.length > 0) {
                teamListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(teamList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        return (
            <View style={{flex:1}}>
                <Toolbar width={width} title="参赛队伍" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                //添加队伍
                                }
                         }}>
                    {/*内容区*/}
                    <View style={{flex:5,backgroundColor:'#eee'}}>
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
                                {teamListView}
                                {
                                    teamListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }
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

        //获取参与项目队伍列表
        // {'teamId': 1, 'teamName': '热爱羽毛球小分队','teamNum': '20181010','personId':3,'personNum':'wbh','maxNum':10,'nowNum':3,
        // 'avatar': 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //     'avatarList':
        //     [   'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //         'https://wx.qlogo.cn/mmopen/vi_32/OpqHHsgWiaSQWXiaQExFffsLqTnZWCU2BnfJsYzO59DaFoBaicEYbaCnZdThAj2xf32ZMqYsq0oHZsaWAGoPuZz5A/132',
        //         'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132']
        // }

        this.props.dispatch(fetchTeamList(this.props.projectId)).then((json)=>{
            if(json.re==1)
            {
                this.setState({teams:json.data});
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
)(CompetitionTeamList);



