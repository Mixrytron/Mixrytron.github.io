document.addEventListener('DOMContentLoaded', () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (wishlist.length > 0) {
        loadWishlist();
    } else {
        loadBrowse();
    }
});

const loadWishlist = () => {
    const card = document.getElementById('card');
    card.innerHTML = `
        <p id="wishlistTitle">Your Wishlist</p>
        <div id="dealsContainer"></div>
        <button id="refreshButton" onclick="loadWishlist()">⟳</button>
    `;
    const wishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (wishlist.length > 0) {
        getDeals(wishlist);
    }
}

const loadBrowse = () => {
    const card = document.getElementById('card');
    card.innerHTML = `
        <div id="search">
            <input type="text" placeholder="Enter game title..." id="searchInput">
            <button onclick="searchGames()">⌕</button>
        </div>
        <div id="dealsContainer"></div>     
    `;
}

const searchGames = async () => {
    var searchQuery = document.getElementById('searchInput').value;
    var title = searchQuery.replaceAll(' ','_');

    try {
        const response = await fetch('https://www.cheapshark.com/api/1.0/games?title='+title);
        if (response.ok) {
            const gameList = await response.json();
            let gameIDs = '';
            for (game in gameList) {
                gameIDs += gameList[game].gameID + ',';
            }
            gameIDs = gameIDs.slice(0, -1); 
            getDeals(gameIDs);
        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error(error);
    }
}

const getDeals = async (gameIDs) => {
    try {
        const response = await fetch('https://www.cheapshark.com/api/1.0/games?ids='+gameIDs)
        if (response.ok) {
            const dealList = await response.json();
            displayDeals(dealList);
        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error(error);
    }
}

const displayDeals = (dealList) => {
    const container = document.getElementById('dealsContainer'); 
    container.innerHTML = ''; 

    const gamesArray = Object.values(dealList);
    const idArray = Object.keys(dealList);
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    gamesArray.forEach((game, index) => {
        const div = document.createElement('div');
        let bestDeal = game.deals[0];
        let gameID = idArray[index];

        div.className = 'game-deal';
        div.innerHTML = `
            <a href="https://www.cheapshark.com/redirect?dealID=${bestDeal.dealID}" target="_blank" rel="noopener noreferrer">
                <img src="${game.info.thumb}" class='thumb' alt="${game.info.title}">
                <h3 class='title'>${game.info.title}</h3>
                <div class='price'>
                    <p>$${bestDeal.price}</p>
                    <p>-${100-Math.round(bestDeal.price/bestDeal.retailPrice*100)}%</p>
                    <p style="text-decoration: line-through;">$${bestDeal.retailPrice}</p>
                </div>
            </a>
        `;

        const button = document.createElement('button');
        button.textContent = wishlist.includes(gameID) ? '-' : '+';
        button.style.backgroundColor = wishlist.includes(gameID) ? 'red' : 'limegreen';
        button.addEventListener('click', () => {
            toggleWishlist(gameID, button);
        });
        div.appendChild(button);

        container.appendChild(div); 
    });
}

const toggleWishlist = (gameID, button) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (wishlist.includes(gameID)) {
        wishlist.splice(wishlist.indexOf(gameID), 1);
        button.textContent = '+';
        button.style.backgroundColor = 'limegreen';
    } else {
        wishlist.push(gameID);
        button.textContent = '-';
        button.style.backgroundColor = 'red';
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}



