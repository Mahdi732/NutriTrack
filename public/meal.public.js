let form = document.getElementById('analysisForm');
let preview = document.getElementById('analysisImage');
let uploadButton = document.getElementById('analysisButton');
let analysisContainer = document.getElementById('analysisContainer');

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

        console.log(res.data.imagePath);

        preview.src = '/' + res.data.imagePath;
        if (analysisContainer) {
            analysisContainer.innerHTML = ''; 
            analysisContainer.appendChild(renderAnalysis(res.data.data));
        }
    }catch (err) {
        console.log('error', err);
    } finally {
        uploadButton.innerHTML = 'Analyze Nutrition';
        uploadButton.disabled = false;
    }
});

function renderAnalysis (data) {

    let mainDiv = document.createElement('div');
    let Articlediv = document.createElement('div');
    Articlediv.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    mainDiv.innerHTML = '<h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Meal Details</h2>'
    for (let i = 0; i < data.foods.length; i++) {
        let article = document.createElement('article');
        article.className = 'bg-white border border-stone-200 p-6 hover:border-stone-300 transition-colors';
        article.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div>
                <h2 class="text-2xl font-serif font-semibold text-stone-900 mb-1">${data.foods[i].item}</h2>
                <p class="text-sm text-stone-500">${data.foods[i].estimated_quantity_g}g</p>
            </div>
        </div>
        <div class="mb-6">
            <div class="text-5xl font-serif font-bold text-stone-900">${data.foods[i].calories}g</div>
            <div class="text-sm text-stone-500 uppercase tracking-wide">Calories</div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-stone-200">
            <div>
                <div class="text-2xl font-semibold text-stone-900">${data.foods[i].carbs}g</div>
                <div class="text-xs text-stone-500 uppercase tracking-wide">Carbs</div>
            </div>
            <div>
                <div class="text-2xl font-semibold text-stone-900">${data.foods[i].protein}g</div>
                <div class="text-xs text-stone-500 uppercase tracking-wide">Protein</div>
            </div>
            <div>
                <div class="text-2xl font-semibold text-stone-900">${data.foods[i].fat}g</div>
                <div class="text-xs text-stone-500 uppercase tracking-wide">Fat</div>
            </div>
        </div>
        <div class="space-y-2 text-sm">
            <div class="flex justify-between">
                <span class="text-stone-600">Sugar</span>
                <span class="font-medium text-stone-900">${data.foods[i].sugar}g</span>
            </div>
            <div class="flex justify-between">
                <span class="text-stone-600">Sodium</span>
                <span class="font-medium text-stone-900">${data.foods[i].sodium}mg</span>
            </div>
        </div>
        `;
        Articlediv.appendChild(article);
    }
    mainDiv.appendChild(Articlediv);

    let totalContainer = document.createElement('div');
    totalContainer.className = 'bg-stone-800 text-white p-8 mb-12 border border-stone-700';
    totalContainer.innerHTML = `
     <h2 class="text-3xl font-serif font-bold mb-8">Daily Total</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
                <div class="text-4xl font-serif font-bold mb-2">${data.totals.calories}</div>
                <div class="text-sm text-stone-300 uppercase tracking-wide">Calories</div>
            </div>
            <div>
                <div class="text-4xl font-serif font-bold mb-2">${data.totals.carbs}g</div>
                <div class="text-sm text-stone-300 uppercase tracking-wide">Carbs</div>
            </div>
            <div>
                <div class="text-4xl font-serif font-bold mb-2">${data.totals.protein}g</div>
                <div class="text-sm text-stone-300 uppercase tracking-wide">Protein</div>
            </div>
            <div>
                <div class="text-4xl font-serif font-bold mb-2">${data.totals.fat}g</div>
                <div class="text-sm text-stone-300 uppercase tracking-wide">Fat</div>
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8 pt-8 border-t border-stone-700">
            <div>
                <div class="text-2xl font-semibold mb-1">${data.totals.sugar}g</div>
                <div class="text-xs text-stone-400 uppercase tracking-wide">Sugar</div>
            </div>
            <div>
                <div class="text-2xl font-semibold mb-1">${data.totals.sodium}g</div>
                <div class="text-xs text-stone-400 uppercase tracking-wide">Sodium</div>
            </div>
        </div>
     `;
     mainDiv.appendChild(totalContainer);

     let estimationContainer = document.createElement('div');
     let profileComparison = data.profileComparison.adjustedEstimation;
     estimationContainer.className = 'mb-12';
     estimationContainer.innerHTML = `
     <h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Profile Comparison</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-amber-50 border border-amber-200 p-6">
                <h3 class="text-xl font-serif font-semibold text-stone-900 mb-4">Adjusted Estimation</h3>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Calories</span>
                        <span class="font-semibold text-stone-900">${profileComparison.calories} kcal</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Carbs</span>
                        <span class="font-semibold text-stone-900">${profileComparison.carbs}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Protein</span>
                        <span class="font-semibold text-stone-900">${profileComparison.protein}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Fat</span>
                        <span class="font-semibold text-stone-900">${profileComparison.fat}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Sugar</span>
                        <span class="font-semibold text-stone-900">${profileComparison.sugar}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Sodium</span>
                        <span class="font-semibold text-stone-900">${profileComparison.sodium}mg</span>
                    </div>
                </div>
            </div>

            <div class="bg-red-50 border border-red-200 p-6">
                <h3 class="text-xl font-serif font-semibold text-stone-900 mb-4">Gaps</h3>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Calories</span>
                        <span class="font-semibold ${(profileComparison.calories - data.totals.calories) === 0 ? "text-green-700" : "text-red-700"}">${profileComparison.calories - data.totals.calories} kcal</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Carbs</span>
                        <span class="font-semibold ${(profileComparison.carbs - data.totals.carbs) === 0 ? "text-green-700" : "text-red-700"}">${profileComparison.carbs - data.totals.carbs}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Protein</span>
                        <span class="font-semibold ${(profileComparison.protein - data.totals.protein) === 0 ? "text-green-700" : "text-red-700"}">${profileComparison.protein - data.totals.protein}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Fat</span>
                        <span class="font-semibold ${(profileComparison.fat - data.totals.fat) === 0 ? "text-green-700" : "text-red-700"}">${profileComparison.fat - data.totals.fat}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Sugar</span>
                        <span class="font-semibold ${(profileComparison.sugar - data.totals.sugar) === 0 ? "text-green-700" : "text-red-700"}">${profileComparison.sugar - data.totals.sugar}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Sodium</span>
                        <span class="font-semibold${(profileComparison.sodium - data.totals.sodium) === 0 ? "text-green-700" : "text-red-700"}">${profileComparison.sodium - data.totals.sodium}mg</span>
                    </div>
                </div>
            </div>
        </div>
     `;
     mainDiv.appendChild(estimationContainer);

     let popupDiv = document.createElement('div');
     popupDiv.className = `${data.advice.status === 'dangerous' 
    ? 'border-red-500 bg-red-50' 
    : data.advice.status === 'good' 
    ? 'border-blue-500 bg-blue-50' 
    : data.advice.status === 'excellent' 
    ? 'border-green-500 bg-green-50' 
    : 'border-yellow-500 bg-yellow-50'} border-l-4  p-6 mb-8`;
     popupDiv.innerHTML = `
    <div class="flex items-start">
        <div class="flex-shrink-0">
            <svg class="h-6 w-6 ${getTextStatusClass(data.advice.status)} " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        <div class="ml-3">
            <h3 class="text-lg font-semibold ${getTextStatusClass(data.advice.status)} mb-2">${data.advice.status}</h3>
            <p class="${getTextStatusClass(data.advice.status)}">${data.advice.message}</p>
        </div>
    </div>
     `;
     mainDiv.appendChild(popupDiv);

     let rocomondationDiv = document.createElement('div');
     rocomondationDiv.className = 'space-y-4'
     rocomondationDiv.innerHTML = '<h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Suggestions for Improvement</h2>';
     let rocomondations = data.advice.suggestions;
     for (let i = 0; i < rocomondations.length; i++) {
        let advice = document.createElement('div');
        advice.className = 'bg-white border border-stone-200 p-6 flex items-start gap-4';
        advice.innerHTML = `
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-semibold">${i + 1}</div>
        <p class="text-stone-700 flex-1">${rocomondations[i]}</p>
        `;
        rocomondationDiv.appendChild(advice);
     }
     mainDiv.appendChild(rocomondationDiv);

     return mainDiv;
}

function getTextStatusClass(status) {
    switch (status) {
        case 'dangerous':
            return 'text-red-500';
        case 'good':
            return 'text-blue-500';
        case 'excellent':
            return 'text-green-500';
        default:
            return 'text-yellow-500';
    }
}
