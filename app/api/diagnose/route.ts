import type { NextRequest } from "next/server"

const sample = {
  diseaseKey: "bacterial_blight",
  diseaseName: {
    en: "Bacterial Blight",
    hi: "बैक्टीरियल ब्लाइट",
    mr: "बॅक्टेरियल ब्लाइट",
  },
  confidence: 0.92,
  summary: {
    en: "Early spots with water-soaked lesions spreading across the leaf; common in cotton during humid conditions.",
    hi: "पत्तियों पर पानी से भीगे धब्बे जो फैलते हैं; नमी में कपास में आम।",
    mr: "पानांवर पाणथळ डाग जे पसरतात; आर्द्रतेत कापूसात सामान्य.",
  },
  referenceImage: "/bacterial-blight-reference.jpg",
  steps: [
    {
      title: { en: "Prune infected leaves", hi: "संक्रमित पत्तियाँ हटाएँ", mr: "संक्रमित पाने काढा" },
      desc: {
        en: "Remove all infected parts and dispose far from the field.",
        hi: "सभी संक्रमित भागों को हटाएँ और खेत से दूर नष्ट करें।",
        mr: "सर्व संक्रमित भाग काढून शेतापासून दूर फेकून द्या.",
      },
    },
    {
      title: {
        en: "Apply copper-based fungicide",
        hi: "तांबे आधारित फफूंदनाशक छिड़कें",
        mr: "तांबेवर आधारित बुरशीनाशक फवारणी करा",
      },
      desc: {
        en: "Follow label dosage; spray in the evening to avoid leaf burn.",
        hi: "लेबल की मात्रा का पालन करें; पत्तियों को जलन से बचाने के लिए शाम को छिड़कें।",
        mr: "लेबलवरील मात्रेनुसार; पान भाजणे टाळण्यासाठी संध्याकाळी फवारणी करा.",
      },
    },
    {
      title: { en: "Improve field hygiene", hi: "खेत की स्वच्छता सुधारें", mr: "शेत स्वच्छ ठेवा" },
      desc: {
        en: "Avoid overhead irrigation and ensure air circulation.",
        hi: "ऊपर से सिंचाई से बचें और हवा का संचार सुनिश्चित करें।",
        mr: "ओव्हरहेड सिंचन टाळा आणि हवेची देवाणघेवाण सुनिश्चित करा.",
      },
    },
  ],
}

export async function GET() {
  return Response.json(sample)
}

export async function POST(req: NextRequest) {
  // In a real app, run ML inference here. We ignore the image and return sample.
  await req.json().catch(() => ({}))
  return Response.json(sample)
}
