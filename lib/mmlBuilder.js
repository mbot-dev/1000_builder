'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');
const docInfoBuilder = require('../lib/docInfoBuilder');
const patientBuilder = require('../lib/patientBuilder');
const healthInsuranceBuilder = require('../lib/healthInsuranceBuilder');
const diagnosisBuilder = require('../lib/diagnosisBuilder');
const lifestyleBuilder = require('../lib/lifestyleBuilder');
const baseClinicBuilder = require('../lib/baseClinicBuilder');
const firstClinicBuilder = require('../lib/firstClinicBuilder');
const progressCourseBuilder = require('../lib/progressCourseBuilder');
const surgeryBuilder = require('../lib/surgeryBuilder');
const summaryBuilder = require('../lib/summaryBuilder');
const labTestBuilder = require('../lib/labTestBuilder');
const reportBuilder = require('../lib/reportBuilder');
const referralBuilder = require('../lib/referralBuilder');
const vitalSignBuilder = require('../lib/vitalSignBuilder');
const flowsheetBuilder = require('../lib/flowSheetBuilder');
const prescriptionBuilder = require('../lib/prescriptionBuilder');
const injectionBuilder = require('../lib/injectionBuilder');
const hemoDialysisBuilder = require('../lib/hemoDialysisBuilder');

const BUILDERS = {
    patientInfo: patientBuilder,
    healthInsurance: healthInsuranceBuilder,
    registeredDiagnosis: diagnosisBuilder,
    lifestyle: lifestyleBuilder,
    baseClinic: baseClinicBuilder,
    firstClinic: firstClinicBuilder,
    progressCourse: progressCourseBuilder,
    surgery: surgeryBuilder,
    summary: summaryBuilder,
    test: labTestBuilder,
    report: reportBuilder,
    referral: referralBuilder,
    vitalsign: vitalSignBuilder,
    flowsheet: flowsheetBuilder,
    prescription: prescriptionBuilder,
    injection: injectionBuilder,
    hemodialysis: hemoDialysisBuilder
};

/*******************************************************************************

// MMモジュール
var MML = {
   attr: {
      createDate: 'YYYY-MM-DDTHH:mm:ss'
   },
   MmlHeader: {},
   MmlBody: {
      MmlModuleItem: []
   }
};

var MmlHeader = {
   CreatorInfo: {},                             // 生成者識別情報．構造は MML 共通形式 (作成者情報形式) 参照．
   masterId: {                                  // 患者主 ID
      Id: {}                                    // 構造は MML 共通形式 (Id 形式) 参照
   },
   toc: [],                                     // tocItem の配列
   scopePeriod: {                               // MML 本文全体の対象期間
      attr: {
         start: 'YYYY-MM-DD',                   // 開始日
         end: 'YYYY-MM-DD',                     // 終了日
         hasOtherInfo: false,                   // 期間外情報の有無．true：あり，false：なし
         isExtract: false,                      // 情報抽出の有無．true：あり，false：なし
         extractPolicy: ''                      // 抽出のポリシー
      }
   },
   encryptInfo: ''                              // 電子署名などの暗号化情報
};

var tocItem = '';                               // モジュール定義 URI

var ModuleItem = {
   docInfo: {},                                 // docInfo
   content: {}                                  // MML Module
};
********************************************************************************/

