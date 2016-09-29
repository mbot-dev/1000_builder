'use strict';

const utils = require('../lib/utils');

var FlowSheetModule = {
    context: {},
    VitalSignModule: [],                                        // *
    intake: [],                                                 // *
    bodilyOutput: [],                                           // *
    fsMemo: ''                                                  // ?
};

var context = {
    facility: {
        value: '',
        attr: {
            facilityCode: '',
            facilityCodeId: ''                                  // ca | insurance | monbusho | JMARI
        }
    },
    department: {                                               // ?
        value: '',
        attr: {
            depCode: '',
            depCodeId: ''
        }
    },
    ward: {                                                     // ?
        value: '',
        attr: {
            wardCode: '',
            wardCodeId: ''
        }
    },
    observer: {                                                 // ?
        value: '',
        attr: {
            obsCode: '',
            obsCodeId: ''
        }
    }
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
