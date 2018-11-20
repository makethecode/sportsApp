
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
    BackAndroid,
    Modal,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import TeamListModal from './TeamListModal'
import {fetchTeamList,fetchGroupList,CompleteMatch,createCompetitonGame,fetchTeamATeamBInfo,createCompetitonGameOfGames} from '../../action/CompetitionActions'

var {height, width} = Dimensions.get('window');

class CreateCompetitionGame extends Component{
    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {

            modalVisible: false,
            teamChoose: 0,
            personChoose:0,

            teamList: {},
            team1List: [],
            team2List: [],
            teamAName:this.props.games.teamAName,
            teamBName:this.props.games.teamBName,

            //传值
            projectId:this.props.projectId,
            projectName:this.props.projectName,
            projectType:this.props.projectType,
            games:this.props.games,

             member1: {
                 personAId: 0,
                 personBId: 0,
                 personAName: '成员1',
                 personBName: '成员2',
                 personAAvatar:'',
                 personBAvatar:'',
                 teamId: 1
            },

            member2: {
                personAId: 0,
                personBId: 0,
                personAName: '成员1',
                personBName: '成员2',
                personAAvatar:'',
                personBAvatar:'',
                teamId: 1
            },

            game: {
                gameClass: this.props.games.gameClass,
                gameType:null,
                field: '',
                referee: '',
                viceReferee:'',
                startTime: '',
                endTime: '',
            },

            gameTypeButtons: ['取消', '男单', '女单', '男双', '女双', '混双'],
        };
    }

    //选类别
    _handlePress1(index) {

        if(index!==0){
            var gameType = index;
            this.setState({game:Object.assign(this.state.game,{gameType:gameType})});

        }
    }

    //选组别
    _handlePress2(index) {

        if(index!==0){
            var groupStr = this.state.groupButtons[index];
            var groupId = index;
            this.setState({game:Object.assign(this.state.game,{groupId:groupId,groupStr:groupStr})});
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    render(){

        //team[{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}]

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        var isSingle = 1;

        var gameClass = '';
        switch (this.props.games.gameClass){
            case '1':gameClass='小组赛';break;
            case '2':gameClass='32进16';break;
            case '3':gameClass='16进8';break;
            case '4':gameClass='8进4';break;
            case '5':gameClass='半决赛';break;
            case '6':gameClass='冠亚军决赛';break;
        }

        var gameType = '';
        switch (this.state.game.gameType){
            case 1:gameType='男单';isSingle=1;break;
            case 2:gameType='女单';isSingle=1;break;
            case 3:gameType='男双';isSingle=0;break;
            case 4:gameType='女双';isSingle=0;break;
            case 5:gameType='混双';isSingle=0;break;
        }

        return (
            <View style={styles.container}>

                <Toolbar width={width} title="创建比赛" actions={[]} navigator={this.props.navigator}>

                <ScrollView style={{backgroundColor:'#66CDAA'}}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:1}}>

                        {/*队伍选择UI*/}
                        <View style={{width:width,height:200,padding:6, paddingHorizontal: 12,flexDirection:'row'}}>

                            {/*队伍1*/}
                            {
                                isSingle==1?
                            <View style={{flex:3,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                                {this.state.member1.personAAvatar==''?
                                <View><Image style={{height: 50, width: 50, borderRadius: 25}}
                                             source={require('../../../img/portrait.jpg')}/></View>:
                                    <View><Image style={{height: 50, width: 50, borderRadius: 25}}
                                                 source={{uri: this.state.member1.personAAvatar}}/></View>
                                }
                                <TouchableOpacity style={{marginTop:10,borderWidth:1,borderColor:'#fff',width:100,justifyContent:'center',alignItems:'center',padding:3}}
                                onPress={()=>{
                                    this.setState({modalVisible:true,teamChoose:1});
                                }}>
                                    <View><Text style={{fontSize:14,color:'#fff'}}>{this.state.member1.personAName}</Text></View></TouchableOpacity>

                                <View style={{marginTop:3,width:100,justifyContent:'center',alignItems:'center',padding:3}}>
                                    <View><Text style={{fontSize:12,color:'#fff'}}>{this.props.games.teamA}</Text></View></View>

                            </View>
                                    :
                                    <View style={{flex:3,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                                        <View style={{flexDirection:'row'}}>
                                            {this.state.member1.personAAvatar==''?
                                            <Image style={{height: 35, width: 35, borderRadius: 17}}
                                                   source={require('../../../img/portrait.jpg')}/>:
                                                <Image style={{height: 35, width: 35, borderRadius: 17}}
                                                       source={{uri: this.state.member1.personAAvatar}}/>
                                            }
                                            {this.state.member1.personBAvatar==''?
                                                <Image style={{height: 35, width: 35, borderRadius: 17,marginLeft:5}}
                                                       source={require('../../../img/portrait.jpg')}/>:
                                                <Image style={{height: 35, width: 35, borderRadius: 17,marginLeft:5}}
                                                       source={{uri: this.state.member1.personBAvatar}}/>
                                            }
                                        </View>

                                        <TouchableOpacity style={{marginTop:10,borderWidth:1,borderColor:'#fff',width:100,justifyContent:'center',alignItems:'center',padding:3}}
                                                          onPress={()=>{
                                                              this.setState({modalVisible:true,teamChoose:1,personChoose:1});
                                                          }}>
                                            <View><Text style={{fontSize:13,color:'#fff'}}>{this.state.member1.personAName}</Text></View></TouchableOpacity>

                                        <TouchableOpacity style={{marginTop:3,borderWidth:1,borderColor:'#fff',width:100,justifyContent:'center',alignItems:'center',padding:3}}
                                                          onPress={()=>{
                                                              this.setState({modalVisible:true,teamChoose:1,personChoose:2});
                                                          }}>
                                            <View><Text style={{fontSize:13,color:'#fff'}}>{this.state.member1.personBName}</Text></View></TouchableOpacity>

                                        <View style={{marginTop:5,width:100,justifyContent:'center',alignItems:'center',padding:3}}>
                                            <View><Text style={{fontSize:12,color:'#fff'}}>{this.props.games.teamA}</Text></View></View>

                                    </View>
                            }

                            <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}/>

                            {/*队伍2*/}
                            {
                                isSingle==1?
                                    <View style={{flex:3,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                                        {this.state.member2.personAAvatar==''?
                                            <View><Image style={{height: 50, width: 50, borderRadius: 25}}
                                                         source={require('../../../img/portrait.jpg')}/></View>:
                                            <View><Image style={{height: 50, width: 50, borderRadius: 25}}
                                                         source={{uri: this.state.member2.personAAvatar}}/></View>
                                        }
                                        <TouchableOpacity style={{marginTop:10,borderWidth:1,borderColor:'#fff',width:100,justifyContent:'center',alignItems:'center',padding:3}}
                                                          onPress={()=>{
                                                              this.setState({modalVisible:true,teamChoose:2});
                                                          }}>
                                            <View><Text style={{fontSize:14,color:'#fff'}}>{this.state.member2.personAName}</Text></View></TouchableOpacity>

                                        <View style={{marginTop:3,width:100,justifyContent:'center',alignItems:'center',padding:3}}>
                                            <View><Text style={{fontSize:12,color:'#fff'}}>{this.props.games.teamB}</Text></View></View>

                                    </View>
                                    :
                                    <View style={{flex:3,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                                        <View style={{flexDirection:'row'}}>
                                            {this.state.member2.personAAvatar==''?
                                                <Image style={{height: 35, width: 35, borderRadius: 17}}
                                                       source={require('../../../img/portrait.jpg')}/>:
                                                <Image style={{height: 35, width: 35, borderRadius: 17}}
                                                       source={{uri: this.state.member2.personAAvatar}}/>
                                            }
                                            {this.state.member1.personBAvatar==''?
                                                <Image style={{height: 35, width: 35, borderRadius: 17,marginLeft:5}}
                                                       source={require('../../../img/portrait.jpg')}/>:
                                                <Image style={{height: 35, width: 35, borderRadius: 17,marginLeft:5}}
                                                       source={{uri: this.state.member2.personBAvatar}}/>
                                            }
                                        </View>

                                        <TouchableOpacity style={{marginTop:10,borderWidth:1,borderColor:'#fff',width:100,justifyContent:'center',alignItems:'center',padding:3}}
                                                          onPress={()=>{
                                                              this.setState({modalVisible:true,teamChoose:2,personChoose:1});
                                                          }}>
                                            <View><Text style={{fontSize:13,color:'#fff'}}>{this.state.member2.personAName}</Text></View></TouchableOpacity>

                                        <TouchableOpacity style={{marginTop:3,borderWidth:1,borderColor:'#fff',width:100,justifyContent:'center',alignItems:'center',padding:3}}
                                                          onPress={()=>{
                                                              this.setState({modalVisible:true,teamChoose:2,personChoose:2});
                                                          }}>
                                            <View><Text style={{fontSize:13,color:'#fff'}}>{this.state.member2.personBName}</Text></View></TouchableOpacity>

                                        <View style={{marginTop:5,width:100,justifyContent:'center',alignItems:'center',padding:3}}>
                                            <View><Text style={{fontSize:12,color:'#fff'}}>{this.props.games.teamB}</Text></View></View>

                                    </View>
                            }

                        </View>

                        {/*对局信息UI*/}
                        <View style={{flex:1,padding:6, paddingHorizontal: 20,flexDirection:'column',justifyContent:'center',alignItems:'center',marginTop:20}}>

                            {/*赛制*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434',fontSize:14}}>赛制</Text>
                                </View>
                                <Text style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>
                                    {gameClass}
                                </Text>
                            </View>

                            {/*类别*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>类别</Text>
                                </View>
                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff'}}
                                                  onPress={()=>{ this.show('actionSheet1'); }}>
                                    {
                                        this.state.game.gameType==null?
                                            <View style={{flex:1,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#888',fontSize:14}}>请选择类别 ></Text>
                                            </View> :
                                            <View style={{flex:1,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#444',fontSize:14}}>{gameType}</Text>
                                            </View>

                                    }
                                    <ActionSheet
                                        ref={(p) => {
                                            this.actionSheet1 =p;
                                        }}
                                        title="请选择类别"
                                        options={this.state.gameTypeButtons}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={
                                            (data)=>{ this._handlePress1(data); }
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            {/*场地*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>场地</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                        placeholder="请输入对局场地"
                                        value={this.state.game.field}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({game:Object.assign(this.state.game,{field:value})})
                                            }}
                                    />
                                </View>
                            </View>

                            {/*裁判*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>裁判</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                        placeholder="请输入裁判名称"
                                        value={this.state.game.referee}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({game:Object.assign(this.state.game,{referee:value})})
                                            }}
                                    />
                                </View>
                            </View>

                            {/*裁判*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>副裁判</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                        placeholder="请输入副裁判名称"
                                        value={this.state.game.viceReferee}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({game:Object.assign(this.state.game,{viceReferee:value})})
                                            }}
                                    />
                                </View>
                            </View>

                            {/*开始比赛*/}
                            <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                            <TouchableOpacity style={{
                                height: 40,
                                width: 200,
                                marginTop: 40,
                                backgroundColor: '#fc6254',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                                onPress={() => {

                                    this.props.dispatch(createCompetitonGameOfGames(this.state.game,this.state.member1,this.state.member2,this.props.projectId,this.props.games.id)).then((json)=>{
                                        if(json.re==1)
                                        {
                                            Alert.alert('成功','创建成功')
                                            DeviceEventEmitter.emit('create_game',1)
                                            this.goBack()
                                        }
                                        else {
                                            Alert.alert('失败','创建失败')
                                            if(json.re=-100){
                                                this.props.dispatch(getAccessToken(false))
                                            }
                                        }
                                    })

                                }}>
                                    <Text style={{textAlign: 'center', fontSize: 16, color: '#fff'}}>创建比赛</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        </View>
                </ScrollView>

                {/* Add TeamList Modal*/}
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.");
                    }}
                >
                    <TeamListModal
                        onClose={()=>{
                            this.setState({modalVisible:false});
                        }}
                        teamList={this.state.teamList}
                        team1List={this.state.team1List}
                        team2List={this.state.team2List}
                        teamChoose={this.state.teamChoose}
                        personChoose={this.state.personChoose}
                        setTeamList={(team)=>{

                            var isSingle = 1;

                            switch (this.state.game.gameType){
                                case 1:isSingle=1;break;
                                case 2:isSingle=1;break;
                                case 3:isSingle=0;break;
                                case 4:isSingle=0;break;
                                case 5:isSingle=0;break;
                            }

                            if(isSingle==1) {
                                switch (this.state.teamChoose) {
                                    case 1:
                                        this.setState({
                                            member1: Object.assign(this.state.member1, {
                                                personAId: team.id,
                                                personAName: team.name,
                                                personAAvatar:team.avatar,
                                                teamId: team.teamId
                                            })
                                        });
                                        break;
                                    case 2:
                                        this.setState({
                                            member2: Object.assign(this.state.member2, {
                                                personAId: team.id,
                                                personAName: team.name,
                                                personAAvatar:team.avatar,
                                                teamId: team.teamId
                                            })
                                        });
                                        break;
                                }
                            }else{
                                if(this.state.teamChoose==1 && this.state.personChoose==1){
                                    this.setState({
                                        member1: Object.assign(this.state.member1, {
                                            personAId: team.id,
                                            personAName: team.name,
                                            personAAvatar:team.avatar,
                                            teamId: team.teamId
                                        })
                                    });
                                }
                                if(this.state.teamChoose==1 && this.state.personChoose==2){
                                    this.setState({
                                        member1: Object.assign(this.state.member1, {
                                            personBId: team.id,
                                            personBName: team.name,
                                            personBAvatar:team.avatar,
                                            teamId: team.teamId
                                        })
                                    });
                                }
                                if(this.state.teamChoose==2 && this.state.personChoose==1){
                                    this.setState({
                                        member2: Object.assign(this.state.member2, {
                                            personAId: team.id,
                                            personAName: team.name,
                                            personAAvatar:team.avatar,
                                            teamId: team.teamId
                                        })
                                    });
                                }
                                if(this.state.teamChoose==2 && this.state.personChoose==2){
                                    this.setState({
                                        member2: Object.assign(this.state.member2, {
                                            personBId: team.id,
                                            personBName: team.name,
                                            personBAvatar:team.avatar,
                                            teamId: team.teamId
                                        })
                                    });
                                }
                            }
                        }}
                    />
                </Modal>

                </Toolbar>
            </View>
        )
    }

    componentWillMount(){
        this.getTeamListByGameClass(1)
    }

    getTeamListByGameClass(gameClass){

           //teamList={
           //{'teamA':
           //[{id=1, name='陈海云',
           // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132},
           //{id=2, name='邓养吾',
           // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132},]},
           //{'teamB':
           //[{id=3, name='邹鹏',
           // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132},]
           //}

        this.props.dispatch(fetchTeamATeamBInfo(this.props.projectId,this.props.games.id,this.props.games.gameClass)).then((json)=>{
            if(json.re==1)
            {
                var teamList = json.data;
                var team1List = teamList.teamA;
                var team2List = teamList.teamB;
                this.setState({teamList:teamList,team1List:team1List,team2List:team2List});
            }
            else {
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false))
                }
                if(json.re==-1){
                    Alert.alert('失败','无法生成比赛，请先分组！')
                    this.goBack()
                }
            }
        })
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
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
    }
});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo
    const props = {
    }
    return props
}

export default connect(mapStateToProps)(CreateCompetitionGame);


