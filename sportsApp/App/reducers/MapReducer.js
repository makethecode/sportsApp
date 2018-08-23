
import {
    UPDATE_MAP_CENTER,
    ON_VENUE_INFO,
} from '../constants/MapConstants';

const initialState = {
    center: {
        latitude: 36.67205,
        longitude: 117.14501
    },
    venues:null,
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case  ON_VENUE_INFO:
            var data = action.payload;
            return Object.assign({}, state, {
                venues: data
            })

        case UPDATE_MAP_CENTER:
            var {center}=action.payload
            return Object.assign({}, state, {
                center: center,
            })

        default:
            return state;
    }
}

export default user;
