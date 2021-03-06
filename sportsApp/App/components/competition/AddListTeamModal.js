
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


class AddListTeamModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    setList(team){
        if(this.props.setList!==undefined&&this.props.setList!==null)
        {
            this.props.setList(team);
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
           ListA:this.props.ListA,
           ListB:this.props.ListB,
           ListC:this.props.ListC,
           ListD:this.props.ListD,
           ListE:this.props.ListE,
           ListF:this.props.ListF,
           ListG:this.props.ListG,
           ListH:this.props.ListH,

            teams:this.props.teams,
            chooseListType:this.props.chooseListType,

        }
    }

    renderRow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var row=(
            <View style={{flex:3,flexDirection:'row',backgroundColor:'#fff',marginBottom:5,padding:5,borderBottomWidth:1,
                borderColor:'#eee',borderRadius:8}}>
                {rowData.avatar == ""?
                    < View style={{flex:1,}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={require('../../../img/portrait.jpg')}/>
                    </View>
                    :
                < View style={{flex:1,}}>
                    <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={{uri:rowData.avatar}}/>
                    </View>
                }
                <View style={{flex:3,marginLeft:5}}>
                    <View style={{flexDirection:'row',marginLeft:10}}>
                        <Text style={{marginLeft:10,color:'#343434'}}>{rowData.team}</Text>
                    </View>
                </View>
                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',margin:10,borderWidth:1,borderColor:'#66CDAA',borderRadius:5}}
                                  onPress={()=>{
                                      //加入
                                      this.setList(rowData)
                                  }}>
                    <Text style={{color:'#66CDAA',fontSize:14,}}>添加</Text>
                </TouchableOpacity>

            </View>
        );

        return row;

    }

    render(){

        var teamListView = null;
        var teamList = this.props.teams;

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
            <View>
                    <View style={{
                        height: height * 0.6,
                        width: width * 0.8,
                        margin: width * 0.1,
                        marginTop: 100,
                        borderColor: '#eee',
                        borderWidth: 1,
                        backgroundColor: '#fff'
                    }}>

                        <View style={{flex:0.5,backgroundColor:'#66CDAA',alignItems:'center',textAlign:'center',justifyContent:'center',padding:5}}>
                             <Text style={{color:'#fff',fontSize:15,textAlign:'center'}}>请选择添加的队伍</Text>
                        </View>

                        <View style={{
                            flex: 5,
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            marginBottom: 5,
                            padding: 5,
                            borderBottomWidth: 1,
                            borderColor: '#eee',
                            borderRadius: 8
                        }}>
                            {teamListView}
                        </View>

                        <View style={{
                            flex: 1,
                            padding: 2,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                padding: 2,
                                margin: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#66CDAA',
                                borderRadius: 6
                            }}
                                              onPress={() => {
                                                  this.close();
                                              }}>
                                <Text style={{color: '#fff', padding: 5,fontSize:14}}>取消</Text>
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


module.exports = AddListTeamModal;

