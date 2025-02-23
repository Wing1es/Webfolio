// Code from locomotive website for smooth scrolling
function locomotiveScroll(){
  gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#wrapper"),
  smooth: true,
  mobile:{
    smooth: true
  }
});
window.locoScroll = locoScroll;
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#wrapper" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#wrapper", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#wrapper").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();
document.addEventListener("DOMContentLoaded", () => {
  const scroll = window.locoScroll;
  console.log("locoScroll instance:", scroll);
  const navHeight = 84.5;
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      console.log("Scrolling to:", targetElement);
      if (targetElement && scroll) {
        scroll.scrollTo(targetElement, -navHeight, 1000);
        
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 1100);
      }
    });
  });
});
  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  function handleNavBehavior() {
    const nav = document.querySelector('nav');
    if (isMobileDevice()) {
      nav.removeAttribute('data-scroll-sticky');
      nav.style.position = 'fixed';
      nav.style.top = '0';
      nav.style.left = '0';
      nav.style.width = '100%';
      nav.style.zIndex = '9999';
    } else {

      nav.setAttribute('data-scroll-sticky', '');
      
      nav.style.position = '';
      nav.style.top = '';
      nav.style.left = '';
      nav.style.width = '';
      nav.style.zIndex = '';
    }
  }
  handleNavBehavior();
}
locomotiveScroll();

window.addEventListener("load", () => {
  gsap.to("#preloader", {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      document.getElementById("preloader").style.display = "none";
      gsap.to("main", { opacity: 1, visibility: "visible", duration: 0.5 });
      startAnimations();
      locoScroll.update();
    }
  });
});

function startAnimations() {
  // Intro animation
  gsap.from('nav', {
    y: -100,
    opacity: 0,
    duration: 1,
  });
  
  gsap.timeline()
    .from("#page1 h1", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    })
    .from("#page1 p", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .from("#container .sticky", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.2
    }, "-=0.5");

  // Spider animation
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      scroller: "#wrapper",   
      start: "top top", 
      endTrigger: "#footer", 
      end: "bottom bottom",
      scrub: true,
    }
  });

  tl.to("nav .home a i", { y: '80vh' }, 0);
  tl.to("nav .home a .vertical-line", { height: '79vh' }, 0);

  // Nav links
  var links = document.querySelectorAll('.hover');
  links.forEach(link => {
    let underline = link.querySelector('.underline');
    link.addEventListener('mouseover', () => {
      gsap.to(underline, {
        width: '100%',
        duration: 0.3,
        ease: 'power1.inOut'
      });
    });
    link.addEventListener('mouseout', () => {
      gsap.to(underline, {
        width: '0%',
        duration: 0.3,
        ease: 'power1.inOut'
      });
    });
  });

  // Motto
  const allMotto = document.querySelectorAll('.motto');
  allMotto.forEach(motto => {
    let empty = '';
    const text = motto.textContent;
    const splitText = text.split('');
    splitText.forEach(letter => {
      empty += `<span>${letter}</span>`;
    });
    motto.innerHTML = empty;
  });

  ScrollTrigger.matchMedia({
    "(max-width:863px)":()=>{
      gsap.to('.motto span', {
        color: 'rgb(192, 11, 11)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '#about .motto',
          scroller: '#wrapper',
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: 1,
        }
      });
    },
    "(min-width:864px)":()=>{
      gsap.to('.motto span', {
        color: 'rgb(192, 11, 11)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '#about .motto',
          scroller: '#wrapper',
          start: 'top 50%',
          end: 'bottom 20%',
          scrub: 1,
        }
      });
    }
  })

  // Projects
  ScrollTrigger.matchMedia({
    "(max-width:863px)":()=>{
      let cylindertl = gsap.timeline({
        scrollTrigger: {
          trigger: '#projects',
          scroller: '#wrapper',
          start: 'top 60%',
          end: 'bottom 35%',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
      cylindertl.to('.mission-content .content:nth-child(1)', {
        rotationX: 60,
        z: -250,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'power2.inOut'
      });
      
      cylindertl.fromTo('.mission-content .content:nth-child(2)', {
        rotationX: -45,
        z: -250,
        opacity: 0,
        scale: 0.8,
      }, {
        rotationX: 0,
        z: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)'
      }, '-=0.5');
      
      cylindertl.to('.mission-content .content:nth-child(2)', {
        rotationX: 60,
        rotationY: 10,
        z: -250,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'power2.inOut'
      });
      
      cylindertl.fromTo('.mission-content .content:nth-child(3)', {
        rotationX: -45,
        rotationZ: -5,
        z: -250,
        opacity: 0,
        scale: 0.8,
      }, {
        rotationX: 0,
        rotationZ: 0,
        z: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)'
      }, '-=0.5');
    },
    "(max-width:863px)":()=>{
      let cylindertl = gsap.timeline({
        scrollTrigger: {
          trigger: '#projects',
          scroller: '#wrapper',
          start: 'top 10%',
          end: 'bottom 60%',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
      cylindertl.to('.mission-content .content:nth-child(1)', {
        rotationX: 60,
        z: -250,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'power2.inOut'
      });
      
      cylindertl.fromTo('.mission-content .content:nth-child(2)', {
        rotationX: -45,
        z: -250,
        opacity: 0,
        scale: 0.8,
      }, {
        rotationX: 0,
        z: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)'
      }, '-=0.5');
      
      cylindertl.to('.mission-content .content:nth-child(2)', {
        rotationX: 60,
        rotationY: 10,
        z: -250,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'power2.inOut'
      });
      
      cylindertl.fromTo('.mission-content .content:nth-child(3)', {
        rotationX: -45,
        rotationZ: -5,
        z: -250,
        opacity: 0,
        scale: 0.8,
      }, {
        rotationX: 0,
        rotationZ: 0,
        z: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)'
      }, '-=0.5');
    }
  })

  
}