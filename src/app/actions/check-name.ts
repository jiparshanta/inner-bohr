"use server";

export type NameCheckResult = {
    available: boolean;
    reason?: string;
    similarNames?: string[];
};

export async function checkNameAvailability(name: string): Promise<NameCheckResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanName = name.trim().toLowerCase();

    if (cleanName.length < 3) {
        return {
            available: false,
            reason: "Name must be at least 3 characters long",
        };
    }

    // Simulated "Database" of taken names for demo purposes
    const takenNames = [
        "facebook",
        "google",
        "microsoft",
        "nepal telecom",
        "ncell",
        "esewa",
        "khalti",
        "pathao",
        "daraz",
        "everest bank",
        "himalayan bank",
    ];

    if (takenNames.some((taken) => cleanName.includes(taken))) {
        return {
            available: false,
            reason: "Proposed name is too similar to an existing registered company",
        };
    }

    // For demo: Randomly fail sometimes if it looks "generic" (optional, but let's keep it clean for now)
    // Let's just say if it contains "generic", it's taken
    if (cleanName.includes("generic")) {
        return {
            available: false,
            reason: "This name is too generic and likely already reserved",
        };
    }

    // Default to available
    return {
        available: true,
    };
}
