let newDiv = document.createElement("div");
newDiv.id = "myNewDiv";

let innerDiv = document.createElement("div");
innerDiv.id = "myInnerDiv";
newDiv.appendChild(innerDiv);

let input = document.createElement("input");
input.id = "myInput";
input.placeholder = "Search the name of the brewery";
innerDiv.appendChild(input);

let cardDiv = document.createElement("div");
cardDiv.id = "cardDiv";
newDiv.appendChild(cardDiv);

document.body.appendChild(newDiv);

async function Brewery() {
  const url = "https://api.openbrewerydb.org/breweries";
  const res = await fetch(url);
  const data = await res.json();

  // Initial rendering on page load
  renderBreweries(data);

  input.addEventListener(
    "input",
    debounce(() => {
      const searchTerm = input.value.toLowerCase();
      const filteredData = data.filter(
        (brewery) =>
          brewery.name.toLowerCase().includes(searchTerm) ||
          brewery.state.toLowerCase().includes(searchTerm) ||
          brewery.brewery_type.toLowerCase().includes(searchTerm)||
          brewery.postal_code.toLowerCase().includes(searchTerm)
      );
      renderBreweries(filteredData);
    }, 300)
  );

  function renderBreweries(breweries) {
    const container = document.getElementById("cardDiv");
    container.innerHTML = "";
    breweries.forEach((brewery) => {
      const card = document.createElement("div");
      card.className = "brewery-card";

      const elements = [
        { tag: "h2", content: brewery.name },
        {
          tag: "p",
          content: `<strong>Address</strong>:<br>${brewery.street},<br>${brewery.city},<br>${brewery.state}<br>${brewery.postal_code}`,
        },
        { tag: "p", content: `<strong>Type</strong>: ${brewery.brewery_type}` },
        {
          tag: "p",
          content: `<strong>Website</strong>: <a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a>`,
        },
        { tag: "p", content: `<strong>Phone</strong>: ${brewery.phone}` },
      ];

      elements.forEach((element) => {
        const el = document.createElement(element.tag);
        el.innerHTML = element.content;
        card.appendChild(el);
      });

      container.appendChild(card);
    });
  }

  function debounce(func, delay) {
    let timeoutId;
    return function () {
      const context = this;
      const args = arguments;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
}

Brewery();
