
export interface BusinessGuide {
    id: string;
    title: string;
    slug: string;
    icon: string; // Lucide icon name or emoji for now
    summary: string;
    estimatedCapital: string;
    legalRequirements: string[];
    operations: string[];
    nepalSpecifics: string[];
}

export const BUSINESS_TYPES: BusinessGuide[] = [
    {
        id: '1',
        title: 'Tourism & Trekking Agency',
        slug: 'tourism-trekking',
        icon: 'Mountain',
        summary: "Capitalize on Nepal's biggest industry by organizing treks and tours for international visitors.",
        estimatedCapital: 'NPR 15 - 25 Lakhs',
        legalRequirements: [
            'Register with Company Registrar (OCR)',
            'Department of Tourism license',
            'Bank Guarantee (~NPR 5-7 Lakhs)',
            'PAN/VAT Registration',
            'Foreign Currency account with NRB approval'
        ],
        operations: [
            'Hiring licensed guides and porters (Mandatory for many routes)',
            'Insurance for staff and clients',
            'Marketing to international agents'
        ],
        nepalSpecifics: [
            'Strictly seasonal business (Spring/Autumn peaks)',
            'Fluctuating government policies on TIMS cards and permits',
            'Competition is high in Thamel area'
        ]
    },
    {
        id: '2',
        title: 'IT & Outsourcing (BPO)',
        slug: 'it-software-bpo',
        icon: 'Laptop',
        summary: 'Export software services to global clients utilizing local talent and low infrastructure costs.',
        estimatedCapital: 'NPR 5 - 10 Lakhs',
        legalRequirements: [
            'Company Registration (OCR)',
            'VAT Registration (Crucial for export tax benefits/refunds)',
            'DOL (Department of Labor) compliance for staff'
        ],
        operations: [
            'Reliable internet (ISP redundancy)',
            'Power backup (Inverter/Generator/Solar)',
            'Recruitment and retention of talent'
        ],
        nepalSpecifics: [
            'Receiving international payments (SWIFT, Wise, etc.) requires clear documentation',
            'Government incentives for IT exports (often announced in budget)',
            'Brain drain awareness - retain staff with good culture'
        ]
    },
    {
        id: '3',
        title: 'Agro-Business (High Value)',
        slug: 'agro-organic-farming',
        icon: 'Sprout',
        summary: 'Focus on high-value organic crops like Kiwi, Avocado, or Dragon Fruit for domestic and export markets.',
        estimatedCapital: 'NPR 10 - 50 Lakhs (Land dependent)',
        legalRequirements: [
            'Department of Agriculture registration',
            'Local Ward registration',
            'Organic Certification (if exporting)'
        ],
        operations: [
            'Supply chain management to cities',
            'Cold storage access',
            'Labor management during harvest'
        ],
        nepalSpecifics: [
            'Focus on niche crops for better returns',
            'Government subsidies are available but require paperwork',
            'Road access during monsoon can be a challenge'
        ]
    },
    {
        id: '4',
        title: 'E-commerce & Logistics',
        slug: 'ecommerce-logistics',
        icon: 'ShoppingBag',
        summary: 'Tap into the growing digital consumption with an online store or delivery service.',
        estimatedCapital: 'NPR 5 - 15 Lakhs',
        legalRequirements: [
            'Department of Commerce registration',
            'PAN/VAT mandatory immediately',
            'Terms & Conditions for users'
        ],
        operations: [
            'Inventory management',
            'Last-mile delivery coordination',
            'Payment gateway integration (eSewa, Khalti, Fonepay)'
        ],
        nepalSpecifics: [
            'Cash on Delivery (COD) is still dominant',
            'Lack of house numbers makes delivery tricky - rely on landmarks/phone',
            'High rate of returns'
        ]
    },
    {
        id: '5',
        title: 'Handicrafts & Export',
        slug: 'handicrafts-export',
        icon: 'Gift',
        summary: 'Export traditional Nepali products like Pashmina, Felt, and Thangkas to the world.',
        estimatedCapital: 'NPR 10 - 20 Lakhs',
        legalRequirements: [
            'Export Council of Nepal membership',
            'GSP Certification for Europe/US',
            'Advance Payment Certificate for banking'
        ],
        operations: [
            'Quality control (Crucial for repeat orders)',
            'Shipping logistics (DHL/FedEx/Air Cargo)',
            'Packaging for international transit'
        ],
        nepalSpecifics: [
            'Customs clearance can be bureaucratic',
            'Authenticity certification is valued by buyers',
            'Banking channels for receiving export proceeds'
        ]
    },
    {
        id: '6',
        title: 'Education Consultancy',
        slug: 'education-consultancy',
        icon: 'GraduationCap',
        summary: 'Guide students for studies abroad, a massive and growing industry in Nepal.',
        estimatedCapital: 'NPR 20 - 40 Lakhs',
        legalRequirements: [
            'Ministry of Education (MOE) approval (Strict)',
            'Company Registration',
            'Tax clearance'
        ],
        operations: [
            'University partnerships',
            'Visa processing expertise',
            'IELTS/PTE preparation classes'
        ],
        nepalSpecifics: [
            'High security deposit ("Dharauti") required by government',
            'Reputation is fragile - word of mouth is key',
            'Frequent changes in foreign visa policies'
        ]
    }
];
