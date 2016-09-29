'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');

/******************************************************************************************

// docInfo
var docInfo = {

   attr: {
      contentModuleType: '',                          // 文書の種類コード MML0005を使用
      moduleVersion: ''                               // 使用モジュールのDTDのURIを記載
   },

   securityLevel: [],                                 // accessRight の配列

   title: {
      value: '',                                      // 文書タイトル
      attr: {
         generationPurpose: ''                        // 文書詳細種別 MML0007を使用
      }
   },

   docId: {                                           // 文書 ID 情報
      uid: '',                                        // 文書ユニークID ユニーク番号の形式は UUID とする (UUID はハイフンを含めた形式とする)
      parentId: [],                                   // 関連親文書ID parentId  の配列
      groupId: []                                     // グループ ID groupIdの配列
   },

   confirmDate: {
      value: 'YYYY-MM-DDThh:mm:ss',                   // カルテ電子保存の確定日時
      attr: {
         start: 'YYYY-MM-DDThh:mm:ss',                // 時系列情報場合の開始日時
         end: 'YYYY-MM-DDThh:mm:ss',                  // 時系列情報場合の終了日時
         firstConfirmDate: 'YYYY-MM-DDThh:mm:ss',     // 修正が発生した場合の，初回確定日時
         eventDate: 'YYYY-MM-DDThh:mm:ss'             // 実際に記載された診療イベントが発生した日時
      }
   },

   CreatorInfo: {},                                   // 個々の文書の作成者情報．構造は MML 共通形式 (作成者情報形式)

   extRefs: []                                        // content 内に記載されているすべての外部リンク情報のリスト extRefの配列

};

// 関連親文書ID
var parentId = {
   value: '',                                         // 関連親文書の ID
   attr: {
      relation: ''                                    // 関連の種別 MML0008から使用
   }
};

// グループID
var groupId = {
   value: '',                                         // グループ ID
   attr: {
      groupClass: ''                                  // モジュールグループの種別 MML0007から使用
   }
};

// アクセス権
var accessRight = {
   attr: {
      permit: '',                                     // 参照の権利 MML0034(none:すべてのアクセスを不許可 read:参照を許可 write:参照、修正を許可 delete:参照、削除を許可 all:参照、修正、削除を許可)
      startDate: 'YYYY-MM-DD',                        // アクセス許可開始日
      endDate: 'YYYY-MM-DD'                           // アクセス許可終了日
   },
   facility: [],                                      // 施設名 facilityName の配列
   department: [],                                    // 診療科名 departmentName の配列
   license: [],                                       // 職種名 licenseName の配列
   person: []                                         // 個人名 personName の配列
};

// 施設名
var facilityName = {
   value: '',                                         // 施設名
   attr: {
      facilityCode: '',                               // 施設アクセス権定義 MML0035
                                                      // all:アクセスを行う全ての施設を対象とする creator:記載者と同じ施設を対象とする
                                                      // experience:被記載者 (患者) の診療歴のある施設を対象とする。診療歴のある施設の選別法は，各アプリケーションに委ねられる
                                                      // individual:施設 ID を個別に指定し，対象とする．+ mmlSc:facilityId，mmlSc:facilityIdType に対象施設を記載する
      tableId: 'MML0035',                             // 施設アクセス権定義に用いられたテーブル名
      facilityId: '',                                 // 施設コード
      facilityIdType: ''                              // 施設コードのマスタ名
   }
};

// 診療科名
var departmentName = {
   value: '',                                         // 診療科名
   attr: {
      departmentCode: '',                             // 診療科コード MML0028を使用
      tableId: 'MML0028'                              // 診療科コード体系名
   }
};

// 職種名
var licenseName = {
   value: '',                                         // 職種名
   attr: {
      licenseCode: '',                                // 職種コード MML0026を使用
      tableId: 'MML0026'                              // 職種コード体系名
   }
};

// 個人名
var personName = {
   value: '',                                         // 個人名
   attr: {
      personCode: '',                                 // 個人アクセス権定義 MML0036を使用
                                                      // all:アクセスを行う全ての個人を対象とする creator:記載者を対象とする patient:被記載者 (患者) 本人を対象とする
                                                      // individual:個人 ID を個別に指定し，対象とする。mmlSc:personId，mmlSc:personIdType に対象者を記載する
      tableId: 'MML0036',
      personId: '',                                   // 個人ID
      personIdType: ''                                // 個人ID のマスタ名 ToDo
   }
};

// ex. 記載者施設に無期限全ての権限を与える
var accessRightForCreatorFacility = {
   attr: {
      permit: 'all'
   },
   facility: [{
      attr: {
         facilityCode: 'creator',
         tableId: 'MML0035'
      },
      value: '記載者施設'
   }]
};

// ex. 診療歴のある施設と患者を対象に無期限でread権限を与える
var accessRightForExperienceFacilityAndPatient = {
   attr: {
      permit: 'read'
   },
   facility: [{
      attr: {
         facilityCode: 'experience',
         tableId: 'MML0035'
      },
      value: '診療歴のある施設'
   }],
   person: [{
      attr: {
         personCode: 'patient',
         tableId: 'MML0036',
         personId: '12345',                           // 患者ID
         personIdType: 'dolphinUserId_2001-10-03'     // ToDo
      },
      value: '患者氏名'
   }]
};

*******************************************************/

