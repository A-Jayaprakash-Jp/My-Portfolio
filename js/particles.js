particlesJS('particles-js', {
  "particles": {
    "number": {
      "value": 1500,
      "density": {
        "enable": true,
        "value_area": 8000
      }
    },
    "color": {
      "value": ["#6c6dff", "#ff6584", "#ffffff"]
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      }
    },
    "opacity": {
      "value": 0,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 10,
        "sync": false
      }
    },
    "size": {
      "value": 400,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 30,
        "size_min": 10,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 120,
      "color": "#6c63ff",
      "opacity": 0,
      "width": 1.5
    },
    "move": {
      "enable": true,
      "speed": 400,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": true,
        "rotateX": 800,
        "rotateY": 1600
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 160,
        "line_linked": {
          "opacity": 0
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 100,
        "speed": 30
      },
      "push": {
        "particles_nb": 6
      },
      "remove": {
        "particles_nb": 3
      }
    }
  },
  "retina_detect": true
});