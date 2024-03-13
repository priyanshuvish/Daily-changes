var ajaxModule = function(){};
ajaxModule.prototype = {
  iterator: 1,
  masonryTimeoutClear: "",

  init: function(request, callback) {
    var self = this;

    self.iterator++;

    request = encodeURIComponent(request.trim());
    this.callAjax(request, callback);

    document.querySelector(".wrapper").innerHTML = "";
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".loading").style.display = "block";
  },

  callAjax: function(request, callback) {
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          self.parseResponse(response);
          if(callback) {
            callback();
          }
        } else {
          console.error("Error:", xhr.statusText);
        }
      }
    };

    xhr.open("GET", "https://pixabay.com/api/?username=mjweaver01&key=1631539-db8210cabd2636c6df59812df&q=" + request + "&image_type=photo", true);
    xhr.send();
  },

  parseResponse: function(response) {
    var self = this;

    //console.log(response.hits);
    response.hits.forEach(function(value, index) {
      var wrapper = document.querySelector(".wrapper");
      var image = document.createElement("div");
      image.classList.add("image", "image" + index);
      image.style.width = value.webformatWidth + "px";
      image.style.height = value.webformatHeight + "px";
      image.style.background = "url(" + value.webformatURL + ")";
      image.innerHTML = "<a href='" + value.pageURL + "' target='_blank'><div class='overlay'></div></a><div class='hidden'></div>";
      wrapper.prepend(image);

      var hidden = image.querySelector(".hidden");
      hidden.innerHTML = "<div>User: <b>" + value.user + "</b></div><div>Tags: <b>" + value.tags + "</b></div><div class='stats'><i class='fa fa-eye'></i> <b>" + value.views + "</b> &nbsp; <i class='fa fa-thumbs-o-up'></i> <b>" + value.likes + "</b></div><div class='direct-links'><a href='" + value.webformatURL + "' target='_blank'><i class='fa fa-link'></i>  Direct Link</a> <a href='" + value.webformatURL + "' download><i class='fa fa-download'></i> Download</a></div>";
    });

    clearTimeout(self.masonryTimeoutClear);
    self.masonryTimeoutClear = setTimeout(self.runMasonry, 500);
  },

  runMasonry: function() {
    //destroy and then rebuild it
    var wrapper = document.querySelector(".wrapper");
    if(wrapper.masonry) {
      wrapper.masonry.destroy();
    }

    new Masonry(wrapper, {
      itemSelector: '.image',
      isFitWidth: true,
      gutter: 0
    });

    document.querySelector(".loading").style.display = "none";
    wrapper.style.display = "block";
  }
}

//----------------------------------

var newModule = new ajaxModule();

document.querySelector(".btn-div button").addEventListener("click", function() {
  var keyword = document.querySelector(".searchInput").value.toLowerCase();
  if (keyword) {
    newModule.init(keyword);
  }
});

newModule.init("nature");
