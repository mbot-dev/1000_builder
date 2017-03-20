'use strict';

const utils = require('../lib/utils');
const vitalSignBuilder = require('../lib/vitalSignBuilder');

/*******************************************************************************
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
*******************************************************************************/

module.exports = {

    // context
    buildContext: function (target, arr) {
        arr.push('<mmlFs:context>');
        if (target.hasOwnProperty('facility')) {
            arr.push('<mmlFs:facility');
            arr.push(' mmlFs:facilityCode=');
            arr.push(utils.addQuote(target.facility.attr.facilityCode));
            arr.push(' mmlFs:facilityCodeId=');
            arr.push(utils.addQuote(target.facility.attr.facilityCodeId));
            arr.push('>');
            arr.push(target.facility.value);
            arr.push('</mmlFs:facility>');
        }
        if (target.hasOwnProperty('department')) {
            arr.push('<mmlFs:department');
            if (target.department.hasOwnProperty('attr')) {
                if (target.department.attr.hasOwnProperty('depCode')) {
                    arr.push(' mmlFs:depCode=');
                    arr.push(utils.addQuote(target.department.attr.depCode));
                }
                if (target.department.attr.hasOwnProperty('depCodeId')) {
                    arr.push(' mmlFs:depCodeId=');
                    arr.push(utils.addQuote(target.department.attr.depCodeId));
                }
            }
            arr.push('>');
            arr.push(target.department.value);
            arr.push('</mmlFs:department>');
        }
        if (target.hasOwnProperty('ward')) {
            arr.push('<mmlFs:ward');
            if (target.ward.hasOwnProperty('attr')) {
                if (target.ward.attr.hasOwnProperty('wardCode')) {
                    arr.push(' mmlFs:wardCode=');
                    arr.push(utils.addQuote(target.ward.attr.wardCode));
                }
                if (target.ward.attr.hasOwnProperty('wardCodeId')) {
                    arr.push(' mmlFs:wardCodeId=');
                    arr.push(utils.addQuote(target.ward.attr.wardCodeId));
                }
            }
            arr.push('>');
            arr.push(target.ward.value);
            arr.push('</mmlFs:ward>');
        }
        if (target.hasOwnProperty('observer')) {
            arr.push('<mmlFs:observer');
            if (target.observer.hasOwnProperty('attr')) {
                if (target.observer.attr.hasOwnProperty('obsCode')) {
                    arr.push(' mmlFs:obsCode=');    // arr.push(' mmlFs:obsCode=')
                    arr.push(utils.addQuote(target.observer.attr.obsCode));
                }
                if (target.observer.attr.hasOwnProperty('obsCodeId')) {
                    arr.push(' mmlFs:obsCodeId=');  // arr.push(' mmlFs:obsCodeId=');
                    arr.push(utils.addQuote(target.observer.attr.obsCodeId));
                }
            }
            arr.push('>');
            arr.push(target.observer.value);
            arr.push('</mmlFs:observer>');
        }
        arr.push('</mmlFs:context>');
    },

    // VitalSignModule
    buildVitalSignModule: function (target, arr) {
        vitalSignBuilder.build(target, arr);
    },

    // intake
    buildIntake: function (target, arr) {
        target.forEach((entry) => {
            arr.push('<mmlFs:intake>');

            if (entry.hasOwnProperty('intakeType')) {
                arr.push('<mmlFs:intakeType>');
                arr.push(entry.intakeType);
                arr.push('</mmlFs:intakeType>');
            }

            if (entry.hasOwnProperty('intakeVolume')) {
                arr.push('<mmlFs:intakeVolume>');
                arr.push(entry.intakeVolume);
                arr.push('</mmlFs:intakeVolume>');
            }

            if (entry.hasOwnProperty('intakeUnit')) {
                arr.push('<mmlFs:intakeUnit>');
                arr.push(entry.intakeUnit);
                arr.push('</mmlFs:intakeUnit>');
            }

            if (entry.hasOwnProperty('intakePathway')) {
                arr.push('<mmlFs:intakePathway>');
                arr.push(entry.intakePathway);
                arr.push('</mmlFs:intakePathway>');
            }

            if (entry.hasOwnProperty('intakeStartTime')) {
                arr.push('<mmlFs:intakeStartTime>');
                arr.push(entry.intakeStartTime);
                arr.push('</mmlFs:intakeStartTime>');
            }

            if (entry.hasOwnProperty('intakeEndTime')) {
                arr.push('<mmlFs:intakeEndTime>');
                arr.push(entry.intakeEndTime);
                arr.push('</mmlFs:intakeEndTime>');
            }

            if (entry.hasOwnProperty('intakeMemo')) {
                arr.push('<mmlFs:intakeMemo>');
                arr.push(entry.intakeMemo);
                arr.push('</mmlFs:intakeMemo>');
            }

            arr.push('</mmlFs:intake>');
        });
    },

    // bodilyOutput
    buildBodilyOutput: function (target, arr) {
        target.forEach((entry) => {
            arr.push('<mmlFs:bodilyOutput>');
            if (entry.hasOwnProperty('boType')) {
                arr.push('<mmlFs:boType>');
                arr.push(entry.boType);
                arr.push('</mmlFs:boType>');
            }
            if (entry.hasOwnProperty('boVolume')) {
                arr.push('<mmlFs:boVolume>');
                arr.push(entry.boVolume);
                arr.push('</mmlFs:boVolume>');
            }
            if (entry.hasOwnProperty('boUnit')) {
                arr.push('<mmlFs:boUnit>');
                arr.push(entry.boUnit);
                arr.push('</mmlFs:boUnit>');
            }
            if (entry.hasOwnProperty('boStatus')) {
                arr.push('<mmlFs:boStatus>');
                arr.push(entry.boStatus);
                arr.push('</mmlFs:boStatus>');
            }
            if (entry.hasOwnProperty('boColor')) {
                arr.push('<mmlFs:boColor>');
                arr.push(entry.boColor);
                arr.push('</mmlFs:boColor>');
            }
            if (entry.hasOwnProperty('boPathway')) {
                arr.push('<mmlFs:boPathway>');
                arr.push(entry.boStartTime);
                arr.push('</mmlFs:boPathway>');
            }
            if (entry.hasOwnProperty('boStartTime')) {
                arr.push('<mmlFs:boStartTime>');
                arr.push(entry.boStartTime);
                arr.push('</mmlFs:boStartTime>');
            }
            if (entry.hasOwnProperty('boEndTime')) {
                arr.push('<mmlFs:boEndTime>');
                arr.push(entry.boEndTime);
                arr.push('</mmlFs:boEndTime>');
            }
            if (entry.hasOwnProperty('boFrequency')) {
                // []
                entry.boFrequency.forEach((e) => {
                    arr.push('<mmlFs:boFrequency>');

                    if (e.hasOwnProperty('bofTimes')) {
                        arr.push('<mmlFs:bofTimes>');
                        arr.push(e.bofTimes);
                        arr.push('</mmlFs:bofTimes>');
                    }
                    if (e.hasOwnProperty('bofPeriodStartTime')) {
                        arr.push('<mmlFs:bofPeriodStartTime>');
                        arr.push(e.bofPeriodStartTime);
                        arr.push('</mmlFs:bofPeriodStartTime>');
                    }
                    if (e.hasOwnProperty('bofPeriodEndTime')) {
                        arr.push('<mmlFs:bofPeriodEndTime>');
                        arr.push(e.bofPeriodEndTime);
                        arr.push('</mmlFs:bofPeriodEndTime>');
                    }
                    if (e.hasOwnProperty('bofMemo')) {
                        arr.push('<mmlFs:bofMemo>');
                        arr.push(e.bofMemo);
                        arr.push('</mmlFs:bofMemo>');
                    }

                    arr.push('</mmlFs:boFrequency>');
                });
            }
            if (entry.hasOwnProperty('boMemo')) {
                arr.push('<mmlFs:boMemo>');
                arr.push(entry.boMemo);
                arr.push('</mmlFs:boMemo>');
            }
            arr.push('</mmlFs:bodilyOutput>');
        });
    },

    // fsMemo
    buildFsMemo: function (target, arr) {
        arr.push('<mmlFs:fsMemo>');
        arr.push(target);
        arr.push('</mmlFs:fsMemo>');
    },

    build: function (target, arr) {

        arr.push('<mmlFs:FlowSheetModule>');

        // context
        this.buildContext(target.context, arr);

        // VitalSignModule
        if (target.hasOwnProperty('VitalSignModule')) {
            target.VitalSignModule.forEach((entry) => {
                this.buildVitalSignModule(entry, arr);
            });
        }

        // intake
        if (target.hasOwnProperty('intake')) {
            this.buildIntake(target.intake, arr);
        }

        // bodilyOutput
        if (target.hasOwnProperty('bodilyOutput')) {
            this.buildBodilyOutput(target.bodilyOutput, arr);
        }

        // fsMemo
        if (target.hasOwnProperty('fsMemo')) {
            this.buildFsMemo(target.fsMemo, arr);
        }

        arr.push('</mmlFs:FlowSheetModule>');
    }
};
