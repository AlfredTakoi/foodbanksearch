$(document).ready(function() {

  $('#mySelect').select2({
    width: "100%"
  });

  $('.select2-selection').addClass('btn bg-dark btn-dark rounded-pill px-4 py-2 align-self-center');
  // $(".select2-selection__rendered").append('<i class="bi bi-chevron-down"></i>')

  var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  states.forEach(item => {
    $(".select-state").append(`
      <option value="1">${item}</option>
    `)
  })

  $.getJSON("./assets/data/alabama.json", function(data) {
    data.forEach(item => {
      $(".food-bank-list").append(
        `
        <div class="food-bank-item">
          <img src="./assets/img/food-bank-img.png" class="rounded-3 mb-3 w-100 object-fit-cover" alt="" height="162">
          <h5 class="fw-bold">${item.post_title}</h5>
          <span class="d-block mb-2"><i class="bi bi-geo-alt"></i> Food Bank</span>
          <p class="mb-2">${item.street} ${item.zip}</p>
          <span class="d-block mb-2"><i class="bi bi-telephone"></i> ${item.phone}</span>
        </div>
        `
      );
    });

    var $slider = $(".food-bank-list");
    function updatePageInfo(slick, currentSlide) {
      var slidesToShow = slick.options.slidesToShow;
      var totalSlides = slick.slideCount;
      var totalPages = Math.ceil(totalSlides / slidesToShow);
      var currentPage = Math.ceil((currentSlide + 1) / slidesToShow);

      $(".food-bank-list-pagination").html(`<span>Page <span class="fw-semibold">${currentPage}</span> of <span class="fw-semibold">${totalPages}</span>`);
    }

    $slider.on("init", function (event, slick) {
      updatePageInfo(slick, 0); // Set "Page 1 of X" saat pertama kali render
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
  })

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
