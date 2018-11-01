
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
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import TeamListModal from './TeamListModal'
import {fetchTeamList,fetchGroupList,CompleteMatch,createCompetitonGame} from '../../action/CompetitionActions'

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

            teamList: [],

            //传值
            projectId:this.props.projectId,
            projectName:this.props.projectName,
            projectType:this.props.projectType,
            gamesId:this.props.gamesId,

            team1: {
                winCount: 0,
                groupId: 0,
                teamId: 0,
                gameClass: 0,
                rank: 0,
                id: 0,
                team: '队伍1',
                avatar: '',
                lostCount: 0
            },
            team2: {
                winCount: 0,
                groupId: 0,
                teamId: 0,
                gameClass: 0,
                rank: 0,
                id: 0,
                team: '队伍2',
                avatar: '',
                lostCount: 0
            },

            game: {
                gameClassStr: '小组赛',
                gameClassId: 1,
                groupId: null,
                groupStr: null,
                field: '',
                referee: '',
                viceReferee:'',
                startTime: '',
                endTime: '',
            },

            gameClassButtons: ['取消', '小组赛', '32进16', '16进8', '8进4', '半决赛', '冠亚军决赛'],
            groupButtons: ['取消', 'A组', 'B组', 'C组', 'D组', 'E组', 'F组', 'G组', 'H组'],
        };
    }

    //选赛制
    _handlePress1(index) {

        if(index!==0){
            var gameClassStr = this.state.gameClassButtons[index];
            var gameClassId = index;
            this.setState({game:Object.assign(this.state.game,{gameClassStr:gameClassStr,gameClassId:gameClassId})});

            this.getTeamListByGameClass(gameClassId);
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

        return (
            <View style={styles.container}>

                <Toolbar width={width} title="创建比赛" actions={[]} navigator={this.props.navigator}>

                <ScrollView style={{backgroundColor:'#66CDAA'}}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:1}}>

                        {/*队伍选择UI*/}
                        <View style={{width:width,height:150,padding:6, paddingHorizontal: 12,flexDirection:'row'}}>

                            {/*队伍1*/}
                            <View style={{flex:3,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                                {
                                    this.state.team1.avatar==''?
                                    <View><Image style={{height: 50, width: 50, borderRadius: 25}}
                                                 source={require('../../../img/portrait.jpg')}/></View>
                                        :
                                    <View><Image style={{height: 50, width: 50, borderRadius: 25}}
                                                 source={{uri: this.state.team1.avatar}}/></View>
                                }

                                <TouchableOpacity style={{marginTop:10,borderWidth:1,borderColor:'#fff',width:100,justifyContent:'center',alignItems:'center',padding:3}}
                                onPress={()=>{
                                    this.setState({modalVisible:true,teamChoose:1});
                                }}>
                                    <View><Text style={{fontSize:14,color:'#fff'}}>{this.state.team1.team}</Text></View></TouchableOpacity>

                            </View>

                            <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}/>

                            {/*队伍2*/}
                            <View style={{flex:3,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                                {
                                    this.state.team2.avatar==''?
                                        <View><Image style={{height: 50, width: 50, borderRadius: 25}}
                                                     source={require('../../../img/portrait.jpg')}/></View>
                                        :
                                        <View><Image style={{height: 50, width: 50, borderRadius: 25}}
                                                     source={{uri: this.state.team2.avatar}}/></View>
                                }

                                <TouchableOpacity style={{marginTop:10,borderWidth:1,borderColor:'#fff',width:100,justifyContent:'center',alignItems:'center',padding:3}}
                                                  onPress={()=>{
                                                      this.setState({modalVisible:true,teamChoose:2});
                                                  }}>
                                    <View><Text style={{fontSize:14,color:'#fff'}}>{this.state.team2.team}</Text></View></TouchableOpacity>

                            </View>

                        </View>

                        {/*对局信息UI*/}
                        <View style={{flex:1,padding:6, paddingHorizontal: 20,flexDirection:'column',justifyContent:'center',alignItems:'center',marginTop:20}}>

                            {/*项目*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434',fontSize:14}}>项目</Text>
                                </View>
                                <Text style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.props.projectName}
                                </Text>
                            </View>

                            {/*赛制*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>赛制</Text>
                                </View>
                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff'}}
                                                  onPress={()=>{ this.show('actionSheet1'); }}>
                                    {
                                        this.state.game.gameClassStr==null?
                                            <View style={{flex:1,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#888',fontSize:14}}>请选择赛制 ></Text>
                                            </View> :
                                            <View style={{flex:1,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#444',fontSize:14}}>{this.state.game.gameClassStr}</Text>
                                            </View>

                                    }
                                    <ActionSheet
                                        ref={(p) => {
                                            this.actionSheet1 =p;
                                        }}
                                        title="请选择赛制"
                                        options={this.state.gameClassButtons}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={
                                            (data)=>{ this._handlePress1(data); }
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            {/*组别*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>组别</Text>
                                </View>
                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#red',}}
                                                  onPress={()=>{ this.show('actionSheet2'); }}>
                                    {
                                        this.state.game.groupStr==null?
                                            <View style={{flex:1,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#888',fontSize:14}}>请选择组别 ></Text>
                                            </View> :
                                            <View style={{flex:1,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#444',fontSize:14}}>{this.state.game.groupStr}</Text>
                                            </View>

                                    }
                                    <ActionSheet
                                        ref={(p) => {
                                            this.actionSheet2 =p;
                                        }}
                                        title="请选择组别"
                                        options={this.state.groupButtons}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={
                                            (data)=>{ this._handlePress2(data); }
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

                                    this.props.dispatch(createCompetitonGame(this.state.game,this.state.team1.teamId,this.state.team2.teamId,this.props.projectId,this.props.gamesId)).then((json)=>{
                                        if(json.re==1)
                                        {
                                            Alert.alert('成功','创建成功')
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
                        setTeamList={(team)=>{
                            switch (this.state.teamChoose){
                                case 1:
                                    this.setState({team1:team});
                                    break;
                                case 2:
                                    this.setState({team2:team});
                                    break;
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
        this.props.dispatch(fetchGroupList(this.props.projectId,gameClass)).then((json)=>{
            if(json.re==1)
            {
                this.setState({teamList:json.data});
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


