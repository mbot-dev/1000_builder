'use strict';

const config = require('config');
const utils = require('../lib/utils');
const logger = require('../logger/logger');

/*******************************************************************************

// Id
var Id = {
   value: '',
   attr: {
      type: '',                                       // ID の種類コード (個人用ID:MML0024 施設ID:MML0027 診療科ID:MML0029 を使用)
      tableId: '',                                    // 上記 ID の種類コードを規定するテーブル名．施設固有の個人 ID の場合に限り，施設 ID を記載することができる
      checkDigit: '',                                 // チェックディジット
      checkDigitSchema: ''                            // チェックディジット方式
   }
};

// ex. 個人用IDの場合-1
var personId = {
   value: '12345',
   attr: {
      type: 'facility',                               // MML0024 (全国統一ID:national 地域ID:local 施設内ID:facility)
      tableId: 'MML0024'
   }
};

// ex. 個人用IDの場合-2 [施設ID + 施設固有個人ID] で記載
var personId = {
   value: '12345',                                   // 施設で発番されたID
   attr: {
      type: 'facility',
      tableId: 'JPN012345678901'                     // tableIdに施設のID=JPN012345678901を記載
   }
};

// ex. 施設IDの場合
var facilityId = {
   value: '12345',
   attr: {
      type: 'insurance',                             // MML0027 (認証局:ca 保険医療機関コード:insurance 文科省大学付属病院施設区分:monbusyo 日本医師会総合政策研究コード:JMARI)
      tableId: 'MML0027'
   }
};

// ex. 診療科ID
var departmentId = {
   value: '01',                                      // medicalの場合はMML0028 dentalの場合はMML0030を参照
   attr: {
      type: 'medical',                               // MML0029 (医科診療科コード:medical 歯科診療科コード:dental 施設内ユーザー定義診療科コード:facility)
      tableId: 'MML0029'
   }
};

// 人名
var Name = {
   attr: {
      repCode: '',                                    // 表記法 (漢字:I カナ:P ローマ字:A)
      tableId: 'MML0025'                              // 表記法を規定するテーブル名 MML0025
   },
   family: '',                                        // 姓
   given: '',                                         // 名
   middle: '',                                        // ミドルネーム
   fullname: '',                                      // フルネーム
   prefix: '',                                        // 肩書きなど
   degree: ''                                         // 学位
};

// 住所
var Address = {
   attr: {
      repCode: '',                                    // 表記法 (漢字:I カナ:P ローマ字:A)
      addressClass: '',                               // 住所の種類コード MML0002 を使用
      tableId: 'MML0025'                              // 上記の表記法を規定するテーブル名 MML0025
   },
   full: '',                                          // 一連住所
   prefecture: '',                                    // 都道府県
   city: '',                                          // 市，区，郡
   town: '',                                          // 町，村
   homeNumber: '',                                    // 番地，丁目，マンション名，部屋番号など残りすべて
   zip: '',                                           // 郵便番号
   countryCode: ''                                    // 国コード．ISO 3166 A3 コード使用
};

// 電子メールアドレス
var email = '';

// 電話番号
var Phone = {
   attr: {
      telEquipType: ''                                // 装置の種類コード MML0003から使用
   },
   area: '',                                          // 市外局番
   city: '',                                          // 局番
   number: '',                                        // 加入番号
   extension: '',                                     // 内線番号
   full: '',                                          // 一連電話番号
   country: '',                                       // 国番号
   memo: ''                                           // 使用時間帯などを記載
};

// 外部参照
var extRef = {
   attr: {
      contentType: '',                                // MIME Type
      medicalRole: '',                                // MML0033を使用
      title: '',                                      // タイトル
      href: ''                                        // 外部参照の所在
   }
};

// 作成者情報
var CreatorInfo = {
   PersonalizedInfo: {},                              // 個人情報形式 PersonalizedInfo
   creatorLicense: []                                 // 生成者の資格 creatorLicenseの配列
};

// 個人情報
var PersonalizedInfo = {
   Id: {},                                            // ID情報
   personName: [],                                    // 人名 Name の配列
   Facility: {},                                      // 施設情報 Facility
   Department: {},                                    // 診療科情報 Department
   addresses: [],                                     // 住所 Address の配列
   emailAddresses: [],                                // 電子メールアドレス email の配列
   phones: []                                         // 電話番号表 Phone の配列
};

// 施設情報
var Facility = {
   name: [],                                         // 施設名 Name の配列
   Id: {}                                             // 施設ID
};

// 診療科情報
var Department = {
   name: [],                                         // 診療科名 Name の配列
   Id: {}                                             // 診療科ID
};

// 施設及び診療科の名称
var name = {
   value: '',
   attr: {
      repCode: '',                                    // 表記法 (漢字:I カナ:P ローマ字:A)
      tableId: 'MML0025'                              // MML0025
   }
};

// 医療資格
var creatorLicense = {
   value: '',                                         // 生成者の資格 MML0026を使用
   attr: {
      tableId: 'MML0026'                              // 生成者の資格を規定するテーブル名 MML0026
   }
};
*******************************************************************************/

