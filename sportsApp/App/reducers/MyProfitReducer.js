/**
 * Created by youli on 2017/9/1.
 */
/**
 * Created by dingyiming on 2017/8/16.
 */

import {
        SET_PAYMENT,
    ON_PAYMENT_UPDATE,
    ENABLE_PAYMENTS_ONFRESH,
    DISABLE_PAYMENTS_ONFRESH,
} from '../constants/MyProfitConstants';

const initialState = {
    payments:null,
    paymentsOnFresh:true,

    total:null,
    qunhuodong:null,
    total1:null,
    huaxiao:null,
    total2:null,
    tel1:null,
    tel2:null,
    wx1:null,
    wx2:null
};

let myprofit = (state = initialState, action) => {

    switch (action.type) {
        case SET_PAYMENT:
            return Object.assign({}, state, {
                payments:action.payments,
                total:action.total,
                qunhuodong:action.qunhuodong,
                huaxiao:action.huaxiao,
                total1:action.total1,
                total2:action.total2,
                tel1:action.tel1,
                tel2:action.tel2,
                wx1:action.wx1,
                wx2:action.wx2

            })

        case ON_PAYMENT_UPDATE:
            return Object.assign({}, state, {
                payments:action.payments.payments
            })
        case ENABLE_PAYMENTS_ONFRESH:
            return Object.assign({}, state, {
                paymentsOnFresh:true
            })
        case DISABLE_PAYMENTS_ONFRESH:
            return Object.assign({}, state, {
                paymentsOnFresh:false
            })
        default:
            return state;
    }
}

export default myprofit;

