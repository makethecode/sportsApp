
import {
    PLAYING_URLS
} from '../constants/LiveConstants';

const initialState = {
    playingList:null,

};

let myprofit = (state = initialState, action) => {

    switch (action.type) {
        case PLAYING_URLS:
            return Object.assign({}, state, {
                playingList:action.url,

            })
        default:
            return state;
    }
}

export default myprofit;

