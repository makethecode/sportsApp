
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
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_QR_SCANNER,ACTION_BARCODE} from 'react-native-toolbar-wrapper'
import Camera from 'react-native-camera';
import Config from '../../../config';
import ProductPay from './ProductPay'
import ScannerList from './ScannerList'

var IMGS = [
    require('../../../img/banner1.jpeg'),
    require('../../../img/banner2.jpeg'),
    require('../../../img/banner3.jpeg'),
    require('../../../img/banner4.jpeg'),
];
var {height, width} = Dimensions.get('window');
var flag = true;

class Home extends Component{

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2ProductsList(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'products_list',
                component: ProductsList,
                params: {

                }
            })
        }
    }

    navigate2ShopCart(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'shop_cart',
                component: ShopCart,
                params: {

                }
            })
        }
    }

    navigate2ProductPay(goods,money)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ProductPay',
                component: ProductPay,
                params: {
                    //暂时实现一次扫描
                    goods:goods,
                    money:money,
                }
            })
        }
    }

    navigate2ScannerList()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ScannerList',
                component: ScannerList,
                params: {
                }
            })
        }
    }

    _renderPage(data,pageID){
        return (
            <View style={{width:width}}>
                <Image
                    source={data}
                    style={{width:width,flex:3}}
                    resizeMode={"stretch"}
                />
            </View>
        );
    }

    constructor(props) {
        super(props);
        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});
        this.state={
            dataSource:ds.cloneWithPages(IMGS),
            goodName:null,
            cameraModalVisible: false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto,
                barcodeScannerEnabled:true,
            },
            code:null,
            //实现多次扫描
            goods:[],
            money:0,
        }
    }

    queryGoodsCode(code) {

        proxy.postes({
            url: Config.server + '/func/allow/getGoodInfoByCode',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                code:code,
            }
        }).then((json) => {

                var goods = this.state.goods;
                goods.push(json.data);
                var money = this.state.money + json.data[0].salePrice;
                this.setState({goods: goods, money: money});

        }).catch((err) => {
            alert(err);
        });
    }

    render() {

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>

                <Toolbar width={width} title="商城" navigator={this.props.navigator}
                         actions={[{icon:ACTION_BARCODE,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0)
                             {
                                 //商城扫码逻辑不成熟
                                 this.navigate2ScannerList();
                             }
                         }}>

                <ScrollView style={{width:width,height:height,backgroundColor:'#eee'}}>
                    <View style={{width:width,height:height*0.3}}>
                        <ViewPager
                            style={this.props.style}
                            dataSource={this.state.dataSource}
                            renderPage={this._renderPage}
                            isLoop={true}
                            autoPlay={true}
                        />
                    </View>

                    {/*//搜索框*/}
                    <View style={{position:'absolute',top:30*height/736,width:width,flexDirection:'row',justifyContent:'center',alignItems: 'center',}}>

                        <View style={{flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#rgba(255, 255, 255, 0.6)',borderRadius:50,}}>
                            <View style={{backgroundColor:'transparent',marginLeft:10,padding:4}}>
                                <Icon name={'search'} size={20} color="#eee"/>
                            </View>
                            <TextInput
                                style={{height:35*height/736,width:width*0.7,paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:2,fontSize:14}}
                                onChangeText={(goodName) => {
                                      this.state.goodName=goodName;
                                      this.setState({goodName:this.state.goodName});
                                    }}
                                value={this.state.goodName}
                                placeholder=' 搜索商品'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                                autoCapitalize="characters"
                            />
                        </View>
                        <View style={{backgroundColor:'transparent',marginLeft:10}}>
                            <Icon name={'comment-o'} size={22} color="#fff"/>
                        </View>
                    </View>

                    <View style={{flex:5,flexDirection:'row',backgroundColor:'#fff',paddingBottom:10}}>

                            <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                              onPress={ ()=>{
                                         this.navigate2ProductsList();
                                         console.log('找教练');
                                       }}>
                                <Icon name="shopping-basket" size={25} color="#66CD00" />
                                <View style={{marginTop:0,paddingTop:10}}>
                                    <Text style={{fontSize:13,color:'#343434'}}>运动数码</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                              onPress={ ()=>{

                                          console.log('健康商城');
                                      }}>

                                <Icon name="shopping-cart" size={25} color="#EEAD0E" />
                                <View style={{marginTop:0,paddingTop:10}}>
                                    <Text style={{fontSize:13,color:'#343434'}}>健身装备</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                              onPress={ ()=>{
                                         this.setState({tab:2});
                                         console.log('运动馆');
                                      }}>
                                <Icon name="medkit" size={25} color="#EE6363" />
                                <View style={{marginTop:0,paddingTop:10}}>
                                    <Text style={{fontSize:13,color:'#343434'}}>器械球类</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                              onPress={ ()=>{
                                         this.setState({tab:3});
                                         console.log('健康定制');
                                      }}>
                                <Icon name="plane" size={25} color="#66CDAA" />
                                <View style={{marginTop:0,paddingTop:10}}>
                                    <Text style={{fontSize:13,color:'#343434'}}>营养保健</Text>
                                </View>
                            </TouchableOpacity>

                    </View>

                    <View style={{flex:3,marginTop:10,flexDirection:'row',justifyContent:'center',alignItems: 'center',}}>
                        <Text style={{color:'#ddd'}}>---------</Text>
                        <Icon name="bookmark-o" size={18} color="#EEAD0E" />
                        <Text style={{color:'#343434',fontSize:13,paddingLeft:5}}>精选活动</Text>
                        <Text style={{color:'#ddd'}}>---------</Text>
                    </View>

                    <View style={{flex:3,backgroundColor:'#fff',marginTop:10,marginBottom:10,justifyContent:'center',alignItems: 'center',}}>
                        <Image resizeMode="stretch" style={{ width:width,height:120}} source={require('../../../img/good1.jpg')} />
                    </View>

                    <View style={{flex:3,backgroundColor:'#fff',paddingBottom:10,justifyContent:'center',alignItems: 'center',}}>
                        <Image resizeMode="stretch" style={{ width:width,height:120}} source={require('../../../img/good3.jpg')} />
                    </View>
                </ScrollView>
                </Toolbar>

                {/*camera part*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
                    onRequestClose={() => {
                        this.setState({cameraModalVisible: false})
                    }}
                >
                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        style={styles.preview}
                        aspect={this.state.camera.aspect}
                        captureTarget={this.state.camera.captureTarget}
                        type={this.state.camera.type}
                        flashMode={this.state.camera.flashMode}
                        defaultTouchToFocus
                        mirrorImage={false}
                        barcodeScannerEnabled={this.state.camera.barcodeScannerEnabled}
                        onBarCodeRead={(barcode) => {
                            var {data, type} = barcode;

                            if (data !== undefined && data !== null) {

                                this.setState({code: data})
                                this.queryGoodsCode(this.state.code)
                                this.closeCamera()
                            }
                        }}
                    />

                    <View style={[styles.box]}>

                    </View>
                    <View style={{
                        position: 'absolute',
                        right: 1 / 2 * width - 100,
                        top: 1 / 2 * height,
                        height: 100,
                        width: 200,
                        borderTopWidth: 1,
                        borderColor: '#e42112',
                        backgroundColor: 'transparent'
                    }}>

                    </View>

                    <View style={[styles.overlay, styles.bottomOverlay]}>

                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={() => {
                                this.closeCamera()
                            }}
                        >
                            <Icon name="times-circle" size={50} color="#343434"/>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
        );
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
});

const mapStateToProps = (state, ownProps) => {

    const props = {

    }
    return props
}

export default connect(mapStateToProps)(Home);

