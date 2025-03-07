async function uploadAndTranslate() {
    const fileInput = document.getElementById('file');
    const apiKey = document.getElementById('api_key').value;
    const status = document.getElementById('status');
    const downloadLink = document.getElementById('download');

    if (!fileInput.files.length || !apiKey) {
        status.textContent = "Please upload a file and enter an API key.";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function(event) {
        const srtContent = event.target.result;
        status.textContent = "Translating...";

        try {
            const response = await fetch('https://your-worker-name.your-subdomain.workers.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey, srtContent })
            });

            if (!response.ok) throw new Error("Translation failed");

            const translatedSRT = await response.text();
            const blob = new Blob([translatedSRT], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            downloadLink.href = url;
            downloadLink.download = "translated.srt";
            downloadLink.style.display = "block";
            status.textContent = "Translation complete!";
        } catch (error) {
            status.textContent = "Error: " + error.message;
        }
    };

    reader.readAsText(file);
}
