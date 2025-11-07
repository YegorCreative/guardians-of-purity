// Active navigation state management
const navLinks = document.querySelectorAll(".nav-links a");

// Function to update active nav link
function updateActiveNav() {
  let current = "";

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Listen for scroll events
window.addEventListener("scroll", updateActiveNav);

// Mobile menu toggle functionality
const menuToggle = document.getElementById("menuToggle");
const navLinksContainer = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinksContainer.classList.toggle("active");
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.remove("active");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
    navLinksContainer.classList.remove("active");
  }
});

// Center-Mode Productivity Slider

const track = document.getElementById("cmpTrack");
const wrap = track.parentElement;
const cards = Array.from(track.children);
const prev = document.getElementById("cmpPrev");
const next = document.getElementById("cmpNext");
const dotsBox = document.getElementById("cmpDots");

const isMobile = () => matchMedia("(max-width:767px)").matches;

cards.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.className = "center_mode_productivity_dot";
  dot.onclick = () => activate(i, true);
  dotsBox.appendChild(dot);
});
const dots = Array.from(dotsBox.children);

let current = 0;

function center(i) {
  const card = cards[i];
  const axis = isMobile() ? "top" : "left";
  const size = isMobile() ? "clientHeight" : "clientWidth";
  const start = isMobile() ? card.offsetTop : card.offsetLeft;
  wrap.scrollTo({
    [axis]: start - (wrap[size] / 2 - card[size] / 2),
    behavior: "smooth",
  });
}

function toggleUI(i) {
  cards.forEach((c, k) => c.toggleAttribute("active", k === i));
  dots.forEach((d, k) => d.classList.toggle("active", k === i));
  prev.disabled = i === 0;
  next.disabled = i === cards.length - 1;
}

function activate(i, scroll) {
  if (i === current) return;
  current = i;
  toggleUI(i);
  if (scroll) center(i);
}

function go(step) {
  activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
}

prev.onclick = () => go(-1);
next.onclick = () => go(1);

addEventListener(
  "keydown",
  (e) => {
    if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
    if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
  },
  { passive: true }
);

cards.forEach((card, i) => {
  card.addEventListener(
    "mouseenter",
    () => matchMedia("(hover:hover)").matches && activate(i, true)
  );
  card.addEventListener("click", () => activate(i, true));
});

let sx = 0,
  sy = 0;
track.addEventListener(
  "touchstart",
  (e) => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  },
  { passive: true }
);

track.addEventListener(
  "touchend",
  (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60)
      go((isMobile() ? dy : dx) > 0 ? -1 : 1);
  },
  { passive: true }
);
if (window.matchMedia("(max-width:767px)").matches) dotsBox.hidden = true;

addEventListener("resize", () => center(current));

toggleUI(0);
center(0);

// Water Distortion Effect Initialization

// const canvasEl = document.querySelector("#waterDistortion");
// const imgInput = document.querySelector("#image-selector-input");
// const devicePixelRatio = Math.min(window.devicePixelRatio, 2);

// const params = {
//   blueish: 0.6,
//   scale: 7,
//   illumination: 0.15,
//   surfaceDistortion: 0.07,
//   waterDistortion: 0.03,
//   loadMyImage: () => {
//     imgInput.click();
//   },
// };

// imgInput.onchange = () => {
//   const [file] = imgInput.files;
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       loadImage(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   }
// };

// let image, uniforms;
// const gl = initShader();
// updateUniforms();
// loadImage(
//   "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/hero--desktop.webp?v=1759340146"
// );
// createControls();
// render();
// window.addEventListener("resize", resizeCanvas);

// function initShader() {
//   const vsSource = document.getElementById("vertShader").innerHTML;
//   const fsSource = document.getElementById("fragShader").innerHTML;

//   const gl =
//     canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

//   if (!gl) {
//     alert("WebGL is not supported by your browser.");
//   }

//   function createShader(gl, sourceCode, type) {
//     const shader = gl.createShader(type);
//     gl.shaderSource(shader, sourceCode);
//     gl.compileShader(shader);

//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//       console.error(
//         "An error occurred compiling the shaders: " +
//           gl.getShaderInfoLog(shader)
//       );
//       gl.deleteShader(shader);
//       return null;
//     }

//     return shader;
//   }

//   const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
//   const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