const NAME_SPACE = [
    'xmlns="http://www.medxml.net/MML/v4/base/1.0"',
    'xmlns:mml="http://www.medxml.net/MML/v4/base/1.0"',
    'xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    'xmlns:mmlAd="http://www.medxml.net/MML/v4/SharedComponent/Address/1.0"',
    'xmlns:mmlPh="http://www.medxml.net/MML/v4/SharedComponent/Phone/1.0"',
    'xmlns:mmlCm="http://www.medxml.net/MML/v4/SharedComponent/Common/1.0"',
    'xmlns:mmlNm="http://www.medxml.net/MML/v4/SharedComponent/Name/1.0"',
    'xmlns:mmlFc="http://www.medxml.net/MML/v4/SharedComponent/Facility/1.0"',
    'xmlns:mmlDp="http://www.medxml.net/MML/v4/SharedComponent/Department/1.0"',
    'xmlns:mmlPsi="http://www.medxml.net/MML/v4/SharedComponent/PersonalizedInfo/1.0"',
    'xmlns:mmlCi="http://www.medxml.net/MML/v4/SharedComponent/CreatorInfo/1.0"',
    'xmlns:mmlSc="http://www.medxml.net/MML/v4/SharedComponent/Security/1.0"',
    'xmlns:mmlPi="http://www.medxml.net/MML/v4/ContentModule/PatientInfo/1.0"',
    'xmlns:mmlBc="http://www.medxml.net/MML/v4/ContentModule/BaseClinic/1.0"',
    'xmlns:mmlFcl="http://www.medxml.net/MML/v4/ContentModule/FirstClinic/1.0"',
    'xmlns:mmlHi="http://www.medxml.net/MML/v4/ContentModule/HealthInsurance/1.1"',
    'xmlns:mmlLs="http://www.medxml.net/MML/v4/ContentModule/Lifestyle/1.0"',
    'xmlns:mmlPc="http://www.medxml.net/MML/v4/ContentModule/ProgressCourse/1.0"',
    'xmlns:mmlRd="http://www.medxml.net/MML/v4/ContentModule/RegisteredDiagnosis/1.0"',
    'xmlns:mmlSg="http://www.medxml.net/MML/v4/ContentModule/Surgery/1.0"',
    'xmlns:mmlSm="http://www.medxml.net/MML/v4/ContentModule/Summary/1.0"',
    'xmlns:mmlLb="http://www.medxml.net/MML/v4/ContentModule/test/1.0"',
    'xmlns:mmlRp="http://www.medxml.net/MML/v4/ContentModule/report/1.0"',
    'xmlns:mmlRe="http://www.medxml.net/MML/v4/ContentModule/Referral/1.0"',
    'xmlns:mmlVs="http://www.medxml.net/MML/v4/ContentModule/VitalSign/1.0"',
    'xmlns:mmlFs="http://www.medxml.net/MML/v4/ContentModule/FlowSheet/1.0"',
    'xmlns:mmlPs="http://www.medxml.net/MML/v4/ContentModule/Prescription/1.0"',
    'xmlns:mmlInj="http://www.medxml.net/MML/v4/ContentModule/Injection/1.0"',
    'xmlns:mmlHd="http://www.medxml.net/MML/v4/ContentModule/Hemodialysis/1.0"',
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    'xsi:schemaLocation="http://www.medxml.net/MML/v4/base/1.0/mml.xs"'
];

module.exports = {

    buildMasterId: function(target, arr) {
        arr.push('<masterId>');
        commonBuilder.buildId(target.Id, arr);
        arr.push('</masterId>');
    },

    buildScopePeriod: function(target, arr) {
        arr.push('<scopePeriod');
        if (target.attr.hasOwnProperty('start')) {
            arr.push(' start=');
            arr.push(utils.addQuote(target.attr.start));
        }
        if (target.attr.hasOwnProperty('end')) {
            arr.push(' end=');
            arr.push(utils.addQuote(target.attr.end));
        }
        if (target.attr.hasOwnProperty('hasOtherInfo')) {
            arr.push(' hasOtherInfo=');
            arr.push(utils.addQuote(target.attr.hasOtherInfo));
        }
        if (target.attr.hasOwnProperty('isExtract')) {
            arr.push(' isExtract=');
            arr.push(utils.addQuote(target.attr.isExtract));
        }
        if (target.attr.hasOwnProperty('extractPolicy')) {
            arr.push(' start=');
            arr.push(utils.addQuote(target.attr.extractPolicy));
        }
        arr.push('/>');
    },

    buildHeader: function(target, arr) {
        arr.push('<MmlHeader>');
        commonBuilder.buildCreatorInfo(target.CreatorInfo, arr);
        this.buildMasterId(target.masterId, arr);
        if (target.hasOwnProperty('scopePeriod')) {
            this.buildScopePeriod(target.scopePeriod, arr);
        }
        if (target.hasOwnProperty('encryptInfo')) {
            arr.push('<encryptInfo>');
            arr.push(target.encryptInfo);
            arr.push('</encryptInfo>');
        }
        arr.push('</MmlHeader>');
    },

    buildNameSpace: function(arr) {
        NAME_SPACE.forEach ((entry) => {
            arr.push(' ');
            arr.push(entry);
            arr.push('\n');
        });
        arr.pop();
    },

    build: function(target, deleteInstance) {
        var arr = [];
        arr.push('<?xml version="1.0" encoding="UTF-8"?>');
        arr.push('<Mml version="4.1.2" createDate=');
        arr.push(utils.addQuote(target.attr.createDate));
        this.buildNameSpace(arr);
        arr.push('>');
        this.buildHeader(target.MmlHeader, arr);
        arr.push('<MmlBody>');
        target.MmlBody.MmlModuleItem.forEach((entry) => {
            arr.push('<MmlModuleItem type=');
            arr.push(utils.addQuote(entry.docInfo.attr.contentModuleType));
            arr.push('>');
            docInfoBuilder.build(entry.docInfo, arr);
            arr.push('<content>');
            if (deleteInstance) {
              BUILDERS[entry.docInfo.attr.contentModuleType].deleteInstance(arr);
            } else {
              BUILDERS[entry.docInfo.attr.contentModuleType].build(entry.content, arr);
            }
            arr.push('</content>');
            arr.push('</MmlModuleItem>');
        });
        arr.push('</MmlBody>');
        arr.push('</Mml>');
        // return utils.formatXml(arr.join(''));
        return arr.join('');
    }
};
