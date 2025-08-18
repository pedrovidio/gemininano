const proofreaderBtn = document.getElementById('proofreaderBtn');
const sendTextBtn = document.getElementById('sendTextBtn');

const resultInput = document.getElementById('result');
const downloadprogress = document.getElementById('downloadprogress');

sendTextBtn.addEventListener('click', async () => {
  try {
    const options = { includeCorrectionTypes: false, expectedInputLanguages: ["en"] };
    const supportsOurUseCase = await Proofreader.availability(options);

    console.log(`Proofreader supports our use case: ${supportsOurUseCase}`);

    if (!supportsOurUseCase) {
      resultInput.textContent = "Este navegador não suporta o Proofreader para este caso de uso.";
      return;
    }

    const proofreader = await Proofreader.create({
      includeCorrectionTypes: false,
      expectedInputLanguages: ["en"],
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          const progress = (e.loaded * 100).toFixed(1);
          resultInput.textContent = `Progresso do download: ${progress}%`;
        });
      }
    });

    const corrections = await proofreader.proofread("I seen him yesterday at the store, and he bought two loafs of bread.");
    console.log("Corrections:", corrections);
  } catch (error) {
    console.error("Erro ao usar Proofreader:", error);
    resultInput.textContent = `Erro: ${error.message || error}`;
  }
});

console.log('Proofreader:', Proofreader);