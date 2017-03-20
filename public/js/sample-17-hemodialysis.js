// 透析記録
var postHemodialysis = function (callback) {

    var simpleHemodialysis = {
        version: '4.1.2',                           // バージョン
        createDate: '2017-02-17T16:12:56+09:00',    // 作成日 xs:dateTime
        hemoDialysis: []                            // 透析情報 * [hemoDialysis]
    };

    var hemoDialysis = {
        facility: simpleFacility,                   // 施設情報、構造はMML共通形式を参照 simpleFacility
        patient: simplePatient,                     // 患者情報、構造はmmlPi:PatientModuleを参照 simplePatient
        orderSection: {},                           // 透析指示情報 ? orderSection
    };

    var orderSection = {                            // 透析指示情報
        orders: [],                                 // オーダー単位 * [orders]
    };

    var orders = {                                  // オーダー単位
        orderStatus: 'active',                      // オーダ状態を識別するフラグ 現行オーダー: active, 変更オーダー: alteration
        dateOrdered: '2017-02-17',                  // オーダー発行日 ? xs:date
        dateEffective: '2017-02-17',                // 変更オーダー発行日 ? xs:date
        orderGroups: []                             // オーダーグループ + [orderGroups]
    };

    var orderGroups = {
        effectiveDays: {                            // 実効曜日 ?
            weekday: ['1', '2', '3', '4', '5']
        },
        timeShift: {                                // 透析シフト名称 ?
            value: '準夜帯',
            code: '03',
            tableId: 'hdTimeShiftTable01'
        },
        method: [                                   // 血液浄化方法 * [method]
            {
                methodName: {
                    value: '血液透析',
                    code: '01',
                    tableId: 'hdMethodTable01'
                },
                timeHdStart: {
                    value: 'PT0H0M0S',
                    timeDirection: 'after'
                },
                timeHdEnd: {
                    value: 'PT4H0M0S',
                    timeDirection: 'after'
                }
            }
        ],
        dryWeight: {                                // ドライウエイト ?
            value: '60.0',
            unit: 'kg'
        },
        weightCorrection: {                         // 重量補正 ?
            value: '0.50',
            unit: 'kg',
            cnote: '食事量'
        },
        bloodFlow: [                                // 血液流量 *
            {
                flowRate: {
                    value: '200',
                    ubit: 'mL/min'
                },
                timeHdStart: {
                    value: 'PT0H0M0S',
                    timeDirection: 'after'
                },
                timeHdEnd: {
                    value: 'PT4H0M0S',
                    timeDirection: 'after'
                }
            }
        ],
        dialyser: {                                 // ダイアライザー名称 ?
            value: 'RENAK PS-2.3',
            code: '4987488802035',
            type: 'JANコード',
            membraneArea: 2.0,
            unit: 'm2'
        },
        dialysate: [                                // 透析液 *
            {
                dialysateName: {
                    value: 'キンダリー透析剤3E',
                    code: '3410523D2033',
                    type: 'YJコード',
                    modification: 'Ca=2.5mEq/L'
                },
                timeHdStart: {
                    value: 'PT0H0M0S',
                    timeDirection: 'after'
                },
                timeHdEnd: {
                    value: 'PT4H0M0S',
                    timeDirection: 'after'
                }
            }
        ],
        dialysateFlow: [                            // 透析液流量 *
            {
                flowRate: {
                    value: '200',
                    unit: 'mL/min'
                },
                timeHdStart: {
                    value: 'PT0H0M0S',
                    timeDirection: 'after'
                },
                timeHdEnd: {
                    value: 'PT4H0M0S',
                    timeDirection: 'after'
                }
            }
        ],
        dialysateTemp: [                            // 透析液温度 *
            {
                dialysateTempValue: {
                    value: '36.5',
                    unit: 'C'
                },
                timeHdStart: {
                    value: 'PT0H0M0S',
                    timeDirection: 'after'
                },
                timeHdEnd: {
                    value: 'PT4H0M0S',
                    timeDirection: 'after'
                }
            }
        ],
        needle: [                                   // 穿刺針名称 *
            {
                value: 'Happycath NEO 16G',
                code: '4543527236393',
                type: 'JANコード',
                position: 'AV側'
            }
        ],
        medication: [                               // 投薬 *
            {
                drugName: {
                    value: 'リズミック錠10mg',
                    code: '2190022F1024',
                    type: 'YJコード'
                },
                dose: {
                    value: 10,
                    unit: 'mg'
                },
                timeHd: {
                    value: 'PT0H0M0S',
                    timeDirection: 'after'
                },
                note: '透析開始時に服用'
            }
        ],
        injection: [                                // 注射 *
            {
                drugName: {
                    value: 'ヘパリンNa透析用250単位/mLシリンジ20mL「ニプロ」',
                    code: '3334402P2052',
                    type: 'YJコード'
                },
                dose: {
                    value: 600,
                    unit: 'unit/h'
                },
                timeHdStart: {
                    value: 'PT0H0M0S',
                    timeDirection: 'after'
                },
                timeHdEnd: {
                    value: 'PT4H0M0S',
                    timeDirection: 'after'
                },
                routeName: {
                    value: '動脈側回路内点滴注射',
                    code: 'dica',
                    tableId: 'hdInjectionRouteTable01'
                }
            }
        ]
    };

    // 関係構築
    orders.orderGroups.push(orderGroups);
    orderSection.orders.push(orders);
    hemoDialysis.orderSection = orderSection;
    simpleHemodialysis.hemoDialysis.push(hemoDialysis);

    // コンポジションを生成
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context 文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 = 報告日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleHemodialysis]           // content: simpleHemodialysis
    };

    //------------------------------------------------------------------
    // 透析情報のタイトルと生成目的を設定する
    //------------------------------------------------------------------
    simpleComposition.context.title = '透析';
    // MML007 hemodialysis
    simpleComposition.context.generationPurpose = 'hemodialysis';
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('hemodialysis', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
