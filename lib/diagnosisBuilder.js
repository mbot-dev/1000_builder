'use strict';

const utils = require('../lib/utils');

/******************************************************************************

// 診断履歴モジュール
var RegisteredDiagnosisModule = {

   diagnosis: {
      value: '',                             // 疾患名．修飾語を含めて病名全体を格納する
      attr: {
         code: '',                           // 疾患コード
         system: ''                          // 疾患コード体系名
      }
   },
   diagnosisContents: [],                    // 病名を，幹病名や修飾語の要素に分けて格納する．上記とどちらか一方のみを選択．
   categories: [],                           // 診断名の分類
   startDate: 'YYYY-MM-DD',                  // 疾患開始日
   endDate: 'YYYY-MM-DD',                    // 疾患終了日
   outcome: '',                              // 転帰．テーブル MML0016 を使用
   firstEncounterDate: 'YYYY-MM-DD',         // 疾患の初診日
   relatedHealthInsurance: {                 // 関連する健康保険情報 empty tag
      attr: {
         uid: ''                             // 疾患に関連する保険の mmlHi:HealthInsuranceModule の uid を記載する
      }
   }
};

// 繰り返しのためのエレメント
var dxItem = [];

// 疾患要素名
var name = {
   value: '',                                // 疾患要素名
   attr: {
      code: ''                               // 疾患コード
   }
};

// 分類名
var category = {
   value: '',                                // 分類名
   attr: {
      tableId: ''                            // MML0012 から 0015 を使用
   }
};
*******************************************************************************/

exports.build = (rd, array) => {

    // 下記は未使用
    // diagnosisContents
    // firstEncounterDate
    // relatedHealthInsurance
    array.push('<mmlRd:RegisteredDiagnosisModule>');

    // diagnosis
    array.push('<mmlRd:diagnosis');
    if (utils.isDefined(rd.diagnosis.attr)) {
        if (utils.isDefined(rd.diagnosis.attr.code)) {
            array.push(' mmlRd:code=');
            array.push(utils.addQuote(rd.diagnosis.attr.code));
        }
        if (utils.isDefined(rd.diagnosis.attr.system)) {
            array.push(' mmlRd:system=');
            array.push(utils.addQuote(rd.diagnosis.attr.system));
        }
    }

    array.push('>');
    array.push(rd.diagnosis.value);
    array.push('</mmlRd:diagnosis>');

    // categories
    if (utils.isDefined(rd.categories)) {
        array.push('<mmlRd:categories>');
        rd.categories.forEach((entry) => {
            array.push('<mmlRd:category');
            array.push(' mmlRd:tableId=');
            array.push(utils.addQuote(entry.attr.tableId));
            array.push('>');
            array.push(entry.value);
            array.push('</mmlRd:category>');
        });
        array.push('</mmlRd:categories>');
    }

    // startDate
    if (utils.isDefined(rd.startDate)) {
        array.push('<mmlRd:startDate>');
        array.push(rd.startDate);
        array.push('</mmlRd:startDate>');
    }

    // endDate
    if (utils.isDefined(rd.endDate)) {
        array.push('<mmlRd:endDate>');
        array.push(rd.endDate);
        array.push('</mmlRd:endDate>');
    }

    // outcome
    if (utils.isDefined(rd.outcome)) {
        array.push('<mmlRd:outcome>');
        array.push(rd.outcome);
        array.push('</mmlRd:outcome>');
    }

    array.push('</mmlRd:RegisteredDiagnosisModule>');
};
