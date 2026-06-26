(() => {
  "use strict";

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


  generateButton.addEventListener("click", refresh);
  copyButton.addEventListener("click", copyPassword);
  refresh();
})();
