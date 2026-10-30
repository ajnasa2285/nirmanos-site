(function () {
  'use strict';
  const t = (en, hi) => ({ en, hi });
  const businesses = [
    {
      id: 'brick_kiln', icon: 'brick', name: t('Brick kiln', 'ईंट भट्ठा'), agent: t('Bhatta Munshi', 'भट्ठा मुंशी'),
      headline: t('From the daily diary to a clearer day.', 'रोज़ की डायरी से, रोज़ का साफ़ हिसाब।'),
      description: t('Keep the Munshi’s familiar diary at the heart of the work. Review cash, brick dispatch and expenses, with questions when the figures do not agree.', 'मुंशी जी की वही परिचित डायरी। नक़दी, ईंटों की निकासी और खर्च जाँचें। जहाँ जोड़ न मिले, वहाँ साफ़ सवाल पूछें।'),
      features: [t('Review daily cash and supporting slips', 'रोज़ की नक़दी और पर्चियों की जाँच'), t('Track production, dispatch and outstanding amounts', 'उत्पादन, निकासी और बकाया का हिसाब'), t('Approve entries before they reach the books', 'बही में चढ़ाने से पहले एंट्री की मंज़ूरी')],
      connects: ['construction_shop', 'machinery_rental', 'raw_material_supplier'],
    },
    {
      id: 'contractor', icon: 'helmet', name: t('Contractor', 'ठेकेदार'), agent: t('Contractor workspace', 'ठेकेदार का कार्यक्षेत्र'),
      headline: t('Keep every site moving, with a record of why.', 'हर साइट का काम आगे बढ़े, पूरे हिसाब के साथ।'),
      description: t('Bring material requirements, work progress and supplier confirmations into one business context. Each site keeps its own references and approvals.', 'सामान की ज़रूरत, काम की प्रगति और सप्लायर की पुष्टि एक जगह रखें। हर साइट के संदर्भ और मंज़ूरियाँ अलग रहें।'),
      features: [t('Prepare site-wise material requirements', 'साइट के हिसाब से सामान की ज़रूरत'), t('Review quotations and measured work', 'कोटेशन और काम की माप की जाँच'), t('Keep delivery evidence beside purchase records', 'खरीद के हिसाब के साथ डिलीवरी का सबूत')],
      connects: ['brick_kiln', 'manpower_supplier', 'machinery_rental'],
    },
    {
      id: 'machinery_rental', icon: 'machine', name: t('Machinery rental', 'मशीन किराया'), agent: t('Rental workspace', 'मशीन किराये का कार्यक्षेत्र'),
      headline: t('A clear record from booking to return.', 'बुकिंग से वापसी तक, साफ़ हिसाब।'),
      description: t('For JCB and other equipment owners: keep bookings, agreed rates and actual usage together, so the bill follows the work that was confirmed.', 'JCB और दूसरी मशीनों के मालिकों के लिए: बुकिंग, तय दर और असल इस्तेमाल एक साथ रखें, ताकि बिल पुष्टि किए गए काम के अनुसार बने।'),
      features: [t('Check booking windows and availability', 'बुकिंग का समय और उपलब्धता देखें'), t('Record start and end meter readings', 'शुरुआती और अंतिम मीटर रीडिंग रखें'), t('Review actual hours before billing', 'बिल से पहले असल घंटों की जाँच')],
      connects: ['brick_kiln', 'contractor', 'raw_material_supplier'],
    },
    {
      id: 'construction_shop', icon: 'shop', name: t('Construction shop', 'निर्माण सामग्री की दुकान'), agent: t('Dukaan workspace', 'दुकान का कार्यक्षेत्र'),
      headline: t('The right supplies, with the right details.', 'सही सामान, पूरी जानकारी के साथ।'),
      description: t('Tirpal, pipes, gloves, ropes and safety equipment: turn a requirement into a checked quotation, an approved order and a recorded delivery.', 'तिरपाल, पाइप, दस्ताने, रस्सियाँ और सुरक्षा का सामान: ज़रूरत से कोटेशन, मंज़ूर ऑर्डर और डिलीवरी के हिसाब तक।'),
      features: [t('Keep products, variants, units and stock clear', 'सामान, आकार, इकाई और स्टॉक साफ़ रखें'), t('Review incoming business requirements', 'दूसरे कारोबारों की ज़रूरत देखें'), t('Record sales, receipts and outstanding dues', 'बिक्री, वसूली और बकाया दर्ज करें')],
      connects: ['brick_kiln', 'contractor', 'manpower_supplier'],
    },
    {
      id: 'raw_material_supplier', icon: 'truck', name: t('Material supplier', 'कच्चा माल सप्लायर'), agent: t('Material supply workspace', 'कच्चा माल सप्लाई कार्यक्षेत्र'),
      headline: t('Every load accounted for.', 'हर खेप का पूरा हिसाब।'),
      description: t('Keep sand, aggregate, coal or other material requests linked to quantities, trips and the receiving business’s confirmation.', 'रेत, गिट्टी, कोयला या दूसरे कच्चे माल की माँग को मात्रा, गाड़ी के चक्करों और लेने वाले कारोबार की पुष्टि से जोड़ें।'),
      features: [t('Quote in clear quantities and units', 'साफ़ मात्रा और इकाई में कोटेशन'), t('Keep trip references and delivery quantities', 'गाड़ी के चक्कर और उतरी मात्रा का रिकॉर्ड'), t('Reconcile delivery against the agreed order', 'डिलीवरी का तय ऑर्डर से मिलान')],
      connects: ['brick_kiln', 'contractor', 'machinery_rental'],
    },
    {
      id: 'manpower_supplier', icon: 'people', name: t('Manpower supplier', 'मज़दूर सप्लायर'), agent: t('Workforce workspace', 'मज़दूर सप्लाई कार्यक्षेत्र'),
      headline: t('People, attendance and work kept together.', 'मज़दूर, हाज़िरी और काम का एक साथ हिसाब।'),
      description: t('Plan a deployment, record attendance and review the work confirmed for each site before preparing the amount due.', 'साइट पर मज़दूर भेजने की योजना बनाएँ, हाज़िरी दर्ज करें और देय रकम तय करने से पहले पुष्टि किए गए काम की जाँच करें।'),
      features: [t('Record skills and deployment dates', 'काम का हुनर और तैनाती की तारीखें'), t('Keep attendance with supporting evidence', 'सबूत के साथ हाज़िरी का रिकॉर्ड'), t('Review confirmed work and advances', 'पुष्टि किए गए काम और एडवांस की जाँच')],
      connects: ['contractor', 'brick_kiln', 'snacks_shop'],
    },
    {
      id: 'snacks_shop', icon: 'cup', name: t('Snacks & tea shop', 'चाय-नाश्ते की दुकान'), agent: t('Daily supply workspace', 'रोज़ की सप्लाई का कार्यक्षेत्र'),
      headline: t('Small daily orders deserve clear books too.', 'रोज़ के छोटे ऑर्डर का भी साफ़ हिसाब।'),
      description: t('Keep site tea, snacks and meal requests linked to quantities, delivery and daily collections, without losing the smaller amounts.', 'साइट की चाय, नाश्ते और खाने की माँग को मात्रा, डिलीवरी और रोज़ की वसूली से जोड़ें। छोटी रकम भी हिसाब में रहे।'),
      features: [t('Prepare repeat orders for nearby sites', 'पास की साइटों के नियमित ऑर्डर'), t('Confirm quantities supplied each day', 'हर दिन भेजी मात्रा की पुष्टि'), t('Keep cash collections and dues separate', 'नक़द वसूली और उधार अलग रखें')],
      connects: ['contractor', 'manpower_supplier', 'brick_kiln'],
    },
  ];
  const stageLabels = [t('Requirement', 'ज़रूरत'), t('Quotation', 'कोटेशन'), t('Approval', 'मंज़ूरी'), t('Delivery', 'डिलीवरी'), t('Settlement', 'भुगतान का हिसाब')];
  const scenarios = [
    {
      id: 'kiln-shop', name: t('Kiln → construction shop', 'भट्ठा → निर्माण सामग्री की दुकान'),
      buyer: t('Example Brick Kiln', 'उदाहरण ईंट भट्ठा'), seller: t('Example Supply Shop', 'उदाहरण सप्लाई दुकान'), amountPaise: 1250000,
      item: t('10 tirpal sheets · ₹1,250 each', '10 तिरपाल · ₹1,250 प्रति तिरपाल'),
      requirement: t('We need 10 tirpal sheets for tomorrow’s brick stacks. Please confirm the size, price and delivery.', 'कल ईंटों के ढेर के लिए 10 तिरपाल चाहिए। आकार, दर और डिलीवरी की पुष्टि करें।'),
      quotation: t('10 sheets at ₹1,250 each. Sample order total: ₹12,500. Delivery terms are ready for owner review.', '10 तिरपाल, ₹1,250 प्रति तिरपाल। नमूना ऑर्डर कुल: ₹12,500। डिलीवरी की शर्तें मालिक की जाँच के लिए तैयार हैं।'),
      delivery: t('10 sheets delivered in the sample record. The receiving business checks the count and attaches a delivery note.', 'नमूना रिकॉर्ड में 10 तिरपाल पहुँचे। लेने वाला कारोबार गिनती जाँचकर डिलीवरी पर्ची जोड़ता है।'),
    },
    {
      id: 'contractor-kiln', name: t('Contractor → brick kiln', 'ठेकेदार → ईंट भट्ठा'),
      buyer: t('Example Site Contractor', 'उदाहरण साइट ठेकेदार'), seller: t('Example Brick Kiln', 'उदाहरण ईंट भट्ठा'), amountPaise: 7500000,
      item: t('10,000 bricks · ₹7.50 each', '10,000 ईंटें · ₹7.50 प्रति ईंट'),
      requirement: t('The site needs 10,000 bricks. Please quote the grade, quantity and delivery terms.', 'साइट पर 10,000 ईंटें चाहिए। किस्म, मात्रा और डिलीवरी की शर्तों के साथ कोटेशन दें।'),
      quotation: t('10,000 bricks at ₹7.50 each. Sample order total: ₹75,000. The owner checks the specification before approval.', '10,000 ईंटें, ₹7.50 प्रति ईंट। नमूना ऑर्डर कुल: ₹75,000। मालिक मंज़ूरी से पहले किस्म की जाँच करता है।'),
      delivery: t('The sample delivery note records 10,000 bricks. The site confirms receipt separately from the kiln’s dispatch record.', 'नमूना डिलीवरी पर्ची में 10,000 ईंटें दर्ज हैं। साइट अपनी प्राप्ति की पुष्टि करती है; भट्ठे का निकासी रिकॉर्ड अलग रहता है।'),
    },
    {
      id: 'kiln-rental', name: t('Kiln → machinery rental', 'भट्ठा → मशीन किराया'),
      buyer: t('Example Brick Kiln', 'उदाहरण ईंट भट्ठा'), seller: t('Example Equipment Owner', 'उदाहरण मशीन मालिक'), amountPaise: 600000,
      item: t('4 confirmed machine hours · ₹1,500 per hour', 'मशीन के 4 पुष्टि किए घंटे · ₹1,500 प्रति घंटा'),
      requirement: t('We need a machine for four hours of yard work. Please confirm the slot and hourly rate.', 'यार्ड में चार घंटे काम के लिए मशीन चाहिए। समय और प्रति घंटे की दर बताएँ।'),
      quotation: t('Four hours at ₹1,500 per hour. Sample order total: ₹6,000. The booking needs the owner’s approval.', 'चार घंटे, ₹1,500 प्रति घंटा। नमूना ऑर्डर कुल: ₹6,000। बुकिंग के लिए मालिक की मंज़ूरी चाहिए।'),
      delivery: t('Start and end readings show four sample hours. Both sides review the work record before recording the amount due.', 'नमूना शुरुआती और अंतिम रीडिंग में चार घंटे का काम है। देय रकम दर्ज करने से पहले दोनों पक्ष काम का रिकॉर्ड जाँचते हैं।'),
    },
  ];
  const faqs = [
    { id: 'whatsapp', q: t('Do I need to install another app?', 'क्या मुझे कोई नया ऐप इंस्टॉल करना होगा?'), a: t('The intended business experience is through one NirmanOS WhatsApp number. This website is an interactive preview; it does not connect WhatsApp or register an account.', 'कारोबार का अनुभव एक NirmanOS WhatsApp नंबर पर देने की योजना है। यह वेबसाइट एक इंटरैक्टिव झलक है; इससे WhatsApp नहीं जुड़ता और खाता नहीं बनता।') },
    { id: 'businesses', q: t('Which businesses is NirmanOS for?', 'NirmanOS किन कारोबारों के लिए है?'), a: t('Brick kilns, contractors, machinery rental owners, construction shops, raw-material suppliers, manpower suppliers, and tea or snacks shops. One business can have more than one kind of work while keeping one set of books.', 'ईंट भट्ठे, ठेकेदार, मशीन किराये के मालिक, निर्माण सामग्री की दुकानें, कच्चा माल सप्लायर, मज़दूर सप्लायर और चाय-नाश्ते की दुकानें। एक कारोबार में कई तरह के काम हो सकते हैं, लेकिन बही एक रहती है।') },
    { id: 'approval', q: t('Can the agent place an order or change my books by itself?', 'क्या एजेंट अपने आप ऑर्डर दे सकता है या बही बदल सकता है?'), a: t('Consequential business actions need the appropriate person’s approval. An incoming request is not an accepted order, and a payment claim is not a confirmed settlement. The examples here do not create real orders or ledger entries.', 'असर डालने वाले कारोबारी कामों के लिए ज़िम्मेदार व्यक्ति की मंज़ूरी चाहिए। आई हुई माँग मंज़ूर ऑर्डर नहीं होती, और भुगतान का दावा पुष्टि किया भुगतान नहीं होता। यहाँ के उदाहरण असली ऑर्डर या बही की एंट्री नहीं बनाते।') },
    { id: 'evidence', q: t('What does “evidence-backed” mean?', '“सबूत के साथ हिसाब” का मतलब क्या है?'), a: t('Keep the original note, slip or other supporting record linked to the relevant transaction. Corrections retain the earlier record. Evidence helps review a discrepancy; a photo or checksum alone does not prove a claim is true.', 'मूल नोट, पर्ची या दूसरे सहायक रिकॉर्ड को संबंधित लेन-देन से जोड़कर रखें। सुधार में पुराना रिकॉर्ड भी बचा रहता है। सबूत से फर्क की जाँच आसान होती है; सिर्फ़ फ़ोटो या डिजिटल हैश दावे को सच साबित नहीं करता।') },
    { id: 'verification', q: t('What is needed for onboarding?', 'कारोबार जोड़ने के लिए क्या चाहिए?'), a: t('The current onboarding design asks for a business registration or GST document, a complete business address, and the owner’s contact number verified through an OTP journey. This website only prepares a local setup brief; do not upload private documents here.', 'मौजूदा ऑनबोर्डिंग में बिज़नेस रजिस्ट्रेशन या GST दस्तावेज़, पूरा कारोबारी पता और OTP प्रक्रिया से मालिक के नंबर की पुष्टि चाहिए। यह वेबसाइट केवल आपके लिए एक सेटअप सार तैयार करती है; यहाँ निजी दस्तावेज़ अपलोड न करें।') },
    { id: 'pending', q: t('Can an owner work while verification is pending?', 'क्या जाँच लंबित होने पर मालिक काम कर सकता है?'), a: t('Under the current product policy, an owner can use the agent after completing and submitting the required onboarding, while review is pending. Rejection blocks access until a fresh valid approval. The local website preview does not grant agent access.', 'मौजूदा नीति के अनुसार ज़रूरी जानकारी भरकर आवेदन भेजने के बाद, जाँच लंबित रहते हुए मालिक एजेंट का उपयोग कर सकता है। आवेदन खारिज होने पर नई वैध मंज़ूरी तक पहुँच रुकती है। यह वेबसाइट एजेंट की पहुँच नहीं देती।') },
    { id: 'network', q: t('What if a nearby supplier does not have an agent?', 'अगर पास के सप्लायर के पास एजेंट न हो तो?'), a: t('The network design includes suitable nonmember businesses too. Their details and claims need confirmation, and joining the network is optional. This preview does not search for or contact real suppliers.', 'नेटवर्क की योजना में उपयुक्त गैर-सदस्य कारोबार भी शामिल हैं। उनकी जानकारी और दावों की पुष्टि ज़रूरी है; नेटवर्क से जुड़ना वैकल्पिक है। यह झलक असली सप्लायर नहीं खोजती और न उनसे संपर्क करती है।') },
    { id: 'privacy', q: t('Will another business see my complete ledger?', 'क्या दूसरा कारोबार मेरी पूरी बही देखेगा?'), a: t('Each business keeps its own books. Only the transaction details and evidence explicitly selected for sharing should pass between businesses. A shared job reference does not give another party access to the full ledger.', 'हर कारोबार अपनी बही रखता है। कारोबारों के बीच केवल साझा करने के लिए चुनी गई जानकारी और सबूत जाने चाहिए। एक साझा काम का संदर्भ दूसरे पक्ष को पूरी बही की पहुँच नहीं देता।') },
    { id: 'brief', q: t('Where does my setup brief go?', 'मेरा सेटअप सार कहाँ जाता है?'), a: t('Nowhere automatically. Your answers stay in this open page until you reset or leave it. Copy or download the brief when you choose. There is no submission, customer database or account creation on this website.', 'यह अपने आप कहीं नहीं जाता। आपके जवाब इसी खुले पेज में रहते हैं, जब तक आप रीसेट करें या पेज छोड़ें। अपनी इच्छा से सार कॉपी या डाउनलोड करें। इस वेबसाइट पर आवेदन भेजना, ग्राहक डेटाबेस या खाता बनाना नहीं होता।') },
    {
      id: 'ai-orchestration',
      q: t('How is a business AI agent different from a chatbot?', 'कारोबार का AI एजेंट सामान्य चैटबॉट से कैसे अलग है?'),
      a: t('The intended AI layer turns a need into a structured task: what is needed, how much, where and by when. Workflow orchestration then moves that task through quotation, approval, delivery and settlement, checking the rules at each step. The useful result is a traceable business outcome, not just a fluent reply. The separate local core already implements explicit workflows; its current onboarding chat is guided, without a connected language model.', 'AI की प्रस्तावित भूमिका ज़रूरत को स्पष्ट काम में बदलना है: क्या चाहिए, कितना, कहाँ और कब तक। इसके बाद workflow orchestration यानी काम के चरणों का संचालन उसे कोटेशन, मंज़ूरी, डिलीवरी और भुगतान के हिसाब तक ले जाता है; हर चरण पर नियम जाँचे जाते हैं। मकसद सिर्फ़ अच्छा जवाब नहीं, बल्कि जाँचने योग्य कारोबारी नतीजा है। अलग स्थानीय सॉफ़्टवेयर में काम के तय चरण बने हैं; उसकी ऑनबोर्डिंग चैट अभी निर्देशित है, किसी भाषा मॉडल से जुड़ी नहीं।'),
    },
    {
      id: 'context-routing',
      q: t('How would one entry point select the right business and site?', 'एक प्रवेश बिंदु सही कारोबार और साइट कैसे चुनेगा?'),
      a: t('The design separates the messaging sender, authenticated person, business ID and site ID. After an explicit business choice, the active context follows each request and confirmation. Server-side membership and site permissions decide what that person may do; a profile label or typed phone number cannot grant access. One owner can switch between businesses, while multiple profiles within one business retain the same accounting owner. Trusted WhatsApp identity mapping is still a future connection.', 'डिज़ाइन में संदेश भेजने वाला, प्रमाणित व्यक्ति, कारोबार की ID और साइट की ID अलग हैं। कारोबार चुनने के बाद हर माँग और पुष्टि उसी चुने हुए संदर्भ में होती है। सर्वर पर सदस्यता और साइट की अनुमति तय करती है कि व्यक्ति क्या कर सकता है; केवल कारोबार का प्रकार चुनना या नंबर लिखना पहुँच नहीं देता। एक मालिक कारोबार बदल सकता है, जबकि एक कारोबार के अलग कामों की बही का ज़िम्मेदार एक ही रहता है। WhatsApp पहचान को भरोसेमंद तरीके से जोड़ना अभी आगे का काम है।'),
    },
    {
      id: 'a2a-api',
      q: t('How does A2A work, and what prevents duplicate requests?', 'A2A कैसे काम करता है और एक माँग दो बार दर्ज होने से कैसे बचती है?'),
      a: t('A2A means agent-to-agent communication. The local Dukaan API receives authenticated structured requests with a business/site reference, items, units and quantities, then returns a durable task receipt and status. Receipt means awaiting shopkeeper input, not an accepted sale. Idempotency makes an identical retry return the original task; changed content under the same reference is a conflict. A timeout should trigger a status check or the same retry, not a new purchase. Live buyer-agent integration and compatibility testing remain ahead.', 'A2A का मतलब एजेंट से एजेंट का संवाद है। स्थानीय Dukaan API प्रमाणित, संरचित माँग लेती है: कारोबार और साइट का संदर्भ, सामान, इकाई और मात्रा। वह काम की सुरक्षित रखी गई रसीद और स्थिति लौटाती है। रसीद का अर्थ दुकानदार के जवाब की प्रतीक्षा है, मंज़ूर बिक्री नहीं। Idempotency से बिल्कुल वही माँग दोबारा भेजने पर पुराना काम लौटता है; उसी संदर्भ में बदली जानकारी टकराव मानी जाती है। जवाब न मिले तो स्थिति जाँचें या वही माँग दोहराएँ, नई खरीद न बनाएँ। असली खरीदार एजेंट जोड़ना और अनुकूलता की जाँच अभी बाकी है।'),
    },
    {
      id: 'access-enforcement',
      q: t('What stops an old session from acting after verification is rejected?', 'आवेदन खारिज होने के बाद पुराने सत्र से काम होने को क्या रोकता है?'),
      a: t('The explicit local onboarding-to-foundation bridge checks current owner access at each operational authorization, alongside role, site, evidence and approval rules. Submitted owners may work while review is pending. Rejection remains blocking through edits and resubmission until a later valid independent approval. A saved export is configuration, not permission; unavailable authority blocks the operation. Any future remote agent or queued worker must make the same current check at execution time. The separate legacy receipt API is not automatically linked to this bridge.', 'स्पष्ट रूप से जोड़ा गया स्थानीय ऑनबोर्डिंग और कारोबारी सॉफ़्टवेयर हर काम की अनुमति देते समय मालिक की मौजूदा पहुँच जाँचता है; साथ में भूमिका, साइट, सबूत और मंज़ूरी के नियम भी लागू होते हैं। आवेदन भेजने के बाद जाँच लंबित रहते काम हो सकता है। खारिज होने पर बदलाव या दोबारा आवेदन से रोक नहीं हटती; बाद की वैध, स्वतंत्र मंज़ूरी चाहिए। सेव किया हुआ एक्सपोर्ट व्यवस्था की जानकारी है, अनुमति नहीं; अनुमति की जाँच उपलब्ध न हो तो काम रुकता है। भविष्य के दूरस्थ एजेंट और कतार में रखे काम को चलाते समय यही जाँच करनी होगी। अलग पुरानी रसीद API अपने आप इस व्यवस्था से नहीं जुड़ती।'),
    },
    {
      id: 'ledger-ownership',
      q: t('How do evidence chains and separate ledgers fit together?', 'सबूत की कड़ी और अलग-अलग बही एक साथ कैसे काम करते हैं?'),
      a: t('The local ledger links originals, source references, actors, reviews and corrections to business events. Hash-chain checkpoints help detect changes when compared with an independently retained checkpoint; they do not make a claim true or prevent an administrator rewriting storage. Buyer and seller keep separate books linked by a shared job reference. The integration rule is one authoritative writer per business: imported invoices are views of source records, not permission to post them again. A specialist writer registry and importer are not built yet.', 'स्थानीय बही मूल सबूत, स्रोत के संदर्भ, काम करने वाले व्यक्ति, जाँच और सुधार को कारोबारी घटनाओं से जोड़ती है। हैश-कड़ी के चेकपॉइंट को अलग सुरक्षित रखी कॉपी से मिलाने पर बदलाव पकड़ने में मदद मिलती है; इससे दावा सच नहीं हो जाता, न ही डेटाबेस प्रशासक का बदलाव असंभव होता है। खरीदार और विक्रेता की बही अलग रहती है, काम का साझा संदर्भ उन्हें जोड़ता है। जोड़ने का नियम है: हर कारोबार की बही में लिखने वाला एक आधिकारिक सिस्टम हो। आयातित बिल मूल रिकॉर्ड का दृश्य है, दोबारा एंट्री की अनुमति नहीं। विशेषज्ञ एजेंट के लेखन-अधिकार की रजिस्ट्री और आयातक अभी नहीं बने हैं।'),
    },
    {
      id: 'uncertainty-review',
      q: t('What should happen when AI cannot read a slip or figures disagree?', 'AI पर्ची न पढ़ पाए या रकम का मिलान न हो तो क्या होना चाहिए?'),
      a: t('A future AI or OCR extraction must remain a proposal beside the original evidence. Missing units, unclear handwriting or conflicting amounts should produce a focused clarification or manual review, not an invented value. Business calculations and validation then run on the confirmed structured data. The local core already preserves conflicting evidence and linked corrections; a payment image alone cannot confirm settlement. OCR, model confidence handling and real document authentication still need their own integration and evaluation.', 'भविष्य में AI या OCR से पढ़ी गई जानकारी मूल सबूत के साथ एक प्रस्ताव के रूप में रहनी चाहिए। इकाई गायब हो, लिखावट अस्पष्ट हो या रकम अलग-अलग हो तो साफ़ सवाल या मानवीय जाँच होनी चाहिए, मनगढ़ंत संख्या नहीं। पुष्टि किए गए संरचित डेटा पर हिसाब और नियमों की जाँच चलेगी। स्थानीय सॉफ़्टवेयर विरोधी सबूत और उनसे जुड़े सुधार सँभालता है; केवल भुगतान की तस्वीर वसूली की पुष्टि नहीं कर सकती। OCR, मॉडल की अनिश्चितता सँभालने और असली दस्तावेज़ की पहचान के लिए अलग एकीकरण और मूल्यांकन अभी चाहिए।'),
    },
    {
      id: 'discovery-consent',
      q: t('How can discovery include businesses outside the agent network?', 'एजेंट नेटवर्क से बाहर के कारोबार खोज में कैसे शामिल होंगे?'),
      a: t('The local core can rank stored candidates by capability, area and freshness, and record a guest transaction without inventing a counterpart agent. The planned external discovery layer adds permitted sources and shows where each candidate came from. A listing is not confirmation of stock, price or permission to message. The owner needs an authorized introduction or contact route, then a confirmed quotation. Joining the network remains a separate optional decision. Live search providers and automated outreach are not connected.', 'स्थानीय सॉफ़्टवेयर दर्ज उम्मीदवारों को काम की योग्यता, क्षेत्र और जानकारी की ताज़गी के अनुसार क्रम दे सकता है और सामने वाले का काल्पनिक एजेंट बनाए बिना अतिथि लेन-देन दर्ज कर सकता है। प्रस्तावित बाहरी खोज अनुमत स्रोत जोड़ेगी और बताएगी कि उम्मीदवार कहाँ से मिला। सूची में नाम होना स्टॉक, कीमत या संदेश भेजने की अनुमति की पुष्टि नहीं है। मालिक को अधिकृत परिचय या संपर्क का तरीका, फिर पुष्टि किया कोटेशन चाहिए। नेटवर्क से जुड़ना अलग और वैकल्पिक फैसला रहेगा। असली खोज प्रदाता और अपने आप संपर्क करने की सुविधा अभी जुड़ी नहीं है।'),
    },
    {
      id: 'model-integration',
      q: t('Which AI model or provider API powers the experience?', 'यह अनुभव किस AI मॉडल या प्रदाता की API पर चलता है?'),
      a: t('This website does not call an AI model or provider API. It demonstrates the workflow with local sample data; the separate onboarding conversation also runs without a remote model. A future model adapter would interpret a request or document and return structured proposals to the business services. Permissions, monetary calculations and posting rules must stay in those services, rather than rely on model instructions. Provider selection, server-side credentials, evaluation, cost limits and approved data handling need to be configured before connecting that layer.', 'यह वेबसाइट किसी AI मॉडल या प्रदाता की API को नहीं बुलाती। स्थानीय नमूना डेटा से काम का तरीका दिखाती है; अलग ऑनबोर्डिंग संवाद भी दूरस्थ मॉडल के बिना चलता है। भविष्य का मॉडल अडैप्टर माँग या दस्तावेज़ समझकर कारोबारी सेवाओं को संरचित प्रस्ताव देगा। अनुमति, रकम का हिसाब और बही में लिखने के नियम उन सेवाओं में रहने चाहिए, केवल मॉडल के निर्देशों पर निर्भर नहीं। वह परत जोड़ने से पहले प्रदाता, सर्वर पर सुरक्षित पहचान-कुंजियाँ, मूल्यांकन, खर्च की सीमा और डेटा सँभालने की स्वीकृत व्यवस्था तय करनी होगी।'),
    },
    {
      id: 'built-today',
      q: t('What is working today, and what does this website actually run?', 'आज क्या बना हुआ है और यह वेबसाइट असल में क्या चलाती है?'),
      a: t('This static website runs business selectors, staged sample jobs, a fictional diary check and a local setup brief in your browser. Separately, the tested local backend provides persisted onboarding and review, an explicit current-access bridge, business workflows, evidence-linked private books, local discovery and an inbound A2A receiver. The website does not call those services. WhatsApp, real OTP delivery, live model/OCR services, bank confirmation and existing specialist agents remain separate connections. The interactive scenes illustrate those business relationships, not completed real-world jobs.', 'यह स्थिर वेबसाइट आपके ब्राउज़र में कारोबार का चुनाव, चरणों वाले नमूना काम, काल्पनिक डायरी की जाँच और स्थानीय सेटअप सार चलाती है। अलग, जाँचे गए स्थानीय बैकएंड में सेव होने वाली ऑनबोर्डिंग और समीक्षा, मौजूदा पहुँच की स्पष्ट जाँच, कारोबारी काम, सबूत से जुड़ी निजी बही, स्थानीय खोज और आने वाली A2A माँग का रिसीवर बने हैं। वेबसाइट उन सेवाओं को नहीं बुलाती। WhatsApp, असली OTP भेजना, लाइव मॉडल/OCR, बैंक की पुष्टि और पहले से बने विशेषज्ञ एजेंट अलग से जोड़ने हैं। इंटरैक्टिव दृश्य कारोबारी रिश्ते समझाते हैं; वे असली दुनिया में पूरा हुआ काम नहीं हैं।'),
    },
  ];
  const diary = {
    openingPaise: 1250000, receiptsPaise: 1800000, writtenClosingPaise: 750000,
    lines: [
      { id: 'labour', label: t('Labour advances', 'मज़दूरों को एडवांस'), amountPaise: 1400000 },
      { id: 'coal', label: t('Coal payment', 'कोयले का भुगतान'), amountPaise: 650000 },
      { id: 'diesel', label: t('Diesel', 'डीज़ल'), amountPaise: 200000 },
    ],
    correction: { id: 'loading', label: t('Missing loading slip', 'छूटी हुई लदाई की पर्ची'), amountPaise: 50000 },
  };
  function freeze(value) {
    Object.values(value).forEach(child => { if (child && typeof child === 'object') freeze(child); });
    return Object.freeze(value);
  }
  window.SITE_CONFIG = freeze({ whatsappNumber: '', email: '', siteUrl: '' });
  window.NirmanSiteData = freeze({ businesses, scenarios, stageLabels, faqs, diary });
}());