//   function createShaderProgram(gl, vertexShader, fragmentShader) {
//     const program = gl.createProgram();
//     gl.attachShader(program, vertexShader);
//     gl.attachShader(program, fragmentShader);
//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//       console.error(
//         "Unable to initialize the shader program: " +
//           gl.getProgramInfoLog(program)
//       );
//       return null;
//     }

//     return program;
//   }

//   const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
//   uniforms = getUniforms(shaderProgram);

//   function getUniforms(program) {
//     let uniforms = [];
//     let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
//     for (let i = 0; i < uniformCount; i++) {
//       let uniformName = gl.getActiveUniform(program, i).name;
//       uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
//     }
//     return uniforms;
//   }

//   const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

//   const vertexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//   gl.useProgram(shaderProgram);

//   const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
//   gl.enableVertexAttribArray(positionLocation);

//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

//   return gl;
// }

// function updateUniforms() {
//   gl.uniform1f(uniforms.u_blueish, params.blueish);
//   gl.uniform1f(uniforms.u_scale, params.scale);
//   gl.uniform1f(uniforms.u_illumination, params.illumination);
//   gl.uniform1f(uniforms.u_surface_distortion, params.surfaceDistortion);
//   gl.uniform1f(uniforms.u_water_distortion, params.waterDistortion);
// }

// function loadImage(src) {
//   image = new Image();
//   image.crossOrigin = "anonymous";
//   image.src = src;
//   image.onload = () => {
//     const imageTexture = gl.createTexture();
//     gl.bindTexture(gl.TEXTURE_2D, imageTexture);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//     gl.uniform1i(uniforms.u_image_texture, 0);
//     resizeCanvas();
//   };
// }

// function render() {
//   const currentTime = performance.now();
//   gl.uniform1f(uniforms.u_time, currentTime);
//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//   requestAnimationFrame(render);
// }

// function resizeCanvas() {
//   const imgRatio = image.naturalWidth / image.naturalHeight;
//   canvasEl.width = window.innerWidth * devicePixelRatio;
//   canvasEl.height = window.innerHeight * devicePixelRatio;
//   gl.viewport(0, 0, canvasEl.width, canvasEl.height);
//   gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
//   gl.uniform1f(uniforms.u_img_ratio, imgRatio);
// }

// function createControls() {
//   if (typeof GUI === "undefined") {
//     console.warn("lil-gui library not loaded");
//     return;
//   }
//   const gui = new lil.GUI();

//   gui.close();

//   gui.add(params, "loadMyImage").name("load image");

//   const paramsFolder = gui.addFolder("shader params");
//   // paramsFolder.close();

//   paramsFolder.add(params, "blueish", 0, 0.8).onChange(updateUniforms);
//   paramsFolder.add(params, "scale", 5, 12).onChange(updateUniforms);
//   paramsFolder.add(params, "illumination", 0, 1).onChange(updateUniforms);
//   paramsFolder
//     .add(params, "surfaceDistortion", 0, 0.12)
//     .onChange(updateUniforms)
//     .name("surface distortion");
//   paramsFolder
//     .add(params, "waterDistortion", 0, 0.08)
//     .onChange(updateUniforms)
//     .name("water distortion");
// }

// Accordion Slider Navigation Buttons

class AccordionSlider {
  constructor() {
    this.slides = document.querySelectorAll(".accordion_slider_slide");
    this.prevBtn = document.querySelector(".accordion_slider_slide-nav-prev");
    this.nextBtn = document.querySelector(".accordion_slider_slide-nav-next");
    this.currentIndex = -1;

    this.init();
  }

  init() {
    this.slides.forEach((slide, index) => {
      slide.addEventListener("click", () => this.setActiveSlide(index));
    });

    this.prevBtn.addEventListener("click", () => this.previousSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.previousSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });
  }

  setActiveSlide(index) {
    if (this.currentIndex === index) {
      this.slides.forEach((slide) => slide.classList.remove("active"));
      this.currentIndex = -1;
    } else {
      this.slides.forEach((slide) => slide.classList.remove("active"));
      this.slides[index].classList.add("active");
      this.currentIndex = index;
    }
  }

  nextSlide() {
    const nextIndex =
      this.currentIndex === -1
        ? 0
        : (this.currentIndex + 1) % this.slides.length;
    this.setActiveSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex =
      this.currentIndex === -1
        ? this.slides.length - 1
        : (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.setActiveSlide(prevIndex);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AccordionSlider();
});

