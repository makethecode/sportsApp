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
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper';

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
            game:[
                {'id':5,'teamA':'陈海云','teamB':'邓养吾','scoreA':10,'scoreB':0,'startTime':'2018-11-11 08:00:00','endTime':'2018-11-11 10:00:00',state:1,
                'teamAimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
                'teamBimg':'https://wx.qlogo.cn/mmopen/vi_32/OpqHHsgWiaSQWXiaQExFffsLqTnZWCU2BnfJsYzO59DaFoBaicEYbaCnZdThAj2xf32ZMqYsq0oHZsaWAGoPuZz5A/132',
                'gameClass':1},
                {'id':33,'teamA':'陈海云','teamB':'李学庆','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00:00','endTime':'2018-12-11 10:00:00',state:0,
                 'teamAimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
                 'teamBimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132',
                 'gameClass':1}
            ],

        };
    }

    renderRow(rowData,sectionId,rowId){

        // {'id':33,'teamA':'陈海云','teamB':'李学庆','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00:00','endTime':'2018-12-11 10:00:00',state:0,
        //     'teamAimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //     'teamBimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132',
        //     'gameClass':1}

        var startTime = rowData.startTime.substring(0,19)
        var gameClass = '';
        switch (rowData.gameClass){
            case 1:gameClass='小组赛';break;
            case 2:gameClass='32进16';break;
            case 3:gameClass='16进8';break;
            case 4:gameClass='8进4';break;
            case 5:gameClass='半决赛';break;
            case 6:gameClass='冠亚军决赛';break;
            case 7:gameClass='34名决赛';break;
            case 8:gameClass='56名决赛';break;
            case 9:gameClass='78名决赛';break;
        }

        return (
            <View style={{backgroundColor:'#fff',marginTop:4}}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:1}}>

                    <View style={{width:width,height:100,padding:6, paddingHorizontal: 12,flexDirection:'row'}}>

                        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <View><Image style={{height:45,width:45,borderRadius:23}}  source={{uri:rowData.teamAimg}}/></View>
                        <Text style={{marginTop:3,fontSize:12,color:'#666'}}>{rowData.teamA}</Text>
                    </View>

                    {
                        rowData.state=1?
                        <View style={{flex: 2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <Text style={{fontSize:13,flex:1,color:'#333'}}>{gameClass}</Text>
                            <Text style={{fontSize:12,flex:1,color:'#333'}}>{startTime}</Text>
                            <Text style={{fontSize:20,flex:3}}>{rowData.scoreA} - {rowData.scoreB}</Text>
                        </View>
                            :
                            <View style={{flex:2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                <Text style={{fontSize:12,flex:1,color:'#333'}}>{gameClass}</Text>
                                <Text style={{fontSize:12,flex:1,color:'#333'}}>{startTime}</Text>
                                <Text style={{fontSize:20,flex:3}}>未开始</Text>
                            </View>
                    }

                    <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <View><Image style={{height:45,width:45,borderRadius:23}}  source={{uri:rowData.teamBimg}}/></View>
                        <Text style={{marginTop:5,fontSize:12,color:'#666'}}>{rowData.teamB}</Text>
                    </View>

                    </View>
                </View>

                <View style={{height:0.8,width:width,backgroundColor:'#aaa'}}></View>

            </View>
        )

    }

    render()
    {
    //{'id':5,'teamA':'陈海云','teamB':'邓养吾','scoreA':10,'scoreB':0,'startTime':'2018-11-11 08:00:00','endTime':'2018-11-11 10:00:00',state:1},

        var gameListView=null;
        var gameList = this.state.game;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (gameList !== undefined && gameList !== null && gameList.length > 0)
        {
            gameListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(gameList)}
                    renderRow={this.renderRow.bind(this)}
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
                    {<View style={{flex:5,backgroundColor:'#eee'}}>
                            <ScrollView>
                                {gameListView}
                                {
                                    gameListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>
                    </View>}
                </Toolbar>

            </View>
        )
    }

    componentWillMount()
    {}

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



