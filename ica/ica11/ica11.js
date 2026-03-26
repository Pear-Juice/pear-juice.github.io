// Complete variable definitions and random functions

const customName = document.getElementById("custom-name");
const generateBtn = document.querySelector(".generate");
const story = document.querySelector(".story");

function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

// Raw text strings

let characters = ["Silly Little Guy",
"Shadow Monster",
"Captn' Crunch"]

let places = ["the Outhouse",
"the summit",
"old rusty shack"]

let events = ["jumped off the side of the earth",
"floated into the sky like a possessed donkey",
"set the record for the biggest shit"]

// Partial return random string function

function returnRandomStoryString(isUK, customName) {
  let randomCharacter = randomValueFromArray(characters)
  let randomPlace = randomValueFromArray(places)
  let randomEvent = randomValueFromArray(events)
  
  let storyText
  if (!isUK)
    storyText = `It was 94 Fahrenheit outside, so ${randomCharacter} went for a hike in the woods. When they entered the ${randomPlace}, their mouth fell agape, then ${randomEvent}. ${customName} saw the whole thing and laughed — ${randomCharacter}: weighs 300 pounds, and it was a hot day.`
  else
    storyText = `It was 34 Celsius outside, so ${randomCharacter} went for a hike in the woods. When they entered the ${randomPlace}, their mouth fell agape, then ${randomEvent}. ${customName} saw the whole thing and laughed — ${randomCharacter}: weighs 136 kilograms, and it was a hot day.`

  return storyText;
}

// Event listener and partial generate function definition

generateBtn.addEventListener("click", generateStory);

function generateStory() {
  let name = ""
  if (customName.value !== "") {
    name = customName.value;
  }
  
  let isUK = false
  if (document.getElementById("uk").checked) {
    isUK = true
  }

  // TODO: replace "" with the correct expression
  story.textContent = returnRandomStoryString(isUK, name);
  story.style.visibility = "visible";
}
