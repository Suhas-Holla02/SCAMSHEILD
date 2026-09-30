export const demoMessages = [
  {
    id: 'demo-bank',
    title: 'Fake Banking Alert',
    category: 'Phishing',
    icon: '🏦',
    message: 'URGENT: Your bank account has been compromised! Verify your identity immediately to prevent unauthorized transactions. Click here to update your KYC: http://secure-bankverify.xyz/update?id=8291',
    description: 'A fake banking alert using urgency and a suspicious link to steal credentials.'
  },
  {
    id: 'demo-delivery',
    title: 'Fake Delivery Message',
    category: 'Delivery Scam',
    icon: '📦',
    message: 'Your package #TRK-49281 could not be delivered. A redelivery fee of \$2.99 is required. Pay now to avoid return: http://delivery-resch3dule.top/pay',
    description: 'A fake delivery notification designed to collect payment information.'
  },
  {
    id: 'demo-job',
    title: 'Fake Job Offer',
    category: 'Job Scam',
    icon: '💼',
    message: 'Congratulations! You have been selected for a remote data entry position. Earn \$500/day working from home. No experience needed. Send your bank details for direct deposit setup to hr@amazn-careers.work',
    description: 'A fake job offer that promises unrealistic pay and requests banking details.'
  },
  {
    id: 'demo-prize',
    title: 'Fake Prize Message',
    category: 'Prize Scam',
    icon: '🎉',
    message: 'CONGRATULATIONS! You are the lucky winner of our \$50,000 International Lottery! To claim your prize, send a processing fee of \$199 via gift card. Reply with your full name, address, and SSN to verify your identity.',
    description: 'A classic lottery scam asking for fees and personal information.'
  },
  {
    id: 'demo-investment',
    title: 'Fake Investment Message',
    category: 'Investment Scam',
    icon: '📈',
    message: 'Hi! I made \$15,000 last week using this AI crypto trading platform. Guaranteed 300% returns in 48 hours. Minimum investment only \$500. Join now before spots fill up: http://crypto-g4ins.click/invest',
    description: 'A fraudulent investment scheme promising unrealistic returns.'
  }
];

