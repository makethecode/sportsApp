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
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper';
import ActionSheet from 'react-native-actionsheet';
import CompetitionGameModal from './CompetitonGameModal'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchGamesList
} from '../../action/CompetitionActions';

var { height, width } = Dimensions.get('window');

class CompetitionGameList extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            games:[],
            gameClassButtons:['取消','小组赛','32进16','16进8','8进4','半决赛','冠亚军决赛','34名决赛','56名决赛','78名决赛'],
            gameClassStr:null,gameClassIdx:null,
            modalVisible:false,
            game:[],
            teamA:null,
            teamB:null,
        };
    }

    //选类型
    _handlePress(index) {
        if(index!==0){
            var gameClassStr = this.state.gameClassButtons[index];
            var gameClassIdx = index;
            this.setState({gameClassStr:gameClassStr,gameClassIdx:gameClassIdx});
            //对game进行筛选
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    renderGamesRow(rowData,sectionId,rowId){

        // {'id':33,'teamA':'陈海云','teamB':'李学庆','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00','endTime':'2018-12-11 10:00',state:0,
        //     'teamAimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //     'teamBimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132',
        //     'gameClass':1,
        //     'gameList':[{'personA':'陈海云、邓养吾','personB':'邹鹏、小吴','scoreA':1,'socreB':0,state:1},{'personA':'陈海云、邓养吾','personB':'邹鹏、小吴','scoreA':0,'socreB':0,state:0}]}

        var gameClass = '';
        switch (rowData.gameClass){
            case '1':gameClass='小组赛';break;
            case '2':gameClass='32进16';break;
            case '3':gameClass='16进8';break;
            case '4':gameClass='8进4';break;
            case '5':gameClass='半决赛';break;
            case '6':gameClass='冠亚军决赛';break;
            case '7':gameClass='34名决赛';break;
            case '8':gameClass='56名决赛';break;
            case '9':gameClass='78名决赛';break;
        }

        return (
            <TouchableOpacity style={{backgroundColor:'#fff',marginTop:4}}
                              onPress={()=>{
                                  this.setState({game:rowData.gameList,teamA:rowData.teamA,teamB:rowData.teamB,modalVisible:true});
                              }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:1}}>

                    <View style={{width:width,height:100,padding:6, paddingHorizontal: 12,flexDirection:'row'}}>

                        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            {
                                rowData.teamAimg!=null && rowData.teamAimg!=''?
                                <View><Image style={{height: 45, width: 45, borderRadius: 23}}
                                             source={{uri: rowData.teamAimg}}/></View>:
                                    <View><Image style={{height: 45, width: 45, borderRadius: 23}}
                                                 source={require('../../../img/portrait.jpg')}/></View>
                            }
                        <Text style={{marginTop:8,fontSize:12,color:'#666'}}>{rowData.teamA}</Text>
                    </View>

                    {
                        rowData.state == '1'?
                        <View style={{flex: 2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <Text style={{fontSize:13,flex:1,color:'#333'}}>{gameClass}</Text>
                            <Text style={{fontSize:12,flex:1,color:'#333'}}>{rowData.startTime}</Text>
                            <Text style={{fontSize:20,flex:3}}>{rowData.scoreA} - {rowData.scoreB}</Text>
                        </View>
                            :
                            <View style={{flex:2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                <Text style={{fontSize:12,flex:1,color:'#333'}}>{gameClass}</Text>
                                <Text style={{fontSize:12,flex:1,color:'#333'}}>{rowData.startTime}</Text>
                                <Text style={{fontSize:20,flex:3}}>未开始</Text>
                            </View>
                    }

                    <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        {
                            rowData.teamBimg!=null && rowData.teamBimg!=''?
                                <View><Image style={{height: 45, width: 45, borderRadius: 23}}
                                             source={{uri: rowData.teamBimg}}/></View>:
                                <View><Image style={{height: 45, width: 45, borderRadius: 23}}
                                             source={require('../../../img/portrait.jpg')}/></View>
                        }
                        <Text style={{marginTop:8,fontSize:12,color:'#666'}}>{rowData.teamB}</Text>
                    </View>

                    </View>
                </View>
                <View style={{width:width,height:0.8,backgroundColor:'#aaa'}}/>
            </TouchableOpacity>
        )

    }

    render()
    {
        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        var gamesListView=null;
        var gamesList = this.state.games;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (gamesList !== undefined && gamesList !== null && gamesList.length > 0)
        {
            gamesListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(gamesList)}
                    renderRow={this.renderGamesRow.bind(this)}
                />
            );
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="比赛场次" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 //添加比赛
                             }
                         }}>
                    <View style={{width:width,height:40,backgroundColor:'#fff'}}>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet'); }}>
                            {
                                this.state.gameClassStr==null?
                                    <View style={{flex:1,justifyContent:'center',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>选择赛制</Text>
                                    </View> :
                                    <View style={{flex:1,justifyContent:'center',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.gameClassStr}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet =p;
                                }}
                                title="请选择赛制"
                                options={this.state.gameClassButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {<View style={{flex:5,backgroundColor:'#eee'}}>
                            <ScrollView>
                                {gamesListView}
                                {
                                    gamesListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>
                    </View>}
                    {/* Add CompetitionGame Modal*/}
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalVisible}
                    >
                        <CompetitionGameModal
                            onClose={()=>{
                                this.setState({modalVisible:false});
                            }}
                            gameList={this.state.game}
                            teamA={this.state.teamA}
                            teamB={this.state.teamB}
                        />
                    </Modal>
                </Toolbar>
            </View>
        )
    }

    componentWillMount()
    {
        //获取所有比赛列表
        // {'id':33,'teamA':'陈海云','teamB':'李学庆','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00','endTime':'2018-12-11 10:00',state:0,
        //     'teamAimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //     'teamBimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132',
        //     'gameClass':1,
        //     'gameList':[{'personA':'陈海云、邓养吾','personB':'邹鹏、小吴','scoreA':1,'socreB':0,state:1},{'personA':'陈海云、邓养吾','personB':'邹鹏、小吴','scoreA':0,'socreB':0,state:0}]}

        this.props.dispatch(fetchGamesList(this.props.projectId)).then((json)=>{
            if(json.re==1)
            {
                this.setState({games:json.data});
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

    container: {
        flex: 1,
    },

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionGameList);



