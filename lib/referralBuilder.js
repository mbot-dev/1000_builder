'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');
const prescriptionBuilder = require('../lib/prescriptionBuilder');
const injectionBuilder = require('../lib/injectionBuilder');
const patientBuilder = require('../lib/patientBuilder');
const summaryBuilder = require('../lib/summaryBuilder');

/*******************************************************************************
var ReferralModule = {
    PatientModule: {},                                      // 患者情報
    occupation: '',                                         // 職業 ?
    referFrom: {},                                          // 紹介者情報を入れる親エレメント mmlPsi:PersonalizedInfo
    title: '',                                              // タイトル
    greeting: '',                                           // 挨拶文 ?
    chiefComplaints: '',                                    // 主訴
    clinicalDiagnosis: '',                                  // 病名 ?
    pastHistory: {                                          // 既往歴 ?
        value: ''                                           // mixed=true extRef *
    },
    familyHistory: {                                        // 家族歴 ?
        value: ''                                           // mixed=true extRef *
    },
    presentIllness: {                                       // 症状経過
        value: ''                                           // mixed=true extRef *
    },
    testResults: {                                          // 検査結果 ?
        value: ''                                           // mixed=true extRef *
    },
    clinicalCourse: '',                                     // 治療経過 ?
    medication: {},                                         // 現在の処方 ?
    referPurpose: '',                                       // 紹介目的
    remarks: {                                              // 備考 ?
        value: ''                                           // mixed=true extRef *
    },
    referToFacility: {                                      // 紹介先医療機関名
        Facility: {},
        Department: {}
    },
    referToPerson: {},                                      // 紹介先医師 ? mmlPsi:PersonalizedInfo
    referToUnknownName: ''                                  // 医師名を指定しない相手 ?
};

var medication = {
    value: '',                                              // テキストとmmlCm:extRefの混在可
    PrescriptionModule: {},                                 // mmlPs:PrescriptionModule
    InjectionModule: {},                                    // mmlInj:InjectionModule
    extRef: []
};
*******************************************************************************/

