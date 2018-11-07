
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

    constructor(props) {
        super(props);
        this.state={
            isRefreshing:true,
            fadeAnim: new Animated.Value(1),

            goods:[],
            allgoods:[],
        }
    }

    render() {

        var goodList = [];
        var {goods}=this.state;
        var lineStyle={flex:1,flexDirection:'row',padding:10,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent',};

        if(goods&&goods.length>0)
        {
            goods.map((good,i)=>{

                // var imgUrl = ''
                // if(i==3)imgUrl = Config.server+good.imgUrl.substring(27,good.imgUrl.length)
                // else imgUrl = good.imgUrl

                //name,type,typefilter,reservenum,brief,discount,thumburl,price

                var type = '';
                switch(good.type){
                    //{"racket","fittings","shoes","clothes","VIP","healthproducts"}
                    case 'racket':type='球拍';break;
                    case 'fittings':type='配件';break;
                    case 'shoes':type='球鞋';break;
                    case 'clothes':type='衣服';break;
                    case 'VIP':type='会员卡';break;
                    case 'healthproducts':type='保健品';break;
                }

                goodList.push(
                    <TouchableOpacity style={lineStyle}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems:'center'}}>
                            <Image resizeMode="contain" style={{ width:100,height:100}} source={{uri:good.thumburl}} />
                        </View>
                        <View style={{flex:2,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:5}}>
                            <View style={{flex:2,justifyContent:'flex-start',alignItems:'center',marginBottom:3}}>
                                <Text  style={{fontSize:14,color:'#343434'}}>{good.name}</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:2}}>

                                <View style={{backgroundColor: '#fca482',justifyContent:'center',alignItems:'center',padding:2}}>
                                    <Text style={{flex: 1, fontSize: 12, color: '#fff'}}>{type}</Text>
                                </View>

                                <View style={{backgroundColor: '#efefef',justifyContent:'center',alignItems:'center',padding:2,marginLeft:5}}>
                                    <Text style={{flex: 1, fontSize: 12, color: '#8a8a8a'}}>容量 500ml</Text>
                                </View>
                            </View>
                            {
                                good.reservenum>10?
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 3
                                }}>
                                    <Text
                                        style={{flex: 4, fontSize: 13, color: '#666'}}>库存 {good.reservenum}</Text>
                                </View>:
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 3
                                    }}>
                                        <Text style={{fontSize: 13, color: 'red'}}>库存 {good.reservenum} </Text>
                                        <View style={{backgroundColor:'red',padding:2}}><Text style={{fontSize:12,color:'#fff'}}>紧张</Text></View>
                                    </View>
                            }
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:3}}>
                                <Text style={{flex:4,fontSize:13,color:'red'}}>￥{good.price}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })

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
                    <SearchBar
                        lightTheme
                        onChangeText={
                            //模糊查询
                            (text)=>{
                                this.searchByText(text)
                            }
                        }
                        placeholder='商品名称' />
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>库存列表</Text>
                    </View>
                    <ScrollView style={{ flex: 1, width: width, backgroundColor: '#fff' }}>

                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                            {goodList}
                        </Animated.View>

                    </ScrollView>
                </Toolbar>
            </View>
        );
    }

    searchByText(text){

        //前端实现模糊查询
        if(text==null || text=='')
        {
            var goods = this.state.allgoods
            this.setState({goods:goods})
        }
        else {
            var goods = this.state.allgoods
            var goodsList = [];

            if (goods && goods.length > 0) {
                goods.map((good, i) => {
                        if (good.name.indexOf(text) != -1)
                            goodsList.push(good)
                })
            }

            this.setState({goods: goodsList})
        }
    }

    componentWillMount()
    {
        Proxy.postes({
            url: Config.server + '/func/node/fetchGoodsList',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
            }
        }).then((json)=>{
            this.setState({goods:json.data,allgoods:json.data})
        }).catch((e)=>{})
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

export default connect(mapStateToProps)(GoodsList);

