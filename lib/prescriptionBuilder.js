"use strict";

const utils = require('../lib/utils');

/*******************************************************************************

// 処方せんモジュール
var PrescriptionModule = {
   issuedTo: '',                          // 院外、院内処方箋の別。院外処方の場合にはexternal、院内処方の場合にはinternalと記載する。
   medication: [],                        // 処方箋に記載する薬剤と用量、用法の組み合わせ medicationの配列
   narcoticPrescriptionLicenseNumber: '', // 麻薬施用者番号  麻薬処方箋の場合には麻薬施用者番号及び患者住所を記載する必要がある。
   comment: ''                            // コメント  処方についてのその他コメント
};

// medication
var medication = {
   medicine: {                            // 薬剤名称と対応するコードのセット
      name: '',                           // 薬剤名称
      code: []                            // 薬剤コード medicineCode の配列
   },
   dose: 0,                               // 用量
   doseUnit: '',                          // 用量の単位
   frequencyPerDay: 0,                    // 一日の内服回数  総量のみが記載される外用剤などの場合には省略可
   startDate: 'YYYY-MM-DD',               // 服薬開始日
   duration: 0,                           // 服薬期間（日数） 総量のみが記載される外用剤などの場合には省略可
   instruction: '',                       // 用法指示
   PRN: false,                            // 頓用指示  頓用処方であればtrue, そうでなければfalse
   route: '',                             // 投与経路  経口、経皮、座剤などの別を記載する
   form: '',                              // 剤形  錠剤、散剤、液剤などの別を記載する
   batchNo: 0,                            // 処方番号  処方番号を記載する。これにより用法が共通する薬剤をまとめて一つの処方単位とすることができる。
   brandSubstitutionPermitted: true,      // ジェネリック医薬品への代替可  ジェネリック使用可の場合にはtrue，使用不可の場合にはfalse。省略時にはtrueとみなす
   longTerm: false,                       // 長期処方可  長期処方であればtrue，短期であればfalse
   additionalInstruction: ''              // 追加指示，コメント  用法，用量に関する追加指示。必要に応じて記載する。
};

// 薬剤コード
var medicineCode = {
   value: '',                             // 薬剤コード
   attr: {
      system: ''                          // 用いたコード体系の名称を記載
   }
};

*******************************************************************************/

module.exports = {

    // MedicationのMML
    buildMedication: function(medication) {

        var array = [];
        // medication
        array.push('<mmlPs:medication>');

        // medicine
        array.push('<mmlPs:medicine>');
        // name
        array.push('<mmlPs:name>');
        array.push(medication.medicine.name);
        array.push('</mmlPs:name>');
        // code
        if (medication.medicine.hasOwnProperty('code')) {
            medication.medicine.code.forEach((entry) => {
                array.push('<mmlPs:code mmlPs:system=');
                array.push(utils.addQuote(entry.attr.system));
                array.push('>');
                array.push(entry.value);
                array.push('</mmlPs:code>');
            });
        }
        // medicine
        array.push('</mmlPs:medicine>');

        // dose
        array.push('<mmlPs:dose>');
        array.push(medication.dose);
        array.push('</mmlPs:dose>');

        // doseUnit
        array.push('<mmlPs:doseUnit>');
        array.push(medication.doseUnit);
        array.push('</mmlPs:doseUnit>');

        // frequencyPerDay
        if (medication.hasOwnProperty('frequencyPerDay')) {
            array.push('<mmlPs:frequencyPerDay>');
            array.push(medication.frequencyPerDay);
            array.push('</mmlPs:frequencyPerDay>');
        }

        // startDate
        if (medication.hasOwnProperty('startDate')) {
            array.push('<mmlPs:startDate>');
            array.push(medication.startDate);
            array.push('</mmlPs:startDate>');
        }

        // duration
        if (medication.hasOwnProperty('duration')) {
            array.push('<mmlPs:duration>');
            array.push(medication.duration);
            array.push('</mmlPs:duration>');
        }

        // instruction
        if (medication.hasOwnProperty('instruction')) {
            array.push('<mmlPs:instruction>');
            array.push(medication.instruction);
            array.push('</mmlPs:instruction>');
        }

        // PRN
        if (medication.hasOwnProperty('PRN')) {
            array.push('<mmlPs:PRN>');
            array.push(medication.PRN);
            array.push('</mmlPs:PRN>');
        }

        // route
        if (medication.hasOwnProperty('route')) {
            array.push('<mmlPs:route>');
            array.push(medication.route);
            array.push('</mmlPs:route>');
        }

        // form
        if (medication.hasOwnProperty('form')) {
            array.push('<mmlPs:form>');
            array.push(medication.form);
            array.push('</mmlPs:form>');
        }

        // batchNo
        if (medication.hasOwnProperty('batchNo')) {
            array.push('<mmlPs:batchNo>');
            array.push(medication.batchNo);
            array.push('</mmlPs:batchNo>');
        }

        // brandSubstitutionPermitted
        array.push('<mmlPs:brandSubstitutionPermitted>');
        if (!medication.hasOwnProperty('brandSubstitutionPermitted')) {
            // 省略時は true
            medication.brandSubstitutionPermitted = true;
        }
        array.push(medication.brandSubstitutionPermitted);
        array.push('</mmlPs:brandSubstitutionPermitted>');

        // longTerm
        if (medication.hasOwnProperty('longTerm')) {
            array.push('<mmlPs:longTerm>');
            array.push(medication.longTerm);
            array.push('</mmlPs:longTerm>');
        }

        // mmlPs:additionalInstruction
        if (medication.hasOwnProperty('additionalInstruction')) {
            array.push('<mmlPs:additionalInstruction>');
            array.push(medication.additionalInstruction);
            array.push('</mmlPs:additionalInstruction>');
        }

        array.push('</mmlPs:medication>');

        return array.join('');
    },

    // PrescriptionのMML
    build: function(prescription) {

        var array = [];

        // PrescriptionModule
        array.push('<mmlPs:PrescriptionModule>');

        // issuedTo
        if (prescription.hasOwnProperty('issuedTo')) {
            array.push('<mmlPs:issuedTo>');
            array.push(prescription.issuedTo);
            array.push('</mmlPs:issuedTo>');
        }

        // medication
        prescription.medication.forEach((entry) => {
            array.push(this.buildMedication(entry));
        });

        // narcoticPrescriptionLicenseNumber
        if (prescription.hasOwnProperty('narcoticPrescriptionLicenseNumber')) {
            array.push('<mmlPs:narcoticPrescriptionLicenseNumber>');
            array.push(prescription.narcoticPrescriptionLicenseNumber);
            array.push('</mmlPs:narcoticPrescriptionLicenseNumber>');
        }

        // comment
        if (prescription.hasOwnProperty('comment')) {
            array.push('<mmlPs:comment>');
            array.push(prescription.comment);
            array.push('</mmlPs:comment>');
        }

        // PrescriptionModule
        array.push('</mmlPs:PrescriptionModule>');

        return array.join('');
    }
};