module.exports = {

    buildAccessRight: function(target, arr) {
        arr.push('<mmlSc:accessRight');
        arr.push(' permit=');
        arr.push(utils.addQuote(target.attr.permit));
        if (target.attr.hasOwnProperty('startDate')) {
            arr.push(' startDate=');
            arr.push(utils.addQuote(target.attr.startDate));
        }
        if (target.attr.hasOwnProperty('endDate')) {
            arr.push(' endDate=');
            arr.push(utils.addQuote(target.attr.endDate));
        }
        arr.push('>');
        if (target.hasOwnProperty('facility')) {
            arr.push('<mmlSc:facility>');
            target.facility.forEach((entry) => {
                arr.push('<mmlSc:facilityName');
                arr.push(' mmlSc:facilityCode=');
                arr.push(utils.addQuote(entry.attr.facilityCode));
                if (entry.attr.hasOwnProperty('facilityId')) {
                    arr.push(' mmlSc:facilityId=');
                    arr.push(utils.addQuote(entry.attr.facilityId));
                }
                if (entry.attr.hasOwnProperty('facilityIdType')) {
                    arr.push(' mmlSc:facilityIdType=');
                    arr.push(utils.addQuote(entry.attr.facilityIdType));
                }
                arr.push('>');
                arr.push(entry.value);
                arr.push('</mmlSc:facilityName>');
            });
            arr.push('</mmlSc:facility>');
        }
        if (target.hasOwnProperty('department')) {
            arr.push('<mmlSc:department>');
            target.department.forEach((entry) => {
                arr.push('<mmlSc:departmentName');
                arr.push(' mmlSc:departmentCode=');
                arr.push(utils.addQuote(entry.attr.departmentCode));
                if (entry.attr.hasOwnProperty('tableId')) {
                    arr.push(' mmlSc:tableId=');
                    arr.push(utils.addQuote(entry.attr.tableId));
                }
                arr.push('>');
                arr.push(entry.value);
                arr.push('</mmlSc:departmentName>');
            });
            arr.push('</mmlSc:department>');
        }
        if (target.hasOwnProperty('license')) {
            arr.push('<mmlSc:license>');
            target.license.forEach((entry) => {
                arr.push('<mmlSc:licenseName');
                arr.push(' mmlSc:licenseCode=');
                arr.push(utils.addQuote(entry.attr.licenseCode));
                if (entry.attr.hasOwnProperty('tableId')) {
                    arr.push(' mmlSc:tableId=');
                    arr.push(utils.addQuote(entry.attr.tableId));
                }
                arr.push('>');
                arr.push(entry.value);
                arr.push('<mmlSc:licenseName');
            });
            // arr.push('>');
            // arr.push(entry.value);
            arr.push('</mmlSc:license>');
        }
        if (target.hasOwnProperty('person')) {
            arr.push('<mmlSc:person>');
            target.person.forEach((entry) => {
                arr.push('<mmlSc:personName');
                arr.push(' mmlSc:personCode=');
                arr.push(utils.addQuote(entry.attr.personCode));
                if (entry.attr.hasOwnProperty('personId')) {
                    arr.push(' mmlSc:personId=');
                    arr.push(utils.addQuote(entry.attr.personId));
                }
                if (entry.attr.hasOwnProperty('personIdType')) {
                    arr.push(' mmlSc:personIdType=');
                    arr.push(utils.addQuote(entry.attr.personIdType));
                }
                arr.push('>');
                arr.push(entry.value);
                arr.push('</mmlSc:personName>');
            });
            arr.push('</mmlSc:person>');
        }
        arr.push('</mmlSc:accessRight>');
    },

    buildSecurityLevel: function(target, arr) {
        arr.push('<mmlSc:securityLevel>');
        target.forEach((entry) => {
            this.buildAccessRight(entry, arr);
        });
        arr.push('</mmlSc:securityLevel>');
    },

    buildTitle: function(target, arr) {
        arr.push('<title');
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('generationPurpose')) {
            arr.push(' generationPurpose=');
            arr.push(utils.addQuote(target.attr.generationPurpose));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</title>');
    },

    buildDocId: function(target, arr) {
        arr.push('<docId>');
        arr.push('<uid>');
        arr.push(target.uid);
        arr.push('</uid>');
        if (target.hasOwnProperty('parentId')) {
            target.parentId.forEach((entry) => {
                arr.push('<parentId');
                if (entry.hasOwnProperty('attr') &&  entry.attr.hasOwnProperty('relation')) {
                    arr.push(' relation=');
                    arr.push(utils.addQuote(entry.attr.relation));
                }
                arr.push('>');
                arr.push(entry.value);
                arr.push('</parentId>');
            });
        }
        if (target.hasOwnProperty('groupId')) {
            target.groupId.forEach((entry) => {
                arr.push('<groupId');
                if (entry.hasOwnProperty('attr') &&  entry.attr.hasOwnProperty('groupClass')) {
                    arr.push(' groupClass=');
                    arr.push(utils.addQuote(entry.attr.groupClass));
                }
                arr.push('>');
                arr.push(entry.value);
                arr.push('</groupId>');
            });
        }
        arr.push('</docId>');
    },

    buildConfirmDate: function(target, arr) {
        arr.push('<confirmDate');
        if (target.hasOwnProperty('attr')) {
            if (target.attr.hasOwnProperty('start')) {
                arr.push(' start=');
                arr.push(utils.addQuote(target.attr.start));
            }
            if (target.attr.hasOwnProperty('end')) {
                arr.push(' end=');
                arr.push(utils.addQuote(target.attr.end));
            }
            if (target.attr.hasOwnProperty('firstConfirmDate')) {
                arr.push(' firstConfirmDate=');
                arr.push(utils.addQuote(target.attr.firstConfirmDate));
            }
            if (target.attr.hasOwnProperty('eventDate')) {
                arr.push(' eventDate=');
                arr.push(utils.addQuote(target.attr.eventDate));
            }
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</confirmDate>');
    },

    buildExtRefs: function(target, arr) {
        arr.push('<extRefs>');
        target.forEach((entry) => {
            commonBuilder.buildExtRef(entry, arr);
        });
        arr.push('</extRefs>');
    },

    build: function(target, arr) {
        arr.push('<docInfo');
        if (target.hasOwnProperty('attr')) {
            if (target.attr.hasOwnProperty('contentModuleType')) {
                arr.push(' contentModuleType=');
                arr.push(utils.addQuote(target.attr.contentModuleType));
            }
            if (target.attr.hasOwnProperty('moduleVersion')) {
                arr.push(' moduleVersion=');
                arr.push(utils.addQuote(target.attr.moduleVersion));
            }
        }
        arr.push('>');
        this.buildSecurityLevel(target.securityLevel, arr);
        this.buildTitle(target.title, arr);
        this.buildDocId(target.docId, arr);
        this.buildConfirmDate(target.confirmDate, arr);
        commonBuilder.buildCreatorInfo(target.CreatorInfo, arr);
        this.buildExtRefs(target.extRefs, arr);
        arr.push('</docInfo>');
    }
};
