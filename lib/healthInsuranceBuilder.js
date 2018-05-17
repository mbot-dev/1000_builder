'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');

/*******************************************************************************
var HealthInsuranceModule = {
    attr: {
        countryType: ''
    },
    insuranceClass: {
        value: '',                                  // 健康保険種別
        attr: {
            ClassCode: '',
            tableId: ''                             // MML0031
        }
    },
    insuranceNumber: '',                            // 健康保険者番号
    clientId: {                                     // 被保険者情報
        group: '',                                  // 被保険者記号
        number: ''                                  // 被保険者番号
    },
    familyClass: '',                                // 本人家族区分．true：本人，false：家族
    clientInfo: {                                   // 被保険者情報
        personName: [],                             // mmlNm:Nameの配列
        addresses: [],                              // mmlAd:Addressの配列
        phones: []                                  // mmlPh:Phoneの配列
    },
    continuedDiseases: [],                          // 継続疾患情報 stringの配列
    startDate: '',                                  // 開始日 (交付年月日) CCYY-MM-DD
    expiredDate: '',                                // 有効期限
    paymentInRatio: '',                             // 入院時の負担率
    paymentOutRatio: '',                            // 外来時の負担率
    insuredInfo: {                                  // 保険者情報
        facility: {},                               // mmlFc:Facility
        addresses: [],                              // mmlAd:Addressの配列
        phones: []                                  // mmlPh:Phoneの配列
    },
    workInfo: {                                     // 被保険者の所属する事業所情報
        facility: {},                               // mmlFc:Facility
        addresses: [],                              // mmlAd:Addressの配列
        phones: []                                  // mmlPh:Phoneの配列
    },
    publicInsurance: []                             // publicInsuranceItemの配列 公費負担医療情報
};

var publicInsuranceItem = {
    attr: {
        priority: ''                                // 優先順位
    },
    providerName: '',                               // 公費負担名称
    provider: '',                                   // 負担者番号
    recipient: '',                                  // 受給者番号
    startDate: '',                                  // 開始日
    expiredDate: '',                                // 有効期限
    paymentRatio: {
        value: '',                                  // 負担率または負担金
        attr: {
            ratioType: ''                           // MML0032
        }
    }
};
********************************************************************************/

