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
    InteractionManager
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import {
    fetchMaintainedVenue,
    fetchVenueCourseProfitByUnitId,
    fetchVenueEventProfitByUnitId,
} from '../../action/MapActions';
import {
    makeTabsHidden,
    makeTabsShown
} from '../../action/TabActions';

import {
    getAccessToken
}from '../../action/UserActions';
import MyVenueProfitDetail from '../../components/my/MyVenueProfitDetail';

class MyVenueProfit extends Component {

    navigate2MyVenueProfitDetail(rowData){
        this.props.dispatch(makeTabsShown());
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MyVenueProfitDetail',
                component: MyVenueProfitDetail,
                params: {
                    MyVenueProfitDetail:rowData
                }
            })
        }
    }

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    _onRefresh() {
        this.setState({ isRefreshing: true, fadeAnim: new Animated.Value(0) });
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
        }.bind(this), 2000);
    }

    renderVenue(rowData, sectionId, rowId) {

        var lineStyle = {
            flex: 1, flexDirection: 'row', padding:5, paddingLeft: 0, paddingRight: 0,
            justifyContent: 'flex-start', backgroundColor: 'transparent'
        };

        var row = (
            <TouchableOpacity style={lineStyle} onPress={() => {
                //转入收入详情界面
                this.navigate2MyVenueProfitDetail(rowData);
            }}>

                <View style={{flex:6,flexDirection:'column',borderBottomColor:'#eee',borderBottomWidth:1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 6, paddingTop: 2}}>
                            <Text style={{ fontSize: 14, justifyContent: 'flex-start', fontWeight: 'bold', alignItems: 'flex-start', color: '#222' }}>
                                {rowData.name}
                            </Text>
                    </View>
                </View>

                <View style={{flex:1,alignItems:'center',justifyContent:'center',borderBottomColor:'#eee',borderBottomWidth:1}}>
                    <Icon name={'angle-right'} size={30} color="#66CDAA"/>
                </View>


            </TouchableOpacity>
        );

        return row;
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            venues:[],
            venue:null,
            coursePay:null,
            eventPay:null,
        };
    }

    render()
    {

        var venueList = null;
        var {venues}=this.state;

        if(venues&&venues.length>0)
        {
            var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            venueList = (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(venues)}
                        renderRow={this.renderVenue.bind(this)}
                    />
                </ScrollView>)

        }

        return (
            <View style={styles.container}>

                <Toolbar width={width} title="场馆列表" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                         }}>
                    <View style={{ flex: 1, width: width, backgroundColor: '#66CDAA' }}>

                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff',
                       paddingBottom:10 }}>
                            {venueList}
                        </Animated.View>

                    </View>
                </Toolbar>

            </View>
        )

    }


    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchMaintainedVenue()).then((json)=>{
                if(json.re==1)
                {
                    var venues = json.data;
                    venues.map((venue)=>{
                        venue.checked = false;
                    })
                    this.setState({venues:venues});
                    //this.props.dispatch(makeTabsHidden());
                }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                    }

                }
            })
        });
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
        coaches:state.coach.coaches,
    })
)(MyVenueProfit);


