export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("image")
  void file
  // Replace with real inference call; this is a mocked response:
  return Response.json({
    status: "ok",
    detections: [
      {
        label: "Leaf Rust (suspected)",
        confidence: 0.82,
        recommendation: "Apply recommended fungicide and remove heavily affected leaves.",
        severity: "medium",
      },
    ],
  })
}
