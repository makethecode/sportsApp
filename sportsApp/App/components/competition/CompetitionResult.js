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
    InteractionManager, Alert
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import MemberInformation from '../course/MemberInformation';
import {
    getAccessToken,
} from '../../action/UserActions';
import { SearchBar } from 'react-native-elements'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchTeamList,fetchTeamPersonList
} from '../../action/CompetitionActions';
import { IndicatorViewPager,PagerTitleIndicator } from 'rn-viewpager'
import GroupResultPage from './ResultPage/GroupResultPage'
import OutResultPage from './ResultPage/OutResultPage'


var { height, width } = Dimensions.get('window');

class CompetitionResult extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
        };
    }

    render()
    {
        return (
            <View style={styles.container}>
                <Toolbar width={width}  title="对阵成绩" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>

                    {<View style={{flex:1,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingBottom:5,}}>
                            <IndicatorViewPager
                                style={{flex:1,flexDirection: 'column-reverse',backgroundColor:'#fff'}}
                                indicator={this._renderTitleIndicator()}
                                onPageScroll={this._onPageScroll.bind(this)}
                            >

                                <GroupResultPage projectId={this.props.projectId} gameClass={1}/>
                                <OutResultPage projectId={this.props.projectId} gameClass={2}/>
                                <OutResultPage projectId={this.props.projectId} gameClass={3}/>
                                <OutResultPage projectId={this.props.projectId} gameClass={4}/>

                            </IndicatorViewPager>
                        </Animated.View>
                    </View>}

                </Toolbar>
            </View>
        )
    }

    _renderTitleIndicator () {
        return (
            <PagerTitleIndicator
                style={styles.indicatorContainer}
                trackScroll={true}
                itemTextStyle={styles.indicatorText}
                itemStyle={{width:width/4}}
                selectedItemStyle={{width:width/4}}
                selectedItemTextStyle={styles.indicatorSelectedText}
                selectedBorderStyle={styles.selectedBorderStyle}
                titles={['小组赛', '8进4', '半决赛','冠亚军决赛']}
            />
        )
    }

    _onPageScroll (scrollData) {
        let {offset, position} = scrollData
        if (position < 0 || position > 5) return
    }

    componentWillMount()
    {
        // this.props.dispatch(fetchTeamPersonList(this.props.teamId)).then((json)=>{
        //     if(json.re==1)
        //     {
        //         this.setState({teamPerson:json.data});
        //     }
        //     else {
        //         if(json.re=-100){
        //             this.props.dispatch(getAccessToken(false))
        //         }
        //     }
        // })
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
    },
    indicatorContainer: {
        backgroundColor: '#66CDAA',
        height: 48
    },
    indicatorText: {
        fontSize: 14,
        color: 0xFFFFFF99
    },
    indicatorSelectedText: {
        fontSize: 14,
        color: 0xFFFFFFFF
    },
    selectedBorderStyle: {
        height: 3,
        backgroundColor: 'white'
    },
    statusBar: {
        height: 24,
        backgroundColor: 0x00000044
    },
    toolbarContainer: {
        height: 56,
        backgroundColor: 0x00000020,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    backImg: {
        width: 16,
        height: 17
    },
    titleTxt: {
        marginLeft: 36,
        color: 'white',
        fontSize: 20
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionResult);



