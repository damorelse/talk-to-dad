/**
 * TalkWithDad AAC Progressive Web App
 * Legal Content & Disclosures: Terms of Service & Privacy Policy
 *
 * Compliant with:
 * - GDPR (Regulation (EU) 2016/679) & UK GDPR (Privacy by Design & Data Minimization)
 * - CCPA / CPRA (California Consumer Privacy Act / California Privacy Rights Act)
 * - CalOPPA (California Online Privacy Protection Act)
 * - COPPA (Children's Online Privacy Protection Act)
 * - ePrivacy Directive (Zero tracking cookies / strictly local storage)
 * - GitHub Pages Hosting Architecture & Policies
 */

export interface LegalSection {
  id: string;
  title: string;
  titleZh: string;
  contentEn: string[];
  contentZh: string[];
  isImportant?: boolean;
}

export interface LegalDocument {
  id: string;
  title: string;
  titleZh: string;
  subtitle: string;
  subtitleZh: string;
  effectiveDate: string;
  lastUpdated: string;
  summaryPoints: { en: string; zh: string }[];
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  id: 'privacy-policy',
  title: 'Privacy Policy',
  titleZh: '隱私權政策',
  subtitle: 'Zero Data Collection & On-Device Privacy Architecture',
  subtitleZh: '零資料收集與純本機端隱私架構',
  effectiveDate: 'August 26, 2026',
  lastUpdated: 'August 26, 2026',
  summaryPoints: [
    {
      en: 'Zero Personal Data Collected: We do not collect, transmit, store, track, sell, or monetize any of your personal, health, voice, or usage data.',
      zh: '零個人資料收集：我們絕不收集、傳輸、儲存、追蹤、販售或營利您的任何個人、健康、語音或使用資料。',
    },
    {
      en: '100% Local Storage: All AAC cards, custom words, pain map selections, and settings reside exclusively on your local device browser storage (IndexedDB).',
      zh: '100% 本機端儲存：所有 AAC 圖卡、自訂詞彙、疼痛圖譜記錄與設定皆僅儲存在您本機裝置的瀏覽器資料庫（IndexedDB）中。',
    },
    {
      en: 'No Tracking Cookies or Analytics: No third-party trackers, advertising beacons, or telemetry scripts are embedded in this application.',
      zh: '無追蹤 Cookie 或分析工具：本應用程式絕無置入任何第三方追蹤器、廣告標籤或遙測分析腳本。',
    },
    {
      en: 'GitHub Pages Static Hosting: The application is hosted as a static web app on GitHub Pages. GitHub may collect standard server access logs per GitHub Privacy Policy.',
      zh: 'GitHub Pages 靜態代管：本應用程式以靜態網站形式託管於 GitHub Pages。GitHub 可能依其隱私政策記錄標準伺服器連線日誌。',
    },
  ],
  sections: [
    {
      id: 'privacy-overview',
      title: '1. Overview & Privacy by Design Philosophy',
      titleZh: '1. 隱私架構概述與設計隱私理念',
      contentEn: [
        'TalkWithDad ("the App", "we", "us", or "our") is an Augmentative and Alternative Communication (AAC) and speech rehabilitation Progressive Web App designed to assist individuals with speech/language impairments and their caregivers.',
        'We believe privacy is a fundamental human right, especially for vulnerable individuals, stroke survivors, and healthcare patients. The App is engineered following the strictest "Privacy by Design and by Default" principles under Article 25 of the European Union General Data Protection Regulation (GDPR).',
        'The fundamental rule of our technical architecture is simple: WE DO NOT COLLECT, TRANSMIT, PROCESS, RETAIN, OR SELL ANY PERSONAL DATA OR USAGE TELEMETRY. The application runs entirely within your client web browser.',
      ],
      contentZh: [
        'TalkWithDad（「本應用程式」或「我們」）為專為語言障礙者、中風康復者及其照護者所設計之輔助與替代溝通（AAC）及言語復健漸進式網頁應用程式（PWA）。',
        '我們堅信隱私是基本人權，特別是對弱勢群體、中風康復者與醫療照護對象而言更為至關重要。本應用程式嚴格遵循歐盟《一般資料保護規則》（GDPR）第 25 條之「設計隱私與預設隱私（Privacy by Design and by Default）」原則構建。',
        '我們的核心技術架構原則十分明確：我們絕不收集、傳輸、處理、保留或販售任何個人資料或使用遙測數據。本應用程式完全在您的使用者端瀏覽器內本機運行。',
      ],
    },
    {
      id: 'privacy-data-types',
      title: '2. Information Stored Locally on Your Device',
      titleZh: '2. 儲存於您本機裝置之資訊',
      contentEn: [
        'All data generated or customized during your use of TalkWithDad is stored solely on your local device hardware using browser-sandboxed storage technologies (IndexedDB via Dexie.js, localStorage, and CacheStorage):',
        '• AAC Communication Cards & Categories: Custom cards, clinical clues, labels in English/Traditional Chinese, audio recordings, and icon selections.',
        '• Speech & Rehabilitation History: Word finding practice progress, syllable training exercises, and orientation notes.',
        '• Pain Assessment Records: Body silhouette hotspot selections and Wong-Baker FACES pain intensity selections.',
        '• User Preferences & Settings: Speech rate, pitch, selected voice URIs, display theme (dark/light), grid column configurations, and anti-tremor touch debounce timings.',
        'None of this data ever leaves your device or is transmitted to any remote server controlled by us.',
      ],
      contentZh: [
        '您在使用 TalkWithDad 期間所建立或自訂之所有資料，均僅透過瀏覽器沙盒儲存技術（IndexedDB / Dexie.js、localStorage 及 CacheStorage）儲存於您本機裝置之硬體中：',
        '• AAC 溝通圖卡與分類：自訂圖卡、臨床提示、英文/繁體中文標籤、語音錄音與圖示設定。',
        '• 言語復健歷程：找詞練習進度、音節訓練練習與每日定向筆記。',
        '• 疼痛評估記錄：人體輪廓觸控點選擇與 Wong-Baker 臉譜疼痛強度評分。',
        '• 個人偏好與設定：語速、音調、所選語音 URI、深淺色主題、圖卡欄數配置以及防手震觸控防抖時間。',
        '上述任何資料皆絕不會離開您的本機裝置，亦不會傳輸至任何由我們所控制的遠端伺服器。',
      ],
    },
    {
      id: 'privacy-audio-speech',
      title: '3. Audio, Voice & Speech Synthesis Processing',
      titleZh: '3. 音訊、語音與語音合成處理機制',
      contentEn: [
        '• Text-to-Speech (TTS): Speech synthesis is performed directly in your browser using the standard Web Speech API (window.speechSynthesis) and native operating system voices, or Web Audio tone synthesizers. Text content is not sent to external cloud speech APIs by our application.',
        '• Voice & Audio Recordings: If you record custom audio for AAC cards, audio blobs are converted and stored locally in your browser IndexedDB. No audio files are uploaded to any server.',
        '• On-Device Neural/Phonetic Models: Phonetic syllable segmentation, word prediction, and speech trainers execute 100% on-device (via WebAssembly / ONNX Runtime Web) without any network inference calls.',
      ],
      contentZh: [
        '• 文字轉語音（TTS）：語音合成直接在您的瀏覽器內透過標準 Web Speech API（window.speechSynthesis）及作業系統內建語音庫，或 Web Audio 音頻合成器執行。本應用程式絕不會將文字內容傳送至外部雲端語音 API。',
        '• 語音與錄音檔案：若您為 AAC 圖卡錄製自訂語音，該音訊資料將轉換並僅儲存於您瀏覽器的本機 IndexedDB 中，絕不上傳至任何伺服器。',
        '• 本機端神經/語音模型：語音音節切分、詞彙預測與語音練習模組均 100% 在本機端透過 WebAssembly / ONNX Runtime Web 執行，無任何外部網路推論連線。',
      ],
    },
    {
      id: 'privacy-hosting',
      title: '4. GitHub Pages Static Hosting & Server Logs',
      titleZh: '4. GitHub Pages 靜態代管與伺服器日誌說明',
      contentEn: [
        'TalkWithDad is hosted as a static web application on GitHub Pages, a service provided by GitHub, Inc. (a subsidiary of Microsoft Corporation).',
        'When your browser loads the web assets from GitHub Pages, GitHub may automatically collect standard web server access logs (such as your IP address, browser user-agent, operating system, referring URL, and timestamp) for cybersecurity, DDoS mitigation, and service reliability purposes.',
        'Such log processing is governed strictly by GitHub’s Privacy Statement (available at https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement). The developers of TalkWithDad do not receive, control, or analyze individual user IP addresses or access logs from GitHub.',
      ],
      contentZh: [
        'TalkWithDad 係以靜態網頁應用程式形式託管於 GitHub Pages，此服務由 GitHub, Inc.（微軟 Microsoft 旗下子公司）提供。',
        '當您的瀏覽器自 GitHub Pages 載入網頁資源時，GitHub 為維護網路安全、防禦 DDoS 攻擊及維持服務穩定，可能會自動記錄標準伺服器連線日誌（例如您的 IP 位址、瀏覽器 User-Agent、作業系統、參照網址及時間戳記）。',
        '此類伺服器日誌處理完全受 GitHub 隱私權聲明約束（詳見 https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement）。TalkWithDad 開發團隊無法取得、控制或分析來自 GitHub 的個別使用者 IP 位址或連線日誌。',
      ],
    },
    {
      id: 'privacy-google-sheets',
      title: '5. Optional Google Sheets Auto-Sync Feature',
      titleZh: '5. 選用之 Google 試算表自動同步功能說明',
      contentEn: [
        'The App includes an optional Caregiver feature allowing synchronization of custom AAC vocabulary from a published, publicly accessible Google Sheet URL.',
        'If a Caregiver chooses to configure a Google Sheet URL:',
        '1. The browser makes a direct client-side HTTPS GET request to Google servers (docs.google.com) to retrieve the published CSV data.',
        '2. No intermediate proxy servers or third-party relays are used.',
        '3. No authentication credentials, passwords, or personal Google account tokens are collected or stored by TalkWithDad.',
        '4. Google processes the HTTP request under Google’s Privacy Policy (https://policies.google.com/privacy).',
      ],
      contentZh: [
        '本應用程式包含一項選用的照護者功能，允許從已發布且公開的 Google 試算表（Google Sheet）URL 同步自訂 AAC 詞彙。',
        '若照護者選擇設定 Google 試算表 URL：',
        '1. 瀏覽器將直接由使用者端向 Google 伺服器（docs.google.com）發送 HTTPS GET 請求以取得已發布之 CSV 資料。',
        '2. 連線過程中絕不經過任何中介代理伺服器或第三方轉發節點。',
        '3. TalkWithDad 絕不收集或儲存任何身分驗證憑證、密碼或個人 Google 帳號授權 Token。',
        '4. 該網路請求由 Google 依據其 Google 隱私權政策處理（https://policies.google.com/privacy）。',
      ],
    },
    {
      id: 'privacy-cookies',
      title: '6. Cookies, Tracking & Telemetry Policy',
      titleZh: '6. Cookie、追蹤技術與遙測政策',
      contentEn: [
        '• Zero Tracking Cookies: We do NOT use tracking cookies, marketing cookies, third-party analytics (e.g. Google Analytics, Mixpanel), or advertising pixels.',
        '• Strictly Necessary Storage: We use HTML5 LocalStorage and IndexedDB strictly for operational necessity (persisting your AAC vocabulary and settings across sessions).',
        '• Service Worker Caching: A Service Worker (sw.js) caches static application code (HTML, CSS, JS, icons) in your browser CacheStorage to enable 100% offline functionality without network connectivity.',
      ],
      contentZh: [
        '• 零追蹤 Cookie：我們絕不使用任何追蹤 Cookie、行銷 Cookie、第三方分析工具（如 Google Analytics、Mixpanel）或廣告追蹤像素。',
        '• 必要性本機儲存：我們使用 HTML5 LocalStorage 與 IndexedDB 僅限於本機運作之絕對必要用途（在各次使用期間保存您的 AAC 詞彙與設定）。',
        '• Service Worker 快取：Service Worker（sw.js）會在您瀏覽器的 CacheStorage 中快取靜態應用程式程式碼（HTML、CSS、JS、圖示），以實現 100% 完全離線運作功能。',
      ],
    },
    {
      id: 'privacy-global-rights',
      title: '7. Global Privacy Rights & Compliance (GDPR, CCPA/CPRA, CalOPPA, HIPAA)',
      titleZh: '7. 全球隱私權法規遵循（GDPR、CCPA/CPRA、CalOPPA、HIPAA）',
      contentEn: [
        '• European Union / United Kingdom (GDPR / UK GDPR): Because we do not collect personal data, no data processing agreement or international data transfer occurs. You have absolute data sovereignty (Article 17 Right to Erasure, Article 20 Right to Data Portability) by using the built-in "Backup & Restore" export or clearing browser data.',
        '• California Privacy Rights (CCPA / CPRA & CalOPPA): We do not "sell" or "share" consumer Personal Information or Sensitive Personal Information as defined under Cal. Civ. Code § 1798.140. We do not track users across third-party websites.',
        '• Children’s Privacy (COPPA): The App is fully compliant with COPPA as no personal information is collected from any user, including children under 13.',
        '• Health Privacy (HIPAA): TalkWithDad is a standalone, local communication software tool and is not a HIPAA Covered Entity or Business Associate. No Electronic Protected Health Information (ePHI) is transmitted or stored on remote servers.',
      ],
      contentZh: [
        '• 歐盟 / 英國（GDPR / UK GDPR）：因我們不收集任何個人資料，故不涉及資料處理協議或跨國資料傳輸。您可透過內建之「備份與還原」功能匯出 JSON 檔案或清除瀏覽器資料，享有完全的資料自主權（GDPR 第 17 條刪除權、第 20 條資料可攜權）。',
        '• 美國加州消費者隱私法（CCPA / CPRA & CalOPPA）：依加州民法典 § 1798.140 定義，我們絕不「販售」或「分享」任何個人資訊或敏感個人資訊，亦不在第三方網站間追蹤使用者。',
        '• 兒童線上隱私保護法（COPPA）：本應用程式完全符合 COPPA 規定，絕不收集任何使用者（包含 13 歲以下兒童）之個人資料。',
        '• 醫療健康隱私（HIPAA）：TalkWithDad 屬於本機端獨立輔助軟體工具，非屬 HIPAA 規範之受規範實體（Covered Entity）或業務夥伴（Business Associate），亦不在遠端伺服器傳輸或儲存任何受保護電子健康資訊（ePHI）。',
      ],
    },
    {
      id: 'privacy-data-management',
      title: '8. User Control, Data Portability & Deletion',
      titleZh: '8. 使用者資料控制權、資料可攜性與刪除方式',
      contentEn: [
        'You retain 100% control over your communication data at all times:',
        '• Export / Data Portability: Navigate to Caregiver Dashboard → Backup & Restore to download a complete, unencrypted JSON backup of all your categories, cards, and configuration settings.',
        '• Total Deletion / Reset: You can permanently erase all stored cards and reset the application by using the "Reset to Defaults" option in the Caregiver Dashboard or by clearing your browser cache/storage for this site.',
      ],
      contentZh: [
        '您對自己的溝通資料隨時保有 100% 的絕對控制權：',
        '• 匯出 / 資料可攜：前往「照護者設定 → 備份與還原」，即可下載包含所有分類、圖卡與配置設定之完整未加密 JSON 備份檔案。',
        '• 完全刪除 / 重設：您可隨時透過照護者設定中的「重設為預設值」功能，或直接清除瀏覽器中本網站的快取與本機儲存空間，以徹底抹除所有儲存的圖卡與記錄。',
      ],
    },
    {
      id: 'privacy-updates-contact',
      title: '9. Changes to This Privacy Policy & Contact Information',
      titleZh: '9. 政策修訂與聯繫管道',
      contentEn: [
        'We may update this Privacy Policy from time to time. Any revisions will be published with an updated "Last Updated" date at the top of this document.',
        'Because the App collects no email addresses or contact information, we encourage users to review this page periodically.',
        'If you have questions, feedback, or legal inquiries regarding this Privacy Policy, please open an issue or inquiry on our official GitHub repository: https://github.com/damorelse/talk-with-dad',
      ],
      contentZh: [
        '我們可能會不定期修訂本隱私權政策。任何修訂內容均會公布並更新本文件頂部之「最後修訂日期」。',
        '因本應用程式不收集電子郵件或聯絡資訊，建議使用者定期查閱本政策。',
        '若您對本隱私權政策有任何疑問、建議或法務諮詢，請至我們的官方 GitHub 儲存庫提出 Issue：https://github.com/damorelse/talk-with-dad',
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDocument = {
  id: 'terms-of-service',
  title: 'Terms of Service',
  titleZh: '服務條款',
  subtitle: 'Terms of Use & Clinical / Emergency Disclaimers',
  subtitleZh: '使用條款與臨床及緊急狀況免責聲明',
  effectiveDate: 'August 26, 2026',
  lastUpdated: 'August 26, 2026',
  summaryPoints: [
    {
      en: 'Assistive Communication Aid: TalkWithDad is an open-source assistive communication and speech rehabilitation web application.',
      zh: '輔助溝通工具：TalkWithDad 為開放原始碼之輔助溝通與言語復健網頁應用程式。',
    },
    {
      en: 'NOT Medical Advice: This app is NOT a medical device, diagnostic tool, or replacement for professional speech-language therapy.',
      zh: '非醫療建議：本應用程式絕非醫療器材、診斷工具或專業語言治療之替代品。',
    },
    {
      en: 'NOT an Emergency Response System: Rapid emergency phrases are for nearby bedside alerting only and CANNOT dial 911 or dispatch first responders.',
      zh: '非緊急救援系統：緊急快捷短語僅供床邊身旁人員警示使用，無法自動撥打 911/110/119 或派遣救援人員。',
    },
    {
      en: 'Provided "AS IS" Without Warranty: The application is provided free of charge on an "AS IS" and "AS AVAILABLE" basis.',
      zh: '依「現況」免費提供且無擔保：本應用程式以「現況」及「現有」基礎免費提供，不提供任何明示或默示擔保。',
    },
  ],
  sections: [
    {
      id: 'terms-acceptance',
      title: '1. Acceptance of Terms',
      titleZh: '1. 條款接受與適用範圍',
      contentEn: [
        'By accessing, installing, browsing, or using the TalkWithDad Progressive Web App ("TalkWithDad", "the Application", or "the Service"), you ("User", "Caregiver", or "You") agree to be bound by these Terms of Service ("Terms").',
        'If you do not agree with any part of these Terms, you must not access or use the Application.',
        'If you are a caregiver, speech-language pathologist (SLP), occupational therapist, or family member assisting another individual, you represent that you have the authority to configure and use the Application on their behalf.',
      ],
      contentZh: [
        '當您存取、安裝、瀏覽或使用 TalkWithDad 漸進式網頁應用程式（「TalkWithDad」、「本應用程式」或「本服務」）時，即代表您（「使用者」、「照護者」或「您」）同意受本服務條款（「本條款」）之約束。',
        '若您不同意本條款之任何部分，請勿存取或使用本應用程式。',
        '若您為協助他人使用之照護者、語言治療師（SLP）、職能治療師或家庭成員，您聲明並保證您具備代表該使用者設定及使用本應用程式之合法權限。',
      ],
    },
    {
      id: 'terms-medical-disclaimer',
      title: '2. STRICT MEDICAL & CLINICAL DISCLAIMER (NOT MEDICAL ADVICE)',
      titleZh: '2. 嚴格醫療與臨床免責聲明（非醫療建議）',
      isImportant: true,
      contentEn: [
        'TALKWITHDAD IS AN ASSISTIVE COMMUNICATION AND EDUCATIONAL SPEECH PRACTICE AID ONLY. IT IS NOT A MEDICAL DEVICE, CLINICAL DIAGNOSTIC INSTRUMENT, OR THERAPEUTIC MEDICAL APPLIANCE.',
        '• No Medical Relationship: Use of the Application does not establish a doctor-patient, therapist-patient, or healthcare provider relationship.',
        '• Not a Substitute for Professional Care: The Application, including its clinical clues, phonetic syllable visualizers, pain scale maps, and deterministic therapy decks, is NOT a substitute for professional medical assessment, neurological evaluation, clinical diagnosis, treatment planning, or speech-language pathology.',
        '• Consult Qualified Professionals: Always seek the advice of a qualified physician, neurologist, certified speech-language pathologist, or other licensed healthcare professional with any questions regarding stroke recovery, aphasia, apraxia, dysarthria, or rehabilitation protocols.',
        '• Never Disregard Advice: Never disregard or delay seeking professional medical advice or clinical care because of something you have read, configured, or practiced in this Application.',
      ],
      contentZh: [
        'TALKWITHDAD 僅為輔助溝通與教育性言語練習工具。本應用程式絕非醫療器材、臨床診斷儀器或治療性醫療設備。',
        '• 無醫病關係：使用本應用程式不構成醫病關係、語言治療師與病患關係或任何醫療照護提供者關係。',
        '• 非專業醫療替代品：本應用程式所提供之功能（包括臨床提示、音節視覺化、疼痛圖譜量表與每週復健訓練卡片）絕不能替代專業醫療評估、神經學檢查、臨床診斷、治療計畫或語言病理治療。',
        '• 請諮詢合格專業人士：關於中風康復、失語症、失用症、構音障礙或復健處方之任何問題，請務必諮詢合格醫師、神經科專科醫師、執業語言治療師或其他合格醫療專業人員。',
        '• 絕勿延誤就醫：絕不可因本應用程式中閱讀、設定或練習之任何內容，而忽視或延誤尋求專業醫療建議或臨床治療。',
      ],
    },
    {
      id: 'terms-emergency-disclaimer',
      title: '3. STRICT EMERGENCY & LIFE SAFETY DISCLAIMER (NOT AN EMERGENCY SYSTEM)',
      titleZh: '3. 嚴格緊急狀況與人身安全免責聲明（非緊急救援系統）',
      isImportant: true,
      contentEn: [
        'TALKWITHDAD IS NOT AN EMERGENCY DISPATCH SYSTEM, 911 TELEPHONY DIALER, OR CERTIFIED LIFE-SAFETY MONITORING TOOL.',
        '• Bedside Alerting Only: The "Emergency Bar", rapid priority buttons ("HELP", "PAIN", "YES", "NO", "BATHROOM"), and audible alarm tones are designed solely for face-to-face, local bedside communication with nearby persons in the same physical room.',
        '• Cannot Contact Authorities: The Application cannot and will not dial emergency services (e.g. 911, 112, 999, 110, 119), contact medical dispatchers, send SMS/cellular distress alerts, or broadcast location coordinates.',
        '• In a Medical Emergency: If you or the individual you are caring for experiences a medical emergency, acute pain, stroke symptoms (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call), difficulty breathing, or loss of consciousness, IMMEDIATELY call your local emergency telephone number (911/112/119) or use a certified telephone / medical alert button.',
      ],
      contentZh: [
        'TALKWITHDAD 絕非緊急調度系統、911 自動撥號工具或經認證之人身安全監控系統。',
        '• 僅供現場床邊警示：頂部「緊急快捷列」、優先按鈕（「求助 HELP」、「疼痛 PAIN」、「好 YES」、「不要 NO」、「上廁所 BATHROOM」）及蜂鳴警示音僅供同處一室之身旁照護者現場床邊溝通使用。',
        '• 無法通報緊急機構：本應用程式無法且絕不會撥打緊急救護電話（如 911、112、999、110、119）、無法聯繫救護調度中心、無法發送簡訊/行動通訊求救訊號，亦無法廣播定位座標。',
        '• 面臨緊急醫療狀況時：若您或您照護的對象面臨緊急醫療狀況、急性劇痛、中風徵兆（辛辛那提/FAST 評估：臉部不對稱、手臂無力、言語障礙、即刻送醫）、呼吸困難或意識喪失，請立即使用電話撥打當地緊急救護電話（911 / 112 / 119）或使用經認證之醫療求救警鈴。',
      ],
    },
    {
      id: 'terms-permitted-use',
      title: '4. License & Permitted Use',
      titleZh: '4. 授權許可與合法使用條款',
      contentEn: [
        '• License Grant: TalkWithDad is provided under open-source and permissive personal usage terms. You are granted a personal, non-exclusive, non-transferable, revocable license to access, install as a PWA, and use the Application for personal, familial, caregiving, and clinical rehabilitation purposes.',
        '• Prohibited Conduct: You agree not to:',
        '  - Use the Application for any unlawful purpose or in violation of any applicable local, national, or international health regulations.',
        '  - Attempt to decompile, reverse-engineer, or tamper with the client-side code in a manner intended to compromise software security or bypass caregiver lock protections.',
        '  - Use the Application to harass, abuse, or harm any individual.',
      ],
      contentZh: [
        '• 授權許可：TalkWithDad 依開源及個人非商業授權條款提供。您獲授個人、非專屬、不可轉讓且可撤銷之許可，得以 PWA 形式安裝並存取本應用程式，供個人、家庭、居家照護及臨床復健練習使用。',
        '• 禁止行為：您同意不得：',
        '  - 將本應用程式用於任何非法目的，或違反任何適用之地方、國家或國際醫療衛生法規。',
        '  - 企圖惡意反編譯、逆向工程或竄改使用者端程式碼以破壞軟體安全或繞過照護者防誤觸鎖定機制。',
        '  - 利用本應用程式騷擾、辱罵或傷害任何個人。',
      ],
    },
    {
      id: 'terms-user-content',
      title: '5. User Content, Custom Vocabulary & Backups',
      titleZh: '5. 使用者自訂內容、詞彙庫與備份責任',
      contentEn: [
        '• Ownership of Content: You retain full ownership and intellectual property rights to any custom AAC cards, vocabulary, clinical clues, audio recordings, and images you create or upload to the Application.',
        '• Local Storage Responsibility: Because TalkWithDad operates 100% locally and maintains NO centralized cloud database, YOU ARE SOLELY RESPONSIBLE FOR MAINTAINING REGULAR BACKUPS of your data.',
        '• Backup Feature: We provide a built-in JSON export and import utility in the Caregiver Dashboard. We strongly recommend exporting a backup copy of your custom card library after making significant modifications.',
        '• Data Loss: We shall not be liable for any loss, corruption, or unintentional deletion of data resulting from browser cache clearing, device resets, browser upgrades, or operating system updates.',
      ],
      contentZh: [
        '• 內容所有權：您對在應用程式中建立或上傳之任何自訂 AAC 圖卡、詞彙、臨床提示、語音錄音及圖片保有完整的著作權與智慧財產權。',
        '• 本機儲存管理責任：由於 TalkWithDad 為 100% 純本機運作且不維護任何中央雲端資料庫，您須自行全權負責定期備份您的自訂資料。',
        '• 備份工具：我們在「照護者設定」中提供內建 JSON 匯出與匯入工具。強烈建議您在進行重大自訂修改後，隨時匯出備份檔案保存。',
        '• 資料滅失免責：因瀏覽器清除快取、裝置重設、瀏覽器升級或作業系統更新所導致之任何資料遺失、損毀或非預期刪除，我們概不承擔任何責任。',
      ],
    },
    {
      id: 'terms-hosting-disclaimer',
      title: '6. GitHub Pages Hosting & Third-Party Platforms',
      titleZh: '6. GitHub Pages 代管與第三方平台說明',
      contentEn: [
        'TalkWithDad is hosted statically on GitHub Pages. We do not warrant that GitHub Pages will be uninterrupted, error-free, or perpetually available.',
        'Once installed as a Progressive Web App (PWA) on your device, the Application will function offline via its Service Worker cache. However, initial installation, updates, and external Google Sheets sync depend on active internet connectivity and third-party infrastructure.',
      ],
      contentZh: [
        'TalkWithDad 係以靜態網頁形式託管於 GitHub Pages。我們無法保證 GitHub Pages 伺服器將永不中斷、無錯誤或永久可用。',
        '當本應用程式以 PWA 形式安裝至您的裝置後，可透過 Service Worker 快取完全離線運作。然而，首次安裝、版本更新及 Google 試算表同步功能仍須依賴網路連線及第三方基礎設施。',
      ],
    },
    {
      id: 'terms-warranty-disclaimer',
      title: '7. Disclaimer of Warranties ("AS IS" and "AS AVAILABLE")',
      titleZh: '7. 免責聲明（「現況」與「現有」基礎）',
      isImportant: true,
      contentEn: [
        'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TALKWITHDAD IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.',
        'WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:',
        '• IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
        '• WARRANTIES THAT THE APPLICATION WILL MEET YOUR CLINICAL OR COMMUNICATION NEEDS, BE UNINTERRUPTED, ACCURATE, SECURE, OR ERROR-FREE.',
        '• WARRANTIES REGARDING THE ACCURACY OR RELIABILITY OF SYNTHESIZED SPEECH, BILINGUAL TRANSLATIONS, PHONETIC SPLITTING, OR REHABILITATION RESULTS.',
      ],
      contentZh: [
        '在適用法律所允許之最大範圍內，TALKWITHDAD 均按「現況（AS IS）」及「現有（AS AVAILABLE）」基礎提供，不附帶任何明示、默示、法定或其他形式之擔保。',
        '我們明確排除所有擔保責任，包括但不限於：',
        '• 適銷性、特定目的適用性及不侵權之默示擔保。',
        '• 擔保本應用程式必能滿足您的臨床復健或溝通需求、運作不中斷、完全準確、安全或無錯誤。',
        '• 對於語音合成準確度、雙語翻譯品質、音節切分正確性或言語復健成效之任何保證。',
      ],
    },
    {
      id: 'terms-limitation-liability',
      title: '8. Limitation of Liability',
      titleZh: '8. 責任限制條款',
      isImportant: true,
      contentEn: [
        'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE DEVELOPERS, CONTRIBUTORS, CREATORS, HOSTS, OR AFFILIATED PARTIES OF TALKWITHDAD BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH:',
        '1. YOUR USE OR INABILITY TO USE THE APPLICATION;',
        '2. ANY RELIANCE PLACED ON AAC OUTPUTS, BILINGUAL CLUES, OR SPEECH PHRASES IN MEDICAL, CAREGIVING, OR DAILY SITUATIONS;',
        '3. ANY DELAYS OR FAILURES IN SEEKING TIMELY PROFESSIONAL MEDICAL OR EMERGENCY ATTENTION;',
        '4. LOSS OF DATA, DELETION OF CUSTOM VOCABULARY, OR DEVICE CORRUPTION;',
        '5. HARDWARE, BROWSER, OR OPERATING SYSTEM INCOMPATIBILITIES.',
        'THIS LIMITATION APPLIES REGARDLESS OF THE LEGAL THEORY (TORT, CONTRACT, STRICT LIABILITY, OR OTHERWISE), EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.',
      ],
      contentZh: [
        '在適用法律所允許之最大範圍內，TALKWITHDAD 之開發者、貢獻者、創作者、代管方或相關人員，在任何情況下均不對因下列原因所引起或相關之任何直接、間接、附隨、特別、衍生性、懲罰性或示範性損害承擔任何責任：',
        '1. 您使用或無法使用本應用程式；',
        '2. 於醫療、照護或日常生活中依賴 AAC 語音輸出、雙語提示或溝通詞彙；',
        '3. 延誤或未能及時尋求專業醫療治療或緊急救護；',
        '4. 資料遺失、自訂詞彙刪除或裝置損壞；',
        '5. 硬體、瀏覽器或作業系統之不相容問題。',
        '無論該請求係基於侵權、契約、無過失責任或其他任何法律理論，即使事先已被告知發生該等損害之可能性，本責任限制條款均一體適用。',
      ],
    },
    {
      id: 'terms-governing-law',
      title: '9. Governing Law, Severability & Entire Agreement',
      titleZh: '9. 準據法、條款可分性與完整協議',
      contentEn: [
        '• Severability: If any provision of these Terms is found to be unlawful, void, or for any reason unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions.',
        '• Entire Agreement: These Terms, together with our Privacy Policy, constitute the entire agreement between you and the developers of TalkWithDad regarding your use of the Application.',
        '• Non-Waiver: Failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.',
      ],
      contentZh: [
        '• 條款可分性：若本條款之任何條款被認定為違法、無效或因故無法執行，該條款應視為可分，且不影響其他任何條款之有效性與可執行性。',
        '• 完整協議：本條款連同我們的隱私權政策，構成您與 TalkWithDad 開發者間關於本應用程式使用之完整協議。',
        '• 權利不拋棄：未執行本條款之任何權利或規定，不構成對該等權利之拋棄。',
      ],
    },
    {
      id: 'terms-updates-contact',
      title: '10. Modifications to Terms & Contact Information',
      titleZh: '10. 條款修訂與聯繫方式',
      contentEn: [
        'We reserve the right to modify these Terms at any time. Changes become effective immediately upon posting to the Application with an updated "Last Updated" timestamp.',
        'For open-source inquiries, feature requests, or legal notices, please reach out via our GitHub repository: https://github.com/damorelse/talk-with-dad',
      ],
      contentZh: [
        '我們保留隨時修訂本條款之權利。修訂後之條款於公布至本應用程式並更新「最後修訂日期」時立即生效。',
        '如對開源專案有任何疑問、功能建議或法務通知，請透過我們的 GitHub 儲存庫聯繫：https://github.com/damorelse/talk-with-dad',
      ],
    },
  ],
};
