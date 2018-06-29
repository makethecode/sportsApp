/**
 * Created by dingyiming on 2017/8/16.
 */

import React, { Component } from 'react';
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
    InteractionManager
} from 'react-native';

import { connect } from 'react-redux';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
var { height, width } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh
} from '../../action/CompetitionActions';
import {getAccessToken} from '../../action/UserActions';
import CompetitionSignUp from './CompetitionSignUp';
class CompetitionList extends Component {

    goBack() {
        const { navigator } = this.props;
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
        this.props.dispatch(enableCompetitionOnFresh());

    }


    navigateCompetitionSignUp(rowData)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CompetitionSignUp',
                component: CompetitionSignUp,
                params: {
                    rowData:rowData,
                }
            })
        }
    }

    renderRow(rowData,sectionId,rowId){
        var time1=new Date(rowData.startTime);
        var time2=new Date(rowData.endTime);
        var year1=time1.getFullYear();
        var month1=time1.getMonth()+1;
        var day1=time1.getDate();
        var year2=time2.getFullYear();
        var month2=time2.getMonth()+1;
        var day2=time2.getDate();
        var startTime=year1+'-'+month1+'-'+day1;
        var endTime=year2+'-'+month2+'-'+day2;
        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,borderBottomWidth:1,borderBottomColor:'#aaa'}}>
                <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={require('../../../img/portrait.jpg')}/>
                </View>

                    <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center'}}
                                      onPress={()=>{
                                          this.navigateCompetitionSignUp(rowData,'公开活动');
                                      }}>
                        <Text style={{marginRight:5,color:'#66CDAA'}}>报名</Text>
                        <Icon name={'angle-right'} size={25
                        } color="#66CDAA"/>
                    </TouchableOpacity>
                </View>

                <View style={{flex:3,padding:10}}>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                           <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>
                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'比赛简介：'+rowData.breif}
                        </Text>
                    </View>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                            <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>
                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'比赛名称：'+rowData.competitionName}；
                        </Text>
                    </View>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                            <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>
                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'主办方：'+rowData.hostUnit}；
                        </Text>
                    </View>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                       <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                          <Icon name={'circle'} size={10} color="#aaa"/>
                       </View>
                       <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                        {'主办方地点：'+rowData.unitName}；
                       </Text>
                   </View>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                            <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>

                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'开始时间：'+startTime}；
                        </Text>
                    </View>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                            <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>
                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'结束时间：'+endTime}；
                        </Text>
                    </View>

                </View>

            </View>
        );
        return row;
    }

    fetchData(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchGames()).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disableCompetitionOnFresh());
            this.setState({doingFetch:false,isRefreshing:false})
        }).catch((e)=>{
            this.props.dispatch(disableCompetitionOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }


    constructor(props) {
        super(props);
        this.state = {
            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),
            //competitionList:[{name:'男单',host:'山东大学'},{name:'女单',host:'山体'}]

        };
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    render() {
        var competitionListView=null;
        var {competitionList,competitionFresh}=this.props;
        //var competitionList=this.state.competitionList;
        if(competitionFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (competitionList !== undefined && competitionList !== null && competitionList.length > 0)
            {
                competitionListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(competitionList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }


        return (
            <View style={styles.container}>
                <Toolbar width={width} title="比赛列表" actions={[]} navigator={this.props.navigator}>

                    {<View style={{flex:5,backgroundColor:'#eee'}}>
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
                                    />
                                }
                            >
                                {competitionListView}
                                {
                                    competitionListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>

                        </Animated.View>
                    </View>}



                </Toolbar>

            </View>
        )
    }

    componentDidMount()
    {

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: 14
    }
});

const mapStateToProps = (state, ownProps) => {

    const props = {
        userType: state.user.usertype.perTypeCode,
    }
    return props
}


//export default connect(mapStateToProps)(CompetitionList);
module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        competitionList:state.competitions.competitionList,
        competitionFresh:state.competitions.competitionFresh,
    })
)(CompetitionList);
