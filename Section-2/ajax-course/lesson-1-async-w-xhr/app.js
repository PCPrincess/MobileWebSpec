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

    const unsplashRequest = new XMLHttpRequest();
    unsplashRequest.onload = addImage;
    unsplashRequest.onerror = function (err) {
      requestError(err, 'image');
    };

    unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    unsplashRequest.setRequestHeader('Authorization', 'Client-ID bb4560824525c3bf96abc5a7c7fe836ab9445887807f1d9d919ad55c616d9abe');
    unsplashRequest.send();

    function addImage() {
      let htmlContent = '';
      const data = JSON.parse(this.responseText);

      if (data && data.results && data.results[0]) {
        const firstImage = data.results[0];
        htmlContent = `<figure>
          <img src="${firstImage.urls.regular}" alt="${searchedForText}">
          <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
      } else {
          htmlContent = '<div class="error-no-image">No images available</div>';
      }

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    const articleRequest = new XMLHttpRequest();
    articleRequest.onload = addArticles;
    articleRequest.onerror = function (err) {
      requestError(err, 'articles');
    };

    articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/ariclesearch.json?q=
    ${searchedForText}&api-key=aea6097a6a024cee909fe4c273c70d98`);
    articleRequest.send();

    function addArticles() {
      let htmlContent = '';
      const data = JSON.parse(this.responseText);

      if (data.response && data.response.docs && data.response.docs.length > 1) {
        htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
          <h2><a href="${article.web.url}"></a></h2>
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