// Team carousel
const teamMembers = [
  { name: "Luffy", role: "Founder" },
  { name: "Monkey D. Luffy", role: "Creative Director" },
  { name: "Luffy chan", role: "Lead Developer" },
  { name: "Lucy", role: "UX Designer" },
  { name: "Luffy kun", role: "Marketing Manager" },
  { name: "Monkey chan", role: "Product Manager" },
];

const teamCarouselCard = document.querySelectorAll(".team_carousel_card");
const teamCarouselDots = document.querySelectorAll(".team_carousel_dot");
const memberName = document.querySelector(".team_carousel_member-name");
const memberRole = document.querySelector(".team_carousel_member-role");
const upArrows = document.querySelectorAll(".team_carousel_nav-arrow.up");
const downArrows = document.querySelectorAll(".team_carousel_nav-arrow.down");
let currentIndexCarousel = 0;
let isAnimating = false;

function updateCarousel(newIndex) {
  if (isAnimating) return;
  isAnimating = true;

  currentIndexCarousel =
    (newIndex + teamCarouselCard.length) % teamCarouselCard.length;

  teamCarouselCard.forEach((card, i) => {
    const offset =
      (i - currentIndexCarousel + teamCarouselCard.length) %
      teamCarouselCard.length;

    card.classList.remove(
      "center",
      "up-1",
      "up-2",
      "down-1",
      "down-2",
      "hidden"
    );

    if (offset === 0) {
      card.classList.add("center");
    } else if (offset === 1) {
      card.classList.add("down-1");
    } else if (offset === 2) {
      card.classList.add("down-2");
    } else if (offset === teamCarouselCard.length - 1) {
      card.classList.add("up-1");
    } else if (offset === teamCarouselCard.length - 2) {
      card.classList.add("up-2");
    } else {
      card.classList.add("hidden");
    }
  });

  teamCarouselDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndexCarousel);
  });

  memberName.style.opacity = "0";
  memberRole.style.opacity = "0";

  setTimeout(() => {
    memberName.textContent = teamMembers[currentIndexCarousel].name;
    memberRole.textContent = teamMembers[currentIndexCarousel].role;
    memberName.style.opacity = "1";
    memberRole.style.opacity = "1";
  }, 300);

  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

upArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    updateCarousel(currentIndexCarousel - 1);
  });
});

downArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    updateCarousel(currentIndexCarousel + 1);
  });
});

teamCarouselDots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    updateCarousel(i);
  });
});

teamCarouselCard.forEach((card, i) => {
  card.addEventListener("click", () => {
    updateCarousel(i);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    updateCarousel(currentIndexCarousel - 1);
  } else if (e.key === "ArrowDown") {
    updateCarousel(currentIndexCarousel + 1);
  }
});

let touchStartX = 0;
let touchEndX = 0;
let scrollTimeout;
let isScrolling = false;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      updateCarousel(currentIndexCarousel + 1);
    } else {
      updateCarousel(currentIndexCarousel - 1);
    }
  }
}

updateCarousel(0);

// Corner shape list

