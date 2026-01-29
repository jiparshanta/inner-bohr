"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegistrationFormData } from "@/types/registration"

interface DocumentGenerationStepProps {
    onNext: (data: Partial<RegistrationFormData>) => void;
    onBack: () => void;
    formData: Partial<RegistrationFormData>;
}

export function DocumentGenerationStep({ onNext, onBack, formData }: DocumentGenerationStepProps) {
    const { name1, nameNepali, companyType, businessObjectives, address, capital } = formData;
    const currentDate = new Date().toLocaleDateString('en-NP');

    // MOA Template (Nepali)
    const generateMOA = () => {
        return `
${nameNepali ? nameNepali : "[कम्पनीको नाम]"}
को
प्रबन्ध पत्र (Memorandum of Association)

१. कम्पनीको नाम:
यस कम्पनीको नाम "${nameNepali ? nameNepali : "........"}" (${name1 ? name1.toUpperCase() : "........"}) रहनेछ ।

२. रजिष्टर्ड कार्यालय रहने ठेगाना:
यस कम्पनीको रजिष्टर्ड कार्यालय ${address || "काठमाडौँ जिल्ला, काठमाडौँ महानगरपालिका वडा नं ..."} मा रहनेछ ।

३. कम्पनीको उद्देश्यहरु:
यस कम्पनीको उद्देश्यहरु देहाय बमोजिम हुनेछन्:
(क) ${businessObjectives || "कम्पनीको मुख्य उद्देश्यहरु यहाँ उल्लेख गरिनेछ ।"} सम्बन्धी काम गर्ने ।
(ख) कम्पनीको उद्देश्य प्राप्तिका लागि आवश्यक अन्य कार्यहरु गर्ने ।

४. सेयर र सेयर सदस्यको दायित्व:
कम्पनीको सेयर पुँजी र सो बापत शेयरधनीले कम्पनीलाई बुझाउन बाँकी रकम (भए) सो हदसम्म मात्र निजको दायित्व सिमित हुनेछ ।

५. पुँजी:
कम्पनीको अधिकृत पुँजी रु. ${capital || "१,००,०००"} (एक लाख) हुनेछ । सो पुँजीलाई प्रति सेयर रु. १०० का दरले ${(parseInt(capital || "100000") / 100)} थान साधारण सेयरमा विभाजन गरिएको छ ।

६. सेयर खरिद बापत कबुल गरेको सेयर संख्या:
हामी निम्न बमोजिमका संस्थापकहरु यस प्रबन्ध पत्रमा लेखिए बमोजिमको सेयर लिन मन्जुर गरी यो प्रबन्ध पत्रमा सहिछाप गरेका छौं ।
------------------------------------------------------------------
मिति: ${currentDate}
        `;
    };

    // AOA Template (Nepali)
    const generateAOA = () => {
        return `
${nameNepali ? nameNepali : "[कम्पनीको नाम]"}
को
नियमावली (Articles of Association)

१. संक्षिप्त नाम र प्रारम्भ:
(१) यी नियमहरुको नाम "${nameNepali ? nameNepali : "........"}" को नियमावली, २०८२ रहेको छ ।
(२) यो नियमावली कम्पनी रजिष्ट्रारको कार्यालयबाट स्वीकृत भएको मिति देखि प्रारम्भ हुनेछ ।

२. सेयर पुँजी:
कम्पनीको चुक्ता पुँजी संचालक समितिले निर्णय गरे बमोजिम हुनेछ । संचालक समितिले आवश्यकता अनुसार सेयर पुँजी बृद्धि गर्न सक्नेछ ।

३. साधारण सभा:
(१) कम्पनीको प्रथम बार्षिक साधारण सभा कम्पनी दर्ता भएको एक वर्ष भित्र हुनेछ ।
(२) साधारण सभाको गणपूरक संख्या कुल सेयर संख्याको ५१ प्रतिशत हुनेछ ।

४. संचालक समिति:
(१) कम्पनीको नियमन र व्यवस्थापनको लागि एक संचालक समिति रहनेछ ।
(२) संचालक समितिमा कम्तिमा १ (एक) र बढीमा ११ (एघार) जना संचालकहरु रहनेछन् ।
(३) प्रथम साधारण सभा नभए सम्मको लागि संस्थापकहरु नै कम्पनीको संचालक हुनेछन् ।

५. हिसाब किताब र लेखापरिक्षण:
कम्पनीको हिसाब किताब प्रचलित कानुन बमोजिम राखिनेछ र मान्यता प्राप्त लेखापरिक्षकबाट लेखापरिक्षण गराइनेछ ।

------------------------------------------------------------------
मिति: ${currentDate}
        `;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Document Generation</h2>
                <p className="text-sm text-muted-foreground">
                    We have drafted your Memorandum (Prabandha Patra) and Articles of Association (Niyamawali). Please review them.
                </p>
            </div>

            <Tabs defaultValue="moa" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="moa">MOA (Prabandha Patra)</TabsTrigger>
                    <TabsTrigger value="aoa">AOA (Niyamawali)</TabsTrigger>
                </TabsList>

                <TabsContent value="moa" className="mt-4">
                    <div className="border rounded-md p-4 bg-muted/30">
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-white text-sm font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                            {generateMOA()}
                        </ScrollArea>
                    </div>
                </TabsContent>

                <TabsContent value="aoa" className="mt-4">
                    <div className="border rounded-md p-4 bg-muted/30">
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-white text-sm font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                            {generateAOA()}
                        </ScrollArea>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back
                </Button>
                <div className="space-x-2">
                    <Button variant="secondary" onClick={() => alert("Downloaded PDF Package (Simulated)")}>
                        Download All Drafts
                    </Button>
                    <Button onClick={() => onNext({})}>
                        Confirm & Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}
