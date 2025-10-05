
let profileForm = document.getElementById('profileForm');

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let responseDiv = document.getElementById('responseDiv');
    let button = document.getElementById('profile-form-button');

    button.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading...`;
    button.disabled = true;

    const formdata = new FormData(profileForm);
    const data = Object.fromEntries(formdata.entries());

    try {
        const result = await axios.post('/profile/', data, {
        headers : {
            "Content-Type" : "application/json"
        }
        });

        if (result) {
            setTimeout(() => {
                responseDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative';
                responseDiv.innerHTML = `
                    <strong class="font-bold">Request accepted.</strong>
                    <span class="block sm:inline">profile Updated by success.</span>
                `;
            }, 1000)
        }
    } catch (error) {
        console.error('check the error :', error);
        setTimeout(() => {
                responseDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative';
                responseDiv.innerHTML = `
                   <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline">Something went wrong. Please try again.</span>
                `;
            }, 1000)
    } finally {
        button.innerHTML = 'Save Changes';
        button.disabled = false;
    }
});