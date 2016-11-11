'use strict';

const uuid = require('node-uuid');
const utils = require('../lib/utils');
const mmlBuilder = require('../lib/mmlBuilder');
const logger = require('../logger/logger');
const moduleNames = {
    patientInfo: 'mmlPi',
    healthInsurance: 'mmlHi',
    registeredDiagnosis: 'mmlRd',
    lifestyle: 'mmlLs',
    baseClinic: 'mmlBc',
    firstClinic: 'mmlFcl',
    progressCourse: 'mmlPc',
    surgery: 'mmlSg',
    summary: 'mmlSm',
    referral: 'mmlRe',
    test: 'mmlLb',
    report: 'mmlRp',
    flowsheet: 'mmlFs',
    vitalsign: 'mmlVs',
    prescription: 'mmlPs',
    injection: 'mmlInj',
    hemodialysis: 'mmlHd'
};

module.exports = {

    getModuleName: function (contentType) {
        return moduleNames[contentType];
    },

    createHREF: function (docId, index, href) {
        var arr = [];
        arr.push(docId);
        arr.push('_');
        arr.push(utils.addZero(index, 2));
        var lastDot = href.lastIndexOf('.');
        arr.push(href.substring(lastDot));
        return arr.join('');
    },

    buildExtRef: function (e, extArray) {
        /*********************
        var e = {
            href: '',                           // uri
            contentType: '',                    // コンテントタイプ ?
            medicalRole: '',                    // 役割 ?
            title: '',                          // タイトル ?
            base64: ''                          // PDF、画像等の base64
        };
        *********************/
        var copyExt = {
            attr: {
                href: e.href
            }
        };
        if (utils.propertyIsNotNull(e, 'contentType')) {
            copyExt.attr.contentType = e.contentType;
        }
        if (utils.propertyIsNotNull(e, 'medicalRole')) {
            copyExt.attr.medicalRole = e.medicalRole;
        }
        if (utils.propertyIsNotNull(e, 'title')) {
            copyExt.attr.title = e.title;
        }
        // base64 を配列に集める
        if (extArray !== null && utils.propertyIsNotNull(e, 'base64')) {
            extArray.push({
                href: copyExt.attr.href,
                base64: e.base64
            });
        }
        return copyExt;
    },

    /**
     * 患者、医師等の個人用Idを生成する
     * @param {pid} - pid 個人に発番されているId
     * @param {string} - idType MML0024(全国統一:national 地域:local 施設固有:facility)
     * @param {string} - facilityId 医療機関のId
     */
    buildPersonId: function (pid, facilityId) {
        // 千年カルテ仕様
        var idType = 'facility';    // 施設固有
        // idTypeが施設固有の場合(===facility) tableIdに施設Idを設定する
        return {
            value: pid,                     // 付番されているId
            attr: {
                type: idType,
                tableId: (idType === 'facility') ? facilityId : 'MML0024'
            }
        };
    },

    // 人名
    buildPersonName: function (repCode, fullName) {
        // 千年カルテ仕様
        fullName = fullName.replace(' ', '　');            // 全角区切り
        return {
            attr: {
                repCode: repCode,                          // 表記法 (漢字:I カナ:P ローマ字:A)
                tableId: 'MML0025'                         // 表記法を規定するテーブル名 MML0025
            },
            fullname: fullName                             // フルネーム
        };
    },
    buildPersonNameWithKanji: function (fullName) {
        return this.buildPersonName('I', fullName);
    },
    buildPersonNameWithKana: function (fullName) {
        return this.buildPersonName('P', fullName);
    },
    buildPersonNameWithRoman: function (fullName) {
        return this.buildPersonName('A', fullName);
    },

    // 住所 漢字のみ
    buildAddress: function (addClass, postalCode, address) {
        return {
            attr: {
                repCode: 'I',                             // 表記法 (漢字:I カナ:P ローマ字:A)
                addressClass: addClass,                   // 住所の種類コード MML0002 を使用
                tableId: 'MML0025'                        // 上記の表記法を規定するテーブル名 MML0025
            },
            full: address,                                // 一連住所
            zip: postalCode                               // 郵便番号
        };
    },
    buildBusinessAddress: function (postalCode, address) {
        return this.buildAddress('business', postalCode, address);
    },
    buildHomeAddress: function (postalCode, address) {
        return this.buildAddress('home', postalCode, address);
    },

    // 電話番号
    buildPhone: function (type, phoneNumber) {
        return {
            attr: {
                telEquipType: type                        // 装置の種類コード MML0003から使用
            },
            full: phoneNumber                             // 一連電話番号
        };
    },
    buildTelephone: function (phoneNumber) {
        return this.buildPhone('PH', phoneNumber);
    },
    buildMobile: function (phoneNumber) {
        return this.buildPhone('CP', phoneNumber);
    },

    // 施設情報 MMLで病院は施設で表現 漢字のみ
    buildFacility: function(fId, fName) {
        // 千年カルテ仕様
        var idType = 'OID';                         // OID
        // 施設名称 漢字
        var facilityName = {
            value: fName,
            attr: {
                repCode: 'I',                       // 表記法 (漢字:I カナ:P ローマ字:A)
                tableId: 'MML0025'                  // MML0025
            }
        };
        // 施設Id
        var facilityId = {
            value: fId,                             // 施設に付番されているId type属性に発番元（体系）を記載する
            attr: {
                type: idType,                       // MML0027 (認証局:ca 保険医療機関コード:insurance 文科省大学付属病院施設区分:monbusyo 日本医師会総合政策研究コード:JMARI)
                tableId: 'MML0027'                  // MML0027
            }
        };
        return {
            name: [facilityName],                   // 施設名 Name の配列
            Id: facilityId                          // 施設ID
        };
    },

    // 診療科情報
    buildDepartment: function(dId, dName) {
        // 千年カルテ仕様
        var idType = 'facility';                    // idType=facility, 施設固有
        // 診療科Id
        var deptId = {
            value: dId,                             // medicalの場合はMML0028 dentalの場合はMML0030を参照
            attr: {
                type: idType,                       // MML0029 (医科診療科コード:medical 歯科診療科コード:dental 施設内ユーザー定義診療科コード:facility)
                tableId: 'MML0029'
            }
        };
        // 診療科名称 漢字
        var deptName = {
            value: dName,
            attr: {
                repCode: 'I',                        // 表記法 (漢字:I カナ:P ローマ字:A)
                tableId: 'MML0025'                   // MML0025
            }
        };
        // 診療科情報
        return {
            name: [deptName],                         // 診療科名 Name の配列
            Id: deptId                                // 診療科ID
        };
    },

    // creator(医師等)個人情報
    buildPersonalizedInfo: function (person) {
        // 作成者(creator)Id
        var creatorId = this.buildPersonId(person.id, person.facilityId);

        // 作成者氏名
        var creatorNames = [];
        if (utils.propertyIsNotNull(person, 'kanjiName')) {
            creatorNames.push(this.buildPersonNameWithKanji(person.kanjiName));
        }
        if (utils.propertyIsNotNull(person, 'kanaName')) {
            creatorNames.push(this.buildPersonNameWithKana(person.kanaName));
        }
        if (utils.propertyIsNotNull(person, 'romanName')) {
            creatorNames.push(this.buildPersonNameWithRoman(person.romanName));
        }

        // 肩書きなど
        if (utils.propertyIsNotNull(person, 'prefix')) {
            creatorNames.forEach((entry) => {
                entry.prefix = person.prefix;
            });
        }

        // 学位
        if (utils.propertyIsNotNull(person, 'degree')) {
            creatorNames.forEach((entry) => {
                entry.degree = person.degree;
            });
        }

        // 施設情報
        var facility = this.buildFacility(person.facilityId, person.facilityName);

        // 医療機関住所
        var facilityAddress = this.buildBusinessAddress(person.facilityZipCode, person.facilityAddress);

        // 医療機関電話番号
        var facilityPhone = this.buildTelephone(person.facilityPhone);

        // creator(医師)個人情報
        var personalizedInfo = {
            Id: creatorId,                               // ID情報
            personName: creatorNames,                    // 人名 Name の配列
            Facility: facility,                          // 施設情報 Facility
            addresses: [facilityAddress],                // 住所
            phones: [facilityPhone]                      // 電話番号
        };

        // 診療科情報
        if (utils.propertyIsNotNull(person, 'departmentId')) {
            var department = this.buildDepartment(person.departmentId, person.departmentName);
            personalizedInfo.Department = department;
        }

        // 電子メールもセット可能
        if (utils.propertyIsNotNull(person, 'email')) {
            personalizedInfo.emailAddresses = [person.email];
        }

        return personalizedInfo;
    },

    // 医療資格
    buildCreatorLicense: function (license) {
        return {
            value: license,                               // 生成者の資格 MML0026を使用
            attr: {
                tableId: 'MML0026'                        // 生成者の資格を規定するテーブル名 MML0026
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

        // creator(医師)個人情報
        var personalizedInfo = this.buildPersonalizedInfo(simpleCreator);

        // 医療資格
        var creatorLicense = this.buildCreatorLicense(simpleCreator.license);

        // 作成者情報
        return {
            PersonalizedInfo: personalizedInfo,          // 個人情報形式 PersonalizedInfo
            creatorLicense: [creatorLicense]             // 生成者の資格 creatorLicenseの配列
        };
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

    buildAccessRight: function (patientId, patientName, simpleAccessRight) {
        // 記載者施設
        var accessRightForCreator = {
            attr: {
                permit: simpleAccessRight.creator
            },
            facility: [{
                attr: {
                    facilityCode: 'creator',
                    tableId: 'MML0035'
                },
                value: '記載者施設'
            }]
        };

        // 診療歴のある施設
        var accessRightForExperience = {
            attr: {
                permit: simpleAccessRight.experience
            },
            facility: [{
                attr: {
                    facilityCode: 'experience',
                    tableId: 'MML0035'
                },
                value: '診療歴のある施設'
            }]
        };

        // 患者
        var accessRightForPatient = {
            attr: {
                permit: simpleAccessRight.patient
            },
            person: [{
                attr: {
                    personCode: 'patient',
                    tableId: 'MML0036',
                    personId: patientId,                            // 患者ID
                    personIdType: '1000_Years_Karte'                // ToDo
                },
                value: patientName
            }]
        };

        // 配列で返す
        return [accessRightForCreator, accessRightForExperience, accessRightForPatient];
    },

    /**
     * docInfo を生成する
     * @param {metaInfo} metaInfo
     * @param {CreatorInfo} creatorInfo - このドキュメントのcreator
     * @params {[]} defaultAccessRight - このプロジェクトのデフォルトアクセス権
     * @returns {docInfo}
     */
    buildDocInfo: function (metaInfo, creatorInfo, accessRight) {
        /*********************************************************************:
        var simpleDocInfo = {
            contentModuleType: '',
            uuid: '',
            confirmDate: '',
            title: '',
            parentUUID: '',
            parentConfirmDate: '',
        };
        var metaInfo = {
            contentModuleType: contentType,             // コンテントタイプ
            facilityId: context.patient.facilityId,     // 医療機関ID
            patientId: context.patient.id,              // 患者ID
            uuid: context.uuid                          // uuid
            confirmDate: context.confirmDate            // 確定日時はMMLの確定日時
        };
        ***********************************************************************/

        // 千年仕様 docId = moduleName_facilityId_patientId_uuid
        var arr = [];
        arr.push(this.getModuleName(metaInfo.contentModuleType));   // moduleName fron contentType
        arr.push(metaInfo.facilityId);
        arr.push(metaInfo.patientId);
        arr.push(metaInfo.uuid);
        var docUUID = arr.join('_');

        // title
        var title = utils.propertyIsNotNull(metaInfo, 'title') ? metaInfo.title : metaInfo.contentModuleType;

        // 対象
        var docInfo = {
            attr: {
                contentModuleType: metaInfo.contentModuleType  // 文書の種類コード MML0005を使用
                // moduleVersion: ''                               // 使用モジュールのDTDのURIを記載
            },
            securityLevel: accessRight,                            // accessRight の配列
            title: {
                value: title,                                      // 文書タイトル
                attr: {
                    generationPurpose: 'record'                    // 文書詳細種別 MML0007を使用
                }
            },
            docId: {                                               // 文書 ID 情報
                uid: docUUID                                       // 文書ユニークID
                // parentId: [],                                   // 関連親文書ID parentId  の配列
                // groupId: []                                     // グループ ID groupIdの配列
            },
            confirmDate: {
                value: metaInfo.confirmDate                    // カルテ電子保存の確定日時
                // attr: {
                //   start: 'YYYY-MM-DDThh:mm:ss',                   // 時系列情報場合の開始日時
                //   end: 'YYYY-MM-DDThh:mm:ss',                     // 時系列情報場合の終了日時
                //   firstConfirmDate: 'YYYY-MM-DDThh:mm:ss',        // 修正が発生した場合の，初回確定日時
                //   eventDate: 'YYYY-MM-DDThh:mm:ss'                // 実際に記載された診療イベントが発生した日時
                // }
            },
            CreatorInfo: creatorInfo,                             // 個々の文書の作成者情報．構造は MML 共通形式 (作成者情報形式)
            extRefs: []                                           // content 内に記載されているすべての外部リンク情報のリスト extRefの配列
        };

        // groupId
        if (utils.propertyIsNotNull(metaInfo, 'groupId')) {
            var group = {
                value: metaInfo.groupId,
                attr: {
                    groupClass: metaInfo.contentModuleType
                }
            };
            docInfo.docId.groupId = [group];
        }

        // 修正版かどうか -> parentUUID && parentConfirmDate
        // 千年では使用しない
        if (utils.propertyIsNotNull(metaInfo, 'parentUUID') &&
            utils.propertyIsNotNull(metaInfo, 'parentConfirmDate')) {

            var parentId = {
                value: metaInfo.parentUUID,                    // 元の版のUUID
                attr: {
                    relation: 'oldEdition'                        // 関連の種別 MML0008から使用
                }
            };
            docInfo.docId.parentId = [parentId];

            docInfo.confirmDate.attr = {
                firstConfirmDate: metaInfo.parentConfirmDate  // 最初の確定日
            };
        }

        return docInfo;
    },

    /**
     * 1. PatientModule
     */
    patientInfo: function (docInfo, simplePatient, extArray) {
        /********************************************************************
        var simplePatient = {
            id: '',                                         // Id
            idType: ''                                      // MML0024(全国統一:national 地域:local 施設固有:facility)
            facilityId: '',                                 // 施設Id
            kanjiName: '',
            kanaName: '',
            romanName: '',
            gender: '',                                     // MML0010(femail male other unknown)
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
        var id = this.buildPersonId(simplePatient.id, simplePatient.facilityId);

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
        if (utils.propertyIsNotNull(simplePatient, 'kanjiName')) {
            patientModule.personName.push(this.buildPersonNameWithKanji(simplePatient.kanjiName));
        }
        // かな/カナ氏名
        if (utils.propertyIsNotNull(simplePatient, 'kanaName')) {
            patientModule.personName.push(this.buildPersonNameWithKana(simplePatient.kanaName));
        }
        // ローマ字氏名
        if (utils.propertyIsNotNull(simplePatient, 'romanName')) {
            patientModule.personName.push(this.buildPersonNameWithRoman(simplePatient.romanName));
        }

        // 国籍
        if (utils.propertyIsNotNull(simplePatient, 'nationality')) {
            patientModule.nationality = {value: simplePatient.nationality};
        }

        // 婚姻状況
        if (utils.propertyIsNotNull(simplePatient, 'maritalStatus')) {
            patientModule.maritalStatus = simplePatient.maritalStatus;
        }

        // 患者住所
        if (utils.propertyIsNotNull(simplePatient, 'address')) {
            patientModule.addresses = [];
            patientModule.addresses.push(this.buildHomeAddress(simplePatient.postalCode, simplePatient.address));
        }

        // 患者電子メールアドレス
        if (utils.propertyIsNotNull(simplePatient, 'email')) {
            patientModule.emailAddresses = [simplePatient.email];
        }

        // 患者電話自宅番号
        if (utils.propertyIsNotNull(simplePatient, 'telephone') || utils.propertyIsNotNull(simplePatient, 'mobile')) {

            patientModule.phones = [];

            if (utils.propertyIsNotNull(simplePatient, 'telephone')) {
                patientModule.phones.push(this.buildTelephone(simplePatient.telephone));
            }
            if (utils.propertyIsNotNull(simplePatient, 'mobile')) {
                patientModule.phones.push(this.buildMobile(simplePatient.mobile));
            }
        }

        return patientModule;
    },

    /**
     * 2. HealthInsuranceModule
     */
    healthInsurance: function (docInfo, simpleHealthInsurance, extArray) {
        /*******************************************************************************
        // 保険種別
        insuranceClass;

        // 保険種別コード
        insuranceClassCode;

        // 保険者番号
        insuranceNumber;

        // 被保険者記号
        clientGroup;

        // 被保険者番号
        clientNumber;

        // 本人家族区分
        familyClass;

        // 開始日(交付年月日）
        startDate;

        // 有効期限
        expiredDate;

        // 継続疾患名 no use
        continuedDisease;

        // 入院時負担率
        payInRatio;

        // 外来時負担率
        payOutRatio;

        // 公費負担リスト
        publicItems;

        // 複数公費の優先順位
        priority;

        // 公費負担名称
        providerName;

        // 負担者番号
        provider;

        // 受給者番号
        recipient;

        // 開始日
        startDate;

        // 開始日
        expiredDate;

        // 負担率または負担金
        paymentRatio;

        // 負担率または負担金
        paymentRatioType;

        var simpleHealthInsurance = {
            countryType: '',                                // 国コード ?
            insuranceClass: '',                             // 保険種別 ?
            insuranceClassCode: '',                         // 保険種別コード ?
            insuranceNumber: '',                            // 健康保険者番号
            clientGrouproup: '',                            // 被保険者記号
            clientGroupNumber: '',                          // 被保険者番号
            familyClass: '',                                // 本人家族区分．true：本人，false：家族
            startDate: '',                                  // 開始日 (交付年月日) CCYY-MM-DD
            expiredDate: '',                                // 有効期限
            paymentInRatio: '',                             // 入院時の負担率 ?
            paymentOutRatio: '',                            // 外来時の負担率 ?
            publicInsurance: []                             // 公費負担医療情報 [publicInsuranceItem]  ?
        };

        var publicInsuranceItem = {
            priority: ''                                    // 優先順位
            providerName: '',                               // 公費負担名称 ?
            provider: '',                                   // 負担者番号
            recipient: '',                                  // 受給者番号
            startDate: '',                                  // 開始日
            expiredDate: '',                                // 有効期限
            paymentRatio: '',                               // ?
            ratioType: ''                                   // MML0032
        };
        ********************************************************************************/
        var result = {};

        // countryType
        var countryType = (utils.propertyIsNotNull(simpleHealthInsurance, 'countryType'))
            ? simpleHealthInsurance.countryType
            : 'JPN';
        result.attr = {
            countryType: countryType
        };

        // insuranceClass
        result.insuranceClass = {
            value: simpleHealthInsurance.insuranceClass,    // 健康保険種別
            attr: {
                ClassCode: simpleHealthInsurance.insuranceClassCode,
                tableId: 'MML0031'                             // MML0031
            }
        };

        // insuranceNumber
        result.insuranceNumber = simpleHealthInsurance.insuranceNumber;

        // clientId
        result.clientId = {                                     // 被保険者情報
            group: simpleHealthInsurance.clientGroup,           // 被保険者記号
            number: simpleHealthInsurance.clientNumber           // 被保険者番号
        };

        // familyClass
        result.familyClass = simpleHealthInsurance.familyClass;

        // startDate
        result.startDate = simpleHealthInsurance.startDate;

        // expiredDate
        result.expiredDate = simpleHealthInsurance.expiredDate;

        // paymentInRatio
        if (utils.propertyIsNotNull(simpleHealthInsurance, 'paymentInRatio')) {
            result.paymentInRatio = simpleHealthInsurance.paymentInRatio;
        }

        // paymentOutRatio
        if (utils.propertyIsNotNull(simpleHealthInsurance, 'paymentOutRatio')) {
            result.paymentOutRatio = simpleHealthInsurance.paymentOutRatio;
        }

        // publicInsurance
        if (utils.propertyIsNotNull(simpleHealthInsurance, 'publicInsurance')) {
            result.publicInsurance = [];
            simpleHealthInsurance.publicInsurance.forEach((entry) => {
                var it = {
                    attr: {
                        priority: entry.priority
                    },
                    provider: entry.provider,
                    recipient: entry.recipient,
                    startDate: entry.startDate,
                    expiredDate: entry.expiredDate
                };

                if (utils.propertyIsNotNull(entry, 'providerName')) {
                    it.providerName = entry.providerName;
                }
                if (utils.propertyIsNotNull(entry, 'paymentRatio') && utils.propertyIsNotNull(entry, 'paymentRatioType')) {
                    it.paymentRatio = {
                        value: entry.paymentRatio,                  // 負担率または負担金
                        attr: {
                            ratioType: entry.paymentRatioType       // MML0032
                        }
                    };
                }
                result.publicInsurance.push(it);
            });
        }

        return result;
    },

    /**
     * 3. RegisteredDiagnosisModule
     */
    registeredDiagnosis: function (docInfo, simpleDiagnosis, extArray) {
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
        if (utils.propertyIsNotNull(simpleDiagnosis, 'category')) {
            registeredDiagnosisModule.categories = [{
                value: simpleDiagnosis.category,
                attr: {
                    // ToDo MML0012 ~ MML0015
                    tableId: 'MML0012'
                }
            }];
        }

        // 開始日
        if (utils.propertyIsNotNull(simpleDiagnosis, 'dateOfOnset')) {
            registeredDiagnosisModule.startDate = simpleDiagnosis.dateOfOnset;
        }

        // 終了日
        if (utils.propertyIsNotNull(simpleDiagnosis, 'dateOfRemission')) {
            registeredDiagnosisModule.endDate = simpleDiagnosis.dateOfRemission;
        }

        // 転帰
        if (utils.propertyIsNotNull(simpleDiagnosis, 'outcome')) {
            registeredDiagnosisModule.outcome = simpleDiagnosis.outcome;
        }

        return registeredDiagnosisModule;
    },

    /**
     * 4. LifestyleModule
     */
    lifestyle: function (docInfo, simpleLifestyle, extArray) {
        /******************************************
        var simpleLifestyle = {
            occupation: '',
            tobacco: '',
            alcohol: '',
            other: ''
        };
        ******************************************/
        return JSON.parse(JSON.stringify(simpleLifestyle));
    },

    /**
     * 5. BaseClinicModule
     */
    baseClinic: function (docInfo, simpleBaseClinic, extArray) {
        /*******************************************************************************
        var simpleBaseClinic = {                    // 基礎的診療情報
            allergy: [],                            // アレルギー情報 ? [allergyItem]
            bloodtype: {},                          // 血液型情報 ?
            infection: []                           // 感染性情報 ? [infectionItem]
        };

        var allergyItem = {
            factor: '',                             // アレルギー原因
            severity: '',                           // アレルギー反応程度 ? MML0017
            identifiedDate: '',                     // アレルギー同定日 ?
            memo: ''                                // アレルギーメモ ?
        };

        var bloodtype = {
            abo: '',                                // ABO 式血液型 MML0018
            rh: '',                                 // Rho(D) 式血液型 ? MML0019
            others: [],                             // その他の血液型 ? [other]
            memo: ''                                // メモ ?
        };

        var other = {
            typeName: '',                           // 血液型名称
            typeJudgement: '',                      // 血液型判定
            description: ''                         // 血液型注釈 ?
        };

        var infectionItem = {
            factor: '',                             // 感染性要因名
            examValue: '',                          // 感染性要因検査値
            identifiedDate: '',                     // 感染性要因同定日 ?
            memo: ''                                // 感染性要因メモ ?
        };
        ********************************************************************************/
        return JSON.parse(JSON.stringify(simpleBaseClinic));
    },

    /**
     * 6. FirstClinicModule
     */
    firstClinic: function (docInfo, simpleFirstClinic, extArray) {
        /******************************************************************************
        var simpleFirstClinic = {                                   // 初診時特有情報
            familyHistory: [],                                      // 家族歴情報 ? [familyHistoryItem]
            childhood: {},                                          // 小児期情報 ?
            pastHistory: {},                                        // 既往歴情報 ?
            chiefComplaints: '',                                    // 主訴 ?
            presentIllnessNotes: ''                                 // 現病歴自由記載 ?
        };

        var familyHistoryItem = {
            relation: '',                                           // 続柄コード MML0020
            simpleDiagnosis: {},                                    // 疾患名情報
            age: '',                                                // 家族の疾患時年齢 ?
            memo: ''                                                // メモ ?
        };

        var childhood = {                                           // 出生時情報
            birthInfo: {
                facilityId: '',                                     // Facility へ変換 oid
                facilityName: ''
                deliveryWeeks: '',                                  // 分娩時週数 ? PnW
                deliveryMethod: '',                                 // 分娩方法 ?
                bodyWeight: '',                                     // 出生時体重 ?
                bodyHeight: '',                                     // 出生時身長 ?
                chestCircumference: '',                             // 出生時胸囲 ?
                headCircumference: '',                              // 出生時頭囲 ?
                memo: ''                                            // 出生時メモ ?
            },
            vaccination: []                                         // 予防接種情報 ? [vaccinationItem]
        };

        var vaccinationItem = {
            vaccine: '',                                            // 接種ワクチン名
            injected: '',                                           // 実施状態．true：ワクチン接種，false：接種せず
            age: '',                                                // 接種時年齢 ? PnYnM 1歳6ヶ月=P1Y6M
            memo: ''                                                // 実施時メモ ?
        };

        var pastHistory = {                                         // 既往歴情報 choice
            freeNotes: '',                                          // 自由文章表現 choice
            pastHistoryItem: []                                     // 時間表現併用 choice Not support
        };

        var pastHistoryItem = {
            timeExpression: '',                                     // 時間表現
            eventExpression: []                                     // 時間表現に対応するイベント表現 ? [string]
        };
        ******************************************************************************/

        // logger.info(JSON.stringify(simpleFirstClinic, null, 4));

        var result = {};

        // familyHistory
        if (utils.propertyIsNotNull(simpleFirstClinic, 'familyHistory')) {
            result.familyHistory = [];
            simpleFirstClinic.familyHistory.forEach((entry) => {
                var fhItem = {
                    relation: entry.relation
                };
                fhItem.RegisteredDiagnosisModule = this.registeredDiagnosis(docInfo, entry.simpleDiagnosis);
                // logger.info(JSON.stringify(fhItem, null, 4));
                if (utils.propertyIsNotNull(entry, 'age')) {
                    fhItem.age = entry.age;
                }
                if (utils.propertyIsNotNull(entry, 'memo')) {
                    fhItem.memo = entry.memo;
                }
                // logger.info(JSON.stringify(fhItem, null, 4));
                result.familyHistory.push(fhItem);
            });
        }

        //childhood
        if (utils.propertyIsNotNull(simpleFirstClinic, 'childhood')) {
            var src = simpleFirstClinic.childhood;
            var dest = {};
            result.childhood = dest;
            if (utils.propertyIsNotNull(src, 'birthInfo')) {
                dest.birthInfo = {};
                if (utils.propertyIsNotNull(src.birthInfo, 'facilityId') && utils.propertyIsNotNull(src.birthInfo, 'facilityName')) {
                    // 共通形式の Facility
                    dest.birthInfo.Facility = this.buildFacility(src.birthInfo.facilityId, src.birthInfo.facilityName);
                }
                if (utils.propertyIsNotNull(src.birthInfo, 'deliveryWeeks')) {
                    dest.birthInfo.deliveryWeeks = src.birthInfo.deliveryWeeks;
                }
                if (utils.propertyIsNotNull(src.birthInfo, 'deliveryMethod')) {
                    dest.birthInfo.deliveryMethod = src.birthInfo.deliveryMethod;
                }
                if (utils.propertyIsNotNull(src.birthInfo, 'bodyWeight')) {
                    dest.birthInfo.bodyWeight = {
                        value: src.birthInfo.bodyWeight,
                        attr: {
                            unit: 'g'
                        }
                    };
                }
                if (utils.propertyIsNotNull(src.birthInfo, 'bodyHeight')) {
                    dest.birthInfo.bodyHeight = {
                        value: src.birthInfo.bodyHeight,
                        attr: {
                            unit: 'cm'
                        }
                    };
                }
                if (utils.propertyIsNotNull(src.birthInfo, 'chestCircumference')) {
                    dest.birthInfo.chestCircumference = {
                        value: src.birthInfo.chestCircumference,
                        attr: {
                            unit: 'cm'
                        }
                    };
                }
                if (utils.propertyIsNotNull(src.birthInfo, 'headCircumference')) {
                    dest.birthInfo.headCircumference = {
                        value: src.birthInfo.headCircumference,
                        attr: {
                            unit: 'cm'
                        }
                    };
                }
                if (utils.propertyIsNotNull(src.birthInfo, 'memo')) {
                    dest.birthInfo.memo = src.birthInfo.deliveryMethod;
                }
            }
            if (utils.propertyIsNotNull(src, 'vaccination')) {
                dest.vaccination = [];
                src.vaccination.forEach((entry) => {
                    var it = {
                        vaccine: entry.vaccine,
                        injected: entry.injected
                    };
                    if (utils.propertyIsNotNull(entry, 'age')) {
                        it.age = entry.age;
                    }
                    if (utils.propertyIsNotNull(entry, 'memo')) {
                        it.memo = entry.memo;
                    }
                    dest.vaccination.push(it);
                });
            }
        }

        // 既往歴 freeNotes
        if (utils.propertyIsNotNull(simpleFirstClinic, 'pastHistory') &&
                utils.propertyIsNotNull(simpleFirstClinic.pastHistory, 'freeNotes')) {
            result.pastHistory = {
                freeNotes: simpleFirstClinic.pastHistory.freeNotes
            };
        } else if (utils.propertyIsNotNull(simpleFirstClinic, 'pastHistory') &&
                utils.propertyIsNotNull(simpleFirstClinic.pastHistory, 'pastHistoryItem')) {
            result.pastHistory = {
                pastHistoryItem: []
            };
            simpleFirstClinic.pastHistory.pastHistoryItem.forEach((entry) => {
                // timeExpression, eventExpression pair
                var it = {
                    timeExpression: entry.timeExpression,           // pair
                    eventExpression: [entry.eventExpression]        // pair
                };
                result.pastHistory.pastHistoryItem.push(it);
            });
        }

        // chiefComplaints
        if (utils.propertyIsNotNull(simpleFirstClinic, 'chiefComplaints')) {
            result.chiefComplaints = simpleFirstClinic.chiefComplaints;
        }

        // presentIllnessNotes
        if (utils.propertyIsNotNull(simpleFirstClinic, 'presentIllnessNotes')) {
            result.presentIllnessNotes = simpleFirstClinic.presentIllnessNotes;
        }

        return result;
    },

    /**
     * 7. ProgressCourceModule
     */
    progressCourse: function (docInfo, simpleProgressCource, extArray) {
        /*******************************************************
        var simpleProgressCource = {
            freeExpression: '',
            extRef: []
        };
        *******************************************************/
        var result = {
            freeExpression: simpleProgressCource.freeExpression
        };
        if (utils.propertyIsNotNull(simpleProgressCource, 'extRef')) {

            result.extRef = [];
            var index = 0;
            var docId = docInfo.docId.uid;
            var newHREF = null;

            simpleProgressCource.extRef.forEach((entry) => {

                // entry.href = docId_index.file's ext
                newHREF = this.createHREF(docId, index++, entry.href);
                entry.href = newHREF;

                // 1. base64 なし => resul.extRef へ
                result.extRef.push(this.buildExtRef(entry, null));

                // 2. base64あり => docInfo.extRefs にまとめる
                docInfo.extRefs.push(this.buildExtRef(entry, extArray));
            });
        }
        return result;
    },

    /**
     * 8. SurgeryModule
     */
    buildSurgeryItem: function (docInfo, simpleSurgery, extArray) {
        /*******************************************************************************
        var simpleSurgery = {                                   // 手術記録情報
            surgeryItem: []                                     // [surgeryItem]
        };

        var surgeryItem = {
            context: {                                          // 手術ヘッダー情報 -> surgicalInfo
                type: '',                                       // MML0021
                date: '',                                       // 手術施行日 CCYY-MM-DD
                startTime: '',                                  // 手術開始時刻 ? hh:mm
                duration: '',                                   // 手術時間 ? PTnHnM 5時間25分=PT5H25M
                surgicalDepartmentId: '',                       // 手術実施診療科情報 ? [mmlDp:Department]
                surgicalDepartmentName: '',                     // 手術実施診療科情報 ? [mmlDp:Department]
                patientDepartmentId: '',
                patientDepartmentName: ''                       // 手術時に患者の所属していた診療科 ? [mmlDp:Department]
            },
            surgicalDiagnosis: [],                              // 外科診断情報 simpleDiagnosis -> [mmlRd:RegisteredDiagnosisModule]
            surgicalProcedure: [],                              // 手術法情報 [procedureItem]
            surgicalStaffs: [],                                 // 麻酔を除く手術スタッフの情報 ? [staff]
            anesthesiaProcedure: [],                            // 麻酔法名情報 ? [titleItem]
            anesthesiologists: [],                              // 麻酔医情報 ? [staff]
            anesthesiaDuration: '',                             // 麻酔時間 ? PTnHnM
            operativeNotes: '',                                 // 手術記録の自由文章表現 ?
            referenceInfo: {                                    // 手術記録に用いる図や写真を外部参照 ?
                extRef: {}                                      // 解説では extRef [extRef]  xsdは {extRef}
            },
            memo: ''                                            // 手術に関する追加事項 ?
        };

        var procedureItem = {
            operation: ''                                        // 手術法 choice
            code: '',                                            // 手術法コード
            system: ''                                           // 手術法コード体系名
            // operationElement: [],                               // 手術法の要素分割表記 choice [operationElementItem] Not supported
            procedureMemo: ''                                   // 手術法に関する追加事項 ?
        };

        var operationElementItem = {
            values: []                                          // 分割された手術要素名 [title]
        };

        var titleItem = {                                       // 分割された手術要素名
            title: '',
            code: '',                                           // 手術法コード 麻酔法名コード
            system: ''                                          // 手術法コード体系名 麻酔法名コード体系名
        };

        var staff = {
            superiority: '',                                    // 序列
            staffClass: ''                                      // 手術スタッフ区分 MML0022
            staffInfo: {}                                       // スタッフ 情報 simpleCreator -> [mmlPsi:PersonalizedInfo]
        };
        *******************************************************************************/

        // logger.info(JSON.stringify(simpleSurgery, null,4));

        var result = {
            surgicalInfo: {
                date: simpleSurgery.context.date
            }
        };

        // surgicalInfo
        if (utils.propertyIsNotNull(simpleSurgery.context, 'type')) {
            result.surgicalInfo.attr = {
                type: simpleSurgery.context.type
            };
        }
        if (utils.propertyIsNotNull(simpleSurgery.context, 'startTime')) {
            result.surgicalInfo.startTime = simpleSurgery.context.startTime;
        }
        if (utils.propertyIsNotNull(simpleSurgery.context, 'duration')) {
            result.surgicalInfo.duration = simpleSurgery.context.duration;
        }
        if (utils.propertyIsNotNull(simpleSurgery.context, 'surgicalDepartmentId') && utils.propertyIsNotNull(simpleSurgery.context, 'surgicalDepartmentName') ) {
            var sdp = this.buildDepartment(simpleSurgery.context.surgicalDepartmentId, simpleSurgery.context.surgicalDepartmentName);
            result.surgicalInfo.surgicalDepartment = [sdp];
        }
        if (utils.propertyIsNotNull(simpleSurgery.context, 'patientDepartmentId') && utils.propertyIsNotNull(simpleSurgery.context, 'patientDepartmentName') ) {
            var pdp = this.buildDepartment(simpleSurgery.context.patientDepartmentId, simpleSurgery.context.patientDepartmentName);
            result.surgicalInfo.patientDepartment = [pdp];
        }
        // logger.info(JSON.stringify(result, null,4));

        // surgicalDiagnosis
        result.surgicalDiagnosis = [];
        simpleSurgery.surgicalDiagnosis.forEach((entry) => {
            result.surgicalDiagnosis.push(this.registeredDiagnosis(docInfo, entry));
        });
        // logger.info(JSON.stringify(result, null,4));

        // surgicalProcedure
        result.surgicalProcedure = [];
        simpleSurgery.surgicalProcedure.forEach((entry) => {
            var procedureItem = {
                operation: {
                    value: entry.operation
                }
            };
            result.surgicalProcedure.push(procedureItem);
            if (utils.propertyIsNotNull(entry, 'code') || utils.propertyIsNotNull(entry, 'system')) {
                procedureItem.operation.attr = {};
                if (utils.propertyIsNotNull(entry, 'code')) {
                    procedureItem.operation.attr.code = entry.code;
                }
                if (utils.propertyIsNotNull(entry, 'system')) {
                    procedureItem.operation.attr.system = entry.system;
                }
            }
            if (utils.propertyIsNotNull(entry, 'procedureMemo')) {
                procedureItem.procedureMemo = entry.procedureMemo;
            }
        });

        // surgicalStaffs
        if (utils.propertyIsNotNull(simpleSurgery, 'surgicalStaffs')) {
            result.surgicalStaffs = [];
            simpleSurgery.surgicalStaffs.forEach((entry) => {
                // entry = simpleCreator + attributes
                // logger.info(JSON.stringify(entry, null,4));
                var staff = {
                    staffInfo: []
                };
                result.surgicalStaffs.push(staff);
                if (utils.propertyIsNotNull(entry, 'superiority') || utils.propertyIsNotNull(entry, 'staffClass')) {
                    staff.attr = {};
                    if (utils.propertyIsNotNull(entry, 'superiority')) {
                        staff.attr.superiority = entry.superiority;
                    }
                    if (utils.propertyIsNotNull(entry, 'staffClass')) {
                        staff.attr.superiority = entry.staffClass;
                    }
                }
                var pi = this.buildPersonalizedInfo(entry.staffInfo);
                // logger.info(JSON.stringify(pi, null,4));
                staff.staffInfo.push(pi);
            });
        }
        // logger.info(JSON.stringify(result, null,4));

        // anesthesiaProcedure
        if (utils.propertyIsNotNull(simpleSurgery, 'anesthesiaProcedure')) {
            result.anesthesiaProcedure = [];
            simpleSurgery.anesthesiaProcedure.forEach((entry) => {
                var title = {
                    value: entry.title
                };
                result.anesthesiaProcedure.push(title);
                if (utils.propertyIsNotNull(entry, 'code') || utils.propertyIsNotNull(entry, 'system')) {
                    title.attr = {};
                    if (utils.propertyIsNotNull(entry, 'code')) {
                        title.attr.code = entry.code;
                    }
                    if (utils.propertyIsNotNull(entry, 'system')) {
                        title.attr.system = entry.system;
                    }
                }
            });
        }

        // anesthesiologists
        if (utils.propertyIsNotNull(simpleSurgery, 'anesthesiologists')) {
            result.anesthesiologists = [];
            simpleSurgery.anesthesiologists.forEach((entry) => {
                // entry = simpleCreator + attributes
                var staff = {
                    staffInfo: []
                };
                result.anesthesiologists.push(staff);
                if (utils.propertyIsNotNull(entry, 'superiority') || utils.propertyIsNotNull(entry, 'staffClass')) {
                    staff.attr = {};
                    if (utils.propertyIsNotNull(entry, 'superiority')) {
                        staff.attr.superiority = entry.superiority;
                    }
                    if (utils.propertyIsNotNull(entry, 'staffClass')) {
                        staff.attr.superiority = entry.staffClass;
                    }
                }
                staff.staffInfo.push(this.buildPersonalizedInfo(entry.staffInfo));
            });
        }

        // anesthesiaDuration
        if (utils.propertyIsNotNull(simpleSurgery, 'anesthesiaDuration')) {
            result.anesthesiaDuration = simpleSurgery.anesthesiaDuration;
        }

        // operativeNotes
        if (utils.propertyIsNotNull(simpleSurgery, 'operativeNotes')) {
            result.operativeNotes = simpleSurgery.operativeNotes;
        }

        // referenceInfo
        // 解説では [extRef]
        // logger.info('before referenceInfo');
        if (utils.propertyIsNotNull(simpleSurgery, 'referenceInfo')) {
            // logger.info(JSON.stringify(simpleSurgery.referenceInfo, null, 4));
            // e.href
            var newHREF = this.createHREF(docInfo.docId.uid, 0, simpleSurgery.referenceInfo.href);
            simpleSurgery.referenceInfo.href = newHREF;
            // logger.info(newHREF);

            // No base64
            result.referenceInfo = this.buildExtRef(simpleSurgery.referenceInfo, null);

            // With base64
            docInfo.extRefs.push(this.buildExtRef(simpleSurgery.referenceInfo, extArray));
        }
        // logger.info('after referenceInfo');

        // memo
        if (utils.propertyIsNotNull(simpleSurgery, 'memo')) {
            result.memo = simpleSurgery.memo;
        }

        // logger.info(JSON.stringify(result, null,4));
        return result;
    },

    surgery: function (docInfo, simpleSurgery, extArray) {
        var result = {
            surgeryItem: []
        };
        simpleSurgery.surgeryItem.forEach((entry) => {
            result.surgeryItem.push(this.buildSurgeryItem(docInfo, entry, extArray));
        });
        return result;
    },

    /**
     * 9. SummaryModule
     */
    summary: function (docInfo, simpleSummary, extArray) {
        /***********************************************************************
        var SummaryModule = {                                       // 臨床経過サマリー情報
            serviceHistory: {                                       // 期間情報
                attr: {
                    start: '',                                      // サマリー対象期間の開始日
                    end: ''                                         // サマリー対象期間の終了日
                },
                outPatient: [],                                     // 外来受診歴情報 ? [outPatientItem]
                inPatient: []                                       // 入院暦情報 ? [inPatientItem]
            },
            RegisteredDiagnosisModule: [],                          // サマリーにおける診断履歴情報 ? 解説は* []
            deathInfo: {                                            // 死亡関連情報 ?
                value: '',
                attr: {
                    date: '',                                           // 死亡日時
                    autopsy: ''                                         // 剖検の有無．true：剖検あり，false：なし
                }
            },
            SurgeryModule: [],                                      // サマリーにおける手術記録情報 ?
            chiefComplaints: '',                                    // 主訴 ?
            patientProfile: '',                                     // 患者プロフィール ?
            history: '',                                            // 入院までの経過 ?
            physicalExam: {                                         // 入院時理学所見 ?
                value: '',                                          // 所見 ?
                any: [],                                            // xs:any *  Not Supported
                extRef: []                                          // [extRef] *
            },
            clinicalCourse: [],                                     // 経過および治療 ? [clinicalRecord]
            dischargeFindings: {                                    // 退院時所見 ?
                value: '',                                          // 所見
                any: [],                                            // xs:any * Not Supported
                extRef: []                                          // extRef * [extRef]
            },
            medication: {                                           // 退院時処方 ? medication
                value: '',                                          // mixed=true
                simplePrescription: {},                             // simplePrescription ?
                extRef: []                                          // extRef * [extRef]
            },
            testResults: [],                                        // 退院時検査結果 ? [testResult]
            plan: {                                                 // 退院後治療方針 ? plan
                value: '',                                          // 方針
                any: [],                                            // xs:any * Not Supported
                extRef: []                                          // extRef * [extRef]
            },
            remarks: {                                              // 患者に関する留意事項 ?
                value: '',                                          // 留意事項
                any: []                                             // xs:any * NotSupported
            }                                                       // 患者に関する留意事項 ?
        };

        var outPatientItem = {
            date: '',                                               // 外来受診日 date　書式：CCYY-MM-DD
            outPatientCondition: {                                  // 外来受診状態 ?
                value: '',
                attr: {
                    first: '',                                      // 初診．true：初診，false：再診
                    emergency: ''                                   // 救急受診．true：救急，false：通常
                }
            },
            staffs: []                                              // 患者担当スタッフ情報 ? [staffInfo]
        };

        var inPatientItem = {                                       // 個々の入院暦
            admission: {},                                          // 入院
            discharge: {},                                          // 退院
            staffs: [],                                             // ? [staffInfo]
        };

        var staffInfo = {                                           // 外来担当スタッフ
            PersonalizedInfo: {},                                   // mmlPsi:PersonalizedInfo  ToDo PersonalizedInfo
            creatorLicense: []                                      // mmlCi:creatorLicense
        };

        var admission = {                                           // 入院
            date: '',                                               // 入院 (転入) 日 CCYY-MM-DD
            admissionCondition: {                                   // 入院時状態 ?
                value: '',
                attr: {
                    emergency: ''                                   // 緊急入院．boolean true：緊急入院，false：通常
                }
            },
            referFrom: {}                                           // 紹介元情報 ? mmlPsi:PersonalizedInfo
        };

        var discharge = {                                           // 退院
            date: '',                                               // 退院 (転出) 日 CCYY-MM-DD
            dischargeCondition: {                                   // 退院時状態 ?
                value: '',
                attr: {
                    outcome: ''                                     // 退院時転帰 MML0016
                }
            },
            referTo: {}                                             // 紹介先情報 ? mmlPsi:PersonalizedInfo
        };

        // contains both text and other elements
        var clinicalRecord = {
            attr: {
                date: ''                                            // イベント発生日時
            },
            value: '',
            relatedDoc: [],                                         // 関連文書 * [relatedDoc]
            extRef: []                                              // extref * [extRef]
        };

        // contains both text and other elements
        var testResult = {                                          // 個々の検査結果
            attr: {
                date: ''                                            // YYYY-MM-DDThhTHH:mm:ss
            },
            value: '',
            extRef: [],                                             // extRef * [extRef]
            relatedDoc: []                                          // 関連文書 * [relatedDoc]
        };

        var relatedDoc = {
            value: '',                                              // MmlModuleItemのuid
            attr: {
                relation: ''                                        // MML0008
            }
        };
    ***********************************************************************/

        // logger.info(JSON.stringify(simpleSummary, null, 4));
        var docId = docInfo.docId.uid;
        var refIndex = 0;
        var newHREF = null;

        var result = {
            serviceHistory: {                                       // 期間情報
                attr: {
                    start: simpleSummary.context.start,             // サマリー対象期間の開始日
                    end: simpleSummary.context.end                  // サマリー対象期間の終了日
                }
            }
        };
        // logger.info(JSON.stringify(result, null, 4));

        // outPatient
        if (utils.propertyIsNotNull(simpleSummary.context, 'outPatient')) {
            result.serviceHistory.outPatient = [];
            simpleSummary.context.outPatient.forEach((entry) => {
                // date
                var outPatientItem = {
                    date: entry.date
                };
                result.serviceHistory.outPatient.push(outPatientItem);
                // outPatientCondition
                if (utils.propertyIsNotNull(entry, 'outPatientCondition')) {
                    outPatientItem.outPatientCondition = {
                        value: entry.outPatientCondition,
                        attr: {
                            first: entry.first,
                            emergency: entry.emergency
                        }
                    };
                }
                // staffs
                if (utils.propertyIsNotNull(entry, 'staffs')) {
                    outPatientItem.staffs = [];
                    entry.staffs.forEach((e) => {
                        // e = simpleCreator
                        var staffInfo = this.buildCreatorInfo(e);   // staffInfo と同じ構造
                        outPatientItem.staffs.push(staffInfo);
                    });
                }
            });
        }

        // inPatient
        if (utils.propertyIsNotNull(simpleSummary.context, 'inPatient')) {
            result.serviceHistory.inPatient = [];
            simpleSummary.context.inPatient.forEach((entry) => {
                //logger.info(JSON.stringify(entry, null, 4));

                var inPatientItem = {};
                result.serviceHistory.inPatient.push(inPatientItem);

                // admission 入院情報
                if (utils.propertyIsNotNull(entry, 'admission')) {
                    // logger.info(JSON.stringify(entry.admission, null, 4));
                    inPatientItem.admission = {};
                    // date
                    inPatientItem.admission.date = entry.admission.date;
                    // admissionCondition
                    if (utils.propertyIsNotNull(entry.admission, 'admissionCondition')) {
                        inPatientItem.admission.admissionCondition = {
                            value: entry.admission.admissionCondition
                        };
                    }
                    // emergency
                    if (utils.propertyIsNotNull(entry.admission, 'emergency')) {
                        inPatientItem.admission.admissionCondition.attr = {
                            emergency: entry.admission.emergency
                        };
                    }
                    // logger.info(JSON.stringify(inPatientItem.admission, null, 4));
                    // referFrom
                    if (utils.propertyIsNotNull(entry.admission, 'referFrom')) {
                        inPatientItem.admission.referFrom = this.buildPersonalizedInfo(entry.admission.referFrom);
                    }
                    // logger.info(JSON.stringify(inPatientItem.admission, null, 4));
                }

                // discharge 退院情報
                if (utils.propertyIsNotNull(entry, 'discharge')) {
                    inPatientItem.discharge = {};
                    // date
                    inPatientItem.discharge.date = entry.discharge.date;
                    // dischargeCondition
                    if (utils.propertyIsNotNull(entry.discharge, 'dischargeCondition')) {
                        inPatientItem.discharge.dischargeCondition = {
                            value: entry.discharge.dischargeCondition
                        };
                    }
                    // outcome
                    if (utils.propertyIsNotNull(entry.discharge, 'outcome')) {
                        inPatientItem.discharge.dischargeCondition.attr = {
                            outcome: entry.discharge.outcome
                        };
                    }
                    // referFrom
                    if (utils.propertyIsNotNull(entry.discharge, 'referTo')) {
                        inPatientItem.discharge.referTo = this.buildPersonalizedInfo(entry.discharge.referTo);
                    }
                    // logger.info(JSON.stringify(inPatientItem.discharge, null, 4));
                }

                // staffs
                if (utils.propertyIsNotNull(entry, 'staffs')) {
                    inPatientItem.staffs = [];
                    entry.staffs.forEach((e) => {
                        // e = simpleCreator
                        var staffInfo = this.buildCreatorInfo(e);   // staffInfo と同じ構造
                        inPatientItem.staffs.push(staffInfo);
                    });
                }
            });
        }
        // logger.info(JSON.stringify(result, null, 4));

        // RegisteredDiagnosisModule ?  != *
        if (utils.propertyIsNotNull(simpleSummary, 'simpleDiagnosis')) {
            result.RegisteredDiagnosisModule = this.registeredDiagnosis(docInfo, simpleSummary.simpleDiagnosis);
        }
        // logger.info(JSON.stringify(result, null, 4));

        // deathInfo
        if (utils.propertyIsNotNull(simpleSummary, 'deathInfo')) {
            result.deathInfo = {};
            result.deathInfo.value = simpleSummary.deathInfo.info;  // info
            if (utils.propertyIsNotNull(simpleSummary.deathInfo, 'date') || utils.propertyIsNotNull(simpleSummary.deathInfo, 'autopsy')) {
                result.deathInfo.attr = {};
                if (utils.propertyIsNotNull(simpleSummary.deathInfo, 'date')) {
                    result.deathInfo.attr.date = simpleSummary.deathInfo.date;
                }
                if (utils.propertyIsNotNull(simpleSummary.deathInfo, 'autopsy')) {
                    result.deathInfo.attr.autopsy = simpleSummary.deathInfo.autopsy;
                }
            }
        }

        // SurgeryModule
        if (utils.propertyIsNotNull(simpleSummary, 'simpleSurgery')) {
            result.SurgeryModule = [];
            simpleSummary.simpleSurgery.forEach((entry) => {
                result.SurgeryModule.push(this.surgery(docInfo, entry));
            });
        }

        // chiefComplaints
        if (utils.propertyIsNotNull(simpleSummary, 'chiefComplaints')) {
            result.chiefComplaints = simpleSummary.chiefComplaints;
        }

        // patientProfile
        if (utils.propertyIsNotNull(simpleSummary, 'patientProfile')) {
            result.patientProfile = simpleSummary.patientProfile;
        }

        // history
        if (utils.propertyIsNotNull(simpleSummary, 'history')) {
            result.history = simpleSummary.history;
        }
        // logger.info(JSON.stringify(result, null, 4));

        // physicalExam  value:'' xs:any * extRef *
        if (utils.propertyIsNotNull(simpleSummary, 'physicalExam')) {
            result.physicalExam = {
                value: simpleSummary.physicalExam.value
            };
            if (utils.propertyIsNotNull(simpleSummary.physicalExam, 'extRef')) {
                result.physicalExam.extRef = [];
                simpleSummary.physicalExam.extRef.forEach((e) => {
                    newHREF = this.createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.physicalExam.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
        }
        // logger.info(JSON.stringify(result, null, 4));

        // clinicalCourse
        if (utils.propertyIsNotNull(simpleSummary, 'clinicalCourse')) {
            result.clinicalCourse = [];
            simpleSummary.clinicalCourse.forEach((entry) => {
                var clinicalRecord = {
                    attr: {
                        date: entry.date
                    },
                    value: entry.record
                };
                if (utils.propertyIsNotNull(entry, 'relatedDoc')) {
                    clinicalRecord.relatedDoc = [];
                    entry.relatedDoc.forEach((e) => {
                        var relatedDoc = {
                            value: e.uuid,
                            attr: {
                                relation: e.relation
                            }
                        };
                        clinicalRecord.relatedDoc.push(relatedDoc);
                    });
                }
                if (utils.propertyIsNotNull(entry, 'extRef')) {
                    clinicalRecord.extRef = [];
                    entry.extRef.forEach((e) => {
                        newHREF = this.createHREF(docId, refIndex++, e.href);
                        e.href = newHREF;
                        clinicalRecord.extRef.push(this.buildExtRef(e, null));
                        docInfo.extRefs.push(this.buildExtRef(e, extArray));
                    });
                }
                // logger.info(JSON.stringify(clinicalRecord, null, 4));
                result.clinicalCourse.push(clinicalRecord);
            });
        }
        // logger.info(JSON.stringify(result, null, 4));

        // dischargeFindings value: '' xs:any extRef *
        if (utils.propertyIsNotNull(simpleSummary, 'dischargeFindings')) {
            result.dischargeFindings = {
                value: simpleSummary.dischargeFindings
            };
            if (utils.propertyIsNotNull(simpleSummary.dischargeFindings, 'extRef')) {
                result.dischargeFindings.extRef = [];
                simpleSummary.dischargeFindings.extRef.forEach((e) => {
                    newHREF = this.createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.dischargeFindings.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
        }
        // logger.info(JSON.stringify(result, null, 4));

        // medication: {                                           // 退院時処方 ? medication
        if (utils.propertyIsNotNull(simpleSummary, 'medication')) {
            // logger.info(JSON.stringify(simpleSummary.medication.simplePrescription, null, 4));
            result.medication = {
                value: simpleSummary.medication.value
            };
            if (utils.propertyIsNotNull(simpleSummary.medication, 'simplePrescription')) {
                // xsd 1 個だけ....
                var preArr = this.prescription(docInfo, simpleSummary.medication.simplePrescription);
                result.medication.PrescriptionModule = preArr[0];
            }
            if (utils.propertyIsNotNull(simpleSummary.medication, 'extRef')) {
                result.medication.extRef = [];
                simpleSummary.medication.extRef.forEach((e) => {
                    newHREF = this.createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.medication.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
            // logger.info(JSON.stringify(result.medication, null, 4));
        }
        // logger.info(JSON.stringify(result, null, 4));

        // testResults
        if (utils.propertyIsNotNull(simpleSummary, 'testResults')) {
            result.testResults = [];
            simpleSummary.testResults.forEach((entry) => {
                var tr = {                                          // 個々の検査結果
                    attr: {
                        date: entry.date
                    },
                    value: entry.testResult
                };
                result.testResults.push(tr);

                if (utils.propertyIsNotNull(entry, 'relatedDoc')) {
                    tr.relatedDoc = [];
                    entry.relatedDoc.forEach((e) => {
                        var relatedDoc = {
                            value: e.uuid,
                            attr: {
                                relation: e.relation
                            }
                        };
                        tr.relatedDoc.push(relatedDoc);
                    });
                }
                if (utils.propertyIsNotNull(entry, 'extRef')) {
                    tr.extRef = [];
                    entry.extRef.forEach((e) => {
                        newHREF = this.createHREF(docId, refIndex++, e.href);
                        e.href = newHREF;
                        tr.extRef.push(this.buildExtRef(e, null));
                        docInfo.extRefs.push(this.buildExtRef(e, extArray));
                    });
                }
                // logger.info(JSON.stringify(tr, null, 4));
            });
        }
        //logger.info(JSON.stringify(result, null, 4));

        // plan value: '' xs:any extRef *
        if (utils.propertyIsNotNull(simpleSummary, 'plan')) {
            result.plan = {
                value: simpleSummary.plan.value
            };
            if (utils.propertyIsNotNull(simpleSummary.plan, 'extRef')) {
                result.plan.extRef = [];
                simpleSummary.plan.extRef.forEach((e) => {
                    newHREF = this.createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.plan.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
        }

        // remarks
        if (utils.propertyIsNotNull(simpleSummary, 'remarks')) {
            result.remarks = {
                value: simpleSummary.remarks
            };
        }

        // logger.info(JSON.stringify(result, null, 4));
        return result;
    },

    /**
     * 10. TestModule
     */
    test: function (docInfo, simpleTest, extArray) {
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
                facilityIdType: 'OID',                          // 検査依頼施設
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

        // コード体系 千年でラボセンターコードを発番?
        var facilityCodeId = utils.propertyIsNotNull(context, 'facilityIdType') ? context.facilityIdType : 'OID';
        var centerCodeId = utils.propertyIsNotNull(context.laboratory, 'facilityIdType') ? context.laboratory.facilityIdType : 'OID';

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
                    value: context.facilityName,                        // 依頼施設
                    attr: {
                        facilityCode: context.facilityId,               // 依頼施設コード
                        facilityCodeId: facilityCodeId                  // 用いたコード体系の名称を記載
                    }
                },
                laboratoryCenter: {
                    value: context.laboratory.facilityName,             // 検査実施施設
                    attr: {
                        centerCode: context.laboratory.facilityId,      // ユーザー指定
                        centerCodeId: centerCodeId                      // 用いたテーブル名を入力
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
            numValue = (utils.propertyIsNotNull(entry, 'unit'));

            if (numValue) {
                item.numValue = {
                    value: entry.value
                };
                if (utils.propertyIsNotNull(entry, 'lowerLimit') ||
                utils.propertyIsNotNull(entry, 'upperLimit') ||
                utils.propertyIsNotNull(entry, 'out')) {

                    item.numValue.attr = {};
                    if (utils.propertyIsNotNull(entry, 'lowerLimit')) {
                        item.numValue.attr.low = entry.lowerLimit;
                    }
                    if (utils.propertyIsNotNull(entry, 'upperLimit')) {
                        item.numValue.attr.up = entry.upperLimit;
                    }
                    if (utils.propertyIsNotNull(entry, 'out')) {
                        item.numValue.attr.out = entry.out;
                    }
                }
            }

            if (numValue) {
                item.unit = {
                    value: entry.unit
                };
            }

            if (utils.propertyIsNotNull(entry, 'memoCode') && utils.propertyIsNotNull(entry, 'memo')) {
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
     * 11. ReportModule
     */
    report: function (docInfo, simpleReport, extArray) {
        /********************************************************************************
        var simpleReport = {
            context: {},                                      // 報告書ヘッダー情報
            body: {}                                          // 報告書本文情報
        };

        var context = {
            performTime: '',                                    // 検査実施日時 required
            reportTime: ''                                      // 報告日時 required
            reportStatus: '',                                   // 報告状態
            statusCode: '',                                     // mid 検査中 final 最終報告 required
            statusCodeId: '',                                   // mmlLb0001と入力 required
            testClass: '',                                      // 報告書種別
            testClassCode: '',                                  // MML0033 required
            testClassCodeId: ''                                 // MML0033 required
            testSubclass: '',                                   // 報告書詳細種別 ?
            testSubclassCode: '',
            testSubclassCodeId: '',
            organ: '',                                          // 臓器 ?
            consultFrom: {
                facility: '',                                   // 依頼者情報 ?
                facilityCode: '',
                facilityCodeId: '',                             // MML0027
                department: '',                                 // 依頼診療科 ?
                departmentCode: '',
                departmentCodeId: '',
                ward: '',                                       // 依頼病棟 ?
                wardCode: '',
                wardCodeId: '',
                client: '',                                     // 依頼者 ?
                clientCode: '',
                clientCodeId: ''
            },
            perform: {                                          // 実施者情報
                facility: '',                                   // 実施施設
                facilityCode: '',                               // required
                facilityCodeId: '',                             // required
                department: '',                                 // 実施診療科 ?
                departmentCode: '',
                departmentCodeId: '',
                ward: '',                                       // 実施病棟 ?
                wardCode: '',
                wardCodeId: '',
                performer: '',                                  // 実施者
                performerCode: '',                              // required
                performerCodeId: ''                             // required
                supervisor: '',                                 // 監督者 ?
                supervisorCode: '',
                supervisorCodeId: ''
            }
        };

        var body = {                                            // 報告書本文情報
            chiefComplaints: '',                                // 主訴 ?
            testPurpose: '',                                    // 検査目的 ?
            testDx: '',                                         // 検査診断 ?
            testNotes: {                                        // 検査所見記載 ?
                value: ''                                       // mixed=true
                extRef: []                                      // 外部参照図 * [extRef]
            },
            testMemo: [],                                       // 検査コメント ? [testMemo]
            testMemoF: ''                                       // 検査フリーコメント ?
        };

        var testNotes = {
            value: '',
            extRef: []                                          // [extRef]
        };

        var testMemo = {
            memo: '',
            memoCodeName: '',
            memoCode: '',
            memoCodeId: ''
        };
        ********************************************************************************/

        // logger.info(JSON.stringify(simpleReport, null, 4));

        var information = {};
        var reportBody = {};
        var result = {
            information: information,                               // 報告書ヘッダー情報
            reportBody: reportBody                                  // 報告書本文情報
        };

        var context = simpleReport.context;
        var body = simpleReport.body;

        // attr
        information.attr = {
            performTime: context.performTime,                       // 検査実施日時 required
            reportTime: context.reportTime                          // 報告日時 required
        };

        // reportStatus
        information.reportStatus = {                                // 報告状態
            value: context.reportStatus,
            attr: {
                statusCode: context.statusCode,                     // mid 検査中 final 最終報告 required
                statusCodeId: 'mmlLb0001'                      // mmlLb0001と入力 required
            }
        };

        // testClass
        information.testClass = {                                   // 報告書種別
            value: context.testClass,
            attr: {
                testClassCode: context.testClassCode,               // MML0033 required
                testClassCodeId: 'MML0033'            // MML0033 required
            }
        };

        // testSubclass
        if (utils.propertyIsNotNull(context, 'testSubclass')) {
            information.testSubclass = {                                         // 報告書詳細種別 ?
                value: context.testSubclass.testSubclass,
                attr: {
                    testSubclassCode: context.testSubclass.testSubclassCode,
                    testSubclassCodeId: context.testSubclass.testSubclassCodeId
                }
            };
        }
        // logger.info(JSON.stringify(context, null, 4));

        // organ
        if (utils.propertyIsNotNull(context, 'organ')) {
            information.organ = context.organ;
        }

        // consultFrom
        if (utils.propertyIsNotNull(context, 'consultFrom')) {
            var cFrom = context.consultFrom;
            information.consultFrom = {};

            if (utils.propertyIsNotNull(cFrom, 'facility')) {
                information.consultFrom.conFacility = {                 // 依頼施設 ?
                    value: cFrom.facility,
                    attr: {
                        facilityCode: cFrom.facilityCode,
                        facilityCodeId: 'MML0027'                          // MML0027
                    }
                };
            }
            if (utils.propertyIsNotNull(cFrom, 'department')) {
                information.consultFrom.conDepartment = {                 // 依頼施設 ?
                    value: cFrom.department,
                    attr: {
                        depCode: cFrom.departmentCode,
                        depCodeId: cFrom.departmentCodeId
                    }
                };
            }
            if (utils.propertyIsNotNull(cFrom, 'ward')) {
                information.consultFrom.conWard = {                 // 依頼施設 ?
                    value: cFrom.ward,
                    attr: {
                        wardCode: cFrom.wardCode,
                        wardCodeId: cFrom.wardCodeId
                    }
                };
            }
            if (utils.propertyIsNotNull(cFrom, 'client')) {
                information.consultFrom.client = {                 // 依頼施設 ?
                    value: cFrom.client,
                    attr: {
                        clientCode: cFrom.clientCode,
                        clientCodeId: cFrom.clientCodeId
                    }
                };
            }
        }

        // perform
        if (utils.propertyIsNotNull(context, 'perform')) {
            var perform = context.perform;
            information.perform = {};

            if (utils.propertyIsNotNull(perform, 'facility')) {
                information.perform.pFacility = {                 // 依頼施設 ?
                    value: perform.facility,
                    attr: {
                        facilityCode: perform.facilityCode,
                        facilityCodeId: 'MML0027'                          // MML0027
                    }
                };
            }
            if (utils.propertyIsNotNull(perform, 'department')) {
                information.perform.pDepartment = {                 // 依頼施設 ?
                    value: perform.department,
                    attr: {
                        depCode: perform.departmentCode,
                        depCodeId: perform.departmentCodeId
                    }
                };
            }
            if (utils.propertyIsNotNull(perform, 'ward')) {
                information.perform.pWard = {                 // 依頼施設 ?
                    value: perform.ward,
                    attr: {
                        wardCode: perform.wardCode,
                        wardCodeId: perform.wardCodeId
                    }
                };
            }
            if (utils.propertyIsNotNull(perform, 'performer')) {
                information.perform.performer = {                 // 依頼施設 ?
                    value: perform.performer,
                    attr: {
                        performerCode: perform.performerCode,
                        performerCodeId: perform.performerCodeId
                    }
                };
            }
            if (utils.propertyIsNotNull(perform, 'supervisor')) {
                information.perform.supervisor = {                 // 依頼施設 ?
                    value: perform.supervisor,
                    attr: {
                        supervisorCode: perform.supervisorCode,
                        supervisorCodeId: perform.supervisorCodeId
                    }
                };
            }
        }

        // chiefComplaints
        if (utils.propertyIsNotNull(body, 'chiefComplaints')) {
            reportBody.chiefComplaints = body.chiefComplaints;
        }

        // testPurpose
        if (utils.propertyIsNotNull(body, 'testPurpose')) {
            reportBody.testPurpose = body.testPurpose;
        }

        // testDx
        if (utils.propertyIsNotNull(body, 'testDx')) {
            reportBody.testDx = body.testDx;
        }

        // testNotes
        if (utils.propertyIsNotNull(body, 'testNotes')) {
            reportBody.testNotes = {
                value: body.testNotes.value
            };
            // extRef[]
            if (utils.propertyIsNotNull(body.testNotes, 'extRef')) {
                reportBody.testNotes.extRef = [];
                var index = 0;
                var docId = docInfo.docId.uid;
                var newHREF = null;
                body.testNotes.extRef.forEach((entry) => {
                    // correct entry.href
                    newHREF = this.createHREF(docId, index++, entry.href);
                    entry.href = newHREF;
                    // logger.info(newHREF);

                    // 1. base64 なし => resul.extRef へ
                    reportBody.testNotes.extRef.push(this.buildExtRef(entry, null));

                    // 2. base64あり => docInfo.extRefs にまとめる
                    var tmp = this.buildExtRef(entry, extArray);
                    // logger.info(JSON.stringify(tmp, null, 4));
                    docInfo.extRefs.push(tmp);
                });
            }
        }

        // testMemo
        if (utils.propertyIsNotNull(body, 'testMemo')) {
            reportBody.testMemo = [];
            body.testMemo.forEach((entry) => {
                var memo = {
                    value: entry.memo
                };
                reportBody.testMemo.push(memo);
                if (utils.propertyIsNotNull(entry, 'memoCode') || utils.propertyIsNotNull(entry, 'memoCodeId') ) {
                    memo.attr = {};
                    if (utils.propertyIsNotNull(entry, 'memoCodeName')) {
                        memo.attr.tmCodeName = entry.memoCodeName;
                    }
                    if (utils.propertyIsNotNull(entry, 'memoCode')) {
                        memo.attr.tmCode = entry.memoCode;
                    }
                    if (utils.propertyIsNotNull(entry, 'memoCodeId')) {
                        memo.attr.tmCodeId = entry.memoCodeId;
                    }
                }
            });
        }

        // testMemoF
        if (utils.propertyIsNotNull(body, 'testMemoF')) {
            reportBody.testMemoF = body.testMemoF;
        }
        // logger.info(JSON.stringify(result, null, 4));
        return result;
    },

    /**
     * 12. ReferralModule
     */
    referral: function (docInfo, simpleReferral, extArray) {
        /*******************************************************************************
        var simpleReferral = {
            patient: {},                                            // 患者情報
            occupation: '',                                         // 職業 ?
            referFrom: {},                                          // 紹介者情報を入れる親エレメント mmlPsi:PersonalizedInfo
            title: '',                                              // タイトル
            greeting: '',                                           // 挨拶文 ?
            chiefComplaints: '',                                    // 主訴
            clinicalDiagnosis: '',                                  // 病名 ?
            pastHistory: {                                          // 既往歴 ?
                value: '',                                          // 既往歴
                extRef: []                                          // extRef * [extRef]
            },
            familyHistory:  {                                       // 家族歴 ?
                value: '',                                          // 家族歴
                extRef: []                                          // extRef * [extRef]
            },
            presentIllness: {                                       // 現病歴 ?
                value: '',                                          // 現病歴
                extRef: []                                          // extRef * [extRef]
            },
            testResults: {                                          // 検査結果 ?
                value: '',                                          // 検査結果
                extRef: []                                          // extRef * [extRef]
            }
            clinicalCourse: '',                                     // 治療経過 ?
            medication: {},                                         // 現在の処方 ?
            referPurpose: '',                                       // 紹介目的
            remarks: {                                              // 備考 ?
                value: '',                                          // 備考
                extRef: []                                          // extRef * [extRef]
            },
            referToFacility: {                                      // 紹介先医療機関名
                facilityId: '',                                     // 施設ID   -> Facility
                facilityName: '',                                   // 施設名称  -> Facility
                departmentId: '',                                   // 診療科ID ?  -> Department
                departmentName: ''                                  // 診療科名称 ?
            },
            referToPerson: {},                                      // 紹介先医師 ? mmlPsi:PersonalizedInfo
            referToUnknownName: ''                                  // 医師名を指定しない相手 ?
        };

        var medication = {
            value: '',                                              // テキストとmmlCm:extRefの混在可
            simplePrescription: {},                                 // simplePrescription
            simpleInjection: {},                                    // simpleInjection
            extRef: []                                              // extRef * [extRef]
        };
        *******************************************************************************/

        var result = {};
        var refIndex = 0;
        var docId = docInfo.docId.uid;
        var newHREF = null;

        // PatientModule
        result.PatientModule = this.patientInfo(docInfo, simpleReferral.patient);

        // occupation
        if (utils.propertyIsNotNull(simpleReferral, 'occupation')) {
            result.occupation = simpleReferral.occupation;
        }

        // referFrom
        result.referFrom = this.buildPersonalizedInfo(simpleReferral.referFrom);

        // title
        result.title = simpleReferral.title;

        // greeting
        if (utils.propertyIsNotNull(simpleReferral, 'greeting')) {
            result.greeting = simpleReferral.greeting;
        }

        // chiefComplaints
        result.title = simpleReferral.chiefComplaints;

        // clinicalDiagnosis
        if (utils.propertyIsNotNull(simpleReferral, 'clinicalDiagnosis')) {
            result.clinicalDiagnosis = simpleReferral.clinicalDiagnosis;
        }

        // pastHistory extRef
        if (utils.propertyIsNotNull(simpleReferral, 'pastHistory')) {
            result.pastHistory = {
                value: simpleReferral.pastHistory
            };
            if (utils.propertyIsNotNull(simpleReferral.pastHistory, 'extRef')) {
                result.pastHistory.extRef = [];

                simpleReferral.pastHistory.extRef.forEach((e) => {
                    newHREF = createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.pastHistory.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
        }

        // familyHistory
        if (utils.propertyIsNotNull(simpleReferral, 'familyHistory')) {
            result.familyHistory = {
                value: simpleReferral.familyHistory
            };
            if (utils.propertyIsNotNull(simpleReferral.familyHistory, 'extRef')) {
                result.familyHistory.extRef = [];
                simpleReferral.familyHistory.extRef.forEach((e) => {
                    newHREF = createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.familyHistory.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
        }

        // presentIllness
        if (utils.propertyIsNotNull(simpleReferral, 'presentIllness')) {
            result.presentIllness = {
                value: simpleReferral.presentIllness
            };
            if (utils.propertyIsNotNull(simpleReferral.presentIllness, 'extRef')) {
                result.presentIllness.extRef = [];
                simpleReferral.presentIllness.extRef.forEach((e) => {
                    newHREF = createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.presentIllness.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
        }

        // testResults
        if (utils.propertyIsNotNull(simpleReferral, 'testResults')) {
            result.testResults = {
                value: simpleReferral.testResults
            };
            if (utils.propertyIsNotNull(simpleReferral.testResults, 'extRef')) {
                result.testResults.extRef = [];
                simpleReferral.testResults.extRef.forEach((e) => {
                    newHREF = createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.testResults.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
        }

        // clinicalCourse
        if (utils.propertyIsNotNull(simpleReferral, 'clinicalCourse')) {
            result.clinicalCourse = simpleReferral.clinicalCourse;
        }

        // medication
        if (utils.propertyIsNotNull(simpleReferral, 'medication')) {
            result.medication = {};
            if (utils.propertyIsNotNull(simpleReferral.medication, 'value')) {
                result.medication.value = simpleReferral.medication.value;
            }
            if (utils.propertyIsNotNull(simpleReferral.medication, 'simplePrescription')) {
                result.medication.PrescriptionModule = this.prescription(docInfo, simpleReferral.medication.simplePrescription);
            }
            if (utils.propertyIsNotNull(simpleReferral.medication, 'simpleInjection')) {
                result.medication.InjectionModule = this.injection(docInfo, simpleReferral.medication.simpleInjection);
            }
            if (utils.propertyIsNotNull(simpleReferral.medication, 'extRef')) {
                result.medication.extRef = [];
                simpleReferral.medication.extRef.forEach((entry) => {
                    result.medication.extRef(this.buildExtRef(entry, extArray));
                });
            }
        }

        // referPurpose
        if (utils.propertyIsNotNull(simpleReferral, 'referPurpose')) {
            result.referPurpose = simpleReferral.referPurpose;
        }

        // remarks
        if (utils.propertyIsNotNull(simpleReferral, 'remarks')) {
            result.remarks = {
                value: simpleReferral.remarks.value
            };
            if (utils.propertyIsNotNull(simpleReferral.remarks, 'extRef')) {
                result.remarks.extRef = [];
                simpleReferral.remarks.extRef.forEach((e) => {
                    newHREF = createHREF(docId, refIndex++, e.href);
                    e.href = newHREF;
                    result.remarks.extRef.push(this.buildExtRef(e, null));
                    docInfo.extRefs.push(this.buildExtRef(e, extArray));
                });
            }
        }

        // referToFacility
        if (utils.propertyIsNotNull(simpleReferral, 'referToFacility')) {
            result.referToFacility = {};
            if (utils.propertyIsNotNull(simpleReferral.referToFacility, 'facilityId') && utils.propertyIsNotNull(simpleReferral.referToFacility, 'facilityName')) {
                result.referToFacility.Facility = this.buildFacility(simpleReferral.referToFacility.facilityId, simpleReferral.referToFacility.facilityName);
            }
            if (utils.propertyIsNotNull(simpleReferral.referToFacility, 'departmentId') && utils.propertyIsNotNull(simpleReferral.referToFacility, 'departmentName')) {
                result.referToFacility.Department = this.buildDepartment(simpleReferral.referToFacility.departmentId, simpleReferral.referToFacility.departmentName);
            }
        }

        // referToPerson
        if (utils.propertyIsNotNull(simpleReferral, 'referToPerson')) {
            result.referToPerson = this.buildPersonalizedInfo(simpleReferral.referToPerson);
        }

        // referToUnknownName
        if (utils.propertyIsNotNull(simpleReferral, 'referToUnknownName')) {
            result.referToUnknownName = simpleReferral.referToUnknownName;
        }

        return result;
    },

    /**
     * 13. VitalSignModule
     */
    vitalsign: function (docInfo, simpleVitalSign, extArray) {
        // 必須属性
        var vitalSign = {
            item: [],
            observedTime: simpleVitalSign.observedTime
        };
        // item
        simpleVitalSign.item.forEach ((entry) => {
            var item = {
                itemName: entry.itemName                // mmlVs01
            };
            if (utils.propertyIsNotNull(entry, 'value')) {
                item.value = entry.value;
            }
            if (utils.propertyIsNotNull(entry, 'numValue')) {
                item.numValue = entry.numValue;
            }
            if (utils.propertyIsNotNull(entry, 'unit')) {
                item.unit = entry.unit;                 // mmlVs02
            }
            if (utils.propertyIsNotNull(entry, 'itemMemo')) {
                var arr = [];
                entry.itemMemo.forEach((e) => {
                    arr.push(e);
                });
                item.itemMemo = arr;
            }
            vitalSign.item.push(item);
        });
        // Context
        if (utils.propertyIsNotNull(simpleVitalSign, 'context')) {
            var target =　simpleVitalSign.context;
            vitalSign.context = {};
            // facility
            if (utils.propertyIsNotNull(target, 'facility')) {
                var facility = {
                    value: target.facility,
                    attr: {
                        facilityCode: target.facilityCode,
                        facilityCodeId: target.facilityCodeId
                    }
                };
                vitalSign.context.facility = facility;
            }
            // department
            if (utils.propertyIsNotNull(target, 'department')) {
                var department = {
                    value: target.department
                };
                if (utils.propertyIsNotNull(target, 'depCode')) {
                    department.attr = {
                        depCode: target.depCode,            // MML0028から選択
                        depCodeId: 'MML0028'                // 医科用診療科コード
                    };
                }
                vitalSign.context.department = department;
            }
            // ward
            if (utils.propertyIsNotNull(target, 'ward')) {
                var ward = {
                    value: target.ward
                };
                if (utils.propertyIsNotNull(target, 'wardCode') || utils.propertyIsNotNull(target, 'wardCodeId')) {
                    ward.attr = {};
                    if (utils.propertyIsNotNull(target, 'wardCode')) {
                        ward.attr.wardCode = target.wardCode;
                    }
                    if (utils.propertyIsNotNull(target, 'wardCodeId')) {
                        ward.attr.wardCodeId = target.wardCodeId;
                    }
                }
                vitalSign.context.ward = ward;
            }
            // observer
            if (utils.propertyIsNotNull(target, 'observer')) {
                var observer = {
                    value: target.observer
                };
                if (utils.propertyIsNotNull(target, 'obsCode') || utils.propertyIsNotNull(target, 'obsCodeId')) {
                    observer.attr = {};
                    if (utils.propertyIsNotNull(target, 'obsCode')) {
                        observer.attr.obsCode = target.obsCode;
                    }
                    if (utils.propertyIsNotNull(target, 'obsCodeId')) {
                        observer.attr.obsCodeId = target.obsCodeId;
                    }
                }
                vitalSign.context.observer = observer;
            }
        }
        // protocol
        if (utils.propertyIsNotNull(simpleVitalSign, 'protocol')) {
            var target = simpleVitalSign.protocol;
            vitalSign.protocol = {};
            if (utils.propertyIsNotNull(target, 'procedure')) {
                vitalSign.protocol.procedure = target.procedure;
            }
            if (utils.propertyIsNotNull(target, 'position')) {
                vitalSign.protocol.position = target.position;      // mmlVs03
            }
            if (utils.propertyIsNotNull(target, 'device')) {
                vitalSign.protocol.device = target.device;
            }
            if (utils.propertyIsNotNull(target, 'bodyLocation')) {
                vitalSign.protocol.bodyLocation = target.bodyLocation;
            }
            if (utils.propertyIsNotNull(target, 'protMemo')) {
                vitalSign.protocol.protMemo = [];
                target.protMemo.forEach((pm) => {
                    vitalSign.protocol.protMemo.push(pm);
                });
            }
        }
        // vsMemo
        if (utils.propertyIsNotNull(simpleVitalSign, 'vsMemo')) {
            vitalSign.vsMemo = simpleVitalSign.vsMemo;
        }
        // console.log(JSON.stringify(vitalSign, null, 4));
        return vitalSign;
    },

    /**
     * 14. FlowSheetModule
     */
    flowsheet: function (docInfo, simpleFlowSheet, extArray) {
        /*******************************************************************************
        var simpleFlowSheet = {
            context: {},
            VitalSignModule: [],                                        // *
            intake: [],                                                 // *
            bodilyOutput: [],                                           // *
            fsMemo: ''                                                  // ?
        };

        var context = {
            facility: '',
            facilityCode: '',
            facilityCodeId: ''                                          // ca | insurance | monbusho | JMARI
            department: '',                                              // ?
            depCode: '',
            depCodeId: '',
            ward: '',                                                     // ?
            wardCode: '',
            wardCodeId: ''
            observer: ''                                                // ?
            obsCode: '',
            obsCodeId: ''
        };

        var intake = {
            intakeType: '',
            intakeVolume: '',                                           // xs:decimal
            intakeUnit: '',
            intakePathway: '',
            intakeStartTime: '',                                        // xs:dateTime
            intakeEndTime: '',                                          // xs:dateTime
            intakeMemo: ''
        };

        var bodilyOutput = {
            boType: '',
            boVolume: '',                                               // xs:decimal
            boUnit: '',
            boStatus: '',
            boColor: '',
            boPathway: '',
            boStartTime: '',                                            // xs:dateTime
            boEndTime: '',                                              // xs:dateTime
            boFrequency: [],
            boMemo: ''
        };

        var boFrequency = {
            bofTimes: '',
            bofPeriodStartTime: '',                                     // xs:dateTim
            bofPeriodEndTime: '',                                       // xs:dateTim
            bofMemo: ''
        };
        *******************************************************************************/
        var context = {};

        var result = {
            context: context
        };

        var target = simpleFlowSheet.context;

        // facility
        context.facility = {
            value: target.facility,
            attr: {
                facilityCode: target.facilityCode,
                facilityCodeId: target.facilityCodeId
            }
        };

        // department
        if (utils.propertyIsNotNull(target, 'department')) {
            context.department = {
                value: target.department,
                attr: {
                    facilityCode: target.depCode,
                    facilityCodeId: target.depCodeId
                }
            };
        }

        // ward
        if (utils.propertyIsNotNull(target, 'ward')) {
            context.ward = {
                value: target.ward,
                attr: {
                    facilityCode: target.wardCode,
                    facilityCodeId: target.wardCodeId
                }
            };
        }

        // observer
        if (utils.propertyIsNotNull(target, 'observer')) {
            context.observer = {
                value: target.observer,
                attr: {
                    facilityCode: target.obsCode,
                    facilityCodeId: target.obsCodeId
                }
            };
        }

        // vitalSign
        if (utils.propertyIsNotNull(simpleFlowSheet, 'vitalSign')) {
            result.VitalSignModule = [];
            simpleFlowSheet.vitalSign.forEach((entry) => {
                result.VitalSignModule.push(this.vitalSign(docInfo, entry));
            });
        }

        // intake
        if (utils.propertyIsNotNull(simpleFlowSheet, 'intake')) {
            result.intake = [];
            simpleFlowSheet.intake.forEach((entry) => {
                result.intake.push(JSON.parse(JSON.stringify(entry)));
            });
        }

        // bodilyOutput
        if (utils.propertyIsNotNull(simpleFlowSheet, 'bodilyOutput')) {
            result.bodilyOutput = [];
            simpleFlowSheet.bodilyOutput.forEach((entry) => {
                result.bodilyOutput.push(JSON.parse(JSON.stringify(entry)));
            });
        }

        // fsMemo
        if (utils.propertyIsNotNull(simpleFlowSheet, 'fsMemo')) {
            result.fsMemo = simpleFlowSheet.fsMemo;
        }

        return result;
    },

    /**
     * 15. PrescriptionModule
     */
    prescription: function (docInfo, simplePrescription, extArray) {
        /**********************************************************
        var simplePrescription = {
            medication: [{issuedTo: '',               // 院外処方:external 院内処方:internal
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
        var inOrExt = {medication: []};                          // 院内、院外が指定されていない場合

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
            // 以下オプションなのでテストしながら設定
            // 院内、院外
            if (utils.propertyIsNotNull(entry, 'issuedTo')) {
                if (entry.issuedTo === 'external') {
                    external.medication.push(medication);
                } else if (entry.issuedTo === 'internal') {
                    internal.medication.push(medication);
                }
            } else {
                inOrExt.medication.push(medication);
            }
            // 1日の内服回数
            if (utils.propertyIsNotNull(entry, 'frequencyPerDay')) {
                medication.frequencyPerDay = entry.frequencyPerDay;
            }

            // 服薬開始日
            if (utils.propertyIsNotNull(entry, 'startDate')) {
                medication.startDate = entry.startDate;
            }

            // 服薬期間
            if (utils.propertyIsNotNull(entry, 'duration')) {
                medication.duration = entry.duration;
            }

            // 用法
            if (utils.propertyIsNotNull(entry, 'instruction')) {
                medication.instruction = entry.instruction;
            }

            // 頓用
            if (utils.propertyIsNotNull(entry, 'PRN')) {
                medication.PRN = entry.PRN;
            }

            // ジェネリック デフォルトは true
            if (utils.propertyIsNotNull(entry, 'brandSubstitutionPermitted')) {
                medication.brandSubstitutionPermitted = entry.brandSubstitutionPermitted;
            } else {
                medication.brandSubstitutionPermitted = true;
            }

            // 長期処方
            if (utils.propertyIsNotNull(entry, 'longTerm')) {
                medication.longTerm = entry.longTerm;
            }
        });

        var retArray = [];
        if (external.medication.length > 0 ) {
            retArray.push(external);
        }
        if (internal.medication.length > 0 ) {
            retArray.push(internal);
        }
        if (inOrExt.medication.length > 0 ) {
            retArray.push(inOrExt);
        }

        return retArray;
    },

    /**
     * 16. InjectionModule
     */
    injection: function (docInfo, simpleInjection, extArray) {
        /**********************************************************
        var simpleInjection = {
            medication: [],
            narcoticPrescriptionLicenseNumber: '',
            comment: ''
        };
        var medicationObj = {
            medicine: '',                             // 薬剤名称
            medicineCode: '',                         // 薬剤コード
            medicineCodeystem: '',                    // コード体系
            dose: '',
            doseUnit: '',
            startDateTime: '',
            endDateTime: '',
            instruction: '',
            route: '',
            site: '',
            deliveryMethod: '',
            batchNo: '',
            additionalInstruction: ''
        };
        ************************************************************/
        var injection = {
            medication: []
        };

        simpleInjection.medication.forEach((entry) => {
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
            // 投与開始日時
            if (utils.propertyIsNotNull(entry, 'startDateTime')) {
                medication.startDateTime = entry.startDateTime;
            }
            // 投与修了日時
            if (utils.propertyIsNotNull(entry, 'endDateTime')) {
                medication.endDateTime = entry.endDateTime;
            }
            // 用法指示
            if (utils.propertyIsNotNull(entry, 'instruction')) {
                medication.instruction = entry.instruction;
            }
            // 投与経路
            if (utils.propertyIsNotNull(entry, 'route')) {
                medication.route = entry.route;
            }
            // 投与部位
            if (utils.propertyIsNotNull(entry, 'site')) {
                medication.site = entry.site;
            }
            // 注射方法
            if (utils.propertyIsNotNull(entry, 'deliveryMethod')) {
                medication.deliveryMethod = entry.deliveryMethod;
            }
            // 処方番号
            if (utils.propertyIsNotNull(entry, 'batchNo')) {
                medication.batchNo = entry.batchNo;
            }
            // 追加指示，コメント
            if (utils.propertyIsNotNull(entry, 'additionalInstruction')) {
                medication.additionalInstruction = entry.additionalInstruction;
            }
            injection.medication.push(medication);
        });
        // 麻薬施用者番号
        // コメント
        return injection;
    },

    /**
     * 17. HemoDialysysModule
     */
    hemodialysis: function (docInfo, simpleHemoDialysys, extArray) {
        return null;
    },

    /**
      * MML を生成する
      * @param {simpleComposition} - simpleComposition
      * @returns {MML}
     */
    build: function (simpleComposition, contentType) {
        // logger.info(JSON.stringify(simpleComposition, null, 4));
        /***************************************************
        var simpleComposition = {
            context: {
                uuid: uuid,
                confirmDate: confirmDate,
                patient: simplePatient,
                creator: simpleCreator,
                accessRight: simpleaccessRight
            },
            content: [{simplePrescription} | {simpleInjection} | {simpleDiagnosis} | {simpleTest} | {simpleVitalSign}]
        };
        ***************************************************/
        // このMMLの生成日
        var createDate = utils.nowAsDateTime();
        // context
        var context = simpleComposition.context;
        // 患者情報モジュールを生成する docInfo=null
        var patientModule = this.patientInfo(null, context.patient);
        // アクセス権
        var simpleAccessRight = {};
        if (utils.propertyIsNotNull(context, 'accessRight')) {
            simpleAccessRight = context.accessRight;
        } else {
            // デフォルトを設定
            simpleAccessRight = {
                patient: 'read',
                creator: 'all',
                experience: 'read'
            };
        }
        var accessRight = this.buildAccessRight(context.patient.id, context.patient.kanjiName, simpleAccessRight);

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
        // docInfoを生成する際のもとにするObject
        var metaInfo = {
            contentModuleType: contentType,             // コンテントタイプ
            facilityId: context.patient.facilityId,     // 医療機関ID
            patientId: context.patient.id,              // 患者ID
            uuid: context.uuid,                         // uuid
            confirmDate: context.confirmDate            // 確定日時はMMLの確定日時
        };
        // logger.info(JSON.stringify(metaInfo, null, 4));
        // MML 規格のdocInfo でmetaInfoを基に生成される
        // MML のモジュール単位に付加される
        var docInfo = {};
        var content = {};
        var extArray = [];

        simpleComposition.content.forEach((entry) => {
            if (contentType === 'prescription') {
                // contentModuleTypeをセットする
                // metaInfo.contentModuleType = contentType;
                // 要素のsimplePrescriptionから院内院外別の処方せんを生成する
                // ToDo ToDo
                var arr = this.prescription(docInfo, entry, extArray);
                // 結果は配列で返る
                arr.forEach((prescription) => {
                    // それに薬が入っていたらModuleItemへ加える
                    if (prescription.medication.length > 0) {
                        // MML 規格によりModule単位にuuidを付番する
                        // metaInfo.uuid = uuid.v4();
                        // 院内と院外で別モジュール値なるのでそれごとにdocInfoを生成する
                        docInfo = this.buildDocInfo(metaInfo, creatorInfo, accessRight);
                        // logger.info(JSON.stringify(docInfo, null, 4));
                        result.MmlBody.MmlModuleItem.push({docInfo: docInfo, content: prescription});
                    }
                });
            } else {
                docInfo = this.buildDocInfo(metaInfo, creatorInfo, accessRight);
                content = this[contentType].call(this, docInfo, entry, extArray);
                result.MmlBody.MmlModuleItem.push({docInfo: docInfo, content: content});
            }
        });
        // logger.info(JSON.stringify(docInfo.docId, null, 4));
        // logger.info(JSON.stringify(result, null, 4));

        // MML instance file を生成するためにラッパーで返す
        var tmpArr = [];
        tmpArr.push(utils.compactDateTime(createDate));
        tmpArr.push(docInfo.docId.uid);
        var fileName = tmpArr.join('_');

        // extArray.forEach((ex) => {
            // logger.info(ex.href);
        // });

        return {
            fileName: fileName,
            extArray: extArray,
            json: result
        };
    }
};
