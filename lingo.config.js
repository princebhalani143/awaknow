module.exports = {
  // Define your source language
  sourceLocale: "en",

  // Specify target languages for translation
  targetLocales: ["es", "fr", "de", "ja", "zh", "hi", "gu", "ta", "te", "kn", "ml", "bn", "mr", "pa", "ur"],

  // Configure AI models for translation
  models: {
    // Use specific models for language pairs
    "en:es": "groq:mistral-saba-24b",
    "en:fr": "groq:mistral-saba-24b",
    "en:de": "groq:mistral-saba-24b",
    "en:hi": "groq:mistral-saba-24b",
    "en:gu": "groq:mistral-saba-24b",
    "en:ta": "groq:mistral-saba-24b",
    "en:te": "groq:mistral-saba-24b",
    "en:kn": "groq:mistral-saba-24b",
    "en:ml": "groq:mistral-saba-24b",
    // Default model for all other pairs
    "*:*": "groq:mistral-saba-24b",
  },

  // Advanced options
  caching: {
    enabled: true,
    directory: ".lingo-cache",
  },

  // Quality assurance settings
  validation: {
    checkPlurals: true,
    validateVariables: true,
    ensureCompleteness: true,
  },
};