'use strict';

const utils = require('../lib/utils');

var ReferralModule = {
    PatientModule: {},
    occupation: '',
    referFrom: {},                                          // mmlPsi:PersonalizedInfo
    title: '',
    greeting: '',
    chiefComplaints: '',
    clinicalDiagnosis: '',
    pastHistory: {
        value: '',
        extRef: []
    },                                                     // mmlCm:extRef
    familyHistory: {
        value: '',
        extRef: []
    },
    presentIllness: {
        value: '',
        extRef: []
    },
    testResults: {
        value: '',
        extRef: []
    },
    clinicalCourse: '',
    medication: {},
    referPurpose: '',
    remarks: {
        value: '',
        extRef: []
    },
    referToFacility: {
        Facility: {},
        Department: {}
    },
    referToPerson: {},                                      // mmlPsi:PersonalizedInfo
    referToUnknownName: ''
};

var medication = {
    value: '',
    PrescriptionModule: {},
    InjectionModule: {},
    extRef: []
};
