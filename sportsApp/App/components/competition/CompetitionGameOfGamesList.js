/**
 * Created by dingyiming on 2017/8/1.
 */
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
    InteractionManager,
    Alert,
    Modal,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_CHECK} from 'react-native-toolbar-wrapper';
import ActionSheet from 'react-native-actionsheet';
import CompetitionGameModal from './CompetitonGameModal'
import {
    fetchGames,disableCompetitionOnFresh,
    enableCompetitionOnFresh,fetchCompetitions,
    fetchProjects,fetchGamesList,fetchGameList,
    createCompetitonGame,fetchGameOfGamesList,compeleteGameOfGames
} from '../../action/CompetitionActions';
import CreateCompetitionGame from './CreateCompetitionGame'
import CompetitionRecord from './CompetitionRecord'
import CompetitionGamesRecord from './CompetitionGamesRecord'
var Popover = require('react-native-popover');

var { height, width } = Dimensions.get('window');

class CompetitionGameList extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2CreateCompetitionGame()
    {
        //创建比赛
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CreateCompetitionGame',
                component: CreateCompetitionGame,
                params: {
                    projectId:this.props.projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                    games:this.props.games,
                }
            })
        }
    }

    navigate2CompetitionGamesRecord(game)
    {
        //团体赛记录
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionGamesRecord',
                component: CompetitionGamesRecord,
                params: {
                    projectId:this.props.projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                    game:game,
                }
            })
        }
    }

    navigate2CompetitionRecord(game)
    {
        //比分记录
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionRecord',
                component: CompetitionRecord,
                params: {
                    projectId:this.props.projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                    gamesId:this.props.gamesId,
                    game:game,
                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state={
            games:this.props.games,
            gameList:[],
            showProgress:false,
        };
    }

    renderGameRow(rowData,sectionId,rowId){

        // {'id':33,'teamAName':'开心队','teamBName':'不开心队','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00','endTime':'2018-12-11 10:00',state:0,
        //     'teamAimgList':['https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0'],
        //     'teamBimgList':['https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132'],
        //     'gameClass':1,'isSingle':1,'gameType':1,'teamA':{},'teamB':{},
        //     'matchList':[{'teamAName':'开心队','teamBName':'不开心队','scoreA':1,'socreB':0,state:1},{'teamAName':'开心队','teamBName':'不开心队','scoreA':0,'socreB':0,state:0}]}


        var gameClass = '';
        switch (rowData.gameClass){
            case '1':gameClass='小组赛';break;
            case '2':gameClass='32进16';break;
            case '3':gameClass='16进8';break;
            case '4':gameClass='8进4';break;
            case '5':gameClass='半决赛';break;
            case '6':gameClass='冠亚军决赛';break;
        }

        var gameType = '';
        switch (rowData.gameType){
            case '1':gameType='男单';break;
            case '2':gameType='女单';break;
            case '3':gameType='男双';break;
            case '4':gameType='女双';break;
            case '5':gameType='混双';break;
            case '6':gameType='团体';break;
        }

        return (
            <TouchableOpacity style={{backgroundColor:'#fff',marginTop:4}}
                              onPress={()=>{
                                  //this.setState({matchList:rowData.matchList,teamAName:rowData.teamAName,teamBName:rowData.teamBName});
                                  this.navigate2CompetitionGamesRecord(rowData)
                              }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:1}}>

                    <View style={{width:width,height:100,padding:6, paddingHorizontal: 12,flexDirection:'row'}}>

                        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            {
                                rowData.isSingle == '1'?
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
                        <Text style={{marginTop:10,fontSize:12,color:'#666'}}>{rowData.teamAName}</Text>
                    </View>

                    {
                        rowData.state == '1'?
                        <View style={{flex: 2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <Text style={{fontSize:13,flex:1,color:'#666'}}>{gameType}</Text>
                            <Text style={{fontSize:12,flex:1,color:'#666'}}>{rowData.startTime}</Text>
                            <Text style={{fontSize:20,flex:3}}>{rowData.scoreA} - {rowData.scoreB}</Text>
                        </View>
                            :
                            <View style={{flex:2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                <Text style={{fontSize:12,flex:1,color:'#666'}}>{gameType}</Text>
                                <Text style={{fontSize:12,flex:1,color:'#666'}}>{rowData.startTime}</Text>
                                <Text style={{fontSize:20,flex:3}}>未开始</Text>
                            </View>
                    }

                    <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        {
                            rowData.isSingle == '1'?
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
                        <Text style={{marginTop:10,fontSize:12,color:'#666'}}>{rowData.teamBName}</Text>
                    </View>

                    </View>
                </View>
                <View style={{width:width,height:0.7,backgroundColor:'#aaa'}}/>
            </TouchableOpacity>
        )

    }

    render()
    {
        var displayArea = {x:5, y:10, width:width-10, height: height - 10};

        var gameListView=null;
        var gameList = this.state.gameList;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (gameList !== undefined && gameList !== null && gameList.length > 0)
        {
            gameListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(gameList)}
                    renderRow={this.renderGameRow.bind(this)}
                />
            );
        }

        return (

            <View style={styles.container}>
                <Toolbar width={width} title="单项赛场次" navigator={this.props.navigator}
                         actions={[{icon:ACTION_CHECK,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){

                                 Alert.alert('提示',
                                     '是否开始统计各单项赛结果？',
                                     [
                                         {
                                             text: '确定',
                                             onPress: () => this.compeleteGameOfGames(),
                                         },
                                         {
                                             text: '取消',
                                             style: 'cancel'
                                         },
                                     ]);
                             }
                         }}>

                        {
                            gameListView==null?
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    <Text>已加载完全部</Text></View>
                                :
                                <View style={{flex:1}}>{gameListView}</View>
                        }

                    {/*loading模态框*/}
                    <Modal animationType={"fade"} transparent={true} visible={this.state.showProgress}>
                        <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                          onPress={()=>{
                                              //TODO:cancel this behaviour

                                          }}>
                            <View style={{width:width*2/3,height:80,backgroundColor:'transparent',position:'relative',
                                justifyContent:'center',alignItems:'center',borderRadius:6}}>
                                <ActivityIndicator
                                    animating={true}
                                    style={{marginTop:10,height: 40,position:'absolute',transform: [{scale: 1.6}]}}
                                    size="large"
                                />
                                <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                    <Text style={{color:'#666',fontSize:13}}>
                                        加载中...
                                    </Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                </Toolbar>
            </View>
        )
    }

    componentWillMount()
    {
        //获取所有比赛列表
        // {'id':33,'teamAName':'开心队','teamBName':'不开心队','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00','endTime':'2018-12-11 10:00',state:0,
        //     'teamAimgList':['https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0'],
        //     'teamBimgList':['https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132'],
        //     'gameClass':1,'isSingle':1,'gameType':1,'teamA':{},'teamB':{},
        //     'matchList':[{'teamA':'开心队','teamB':'不开心队','scoreA':1,'socreB':0,state:1},{'teamA':'开心队','teamB':'不开心队','scoreA':0,'socreB':0,state:0}]}

        // 团体赛gamesId=0单项赛gamesId=this.props.gamesId
        // alert(this.props.gamesId);

        this.fetchGameOfGamesList();
    }

    componentDidMount(){
        this.gameListener=DeviceEventEmitter.addListener('create_game', (data)=>{
            if(data)
            this.fetchGameOfGamesList()
        });
        this.gameListener=DeviceEventEmitter.addListener('on_record_finish', (data)=>{
            if(data)
                this.fetchGameOfGamesList()
        });
    }

    componentWillUnmount()
    {
        if(this.gameListener)
            this.gameListener.remove();
        if(this.recordListener)
            this.recordListener.remove();
    }

    fetchGameOfGamesList(){

        this.props.dispatch(fetchGameOfGamesList(this.props.projectId,this.props.games.id)).then((json) => {
            if (json.re == 1) {
                this.setState({gameList: json.data,showProgress:false});
            }
            else {
                if (json.re = -100) {
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

    compeleteGameOfGames(){
        //完成团体赛中所有单项赛
        //1.将单项赛结果统计到团体赛中并更改状态
        //2.更新teamGroup

        this.props.dispatch(compeleteGameOfGames(this.props.games.id)).then((json) => {
            if (json.re == 1) {
                Alert.alert('成功','比赛状态已更新')
                DeviceEventEmitter.emit('fresh',1)
                this.goBack();
            }
            else {
                if (json.re = -100) {
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    popoverContent: {
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText:{
        color:'#444',
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'transparent'
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionGameList);



