(function () {
  'use strict';
  const technicalFaqs = [
  {
    "id": "ai-orchestration",
    "q": {
      "en": "How is a business AI agent different from a chatbot?",
      "hi": "कारोबार का AI एजेंट सामान्य चैटबॉट से कैसे अलग है?"
    },
    "a": {
      "en": "The intended AI layer turns a need into a structured task: what is needed, how much, where and by when. Workflow orchestration then moves that task through quotation, approval, delivery and settlement, checking the rules at each step. The useful result is a traceable business outcome, not just a fluent reply. The separate local core already implements explicit workflows; its current onboarding chat is guided, without a connected language model.",
      "hi": "AI की प्रस्तावित भूमिका ज़रूरत को स्पष्ट काम में बदलना है: क्या चाहिए, कितना, कहाँ और कब तक। इसके बाद workflow orchestration यानी काम के चरणों का संचालन उसे कोटेशन, मंज़ूरी, डिलीवरी और भुगतान के हिसाब तक ले जाता है; हर चरण पर नियम जाँचे जाते हैं। मकसद सिर्फ़ अच्छा जवाब नहीं, बल्कि जाँचने योग्य कारोबारी नतीजा है। अलग स्थानीय सॉफ़्टवेयर में काम के तय चरण बने हैं; उसकी ऑनबोर्डिंग चैट अभी निर्देशित है, किसी भाषा मॉडल से जुड़ी नहीं।"
    }
  },
  {
    "id": "context-routing",
    "q": {
      "en": "How would one entry point select the right business and site?",
      "hi": "एक प्रवेश बिंदु सही कारोबार और साइट कैसे चुनेगा?"
    },
    "a": {
      "en": "The design separates the messaging sender, authenticated person, business ID and site ID. After an explicit business choice, the active context follows each request and confirmation. Server-side membership and site permissions decide what that person may do; a profile label or typed phone number cannot grant access. One owner can switch between businesses, while multiple profiles within one business retain the same accounting owner. Trusted WhatsApp identity mapping is still a future connection.",
      "hi": "डिज़ाइन में संदेश भेजने वाला, प्रमाणित व्यक्ति, कारोबार की ID और साइट की ID अलग हैं। कारोबार चुनने के बाद हर माँग और पुष्टि उसी चुने हुए संदर्भ में होती है। सर्वर पर सदस्यता और साइट की अनुमति तय करती है कि व्यक्ति क्या कर सकता है; केवल कारोबार का प्रकार चुनना या नंबर लिखना पहुँच नहीं देता। एक मालिक कारोबार बदल सकता है, जबकि एक कारोबार के अलग कामों की बही का ज़िम्मेदार एक ही रहता है। WhatsApp पहचान को भरोसेमंद तरीके से जोड़ना अभी आगे का काम है।"
    }
  },
  {
    "id": "a2a-api",
    "q": {
      "en": "How does A2A work, and what prevents duplicate requests?",
      "hi": "A2A कैसे काम करता है और एक माँग दो बार दर्ज होने से कैसे बचती है?"
    },
    "a": {
      "en": "A2A means agent-to-agent communication. The local Dukaan API receives authenticated structured requests with a business/site reference, items, units and quantities, then returns a durable task receipt and status. Receipt means awaiting shopkeeper input, not an accepted sale. Idempotency makes an identical retry return the original task; changed content under the same reference is a conflict. A timeout should trigger a status check or the same retry, not a new purchase. Live buyer-agent integration and compatibility testing remain ahead.",
      "hi": "A2A का मतलब एजेंट से एजेंट का संवाद है। स्थानीय Dukaan API प्रमाणित, संरचित माँग लेती है: कारोबार और साइट का संदर्भ, सामान, इकाई और मात्रा। वह काम की सुरक्षित रखी गई रसीद और स्थिति लौटाती है। रसीद का अर्थ दुकानदार के जवाब की प्रतीक्षा है, मंज़ूर बिक्री नहीं। Idempotency से बिल्कुल वही माँग दोबारा भेजने पर पुराना काम लौटता है; उसी संदर्भ में बदली जानकारी टकराव मानी जाती है। जवाब न मिले तो स्थिति जाँचें या वही माँग दोहराएँ, नई खरीद न बनाएँ। असली खरीदार एजेंट जोड़ना और अनुकूलता की जाँच अभी बाकी है।"
    }
  },
  {
    "id": "access-enforcement",
    "q": {
      "en": "What stops an old session from acting after verification is rejected?",
      "hi": "आवेदन खारिज होने के बाद पुराने सत्र से काम होने को क्या रोकता है?"
    },
    "a": {
      "en": "The explicit local onboarding-to-foundation bridge checks current owner access at each operational authorization, alongside role, site, evidence and approval rules. Submitted owners may work while review is pending. Rejection remains blocking through edits and resubmission until a later valid independent approval. A saved export is configuration, not permission; unavailable authority blocks the operation. Any future remote agent or queued worker must make the same current check at execution time. The separate legacy receipt API is not automatically linked to this bridge.",
      "hi": "स्पष्ट रूप से जोड़ा गया स्थानीय ऑनबोर्डिंग और कारोबारी सॉफ़्टवेयर हर काम की अनुमति देते समय मालिक की मौजूदा पहुँच जाँचता है; साथ में भूमिका, साइट, सबूत और मंज़ूरी के नियम भी लागू होते हैं। आवेदन भेजने के बाद जाँच लंबित रहते काम हो सकता है। खारिज होने पर बदलाव या दोबारा आवेदन से रोक नहीं हटती; बाद की वैध, स्वतंत्र मंज़ूरी चाहिए। सेव किया हुआ एक्सपोर्ट व्यवस्था की जानकारी है, अनुमति नहीं; अनुमति की जाँच उपलब्ध न हो तो काम रुकता है। भविष्य के दूरस्थ एजेंट और कतार में रखे काम को चलाते समय यही जाँच करनी होगी। अलग पुरानी रसीद API अपने आप इस व्यवस्था से नहीं जुड़ती।"
    }
  },
  {
    "id": "ledger-ownership",
    "q": {
      "en": "How do evidence chains and separate ledgers fit together?",
      "hi": "सबूत की कड़ी और अलग-अलग बही एक साथ कैसे काम करते हैं?"
    },
    "a": {
      "en": "The local ledger links originals, source references, actors, reviews and corrections to business events. Hash-chain checkpoints help detect changes when compared with an independently retained checkpoint; they do not make a claim true or prevent an administrator rewriting storage. Buyer and seller keep separate books linked by a shared job reference. The integration rule is one authoritative writer per business: imported invoices are views of source records, not permission to post them again. A specialist writer registry and importer are not built yet.",
      "hi": "स्थानीय बही मूल सबूत, स्रोत के संदर्भ, काम करने वाले व्यक्ति, जाँच और सुधार को कारोबारी घटनाओं से जोड़ती है। हैश-कड़ी के चेकपॉइंट को अलग सुरक्षित रखी कॉपी से मिलाने पर बदलाव पकड़ने में मदद मिलती है; इससे दावा सच नहीं हो जाता, न ही डेटाबेस प्रशासक का बदलाव असंभव होता है। खरीदार और विक्रेता की बही अलग रहती है, काम का साझा संदर्भ उन्हें जोड़ता है। जोड़ने का नियम है: हर कारोबार की बही में लिखने वाला एक आधिकारिक सिस्टम हो। आयातित बिल मूल रिकॉर्ड का दृश्य है, दोबारा एंट्री की अनुमति नहीं। विशेषज्ञ एजेंट के लेखन-अधिकार की रजिस्ट्री और आयातक अभी नहीं बने हैं।"
    }
  },
  {
    "id": "uncertainty-review",
    "q": {
      "en": "What should happen when AI cannot read a slip or figures disagree?",
      "hi": "AI पर्ची न पढ़ पाए या रकम का मिलान न हो तो क्या होना चाहिए?"
    },
    "a": {
      "en": "A future AI or OCR extraction must remain a proposal beside the original evidence. Missing units, unclear handwriting or conflicting amounts should produce a focused clarification or manual review, not an invented value. Business calculations and validation then run on the confirmed structured data. The local core already preserves conflicting evidence and linked corrections; a payment image alone cannot confirm settlement. OCR, model confidence handling and real document authentication still need their own integration and evaluation.",
      "hi": "भविष्य में AI या OCR से पढ़ी गई जानकारी मूल सबूत के साथ एक प्रस्ताव के रूप में रहनी चाहिए। इकाई गायब हो, लिखावट अस्पष्ट हो या रकम अलग-अलग हो तो साफ़ सवाल या मानवीय जाँच होनी चाहिए, मनगढ़ंत संख्या नहीं। पुष्टि किए गए संरचित डेटा पर हिसाब और नियमों की जाँच चलेगी। स्थानीय सॉफ़्टवेयर विरोधी सबूत और उनसे जुड़े सुधार सँभालता है; केवल भुगतान की तस्वीर वसूली की पुष्टि नहीं कर सकती। OCR, मॉडल की अनिश्चितता सँभालने और असली दस्तावेज़ की पहचान के लिए अलग एकीकरण और मूल्यांकन अभी चाहिए।"
    }
  },
  {
    "id": "discovery-consent",
    "q": {
      "en": "How can discovery include businesses outside the agent network?",
      "hi": "एजेंट नेटवर्क से बाहर के कारोबार खोज में कैसे शामिल होंगे?"
    },
    "a": {
      "en": "The local core can rank stored candidates by capability, area and freshness, and record a guest transaction without inventing a counterpart agent. The planned external discovery layer adds permitted sources and shows where each candidate came from. A listing is not confirmation of stock, price or permission to message. The owner needs an authorized introduction or contact route, then a confirmed quotation. Joining the network remains a separate optional decision. Live search providers and automated outreach are not connected.",
      "hi": "स्थानीय सॉफ़्टवेयर दर्ज उम्मीदवारों को काम की योग्यता, क्षेत्र और जानकारी की ताज़गी के अनुसार क्रम दे सकता है और सामने वाले का काल्पनिक एजेंट बनाए बिना अतिथि लेन-देन दर्ज कर सकता है। प्रस्तावित बाहरी खोज अनुमत स्रोत जोड़ेगी और बताएगी कि उम्मीदवार कहाँ से मिला। सूची में नाम होना स्टॉक, कीमत या संदेश भेजने की अनुमति की पुष्टि नहीं है। मालिक को अधिकृत परिचय या संपर्क का तरीका, फिर पुष्टि किया कोटेशन चाहिए। नेटवर्क से जुड़ना अलग और वैकल्पिक फैसला रहेगा। असली खोज प्रदाता और अपने आप संपर्क करने की सुविधा अभी जुड़ी नहीं है।"
    }
  },
  {
    "id": "model-integration",
    "q": {
      "en": "Which AI model or provider API powers the experience?",
      "hi": "यह अनुभव किस AI मॉडल या प्रदाता की API पर चलता है?"
    },
    "a": {
      "en": "This website does not call an AI model or provider API. It demonstrates the workflow with local sample data; the separate onboarding conversation also runs without a remote model. A future model adapter would interpret a request or document and return structured proposals to the business services. Permissions, monetary calculations and posting rules must stay in those services, rather than rely on model instructions. Provider selection, server-side credentials, evaluation, cost limits and approved data handling need to be configured before connecting that layer.",
      "hi": "यह वेबसाइट किसी AI मॉडल या प्रदाता की API को नहीं बुलाती। स्थानीय नमूना डेटा से काम का तरीका दिखाती है; अलग ऑनबोर्डिंग संवाद भी दूरस्थ मॉडल के बिना चलता है। भविष्य का मॉडल अडैप्टर माँग या दस्तावेज़ समझकर कारोबारी सेवाओं को संरचित प्रस्ताव देगा। अनुमति, रकम का हिसाब और बही में लिखने के नियम उन सेवाओं में रहने चाहिए, केवल मॉडल के निर्देशों पर निर्भर नहीं। वह परत जोड़ने से पहले प्रदाता, सर्वर पर सुरक्षित पहचान-कुंजियाँ, मूल्यांकन, खर्च की सीमा और डेटा सँभालने की स्वीकृत व्यवस्था तय करनी होगी।"
    }
  },
  {
    "id": "built-today",
    "q": {
      "en": "What is working today, and what does this website actually run?",
      "hi": "आज क्या बना हुआ है और यह वेबसाइट असल में क्या चलाती है?"
    },
    "a": {
      "en": "This static website runs business selectors, staged sample jobs, a fictional diary check and a local setup brief in your browser. Separately, the tested local backend provides persisted onboarding and review, an explicit current-access bridge, business workflows, evidence-linked private books, local discovery and an inbound A2A receiver. The website does not call those services. WhatsApp, real OTP delivery, live model/OCR services, bank confirmation and existing specialist agents remain separate connections. The interactive scenes illustrate those business relationships, not completed real-world jobs.",
      "hi": "यह स्थिर वेबसाइट आपके ब्राउज़र में कारोबार का चुनाव, चरणों वाले नमूना काम, काल्पनिक डायरी की जाँच और स्थानीय सेटअप सार चलाती है। अलग, जाँचे गए स्थानीय बैकएंड में सेव होने वाली ऑनबोर्डिंग और समीक्षा, मौजूदा पहुँच की स्पष्ट जाँच, कारोबारी काम, सबूत से जुड़ी निजी बही, स्थानीय खोज और आने वाली A2A माँग का रिसीवर बने हैं। वेबसाइट उन सेवाओं को नहीं बुलाती। WhatsApp, असली OTP भेजना, लाइव मॉडल/OCR, बैंक की पुष्टि और पहले से बने विशेषज्ञ एजेंट अलग से जोड़ने हैं। इंटरैक्टिव दृश्य कारोबारी रिश्ते समझाते हैं; वे असली दुनिया में पूरा हुआ काम नहीं हैं।"
    }
  }
];
  function freeze(value) {
    Object.values(value).forEach(child => { if (child && typeof child === 'object') freeze(child); });
    return Object.freeze(value);
  }
  window.NirmanSiteData = freeze({ technicalFaqs });
}());
