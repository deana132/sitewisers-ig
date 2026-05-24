// Seed data for content/topic-bank.json. New entries here are merged into the
// persisted JSON on the next generate-post run (existing used_count / last_used
// are preserved by id).
//
// Each angle has:
//   hook_template: instruction handed to Claude to write the caption
//   template:      which file in templates/ to render (without .html)
//   data:          values for {{placeholders}} in that template
//
// Available templates and their data shape:
//   stat-tile       { stat, caption }
//   quote-tile      { quote }
//   comparison-tile { left_label, left_1, left_2, left_3, right_label, right_1, right_2, right_3 }
//   niche-callout   { niche, statement_line_1, statement_line_2 }
//   lighthouse-flex { subtitle }

export const TOPIC_BANK = [
  // ───── DENTAL ─────
  {
    id: "dental-corporate-chains",
    category: "niche",
    niche: "dental",
    hook_template:
      "Dental practice angle: independent dentists are losing new patients to Bupa, MyDentist, Smile Direct because their websites look ten years older. Hook line: a punchy stat or claim about losing patients. Two short body lines. Tie back to mobile-first design.",
    template: "stat-tile",
    data: {
      stat: "63%",
      caption: "of new patients judge a dental practice on the website before they book.",
    },
  },
  {
    id: "dental-booking-friction",
    category: "niche",
    niche: "dental",
    hook_template:
      "Dental angle: patients want to book online in under 30 seconds. Most dental sites require calling during 9-5 hours when patients are at work. Friction kills bookings. Punchy hook, then 2-3 short observations.",
    template: "quote-tile",
    data: {
      quote: "If booking takes more than thirty seconds, they're already gone.",
    },
  },
  {
    id: "dental-mobile-search",
    category: "niche",
    niche: "dental",
    hook_template:
      "Dental angle: dental searches happen on mobile, in pain, late at night. Your site must load fast and put the phone number above the fold. Hook line then quick observations.",
    template: "niche-callout",
    data: {
      niche: "Dentists.",
      statement_line_1: "Mobile. In pain. Late.",
      statement_line_2: "Make your site load.",
    },
  },

  // ───── MED SPA ─────
  {
    id: "medspa-trust-signals",
    category: "niche",
    niche: "medspa",
    hook_template:
      "Med spa angle: clients are spending £200-£2000 per treatment. Trust is everything. List 2-3 trust signals most med spa sites miss: real before/afters, named practitioners with credentials, GMC numbers, real prices.",
    template: "comparison-tile",
    data: {
      left_label: "Most med spas",
      left_1: "Hidden pricing",
      left_2: "Stock photo team",
      left_3: "No credentials",
      right_label: "Linden Aesthetics",
      right_1: "Prices on page 1",
      right_2: "Real practitioners",
      right_3: "GMC numbers visible",
    },
  },
  {
    id: "medspa-booking-speed",
    category: "niche",
    niche: "medspa",
    hook_template:
      "Med spa angle: if booking a consultation takes more than 30 seconds, they are gone. Specific. Snap.",
    template: "quote-tile",
    data: { quote: "Booking in thirty seconds. Or they're gone." },
  },
  {
    id: "medspa-pricing-transparency",
    category: "niche",
    niche: "medspa",
    hook_template:
      "Med spa angle: hiding prices behind 'enquire for pricing' lost you the booking three clicks ago. The clinic that shows £75 from line one wins. Punchy.",
    template: "niche-callout",
    data: {
      niche: "Med spas.",
      statement_line_1: "Show your prices.",
      statement_line_2: "Or lose the booking.",
    },
  },

  // ───── PHYSIO ─────
  {
    id: "physio-local-seo",
    category: "niche",
    niche: "physio",
    hook_template:
      "Physio angle: ranking for 'sports massage Reading' or '[your town] sports physio' beats ranking for 'physiotherapy'. Local intent converts. Hook then one tactical line.",
    template: "niche-callout",
    data: {
      niche: "Physios.",
      statement_line_1: "Rank for your town,",
      statement_line_2: "not your service.",
    },
  },
  {
    id: "physio-service-pages",
    category: "niche",
    niche: "physio",
    hook_template:
      "Physio angle: one service per page beats a single 'services' menu. Each page can rank for its own keyword. Sports massage. Post-op rehab. Bike fitting. Punchy.",
    template: "quote-tile",
    data: { quote: "One service. One page. One keyword." },
  },
  {
    id: "physio-injury-keyword",
    category: "niche",
    niche: "physio",
    hook_template:
      "Physio angle: searches like 'ACL recovery Reading' or 'sports massage Wokingham' beat ranking for the generic word 'physiotherapy'. Niche the page, win the search. Punch the hook.",
    template: "quote-tile",
    data: { quote: "'ACL recovery Reading' beats 'physiotherapy'. Every time." },
  },
  {
    id: "physio-evidence-trust",
    category: "niche",
    niche: "physio",
    hook_template:
      "Physio angle: patients want named therapists with credentials. Not 'meet the team' photos with first names only. Show full names, HCPC registration, what each clinician actually treats.",
    template: "comparison-tile",
    data: {
      left_label: "Most physio sites",
      left_1: "First names only",
      left_2: "Vague credentials",
      left_3: "Stock action photos",
      right_label: "What patients want",
      right_1: "Full name + HCPC",
      right_2: "Specialties listed",
      right_3: "Real clinic photos",
    },
  },

  // ───── PT ─────
  {
    id: "pt-dead-website",
    category: "niche",
    niche: "pt",
    hook_template:
      "Personal trainer angle: your Instagram is doing the heavy lifting. Your bio sends people to a dead landing page that does not convert. Snap line then one observation.",
    template: "niche-callout",
    data: {
      niche: "Personal trainers.",
      statement_line_1: "Instagram does the work.",
      statement_line_2: "Your site does nothing.",
    },
  },
  {
    id: "pt-show-pricing",
    category: "niche",
    niche: "pt",
    hook_template:
      "PT angle: show your prices. Stop the 'message for prices' nonsense. Clients self-qualify when prices are visible. You waste fewer DMs.",
    template: "quote-tile",
    data: { quote: "Show your prices. Stop the 'message for prices' nonsense." },
  },
  {
    id: "pt-bio-link-death",
    category: "niche",
    niche: "pt",
    hook_template:
      "PT angle: your Instagram bio link sends people to a slow homepage. They bounce in under 2 seconds. Six months of audience building, lost at the door.",
    template: "niche-callout",
    data: {
      niche: "Personal trainers.",
      statement_line_1: "Your bio link",
      statement_line_2: "goes nowhere fast.",
    },
  },
  {
    id: "pt-niche-vs-generalist",
    category: "niche",
    niche: "pt",
    hook_template:
      "PT angle: niche personal trainers (postnatal, athletes, over-50s, hybrid lifters) book out faster than generalists. The site needs to lead with the niche, not 'one-to-one personal training'.",
    template: "stat-tile",
    data: {
      stat: "3x",
      caption: "Niche PTs book out three times faster than generalists.",
    },
  },

  // ───── BUILDERS ─────
  {
    id: "builders-portfolio-photos",
    category: "niche",
    niche: "builder",
    hook_template:
      "Builder angle: clients want to see your work. Not read about your values. Big photos, brief project descriptions, postcode of the job, that is the site you need.",
    template: "niche-callout",
    data: {
      niche: "Builders.",
      statement_line_1: "Photos sell the work.",
      statement_line_2: "Words do not.",
    },
  },
  {
    id: "builders-quote-friction",
    category: "niche",
    niche: "builder",
    hook_template:
      "Builder angle: three reasons builders do not get quote requests through their site. 1: no photos of recent work. 2: no clear contact form. 3: site loads in 6 seconds. Tight list.",
    template: "comparison-tile",
    data: {
      left_label: "Why builders lose quotes",
      left_1: "No project photos",
      left_2: "Buried contact form",
      left_3: "Six second load",
      right_label: "Sitewisers builders",
      right_1: "Photo galleries",
      right_2: "One-tap quote form",
      right_3: "Under one second",
    },
  },
  {
    id: "builders-postcode-pages",
    category: "niche",
    niche: "builder",
    hook_template:
      "Builder angle: one page per service area beats one generic 'we cover the Thames Valley' line. 'Loft conversions Reading'. 'Extensions Wokingham'. Each one ranks for its postcode.",
    template: "quote-tile",
    data: { quote: "One page per area. 'Loft conversions Reading'. Done." },
  },
  {
    id: "builders-reviews-on-page",
    category: "niche",
    niche: "builder",
    hook_template:
      "Builder angle: embed Google reviews on the homepage. Stop sending visitors away to your Google Business Profile to read them. The visit that leaves to read reviews rarely comes back.",
    template: "niche-callout",
    data: {
      niche: "Builders.",
      statement_line_1: "Embed your reviews.",
      statement_line_2: "On the homepage.",
    },
  },

  // ───── NAIL SALONS ─────
  {
    id: "nails-stuck-in-2014",
    category: "niche",
    niche: "nails",
    hook_template:
      "Nail salon angle: your website looks like a 2014 Wix template. Pink gradient. Stock photo of a manicure. Comic Sans tagline. Snap commentary then a brand observation.",
    template: "niche-callout",
    data: {
      niche: "Nail salons.",
      statement_line_1: "Your site is from 2014.",
      statement_line_2: "Your bookings noticed.",
    },
  },
  {
    id: "nails-instagram-bookings",
    category: "niche",
    niche: "nails",
    hook_template:
      "Nail salon angle: taking all bookings through Instagram DMs leaks margin to Meta and wastes your time. Your own site with a booking calendar is twenty quid a month, not lost commission.",
    template: "quote-tile",
    data: { quote: "DM bookings cost you margin. Every single time." },
  },
  {
    id: "nails-portfolio-grid",
    category: "niche",
    niche: "nails",
    hook_template:
      "Nail salon angle: your nail work IS the portfolio. Big visual grid on the homepage. Not a 'gallery' menu link buried two clicks deep. Show the work above the fold.",
    template: "quote-tile",
    data: { quote: "Your nail work is the portfolio. Show it." },
  },
  {
    id: "nails-walk-in-status",
    category: "niche",
    niche: "nails",
    hook_template:
      "Nail salon angle: 'Are you open for walk-ins right now?' is the question every salon site needs to answer. Most don't. Live availability beats every 'about us' page ever written.",
    template: "niche-callout",
    data: {
      niche: "Nail salons.",
      statement_line_1: "Open for walk-ins?",
      statement_line_2: "Answer it on page one.",
    },
  },

  // ───── BARBERS ─────
  {
    id: "barbers-open-now",
    category: "niche",
    niche: "barber",
    hook_template:
      "Barber angle: your site only needs to answer one question. 'Are you open right now?' Address, hours, walk-in or appointment. That is the whole site.",
    template: "niche-callout",
    data: {
      niche: "Barbers.",
      statement_line_1: "Are you open right now?",
      statement_line_2: "That is the whole site.",
    },
  },
  {
    id: "barbers-all-look-same",
    category: "niche",
    niche: "barber",
    hook_template:
      "Barber angle: every barber site in the UK uses the same template. Same brick wall photo. Same vintage chair photo. Why blend in. Snap line then observation.",
    template: "quote-tile",
    data: { quote: "Every barber site looks the same. Yours doesn't have to." },
  },
  {
    id: "barbers-mobile-only",
    category: "niche",
    niche: "barber",
    hook_template:
      "Barber angle: nobody books a haircut from a desktop. Design entirely for the phone. Ignore the desktop demo. Force every decision through the mobile screen first.",
    template: "stat-tile",
    data: {
      stat: "100%",
      caption: "of haircut bookings happen on a phone. Design for it.",
    },
  },
  {
    id: "barbers-pricing-board",
    category: "niche",
    niche: "barber",
    hook_template:
      "Barber angle: your price board hangs above the chair. It belongs on the homepage too. Same prices, same order. Consistency builds trust before the first visit.",
    template: "quote-tile",
    data: { quote: "Your price board belongs on the homepage too." },
  },

  // ───── BEAUTICIANS ─────
  {
    id: "beauticians-service-overload",
    category: "niche",
    niche: "beautician",
    hook_template:
      "Beautician angle: 12 services on the homepage is too many. Pick your top three. Lead with them. The rest live on inner pages. Cognitive load kills bookings.",
    template: "quote-tile",
    data: { quote: "Twelve services on the homepage is too many." },
  },
  {
    id: "beauticians-template-aesthetic",
    category: "niche",
    niche: "beautician",
    hook_template:
      "Beautician angle: your beauty business deserves a site that does not look like a Squarespace template. Editorial. Mobile-first. Built around your service photography.",
    template: "niche-callout",
    data: {
      niche: "Beauticians.",
      statement_line_1: "Editorial design.",
      statement_line_2: "Not Squarespace templates.",
    },
  },
  {
    id: "beauticians-service-photos",
    category: "niche",
    niche: "beautician",
    hook_template:
      "Beautician angle: treatment result photos belong on the service page. Not three clicks deep in a 'gallery'. Show the result next to the treatment description, every time.",
    template: "quote-tile",
    data: { quote: "Result photos on the service page. Not three clicks deep." },
  },
  {
    id: "beauticians-package-deals",
    category: "niche",
    niche: "beautician",
    hook_template:
      "Beautician angle: package pricing converts better than per-treatment pricing. Bundle three sessions. Show the saving. Anchor the per-treatment price against the package.",
    template: "niche-callout",
    data: {
      niche: "Beauticians.",
      statement_line_1: "Package pricing converts.",
      statement_line_2: "Per-treatment does not.",
    },
  },

  // ───── CLEANERS ─────
  {
    id: "cleaners-trust-locally",
    category: "niche",
    niche: "cleaner",
    hook_template:
      "Cleaning services angle: this is a trust game. Photos of the actual team, postcode coverage, real reviews with names, transparent pricing. Sites without these get ignored.",
    template: "comparison-tile",
    data: {
      left_label: "Cleaners that lose calls",
      left_1: "Stock photos",
      left_2: "No postcode list",
      left_3: "Vague pricing",
      right_label: "Cleaners that book",
      right_1: "Real team photos",
      right_2: "Postcodes listed",
      right_3: "From £18 an hour",
    },
  },
  {
    id: "cleaners-show-pricing",
    category: "niche",
    niche: "cleaner",
    hook_template:
      "Cleaners angle: 'request a quote' loses to 'from £18 an hour'. Show pricing. Convert browsers into bookers.",
    template: "stat-tile",
    data: {
      stat: "£18/hr",
      caption: "beats 'request a quote'. Every time.",
    },
  },
  {
    id: "cleaners-postcode-coverage",
    category: "niche",
    niche: "cleaner",
    hook_template:
      "Cleaners angle: list every postcode you cover, as a real page each. 'Office cleaning RG1'. 'Domestic cleaning RG2'. Each one ranks. Local intent converts.",
    template: "niche-callout",
    data: {
      niche: "Cleaners.",
      statement_line_1: "Every postcode is",
      statement_line_2: "its own ranking page.",
    },
  },
  {
    id: "cleaners-quote-calculator",
    category: "niche",
    niche: "cleaner",
    hook_template:
      "Cleaners angle: replace 'request a quote' with a 30-second calculator. Bedrooms, frequency, postcode. Show the estimate immediately. Triple the inbound lead rate.",
    template: "comparison-tile",
    data: {
      left_label: "Request a quote",
      left_1: "Friction",
      left_2: "Slow reply",
      left_3: "Low conversion",
      right_label: "30-sec calculator",
      right_1: "Instant estimate",
      right_2: "Self-qualified",
      right_3: "3x conversion",
    },
  },

  // ───── ACCOUNTANTS ─────
  {
    id: "accountants-1990s-tone",
    category: "niche",
    niche: "accountant",
    hook_template:
      "Accountants angle: your site reads like a 1995 law firm. 'Bespoke solutions for the modern enterprise'. Clients want plain English. Drop the corporate voice.",
    template: "niche-callout",
    data: {
      niche: "Accountants.",
      statement_line_1: "Stop sounding like",
      statement_line_2: "a 1995 law firm.",
    },
  },
  {
    id: "accountants-niche-down",
    category: "niche",
    niche: "accountant",
    hook_template:
      "Accountant angle: niche down your accounting site. 'Accountant for dentists in the South East' beats 'accountant'. Specificity ranks and converts.",
    template: "quote-tile",
    data: { quote: "Niche down. Generalist accountants get ignored." },
  },
  {
    id: "accountants-deadlines-content",
    category: "niche",
    niche: "accountant",
    hook_template:
      "Accountant angle: tax deadlines drive search. Self-assessment 31 January. VAT quarterly. Payroll weekly. A deadline page for each. Rank for the question, win the client.",
    template: "quote-tile",
    data: { quote: "Rank for the deadline. Win the client." },
  },
  {
    id: "accountants-package-pricing",
    category: "niche",
    niche: "accountant",
    hook_template:
      "Accountant angle: visible package pricing. Sole trader £60 a month. Limited company £120 a month. Hidden pricing tells prospects 'too expensive'. Show it.",
    template: "stat-tile",
    data: {
      stat: "£60/mo",
      caption: "Sole trader package. Limited company £120/mo. Visible pricing.",
    },
  },

  // ───── ELECTRICIANS ─────
  {
    id: "electricians-emergency-mobile",
    category: "niche",
    niche: "electrician",
    hook_template:
      "Electrician angle: the emergency call comes from a mobile, at 11pm, from someone with no power. Your site must load in under 2 seconds. Phone number must be tappable above the fold.",
    template: "niche-callout",
    data: {
      niche: "Electricians.",
      statement_line_1: "Eleven pm. No power.",
      statement_line_2: "Make the call easy.",
    },
  },
  {
    id: "electricians-credentials",
    category: "niche",
    niche: "electrician",
    hook_template:
      "Electrician angle: Gas Safe, NICEIC, Part P. Real credentials in the header. Not hidden in a footer 'about us' page. Trust above the fold or you lose the call.",
    template: "quote-tile",
    data: { quote: "NICEIC. Part P. Trustmark. In the header. Not the footer." },
  },
  {
    id: "electricians-postcode-pages",
    category: "niche",
    niche: "electrician",
    hook_template:
      "Electrician angle: one page per town. 'Electrician Reading'. 'Electrician Wokingham'. 'EV charger installer Maidenhead'. Local intent ranks fast. Generic catchment pages do not.",
    template: "quote-tile",
    data: { quote: "Electrician Reading. Electrician Wokingham. One page each." },
  },
  {
    id: "electricians-photo-gallery",
    category: "niche",
    niche: "electrician",
    hook_template:
      "Electrician angle: photos of finished installations. Consumer units. EV chargers. Smart home wiring. Visual proof beats credentials alone. Hang the work on the homepage.",
    template: "niche-callout",
    data: {
      niche: "Electricians.",
      statement_line_1: "Consumer units. EV chargers.",
      statement_line_2: "Show the work.",
    },
  },

  // ───── PAIN POINTS ─────
  {
    id: "pain-slow-sites-conversions",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: every 1 second of load time costs 7 percent of conversions. Reference Akamai. Punch the stat. Tie to the service business owner.",
    template: "stat-tile",
    data: {
      stat: "7%",
      caption: "of conversions lost per second of load time. (Akamai)",
    },
  },
  {
    id: "pain-wix-bloat",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: Wix and Squarespace templates ship 6MB of bloat your visitors do not need. Custom builds load in a fraction of the weight. Specific, technical, confident.",
    template: "comparison-tile",
    data: {
      left_label: "Wix template",
      left_1: "6.2MB page weight",
      left_2: "Slow on 4G",
      left_3: "Hidden bloat",
      right_label: "Custom build",
      right_1: "400KB page weight",
      right_2: "Instant on mobile",
      right_3: "Nothing wasted",
    },
  },
  {
    id: "pain-mobile-vs-desktop",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: 80 percent of UK service business traffic is mobile. Most agency sites still get designed on a 27 inch monitor. The result is obvious on a phone.",
    template: "stat-tile",
    data: {
      stat: "80%",
      caption: "of UK service business traffic is mobile.",
    },
  },
  {
    id: "pain-bounce-rate-homepage",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: bounce rate over 70 percent means your homepage does not answer the visitor's question in the first 2 seconds. Direct line. Then one fix.",
    template: "stat-tile",
    data: {
      stat: "70%",
      caption: "bounce rate means your homepage doesn't answer the question.",
    },
  },
  {
    id: "pain-cookie-banner",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: GDPR cookie banners that nuke your mobile conversion rate. Half the screen is a banner. Visitors leave before they ever see the hero.",
    template: "quote-tile",
    data: { quote: "Your cookie banner is eating half the screen." },
  },

  // ───── DEMO SHOWCASES ─────
  {
    id: "demo-thorne-dental-lighthouse",
    category: "demo",
    niche: "dental",
    hook_template:
      "Demo showcase: Thorne Dental. 100/100 Lighthouse mobile. Live demo. One short line about what makes it score. Punchy.",
    template: "lighthouse-flex",
    data: { subtitle: "Thorne Dental. Mobile. Live demo." },
  },
  {
    id: "demo-thorne-booking-flow",
    category: "demo",
    niche: "dental",
    hook_template:
      "Demo showcase: Thorne Dental's booking flow. Three taps from homepage to appointment confirmed. No phone call, no opening hours dance.",
    template: "quote-tile",
    data: { quote: "Thorne Dental: three taps to a booked appointment." },
  },
  {
    id: "demo-linden-aesthetics",
    category: "demo",
    niche: "medspa",
    hook_template:
      "Demo showcase: Linden Aesthetics. Med spa site that respects the buyer. Pricing visible. Practitioner credentials in the header. Real photography area.",
    template: "niche-callout",
    data: {
      niche: "Linden Aesthetics.",
      statement_line_1: "A med spa site",
      statement_line_2: "that respects the buyer.",
    },
  },
  {
    id: "demo-linden-trust",
    category: "demo",
    niche: "medspa",
    hook_template:
      "Demo showcase: how Linden Aesthetics builds trust without a single stock photo. Named practitioners. Real GMC numbers. Editorial confidence.",
    template: "comparison-tile",
    data: {
      left_label: "Most med spas",
      left_1: "Stock photos",
      left_2: "No pricing",
      left_3: "Anonymous staff",
      right_label: "Linden Aesthetics",
      right_1: "Real photography",
      right_2: "Prices on page 1",
      right_3: "GMC numbers shown",
    },
  },
  {
    id: "demo-kestrel-physio",
    category: "demo",
    niche: "physio",
    hook_template:
      "Demo showcase: Kestrel Physio. One service per page. Each one ranking locally. Local SEO done by structure, not by stuffing keywords.",
    template: "niche-callout",
    data: {
      niche: "Kestrel Physio.",
      statement_line_1: "One service per page.",
      statement_line_2: "Ranking for each.",
    },
  },
  {
    id: "demo-kestrel-services",
    category: "demo",
    niche: "physio",
    hook_template:
      "Demo showcase: Kestrel Physio. Sports massage. Post-op rehab. Bike fitting. Each one a standalone page. Each one ranks for its own keyword in its town.",
    template: "quote-tile",
    data: { quote: "Sports massage. Post-op rehab. Bike fitting. Each its own page." },
  },
  {
    id: "demo-forge-pt",
    category: "demo",
    niche: "pt",
    hook_template:
      "Demo showcase: Forge PT. Built for trainers whose audience comes from Instagram. Loud. Bold. Mobile first. Books in three taps.",
    template: "niche-callout",
    data: {
      niche: "Forge PT.",
      statement_line_1: "Instagram-bait",
      statement_line_2: "that actually converts.",
    },
  },
  {
    id: "demo-forge-pricing",
    category: "demo",
    niche: "pt",
    hook_template:
      "Demo showcase: Forge PT puts prices on the homepage. £60 a session. £500 a month. Visitors qualify themselves before they message.",
    template: "stat-tile",
    data: {
      stat: "£60",
      caption: "per session. £500 per month. On the homepage. Forge PT.",
    },
  },
  {
    id: "demo-marne-lyle",
    category: "demo",
    niche: "beautician",
    hook_template:
      "Demo showcase: Marne & Lyle. Editorial layout for a beauty brand. Big type. Quiet whitespace. Confident.",
    template: "niche-callout",
    data: {
      niche: "Marne & Lyle.",
      statement_line_1: "Editorial beauty site.",
      statement_line_2: "Not a Squarespace clone.",
    },
  },
  {
    id: "demo-marne-aesthetic",
    category: "demo",
    niche: "beautician",
    hook_template:
      "Demo showcase: Marne & Lyle. Built like a print magazine. Reads like one too. Why service brands deserve editorial design.",
    template: "quote-tile",
    data: { quote: "Built like a print magazine. Reads like one." },
  },

  // ───── CASE STUDIES ─────
  {
    id: "case-amber-oak-before",
    category: "case-study",
    niche: "all",
    hook_template:
      "Case study: Amber Oak. Before our retrofit: 4.2 second load time, 38 percent bounce on mobile, 4 quote requests a month. Old WordPress build. Big hero video. Cookie banner that ate half the screen.",
    template: "stat-tile",
    data: {
      stat: "4.2s",
      caption: "Amber Oak before. 38% bounce. Four quotes a month.",
    },
  },
  {
    id: "case-amber-oak-after",
    category: "case-study",
    niche: "all",
    hook_template:
      "Case study: Amber Oak. After our retrofit: 0.9 second load, 14 percent bounce, 23 quote requests a month. Same content. New build. 60 days.",
    template: "comparison-tile",
    data: {
      left_label: "Amber Oak before",
      left_1: "4.2s load",
      left_2: "38% bounce",
      left_3: "4 quotes/month",
      right_label: "Amber Oak after",
      right_1: "0.9s load",
      right_2: "14% bounce",
      right_3: "23 quotes/month",
    },
  },
  {
    id: "case-ridgeline-before",
    category: "case-study",
    niche: "all",
    hook_template:
      "Case study: Ridgeline. Before: looked great on the desktop demo. Ranked nowhere. Bounced everyone on mobile. The site existed to be admired, not to convert.",
    template: "quote-tile",
    data: { quote: "Looked great on desktop. Ranked nowhere. Bounced on mobile." },
  },
  {
    id: "case-ridgeline-after",
    category: "case-study",
    niche: "all",
    hook_template:
      "Case study: Ridgeline. After: top 3 organic for every service in their town. 6x more quote requests. We rebuilt mobile-first and let desktop inherit. The right order.",
    template: "comparison-tile",
    data: {
      left_label: "Ridgeline before",
      left_1: "Page 2 rankings",
      left_2: "Mobile bounce",
      left_3: "Few enquiries",
      right_label: "Ridgeline after",
      right_1: "Top 3 every service",
      right_2: "Mobile-first build",
      right_3: "Six times the leads",
    },
  },

  // ───── LIGHTHOUSE FLEXES ─────
  {
    id: "flex-all-demos-100",
    category: "flex",
    niche: "all",
    hook_template:
      "Flex: all five Sitewisers demos hit 100/100 Lighthouse on mobile. Most agencies who sell 'fast websites' score 60. Open the inspector. Check.",
    template: "lighthouse-flex",
    data: { subtitle: "Five demos. Every score. Every device." },
  },
  {
    id: "flex-lighthouse-not-vanity",
    category: "flex",
    niche: "all",
    hook_template:
      "Flex: Lighthouse 100 is not vanity. It is a proxy for everything that matters. Load time. Layout shift. Accessibility. Tap target sizes. Site speed wins bookings.",
    template: "lighthouse-flex",
    data: { subtitle: "Lighthouse 100 is not vanity. It is the floor." },
  },
  {
    id: "flex-lighthouse-vs-most",
    category: "flex",
    niche: "all",
    hook_template:
      "Flex: Lighthouse 100 mobile vs Lighthouse 60. The conversion gap is enormous. Specific numbers. Punch.",
    template: "comparison-tile",
    data: {
      left_label: "Most agencies",
      left_1: "60 Lighthouse",
      left_2: "3s+ load",
      left_3: "Slow on mobile",
      right_label: "Sitewisers",
      right_1: "100/100 mobile",
      right_2: "Sub-1s load",
      right_3: "Five live demos",
    },
  },
  {
    id: "flex-inspector-check",
    category: "flex",
    niche: "all",
    hook_template:
      "Flex: any agency can claim fast websites. Open Chrome DevTools, run Lighthouse on their portfolio. The score is the only honest answer. Direct call-out.",
    template: "quote-tile",
    data: { quote: "Open DevTools. Run Lighthouse. The score is the answer." },
  },

  // ───── STATS ─────
  {
    id: "stat-1s-akamai",
    category: "stat",
    niche: "all",
    hook_template:
      "Stat: 1 second of load time costs 11 percent of pageviews. Akamai data. Tight commentary, tie to service businesses.",
    template: "stat-tile",
    data: {
      stat: "11%",
      caption: "of pageviews lost per second of load time. (Akamai)",
    },
  },
  {
    id: "stat-53-percent-mobile",
    category: "stat",
    niche: "all",
    hook_template:
      "Stat: 53 percent of mobile visitors abandon a site that takes over 3 seconds to load. Google data. Tie to UK service business behaviour.",
    template: "stat-tile",
    data: {
      stat: "53%",
      caption: "of mobile users leave a site that loads over 3 seconds. (Google)",
    },
  },
  {
    id: "stat-75-percent-design",
    category: "stat",
    niche: "all",
    hook_template:
      "Stat: 75 percent of users judge a business's credibility based on website design alone. Stanford research. Punch the implication.",
    template: "stat-tile",
    data: {
      stat: "75%",
      caption: "of users judge your credibility on design alone. (Stanford)",
    },
  },
  {
    id: "stat-bounce-uk-avg",
    category: "stat",
    niche: "all",
    hook_template:
      "Stat: UK service business sites average a 58 percent bounce rate. Sitewisers demo sites average 24. The difference is the design.",
    template: "comparison-tile",
    data: {
      left_label: "UK service avg",
      left_1: "58% bounce",
      left_2: "3.2s load",
      left_3: "55 Lighthouse",
      right_label: "Sitewisers demos",
      right_1: "24% bounce",
      right_2: "0.9s load",
      right_3: "100 Lighthouse",
    },
  },

  // ───── QUICK TIPS ─────
  {
    id: "tip-one-cta",
    category: "tip",
    niche: "all",
    hook_template:
      "Quick tip: one primary CTA per page. Not four. Choice paralysis kills conversions. Punch hook then one line of why.",
    template: "quote-tile",
    data: { quote: "One CTA per page. Stop offering four choices." },
  },
  {
    id: "tip-kill-the-slider",
    category: "tip",
    niche: "all",
    hook_template:
      "Quick tip: if your hero is a rotating slideshow, kill it. Nobody waits for slide 3. Pick your strongest message, lock it.",
    template: "quote-tile",
    data: { quote: "If your hero is a slideshow, kill it. Nobody waits for slide 3." },
  },
  {
    id: "tip-form-fields",
    category: "tip",
    niche: "all",
    hook_template:
      "Quick tip: contact forms with more than 5 fields cut conversions in half. Cut the dropdown. Cut the company size question. Cut anything you do not act on.",
    template: "stat-tile",
    data: {
      stat: "50%",
      caption: "fewer conversions when your form has more than five fields.",
    },
  },
  {
    id: "tip-tappable-phone",
    category: "tip",
    niche: "all",
    hook_template:
      "Quick tip: your phone number must be tappable on every single page. Mobile users do not retype 11 digits. Sticky header with a phone link.",
    template: "quote-tile",
    data: { quote: "Your phone number must be tappable on every page." },
  },
  {
    id: "tip-compress-images",
    category: "tip",
    niche: "all",
    hook_template:
      "Quick tip: compress your images. Most service business sites ship 8MB hero images that could be 200KB without visible loss. WebP, AVIF, sized for the viewport.",
    template: "comparison-tile",
    data: {
      left_label: "Most service sites",
      left_1: "8MB hero image",
      left_2: "JPEG, full size",
      left_3: "No lazy load",
      right_label: "Sitewisers",
      right_1: "200KB hero",
      right_2: "AVIF / WebP",
      right_3: "Lazy-loaded",
    },
  },
  {
    id: "tip-hide-no-prices",
    category: "tip",
    niche: "all",
    hook_template:
      "Quick tip: if your prices are not on your site, your prospect's first impression is 'too expensive'. Even a 'from £X' line beats nothing.",
    template: "quote-tile",
    data: { quote: "No prices on your site? First impression is 'too expensive'." },
  },

  // ───── OBSERVATIONS ─────
  {
    id: "obs-agencies-look-same",
    category: "observation",
    niche: "all",
    hook_template:
      "Observation: every UK web design agency site looks the same. Big hero video. 'We craft digital experiences'. A team photo. Snap commentary.",
    template: "quote-tile",
    data: { quote: "Every UK agency site looks the same. Big hero video. Team photo. Boring." },
  },
  {
    id: "obs-stop-chasing-trends",
    category: "observation",
    niche: "all",
    hook_template:
      "Observation: stop chasing design trends. Parallax. Cursor effects. Locomotive scroll. Service businesses need clarity. Trends slow sites down.",
    template: "quote-tile",
    data: { quote: "Stop chasing trends. Service businesses need clarity." },
  },
  {
    id: "obs-starter-pricing",
    category: "observation",
    niche: "all",
    hook_template:
      "Observation: starter site, £1,200. Most agencies quote £5k for the same scope, deliver slower, and use the same Webflow templates we built ours from. Direct.",
    template: "stat-tile",
    data: {
      stat: "£1,200",
      caption: "Starter site. Same scope. Most agencies quote £5k.",
    },
  },
  {
    id: "obs-growth-package",
    category: "observation",
    niche: "all",
    hook_template:
      "Observation: Growth package, £2,000 plus £400 a month. Includes Lighthouse 100 guarantee. If we drop a score, we fix it. No retainer required without value.",
    template: "stat-tile",
    data: {
      stat: "£400/mo",
      caption: "Growth retainer. £2,000 build. Lighthouse 100 guarantee.",
    },
  },
  {
    id: "obs-mobile-first-actually",
    category: "observation",
    niche: "all",
    hook_template:
      "Observation: 'mobile-first' is the most-claimed-and-least-practiced phrase in web design. If you opened the Figma on a desktop screen, it was not mobile-first.",
    template: "quote-tile",
    data: { quote: "Mobile-first is the most-claimed and least-practiced phrase in design." },
  },
  {
    id: "obs-stock-photos-die",
    category: "observation",
    niche: "all",
    hook_template:
      "Observation: stock photos are a tell. Generic smiling team. Generic handshake. Generic laptop. Visitors clock it instantly and trust evaporates. Real photos or none.",
    template: "quote-tile",
    data: { quote: "Stock photos are a tell. Visitors clock it instantly." },
  },

  // ═══════════════════════════════════════════════════════════════════
  // EXPANSION BATCH (autonomous push, 2026-05-24)
  // 46 angles: under-rep niches, seasonal, mobile UX pain, more demos, UK stats
  // ═══════════════════════════════════════════════════════════════════

  // ───── NAILS (more) ─────
  {
    id: "nails-technique-keywords",
    category: "niche",
    niche: "nails",
    hook_template:
      "Nail salon angle: rank for the technique plus town. 'Russian manicure Reading'. 'BIAB Wokingham'. 'Builder gel Maidenhead'. Technique searchers convert. Generic searchers do not.",
    template: "quote-tile",
    data: { quote: "Russian manicure Reading. BIAB Wokingham. Rank for what they search." },
  },
  {
    id: "nails-cancellation-policy",
    category: "niche",
    niche: "nails",
    hook_template:
      "Nail salon angle: missed appointments cost an hour of chair time. Your cancellation policy belongs on the booking page, not buried in T&Cs. Set the expectation up front.",
    template: "quote-tile",
    data: { quote: "Your cancellation policy belongs on the booking page. Not in the small print." },
  },

  // ───── BARBERS (more) ─────
  {
    id: "barbers-walk-in-or-book",
    category: "niche",
    niche: "barber",
    hook_template:
      "Barber angle: clear up walk-in vs booking on page one. Half your visitors want a same-day chair, half want to plan. One sentence solves it. Most sites leave both groups guessing.",
    template: "comparison-tile",
    data: {
      left_label: "What sites do",
      left_1: "Walk-in?",
      left_2: "Or booking?",
      left_3: "Visitors guess",
      right_label: "What sites should",
      right_1: "Walk-in 9-2",
      right_2: "Booking 2-7",
      right_3: "One clear line",
    },
  },
  {
    id: "barbers-instagram-portfolio",
    category: "niche",
    niche: "barber",
    hook_template:
      "Barber angle: stop writing 'skilled in all modern styles'. Show twelve recent cuts. Visual proof beats every adjective. The site becomes a portfolio, not a brochure.",
    template: "quote-tile",
    data: { quote: "Stop writing about cuts. Show twelve." },
  },

  // ───── BEAUTICIANS (more) ─────
  {
    id: "beauticians-treatment-glossary",
    category: "niche",
    niche: "beautician",
    hook_template:
      "Beautician angle: 'CACI'. 'HIFU'. 'LED light therapy'. Most clients have no idea what these acronyms mean. Plain-English explanations on every treatment page. Trust through clarity.",
    template: "quote-tile",
    data: { quote: "Explain the acronyms. CACI. HIFU. LED. Clients won't ask, they'll just leave." },
  },
  {
    id: "beauticians-loyalty-on-site",
    category: "niche",
    niche: "beautician",
    hook_template:
      "Beautician angle: your loyalty programme deserves a page. Sixth treatment free. Birthday discount. Referral credit. Most beauty sites hide these in a footer link.",
    template: "niche-callout",
    data: {
      niche: "Beauticians.",
      statement_line_1: "Your loyalty programme",
      statement_line_2: "deserves a page.",
    },
  },

  // ───── CLEANERS (more) ─────
  {
    id: "cleaners-domestic-vs-commercial",
    category: "niche",
    niche: "cleaner",
    hook_template:
      "Cleaning services angle: domestic clients and commercial clients want different things. Two homepages. Two pricing pages. One site trying to do both fails both audiences.",
    template: "comparison-tile",
    data: {
      left_label: "Domestic clients want",
      left_1: "Hourly pricing",
      left_2: "Weekly slots",
      left_3: "Friendly tone",
      right_label: "Commercial clients want",
      right_1: "Contract terms",
      right_2: "Out-of-hours",
      right_3: "Insurance proof",
    },
  },
  {
    id: "cleaners-insurance-shown",
    category: "niche",
    niche: "cleaner",
    hook_template:
      "Cleaning angle: public liability cover. Treasury Bond. DBS. Insurance proof in the header builds instant trust. Most cleaners list it on an 'about' page nobody reads.",
    template: "quote-tile",
    data: { quote: "Insurance details belong in the header. Not the about page." },
  },

  // ───── ACCOUNTANTS (more) ─────
  {
    id: "accountants-mtd-content",
    category: "niche",
    niche: "accountant",
    hook_template:
      "Accountants angle: Making Tax Digital is the biggest UK accounting search trend in five years. Most accountant sites have zero MTD content. Free traffic sitting on the table.",
    template: "stat-tile",
    data: {
      stat: "MTD",
      caption: "Making Tax Digital. The biggest UK accounting search trend in five years. You're nowhere on it.",
    },
  },
  {
    id: "accountants-free-first-call",
    category: "niche",
    niche: "accountant",
    hook_template:
      "Accountants angle: 'Free 20-minute first call' on the homepage CTA outperforms 'Get a quote' every time. Lower friction. Higher booking rate. Same conversion downstream.",
    template: "quote-tile",
    data: { quote: "'Free 20-min first call' beats 'Get a quote'. Every time." },
  },

  // ───── ELECTRICIANS (more) ─────
  {
    id: "electricians-ev-charger",
    category: "niche",
    niche: "electrician",
    hook_template:
      "Electrician angle: EV charger installation is the fastest-growing UK electrical service. Dedicated landing page per town. OZEV grant info. Tesla, ChargePoint, Pod Point logos for trust.",
    template: "niche-callout",
    data: {
      niche: "Electricians.",
      statement_line_1: "EV charger installs.",
      statement_line_2: "Build the page. Win the area.",
    },
  },
  {
    id: "electricians-pat-testing",
    category: "niche",
    niche: "electrician",
    hook_template:
      "Electrician angle: PAT testing for businesses is recurring revenue. Annual contracts. Easy upsell from one-off installs. Most electricians do not even list it as a service.",
    template: "quote-tile",
    data: { quote: "PAT testing is recurring revenue. Most sites don't even list it." },
  },

  // ───── PAIN: MOBILE UX ─────
  {
    id: "pain-tap-targets-too-small",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: tap targets under 44 pixels miss on mobile. Apple's HIG. Google's MUI. Your phone-number link, your CTA button, your menu icon. If a thumb misses, you lose the call.",
    template: "stat-tile",
    data: {
      stat: "44px",
      caption: "Minimum tap target. Anything smaller and thumbs miss it.",
    },
  },
  {
    id: "pain-mobile-text-tiny",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: 14px body text on mobile forces pinch-zoom. Visitors who pinch-zoom rarely come back. 16px minimum on mobile. 18px is better. Stop designing on a 27 inch monitor.",
    template: "comparison-tile",
    data: {
      left_label: "Most service sites",
      left_1: "14px body",
      left_2: "Pinch to zoom",
      left_3: "Visitors leave",
      right_label: "Built for thumbs",
      right_1: "18px body",
      right_2: "Readable as-is",
      right_3: "Visitors stay",
    },
  },

  // ───── PAIN: BOOKING / CHECKOUT ─────
  {
    id: "pain-multi-step-booking",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: more than three steps to book and conversion halves. Most service business booking flows are five to seven steps. Cut the form fields. Skip the calendar pages. Confirm fast.",
    template: "stat-tile",
    data: {
      stat: "3 steps",
      caption: "More than three to book and conversion halves.",
    },
  },
  {
    id: "pain-account-required",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: forcing account creation before booking is the second biggest conversion killer after slow load. Guest checkout. Always. Account creation can happen after the booking.",
    template: "quote-tile",
    data: { quote: "Forcing account creation before booking? You just lost the booking." },
  },

  // ───── PAIN: NO ONLINE BOOKING ─────
  {
    id: "pain-bookings-after-hours",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: 60 percent of service business bookings happen between 6pm and 11pm. If you only take phone bookings 9 to 5, you're missing six out of every ten leads.",
    template: "stat-tile",
    data: {
      stat: "60%",
      caption: "of bookings happen 6pm to 11pm. Phone-only 9-5 misses them all.",
    },
  },
  {
    id: "pain-dm-booking-admin",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: paying a team member to handle Instagram DM bookings is the most expensive booking system you can build. A £20-a-month calendar tool replaces them. Maths obvious.",
    template: "quote-tile",
    data: { quote: "A team member doing DM bookings is the most expensive calendar you'll buy." },
  },

  // ───── PAIN: PHOTOGRAPHY ─────
  {
    id: "pain-stock-photos-trust",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: visitors spot stock photos in 0.4 seconds. The generic smiling team. The handshake. The over-saturated office shot. Trust evaporates before they read a word.",
    template: "stat-tile",
    data: {
      stat: "0.4s",
      caption: "to spot stock photography. Trust drops the same second.",
    },
  },
  {
    id: "pain-blurry-iphone-photos",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: dim, blurry iPhone shots of your salon, your workshop, your treatment room. A £200 photography session pays for itself in two bookings. Invest once, win forever.",
    template: "quote-tile",
    data: { quote: "A £200 photography session pays for itself in two bookings." },
  },

  // ───── PAIN: TEMPLATES ─────
  {
    id: "pain-template-soup",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: the same five Wix and Squarespace templates power half the UK service business internet. Your prospect saw a near-identical site twenty minutes ago. You blend in. You lose.",
    template: "quote-tile",
    data: { quote: "Five templates power half the UK service business internet. You're one of them." },
  },
  {
    id: "pain-template-payload",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: a default Squarespace template ships 4.8MB of CSS and JS your visitors never use. A custom build for the same site loads under 400KB. Same content, twelve times the speed.",
    template: "comparison-tile",
    data: {
      left_label: "Squarespace default",
      left_1: "4.8MB payload",
      left_2: "Slow on 4G",
      left_3: "Bloated everywhere",
      right_label: "Custom build",
      right_1: "0.4MB payload",
      right_2: "Instant on 4G",
      right_3: "Only what you need",
    },
  },

  // ───── PAIN: SEO ─────
  {
    id: "pain-missing-meta",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: half the UK service business sites we audit have no meta description, no Open Graph tags, no Twitter cards. Google guesses. Link previews look broken. Free traffic lost.",
    template: "quote-tile",
    data: { quote: "No meta description. Google guesses. Link previews break. Free traffic lost." },
  },
  {
    id: "pain-no-local-schema",
    category: "pain",
    niche: "all",
    hook_template:
      "Pain point: LocalBusiness schema is twenty lines of JSON-LD. It tells Google your hours, your address, your phone. Without it you do not appear in the local map pack. Twenty lines.",
    template: "stat-tile",
    data: {
      stat: "20 lines",
      caption: "of JSON-LD. The difference between the map pack and invisible.",
    },
  },

  // ───── DEMO SHOWCASES (more) ─────
  {
    id: "demo-forge-no-bs-cta",
    category: "demo",
    niche: "pt",
    hook_template:
      "Demo showcase: Forge PT. One CTA per page. 'Book a session'. No newsletter signup. No 'follow us'. No 'download the guide'. Single funnel. Triple the conversion of most PT sites.",
    template: "quote-tile",
    data: { quote: "Forge PT: one CTA per page. Book a session. That's it." },
  },
  {
    id: "demo-marne-editorial-layout",
    category: "demo",
    niche: "beautician",
    hook_template:
      "Demo showcase: Marne & Lyle. Magazine-grade layout for a beauty brand. Generous type. Quiet whitespace. Cropped imagery. Reads like Vogue, ranks like Sitewisers.",
    template: "niche-callout",
    data: {
      niche: "Marne & Lyle.",
      statement_line_1: "Reads like Vogue.",
      statement_line_2: "Ranks like Sitewisers.",
    },
  },
  {
    id: "demo-thorne-treatment-pages",
    category: "demo",
    niche: "dental",
    hook_template:
      "Demo showcase: Thorne Dental. One treatment per page. Implants. Whitening. Invisalign. Each ranking for its own keyword in its town. Local SEO done by structure, not by stuffing.",
    template: "quote-tile",
    data: { quote: "Thorne Dental: implants, whitening, Invisalign. Three pages. Three rankings." },
  },
  {
    id: "demo-amber-oak-load",
    category: "demo",
    niche: "all",
    hook_template:
      "Demo showcase: Amber Oak hits 0.9 seconds first contentful paint on a Three 4G connection in central Bracknell. Most UK service sites take five times longer.",
    template: "stat-tile",
    data: {
      stat: "0.9s",
      caption: "Amber Oak first contentful paint. On 4G. In Bracknell.",
    },
  },
  {
    id: "demo-ridgeline-mobile-rebuild",
    category: "demo",
    niche: "all",
    hook_template:
      "Demo showcase: Ridgeline started mobile-first and let desktop inherit. The original site was the opposite. The rebuild took sixty days and tripled mobile conversion in ninety.",
    template: "comparison-tile",
    data: {
      left_label: "Old Ridgeline",
      left_1: "Desktop-first",
      left_2: "Mobile bounce 71%",
      left_3: "Two enquiries/wk",
      right_label: "New Ridgeline",
      right_1: "Mobile-first",
      right_2: "Mobile bounce 22%",
      right_3: "Six enquiries/wk",
    },
  },

  // ───── SEASONAL (UK calendar) ─────
  {
    id: "season-january-resolution-window",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (early January): personal trainers, physios, beauticians, weight clinics. The two-week resolution window is your annual peak. If your booking flow is broken, you waste a year of marketing in fourteen days.",
    template: "quote-tile",
    data: { quote: "The January resolution window is fourteen days. Don't waste it on a broken booking flow." },
  },
  {
    id: "season-january-tax-deadline",
    category: "observation",
    niche: "accountant",
    hook_template:
      "Seasonal angle (January): UK self-assessment deadline is 31 January. Searches for 'accountant near me' triple in the second week of January. If your site is slow or unranked, you watch the wave roll past.",
    template: "stat-tile",
    data: {
      stat: "3x",
      caption: "UK 'accountant near me' search volume in the second week of January.",
    },
  },
  {
    id: "season-spring-renovation",
    category: "observation",
    niche: "builder",
    hook_template:
      "Seasonal angle (spring): UK home renovation search peaks late February through April. Loft conversions. Extensions. Garden rooms. If you're not on page one for your town by mid-March, you've missed the booking window for the year.",
    template: "quote-tile",
    data: { quote: "Spring renovation search peaks. Late Feb to April. Page one by mid-March or lose the year." },
  },
  {
    id: "season-summer-evening-bookings",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (UK summer): long evenings push service-business search later. Peak booking time shifts from 8pm to 10pm. Your site is the only thing open at 10pm.",
    template: "stat-tile",
    data: {
      stat: "10pm",
      caption: "UK summer peak booking time. The phone is closed. The website is open.",
    },
  },
  {
    id: "season-summer-holiday-coverage",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (UK summer): client asks 'are you open the August bank holiday?' Your site does not answer. They call a competitor. A four-line opening hours table prevents the loss.",
    template: "quote-tile",
    data: { quote: "Are you open the August bank holiday? If your site doesn't answer, they call someone else." },
  },
  {
    id: "season-autumn-back-to-routine",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (UK autumn): September is the second January. Routines reset. Gyms fill. Beauty bookings spike. Accountants get tax-return enquiries. Be visible the first week of September.",
    template: "quote-tile",
    data: { quote: "September is the second January. Be visible the first week." },
  },
  {
    id: "season-autumn-q4-rush",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (October): the Q4 service-business rush starts now. Christmas party hair, end-of-year accounts, pre-winter boiler checks. The site you ship in October pays you through December.",
    template: "quote-tile",
    data: { quote: "Ship the site in October. Bank the bookings through December." },
  },
  {
    id: "season-christmas-party-bookings",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (November-December): UK Christmas party season drives one-month-out bookings for hair, nails, beauty, dental whitening. If your booking flow does not show December availability in early November, you lose to whoever's does.",
    template: "quote-tile",
    data: { quote: "Show December availability in early November. Or watch it book up elsewhere." },
  },
  {
    id: "season-christmas-closures",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (December): the most-read page on every service-business site between 20 December and 2 January is 'opening hours'. Make sure the right Christmas hours are on the homepage, not buried.",
    template: "quote-tile",
    data: { quote: "20 Dec to 2 Jan: 'opening hours' is the most-read page on your site." },
  },
  {
    id: "season-december-quiet-rebuild",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (late December): the quietest two weeks for builders, accountants, electricians. The best two weeks to commission your rebuild. Live by mid-January when search volume returns.",
    template: "quote-tile",
    data: { quote: "Late December is dead for trades. The best two weeks to rebuild the site." },
  },
  {
    id: "season-bank-holiday-traffic",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (UK bank holidays): service-business search volume rises 28 percent the day before a UK bank holiday. People plan. If your site does not show holiday availability, that traffic books a competitor.",
    template: "stat-tile",
    data: {
      stat: "+28%",
      caption: "UK service search the day before a bank holiday. Plan or lose it.",
    },
  },
  {
    id: "season-new-year-rebuild-window",
    category: "observation",
    niche: "all",
    hook_template:
      "Seasonal angle (January): new-year rebuild window. Most service businesses have spare budget in Q1, before the spring rush. The site you commission in January is live and ranking by April.",
    template: "quote-tile",
    data: { quote: "January commission. April rank. That's the rebuild window." },
  },

  // ───── UK-SPECIFIC STATS / OBSERVATIONS ─────
  {
    id: "uk-ofcom-mobile-time",
    category: "stat",
    niche: "all",
    hook_template:
      "UK stat: Ofcom reports UK adults spend 3 hours 41 minutes a day on their phone. Most of that is browsing. Your homepage is competing for a sliver of that time. Make every second count.",
    template: "stat-tile",
    data: {
      stat: "3h 41m",
      caption: "UK adults on their phone, every day. (Ofcom)",
    },
  },
  {
    id: "uk-companies-house-smb-count",
    category: "stat",
    niche: "all",
    hook_template:
      "UK stat: Companies House lists 5.5 million active UK businesses. The vast majority are service businesses. Almost all have a website. Almost none of those websites convert. Huge opportunity, low bar.",
    template: "stat-tile",
    data: {
      stat: "5.5M",
      caption: "active UK businesses. Almost none have a site that converts.",
    },
  },
  {
    id: "uk-google-business-priority",
    category: "tip",
    niche: "all",
    hook_template:
      "UK tip: a complete Google Business Profile plus a fast website ranks above every paid ad for local service searches. The combination is the UK service-business cheat code in 2026.",
    template: "quote-tile",
    data: { quote: "Google Business Profile plus a fast site. UK service-business cheat code." },
  },
  {
    id: "uk-postcode-targeting",
    category: "observation",
    niche: "all",
    hook_template:
      "UK observation: postcode-level pages outrank town-level pages. 'Electrician RG1' beats 'Electrician Reading' for half the searches. UK consumers search by postcode more than any other country.",
    template: "quote-tile",
    data: { quote: "UK consumers search by postcode. Build pages for it." },
  },
  {
    id: "uk-consumer-local-trust",
    category: "observation",
    niche: "all",
    hook_template:
      "UK observation: 78 percent of UK consumers trust a local independent business over a national chain. Your site must signal local. Photos of the actual building. Real postcode in the footer. Owner's name.",
    template: "stat-tile",
    data: {
      stat: "78%",
      caption: "of UK consumers trust local independents over chains. Signal it everywhere.",
    },
  },
  {
    id: "uk-mobile-bank-payment",
    category: "stat",
    niche: "all",
    hook_template:
      "UK stat: 62 percent of UK consumers expect a service business to accept mobile-wallet payment. Apple Pay. Google Pay. If your booking checkout does not, you look ten years behind.",
    template: "stat-tile",
    data: {
      stat: "62%",
      caption: "of UK consumers expect Apple Pay or Google Pay at checkout.",
    },
  },
].map((angle) => ({
  ...angle,
  used_count: 0,
  last_used: null,
}));
