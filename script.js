document.addEventListener('DOMContentLoaded', function() {
  const categoriesData = {
    'Starter Badge': ['Snail', 'Blue Snail', 'Spore', 'Red Snail'],
    'Snowflake Badge': ['Muru', 'Murupa', 'Murupia', 'Murumuru', 'Murukun'],
    'Oppressor Badge': ['Potted Sprout', 'Potted Morning Glory', 'Grape Juice Bottle'],
    'Rebel Badge': ['Potted Sprout', 'Potted Morning Glory', 'Grape Juice Bottle', 'Patrol Robot', 'Strange Sign', 'Serpent', 'Water Thief Monster', 'Dust Box', 'Streetlight', 'Patrol Robot S', 'Safety First', 'Baby Boulder Muncher', 'Big Boulder Muncher'],
    'Mineral Badge': ['Guard Robot', 'Racoco', 'Big Spider', 'Cart Bear', 'Racaroni', 'Raco', 'Guard Robot L', 'Security System', 'Enhanced Security System', 'AF Android', 'Broken DF Android', 'Ore Muncher'],
    'Lion Badge': ['Crocky the Gatekeeper', 'Reindeer', 'Blood Reindeer', 'Bearwolf', 'Grey Vulture', 'Castle Golem'],
    'Void Badge': ['Soot Beast', 'Soot Talon', 'Soot Slug', 'Soot Core', 'Crushing Glare', 'Burst Glare'],
    'Labyrinth Badge': ['Entangled Fragment', 'Faith Fragment', 'Dark Miscreation', 'Dark Construct', 'Despairing Wing', 'Despairing Blade', 'Silent Knight', 'Silent Scout', 'Silent Rogue', 'Silent Watchman', 'Silent Assassin', 'Despairing Soul', 'Despairing Prisoner'],
    'Apocalypse Badge': ['Ancestion', 'Transcendion', 'Ascendion', 'Foreberion', 'Embrion'],
    'Ocean Badge': ['Ahtuin', 'Atus', 'Bellalion', 'Bellalis', 'Aranya', 'Aranea', 'Keeper of Light', 'Keeper of Darkness', 'Light Executor', 'Dark Executor'],
    'Swamp Badge': ['Xenoroid Echo Type A', 'Xenoroid Echo Type B', 'Nameless Cat', 'Powerful Gangster', 'Strong Gangster', 'Blue Shadow', 'Red Shadow', 'Experiment Gone Wrong', 'Big Experiment Gone Wrong', 'Thralled Guard', 'Thralled Warhammer Knight', 'Thralled Wizard', 'Thralled Archer']
  };
  
  const categoriesContainer = document.getElementById('categories');
  const targetSetsInput = document.getElementById('targetSets');
  const clearAllButton = document.getElementById('clearAll');
  
  function initCategories() {
    categoriesContainer.innerHTML = ''; // Clear the current content
    Object.keys(categoriesData).forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');
      categoryDiv.id = 'category-' + category.replace(/\s+/g, '');

      const savedTargetSets = localStorage.getItem('targetSets');
      if (savedTargetSets) {
        targetSetsInput.value = savedTargetSets;
      }
  
      // Create a flex container for the category header
      const categoryHeader = document.createElement('div');
      categoryHeader.classList.add('category-header');
      categoryHeader.onclick = function() { // Attach the click event here
        toggleCardsDisplay(category);
      };
  
      // Create and append the category image to the header
      const categoryImage = document.createElement('img');
      const formattedCategoryName = category.replace(/\s+/g, '_').toLowerCase();
      categoryImage.src = `images/category/${formattedCategoryName}.png`;
      categoryImage.alt = `${category} badge image`;
      categoryImage.classList.add('category-image');
  
      // Create and append the category name to the header
      const categoryName = document.createElement('span');
      categoryName.textContent = category;
      categoryName.classList.add('category-name');
  
      categoryHeader.appendChild(categoryImage);
      categoryHeader.appendChild(categoryName);
  
      const cardsContainer = document.createElement('div');
      cardsContainer.classList.add('cards-container');
  
      categoriesData[category].forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
  
        // Create image element and set its source
        const cardImage = document.createElement('img');
        cardImage.src = `images/card/${card}.png`; // Assuming your images are named after the card names and stored in an 'images' directory
        cardImage.alt = `${card} image`; // Provide alternative text
        cardImage.classList.add('card-image');
  
        const cardLabel = document.createElement('label');
        cardLabel.textContent = card + ': ';
  
        const cardInput = document.createElement('input');
        cardInput.type = 'number';
        cardInput.value = 0;
        cardInput.dataset.category = category;
        cardInput.dataset.card = card;
        cardInput.addEventListener('change', function() {
          checkCategoryCompletion(category);
        });
        
        cardLabel.appendChild(cardInput);
        cardDiv.appendChild(cardImage);
        cardDiv.appendChild(cardLabel);
        cardsContainer.appendChild(cardDiv);
      });
  
      categoryDiv.appendChild(categoryHeader); // Append the category header to the main category div
      categoryDiv.appendChild(cardsContainer); // Continue with the rest as it was
      categoriesContainer.appendChild(categoryDiv);

      
    });
  }

  categoriesContainer.addEventListener('click', function(event) {
    // Use event delegation to handle clicks on category headers
    if (event.target.classList.contains('category-header') || event.target.closest('.category-header')) {
      const header = event.target.closest('.category-header');
      const category = header.id.replace('category-', '').replace(/_/g, ' '); // Replace underscores with spaces to match the category names
      toggleCardsDisplay(category);
    }
  });  

  function clearAll() {
    // Clear all input values
    document.querySelectorAll('#categories .cards-container input').forEach(input => {
      input.value = 0;
    });
  
    // Remove 'card-completed' class from all cards
    document.querySelectorAll('.card-completed').forEach(card => {
      card.classList.remove('card-completed');
    });
  
    // Remove 'category-completed' class from all categories
    document.querySelectorAll('.category-completed').forEach(header => {
      header.classList.remove('category-completed');
    });
  
    // Reset the display of all cards containers to flex
    document.querySelectorAll('.cards-container').forEach(container => {
      container.style.display = 'flex';
    });

  // Clear the target sets
  localStorage.removeItem('targetSets');
  localStorage.removeItem('inputsState');
  localStorage.removeItem('categoriesState');
  

  // Reset the target sets input value to the default
  targetSetsInput.value = 0;
  
    // Additionally, if the categories are supposed to collapse upon clearing, you can do that here.
    document.querySelectorAll('.category').forEach(category => {
      const cardsContainer = category.querySelector('.cards-container');
      const categoryTitle = category.querySelector('.category-name');
      cardsContainer.style.display = 'none';
      categoryTitle.classList.add('collapsed');
    });
  }
   
