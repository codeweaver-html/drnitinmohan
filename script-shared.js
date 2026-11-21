/* KidsGastro shared site bundle — clean rebuild.
   All editable route copy and menu entries are stored in SITE_CONFIG below. */

/* ===== BLOCK: SITE_CONFIG ===== */
const SITE_CONFIG = {
  basePath: "/",
  features: {
    animations: true,
    navStyle: "hamburger", // "hamburger" | "dropdown" | "inline"
    announcementBar: true,
    whatsappBooking: true,
    whatsappFloat: true,
    photoOfMonth: true,
    videoCarousel: true,
    galleryLightbox: true,
    footerShare: true,
    backToTop: true,
    newsletter: true,
    scrollProgress: true,
    offlineCache: true
  },
  contact: {
    phoneDisplay: "+91 98210 20576",
    phoneE164: "919821020576",
    email: "drnitinmohanpaedsgastro@gmail.com",
    maps: "https://www.google.com/maps?cid=9598972484913852260&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF",
    rezeptRx: "https://rezeptrx.com/dr/dr-nitin-mohan-pediatrician-hisar",
    recaptchaSiteKey: "6LfFKg4uAAAAAOxm7Evqvms6EGZHfO5AoulNITCc",
    recaptchaVerifyUrl: "https://drnitinmohan-backend.drnitinmohanpaedsgastro.workers.dev/api/recaptcha/verify"
  },
  nav: [
    { label: "About", path: "about.html" },
    { label: "Treatments", path: "treatments.html", children: [
      { label: "Paediatric Gastroenterology", path: "treatments.html" },
      { label: "Paediatric Hepatology — Liver Diseases", path: "treatments.html" },
      { label: "Paediatric Pancreatology — Pancreatic Disorders", path: "treatments.html" },
      { label: "Paediatric Biliary Tract Diseases", path: "treatments.html" },
      { label: "Paediatric Nutrition and Growth", path: "treatments.html" }
    ]},
    { label: "Services", path: "services.html", children: [
      { label: "Paediatric Gastrointestinal Procedures", path: "services.html" },
      { label: "Hepatology Procedures & Investigations", path: "services.html" },
      { label: "Pancreatic Investigations", path: "services.html" },
      { label: "Biliary Tract Investigations", path: "services.html" },
      { label: "Gastrointestinal Diagnostic Investigations", path: "services.html" },
      { label: "Nutrition & Growth Assessment", path: "services.html" }
    ]},
    { label: "FAQs", path: "faqs.html" },
    { label: "Blog", path: "blog.html" },
    { label: "Publication", path: "publications.html" },
    { label: "Testimonials", path: "testimonials.html" },
    { label: "Gallery", path: "gallery.html" },
    { label: "Contact Info", homeAnchor: "site-footer-mount" }
  ],
  content: {
    announcement: "OFFLINE APPOINTMENTS AVAILABLE RIGHT NOW. CLICK THE APPOINTMENT BUTTON BELOW TO PROCEED.",
    brand: "KidsGastro by Dr. Nitin Mohan",
    hospital: "Churamani Multispeciality Hospital",
    address: "Delhi Road, Camp Chowk, Krishna Nagar Colony, Hisar, Haryana 125001",
    footer: "Copyright © 2026 Dr. Nitin Mohan. All rights reserved.",
    home: {
      heroEyebrow: "Paediatric gastroenterology",
      heroTitle: "Specialist gastro care for children in Hisar",
      aboutParagraphOne: "Dr. Nitin Mohan is a Consultant Paediatric Gastroenterologist, Hepatologist and Nutritionist at Churamani Multispeciality Hospital, Hisar. His qualifications include MBBS, MD (Paediatrics), FISPGHAN and MNNF.",
      aboutParagraphTwo: "His academic and professional journey is associated with prestigious medical institutions, including PGIMS Rohtak, Sir Ganga Ram Hospital, New Delhi, and ABVIMS & Dr. RML Hospital, New Delhi. His clinical focus includes paediatric digestive disorders, liver diseases, pancreatic conditions, feeding difficulties, poor weight gain and nutritional problems.",
      aboutLink: "Why Dr. Nitin Mohan",
      storiesEyebrow: "Beyond the clinic",
      storiesHeading: "Clinical work & community education",
      storiesDescription: "Selected moments from clinical practice, professional education and community health awareness.",
      clinicalImageLabel: "Clinical work",
      clinicalStoryKicker: "01 · Clinical practice",
      clinicalStoryHeading: "Care centred on children and families",
      clinicalStoryDescription: "A glimpse of the clinical setting and the work that supports paediatric digestive health.",
      educationImageLabel: "Community education",
      educationStoryKicker: "02 · Community education",
      educationStoryHeading: "Health education session",
      educationStoryDescription: "Dr. Nitin Mohan speaking at a health education event.",
      photoImageLabel: "From KidsGastro",
      photoKicker: "KidsGastro moments",
      photoHeading: "Photo of the day",
      photoDescription: "A recent moment from KidsGastro.",
      socialEyebrow: "OFFICIAL PROFILES",
      socialHeading: "Stay connected with KidsGastro",
      socialDescription: "Follow clinic updates and explore professional profiles.",
      instagramLabel: "Instagram",
      instagramHandle: "@kidsgastro",
      instagramAction: "Visit Instagram profile ↗",
      linkedinLabel: "LinkedIn",
      linkedinName: "Dr. Nitin Mohan",
      linkedinAction: "View professional profile ↗",
      scholarLabel: "Google Scholar",
      scholarName: "Dr. Nitin Mohan",
      scholarAction: "View publications ↗",
      clinicEyebrow: "Find the clinic",
      clinicHeading: "Churamani Multispeciality Hospital",
      clinicAddress: "Delhi Road, Camp Chowk, Krishna Nagar Colony, Hisar, Haryana 125001",
      clinicPhotoCaption: "Hospital entrance",
      clinicMapAction: "Open in Google Maps ↗",
      newsletterHeading: "Newsletters",
      newsletterDescription: "Occasional updates and new resources from KidsGastro.",
      newsletterEmailLabel: "Enter your email address",
      newsletterSubmit: "Request updates"
    },
    pages: {"profile":{"path":"about","title":"About Dr. Nitin Mohan | KidsGastro, Hisar","description":"Learn about Dr. Nitin Mohan and his paediatric gastroenterology practice in Hisar.","html":"<span>Why Dr. Nitin Mohan</span><h1>Why Choose Dr. Nitin Mohan?</h1><div><div><article><h3>1. Specialist expertise in paediatric digestive and liver disorders</h3><p>Children have unique medical and nutritional needs. Dr. Nitin Mohan focuses on evaluating digestive, liver and nutritional conditions in the context of a child&rsquo;s age, growth, development and overall health.</p></article><article><h3>2. A systematic approach to diagnosis</h3><p>Recurrent abdominal pain, persistent vomiting, constipation, diarrhoea, jaundice and poor weight gain can have several underlying causes. Dr. Nitin Mohan aims to identify the likely cause through careful clinical assessment and appropriate investigations.</p></article><article><h3>3. A focus on growth and nutrition</h3><p>Digestive health is closely linked to a child&rsquo;s growth and development. Assessment may include dietary habits, growth patterns, feeding difficulties and nutritional requirements to help develop an appropriate treatment plan.</p></article><article><h3>4. Evidence-based, individualised treatment</h3><p>Every child is different. Dr. Nitin Mohan aims to provide treatment guided by clinical findings, relevant investigations and established medical recommendations, with follow-up tailored to each child&rsquo;s needs.</p></article><article><h3>5. Clear communication with parents</h3><p>Understanding a child&rsquo;s illness is an important part of treatment. Dr. Nitin Mohan emphasises explaining possible causes, recommended tests, treatment options and follow-up requirements in language parents can understand.</p></article><article><h3>6. Specialist investigations when indicated</h3><p>Selected digestive disorders may require investigations such as upper gastrointestinal endoscopy, colonoscopy, flexible sigmoidoscopy or gastrointestinal manometry, depending on the child&rsquo;s symptoms and clinical findings. These are recommended when medically appropriate and subject to availability.</p></article><article><h3>7. Commitment to academic and clinical development</h3><p>Dr. Nitin Mohan&rsquo;s professional background includes scientific publications, clinical audit and academic presentations, reflecting a commitment to continued learning and evidence-based clinical practice.</p></article></div><h2>A Commitment to Your Child&rsquo;s Wellbeing</h2><p>Dr. Nitin Mohan aims to help families understand their child&rsquo;s condition, receive an appropriate treatment plan and make informed decisions about their care, with attention to safety, comfort, nutrition and long-term wellbeing.</p><p>At Churamani Multispeciality Hospital, Hisar, families can seek specialist consultation for children with digestive, liver, pancreatic and nutritional concerns.</p></div>"},"faqs":{"path":"faqs","title":"Frequently Asked Questions | KidsGastro, Hisar","description":"Read common family questions about paediatric gastroenterology consultations and child digestive health.","html":"<span>Family information</span><h1>Frequently asked questions</h1><div><details><summary>How can I book an appointment?</summary><div><p>Select <strong>Book an appointment</strong> and choose <strong>Book via WhatsApp</strong> or <strong>Book via RezeptRx</strong>. For WhatsApp booking, enter your child&rsquo;s name and age, select a preferred date and an available 30-minute time slot, then choose <strong>Continue to WhatsApp</strong>. The floating WhatsApp button opens the same booking form.</p></div></details><details><summary>What are the clinic hours?</summary><div><p>The booking form displays available 30-minute appointment slots after you select a date. Select a date to see the available times, or choose <strong>Contact Info</strong> in the main navigation to jump to the homepage footer and call the clinic.</p></div></details><details><summary>Where is the clinic?</summary><div><p>Churamani Multispeciality Hospital, Delhi Road, Camp Chowk, Krishna Nagar Colony, Hisar, Haryana 125001. Use <strong>View location</strong> in the homepage footer to open Google Maps for directions.</p></div></details><details><summary>How can I contact the clinic?</summary><div><p>Select <strong>Contact Info</strong> in the main navigation to jump directly to the homepage footer, where the clinic phone number and Google Maps link are available. You can also use the footer or the floating WhatsApp button to start an appointment request.</p></div></details><h2>Appointments and Preparation</h2><details><summary>13. What should I bring to the consultation?</summary><div><p>Bring previous prescriptions, test reports, imaging reports, discharge summaries, current medication details and your child&rsquo;s growth records, if available. A brief record of symptoms, diet and bowel habits may also help.</p></div></details><details><summary>14. Are all investigations and procedures available at the hospital?</summary><div><p>Availability depends on the investigation, procedure, the child&rsquo;s age and clinical requirements. Contact the hospital to ask about the specific service you need.</p></div></details><details><summary>15. How can I book an appointment?</summary><div><p>Use the Book an appointment button or the floating WhatsApp button on this website to send an appointment request.</p><p>Hospital: Churamani Multispeciality Hospital, Camp Chowk, Delhi Road, Hisar, Haryana.</p></div></details><details><summary>Medical Disclaimer</summary><div><p>This FAQ provides general educational information and does not replace individual medical advice, diagnosis or treatment. Consult a qualified healthcare professional for advice specific to your child.</p></div></details></div>"},"hospital":{"path":"clinic","title":"Clinic Location & OPD Timings | KidsGastro, Hisar","description":"Find clinic location information and OPD timings for KidsGastro in Hisar.","html":"<span>Find the clinic</span><h1>Churamani Multispeciality Hospital</h1><p>Delhi Road, Camp Chowk, Krishna Nagar Colony<br/>Hisar, Haryana 125001</p><div><h2>Contact Info</h2><p>To request an appointment, select <strong>Book an appointment</strong> on the homepage and complete the booking form. For other enquiries, use the phone number in the homepage footer. The main navigation <strong>Contact Info</strong> link takes you directly there.</p><a href=\"https://www.google.com/maps?cid=9598972484913852260&amp;g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF\" rel=\"noopener noreferrer\" target=\"_blank\">View hospital map &nearrow;</a></div>"},"treatments":{"path":"treatments","title":"Paediatric Digestive Health & Treatments | KidsGastro, Hisar","description":"Information about children’s digestive and liver health concerns and consultation options at KidsGastro, Hisar.","html":"<div class=\"treatments-page\">\n  <header class=\"treatments-hero\">\n    <p class=\"treatments-eyebrow\">KidsGastro · Specialist paediatric care</p>\n    <h1>Paediatric digestive, liver and nutrition care</h1>\n    <p class=\"treatments-lead\">Dr. Nitin Mohan provides specialist care for children with digestive, liver, pancreatic, biliary and nutritional disorders at Churamani Multispeciality Hospital, Hisar.</p>\n    <nav class=\"treatments-jump\" aria-label=\"On this page\">\n      <a href=\"#treatment-gastro\">Gastroenterology</a>\n      <a href=\"#treatment-liver\">Liver diseases</a>\n      <a href=\"#treatment-pancreas\">Pancreatic disorders</a>\n      <a href=\"#treatment-biliary\">Biliary diseases</a>\n      <a href=\"#treatment-nutrition\">Nutrition and growth</a>\n    </nav>\n  </header>\n\n  <section class=\"treatment-section\" id=\"treatment-gastro\">\n    <div class=\"treatment-section-heading\">\n      <span class=\"treatment-number\">01</span>\n      <div>\n        <p class=\"treatment-kicker\">Digestive system</p>\n        <h2>Paediatric Gastroenterology</h2>\n        <p>Conditions affecting the oesophagus, stomach and intestines.</p>\n      </div>\n    </div>\n    <div class=\"treatment-topic-grid\">\n      <article class=\"treatment-topic\">\n        <h3>Digestive symptoms and common conditions</h3>\n        <ul>\n          <li>Recurrent abdominal pain</li>\n          <li>Chronic constipation and faecal soiling</li>\n          <li>Acute and chronic diarrhoea</li>\n          <li>Recurrent vomiting and nausea</li>\n          <li>Gastro-oesophageal reflux disease (GERD/GORD)</li>\n          <li>Abdominal bloating and excessive gas</li>\n          <li>Poor appetite and feeding difficulties</li>\n          <li>Gastrointestinal infections and worm infestations</li>\n        </ul>\n      </article>\n      <article class=\"treatment-topic\">\n        <h3>Specific gastrointestinal disorders</h3>\n        <ul>\n          <li>Coeliac disease</li>\n          <li>Irritable bowel syndrome (IBS)</li>\n          <li>Cow’s milk protein allergy and other food allergies</li>\n          <li>Gastritis and peptic ulcer disease</li>\n          <li>Crohn’s disease and ulcerative colitis (IBD)</li>\n          <li>Very-early-onset IBD (VEO-IBD)</li>\n          <li>Eosinophilic oesophagitis and other eosinophilic gastrointestinal disorders</li>\n          <li>Gastrointestinal bleeding</li>\n          <li>Malabsorption and protein-losing enteropathy</li>\n          <li>Gastrointestinal motility disorders</li>\n          <li>Congenital gastrointestinal abnormalities</li>\n        </ul>\n      </article>\n    </div>\n  </section>\n\n  <section class=\"treatment-section\" id=\"treatment-liver\">\n    <div class=\"treatment-section-heading\">\n      <span class=\"treatment-number\">02</span>\n      <div>\n        <p class=\"treatment-kicker\">Liver and bile processing</p>\n        <h2>Paediatric Hepatology — Liver Diseases</h2>\n        <p>Conditions affecting liver function, liver tissue and the body’s ability to process nutrients and waste products.</p>\n      </div>\n    </div>\n    <div class=\"treatment-topic-grid\">\n      <article class=\"treatment-topic\">\n        <h3>Jaundice, hepatitis and liver function</h3>\n        <ul>\n          <li>Jaundice and abnormal liver function tests</li>\n          <li>Hepatitis A, B, C, D and E</li>\n          <li>Drug-induced liver injury</li>\n          <li>Autoimmune hepatitis</li>\n          <li>Chronic hepatitis and chronic liver disease</li>\n          <li>Fatty liver disease (MASLD)</li>\n          <li>Neonatal hepatitis and neonatal cholestasis</li>\n        </ul>\n      </article>\n      <article class=\"treatment-topic\">\n        <h3>Other liver conditions</h3>\n        <ul>\n          <li>Wilson disease</li>\n          <li>Portal hypertension and oesophageal or gastric varices</li>\n          <li>Liver fibrosis and cirrhosis</li>\n          <li>Acute liver failure</li>\n          <li>Enlarged liver or spleen associated with liver disease</li>\n          <li>Glycogen storage diseases</li>\n          <li>Alpha-1 antitrypsin deficiency</li>\n          <li>Progressive familial intrahepatic cholestasis (PFIC)</li>\n          <li>Alagille syndrome</li>\n          <li>Autoimmune sclerosing cholangitis</li>\n          <li>Other genetic, metabolic and inherited liver diseases</li>\n          <li>Unexplained liver inflammation</li>\n          <li>Assessment and referral for liver transplantation when indicated</li>\n        </ul>\n      </article>\n    </div>\n  </section>\n\n  <section class=\"treatment-section\" id=\"treatment-pancreas\">\n    <div class=\"treatment-section-heading\">\n      <span class=\"treatment-number\">03</span>\n      <div>\n        <p class=\"treatment-kicker\">Pancreas and digestion</p>\n        <h2>Paediatric Pancreatology — Pancreatic Disorders</h2>\n        <p>Conditions affecting the pancreas, digestion and nutrient absorption.</p>\n      </div>\n    </div>\n    <article class=\"treatment-topic treatment-topic-wide\">\n      <ul class=\"treatment-list-columns\">\n        <li>Acute pancreatitis</li>\n        <li>Recurrent pancreatitis</li>\n        <li>Chronic pancreatitis</li>\n        <li>Pancreatic insufficiency and digestive enzyme deficiency</li>\n        <li>Pancreatic disorders causing malabsorption and poor growth</li>\n        <li>Pancreatic cysts</li>\n        <li>Hereditary and genetic pancreatitis</li>\n        <li>Congenital pancreatic abnormalities</li>\n        <li>Pancreaticobiliary disorders</li>\n      </ul>\n    </article>\n  </section>\n\n  <section class=\"treatment-section\" id=\"treatment-biliary\">\n    <div class=\"treatment-section-heading\">\n      <span class=\"treatment-number\">04</span>\n      <div>\n        <p class=\"treatment-kicker\">Gallbladder and bile ducts</p>\n        <h2>Paediatric Biliary Tract Diseases</h2>\n        <p>Conditions affecting the gallbladder, bile ducts and the flow of bile from the liver to the intestine.</p>\n      </div>\n    </div>\n    <article class=\"treatment-topic treatment-topic-wide\">\n      <ul class=\"treatment-list-columns\">\n        <li>Gallstones and biliary sludge</li>\n        <li>Bile duct obstruction and dilatation</li>\n        <li>Cholangitis and biliary infections</li>\n        <li>Congenital biliary tract abnormalities</li>\n        <li>Choledochal cysts</li>\n        <li>Neonatal cholestasis and impaired bile flow</li>\n        <li>Biliary atresia</li>\n        <li>Progressive familial intrahepatic cholestasis (PFIC)</li>\n        <li>Alagille syndrome</li>\n        <li>Other inherited bile duct disorders</li>\n        <li>Biliary complications associated with pancreatic and liver diseases</li>\n      </ul>\n    </article>\n  </section>\n\n  <section class=\"treatment-section\" id=\"treatment-nutrition\">\n    <div class=\"treatment-section-heading\">\n      <span class=\"treatment-number\">05</span>\n      <div>\n        <p class=\"treatment-kicker\">Healthy development</p>\n        <h2>Paediatric Nutrition and Growth</h2>\n        <p>Conditions affecting a child’s growth, feeding and nutritional health.</p>\n      </div>\n    </div>\n    <article class=\"treatment-topic treatment-topic-wide\">\n      <ul class=\"treatment-list-columns\">\n        <li>Poor weight gain and growth faltering</li>\n        <li>Undernutrition and malnutrition</li>\n        <li>Iron, vitamin and other nutritional deficiencies</li>\n        <li>Feeding difficulties and restricted food intake</li>\n        <li>Nutritional problems associated with chronic diarrhoea or malabsorption</li>\n        <li>Dietary management of coeliac disease and selected food allergies</li>\n        <li>Nutritional support in chronic liver and pancreatic diseases</li>\n        <li>Growth monitoring and individualised nutrition planning</li>\n      </ul>\n    </article>\n  </section>\n\n  <aside class=\"treatment-when-to-seek\" aria-labelledby=\"treatment-when-heading\">\n    <p class=\"treatment-kicker\">Guidance for parents</p>\n    <h2 id=\"treatment-when-heading\">When should parents seek specialist consultation?</h2>\n    <p>Consider a specialist consultation for persistent abdominal pain, recurrent vomiting, chronic diarrhoea, blood in stools, poor weight gain, prolonged jaundice, pale stools or unexplained abnormal liver function tests.</p>\n    <div class=\"treatment-urgent-note\">\n      <strong>Seek urgent medical assessment</strong>\n      <p>Urgent assessment is important for green vomiting, significant gastrointestinal bleeding, severe abdominal pain, marked dehydration, unusual drowsiness or jaundice accompanied by concerning symptoms. Jaundice with pale stools or dark urine in a young infant requires prompt evaluation.</p>\n    </div>\n  </aside>\n  <p class=\"treatments-footnote\">The conditions listed are areas for clinical assessment. The need for consultation, investigations or treatment depends on each child’s symptoms and clinical findings.</p>\n</div>"},"services":{"path":"services","title":"Paediatric Gastroenterology Services | KidsGastro, Hisar","description":"Explore paediatric gastroenterology consultation services at KidsGastro with Dr. Nitin Mohan in Hisar.","html":"<span>Services</span><h1>Paediatric investigations and services</h1><p>Dr. Nitin Mohan provides specialist paediatric gastroenterology, hepatology, pancreatic and biliary consultations at Churamani Multispeciality Hospital, Hisar. Relevant diagnostic investigations and procedures help evaluate digestive disorders, liver diseases, pancreatic conditions and biliary tract abnormalities in children.</p><div>\n<article><h2>1. Paediatric Gastrointestinal Procedures</h2><ul><li>Upper Gastrointestinal Endoscopy (UGIE)</li><li>Colonoscopy</li><li>Proctosigmoidoscopy</li><li>Endoscopic Variceal Ligation (EVL)</li><li>Endoscopic Dilatation</li><li>Double-Balloon Enteroscopy</li><li>Gastrointestinal Manometry</li><li>Oesophageal pH Monitoring (pH Metry)</li><li>Biofeedback Therapy</li></ul></article>\n<article><h2>2. Paediatric Hepatology Procedures and Investigations</h2><ul><li>FibroScan (Transient Elastography)</li><li>Liver Function Tests (LFT)</li><li>Total and Direct Bilirubin</li><li>AST (SGOT), ALT (SGPT), ALP and GGT</li><li>Serum Albumin and Total Protein</li><li>Serum Bile Acids</li><li>Hepatitis A and E IgM</li><li>Hepatitis B Surface Antigen and HBV DNA Quantification</li><li>Hepatitis C Antibody and HCV RNA Quantification</li><li>Liver Biopsy and Histopathological Examination</li><li>Autoimmune Liver Disease Investigations</li></ul></article>\n<article><h2>3. Pancreatic Investigations</h2><ul><li>Serum Amylase</li><li>Serum Lipase</li><li>CT Pancreatic Protocol, when clinically indicated</li></ul></article>\n<article><h2>4. Biliary Tract Investigations</h2><ul><li>Ultrasound Abdomen for hepatobiliary assessment</li><li>Abdominal Ultrasound with Doppler, when indicated</li><li>Liver Function and Bilirubin Assessment</li><li>Serum Bile Acids</li><li>Selected Contrast Gastrointestinal Studies, when indicated</li></ul></article>\n<article><h2>5. Gastrointestinal Diagnostic Investigations</h2><ul><li>Stool Routine Examination</li><li>Stool Occult Blood Test</li><li>Stool Culture and Sensitivity</li><li>Tissue Transglutaminase IgA (tTG-IgA) for Coeliac Disease</li><li>Total IgA</li><li>Histopathological Examination of Gastrointestinal Biopsy Specimens</li><li>Complete Blood Count (CBC), CRP and ESR when indicated</li><li>Vitamin B12, Vitamin D and Ferritin for selected nutritional assessments</li></ul></article>\n<article><h2>6. Paediatric Nutrition and Growth Assessment</h2><ul><li>Weight, Height and Growth-Chart Assessment</li><li>Evaluation of Growth Faltering and Poor Weight Gain</li><li>Nutritional Assessment in Chronic Gastrointestinal, Liver and Pancreatic Diseases</li><li>Investigation of Suspected Nutritional Deficiencies</li><li>Individualised Nutrition Planning and Follow-up</li></ul></article></div>\n<aside><h2>Important Information</h2><p>Investigations and procedures are selected according to the child&rsquo;s symptoms, clinical assessment and suspected diagnosis. Availability may vary by procedure and the child&rsquo;s age and clinical requirements. Please contact Churamani Multispeciality Hospital to confirm current availability.</p></aside>"},"publications":{"path":"publications","title":"Research & Publications | Dr. Nitin Mohan","description":"Explore research publications and academic work associated with Dr. Nitin Mohan.","html":"<span>Health Library</span><h1>Research Articles &amp; Publications by Dr. Nitin Mohan</h1><p>Dr. Nitin Mohan has contributed to paediatric medical literature through clinical case reports and research publications covering gastrointestinal disorders, pancreatic and biliary conditions, and complex paediatric presentations. This collection highlights his published work in medical journals.</p><div>\n<article><span>01</span><div><h2>BRAF V600E-Positive Non-Langerhans Cell Histiocytosis Presenting as Hemophagocytic Lymphohistiocytosis in a Young Child</h2><p>Kaul N, Singhal J, Arya V, Kalra M, Mohan N, Kotwal J. <em>The Indian Journal of Pediatrics.</em> 2026;93(11):1242.</p><p><a href=\"https://scholar.google.com/scholar?q=BRAF+V600E-Positive+Non-Langerhans+Cell+Histiocytosis+Presenting+as+Hemophagocytic+Lymphohistiocytosis+in+a+Young+Child\" rel=\"noopener noreferrer\" target=\"_blank\">Read the journal article</a><a href=\"https://scholar.google.com/citations?user=p9PYPvIAAAAJ&amp;hl=en\" rel=\"noopener noreferrer\" target=\"_blank\">Find on Google Scholar</a></p></div></article>\n<article><span>02</span><div><h2>Pancreaticopleural Fistula in Children: A Rare Case Report</h2><p><em>Journal of Pediatric Academy.</em> 2024.</p><p><a href=\"https://scholar.google.com/scholar?q=Pancreaticopleural+Fistula+in+Children%3A+A+Rare+Case+Report\" rel=\"noopener noreferrer\" target=\"_blank\">Find on Google Scholar</a></p></div></article>\n<article><span>03</span><div><h2>Chronic Vomiting and Dysphagia: An Unusual Cause</h2><p><em>Gastroenterology &amp; Hepatology Reports.</em> 2024;6(3):36&ndash;38.</p><p><a href=\"https://scholar.google.com/scholar?q=Chronic+Vomiting+and+Dysphagia%3A+An+Unusual+Cause\" rel=\"noopener noreferrer\" target=\"_blank\">Find on Google Scholar</a></p></div></article>\n<article><span>04</span><div><h2>Choledochal Cysts in Children: Clinical Spectrum</h2><p><em>Journal of Clinical and Experimental Hepatology.</em> 2023;13(Suppl):S107.</p><p><a href=\"https://scholar.google.com/scholar?q=Choledochal+Cysts+in+Children%3A+Clinical+Spectrum\" rel=\"noopener noreferrer\" target=\"_blank\">Find on Google Scholar</a></p></div></article>\n<article><span>05</span><div><h2>Early Atopic Sensitization in Recurrent Wheeze</h2><p><em>The Indian Journal of Pediatrics.</em> 2023;90(8):766&ndash;769.</p><p><a href=\"https://scholar.google.com/scholar?q=Early+Atopic+Sensitization+in+Recurrent+Wheeze\" rel=\"noopener noreferrer\" target=\"_blank\">Find on Google Scholar</a></p></div></article></div>"},"clinical":{"path":"clinical","title":"Clinical Practice | Dr. Nitin Mohan, KidsGastro","description":"Learn about the clinical practice and paediatric gastroenterology focus of Dr. Nitin Mohan.","html":"<span>Clinical work</span><h1>Clinical work and education</h1><p>An overview of clinical practice and professional education. Visit the dedicated gallery to view selected photographs.</p><a href=\"/gallery/\">View KidsGastro Gallery</a>"},"latest":{"path":"latest","title":"Latest Health Updates | KidsGastro","description":"Explore recent health and medical updates shared by KidsGastro.","html":"<span>News, video and audio</span><h1>Latest from KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/></h1><p>Updates and resources for families.</p><div><figure><img alt=\"Health education session\" decoding=\"async\" loading=\"lazy\" src=\"/assets/gastro%20talk.webp\"/>News stories &middot; Clinic and community updates</figure><figure><img alt=\"Clinical work\" decoding=\"async\" loading=\"lazy\" src=\"/assets/endo%20main%20pic.webp\"/>Latest videos &middot; Short videos for families</figure><figure><img alt=\"Dr. Nitin Mohan\" decoding=\"async\" loading=\"lazy\" src=\"/assets/main%20pic.webp\"/>Podcasts &middot; Conversations with Dr. Nitin Mohan</figure></div><a href=\"https://www.instagram.com/kidsgastro/\" rel=\"noopener noreferrer\" target=\"_blank\">Follow KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/> on Instagram &nearrow;</a>"},"newsletter":{"path":"newsletter","title":"KidsGastro Health Updates","description":"Explore health education updates from KidsGastro.","html":"<span>Family updates</span><h1>KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/> newsletter</h1><p>Clinic updates, new videos and family-focused resources from KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/>.</p><div><img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/><div><h2>Stay connected</h2><p>Follow the KidsGastro Instagram profile for the latest updates.</p><a href=\"https://www.instagram.com/kidsgastro/\" rel=\"noopener noreferrer\" target=\"_blank\">Visit Instagram &nearrow;</a></div></div>"},"socials":{"path":"socials","title":"KidsGastro on Social Media","description":"Find KidsGastro social media channels and educational content.","html":"<span>Official profiles</span><h1>Connect with KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/></h1><p>Official profiles for KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/> and Dr. Nitin Mohan.</p><div><a href=\"https://wa.me/919821020576?text=Hello%2C%20I%20would%20like%20to%20connect%20with%20KidsGastro.\" rel=\"noopener noreferrer\" target=\"_blank\"><span aria-hidden=\"true\">WA</span><span><b>WhatsApp</b><small>Message KidsGastro</small></span><span aria-hidden=\"true\">&nearrow;</span></a><a href=\"https://www.instagram.com/kidsgastro/\" rel=\"noopener noreferrer\" target=\"_blank\"><span><svg aria-hidden=\"true\"><rect height=\"18\" width=\"18\"></rect><circle></circle><circle></circle></svg></span><span><b>Instagram</b><small>@kidsgastro</small></span><span aria-hidden=\"true\">&nearrow;</span></a><a href=\"https://in.linkedin.com/in/dr-nitin-mohan-b91975175\" rel=\"noopener noreferrer\" target=\"_blank\"><span><svg aria-hidden=\"true\"><path></path></svg></span><span><b>LinkedIn</b><small>Dr. Nitin Mohan</small></span><span aria-hidden=\"true\">&nearrow;</span></a>\n<a href=\"https://scholar.google.com/citations?user=p9PYPvIAAAAJ&amp;hl=en\" rel=\"noopener noreferrer\" target=\"_blank\"><span><svg aria-hidden=\"true\"><path></path></svg></span><span><b>Google Scholar</b><small>Dr. Nitin Mohan</small></span><span aria-hidden=\"true\">&nearrow;</span></a></div>"},"blog":{"path":"blog","title":"Health Articles & Updates | KidsGastro","description":"Read health education articles and updates for families from KidsGastro.","html":"<span>KidsGastro Blog</span><h1>Latest Articles</h1><p>Research summaries on child health, prevention and paediatric care. Please read the original sources linked in each article.</p>\n<div>\n<article><div aria-label=\"Child vaccination and nutrition illustration\" role=\"img\"><span></span><span><i></i><b></b><em></em></span><span><b></b><i></i><i></i><strong>&checkmark;</strong><strong>&checkmark;</strong></span><span>CHILD HEALTH</span></div><div><p>India &middot; National health survey &middot; 2026</p><h2>India Reports Progress in Childhood Vaccination and Nutrition</h2><p>India&rsquo;s latest National Family Health Survey (NFHS-6), released in May 2026, reports encouraging improvements in childhood immunisation and nutrition. Full vaccination coverage among children aged 12&ndash;23 months increased from 83.8% to 87.1%. The survey also recorded&hellip;</p><p><time datetime=\"2026-10-26T10:42:00+05:30\">Published 26 October 2026 &middot; 10:42 AM IST</time></p><details><summary>Read article <span aria-hidden=\"true\">&nearrow;</span></summary><div><p>Nutritional indicators also showed progress. Stunting among children under five declined from 35.5% to 29.3%, while severe wasting decreased from 7.7% to 5.2%. These findings suggest improvements in several important dimensions of child health, although undernutrition remains a significant public health concern.</p><p>The results reinforce the importance of routine immunisation, breastfeeding support, appropriate complementary feeding and early identification of growth faltering. Healthcare professionals and families both have an essential role in ensuring that children receive timely preventive care.</p><p>However, national averages can conceal differences between states, districts and socioeconomic groups. Continued investment in primary healthcare, nutrition programmes and community-based follow-up will be necessary to sustain progress and reach vulnerable populations.</p><p>The key message is clear: improving child health requires not only access to treatment but also strong preventive healthcare from pregnancy through early childhood.</p><p>Source: <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2266600&amp;lang=2&amp;reg=3\" rel=\"noopener noreferrer\" target=\"_blank\">Press Information Bureau &mdash; NFHS-6, May 2026 &nearrow;</a></p></div></details></div></article>\n<article><div aria-label=\"Antibiotic resistance research illustration\" role=\"img\"><span></span><span>✣</span><span><b></b><i></i><i></i><strong>&checkmark;</strong><strong>&nearrow;</strong></span><span>RESEARCH UPDATE</span></div><div><p>India &middot; Infectious diseases &middot; April 2026</p><h2>Typhoid Antibiotic Resistance in India: New Research Offers Important Insights</h2><p>A 2026 study examining nearly five decades of data on typhoid fever in India has highlighted important changes in antibiotic resistance. Researchers found that multidrug-resistant Salmonella Typhi, which was a major concern in earlier decades, has&hellip;</p><p><time datetime=\"2026-10-21T16:18:00+05:30\">Published 21 October 2026 &middot; 4:18 PM IST</time></p><details><summary>Read article <span aria-hidden=\"true\">&nearrow;</span></summary><div><p>These findings demonstrate why antibiotic selection must be guided by current evidence rather than historical prescribing habits. A medicine that was effective in the past may no longer provide reliable treatment when bacterial resistance changes. Conversely, some older antibiotics may regain a role when laboratory testing confirms susceptibility.</p><p>For clinicians, blood culture and antimicrobial susceptibility testing can help guide appropriate treatment wherever feasible. Local resistance patterns are particularly important because bacterial susceptibility may vary across regions and healthcare settings.</p><p>Prevention remains equally essential. Typhoid vaccination, safe drinking water, sanitation, hand hygiene and food safety can reduce transmission and the need for antibiotic treatment.</p><p>The study does not mean that antibiotics should be changed routinely or that older drugs are suitable for every patient. Treatment decisions must remain individualised and follow current clinical guidance.</p><p>The broader lesson is that continuous resistance surveillance and responsible antibiotic use are essential to preserving effective treatments for future generations.</p><p>Source: <a href=\"https://www.lshtm.ac.uk/newsevents/news/2026/new-study-shows-shifting-typhoid-resistance-india\" rel=\"noopener noreferrer\" target=\"_blank\">London School of Hygiene &amp; Tropical Medicine &mdash; Typhoid resistance in India &nearrow;</a></p></div></details></div></article>\n<article><div aria-label=\"Paediatric clinical research illustration\" role=\"img\"><span></span><span><b>LAB</b><i></i><i></i><i></i><strong>+</strong></span><span>⌁</span><span>PAEDIATRIC RESEARCH</span></div><div><p>India &middot; Paediatric research &middot; October 2026</p><h2>Childhood Scrub Typhus: Can Early Laboratory Markers Predict Severe Illness?</h2><p>Scrub typhus remains an important cause of acute febrile illness in children across South Asia. A study published in October 2026 examined children admitted with confirmed scrub typhus to a tertiary-care centre in South India, investigating&hellip;</p><p><time datetime=\"2026-10-15T09:26:00+05:30\">Published 15 October 2026 &middot; 9:26 AM IST</time></p><details><summary>Read article <span aria-hidden=\"true\">&nearrow;</span></summary><div><p>The researchers studied 181 children aged 1&ndash;14 years. Critical deterioration occurred in 34.3% of the cohort, using a composite outcome that included complications such as shock, acute respiratory distress syndrome and multiple organ dysfunction. Among the children who experienced critical deterioration, the reported case fatality rate was 12.9%.</p><p>Several admission findings were associated with worsening illness, including an elevated neutrophil-to-lymphocyte ratio, increased C-reactive protein, lower serum sodium and delays in starting doxycycline. Serum albumin also showed strong discriminatory performance in the study&rsquo;s initial analyses.</p><p>These findings may help clinicians identify children who require closer monitoring and timely assessment for complications. Nevertheless, the study was retrospective and conducted at a single tertiary-care centre. Its predictive model requires external validation before routine clinical use.</p><p>Clinicians should not rely on any single laboratory marker to determine severity or treatment. Clinical examination, haemodynamic status, organ function and the overall pattern of illness remain essential.</p><p>The study highlights the importance of early recognition, appropriate antimicrobial treatment and careful monitoring of children with suspected severe scrub typhus.</p><p>Source: <a href=\"https://pubmed.ncbi.nlm.nih.gov/42875176/\" rel=\"noopener noreferrer\" target=\"_blank\">PubMed &mdash; Clinical and biochemical determinants of critical deterioration in paediatric scrub typhus &nearrow;</a></p></div></details></div></article>\n<article><div aria-label=\"Vaccination and respiratory health illustration\" role=\"img\"><span></span><span>&checkmark;</span><span>)))</span><span>VACCINE-PREVENTABLE</span></div><div><p>Global &middot; Vaccine-preventable diseases &middot; 2026</p><h2>Whooping Cough Worldwide: Why Pertussis Surveillance Still Matters</h2><p>Pertussis, commonly known as whooping cough, continues to be an important vaccine-preventable respiratory infection worldwide. A global burden study published in October 2026 in Nature Medicine analysed pertussis estimates covering 1990&ndash;2023, providing an updated perspective on&hellip;</p><p><time datetime=\"2026-10-08T14:37:00+05:30\">Published 8 October 2026 &middot; 2:37 PM IST</time></p><details><summary>Read article <span aria-hidden=\"true\">&nearrow;</span></summary><div><p>Pertussis is caused by Bordetella pertussis and spreads through respiratory droplets and close contact. Although infection can affect people of any age, infants are particularly vulnerable to severe complications, including pneumonia, apnoea and hospitalisation. Early symptoms may resemble a common cold before persistent coughing develops.</p><p>The findings reinforce the importance of maintaining high vaccination coverage and reliable disease surveillance. Routine childhood immunisation remains central to prevention, while vaccination during pregnancy, where recommended under national guidelines, can help protect young infants before they complete their own vaccine series.</p><p>Healthcare professionals should remain alert to suspected pertussis in infants with coughing episodes, breathing pauses or feeding difficulties, particularly when there is a history of exposure. Testing and treatment decisions should follow applicable clinical guidance.</p><p>Global estimates are valuable for identifying changes in disease burden and gaps in prevention, but they do not replace local surveillance data. Differences in testing, reporting and healthcare access can affect comparisons between countries.</p><p>The central message is that vaccine-preventable diseases require continued attention even when effective vaccines are available. High coverage, early recognition and timely public health action remain essential.</p><p>Source: <a href=\"https://www.nature.com/articles/s41591-026-04660-8\" rel=\"noopener noreferrer\" target=\"_blank\">Nature Medicine &mdash; Global burden of pertussis, 1990&ndash;2023 &nearrow;</a></p></div></details></div></article>\n<article><div aria-label=\"Artificial intelligence in paediatrics illustration\" role=\"img\"><span></span><span><b>AI</b><i></i><i></i><i></i></span><span>✧</span><span>HEALTH TECHNOLOGY</span></div><div><p>Global &middot; Medical education and technology &middot; 2026</p><h2>Artificial Intelligence in Paediatrics: Helpful Assistant or Clinical Risk?</h2><p>Artificial intelligence is increasingly being explored as a tool for medical education, clinical decision support and patient communication. A comparative study published in 2026 in Pediatric Research evaluated the performance of large language models in paediatric&hellip;</p><p><time datetime=\"2026-10-02T11:05:00+05:30\">Published 2 October 2026 &middot; 11:05 AM IST</time></p><details><summary>Read article <span aria-hidden=\"true\">&nearrow;</span></summary><div><p>Such research addresses an important question: can AI systems provide sufficiently accurate explanations of childhood infections to support learning and clinical reasoning? These tools can summarise medical information, generate practice questions and help learners organise complex topics. However, their ability to produce convincing explanations does not guarantee clinical accuracy.</p><p>Paediatrics presents particular challenges because diagnosis and treatment often depend on age, weight, developmental stage and rapidly changing clinical status. An incorrect medication dose or missed warning sign can have serious consequences. AI systems may also overlook unusual presentations, reproduce biases in training data or provide outdated recommendations.</p><p>For these reasons, AI should complement rather than replace established clinical resources, professional judgement and direct patient assessment. Medical students and doctors should verify recommendations against trusted guidelines, current evidence and local protocols.</p><p>Before AI tools are incorporated into clinical workflows, they require appropriate validation, privacy safeguards and monitoring for errors. Educational performance alone is not proof of improved patient outcomes.</p><p>The future of AI in paediatrics will depend not simply on more capable models, but on safe implementation and accountability. Used carefully, AI may support learning and efficiency while keeping clinicians responsible for decisions that affect children&rsquo;s health.</p><p>Source: <a href=\"https://www.nature.com/articles/s41390-026-05578-0\" rel=\"noopener noreferrer\" target=\"_blank\">Pediatric Research &mdash; Large language models in paediatric infectious disease education &nearrow;</a></p></div></details></div></article>\n</div><p>These posts are research summaries, not independent clinical guidelines. Verify the original papers, methods and findings before relying on specific results for clinical decisions.</p>"},"gallery":{"path":"gallery","title":"Clinic & Clinical Gallery | KidsGastro, Hisar","description":"View the KidsGastro gallery featuring clinical practice, health education and clinic-related images.","html":"<div><div><div><span>KidsGastro gallery</span><h1>KidsGastro Photo Gallery</h1><p>A selection of clinical work, hospital and clinic settings, professional education, and family-friendly moments.</p></div></div><div><article><figure><img alt=\"Clinical work and endoscopy equipment\" aria-label=\"Open photo: Endoscopy Equipment\" decoding=\"async\" loading=\"lazy\" role=\"button\" src=\"/assets/endo%20gallery%20pic.webp\"/><figcaption>Endoscopy Equipment</figcaption></figure></article><article><figure><img alt=\"Dr. Nitin Mohan\" aria-label=\"Open photo: Doctor Portrait\" decoding=\"async\" loading=\"lazy\" role=\"button\" src=\"/assets/potrait%20gallery.jpg\"/><figcaption>Doctor Portrait</figcaption></figure></article><article><figure><img alt=\"A family visit with a child\" aria-label=\"Open photo: Family Visit\" decoding=\"async\" loading=\"lazy\" role=\"button\" src=\"/assets/baby%20pic.webp\"/><figcaption>Family Visit</figcaption></figure></article></div><p>Images are shared to introduce the clinic and its work. Clinical images are for general information and do not replace individual medical advice.</p></div>"},"testimonials":{"path":"testimonials","title":"Family Feedback | KidsGastro, Hisar","description":"Read feedback displayed on the KidsGastro website.","html":"<span>Testimonials</span><h1>Patient &amp; Family Testimonials</h1><p>More patient and family experiences shared with the clinic.</p><div id=\"page-testimonials-anchor-4\"><h3>More testimonials</h3><div><article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;I had severe abdominal pain, and many doctors in Sirsa could not manage it. Doctor Nitin Mohan is highly professional and dedicated, treated me well, and is the best gastroenterologist in Sirsa and the adjoining areas.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;I was in pain, and another doctor suggested intestinal surgery. Then I met Doctor Nitin Mohan. He gave me superb treatment, and now I am perfectly all right.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Doctor Nitin Mohan ji treated my daughter very well during her dengue admission with a high infection. Even for midnight emergencies, his presence in the room within 5 minutes is commendable.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My child had severe anemia, and Doctor Nitin Mohan is a very nice person. My child is now doing extremely well. Thank you, sir.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;We highly recommend Doctor Nitin Mohan for any pediatric disease. My child had severe hepatitis A and is now doing great. Thank you, sir.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My child had persistent abdominal pain for years, and medicines from many doctors gave no relief. Doctor Nitin Mohan treated him really well, and he is doing well now.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My child had severe abdominal pain, and many doctors showed no improvement. Doctor Nitin Mohan treated him well, and he is now perfectly normal.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Dr. Nitin Mohan was extremely thorough, friendly, and helpful in diagnosing and treating my stomach condition. He listened to our concerns and explained everything, and the care was outstanding.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My child had severe abdominal pain and constipation for 2 months. The doctor treated my child really well, and he is currently in very good condition.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Doctor Nitin Mohan is a very intelligent, professional, and experienced child gastroenterologist. Thank you for making my child smile again.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My experience with Doctor Nitin Mohan is awesome. He is a very humble and caring doctor, and his services are top-notch. I will suggest other parents see him for any pediatric-related issues.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My experience with Doctor Nitin Mohan is very nice, and I will recommend him to others. He is a very warm-hearted doctor.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Dr. Nitin Mohan is such a good doctor. He treated patients like his own family members and gave very good treatment too.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Thank you, Dr. Nitin Mohan, for caring for my child. Dr. Nitin Mohan is very intelligent and professional.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;It's a very great experience with Dr. Nitin Mohan. He is a very kind-hearted and nice person. I am always grateful. ☺☺☺☺☺&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Dr. Nitin Mohan is very humble, and he treated me really well. I am very happy.&rdquo;</p></article></div></div>"}}
  }
};
/* ===== END BLOCK: SITE_CONFIG ===== */

