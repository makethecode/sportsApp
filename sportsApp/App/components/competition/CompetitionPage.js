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
    BackAndroid,
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import CountDownTimer from 'react_native_countdowntimer'
import Bridge from '../../native/Bridge'
import GridView from 'react-native-super-grid'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_VEDIO,ACTION_BARCODE} from 'react-native-toolbar-wrapper'
import Config from "../../../config";
import Proxy from "../../utils/Proxy";
import ViewPager from 'react-native-viewpager';
import Ionicons from 'react-native-vector-icons/Ionicons'
import proxy from "../../utils/Proxy";
import CompetitionList from './CompetitionList'
import HomePage from '../../components/live/HomePage'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchGameList,fetchAllGameList
} from '../../action/CompetitionActions';
import CompetitionTeamList from './CompetitionTeamList'
import CompetitionGamesList from './CompetitionGamesList'
import CompetitionGameList from './CompetitionGameList'
import CompetitionGroupList from './CompetitionGroupList'
import CompetitionRankList from './CompetitionRankList'

var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');

var IMGS = [
    require('../../../img/zhibo1.jpeg'),
    require('../../../img/zhibo2.jpeg'),
    require('../../../img/zhibo3.jpeg'),
];

class CompetitionPage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
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
        }.bind(this), 3000);

        this.setState({noticeFresh:true})
    }

    fetchAllGameList(){

        this.state.doingFetch=true;
        this.state.isRefreshing=true;

        this.props.dispatch(fetchAllGameList(this.props.projectId)).then((json)=>{
            this.setState({doingFetch:false,isRefreshing:false,noticeFresh:false})
            if(json.re==1)
            {
                this.setState({notice:json.data,isRefreshing:false});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

    _renderPage(data,pageID){
        return (
            <View style={{width:width}}>
                <Image
                    source={data}
                    style={{width:width,flex:3}}
                    resizeMode={"stretch"}
                />
            </View>
        );
    }

    navigate2LiveHome()
    {
        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'HomePage',
                component: HomePage,
                params: {
                }
            })
        }
    }

    navigate2CompetitionTeamList(projectId)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionTeamList',
                component: CompetitionTeamList,
                params: {
                    projectId:projectId
                }
            })
        }
    }

    //比赛场次（团体赛）
    navigate2CompetitionGamesList(projectId)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionGamesList',
                component: CompetitionGamesList,
                params: {
                    projectId:projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                }
            })
        }
    }

    //比赛场次（单项赛）
    navigate2CompetitionGameList(projectId)
    {
        //单项赛（令this.props.gamesId=0）
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionGameList',
                component: CompetitionGameList,
                params: {
                    gamesId:0,
                    projectId:projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                }
            })
        }
    }

    //赛事安排
    navigate2CompetitionGroupList(projectId,projectType)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionGroupList',
                component: CompetitionGroupList,
                params: {
                    projectId:projectId,
                    projectType:projectType,
                }
            })
        }
    }

    constructor(props) {
        super(props);
        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});
        this.state={
            dataSource:ds.cloneWithPages(IMGS),
            itemList:[
                {'title':'比赛管理','icon':require('../../../img/com_on.png')},
                {'title':'分组名单','icon':require('../../../img/com_more.png')},
                {'title':'直播间','icon':require('../../../img/com_live.png')},
                {'title':'参赛队伍','icon':require('../../../img/com_record.png')},
                {'title':'对阵成绩','icon':require('../../../img/com_sign.png')},
                {'title':'个人榜','icon':require('../../../img/com_team.png')},
            ],
            notice:[],

            competitionId:this.props.competitionId,
            projectId:this.props.projectId,
            type:this.props.type,

            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            noticeFresh:true,
            doingFetch:false,
        };
    }

    render(){

        //RefreshControl:当ScrollView处于竖直方向的起点位置（scrollY: 0），此时下拉会触发一个onRefresh事件。


        var noticeList=null
        //"2018-02-01T09:00:00+00:00"
        var endTime = this.props.startTime.substring(0,10)+'T'+this.props.startTime.substring(11,16)+':00+00:00';

        var noticeList=null;
        var notice = this.state.notice;
        //var competitionList=this.state.competitionList;
        if(this.state.noticeFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchAllGameList();
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (notice !== undefined && notice !== null && notice.length > 0)
            {
                noticeList = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(notice)}
                        renderRow={this.renderNoticeRow.bind(this)}
                    />
                );
            }
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="比赛" actions={[]} navigator={this.props.navigator}>
                    <View style={{flex:1,height:height,width:width,backgroundColor:'#fff',flexDirection:'column'}}>

                        <View style={{width:width,height:120}}>
                            <ViewPager
                                style={this.props.style}
                                dataSource={this.state.dataSource}
                                renderPage={this._renderPage}
                                isLoop={true}
                                autoPlay={true}
                            />
                        </View>

                        <View style={{width:width,height:30,alignItems:'center',justifyContent:'center',paddingHorizontal:5,backgroundColor:'#eee',flexDirection:'row'}}>
                                <Text style={styles.cardItemTimeRemainTxt}>距离比赛开始还剩 </Text>
                                <CountDownTimer
                                    //date={new Date(parseInt(this.props.startTime+":00"))}
                                    date={endTime}
                                    days={{plural: '天 ',singular: '天 '}}
                                    hours=':'
                                    mins=':'
                                    segs=''

                                    daysStyle={styles.cardItemTimeRemainTxt}
                                    hoursStyle={styles.cardItemTimeRemainTxt}
                                    minsStyle={styles.cardItemTimeRemainTxt}
                                    secsStyle={styles.cardItemTimeRemainTxt}
                                    firstColonStyle={styles.cardItemTimeRemainTxt}
                                    secondColonStyle={styles.cardItemTimeRemainTxt}
                                />
                        </View>

                        <View style={{flex:2,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <GridView
                                itemDimension={width/3-20}
                                items={this.state.itemList}
                                style={styles.gridView}
                                renderItem={this.renderRow.bind(this)}
                            />
                        </View>

                        <View style={{width:width,height:40,justifyContent:'center',alignItems:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                            <Text style={{fontSize:15,color:'#444'}}>最新赛讯</Text>
                        </View>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10}}>
                            <Animated.View style={{opacity: this.state.fadeAnim,flex:1,paddingTop:5,paddingBottom:5,}}>
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
                                        />
                                    }
                                >
                            {noticeList}
                                </ScrollView>
                            </Animated.View>
                        </View>

                    </View>
                </Toolbar>
            </View>
        );
    }

    renderRow(rowData,rowId)
    {
        return(
        <TouchableOpacity style={{height:width/4,width:width/3-20,flexDirection:'column'}}
                          onPress={()=>{
                              switch(rowId){
                                  case 0:
                                      if(this.props.projectType==6){this.navigate2CompetitionGamesList(this.props.projectId)}
                                      else{this.navigate2CompetitionGameList(this.props.projectId)};break;//比赛管理

                                  case 1:this.navigate2CompetitionGroupList(this.props.projectId,this.props.projectType);break;//分组名单
                                  case 2:this.navigate2LiveHome();break;//直播间
                                  case 3:this.navigate2CompetitionTeamList(this.props.projectId);break;//参赛队伍
                              }
                          }}
        >
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems:'center'}}>
                <View style={{height:60,width:60,padding:10,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{height:45,width:45}}
                               source={rowData.icon} resizeMode={'stretch'}/>
                </View>
            <Text style={{flex:1,marginTop:5,color:'#666',fontSize:13}}>{rowData.title}</Text>
            </View>
        </TouchableOpacity>
        );
    }

    renderNoticeRow(rowData,rowId)
    {
        var gameClass = '';
        switch (rowData.gameClass){
            case '1':gameClass='小组赛';break;
            case '2':gameClass='32进16';break;
            case '3':gameClass='16进8';break;
            case '4':gameClass='8进4';break;
            case '5':gameClass='半决赛';break;
            case '6':gameClass='冠亚军决赛';break;
        }

        return (
            <View style={{backgroundColor:'#fff',marginTop:4}}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:1}}>

                    <View style={{width:width,height:100,padding:6, paddingHorizontal: 12,flexDirection:'row'}}>

                        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            {
                                rowData.isSingle=='1'?
                                    <View>
                                        {rowData.teamAimgList[0] == ''?
                                            <Image style={{height: 45, width: 45, borderRadius: 23}}
                                                   source={require('../../../img/portrait.jpg')}/>
                                            :
                                            <Image style={{height: 45, width: 45, borderRadius: 23}}
                                                   source={{uri: rowData.teamAimgList[0]}}/>
                                        }
                                    </View>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                        {rowData.teamAimgList[0] == ''?
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={require('../../../img/portrait.jpg')}/>
                                            :
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={{uri: rowData.teamAimgList[0]}}/>
                                        }
                                        {rowData.teamAimgList[1] == ''?
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={require('../../../img/portrait.jpg')}/>
                                            :
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={{uri: rowData.teamAimgList[1]}}/>
                                        }
                                    </View>
                            }
                            <Text style={{marginTop:10,fontSize:12,color:'#666'}}>{rowData.teamA}</Text>
                        </View>

                        {
                            rowData.state == '1'?
                                <View style={{flex: 2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                    <Text style={{fontSize:13,flex:1,color:'#666'}}>{gameClass}</Text>
                                    <Text style={{fontSize:12,flex:1,color:'#666'}}>{rowData.startTime}</Text>
                                    <Text style={{fontSize:20,flex:3}}>{rowData.scoreA} - {rowData.scoreB}</Text>
                                </View>
                                :
                                <View style={{flex:2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                    <Text style={{fontSize:12,flex:1,color:'#666'}}>{gameClass}</Text>
                                    <Text style={{fontSize:12,flex:1,color:'#666'}}>{rowData.startTime}</Text>
                                    <Text style={{fontSize:20,flex:3}}>未开始</Text>
                                </View>
                        }

                        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            {
                                rowData.isSingle=='1'?
                                    <View>
                                        {rowData.teamBimgList[0] == ''?
                                            <Image style={{height: 45, width: 45, borderRadius: 23}}
                                                   source={require('../../../img/portrait.jpg')}/>
                                            :
                                            <Image style={{height: 45, width: 45, borderRadius: 23}}
                                                   source={{uri: rowData.teamBimgList[0]}}/>
                                        }
                                    </View>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                        {rowData.teamBimgList[0] == ''?
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={require('../../../img/portrait.jpg')}/>
                                            :
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={{uri: rowData.teamBimgList[0]}}/>
                                        }
                                        {rowData.teamBimgList[1] == ''?
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={require('../../../img/portrait.jpg')}/>
                                            :
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={{uri: rowData.teamBimgList[1]}}/>
                                        }
                                    </View>
                            }
                            <Text style={{marginTop:10,fontSize:12,color:'#666'}}>{rowData.teamB}</Text>
                        </View>

                    </View>
                </View>
                <View style={{width:width,height:0.7,backgroundColor:'#aaa'}}/>
            </View>
        )
    }

    componentWillMount(){
        this.fetchAllGameList()
    }


    componentWillUnmount(){
    }
}

const styles = StyleSheet.create({
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight:'bold'
    },
    itemCode: {
        fontSize: 12,
        color: '#fff',
    },
    itemPlayer: {
        fontSize: 13,
        color: '#fff',
    },
    itemContainer: {
        flex:1,
        justifyContent: 'flex-end',
    },
    gridView: {
        flex: 1
    },
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
    },
    itemStyle:{
        height: 150,
        width:150,
        padding:5
    },
    cardItemTimeRemainTxt:{
        fontSize:13,
        color:'#666'
    }
});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo

    const props = {
        username:state.user.user.username,
        perName:personInfo.perName,
        personId:personInfo.personId,
        wechat:personInfo.wechat,
        perIdCard:personInfo.perIdCard,
    }
    return props
}



export default connect(mapStateToProps)(CompetitionPage);



