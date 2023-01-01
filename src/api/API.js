import axios from 'axios';

export function getBucketListByUserId(id) {
    return axios.get(
        process.env.REACT_APP_API_URL + '?user=' + id
    );

}

export function postBucketListItem(item) {
    return axios.post(
        process.env.REACT_APP_API_URL,
        item
    );
}