export const learningModules = [
  {
    id: 'phishing',
    title: 'Phishing Attacks',
    icon: '🎣',
    description: 'Learn how scammers impersonate trusted organizations to steal your information.',
    content: [
      'Phishing is when attackers send messages pretending to be from trusted companies like banks, delivery services, or government agencies.',
      'They create a sense of urgency to make you act quickly without thinking.',
      'Phishing messages often contain links to fake websites that look identical to real ones.',
      'The goal is usually to steal login credentials, credit card numbers, or personal information.'
    ],
    redFlags: [
      'Urgent language like "Act now" or "Your account will be suspended"',
      'Suspicious sender email addresses',
      'Links that don\'t match the official website',
      'Requests for passwords or sensitive information',
      'Generic greetings like "Dear Customer" instead of your name'
    ],
    quiz: [
      {
        question: 'Your bank emails asking you to click a link and verify your password. What should you do?',
        options: ['Click the link and enter your password', 'Open your bank\'s official app or website directly', 'Reply to the email with your password', 'Forward it to your friends'],
        correct: 1,
        explanation: 'Never click links in emails claiming to be from your bank. Always open the official app or type the website address directly.'
      },
      {
        question: 'Which of these is a red flag in an email?',
        options: ['It addresses you by name', 'It has the company\'s logo', 'The sender email is support@amaz0n-verify.xyz', 'It was sent during business hours'],
        correct: 2,
        explanation: 'The email domain "amaz0n-verify.xyz" uses a zero instead of "o" and an unusual domain, indicating it\'s not from the real Amazon.'
      }
    ]
  },
  {
    id: 'urls',
    title: 'Suspicious URLs',
    icon: '🔗',
    description: 'Learn to identify fake and malicious website links.',
    content: [
      'Scammers create URLs that look similar to legitimate websites but lead to malicious pages.',
      'They use techniques like character substitution (g00gle.com), extra subdomains (login.google.security-check.xyz), and URL shorteners.',
      'Always check the actual domain name, not just the beginning of the URL.',
      'Hover over links before clicking to see where they actually lead.'
    ],
    redFlags: [
      'Misspelled domain names (amaz0n, g00gle)',
      'Unusual top-level domains (.xyz, .top, .click)',
      'IP addresses instead of domain names',
      'URL shorteners in important messages',
      'Excessive subdomains'
    ],
    quiz: [
      {
        question: 'Which URL is most likely legitimate?',
        options: ['http://192.168.1.1/paypal/login', 'https://paypa1.security-verify.xyz', 'https://www.paypal.com/signin', 'https://paypal.account-verify.top'],
        correct: 2,
        explanation: 'Only https://www.paypal.com is the real PayPal domain. The others use IP addresses, character substitution, or fake domains.'
      }
    ]
  },
  {
    id: 'otp',
    title: 'OTP & Password Safety',
    icon: '🔐',
    description: 'Understand why you should never share one-time passwords.',
    content: [
      'OTPs (One-Time Passwords) are security codes sent to verify YOUR identity. No legitimate company will ever ask you to share them.',
      'If someone asks for your OTP, they are trying to access your account.',
      'Scammers may call pretending to be bank officials and ask for OTPs to "verify" transactions.',
      'Real bank employees never need your OTP because they can verify transactions on their end.'
    ],
    redFlags: [
      'Anyone asking you to share an OTP over phone or message',
      'Claims that sharing OTP is needed to "cancel" a transaction',
      'Requests to install screen-sharing apps to "help" you',
      'Pressure to act immediately'
    ],
    quiz: [
      {
        question: 'Someone calling from "your bank" asks for the OTP you just received. What should you do?',
        options: ['Share it since they\'re from the bank', 'Hang up and call your bank\'s official number', 'Ask them to verify their identity first, then share', 'Share only the first 3 digits'],
        correct: 1,
        explanation: 'Hang up immediately. No bank employee will ever ask for your OTP. Call your bank\'s official number to report the incident.'
      }
    ]
  },
  {
    id: 'impersonation',
    title: 'Impersonation Scams',
    icon: '🎭',
    description: 'How scammers pretend to be people or companies you trust.',
    content: [
      'Impersonation scams involve someone pretending to be a trusted person or organization.',
      'They might pose as your bank, a government agency, a tech company, or even a friend or family member.',
      'They use official-looking logos, similar email addresses, and professional language to appear legitimate.',
      'The goal is to gain your trust so you share information or send money.'
    ],
    redFlags: [
      'Unexpected contact from "official" organizations',
      'Requests for unusual payment methods (gift cards, crypto)',
      'Threats of legal action or account suspension',
      'Email addresses that are slightly different from official ones',
      'Requests to keep the communication secret'
    ],
    quiz: [
      {
        question: 'You get a call from someone claiming to be from the tax department saying you owe money and will be arrested. What is this?',
        options: ['A legitimate warning you should act on', 'An impersonation scam using fear tactics', 'A routine tax notification', 'Something you should pay to avoid trouble'],
        correct: 1,
        explanation: 'Tax departments do not call and threaten arrest. This is a classic impersonation scam using intimidation.'
      }
    ]
  },
  {
    id: 'jobs',
    title: 'Fake Job Scams',
    icon: '💼',
    description: 'Identify fraudulent job postings and recruitment scams.',
    content: [
      'Fake job scams promise high pay for minimal work and often require no experience.',
      'They may ask for upfront fees for "training materials" or "background checks."',
      'Some ask for bank details early in the process under the guise of setting up direct deposit.',
      'Real employers never ask you to pay to get a job.'
    ],
    redFlags: [
      'Unrealistic salary promises',
      'No interview or vetting process',
      'Requests for upfront payment',
      'Communication only through messaging apps',
      'Vague job descriptions'
    ],
    quiz: [
      {
        question: 'A job posting offers \$500/day for data entry with no experience needed. What should you suspect?',
        options: ['It\'s a great opportunity', 'It\'s likely a scam — the pay is unrealistically high', 'It\'s normal for remote work', 'Apply immediately before spots fill up'],
        correct: 1,
        explanation: 'Unrealistically high pay for unskilled work with no requirements is a classic sign of a job scam.'
      }
    ]
  },
  {
    id: 'urgency',
    title: 'Urgency Manipulation',
    icon: '⏰',
    description: 'How scammers use time pressure to bypass your critical thinking.',
    content: [
      'Urgency manipulation is one of the most common scam tactics.',
      'Scammers create artificial time pressure to prevent you from thinking clearly or consulting others.',
      'Phrases like "Act now," "Last chance," or "Your account will be closed today" are designed to trigger panic.',
      'Legitimate organizations give you reasonable time to respond and verify.'
    ],
    redFlags: [
      'Deadlines measured in hours or minutes',
      'Claims that you\'ll lose access if you don\'t act immediately',
      'Countdown timers or expiring offers',
      'Phrases like "This is your final warning"',
      'Pressure to decide without consulting anyone'
    ],
    quiz: [
      {
        question: 'An email says your streaming account will be permanently deleted in 2 hours unless you verify your payment details. What should you do?',
        options: ['Quickly verify before time runs out', 'Ignore the email and log into the streaming service directly', 'Forward the email to friends for advice', 'Reply asking for more time'],
        correct: 1,
        explanation: 'Legitimate services don\'t delete accounts with 2-hour warnings. Log into the service directly (not through the email link) to check your account status.'
      }
    ]
  }
];

