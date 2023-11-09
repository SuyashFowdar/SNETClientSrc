import _ from 'lodash';

export const BASEURL = 'http://localhost:5501/';
// export const BASEURL = 'http://192.168.100.6:5501/';
// export const BASEURL = 'http://10.4.10.103:5501/';

export const removeFromArray = function(array, value, attr) {
    var i;
    if (attr) {
        for (i = 0; i < array.length; i++) {
            if (_.get(array[i], attr) == value) {
                array.splice(i, 1);
            }
        }
    } else {
        for (i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array.splice(i, 1);
            }
        }
    }
}
// export const BASEURL = 'http://192.168.100.7:5501/'