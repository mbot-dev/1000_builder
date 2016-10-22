'use strict';

const utils = require('../lib/utils');

/******************************************************************************

// 検歴情報モジュール
var TestModule = {
   information: information,              // 検歴ヘッダー情報
   laboTest: []                           // 検体検査結果情報
};

// 検歴ヘッダー情報
var information = {
   attr: {
      registId: '',                       // 依頼ID 同じ検査依頼から出た検査中報告と最終報告は，同じ依頼 ID とする．
      sampleTime: 'YYYY-MM-DDTHH:mm:ss',  // 採取日時
      registTime: 'YYYY-MM-DDTHH:mm:ss',  // 受付日時
      reportTime: 'YYYY-MM-DDTHH:mm:ss'   // 報告日時
   },
   reportStatus: {
      value: '',                          // 報告状態
      attr: {
         statusCode: '',                  // mid 検査中 final 最終報告
         statusCodeId: ''                 // mmlLb0001 と入力
      }
   },
   set: {
      value: '',                          // セット名
      attr {
         setCode: '',                     // ユーザー指定
         setCodeId: ''                    // 用いたテーブル名を入力
      }
   },
   facility: {
      value: '',                          // 依頼施設
      attr: {
         facilityCode: '',                // 依頼施設コード
         facilityCodeId: ''               // 用いたコード体系の名称を記載
      }
   },
   department: {
      value: '',                          // 依頼診療科
      attr: {
         depCode: '',
         depCodeId: ''                    // MML0028
      }
   },
   ward: {
      value: '',                          // 依頼病棟
      attr: {
         wardCode: '',
         wardCodeId: ''                   // 用いたテーブル名を入力
      }
   },
   client: {
      value: '',                          // 依頼者
      attr: {
         clientCode: '',                  // ユーザー指定
         clientCodeId: ''                 // 用いたコード体系の名称を記載
      }
   },
   laboratoryCenter: {
      value: '',                          // 検査実施施設
      attr: {
         centerCode: '',                  // ユーザー指定
         centerCodeId: ''                 // 用いたテーブル名を入力
      }
   },
   technician: {
      value: '',                          // 検査実施者
      attr: {
         techCode: '',                    // ユーザー指定
         techCodeId: ''                   // 用いたテーブル名を入力
      }
   },
   repMemo: [],                           // 報告コメント repMemo 配列
   repMemoF: ''                           // 報告フリーコメント
};

// 報告コメント
var repMemo = {
   value: '',                             // 報告コメント
   attr: {
      repCodeName: '',
      repCode: '',                        // ユーザー指定
      repCodeId: ''                       // 用いたテーブル名を入力
   }
};

// 検体検査結果情報
var laboTest = {
   specimen: {                            // 検体情報
      specimenName: {
         value: '',                       // 検体材料
         attr: {
            spCode: '',                   // ユーザー指定
            spCodeId: ''                  // 用いたテーブル名を入力
         }
      },
      spcMemo: [],                        // 検体コメント spcMemoの配列
      spcMemoF: ''                        // 検体フリーコメント
   },
   item: []                               // 項目情報の配列
};

// 検体コメント
var spcMemo = {
   value: '',                             // 検体コメント
   attr: {
      smCodeName: '',
      smCode: '',                         // ユーザー指定
      smCodeId: ''                        // 用いたテーブル名を入力
   }
};

// 項目情報
var item = {
   itemName: {
      value: '',                          // 項目名
      attr: {
         itCode: '',                      // 施設固有コード
         itCodeId: '',                    // 施設固有コード体系名 用いたテーブル名を入力
         Acode: '',                       // JLAC10の分析物コード
         Icode: '',                       // JLAC10の識別コード
         Scode: '',                       // JLAC10の材料コード
         Mcode: '',                       // JLAC10の測定法コード
         Rcode: ''                        // JLAC10の結果識別コード
      }
   },
   value: '',                             // 値．表示用の文字列の値．必須とする
   numValue: {                            // 数値データの場合のみ設定
      value: '',                          // 値
      attr: {
         up: '',                          // 上限値
         low: '',                         // 下限値
         normal: '',                      // 基準値
         out: ''                          // 異常値フラグ H=上限値越え N=基準値範囲内 L=下限値未満 A=異常
      }
   },
   unit: {
      value: '',                          // 単位
      attr: {
         uCode: '',                       // ユーザー指定
         uCodeId: ''                      // 用いたテーブル名を入力
      }
   },
   referenceInfo: {                       // 外部参照情報
      extRef: []                          // extRef array
   },
   itemMemo: [],                         // 項目コメント itemMemo array
   itemMemoF: ''                          // 項目フリーコメント
};

// 外部参照
var extRef = {
   attr: {
      contentType: '',
      medicalRole: '',
      title: '',
      href: ''
   }
};

// 項目コメント
var itemMemo = {
   value: '',                             // 項目コメント値
   attr: {
      imCodeName: '',                     // 項目コメント名称
      imCode: '',                         // ユーザー指定
      imCodeId: ''                        // 用いたテーブル名を入力
   }
};
********************************************************************************/