export const simulatorScenarios = [
  {
    id: 'sim-1',
    title: 'The Urgent Bank Alert',
    difficulty: 'Easy',
    message: 'Dear Customer, We detected unusual activity on your account. Your card ending in 4521 was used for a purchase of \$892.50 at an overseas location. If this wasn\'t you, click here immediately to secure your account: http://mybank-secure-login.xyz/verify',
    redFlags: [
      { text: 'Urgent/threatening language', hint: '"unusual activity" and "immediately" create panic' },
      { text: 'Suspicious link', hint: 'mybank-secure-login.xyz is not an official bank domain' },
      { text: 'Generic greeting', hint: '"Dear Customer" instead of your actual name' },
      { text: 'Suspicious TLD', hint: '.xyz is frequently used in scam domains' }
    ]
  },
  {
    id: 'sim-2',
    title: 'The Lucky Winner',
    difficulty: 'Easy',
    message: 'CONGRATULATIONS!!! You have been randomly selected as today\'s lucky winner! You\'ve won a brand new iPhone 15 Pro Max! To claim your prize, click below and pay a small shipping fee of \$4.99: http://prize-cl4im.top/winner?id=29184',
    redFlags: [
      { text: 'Too good to be true', hint: 'Random prize wins from unknown sources are always scams' },
      { text: 'Excessive excitement', hint: 'Multiple exclamation marks and caps are common in scam messages' },
      { text: 'Fee required to claim', hint: 'Legitimate prizes never require payment to claim' },
      { text: 'Suspicious URL', hint: 'prize-cl4im.top uses number substitution and suspicious TLD' }
    ]
  },
  {
    id: 'sim-3',
    title: 'The Tech Support Call',
    difficulty: 'Medium',
    message: 'This is Microsoft Technical Support. We have detected that your computer has been infected with a critical virus. Your personal data, including banking information, is at risk. Please call us immediately at 1-800-555-0199 or visit http://microsoft-support-help.click to download our security tool and protect your computer.',
    redFlags: [
      { text: 'Unsolicited contact', hint: 'Microsoft does not proactively call or message about viruses' },
      { text: 'Fear-based language', hint: '"critical virus" and "banking information at risk" create fear' },
      { text: 'Fake support number', hint: 'Scammers use official-sounding numbers that connect to call centers' },
      { text: 'Download request', hint: 'Downloading "security tools" from unknown links can install malware' },
      { text: 'Suspicious domain', hint: 'microsoft-support-help.click is not an official Microsoft domain' }
    ]
  },
  {
    id: 'sim-4',
    title: 'The Investment Opportunity',
    difficulty: 'Medium',
    message: 'Hey! I know we haven\'t talked in a while, but I had to share this with you. I started investing in this new AI crypto platform 3 weeks ago and I\'ve already turned \$1,000 into \$12,000! They guarantee 300% returns. The minimum investment is only \$500 and you can withdraw anytime. Let me send you the link. Spots are limited!',
    redFlags: [
      { text: 'Unrealistic returns', hint: '300% guaranteed returns in weeks is impossible in legitimate investing' },
      { text: 'FOMO tactics', hint: '"Spots are limited" creates fear of missing out' },
      { text: 'Guaranteed returns', hint: 'No legitimate investment can guarantee specific returns' },
      { text: 'Personal testimony', hint: 'Claims of personal success are used to build false trust' },
      { text: 'Reconnecting contact', hint: 'Scammers often pretend to be old acquaintances' }
    ]
  },
  {
    id: 'sim-5',
    title: 'The Government Threat',
    difficulty: 'Hard',
    message: 'NOTICE: This is the Social Security Administration. Your Social Security Number has been linked to suspicious activity and money laundering. A warrant has been issued for your arrest. To resolve this matter and avoid criminal prosecution, you must verify your identity and make a compliance payment. Call case officer Agent Williams at 202-555-0147 immediately. Failure to respond within 24 hours will result in arrest.',
    redFlags: [
      { text: 'Government impersonation', hint: 'The SSA does not contact people this way or threaten arrest' },
      { text: 'Arrest threats', hint: 'Law enforcement does not call and demand payment to avoid arrest' },
      { text: 'Payment demand', hint: 'Government agencies do not collect "compliance payments" by phone' },
      { text: 'Artificial deadline', hint: '24-hour deadline creates panic and prevents verification' },
      { text: 'Named authority figure', hint: 'Using a specific name and title adds false legitimacy' },
      { text: 'SSN scare tactic', hint: 'Mentioning your SSN being compromised is a fear tactic to get you to share personal info' }
    ]
  }
];
