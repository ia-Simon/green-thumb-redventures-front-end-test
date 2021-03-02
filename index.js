import { getPlants } from "./services/greenThumbApi";

function* gridPlacingsGen() {
    let row = 1;
    let column = 1;
    while(true) {
        while(column < 5) {
            yield [`${column} / ${column + 2}`, `${row} / ${row + 2}`];
            column += 2;
        }
        column = 1;
        row += 2;
    }
}

function createPlantCard(plant, gridPlacings) {
    const petIcons = {
        false: "static/icons/pet.svg",
        true: "static/icons/toxic.svg"
    };

    const sunIcons = {
        no: "static/icons/no-sun.svg",
        low: "static/icons/low-sun.svg",
        high: "static/icons/high-sun.svg"
    };

    const waterIcons = {
        rarely: "static/icons/1-drop.svg",
        regularly: "static/icons/2-drops.svg",
        daily: "static/icons/3-drops.svg",
    };

    let plantCard = document.createElement("div");
    plantCard.setAttribute("class", `plant-card${plant.staff_favorite ? " staff-favorite" : ""}`);
    if(plant.staff_favorite)
        [plantCard.style.gridColumn, plantCard.style.gridRow] = gridPlacings.next().value;

    let staffFavImg = document.createElement("img");
    staffFavImg.setAttribute("class", "staff-fav-icon");
    staffFavImg.setAttribute("alt", "Staff favorite");
    staffFavImg.setAttribute("src", "static/icons/staff-fav.svg");
    plantCard.appendChild(staffFavImg);

    let plantImg = document.createElement("img");
    plantImg.setAttribute("class", "plant-image");
    plantImg.setAttribute("alt", "");
    plantImg.setAttribute("src", plant.url);
    plantCard.appendChild(plantImg);

    let plantName = document.createElement("span");
    plantName.setAttribute("class", "plant-name");
    plantName.appendChild(document.createTextNode(plant.name));
    plantCard.appendChild(plantName);

    let plantPrice = document.createElement("span");
    plantPrice.setAttribute("class", "plant-price");
    plantPrice.appendChild(document.createTextNode(`$${plant.price}`));
    plantCard.appendChild(plantPrice);

    let petIconImg = document.createElement("img");
    petIconImg.setAttribute("class", "pet-icon");
    petIconImg.setAttribute("alt", "");
    petIconImg.setAttribute("src", petIcons[`${plant.toxicity}`]);
    plantCard.appendChild(petIconImg);

    let sunIconImg = document.createElement("img");
    sunIconImg.setAttribute("class", "sun-icon");
    sunIconImg.setAttribute("alt", "");
    sunIconImg.setAttribute("src", sunIcons[plant.sun]);
    plantCard.appendChild(sunIconImg);

    let waterIconImg = document.createElement("img");
    waterIconImg.setAttribute("class", "water-icon");
    waterIconImg.setAttribute("alt", "");
    waterIconImg.setAttribute("src", waterIcons[plant.water]);
    plantCard.appendChild(waterIconImg);

    return plantCard;
}

/*
 * It seems like parcel doesn't like to expose functions written in external .js files
 * and then imported using the <script> tag, so I strapped it directly to the window object.
 */

window.onFiltersChange = async () => {
    const sun = document.querySelector("#sun-select").value;
    const water = document.querySelector("#water-select").value;
    const pets = document.querySelector("#pets-select").value;

    let plants = [];
    if (sun && water && pets) {
        const resp = await getPlants(sun, water, pets);
        plants = resp.data;
    }

    const gridPlacings = gridPlacingsGen();
    const resultsArea = document.querySelector("#results");
    if (plants.length <= 0) {
        resultsArea.querySelector("#no-results-box").style.display = "block";
        resultsArea.querySelector("#results-box").style.display = "none";
    } else {
        const plantDisplay = resultsArea.querySelector("#plant-display");
        while (plantDisplay.firstChild) plantDisplay.lastChild.remove();
        for (let plant of plants) plantDisplay.appendChild(createPlantCard(plant, gridPlacings));
        resultsArea.querySelector("#no-results-box").style.display = "none";
        resultsArea.querySelector("#results-box").style.display = "flex";
    }
}