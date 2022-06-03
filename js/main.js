let burger = document.querySelector('.burger'),
  nav = document.querySelector('.header__nav'),
  hiddenMenuOpen = false;

burger.addEventListener('click', ()=>{
  if(hiddenMenuOpen === false) {
    burger.classList.add('burger_active');
    nav.classList.add('header__nav_visible');
    hiddenMenuOpen = true;
  } else { 
    burger.classList.remove('burger_active');
    nav.classList.remove('header__nav_visible');
    hiddenMenuOpen = false;
  }
});



let slider = document.querySelector('.slider'),
  sliderList = slider.querySelector('.slider__wrapper'),
  sliderTrack = slider.querySelector('.slider__track'),
  slides = slider.querySelectorAll('.slider__item'),
  arrows = slider.querySelector('.slider__btn'),
  prev = slider.querySelector('.slider__btn_prev'),
  next = slider.querySelector('.slider__btn_next'),
  slideWidth = sliderList.offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --slides.length * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.35,
  trfRegExp = /([-0-9.]+(?=px))/,
  swipeStartTime,
  swipeEndTime;
  itemWidth();
  window.addEventListener('resize', itemWidth);
  function itemWidth() {
    slides.forEach((slide)=>{
      slideWidth = sliderList.offsetWidth;
      slide.style.width = slideWidth+'px';
      lastTrf = --slides.length * slideWidth;
      posThreshold = slides[0].offsetWidth * 0.35;
      sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;
    });
  }
  let getEvent = function() {
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
  }
  function slide() {
    if (transition) {
      sliderTrack.style.transition = 'transform .5s';
    }
    slides.forEach((elem) =>{
      elem.classList.remove('slide_active');
    });
    slides[slideIndex].classList.add('slider__item_active');
    sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

    prev.classList.toggle('btn_disabled', slideIndex === 0);
    next.classList.toggle('btn_disabled', slideIndex === --slides.length);
  }
  function swipeStart() {
    let evt = getEvent();


    if (allowSwipe && window.innerWidth<1200) {

      swipeStartTime = Date.now();
      
      transition = true;

      nextTrf = (slideIndex + 1) * -slideWidth;
      prevTrf = (slideIndex - 1) * -slideWidth;

      posInit = posX1 = evt.clientX;
      posY1 = evt.clientY;

      sliderTrack.style.transition = '';

      document.addEventListener('touchmove', swipeAction);
      document.addEventListener('mousemove', swipeAction);
      document.addEventListener('touchend', swipeEnd);
      document.addEventListener('mouseup', swipeEnd);

      sliderList.classList.remove('grab');
      sliderList.classList.add('grabbing');
    }
  }
  function swipeAction() {

    let evt = getEvent(),
      style = sliderTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      if (slideIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (slideIndex === --slides.length) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
        reachEdge();
        return;
      }

      sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
    }

  }
  function swipeEnd() {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);

    sliderList.classList.add('grab');
    sliderList.classList.remove('grabbing');

    if (allowSwipe) {
      swipeEndTime = Date.now();
      if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
        if (posInit < posX1) {
          slideIndex--;
        } else if (posInit > posX1) {
          slideIndex++;
        }
      }

      if (posInit !== posX1) {
        allowSwipe = false;
        slide();
      } else {
        allowSwipe = true;
      }

    } else {
      allowSwipe = true;
    }

  }
  let setTransform = function(transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  },
  reachEdge = function() {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };

sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
sliderList.classList.add('grab');

sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
slider.addEventListener('touchstart', swipeStart);
slider.addEventListener('mousedown', swipeStart);

next.addEventListener('click', () => {
  if(!next.classList.contains('btn_disabled')){
    slideIndex++;
    slide();
  }
});
prev.addEventListener('click', () => {
  if(!prev.classList.contains('btn_disabled')){
    slideIndex--;
    slide();
  }
});
slide();


  var links = document.querySelectorAll('.header-nav__link');
  links.forEach((link)=>{
    link.addEventListener('click', ()=>{
      nav_url(link.href);
    });
  });

function nav_url(addr){

  const links = document.querySelectorAll('.header-nav__link');
  let url = window.location.href;
  if(addr!==null) {
    url = addr;
  }
  let i=0;
  let number_address = 0;
  links.forEach(function(elem) {
    address = ((elem.href).split('#')).pop();
    if(url.indexOf(address) >= 0 && address!=''){
      elem.classList.add('header-nav__link_active');
      number_address = i;
    }
    else{
      elem.classList.remove('header-nav__link_active');
    }
    i++;
  });
  if(number_address == 0){
    links[number_address].classList.add('header-nav__link_active');
  }
}
nav_url(null);

