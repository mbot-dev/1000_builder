'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');

/*************************************************************************************************

// 患者情報モジュール
var PatientModule = {
   uniqueInfo: {                                   // ID 情報
      masterId: {                                  // 主 ID．MmlHeader の masterId と必ず一致すること
         Id: {}                                    // 共通形式 (mmlCm:Id 形式)
      },
      otherId: []                                  // その他のID otherId の配列
   },
   personName: [],                                 // 氏名情報  人名 mmlNm:Name の配列
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
   addresses: [],                                  // mmlAd:Address の配列
   emailAddresses: [],                             // mmlCm:email の配列
   phones: [],                                     // mmlPh:Phoneの配列
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
   Id: {}                                          // 共通形式 (mmlCm:Id 形式)
};

**************************************************************************************************/

module.exports = {

    buildUniqueInfo: function(target, arr) {
        arr.push('<mmlPi:uniqueInfo>');
        arr.push('<mmlPi:masterId>');
        commonBuilder.buildId(target.masterId.Id, arr);
        arr.push('</mmlPi:masterId>');
        if (target.hasOwnProperty('otherId')) {
            target.otherId.forEach((entry) => {
                arr.push('<mmlPi:otherId');
                arr.push(' mmlPi:type=');
                arr.push(utils.addQuote(entry.attr.type));
                arr.push('>');
                commonBuilder.buildId(entry.Id, arr);
                arr.push('</mmlPi:otherId>');
            });
        }
        arr.push('</mmlPi:uniqueInfo>');
    },

    buildPersonName: function(target, arr) {
        arr.push('<mmlPi:personName>');
        target.forEach((entry) => {
            commonBuilder.buildName(entry, arr);
        });
        arr.push('</mmlPi:personName>');
    },

    buildBirthday: function(target, arr) {
        arr.push('<mmlPi:birthday>');
        arr.push(target);
        arr.push('</mmlPi:birthday>');
    },

    buildSex: function(target, arr) {
        arr.push('<mmlPi:sex>');
        arr.push(target);
        arr.push('</mmlPi:sex>');
    },

    buildNationality: function(target, arr) {
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
    },

    buildRace: function(target, arr) {
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
    },

    buildMarital: function(target, arr) {
        arr.push('<mmlPi:marital>');
        arr.push(target);
        arr.push('</mmlPi:marital>');
    },

    buildAddresses: function(target, arr) {
        arr.push('<mmlPi:addresses>');
        target.forEach((entry) => {
            commonBuilder.buildAddress(entry, arr);
        });
        arr.push('</mmlPi:addresses>');
    },

    buildEmailAddresses: function(target, arr) {
        arr.push('<mmlPi:emailAddresses>');
        target.forEach((entry) => {
            arr.push('<mmlCm:email>');
            arr.push(entry);
            arr.push('</mmlCm:email>');
        });
        arr.push('</mmlPi:emailAddresses>');
    },

    buildPhones: function(target, arr) {
        arr.push('<mmlPi:phones>');
        target.forEach((entry) => {
            commonBuilder.buildPhone(entry,　arr);
        });
        arr.push('</mmlPi:phones>');
    },

    buildAccountNumber: function(target, arr) {
        arr.push('<mmlPi:accountNumber>');
        arr.push(target);
        arr.push('</mmlPi:accountNumber>');
    },

    buildSocialIdentification: function(target, arr) {
        arr.push('<mmlPi:socialIdentification>');
        arr.push(target);
        arr.push('</mmlPi:socialIdentification>');
    },

    buildDeath: function(target, arr) {
        arr.push('<mmlPi:death');
        if (target.hasOwnProperty('attr')) {
            arr.push(' date=');
            arr.push(utils.addQuote(target.attr.date));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('<mmlPi:/death>');
    },

    build: function(target, arr) {
        arr.push('<mmlPi:PatientModule>');
        this.buildUniqueInfo(target.uniqueInfo, arr);
        this.buildPersonName(target.personName, arr);
        this.buildBirthday(target.birthday, arr);
        this.buildSex(target.sex, arr);
        if (target.hasOwnProperty('nationality')) {
            this.buildNationality(target.nationality, arr);
        }
        if (target.hasOwnProperty('race')) {
            this.buildRace(target.race, arr);
        }
        if (target.hasOwnProperty('maritalStatus')) {
            this.buildMarital(target.maritalStatus, arr);
        }
        if (target.hasOwnProperty('addresses')) {
            this.buildAddresses(target.addresses, arr);
        }
        if (target.hasOwnProperty('emailAddresses')) {
            this.buildEmailAddresses(target.emailAddresses, arr);
        }
        if (target.hasOwnProperty('phones')) {
            this.buildPhones(target.phones, arr);
        }
        if (target.hasOwnProperty('accountNumber')) {
            this.buildAccountNumber(target.accountNumber, arr);
        }
        if (target.hasOwnProperty('socialIdentification')) {
            this.buildSocialIdentification(target.socialIdentification, arr);
        }
        if (target.hasOwnProperty('death')) {
            this.buildDeath(target.death, arr);
        }
        arr.push('</mmlPi:PatientModule>');
    },

    deleteInstance: function (arr) {
        arr.push('<mmlPi:PatientModule/>');
    }
};
