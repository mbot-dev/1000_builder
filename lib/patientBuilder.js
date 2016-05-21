"use strict";

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');

/*************************************************************************************************

// 患者情報モジュール
var PatientModule = {
   uniqueInfo: {                                   // ID 情報
      masterId: {                                  // 主 ID．MmlHeader の masterId と必ず一致すること
         Id: {}                                    // 共通形式 (Id 形式)
      },
      otherId: []                                  // その他のID otherId の配列
   },
   personName: [],                                 // 氏名情報  人名 Name の配列
   birthday: 'YYYY-MM-DD',                         // 生年月日
   sex: '',                                        // 性別．テーブル MML0010 を使用する (femail mail unknown)
   nationality: {
      value: '',                                   // 国籍コード．ISO 3166 A3 コード使用．日本 JPN
      attr: {
         subtype: ''                               // 第2国籍コード．ISO 3166 A3コード使用
      }
   },
   race: {
      value: '',                                   // 人種，民族
      attr: {
         raceCode: '',                             // コード
         raceCodeId: ''                            // 使用したテーブル名を記載
      }
   },
   marital: '',                                    // 婚姻状態．テーブル MML0011 を使用する(separated divorced married single widowed)
   addresses: [],                                  // Address の配列
   emailAddresses: [],                             // email の配列
   phones: [],                                     // Phone の配列
   accountNumber: '',                              // 会計番号
   socialIdentification: '',                       // 社会番号
   death: {
      value: false                                 // 死亡フラグ
      attr: {
         date: 'YYYY-MM-DD'
      }
   }
};

var otherId = {
   attr: {
      type: ''                                     // MML0009
   },
   Id: {}
};

**************************************************************************************************/

module.exports = {

    buildUniqueInfo: function(target) {
        var arr = [];
        arr.push('<mmlPi:uniqueInfo>');
        arr.push('<mmlPi:masterId>');
        arr.push(commonBuilder.buildId(target.masterId.Id));
        arr.push('</mmlPi:masterId>');
        if (target.hasOwnProperty('otherId')) {
            target.otherId.forEach((entry) => {
                arr.push('<mmlPi:otherId');
                arr.push(' mmlPi:type=');
                arr.push(utils.addQuote(entry.attr.type));
                arr.push('>');
                arr.push(commonBuilder.buildId(entry.Id));
                arr.push('</mmlPi:otherId>');
            });
        }
        arr.push('</mmlPi:uniqueInfo>');
        return arr.join('');
    },

    buildPersonName: function(target) {
        var arr = [];
        arr.push('<mmlPi:personName>');
        target.forEach((entry) => {
            arr.push(commonBuilder.buildName(entry));
        });
        arr.push('</mmlPi:personName>');
        return arr.join('');
    },

    buildBirthday: function(target) {
        var arr = [];
        arr.push('<mmlPi:birthday>');
        arr.push(target);
        arr.push('</mmlPi:birthday>');
        return arr.join('');
    },

    buildSex: function(target) {
        var arr = [];
        arr.push('<mmlPi:sex>');
        arr.push(target);
        arr.push('</mmlPi:sex>');
        return arr.join('');
    },

    buildNationality: function(target) {
        var arr = [];
        arr.push('<mmlPi:nationality');
        if (target.hasOwnProperty('attr')) {
            arr.push(' mmlPi:subtype=');
            arr.push(utils.addQuote(target.attr.subtype));
        }
        arr.push('>');
        if (target.hasOwnProperty('value')) {
            arr.push(target.value);
        } else {
            arr.push(target);
        }
        arr.push('</mmlPi:nationality>');
        return arr.join('');
    },

    buildRace: function(target) {
        var arr = [];
        arr.push('<mmlPi:race');
        if (target.hasOwnProperty('attr')) {
            if (target.attr.hasOwnProperty('raceCode')) {
                arr.push(' mmlPi:raceCode=');
                arr.push(utils.addQuote(target.attr.raceCode));
            }
            if (target.attr.hasOwnProperty('raceCodeId')) {
                arr.push(' mmlPi:raceCodeId=');
                arr.push(utils.addQuote(target.attr.raceCodeId));
            }
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlPi:race>');
        return arr.join('');
    },

    buildMarital: function(target) {
        var arr = [];
        arr.push('<mmlPi:marital>');
        arr.push(target);
        arr.push('</mmlPi:marital>');
        return arr.join('');
    },

    buildAddresses: function(target) {
        var arr = [];
        arr.push('<mmlPi:addresses>');
        target.forEach((entry) => {
            arr.push(commonBuilder.buildAddress(entry));
        });
        arr.push('</mmlPi:addresses>');
        return arr.join('');
    },

    buildEmailAddresses: function(target) {
        var arr = [];
        arr.push('<mmlPi:emailAddresses>');
        target.forEach((entry) => {
            arr.push('<mmlCm:email>');
            arr.push(entry);
            arr.push('</mmlCm:email>');
        });
        arr.push('</mmlPi:emailAddresses>');
        return arr.join('');
    },

    buildPhones: function(target) {
        var arr = [];
        arr.push('<mmlPi:phones>');
        target.forEach((entry) => {
            arr.push(commonBuilder.buildPhone(entry));
        });
        arr.push('</mmlPi:phones>');
        return arr.join('');
    },

    buildAccountNumber: function(target) {
        var arr = [];
        arr.push('<mmlPi:accountNumber>');
        arr.push(target);
        arr.push('</mmlPi:accountNumber>');
        return arr.join('');
    },

    buildSocialIdentification: function(target) {
        var arr = [];
        arr.push('<mmlPi:socialIdentification>');
        arr.push(target);
        arr.push('</mmlPi:socialIdentification>');
        return arr.join('');
    },

    buildDeath: function(target) {
        var arr = [];
        arr.push('<mmlPi:death');
        if (target.hasOwnProperty('attr')) {
            arr.push(' date=');
            arr.push(utils.addQuote(target.attr.date));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('<mmlPi:/death>');
        return arr.join('');
    },

    build: function(target) {
        var arr = [];
        arr.push('<mmlPi:PatientModule>');
        arr.push(this.buildUniqueInfo(target.uniqueInfo));
        arr.push(this.buildPersonName(target.personName));
        arr.push(this.buildBirthday(target.birthday));
        arr.push(this.buildSex(target.sex));
        if (target.hasOwnProperty('nationality')) {
            arr.push(this.buildNationality(target.nationality));
        }
        if (target.hasOwnProperty('race')) {
            arr.push(this.buildRace(target.race));
        }
        if (target.hasOwnProperty('marital')) {
            arr.push(this.buildMarital(target.marital));
        }
        if (target.hasOwnProperty('addresses')) {
            arr.push(this.buildAddresses(target.addresses));
        }
        if (target.hasOwnProperty('emailAddresses')) {
            arr.push(this.buildEmailAddresses(target.emailAddresses));
        }
        if (target.hasOwnProperty('phones')) {
            arr.push(this.buildPhones(target.phones));
        }
        if (target.hasOwnProperty('accountNumber')) {
            arr.push(this.buildAccountNumber(target.accountNumber));
        }
        if (target.hasOwnProperty('socialIdentification')) {
            arr.push(this.buildSocialIdentification(target.socialIdentification));
        }
        if (target.hasOwnProperty('death')) {
            arr.push(this.buildDeath(target.death));
        }
        arr.push('</mmlPi:PatientModule>');
        return arr.join('');
    }
};
