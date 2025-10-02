let form = document.getElementById('analysisForm');
let preview = document.getElementById('analysisImage');
let uploadButton = document.getElementById('analysisButton')

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let file = document.getElementById('food-image');
    console.log(file.files[0])

    uploadButton.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading...
    `;
    uploadButton.disabled = true;

    const formData = new FormData();

    formData.append('mealImage', file.files[0]);

    try {
        const res = await axios.post('/meal/', formData, {
            headers : {'Content-Type' : 'multipart/form-data'} 
        });

        console.log(res.data);

        preview.src = res.data.imagePath;
        
        renderAnalysis(res.data.data);
    }catch (err) {
        console.log('error', err);
    } finally {
        uploadButton.innerHTML = 'Analyze Nutrition';
        uploadButton.disabled = false;
    }
});

function renderAnalysis (data) {
    
}