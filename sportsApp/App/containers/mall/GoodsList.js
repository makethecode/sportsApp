import React,{Component} from 'react';
import {
    Dimensions,
    TextInput,
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
    Modal,
    NetInfo,
    TouchableHighlight,
    ActivityIndicator,
    WebView,
    Alert,
    AlertIOS,
    DeviceEventEmitter, // android
    NativeAppEventEmitter, // ios
} from 'react-native';
import proxy from "../../utils/Proxy";
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewPager from 'react-native-viewpager';
import ProductsList from './ProductsList';
import ShopCart from './ShopCart';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_QR_SCANNER,ACTION_BARCODE,ACTION_ADD} from 'react-native-toolbar-wrapper'
import Camera from 'react-native-camera';
import Config from '../../../config';
import ProductPay from './ProductPay'
import ScannerList from './ScannerList'
import { SearchBar } from 'react-native-elements'
import Proxy from '../../utils/Proxy'
import AddProduct from './AddProduct'
import { IndicatorViewPager,PagerTitleIndicator } from 'rn-viewpager'
import ProductDetail from './ProductDetail'
import Ionicons from 'react-native-vector-icons/Ionicons';

var {height, width} = Dimensions.get('window');
var flag = true;

class GoodsList extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2AddProduct()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'AddProduct',
                component: AddProduct,
                params: {
                }
            })
        }
    }

    navigate2ProductDetail(productId)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ProductDetail',
                component: ProductDetail,
                params: {
                    productId:productId
                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing:true,
            fadeAnim: new Animated.Value(1),
            doingFetch:false,
            bgColor: new Animated.Value(0),

            goods:[],
            allgoods:[],

            racket:[],
            fittings:[],
            shoes:[],
            clothes:[],
            VIP:[],
            healthproducts:[],

            showProgress:false,
        }
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    renderRow(rowData, sectionId, rowId) {

        var lineStyle={flex:1,flexDirection:'row',padding:10,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'#fff',};

        var type = '';
        switch(rowData.type){
            //{"racket","fittings","shoes","clothes","VIP","healthproducts"}
            case 'racket':type='球拍';break;
            case 'fittings':type='配件';break;
            case 'shoes':type='球鞋';break;
            case 'clothes':type='衣服';break;
            case 'VIP':type='会员卡';break;
            case 'healthproducts':type='保健品';break;
        }

        return (
            <TouchableOpacity style={lineStyle}
                              onPress={()=>{
                                  this.navigate2ProductDetail(rowData.id)
                              }}>
                <View style={{flex:3,justifyContent:'flex-start',alignItems:'center'}}>
                    <Image resizeMode="contain" style={{ width:100,height:100}} source={{uri:rowData.thumburl}} />
                </View>
                <View style={{flex:5,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:5}}>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems:'center',marginBottom:3}}>
                        <Text  style={{fontSize:14,color:'#343434'}}>{rowData.name}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:2}}>

                        <View style={{backgroundColor: '#fca482',justifyContent:'center',alignItems:'center',padding:2}}>
                            <Text style={{flex: 1, fontSize: 12, color: '#fff'}}>{type}</Text>
                        </View>

                        <View style={{backgroundColor: '#fc6254',justifyContent:'center',alignItems:'center',padding:2,marginLeft:8}}>
                            <Text style={{flex: 1, fontSize: 12, color: '#fff'}}>{rowData.creatorName} 上传</Text>
                        </View>
                    </View>
                    {
                        rowData.reservenum>10?
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 3
                            }}>
                                <Text
                                    style={{flex: 4, fontSize: 13, color: '#666'}}>库存 {rowData.reservenum}</Text>
                            </View>:
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 3
                            }}>
                                <Text style={{fontSize: 13, color: 'red'}}>库存 {rowData.reservenum} </Text>
                                <View style={{backgroundColor:'red',padding:2}}><Text style={{fontSize:12,color:'#fff'}}>紧张</Text></View>
                            </View>
                    }
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:3}}>
                        <Text style={{flex:4,fontSize:13,color:'red'}}>￥{rowData.realprice/100}</Text>
                    </View>
                </View>
                <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-end',marginRight:5}}>
                    <TouchableOpacity
                        onPress={()=>{
                            Alert.alert(
                                '删除',
                                '是否删除本条商品记录？',
                                [
                                    {text: '确定', onPress: () =>
                                    {
                                        Proxy.postes({
                                            url: Config.server + '/func/node/deleteGoods',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: {
                                                goodsId:rowData.id
                                            }
                                        }).then((json)=>{
                                            if(json.re==1){
                                                Alert.alert('成功','删除成功')
                                                this.fetchGoodsList();
                                            }else{
                                                Alert.alert('失败','存在该商品订单，不能删除')
                                            }
                                        }).catch((e)=>{
                                        })
                                    }},
                                    {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                ],
                            )
                        }}>
                        <Ionicons name='md-close' size={20} color="#aaa"/>
                    </TouchableOpacity></View>
            </TouchableOpacity>
        )}

    render() {

        var racketList=null;
        var racket = this.state.racket;

        var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (racket !== undefined && racket !== null && racket.length > 0)
        {
            racketList = (
                <View><ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds1.cloneWithRows(racket)}
                    renderRow={this.renderRow.bind(this)}
                    removeClippedSubviews={false}
                /></View>
            );
        }else{
            racketList=(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>已加载完全部</Text>
                </View>
            )
        }

        var fittingsList=null;
        var fittings = this.state.fittings;

        var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (fittings !== undefined && fittings !== null && fittings.length > 0)
        {
            fittingsList = (
                <View><ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds2.cloneWithRows(fittings)}
                    renderRow={this.renderRow.bind(this)}
                    removeClippedSubviews={false}
                /></View>
            );
        }else{
            fittingsList=(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>已加载完全部</Text>
                </View>
            )
        }

        var shoesList=null;
        var shoes = this.state.shoes;

        var ds3 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (shoes !== undefined && shoes !== null && shoes.length > 0)
        {
            shoesList = (
                <View><ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds3.cloneWithRows(shoes)}
                    renderRow={this.renderRow.bind(this)}
                    removeClippedSubviews={false}
                /></View>
            );
        }else{
            shoesList=(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>已加载完全部</Text>
                </View>
            )
        }

        var clothesList=null;
        var clothes = this.state.clothes;

        var ds4 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (clothes !== undefined && clothes !== null && clothes.length > 0)
        {
            clothesList = (
                <View><ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds4.cloneWithRows(clothes)}
                    renderRow={this.renderRow.bind(this)}
                    removeClippedSubviews={false}
                /></View>
            );
        }else{
            clothesList=(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>已加载完全部</Text>
                </View>
            )
        }

        var VIPList=null;
        var VIP = this.state.VIP;

        var ds5 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (VIP !== undefined && VIP !== null && VIP.length > 0)
        {
            VIPList = (
                <View><ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds5.cloneWithRows(VIP)}
                    renderRow={this.renderRow.bind(this)}
                    removeClippedSubviews={false}
                /></View>
            );
        }else{
            VIPList=(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>已加载完全部</Text>
                </View>
            )
        }

        var healthproductsList=null;
        var healthproducts = this.state.healthproducts;

        var ds6 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (healthproducts !== undefined && healthproducts !== null && healthproducts.length > 0)
        {
            healthproductsList = (
                <View><ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds6.cloneWithRows(healthproducts)}
                    renderRow={this.renderRow.bind(this)}
                    removeClippedSubviews={false}
                /></View>
            );
        }else{
            healthproductsList=(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>已加载完全部</Text>
                </View>
            )
        }


        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>

                <Toolbar width={width} title="库存" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0)
                             {
                                 //上传商品信息
                                 this.navigate2AddProduct()
                             }
                         }}>
                    {<View style={{flex:1,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingBottom:5,}}>
                            <IndicatorViewPager
                                style={{flex:1,flexDirection: 'column-reverse'}}
                                indicator={this._renderTitleIndicator()}
                                onPageScroll={this._onPageScroll.bind(this)}
                            >
                                {racketList}
                                {fittingsList}
                                {shoesList}
                                {clothesList}
                                {VIPList}
                                {healthproductsList}
                            </IndicatorViewPager>
                        </Animated.View>
                    </View>}

                    {/*loading模态框*/}
                    <Modal animationType={"fade"} transparent={true} visible={this.state.showProgress}>
                        <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                          onPress={()=>{
                                              //TODO:cancel this behaviour

                                          }}>
                            <View style={{width:width*2/3,height:80,backgroundColor:'transparent',position:'relative',
                                justifyContent:'center',alignItems:'center',borderRadius:6}}>
                                <ActivityIndicator
                                    animating={true}
                                    style={{marginTop:10,height: 40,position:'absolute',transform: [{scale: 1.6}]}}
                                    size="large"
                                />
                                <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                    <Text style={{color:'#666',fontSize:13}}>
                                        加载中...
                                    </Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
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
                itemStyle={{width:width/4}}
                selectedItemStyle={{width:width/4}}
                selectedItemTextStyle={styles.indicatorSelectedText}
                selectedBorderStyle={styles.selectedBorderStyle}
                //
                titles={['球拍', '配件','球鞋','衣服','会员卡','保健品']}
            />
        )
    }

    _onPageScroll (scrollData) {
        let {offset, position} = scrollData
        if (position < 0 || position > 1) return
    }

    componentWillMount()
    {
        this.fetchGoodsList()

        this.goodsListListener=DeviceEventEmitter.addListener('goodlist_fresh', (data)=>{
            if(data)
                this.fetchGoodsList()
        });
    }

    componentWillUnmount()
    {
        if(this.goodsListListener)
            this.goodsListListener.remove();
    }

    fetchGoodsList(){

        //this.setState({showProgress:true})

        Proxy.postes({
            url: Config.server + '/func/node/fetchGoodsList',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
            }
        }).then((json)=>{

            this.setState({showProgress:false})

            var goods = [];
            if(json.data!=null)goods = json.data;

            var racket=[];var fittings=[];var shoes=[];
            var clothes=[];var VIP=[];var healthproducts=[];

            for(var i=0;i<goods.length;i++){
                var good = goods[i];
                switch(good.type){
                    //{"racket","fittings","shoes","clothes","VIP","healthproducts"}
                    case 'racket':racket.push(good);break;
                    case 'fittings':fittings.push(good);break;
                    case 'shoes':shoes.push(good);break;
                    case 'clothes':clothes.push(good);break;
                    case 'VIP':VIP.push(good);break;
                    case 'healthproducts':healthproducts.push(good);break;
                }

                this.setState({goods:goods,racket:racket,fittings:fittings,shoes:shoes,clothes:clothes,VIP:VIP,healthproducts:healthproducts})
            }
        }).catch((e)=>{
        })
    }

}

var styles = StyleSheet.create({
    //水平排列格式
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modelbox: {
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        width: 300,
        height: 200,
        backgroundColor: '#ffffff'
    },
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    box: {
        position: 'absolute',
        right: 1 / 2 * width - 100,
        top: 1 / 2 * height - 100,
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#387ef5',
        backgroundColor: 'transparent'

    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'transparent'
    },
});

const mapStateToProps = (state, ownProps) => {

    const props = {

    }
    return props
}

export default connect(mapStateToProps)(GoodsList);

