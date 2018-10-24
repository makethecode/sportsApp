
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
    BackAndroid
} from 'react-native';
import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';

import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
var {height, width} = Dimensions.get('window');

class CompetitionRule extends Component{
    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing:false,

        };
    }

    render(){

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="比赛规则" actions={[]} navigator={this.props.navigator}>
<ScrollView>
                    <View style={{flex:3,flexDirection:'column',justifyContent:'center',alignItems: 'flex-start',padding:10}}>
                        <Image resizeMode="stretch" style={{height:width,width:width}} source={require('../../../img/rule.png')}/>
                        <Text style={{fontSize:14,color:'#444',marginTop:10}}>
                            1.若参赛队伍>32，则分为8组进行小组赛，每组取前两名进行16进8淘汰赛->8进4淘汰赛->半决赛->冠亚军决赛
                        </Text>
                        <Text style={{fontSize:14,color:'#444',marginTop:10}}>
                            2.若32>参赛队伍>16，则分为4组进行小组赛，每组取前两名进行8进4淘汰赛->半决赛->冠亚军决赛
                        </Text>
                        <Text style={{fontSize:14,color:'#444',marginTop:10}}>
                            3.若16>参赛队伍>8，则分为2组进行小组赛，每组取前两名进行半决赛->冠亚军决赛
                        </Text>
                        <Text style={{fontSize:14,color:'#444',marginTop:10}}>
                            4.若4>参赛队伍，则直接进行小组赛并进行排名
                        </Text>
                    </View>
</ScrollView>
                </Toolbar>
            </View>
        )
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

export default connect(mapStateToProps)(CompetitionRule);


