'use strict';

const utils = require('../lib/utils');

var ReportModule = {
    information: {},
    reportBody: {}
};

var information = {
    attr: {
        performTime: '',
        reportTime: ''
    },
    reportStatus: {
        value: '',
        attr: {
            statusCode: '',
            statusCodeId: ''
        }
    },
    testClass: {
        value: '',
        attr: {
            testClassCode: '',
            testClassCodeId: ''
        }
    },
    testSubclass: {
        value: '',
        attr: {
            testSubclassCode: '',
            testSubclassCodeId: ''
        }
    },
    organ: '',
    consultFrom: {
        conFacility: {
            value: '',
            attr: {
                facilityCode: '',
                facilityCodeId: ''
            }
        },
        conDepartment: {
            value: '',
            attr: {
                depCode: '',
                depCodeId: ''
            }
        },
        conWard: {
            value: '',
            attr: {
                wardCode: '',
                wardCodeId: ''
            }
        },
        client: {
            value: '',
            attr: {
                clientCode: '',
                clientCodeId: ''
            }
        }
    },
    perform: {
        pFacility: {
            value: '',
            attr: {
                facilityCode: '',
                facilityCodeId: ''
            }
        },
        pDepartment: {
            value: '',
            attr: {
                depCode: '',
                depCodeId: ''
            }
        },
        pWard: {
            value: '',
            attr: {
                wardCode: '',
                wardCodeId: ''
            }
        },
        performer: {
            value: '',
            attr: {
                performerCode: '',
                performerCodeId: ''
            }
        },
        supervisor: {
            value: '',
            attr: {
                supervisorCode: '',
                supervisorCodeId: ''
            }
        }
    }
};

var reportBody = {
    chiefComplaints: '',
    testPurpose: '',
    testDx: '',
    testNotes: {
        value: '',
        extRef: []
    },                                          // mmlCm:extRef
    testMemo: [],
    testMemoF: ''
};

var testMemo = {
    value: '',
    attr: {
        tmCodeName: '',
        tmCode: '',
        tmCodeId: ''
    }
};
