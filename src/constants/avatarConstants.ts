// app/api/news-anchor/constants.js

// Supported languages map for Azure voices and language codes
export const SUPPORTED_LANGUAGES = {
  "en": {
    name: "English",
    maleVoice: "en-US-GuyNeural",
    femaleVoice: "en-US-JennyNeural",
    apiCode: "en"
  },
  "es": {
    name: "Spanish",
    maleVoice: "es-ES-AlvaroNeural",
    femaleVoice: "es-ES-ElviraNeural",
    apiCode: "es"
  },
  "fr": {
    name: "French",
    maleVoice: "fr-FR-HenriNeural",
    femaleVoice: "fr-FR-DeniseNeural",
    apiCode: "fr"
  },
  "de": {
    name: "German",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    apiCode: "de"
  },
  "it": {
    name: "Italian",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    apiCode: "it"
  },
  "hi": {
    name: "Hindi",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    apiCode: "hi"
  },
  "ja": {
    name: "Japanese",
    maleVoice: "ja-JP-KeitaNeural",
    femaleVoice: "ja-JP-NanamiNeural",
    apiCode: "ja"
  },
  "zh": {
    name: "Chinese",
    maleVoice: "zh-CN-YunxiNeural",
    femaleVoice: "zh-CN-XiaoxiaoNeural",
    apiCode: "zh"
  },
  "ar": {
    name: "Arabic",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    apiCode: "ar"
  },
  "ru": {
    name: "Russian",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    apiCode: "ru"
  },
  "pt": {
    name: "Portuguese",
    maleVoice: "pt-BR-AntonioNeural",
    femaleVoice: "pt-BR-FranciscaNeural",
    apiCode: "pt"
  }
};

// Generate default intro for each language
export const getDefaultIntro = (language: string | number) => {
  const intros = {
    "en": "Welcome to the news broadcast! I'll be reading the latest headlines for you.",
    "es": "¡Bienvenido a la transmisión de noticias! Leeré los últimos titulares para ti.",
    "fr": "Bienvenue à notre bulletin d'information! Je vais vous lire les derniers titres.",
    "de": "Willkommen zu den Nachrichten! Ich werde Ihnen die neuesten Schlagzeilen vorlesen.",
    "it": "Benvenuti al notiziario! Vi leggerò gli ultimi titoli.",
    "hi": "समाचार प्रसारण में आपका स्वागत है! मैं आपके लिए ताज़ा समाचार पढ़ूंगा।",
    "ja": "ニュース放送へようこそ！最新のヘッドラインをお読みします。",
    "zh": "欢迎收看新闻播报！我将为您阅读最新的头条新闻。",
    "ar": "مرحبًا بكم في نشرة الأخبار! سأقرأ لكم أحدث العناوين.",
    "ru": "Добро пожаловать на выпуск новостей! Я прочитаю вам последние заголовки.",
    "pt": "Bem-vindo à transmissão de notícias! Vou ler as últimas manchetes para você."
  };

  return intros[language as keyof typeof intros] || intros.en;
};

// Error messages for each language
export const getErrorMessage = (language: string | number) => {
  const errors = {
    "en": "Sorry, I'm having trouble retrieving or processing the news at the moment.",
    "es": "Lo siento, estoy teniendo problemas para recuperar o procesar las noticias en este momento.",
    "fr": "Désolé, j'ai des difficultés à récupérer ou à traiter les actualités pour le moment.",
    "de": "Es tut mir leid, ich habe im Moment Schwierigkeiten, die Nachrichten abzurufen oder zu verarbeiten.",
    "it": "Mi dispiace, sto avendo problemi a recuperare o elaborare le notizie in questo momento.",
    "hi": "क्षमा करें, मुझे अभी समाचार प्राप्त करने या उन्हें प्रोसेस करने में समस्या हो रही है।",
    "ja": "申し訳ありませんが、現在ニュースの取得または処理に問題があります。",
    "zh": "抱歉，我目前在检索或处理新闻时遇到了麻烦。",
    "ar": "آسف، أواجه مشكلة في استرجاع أو معالجة الأخبار في الوقت الحالي.",
    "ru": "Извините, у меня возникли проблемы с получением или обработкой новостей в данный момент.",
    "pt": "Desculpe, estou tendo problemas para recuperar ou processar as notícias no momento."
  };

  return errors[language as keyof typeof errors] || errors.en;
};

// No news found message
export const getNoNewsMessage = (language: string | number, topic: string) => {
  const messages = {
    "en": `I couldn't find any news articles about "${topic}". Let's try a different topic!`,
    "es": `No pude encontrar ningún artículo de noticias sobre "${topic}". ¡Intentemos con un tema diferente!`,
    "fr": `Je n'ai trouvé aucun article d'actualité sur "${topic}". Essayons un sujet différent !`,
    "de": `Ich konnte keine Nachrichtenartikel zu "${topic}" finden. Versuchen wir ein anderes Thema!`,
    "it": `Non ho trovato articoli di notizie su "${topic}". Proviamo un argomento diverso!`,
    "hi": `मुझे "${topic}" के बारे में कोई समाचार लेख नहीं मिला। आइए एक अलग विषय पर कोशिश करें!`,
    "ja": `"${topic}"に関するニュース記事が見つかりませんでした。別のトピックを試してみましょう！`,
    "zh": `我找不到关于"${topic}"的新闻文章。让我们尝试一个不同的话题！`,
    "ar": `لم أتمكن من العثور على أي مقالات إخبارية حول "${topic}". دعنا نجرب موضوعًا مختلفًا!`,
    "ru": `Я не смог найти новостей о "${topic}". Давайте попробуем другую тему!`,
    "pt": `Não consegui encontrar nenhum artigo de notícias sobre "${topic}". Vamos tentar um tópico diferente!`
  };

  return messages[language as keyof typeof messages] || messages.en;
};