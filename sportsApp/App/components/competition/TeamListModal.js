/**
 * Created by youli on 25/03/2017.
 */

import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputWrapper from 'react-native-text-input-wrapper';
var {height, width} = Dimensions.get('window');


class GroupMemberModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    setTeamList(team){
        if(this.props.setTeamList!==undefined&&this.props.setTeamList!==null)
        {
            this.props.setTeamList(team);
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
            team:null,
            teamList:this.props.teamList,
            team1List:this.props.team1List,
            team2List:this.props.team2List,
            teamChoose:this.props.teamChoose,
        }
    }

    renderRow(rowData,sectionId,rowId){

        //{id=1, name='陈海云',
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132},

        var row=(
            <TouchableOpacity style={{flex:3,flexDirection:'row',backgroundColor:'#fff',marginBottom:5,padding:5,borderBottomWidth:1,
                borderColor:'#eee',borderRadius:8}}
                              onPress={()=>{
                                  this.setTeamList(rowData);
                                  this.close();
                              }}>
                {
                    rowData.avatar == ''?
                    <View style={{flex:1,}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={require('../../../img/portrait.jpg')}/>
                    </View>
                    :
                <View style={{flex:1,}}>
                    <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={{uri:rowData.avatar}}/>
                    </View>
                }
                <View style={{flex:3,margin:10,justifyContent:'center',alignItems: 'center',}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{marginLeft:10,color:'#343434'}}>{rowData.name}</Text>
                    </View>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems: 'center',margin:10,borderWidth:1,borderColor:'#66CDAA',borderRadius:5}}>
                    <Text style={{color:'#66CDAA',fontSize:12,}}>{rowData.no}号</Text>
                </View>

            </TouchableOpacity>
        );

        return row;

    }

    render(){

        var team1ListView = null;
        var team1List = this.props.team1List;

        var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (team1List !== undefined && team1List !== null && team1List.length > 0) {
            team1ListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds1.cloneWithRows(team1List)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        var team2ListView = null;
        var team2List = this.props.team2List;

        var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (team2List !== undefined && team2List !== null && team2List.length > 0) {
            team2ListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds1.cloneWithRows(team2List)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <View>
                    <View style={{
                        height: height * 0.6,
                        width: width * 0.8,
                        padding: 5,
                        margin: width * 0.1,
                        marginTop: 100,
                        borderColor: '#eee',
                        borderWidth: 1,
                        backgroundColor: '#fff'
                    }}>
                        {
                            this.props.teamChoose==1?
                            <View style={{
                                flex: 6,
                                flexDirection: 'row',
                                backgroundColor: '#fff',
                                marginBottom: 5,
                                padding: 5,
                                borderBottomWidth: 1,
                                borderColor: '#eee',
                                borderRadius: 8
                            }}>
                                {team1ListView}
                            </View>:
                                <View style={{
                                    flex: 6,
                                    flexDirection: 'row',
                                    backgroundColor: '#fff',
                                    marginBottom: 5,
                                    padding: 5,
                                    borderBottomWidth: 1,
                                    borderColor: '#eee',
                                    borderRadius: 8
                                }}>
                                    {team2ListView}
                                </View>
                        }
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                padding: 2,
                                margin: 5,
                                marginHorizontal:40,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#66CDAA',
                                borderRadius: 6
                            }}
                                              onPress={() => {
                                                  this.close();
                                              }}>
                                <Text style={{color: '#fff', padding: 5}}>取消</Text>
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


module.exports = GroupMemberModal;

