'use strict';

const utils = require('../lib/utils');

/*
var LifestyleModule = {
    occupation: '',                                 // 職業
    tobacco: '',                                    // 喫煙歴
    alcohol: '',                                    // 飲酒歴
    other: ''                                       // その他の生活習慣 ?
};
*/

module.exports = {

    build: function (target, arr) {

        arr.push('<mmlLs:LifestyleModule>');

        arr.push('<mmlLs:occupation>');
        arr.push(target.occupation);
        arr.push('</mmlLs:occupation>');

        arr.push('<mmlLs:tobacco>');
        arr.push(target.tobacco);
        arr.push('</mmlLs:tobacco>');

        arr.push('<mmlLs:alcohol>');
        arr.push(target.alcohol);
        arr.push('</mmlLs:alcohol>');

        if (target.hasOwnProperty('other')) {
            arr.push('<mmlLs:other>');
            arr.push(target.other);
            arr.push('</mmlLs:other>');
        }

        arr.push('</mmlLs:LifestyleModule>');
    }
};