module.exports = {

    // PatientModule
    buildPatientModule: function (target, arr) {
        patientBuilder.build(target, arr);
    },

    // occupation
    buildOccupation: function (target, arr) {
        arr.push('<mmlRe:occupation>');
        arr.push(target);
        arr.push('</mmlRe:occupation>');
    },

    // referFrom
    buildReferFrom: function (target, arr) {
        arr.push('<mmlRe:referFrom>');
        commonBuilder.buildPersonalizedInfo(target, arr);
        arr.push('</mmlRe:referFrom>');
    },

    // title
    buildTitle: function (target, arr) {
        arr.push('<mmlRe:title>');
        arr.push(target);
        arr.push('</mmlRe:title>');
    },

    // greeting
    buildGreeting: function (target, arr) {
        arr.push('<mmlRe:greeting>');
        arr.push(target);
        arr.push('</mmlRe:greeting>');
    },

    // chiefComplaints
    buildChiefComplaints: function (target, arr) {
        arr.push('<mmlRe:chiefComplaints>');
        arr.push(target);
        arr.push('</mmlRe:chiefComplaints>');
    },

    // clinicalDiagnosis
    buildClinicalDiagnosis: function (target, arr) {
        arr.push('<mmlRe:clinicalDiagnosis>');
        arr.push(target);
        arr.push('</mmlRe:clinicalDiagnosis>');
    },

    // pastHistory extRef
    buildPastHistory: function (target, arr) {
        arr.push('<mmlRe:pastHistory>');
        arr.push(target);
        arr.push('</mmlRe:pastHistory>');
    },

    // familyHistory extRef
    buildFamilyHistory: function (target, arr) {
        arr.push('<mmlRe:familyHistory>');
        arr.push(target);
        arr.push('</mmlRe:familyHistory>');
    },

    // presentIllness extRef
    buildPresentIllness: function (target, arr) {
        arr.push('<mmlRe:presentIllness>');
        arr.push(target);
        arr.push('</mmlRe:presentIllness>');
    },

    // testResults extRef
    buildTestResults: function (target, arr) {
        arr.push('<mmlRe:testResults>');
        arr.push(target);
        arr.push('</mmlRe:testResults>');
    },

    // clinicalCourse
    buildClinicalCourse: function (target, arr) {
        summaryBuilder.buildClinicalCourse(target, arr);
    },

    // medication extRef
    buildMedication: function (target, arr) {
        arr.push('<mmlRe:medication>');
        arr.push(target.value);
        if (target.hasOwnProperty('PrescriptionModule')) {
            prescriptionBuilder.build(target.PrescriptionModule, arr);
        }
        if (target.hasOwnProperty('InjectionModule')) {
            injectionBuilder.build(target.InjectionModule, arr);
        }
        arr.push('</mmlRe:medication>');
    },

    // referPurpose
    buildReferPurpose: function (target, arr) {
        arr.push('<mmlRe:referPurpose>');
        arr.push(target);
        arr.push('</mmlRe:referPurpose>');
    },

    // remarks extRef
    buildRemarks: function (target, arr) {
        arr.push('<mmlRe:remarks>');
        arr.push(target);
        arr.push('</mmlRe:remarks>');
    },

    // referToFacility
    buildReferToFacility: function (target, arr) {
        arr.push('<mmlRe:referToFacility>');
        if (target.hasOwnProperty('Facility')) {
            commonBuilder.buildFacility(target.Facility, arr);
        }
        if (target.hasOwnProperty('Department')) {
            commonBuilder.buildDepartment(target.Department, arr);
        }
        arr.push('</mmlRe:referToFacility>');
    },

    // referToPerson
    buildReferToPerson: function (target, arr) {
        arr.push('<mmlRe:referToPerson>');
        commonBuilder.buildPersonalizedInfo(target, arr);
        arr.push('</mmlRe:referToPerson>');
    },

    // referToUnknownName
    buildReferToUnknownName: function (target, arr) {
        arr.push('<mmlRe:referToUnknownName>');
        arr.push(target);
        arr.push('</mmlRe:referToUnknownName>');
    },

    build: function (target, arr) {
        arr.push('<mmmRe:ReferralModule>');

        // PatientModule
        this.buildPatientModule(target.PatientModule, arr);

        // occupation
        if (target.hasOwnProperty('occupation')) {
            this.buildOccupation(target.occupation, arr);
        }

        // referFrom
        this.buildReferFrom(target.referFrom, arr);

        // title
        this.buildTitle(target.title, arr);

        // greeting
        if (target.hasOwnProperty('greeting')) {
            this.buildGreeting(target.greeting, arr);
        }

        // chiefComplaints
        this.buildChiefComplaints(target.chiefComplaints, arr);

        // clinicalDiagnosis
        if (target.hasOwnProperty('clinicalDiagnosis')) {
            this.buildClinicalDiagnosis(target.clinicalDiagnosis, arr);
        }

        // pastHistory
        if (target.hasOwnProperty('pastHistory')) {
            this.buildPastHistory(target.pastHistory, arr);
        }

        // familyHistory
        if (target.hasOwnProperty('familyHistory')) {
            this.buildFamilyHistory(target.familyHistory, arr);
        }

        // presentIllness
        if (target.hasOwnProperty('presentIllness')) {
            this.buildPresentIllness(target.presentIllness, arr);
        }

        // testResults
        if (target.hasOwnProperty('testResults')) {
            this.buildTestResults(target.testResults, arr);
        }

        // clinicalCourse
        if (target.hasOwnProperty('clinicalCourse')) {
            this.buildClinicalCourse(target.clinicalCourse, arr);
        }

        // medication
        if (target.hasOwnProperty('medication')) {
            this.buildMedication(target.medication, arr);
        }

        // referPurpose
        this.buildReferPurpose(target.referPurpose, arr);

        // remarks
        if (target.hasOwnProperty('remarks')) {
            this.buildRemarks(target.remarks, arr);
        }

        // referToFacility
        this.buildReferToFacility(target.referToFacility, arr);

        // referToPerson
        if (target.hasOwnProperty('referToPerson')) {
            this.buildReferToPerson(target.referToPerson, arr);
        }

        // referToUnknownName
        if (target.hasOwnProperty('referToUnknownName')) {
            this.buildReferToUnknownName(target.referToUnknownName, arr);
        }

        arr.push('</mmmRe:ReferralModule>');
    }
};
