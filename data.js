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