// 假设有一个新的变量，用于记录每个类别是否被手动操作过
const userInteractions = {};

// 修改 toggleCardsDisplay 函数，当用户手动展开/收起分类时更新 userInteractions
function toggleCardsDisplay(category) {
  const categoryKey = 'category-' + category.replace(/\s+/g, '');
  const categoryDiv = document.getElementById(categoryKey);
  if (categoryDiv) {
    const cardsContainer = categoryDiv.querySelector('.cards-container');
    const categoryTitle = categoryDiv.querySelector('.category-name');

    // Toggle the display property of the cards container
    if (cardsContainer.style.display === 'none' || cardsContainer.style.display === '') {
      cardsContainer.style.display = 'flex';
      categoryTitle.classList.remove('collapsed');
      userInteractions[categoryKey] = 'manual';
    } else {
      cardsContainer.style.display = 'none';
      categoryTitle.classList.add('collapsed');
      userInteractions[categoryKey] = 'manual';
    }
  }
  localStorage.setItem('categoriesState', JSON.stringify(userInteractions));
}

// 修改 checkCategoryCompletion 函数以使用 userInteractions
function checkCategoryCompletion(category) {
  const categoryKey = 'category-' + category.replace(/\s+/g, '');
  const categoryDiv = document.getElementById(categoryKey);
  if (!categoryDiv) return;

  const cardInputs = categoryDiv.querySelectorAll('input');
  const targetSets = parseInt(targetSetsInput.value) || 0;
  let allCardsCompleted = true;
  let previouslyCompleted = categoryDiv.classList.contains('category-completed');

  cardInputs.forEach(input => {
    const cardDiv = input.closest('.card');
    const cardCompleted = parseInt(input.value) >= targetSets;

    // Toggle card completion class
    if (cardCompleted) {
      cardDiv.classList.add('card-completed');
    } else {
      cardDiv.classList.remove('card-completed');
      allCardsCompleted = false;
    }
  });

  const categoryHeader = categoryDiv.querySelector('.category-header');

  // Toggle category completion class
  if (allCardsCompleted) {
    categoryHeader.classList.add('category-completed');
    // If all cards are completed, collapse the category
    // Only collapse if the user has not manually interacted with it since the last check
    // and the category was not previously completed.
    if (userInteractions[categoryKey] !== 'manual' && !previouslyCompleted) {
      collapseCategory(category);
    }
  } else {
    categoryHeader.classList.remove('category-completed');
    // Reset the user interaction flag if the category is no longer completed
    userInteractions[categoryKey] = null;
  }
  
}
  
  function collapseCategory(category) {
    const categoryDiv = document.getElementById('category-' + category.replace(/\s+/g, ''));
    if (categoryDiv) {
      const cardsContainer = categoryDiv.querySelector('.cards-container');
      if (cardsContainer) {
        cardsContainer.style.display = 'none';
        const categoryTitle = categoryDiv.querySelector('.category-name');
        categoryTitle.classList.add('collapsed');
      }
    }
  }
  
  targetSetsInput.addEventListener('change', function() {
    // Save the target sets number to localStorage
    localStorage.setItem('targetSets', targetSetsInput.value);
  
    // Trigger the check for all categories
    Object.keys(categoriesData).forEach(checkCategoryCompletion);
  });  

  // Update existing input event listener to use the new logic
  categoriesContainer.addEventListener('change', function(event) {
    if (event.target.tagName.toLowerCase() === 'input' && event.target.type === 'number') {
      const category = event.target.dataset.category;
      if (category) {
        checkCategoryCompletion(category);
  
        // Call a new function to save the current state of inputs
        saveInputsState();
      }
    }
  });
  function saveInputsState() {
    const inputs = document.querySelectorAll('#categories .cards-container input');
    const inputsState = Array.from(inputs).map(input => {
      return {category: input.dataset.category, card: input.dataset.card, value: input.value};
    });
    
    localStorage.setItem('inputsState', JSON.stringify(inputsState));
  }

  clearAllButton.addEventListener('click', clearAll);

  initCategories();

  function restoreCategoriesState() {
    const storedState = JSON.parse(localStorage.getItem('categoriesState'));
  
    if (storedState) {
      for (const categoryKey in storedState) {
        if (storedState.hasOwnProperty(categoryKey) && storedState[categoryKey] === 'manual') {
          const category = categoryKey.replace('category-', '').replace(/_/g, ' ');
          toggleCardsDisplay(category); // This function needs to be adjusted to not overwrite local storage
        }
      }
    }
  }
  
  // After initCategories call
  initCategories();
  restoreCategoriesState();
  function restoreInputsState() {
    const inputsState = JSON.parse(localStorage.getItem('inputsState'));
  
    if (inputsState) {
      inputsState.forEach(state => {
        const input = document.querySelector(`#categories .cards-container input[data-category="${state.category}"][data-card="${state.card}"]`);
        if (input) {
          input.value = state.value;
        }
      });
    }
  }
  
  // After restoreCategoriesState call
  restoreInputsState();
  
});

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("backToTop").style.display = "block";
  } else {
    document.getElementById("backToTop").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById("backToTop").addEventListener('click', function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
});
