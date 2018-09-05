/* eslint-env jquery */

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

  $.ajax({
    url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
    headers: {
      Authorization: 'Client-ID bb4560824525c3bf96abc5a7c7fe836ab9445887807f1d9d919ad55c616d9abe'
    }
  }).done(addImage).fail(function(err) {
    requestError(err, 'image');
  });

  function addImage(images) {
    let htmlContent = '';
    if (images && images.results && images.results.length > 1) {
      const firstImage = images.results[0];
      htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
    } else {
      htmlContent = '<div class="error-no-image">No Images Available</div>';
    }

    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
  }

  $.ajax({
    url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=
        ${searchedForText}&api-key=aea6097a6a024cee909fe4c273c70d98`,
    headers: 'X',
    crossDomain: true,
    dataType: 'jsonp',
    error: function(err) {
      requestError(err, 'articles');
    }
  }).done(addArticles);

  function addArticles(data) {
    let htmlContent = '';

    if (data.response && data.response.docs && data.response.docs.length > 1) {
      htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
            <h2><a href="${article.web.url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
            </li>`).join('') + '</ul>';
    } else {
      htmlContent = '<div class="error-no-articles">No Articles Available</div>';
    }

    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
  }

  function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning-error>We had an error with
                                           the requested ${part}`);
  }


})();
