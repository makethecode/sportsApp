import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    ToastAndroid,
    Modal,
    ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import {getAccessToken,} from '../../action/UserActions';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddNews from './AddNews'
import {fetchNewsInfo,updateNewsInfo} from '../../action/NewsActions'
import config from '../../../config'
import { IndicatorViewPager,PagerTitleIndicator } from 'rn-viewpager'

var {height, width} = Dimensions.get('window');

class NewsList extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
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

        this.props.dispatch(fetchNewsInfo());
    }

    //课程定制
    navigate2AddNews()
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'AddNews',
                component: AddNews,
                params: {
                }
            })
        }
    }

    renderRow(rowData,sectionId,rowId){

        //{title,createTime,img,newsType,readCount,id,newsNum}

        var imgUrl = rowData.img.substring(27,rowData.img.length);
        var img = config.server + imgUrl;

        return (
            <TouchableOpacity style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',padding:5,backgroundColor:'#fff'}}
                              onPress={()=>{
                                  //Linking.openURL("http://114.215.99.2:8880/news/"+rowData.newsNum+"/index.html").catch(err => console.error('An error occurred', err));
                              }}>
                <View style={{
                    flexDirection: 'column',
                    width: 100,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image resizeMode="stretch" style={{width: 100, height: 75}}
                           source={{uri: img}}
                    />
                </View>
                <View style={{flex:1,flexDirection:'column',alignItems:'flex-start'}}>
                    <View style={{padding:4,paddingHorizontal:12}}>
                        <Text style={{color:'#666',fontSize:16}}>
                            {rowData.title}
                        </Text>
                    </View>

                    <View style={{paddingTop:12,paddingBottom:4,flexDirection:'row',alignItems:'center'}}>

                        <View style={{padding:4,paddingHorizontal:12,}}>
                            <Text style={{color:'#888',fontSize:11}}>
                                {rowData.createTime}
                            </Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            bgColor: new Animated.Value(0),

            //所有新闻
            news:null,
            //一般新闻
            simpleNews:[],
            //比赛新闻
            competitionNews:[],
        }

    }

    render() {

        var simpleNewsList=null
        if(this.state.simpleNews&&this.state.simpleNews.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            simpleNewsList=(
                <ScrollView
                    ref={(scrollView) => { _scrollView = scrollView; }}
                    style={{marginTop:3}}
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
                    onScrollEndDrag={(event)=>{
                        var offsetY=event.nativeEvent.contentOffset.y
                        var limitY=event.nativeEvent.layoutMeasurement.height
                    }}
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(this.state.simpleNews)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>
            );
        }

        var competitionNewsList=null
        if(this.state.competitionNews&&this.state.competitionNews.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            competitionNewsList=(
                <ScrollView
                    ref={(scrollView) => { _scrollView = scrollView; }}
                    style={{marginTop:3}}
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
                    onScrollEndDrag={(event)=>{
                        var offsetY=event.nativeEvent.contentOffset.y
                        var limitY=event.nativeEvent.layoutMeasurement.height
                    }}
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(this.state.competitionNews)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>
            );
        }

        return (
            <View style={{flex:1}}>
                <Toolbar width={width} title="新闻发布" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                this.navigate2AddNews()
                                }
                         }}>
                    {/*内容区*/}
                    <View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingBottom:5,}}>
                            <IndicatorViewPager
                                style={{flex:1,flexDirection: 'column-reverse'}}
                                indicator={this._renderTitleIndicator()}
                                onPageScroll={this._onPageScroll.bind(this)}
                            >
                                {simpleNewsList}
                                {competitionNewsList}
                            </IndicatorViewPager>
                        </Animated.View>
                    </View>

                </Toolbar>
            </View>
        );
    }

    _renderTitleIndicator () {
        return (
            <PagerTitleIndicator
                style={styles.indicatorContainer}
                trackScroll={true}
                itemTextStyle={styles.indicatorText}
                itemStyle={{width:width/2}}
                selectedItemStyle={{width:width/2}}
                selectedItemTextStyle={styles.indicatorSelectedText}
                selectedBorderStyle={styles.selectedBorderStyle}
                titles={['一般新闻', '比赛新闻']}
            />
        )
    }

    _onPageScroll (scrollData) {
        let {offset, position} = scrollData
        if (position < 0 || position > 1) return
    }


    componentWillUnmount(){
    }

    componentDidMount(){

        this.props.dispatch(fetchNewsInfo()).then((json)=>{
            if(json.re==1)
            {
                var news = json.data;
                var simpleNews = [];
                var competitionNews = [];
                this.setState({news:news});
                for(var i=0;i<news.length;i++){
                    if(news[i].newsType=='1'){
                        //一般新闻
                        simpleNews.push(news[i]);
                    }
                    if(news[i].newsType=='2'){
                        //比赛新闻
                        competitionNews.push(news[i]);
                    }
                }

                this.setState({simpleNews:simpleNews,competitionNews:competitionNews})

            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })

    }

}

var styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'transparent',
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
)(NewsList);



