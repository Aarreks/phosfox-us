(() => {
  "use strict";

  document.documentElement.classList.add("js");

  document.documentElement.classList.add("js");

  // 256 visual/action-oriented three-letter chunks.
  const THREE = [
    "act","add","aim","amp","ape","arc","ash","awe","bad","bag","bat","bay",
    "bee","beg","bet","big","bit","bow","box","bud","bug","bus","can","cap",
    "cat","cog","cut","dab","dam","day","dig","dip","dog","dot","dry","dye",
    "ebb","eat","fan","fat","fed","fig","fin","fix","fly","fog","fox","fry",
    "fun","gas","get","gig","gin","gob","goo","gum","gun","gut","ham","hop",
    "hot","hug","hum","ice","ink","jam","jar","jet","jig","jog","joy","key",
    "kid","kit","lab","lap","law","lay","leg","lid","lie","lip","lit","log",
    "lop","low","lug","mad","map","mat","mix","mop","mud","mug","nap","net",
    "nod","nut","oak","oil","orb","owl","pad","pan","paw","peg","pen","pet",
    "pie","pig","pin","pit","pop","pot","pry","pup","rag","ram","rat","ray",
    "red","rid","rim","rip","rod","rot","row","rub","run","rut","sad","sap",
    "saw","sea","sew","shy","sip","ski","sod","son","sow","spa","spy","sun",
    "tap","tar","tea","ten","tie","tin","tip","toe","top","toy","tug","use",
    "van","vex","wag","war","wax","web","wed","wet","wig","win","wow","yak",
    "yam","yew","zap","zen","zip","zoo","abs","ace","age","air","ale","ant",
    "apt","ark","arm","art","ate","axe","ban","bar","bib","bid","bin","bog",
    "boo","bop","bum","buy","cab","car","cob","cod","cop","cow","cub","cue",
    "den","die","dim","doe","dub","dug","ear","eel","egg","elf","elk","end",
    "err","eye","far","fax","fee","few","fib","fit","foe","fur","gab","gap",
    "gem","god","got","guy","gym","had","has","hex","hit","hoe","how","hut",
    "icy","ill","imp","ion","job","jug","kin","lad","led","let","lot","may",
    "met","mob","mom","moo"
  ];

  // 256 visual/action-oriented four-letter chunks, weighted toward vivid verbs,
  // sensory states, and concrete objects.
  const FOUR = [
    "able","acid","aged","airy","aloe","arid","army","atom","aura","avid","baby","bald",
    "bare","bark","barn","base","beam","bear","beef","bend","bent","bike","bird","bite",
    "blue","bold","bolt","bone","boot","bowl","brave","brisk","burn","busy","cage","calm",
    "camp","cane","cape","card","cave","clay","clean","coal","coat","cold","coil","cone",
    "cool","cord","core","corn","cozy","crab","crow","cube","damp","dark","dawn","dead",
    "deep","deer","dense","dirt","dock","door","down","drag","drip","drum","duck","dusk",
    "dust","fang","farm","fern","fire","fish","flag","flax","flea","flow","foam","fork",
    "frog","fuel","full","fury","gear","giant","glow","glue","goal","gold","good","gray",
    "green","grim","grit","grow","gust","hard","hawk","hazy","heat","heavy","helm","herb",
    "high","hive","holy","hook","horn","huge","idle","iron","isle","jade","keen","kind",
    "kite","knob","knot","lake","lamp","land","late","lava","leaf","lean","lime","link",
    "lion","live","load","lone","loud","lush","mild","moon","moss","nest","neon","node",
    "nova","oats","oval","oven","palm","park","path","peak","pear","pelt","pine","pipe",
    "play","plug","pond","pool","pump","ache","balk","bang","beat","bind","blow","boar",
    "book","boom","brag","brew","brim","brow","bush","bake","boil","call","care","cast",
    "chat","chew","chip","chop","clap","clip","clog","coax","cook","cope","copy","cough",
    "crawl","crop","cure","curl","dart","dash","daze","deal","dive","draw","drop","dump",
    "earn","ease","echo","edge","edit","fade","fail","fall","feed","feel","fetch","fill",
    "film","flap","flee","flick","flip","float","flood","fold","fool","form","free","fret",
    "gain","gaze","grab","grin","grip","hang","harm","heal","help","hide","hike","hold",
    "honk","hunt","jump","kick","kiss","knit","lift","limp","mend","melt","milk","mold",
    "move","open","pack","peel"
  ];

  const STYLES = [
    (base, d) => `${base}-${d}`,
    (base, d) => `${base}.${d}`,
    (base, d) => `${base}+${d}`,
    (base, d) => `${base}_${d}`,
    (base, d) => `${base}${d[0]}.${d.slice(1)}`,
    (base, d) => `${base}${d.slice(0, 2)}.${d[2]}`,
    (base, d) => `${base}${d[0]}-${d.slice(1)}`,
    (base, d) => `${base}${d.slice(0, 2)}-${d[2]}`,
    (base, d) => `${base}${d[0]}+${d.slice(1)}`,
    (base, d) => `${base}${d.slice(0, 2)}+${d[2]}`
  ];

  function randomUint32() {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0];
  }

  function pick(list) {
    const bound = list.length;
    const max = Math.floor(0x100000000 / bound) * bound;
    let value;
    do {
      value = randomUint32();
    } while (value >= max);
    return list[value % bound];
  }

  function randomInt(bound) {
    const max = Math.floor(0x100000000 / bound) * bound;
    let value;
    do {
      value = randomUint32();
    } while (value >= max);
    return value % bound;
  }

  function digits() {
    return String(randomInt(1000)).padStart(3, "0");
  }

  function generate() {
    const fourPosition = pick([0, 1, 2, 3]);
    const chunks = [];

    for (let i = 0; i < 4; i += 1) {
      chunks.push(i === fourPosition ? pick(FOUR) : pick(THREE));
    }

    chunks[0] = chunks[0][0].toUpperCase() + chunks[0].slice(1);
    const number = digits();
    const style = pick(STYLES);

    return {
      password: style(chunks.join(""), number),
      practice: `${chunks.join(" · ")} · ${number}`
    };
  }

  const output = document.getElementById("generated-password");
  const practice = document.getElementById("practice-line");
  const generateButton = document.getElementById("generate-button");
  const copyButton = document.getElementById("copy-button");

  function refresh() {
    const result = generate();
    output.textContent = result.password;
    practice.textContent = result.practice;
    copyButton.textContent = "Copy";
  }

  async function copyPassword() {
    const value = output.textContent;
    try {
      await navigator.clipboard.writeText(value);
      copyButton.textContent = "Copied";
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      copyButton.textContent = "Copied";
    }
  }


  const themeToggle = document.getElementById("theme-toggle");
  const THEME_KEY = "phosfox-color-theme";

  function applyTheme(theme) {
    const codeforces = theme === "codeforces";
    document.body.classList.toggle("theme-codeforces", codeforces);
    themeToggle.setAttribute("aria-pressed", String(codeforces));
    themeToggle.setAttribute("aria-label", codeforces ? "Switch to dark theme" : "Switch to light theme");

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", codeforces ? "#f1eee6" : "#080907");
    }

    window.dispatchEvent(new CustomEvent("phosfox-theme-change"));
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "light" ? "codeforces" : "corporate");

  themeToggle.addEventListener("click", () => {
    const next = document.body.classList.contains("theme-codeforces")
      ? "corporate"
      : "codeforces";
    localStorage.setItem(THEME_KEY, next === "codeforces" ? "light" : "dark");
    applyTheme(next);
  });


  // Presentation layer. The canvas and click effects are decorative; the page
  // remains fully usable when animation is unavailable or disabled.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const progressBar = document.querySelector(".scroll-progress span");
  const siteHeader = document.querySelector("[data-site-header]");
  const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
  const trackedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const revealTargets = [
    document.querySelector(".hero-copy"),
    document.querySelector(".signal-card"),
    ...document.querySelectorAll(".section-heading, .project, .resume-card, .password-lab")
  ].filter(Boolean);

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-item");
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6%" });

    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  let scrollTicking = false;

  function updateScrollUI() {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 18);
    }

    const marker = window.scrollY + window.innerHeight * 0.34;
    let current = trackedSections[0];
    trackedSections.forEach((section) => {
      if (section.offsetTop <= marker) current = section;
    });

    navLinks.forEach((link) => {
      const active = current && link.getAttribute("href") === `#${current.id}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    scrollTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollUI);
  }, { passive: true });

  updateScrollUI();

  if (finePointer && !reducedMotion) {
    window.addEventListener("pointermove", (event) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    }, { passive: true });

    document.querySelectorAll(".project, .resume-card, .generator-card").forEach((surface) => {
      surface.addEventListener("pointermove", (event) => {
        const bounds = surface.getBoundingClientRect();
        surface.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
        surface.style.setProperty("--my", `${event.clientY - bounds.top}px`);
      }, { passive: true });
    });
  }

  function addClickBloom(target, event) {
    if (reducedMotion) return;
    const bounds = target.getBoundingClientRect();
    const bloom = document.createElement("span");
    bloom.className = "click-bloom";

    const clientX = Number.isFinite(event.clientX) && event.clientX !== 0
      ? event.clientX
      : bounds.left + bounds.width / 2;
    const clientY = Number.isFinite(event.clientY) && event.clientY !== 0
      ? event.clientY
      : bounds.top + bounds.height / 2;

    bloom.style.left = `${clientX - bounds.left}px`;
    bloom.style.top = `${clientY - bounds.top}px`;
    target.appendChild(bloom);
    bloom.addEventListener("animationend", () => bloom.remove(), { once: true });
  }

  document.querySelectorAll(".button, .project-link, .theme-toggle").forEach((target) => {
    target.addEventListener("click", (event) => addClickBloom(target, event));
  });

  const patternStage = document.getElementById("pattern-stage");
  const patternCanvas = document.getElementById("pattern-canvas");

  if (patternStage && patternCanvas) {
    const context = patternCanvas.getContext("2d", { alpha: true });
    const pointer = { x: 0.56, y: 0.43, targetX: 0.56, targetY: 0.43, inside: false };
    const pulse = { x: 0.5, y: 0.5, born: -10000 };
    let width = 1;
    let height = 1;
    let dpr = 1;
    let visible = true;
    let frame = 0;

    function resizePattern() {
      const bounds = patternStage.getBoundingClientRect();
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      patternCanvas.width = Math.round(width * dpr);
      patternCanvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawPattern(performance.now());
    }

    function themeColors() {
      if (document.body.classList.contains("theme-codeforces")) {
        return {
          warm: [157, 53, 13],
          bright: [255, 249, 239],
          faint: [82, 48, 26]
        };
      }
      return {
        warm: [255, 151, 78],
        bright: [255, 235, 214],
        faint: [137, 65, 25]
      };
    }

    function rgba(rgb, alpha) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
    }

    function drawPattern(now) {
      context.clearRect(0, 0, width, height);
      const colors = themeColors();
      const time = reducedMotion ? 0 : now;

      pointer.x += (pointer.targetX - pointer.x) * 0.07;
      pointer.y += (pointer.targetY - pointer.y) * 0.07;

      const px = pointer.x * width;
      const py = pointer.y * height;
      const pulseAge = now - pulse.born;
      const lineCount = Math.max(22, Math.round(height / 13));
      const step = Math.max(5, width / 90);

      context.lineCap = "round";
      context.lineJoin = "round";

      for (let i = 0; i < lineCount; i += 1) {
        const baseY = ((i + 0.5) / lineCount) * height;
        const accent = i % 5 === 0;
        context.beginPath();

        for (let x = -step; x <= width + step; x += step) {
          const normalizedX = x / width;
          let y = baseY;
          y += Math.sin(normalizedX * Math.PI * 3.1 + i * 0.34 + time * 0.00042) * (4.5 + i * 0.035);
          y += Math.sin(normalizedX * Math.PI * 8.6 - i * 0.17 - time * 0.00025) * 2.2;

          if (pointer.inside || !finePointer) {
            const dx = x - px;
            const dy = baseY - py;
            const distance = Math.hypot(dx, dy);
            const influence = Math.exp(-distance / Math.max(width, height) * 4.2);
            y += Math.sin(distance * 0.045 - time * 0.0035) * influence * 9;
          }

          if (pulseAge >= 0 && pulseAge < 1600) {
            const dx = x - pulse.x * width;
            const dy = baseY - pulse.y * height;
            const distance = Math.hypot(dx, dy);
            const envelope = Math.exp(-distance / 210) * Math.exp(-pulseAge / 850);
            y += Math.sin(distance * 0.072 - pulseAge * 0.018) * envelope * 22;
          }

          if (x === -step) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.strokeStyle = accent
          ? rgba(colors.warm, 0.34)
          : rgba(colors.bright, 0.105 + (i % 3) * 0.018);
        context.lineWidth = accent ? 1.35 : 0.82;
        context.stroke();
      }

      const dotGap = Math.max(24, width / 15);
      context.fillStyle = rgba(colors.warm, 0.22);
      for (let y = dotGap / 2; y < height; y += dotGap) {
        for (let x = dotGap / 2; x < width; x += dotGap) {
          const wobble = Math.sin(x * 0.03 + y * 0.02 + time * 0.0005) * 1.8;
          context.beginPath();
          context.arc(x + wobble, y - wobble, 0.8, 0, Math.PI * 2);
          context.fill();
        }
      }
    }

    function animatePattern(now) {
      if (visible) drawPattern(now);
      frame = window.requestAnimationFrame(animatePattern);
    }

    function updateStagePointer(event) {
      const bounds = patternStage.getBoundingClientRect();
      pointer.targetX = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
      pointer.targetY = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1);
      pointer.inside = true;

      const dx = (pointer.targetX - 0.5) * 12;
      const dy = (pointer.targetY - 0.5) * 12;
      patternStage.style.setProperty("--stage-x", `${pointer.targetX * 100}%`);
      patternStage.style.setProperty("--stage-y", `${pointer.targetY * 100}%`);
      patternStage.style.setProperty("--die-x", `${dx}px`);
      patternStage.style.setProperty("--die-y", `${dy}px`);
      patternStage.style.setProperty("--die-rotate", `${-7 + dx * 0.45}deg`);
    }

    function strikePattern(event) {
      const bounds = patternStage.getBoundingClientRect();
      const clientX = Number.isFinite(event.clientX) && event.clientX !== 0
        ? event.clientX
        : bounds.left + bounds.width / 2;
      const clientY = Number.isFinite(event.clientY) && event.clientY !== 0
        ? event.clientY
        : bounds.top + bounds.height / 2;

      pulse.x = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
      pulse.y = Math.min(Math.max((clientY - bounds.top) / bounds.height, 0), 1);
      pulse.born = performance.now();
      patternStage.style.setProperty("--stage-x", `${pulse.x * 100}%`);
      patternStage.style.setProperty("--stage-y", `${pulse.y * 100}%`);
      patternStage.classList.remove("is-struck");
      void patternStage.offsetWidth;
      patternStage.classList.add("is-struck");
      window.setTimeout(() => patternStage.classList.remove("is-struck"), 820);
    }

    patternStage.addEventListener("pointermove", updateStagePointer, { passive: true });
    patternStage.addEventListener("pointerleave", () => {
      pointer.targetX = 0.56;
      pointer.targetY = 0.43;
      pointer.inside = false;
      patternStage.style.setProperty("--stage-x", "56%");
      patternStage.style.setProperty("--stage-y", "43%");
      patternStage.style.setProperty("--die-x", "0px");
      patternStage.style.setProperty("--die-y", "0px");
      patternStage.style.setProperty("--die-rotate", "-7deg");
    });
    patternStage.addEventListener("click", strikePattern);

    if ("ResizeObserver" in window) {
      new ResizeObserver(resizePattern).observe(patternStage);
    } else {
      window.addEventListener("resize", resizePattern);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      }, { threshold: 0 }).observe(patternStage);
    }

    window.addEventListener("phosfox-theme-change", () => drawPattern(performance.now()));

    resizePattern();
    if (reducedMotion) {
      drawPattern(0);
    } else {
      frame = window.requestAnimationFrame(animatePattern);
      window.addEventListener("pagehide", () => window.cancelAnimationFrame(frame), { once: true });
    }
  }

  document.querySelectorAll("details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (details.open) {
        details.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
      }
    });
  });


  generateButton.addEventListener("click", refresh);
  copyButton.addEventListener("click", copyPassword);
  refresh();
})();
