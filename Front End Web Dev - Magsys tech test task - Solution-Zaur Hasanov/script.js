const accordionItemsArr = document.querySelectorAll(`.accordionItem`);
const itemHeadsArr = document.querySelectorAll(`.itemHead`);
const factItemsArr = document.querySelectorAll(`.factItem`);
factItemsArr.forEach((item) => $(item).hide()); //Hiding accordiong content via jQuery

//////////////////////////////////////////////////////////
// Preloading the images for better performance
const preloadedImgArr = [];
function preloadImage(url) {
  const img = new Image();
  img.src = url;
  img.classList.add(`factImg`);
  img.alt = `A picture of a cat`;
  preloadedImgArr.push(img);
}
for (let i = 1; i < 11; i++) {
  preloadImage(`/images/cat-${i}.jpg`);
}

//////////////////////////////////////////////////////////
const generatedRandomNums = new Set();
function uniqueRandomNum(range) {
  if (generatedRandomNums.size === range) {
    generatedRandomNums.clear(); // If all numbers are used, clear the set and start over
  }
  let randomNum;
  do {
    randomNum = Math.floor(Math.random() * range);
  } while (generatedRandomNums.has(randomNum));
  generatedRandomNums.add(randomNum);
  return randomNum;
}

//////////////////////////////////////////////////////////
// Calling the API and returning the fact in a string form
const callCatFact = async function () {
  try {
    const response = await fetch(`https://catfact.ninja/fact`);
    const data = await response.json();
    const catFact = data.fact;

    return catFact;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

function renderFactImg(factItem) {
  const imgContainer = factItem.querySelector(`.imgContainer`);
  const randomImg = preloadedImgArr[uniqueRandomNum(10)];
  imgContainer.insertAdjacentElement(`afterbegin`, randomImg);
}

function renderFactDescription(fact, factDescription) {
  factDescription.innerHTML = ``;
  factDescription.classList.toggle(`lightBorder`);
  factDescription.insertAdjacentHTML(`afterbegin`, `<p>${fact}</p>`);
}

// Open-Close functions
function toggleOpen(factItem) {
  // I made the animation a bit long to make up for the API fetching time
  $(factItem).slideDown(400);
  factItem.classList.add(`open`);
}

function toggleClose(factItem) {
  $(factItem).slideUp(400);
  factItem.classList.remove(`open`);
  factItem.querySelector(`.factDescription`).innerHTML = ``;
  factItem.querySelector(`.imgContainer`).innerHTML = ``;
}

// Toggling + - icons
function toggleIcon(item) {
  setTimeout(() => {
    const icon = item.querySelector(`.itemHead > .accordionIcon`);
    icon.classList.toggle(`ph-plus`);
    icon.classList.toggle(`ph-minus`);
  }, 800);
  // Set timeout to match the slide-down animations
}

// ACCORDION
function renderFactOnLoad(factItem) {
  const factDescription = factItem.querySelector(`.factDescription`);

  // The renders are run before the toggle in order to load everything at once
  callCatFact()
    .then((fact) => renderFactDescription(fact, factDescription))
    .then(() => renderFactImg(factItem))
    .then(() => {
      if (!factItem.classList.contains(`open`)) toggleOpen(factItem);
      else toggleClose(factItem);
    })
    .catch((err) => console.error(err));
}

function renderAllFacts() {
  // Add event listener to itemHead to allow interactivity with content
  itemHeadsArr.forEach((item) => {
    const parentAccItem = item.closest(`.accordionItem`);
    const factItem = parentAccItem.querySelector(`.factItem`);

    item.addEventListener(`click`, () => {
      toggleIcon(parentAccItem);
      renderFactOnLoad(factItem);
    });
  });
}
renderAllFacts();

////////////////////////////////////////////////////////
// Removing bottom border from the top sibling on hover
function removeDivider() {
  accordionItemsArr.forEach((item, index) => {
    item.addEventListener(`mouseover`, () => {
      if (item.classList.contains(`accordionItemMiddle`)) {
        const firstSibling = accordionItemsArr[index - 1];
        firstSibling.classList.add(`blendBorder`);
      }
    });
    item.addEventListener(`mouseout`, () => {
      if (item.classList.contains(`accordionItemMiddle`)) {
        const firstSibling = accordionItemsArr[index - 1];
        firstSibling.classList.remove(`blendBorder`);
      }
    });
  });
}
removeDivider();

// TODOS:
// Each item consists of 3 columns: number, “Click to open fact”, plus sign.✅
// Toggle accordion item on click ✅
// Fetch API and render fact on click ✅
// PLUS sign is changing to a MINUS sign when the accordion item is opened ✅.
// Add your images to the opened accordion at the right, text from API will be in the column at the left. ✅
// Logo sign should be inverted when hovered on the last item ✅.
// Text color on the item should be inverted (changed to a better visible one)✅.
// Under each item should be a dividing line, which will be removed on hovering ✅.
// If the item is in the middle, you should remove the divider at the top and at the bottom ✅.
// Add your own design to the page (let your imagination work here)✅.

// Have images not stretch ✅.
// Make only header clicks open and close the accordion ✅.
// Smoother transition for opening accordion ✅.
// Randomize images ✅
// Make the website responsive ✅
