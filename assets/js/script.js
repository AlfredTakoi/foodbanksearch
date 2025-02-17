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
  // $(".select2-selection__rendered").append('<i class="bi bi-chevron-down"></i>')

  var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Dist of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  states.forEach(item => {
    var value = item.toLowerCase().replace(/\s+/g, '_');
    $(".select-state").append(`
      <option value="${value}">${item}</option>
    `)
  })

  $(".select-state").on("change", function() {
    loadJSON($(this).val())
  })

  $("#sortOrder").on("change", function() {
    loadJSON($(".select-state").val())
  })

  function updatePageInfo(slick, currentSlide) {
    var slidesToShow = slick.options.slidesToShow;
    var totalSlides = slick.slideCount;
    var totalPages = Math.ceil(totalSlides / slidesToShow);
    var currentPage = Math.ceil((currentSlide + 1) / slidesToShow);

    $(".food-bank-list-pagination").html(`<span>Page <span class="fw-semibold">${currentPage}</span> of <span class="fw-semibold">${totalPages}</span>`);
  }

  var jsonData = []

  function loadJSON(state = "alabama") {
    $("#spinner-loading").show();
    $(".food-bank-list").html("");
    // $.getJSON(`./assets/data/food_bank.json`, function(data) {
    //   jsonData = data
    //   renderCard();
    // }).done(function() {
    //   $("#spinner-loading").hide();
    // })

    $.ajax({
      url: "./assets/data/food_bank.json",
      dataType: "json",
      success: function (data) {
        jsonData = data
        renderCard();
      },
      error: function () {
        alert("Gagal mengambil data JSON.");
      },
      complete: function () {
        $("#spinner-loading").hide();
      }
    });
  }

  function renderCard() {
    let selectedState = $(".select-state").val(); // Ambil state yang dipilih
    let sortOrder = $("#sortOrder").val();

    let filteredData = [];
    
    if (selectedState === "all") {
      jsonData.forEach(state => {
        filteredData = filteredData.concat(state.data);
      });
    } else {
      let stateData = jsonData.find(state => state.state === selectedState);
      if (stateData) {
        filteredData = stateData.data;
      }
    }

    filteredData.sort((a, b) => {
      return sortOrder === "asc" ? a.post_title.localeCompare(b.post_title) : b.post_title.localeCompare(a.post_title);
    });
    console.log(filteredData)

    filteredData.forEach(item => {
      $(".food-bank-list").html();
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

    // console.log(filteredData)

    var $slider = $(".food-bank-list");
    if($slider.hasClass("slick-initialized")) {
      $slider.slick("unslick");
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

  loadJSON("all");

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