module.exports = {

    // extRef
    buildExtRef: function(target, arr) {
        arr.push('<mmlCm:extRef');
        if (target.attr.hasOwnProperty('contentType')) {
            arr.push(' mmlCm:contentType=');
            arr.push(utils.addQuote(target.attr.contentType));
        }
        if (target.attr.hasOwnProperty('medicalRole')) {
            arr.push(' mmlCm:medicalRole=');
            arr.push(utils.addQuote(target.attr.medicalRole));
        }
        if (target.attr.hasOwnProperty('title')) {
            arr.push(' mmlCm:title=');
            arr.push(utils.addQuote(target.attr.title));
        }
        arr.push(' mmlCm:href=');
        arr.push(utils.addQuote(target.attr.href));
        arr.push('/>');
    },

    // Id
    buildId: function(target, arr) {
        arr.push('<mmlCm:Id');
        arr.push (' mmlCm:type=');
        arr.push(utils.addQuote(target.attr.type));
        arr.push (' mmlCm:tableId=');
        arr.push(utils.addQuote(target.attr.tableId));
        if (target.attr.hasOwnProperty('checkDigit')) {
            arr.push (' mmlCm:checkDigit=');
            arr.push(utils.addQuote(target.attr.checkDigit));
        }
        if (target.attr.hasOwnProperty('checkDigitSchema')) {
            arr.push (' mmlCm:checkDigit=');
            arr.push(utils.addQuote(target.attr.checkDigitSchema));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlCm:Id>');
    },

    // Name
    buildName: function(target, arr) {
        arr.push('<mmlNm:Name');
        arr.push(' mmlNm:repCode=');
        arr.push(utils.addQuote(target.attr.repCode));
        if (target.attr.hasOwnProperty('tableId')) {
            arr.push(' mmlNm:tableId=');
            arr.push(utils.addQuote(target.attr.tableId));
        }
        arr.push('>');
        if (target.hasOwnProperty('family')) {
            arr.push('<mmlNm:family>');
            arr.push(target.family);
            arr.push('</mmlNm:family>');
        }
        if (target.hasOwnProperty('given')) {
            arr.push('<mmlNm:given>');
            arr.push(target.given);
            arr.push('</mmlNm:given>');
        }
        if (target.hasOwnProperty('middle')) {
            arr.push('<mmlNm:middle>');
            arr.push(target.middle);
            arr.push('</mmlNm:middle>');
        }
        if (target.hasOwnProperty('fullname')) {
            arr.push('<mmlNm:fullname>');
            arr.push(target.fullname);
            arr.push('</mmlNm:fullname>');
        }
        if (target.hasOwnProperty('prefix')) {
            arr.push('<mmlNm:prefix>');
            arr.push(target.prefix);
            arr.push('</mmlNm:prefix>');
        }
        if (target.hasOwnProperty('degree')) {
            arr.push('<mmlNm:degree>');
            arr.push(target.degree);
            arr.push('</mmlNm:degree>');
        }
        arr.push('</mmlNm:Name>');
    },

    // PersonName
    buildPersonName: function(target, arr) {
        arr.push('<mmlPsi:personName>');
        target.forEach((entry) => {
            this.buildName(entry, arr);
        });
        arr.push('</mmlPsi:personName>');
    },

    // Facility
    buildFacility: function(target, arr) {
        arr.push('<mmlFc:Facility>');
        target.name.forEach((entry) => {
            arr.push('<mmlFc:name');
            arr.push(' mmlFc:repCode=');
            arr.push(utils.addQuote(entry.attr.repCode));
            if (entry.attr.hasOwnProperty('tableId')) {
                arr.push(' mmlFc:tableId=');
                arr.push(utils.addQuote(entry.attr.tableId));
            }
            arr.push('>');
            arr.push(entry.value);
            arr.push('</mmlFc:name>');
        });
        this.buildId(target.Id, arr);
        arr.push('</mmlFc:Facility>');
    },

    // Department
    buildDepartment: function(target, arr) {
        arr.push('<mmlDp:Department>');
        target.name.forEach((entry) => {
            arr.push('<mmlDp:name');
            arr.push(' mmlDp:repCode=');
            arr.push(utils.addQuote(entry.attr.repCode));
            if (entry.attr.hasOwnProperty('tableId')) {
                arr.push(' mmlDp:tableId=');
                arr.push(utils.addQuote(entry.attr.tableId));
            }
            arr.push('>');
            arr.push(entry.value);
            arr.push('</mmlDp:name>');
        });
        this.buildId(target.Id, arr);
        arr.push('</mmlDp:Department>');
    },

    // Address
    buildAddress: function(target, arr) {
        arr.push('<mmlAd:Address');
        arr.push(' mmlAd:repCode=');
        arr.push(utils.addQuote(target.attr.repCode));
        if (target.attr.hasOwnProperty('addressClass')) {
            arr.push(' mmlAd:addressClass=');
            arr.push(utils.addQuote(target.attr.addressClass));
        }
        if (target.attr.hasOwnProperty('tableId')) {
            arr.push(' mmlAd:tableId=');
            arr.push(utils.addQuote(target.attr.tableId));
        }
        arr.push('>');
        if (target.hasOwnProperty('full')) {
            arr.push('<mmlAd:full>');
            arr.push(target.full);
            arr.push('</mmlAd:full>');
        }
        if (target.hasOwnProperty('prefecture')) {
            arr.push('<mmlAd:prefecture>');
            arr.push(target.prefecture);
            arr.push('</mmlAd:prefecture>');
        }
        if (target.hasOwnProperty('city')) {
            arr.push('<mmlAd:city>');
            arr.push(target.city);
            arr.push('</mmlAd:city>');
        }
        if (target.hasOwnProperty('town')) {
            arr.push('<mmlAd:town>');
            arr.push(target.town);
            arr.push('</mmlAd:town>');
        }
        if (target.hasOwnProperty('homeNumber')) {
            arr.push('<mmlAd:homeNumber>');
            arr.push(target.homeNumber);
            arr.push('</mmlAd:homeNumber>');
        }
        if (target.hasOwnProperty('zip')) {
            arr.push('<mmlAd:zip>');
            arr.push(target.zip);
            arr.push('</mmlAd:zip>');
        }
        if (target.hasOwnProperty('countryCode')) {
            arr.push('<mmlAd:countryCode>');
            arr.push(target.countryCode);
            arr.push('</mmlAd:countryCode>');
        }
        arr.push('</mmlAd:Address>');
    },

    // addresses
    buildAddresses: function(target, arr) {
        arr.push('<mmlPsi:addresses>');
        target.forEach((entry) => {
            this.buildAddress(entry, arr);
        });
        arr.push('</mmlPsi:addresses>');
    },

    // email
    buildEmail: function(target, arr) {
        arr.push('<mmlCm:email>');
        arr.push(target);
        arr.push('</mmlCm:email>');
    },

    // emailAddresses
    buildEmailAddresses: function(target, arr) {
        arr.push('<mmlPsi:emailAddresses>');
        target.forEach((entry) => {
            this.buildEmail(entry, arr);
        });
        arr.push('</mmlPsi:emailAddresses>');
    },

    // Phone
    buildPhone: function(target, arr) {
        arr.push('<mmlPh:Phone');
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('telEquipType')) {
            arr.push(' mmlPh:telEquipType=');
            arr.push(utils.addQuote(target.attr.telEquipType));
        }
        arr.push('>');
        if (target.hasOwnProperty('area')) {
            arr.push('<mmlPh:area>');
            arr.push(target.area);
            arr.push('</mmlPh:area>');
        }
        if (target.hasOwnProperty('city')) {
            arr.push('<mmlPh:city>');
            arr.push(target.city);
            arr.push('</mmlPh:city>');
        }
        if (target.hasOwnProperty('number')) {
            arr.push('<mmlPh:number>');
            arr.push(target.number);
            arr.push('</mmlPh:number>');
        }
        if (target.hasOwnProperty('extension')) {
            arr.push('<mmlPh:extension>');
            arr.push(target.extension);
            arr.push('</mmlPh:extension>');
        }
        if (target.hasOwnProperty('full')) {
            arr.push('<mmlPh:full>');
            arr.push(target.full);
            arr.push('</mmlPh:full>');
        }
        if (target.hasOwnProperty('country')) {
            arr.push('<mmlPh:country>');
            arr.push(target.country);
            arr.push('</mmlPh:country>');
        }
        if (target.hasOwnProperty('memo')) {
            arr.push('<mmlPh:memo>');
            arr.push(target.memo);
            arr.push('</mmlPh:memo>');
        }
        arr.push('</mmlPh:Phone>');
    },

    // phones
    buildPhones: function(target, arr) {
        arr.push('<mmlPsi:phones>');
        target.forEach((entry) => {
            this.buildPhone(entry, arr);
        });
        arr.push('</mmlPsi:phones>');
    },

    // PersonalizedInfo
    buildPersonalizedInfo: function(target, arr) {
        arr.push('<mmlPsi:PersonalizedInfo>');
        this.buildId(target.Id, arr);
        this.buildPersonName(target.personName, arr);
        if (target.hasOwnProperty('Facility')) {
            this.buildFacility(target.Facility, arr);
        }
        if (target.hasOwnProperty('Department')) {
            this.buildDepartment(target.Department, arr);
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
        arr.push('</mmlPsi:PersonalizedInfo>');
    },

    // creatorLicense
    buildCreatorLicense: function(target, arr) {
        target.forEach((entry) => {
            arr.push('<mmlCi:creatorLicense');
            if (entry.hasOwnProperty('attr') && entry.attr.hasOwnProperty('tableId')) {
                arr.push(' mmlCi:tableId=');
                arr.push(utils.addQuote(entry.attr.tableId));
            }
            arr.push('>');
            arr.push(entry.value);
            arr.push('</mmlCi:creatorLicense>');
        });
    },

    // CreatorInfo
    buildCreatorInfo: function(target, arr) {
        arr.push('<mmlCi:CreatorInfo>');
        this.buildPersonalizedInfo(target.PersonalizedInfo, arr);
        if (target.hasOwnProperty('creatorLicense')) {
            this.buildCreatorLicense(target.creatorLicense, arr);
        }
        arr.push('</mmlCi:CreatorInfo>');
    }
};
