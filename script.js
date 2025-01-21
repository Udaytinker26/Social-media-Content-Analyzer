// 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

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const filePicker = document.getElementById("filePicker");
  const dropZone = document.getElementById("drop-zone");
  const output = document.getElementById("output");
  const loading = document.getElementById("loading");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const analysisSection = document.getElementById("analysis");
  const analysisOutput = document.getElementById("analysisOutput");

  let extractedText = "";

  filePicker.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleFiles);
  dropZone.addEventListener("drop", handleDrop);
  dropZone.addEventListener("dragover", (e) => e.preventDefault());

  async function handleFiles(event) {
    const files = event.target.files || event.dataTransfer.files;
    output.textContent = "";
    extractedText = "";
    for (const file of files) {
      await processFile(file);
    }
    if (extractedText) {
      analyzeBtn.style.display = "inline-block";
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    fileInput.files = files;
    handleFiles({ target: { files } });
  }

  async function processFile(file) {
    loading.style.display = "block";
    if (file.type === "application/pdf") {
      await extractTextFromPDF(file);
    } else if (file.type.startsWith("image/")) {
      await extractTextFromImage(file);
    } else {
      alert("Unsupported file type!");
    }
    loading.style.display = "none";
  }

  async function extractTextFromPDF(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      extractedText += text;
      output.textContent = extractedText;
    };
    reader.readAsArrayBuffer(file);
  }

  async function extractTextFromImage(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const { data: { text } } = await Tesseract.recognize(event.target.result, "eng");
      extractedText += text + "\n";
      output.textContent = $extractedText;
    };
    reader.readAsDataURL(file);
  }

  analyzeBtn.classList.remove('hidden'); // Show the button
  analyzeBtn.classList.add('hidden');   // Hide the button


  analyzeBtn.addEventListener("click", async () => {
    if (!extractedText.trim()) {
      alert("No text to analyze!");
      return;
    }

    loading.style.display = "block";
    analysisSection.style.display = "none";

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: `Analyze the following text and provide suggestions for improvement:\n\n${extractedText}`,
          max_tokens: 20000
        })
      });

      const data = await response.json();
      const suggestions = data.choices[0]?.text.trim();
      if (suggestions) {
        analysisSection.style.display = "block";
        analysisOutput.textContent = suggestions;
      } else {
        analysisOutput.textContent = "No suggestions were generated.";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze text. Please check your API key or network connection.");
    } finally {
      loading.style.display = "none";
    }
  });
});


// Function to handle analysis
document.getElementById("analyzeBtn").addEventListener("click", function () {
  const extractedText = document.getElementById("analysisOutput").innerText;

  // Simulated suggestions based on extracted text
  const suggestions = generateSuggestions(extractedText);

  // Display suggestions
  const suggestionsOutput = document.getElementById("suggestionsOutput");
  suggestionsOutput.innerHTML = suggestions;
  suggestionsOutput.classList.remove("hidden");
});

// Function to generate profile improvement suggestions
function generateSuggestions(text) {
  let suggestions = "";

  if (!text.includes("skills")) {
    suggestions += "<p>- Add a dedicated skills section highlighting your technical proficiencies.</p>";
  }

  if (!text.match(/\b(Java|Python|Flutter)\b/i)) {
    suggestions += "<p>- Mention specific programming languages like Java, Python, or Flutter.</p>";
  }

  if (!text.includes("projects")) {
    suggestions += "<p>- Include projects you’ve worked on to demonstrate practical application of skills.</p>";
  }

  if (!text.includes("experience")) {
    suggestions += "<p>- Elaborate on any professional or internship experiences.</p>";
  }

  if (suggestions === "") {
    suggestions = "<p>Your profile looks well-structured!</p>";
  }

  return suggestions;
}

document.getElementById('fileInput').addEventListener('change', () => {
  document.getElementById('analyzeBtn').classList.remove('hidden');
});




