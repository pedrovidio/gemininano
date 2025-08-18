const promptBtn = document.getElementById('promptBtn');
const sendPromptBtn = document.getElementById('sendPromptBtn');

const resultInput = document.getElementById('result');
const downloadprogress = document.getElementById('downloadprogress');

let session; // <-- Declare aqui

// Certifique-se de que o botão foi encontrado
if (promptBtn) {
  promptBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Impede a navegação do link
    result.textContent = ''; // Limpa resultado anterior
    promptBtn.disabled = true; // Desabilita o botão para evitar cliques múltiplos
    downloadprogress.style.display = 'block';

    try {
      const params = await LanguageModel.params();
      session = await LanguageModel.create({
        temperature: Math.max(params.defaultTemperature * 1.2, 2.0),
        topK: params.defaultTopK,
        outputLanguage: 'en', // Defina o idioma de saída aqui: 'en', 'es', ou 'ja'
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = (e.loaded * 100).toFixed(1);
            downloadprogress.textContent = `Progresso do download: ${progress}%`;
          });
        },
      });

      downloadprogress.textContent = 'Sessão do modelo de linguagem criada!';

    } catch (error) {
      console.error('Ocorreu um erro ao iniciar o projeto:', error);
    }
  });
}

sendPromptBtn.addEventListener('click', async () => {
  const prompt = document.getElementById('prompt');
  if (!prompt.value) {
    console.log('Por favor, insira um prompt.');
    return;
  }
  if (!session) {
    console.log('Sessão não iniciada. Clique em "Iniciar" primeiro.');
    return;
  }

  resultInput.style.display = 'block';
  resultInput.textContent = 'Gerando resposta...';

  try {
    const result = await session.promptStreaming(prompt.value);

    let generatedText = '';
    for await (const chunk of result) {
      generatedText += chunk;
      resultInput.textContent = generatedText;
    }
  } catch (error) {
    console.log(`Erro ao gerar resposta: ${error.message}`);
  }
});