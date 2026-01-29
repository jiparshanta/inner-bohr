export interface RegistrationFormData {
    // Name Reservation
    name1: string;
    name2?: string;
    name3?: string;
    nameNepali: string;
    companyType: string;
    businessObjectives: string;

    // Company Details (Placeholder for now, based on assumption)
    address?: string;
    capital?: string;

    // Add-on Services
    selectedServices: string[];

    // Documents
    uploadedFiles?: {
        citizenshipFront?: File | null;
        citizenshipBack?: File | null;
        photo?: File | null;
        signature?: File | null;
    };
}
