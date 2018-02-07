'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');
const patientBuilder = require('../lib/patientBuilder');

/*******************************************************************************
var simpleHemoDialysis = {
    version: '',                                // バージョン
    createDate: '',                             // 作成日 xs:dateTime
    hemoDialysis: [],                           // 透析情報 * [hemoDialysis]
    heMX: []                                    // HeMX * [heMX]
};

var hemoDialysis = {                            // このモジュールには透析に関するオーダー、実施内容、検査結果が含まれる
    facility: {},                               // 施設情報、構造はMML共通形式を参照 simpleFacility
    patient: {},                                // 患者情報、構造はmmlPi:PatientModuleを参照 simplePatient
    note: '',                                   // 透析コメント ?
    historySection: {},                         // 透析履歴 ? historySection
    orderSection: {},                           // 透析指示情報 ? orderSection
    progressSection: {},                        // 透析記録情報 ? progressSection
    testResultSection: {}                       // 透析関連検査結果情報 ? testResultSection
};

var historySection = {
    introduction: [],                           // 透析導入情報 * introduction obj.
    bloodAccess: []                             // ブラッドアクセス * bloodAccess obj
};

var introduction = {                            // 透析導入情報
    diagnosis: [],                              // 原疾患 * [diagnosis]
    introDate: ''                               // 透析導入日 ? xs:date
    facility: {}                                // 構造はMML共通形式(mmlFc:Facility)を参照 simpleFacility
};

var diagnosis = {
    value: '',                                  // 原疾患
    code: '',                                   // 疾患コード ?
    system: ''                                  // 疾患コード体系名
};

var bloodAccess = {
    baStatus: '',                               // ブラッドアクセス状態 良: active,不良: inactive ?
    dateMade: '',                               // ブラッドアクセス作成日 ? xs:date
    dateFirstUse: '',                           // ブラッドアクセス使用開始日 ? xs:date
    dateEnd: '',                                // ブラッドアクセス使用終了日 ? xs:date
    location: {},                               // ブラッドアクセス部位名、漢字を推奨 ? location
};

var location = {
    value: '',                                  // ブラッドアクセス部位名、漢字を推奨
    code: '',                                   // ブラッドアクセスID ?
    tableId: ''                                 // テーブルID
};

var orderSection = {                            // 透析指示情報
    orders: [],                                 // オーダー単位 * [orders]
    dailyOrder: []                              // 日々指示 * [dailyOrder]
};

var orders = {                                  // オーダー単位
    orderStatus: '',                            // オーダ状態を識別するフラグ 現行オーダー: active, 変更オーダー: alteration
    dateOrdered: '',                            // オーダー発行日 ? xs:date
    dateEffective: '',                          // 変更オーダー発行日 ? xs:date
    orderGroups: []                             // オーダーグループ + [orderGroups]
};

var orderGroups = {
    effectiveDays: {},                          // 実効曜日 ?
    timeShift: {},                              // 透析シフト名称 ?
    method: [],                                 // 血液浄化方法 * [method]
    dryWeight: {},                              // ドライウエイト ?
    weightCorrection: {},                       // 重量補正 ?
    bloodFlow: [],                              // 血液流量 *
    dialyser: {},                               // ダイアライザー名称 ?
    dialysate: [],                              // 透析液 *
    dialysateFlow: [],                          // 透析液流量 *
    dialysateTemp: [],                          // 透析液温度 *
    substitution: [],                           // 補充液 *
    needle: [],                                 // 穿刺針名称 *
    medication: [],                             // 投薬 *
    injection: [],                              // 注射 *
    note: '',                                   // 備考 ?
};

var effectiveDays = {
    weekday: []                                 // オーダ適用曜日 * [string]
};

var timeShift = {
    value: '',                                  // 透析シフト名称
    code: '',                                   // 時間帯コード ?
    tableId: ''                                 // テーブルID
};

var method = {                                  // 血液浄化方法
    methodName: {},                             // 血液浄化方法名称 methodName obj.
    timeHdStart: {},                            // 開始時刻 ? timeHdStart obj.
    timeHdEnd: {}                               // 終了時刻 ? timeHdEnd obj.
};

var methodName = {
    value: '',                                  // 血液浄化方法名称
    code: '',                                   // 血液浄化コード ?
    tableId: ''                                 // テーブルID
};

var timeHdStart = {
    value: '',                                  // 開始時刻 xs:duration vs. xs:date
    timeDirection: ''                           // 時間方向 開始時刻前: before, 開始時刻後: after
};

var timeHdEnd = {
    value: '',                                  // 終了時刻 xs:duration vs xs:date
    timeDirection: ''                           // 時間方向 開始時刻前: before, 開始時刻後: after
};

var dryWeight = {
    value: 0,                                   // ドライウエイト xs:decimal
    unit: ''                                    // 単位 ? default=kg
};

var weightCorrection = {
    value: 0,                                   // 重量補正 xs:decimal
    unit: '',                                   // 単位 ? default=kg
    cnote: ''                                   // コメント ?
};

var bloodFlow = {
    flowRate: {},                               // 血液流量数値 flowRate obj.
    timeHdStart: {},                            // 開始時刻 ? timeHdStart obj.
    timeHdEnd: {}                               // 終了時刻 ? timeHdEnd obj.
};

var flowRate = {
    value: 0,                                   // 血液流量数値 xs:decimal
    unit: ''                                    // 単位 ? default=ml/min
};

var dialyser = {
    value: '',                                  // ダイアライザー名称 ?
    code: '',                                   // ダイアライザーID ?
    type: '',                                   // コードの種類、当面は製品番号を使用 ?
    membraneArea: 0,                            // 膜面積 ? xs:decimal
    unit: ''                                    // 単位 ? default=m2
};

var dialysate = {
    dialysateName: {},                          // 透析液 dialysateName obj.
    timeHdStart: {},                            // 開始時刻 ? timeHdStart
    timeHdEnd: {}                               // 終了時刻 ? timeHdEnd
};

var dialysateName = {
    value: '',                                  // 透析液名称
    code: '',                                   // 透析液ID ?
    type: '',                                   // コードの種類、当面は薬価コードを使用 ?
    modification: ''                            // 透析液調製 ?
};

var dialysateFlow = {
    flowRate: {},                               // 透析液流量数値 flowRate obj.
    timeHdStart: {},                            // 開始時刻 ? timeHdStart obj.
    timeHdEnd: {}                               // 終了時刻 ? timeHdEnd obj.
};

var dialysateFlowRate = {
    value: 0,                                   // 透析液流量数値
    unit: ''                                    // 単位 default=ml/min
};

var dialysateTemp = {
    dialysateTempValue: {},                     // 透析液温度数値 dialysateTempValue obj.
    timeHdStart: {},                            // 開始時刻 ? timeHdStart obj.
    timeHdEnd: {}                               // 終了時刻 ? timeHdEnd obj.
};

var dialysateTempValue = {
    value: 0,                                   // 透析液温度数値 xs:decimal
    unit: ''                                    // 単位 ? default=C
};

var substitution = {                            // 補充液
    substitutionValue: {},                      // 補充液量 substitutionValue obj.
    timeHdStart: {},                            // 開始時刻 ? timeHdStart obj.
    timeHdEnd: {}                               // 終了時刻 ? timeHdEnd obj.
};

var substitutionValue = {
    value: 0,                                   // 補充液量 xs:decimal
    unit: '',                                   // 単位
    dilution: ''                                //
};

var needle = {
    value: '',                                  // 穿刺針名称
    code: '',                                   // 穿刺針ID ?
    type: '',                                   // コードの種類、当面は製品番号を使用 ?
    position: ''                                // 使用部位 ?
};

var medication = {
    drugName: {},                               // 薬剤名称 ? drugName obj.
    dose: {},                                   // １回量 ? dose obj.
    timeHd: {},                                 // 投与時刻 ? timeHd obj.
    note: ''                                    // 備考 ?
};

var drugName = {
    value: '',                                  // 薬剤名称
    code: '',                                   // 内服薬ID ?
    type: ''                                    // コードの種類、当面は薬価コードを使用
};

var dose = {
    value: 0,                                   // １回量
    unit: ''                                    // 単位 ?
};

var timeHd = {
    value: '',                                  // 投与時刻 xs:duration vs. dateTime
    timeDirection: ''                           // 時間方向 開始時刻前: before, 開始時刻後: after
};

var injection = {                               // 注射
    drugName: {},                               // 注射薬名称 ? drugName
    dose: {},                                   // １回量または投与速度 ? dose
    timeHdStart: {},                            // 投与開始時 ? timeHdStart
    timeHdEnd: {},                              // 投与終了時間 ? timeHdEnd
    routeName: {},                              // 投与経路名称 ? routeName
    note: ''                                    // 備考 ?
};

var routeName = {
    value: '',                                  // 投与経路名称
    code: '',                                   // 投与経路ID ?
    tableId: ''                                 // hdInjectionRouteTable01
};

var dailyOrder = {                              // 日々指示
    orderDateTime: '',                          // オーダーを発行した日時 ? xs:dateTime
    dateEffective: '',                          // オーダー実行日 ? xs:date
    timeShift: {},                              // 透析シフト名称 ?
    method: [],                                 // 血液浄化方法 *
    targetWeight: {},                           // 目標体重 ?
    targetUF: {},                               // 実施除水量 ?
    ufrPlan: [],                                // 除水速度設定 *
    weightCorrection: {},                       // 重量補正 ?
    bloodFlow: [],                              // 血液流量 *
    dialyser: {},                               // ダイアライザー名称 ?
    dialysate: [],                              // 透析液 *
    dialysateFlow: [],                          // 透析液流量 *
    dialysateTemp: [],                          // 透析液温度 *
    needle: [],                                 // 穿刺針名称 *
    medication: [],                             // 投薬 *
    injection: [],                              // 注射 *
    note: ''                                    // 備考 ?
};

var targetWeight = {
    value: 0,                                   // 目標体重数値 xs:decimal
    unit: ''                                    // 単位 ?　default=kg
};

var targetUF = {
    value: 0,                                   // 実施除水量 xs:decimal
    unit: ''                                    // 単位 ?　default=kg
};

var ufrPlan = {
    ufRate: {},                                 // 除水速度設定
    timeHdStart: {},                            // 開始時刻 ? timeHdStart obj.
    timeHdEnd: {}                               // 終了時刻 ? timeHdEnd obj.
};

var ufRate = {
    value: 0,                                   // 除水速度設定 xs:decimal
    unit: ''                                    // 単位 ?　default=kg/h
};

var progressSection = {
    dailyHDRecord: []                           // 日次HD記録 * [dailyHDRecord]
};

var dailyHDRecord = {
    calendarDate: '',                           // 暦日付 ? xs:date
    serialNumber: '',                           // 起算日は任意 ?
    methodRecord: [],                           // 血液浄化法名称 * [methodRecord]
    dryWeight: {},                              // ドライウェイト ?
    preWeight: {},                              // 透析前体重 ?
    postWeight: {},                             // 透析後体重 ?
    totalUF: {},                                // 実施除水量 ?
    weightCorrection: {},                       // 補正 ?
    dialyser: {},                               // ダイアライザー名称 ?
    dialysate: [],                              // 透析液 *
    needle: [],                                 // 穿刺針名称 *
    machine: {},                                // 機器名 ?
    observation: [],                            // 観察記録 *
    medication: [],                             // 投薬 *
    injection: [],                              // 注射 *
    note: ''                                    // 備考 ?
};

var methodRecord = {
    value: '',                                  // 血液浄化法名称
    code: '',                                   // 血液浄化法ID ?
    tableId: '',                                // hdMethodTable01 ?
    startDateTime: '',                          // 透析開始日時 ? xs:dateTime
    endDateTime: ''                             // 透析終了日時 ? xs:dateTime
};

var preWeight = {
    value: 0,                                   // 透析前体重 xs:decimal
    unit: ''                                    // 単位 ? default=kg
};

var postWeight = {
    value: 0,                                   // 透析後体重 xs:decimal
    unit: ''                                    // 単位 ? default=kg
};

var totalUF = {
    value: 0,                                   // 実施除水量数値 xs:decimal
    unit: ''                                    // 単位 ? default=kg
};

var machine = {
    value: '',                                  // 機器名
    code: '',                                   // 機器ID ?
    tableId: ''                                 // 機器識別コードテーブル． 施設毎に設定．hdMachineTable ?
};

var observation = {
    timeHd: {},                                 // 人工腎臓開始時刻からの経過時間 ?
    observationItem: [],                        // 観察項目 * [observationItem]
    staffName: [],                              // 観察スタッフ名 * [staffName]
    machineName: [],                            // 機器名 * [machineName]
    note: ''                                    // 備考 ?
};

var observationItem = {
    obItemName: {},                             // 観察項目名 obItemName
    value: {}                                   // 観察値 ? value obj.
};

var obItemName = {
    value: '',                                  // 観察項目名
    code: '',                                   // 観察項目ID ?
    tableId: ''                                 // 観察項目コードテーブル hdObservationTable01 ?
};

var value = {
    value: '',                                  // 観察値
    unit: ''                                    // 単位 ?
};

var staffName = {
    value: '',                                  // 観察スタッフ名
    code: '',                                   // スタッフID ?
    type: ''                                    // IDタイプ ?
};

var machineName = {
    value: '',                                  // 機器名
    code: '',                                   // 機器ID ?
    tableId: ''                                 // 機器識別コードテーブル． 施設毎に設定．hdMachineTable ?
};

var testResultSection = {
    testResultItem: []                          // 検査結果 * [testResultItem]
};

var testResultItem = {
    calendarDate: '',                           // 暦日付 ? xs:date
    testCondition: {},                          // 検査条件 ? testCondition
    timeHd: {},                                 // 実施時刻 ? timeHd
    testItemGroup: []                           // 検査項目グループ * [testItemGroup]
};

var testCondition = {
    value: '',                                  // 検査条件
    code: '',                                   // 条件ID ?
    tableId: ''                                 // hdTestConditionTable01 ?
};

var testItemGroup = {
    testName: {},                               // 検査名称 ? testName
    testResult: {},                             // 検査結果 ? testResult
    note: '',                                   // 備考 ?
    extRef: []                                  // 検査結果外部参照 * [mmlCm:extRef]
};

var testName = {
    value: '',                                  // 検査名称
    code: '',                                   // 検査ID ?
    type: ''                                    // コードの種類、当面はレセ電算コードを使用 ?
};

var testResult = {
    value: '',                                  // 検査結果
    unit: ''                                    // 単位 ?
};

var heMX = {
    extRef: []                                  // 外部参照 * [mmlCm:extRef]
};
*******************************************************************************/

