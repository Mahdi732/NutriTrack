let form = document.getElementById('analysisForm');
let preview = document.getElementById('analysisImage');
let uploadButton = document.getElementById('analysisButton');
let analysisContainer = document.getElementById('analysisContainer');
let main = document.getElementById('main');

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
        console.log(res.data.data);
        console.log(res.data);
        

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

function renderAnalysis(data) {
  const mainDiv = document.createElement("div")
  mainDiv.className = "max-w-7xl mx-auto p-6"

  const titleSection = document.createElement("div")
  titleSection.className = "mb-12"
  titleSection.innerHTML =
    '<h1 class="text-4xl font-serif font-bold text-stone-900 mb-2">Nutrition Analysis</h1><p class="text-stone-600">Detailed breakdown of your meal and nutritional insights</p>'
  mainDiv.appendChild(titleSection)

  const mealSection = document.createElement("div")
  mealSection.className = "mb-12"
  mealSection.innerHTML = '<h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Meal Details</h2>'

  const articleDiv = document.createElement("div")
  articleDiv.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

  for (let i = 0; i < data.foods.length; i++) {
    const article = document.createElement("article")
    article.className = "bg-white border border-stone-200 p-6 hover:border-stone-300 transition-colors"
    article.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div>
                <h3 class="text-2xl font-serif font-semibold text-stone-900 mb-1">${data.foods[i].item}</h3>
                <p class="text-sm text-stone-500">${data.foods[i].estimated_quantity_g}g</p>
            </div>
        </div>
        <div class="mb-6">
            <div class="text-5xl font-serif font-bold text-stone-900">${data.foods[i].calories}</div>
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
        `
    articleDiv.appendChild(article)
  }

  mealSection.appendChild(articleDiv)
  mainDiv.appendChild(mealSection)

  const totalContainer = document.createElement("div")
  totalContainer.className = "bg-stone-900 text-white p-8 mb-12 border border-stone-800"
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
                <div class="text-2xl font-semibold mb-1">${data.totals.sodium}mg</div>
                <div class="text-xs text-stone-400 uppercase tracking-wide">Sodium</div>
            </div>
        </div>
    `
  mainDiv.appendChild(totalContainer)

  const estimationContainer = document.createElement("div")
  const profileComparison = data.profileComparison.adjustedEstimation
  estimationContainer.className = "mb-12"
  estimationContainer.innerHTML = `
        <h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Profile Comparison</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-stone-50 border border-stone-300 p-6">
                <h3 class="text-xl font-serif font-semibold text-stone-900 mb-4">Target Goals</h3>
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

            <div class="bg-white border border-stone-300 p-6">
                <h3 class="text-xl font-serif font-semibold text-stone-900 mb-4">Nutritional Gaps</h3>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Calories</span>
                        <span class="font-semibold ${(profileComparison.calories - data.totals.calories) === 0 ? "text-green-700" : profileComparison.calories - data.totals.calories > 0 ? "text-stone-900" : "text-red-700"}">${profileComparison.calories - data.totals.calories > 0 ? "+" : ""}${profileComparison.calories - data.totals.calories} kcal</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Carbs</span>
                        <span class="font-semibold ${(profileComparison.carbs - data.totals.carbs) === 0 ? "text-green-700" : profileComparison.carbs - data.totals.carbs > 0 ? "text-stone-900" : "text-red-700"}">${profileComparison.carbs - data.totals.carbs > 0 ? "+" : ""}${profileComparison.carbs - data.totals.carbs}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Protein</span>
                        <span class="font-semibold ${(profileComparison.protein - data.totals.protein) === 0 ? "text-green-700" : profileComparison.protein - data.totals.protein > 0 ? "text-stone-900" : "text-red-700"}">${profileComparison.protein - data.totals.protein > 0 ? "+" : ""}${profileComparison.protein - data.totals.protein}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Fat</span>
                        <span class="font-semibold ${(profileComparison.fat - data.totals.fat) === 0 ? "text-green-700" : profileComparison.fat - data.totals.fat > 0 ? "text-stone-900" : "text-red-700"}">${profileComparison.fat - data.totals.fat > 0 ? "+" : ""}${profileComparison.fat - data.totals.fat}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Sugar</span>
                        <span class="font-semibold ${(profileComparison.sugar - data.totals.sugar) === 0 ? "text-green-700" : profileComparison.sugar - data.totals.sugar > 0 ? "text-stone-900" : "text-red-700"}">${profileComparison.sugar - data.totals.sugar > 0 ? "+" : ""}${profileComparison.sugar - data.totals.sugar}g</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-700">Sodium</span>
                        <span class="font-semibold ${(profileComparison.sodium - data.totals.sodium) === 0 ? "text-green-700" : profileComparison.sodium - data.totals.sodium > 0 ? "text-stone-900" : "text-red-700"}">${profileComparison.sodium - data.totals.sodium > 0 ? "+" : ""}${profileComparison.sodium - data.totals.sodium}mg</span>
                    </div>
                </div>
            </div>
        </div>
    `
  mainDiv.appendChild(estimationContainer)

  const statusDiv = document.createElement("div")
  statusDiv.className = `${getBorderStatusClass(data.advice.status)} border-l-4 p-6 mb-12`
  statusDiv.innerHTML = `
        <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
                <svg class="h-6 w-6 ${getTextStatusClass(data.advice.status)}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-serif font-semibold ${getTextStatusClass(data.advice.status)} mb-2 capitalize">${data.advice.status}</h3>
                <p class="text-stone-700">${data.advice.message}</p>
            </div>
        </div>
    `
  mainDiv.appendChild(statusDiv)

  const recommendationDiv = document.createElement("div")
  recommendationDiv.className = "mb-12"
  recommendationDiv.innerHTML =
    '<h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Suggestions for Improvement</h2>'

  const suggestionsContainer = document.createElement("div")
  suggestionsContainer.className = "space-y-4"

  const recommendations = data.advice.suggestions
  for (let i = 0; i < recommendations.length; i++) {
    const advice = document.createElement("div")
    advice.className =
      "bg-white border border-stone-200 p-6 flex items-start gap-4 hover:border-stone-300 transition-colors"
    advice.innerHTML = `
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-semibold">${i + 1}</div>
            <p class="text-stone-700 flex-1">${recommendations[i]}</p>
        `
    suggestionsContainer.appendChild(advice)
  }

  recommendationDiv.appendChild(suggestionsContainer)
  mainDiv.appendChild(recommendationDiv)

  if (data.advice.medicalAlerts != null && data.advice.medicalAlerts.length > 0) {
    const alertSection = document.createElement("div")
    alertSection.className = "mb-12"
    alertSection.innerHTML = '<h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Medical Alerts</h2>'

    const alertMedical = document.createElement("div")
    alertMedical.className = "bg-red-50 border border-red-300 p-6"
    alertMedical.innerHTML = `
            <div class="flex items-start gap-4 mb-4">
                <svg class="flex-shrink-0 w-6 h-6 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <div class="flex-1">
                    <h3 class="text-lg font-serif font-semibold text-red-900 mb-2">Important Health Notice</h3>
                    <div class="text-sm text-red-800 space-y-2">
                        ${data.advice.medicalAlerts.map((alert) => `<p>${alert}</p>`).join("")}
                    </div>
                </div>
            </div>
        `
    alertSection.appendChild(alertMedical)
    mainDiv.appendChild(alertSection)
  }

  if (data.advice.prePostTraining != null) {
    const prePostTrainingDiv = document.createElement("div")
    prePostTrainingDiv.className = "mb-12"
    prePostTrainingDiv.innerHTML = `
            <h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Training Nutrition</h2>
            <div class="bg-white border border-stone-200 p-6">
                <div class="space-y-4">
                    <div>
                        <h3 class="text-lg font-serif font-semibold text-stone-900 mb-2">Pre-Training</h3>
                        <p class="text-stone-700">${data.advice.prePostTraining.pre || "No specific recommendations"}</p>
                    </div>
                    <div class="border-t border-stone-200 pt-4">
                        <h3 class="text-lg font-serif font-semibold text-stone-900 mb-2">Post-Training</h3>
                        <p class="text-stone-700">${data.advice.prePostTraining.post || "No specific recommendations"}</p>
                    </div>
                </div>
            </div>
        `
    mainDiv.appendChild(prePostTrainingDiv)
  }

  if (data.advice.hydration != null) {
    const hydrationDiv = document.createElement("div")
    hydrationDiv.className = "mb-12"
    hydrationDiv.innerHTML = `
            <h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Hydration Guidance</h2>
            <div class="bg-blue-50 border border-blue-200 p-6">
                <div class="flex items-start gap-4">
                    <svg class="flex-shrink-0 w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <div class="flex-1">
                        <h3 class="text-lg font-serif font-semibold text-blue-900 mb-2">Daily Water Intake</h3>
                        <p class="text-blue-800">${data.advice.hydration}</p>
                    </div>
                </div>
            </div>
        `
    mainDiv.appendChild(hydrationDiv)
  }

  if (data.advice.nextMealAdjustment != null) {
    const nextMealDiv = document.createElement("div")
    nextMealDiv.className = "mb-12"
    nextMealDiv.innerHTML = `
            <h2 class="text-3xl font-serif font-bold text-stone-900 mb-6">Next Meal Recommendations</h2>
            <div class="bg-stone-50 border border-stone-300 p-6">
                <div class="flex items-start gap-4">
                    <svg class="flex-shrink-0 w-6 h-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="flex-1">
                        <h3 class="text-lg font-serif font-semibold text-stone-900 mb-2">Adjust Your Next Meal</h3>
                        <p class="text-stone-700">${data.advice.nextMealAdjustment}</p>
                    </div>
                </div>
            </div>
        `
    mainDiv.appendChild(nextMealDiv)
  }

  return mainDiv
}

function getTextStatusClass(status) {
  switch (status) {
    case "dangerous":
      return "text-red-700"
    case "good":
      return "text-blue-700"
    case "excellent":
      return "text-green-700"
    default:
      return "text-amber-700"
  }
}

function getBorderStatusClass(status) {
  switch (status) {
    case "dangerous":
      return "border-red-500 bg-red-50"
    case "good":
      return "border-blue-500 bg-blue-50"
    case "excellent":
      return "border-green-500 bg-green-50"
    default:
      return "border-amber-500 bg-amber-50"
  }
}