(() => {
  "use strict";
  const root = document.documentElement;
  const body = document.body;
  const feature = name => SITE_CONFIG.features[name] !== false;
  const EXISTING_HTML_PAGES = new Set([
    "404", "about", "admin", "blog", "clinic", "clinical", "faqs", "gallery",
    "index", "latest", "newsletter", "publications", "services", "socials",
    "testimonials", "treatments", "updates"
  ]);
  const configuredBase = String(SITE_CONFIG.basePath || "/");
  /* All public HTML files and shared assets are at the website root. Local file
     previews therefore use ./ while the live custom domain uses /. */
  const basePath = window.location.protocol === "file:"
    ? "./"
    : (configuredBase.endsWith("/") ? configuredBase : configuredBase + "/");
  const asset = path => basePath + String(path).replace(/^\/+/, "");
  const pageSlug = slug => String(slug).replace(/^\/+|\/+$/g, "").replace(/\.html$/i, "");
  const routePath = slug => {
    const clean = pageSlug(slug);
    return asset((EXISTING_HTML_PAGES.has(clean) ? clean : "index") + ".html");
  };
  const safeText = value => String(value == null ? "" : value);
  const escapeHtml = value => safeText(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[ch]));
  const currentFile = String(window.location.pathname || "").split("/").pop().replace(/\.html?$/i, "").toLowerCase();
  let activePage = body.dataset.sitePage || (currentFile && currentFile !== "index" ? currentFile : "home");
  root.dataset.navStyle = SITE_CONFIG.features.navStyle;

  function ensureSharedAssets() {
    const sharedStylesheet = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .find(link => /(?:^|\/)style-shared\.css(?:[?#]|$)/i.test(link.getAttribute("href") || ""));
    if (sharedStylesheet) {
      sharedStylesheet.href = asset("style-shared.css");
      /* Keep shared navigation/footer/booking rules after local styles so the
         common shell remains consistent across every subsite. */
      document.head.append(sharedStylesheet);
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = asset("style-shared.css");
      link.dataset.kgSharedStyles = "true";
      document.head.append(link);
    }
    const icons = [...document.querySelectorAll('link[rel~="icon"]')];
    if (icons.length) icons.forEach(icon => { icon.href = asset("favicon.ico"); });
    else {
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.href = asset("favicon.ico");
      icon.sizes = "any";
      document.head.append(icon);
    }
  }

  /* ===== BLOCK: HEADER_FOOTER ===== */
  const homeUrl = () => asset("index.html");
  const hrefFor = item => {
    if (item.href) return item.href;
    if (item.homeAnchor) return `#${encodeURIComponent(item.homeAnchor)}`;
    return routePath(item.path || "index.html");
  };

  function ensureSharedShell() {
    let announcementMount = document.getElementById("site-announcement-mount");
    let headerMount = document.getElementById("site-header-mount");
    let footerMount = document.getElementById("site-footer-mount");
    const main = document.getElementById("site-main") || document.querySelector("main");

    if (!announcementMount) {
      announcementMount = document.createElement("div");
      announcementMount.id = "site-announcement-mount";
      const skip = body.querySelector(".site-skip");
      if (skip) skip.insertAdjacentElement("afterend", announcementMount);
      else body.insertBefore(announcementMount, body.firstChild);
    }
    if (!headerMount) {
      headerMount = document.createElement("div");
      headerMount.id = "site-header-mount";
      if (announcementMount.isConnected) announcementMount.insertAdjacentElement("afterend", headerMount);
      else if (main) body.insertBefore(headerMount, main);
      else body.insertBefore(headerMount, body.firstChild);
    }
    if (!footerMount) {
      footerMount = document.createElement("div");
      footerMount.id = "site-footer-mount";
      if (main) main.insertAdjacentElement("afterend", footerMount);
      else body.append(footerMount);
    }
  }

  function renderNav() {
    const renderItem = item => {
      const label = escapeHtml(item.label);
      const description = item.description ? `<small>${escapeHtml(item.description)}</small>` : "";
      if (Array.isArray(item.children) && item.children.length) {
        const children = item.children.map(child => `<a href="${escapeHtml(hrefFor(child))}" data-site-link>${escapeHtml(child.label)}${child.description ? `<small>${escapeHtml(child.description)}</small>` : ""}</a>`).join("");
        return `<details class="site-nav-group"><summary>${label}<span aria-hidden="true">⌄</span></summary><div class="site-nav-submenu">${children}</div></details>`;
      }
      return `<a href="${escapeHtml(hrefFor(item))}" data-site-link>${label}${description}</a>`;
    };
    const links = SITE_CONFIG.nav.map(renderItem).join("");
    const bookingAction = feature("whatsappBooking")
      ? `<button class="site-booking-nav-trigger" type="button" data-open-booking>Book an appointment</button>`
      : "";
    /* The public Login link is intentionally last. admin.html performs the
       existing first-stage authentication and redirects to updates.html. */
    const loginAction = `<a class="site-nav-login" href="${escapeHtml(asset("admin.html"))}" data-site-link><span aria-hidden="true">⌑</span> Login</a>`;
    return `<nav class="site-navigation" aria-label="Main navigation">
      <a class="site-brand" href="${escapeHtml(homeUrl())}" aria-label="KidsGastro home">
        <img src="${asset("assets/kg%20logo.webp")}" alt="KidsGastro logo" width="54" height="54">
        <span>${escapeHtml(SITE_CONFIG.content.brand)}</span>
      </a>
      <button class="site-nav-trigger" type="button" aria-controls="site-nav-links" aria-expanded="false" aria-label="Open navigation">☰</button>
      <div class="site-nav-links" id="site-nav-links">${links}${bookingAction}${loginAction}</div>
    </nav>`;
  }

  function initHeaderFooter() {
    const headerMount = document.getElementById("site-header-mount");
    if (headerMount) headerMount.innerHTML = `<header class="kg-rebuild-header">${renderNav()}</header>`;
    const footerMount = document.getElementById("site-footer-mount");
    if (footerMount) {
      footerMount.innerHTML = `<footer class="site-footer">
        <div class="site-footer-contact"><div class="site-container site-footer-grid">
          <div><strong>${escapeHtml(SITE_CONFIG.content.hospital)}</strong><p>Hisar, Haryana · Appointment enquiries welcome</p><a href="${escapeHtml(SITE_CONFIG.contact.maps)}" target="_blank" rel="noopener noreferrer">View location ↗</a></div>
          <div><strong>Phone</strong><a href="tel:+${SITE_CONFIG.contact.phoneE164}">${escapeHtml(SITE_CONFIG.contact.phoneDisplay)}</a></div>
          <div id="site-footer-share-mount"></div>
        </div></div>
        <div class="site-container site-footer-bottom"><a class="site-footer-brand" href="${escapeHtml(homeUrl())}" aria-label="KidsGastro home"><img src="${asset("assets/kg%20logo.webp")}" alt="KidsGastro logo" width="50" height="50"><span>KidsGastro<small>Paediatric Gastroenterology · Dr. Nitin Mohan</small></span></a><p>${escapeHtml(SITE_CONFIG.content.footer)}</p><a href="#site-main">Back to top ↑</a></div>
      </footer>`;
    }
  }
  /* ===== END BLOCK: HEADER_FOOTER ===== */

  function initBrandLogoLinks() {
    const home = homeUrl();
    document.querySelectorAll("img").forEach(image => {
      const source = image.getAttribute("src") || "";
      const alt = image.getAttribute("alt") || "";
      const isBrandLogo = /kg(?:%20|\s)logo\.webp/i.test(source) || /kidsgastro\s+logo/i.test(alt);
      if (!isBrandLogo) return;
      const existingLink = image.closest("a");
      if (existingLink) {
        existingLink.href = home;
        existingLink.removeAttribute("target");
      } else {
        const link = document.createElement("a");
        link.className = "kg-logo-link";
        link.href = home;
        link.setAttribute("aria-label", "KidsGastro home");
        image.parentNode.insertBefore(link, image);
        link.append(image);
      }
      image.draggable = false;
    });
  }



  /* ===== BLOCK: NAV ===== */
  function setNavOpen(open) {
    const nav = document.querySelector(".site-navigation");
    const trigger = nav && nav.querySelector(".site-nav-trigger");
    const links = nav && nav.querySelector(".site-nav-links");
    if (!nav || !trigger || !links) return;
    nav.dataset.open = String(Boolean(open));
    trigger.setAttribute("aria-expanded", String(Boolean(open)));
    trigger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  }

  function initNav() {
    const nav = document.querySelector(".site-navigation");
    if (!nav) return;
    const trigger = nav.querySelector(".site-nav-trigger");
    trigger.addEventListener("click", () => {
      const open = nav.dataset.open !== "true";
      setNavOpen(open);
    });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target)) {
        nav.querySelectorAll(".site-nav-group[open]").forEach(group => group.open = false);
        if (nav.dataset.open === "true") setNavOpen(false);
      }
      if (event.target.closest(".site-nav-links a, .site-booking-nav-trigger")) setNavOpen(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.dataset.open === "true") {
        setNavOpen(false);
        trigger.focus();
      }
    });
  }
  /* ===== END BLOCK: NAV ===== */

  /* ===== BLOCK: PAGE_ROUTING ===== */
  function initPage() {
    if (activePage === "home") return;
    const pages = SITE_CONFIG.content.pages || {};
    const config = pages[activePage] || Object.values(pages).find(page => page.path === pageSlug(activePage));
    const target = document.getElementById("site-page-content");
    const main = document.getElementById("site-main");
    if (!target || !main) return;
    if (!config) {
      target.innerHTML = `<section><h1>[ENTER TEXT: page heading for ${escapeHtml(activePage)}]</h1><p>[ENTER TEXT: content for this page]</p></section>`;
      return;
    }
    target.innerHTML = config.html;
    target.querySelectorAll("a[href^='/']").forEach(link => {
      const href = link.getAttribute("href");
      const clean = href.replace(/^\/+|\/+$/g, "");
      const route = pageSlug(clean);
      link.setAttribute("href", EXISTING_HTML_PAGES.has(route) ? routePath(route) : asset(clean));
    });
    target.querySelectorAll("img[src^='/']").forEach(image => {
      image.setAttribute("src", asset(image.getAttribute("src")));
    });
    document.title = config.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && config.description) description.content = config.description;
    main.classList.add("site-page-main");
  }
  /* ===== END BLOCK: PAGE_ROUTING ===== */

  /* ===== BLOCK: HOME_CONTENT ===== */
  function initHomeContent() {
    if (activePage !== "home") return;
    const values = SITE_CONFIG.content.home || {};
    document.querySelectorAll("[data-site-copy]").forEach(element => {
      const key = element.dataset.siteCopy;
      if (Object.prototype.hasOwnProperty.call(values, key)) element.textContent = values[key];
    });
  }
  /* ===== END BLOCK: HOME_CONTENT ===== */

  /* ===== BLOCK: ANNOUNCEMENT ===== */
  function initAnnouncement() {
    if (!feature("announcementBar")) return;
    const mount = document.getElementById("site-announcement-mount");
    if (!mount) return;
    const text = escapeHtml(SITE_CONFIG.content.announcement);
    mount.innerHTML = `<div class="site-announcement" role="region" aria-label="KidsGastro announcement"><div class="site-announcement-track"><span>${text}</span><span aria-hidden="true">${text}</span><span aria-hidden="true">${text}</span><span aria-hidden="true">${text}</span></div></div>`;
  }
  /* ===== END BLOCK: ANNOUNCEMENT ===== */

  /* ===== BLOCK: BOOKING ===== */
  function initBooking() {
    const picker = document.querySelector(".appointment-picker");
    if (!feature("whatsappBooking")) {
      if (picker) picker.hidden = true;
      const existingDialog = document.getElementById("kg-rb-booking-dialog");
      if (existingDialog) existingDialog.hidden = true;
      return;
    }
    if (picker) picker.hidden = false;

    const bookingMarkup = `
      <form id="booking-form" class="booking-form" novalidate>
        <div class="booking-head"><div><p class="site-eyebrow">WhatsApp appointment</p><h2 id="kg-rb-booking-heading">Appointment details</h2></div><button type="button" class="dialog-close" data-close-booking aria-label="Close appointment form">×</button></div>
        <div class="booking-fields">
          <label>Child’s name<input id="booking-child-name" name="childName" type="text" autocomplete="name" required></label>
          <label>Child’s age<input id="booking-child-age" name="childAge" type="number" min="0" max="18" step="0.1" required><span>years</span></label>
          <label>Phone Number<input id="booking-phone" name="phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" required></label>
          <label>Preferred date<input id="booking-date" name="date" type="date" required><small>Choose today or tomorrow.</small></label>
          <label>Preferred time (30-minute slots)<select id="booking-time" name="time" required disabled><option value="">Select a date first to see available 30-minute appointment slots.</option></select></label>
        </div>
        <p class="captcha-disclosure">This site is protected by reCAPTCHA. Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms of Service</a> apply.</p>
        <p id="booking-error" class="site-status" aria-live="polite"></p>
        <div id="recaptcha-slot" aria-hidden="true"></div>
        <div class="booking-actions"><button type="button" class="site-button site-button-secondary" data-close-booking>Cancel</button><button type="submit" class="site-button site-button-primary" id="booking-submit">Continue to WhatsApp</button></div>
      </form>`;

    let dialog = document.getElementById("kg-rb-booking-dialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "kg-rb-booking-dialog";
      dialog.id = "kg-rb-booking-dialog";
      dialog.setAttribute("aria-labelledby", "kg-rb-booking-heading");
      dialog.innerHTML = bookingMarkup;
      body.append(dialog);
    } else if (!dialog.querySelector("#booking-form")) {
      dialog.innerHTML = bookingMarkup;
    }

    let floatingButton = document.getElementById("floating-booking");
    if (!floatingButton) {
      floatingButton = document.createElement("button");
      floatingButton.className = "floating-booking";
      floatingButton.id = "floating-booking";
      floatingButton.type = "button";
      floatingButton.hidden = true;
      floatingButton.setAttribute("aria-label", "Book via WhatsApp");
      floatingButton.textContent = "Book via WhatsApp";
      body.append(floatingButton);
    }

    const form = dialog.querySelector("#booking-form");
    const trigger = document.getElementById("appointment-trigger");
    const options = document.getElementById("appointment-options");
    const dateInput = dialog.querySelector("#booking-date");
    const timeSelect = dialog.querySelector("#booking-time");
    const error = dialog.querySelector("#booking-error");
    const submit = dialog.querySelector("#booking-submit");
    if (!form || !dateInput || !timeSelect || !error || !submit) return;

    let recaptchaWidget = null;
    let recaptchaLoading = null;
    let recaptchaResolver = null;
    let requestInProgress = false;
    let attemptId = 0;
    let activeVerifyController = null;
    let lastOpener = null;
    const badgeSlots = ["site-captcha-top-left", "site-captcha-top-right", "site-captcha-bottom-left", "site-captcha-bottom-right"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const todayKey = dateKey(today);
    const tomorrowKey = dateKey(tomorrow);
    dateInput.min = todayKey;
    dateInput.max = tomorrowKey;

    const bookedSlotsByWeekday = { 0:[660,750], 1:[540,1050], 2:[810,1020], 3:[570,1050], 4:[780,1020], 5:[540,1050], 6:[810,1020] };
    function isDialogOpen() { return Boolean(dialog.open || dialog.hasAttribute("open")); }
    function weekdayForKey(key) { const [y,m,d] = key.split("-").map(Number); return new Date(y, m - 1, d).getDay(); }
    function allowedWindows(key) { return weekdayForKey(key) === 0 ? [[600,840]] : [[540,840],[960,1080]]; }
    function isBooked(key, mins) { return (bookedSlotsByWeekday[weekdayForKey(key)] || []).includes(mins); }
    function asClock(total) {
      const h24 = Math.floor(total / 60), min = total % 60, h = h24 % 12 || 12, period = h24 >= 12 ? "PM" : "AM";
      return { h, min, period, text: `${String(h).padStart(2,"0")}:${String(min).padStart(2,"0")}` };
    }
    function rangeLabel(start, end) {
      const a = asClock(start), b = asClock(end);
      return a.period === b.period ? `${a.text}–${b.text} ${b.period}` : `${a.text} ${a.period}–${b.text} ${b.period}`;
    }
    function renderSlots(key) {
      timeSelect.replaceChildren();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = key ? "Choose a 30-minute slot" : "Select a date first to see available 30-minute appointment slots.";
      timeSelect.append(placeholder);
      timeSelect.disabled = !key;
      if (!key) return;
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      for (const [start, end] of allowedWindows(key)) {
        for (let mins = start; mins < end; mins += 30) {
          const option = document.createElement("option");
          option.value = String(mins);
          option.textContent = rangeLabel(mins, mins + 30);
          if (isBooked(key, mins)) { option.disabled = true; option.textContent += " · Slot already booked"; }
          else if (key === todayKey && mins < currentMinutes) continue;
          timeSelect.append(option);
        }
      }
      if (timeSelect.options.length === 1) {
        placeholder.textContent = "No OPD hours remain on this date.";
        timeSelect.disabled = true;
      }
    }

    dateInput.addEventListener("change", () => {
      const key = dateInput.value;
      if (key && (key < todayKey || key > tomorrowKey)) {
        dateInput.value = "";
        renderSlots("");
        error.textContent = "Please choose today or tomorrow only.";
        return;
      }
      error.textContent = "";
      renderSlots(key);
    });

    function chooseBadgeSlot() {
      const width = Math.min(256, Math.max(70, innerWidth - 24)), height = 60, pad = 12;
      const xRight = Math.max(pad, innerWidth - width - pad), yBottom = Math.max(pad, innerHeight - height - pad);
      const candidates = [
        {name:badgeSlots[0],x:pad,y:pad},{name:badgeSlots[1],x:xRight,y:pad},
        {name:badgeSlots[2],x:pad,y:yBottom},{name:badgeSlots[3],x:xRight,y:yBottom}
      ];
      const nodes = [...dialog.querySelectorAll("input,select,textarea,button,a,label")].filter(node => node.getBoundingClientRect().width && node.getBoundingClientRect().height);
      for (const candidate of candidates) {
        candidate.score = nodes.reduce((score,node) => {
          const r = node.getBoundingClientRect();
          const w = Math.max(0, Math.min(candidate.x + width,r.right) - Math.max(candidate.x,r.left));
          const h = Math.max(0, Math.min(candidate.y + height,r.bottom) - Math.max(candidate.y,r.top));
          return score + (w*h) * (node.matches("input,select,textarea,button,a") ? 4 : 1);
        },0);
      }
      return candidates.sort((a,b)=>a.score-b.score)[0].name;
    }
    function syncCaptchaBadge() {
      const active = isDialogOpen() && !document.hidden && dialog.getBoundingClientRect().width > 0 && form.getBoundingClientRect().height > 0;
      body.classList.toggle("site-booking-active", active);
      const desired = active ? chooseBadgeSlot() : null;
      document.querySelectorAll(".grecaptcha-badge").forEach(badge => {
        const current = badgeSlots.find(name => badge.classList.contains(name));
        if (current && current !== desired) badge.classList.remove(current);
        if (desired && current !== desired) badge.classList.add(desired);
      });
    }

    function finishClose() {
      if (isDialogOpen()) return;
      body.classList.remove("site-booking-active");
      document.querySelectorAll(".grecaptcha-badge").forEach(badge => badgeSlots.forEach(name => badge.classList.remove(name)));
      if (requestInProgress) {
        attemptId += 1;
        requestInProgress = false;
        if (activeVerifyController) activeVerifyController.abort();
        activeVerifyController = null;
        if (recaptchaResolver) {
          const pending = recaptchaResolver;
          recaptchaResolver = null;
          pending.reject(new DOMException("Booking was closed.", "AbortError"));
        }
        submit.disabled = false;
        submit.textContent = "Continue to WhatsApp";
      }
      if (lastOpener && lastOpener.isConnected) lastOpener.focus();
      lastOpener = null;
    }

    function closeBooking() {
      if (isDialogOpen()) {
        try {
          if (typeof dialog.close === "function") dialog.close();
          else dialog.removeAttribute("open");
        } catch (_) {
          dialog.removeAttribute("open");
        }
      }
      /* Explicit cleanup is deliberate: it also covers non-native dialog fallbacks
         and browsers that fail to dispatch a close event after an attribute change. */
      dialog.removeAttribute("open");
      finishClose();
      syncCaptchaBadge();
    }

    function openBooking(opener) {
      if (isDialogOpen()) return;
      lastOpener = opener || null;
      form.reset();
      error.textContent = "";
      requestInProgress = false;
      submit.disabled = false;
      submit.textContent = "Continue to WhatsApp";
      dateInput.min = todayKey;
      dateInput.max = tomorrowKey;
      renderSlots("");
      if (options) options.hidden = true;
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (typeof setNavOpen === "function") setNavOpen(false);
      try {
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      } catch (_) {
        dialog.setAttribute("open", "");
      }
      body.classList.add("site-booking-active");
      syncCaptchaBadge();
      ensureRecaptcha().then(syncCaptchaBadge).catch(reason => {
        if (isDialogOpen() && reason && reason.name !== "AbortError") error.textContent = reason.message;
      });
      const name = dialog.querySelector("#booking-child-name");
      if (name) name.focus();
    }

    floatingButton.addEventListener("click", () => openBooking(floatingButton));
    document.addEventListener("click", event => {
      const opener = event.target.closest && event.target.closest("[data-open-booking]");
      if (opener) {
        event.preventDefault();
        openBooking(opener);
      }
      const closeButton = event.target.closest && event.target.closest("[data-close-booking]");
      if (closeButton && dialog.contains(closeButton)) {
        event.preventDefault();
        closeBooking();
      }
    });
    if (trigger && options) {
      trigger.addEventListener("click", () => {
        const open = options.hidden;
        options.hidden = !open;
        trigger.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", event => {
        if (!options.contains(event.target) && !trigger.contains(event.target)) {
          options.hidden = true;
          trigger.setAttribute("aria-expanded", "false");
        }
      });
    }
    dialog.addEventListener("close", finishClose);
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      closeBooking();
    });
    dialog.addEventListener("click", event => { if (event.target === dialog) closeBooking(); });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && isDialogOpen()) closeBooking();
    });

    function ensureRecaptcha() {
      if (recaptchaWidget !== null) return Promise.resolve(recaptchaWidget);
      if (recaptchaLoading) return recaptchaLoading;
      recaptchaLoading = new Promise((resolve, reject) => {
        const render = () => {
          if (!window.grecaptcha || typeof window.grecaptcha.ready !== "function") {
            reject(new Error("Google reCAPTCHA is unavailable. Refresh the page and try again."));
            return;
          }
          window.grecaptcha.ready(() => {
            try {
              const slot = dialog.querySelector("#recaptcha-slot");
              recaptchaWidget = window.grecaptcha.render(slot, {
                sitekey: SITE_CONFIG.contact.recaptchaSiteKey,
                size: "invisible",
                badge: "bottomleft",
                callback: token => {
                  const pending = recaptchaResolver;
                  recaptchaResolver = null;
                  if (pending) pending.resolve(token);
                },
                "error-callback": () => {
                  const pending = recaptchaResolver;
                  recaptchaResolver = null;
                  if (pending) pending.reject(new Error("Google reCAPTCHA encountered a network or configuration error. Please try again."));
                },
                "expired-callback": () => {
                  const pending = recaptchaResolver;
                  recaptchaResolver = null;
                  if (pending) pending.reject(new Error("reCAPTCHA expired. Please submit again."));
                }
              });
              resolve(recaptchaWidget);
              syncCaptchaBadge();
            } catch (_) {
              reject(new Error("Unable to initialize Invisible reCAPTCHA. Check the registered website hostname and key configuration."));
            }
          });
        };
        if (window.grecaptcha && typeof window.grecaptcha.render === "function") { render(); return; }
        window.__kidsGastroCaptchaReady = render;
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?onload=__kidsGastroCaptchaReady&render=explicit";
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error("Google reCAPTCHA could not be downloaded. Check your connection or browser content blocker."));
        document.head.append(script);
      }).finally(() => { recaptchaLoading = null; });
      return recaptchaLoading;
    }

    function executeRecaptcha() {
      return new Promise((resolve, reject) => {
        if (recaptchaWidget === null || !window.grecaptcha) {
          reject(new Error("reCAPTCHA is not initialized. Please submit again."));
          return;
        }
        recaptchaResolver = { resolve, reject };
        try {
          window.grecaptcha.reset(recaptchaWidget);
          window.grecaptcha.execute(recaptchaWidget);
        } catch (_) {
          recaptchaResolver = null;
          reject(new Error("Unable to start Google reCAPTCHA. Please try again."));
        }
      });
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (requestInProgress) return;
      error.textContent = "";
      const childName = dialog.querySelector("#booking-child-name").value.trim();
      const childAge = dialog.querySelector("#booking-child-age").value.trim();
      const phone = dialog.querySelector("#booking-phone").value.trim();
      const date = dateInput.value;
      const slotValue = timeSelect.value;
      if (!childName) { error.textContent = "Please enter the child’s name."; return; }
      if (!childAge || !Number.isFinite(Number(childAge)) || Number(childAge) < 0 || Number(childAge) > 18) { error.textContent = "Please enter the child’s age between 0 and 18 years."; return; }
      if (!/^[6-9]\d{9}$/.test(phone)) { error.textContent = "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9."; return; }
      if (!date || date < todayKey || date > tomorrowKey) { error.textContent = "Please choose today or tomorrow only."; return; }
      if (!slotValue) { error.textContent = "Please choose a 30-minute appointment slot."; return; }
      const start = Number(slotValue);
      if (!allowedWindows(date).some(([a,b]) => start >= a && start < b) || isBooked(date, start)) { error.textContent = "That appointment slot is unavailable. Please choose another time."; return; }
      if (date === todayKey && start < new Date().getHours() * 60 + new Date().getMinutes()) { error.textContent = "That time has already passed. Choose a later time today, or select another date."; return; }

      const dateText = date.split("-").reverse().join("/");
      const timeText = timeSelect.options[timeSelect.selectedIndex].text;
      const message = `Hello, I would like to request an appointment with Dr. Nitin Mohan.\n\nChild: ${childName}\nAge: ${childAge} years\nParent/guardian phone: ${phone}\nPreferred date: ${dateText}\nPreferred time: ${timeText}\n\nPlease confirm availability.`;
      const waUrl = `https://wa.me/${SITE_CONFIG.contact.phoneE164}?text=${encodeURIComponent(message)}`;
      requestInProgress = true;
      const thisAttempt = ++attemptId;
      submit.disabled = true;
      submit.textContent = "Verifying…";
      error.textContent = "Verifying securely. You can still close this window at any time…";
      try {
        await ensureRecaptcha();
        if (thisAttempt !== attemptId || !isDialogOpen()) return;
        const token = await executeRecaptcha();
        if (thisAttempt !== attemptId || !isDialogOpen()) return;
        if (!token) throw new Error("Google reCAPTCHA did not return a verification token. Please try again.");
        activeVerifyController = new AbortController();
        const response = await fetch(SITE_CONFIG.contact.recaptchaVerifyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, action: "BOOK_APPOINTMENT" }),
          signal: activeVerifyController.signal
        });
        activeVerifyController = null;
        if (thisAttempt !== attemptId || !isDialogOpen()) return;
        if (!response.ok) throw new Error("The verification service is temporarily unavailable. Please try again.");
        const verification = await response.json();
        if (thisAttempt !== attemptId || !isDialogOpen()) return;
        if (!verification || verification.success !== true) throw new Error("We could not verify this request. Please try again.");
        try { sessionStorage.setItem("kg_pending_appointment_confirmation", JSON.stringify({ childName, date: dateText, time: timeText, savedAt: Date.now() })); } catch (_) {}
        requestInProgress = false;
        submit.disabled = false;
        submit.textContent = "Continue to WhatsApp";
        closeBooking();
        window.location.assign(waUrl);
      } catch (reason) {
        if (thisAttempt === attemptId && isDialogOpen() && (!reason || reason.name !== "AbortError")) {
          error.textContent = reason && reason.message ? reason.message : "Verification failed. Please try again.";
        }
      } finally {
        if (thisAttempt === attemptId) {
          requestInProgress = false;
          activeVerifyController = null;
          submit.disabled = false;
          submit.textContent = "Continue to WhatsApp";
        }
      }
    });

    /* The badge exists only while the form is actually open and visible. */
    dialog.addEventListener("close", syncCaptchaBadge);
    dialog.addEventListener("scroll", syncCaptchaBadge, true);
    window.addEventListener("resize", syncCaptchaBadge, { passive: true });
    document.addEventListener("visibilitychange", syncCaptchaBadge);
    const captchaObserver = new MutationObserver(syncCaptchaBadge);
    captchaObserver.observe(body, { childList: true, subtree: true });
    if ("ResizeObserver" in window) {
      const resize = new ResizeObserver(syncCaptchaBadge);
      resize.observe(dialog);
      resize.observe(form);
    }
    syncCaptchaBadge();
  }
  /* ===== END BLOCK: BOOKING ===== */

  /* ===== BLOCK: WHATSAPP_FLOAT ===== */
  function initWhatsAppFloat() {
    let button = document.getElementById("floating-booking");
    if (!button) {
      button = document.createElement("button");
      button.className = "floating-booking";
      button.id = "floating-booking";
      button.type = "button";
      button.setAttribute("aria-label", "Book via WhatsApp");
      button.textContent = "Book via WhatsApp";
      body.append(button);
    }
    if (!feature("whatsappFloat")) { button.hidden = true; return; }
    button.hidden = false;
    if (!feature("whatsappBooking")) {
      button.addEventListener("click", () => window.open(`https://wa.me/${SITE_CONFIG.contact.phoneE164}`, "_blank", "noopener"));
    }
    let dragStart = null;
    button.addEventListener("pointerdown", event => { dragStart = { y:event.clientY, top:button.getBoundingClientRect().top }; button.setPointerCapture(event.pointerId); });
    button.addEventListener("pointermove", event => {
      if (!dragStart || !button.hasPointerCapture(event.pointerId)) return;
      const top = Math.max(12, Math.min(innerHeight - button.offsetHeight - 12, dragStart.top + event.clientY - dragStart.y));
      button.style.top = `${top}px`; button.style.bottom = "auto"; button.style.right = "18px";
    });
    button.addEventListener("pointerup", () => { dragStart = null; });
    button.addEventListener("pointercancel", () => { dragStart = null; });
  }
  /* ===== END BLOCK: WHATSAPP_FLOAT ===== */

  /* ===== BLOCK: PHOTO_OF_MONTH ===== */
  async function initPhotoOfMonth() {
    const slot = document.getElementById("photo-month-slot");
    if (!feature("photoOfMonth")) { if (slot) slot.hidden = true; return; }
    if (!slot) return;
    slot.hidden = false;
    const available = ["gastro talk.webp","rezept-rx-logo.png","endo gallery pic.webp","main pic.webp","potrait gallery.jpg","baby pic.webp","hospital pic.webp","gif 1.webm","gif 2.webm","gif 3.webm","gif 4.webm","gif 5.webm","endo main pic.webp"];
    try {
      const response = await fetch(asset("settings.json"), { cache: "no-cache" });
      if (!response.ok) return;
      const settings = await response.json();
      const candidate = typeof settings.photoOfDay === "string" ? settings.photoOfDay.trim().split("/").pop() : "";
      if (!available.includes(candidate)) return;
      const image = document.createElement("img");
      image.src = asset("assets/" + encodeURIComponent(candidate).replace(/%2F/gi,"/"));
      image.alt = "Latest photo from KidsGastro";
      image.loading = "lazy";
      const frame = slot.querySelector(".photo-month-placeholder");
      if (frame) frame.replaceWith(image);
      const title = slot.querySelector("h3");
      if (title && settings.photoCaption) title.textContent = settings.photoCaption;
    } catch (_) { /* The searchable placeholder remains visible until a valid setting is published. */ }
  }
  /* ===== END BLOCK: PHOTO_OF_MONTH ===== */

  /* ===== BLOCK: VIDEO_CAROUSEL ===== */
  function initVideoCarousel() {
    const section = document.querySelector(".home-videos");
    if (!feature("videoCarousel")) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;
    const track = document.getElementById("video-track");
    if (!track) return;

    const originalCards = [...track.querySelectorAll(":scope > .video-card")];
    if (originalCards.length < 2) return;

    /* Duplicate the cards once so the scroll can wrap without a visible jump. */
    originalCards.forEach((card, index) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.tabIndex = -1;
      clone.dataset.carouselClone = "true";
      clone.querySelectorAll("a,button").forEach(control => control.tabIndex = -1);
      clone.querySelectorAll("video").forEach(video => {
        video.pause();
        video.removeAttribute("data-motion-video");
        video.removeAttribute("autoplay");
        video.preload = "none";
        /* Use a still frame in the cloned loop so only the original videos
           consume playback resources. */
        const posterNumber = (index % 5) + 1;
        video.setAttribute("poster", asset(`assets/kidsgastro-video-${posterNumber}-thumbnail.jpg`));
        video.removeAttribute("src");
        video.querySelectorAll("source").forEach(source => source.remove());
        video.load();
      });
      track.append(clone);
    });

    let pausedByPointer = false;
    let pausedByTouch = false;
    let pausedByFocus = false;
    let pauseUntil = 0;
    let previousFrame = 0;
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

    let measuredLoopWidth = 0;
    const measureLoopWidth = () => {
      const first = track.children[0];
      const firstClone = track.children[originalCards.length];
      measuredLoopWidth = first && firstClone
        ? firstClone.getBoundingClientRect().left - first.getBoundingClientRect().left
        : 0;
      return measuredLoopWidth;
    };
    const loopWidth = () => measuredLoopWidth || measureLoopWidth();
    measureLoopWidth();
    window.addEventListener("resize", () => requestAnimationFrame(measureLoopWidth), { passive: true });

    document.querySelectorAll("[data-video-scroll]").forEach(button => {
      button.addEventListener("click", () => {
        const width = loopWidth();
        if (!width) return;
        const direction = Number(button.dataset.videoScroll) || 1;
        const step = Math.max(180, track.clientWidth * .78);
        const current = ((track.scrollLeft % width) + width) % width;
        const next = current + direction * step;
        track.scrollLeft = next < 0 ? width + (next % width) : next % width;
        pauseUntil = performance.now() + 2200;
      });
    });

    track.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse") pausedByPointer = true;
    });
    track.addEventListener("pointerleave", event => {
      if (event.pointerType === "mouse") pausedByPointer = false;
    });
    track.addEventListener("pointerdown", event => {
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        pausedByTouch = true;
        pauseUntil = 0;
      }
    }, { passive: true });
    const finishTouch = () => {
      if (!pausedByTouch) return;
      pausedByTouch = false;
      /* A tap or swipe pauses the ticker briefly, then it resumes by itself. */
      pauseUntil = performance.now() + 2800;
    };
    track.addEventListener("pointerup", finishTouch, { passive: true });
    track.addEventListener("pointercancel", finishTouch, { passive: true });
    track.addEventListener("touchstart", () => { pausedByTouch = true; pauseUntil = 0; }, { passive: true });
    track.addEventListener("touchend", finishTouch, { passive: true });
    track.addEventListener("touchcancel", finishTouch, { passive: true });
    track.addEventListener("focusin", () => { pausedByFocus = true; });
    track.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        pausedByFocus = track.contains(document.activeElement);
        if (!pausedByFocus) pauseUntil = performance.now() + 900;
      });
    });

    const animate = timestamp => {
      if (!previousFrame) previousFrame = timestamp;
      const elapsed = Math.min(50, timestamp - previousFrame);
      previousFrame = timestamp;
      const reduced = prefersReducedMotion && prefersReducedMotion.matches;
      const motionDisabled = root.classList.contains("no-motion");
      if (!reduced && !motionDisabled && !document.hidden && !pausedByPointer && !pausedByTouch && !pausedByFocus && timestamp >= pauseUntil) {
        const width = loopWidth();
        if (width > 0) {
          track.scrollLeft += elapsed * 0.024; /* approx. 24 pixels per second */
          if (track.scrollLeft >= width) track.scrollLeft -= width;
        }
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
  /* ===== END BLOCK: VIDEO_CAROUSEL ===== */

  /* ===== BLOCK: GALLERY_LIGHTBOX ===== */
  function initGalleryLightbox() {
    if (!feature("galleryLightbox")) return;
    const viewer = document.getElementById("image-viewer");
    if (!viewer) return;
    const image = viewer.querySelector("img");
    const level = viewer.querySelector(".viewer-zoom-level");
    const closeButton = viewer.querySelector(".viewer-close");
    let zoom = 1;
    let previousFocus = null;

    const isBrandOrUiImage = target => {
      const src = target.getAttribute("src") || "";
      const alt = target.getAttribute("alt") || "";
      return Boolean(target.closest(
        ".site-brand,.site-footer-brand,.social-icon,.image-viewer,.kg-rb-booking-dialog," +
        ".appointment-option,.kg-rb-newsletter-form,.site-navigation,.site-footer"
      )) || target.hasAttribute("data-no-viewer") ||
        /kg(?:%20|\s)logo|rezept-rx-logo|favicon/i.test(src) ||
        /kids?gastro logo|rezept.?rx logo/i.test(alt);
    };
    const isViewableImage = target => target instanceof HTMLImageElement &&
      !isBrandOrUiImage(target) && Boolean(target.closest("main,.site-page-content")) &&
      (target.naturalWidth >= 80 || target.width >= 80);

    document.querySelectorAll("main img,.site-page-content img").forEach(target => {
      if (!isViewableImage(target)) return;
      target.tabIndex = 0;
      target.setAttribute("role", "button");
      target.setAttribute("aria-label", target.alt ? `Open image: ${target.alt}` : "Open image in viewer");
      target.classList.add("kg-viewable-image");
    });

    function updateZoom() {
      image.style.transform = `scale(${zoom})`;
      image.style.cursor = zoom > 1 ? "zoom-out" : "zoom-in";
      if (level) level.textContent = `${Math.round(zoom * 100)}%`;
    }
    function close() {
      viewer.hidden = true;
      image.removeAttribute("src");
      image.alt = "";
      document.body.classList.remove("site-viewer-open");
      if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    }
    function open(target) {
      if (!isViewableImage(target)) return;
      previousFocus = target;
      image.src = target.currentSrc || target.src;
      image.alt = target.alt || "";
      zoom = 1;
      updateZoom();
      viewer.hidden = false;
      document.body.classList.add("site-viewer-open");
      closeButton && closeButton.focus();
    }

    document.addEventListener("click", event => {
      const target = event.target;
      if (target instanceof HTMLImageElement) open(target);
    });
    document.addEventListener("keydown", event => {
      const target = event.target;
      if (target instanceof HTMLImageElement && isViewableImage(target) &&
          (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        open(target);
        return;
      }
      if (event.key === "Escape" && !viewer.hidden) close();
    });
    closeButton.addEventListener("click", close);
    viewer.querySelector(".viewer-zoom-in").addEventListener("click", () => {
      zoom = Math.min(4, +(zoom + .25).toFixed(2)); updateZoom();
    });
    viewer.querySelector(".viewer-zoom-out").addEventListener("click", () => {
      zoom = Math.max(1, +(zoom - .25).toFixed(2)); updateZoom();
    });
    viewer.querySelector(".viewer-reset").addEventListener("click", () => {
      zoom = 1; updateZoom();
    });
    image.addEventListener("click", () => {
      if (zoom > 1) { zoom = 1; updateZoom(); }
      else { zoom = 1.25; updateZoom(); }
    });
    viewer.addEventListener("click", event => { if (event.target === viewer) close(); });
  }
  /* ===== END BLOCK: GALLERY_LIGHTBOX ===== */

  /* ===== BLOCK: FOOTER_SHARE ===== */
  function initFooterShare() {
    const mount = document.getElementById("site-footer-share-mount");
    if (!mount || !feature("footerShare")) return;
    mount.innerHTML = `<strong>Share this website</strong><button type="button" class="site-share-button" id="site-share-button">Share link ↗</button><span id="site-share-status" aria-live="polite"></span>`;
    mount.parentElement.classList.add("has-share");
    const button = document.getElementById("site-share-button");
    const status = document.getElementById("site-share-status");
    if (!button) return;
    button.addEventListener("click", async () => {
      const data = { title: document.title || "KidsGastro", text: "Visit KidsGastro — Paediatric Gastroenterology", url: location.href };
      if (navigator.share) {
        try { await navigator.share(data); if (status) status.textContent = ""; return; }
        catch (reason) { if (reason && reason.name === "AbortError") return; }
      }
      try { await navigator.clipboard.writeText(location.href); if (status) status.textContent = "Website link copied. You can now paste and share it."; }
      catch (_) { if (status) status.textContent = "Copy the website address from your browser to share it."; }
    });
  }
  /* ===== END BLOCK: FOOTER_SHARE ===== */

  /* ===== BLOCK: BACK_TO_TOP ===== */
  function initBackToTop() {
    /* Back-to-top is intentionally provided only by the footer link. Remove
       legacy floating buttons that may remain in older subsite HTML files. */
    document.querySelectorAll("#back-to-top, button.back-to-top").forEach(button => button.remove());
  }
  /* ===== END BLOCK: BACK_TO_TOP ===== */

  /* ===== BLOCK: NEWSLETTER ===== */
  function initNewsletter() {
    const section = document.getElementById("newsletter-section");
    const form = document.getElementById("kg-rb-newsletter-form");
    const status = document.getElementById("kg-rb-newsletter-status");
    if (!feature("newsletter")) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;
    if (!form) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const email = new FormData(form).get("email");
      const subject = encodeURIComponent("Newsletter subscription request");
      const bodyText = encodeURIComponent("Please add this email address to the clinic newsletter list: " + email);
      if (status) status.textContent = "Your email app will open with a subscription request for you to review and send.";
      location.href = `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${bodyText}`;
    });
  }
  /* ===== END BLOCK: NEWSLETTER ===== */

  /* ===== BLOCK: SCROLL_PROGRESS ===== */
  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!feature("scrollProgress")) { if (bar) bar.hidden = true; return; }
    if (!bar) return;
    bar.hidden = false;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - innerHeight;
      const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
      bar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    };
    window.addEventListener("scroll", update, { passive:true });
    window.addEventListener("resize", update, { passive:true });
    update();
  }
  /* ===== END BLOCK: SCROLL_PROGRESS ===== */

  /* ===== BLOCK: MOTION ===== */
  function initMotion() {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const disabled = SITE_CONFIG.features.animations === false || reduced;
    root.classList.toggle("no-motion", disabled);
    if (disabled) {
      document.querySelectorAll("[data-motion]").forEach(element => element.classList.add("motion-complete"));
      document.querySelectorAll("[data-motion-video]").forEach(video => { video.pause(); video.preload = "metadata"; video.load(); });
      return;
    }
    const targets = [...document.querySelectorAll("[data-motion]")];
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-complete");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold:0.08 });
      targets.forEach(element => observer.observe(element));
      const videos = [...document.querySelectorAll("[data-motion-video]")];
      const videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting && !document.hidden) video.play().catch(() => {});
          else video.pause();
        });
      }, { rootMargin:"0px 90px", threshold:0.15 });
      videos.forEach(video => videoObserver.observe(video));
      document.addEventListener("visibilitychange", () => { if (document.hidden) videos.forEach(video => video.pause()); });
    } else {
      targets.forEach(element => element.classList.add("motion-complete"));
      document.querySelectorAll("[data-motion-video]").forEach(video => { video.pause(); video.preload = "metadata"; video.load(); });
    }
    const preference = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference && preference.addEventListener) preference.addEventListener("change", event => {
      if (event.matches) {
        root.classList.add("no-motion");
        document.querySelectorAll("[data-motion-video]").forEach(video => { video.pause(); video.preload = "metadata"; video.load(); });
        targets.forEach(element => element.classList.add("motion-complete"));
      }
    });
  }
  /* ===== END BLOCK: MOTION ===== */

  /* ===== BLOCK: SERVICE_WORKER ===== */
  function initServiceWorker() {
    if (!feature("offlineCache") || !("serviceWorker" in navigator)) return;
    const workerUrl = asset("service-worker.js");
    window.addEventListener("load", () => navigator.serviceWorker.register(workerUrl).catch(() => {}), { once:true });
  }
  /* ===== END BLOCK: SERVICE_WORKER ===== */

  /* ===== BLOCK: BOOTSTRAP ===== */
  ensureSharedAssets();
  ensureSharedShell();
  initHeaderFooter();
  initPage();
  initBrandLogoLinks();
  initNav();
  if (typeof initHomeContent === "function") initHomeContent();
  if (typeof initAnnouncement === "function") initAnnouncement();
  if (typeof initBooking === "function") initBooking();
  if (typeof initWhatsAppFloat === "function") initWhatsAppFloat();
  if (typeof initPhotoOfMonth === "function") initPhotoOfMonth();
  if (typeof initVideoCarousel === "function") initVideoCarousel();
  if (typeof initGalleryLightbox === "function") initGalleryLightbox();
  if (typeof initFooterShare === "function") initFooterShare();
  if (typeof initBackToTop === "function") initBackToTop();
  if (typeof initNewsletter === "function") initNewsletter();
  if (typeof initScrollProgress === "function") initScrollProgress();
  if (typeof initMotion === "function") initMotion();
  if (typeof initServiceWorker === "function") initServiceWorker();
  /* ===== END BLOCK: BOOTSTRAP ===== */
})();
