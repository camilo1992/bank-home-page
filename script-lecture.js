'use strict';

///////////////////////////////////////
// Modal window

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

// //////////////////////////////////// EVENTS /////////////////////////////////////////////////

// there is another way of setting events... it is by using fucntions, almost every event has its own function, but this is an old
//way of setting events and it is not used any more.

// const h1 = document.querySelector(`h1`);
// const h1Alert = function (e) {
//   alert(`You are reading the head Line`);
// };

// h1.addEventListener(`mouseenter`, h1Alert);
// setTimeout(() => h1.removeEventListener(`mouseenter`, h1Alert), 2000);

// h1.onmouseenter = () => {
//   alert(`you hover again`);
// };

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

  // 1.1 OLD WAY ...........
  // in order to implement the scroll position of the sectio 1 we needed to understan the distances
  //between element view port and events.

  // window.scrollTo(
  //   s1coor.left + window.pageXOffset,
  //   s1coor.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coor.left + window.pageXOffset,
  //   top: s1coor.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });

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

// ---------------------------------------   FADING MENU -------------------------------------------
/*\
const handleHover = function (a) {
  return function (e) {
    if (e.target.classList.contains(`nav__link`)) {
      const link = e.target;
      const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
      const logo = link.closest(`.nav`).querySelector(`img`);

      siblings.forEach(el => {
        if (el !== link) {
          el.style.opacity = a;
          logo.style.opacity = a;
        }
      });
    }
  };
};

nav.addEventListener(`mouseover`, handleHover(0.5));
nav.addEventListener(`mouseout`, handleHover(1));
*/
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

/*
document.querySelectorAll(`.nav__link`).forEach(el => {
  el.addEventListener(`click`, function (e) {
    e.preventDefault();
    console.log(el.getAttribute(`href`));
    document
      .querySelector(el.getAttribute(`href`))
      .scrollIntoView({ behavior: `smooth` });
  });
});
// we are implementing the smooth behavior in every button. however, this not very efficient since an event listener is gonna be created
// for every button. there is a solution and it is called eetn delegation.
// evetn delegation occur when we use bubling up to set an event in the parent's element. As followed .....
 */

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

// ///////////////////////////////////////////////////////
///////////////// ///////////////////////////////////////////////////////
/*

//  SELECTING ELEMENTS FROM THE DOM

console.log(document.documentElement);
console.log(document.body);
console.log(document.head);

const allSections = document.querySelectorAll(`.section`);
console.log(allSections);
document.getElementById(`section--1`);
const allButtons = document.getElementsByTagName(`button`);
console.log(allButtons);
console.log(document.getElementsByClassName(`btn`));
console.log(document.getElementsByTagName(`section`));
 */
/*

//                      CREATING AND INSERTING ELEMENTS
//            .insertAdejacentHTML
// const message = `<div class=cookie-message>We use cookies for impruved functionality and analytics. <button class= btn btn--close-cookie>got it!</button></div>`;
// console.log(message);
// document.querySelector(`.header`).insertAdjacentHTML(`afterbegin`, message);

// there are more ways of creating elements ...

const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
// message.textContent = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">got it !</button>`;
message.innerHTML = ` We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">got it !</button>`;
console.log(message);
const header = document.querySelector(`.header`);
// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));
header.before(message);
// header.after(message);

document.querySelector(`.btn--close-cookie`).addEventListener(`click`, () => {
  message.remove();
});

// setTimeout(() => {
//   message.remove();
// }, 3000); */

/*
// ------------------------ STYLES ------------------------

message.style.backgroundColor = `#37383d`;
message.style.width = `120%`;

//  getComputedStyle

console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 5 + `px`;

//  we can also alter css variables
document.documentElement.style.setProperty(`--color-primary`, `orangered`);

// ------------------------ ATRUBUTES ------------------------
const logo = document.querySelector(`.nav__logo`);
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className); // className === class
console.log(logo.alt);
// setting atributes
logo.alt = `Beautiful minimalist logo`;

// NON- STANDARD
// This is the only way of reading atributes that are non standard from the dom.
console.log(logo.designer); // it is set to undefined since this is not a standar property espected for images
console.log(logo.getAttribute(`designer`));

//  This are examples or absolute URL references and URL
console.log(logo.src); // absolute URL
console.log(logo.getAttribute(`src`)); // URL... file posisiton

const button = document.querySelector(`.nav__link`);
console.log(button.href);
console.log(button.getAttribute(`href`));

const link = document.querySelector(`.nav__link--btn`);
console.log(link.href);
console.log(link.getAttribute(`href`));

//  Data atributes ........
// Every atribute which name starts with data .. will be sstored into the dataset object.
// therefore, we need to use the  dataset and the cammel case version of the atribute's name.
console.log(logo.dataset.versionNumber);

// classes

logo.classList.add(`c`); // add
logo.classList.remove(`c`); // remove
console.log(logo.classList.toggle(`c`)); //add,  true
console.log(logo.classList.contains(`c`)); //true
 */
/*

// --------------------------------- EVETN PROPAGATION  -----------------------------------------

// rgb (255,255,255)
const ranNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randColour = () => {
  return `rgb(${ranNumber(0, 255)},${ranNumber(0, 255)},${ranNumber(0, 255)})`;
};


document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randColour();
  console.log(e.target); // it displays where the event was originated from
  console.log(e.currentTarget); // it displays the current element where the event is trveling through
  console.log(e.currentTarget === this); // true

  //   STOP PROPAGATION
  e.stopPropagation();
});
document.querySelector(`.nav`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randColour();
  console.log(e.target);
  console.log(e.currentTarget);
});
document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randColour();
  console.log(e.target);
  console.log(e.currentTarget);
});

const scrollUp = document.querySelector(`.btn--scrollup-to`);
const header = document.querySelector(`.header`);
scrollUp.addEventListener(`click`, function (e) {
  header.scrollIntoView({ behavior: `smooth` });
});

 */

// -------------------------------------------------------------------------------------------
// const link2 = document.createElement(`button`);
// link2.classList.add(`btn--text`, `scroll-UP--to`);
// link2.innerHTML = ` Scroll up ⬆`;

// document.querySelector(`#section--2`).before(link2);

// const myFucntion = () => {
//   document.querySelector(`.header`).scrollIntoView({ behavior: `smooth` });
// };

// document.querySelector(`.scroll-UP--to`).addEventListener(`click`, myFucntion);

/*
//---------------------------------------------------------------------------------------------------------
//    TRAVERSING
// SELECTING CHILD ELEMENTS
const h1 = document.querySelector(`h1`);
console.log(h1.querySelectorAll(`.highlight`));
console.log(h1.childNodes); // Selects every element
console.log(h1.children); // selects just the direct childs

h1.firstElementChild.style.color = `white`;
h1.lastElementChild.style.color = `blue`;

//--------------------------------------------------------------------------------------------------------
//  SELECTING PARENT ELEMENTS ....

console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(`.header`).style.background = `var(--gradient-secondary)`;
// The closest mehtod will move upwards until finding the class... it is useful when we have many elements of the same.

//  ------ MOVING SIDEWAYS ..... SELECTING SIBLINGS ......

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = `scale(0.5)`;
  }
});
 */

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
