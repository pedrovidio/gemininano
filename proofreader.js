const proofreaderBtn = document.getElementById('proofreaderBtn');
const sendTextBtn = document.getElementById('sendTextBtn');

const resultInput = document.getElementById('result');
const downloadprogress = document.getElementById('downloadprogress');

sendTextBtn.addEventListener('click', async () => {
  try {
    const options = { includeCorrectionTypes: false, expectedInputLanguages: ["en"] };
    const supportsOurUseCase = await Proofreader.availability(options);

    console.log(`Proofreader supports our use case: ${supportsOurUseCase}`);
    resultInput.style.display = 'block';

    const proofreader = await Proofreader.create({
      includeCorrectionTypes: false,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          const progress = (e.loaded * 100).toFixed(1);
          resultInput.textContent = `Progresso do download: ${progress}%`;
        });
      }
    });

    const inputText = document.getElementById('text');
    resultInput.textContent = "Analisando texto...";

    const corrections = await proofreader.proofread(inputText.value);
    console.log("Corrections:", corrections);

    resultInput.textContent = "Correção sugerida:" + corrections.correctedInput;

  } catch (error) {
    console.error("Erro ao usar Proofreader:", error);
    resultInput.textContent = `Erro: ${error.message || error}`;
  }
});

console.log('Proofreader:', Proofreader);