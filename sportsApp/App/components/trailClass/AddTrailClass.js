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
    Alert,
    Platform,
} from 'react-native';
import {connect} from 'react-redux';
import DatePicker from 'react-native-datepicker';
import DateFilter from '../../utils/DateFilter';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import TextInputWrapper from 'react-native-text-input-wrapper';
import ActionSheet from 'react-native-actionsheet';
import{getAccessToken
} from '../../action/UserActions';
import {ButtonGroup} from 'react-native-elements';
import { IndicatorViewPager,PagerTitleIndicator } from 'rn-viewpager';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

var {height, width} = Dimensions.get('window');

class AddTrailClass extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

   getDate(tm){
       var tt=new Date(parseInt(tm)*1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
       return tt;
    }

    constructor() {
        super();
        this.state={

            classWeekButtons:[],

            //试课列表
            trailClassList:[
                {
                    name:'培训课',
                    content:'加强学生羽毛球水平',
                    unitId:'',
                    unitName:'山东省奥体中心羽毛球馆',
                    time:'',
                    timeStr:'10-10 8:00-10:00 周四',
                    week:4,
                    coachId:0,
                    coachName:'邹鹏教练',
                    isSign:1,
                },
                {
                    name:'周末课',
                    content:'提高实力，为比赛准备',
                    unitId:'',
                    unitName:'山东省奥体中心羽毛球馆',
                    time:'',
                    timeStr:'11-11 14:00-17:00 周一',
                    week:1,
                    coachId:0,
                    coachName:'小吴教练',
                    isSign:0,
                },
            ],

            ClassList1:[],
            ClassList2:[],
            ClassList3:[],
            ClassList4:[],
            ClassList5:[],
            ClassList6:[],
            ClassList7:[],

            fadeAnim: new Animated.Value(1),
            bgColor: new Animated.Value(0),
        }
    }

    renderRow(rowData,sectionId,rowId){
        var row=(
            <View style={{flexDirection:'column',marginTop:4,backgroundColor:'#fff'}}>

                <View style={{ paddingVertical:5,flexDirection:'row',marginTop:3}}>
                    <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                        <Text style={{ color: '#222', fontSize: 18}}>{rowData.name}</Text>
                    </View>

                    <View style={{flex:3,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginRight:10}}>
                        <Ionicons name='md-person' size={10} color="#fc3c3f"/>
                        <Text style={{ color: '#666', fontSize: 13,marginLeft:3}}>{rowData.coachName}</Text>
                    </View>
                </View>

                <View style={{flex:3,padding:5,flexDirection:'column'}}>

                    {/*内容*/}
                    <View style={{flex:4,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>内容</Text>
                        </View>
                        <View style={{flex:4,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.content}</Text>
                        </View>
                        <View style={{flex: 2}}/>
                    </View>

                    {/*时间*/}
                    <View style={{flex:4,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>场地</Text>
                        </View>
                        <View style={{flex:4,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.unitName}</Text>
                        </View>
                        <View style={{flex: 2}}/>
                    </View>

                    {/*时间*/}
                    <View style={{flex:4,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>时间</Text>
                        </View>
                        <View style={{flex:4,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.timeStr}</Text>
                        </View>
                    {
                        rowData.isSign==0?
                            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: '#666', margin: 5, marginHorizontal:5
                            }}>
                            <Text style={{color: '#666', justifyContent: 'center', alignItems: 'center', fontSize: 13,padding:5}}>已取消报名</Text></View>
                            :
                            <TouchableOpacity
                                style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: '#fc3c3f', margin: 5, marginHorizontal:5}}
                                onPress={()=>{
                                }
                                }>
                            <Text style={{color: '#fc3c3f', justifyContent: 'center', alignItems: 'center', fontSize: 13,padding:5}}>取消报名</Text></TouchableOpacity>
                    }
                    </View>

                </View>

                <View style={{height:0.8,width:width,backgroundColor:'#c2c2c2'}}></View>

            </View>
        );
        return row;
    }

    render(){

        //第一天
        var ClassList1View=null;
        var ClassList1 = this.state.ClassList1;

        var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ClassList1 !== undefined && ClassList1 !== null && ClassList1.length > 0)
        {
            ClassList1View = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds1.cloneWithRows(ClassList1)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }else{
            ClassList1View = (
            <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
            </View>)
        }

        //第二天
        var ClassList2View=null;
        var ClassList2 = this.state.ClassList2;

        var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ClassList2 !== undefined && ClassList2 !== null && ClassList2.length > 0)
        {
            ClassList2View = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds2.cloneWithRows(ClassList2)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }else{
            ClassList2View = (
                <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                    <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                </View>)
        }

        //第三天
        var ClassList3View=null;
        var ClassList3 = this.state.ClassList3;

        var ds3 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ClassList3 !== undefined && ClassList3 !== null && ClassList3.length > 0)
        {
            ClassList3View = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds3.cloneWithRows(ClassList3)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }else{
            ClassList3View = (
                <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                    <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                </View>)
        }

        //第四天
        var ClassList4View=null;
        var ClassList4 = this.state.ClassList4;

        var ds4 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ClassList4 !== undefined && ClassList4 !== null && ClassList4.length > 0)
        {
            ClassList4View = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds4.cloneWithRows(ClassList4)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }else{
            ClassList4View = (
                <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                    <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                </View>)
        }

        //第五天
        var ClassList5View=null;
        var ClassList5 = this.state.ClassList5;

        var ds5 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ClassList5 !== undefined && ClassList5 !== null && ClassList5.length > 0)
        {
            ClassList5View = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds5.cloneWithRows(ClassList5)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }else{
            ClassList5View = (
                <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                    <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                </View>)
        }

        //第六天
        var ClassList6View=null;
        var ClassList6 = this.state.ClassList6;

        var ds6 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ClassList6 !== undefined && ClassList6 !== null && ClassList6.length > 0)
        {
            ClassList6View = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds6.cloneWithRows(ClassList6)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }else{
            ClassList6View = (
                <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                    <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                </View>)
        }

        //第七天
        var ClassList7View=null;
        var ClassList7 = this.state.ClassList7;

        var ds7 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ClassList7 !== undefined && ClassList7 !== null && ClassList7.length > 0)
        {
            ClassList7View = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds7.cloneWithRows(ClassList7)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }else{
            ClassList7View = (
                <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                    <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                </View>)
        }

        return (
            <View style={{flex:1}}>
                <Toolbar width={width}  title="添加试课" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>
                    {/*内容区*/}
                    <View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingBottom:5,}}>
                            <IndicatorViewPager
                                style={{flex:1,flexDirection: 'column-reverse'}}
                                indicator={this._renderTitleIndicator()}
                                onPageScroll={this._onPageScroll.bind(this)}
                            >
                                {ClassList1View}
                                {ClassList2View}
                                {ClassList3View}
                                {ClassList4View}
                                {ClassList5View}
                                {ClassList6View}
                                {ClassList7View}
                            </IndicatorViewPager>
                        </Animated.View>
                    </View>

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
                itemStyle={{width:width/3}}
                selectedItemStyle={{width:width/3}}
                selectedItemTextStyle={styles.indicatorSelectedText}
                selectedBorderStyle={styles.selectedBorderStyle}
                titles={this.state.classWeekButtons}
            />
        )
    }

    _onPageScroll (scrollData) {
        let {offset, position} = scrollData
        if (position < 0 || position > 1) return
    }

    componentDidMount()
    {
        var classWeekButtons = this.state.classWeekButtons;
        var days = [];

        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();//月份，一月--十二月返回0-11
        var date = today.getDate();//月份中的一天1-31
        var dayNum = today.getDay();//周日-周六返回0-6
        var day = null;

        for (let i=0; i<7; i++)
        {
            switch(dayNum%7){
                case 0:day= '星期天';break;
                case 1:day= '星期一';break;
                case 2:day= '星期二';break;
                case 3:day= '星期三';break;
                case 4:day= '星期四';break;
                case 5:day= '星期五';break;
                case 6:day= '星期六';break;
            }

            days.push(dayNum%7)//days存储星期几,days的序号i-1表示第i个列表

            let string = day+' '+(month+1)+'月'+date+'日';
            classWeekButtons.push(string);
            dayNum = dayNum+1;
            date = date+1;

            var d = new Date(year, month, 0);
            var dayCounts = d.getDate();

            if(date>dayCounts){
                month = month+1;
                date = date%dayCounts
            }
        }

        var list1=[];var list2=[];var list3=[];var list4=[];var list5=[];var list6=[];var list7=[];

        var trailClassList = this.state.trailClassList;
        for(var i=0;i<trailClassList.length;i++){
            var trailClass = trailClassList[i];
            for(var j=0;j<days.length;j++){
                if(trailClass.week==days[j]+1)
                {
                    switch (j){
                        case 0:list1.push(trailClass);break;
                        case 1:list2.push(trailClass);break;
                        case 2:list3.push(trailClass);break;
                        case 3:list4.push(trailClass);break;
                        case 4:list5.push(trailClass);break;
                        case 5:list6.push(trailClass);break;
                        case 6:list7.push(trailClass);break;
                    }
                }
            }
        }
        this.setState({classWeekButtons:classWeekButtons,ClassList1:list1,ClassList2:list2,ClassList3:list3,ClassList4:list4,ClassList5:list5,ClassList6:list6,ClassList7:list7})
    }

}

const styles = StyleSheet.create({
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
        userType: state.user.user.usertype,
        creatorId:state.user.personInfo.personId,
    })
)(AddTrailClass);


