'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContent = document.querySelectorAll(`.operations__content`);

const nav = document.querySelector(`.nav`);

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const scrollButtonTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
scrollButtonTo.addEventListener(`click`, function (e) {
  // 1. we need to find the coordinates o the elemente where we want to scroll to.

  const s1coor = section1.getBoundingClientRect();
  console.log(`s1'top distance from top to view port `, s1coor); // this is gonna display the distance of the top of section 1 to to the view port.
  console.log(e.target.getBoundingClientRect());

  console.log(
    `Current scroll window position (X/Y)`,
    window.pageXOffset,
    pageYOffset
  );

  console.log(
    `heith and width of the view port`,
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //  2. MODERN WAY ............ NOT POSSIBLE IN ALL COMPUTERS
  section1.scrollIntoView({ behavior: `smooth` });
});

//   ---------------------------------------------------- TABBED COMPONENT ----------------------------------------

tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);
  console.log(clicked);
  // GUARD CLAUSE.
  if (!clicked) return;

  // REMOVE ACTIVE CLASSES
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  tabsContent.forEach(c => c.classList.remove(`operations__content--active`));

  //  ACTIVE TAB
  clicked.classList.add(`operations__tab--active`);

  // ACTIVE CONTENT AREA
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

//..........................   PASSING ARGUMENTS TO EVENT HANDLERS ... IN THIS CASE REFACTORING ......

const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};

nav.addEventListener(`mouseover`, handleHover.bind(0.5));
nav.addEventListener(`mouseout`, handleHover.bind(1));

//  ----------------------------------------    sticky menu -------------------------------------

// const intCoord = section1.getBoundingClientRect();
// console.log(intCoord.top);
// //  it is not recomended to use the scroll event, since it react too many times.. slowing down the navigation.
// // therefore there are othre way of interacting with the web.

// window.addEventListener(`scroll`, function () {
//   console.log(window.scrollY);
//   window.scrollY > intCoord.top
//     ? nav.classList.add(`sticky`)
//     : nav.classList.remove(`sticky`);
// });

//------------- NEW INTERSECTION OBSERVER API -----------------------------

// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null, // if root is et to null the root is set to the VIEW PORT.
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);
// =================================================================================

const sitckyHeader = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add(`sticky`);
  } else {
    nav.classList.remove(`sticky`);
  }
};

const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector(`.header`);
const navObserver = new IntersectionObserver(sitckyHeader, {
  root: null,
  rootMargin: `-${navHeight}px`,
});
navObserver.observe(header);

// -------------------------------------      Revealing elements on scroll        ----------------

const revealSec = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const obsReveal = new IntersectionObserver(revealSec, {
  root: null,
  threshold: 0.15,
  rootMargin: (Number.parseInt(`-10px`), 10) + `px`,
});

document.querySelectorAll(`.section`).forEach(sec => {
  // sec.classList.add(`section--hidden`);
  obsReveal.observe(sec);
});

// ========================================LAZY LOADING IMAGES =============================

const images = document.querySelectorAll(`.features__img`);

const callImg = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entries.forEach(pic => {
    pic.target.src = pic.target.dataset.src;

    pic.target.addEventListener(`load`, function () {
      pic.target.classList.remove(`lazy-img`);
    });

    observe.unobserve(pic.target);
  });
};

const imageObs = new IntersectionObserver(callImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

images.forEach(img => imageObs.observe(img));

//  ============================      setting slidder ================================
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const slider = document.querySelector(`.slider`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const dotContainer = document.querySelector('.dots');
  const maxSlides = slides.length - 1;
  let curSlide = 0;

  //  set up of dots .....
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Dot shadowing

  const actDotSh = function (slide) {
    const dots = document.querySelectorAll(`.dots__dot`);
    dots.forEach(dot => {
      dot.classList.remove(`dots__dot--active`);
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  //  code functionality to change slides
  const changeSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // code movement to left
  const moveLeft = function () {
    curSlide === 0 ? (curSlide = maxSlides) : curSlide--;
    changeSlide(curSlide);
    actDotSh(curSlide);
  };
  btnLeft.addEventListener(`click`, moveLeft);

  // code movement to right
  const moveRight = function () {
    curSlide === maxSlides ? (curSlide = 0) : curSlide++;
    changeSlide(curSlide);
    actDotSh(curSlide);
  };
  btnRight.addEventListener(`click`, moveRight);

  //  key movment of slides
  document.addEventListener(`keydown`, function (e) {
    e.key === `ArrowRight` && moveRight();
    e.key === `ArrowLeft` && moveLeft();
  });

  dotContainer.addEventListener(`click`, function (e) {
    if (!e.target.classList.contains(`dots__dot`)) return;
    const slide = e.target.dataset.slide;
    changeSlide(slide);
    actDotSh(slide);
  });
  const init = function () {
    createDots();
    actDotSh(0);
    changeSlide(0);
  };
  init();
};
slider();
//===================================================================================
//  EVENT DELEGATION

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    e.preventDefault();
    const id = e.target.getAttribute(`href`);
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
    e.stopPropagation();
  }
});

document.addEventListener(`DOMContentLoaded`, function (e) {
  console.log(`HTML and Java Script built !!!`, e);
});

window.addEventListener(`load`, function (e) {
  console.log(`htm and java script along images are ready`, e);
});

window.addEventListener(`beforeunload`, function (e) {
  e.preventDefault();
  console.log(`beforerunload was printed`, e);
  e.returnValue = ``;
});