const sponsors = [
  {
    src: "https://scary.land/images/finals/sponsors/Multi%20Co.svg",
    name: "MultiCo",
  },
  {
    src: "https://scary.land/images/finals/sponsors/ospuze.svg",
    name: "Ospuze",
  },
  {
    src: "https://scary.land/images/finals/sponsors/vaiiya.svg",
    name: "Vaiiya",
  },
  {
    src: "https://scary.land/images/finals/sponsors/alfa-acta.svg",
    name: "Alfa Acta",
  },
  {
    src: "https://scary.land/images/finals/sponsors/engimo.svg",
    name: "Engimo",
  },
  {
    src: "https://scary.land/images/finals/sponsors/holtow.svg",
    name: "Holtow",
  },
  { src: "https://scary.land/images/finals/sponsors/volpe.svg", name: "Volpe" },
  {
    src: "https://scary.land/images/finals/sponsors/iseul-t.svg",
    name: "Iseul-T",
  },
  {
    src: "https://scary.land/images/finals/sponsors/dissun.svg",
    name: "Dissun",
  },
  {
    src: "https://scary.land/images/finals/sponsors/trentila.svg",
    name: "Trentila",
  },
  { src: "https://scary.land/images/finals/sponsors/orf.svg", name: "Orf!" },
  { src: "https://scary.land/images/finals/sponsors/ivada.svg", name: "Ivada" },
];
const majors = [
  { src: "https://scary.land/images/finals/major/cometa.svg", name: "Cometa" },
  {
    src: "https://scary.land/images/finals/major/enorino.svg",
    name: "Eno+rino",
  },
  {
    src: "https://scary.land/images/finals/major/junopaico.svg",
    name: "Junopaico",
  },
  { src: "https://scary.land/images/finals/major/crmp.svg", name: "CRMP" },
  { src: "https://scary.land/images/finals/major/dxz.svg", name: "DXZ" },
  {
    src: "https://scary.land/images/finals/major/fizzy%20tiger.svg",
    name: "Fizzy Tiger",
  },
  {
    src: "https://scary.land/images/finals/major/plow%20skateboards.svg",
    name: "Plow Skateboards",
  },
  {
    src: "https://scary.land/images/finals/major/jiangsu%20romagna.svg",
    name: "Jiangsu Romagna",
  },
  { src: "https://scary.land/images/finals/major/ranzio.svg", name: "Ranzio" },
  {
    src: "https://scary.land/images/finals/major/shutifura.svg",
    name: "Shu.ti.fu.ra",
  },
  {
    src: "https://scary.land/images/finals/major/sodracing.svg",
    name: "Sodracing",
  },
  { src: "https://scary.land/images/finals/major/X7AV.svg", name: "X7AV" },
  {
    src: "https://scary.land/images/finals/major/xox%20skateboards.svg",
    name: "XOX Skateboards",
  },
  {
    src: "https://scary.land/images/finals/major/Hydra%20Q.svg",
    name: "Hydra Q (Redacted)",
  },
];
const minors = [
  { src: "https://scary.land/images/finals/minor/16WS.svg", name: "16WS" },
  {
    src: "https://scary.land/images/finals/minor/argon%20casino.svg",
    name: "Argon Casino",
  },
  {
    src: "https://scary.land/images/finals/minor/DXZ%20Sunglasses.svg",
    name: "DXZ Sunglasses",
  },
  {
    src: "https://scary.land/images/finals/minor/big%20splash%20of%20cash.svg",
    name: "Big Splash of Cash",
  },
  { src: "https://scary.land/images/finals/minor/qttro.svg", name: "Qttro" },
  {
    src: "https://scary.land/images/finals/minor/coin%20pile%20clinic.svg",
    name: "Coin Pile Clinic",
  },
  {
    src: "https://scary.land/images/finals/minor/robs%20wrist%20wraps.svg",
    name: "Rob's Wrist Wraps",
  },
  {
    src: "https://scary.land/images/finals/minor/dough%20wrangler.svg",
    name: "Dough Wrangler",
  },
  { src: "https://scary.land/images/finals/minor/moj.svg", name: "Moj" },
  {
    src: "https://scary.land/images/finals/minor/glamora%20art%20deco.svg",
    name: "Glamora Art Deco",
  },
  { src: "https://scary.land/images/finals/minor/vein.svg", name: "VEIN" },
  {
    src: "https://scary.land/images/finals/minor/magma%20hot%20drink%20bar.svg",
    name: "Magma Hot Drinks Bar",
  },
  {
    src: "https://scary.land/images/finals/minor/petronelle%20plaza.svg",
    name: "Petronelle Plaza",
  },
  {
    src: "https://scary.land/images/finals/minor/dragon%20constellation%20studio.svg",
    name: "Dragon Constellation Studios",
  },
  {
    src: "https://scary.land/images/finals/minor/rutile%20rolls.svg",
    name: "Rutile Rolls",
  },
  {
    src: "https://scary.land/images/finals/minor/Tristan.svg",
    name: "Tristan",
  },
  {
    src: "https://scary.land/images/finals/minor/steamroller.svg",
    name: "Steamroller",
  },
  { src: "https://scary.land/images/finals/minor/YBS.svg", name: "YBS" },
  { src: "https://scary.land/images/finals/minor/zaraby.svg", name: "Zaraby" },
];

function renderLogos(list, containerId) {
  const container = document.getElementById(containerId);
  list.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("corner_shape_list_item");
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.name + " Logo";
    const dfn = document.createElement("dfn");
    dfn.textContent = item.name;
    li.appendChild(img);
    li.appendChild(dfn);
    container.appendChild(li);
  });
}
renderLogos(sponsors, "sponsors");
renderLogos(majors, "majors");
renderLogos(minors, "minors");
