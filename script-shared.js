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
    { label: "Why Dr. Nitin Mohan", path: "/about/" },
    { label: "Treatments", path: "/treatments/", children: [
      { label: "Paediatric Gastroenterology", path: "/treatments/" },
      { label: "Paediatric Hepatology — Liver Diseases", path: "/treatments/" },
      { label: "Paediatric Pancreatology — Pancreatic Disorders", path: "/treatments/" },
      { label: "Paediatric Biliary Tract Diseases", path: "/treatments/" },
      { label: "Paediatric Nutrition and Growth", path: "/treatments/" }
    ]},
    { label: "Services", path: "/services/", children: [
      { label: "Paediatric Gastrointestinal Procedures", path: "/services/" },
      { label: "Hepatology Procedures & Investigations", path: "/services/" },
      { label: "Pancreatic Investigations", path: "/services/" },
      { label: "Biliary Tract Investigations", path: "/services/" },
      { label: "Gastrointestinal Diagnostic Investigations", path: "/services/" },
      { label: "Nutrition & Growth Assessment", path: "/services/" }
    ]},
    { label: "FAQs", path: "/faqs/" },
    { label: "Blog", path: "/blog/" },
    { label: "Publication", path: "/publications/" },
    { label: "Testimonials", path: "/testimonials/" },
    { label: "Gallery", path: "/gallery/" },
    { label: "Contact Us", homeAnchor: "site-footer-mount" }
  ],
  content: {
    announcement: "OFFLINE APPOINTMENTS AVAILABLE RIGHT NOW. CLICK THE APPOINTMENT BUTTON BELOW TO PROCEED.",
    brand: "KidsGastro by Dr. Nitin Mohan",
    hospital: "Churamani Multispeciality Hospital",
    address: "Delhi Road, Camp Chowk, Krishna Nagar Colony, Hisar, Haryana 125001",
    footer: "Copyright © 2026 Dr. Nitin Mohan. All rights reserved.",
    home: {
      heroEyebrow: "Paediatric gastroenterology",
      heroTitle: "Specialist gastro care",
      aboutParagraphOne: "Dr. Nitin Mohan is a Consultant Paediatric Gastroenterologist, Hepatologist and Nutritionist at Churamani Multispeciality Hospital, Hisar. His qualifications include MBBS, MD (Paediatrics), FISPGHAN and MNNF.",
      aboutParagraphTwo: "His academic and professional journey is associated with prestigious medical institutions, including PGIMS Rohtak, Sir Ganga Ram Hospital, New Delhi, and ABVIMS & Dr. RML Hospital, New Delhi. His clinical focus includes paediatric digestive disorders, liver diseases, pancreatic conditions, feeding difficulties, poor weight gain and nutritional problems.",
      aboutLink: "Find out more",
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
      socialHeading: "Stay connected with KidsGastro",
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
    pages: {"profile":{"path":"about","title":"Why Dr. Nitin Mohan | KidsGastro, Hisar","description":"Learn about Dr. Nitin Mohan and his paediatric gastroenterology practice in Hisar.","html":"<span>Why Dr. Nitin Mohan</span><h1>Why Dr. Nitin Mohan</h1><div><div><article><h3>1. Specialist expertise in paediatric digestive and liver disorders</h3><p>Children have unique medical and nutritional needs. Dr. Nitin Mohan focuses on evaluating digestive, liver and nutritional conditions in the context of a child&rsquo;s age, growth, development and overall health.</p></article><article><h3>2. A systematic approach to diagnosis</h3><p>Recurrent abdominal pain, persistent vomiting, constipation, diarrhoea, jaundice and poor weight gain can have several underlying causes. Dr. Nitin Mohan aims to identify the likely cause through careful clinical assessment and appropriate investigations.</p></article><article><h3>3. A focus on growth and nutrition</h3><p>Digestive health is closely linked to a child&rsquo;s growth and development. Assessment may include dietary habits, growth patterns, feeding difficulties and nutritional requirements to help develop an appropriate treatment plan.</p></article><article><h3>4. Evidence-based, individualised treatment</h3><p>Every child is different. Dr. Nitin Mohan aims to provide treatment guided by clinical findings, relevant investigations and established medical recommendations, with follow-up tailored to each child&rsquo;s needs.</p></article><article><h3>5. Clear communication with parents</h3><p>Understanding a child&rsquo;s illness is an important part of treatment. Dr. Nitin Mohan emphasises explaining possible causes, recommended tests, treatment options and follow-up requirements in language parents can understand.</p></article><article><h3>6. Specialist investigations when indicated</h3><p>Selected digestive disorders may require investigations such as upper gastrointestinal endoscopy, colonoscopy, flexible sigmoidoscopy or gastrointestinal manometry, depending on the child&rsquo;s symptoms and clinical findings. These are recommended when medically appropriate and subject to availability.</p></article><article><h3>7. Commitment to academic and clinical development</h3><p>Dr. Nitin Mohan&rsquo;s professional background includes scientific publications, clinical audit and academic presentations, reflecting a commitment to continued learning and evidence-based clinical practice.</p></article></div><h2>A Commitment to Your Child&rsquo;s Wellbeing</h2><p>Dr. Nitin Mohan aims to help families understand their child&rsquo;s condition, receive an appropriate treatment plan and make informed decisions about their care, with attention to safety, comfort, nutrition and long-term wellbeing.</p><p>At Churamani Multispeciality Hospital, Hisar, families can seek specialist consultation for children with digestive, liver, pancreatic and nutritional concerns.</p></div>"},"faqs":{"path":"faqs","title":"Frequently Asked Questions | KidsGastro, Hisar","description":"Read common family questions about paediatric gastroenterology consultations and child digestive health.","html":"<span>Family information</span><h1>Frequently asked questions</h1><div><details><summary>How can I book an appointment?</summary><div><p>Select <strong>Book an appointment</strong> and choose <strong>Book via WhatsApp</strong> or <strong>Book via RezeptRx</strong>. For WhatsApp booking, enter your child&rsquo;s name and age, select a preferred date and an available 30-minute time slot, then choose <strong>Continue to WhatsApp</strong>. The floating WhatsApp button opens the same booking form.</p></div></details><details><summary>What are the clinic hours?</summary><div><p>The booking form displays available 30-minute appointment slots after you select a date. Select a date to see the available times, or choose <strong>Contact Us</strong> in the main navigation to jump to the homepage footer and call the clinic.</p></div></details><details><summary>Where is the clinic?</summary><div><p>Churamani Multispeciality Hospital, Delhi Road, Camp Chowk, Krishna Nagar Colony, Hisar, Haryana 125001. Use <strong>View location</strong> in the homepage footer to open Google Maps for directions.</p></div></details><details><summary>How can I contact the clinic?</summary><div><p>Select <strong>Contact Us</strong> in the main navigation to jump directly to the homepage footer, where the clinic phone number and Google Maps link are available. You can also use the footer or the floating WhatsApp button to start an appointment request.</p></div></details><h2>Appointments and Preparation</h2><details><summary>13. What should I bring to the consultation?</summary><div><p>Bring previous prescriptions, test reports, imaging reports, discharge summaries, current medication details and your child&rsquo;s growth records, if available. A brief record of symptoms, diet and bowel habits may also help.</p></div></details><details><summary>14. Are all investigations and procedures available at the hospital?</summary><div><p>Availability depends on the investigation, procedure, the child&rsquo;s age and clinical requirements. Contact the hospital to ask about the specific service you need.</p></div></details><details><summary>15. How can I book an appointment?</summary><div><p>Use the Book an appointment button or the floating WhatsApp button on this website to send an appointment request.</p><p>Hospital: Churamani Multispeciality Hospital, Camp Chowk, Delhi Road, Hisar, Haryana.</p></div></details><details><summary>Medical Disclaimer</summary><div><p>This FAQ provides general educational information and does not replace individual medical advice, diagnosis or treatment. Consult a qualified healthcare professional for advice specific to your child.</p></div></details></div>"},"hospital":{"path":"clinic","title":"Clinic Location & OPD Timings | KidsGastro, Hisar","description":"Find clinic location information and OPD timings for KidsGastro in Hisar.","html":"<span>Find the clinic</span><h1>Churamani Multispeciality Hospital</h1><p>Delhi Road, Camp Chowk, Krishna Nagar Colony<br/>Hisar, Haryana 125001</p><div><h2>Contact Us</h2><p>To request an appointment, select <strong>Book an appointment</strong> on the homepage and complete the booking form. For other enquiries, use the phone number in the homepage footer. The main navigation <strong>Contact Us</strong> link takes you directly there.</p><a href=\"https://www.google.com/maps?cid=9598972484913852260&amp;g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF\" rel=\"noopener noreferrer\" target=\"_blank\">View hospital map &nearrow;</a></div>"},"services":{"path":"services","title":"Paediatric Gastroenterology Services | KidsGastro, Hisar","description":"Explore paediatric gastroenterology consultation services at KidsGastro with Dr. Nitin Mohan in Hisar.","html":"<span>Services</span><h1>Paediatric investigations and services</h1><p>Dr. Nitin Mohan provides specialist paediatric gastroenterology, hepatology, pancreatic and biliary consultations at Churamani Multispeciality Hospital, Hisar. Relevant diagnostic investigations and procedures help evaluate digestive disorders, liver diseases, pancreatic conditions and biliary tract abnormalities in children.</p><div>\n<article><h2>1. Paediatric Gastrointestinal Procedures</h2><ul><li>Upper Gastrointestinal Endoscopy (UGIE)</li><li>Colonoscopy</li><li>Proctosigmoidoscopy</li><li>Endoscopic Variceal Ligation (EVL)</li><li>Endoscopic Dilatation</li><li>Double-Balloon Enteroscopy</li><li>Gastrointestinal Manometry</li><li>Oesophageal pH Monitoring (pH Metry)</li><li>Biofeedback Therapy</li></ul></article>\n<article><h2>2. Paediatric Hepatology Procedures and Investigations</h2><ul><li>FibroScan (Transient Elastography)</li><li>Liver Function Tests (LFT)</li><li>Total and Direct Bilirubin</li><li>AST (SGOT), ALT (SGPT), ALP and GGT</li><li>Serum Albumin and Total Protein</li><li>Serum Bile Acids</li><li>Hepatitis A and E IgM</li><li>Hepatitis B Surface Antigen and HBV DNA Quantification</li><li>Hepatitis C Antibody and HCV RNA Quantification</li><li>Liver Biopsy and Histopathological Examination</li><li>Autoimmune Liver Disease Investigations</li></ul></article>\n<article><h2>3. Pancreatic Investigations</h2><ul><li>Serum Amylase</li><li>Serum Lipase</li><li>CT Pancreatic Protocol, when clinically indicated</li></ul></article>\n<article><h2>4. Biliary Tract Investigations</h2><ul><li>Ultrasound Abdomen for hepatobiliary assessment</li><li>Abdominal Ultrasound with Doppler, when indicated</li><li>Liver Function and Bilirubin Assessment</li><li>Serum Bile Acids</li><li>Selected Contrast Gastrointestinal Studies, when indicated</li></ul></article>\n<article><h2>5. Gastrointestinal Diagnostic Investigations</h2><ul><li>Stool Routine Examination</li><li>Stool Occult Blood Test</li><li>Stool Culture and Sensitivity</li><li>Tissue Transglutaminase IgA (tTG-IgA) for Coeliac Disease</li><li>Total IgA</li><li>Histopathological Examination of Gastrointestinal Biopsy Specimens</li><li>Complete Blood Count (CBC), CRP and ESR when indicated</li><li>Vitamin B12, Vitamin D and Ferritin for selected nutritional assessments</li></ul></article>\n<article><h2>6. Paediatric Nutrition and Growth Assessment</h2><ul><li>Weight, Height and Growth-Chart Assessment</li><li>Evaluation of Growth Faltering and Poor Weight Gain</li><li>Nutritional Assessment in Chronic Gastrointestinal, Liver and Pancreatic Diseases</li><li>Investigation of Suspected Nutritional Deficiencies</li><li>Individualised Nutrition Planning and Follow-up</li></ul></article></div>\n<aside><h2>Important Information</h2><p>Investigations and procedures are selected according to the child&rsquo;s symptoms, clinical assessment and suspected diagnosis. Availability may vary by procedure and the child&rsquo;s age and clinical requirements. Please contact Churamani Multispeciality Hospital to confirm current availability.</p></aside>"},"clinical":{"path":"clinical","title":"Clinical Practice | Dr. Nitin Mohan, KidsGastro","description":"Learn about the clinical practice and paediatric gastroenterology focus of Dr. Nitin Mohan.","html":"<span>Clinical work</span><h1>Clinical work and education</h1><p>An overview of clinical practice and professional education. Visit the dedicated gallery to view selected photographs.</p><a href=\"/gallery/\">View KidsGastro Gallery</a>"},"latest":{"path":"latest","title":"Latest Health Updates | KidsGastro","description":"Explore recent health and medical updates shared by KidsGastro.","html":"<span>News, video and audio</span><h1>Latest from KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/></h1><p>Updates and resources for families.</p><div><figure><img alt=\"Health education session\" decoding=\"async\" loading=\"lazy\" src=\"/assets/gastro%20talk.webp\"/>News stories &middot; Clinic and community updates</figure><figure><img alt=\"Clinical work\" decoding=\"async\" loading=\"lazy\" src=\"/assets/endo%20main%20pic.webp\"/>Latest videos &middot; Short videos for families</figure><figure><img alt=\"Dr. Nitin Mohan\" decoding=\"async\" loading=\"lazy\" src=\"/assets/main%20pic.webp\"/>Podcasts &middot; Conversations with Dr. Nitin Mohan</figure></div><a href=\"https://www.instagram.com/kidsgastro/\" rel=\"noopener noreferrer\" target=\"_blank\">Follow KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/> on Instagram &nearrow;</a>"},"newsletter":{"path":"newsletter","title":"KidsGastro Health Updates","description":"Explore health education updates from KidsGastro.","html":"<span>Family updates</span><h1>KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/> newsletter</h1><p>Clinic updates, new videos and family-focused resources from KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/>.</p><div><img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/><div><h2>Stay connected</h2><p>Follow the KidsGastro Instagram profile for the latest updates.</p><a href=\"https://www.instagram.com/kidsgastro/\" rel=\"noopener noreferrer\" target=\"_blank\">Visit Instagram &nearrow;</a></div></div>"},"socials":{"path":"socials","title":"KidsGastro on Social Media","description":"Find KidsGastro social media channels and educational content.","html":"<span>Official profiles</span><h1>Connect with KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/></h1><p>Official profiles for KidsGastro<img alt=\"Dr. Nitin Mohan KidsGastro logo\" decoding=\"async\" loading=\"lazy\" src=\"/assets/kg%20logo.webp\"/> and Dr. Nitin Mohan.</p><div><a href=\"https://wa.me/919821020576?text=Hello%2C%20I%20would%20like%20to%20connect%20with%20KidsGastro.\" rel=\"noopener noreferrer\" target=\"_blank\"><span aria-hidden=\"true\">WA</span><span><b>WhatsApp</b><small>Message KidsGastro</small></span><span aria-hidden=\"true\">&nearrow;</span></a><a href=\"https://www.instagram.com/kidsgastro/\" rel=\"noopener noreferrer\" target=\"_blank\"><span><svg aria-hidden=\"true\"><rect height=\"18\" width=\"18\"></rect><circle></circle><circle></circle></svg></span><span><b>Instagram</b><small>@kidsgastro</small></span><span aria-hidden=\"true\">&nearrow;</span></a><a href=\"https://in.linkedin.com/in/dr-nitin-mohan-b91975175\" rel=\"noopener noreferrer\" target=\"_blank\"><span><svg aria-hidden=\"true\"><path></path></svg></span><span><b>LinkedIn</b><small>Dr. Nitin Mohan</small></span><span aria-hidden=\"true\">&nearrow;</span></a>\n<a href=\"https://scholar.google.com/citations?user=p9PYPvIAAAAJ&amp;hl=en\" rel=\"noopener noreferrer\" target=\"_blank\"><span><svg aria-hidden=\"true\"><path></path></svg></span><span><b>Google Scholar</b><small>Dr. Nitin Mohan</small></span><span aria-hidden=\"true\">&nearrow;</span></a></div>"},"testimonials":{"path":"testimonials","title":"Family Feedback | KidsGastro, Hisar","description":"Read feedback displayed on the KidsGastro website.","html":"<span>Testimonials</span><h1>Patient &amp; Family Testimonials</h1><p>More patient and family experiences shared with the clinic.</p><div id=\"page-testimonials-anchor-4\"><h3>More testimonials</h3><div><article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;I had severe abdominal pain, and many doctors in Sirsa could not manage it. Doctor Nitin Mohan is highly professional and dedicated, treated me well, and is the best gastroenterologist in Sirsa and the adjoining areas.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;I was in pain, and another doctor suggested intestinal surgery. Then I met Doctor Nitin Mohan. He gave me superb treatment, and now I am perfectly all right.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Doctor Nitin Mohan ji treated my daughter very well during her dengue admission with a high infection. Even for midnight emergencies, his presence in the room within 5 minutes is commendable.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My child had severe anemia, and Doctor Nitin Mohan is a very nice person. My child is now doing extremely well. Thank you, sir.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;We highly recommend Doctor Nitin Mohan for any pediatric disease. My child had severe hepatitis A and is now doing great. Thank you, sir.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My child had persistent abdominal pain for years, and medicines from many doctors gave no relief. Doctor Nitin Mohan treated him really well, and he is doing well now.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My child had severe abdominal pain, and many doctors showed no improvement. Doctor Nitin Mohan treated him well, and he is now perfectly normal.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Dr. Nitin Mohan was extremely thorough, friendly, and helpful in diagnosing and treating my stomach condition. He listened to our concerns and explained everything, and the care was outstanding.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My child had severe abdominal pain and constipation for 2 months. The doctor treated my child really well, and he is currently in very good condition.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Doctor Nitin Mohan is a very intelligent, professional, and experienced child gastroenterologist. Thank you for making my child smile again.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My experience with Doctor Nitin Mohan is awesome. He is a very humble and caring doctor, and his services are top-notch. I will suggest other parents see him for any pediatric-related issues.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;My experience with Doctor Nitin Mohan is very nice, and I will recommend him to others. He is a very warm-hearted doctor.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Dr. Nitin Mohan is such a good doctor. He treated patients like his own family members and gave very good treatment too.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Thank you, Dr. Nitin Mohan, for caring for my child. Dr. Nitin Mohan is very intelligent and professional.&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;It's a very great experience with Dr. Nitin Mohan. He is a very kind-hearted and nice person. I am always grateful. ☺☺☺☺☺&rdquo;</p></article>\n<article><div aria-label=\"5 out of 5 stars\" title=\"5 stars\">&starf;&starf;&starf;&starf;&starf;</div><p>&ldquo;Dr. Nitin Mohan is very humble, and he treated me really well. I am very happy.&rdquo;</p></article></div></div>"}}
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
    if (!clean || clean.toLowerCase() === "index") return homeUrl();
    if (window.location.protocol === "file:") return asset((EXISTING_HTML_PAGES.has(clean) ? clean : "index") + ".html");
    return asset(clean + "/");
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
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = asset("style-shared.css");
      link.dataset.kgSharedStyles = "true";
      document.head.append(link);
    }
    const faviconUrl = `${asset("assets/kg%20logo.webp")}?v=20261122`;
    const icons = [...document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]')];
    if (icons.length) {
      icons.forEach(icon => {
        icon.href = faviconUrl;
        icon.type = "image/webp";
      });
    } else {
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.href = faviconUrl;
      icon.type = "image/webp";
      document.head.append(icon);
    }
    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleIcon) appleIcon.href = faviconUrl;
  }

  /* ===== BLOCK: HEADER_FOOTER ===== */
  const homeUrl = () => window.location.protocol === "file:" ? "./" : basePath;
  const pageTopUrl = () => {
    if (window.location.protocol === "file:") return "#site-main";
    const canonical = document.querySelector('link[rel="canonical"]');
    const pageUrl = canonical && canonical.href
      ? canonical.href.split("#")[0]
      : `${window.location.origin}${window.location.pathname}`;
    return `${pageUrl}#site-main`;
  };
  const hrefFor = item => {
    if (item.href) return item.href;
    if (item.homeAnchor) return `${homeUrl()}#${encodeURIComponent(item.homeAnchor)}`;
    return routePath(item.path || "index");
  };

  function ensureSharedShell() {
    let announcementMount = document.getElementById("site-announcement-mount");
    let headerMount = document.getElementById("site-header-mount");
    let footerMount = document.getElementById("site-footer-mount");
    const main = document.getElementById("site-main") || document.querySelector("main");

    if (!headerMount) {
      headerMount = document.createElement("div");
      headerMount.id = "site-header-mount";
      const skip = body.querySelector(".site-skip");
      if (skip) skip.insertAdjacentElement("afterend", headerMount);
      else body.insertBefore(headerMount, body.firstChild);
    }
    if (!announcementMount) {
      announcementMount = document.createElement("div");
      announcementMount.id = "site-announcement-mount";
      headerMount.insertAdjacentElement("afterend", announcementMount);
    } else {
      headerMount.insertAdjacentElement("afterend", announcementMount);
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
    /* The public Login link is intentionally last. The admin route performs
       first-stage authentication and redirects to /updates. */
    const loginAction = `<a class="site-nav-login" href="${escapeHtml(routePath("admin"))}" data-site-link>Login</a>`;
    return `<nav class="site-navigation" aria-label="Main navigation">
      <a class="site-brand" href="${escapeHtml(homeUrl())}" aria-label="KidsGastro home">
        <img src="${asset("assets/kg%20logo.webp")}" alt="KidsGastro logo" width="54" height="54">
        <span>${escapeHtml(SITE_CONFIG.content.brand)}</span>
      </a>
      <button class="site-nav-trigger" type="button" aria-controls="site-nav-links" aria-expanded="false" aria-label="Open navigation">
        <span class="nav-trigger-lines" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
      <div class="site-nav-links" id="site-nav-links">
        
        ${links}${loginAction}
      </div>
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
        <div class="site-container site-footer-bottom"><a class="site-footer-brand" href="${escapeHtml(homeUrl())}" aria-label="KidsGastro home"><img src="${asset("assets/kg%20logo.webp")}" alt="KidsGastro logo" width="50" height="50"><span>KidsGastro<small>Paediatric Gastroenterology · Dr. Nitin Mohan</small></span></a><p>${escapeHtml(SITE_CONFIG.content.footer)}</p><a class="site-back-to-top" href="${escapeHtml(pageTopUrl())}">Back to top ↑</a></div>
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
    const closeFromOutside = event => {
      if (nav.contains(event.target)) return;
      nav.querySelectorAll(".site-nav-group[open]").forEach(group => { group.open = false; });
      if (nav.dataset.open === "true") setNavOpen(false);
    };
    document.addEventListener("pointerdown", closeFromOutside, true);
    document.addEventListener("click", event => {
      if (event.target.closest(".site-nav-links a")) setNavOpen(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.dataset.open === "true") {
        setNavOpen(false);
        trigger.focus();
      }
    });
  }
  /* ===== END BLOCK: NAV ===== */

  /* ===== BLOCK: CLEAN_URLS ===== */
  function initCanonicalUrls() {
    if (window.location.protocol === "file:" || activePage === "not-found") return;
    const currentSlug = pageSlug(window.location.pathname);
    const cleanSlug = !currentSlug || currentSlug.toLowerCase() === "index" ? "" : currentSlug;
    const cleanPath = cleanSlug ? `/${cleanSlug}/` : "/";
    const canonicalUrl = `${window.location.origin}${cleanPath}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
    let openGraphUrl = document.querySelector('meta[property="og:url"]');
    if (openGraphUrl) openGraphUrl.content = canonicalUrl;
    if (window.location.pathname !== cleanPath && /(?:index|[a-z0-9-]+)\.html?$/i.test(window.location.pathname)) {
      window.history.replaceState(window.history.state, "", cleanPath + window.location.search + window.location.hash);
    }
  }
  /* ===== END BLOCK: CLEAN_URLS ===== */

  /* ===== BLOCK: PAGE_ROUTING ===== */
  function initPage() {
    if (activePage === "home") return;
    const pages = SITE_CONFIG.content.pages || {};
    const config = pages[activePage] || Object.values(pages).find(page => page.path === pageSlug(activePage));
    const target = document.getElementById("site-page-content");
    const main = document.getElementById("site-main");
    if (!target || !main) return;
    if (config) {
      target.innerHTML = config.html;
    } else if (!target.innerHTML.trim()) {
      target.innerHTML = `<section><h1>[ENTER TEXT: page heading for ${escapeHtml(activePage)}]</h1><p>[ENTER TEXT: content for this page]</p></section>`;
      return;
    }
    target.querySelectorAll("a[href^='/']").forEach(link => {
      const href = link.getAttribute("href");
      const clean = href.replace(/^\/+|\/+$/g, "");
      const route = pageSlug(clean);
      link.setAttribute("href", EXISTING_HTML_PAGES.has(route) ? routePath(route) : asset(clean));
    });
    target.querySelectorAll("img[src^='/']").forEach(image => {
      image.setAttribute("src", asset(image.getAttribute("src")));
    });
    target.querySelectorAll(".kg-blog-card-art-image img").forEach(image => {
      image.addEventListener("error", () => {
        image.hidden = true;
        const frame = image.closest(".kg-blog-card-art-image");
        if (frame) frame.classList.add("is-image-missing");
      }, { once: true });
    });
    if (config) {
      document.title = config.title;
      const description = document.querySelector('meta[name="description"]');
      if (description && config.description) description.content = config.description;
    }
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

  /* ===== BLOCK: HERO_TYPING ===== */
  function initHeroTyping() {
    const target = document.querySelector("[data-typed-phrase]");
    if (!target) return;

    const phrases = ["for children", "in Hisar"];
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeDuration = 400;
    target.textContent = phrases[0];
    if (reduceMotion) return;

    let index = 0;
    window.setInterval(() => {
      target.classList.add("is-fading");
      window.setTimeout(() => {
        index = (index + 1) % phrases.length;
        target.textContent = phrases[index];
        target.classList.remove("is-fading");
      }, fadeDuration);
    }, 3200);
  }
  /* ===== END BLOCK: HERO_TYPING ===== */

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
          <label>Preferred date<input id="booking-date" name="date" type="date" required></label>
          <label class="booking-time-field">Preferred time (30-minute slots)
            <input id="booking-time" name="time" type="hidden" required>
            <div id="booking-slot-grid" class="booking-slot-grid" role="group" tabindex="-1" aria-label="Available 30-minute appointment slots"></div>
            <small id="booking-slot-hint" class="booking-slot-hint" aria-live="polite">Enter a date.</small>
          </label>
        </div>
        <div id="recaptcha-slot" class="recaptcha-slot" role="group" aria-label="reCAPTCHA verification"></div>
        <p class="captcha-disclosure">This site is protected by reCAPTCHA. Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms of Service</a> apply.</p>
        <p id="booking-error" class="site-status" role="status" aria-live="polite"></p>
        <div class="booking-actions"><button type="button" class="site-button site-button-secondary" data-close-booking>Cancel</button><button type="submit" class="site-button site-button-primary" id="booking-submit">Continue to WhatsApp</button></div>
      </form>`

    let dialog = document.getElementById("kg-rb-booking-dialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "kg-rb-booking-dialog";
      dialog.id = "kg-rb-booking-dialog";
      dialog.setAttribute("aria-labelledby", "kg-rb-booking-heading");
      dialog.innerHTML = bookingMarkup;
      body.append(dialog);
    } else {
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
      floatingButton.title = "Book via WhatsApp";
      body.append(floatingButton);
    }

    const form = dialog.querySelector("#booking-form");
    const trigger = document.getElementById("appointment-trigger");
    const options = document.getElementById("appointment-options");
    const dateInput = dialog.querySelector("#booking-date");
    const timeInput = dialog.querySelector("#booking-time");
    const slotGrid = dialog.querySelector("#booking-slot-grid");
    const slotHint = dialog.querySelector("#booking-slot-hint");
    const error = dialog.querySelector("#booking-error");
    const submit = dialog.querySelector("#booking-submit");
    if (!form || !dateInput || !timeInput || !slotGrid || !error || !submit) return;

    let recaptchaWidget = null;
    let recaptchaLoading = null;
    let recaptchaToken = "";
    let recaptchaPending = null;
    let requestInProgress = false;
    let attemptId = 0;
    let activeVerifyController = null;
    let lastOpener = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const todayKey = dateKey(today);
    const tomorrowKey = dateKey(tomorrow);
    dateInput.min = todayKey;
    dateInput.max = tomorrowKey;
    const dateLabel = dateInput.closest(".booking-date-label");
    if (dateLabel) dateLabel.addEventListener("click", event => {
      if (event.target !== dateInput && typeof dateInput.showPicker === "function") {
        event.preventDefault();
        try { dateInput.showPicker(); } catch (_) { dateInput.focus(); }
      }
    });

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
    let selectedTimeText = "";
    function renderSlots(key) {
      slotGrid.replaceChildren();
      timeInput.value = "";
      timeInput.disabled = !key;
      selectedTimeText = "";
      if (slotHint) slotHint.textContent = key ? "Enter time." : "Enter date.";
      if (!key) return;
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      let availableCount = 0;
      let displayedCount = 0;
      for (const [start, end] of allowedWindows(key)) {
        for (let mins = start; mins < end; mins += 30) {
          if (key === todayKey && mins < currentMinutes && !isBooked(key, mins)) continue;
          const timeText = rangeLabel(mins, mins + 30);
          const option = document.createElement("button");
          option.type = "button";
          option.className = "booking-slot";
          option.dataset.minutes = String(mins);
          const timeLabel = document.createElement("span");
          timeLabel.textContent = timeText;
          option.append(timeLabel);
          displayedCount += 1;
          if (isBooked(key, mins)) {
            option.classList.add("is-booked");
            option.disabled = true;
            const state = document.createElement("small");
            state.textContent = "BOOKED SLOT";
            option.append(state);
            option.setAttribute("aria-label", `${timeText}. Already booked and unavailable.`);
          } else {
            availableCount += 1;
            option.classList.add("is-available");
            option.setAttribute("aria-pressed", "false");
            option.addEventListener("click", () => {
              slotGrid.querySelectorAll(".booking-slot.is-selected").forEach(selected => {
                selected.classList.remove("is-selected");
                selected.setAttribute("aria-pressed", "false");
              });
              option.classList.add("is-selected");
              option.setAttribute("aria-pressed", "true");
              timeInput.value = String(mins);
              selectedTimeText = timeText;
              error.textContent = "";
            });
          }
          slotGrid.append(option);
        }
      }
      if (slotHint && displayedCount) slotHint.textContent = "Enter time.";
    }

    function bookingIssues() {
      const childName = dialog.querySelector("#booking-child-name").value.trim();
      const childAge = dialog.querySelector("#booking-child-age").value.trim();
      const phone = dialog.querySelector("#booking-phone").value.trim();
      const date = dateInput.value;
      const issues = [];
      if (!childName) issues.push({ message: "Enter the child’s name.", id: "booking-child-name" });
      if (!childAge || !Number.isFinite(Number(childAge)) || Number(childAge) < 0 || Number(childAge) > 18) {
        issues.push({ message: "Enter a valid age.", id: "booking-child-age" });
      }
      if (!/^[6-9]\d{9}$/.test(phone)) issues.push({ message: "Enter a valid 10-digit phone number.", id: "booking-phone" });
      if (!date || date < todayKey || date > tomorrowKey) issues.push({ message: "Enter a date.", id: "booking-date" });
      const selectedMinutes = Number(timeInput.value);
      if (!timeInput.value || !Number.isFinite(selectedMinutes) || isBooked(date, selectedMinutes)) {
        issues.push({ message: "Choose an available time.", id: "booking-slot-grid" });
      }
      return issues;
    }

    dateInput.addEventListener("change", () => {
      const key = dateInput.value;
      if (key && (key < todayKey || key > tomorrowKey)) {
        dateInput.value = "";
        renderSlots("");
        error.textContent = "Enter a valid date.";
        return;
      }
      error.textContent = "";
      renderSlots(key);
    });
    form.addEventListener("input", () => { error.textContent = ""; });

    function finishClose() {
      if (isDialogOpen()) return;
      if (requestInProgress) {
        attemptId += 1;
        requestInProgress = false;
        if (activeVerifyController) activeVerifyController.abort();
        activeVerifyController = null;
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
    }

    function openBooking(opener) {
      if (isDialogOpen()) return;
      lastOpener = opener || null;
      form.reset();
      error.textContent = "";
      selectedTimeText = "";
      if (recaptchaWidget !== null && window.grecaptcha) {
        try { window.grecaptcha.reset(recaptchaWidget); } catch (_) {}
      }
      requestInProgress = false;
      submit.disabled = false;
      submit.textContent = "Continue to WhatsApp";
      dateInput.min = todayKey;
      dateInput.max = tomorrowKey;
      resetRecaptcha();
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
      ensureRecaptcha().catch(reason => {
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

    function settlePendingCaptcha(errorValue, tokenValue) {
      if (!recaptchaPending) return;
      const pending = recaptchaPending;
      recaptchaPending = null;
      window.clearTimeout(pending.timeoutId);
      if (errorValue) pending.reject(errorValue);
      else pending.resolve(tokenValue);
    }

    function resetRecaptcha() {
      recaptchaToken = "";
      if (recaptchaWidget !== null && window.grecaptcha) {
        try { window.grecaptcha.reset(recaptchaWidget); } catch (_) {}
      }
    }

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
                badge: "bottomright",
                theme: "light",
                callback: token => {
                  recaptchaToken = token || "";
                  error.textContent = "";
                  if (recaptchaToken) settlePendingCaptcha(null, recaptchaToken);
                },
                "error-callback": () => {
                  const problem = new Error("Google reCAPTCHA encountered a network or configuration error. Please try again.");
                  if (isDialogOpen()) error.textContent = problem.message;
                  settlePendingCaptcha(problem);
                },
                "expired-callback": () => {
                  recaptchaToken = "";
                  const problem = new Error("reCAPTCHA verification expired. Please submit again.");
                  if (isDialogOpen()) error.textContent = problem.message;
                  settlePendingCaptcha(problem);
                }
              });
              resolve(recaptchaWidget);
            } catch (_) {
              reject(new Error("Unable to initialize invisible reCAPTCHA. Confirm that the site key is registered as Invisible reCAPTCHA v2 for drnitinmohan.com."));
            }
          });
        };
        if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
          render();
          return;
        }
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

    async function executeRecaptcha() {
      await ensureRecaptcha();
      if (recaptchaToken) return recaptchaToken;
      if (!window.grecaptcha || recaptchaWidget === null || typeof window.grecaptcha.execute !== "function") {
        throw new Error("Invisible reCAPTCHA is not ready. Close and reopen the appointment form.");
      }
      return new Promise((resolve, reject) => {
        const pending = {
          resolve,
          reject,
          timeoutId: window.setTimeout(() => {
            recaptchaPending = null;
            reject(new Error("reCAPTCHA verification timed out. Please try again."));
          }, 20000)
        };
        recaptchaPending = pending;
        try {
          window.grecaptcha.execute(recaptchaWidget);
        } catch (_) {
          settlePendingCaptcha(new Error("Unable to start invisible reCAPTCHA. Please try again."));
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
      const slotValue = timeInput.value;
      const issues = bookingIssues();
      if (issues.length) {
        error.textContent = issues[0].message;
          const firstField = dialog.querySelector(`#${issues[0].id}`);
        if (firstField && typeof firstField.focus === "function") firstField.focus();
        return;
      }
      const start = Number(slotValue);
      if (!allowedWindows(date).some(([a,b]) => start >= a && start < b) || isBooked(date, start)) {
        error.textContent = "That appointment time is no longer available. Please choose another time.";
        renderSlots(date);
        return;
      }
      if (date === todayKey && start < new Date().getHours() * 60 + new Date().getMinutes()) {
        error.textContent = "That time has passed. Choose another time.";
        renderSlots(date);
        return;
      }

      const dateText = date.split("-").reverse().join("/");
      const timeText = selectedTimeText;
      const message = `Hello, I would like to request an appointment with Dr. Nitin Mohan.\n\nChild: ${childName}\nAge: ${childAge} years\nParent/guardian phone: ${phone}\nPreferred date: ${dateText}\nPreferred time: ${timeText}\n\nPlease confirm availability.`;
      const waUrl = `https://wa.me/${SITE_CONFIG.contact.phoneE164}?text=${encodeURIComponent(message)}`;
      requestInProgress = true;
      const thisAttempt = ++attemptId;
      submit.disabled = true;
      submit.textContent = "Verifying…";
      error.textContent = "Verifying securely. You can still close this window at any time…";
      try {
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
          resetRecaptcha();
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

  }
  /* ===== END BLOCK: BOOKING ===== */

  /* ===== BLOCK: WHATSAPP_FLOAT ===== */
  function initWhatsAppFloat() {
    let button = document.getElementById("floating-booking");
    if (!button) {
      button = document.createElement("button");
      button.id = "floating-booking";
      body.append(button);
    }
    button.className = "floating-booking";
    button.type = "button";
    button.setAttribute("aria-label", "Book via WhatsApp");
    button.title = "Book via WhatsApp";
    button.innerHTML = `<img class="whatsapp-brand-mark" src="${asset("assets/whatsapp.svg")}" alt="" width="38" height="38"><span class="floating-booking-label">Book via WhatsApp</span>`;
    if (!feature("whatsappFloat")) { button.hidden = true; return; }
    button.hidden = false;

    if (!feature("whatsappBooking") && !button.dataset.directBookingBound) {
      button.addEventListener("click", () => window.open(`https://wa.me/${SITE_CONFIG.contact.phoneE164}`, "_blank", "noopener,noreferrer"));
      button.dataset.directBookingBound = "true";
    }

    let dragStart = null;
    let suppressNextClick = false;
    button.addEventListener("click", event => {
      if (suppressNextClick) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressNextClick = false;
      }
    }, true);
    button.addEventListener("pointerdown", event => {
      dragStart = { pointerId:event.pointerId, y:event.clientY, top:button.getBoundingClientRect().top, moved:false };
      button.setPointerCapture(event.pointerId);
    });
    button.addEventListener("pointermove", event => {
      if (!dragStart || dragStart.pointerId !== event.pointerId || !button.hasPointerCapture(event.pointerId)) return;
      const deltaY = event.clientY - dragStart.y;
      if (Math.abs(deltaY) > 5) dragStart.moved = true;
      if (!dragStart.moved) return;
      const top = Math.max(12, Math.min(innerHeight - button.offsetHeight - 12, dragStart.top + deltaY));
      button.style.top = `${top}px`;
      button.style.bottom = "auto";
      button.style.right = "18px";
    });
    const finishDrag = event => {
      if (!dragStart || dragStart.pointerId !== event.pointerId) return;
      suppressNextClick = dragStart.moved;
      dragStart = null;
    };
    button.addEventListener("pointerup", finishDrag);
    button.addEventListener("pointercancel", finishDrag);
  }
  /* ===== END BLOCK: WHATSAPP_FLOAT ===== */

  /* ===== BLOCK: PHOTO_OF_MONTH ===== */
  async function initPhotoOfMonth() {
    const slot = document.getElementById("photo-month-slot");
    if (!feature("photoOfMonth")) { if (slot) slot.hidden = true; return; }
    if (!slot) return;
    slot.hidden = false;
    const available = ["gastro talk.webp","endo gallery pic.webp","main pic.webp","potrait gallery.jpg","baby pic.webp","hospital pic.webp","gif 1.webm","gif 2.webm","gif 3.webm","gif 4.webm","gif 5.webm","endo main pic.webp"];
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
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "none";
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

    const carouselViewport = track.parentElement;
    if ("IntersectionObserver" in window && carouselViewport) {
      const cloneVideoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting && !document.hidden && !root.classList.contains("no-motion")) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { root:carouselViewport, rootMargin:"0px 100px", threshold:0.05 });
      track.querySelectorAll('[data-carousel-clone="true"] video').forEach(video => cloneVideoObserver.observe(video));
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) track.querySelectorAll('[data-carousel-clone="true"] video').forEach(video => video.pause());
      });
    }

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
          track.scrollLeft += elapsed * 0.032; /* smooth automatic movement at about 32 pixels per second */
          if (track.scrollLeft >= width) track.scrollLeft %= width;
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
    let galleryImages = [];
    let currentImageIndex = -1;
    let previousButton = viewer.querySelector(".viewer-prev");
    let nextButton = viewer.querySelector(".viewer-next");
    if (!previousButton) {
      previousButton = document.createElement("button");
      previousButton.className = "viewer-prev";
      previousButton.type = "button";
      previousButton.textContent = "‹";
      previousButton.setAttribute("aria-label", "View previous image");
      previousButton.hidden = true;
      viewer.append(previousButton);
    }
    if (!nextButton) {
      nextButton = document.createElement("button");
      nextButton.className = "viewer-next";
      nextButton.type = "button";
      nextButton.textContent = "›";
      nextButton.setAttribute("aria-label", "View next image");
      nextButton.hidden = true;
      viewer.append(nextButton);
    }

    const isBrandOrUiImage = target => {
      const src = target.getAttribute("src") || "";
      const alt = target.getAttribute("alt") || "";
      return Boolean(target.closest(
        ".site-brand,.site-footer-brand,.social-icon,.image-viewer,.kg-rb-booking-dialog," +
        ".appointment-option,.kg-rb-newsletter-form,.site-navigation,.site-footer"
      )) || target.hasAttribute("data-no-viewer") ||
        /kg(?:%20|\s)logo|favicon/i.test(src) ||
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

    function updateNavigation() {
      const hasMultiple = galleryImages.length > 1;
      if (previousButton) previousButton.hidden = !hasMultiple;
      if (nextButton) nextButton.hidden = !hasMultiple;
    }
    function showImage(index) {
      if (!galleryImages.length) return;
      currentImageIndex = (index + galleryImages.length) % galleryImages.length;
      const target = galleryImages[currentImageIndex];
      image.src = target.currentSrc || target.src;
      image.alt = target.alt || "";
      zoom = 1;
      updateZoom();
    }
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
      const heroCarousel = target.closest("[data-hero-carousel]");
      if (heroCarousel) {
        galleryImages = [...heroCarousel.querySelectorAll("[data-hero-slide-item] img")];
      } else {
        galleryImages = [...document.querySelectorAll("main img,.site-page-content img")].filter(isViewableImage);
      }
      currentImageIndex = galleryImages.indexOf(target);
      if (currentImageIndex < 0) {
        galleryImages = [target];
        currentImageIndex = 0;
      }
      previousFocus = target;
      image.src = target.currentSrc || target.src;
      image.alt = target.alt || "";
      updateNavigation();
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
    previousButton && previousButton.addEventListener("click", () => showImage(currentImageIndex - 1));
    nextButton && nextButton.addEventListener("click", () => showImage(currentImageIndex + 1));
    document.addEventListener("keydown", event => {
      if (viewer.hidden) return;
      if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
      if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
    });
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
    root.classList.toggle("kg-motion-enabled", !disabled);
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
  initCanonicalUrls();
  initBrandLogoLinks();
  initNav();
  if (typeof initHomeContent === "function") initHomeContent();
  if (typeof initHeroTyping === "function") initHeroTyping();
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