module.exports = {

    //---------------
    // effectiveDays
    //---------------
    buildeffectiveDays: function (target, arr) {
        arr.push('<mmlHd:effectiveDays>');
        target.weekday.forEach((e) => {
            arr.push('<mmlHd:weekday>');
            arr.push(e);
            arr.push('</mmlHd:weekday>');
        });
        arr.push('</mmlHd:effectiveDays>');
    },

    //---------------
    // timeShift
    //---------------
    buildTimeShift: function (target, arr) {
        arr.push('<mmlHd:timeShift');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push (' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'tableId')) {
            arr.push (' mmlHd:tableId=');
            arr.push(utils.addQuote(target.tableId));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:timeShift>');
    },

    //----------------
    // timeHdStart
    //----------------
    buildTimeHdStart: function (target, arr) {
        arr.push('<mmlHd:timeHdStart');
        if (utils.propertyIsNotNull(target, 'timeDirection')) {
            arr.push (' mmlHd:timeDirection=');
            arr.push(utils.addQuote(target.timeDirection));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:timeHdStart>');
    },

    //----------------
    // timeHdEnd
    //----------------
    buildTimeHdEnd: function (target, arr) {
        arr.push('<mmlHd:timeHdEnd');
        if (utils.propertyIsNotNull(target, 'timeDirection')) {
            arr.push (' mmlHd:timeDirection=');
            arr.push(utils.addQuote(target.timeDirection));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:timeHdEnd>');
    },

    //----------------
    // method
    //----------------
    buildMethod: function (target, arr) {
        const method = {                                  // 血液浄化方法
            methodName: {},                             // 血液浄化方法名称 methodName obj.
            timeHdStart: {},                            // 開始時刻 ? timeHdStart obj.
            timeHdEnd: {}                               // 終了時刻 ? timeHdEnd obj.
        };
        arr.push('<mmlHd:hdMethod>');
        // methodName
        if (utils.propertyIsNotNull(target, 'methodName')) {
            const mn = target.methodName;
            arr.push('<mmlHd:hdMethodName');
            if (utils.propertyIsNotNull(mn, 'code')) {
                arr.push (' mmlHd:code=');
                arr.push(utils.addQuote(mn.code));
            }
            if (utils.propertyIsNotNull(mn, 'tableId')) {
                arr.push (' mmlHd:tableId=');
                arr.push(utils.addQuote(mn.tableId));
            }
            arr.push('>');
            arr.push(mn.value);
            arr.push('</mmlHd:hdMethodName>');
        }
        // timeHdStart
        if (utils.propertyIsNotNull(target, 'timeHdStart')) {
            this.buildTimeHdStart(target.timeHdStart, arr);
        }
        // timeHdEnd
        if (utils.propertyIsNotNull(target, 'timeHdEnd')) {
            this.buildTimeHdEnd(target.timeHdEnd, arr);
        }
        arr.push('</mmlHd:hdMethod>');
    },

    //------------------
    // dryWeight
    //------------------
    buildDryWeight: function (target, arr) {
        arr.push('<mmlHd:dryWeight');
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('kg'));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:dryWeight>');
    },

    //------------------
    // weightCorrection
    //------------------
    buildWeightCorrection: function (target, arr) {
        arr.push('<mmlHd:weightCorrection');
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('kg'));
        }
        if (utils.propertyIsNotNull(target, 'cnote')) {
            arr.push(' mmlHd:cnote=');
            arr.push(utils.addQuote(target.cnote));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:weightCorrection>');
    },

    //----------------
    // buildBloodFlow
    //----------------
    buildBloodFlow: function (target, arr) {
        arr.push('<mmlHd:bloodFlow>');
        // flowRate
        if (utils.propertyIsNotNull(target, 'flowRate')) {
            const fr = target.flowRate;
            // arr.push('<mmlHd:bloodFlowRate mmlHd:unit=');
            arr.push('<mmlHd:flowRate mmlHd:unit=');
            if (utils.propertyIsNotNull(fr, 'unit')) {
                arr.push(utils.addQuote(fr.unit));
            } else {
                arr.push(utils.addQuote('ml/min'));
            }
            arr.push('>');
            arr.push(fr.value);
            arr.push('</mmlHd:flowRate>');
        }
        // timeHdStart
        if (utils.propertyIsNotNull(target, 'timeHdStart')) {
            this.buildTimeHdStart(target.timeHdStart, arr);
        }
        // timeHdEnd
        if (utils.propertyIsNotNull(target, 'timeHdEnd')) {
            this.buildTimeHdEnd(target.timeHdEnd, arr);
        }
        arr.push('</mmlHd:bloodFlow>');
    },

    //------------------
    // buildDialyser
    //------------------
    buildDialyser: function (target, arr) {
        arr.push('<mmlHd:dialyser');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'type')) {
            arr.push(' mmlHd:type=');
            arr.push(utils.addQuote(target.type));
        }
        if (utils.propertyIsNotNull(target, 'membraneArea')) {
            arr.push(' mmlHd:membraneArea=');
            arr.push(utils.addQuote(target.membraneArea));
        }
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('m2'));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:dialyser>');
    },

    //--------------------
    // buildDialysate
    //--------------------
    buildDialysate: function (target, arr) {
        arr.push('<mmlHd:dialysate>');
        if (utils.propertyIsNotNull(target, 'dialysateName')) {
            const name = target.dialysateName;
            arr.push('<mmlHd:dialysateName');
            if (utils.propertyIsNotNull(name, 'code')) {
                arr.push(' mmlHd:code=');
                arr.push(utils.addQuote(name.code));
            }
            if (utils.propertyIsNotNull(name, 'type')) {
                arr.push(' mmlHd:type=');
                arr.push(utils.addQuote(name.type));
            }
            if (utils.propertyIsNotNull(name, 'modification')) {
                arr.push(' mmlHd:modification=');
                arr.push(utils.addQuote(name.modification));
            }
            arr.push('>');
            arr.push(name.value);
            arr.push('</mmlHd:dialysateName>');
        }

        // timeHdStart
        if (utils.propertyIsNotNull(target, 'timeHdStart')) {
            this.buildTimeHdStart(target.timeHdStart, arr);
        }
        // timeHdEnd
        if (utils.propertyIsNotNull(target, 'timeHdEnd')) {
            this.buildTimeHdEnd(target.timeHdEnd, arr);
        }
        arr.push('</mmlHd:dialysate>');
    },

    //--------------------
    // buildDialysateFlow
    //--------------------
    buildDialysateFlow: function (target, arr) {
        arr.push('<mmlHd:dialysateFlow>');
        if (utils.propertyIsNotNull(target, 'flowRate')) {
            const fr = target.flowRate;
            // arr.push('<mmlHd:dialysateFlowRate mmlHd:unit=');
            arr.push('<mmlHd:flowRate mmlHd:unit=');
            if (utils.propertyIsNotNull(fr, 'unit')) {
                arr.push(utils.addQuote(fr.unit));
            } else {
                arr.push(utils.addQuote('ml/min'));
            }
            arr.push('>');
            arr.push(fr.value);
            arr.push('</mmlHd:flowRate>');
        }

        // timeHdStart
        if (utils.propertyIsNotNull(target, 'timeHdStart')) {
            this.buildTimeHdStart(target.timeHdStart, arr);
        }
        // timeHdEnd
        if (utils.propertyIsNotNull(target, 'timeHdEnd')) {
            this.buildTimeHdEnd(target.timeHdEnd, arr);
        }
        arr.push('</mmlHd:dialysateFlow>');
    },

    //--------------------
    // buildDialysateTemp
    //--------------------
    buildDialysateTemp: function (target, arr) {
        arr.push('<mmlHd:dialysateTemp>');
        if (utils.propertyIsNotNull(target, 'dialysateTempValue')) {
            const fr = target.dialysateTempValue;
            arr.push('<mmlHd:dialysateTempValue mmlHd:unit=');
            if (utils.propertyIsNotNull(fr, 'unit')) {
                arr.push(utils.addQuote(fr.unit));
            } else {
                arr.push(utils.addQuote('C'));
            }
            arr.push('>');
            arr.push(fr.value);
            arr.push('</mmlHd:dialysateTempValue>');
        }
        // timeHdStart
        if (utils.propertyIsNotNull(target, 'timeHdStart')) {
            this.buildTimeHdStart(target.timeHdStart, arr);
        }
        // timeHdEnd
        if (utils.propertyIsNotNull(target, 'timeHdEnd')) {
            this.buildTimeHdEnd(target.timeHdEnd, arr);
        }
        arr.push('</mmlHd:dialysateTemp>');
    },

    //---------------------
    // buildSubstitution
    //---------------------
    buildSubstitution: function (target, arr) {
        arr.push('<mmlHd:substitution>');
        if (utils.propertyIsNotNull(target, 'substitutionValue')) {
            const fr = target.substitutionValue;
            arr.push('<mmlHd:substitutionValue mmlHd:unit=');
            if (utils.propertyIsNotNull(fr, 'unit')) {
                arr.push(utils.addQuote(fr.unit));
            } else {
                arr.push(utils.addQuote('C'));
            }
            if (utils.propertyIsNotNull(fr, 'dilution')) {
                arr.push(' mmlHd:dilution=');
                arr.push(utils.addQuote(fr.dilution));
            }
            arr.push('>');
            arr.push(fr.value);
            arr.push('</mmlHd:substitutionValue>');
        }
        // timeHdStart
        if (utils.propertyIsNotNull(target, 'timeHdStart')) {
            this.buildTimeHdStart(target.timeHdStart, arr);
        }
        // timeHdEnd
        if (utils.propertyIsNotNull(target, 'timeHdEnd')) {
            this.buildTimeHdEnd(target.timeHdEnd, arr);
        }
        arr.push('</mmlHd:substitution>');
    },

    //--------------------
    // buildNeedle
    //--------------------
    buildNeedle: function (target, arr) {
        arr.push ('<mmlHd:needle');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'type')) {
            arr.push(' mmlHd:type=');
            arr.push(utils.addQuote(target.type));
        }
        if (utils.propertyIsNotNull(target, 'position')) {
            arr.push(' mmlHd:position=');
            arr.push(utils.addQuote(target.position));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push ('</mmlHd:needle>');
    },

    //--------------------
    // buildDrugName
    //--------------------
    buildDrugName: function (target, arr) {
        arr.push('<mmlHd:drugName');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'type')) {
            arr.push(' mmlHd:type=');
            arr.push(utils.addQuote(target.type));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:drugName>');
    },

    //---------------------
    // buildDose
    //---------------------
    buildDose: function (target, arr) {
        arr.push('<mmlHd:dose');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(' mmlHd:unit=');
            arr.push(utils.addQuote(target.unit));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:dose>');
    },

    //----------------------
    // buildTimeHd
    //----------------------
    buildTimeHd: function (target, arr) {
        arr.push('<mmlHd:timeHd');
        if (utils.propertyIsNotNull(target, 'timeDirection')) {
            arr.push(' mmlHd:timeDirection=');
            arr.push(utils.addQuote(target.timeDirection));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:timeHd>');
    },

    //----------------------
    // note
    //----------------------
    buildNote: function (target, arr) {
        arr.push('<mmlHd:note>');
        arr.push(target);
        arr.push('</mmlHd:note>');
    },

    //---------------------
    // buildMedication
    //--------------------
    buildMedication: function (target, arr) {
        arr.push('<mmlHd:medication>');
        if (utils.propertyIsNotNull(target, 'drugName')) {
            this.buildDrugName(target.drugName, arr);
        }
        if (utils.propertyIsNotNull(target, 'dose')) {
            this.buildDose(target.dose, arr);
        }
        if (utils.propertyIsNotNull(target, 'timeHd')) {
            this.buildTimeHd(target.timeHd, arr);
        }
        if (utils.propertyIsNotNull(target, 'note')) {
            this.buildNote(target.note, arr);
        }
        arr.push('</mmlHd:medication>');
    },

    //-----------------------
    // routeName
    //-----------------------
    buildRouteName: function (target, arr) {
        arr.push('<mmlHd:routeName');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'tableId')) {
            arr.push(' mmlHd:tableId=');
            arr.push(utils.addQuote(target.tableId));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:routeName>');
    },

    //------------------------
    // buildInjection
    //------------------------
    buildInjection: function (target, arr) {
        arr.push('<mmlHd:injection>');
        if (utils.propertyIsNotNull(target, 'drugName')) {
            this.buildDrugName(target.drugName, arr);
        }
        if (utils.propertyIsNotNull(target, 'dose')) {
            this.buildDose(target.dose, arr);
        }
        // timeHdStart
        if (utils.propertyIsNotNull(target, 'timeHdStart')) {
            this.buildTimeHdStart(target.timeHdStart, arr);
        }
        // timeHdEnd
        if (utils.propertyIsNotNull(target, 'timeHdEnd')) {
            this.buildTimeHdEnd(target.timeHdEnd, arr);
        }
        // routeName
        if (utils.propertyIsNotNull(target, 'routeName')) {
            this.buildRouteName(target.routeName, arr);
        }
        if (utils.propertyIsNotNull(target, 'note')) {
            this.buildNote(target.note, arr);
        }
        arr.push('</mmlHd:injection>');
    },

    // buildOrderGroups
    buildOrderGroups: function (target, arr) {
        arr.push('<mmlHd:orderGroups>');
        // effectiveDays
        if (utils.propertyIsNotNull(target, 'effectiveDays')) {
            this.buildeffectiveDays(target.effectiveDays, arr);
        }
        // timeShift
        if (utils.propertyIsNotNull(target, 'timeShift')) {
            this.buildTimeShift(target.timeShift, arr);
        }
        // method
        if (utils.propertyIsNotNull(target, 'method')) {
            target.method.forEach((e) => {
                this.buildMethod(e, arr);
            });
        }
        // dryWeight
        if (utils.propertyIsNotNull(target, 'dryWeight')) {
            this.buildDryWeight(target.dryWeight, arr);
        }
        // weightCorrection
        if (utils.propertyIsNotNull(target, 'weightCorrection')) {
            this.buildWeightCorrection(target.weightCorrection, arr);
        }
        // bloodFlow
        if (utils.propertyIsNotNull(target, 'bloodFlow')) {
            target.bloodFlow.forEach((e) => {
                this.buildBloodFlow(e, arr);
            });
        }
        // dialyser
        if (utils.propertyIsNotNull(target, 'dialyser')) {
            this.buildDialyser(target.dialyser, arr);
        }
        // dialysate
        if (utils.propertyIsNotNull(target, 'dialysate')) {
            target.dialysate.forEach((e) => {
                this.buildDialysate(e, arr);
            });
        }
        // dialysateFlow
        if (utils.propertyIsNotNull(target, 'dialysateFlow')) {
            target.dialysateFlow.forEach((e) => {
                this.buildDialysateFlow(e, arr);
            });
        }
        // dialysateTemp
        if (utils.propertyIsNotNull(target, 'dialysateTemp')) {
            target.dialysateTemp.forEach((e) => {
                this.buildDialysateTemp(e, arr);
            });
        }
        // substitution
        if (utils.propertyIsNotNull(target, 'substitution')) {
            target.substitution.forEach((e) => {
                this.buildSubstitution(e, arr);
            });
        }
        // needle
        if (utils.propertyIsNotNull(target, 'needle')) {
            target.needle.forEach((e) => {
                this.buildNeedle(e, arr);
            });
        }
        // medication
        if (utils.propertyIsNotNull(target, 'medication')) {
            target.medication.forEach((e) => {
                this.buildMedication(e, arr);
            });
        }
        // injection
        if (utils.propertyIsNotNull(target, 'injection')) {
            target.injection.forEach((e) => {
                this.buildInjection(e, arr);
            });
        }
        // note
        if (utils.propertyIsNotNull(target, 'note')) {
            this.buildNote(target.note, arr);
        }
        arr.push('</mmlHd:orderGroups>');
    },

    // orders
    buildOrders: function(target, arr) {
        arr.push('<mmlHd:hdOrders');
        if (utils.propertyIsNotNull(target, 'orderStatus')) {
            arr.push(' mmlHd:orderStatus=');
            arr.push(utils.addQuote(target.orderStatus));
        }
        if (utils.propertyIsNotNull(target, 'dateOrdered')) {
            arr.push(' mmlHd:dateOrdered=');
            arr.push(utils.addQuote(target.dateOrdered));
        }
        if (utils.propertyIsNotNull(target, 'dateEffective')) {
            arr.push(' mmlHd:dateEffective=');
            arr.push(utils.addQuote(target.dateEffective));
        }
        arr.push('>');
        target.orderGroups.forEach((e) => {
            this.buildOrderGroups(e, arr);
        });

        arr.push('</mmlHd:hdOrders>');
    },

    //--------------------
    // buildTargetWeight
    //--------------------
    buildTargetWeight: function (target, arr) {
        arr.push('<mmlHd:targetWeight');
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('kg'));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:targetWeight>');
    },

    //--------------------
    // buildTargetUF
    //--------------------
    buildTargetUF: function (target, arr) {
        arr.push('<mmlHd:targetUF');
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('kg'));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:targetUF>');
    },

    //--------------------
    // buildUfRate
    //--------------------
    buildUfRate: function (target, arr) {
        arr.push('<mmlHd:ufRate');
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('kg/h'));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:ufRate>');
    },

    //----------------------
    // buildUfrPlan
    //----------------------
    buildUfrPlan: function (target, arr) {
        arr.push('<mmlHd:ufrPlan>');
        if (utils.propertyIsNotNull(target, 'ufRate')) {
            this.buildUfRate(target.ufRate, arr);
        }
        // timeHdStart
        if (utils.propertyIsNotNull(target, 'timeHdStart')) {
            this.buildTimeHdStart(target.timeHdStart, arr);
        }
        // timeHdEnd
        if (utils.propertyIsNotNull(target, 'timeHdEnd')) {
            this.buildTimeHdEnd(target.timeHdEnd, arr);
        }
        arr.push('</mmlHd:ufrPlan>');
    },

    // buildDailyOrder
    buildDailyOrder: function (target, arr) {
        arr.push('<mmlHd:hdDailyOrder');
        if (utils.propertyIsNotNull(target, 'orderDateTime')) {
            arr.push(' mmlHd:orderDateTime=');
            arr.push(utils.addQuote(target.orderDateTime));
        }
        if (utils.propertyIsNotNull(target, 'dateEffective')) {
            arr.push(' mmlHd:dateEffective=');
            arr.push(utils.addQuote(target.dateEffective));
        }
        arr.push('>');
        if (utils.propertyIsNotNull(target, 'timeShift')) {
             this.buildTimeShift(target.timeShift, arr);
        }
        if (utils.propertyIsNotNull(target, 'method')) {
            taret.method.forEach((e) => {
                this.buildMethod(e, arr);
            });
        }
        if (utils.propertyIsNotNull(target, 'targetWeight')) {
            this.buildTargetWeight(target.targetWeight, arr);
        }
        if (utils.propertyIsNotNull(target, 'targetUF')) {
            this.buildTargetUF(target.targetUF, arr);
        }
        if (utils.propertyIsNotNull(target, 'ufrPlan')) {
            taret.ufrPlan.forEach((e) => {
                this.buildUfrPlan(e, arr);
            });
        }
        // weightCorrection
        if (utils.propertyIsNotNull(target, 'weightCorrection')) {
            this.buildWeightCorrection(target.weightCorrection, arr);
        }
        // bloodFlow
        if (utils.propertyIsNotNull(target, 'bloodFlow')) {
            taret.bloodFlow.forEach((e) => {
                this.buildBloodFlow(e, arr);
            });
        }
        // dialyser
        if (utils.propertyIsNotNull(target, 'dialyser')) {
            this.buildDialyser(target.dialyser, arr);
        }
        // dialysate
        if (utils.propertyIsNotNull(target, 'dialysate')) {
            taret.dialysate.forEach((e) => {
                this.buildDialysate(e, arr);
            });
        }
        // dialysateFlow
        if (utils.propertyIsNotNull(target, 'dialysateFlow')) {
            taret.dialysateFlow.forEach((e) => {
                this.buildDialysateFlow(e, arr);
            });
        }
        // dialysateTemp
        if (utils.propertyIsNotNull(target, 'dialysateTemp')) {
            taret.dialysateTemp.forEach((e) => {
                this.buildDialysateTemp(e, arr);
            });
        }
        // needle
        if (utils.propertyIsNotNull(target, 'needle')) {
            taret.needle.forEach((e) => {
                this.buildNeedle(e, arr);
            });
        }
        // medication
        if (utils.propertyIsNotNull(target, 'medication')) {
            taret.medication.forEach((e) => {
                this.buildMedication(e, arr);
            });
        }
        // injection
        if (utils.propertyIsNotNull(target, 'injection')) {
            taret.injection.forEach((e) => {
                this.buildInjection(e, arr);
            });
        }
        // note
        if (utils.propertyIsNotNull(target, 'note')) {
            this.buildNote(target.note, arr);
        }
        arr.push('</mmlHd:hdDailyOrder>')
    },

    // orderSection
    buildOrderSection: function (target, arr) {
        arr.push('<mmlHd:HDOrderSection>');
        if (utils.propertyIsNotNull(target, 'orders')) {
            target.orders.forEach((e) => {
                this.buildOrders(e, arr);
            });
        }
        if (utils.propertyIsNotNull(target, 'dailyOrder')) {
            target.dailyOrder.forEach((e) => {
                this.buildDailyOrder(e, arr);
            });
        }
        arr.push('</mmlHd:HDOrderSection>');
    },

    // bloodAccess
    buildBloodAccess: function (target, arr) {
        arr.push('<mmlHd:BloodAccess');
        if (utils.propertyIsNotNull(target, 'baStatus')) {
            arr.push(' mmlHd:baStatus=');
            arr.push(utils.addQuote(target.baStatus));
        }
        arr.push('>');
        // dateMade
        if (utils.propertyIsNotNull(target, 'dateMade')) {
            arr.push('<mmlHd:dateMade>');
            arr.push(target.dateMade);
            arr.push('</mmlHd:dateMade>');
        }
        // dateFirstUse
        if (utils.propertyIsNotNull(target, 'dateFirstUse')) {
            arr.push('<mmlHd:dateFirstUse>');
            arr.push(target.dateFirstUse);
            arr.push('</mmlHd:dateFirstUse>');
        }
        // dateEnd
        if (utils.propertyIsNotNull(target, 'dateEnd')) {
            arr.push('<mmlHd:dateEnd>');
            arr.push(target.dateEnd);
            arr.push('</mmlHd:dateEnd>');
        }
        // location
        if (utils.propertyIsNotNull(target, 'location')) {
            const location = target.location;
            arr.push('<mmlHd:location');
            if (utils.propertyIsNotNull(location, 'code')) {
                arr.push(' mmlHd:code=');
                arr.push(utils.addQuote(location.code));
            }
            if (utils.propertyIsNotNull(location, 'tableId')) {
                arr.push(' mmlHd:tableId=');
                arr.push(utils.addQuote(location.tableId));
            }
            arr.push('>');
            arr.push(location.value);
            arr.push('</mmlHd:location>');
        }

        arr.push('</mmlHd:BloodAccess>');
    },

    // introduction
    buildIntroduction: function (target, arr) {
        arr.push('<mmlHd:HdIntroduction>');
        // diagnosis
        if (utils.propertyIsNotNull(target, 'diagnosis')) {
            target.diagnosis.forEach((e) => {
                arr.push('<mmlHd:hdDiagnosis');
                if (utils.propertyIsNotNull('code')) {
                    arr.push(' mmlHd:code=');
                    arr.push(utils.addQuote(e.code));
                }
                if (utils.propertyIsNotNull('system')) {
                    arr.push(' mmlHd:system=');
                    arr.push(utils.addQuote(e.system));
                }
                arr.push('>');
                arr.push(e.value);
                arr.push('</mmlHd:hdDiagnosis>');
            });
        }
        // introDate
        if (utils.propertyIsNotNull(target, 'introDate')) {
            arr.push('<mmlHd:HdIntroDate>');
            arr.push(target.introDate);
            arr.push('</mmlHd:HdIntroDate>');
        }
        // facility
        commonBuilder.buildFacility(target.facility, arr);
        arr.push('</mmlHd:HdIntroduction>');
    },

    // historySection
    buildHistorySection: function(target, arr) {
        arr.push('<mmlHd:HDHistorySection>');
        // introduction
        if (utils.propertyIsNotNull(target, 'introduction')) {
            target.introduction.forEach((e) => {
                this.buildIntroduction(target.introduction, arr);
            });
        }
        // bloodAccess
        if (utils.propertyIsNotNull(target, 'bloodAccess')) {
            this.buildBloodAccess(target.bloodAccess, arr);
        }
        arr.push('</mmlHd:HDHistorySection>');
    },

    //-----------------------
    // buildMethodRecord
    //-----------------------
    buildMethodRecord: function (target, arr) {
        arr.push('<mmlHd:hdMethodRecord');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'tableId')) {
            arr.push(' mmlHd:tableId=');
            arr.push(utils.addQuote(target.tableId));
        }
        if (utils.propertyIsNotNull(target, 'startDateTime')) {
            arr.push(' mmlHd:startDateTime=');
            arr.push(utils.addQuote(target.startDateTime));
        }
        if (utils.propertyIsNotNull(target, 'endDateTime')) {
            arr.push(' mmlHd:endDateTime=');
            arr.push(utils.addQuote(target.endDateTime));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:hdMethodRecord>');
    },

    //---------------------
    // buildPreWeight
    //---------------------
    buildPreWeight: function (target, arr) {
        arr.push('<mmlHd:preWeight');
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('kg'));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:preWeight>');
    },

    //---------------------
    // buildPostWeight
    //---------------------
    buildPostWeight: function (target, arr) {
        arr.push('<mmlHd:postWeight');
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('kg'));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:postWeight>');
    },

    //---------------------
    // buildTotalUF
    //---------------------
    buildTotalUF: function (target, arr) {
        arr.push('<mmlHd:totalUF');
        arr.push(' mmlHd:unit=');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(utils.addQuote(target.unit));
        } else {
            arr.push(utils.addQuote('kg'));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:totalUF>');
    },

    //----------------------
    // buildMacine
    //----------------------
    buildMacine: function (target, arr) {
        arr.push('<mmlHd:hdMachine');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'tableId')) {
            arr.push(' mmlHd:tableId=');
            arr.push(utils.addQuote(target.tableId));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:hdMachine>');
    },

    //---------------------
    // buildObItemName
    //---------------------
    buildObItemName: function (target, arr) {
        arr.push('<mmlHd:obItemName');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'tableId')) {
            arr.push(' mmlHd:tableId=');
            arr.push(utils.addQuote(target.tableId));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:obItemName>');
    },

    //----------------------
    // buildValue
    //----------------------
    buildValue: function (target, arr) {
        arr.push('<mmlHd:value');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(' mmlHd:unit=');
            arr.push(utils.addQuote(target.unit));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:value>');
    },

    //----------------------
    // buildObservationItem
    //----------------------
    buildObservationItem: function (target, arr) {
        arr.push('<mmlHd:observationItem>');
        if (utils.propertyIsNotNull(target, 'obItemName')) {
            this.buildObItemName(target.obItemName, arr);
        }
        if (utils.propertyIsNotNull(target, 'value')) {
            this.buildValue(target.value, arr);
        }
        arr.push('</mmlHd:observationItem>');
    },

    //-----------------------
    // buildStaffName
    //-----------------------
    buildStaffName: function (target, arr) {
        arr.push('<mmlHd:staffName');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'type')) {
            arr.push(' mmlHd:type=');
            arr.push(utils.addQuote(target.type));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:staffName>');
    },

    //-----------------------
    // buildStaffName
    //-----------------------
    buildMachineName: function (target, arr) {
        arr.push('<mmlHd:machineName');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'tableId')) {
            arr.push(' mmlHd:tableId=');
            arr.push(utils.addQuote(target.tableId));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:machineName>');
    },

    //----------------------
    // buildObservation
    //----------------------
    buildObservation: function (target, arr) {
        arr.push('<mmlHd:observation>');
        // timeHd
        if (utils.propertyIsNotNull(target, 'timeHd')) {
            this.buildTimeHd(target.timeHd, arr);
        }
        // observationItem
        if (utils.propertyIsNotNull(target, 'observationItem')) {
            target.observationItem.forEach((e) => {
                this.buildObservationItem(e, arr);
            });
        }
        // staffName
        if (utils.propertyIsNotNull(target, 'staffName')) {
            target.staffName.forEach((e) => {
                this.buildStaffName(e, arr);
            });
        }
        // machineName
        if (utils.propertyIsNotNull(target, 'machineName')) {
            target.machineName.forEach((e) => {
                this.buildMachineName(e, arr);
            });
        }
        // note
        if (utils.propertyIsNotNull(target, 'note')) {
            this.buildNote(target.note, arr);
        }
        arr.push('</mmlHd:observation>');
    },

    buildDailyHDRecord: function (target, arr) {
        arr.push('<mmlHd:dailyHDRecord>');
        if (utils.propertyIsNotNull(target, 'calendarDate')) {
            arr.push(' mmlHd:calendarDate=');
            arr.push(utils.addQuote(target.calendarDate));
        }
        if (utils.propertyIsNotNull(target, 'serialNumber')) {
            arr.push(' mmlHd:serialNumber=');
            arr.push(utils.addQuote(target.serialNumber));
        }
        arr.push('>');
        // methodRecord
        if (utils.propertyIsNotNull(target, 'methodRecord')) {
            target.methodRecord.forEach((e) => {
                this.buildMethodRecord(e, arr);
            });
        }
        // dryWeight
        if (utils.propertyIsNotNull(target, 'dryWeight')) {
            this.buildDryWeight(target.dryWeight, arr);
        }
        // preWeight
        if (utils.propertyIsNotNull(target, 'preWeight')) {
            this.buildPreWeight(target.preWeight, arr);
        }
        // postWeight
        if (utils.propertyIsNotNull(target, 'postWeight')) {
            this.buildPostWeight(target.postWeight, arr);
        }
        // totalUF
        if (utils.propertyIsNotNull(target, 'totalUF')) {
            this.buildTotalUF(target.totalUF, arr);
        }
        // weightCorrection
        if (utils.propertyIsNotNull(target, 'weightCorrection')) {
            this.buildWeightCorrection(target.weightCorrection, arr);
        }
        // dialyser
        if (utils.propertyIsNotNull(target, 'dialyser')) {
            this.buildDialyser(target.dialyser, arr);
        }
        // dialysate
        if (utils.propertyIsNotNull(target, 'dialysate')) {
            taret.dialysate.forEach((e) => {
                this.buildDialysate(e, arr);
            });
        }
        // needle
        if (utils.propertyIsNotNull(target, 'needle')) {
            taret.needle.forEach((e) => {
                this.buildNeedle(e, arr);
            });
        }
        // machine
        if (utils.propertyIsNotNull(target, 'machine')) {
            this.buildMacine(target.machine, arr);
        }
        // observation
        if (utils.propertyIsNotNull(target, 'observation')) {
            taret.observation.forEach((e) => {
                this.buildObservation(e, arr);
            });
        }
        // medication
        if (utils.propertyIsNotNull(target, 'medication')) {
            taret.medication.forEach((e) => {
                this.buildMedication(e, arr);
            });
        }
        // injection
        if (utils.propertyIsNotNull(target, 'injection')) {
            taret.injection.forEach((e) => {
                this.buildInjection(e, arr);
            });
        }
        // note
        if (utils.propertyIsNotNull(target, 'note')) {
            this.buildNote(target.note, arr);
        }
        arr.push('</mmlHd:dailyHDRecord>');
    },

    // progressSection
    buildProgressSection: function (target, arr) {
        arr.push('<mmlHd:HDProgressSection>');
        if (utils.propertyIsNotNull(target, 'dailyHDRecord')) {
            target.dailyHDRecord.forEach((e) => {
                this.buildDailyHDRecord(e, arr);
            });
        }
        arr.push('</mmlHd:HDProgressSection>');
    },

    buildTestCondition: function (target, arr) {
        arr.push('<mmlHd:testCondition');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'tableId')) {
            arr.push(' mmlHd:tableId=');
            arr.push(utils.addQuote(target.tableId));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:testCondition>');
    },

    buildTestName: function (target, arr) {
        arr.push('<mmlHd:testName');
        if (utils.propertyIsNotNull(target, 'code')) {
            arr.push(' mmlHd:code=');
            arr.push(utils.addQuote(target.code));
        }
        if (utils.propertyIsNotNull(target, 'type')) {
            arr.push(' mmlHd:type=');
            arr.push(utils.addQuote(target.type));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:testName>');
    },

    buildTestResult: function (target, arr) {
        arr.push('<mmlHd:testResult');
        if (utils.propertyIsNotNull(target, 'unit')) {
            arr.push(' mmlHd:unit=');
            arr.push(utils.addQuote(target.unit));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlHd:testResult>');
    },

    buildTestItemGroup: function (target, arr) {
        arr.push('<mmlHd:testItemGroup>');
        if (utils.propertyIsNotNull(target, 'testName')) {
            this.buildTestName(target.testName, arr);
        }
        if (utils.propertyIsNotNull(target, 'testResult')) {
            this.buildTestResult(target.testResult, arr);
        }
        // note
        if (utils.propertyIsNotNull(target, 'note')) {
            this.buildNote(target.note, arr);
        }
        //-------------
        // extRef todo
        //-------------
        arr.push('<mmlHd:testItemGroup>');
    },

    buildTestResultItem: function (target, arr) {
        arr.push('<mmlHd:testResultItem');
        if (utils.propertyIsNotNull(target, 'calendarDate')) {
            arr.push(' mmlHd:calendarDate=');
            arr.push(utils.addQuote(target.calendarDate));
        }
        arr.push('>');
        // testCondition
        if (utils.propertyIsNotNull(target, 'testCondition')) {
            this.buildTestCondition(target.testCondition, arr);
        }
        // timeHd
        if (utils.propertyIsNotNull(target, 'timeHd')) {
            this.buildTimeHd(target.timeHd, arr);
        }
        // testItemGroup
        if (utils.propertyIsNotNull(target, 'testItemGroup')) {
            taret.testItemGroup.forEach((e) => {
                this.buildTestItemGroup(e, arr);
            });
        }
        arr.push('<mmlHd:testResultItem>');
    },

    // testResultSection
    buildTestResultSection: function (target, arr) {
        arr.push('<mmlHd:HDTestResultSection>');
        // testResultItem
        if (utils.propertyIsNotNull(target, 'testResultItem')) {
            taret.testResultItem.forEach((e) => {
                this.buildTestResultItem(e, arr);
            });
        }
        arr.push('</mmlHd:HDTestResultSection>');
    },

    buildHemoDialysis: function (target, arr) {
        arr.push('<mmlHd:HemoDialysis>');
        // Facility
        commonBuilder.buildFacility(target.facility, arr);

        // patient
        patientBuilder.build(target.patient, arr);

        // note
        if (utils.propertyIsNotNull(target, 'note')) {
            arr.push('<mmlHd:note>');
            arr.push(target.note);
            arr.push('</mmlHd:note>');
        }

        // historySection
        if (utils.propertyIsNotNull(target, 'historySection')) {
            this.buildHistorySection(target.historySection, arr);
        }

        // orderSection
        if (utils.propertyIsNotNull(target, 'orderSection')) {
            this.buildOrderSection(target.orderSection, arr);
        }

        // progressSection
        if (utils.propertyIsNotNull(target, 'progressSection')) {
            this.buildProgressSection(target.progressSection, arr);
        }

        // testResultSection
        if (utils.propertyIsNotNull(target, 'testResultSection')) {
            this.buildTestResultSection(target.testResultSection, arr);
        }

        arr.push('</mmlHd:HemoDialysis>')
    },

    // buildHeMX
    buildHeMX: function (target, arr) {
    },

    build: function (target, arr) {
        arr.push('<mmlHd:HemoDialysisModule mmlHd:version=');
        arr.push(utils.addQuote(target.version));
        arr.push(' mmlHd:createDate=');
        arr.push(utils.addQuote(target.createDate));
        arr.push('>');
        // hemoDialysis
        if (utils.propertyIsNotNull(target, 'hemoDialysis')) {
            target.hemoDialysis.forEach((entry) => {
                this.buildHemoDialysis(entry, arr);
            });
        }
        // heMX
        if (utils.propertyIsNotNull(target, 'heMX')) {
            target.heMX.forEach((entry) => {
                this.buildHeMX(entry, arr);
            });
        }
        arr.push('</mmlHd:HemoDialysisModule>');
    }
};
