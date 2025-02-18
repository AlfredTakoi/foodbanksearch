$(document).ready(function() {

  $('#mySelect, #sortOrder').select2({
    width: "100%",
    placeholder: $(this).data("placeholder"),
  });

  $(document).on('select2:open', () => {
    document.querySelector('.select2-search__field').focus();
  });
  
  $('.select-state-wrap .select2-selection').addClass('flex-shrink-0 bg-yellow border-0 text-white py-2 px-4 rounded-pill align-self-center');
  $('.select-sortby-wrap .select2-selection').addClass('btn bg-dark btn-dark rounded-pill px-4 py-2 align-self-center');

  var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Dist of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
  var usRegions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

 
  var arrayStates = []

  states.forEach(item => {
    var value = item.toLowerCase().replace(/\s+/g, '_');
    arrayStates.push(value)
    $(".select-state").append(`
      <option value="${value}">${item}</option>
    `)
  })

  const stateMapping = Object.fromEntries(arrayStates.map((state, index) => [state, usRegions[index]]));

  $(".select-state").on("change", function() {
    $("#searchFoodBankInput").val("")
    loadJSON($(this).val())
  })

  $("#sortOrder").on("change", function() {
    if ($(".select-state").val() == null) {
      loadAllStateJSON()
    } else {
      console.log("kepanggil")
      loadJSON($(".select-state").val())
      $("#searchFoodBankInput").val("")
    }
  })

  $("#searchFoodBankLocation").on("submit", function(e) {
    $(".select-state").val("");
    e.preventDefault();
    loadAllStateJSON();
  })

  function updatePageInfo(slick, currentSlide) {
    var slidesToShow = slick.options.slidesToShow;
    var totalSlides = slick.slideCount;
    var totalPages = Math.ceil(totalSlides / slidesToShow);
    var currentPage = Math.ceil((currentSlide + 1) / slidesToShow);

    $(".food-bank-list-pagination").html(`<span>Page <span class="fw-semibold">${currentPage}</span> of <span class="fw-semibold">${totalPages}</span>`);
  }

  var jsonData = []
  function loadJSON(state) {
    $("#spinner-loading").show();
    $(".food-bank-list").html("");
    $.getJSON(`./assets/data/${state}.json`, function (data) {
      jsonData = data
      let selectedState = $(".select-state").val(); // Ambil state yang dipilih
      let sortOrder = $("#sortOrder").val();
      let stateCode = stateMapping[selectedState];
      if (selectedState !== "all") {
        jsonData = jsonData.filter(item => item.region === stateCode);
      }
      jsonData.sort((a, b) => {
        return sortOrder === "asc" ? a.post_title.localeCompare(b.post_title) : b.post_title.localeCompare(a.post_title);
      });

      renderCard(jsonData)
      $("#spinner-loading").hide();
    }).fail(function () {
      $("#spinner-loading").hide();
      alert("Failed Loading Data");
    });
  }

  function loadAllStateJSON() {
    $("#spinner-loading").show();
    $(".food-bank-list").html("");
    let promises = arrayStates.map(file_name => $.getJSON(`./assets/data/${file_name}.json`));
    Promise.all(promises).then(results => {
      jsonData = results.flatMap(data => data);
      let searchQuery = $("#searchFoodBankInput").val().toLowerCase();
      let sortOrder = $("#sortOrder").val();
      jsonData.sort((a, b) => {
        return sortOrder === "asc" ? a.post_title.localeCompare(b.post_title) : b.post_title.localeCompare(a.post_title);
      });
      if (searchQuery) {
        jsonData = jsonData.filter(item =>
          item.street.toLowerCase().includes(searchQuery) ||
          item.city.toLowerCase().includes(searchQuery) ||
          item.region.toLowerCase().includes(searchQuery)
        );
      }
      renderCard(jsonData)
    }).catch(() => {
      alert("Failed Loading Data");
    }).finally(() => {
      $("#spinner-loading").hide();
    });
  }

  function renderCard(filteredData) {
    var $slider = $(".food-bank-list");
    if($slider.hasClass("slick-initialized")) {
      $slider.slick("unslick");
    }

    console.log(filteredData)

    $(".food-bank-list").empty();
    if (filteredData.length == 0) {
      $(".food-bank-list").append('<span class="text-center">Food Bank is not found</span>')
    } else {
      filteredData.forEach(item => {
        $(".food-bank-list").append(
          `
          <div class="food-bank-item">
            <img src="./assets/img/food-bank-img.png" class="rounded-3 mb-3 w-100 object-fit-cover" alt="" height="162">
            <h5 class="fw-bold">${item.post_title}</h5>
            <span class="d-block mb-2"><i class="bi bi-geo-alt"></i> Food Bank</span>
            <p class="mb-2">${item.street} ${item.zip}</p>
            <span class="d-block mb-2"><i class="bi bi-telephone"></i> ${item.phone || "-"}</span>
          </div>
          `
        );
      });
    }
    
    $slider.on("init", function (event, slick) {
      updatePageInfo(slick, 0);
    });

    $slider.on("afterChange", function (event, slick, currentSlide) {
      updatePageInfo(slick, currentSlide);
    });

    $slider.slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      dots: false,
      arrows: true,
      nextArrow: '<button class="food-bank-next-btn"><i class="bi bi-arrow-right-short"></i></button>',
      prevArrow: '<button class="food-bank-prev-btn"><i class="bi bi-arrow-left-short"></i></button>',
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
      ]
    });
  }

  var defaultState = "alabama"
  loadJSON(defaultState);

  $(".banner-menu-img").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: false,
    nextArrow: false,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
    ]
  })
})
