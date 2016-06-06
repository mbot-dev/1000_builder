"use strict";

const uuid = require('node-uuid');
const utils = require('../lib/utils');
const mmlBuilder = require('../lib/mmlBuilder');

module.exports = {

    /**
     * 患者、医師等の個人用Idを生成する
     * @param {pid} - pid 個人に発番されているId
     * @param {string} - idType MML0024(全国統一:national 地域:local 施設固有:facility)
     * @param {string} - facilityId 医療機関のId
     */
    buildPersonId: function (pid, idType, facilityId) {
        // idTypeが施設固有の場合(===facility) tableIdに施設Idを設定する
        return {
            value: pid,                     // 付番されているId
            attr: {
                type: idType,
                tableId: (idType === 'facility') ? facilityId : 'MML0024'
            }
        };
    },

    /**
     * CreatorInfoを生成する
     * @param {simpleCreator} simpleCreator
     * @returns {CreatorInfo}
     */
    buildCreatorInfo: function (simpleCreator) {
        /******************************************************
        var simpleCreator = {
            id: '',
            idType: '',                                  // MML0024(全国統一:national 地域:local 施設固有:facility)
            kanjiName: '',
            kanaName: '',
            romanName: '',                               // TPPで外国人医師
            facilityId: '',
            facilityIdType: '',                          // MML0027(ca|insurance|monbusho|JMARI|OID)
            facilityName: '',                            // 漢字
            facilityZipCode: '',
            facilityAddress: '',                         // 漢字
            facilityPhone: '',
            departmentId: '',                            // 医科用:MML0028 歯科用:MML0030
            departmentIdType: '',                        // MML0029を使用する(medical|dental|facility)
            departmentName: '',
            license: ''                                  // MML0026
        };******************************************************/

        // 作成者(creator)Id
        var creatorId = this.buildPersonId(simpleCreator.id, simpleCreator.idType, simpleCreator.facilityId);

        // 作成者氏名
        var creatorNames = [];
        if (simpleCreator.hasOwnProperty('kanjiName')) {
            creatorNames.push({
                attr: {
                    repCode: 'I',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                    tableId: 'MML0025'                        // 表記法を規定するテーブル名 MML0025
                },
                fullname: simpleCreator.kanjiName            // フルネーム
            });
        }
        if (simpleCreator.hasOwnProperty('kanaName')) {
            creatorNames.push({
                attr: {
                    repCode: 'P',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                    tableId: 'MML0025'                        // 表記法を規定するテーブル名 MML0025
                },
                fullname: simpleCreator.kanaName             // フルネーム
            });
        }
        if (simpleCreator.hasOwnProperty('romanName')) {
            creatorNames.push({
                attr: {
                    repCode: 'A',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                    tableId: 'MML0025'                        // 表記法を規定するテーブル名 MML0025
                },
                fullname: simpleCreator.romanName            // フルネーム
            });
        }

        // 肩書きなど
        if (simpleCreator.hasOwnProperty('prefix')) {
            creatorNames.forEach((entry) => {
                entry.prefix = simpleCreator.prefix;
            });
        }

        // 学位
        if (simpleCreator.hasOwnProperty('degree')) {
            creatorNames.forEach((entry) => {
                entry.degree = simpleCreator.degree;
            });
        }

        // 施設Id
        var facilityId = {
            value: simpleCreator.facilityId,             // 施設に付番されているId type属性に発番元（体系）を記載する
            attr: {
                type: simpleCreator.facilityIdType,       // MML0027 (認証局:ca 保険医療機関コード:insurance 文科省大学付属病院施設区分:monbusyo 日本医師会総合政策研究コード:JMARI)
                tableId: 'MML0027'                        // MML0027
            }
        };

        // 施設名称 漢字
        var facilityName = {
            value: simpleCreator.facilityName,
            attr: {
                repCode: 'I',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                tableId: 'MML0025'                        // MML0025
            }
        };

        // 施設情報
        var facility = {
            name: [facilityName],                        // 施設名 Name の配列
            Id: facilityId                               // 施設ID
        };

        // 医療機関住所
        var facilityAddress = {
            attr: {
                repCode: 'I',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                addressClass: 'business',                 // 住所の種類コード MML0002 を使用
                tableId: 'MML0025'                        // 上記の表記法を規定するテーブル名 MML0025
            },
            full: simpleCreator.facilityAddress,         // 一連住所
            zip: simpleCreator.facilityZipCode           // 郵便番号
        };

        // 医療機関電話番号
        var facilityPhone = {
            attr: {
                telEquipType: 'PH'                        // 装置の種類コード MML0003から使用
            },
            full: simpleCreator.facilityPhone            // 一連電話番号
        };

        // creator(医師)個人情報
        var personalizedInfo = {
            Id: creatorId,                               // ID情報
            personName: creatorNames,                    // 人名 Name の配列
            Facility: facility,                          // 施設情報 Facility
            //Department: department,                      // 診療科情報 Department
            addresses: [facilityAddress],                // 住所
            //emailAddresses: [email],                   // 電子メール
            phones: [facilityPhone]                      // 電話番号
        };

        if (simpleCreator.hasOwnProperty('departmentId')) {

            // 診療科Id
            var deptId = {
                value: simpleCreator.departmentId,           // medicalの場合はMML0028 dentalの場合はMML0030を参照
                attr: {
                    type: simpleCreator.departmentIdType,     // MML0029 (医科診療科コード:medical 歯科診療科コード:dental 施設内ユーザー定義診療科コード:facility)
                    tableId: 'MML0029'
                }
            };

            // 診療科名称 漢字
            var deptName = {
                value: simpleCreator.departmentName,
                attr: {
                    repCode: 'I',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                    tableId: 'MML0025'                        // MML0025
                }
            };

            // 診療科情報
            var department = {
                name: [deptName],                            // 診療科名 Name の配列
                Id: deptId                                   // 診療科ID
            };
            personalizedInfo.Department = department;
        }

        // 電子メールもセット可能
        if (simpleCreator.hasOwnProperty('email')) {
            personalizedInfo.emailAddresses = [simpleCreator.email];
        }

        // 医療資格
        var creatorLicense = {
            value: simpleCreator.license,                // 生成者の資格 MML0026を使用
            attr: {
                tableId: 'MML0026'                        // 生成者の資格を規定するテーブル名 MML0026
            }
        };

        // 作成者情報
        var creatorInfo = {
            PersonalizedInfo: personalizedInfo,          // 個人情報形式 PersonalizedInfo
            creatorLicense: [creatorLicense]             // 生成者の資格 creatorLicenseの配列
        };

        return creatorInfo;
    },

    /**
     * デフォルトのアクセス権を生成する
     * @param {string} patientId - 患者Id
     * @param {patientName} patientName - 患者氏名
     * @returns {[]} AccessRight の配列
     */
    buildDefaultAccessRight: function (patientId, patientName) {
        // 記載者施設に無期限全ての権限を与える
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

        // 診療歴のある施設と患者を対象に無期限でread権限を与える
        var accessRightForPatientAnExperienceFacility = {
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
                    personId: patientId,                            // 患者ID
                    personIdType: 'dolphinUserId_2001-10-03'        // ToDo
                },
                value: patientName
            }]
        };

        // 配列で返す
        return [accessRightForCreatorFacility, accessRightForPatientAnExperienceFacility];
    },

    /**
     * docInfo を生成する
     * @param {baseDocInfo} baseDocInfo
     * @param {CreatorInfo} creatorInfo - このドキュメントのcreator
     * @params {[]} defaultAccessRight - このプロジェクトのデフォルトアクセス権
     * @returns {docInfo}
     */
    buildDocInfo: function (baseDocInfo, creatorInfo, defaultAccessRight) {
        /***************************************
        var simpleDocInfo = {
            contentModuleType: '',
            uuid: '',
            confirmDate: '',
            title: '',
            parentUUID: '',
            parentConfirmDate: '',
        };***************************************/

        // title
        var title = baseDocInfo.hasOwnProperty('title') ? baseDocInfo.title : baseDocInfo.contentModuleType;

        // 対象
        var docInfo = {
            attr: {
                contentModuleType: baseDocInfo.contentModuleType  // 文書の種類コード MML0005を使用
                //moduleVersion: ''                                // 使用モジュールのDTDのURIを記載
            },
            securityLevel: defaultAccessRight,                    // accessRight の配列
            title: {
                value: title,                                      // 文書タイトル
                attr: {
                    generationPurpose: 'record'                     // 文書詳細種別 MML0007を使用
                }
            },
            docId: {                                              // 文書 ID 情報
                uid: baseDocInfo.uuid                             // 文書ユニークID ユニーク番号の形式は UUID とする (UUID はハイフンを含めた形式とする)
                //parentId: [],                                    // 関連親文書ID parentId  の配列
                //groupId: []                                      // グループ ID groupIdの配列
            },
            confirmDate: {
                value: baseDocInfo.confirmDate                   // カルテ電子保存の確定日時
                //attr: {
                //start: 'YYYY-MM-DDThh:mm:ss',                 // 時系列情報場合の開始日時
                //end: 'YYYY-MM-DDThh:mm:ss',                   // 時系列情報場合の終了日時
                //firstConfirmDate: 'YYYY-MM-DDThh:mm:ss',      // 修正が発生した場合の，初回確定日時
                //eventDate: 'YYYY-MM-DDThh:mm:ss'              // 実際に記載された診療イベントが発生した日時
                //}
            },
            CreatorInfo: creatorInfo,                             // 個々の文書の作成者情報．構造は MML 共通形式 (作成者情報形式)
            extRefs: []                                           // content 内に記載されているすべての外部リンク情報のリスト extRefの配列
        };

        // groupId
        if (baseDocInfo.hasOwnProperty('groupId')) {
            var group = {
                value: baseDocInfo.groupId,
                attr: {
                    groupClass: baseDocInfo.contentModuleType
                }
            };
            docInfo.docId.groupId = [group];
        }

        // 修正版かどうか -> parentUUID && parentConfirmDate
        if (baseDocInfo.hasOwnProperty('parentUUID') &&
        baseDocInfo.hasOwnProperty('parentConfirmDate')) {

            var parentId = {
                value: baseDocInfo.parentUUID,                    // 元の版のUUID
                attr: {
                    relation: 'oldEdition'                        // 関連の種別 MML0008から使用
                }
            };
            docInfo.docId.parentId = [parentId];

            docInfo.confirmDate.attr = {
                firstConfirmDate: baseDocInfo.parentConfirmDate  // 最初の確定日
            };
        }

        return docInfo;
    },

    /**
     * PatientModuleを生成する
     * @param {simplePatient}
     * @returns {PatientModule}
     */
    buildPatientModule: function (simplePatient) {
        /********************************************************************
        var simplePatient = {
            id: '',                                         // Id
            idType: ''                                      // MML0024(全国統一:national 地域:local 施設固有:facility)
            facilityId: '',                                 // 施設Id
            kanjiName: '',
            kanaName: '',
            romanName: '',
            gender: '',                                        // MML0010(femail male other unknown)
            dateOfBirth: '',
            maritalStatus: '',                              // MML0011
            nationality: '',
            postalCode: '',
            address: '',
            telephone: '',
            mobile: '',
            email: ''
        };*******************************************************************/

        // 患者Id
        var id = this.buildPersonId(simplePatient.id, simplePatient.idType, simplePatient.facilityId);

        // patientModule
        var patientModule = {
            uniqueInfo: {
                masterId: {
                    Id: id
                }
            },
            birthday: simplePatient.dateOfBirth,
            sex: simplePatient.gender,                     // MML0010(femail male other unknown)
            personName: []
            //nationality: {value: 'JPN'},                 // オブジェクト
            //marital: 'single',                           // MML0011
            //addresses: [],
            //emailAddresses: [],
            //phones: []
        };

        // 漢字氏名
        if (simplePatient.hasOwnProperty('kanjiName')) {
            patientModule.personName.push({
                attr: {
                    repCode: 'I',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                    tableId: 'MML0025'                        // 表記法を規定するテーブル名 MML0025
                },
                fullname: simplePatient.kanjiName            // フルネーム
            });
        }

        // かな/カナ氏名
        if (simplePatient.hasOwnProperty('kanaName')) {
            patientModule.personName.push({
                attr: {
                    repCode: 'P',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                    tableId: 'MML0025'                        // 表記法を規定するテーブル名 MML0025
                },
                fullname: simplePatient.kanaName             // フルネーム
            });
        }

        // ローマ字氏名
        if (simplePatient.hasOwnProperty('romanName')) {
            patientModule.personName.push({
                attr: {
                    repCode: 'A',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                    tableId: 'MML0025'                        // 表記法を規定するテーブル名 MML0025
                },
                fullname: simplePatient.romanName             // フルネーム
            });
        }

        // 国籍
        if (simplePatient.hasOwnProperty('nationality')) {
            patientModule.nationality = {value: simplePatient.nationality};
        }

        // 婚姻状況
        if (simplePatient.hasOwnProperty('maritalStatus')) {
            patientModule.maritalStatus = simplePatient.maritalStatus;
        }

        // 患者住所
        if (simplePatient.hasOwnProperty('address')) {
            patientModule.addresses = [];
            patientModule.addresses.push({
                attr: {
                    repCode: 'I',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                    addressClass: 'home',                     // 住所の種類コード MML0002 を使用 homeでいいかどうか
                    tableId: 'MML0025'                        // 上記の表記法を規定するテーブル名 MML0025
                },
                full: simplePatient.address,                  // 一連住所
                zip: simplePatient.postalCode                 // 郵便番号
            });
        }

        // 患者電子メールアドレス
        if (simplePatient.hasOwnProperty('email')) {
            patientModule.emailAddresses = [simplePatient.email];
        }

        // 患者電話自宅番号
        if (simplePatient.hasOwnProperty('telephone') ||
        simplePatient.hasOwnProperty('mobile')) {

            patientModule.phones = [];

            if (simplePatient.hasOwnProperty('telephone')) {
                patientModule.phones.push({
                    attr: {
                        telEquipType: 'PH'                        // 装置の種類コード MML0003から使用
                    },
                    full: simplePatient.telephone                // 一連電話番号
                });
            }

            if (simplePatient.hasOwnProperty('mobile')) {
                patientModule.phones.push({
                    attr: {
                        telEquipType: 'CR'                        // 装置の種類コード MML0003から使用
                    },
                    full: simplePatient.mobile                   // 一連電話番号
                });
            }
        }

        return patientModule;
    },

    /**
     * RegisteredDiagnosisModuleを生成する
     * @param {simpleDiagnosis} simpleDiagnosis
     * @returns {RegisteredDiagnosisModule}
     */
    buildRegisteredDiagnosisModule: function (simpleDiagnosis) {
        /****************************************************
        var simpleDiagnosis = {
            diagnosis: '',
            code: '',
            system: '',
            category: '',
            dateOfOnset: '',
            dateOfRemission: '',
            outcome: ''
        };**************************************************/

        var registeredDiagnosisModule = {
            diagnosis: {
                value: simpleDiagnosis.diagnosis,
                attr: {
                    code: simpleDiagnosis.code,
                    system: simpleDiagnosis.system
                }
            }
            //categories: [],
            //startDate: dateOfOnset,
            //endDate: dateOfRemission,
            //outcome: outcome
        };

        // カテゴリー
        if (simpleDiagnosis.hasOwnProperty('category')) {
            registeredDiagnosisModule.categories = [{
                value: simpleDiagnosis.category,
                attr: {
                    tableId: 'MML0012'
                }
            }];
        }

        // 開始日
        if (simpleDiagnosis.hasOwnProperty('dateOfOnset')) {
            registeredDiagnosisModule.startDate = simpleDiagnosis.dateOfOnset;
        }

        // 終了日
        if (simpleDiagnosis.hasOwnProperty('dateOfRemission')) {
            registeredDiagnosisModule.endDate = simpleDiagnosis.dateOfRemission;
        }

        // 転帰
        if (simpleDiagnosis.hasOwnProperty('outcome')) {
            registeredDiagnosisModule.outcome = simpleDiagnosis.outcome;
        }

        return registeredDiagnosisModule;
    },

    /**
     * PrescriptionModule を生成する
     * @param {simplePrescription} simplePrescription
     * @returns {[external, internal]}
     */
    buildPrescriptionModule: function (simplePrescription) {
        /**********************************************************
        var simplePrescription = {
            medication: [{issuedTo: '',                  // 院外処方:external 院内処方:internal
            medicine: '',                             // 処方薬
            medicineCode: '',                         // 処方薬のコード
            medicineCodeystem: '',                    // コード体系
            dose: 1,                                  // 1回の量
            doseUnit: 'g',                            // 単位
            frequencyPerDay: 2,                       // 1日の内服回数
            startDate: startDate,                     // 服薬開始日
            duration: 7,                              // 14日分
            instruction: '内服2回 朝夜食後に',           // 用法
            PRN: false,                               // 頓用=false
            brandSubstitutionPermitted: true,         // ジェネリック
            longTerm: false,                          // 長期処方
        },,,, ]
        };
        ************************************************************/

        var external = {issuedTo: 'external', medication: []};   // 院外処方Prescription
        var internal = {issuedTo: 'internal', medication: []};   // 院内処方Prescription

        simplePrescription.medication.forEach((entry) => {

            var medication = {
                medicine: {
                    name: entry.medicine,
                    code: [{
                        value: entry.medicineCode,
                        attr: {
                            system: entry.medicineCodeSystem
                        }
                    }]
                },
                dose: entry.dose,                       // 1回の量
                doseUnit: entry.doseUnit                // 単位
            };
            if (entry.issuedTo === 'external') {
                external.medication.push(medication);
            } else if (entry.issuedTo === 'internal') {
                internal.medication.push(medication);
            }
            // 以下オプションなのでテストしながら設定

            // 1日の内服回数
            if (entry.hasOwnProperty('frequencyPerDay')) {
                medication.frequencyPerDay = entry.frequencyPerDay;
            }

            // 服薬開始日
            if (entry.hasOwnProperty('startDate')) {
                medication.startDate = entry.startDate;
            }

            // 服薬期間
            if (entry.hasOwnProperty('duration')) {
                medication.duration = entry.duration;
            }

            // 用法
            if (entry.hasOwnProperty('instruction')) {
                medication.instruction = entry.instruction;
            }

            // 頓用=false
            if (entry.hasOwnProperty('PRN')) {
                medication.PRN = entry.PRN;
            }

            // ジェネリック
            if (entry.hasOwnProperty('brandSubstitutionPermitted')) {
                medication.brandSubstitutionPermitted = entry.brandSubstitutionPermitted;
            } else {
                medication.brandSubstitutionPermitted = true;
            }

            // 長期処方
            if (entry.hasOwnProperty('longTerm')) {
                medication.longTerm = entry.longTerm;
            }
        });

        return [external, internal];
    },

    /**
     * TestModule を生成する
     * @param {simpleTest} simpleTest
     * @returns {TestModule}
     */
    buildTestModule: function (simpleTest) {
        /***********************************
        var simpleTest = {
            context: {
                issuedId: issuedId,                             // 検査Id 　運用で決める
                issuedTime: issuedTime,                         // 受付日時
                resultIssued: resultIssued,                     // 報告日時
                resultStatusCode: 'final',                      // 報告状態 コード
                resultStatus: '最終報告',                        // 報告状態
                codeSystem: 'YBS_2016',                         // 検査コード体系名
                facilityName: simpleCreator.facilityName,       // 検査依頼施設
                facilityId: simpleCreator.facilityId,           // 検査依頼施設
                facilityIdType: 'JMARI',                        // 検査依頼施設
                laboratory: {
                    id: '303030',                                // 検査実施会社内での Id
                    idType: 'facility',                          // 施設で付番されているIdであることを示す
                    kanjiName: '石山 由美子',                      // 検査実施施設の代表 なんちゃって個人情報から 代表とは?
                    facilityId: '1.2.3.4.5.6.7890.1.2',          // OID
                    facilityIdType: 'OID',                       // MML0027 OID 方式
                    facilityName: 'ベイスターズ・ラボ',             // 検査実施会社の名称
                    facilityZipCode: '231-0000',                 // 検査実施会社の郵便番号
                    facilityAddress: '横浜市中区スタジアム付近 1-5', // 検査実施会社の住所
                    facilityPhone: '045-000-0072',               // 検査実施会社の電話
                    license: 'lab'                               // MML0026 他に?
                }
            },
            testResult: []
        };
        var simpleResult = {
            spcCode: '',                  // 検体コード
            spcName: '',                  // 検体名
            testCode: '',                 // コード
            testName: '',                 // テスト項目名
            testResult: '',               // 結果値
            unit: '',                     // 単位
            low: '',                      // 下限値
            up: '',                       // 上限値
            out: '',                      // フラグ
            memoCode: '',                 // メモコード
            memo: ''                      // メモ
        };
        ***********************************/
        var context = simpleTest.context;
        var currentSpc = '';                // パース中の検体コード
        var currentLabTest = {};            // パース中の MML labTest
        var item = {};                      // テスト項目（名称、結果値等）
        var numValue = false;               // 数値結果かどうか ToDo..
        var itemMemo = {};                  // テスト項目のメモ

        var testModule = {
            information: {
                attr: {
                    registId: context.issuedId,
                    //sampleTime: testDate,
                    registTime: context.issuedTime,
                    reportTime: context.resultIssued
                },
                reportStatus: {
                    value: context.resultStatus,
                    attr: {
                        statusCode: context.resultStatusCode,
                        statusCodeId: 'mmlLb0001'
                    }
                },
                facility: {
                    value: context.facilityName,                       // 依頼施設
                    attr: {
                        facilityCode: context.facilityId,               // 依頼施設コード
                        facilityCodeId: context.facilityIdType          // 用いたコード体系の名称を記載
                    }
                },
                laboratoryCenter: {
                    value: context.laboratory.facilityName,             // 検査実施施設
                    attr: {
                        centerCode: context.laboratory.facilityId,       // ユーザー指定
                        centerCodeId: context.laboratory.facilityIdType  // 用いたテーブル名を入力
                    }
                }
            },
            laboTest: []
        };

        // イテレイト
        simpleTest.testResult.forEach((entry) => {

            // 検体が変化したら、新規にlabTestを生成しモジュールに加える
            // i.e 検査モジュールは検体単位に分かれる
            if (entry.spcCode !== currentSpc) {
                currentLabTest = {
                    specimen: {                                 // 検体情報
                        specimenName: {
                            value: entry.spcName,               // 検体材料
                            attr: {
                                spCode: entry.spcCode,           // ユーザー指定
                                spCodeId: context.codeSystem    // 用いたテーブル名を入力
                            }
                        }
                    },
                    item: []
                };
                testModule.laboTest.push(currentLabTest);
                currentSpc = entry.spcCode;
            }

            // テスト項目を作成し currentLabTestのitem[]に追加する
            item = {
                itemName: {
                    value: entry.name,              // テスト項目名称
                    attr: {
                        itCode: entry.code,         // コード
                        itCodeId: context.codeSystem
                    }
                },
                value: entry.value                  // 結果値
            };
            currentLabTest.item.push(item);

            // numValue = (単位!=='');
            numValue = (entry.hasOwnProperty('unit'));

            if (numValue) {
                item.numValue = {
                    value: entry.value
                };
                if (entry.hasOwnProperty('lowerLimit') ||
                entry.hasOwnProperty('upperLimit') ||
                entry.hasOwnProperty('out')) {

                    item.numValue.attr = {};
                    if (entry.hasOwnProperty('lowerLimit')) {
                        item.numValue.attr.low = entry.lowerLimit;
                    }
                    if (entry.hasOwnProperty('upperLimit')) {
                        item.numValue.attr.up = entry.upperLimit;
                    }
                    if (entry.hasOwnProperty('out')) {
                        item.numValue.attr.out = entry.out;
                    }
                }
            }

            if (numValue) {
                item.unit = {
                    value: entry.unit
                };
            }

            if (entry.hasOwnProperty('memoCode') && entry.hasOwnProperty('memo')) {
                item.itemMemo = [];
                itemMemo = {
                    value: entry.memo,                               // 項目コメント値
                    attr: {
                        imCodeName: context.codeSystem,              // 項目コメント名称
                        imCode: entry.memoCode,                      // ユーザー指定
                        mCodeId: context.codeSystem                  // 用いたテーブル名を入力
                    }
                };
                item.itemMemo.push(itemMemo);
            }
        });
        //console.log('module count = ' + testModule.laboTest.length);
        return testModule;
    },

    /**
      * MML を生成する
      * @param {simpleMml} - simpleMml
      * @returns {MML}
     */
    build: function (simpleComposition) {
        /***************************************************
        var simpleComposition = {
            context: {
                uuid: uuid,
                confirmDate: confirmDate,
                patient: simplePatient,
                creator: simpleCreator
            },
            content: [{simplePrescription} | {simpleDiagnosis} | {simpleTest}]
        };
        ***************************************************/

        // このMMLの生成日
        var createDate = utils.nowAsDateTime();

        // context
        var context = simpleComposition.context;

        // 患者情報モジュールを生成する
        var patientModule = this.buildPatientModule(context.patient);

        // デフォルトのアクセス権を生成する
        var defaultAccessRight = this.buildDefaultAccessRight(context.patient.id, context.patient.kanjiName);

        // このMMLのcreatorInfoを生成する
        var creatorInfo = this.buildCreatorInfo(context.creator);

        // Header
        var mmlHeader = {
            CreatorInfo: creatorInfo,                    // 生成者識別情報．構造は MML 共通形式 (作成者情報形式) 参照．
            masterId: patientModule.uniqueInfo.masterId, // masterId
            toc: []                                      // tocItem の配列
        };

        // MML
        var result = {
            attr: {
                createDate: createDate
            },
            MmlHeader: mmlHeader,
            MmlBody: {
                MmlModuleItem: []
            }
        };

        // docInfoを生成する際のもとにする上hぷ
        var baseDocInfo = {
            confirmDate: context.confirmDate,       // 確定日時はMMLの確定日時
            groupId: context.uuid                   // groupingId = 含まれているMMLのuuid
        };

        // MML 規格のdocInfo でbaseDocInfoを基に生成される
        // MML のモジュール単位に付加される
        var docInfo = {};
        var content = {};

        // 患者情報が含まれているかどうかのフラグ
        var hasPatientModule = false;
        var addPatientModule = false;               // 設定が必要

        // simpleMMLのcontent配列をイテレート
        // content: [simplePrescription | simpleDiagnosis | simpleTest]
        simpleComposition.content.forEach((entry) => {

            if (entry.contentType === 'Medication') {

                // contentModuleTypeをセットする
                baseDocInfo.contentModuleType = 'prescription';

                // 要素のsimplePrescriptionから院内院外別の処方せんを生成する
                var arr = this.buildPrescriptionModule(entry);

                // 結果は配列で返る
                arr.forEach((prescription) => {

                    // それに薬が入っていたらModuleItemへ加える
                    if (prescription.medication.length > 0) {
                        // MML 規格によりModule単位にuuidを付番する
                        baseDocInfo.uuid = uuid.v4();
                        // 院内と院外で別モジュール値なるのでそれごとにdocInfoを生成する
                        docInfo = this.buildDocInfo(baseDocInfo, creatorInfo, defaultAccessRight);
                        result.MmlBody.MmlModuleItem.push({docInfo: docInfo, content: prescription});
                    }
                });

            } else if (entry.contentType === 'Medical Diagnosis') {
                baseDocInfo.contentModuleType = 'registeredDiagnosis';
                baseDocInfo.uuid = uuid.v4();
                docInfo = this.buildDocInfo(baseDocInfo, creatorInfo, defaultAccessRight);
                content = this.buildRegisteredDiagnosisModule(entry);
                result.MmlBody.MmlModuleItem.push({docInfo: docInfo, content: content});

            } else if (entry.contentType === 'Laboratory Report') {
                // 検体検査のcreatorは検査会社の代表
                var creator = this.buildCreatorInfo(entry.context.laboratory);
                // それがdocInfoにセットされる
                baseDocInfo.contentModuleType = 'test';
                baseDocInfo.uuid = uuid.v4();
                docInfo = this.buildDocInfo(baseDocInfo, creator, defaultAccessRight);
                content = this.buildTestModule(entry);
                result.MmlBody.MmlModuleItem.push({docInfo: docInfo, content: content});

            } else if (entry.contentType === 'Patient Information') {
                baseDocInfo.contentModuleType = 'patientInfo';
                baseDocInfo.uuid = uuid.v4();
                docInfo = this.buildDocInfo(baseDocInfo, creatorInfo, defaultAccessRight);
                content = this.buildPatientModule(entry);
                result.MmlBody.MmlModuleItem.push({docInfo: docInfo, content: content});
                hasPatientModule = true;
            }
        });

        // 患者情報がなかった場合は先頭へ追加する
        if (addPatientModule && !hasPatientModule) {
            baseDocInfo.contentModuleType = 'patientInfo';
            baseDocInfo.uuid = uuid.v4();
            baseDocInfo.confirmDate = createDate;
            docInfo = this.buildDocInfo(baseDocInfo, creatorInfo, defaultAccessRight);
            result.MmlBody.MmlModuleItem.unshift({docInfo: docInfo, content: patientModule});
        }

        return mmlBuilder.build(result);
    }
};
