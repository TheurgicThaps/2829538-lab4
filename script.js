const spinner = document.getElementById("loading-spinner");
const btn = document.getElementById("search-btn");
spinner.classList.add("hidden");


async function getNeighbour(code){
    const responseNeighbour = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const dataNeighbour = await responseNeighbour.json();
    return dataNeighbour[0];

}

function clearFields(){
    document.getElementById('bordering-countries').innerHTML="";
    document.getElementById('country-info').innerHTML="";
    document.getElementById('error-message').innerHTML="";

}
async function searchCountry(countryName) {
    try {
        // Show loading spinner
        spinner.classList.remove("hidden");
        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if(!response.ok){
            //meaningful errors
            let message;
            if (response.status === 400) {
                message = "Bad request — the country code is invalid.";
            } 
            else if (response.status === 401 || response.status === 403) {
                message = "Access denied — authorization failed.";
            } 
            else if (response.status === 404) {
                message = "Country not found.";
            } 
            else if (response.status >= 500) {
                message = "Server error — try again later.";
            } 
            else {
                message = `Unexpected error (status ${response.status}).`;
            }
            document.getElementById('error-message').innerHTML = `
                <p><strong>Error:</strong> ${message}</p>`;
            return;
        }
        const data = await response.json();
        
        const country = data[0];
        // Update DOM
        document.getElementById('country-info').innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital[0]}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        // Fetch bordering countries
       
        if(country.borders){
        for( const neighbour of country.borders){
             console.log(neighbour);
            const countryNeighbour = await getNeighbour(neighbour);
             // Update bordering countries section
            document.getElementById('bordering-countries').insertAdjacentHTML("beforeend",`
            <h2>${countryNeighbour.name.common}</h2>
            <img src="${countryNeighbour.flags.svg}" alt="${countryNeighbour.name.common} flag">
        `);
        }
        
    }
        
        
        // Update bordering countries section
    } catch (error) {
        // Show error message
         document.getElementById('error-message').innerHTML = `
                <p><strong>Error:</strong> ${error}</p>`;
        spinner.classList.add("hidden");
        

    } finally {
        // Hide loading spinner
        spinner.classList.add("hidden")
    }
}

document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    clearFields();
    searchCountry(country);
});

document.getElementById("country-input").addEventListener("keydown", function(event)
{
if(event.key === "Enter"){
    const country = document.getElementById('country-input').value;
    clearFields();
    searchCountry(country);
}
})