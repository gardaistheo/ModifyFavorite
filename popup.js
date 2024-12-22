const dropdown = document.getElementById('favorites-dropdown');
const modifyButton = document.getElementById('modify-button');

// Charger les favoris dans la liste déroulante
chrome.bookmarks.getTree((bookmarkTreeNodes) => {
  populateDropdown(bookmarkTreeNodes);
});

function populateDropdown(nodes, parent = dropdown) {
  nodes.forEach((node) => {
    if (node.url) {
      const option = document.createElement('option');
      option.value = node.id;
      option.textContent = node.title;
      parent.appendChild(option);
    } else if (node.children) {
      populateDropdown(node.children, parent);
    }
  });
}

// Gestion du clic sur le bouton
modifyButton.addEventListener('click', () => {
  const selectedBookmarkId = dropdown.value;
  if (selectedBookmarkId) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      chrome.bookmarks.update(selectedBookmarkId, { url: currentUrl }, () => {
        alert('Favori mis à jour avec succès !');
      });
    });
  } else {
    alert('Aucun favori sélectionné.');
  }
});

// Sauvegarder le dernier favori modifié
modifyButton.addEventListener('click', () => {
    const selectedBookmarkId = dropdown.value;
    chrome.storage.local.set({ lastModified: selectedBookmarkId });
  });
  
  // Charger le dernier favori modifié au démarrage
  chrome.storage.local.get('lastModified', (data) => {
    if (data.lastModified) {
      dropdown.value = data.lastModified;
    }
  });
  
