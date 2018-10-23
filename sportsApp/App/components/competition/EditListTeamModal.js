
import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputWrapper from 'react-native-text-input-wrapper';
var {height, width} = Dimensions.get('window');


class EditListTeamModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    updateList(teamGroup){
        if(this.props.updateList!==undefined&&this.props.updateList!==null)
        {
            this.props.updateList(teamGroup);
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState(nextProps)
    }

    constructor(props)
    {
        super(props);
        this.state={
            chooseTeamGroup:this.props.chooseTeamGroup,
        }
    }

    render(){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        return (
            <View>
                    <View style={{
                        height: 250,
                        width: width * 0.8,
                        margin: width * 0.1,
                        marginTop: 150,
                        borderColor: '#eee',
                        borderWidth: 1,
                        backgroundColor: '#eee',
                        flexDirection:'column',
                    }}>

                        <View style={{height:30,backgroundColor:'#66CDAA',alignItems:'center',textAlign:'center',justifyContent:'center',padding:5}}>
                             <Text style={{color:'#fff',fontSize:15,textAlign:'center'}}>编辑队伍信息</Text>
                        </View>
                        {/*队名*/}
                        <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:10}}>
                            <View style={{flex:1}}>
                                <Text style={{color:'#343434'}}>队伍</Text>
                            </View>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                borderRadius:10}}>
                                <Text
                                    style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:30,flex:3,padding:0}}
                                >{this.state.chooseTeamGroup.team}</Text>
                            </View>
                        </View>
                        {/*得分*/}
                        <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:10}}>
                            <View style={{flex:1}}>
                                <Text style={{color:'#343434'}}>得分</Text>
                            </View>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                borderRadius:10}}>
                                <TextInput
                                    placeholderTextColor='#888'
                                    style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:30,flex:3,padding:0}}
                                    placeholder={this.props.chooseTeamGroup.winCount.toString()}
                                    value={this.state.chooseTeamGroup.winCount}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={
                                        (value)=>{
                                            this.setState({chooseTeamGroup:Object.assign(this.state.chooseTeamGroup,{winCount:value})})
                                        }}
                                />
                            </View>
                        </View>
                        {/*失分*/}
                        <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:10}}>
                            <View style={{flex:1}}>
                                <Text style={{color:'#343434'}}>失分</Text>
                            </View>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                borderRadius:10}}>
                                <TextInput
                                    placeholderTextColor='#888'
                                    style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:30,flex:3,padding:0}}
                                    placeholder={this.props.chooseTeamGroup.lostCount.toString()}
                                    value={this.state.chooseTeamGroup.lostCount}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={
                                        (value)=>{
                                            this.setState({chooseTeamGroup:Object.assign(this.state.chooseTeamGroup,{lostCount:value})})
                                        }}
                                />
                            </View>
                        </View>
                        {/*排名*/}
                        <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:10}}>
                            <View style={{flex:1}}>
                                <Text style={{color:'#343434'}}>排名</Text>
                            </View>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                borderRadius:10}}>
                                <TextInput
                                    placeholderTextColor='#888'
                                    style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:30,flex:3,padding:0}}
                                    placeholder={this.props.chooseTeamGroup.rank.toString()}
                                    value={this.state.chooseTeamGroup.rank}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={
                                        (value)=>{
                                            this.setState({chooseTeamGroup:Object.assign(this.state.chooseTeamGroup,{rank:value})})
                                        }}
                                />
                            </View>
                        </View>

                        <View style={{
                            flex:1,
                            padding: 5,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor:'#fff'
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                padding: 2,
                                marginHorizontal: 40,
                                marginVertical:10,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#fc6254',
                                borderRadius: 6
                            }}
                                              onPress={() => {
                                                  this.updateList(this.state.chooseTeamGroup)
                                                  this.close();
                                              }}>
                                <Text style={{color: '#fff', padding: 5,fontSize:14}}>保存</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderTopColor:'#fff'
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = EditListTeamModal;

