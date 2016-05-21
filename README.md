## 千年ビルダー

千年ビルダーは、[千年カルテプロジェクト](https://www.facebook.com/gEHR-398609153661839/)へ参加するためにカルテのデータを [MML4.0](http://www.medxml.net/MML40j/mml4.html) にエンコードするサーバーアプリケーションです。また利用にあたってMMLの知識は不要です。

### 利用イメージ

* 患者さんがクリニックを受診しました。
* 医師は処方せんを出しました。

この時、患者、医師、処方を下記のような単純なJSONデータに変換し、サーバーへポストします。（個人名: [なんちゃって個人情報](http://kazina.com/dummy/) を使用）

```javascript
// 患者
var simplePatient = {
    id: '0516',                                        // 施設(病院)内で発番されている患者Id
    idType: 'facility',                                // 施設固有のIdであることを示す
    facilityId: 'JPN012345678901',                     // 医療連携等のために施設に振られているId
    kanjiName: '宮田 奈々',                             // 漢字の氏名
    kanaName: 'ミヤタ ナナ',                             // カナ
    romanName: 'Nana Miyata',                          // ローマ字
    sex: 'femail',                                     // MML0010(女:femail 男:male その他:other 不明:unknown)
    birthday: '1994-11-26',                            // 生年月日
    maritalStatus: 'single',                           // 婚姻状況 MML0011を使用 オプション
    nationality: 'JPN',                                // 国籍 オプション
    zipCode: '000-0000',                               // 郵便番号
    address: '横浜市中区日本大通り 1-23-4-567',            // 住所
    telephone: '054-078-7934',                         // 電話番号
    mobile: '090-2710-1564',                           // モバイル
    email: 'miyata_nana@example.com'                   // 電子メール オプション
};

// 医師
var simpleCreator = {
    id: '201605',                                      // 施設で付番されている医師のId
    idType: 'facility',                                // 施設固有のIdであることを示す
    kanjiName: '青山 慶二',                             // 医師名
    prefix: 'Professor',                               // 肩書き等 オプション
    degree: 'MD/PhD',                                  // 学位 オプション
    facilityId: 'JPN012345678901',                     // 医療連携等のために施設に振られているId
    facilityIdType: 'JMARI',                           // 上記施設IDを発番している体系 MML0027(ca|insurance|monbusho|JMARI|OID)から選ぶ
    facilityName: 'シルク内科',                          // 施設名
    facilityZipCode: '231-0023',                       // 施設郵便番号
    facilityAddress: '横浜市中区山下町1番地 8-9-01',      // 施設住所
    facilityPhone: '045-571-6572',                     // 施設電話番号
    departmentId: '01',                                // 医科用:MML0028 歯科用:MML0030 から選ぶ
    departmentIdType: 'medical',                       // 医科用の診療科コード:medical 歯科用の診療科コード:dental を指定 MML0029(medical|dental|facility)から選ぶ
    departmentName: '第一内科',                         // 診療科名
    license: 'doctor'                                  // 医療資格 MML0026から選ぶ
};

// 処方せん
var simplePrescription = {
    medication: [
        {
            issuedTo: 'external',
            medicine: 'マーズレン S 顆粒',                    // 処方薬
            medicineCode: '612320261',                      // 処方薬
            medicineCodeSystem: 'YJ',                       // コード体系
            dose: 1,                                        // 1回の量
            doseUnit: 'g',                                  // 単位
            frequencyPerDay: 2,                             // 1日の内服回数
            startDate: utils.nowAsDate(),                   // 服薬開始日 YYYY-MM-DD
            duration: 7,                                    // 7日分
            instruction: '内服2回 朝夜食後に',                 // 用法
            PRN: false,                                     // 頓用=false
            brandSubstitutionPermitted: true,               // ジェネリック可
            longTerm: false                                 // 臨時処方
        },
        {
            issuedTo: 'external',
            medicine: 'メトリジン錠 2 mg',
            medicineCode: '612160027',
            medicineCodeSystem: 'YJ',
            dose: 2,                                        // 1回の量
            doseUnit: '錠',                                 // 単位
            frequencyPerDay: 2,                             // 1日の内服回数
            startDate: utils.nowAsDate(),                   // 服薬開始日
            duration: 14,                                   // 14日分
            instruction: '内服2回 朝夜食後に',                 // 用法
            PRN: false,                                     // 頓用=false
            brandSubstitutionPermitted: false,              // ジェネリック
            longTerm: true                                  // 長期処方
        }
    ]
};
```

サーバーは受け取ったデータをMML4.0形式に変換しレスポンスします。このXMLインスタンスを1000年プロジェクトに送信します。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Mml createDate="2016-05-21T17:07:52"
  xmlns="http://www.medxml.net/MML/v4"
  xmlns:mml="http://www.medxml.net/MML/v4"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mmlCm="http://www.medxml.net/MML/v4/SharedComponent/Common/1.0"
  xmlns:mmlNm="http://www.medxml.net/MML/v4/SharedComponent/Name/1.0"
  xmlns:mmlFc="http://www.medxml.net/MML/v4/SharedComponent/Facility/1.0"
  xmlns:mmlDp="http://www.medxml.net/MML/v4/SharedComponent/Department/1.0"
  xmlns:mmlAd="http://www.medxml.net/MML/v4/SharedComponent/Address/1.0"
  xmlns:mmlPh="http://www.medxml.net/MML/v4/SharedComponent/Phone/1.0"
  xmlns:mmlPsi="http://www.medxml.net/MML/v4/SharedComponent/PersonalizedInfo/1.0"
  xmlns:mmlCi="http://www.medxml.net/MML/v4/SharedComponent/CreatorInfo/1.0"
  xmlns:mmlSc="http://www.medxml.net/MML/v4/SharedComponent/Security/1.0"
  xmlns:mmlPi="http://www.medxml.net/MML/v4/ContentModule/PatientInfo/1.0"
  xmlns:mmlBc="http://www.medxml.net/MML/v4/ContentModule/BaseClinic/1.0"
  xmlns:mmlFcl="http://www.medxml.net/MML/v4/ContentModule/FirstClinic/1.0"
  xmlns:mmlHi="http://www.medxml.net/MML/v4/ContentModule/HealthInsurance/1.1"
  xmlns:mmlLs="http://www.medxml.net/MML/v4/ContentModule/Lifestyle/1.0"
  xmlns:mmlPc="http://www.medxml.net/MML/v4/ContentModule/ProgressCourse/1.0"
  xmlns:mmlRd="http://www.medxml.net/MML/v4/ContentModule/RegisteredDiagnosis/1.0"
  xmlns:mmlSg="http://www.medxml.net/MML/v4/ContentModule/Surgery/1.0"
  xmlns:mmlSm="http://www.medxml.net/MML/v4/ContentModule/Summary/1.0"
  xmlns:mmlLb="http://www.medxml.net/MML/v4/ContentModule/test/1.0"
  xmlns:mmlRp="http://www.medxml.net/MML/v4/ContentModule/report/1.0"
  xmlns:mmlRe="http://www.medxml.net/MML/v4/ContentModule/Referral/1.0"
  xmlns:mmlVs="http://www.medxml.net/MML/v4/ContentModule/VitalSign/1.0"
  xmlns:mmlFs="http://www.medxml.net/MML/v4/ContentModule/FlowSheet/1.0"
  xmlns:mmlPs="http://www.medxml.net/MML/v4/ContentModule/Prescription/1.0"
  xmlns:mmlInj="http://www.medxml.net/MML/v4/ContentModule/Injection/1.0"
  xmlns:mmlHd="http://www.medxml.net/MML/v4/ContentModule/Hemodialysis/1.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://www.medxml.net/MML/v4/mml.xsd">
  <MmlHeader>
    <mmlCi:CreatorInfo>
      <mmlPsi:PersonalizedInfo>
        <mmlCm:Id mmlCm:type="facility" mmlCm:tableId="JPN012345678901">201605</mmlCm:Id>
        <mmlPsi:personName>
          <mmlNm:Name mmlNm:repCode="I" mmlNm:tableId="MML0025">
            <mmlNm:fullname>青山 慶二</mmlNm:fullname>
            <mmlNm:prefix>Professor</mmlNm:prefix>
            <mmlNm:degree>MD/PhD</mmlNm:degree>
          </mmlNm:Name>
        </mmlPsi:personName>
        <mmlFc:Facility>
          <mmlFc:name mmlFc:repCode="I" mmlFc:tableId="MML0025">シルク内科</mmlFc:name>
          <mmlCm:Id mmlCm:type="JMARI" mmlCm:tableId="MML0027">JPN012345678901</mmlCm:Id>
        </mmlFc:Facility>
        <mmlDp:Department>
          <mmlDp:name mmlDp:repCode="I" mmlDp:tableId="MML0025">第一内科</mmlDp:name>
          <mmlCm:Id mmlCm:type="medical" mmlCm:tableId="MML0029">01</mmlCm:Id>
        </mmlDp:Department>
        <mmlPsi:addresses>
          <mmlAd:Address mmlAd:repCode="I" mmlAd:addressClass="business" mmlAd:tableId="MML0025">
            <mmlAd:full>横浜市中区山下町1番地 8-9-01</mmlAd:full>
            <mmlAd:zip>231-0023</mmlAd:zip>
          </mmlAd:Address>
        </mmlPsi:addresses>
        <mmlPsi:phones>
          <mmlPh:Phone mmlPh:telEquipType="PH">
            <mmlPh:full>045-571-6572</mmlPh:full>
          </mmlPh:Phone>
        </mmlPsi:phones>
      </mmlPsi:PersonalizedInfo>
      <mmlCi:creatorLicense mmlCi:tableId="MML0026">doctor</mmlCi:creatorLicense>
    </mmlCi:CreatorInfo>
    <masterId>
      <mmlCm:Id mmlCm:type="facility" mmlCm:tableId="JPN012345678901">0516</mmlCm:Id>
    </masterId>
    <toc>
      <tocItem>http://www.w3.org/1999/xhtml</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Common/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Name/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Facility/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Department/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Address/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Phone/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/PersonalizedInfo/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/CreatorInfo/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Security/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/PatientInfo/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/BaseClinic/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/FirstClinic/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/HealthInsurance/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Lifestyle/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/ProgressCourse/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/RegisteredDiagnosis/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Surgery/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Summary/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/test/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/report/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Referral/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/VitalSign/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/FlowSheet/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Prescription/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Injection/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Hemodialysis/1.0</tocItem>
    </toc>
  </MmlHeader>
  <MmlBody>
    <MmlModuleItem>
      <docInfo contentModuleType="prescription">
        <securityLevel>
          <accessRight permit="all">
            <mmlSc:facility>
              <mmlSc:facilityName mmlSc:facilityCode="creator" mmlSc:tableId="MML0035">記載者施設</mmlSc:facilityName>
            </mmlSc:facility>
          </accessRight>
          <accessRight permit="read">
            <mmlSc:facility>
              <mmlSc:facilityName mmlSc:facilityCode="experience" mmlSc:tableId="MML0035">診療歴のある施設</mmlSc:facilityName>
            </mmlSc:facility>
            <mmlSc:person>
              <mmlSc:personName mmlSc:personCode="patient" mmlSc:tableId="MML0036" mmlSc:personId="0516" mmlSc:personIdType="dolphinUserId_2001-10-03">宮田 奈々</mmlSc:personName>
            </mmlSc:person>
          </accessRight>
        </securityLevel>
        <title generationPurpose="record">prescription</title>
        <docId>
          <uid>0efb4744-a656-4eaf-a8b0-228d4833572c</uid>
        </docId>
        <confirmDate>2016-05-21T17:07:52</confirmDate>
        <mmlCi:CreatorInfo>
          <mmlPsi:PersonalizedInfo>
            <mmlCm:Id mmlCm:type="facility" mmlCm:tableId="JPN012345678901">201605</mmlCm:Id>
            <mmlPsi:personName>
              <mmlNm:Name mmlNm:repCode="I" mmlNm:tableId="MML0025">
                <mmlNm:fullname>青山 慶二</mmlNm:fullname>
                <mmlNm:prefix>Professor</mmlNm:prefix>
                <mmlNm:degree>MD/PhD</mmlNm:degree>
              </mmlNm:Name>
            </mmlPsi:personName>
            <mmlFc:Facility>
              <mmlFc:name mmlFc:repCode="I" mmlFc:tableId="MML0025">シルク内科</mmlFc:name>
              <mmlCm:Id mmlCm:type="JMARI" mmlCm:tableId="MML0027">JPN012345678901</mmlCm:Id>
            </mmlFc:Facility>
            <mmlDp:Department>
              <mmlDp:name mmlDp:repCode="I" mmlDp:tableId="MML0025">第一内科</mmlDp:name>
              <mmlCm:Id mmlCm:type="medical" mmlCm:tableId="MML0029">01</mmlCm:Id>
            </mmlDp:Department>
            <mmlPsi:addresses>
              <mmlAd:Address mmlAd:repCode="I" mmlAd:addressClass="business" mmlAd:tableId="MML0025">
                <mmlAd:full>横浜市中区山下町1番地 8-9-01</mmlAd:full>
                <mmlAd:zip>231-0023</mmlAd:zip>
              </mmlAd:Address>
            </mmlPsi:addresses>
            <mmlPsi:phones>
              <mmlPh:Phone mmlPh:telEquipType="PH">
                <mmlPh:full>045-571-6572</mmlPh:full>
              </mmlPh:Phone>
            </mmlPsi:phones>
          </mmlPsi:PersonalizedInfo>
          <mmlCi:creatorLicense mmlCi:tableId="MML0026">doctor</mmlCi:creatorLicense>
        </mmlCi:CreatorInfo>
        <extRefs></extRefs>
      </docInfo>
      <content>
        <mmlPs:PrescriptionModule>
          <mmlPs:issuedTo>external</mmlPs:issuedTo>
          <mmlPs:medication>
            <mmlPs:medicine>
              <mmlPs:name>マーズレン S 顆粒</mmlPs:name>
              <mmlPs:code mmlPs:system="YJ">612320261</mmlPs:code>
            </mmlPs:medicine>
            <mmlPs:dose>1</mmlPs:dose>
            <mmlPs:doseUnit>g</mmlPs:doseUnit>
            <mmlPs:frequencyPerDay>2</mmlPs:frequencyPerDay>
            <mmlPs:startDate>2016-05-21</mmlPs:startDate>
            <mmlPs:duration>7</mmlPs:duration>
            <mmlPs:instruction>内服2回 朝夜食後に</mmlPs:instruction>
            <mmlPs:PRN>false</mmlPs:PRN>
            <mmlPs:brandSubstitutionPermitted>true</mmlPs:brandSubstitutionPermitted>
            <mmlPs:longTerm>false</mmlPs:longTerm>
          </mmlPs:medication>
          <mmlPs:medication>
            <mmlPs:medicine>
              <mmlPs:name>メトリジン錠 2 mg</mmlPs:name>
              <mmlPs:code mmlPs:system="YJ">612160027</mmlPs:code>
            </mmlPs:medicine>
            <mmlPs:dose>2</mmlPs:dose>
            <mmlPs:doseUnit>錠</mmlPs:doseUnit>
            <mmlPs:frequencyPerDay>2</mmlPs:frequencyPerDay>
            <mmlPs:startDate>2016-05-21</mmlPs:startDate>
            <mmlPs:duration>14</mmlPs:duration>
            <mmlPs:instruction>内服2回 朝夜食後に</mmlPs:instruction>
            <mmlPs:PRN>false</mmlPs:PRN>
            <mmlPs:brandSubstitutionPermitted>false</mmlPs:brandSubstitutionPermitted>
            <mmlPs:longTerm>true</mmlPs:longTerm>
          </mmlPs:medication>
        </mmlPs:PrescriptionModule>
      </content>
    </MmlModuleItem>
  </MmlBody>
</Mml>
```

### MML4.0 検査

* 検査についても下記のような単純なJSONデータをポストします。

```javascript
var simpleTest = {
    registId: registId,                             // 検査Id
    registTime: registTime,                         // 受付日時
    reportTime: reportTime,                         // 報告日時
    reportStatusCode: 'final',                      // 報告状態 コード  mmlLb0001
    reportStatusName: '最終報告',                    // 報告状態
    codeSystem: 'YBS_2016',                         // 検査コード体系名
    facilityName: simpleCreator.facilityName,       // 検査依頼施設
    facilityId: simpleCreator.facilityId,           // 検査依頼施設
    facilityIdType: 'JMARI',                        // 検査依頼施設
    labCenter: {
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
    },
    testItem: []                                     // テスト項目と結果値simpleItemが入っている
};

// テスト項目と結果値
var simpleItem = {
    spcCode: '',                        // 検体コード
    spcName: '',                        // 検体名
    testCode: '',                       // テスト項目コード
    testName: '',                       // テスト項目名
    testResult: '',                     // 結果値
    unit: '',                           // 単位
    low: '',                            // 下限値
    up: '',                             // 上限値
    out: '',                            // フラグ
    memoCode: '',                       // メモコード
    memo: ''                            // メモ
};
```

検査のレスポンス

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Mml createDate="2016-05-21T16:34:40"
  xmlns="http://www.medxml.net/MML/v4"
  xmlns:mml="http://www.medxml.net/MML/v4"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mmlCm="http://www.medxml.net/MML/v4/SharedComponent/Common/1.0"
  xmlns:mmlNm="http://www.medxml.net/MML/v4/SharedComponent/Name/1.0"
  xmlns:mmlFc="http://www.medxml.net/MML/v4/SharedComponent/Facility/1.0"
  xmlns:mmlDp="http://www.medxml.net/MML/v4/SharedComponent/Department/1.0"
  xmlns:mmlAd="http://www.medxml.net/MML/v4/SharedComponent/Address/1.0"
  xmlns:mmlPh="http://www.medxml.net/MML/v4/SharedComponent/Phone/1.0"
  xmlns:mmlPsi="http://www.medxml.net/MML/v4/SharedComponent/PersonalizedInfo/1.0"
  xmlns:mmlCi="http://www.medxml.net/MML/v4/SharedComponent/CreatorInfo/1.0"
  xmlns:mmlSc="http://www.medxml.net/MML/v4/SharedComponent/Security/1.0"
  xmlns:mmlPi="http://www.medxml.net/MML/v4/ContentModule/PatientInfo/1.0"
  xmlns:mmlBc="http://www.medxml.net/MML/v4/ContentModule/BaseClinic/1.0"
  xmlns:mmlFcl="http://www.medxml.net/MML/v4/ContentModule/FirstClinic/1.0"
  xmlns:mmlHi="http://www.medxml.net/MML/v4/ContentModule/HealthInsurance/1.1"
  xmlns:mmlLs="http://www.medxml.net/MML/v4/ContentModule/Lifestyle/1.0"
  xmlns:mmlPc="http://www.medxml.net/MML/v4/ContentModule/ProgressCourse/1.0"
  xmlns:mmlRd="http://www.medxml.net/MML/v4/ContentModule/RegisteredDiagnosis/1.0"
  xmlns:mmlSg="http://www.medxml.net/MML/v4/ContentModule/Surgery/1.0"
  xmlns:mmlSm="http://www.medxml.net/MML/v4/ContentModule/Summary/1.0"
  xmlns:mmlLb="http://www.medxml.net/MML/v4/ContentModule/test/1.0"
  xmlns:mmlRp="http://www.medxml.net/MML/v4/ContentModule/report/1.0"
  xmlns:mmlRe="http://www.medxml.net/MML/v4/ContentModule/Referral/1.0"
  xmlns:mmlVs="http://www.medxml.net/MML/v4/ContentModule/VitalSign/1.0"
  xmlns:mmlFs="http://www.medxml.net/MML/v4/ContentModule/FlowSheet/1.0"
  xmlns:mmlPs="http://www.medxml.net/MML/v4/ContentModule/Prescription/1.0"
  xmlns:mmlInj="http://www.medxml.net/MML/v4/ContentModule/Injection/1.0"
  xmlns:mmlHd="http://www.medxml.net/MML/v4/ContentModule/Hemodialysis/1.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://www.medxml.net/MML/v4/mml.xsd">
  <MmlHeader>
    <mmlCi:CreatorInfo>
      <mmlPsi:PersonalizedInfo>
        <mmlCm:Id mmlCm:type="facility" mmlCm:tableId="JPN012345678901">201605</mmlCm:Id>
        <mmlPsi:personName>
          <mmlNm:Name mmlNm:repCode="I" mmlNm:tableId="MML0025">
            <mmlNm:fullname>青山 慶二</mmlNm:fullname>
            <mmlNm:prefix>Professor</mmlNm:prefix>
            <mmlNm:degree>MD/PhD</mmlNm:degree>
          </mmlNm:Name>
        </mmlPsi:personName>
        <mmlFc:Facility>
          <mmlFc:name mmlFc:repCode="I" mmlFc:tableId="MML0025">シルク内科</mmlFc:name>
          <mmlCm:Id mmlCm:type="JMARI" mmlCm:tableId="MML0027">JPN012345678901</mmlCm:Id>
        </mmlFc:Facility>
        <mmlDp:Department>
          <mmlDp:name mmlDp:repCode="I" mmlDp:tableId="MML0025">第一内科</mmlDp:name>
          <mmlCm:Id mmlCm:type="medical" mmlCm:tableId="MML0029">01</mmlCm:Id>
        </mmlDp:Department>
        <mmlPsi:addresses>
          <mmlAd:Address mmlAd:repCode="I" mmlAd:addressClass="business" mmlAd:tableId="MML0025">
            <mmlAd:full>横浜市中区山下町1番地 8-9-01</mmlAd:full>
            <mmlAd:zip>231-0023</mmlAd:zip>
          </mmlAd:Address>
        </mmlPsi:addresses>
        <mmlPsi:phones>
          <mmlPh:Phone mmlPh:telEquipType="PH">
            <mmlPh:full>045-571-6572</mmlPh:full>
          </mmlPh:Phone>
        </mmlPsi:phones>
      </mmlPsi:PersonalizedInfo>
      <mmlCi:creatorLicense mmlCi:tableId="MML0026">doctor</mmlCi:creatorLicense>
    </mmlCi:CreatorInfo>
    <masterId>
      <mmlCm:Id mmlCm:type="facility" mmlCm:tableId="JPN012345678901">0516</mmlCm:Id>
    </masterId>
    <toc>
      <tocItem>http://www.w3.org/1999/xhtml</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Common/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Name/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Facility/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Department/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Address/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Phone/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/PersonalizedInfo/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/CreatorInfo/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/SharedComponent/Security/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/PatientInfo/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/BaseClinic/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/FirstClinic/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/HealthInsurance/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Lifestyle/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/ProgressCourse/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/RegisteredDiagnosis/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Surgery/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Summary/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/test/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/report/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Referral/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/VitalSign/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/FlowSheet/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Prescription/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Injection/1.0</tocItem>
      <tocItem>http://www.medxml.net/MML/v4/ContentModule/Hemodialysis/1.0</tocItem>
    </toc>
  </MmlHeader>
  <MmlBody>
    <MmlModuleItem>
      <docInfo contentModuleType="test">
        <securityLevel>
          <accessRight permit="all">
            <mmlSc:facility>
              <mmlSc:facilityName mmlSc:facilityCode="creator" mmlSc:tableId="MML0035">記載者施設</mmlSc:facilityName>
            </mmlSc:facility>
          </accessRight>
          <accessRight permit="read">
            <mmlSc:facility>
              <mmlSc:facilityName mmlSc:facilityCode="experience" mmlSc:tableId="MML0035">診療歴のある施設</mmlSc:facilityName>
            </mmlSc:facility>
            <mmlSc:person>
              <mmlSc:personName mmlSc:personCode="patient" mmlSc:tableId="MML0036" mmlSc:personId="0516" mmlSc:personIdType="dolphinUserId_2001-10-03">宮田 奈々</mmlSc:personName>
            </mmlSc:person>
          </accessRight>
        </securityLevel>
        <title generationPurpose="record">test</title>
        <docId>
          <uid>c25bbddd-99d3-41e6-a923-ec2a3cba4442</uid>
        </docId>
        <confirmDate>2016-05-21T16:34:40</confirmDate>
        <mmlCi:CreatorInfo>
          <mmlPsi:PersonalizedInfo>
            <mmlCm:Id mmlCm:type="facility" mmlCm:tableId="1.2.3.4.5.6.7890.1.2">303030</mmlCm:Id>
            <mmlPsi:personName>
              <mmlNm:Name mmlNm:repCode="I" mmlNm:tableId="MML0025">
                <mmlNm:fullname>石山 由美子</mmlNm:fullname>
              </mmlNm:Name>
            </mmlPsi:personName>
            <mmlFc:Facility>
              <mmlFc:name mmlFc:repCode="I" mmlFc:tableId="MML0025">ベイスターズ・ラボ</mmlFc:name>
              <mmlCm:Id mmlCm:type="OID" mmlCm:tableId="MML0027">1.2.3.4.5.6.7890.1.2</mmlCm:Id>
            </mmlFc:Facility>
            <mmlPsi:addresses>
              <mmlAd:Address mmlAd:repCode="I" mmlAd:addressClass="business" mmlAd:tableId="MML0025">
                <mmlAd:full>横浜市中区スタジアム付近 1-5</mmlAd:full>
                <mmlAd:zip>231-0000</mmlAd:zip>
              </mmlAd:Address>
            </mmlPsi:addresses>
            <mmlPsi:phones>
              <mmlPh:Phone mmlPh:telEquipType="PH">
                <mmlPh:full>045-000-0072</mmlPh:full>
              </mmlPh:Phone>
            </mmlPsi:phones>
          </mmlPsi:PersonalizedInfo>
          <mmlCi:creatorLicense mmlCi:tableId="MML0026">lab</mmlCi:creatorLicense>
        </mmlCi:CreatorInfo>
        <extRefs></extRefs>
      </docInfo>
      <content>
        <mmlLb:TestModule>
          <mmlLb:information mmlLb:registId="79efa525-41cc-4fd2-8af6-1361cd0bcb74" mmlLb:registTime="2016-05-21T16:34:40" mmlLb:reportTime="2016-05-21T16:34:40">
            <mmlLb:reportStatus mmlLb:statusCode="最終報告" mmlLb:statusCodeId="mmlLb0001">final</mmlLb:reportStatus>
            <mmlLb:facility mmlLb:facilityCode="JPN012345678901" mmlLb:facilityCodeId="JMARI">シルク内科</mmlLb:facility>
            <mmlLb:laboratoryCenter mmlLb:centerCode="1.2.3.4.5.6.7890.1.2" mmlLb:centerCodeId="OID">ベイスターズ・ラボ</mmlLb:laboratoryCenter>
          </mmlLb:information>
          <mmlLb:laboTest>
            <mmlLb:specimen>
              <mmlLb:specimenName mmlLb:spCode="02" mmlLb:spCodeId="YBS_2016">血清</mmlLb:specimenName>
            </mmlLb:specimen>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000210000200" mmlLb:itCodeId="YBS_2016">総蛋白</mmlLb:itemName>
              <mmlLb:value>10.2</mmlLb:value>
              <mmlLb:numValue mmlLb:up="8.3" mmlLb:low="6.7" mmlLb:out="N">10.2</mmlLb:numValue>
              <mmlLb:unit>G/DL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="001150000200" mmlLb:itCodeId="YBS_2016">アルブミン:BCG法</mmlLb:itemName>
              <mmlLb:value>3.5</mmlLb:value>
              <mmlLb:numValue mmlLb:up="5.3" mmlLb:low="3.8" mmlLb:out="N">3.5</mmlLb:numValue>
              <mmlLb:unit>G/DL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000090000200" mmlLb:itCodeId="YBS_2016">AST(GOT)</mmlLb:itemName>
              <mmlLb:value>25</mmlLb:value>
              <mmlLb:numValue mmlLb:up="40" mmlLb:low="10" mmlLb:out="N">25</mmlLb:numValue>
              <mmlLb:unit>IU/L</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000100000200" mmlLb:itCodeId="YBS_2016">ALT(GPT)</mmlLb:itemName>
              <mmlLb:value>4</mmlLb:value>
              <mmlLb:numValue mmlLb:up="45" mmlLb:low="5" mmlLb:out="L">4</mmlLb:numValue>
              <mmlLb:unit>IU/L</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000120000200" mmlLb:itCodeId="YBS_2016">LD(LDH)</mmlLb:itemName>
              <mmlLb:value>123</mmlLb:value>
              <mmlLb:numValue mmlLb:up="240" mmlLb:low="120" mmlLb:out="N">123</mmlLb:numValue>
              <mmlLb:unit>IU/L</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000320000200" mmlLb:itCodeId="YBS_2016">クレアチニン</mmlLb:itemName>
              <mmlLb:value>0.69</mmlLb:value>
              <mmlLb:numValue mmlLb:up="1.04" mmlLb:low="0.61" mmlLb:out="N">0.69</mmlLb:numValue>
              <mmlLb:unit>MG/DL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000350000200" mmlLb:itCodeId="YBS_2016">尿素窒素</mmlLb:itemName>
              <mmlLb:value>12.4</mmlLb:value>
              <mmlLb:numValue mmlLb:up="23" mmlLb:low="8" mmlLb:out="N">12.4</mmlLb:numValue>
              <mmlLb:unit>MG/DL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000470000200" mmlLb:itCodeId="YBS_2016">ナトリウム</mmlLb:itemName>
              <mmlLb:value>142</mmlLb:value>
              <mmlLb:numValue mmlLb:up="147" mmlLb:low="137" mmlLb:out="N">142</mmlLb:numValue>
              <mmlLb:unit>MEQ/L</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000480000200" mmlLb:itCodeId="YBS_2016">カリウム</mmlLb:itemName>
              <mmlLb:value>3.1</mmlLb:value>
              <mmlLb:numValue mmlLb:up="5.0" mmlLb:low="3.5" mmlLb:out="N">3.1</mmlLb:numValue>
              <mmlLb:unit>MEQ/L</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000490000200" mmlLb:itCodeId="YBS_2016">クロール</mmlLb:itemName>
              <mmlLb:value>109</mmlLb:value>
              <mmlLb:numValue mmlLb:up="108" mmlLb:low="98" mmlLb:out="H">109</mmlLb:numValue>
              <mmlLb:unit>MEQ/L</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="000010000200" mmlLb:itCodeId="YBS_2016">総ビルリビン</mmlLb:itemName>
              <mmlLb:value>0.8</mmlLb:value>
              <mmlLb:numValue mmlLb:up="1.1" mmlLb:low="0.2" mmlLb:out="N">0.8</mmlLb:numValue>
              <mmlLb:unit>MG/DL</mmlLb:unit>
              <mmlLb:itemMemo mmlLb:imCodeName="YBS_2016" mmlLb:imCode="E01">参考値です</mmlLb:itemMemo>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="095700000200" mmlLb:itCodeId="YBS_2016">梅毒定性:RPR法</mmlLb:itemName>
              <mmlLb:value>(-)</mmlLb:value>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="002280000200" mmlLb:itCodeId="YBS_2016">HBs抗原:凝集法</mmlLb:itemName>
              <mmlLb:value>8未満</mmlLb:value>
              <mmlLb:numValue mmlLb:up="8" mmlLb:out="N">8未満</mmlLb:numValue>
              <mmlLb:unit>倍</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="024910000201" mmlLb:itCodeId="YBS_2016">HCV抗体２CLIA</mmlLb:itemName>
              <mmlLb:value>陰性</mmlLb:value>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="024910000202" mmlLb:itCodeId="YBS_2016">HCV抗体２CLIA S/CO</mmlLb:itemName>
              <mmlLb:value>0.14</mmlLb:value>
              <mmlLb:numValue mmlLb:up="1.00" mmlLb:out="N">0.14</mmlLb:numValue>
              <mmlLb:unit>S/CO</mmlLb:unit>
            </mmlLb:item>
          </mmlLb:laboTest>
          <mmlLb:laboTest>
            <mmlLb:specimen>
              <mmlLb:specimenName mmlLb:spCode="006" mmlLb:spCodeId="YBS_2016">血算用</mmlLb:specimenName>
            </mmlLb:specimen>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005010000600" mmlLb:itCodeId="YBS_2016">白血球数</mmlLb:itemName>
              <mmlLb:value>6200</mmlLb:value>
              <mmlLb:numValue mmlLb:up="9000" mmlLb:low="3300" mmlLb:out="N">6200</mmlLb:numValue>
              <mmlLb:unit>/MCL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005020000600" mmlLb:itCodeId="YBS_2016">赤血球数</mmlLb:itemName>
              <mmlLb:value>442</mmlLb:value>
              <mmlLb:numValue mmlLb:up="570" mmlLb:low="430" mmlLb:out="N">442</mmlLb:numValue>
              <mmlLb:unit>*4/MCL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005030000600" mmlLb:itCodeId="YBS_2016">ヘモグロビン</mmlLb:itemName>
              <mmlLb:value>13.5</mmlLb:value>
              <mmlLb:numValue mmlLb:up="17.5" mmlLb:low="13.5" mmlLb:out="N">13.5</mmlLb:numValue>
              <mmlLb:unit>G/DL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005040000600" mmlLb:itCodeId="YBS_2016">へマトリックス</mmlLb:itemName>
              <mmlLb:value>40.8</mmlLb:value>
              <mmlLb:numValue mmlLb:up="52.4" mmlLb:low="39.7" mmlLb:out="N">40.8</mmlLb:numValue>
              <mmlLb:unit>%</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005540000600" mmlLb:itCodeId="YBS_2016">血小板数</mmlLb:itemName>
              <mmlLb:value>22.2</mmlLb:value>
              <mmlLb:numValue mmlLb:up="34.0" mmlLb:low="14.0" mmlLb:out="N">22.2</mmlLb:numValue>
              <mmlLb:unit>*4/MCL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005050000600" mmlLb:itCodeId="YBS_2016">MCV</mmlLb:itemName>
              <mmlLb:value>91</mmlLb:value>
              <mmlLb:numValue mmlLb:up="102" mmlLb:low="85" mmlLb:out="N">91</mmlLb:numValue>
              <mmlLb:unit>FL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005060000600" mmlLb:itCodeId="YBS_2016">MCH</mmlLb:itemName>
              <mmlLb:value>29.6</mmlLb:value>
              <mmlLb:numValue mmlLb:up="34.0" mmlLb:low="28.0" mmlLb:out="N">29.6</mmlLb:numValue>
              <mmlLb:unit>PG</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005070000600" mmlLb:itCodeId="YBS_2016">MCHC</mmlLb:itemName>
              <mmlLb:value>32.4</mmlLb:value>
              <mmlLb:numValue mmlLb:up="35.1" mmlLb:low="30.2" mmlLb:out="N">32.4</mmlLb:numValue>
              <mmlLb:unit>%</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="004620000600" mmlLb:itCodeId="YBS_2016">ABO式血液型</mmlLb:itemName>
              <mmlLb:value>(A)</mmlLb:value>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="004610000600" mmlLb:itCodeId="YBS_2016">Rho(D)因子</mmlLb:itemName>
              <mmlLb:value>(+)</mmlLb:value>
            </mmlLb:item>
          </mmlLb:laboTest>
          <mmlLb:laboTest>
            <mmlLb:specimen>
              <mmlLb:specimenName mmlLb:spCode="007" mmlLb:spCodeId="YBS_2016">凝固検査用</mmlLb:specimenName>
            </mmlLb:specimen>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005560000701" mmlLb:itCodeId="YBS_2016">APTT秒</mmlLb:itemName>
              <mmlLb:value>25.0</mmlLb:value>
              <mmlLb:numValue mmlLb:up="42.5" mmlLb:low="23.5" mmlLb:out="N">25.0</mmlLb:numValue>
              <mmlLb:unit>SEC</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="005560000702" mmlLb:itCodeId="YBS_2016">APTTコントロール</mmlLb:itemName>
              <mmlLb:value>29.9</mmlLb:value>
              <mmlLb:numValue>29.9</mmlLb:numValue>
              <mmlLb:unit>SEC</mmlLb:unit>
            </mmlLb:item>
          </mmlLb:laboTest>
          <mmlLb:laboTest>
            <mmlLb:specimen>
              <mmlLb:specimenName mmlLb:spCode="003" mmlLb:spCodeId="YBS_2016">尿</mmlLb:specimenName>
            </mmlLb:specimen>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="006010000300" mmlLb:itCodeId="YBS_2016">尿蛋白定性</mmlLb:itemName>
              <mmlLb:value>(-)</mmlLb:value>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="006020000301" mmlLb:itCodeId="YBS_2016">尿蛋白定量濃度</mmlLb:itemName>
              <mmlLb:value>10以下</mmlLb:value>
              <mmlLb:numValue mmlLb:up="10以下" mmlLb:out="N">10以下</mmlLb:numValue>
              <mmlLb:unit>MG/DL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="006020000302" mmlLb:itCodeId="YBS_2016">尿蛋白定量一日量</mmlLb:itemName>
              <mmlLb:value>20</mmlLb:value>
              <mmlLb:numValue mmlLb:up="60" mmlLb:low="20" mmlLb:out="N">20</mmlLb:numValue>
              <mmlLb:unit>MG/DAY</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="006050000300" mmlLb:itCodeId="YBS_2016">尿糖定性</mmlLb:itemName>
              <mmlLb:value>(-)</mmlLb:value>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="006390000300" mmlLb:itCodeId="YBS_2016">尿比重</mmlLb:itemName>
              <mmlLb:value>1.024</mmlLb:value>
              <mmlLb:numValue mmlLb:up="1.030" mmlLb:low="1.002" mmlLb:out="N">1.024</mmlLb:numValue>
              <mmlLb:unit>g/mL</mmlLb:unit>
            </mmlLb:item>
            <mmlLb:item>
              <mmlLb:itemName mmlLb:itCode="006370000300" mmlLb:itCodeId="YBS_2016">尿PH</mmlLb:itemName>
              <mmlLb:value>8.5</mmlLb:value>
            </mmlLb:item>
          </mmlLb:laboTest>
        </mmlLb:TestModule>
      </content>
    </MmlModuleItem>
  </MmlBody>
</Mml>
```

### 病名

* 病名は最も単純です。

```javascript
var simpleDiagnosis = {
    diagnosis: 'colon carcinoid',
    code: 'C189-.006',
    system: 'ICD10',
    category: 'mainDiagnosis',
    startDate: startDate,
    endDate: endDate,
    outcome: 'fullyRecovered'
};
```

レスポンス（ヘッダーとdocInfoを除いています）

```xml
<mmlRd:RegisteredDiagnosisModule>
    <mmlRd:diagnosis mmlRd:code="C189-.006" mmlRd:system="ICD10">colon carcinoid</mmlRd:diagnosis>
    <mmlRd:categories>
        <mmlRd:category mmlRd:tableId="MML0012">mainDiagnosis</mmlRd:category>
    </mmlRd:categories>
    <mmlRd:startDate>2015-09-19</mmlRd:startDate>
    <mmlRd:endDate>2016-05-21</mmlRd:endDate>
    <mmlRd:outcome>fullyRecovered</mmlRd:outcome>
</mmlRd:RegisteredDiagnosisModule>
```

### JSON-RPC 2.0

* サーバーとクライアントの通信は JSON-RPC 2.0 のリモートプロシジャーコールです。
* 電子カルテアプリケーションの実装言語に依存しません。
* サーバーシステムは Node.js です。


### プログラムのテスト手順

* Node.js をインストール
* このリポジトリをクローン
 - git clone git@github.com:mbot-dev/1000_builder.git
 - またはこのページの Clone or download -> Download ZIP をクリック
* クローンしたディレクトリへ移動 （$ cd /path_to/clone_directory）
* npm install
* node app.js（RPC サーバーが起動します）

別のコンソールを立ち上げて

 * クローンしたディレクトリへ移動　（$ cd /path_to/clone_directory）
 * サンプルディレクトリへ移動 ($ cd ./sample）
 * node rpcClient.js


### ポストデータの詳細

サンプルディレクトリ内に JavaScript のオブジェクトリテラルで記述しています。

 * 処方せん prescription.js
 * 検体検査 labTest.js
 * 病名 diagnosis.js


### フィードバック

 * issue 及び pull request を受付ます。
 * 連絡先 このリポジトリのオーナー（mbot-dev）
 * データをセットするには注意点があります。このリポジトリの wiki にポイントを書いて行く予定です。
