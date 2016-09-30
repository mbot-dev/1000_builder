'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');


var VitalSignModule = {
    context: {},                                        // ?
    item: [],                                           // +
    observedTime: '',                                   //
    protocol: {},                                       // ?
    vsMemo: ''                                          // ?
};

var context = {
    facility: {
        value: '',
        attr: {
            facilityCode: '',
            facilityCodeId: ''                          // ca | insurance | monbusho | JMARI
        }
    },
    department: {
        value: '',
        attr: {
            depCode: '',
            depCodeId: ''
        }
    },
    ward: {
        value: '',
        attr: {
            wardCode: '',
            wardCodeId: ''
        }
    },
    observer: {
        value: '',
        attr: {
            obsCode: '',
            obsCodeId: ''
        }
    }
};

var item = {
    itemName: '',
    value: '',
    numValue: '',
    unit: '',
    itemMemo: ''
};

var protocol = {
    value: '',
    procedure: '',
    position: '',
    device: '',
    bodyLocation: '',
    protMemo: ''
};

module.exports = {

    buildVsMemo: function(value, arr) {
        arr.push('<mmlVs:vsMemo>');
        arr.push(value);
        arr.push('</mmlVs:vsMemo>');
    },

    buildProtocol: function(target, arr) {
        arr.push('<mmlVs:protocol>');
        if (target.hasOwnProperty('procedure')) {
            arr.push('<mmlVs:procedure>');
            arr.push(target.procedure);
            arr.push('</mmlVs:procedure>');
        }
        if (target.hasOwnProperty('position')) {
            arr.push('<mmlVs:position>');
            arr.push(target.position);
            arr.push('</mmlVs:position>');
        }
        if (target.hasOwnProperty('device')) {
            arr.push('<mmlVs:device>');
            arr.push(target.device);
            arr.push('</mmlVs:device>');
        }
        if (target.hasOwnProperty('bodyLocation')) {
            arr.push('<mmlVs:bodyLocation>');
            arr.push(target.bodyLocation);
            arr.push('</mmlVs:bodyLocation>');
        }
        if (target.hasOwnProperty('protMemo')) {
            target.protMemo.forEach((entry) => {
                arr.push('<mmlVs:protMemo>');
                arr.push(entry);
                arr.push('</mmlVs:protMemo>');
            });
        }
        arr.push('</mmlVs:protocol>');
    },

    buildObservedTime: function(value, arr) {
        arr.push('<mmlVs:observedTime>');
        arr.push(value);
        arr.push('</mmlVs:observedTime>');
    },

    buildItem: function(target, arr) {
        target.forEach((entry) => {
            arr.push('<mmlVs:item>');
            arr.push('<mmlVs:itemName>');
            arr.push(entry.itemName);
            arr.push('</mmlVs:itemName>');
            if (entry.hasOwnProperty('value')) {
                arr.push('<mmlVs:value>');
                arr.push(entry.value);
                arr.push('</mmlVs:value>');
            }
            if (entry.hasOwnProperty('numValue')) {
                arr.push('<mmlVs:numValue>');
                arr.push(entry.numValue);
                arr.push('</mmlVs:numValue>');
            }
            if (entry.hasOwnProperty('unit')) {
                arr.push('<mmlVs:unit>');
                arr.push(entry.unit);
                arr.push('</mmlVs:unit>');
            }
            if (entry.hasOwnProperty('itemMemo')) {
                entry.itemMemo.forEach((e) => {
                    arr.push('<mmlVs:itemMemo>');
                    arr.push(e);
                    arr.push('</mmlVs:itemMemo>');
                });
            }
            arr.push('</mmlVs:item>');
        });
    },

    buildContext: function(target, arr) {
        arr.push('<mmlVs:context>');
        if (target.hasOwnProperty('facility')) {
            arr.push('<mmlVs:facility');
            arr.push(' mmlVs:facilityCode=');
            arr.push(utils.addQuote(target.facility.attr.facilityCode));
            arr.push(' facilityCodeId=');
            arr.push(utils.addQuote(target.facility.attr.facilityCodeId));
            arr.push('>');
            arr.push(target.facility.value);
            arr.push('</mmlVs:facility>');
        }
        if (target.hasOwnProperty('department')) {
            arr.push('<mmlVs:department');
            if (target.department.hasOwnProperty('attr')) {
                if (target.department.attr.hasOwnProperty('depCode')) {
                    arr.push(' depCode=');
                    arr.push(utils.addQuote(target.department.attr.depCode));
                }
                if (target.department.attr.hasOwnProperty('depCodeId')) {
                    arr.push(' depCodeId=');
                    arr.push(utils.addQuote(target.department.attr.depCodeId));
                }
            }
            arr.push('>');
            arr.push(target.department.value);
            arr.push('</mmlVs:department>');
        }
        if (target.hasOwnProperty('ward')) {
            arr.push('<mmlVs:ward');
            if (target.ward.hasOwnProperty('attr')) {
                if (target.ward.attr.hasOwnProperty('wardCode')) {
                    arr.push(' wardCode=');
                    arr.push(utils.addQuote(target.ward.attr.wardCode));
                }
                if (target.ward.attr.hasOwnProperty('wardCodeId')) {
                    arr.push(' wardCodeId=');
                    arr.push(utils.addQuote(target.ward.attr.wardCodeId));
                }
            }
            arr.push('>');
            arr.push(target.ward.value);
            arr.push('</mmlVs:ward>');
        }
        if (target.hasOwnProperty('observer')) {
            arr.push('<mmlVs:observer');
            if (target.observer.hasOwnProperty('attr')) {
                if (target.observer.attr.hasOwnProperty('obsCode')) {
                    arr.push(' obsCode=');    // arr.push(' mmlVs:obsCode=')
                    arr.push(utils.addQuote(target.observer.attr.obsCode));
                }
                if (target.observer.attr.hasOwnProperty('obsCodeId')) {
                    arr.push(' obsCodeId=');  // arr.push(' mmlVs:obsCodeId=');
                    arr.push(utils.addQuote(target.observer.attr.obsCodeId));
                }
            }
            arr.push('>');
            arr.push(target.observer.value);
            arr.push('</mmlVs:observer>');
        }
        arr.push('</mmlVs:context>');
    },

    build: function(target, arr) {
        arr.push('<mmlVs:VitalSignModule>');
        if (target.hasOwnProperty('context')) {
            this.buildContext(target.context, arr);
        }
        this.buildItem(target.item, arr);
        this.buildObservedTime(target.observedTime, arr);
        if (target.hasOwnProperty('protocol')) {
            this.buildProtocol(target.protocol, arr);
        }
        if (target.hasOwnProperty('vsMemo')) {
            this.buildVsMemo(target.vsMemo, arr);
        }
        arr.push('</mmlVs:VitalSignModule>');
    }
};
