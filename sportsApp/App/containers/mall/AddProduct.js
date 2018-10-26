import React,{Component} from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    Modal,
    DeviceEventEmitter,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputWrapper from 'react-native-text-input-wrapper';
import VenueInspect from '../../components/venue/VenueInspect';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import ActionSheet from 'react-native-actionsheet';
import InputScrollView from 'react-native-input-scroll-view'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {getAccessToken,} from '../../action/UserActions';
import Config from '../../../config';
import Proxy from '../../utils/Proxy';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

var {height, width} = Dimensions.get('window');
var ImagePicker = require('react-native-image-picker');


class AddProduct extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    showImagePicker(){

        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            title:'请选择',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'图库',
            cancelButtonTitle:'取消',
        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let uri = { uri: response.uri };
                let path = { uri: response.path };
                this.setState({product:Object.assign(this.state.product,{imgUrl:uri})});
                console.log('portrait.uri = ', response.uri);
            }
        });
    }

    //选商品类型
    _handlePress(index) {

        if(index!==0){
            var sortStr = this.state.sortButtons[index];
            var sortId = index;
            this.setState({product:Object.assign(this.state.product,{sortStr:sortStr,sortId:sortId})});
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    setProductPlace(Place)
    {
        var place = Place;
        place.unitId = parseInt(Place.unitId);

        this.setState({venue:place});

    }

    navigate2VenueInspect()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'VenueInspect',
                component: VenueInspect,
                params: {
                    setPlace:this.setProductPlace.bind(this)
                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state={
            product:{sortId:null,sortStr:null,name:null,brief:null,size:null,costPrice:null,salePrice:null,
                salesVolume:null,inventoryNumber:null,attachId:null,discount:null,venueId:null,imgUrl:null,},
            sortButtons:['取消','鞋类','服装','器材','饮料','其他'],
            venue:null,
        }
        this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }


    render() {

        // sortId:null,sortStr:null,name:null,brief:null,size:null,costPrice:null,salePrice:null,
        //     salesVolume:null,inventoryNumber:null,attachId:null,discount:null,venueId:null,imgUrl:null

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const sortButtons=['取消','鞋类','服装','器材','饮料','其他'];

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="上传商品" actions={[]} navigator={this.props.navigator}>
                <KeyboardAwareScrollView style={{height:height-180,width:width}}>
                <View style={{flex:5,backgroundColor:'#eee'}}>

                    <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',paddingHorizontal:5}}>
                        <Text style={{color:'#666',fontSize:13}}>商品基本信息</Text>
                    </View>

                    {/*商品名称*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>商品名称</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入商品名称"
                                value={this.state.product.name}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{name:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*商品类型*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>商品类型</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet'); }}>
                            {
                                this.state.product.sortStr==null?
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:14}}>请选择商品类型 ></Text>
                                    </View> :
                                    <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.product.sortStr}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet =p;
                                }}
                                title="请选择商品类型"
                                options={sortButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*商品简介*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>商品简介</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入商品简介"
                                value={this.state.product.brief}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{brief:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*商品容量*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>商品容量</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入商品容量"
                                value={this.state.product.size}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{size:value})})
                                    }}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>

                    {/*商品场馆*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>商品场地</Text>
                        </View>

                        {
                            this.state.venue==null?
                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}
                                                  onPress={()=>{
                                                      this.navigate2VenueInspect();
                                                  }}>
                                    <Text style={{fontSize:14,color:'#888'}}>
                                        请选择商品场地 >
                                    </Text>
                                </TouchableOpacity>:

                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}
                                                  onPress={()=>{
                                                      this.navigate2VenueInspect();
                                                  }}>
                                    <View style={{flex:3,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row',textAlign:'right'}}>
                                        <Text style={{color:'#222',fontSize:14}}>{this.state.venue.name}</Text>
                                    </View>
                                </TouchableOpacity>
                        }
                    </View>

                    <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',paddingHorizontal:5}}>
                        <Text style={{color:'#666',fontSize:13}}>商品售卖信息</Text>
                    </View>

                    {/*成本*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>成本</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入成本"
                                value={this.state.product.costPrice}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{costPrice:value})})
                                    }}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>

                    {/*售价*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>售价</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入售价"
                                value={this.state.product.salePrice}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{salePrice:value})})
                                    }}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>

                    {/*销售量*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>销售量</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入销售量"
                                value={this.state.product.salesVolume}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{salesVolume:parseInt(value)})})
                                    }}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>

                    {/*库存量*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>库存量</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入库存量"
                                value={this.state.product.inventoryNumber}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{inventoryNumber:parseInt(value)})})
                                    }}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>

                    {/*折扣*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>折扣</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入折扣"
                                value={this.state.product.discount}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{discount:value})})
                                    }}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>

                    {/*商品图片*/}
                    <View style={{flex:2,flexDirection:'column'}}>
                        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',marginBottom:1}}>
                            <View style={{width:width,height:40,justifyContent:'center',textAlign:'left',paddingHorizontal:5}}>
                                <Text style={{color:'#343434'}}>商品图片</Text>
                            </View>
                        </View>
                        {
                            this.state.product.imgUrl !== null?
                                <TouchableOpacity style={{flex:1,padding:10,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}
                                onPress={()=>{
                                    this.showImagePicker()
                                }}>
                                    <Image
                                        style={styles.backgroundVideo}
                                        source={{uri:this.state.product.imgUrl.uri}}
                                    />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={{flex:1,padding:10,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}
                                onPress={()=>{
                                    this.showImagePicker()
                                }}>
                                    <Ionicons name='md-images' size={80} color="#aaa"/>
                                </TouchableOpacity>
                        }
                    </View>

                    <View style={{backgroundColor:'#fff',padding:10}}>
                        <Text style={{color:'#aaa',fontSize:11}}>
                            温馨提示：您发布的内容应合法、真实、健康、共创文明的网络环境
                        </Text>
                    </View>
                </View>
                    <View style={{flexDirection:'row',height:50,justifyContent:'center',alignItems:'center',width:width,backgroundColor:'#fff',marginBottom:20}}>
                        <TouchableOpacity style={{width:width*1/3,backgroundColor:'#fc6254',padding:10,flexDirection:'row',
                            justifyContent:'center'}}
                                          onPress={()=>{

                                              //上传商品信息
                                              Proxy.postes({
                                                  url: Config.server + '/func/allow/addGoodInformation',
                                                  headers: {
                                                      'Content-Type': 'application/json',
                                                  },
                                                  body: {
                                                      product:this.state.product,
                                                      venue:this.state.venue,
                                                  }
                                              }).then((json) => {

                                                  var attachId = json.data;
                                                  var formData = new FormData();
                                                  var file = {uri: this.state.product.imgUrl.uri, type: 'multipart/form-data', name: 'img.jpg'};

                                                  formData.append('photo',file)

                                                  //上传商品图片
                                                  Proxy.post({
                                                      url:Config.server+'/func/allow/uploadGoodsPic?attachId='+attachId.toString(),
                                                      headers: {
                                                          'Content-Type':'multipart/form-data',
                                                      },
                                                      body: formData,
                                                  }).then((json)=> {
                                                      var data = json.data;
                                                      if(data == 'success'){
                                                          Alert.alert('成功','上传商品成功!')
                                                          this.goBack();
                                                      }

                                                      resolve(json)

                                                  }).catch((err) =>{
                                                      //reject(err)
                                                  })


                                              }).catch((err) => {
                                                  alert(err);
                                              });

                                          }}>
                            <Text style={{color:'#fff',fontSize:15}}>上传商品</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAwareScrollView>
                </Toolbar>
            </View>
        );
    }
    componentDidMount()
    {
        this.venueListener=DeviceEventEmitter.addListener('on_venue_confirm', (data)=>{
            if(data)
                this.setState({venue:data})
        });
    }

    componentWillUnmount()
    {
        if(this.venueListener)
            this.venueListener.remove();
    }

}

var styles = StyleSheet.create({
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backgroundVideo: {
        width:100,
        height:100,
    },

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(AddProduct);


