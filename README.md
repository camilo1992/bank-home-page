# Bank-list-Home-page

TEhere are three features in this home-page

- Smooth scrolling
- Sticky nav bar
- Lazy loading images
- Slider component

## Smooth scrolling

```s
smooth scrolling  ---> there are two ways of implementing this action
modenr way ---> htmlEl.scrollIntoView({behavior:'smooth')} --> supported by modern browsers
Old way ---> explained below --> supported by all browsers.
```

There are two importatn node.porperties

```s
1- getClientRect
```

---> it provides its relative position to the view por and its size

```s
2- window.pageXOFFset and window.pageYOFFset
```

---> It provides the position of the top of the view port to the top of the page

There is also one imporatnt coument property that allow us to identify the size of the view port

```s
document.documentElement.clientHeight
document.documentElement.clientWidth
```

So we can implement an scroll button by adding the position and relative position of an elemnt on the x and y axis. using

```s
window.scrollTo(x,y)
```

we can pass an option argument

```s
option {
    left: p + r,
    right: p + r,
    behavior: 'smooth'
}
```

## Sticky nav-bar

In order to implement this behaviour we need to create a css property call sticky and add it to the nav-bar once it has reached certain position.

There are two ways of implementing this behavior.
. 1. calling the window.scrollY porperti
. 2. new IntersectionObserver API

1 ---> It is not recommended since it is cosidered a bad practice to trigger the scroll event. e.g.

```s
window.addEventListener('scroll', function {
...})
```

css configuration

```s
sticky {
 position: fixed;
 background-color: rgba(255, 255, 255, 0.95);
}
```

-Position
tbhis position can be found by accessing to the window property scrollY

```s
window.scrollY
This porperty will express its value according to the postion of the port view on the screen
```

2 ---> new IntersectionObserver API

```s
1- const observer = new IntersectionObserver( obsCallBack, option:{})
2- observer.observe(*)
* ---> section where we want the sticky-var starts to stick. it is the html element .. ost of the time it is a section with an id
```

```s
const options = {
root: null, ---> it reprensetn the view port wehn it is set to null.
threshold: 0.1 --> the percentage at which,  * will trigger the callback fucntion
}
```

```s
const obsCallBack = function( entries, observer){
entries ---> can be a [] that contains different thresholds
}
```
