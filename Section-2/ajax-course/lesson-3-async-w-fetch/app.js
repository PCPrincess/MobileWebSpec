(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
    });

  fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
    headers: {
      Authorization: 'Client-ID bb4560824525c3bf96abc5a7c7fe836ab9445887807f1d9d919ad55c616d9abe'
    }
  }).then(response => response.json()).then(addImage)
      .catch(e => requestError(e, 'image'));

  fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=
        ${searchedForText}&api-key=aea6097a6a024cee909fe4c273c70d98`, {
    headers: {
      Authorization: 'api-key aea6097a6a024cee909fe4c273c70d98',
      cors: 'Access-Control-Allow-Origin',
      crossDomain: 'true',
      dataType: 'jsonp',
    }
  }).then(response => response.json().then(addArticles)
      .catch(err => requestError(err, 'articles')));

  function addImage(data) {
    let htmlContent = '';
    const firstImage = data.results[0];

    if (firstImage) {
      htmlContent = `<figure>
                       <img src="${firstImage.urls.small}" alt="${searchedForText}">
                       <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                     </figure>`;
    } else {
      htmlContent = 'Unfortunately, no image was returned for your search.';
    }

    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
  }

  function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">
    Oh no! There was an error making a request for the ${part}.</p>`);
  }

  function addArticles(data) {
    let htmlContent = '';

    if (data.response && data.response.docs && data.response.docs.length > 1) {
      const articles = data.response.docs;
      htmlContent = '<ul>' + articles.map(article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
            </li>`).join('') + '</ul>';
    } else {
      htmlContent = '<div class="error-no-articles">No Articles Available</div>';
    }

    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
  }

})();
