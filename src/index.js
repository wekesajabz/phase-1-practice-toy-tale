let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");
  const toysUrl = "http://localhost:3000/toys";

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys
  function fetchToys() {
    fetch(toysUrl)
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => addToyToDOM(toy));
      })
      .catch(error => {
        console.error("Error fetching toys:", error);
      });
  }

  // Create and append toy card
  function addToyToDOM(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";

    const toyName = document.createElement("h2");
    toyName.textContent = toy.name;

    const toyImage = document.createElement("img");
    toyImage.src = toy.image;
    toyImage.alt = toy.name;
    toyImage.className = "toy-avatar";

    const toyLikes = document.createElement("p");
    toyLikes.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.className = "like-btn";
    likeButton.id = toy.id;
    likeButton.textContent = "Like ❤️";
    likeButton.addEventListener("click", () => increaseToyLikes(toy, toyLikes));

    toyCard.append(toyName, toyImage, toyLikes, likeButton);
    toyCollection.appendChild(toyCard);
  }

  // Increase toy likes
  function increaseToyLikes(toy, toyLikesElement) {
    const newLikes = toy.likes + 1;

    fetch(`${toysUrl}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        toyLikesElement.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => {
        console.error("Error updating toy likes:", error);
      });
  }

  // Add new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newToy = {
      name: formData.get("name"),
      image: formData.get("image"),
      likes: 0
    };

    fetch(toysUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        addToyToDOM(toy);
        toyForm.reset();
        toyFormContainer.style.display = "none";
        addToy = false;
      })
      .catch(error => {
        console.error("Error adding new toy:", error);
      });
  });

  // Initial fetch
  fetchToys();
});