module.exports = {

    // insuranceClass
    buildInsuranceClass: function (target, arr) {
        arr.push('<mmlHi:insuranceClass');
        arr.push(' mmlHi:ClassCode=');
        arr.push(utils.addQuote(target.attr.ClassCode));
        arr.push(' mmlHi:tableId=');
        arr.push(utils.addQuote(target.attr.tableId));
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHi:insuranceClass>');
    },

    // insuranceNumber
    buildInsuranceNumber: function (target, arr) {
        arr.push('<mmlHi:insuranceNumber>');
        arr.push(target);
        arr.push('</mmlHi:insuranceNumber>');
    },

    // clientId
    buildClientId: function (target, arr) {
        arr.push('<mmlHi:clientId>');
        arr.push('<mmlHi:group>');
        arr.push(target.group);
        arr.push('</mmlHi:group>');
        arr.push('<mmlHi:number>');
        arr.push(target.number);
        arr.push('</mmlHi:number>');
        arr.push('</mmlHi:clientId>');
    },

    // familyClass
    buildFamilyClass: function (target, arr) {
        arr.push('<mmlHi:familyClass>');
        arr.push(target);
        arr.push('</mmlHi:familyClass>');
    },

    // clientInfo
    buildClientInfo: function (target, arr) {
        arr.push('<mmlHi:clientInfo>');

        if (target.hasOwnProperty('personName')) {
            arr.push('<mmlHi:personName>');
            target.personName.forEach((entry) => {
                commonBuilder.buildName(entry, arr);
            });
            arr.push('</mmlHi:personName>');
        }

        if (target.hasOwnProperty('addresses')) {
            arr.push('<mmlHi:addresses>');
            target.addresses.forEach((entry) => {
                commonBuilder.buildAddress(entry, arr);
            });
            arr.push('</mmlHi:addresses>');
        }

        if (target.hasOwnProperty('phones')) {
            arr.push('<mmlHi:phones>');
            target.phones.forEach((entry) => {
                commonBuilder.buildPhone(entry, arr);
            });
            arr.push('</mmlHi:phones>');
        }

        arr.push('</mmlHi:clientInfo>');
    },

    // continuedDiseases
    buildContinuedDiseases: function (target, arr) {
        arr.push('<mmlHi:continuedDiseases>');
        target.forEach((entry) => {
            arr.push('<mmlHi:diseases>');
            arr.push(entry);
            arr.push('</mmlHi:diseases>');
        });
        arr.push('</mmlHi:continuedDiseases>');
    },

    // startDate
    buildStartDate: function (target, arr) {
        arr.push('<mmlHi:startDate>');
        arr.push(target);
        arr.push('</mmlHi:startDate>');
    },

    // expiredDate
    buildExpiredDate: function (target, arr) {
        arr.push('<mmlHi:expiredDate>');
        arr.push(target);
        arr.push('</mmlHi:expiredDate>');
    },

    // paymentInRatio
    buildPaymentInRatio: function (target, arr) {
        arr.push('<mmlHi:paymentInRatio>');
        arr.push(target);
        arr.push('</mmlHi:paymentInRatio>');
    },

    // paymentOutRatio
    buildPaymentOutRatio: function (target, arr) {
        arr.push('<mmlHi:paymentOutRatio>');
        arr.push(target);
        arr.push('</mmlHi:paymentOutRatio>');
    },

    // insuredInfo
    buildInsuredInfo: function (target, arr) {
        arr.push('<mmlHi:insuredInfo>');

        if (target.hasOwnProperty('facility')) {
            arr.push('<mmlHi:facility>');
            commonBuilder.buildFacility(target.facility, arr);
            arr.push('</mmlHi:facility>');
        }

        if (target.hasOwnProperty('addresses')) {
            arr.push('<mmlHi:addresses>');
            target.addresses.forEach((entry) => {
                commonBuilder.buildAddress(entry, arr);
            });
            arr.push('</mmlHi:addresses>');
        }

        if (target.hasOwnProperty('phones')) {
            arr.push('<mmlHi:phones>');
            target.phones.forEach((entry) => {
                commonBuilder.buildPhone(entry, arr);
            });
            arr.push('</mmlHi:phones>');
        }

        arr.push('</mmlHi:insuredInfo>');
    },

    // workInfo
    buildWorkInfo: function (target, arr) {
        arr.push('<mmlHi:workInfo>');

        if (target.hasOwnProperty('facility')) {
            arr.push('<mmlHi:facility>');
            commonBuilder.buildFacility(target.facility, arr);
            arr.push('</mmlHi:facility>');
        }

        if (target.hasOwnProperty('addresses')) {
            arr.push('<mmlHi:addresses>');
            target.addresses.forEach((entry) => {
                commonBuilder.buildAddress(entry, arr);
            });
            arr.push('</mmlHi:addresses>');
        }

        if (target.hasOwnProperty('phones')) {
            arr.push('<mmlHi:phones>');
            target.phones.forEach((entry) => {
                commonBuilder.buildPhone(entry, arr);
            });
            arr.push('</mmlHi:phones>');
        }

        arr.push('</mmlHi:workInfo>');
    },

    // publicInsurance
    buildPublicInsurance: function (target, arr) {
        arr.push('<mmlHi:publicInsurance>');
        target.forEach((entry) => {
            arr.push('<mmlHi:publicInsuranceItem');
            arr.push(' mmlHi:priority=');
            arr.push(utils.addQuote(entry.attr.priority));
            arr.push('>');

            if (entry.hasOwnProperty('providerName')) {
                arr.push('<mmlHi:providerName>');
                arr.push(entry.providerName);
                arr.push('</mmlHi:providerName>');
            }

            arr.push('<mmlHi:provider>');
            arr.push(entry.provider);
            arr.push('</mmlHi:provider>');

            arr.push('<mmlHi:recipient>');
            arr.push(entry.recipient);
            arr.push('</mmlHi:recipient>');

            arr.push('<mmlHi:startDate>');
            arr.push(entry.startDate);
            arr.push('</mmlHi:startDate>');

            arr.push('<mmlHi:expiredDate>');
            arr.push(entry.expiredDate);
            arr.push('</mmlHi:expiredDate>');

            if (entry.hasOwnProperty('paymentRatio')) {
                arr.push('<mmlHi:paymentRatio');
                arr.push(' mmlHi:ratioType=');
                arr.push(utils.addQuote(entry.paymentRatio.attr.ratioType));
                arr.push('>');
                arr.push(entry.paymentRatio.value);
                arr.push('</mmlHi:paymentRatio>');
            }

            arr.push('</mmlHi:publicInsuranceItem>');
        });
        arr.push('</mmlHi:publicInsurance>');
    },

    build: function (target, arr) {

        arr.push('<mmlHi:HealthInsuranceModule');
        if (target.hasOwnProperty('attr')) {
            arr.push(' mmlHi:countryType=');
            arr.push(utils.addQuote(target.attr.countryType));
        }
        arr.push('>');

        // insuranceClass
        if (target.hasOwnProperty('insuranceClass')) {
            this.buildInsuranceClass(target.insuranceClass, arr);
        }

        // insuranceNumber
        this.buildInsuranceNumber(target.insuranceNumber, arr);

        // clientId
        this.buildClientId(target.clientId, arr);

        // familyClass
        this.buildFamilyClass(target.familyClass, arr);

        // clientInfo
        if (target.hasOwnProperty('clientInfo')) {
            this.buildClientInfo(target.clientInfo, arr);
        }

        // continuedDiseases
        if (target.hasOwnProperty('continuedDiseases')) {
            this.buildContinuedDiseases(target.continuedDiseases, arr);
        }

        // startDate
        this.buildStartDate(target.startDate, arr);

        // expiredDate
        this.buildExpiredDate(target.expiredDate, arr);

        // paymentInRatio
        if (target.hasOwnProperty('paymentInRatio')) {
            this.buildPaymentInRatio(target.paymentInRatio, arr);
        }

        // paymentOutRatio
        if (target.hasOwnProperty('paymentOutRatio')) {
            this.buildPaymentOutRatio(target.paymentOutRatio, arr);
        }

        // insuredInfo
        if (target.hasOwnProperty('insuredInfo')) {
            this.buildInsuredInfo(target.insuredInfo, arr);
        }

        // workInfo
        if (target.hasOwnProperty('workInfo')) {
            this.buildWorkInfo(target.workInfo, arr);
        }

        // publicInsurance
        if (target.hasOwnProperty('publicInsurance')) {
            this.buildPublicInsurance(target.publicInsurance, arr);
        }

        arr.push('</mmlHi:HealthInsuranceModule>');
    },

    deleteInstance: function (arr) {
        arr.push('<mmlHi:HealthInsuranceModule/>');
    }
};
