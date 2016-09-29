'use strict';

const utils = require('../lib/utils');

/*******************************************************************************

// 注射記録モジュール
var InjectionModule = {
   medication: [],                        // 注射された薬剤と用量、用法の組み合わせ
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
   startDateTime: '',                     // 投与開始日時
   endDateTime: '',                       // 投与修了日時 投与を修了した時間を記載する。静注，皮下注，筋注など開始時間と終了時間に差が無いような場合は省略する。
   instruction: '',                       // 用法指示
   route: '',                             // 投与経路 投与する注射ルートを記載する。例：右前腕留置ルート，右鎖骨下中心静脈ルート
   site: '',                              // 投与部位 注射した部位を記載する。例：右上腕三角，腹部
   deliveryMethod: '',                    // 注射方法 注射方法について記載する。例：筋注，皮下注，静注，点滴静注，中心静脈注射
   batchNo: 0,                            // 処方番号  処方番号を記載する。これにより用法が共通する薬剤をまとめて一つの処方単位とすることができる。
   additionalInstruction: ''              // 注射に関する用法，用量に関する追加指示。必要に応じて記載する。
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
    buildMedication: function(medication, array) {
        // medication
        array.push('<mmlInj:medication>');
        // medicine
        array.push('<mmlInj:medicine>');
        // name
        array.push('<mmlInj:name>');
        array.push(medication.medicine.name);
        array.push('</mmlInj:name>');
        // code
        if (medication.medicine.hasOwnProperty('code')) {
            medication.medicine.code.forEach((entry) => {
                //array.push('<mmlPs:code mmlPs:system=');
                array.push('<mmlInj:code mmlInj:system=');
                array.push(utils.addQuote(entry.attr.system));
                array.push('>');
                array.push(entry.value);
                array.push('</mmlInj:code>');
            });
        }
        // medicine
        array.push('</mmlInj:medicine>');
        // dose
        array.push('<mmlInj:dose>');
        array.push(medication.dose);
        array.push('</mmlInj:dose>');
        // doseUnit
        array.push('<mmlInj:doseUnit>');
        array.push(medication.doseUnit);
        array.push('</mmlInj:doseUnit>');
        // startDateTime
        if (medication.hasOwnProperty('startDateTime')) {
            array.push('<mmlInj:startDateTime>');
            array.push(medication.startDateTime);
            array.push('</mmlInj:startDateTime>');
        }
        // endDateTime
        if (medication.hasOwnProperty('endDateTime')) {
            array.push('<mmlInj:endDateTime>');
            array.push(medication.endDateTime);
            array.push('</mmlInj:endDateTime>');
        }
        // instruction
        if (medication.hasOwnProperty('instruction')) {
            array.push('<mmlInj:instruction>');
            array.push(medication.instruction);
            array.push('</mmlInj:instruction>');
        }
        // route
        if (medication.hasOwnProperty('route')) {
            array.push('<mmlInj:route>');
            array.push(medication.route);
            array.push('</mmlInj:route>');
        }
        // site
        if (medication.hasOwnProperty('site')) {
            array.push('<mmlInj:site>');
            array.push(medication.site);
            array.push('</mmlInj:site>');
        }
        // deliveryMethod
        if (medication.hasOwnProperty('deliveryMethod')) {
            array.push('<mmlInj:deliveryMethod>');
            array.push(medication.deliveryMethod);
            array.push('</mmlInj:deliveryMethod>');
        }
        // batchNo
        if (medication.hasOwnProperty('batchNo')) {
            array.push('<mmlInj:batchNo>');
            array.push(medication.batchNo);
            array.push('</mmlInj:batchNo>');
        }
        // mmlPs:additionalInstruction
        if (medication.hasOwnProperty('additionalInstruction')) {
            array.push('<mmlInj:additionalInstruction>');
            array.push(medication.additionalInstruction);
            array.push('</mmlInj:additionalInstruction>');
        }
        array.push('</mmlInj:medication>');
    },

    // PrescriptionのMML
    build: function(injection, array) {
        // PrescriptionModule
        array.push('<mmlInj:InjectionModule>');

        // medication
        injection.medication.forEach((entry) => {
            this.buildMedication(entry, array);
        });

        // narcoticPrescriptionLicenseNumber
        if (injection.hasOwnProperty('narcoticPrescriptionLicenseNumber')) {
            array.push('<mmlInj:narcoticPrescriptionLicenseNumber>');
            array.push(injection.narcoticPrescriptionLicenseNumber);
            array.push('</mmlInj:narcoticPrescriptionLicenseNumber>');
        }

        // comment
        if (injection.hasOwnProperty('comment')) {
            array.push('<mmlInj:comment>');
            array.push(injection.comment);
            array.push('</mmlInj:comment>');
        }

        // PrescriptionModule
        array.push('</mmlInj:InjectionModule>');
    }
};