module.exports = {

    buildInformation: function(info, array) {

        array.push('<mmlLb:information');

        // registId
        array.push(' mmlLb:registId=');
        array.push(utils.addQuote(info.attr.registId));

        // sampleTime
        if (info.attr.hasOwnProperty('sampleTime')) {
            array.push(' mmlLb:sampleTime=');
            array.push(utils.addQuote(info.attr.sampleTime));
        }

        // registTime
        array.push(' mmlLb:registTime=');
        array.push(utils.addQuote(info.attr.registTime));

        // reportTime
        array.push(' mmlLb:reportTime=');
        array.push(utils.addQuote(info.attr.reportTime));
        array.push('>');

        // reportStatus
        array.push('<mmlLb:reportStatus');
        array.push(' mmlLb:statusCode=');
        array.push(utils.addQuote(info.reportStatus.attr.statusCode));
        array.push(' mmlLb:statusCodeId=');
        array.push(utils.addQuote(info.reportStatus.attr.statusCodeId));
        array.push('>');
        array.push(info.reportStatus.value);
        array.push('</mmlLb:reportStatus>');

        // set
        if (info.hasOwnProperty('set')) {
            array.push('<mmlLb:set');
            if (info.set.hasOwnProperty('attr')) {
                if (info.set.attr.hasOwnProperty('setCode')) {
                    array.push(' mmlLb:setCode=');
                    array.push(utils.addQuote(info.set.attr.setCode));
                }
                if (info.set.attr.hasOwnProperty('setCodeId')) {
                    array.push(' mmlLb:setCodeId=');
                    array.push(utils.addQuote(info.set.attr.setCodeId));
                }
            }
            array.push('>');
            array.push(info.set.value);
            array.push('</mmlLb:set>');
        }

        // facility
        array.push('<mmlLb:facility');
        array.push(' mmlLb:facilityCode=');
        array.push(utils.addQuote(info.facility.attr.facilityCode));
        array.push(' mmlLb:facilityCodeId=');
        array.push(utils.addQuote(info.facility.attr.facilityCodeId));
        array.push('>');
        array.push(info.facility.value);
        array.push('</mmlLb:facility>');

        // department
        if (info.hasOwnProperty('department')) {
            array.push('<mmlLb:department');
            if (info.department.hasOwnProperty('attr')) {
                if (info.department.attr.hasOwnProperty('depCode')) {
                    array.push(' mmlLb:depCode=');
                    array.push(utils.addQuote(info.department.attr.depCode));
                }
                if (info.department.attr.hasOwnProperty('depCodeId')) {
                    array.push(' mmlLb:depCodeId=');
                    array.push(utils.addQuote(info.department.attr.depCodeId));
                }
            }
            array.push('>');
            array.push(info.department.value);
            array.push('</mmlLb:department>');
        }

        // ward
        if (info.hasOwnProperty('ward')) {
            array.push('<mmlLb:ward');
            if (info.ward.hasOwnProperty('attr')) {
                if (info.ward.attr.hasOwnProperty('wardCode')) {
                    array.push(' mmlLb:wardCode=');
                    array.push(utils.addQuote(info.ward.attr.wardCode));
                }
                if (info.ward.attr.hasOwnProperty('wardCodeId')) {
                    array.push(' mmlLb:wardCodeId=');
                    array.push(utils.addQuote(info.ward.attr.wardCodeId));
                }
            }
            array.push('>');
            array.push(info.ward.value);
            array.push('</mmlLb:ward>');
        }

        // client
        if (info.hasOwnProperty('client')) {
            array.push('<mmlLb:client');
            if (info.client.hasOwnProperty('attr')) {
                if (info.client.attr.hasOwnProperty('clientCode')) {
                    array.push(' mmlLb:clientCode=');
                    array.push(utils.addQuote(info.client.attr.clientCode));
                }
                if (info.client.attr.hasOwnProperty('clientCodeId')) {
                    array.push(' mmlLb:clientCodeId=');
                    array.push(utils.addQuote(info.client.attr.clientCodeId));
                }
            }
            array.push('>');
            array.push(info.client.value);
            array.push('</mmlLb:client>');
        }

        // laboratoryCenter
        array.push('<mmlLb:laboratoryCenter');
        array.push(' mmlLb:centerCode=');
        array.push(utils.addQuote(info.laboratoryCenter.attr.centerCode));
        array.push(' mmlLb:centerCodeId=');
        array.push(utils.addQuote(info.laboratoryCenter.attr.centerCodeId));
        array.push('>');
        array.push(info.laboratoryCenter.value);
        array.push('</mmlLb:laboratoryCenter>');

        // technician
        if (info.hasOwnProperty('technician')) {
            array.push('<mmlLb:technician');
            if (info.technician.hasOwnProperty('attr')) {
                if (info.technician.attr.hasOwnProperty('techCode')) {
                    array.push(' mmlLb:techCode=');
                    array.push(utils.addQuote(info.technician.attr.techCode));
                }
                if (info.technician.attr.hasOwnProperty('techCodeId')) {
                    array.push(' mmlLb:techCodeId=');
                    array.push(utils.addQuote(info.technician.attr.techCodeId));
                }
            }
            array.push('>');
            array.push(info.technician.value);
            array.push('</mmlLb:technician>');
        }

        // repMemo
        if (info.hasOwnProperty('repMemo')) {
            info.repMemo.forEach((entry) => {
                array.push('<mmlLb:repMemo');
                if (entry.hasOwnProperty('attr')) {
                    if (entry.attr.hasOwnProperty('repCodeName')) {
                        array.push(' mmlLb:repCodeName=');
                        array.push(entry.attr.repCodeName);
                    }
                    if (entry.attr.hasOwnProperty('repCode')) {
                        array.push(' mmlLb:repCode=');
                        array.push(entry.attr.repCode);
                    }
                    if (entry.attr.hasOwnProperty('repCodeId')) {
                        array.push(' mmlLb:repCodeId=');
                        array.push(entry.attr.repCodeId);
                    }
                }
                array.push('>');
                array.push(entry.value);
                array.push('</mmlLb:repMemo>');
            });
        }

        // repMemoF
        if (info.hasOwnProperty('repMemoF')) {
            array.push('<mmlLb:repMemoF>');
            array.push(info.repMemoF);
            array.push('</mmlLb:repMemoF>');
        }

        array.push('</mmlLb:information>');
    },

    buildItem: function(item, array) {
        array.push('<mmlLb:item>');

        // itemName
        array.push('<mmlLb:itemName');
        array.push(' mmlLb:itCode=');
        array.push(utils.addQuote(item.itemName.attr.itCode));
        array.push(' mmlLb:itCodeId=');
        array.push(utils.addQuote(item.itemName.attr.itCodeId));
        if (item.itemName.attr.hasOwnProperty('Acode')) {
            array.push(' mmlLb:Acode=');
            array.push(utils.addQuote(item.itemName.attr.Acode));
        }
        if (item.itemName.attr.hasOwnProperty('Icode')) {
            array.push(' mmlLb:Icode=');
            array.push(utils.addQuote(item.itemName.attr.Icode));
        }
        if (item.itemName.attr.hasOwnProperty('Scode')) {
            array.push(' mmlLb:Scode=');
            array.push(utils.addQuote(item.itemName.attr.Scode));
        }
        if (item.itemName.attr.hasOwnProperty('Mcode')) {
            array.push(' mmlLb:Mcode=');
            array.push(utils.addQuote(item.itemName.attr.Mcode));
        }
        if (item.itemName.attr.hasOwnProperty('Rcode')) {
            array.push(' mmlLb:Rcode=');
            array.push(utils.addQuote(item.itemName.attr.Rcode));
        }
        array.push('>');
        array.push(item.itemName.value);
        array.push('</mmlLb:itemName>');

        // value
        array.push('<mmlLb:value>');
        array.push(item.value);
        array.push('</mmlLb:value>');

        // numValue
        if (item.hasOwnProperty('numValue')) {
            array.push('<mmlLb:numValue');
            if (item.numValue.hasOwnProperty('attr')) {
                if (item.numValue.attr.hasOwnProperty('up')) {
                    array.push(' mmlLb:up=');
                    array.push(utils.addQuote(item.numValue.attr.up));
                }
                if (item.numValue.attr.hasOwnProperty('low')) {
                    array.push(' mmlLb:low=');
                    array.push(utils.addQuote(item.numValue.attr.low));
                }
                if (item.numValue.attr.hasOwnProperty('normal')) {
                    array.push(' mmlLb:normal=');
                    array.push(utils.addQuote(item.numValue.attr.normal));
                }
                if (item.numValue.attr.hasOwnProperty('out')) {
                    array.push(' mmlLb:out=');
                    array.push(utils.addQuote(item.numValue.attr.out));
                }
            }
            array.push('>');
            array.push(item.numValue.value);
            array.push('</mmlLb:numValue>');
        }

        // unit
        if (item.hasOwnProperty('unit')) {
            array.push('<mmlLb:unit');
            if (item.unit.hasOwnProperty('attr')) {
                if (item.unit.attr.hasOwnProperty('uCode')) {
                    array.push(' mmlLb:uCode=');
                    array.push(utils.addQuote(item.numValue.attr.uCode));
                }
                if (item.unit.attr.hasOwnProperty('uCodeId')) {
                    array.push(' mmlLb:uCodeId=');
                    array.push(utils.addQuote(item.numValue.attr.uCodeId));
                }
            }
            array.push('>');
            array.push(item.unit.value);
            array.push('</mmlLb:unit>');
        }

        // referenceInfo
        if (item.hasOwnProperty('referenceInfo')) {
            array.push('<mmlLb:referenceInfo>');
            item.referenceInfo.forEach((entry) => {
                array.push('<mmlCm:extRef');
                if (entry.attr.hasOwnProperty('contentType')) {
                    array.push(' mmlCm:contentType=');
                    array.push(utils.addQuote(entry.attr.contentType));
                }
                if (entry.attr.hasOwnProperty('medicalRole')) {
                    array.push(' mmlCm:medicalRole=');
                    array.push(utils.addQuote(entry.attr.medicalRole));
                }
                if (entry.attr.hasOwnProperty('title')) {
                    array.push(' mmlCm:title=');
                    array.push(utils.addQuote(entry.attr.title));
                }
                array.push(' mmlCm:href=');
                array.push(utils.addQuote(entry.attr.href));
                array.push('/>');
            });
            array.push('</mmlLb:referenceInfo>');
        }

        // itemMemo
        if (item.hasOwnProperty('itemMemo')) {
            item.itemMemo.forEach((entry) => {
                array.push('<mmlLb:itemMemo');
                if (entry.hasOwnProperty('attr')) {
                    if (entry.attr.hasOwnProperty('imCodeName')) {
                        array.push(' mmlLb:imCodeName=');
                        array.push(utils.addQuote(entry.attr.imCodeName));
                    }
                    if (entry.attr.hasOwnProperty('imCode')) {
                        array.push(' mmlLb:imCode=');
                        array.push(utils.addQuote(entry.attr.imCode));
                    }
                    if (entry.attr.hasOwnProperty('imCodeId')) {
                        array.push(' mmlLb:imCodeId=');
                        array.push(utils.addQuote(entry.attr.imCodeId));
                    }
                }
                array.push('>');
                array.push(entry.value);
                array.push('</mmlLb:itemMemo>');
            });
        }

        // itemMemoF
        if (item.hasOwnProperty('itemMemoF')) {
            array.push('<mmlLb:itemMemoF>');
            array.push(item.itemMemoF);
            array.push('</mmlLb:itemMemoF>');
        }

        // 終わり
        array.push('</mmlLb:item>');
    },

    buildLaboTest:function(laboTest, array) {
        array.push('<mmlLb:laboTest>');
        array.push('<mmlLb:specimen>');

        // specimenName
        array.push('<mmlLb:specimenName');
        array.push(' mmlLb:spCode=');
        array.push(utils.addQuote(laboTest.specimen.specimenName.attr.spCode));
        array.push(' mmlLb:spCodeId=');
        array.push(utils.addQuote(laboTest.specimen.specimenName.attr.spCodeId));
        array.push('>');
        array.push(laboTest.specimen.specimenName.value);
        array.push('</mmlLb:specimenName>');

        // spcMemo
        if (laboTest.specimen.hasOwnProperty('spcMemo')) {
            laboTest.specimen.spcMemo.forEach((entry) => {
                array.push('<mmlLb:spcMemo');
                if (entry.hasOwnProperty('attr')) {
                    if (entry.attr.hasOwnProperty('smCodeName')) {
                        array.push(' mmlLb:smCodeName=');
                        array.push(utils.addQuote(entry.attr.smCodeName));
                    }
                    if (entry.attr.hasOwnProperty('smCode')) {
                        array.push(' mmlLb:smCode=');
                        array.push(utils.addQuote(entry.attr.smCode));
                    }
                    if (entry.attr.hasOwnProperty('smCodeId')) {
                        array.push(' mmlLb:smCodeId=');
                        array.push(utils.addQuote(entry.attr.smCodeId));
                    }
                }
                array.push('>');
                array.push(entry.value);
                array.push('</mmlLb:spcMemo>');
            });
        }

        // spcMemoF
        if (laboTest.specimen.hasOwnProperty('spcMemoF')) {
            array.push('<mmlLb:spcMemoF>');
            array.push(laboTest.specimen.spcMemoF);
            array.push('</mmlLb:spcMemoF>');
        }
        array.push('</mmlLb:specimen>');

        // item
        laboTest.item.forEach((entry) => {
            this.buildItem(entry, array);
        });

        // 終わり
        array.push('</mmlLb:laboTest>');
    },

    build: function(test, array) {
        array.push('<mmlLb:TestModule>');
        this.buildInformation(test.information, array);
        test.laboTest.forEach((entry) => {
            this.buildLaboTest(entry, array);
        });
        array.push('</mmlLb:TestModule>');
    }
};
