/* global gsap, ScrollTrigger */

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function prepareDraw(target) {
  const els = typeof target === "string" ? document.querySelectorAll(target) : target;
  els.forEach((el) => {
    const length = el.getTotalLength ? el.getTotalLength() : 0;
    if (!length) return;
    el.style.strokeDasharray = String(length);
    el.style.strokeDashoffset = String(length);
  });
}

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  prepareDraw(".hero-path");

  tl.from(".hero__nav", { y: -16, opacity: 0, duration: 0.5 })
    .from(".brand--hero", { y: 28, opacity: 0, duration: 0.7 }, "-=0.2")
    .from(".hero h1, .hero__lede, .hero__actions", {
      y: 20,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
    }, "-=0.35")
    .from(".hero__visual", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4");

  if (reduceMotion) {
    gsap.set(".hero-path", { strokeDashoffset: 0 });
    return;
  }

  tl.to(".hero-path", { strokeDashoffset: 0, duration: 1.1, stagger: 0.15 }, "-=0.3")
    .from(".hero-node", {
      scale: 0,
      opacity: 0,
      duration: 0.35,
      stagger: 0.08,
      ease: "back.out(1.6)",
    }, "-=0.7")
    .from(".hero-label", { opacity: 0, y: 8, duration: 0.35, stagger: 0.1 }, "-=0.3");

  gsap.to(".hero-node--branch", {
    y: -4,
    duration: 1.6,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    stagger: 0.2,
  });
}


const popIn = { scale: 1, duration: 0.35, ease: "back.out(2)" };

function setCaption(el, text) {
  if (el.textContent === text) return;
  el.textContent = text;
  if (!reduceMotion) {
    gsap.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, overwrite: true });
  }
}

// Each stage is a looping timeline; `say` narrates the current step in the caption bar.
function storyline(section) {
  const caption = section.querySelector(".stage__caption");
  const tl = gsap.timeline({
    paused: true,
    repeat: reduceMotion ? 0 : -1,
    repeatDelay: 2.5,
    defaults: { ease: "power2.out", duration: 0.5 },
  });
  tl.say = (text, position) => tl.call(() => setCaption(caption, text), null, position);
  return tl;
}

function animRepository(tl, q) {
  const snaps = q(".repo-snap");
  const dots = q(".repo-dot");

  gsap.set(q(".repo-folder"), { opacity: 0, y: 30 });
  gsap.set(q(".repo-file"), { opacity: 0, y: -24 });
  gsap.set(q(".repo-name, .repo-mirror"), { opacity: 0 });
  gsap.set(q(".repo-git"), { opacity: 0, scaleX: 0.85 });
  gsap.set(snaps, { opacity: 0 });
  gsap.set(q(".repo-dot, .repo-remote-dot"), { scale: 0 });
  gsap.set(q(".repo-remote"), { opacity: 0, x: 40 });

  tl.say("A repository is a project folder that Git tracks", 0.01)
    .to(q(".repo-folder"), { opacity: 1, y: 0, duration: 0.6 })
    .say("Your working files live inside it", "+=0.4")
    .to(q(".repo-file"), { opacity: 1, y: 0, stagger: 0.12, ease: "back.out(1.6)" })
    .to(q(".repo-name"), { opacity: 1, stagger: 0.08, duration: 0.3 }, "-=0.2")
    .say("Git stores every snapshot in a hidden .git folder", "+=0.7")
    .to(q(".repo-git"), { opacity: 1, scaleX: 1 });

  snaps.forEach((snap, i) => {
    const dx = 520 + i * 40 - 14 - Number(snap.getAttribute("x"));
    tl.to(snap, { opacity: 1, duration: 0.15 })
      .to(snap, { x: dx, y: 139, scale: 0.55, duration: 0.6, ease: "power2.in" })
      .to(snap, { opacity: 0, duration: 0.12 })
      .to(dots[i], { ...popIn, ease: "back.out(2.4)" }, "<");
  });

  tl.say("…and mirrors it to a host like GitHub", "+=0.6")
    .to(q(".repo-remote"), { opacity: 1, x: 0, duration: 0.6 })
    .to(q(".repo-mirror"), { opacity: 1, duration: 0.4 }, "-=0.2")
    .to(q(".repo-sync"), { strokeDashoffset: -88, duration: 2.4, ease: "none" }, "<")
    .to(q(".repo-remote-dot"), { ...popIn, stagger: 0.25 }, "<0.3");
}

function animClone(tl, q) {
  const packets = q(".clone-packet");
  const localNodes = q(".clone-l-node");

  prepareDraw(q(".clone-arrow, .clone-l-line"));
  gsap.set(q(".clone-remote"), { opacity: 0, x: -40 });
  gsap.set(q(".clone-r-node, .clone-l-node"), { scale: 0 });
  gsap.set(q(".clone-cmd, .clone-head, .clone-origin"), { opacity: 0 });
  gsap.set(q(".clone-local"), { opacity: 0.45 });
  gsap.set(packets, { opacity: 0 });

  tl.say("The repository lives on GitHub", 0.01)
    .to(q(".clone-remote"), { opacity: 1, x: 0, duration: 0.6 })
    .to(q(".clone-r-node"), { ...popIn, stagger: 0.1 }, "-=0.2")
    .say("git clone copies the whole history down", "+=0.6")
    .to(q(".clone-cmd"), { opacity: 1, duration: 0.3 })
    .to(q(".clone-arrow"), { strokeDashoffset: 0 }, "<")
    .to(q(".clone-head"), { opacity: 1, duration: 0.2 })
    .to(q(".clone-local"), { opacity: 1, duration: 0.4 }, "<")
    .to(q(".clone-l-line"), { strokeDashoffset: 0, duration: 3, ease: "none" }, "<");

  packets.forEach((packet, i) => {
    tl.to(packet, { opacity: 1, duration: 0.1 }, i === 0 ? "<" : "-=0.35")
      .to(packet, { x: 270, duration: 0.6, ease: "power1.inOut" })
      .to(packet, { opacity: 0, duration: 0.1 })
      .to(localNodes[i], popIn, "<");
  });

  tl.say("Your laptop now has every commit, too", "+=0.3")
    .set(q(".clone-local"), { attr: { "stroke-dasharray": "0" } })
    .say("…plus a remote named origin pointing back", "+=1.2")
    .to(q(".clone-origin"), { opacity: 1, duration: 0.4 });
}

function animBranch(tl, q) {
  const head = q(".br-head")[0];
  const feats = q(".br-node-f");

  prepareDraw(q(".br-main, .br-side"));
  gsap.set(q(".br-node-a, .br-node-b, .br-node-f"), { scale: 0 });
  gsap.set(q(".br-label-main, .br-label-side"), { opacity: 0 });
  gsap.set(head, { x: 440, y: 294, opacity: 0 });

  tl.say("main holds the project’s shared history", 0.01)
    .to(q(".br-main"), { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" })
    .to(q(".br-node-a"), { ...popIn, stagger: 0.18 }, "<0.1")
    .to(q(".br-label-main"), { opacity: 1, duration: 0.3 }, "-=0.3")
    .to(head, { opacity: 1, duration: 0.3 })
    .say("Create a branch to start a parallel line of work", "+=0.7")
    .to(q(".br-side"), { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" })
    .to(q(".br-label-side"), { opacity: 1, duration: 0.3 }, "-=0.3")
    .to(head, { x: 660, y: 134, duration: 0.6, ease: "power2.inOut" }, "-=0.5")
    .to(feats[0], popIn, "-=0.2")
    .say("Commits on feature/login leave main untouched", "+=0.5");

  [1, 2].forEach((i) => {
    tl.to(head, { x: 660 + i * 140, duration: 0.5, ease: "power2.inOut" }, "+=0.4")
      .to(feats[i], popIn, "-=0.15");
  });

  tl.say("Meanwhile, main can keep moving on its own", "+=0.7")
    .to(q(".br-node-b"), { ...popIn, stagger: 0.3 });
}

function animCommit(tl, q) {
  const files = q(".cm-file");
  const mods = q(".cm-mod");

  gsap.set(files, { opacity: 0, x: -24 });
  gsap.set(mods, { scale: 0 });
  gsap.set(q(".cm-cmd-add, .cm-cmd-commit"), { opacity: 0 });
  gsap.set(q(".cm-new"), { opacity: 0, scale: 0.6 });

  tl.say("Edit files in your working directory", 0.01)
    .to(files, { opacity: 1, x: 0, stagger: 0.12 })
    .to(mods, { ...popIn, stagger: 0.12, ease: "back.out(2.5)" }, "-=0.2")
    .say("git add stages only the changes that belong together", "+=0.7")
    .to(q(".cm-cmd-add"), { opacity: 1, duration: 0.3 })
    .to([files[0], files[1]], { x: 390, stagger: 0.18, duration: 0.7, ease: "power2.inOut" })
    .to(q(".cm-stage"), { attr: { stroke: "#3aa6a0" }, duration: 0.3 }, "-=0.3")
    .say("git commit saves them as one snapshot with a message", "+=0.8")
    .to(q(".cm-cmd-add"), { opacity: 0, duration: 0.2 })
    .to(q(".cm-cmd-commit"), { opacity: 1, duration: 0.3 })
    .to(files[0], { x: 690, y: 21, scale: 0.1, opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.3")
    .to(files[1], { x: 690, y: -69, scale: 0.1, opacity: 0, duration: 0.6, ease: "power2.in" }, "<0.1")
    .to(q(".cm-new"), { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, "-=0.1")
    .to(q(".cm-stage"), { attr: { stroke: "#9bb8b3" }, duration: 0.3 }, "<")
    .say("Unstaged changes wait for a later commit", "+=0.9")
    .to(mods[2], { scale: 1.7, yoyo: true, repeat: 3, duration: 0.3, ease: "sine.inOut" });
}

function animPushPull(tl, q) {
  const pushPackets = q(".pp-push-pkt");
  const pushed = q(".pp-r-pushed");

  prepareDraw(q(".pp-push, .pp-pull"));
  gsap.set(q(".pp-l-new, .pp-l-pulled, .pp-r-pushed, .pp-r-mate"), { scale: 0 });
  gsap.set(q(".pp-push-head, .pp-pull-head, .pp-mate-label, .pp-push-pkt, .pp-pull-pkt"), { opacity: 0 });
  gsap.set(q(".pp-push-label, .pp-pull-label"), { opacity: 0.2 });

  tl.say("You made two new commits locally", 0.01)
    .to(q(".pp-l-new"), { ...popIn, stagger: 0.25 }, 0.3)
    .say("git push uploads them to origin", "+=0.7")
    .to(q(".pp-push-label"), { opacity: 1, duration: 0.3 })
    .to(q(".pp-push"), { strokeDashoffset: 0 }, "<")
    .to(q(".pp-push-head"), { opacity: 1, duration: 0.15 });

  pushPackets.forEach((packet, i) => {
    tl.to(packet, { opacity: 1, duration: 0.1 }, i === 0 ? "+=0.1" : "-=0.3")
      .to(packet, { x: 236, duration: 0.6, ease: "power1.inOut" })
      .to(packet, { opacity: 0, duration: 0.1 })
      .to(pushed[i], popIn, "<");
  });

  tl.to(q(".pp-push-label"), { opacity: 0.2, duration: 0.3 }, "+=0.5")
    .say("A teammate pushes a commit of their own", "+=0.2")
    .to(q(".pp-r-mate"), popIn)
    .to(q(".pp-mate-label"), { opacity: 1, duration: 0.3 }, "<")
    .say("git pull brings their work down to you", "+=0.9")
    .to(q(".pp-pull-label"), { opacity: 1, duration: 0.3 })
    .to(q(".pp-pull"), { strokeDashoffset: 0 }, "<")
    .to(q(".pp-pull-head"), { opacity: 1, duration: 0.15 })
    .to(q(".pp-pull-pkt"), { opacity: 1, duration: 0.1 })
    .to(q(".pp-pull-pkt"), { x: -236, duration: 0.6, ease: "power1.inOut" })
    .to(q(".pp-pull-pkt"), { opacity: 0, duration: 0.1 })
    .to(q(".pp-l-pulled"), popIn, "<");
}

function animDiff(tl, q) {
  const dels = q(".df-del");
  const adds = q(".df-add");
  const delSigns = q(".df-sign-del");
  const addSigns = q(".df-sign-add");
  const scan = q(".df-scan");

  gsap.set(q(".df-pane"), { opacity: 0, y: 24 });
  gsap.set(q(".df-code"), { opacity: 0 });
  gsap.set([...dels, ...adds], { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set([...delSigns, ...addSigns], { opacity: 0 });
  gsap.set(scan, { opacity: 0, y: 0 });
  gsap.set(q(".df-sum"), { opacity: 0, y: 12 });

  tl.say("Take two versions of the same file", 0.01)
    .to(q(".df-pane"), { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 })
    .to(q(".df-code"), { opacity: 1, stagger: 0.06, duration: 0.3 }, "-=0.2")
    .say("Git compares them line by line", "+=0.6")
    .to(scan, { opacity: 0.16, duration: 0.3 });

  [0, 1, 2, 3].forEach((i) => {
    if (i > 0) tl.to(scan, { y: 46 * i, duration: 0.35, ease: "power2.inOut" }, "+=0.3");
    if (i === 0) tl.say("Red lines were removed, green lines were added", "+=0.2");
    if (i < 2) {
      tl.to([dels[i], adds[i]], { scaleX: 1, duration: 0.45 }, "+=0.1")
        .to([delSigns[i], addSigns[i]], { opacity: 1, duration: 0.2 }, "<0.2");
    }
  });

  tl.to(scan, { opacity: 0, duration: 0.3 }, "+=0.4")
    .say("+2 −2: the whole change at a glance")
    .to(q(".df-sum"), { opacity: 1, y: 0, ease: "back.out(1.6)" });
}

function animMerge(tl, q) {
  const mainNodes = q(".mg-node-m");
  const featNodes = q(".mg-node-f");

  prepareDraw(q(".mg-main-a, .mg-main-b, .mg-feat-out, .mg-feat-in"));
  gsap.set(q(".mg-node-a, .mg-node-m, .mg-node-f, .mg-join, .mg-node-after"), { scale: 0 });
  gsap.set(q(".mg-ring, .mg-anc-label, .mg-feat-label, .mg-join-label"), { opacity: 0 });

  tl.say("Two branches share a common ancestor", 0.01)
    .to(q(".mg-main-a"), { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" })
    .to(q(".mg-node-a"), { ...popIn, stagger: 0.2 }, "<0.1")
    .to(q(".mg-anc-label"), { opacity: 1, duration: 0.3 }, "-=0.3")
    .to(q(".mg-feat-out"), { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" }, "-=0.4")
    .to(q(".mg-feat-label"), { opacity: 1, duration: 0.3 }, "-=0.3")
    .say("Both lines gain their own commits", "+=0.5");

  [0, 1].forEach((i) => {
    tl.to(featNodes[i], popIn, "+=0.2").to(mainNodes[i], popIn, "+=0.15");
  });

  tl.say("git merge joins them with a merge commit", "+=0.7")
    .to(q(".mg-feat-in"), { strokeDashoffset: 0, duration: 0.8, ease: "power2.in" })
    .to(q(".mg-join"), { ...popIn, duration: 0.45, ease: "back.out(2.2)" })
    .fromTo(
      q(".mg-ring"),
      { opacity: 0.9, attr: { r: 20 } },
      { opacity: 0, attr: { r: 56 }, duration: 0.9, immediateRender: false },
      "<"
    )
    .to(q(".mg-join-label"), { opacity: 1, duration: 0.3 }, "<0.2")
    .say("Both histories are preserved, and main moves on", "+=0.7")
    .to(q(".mg-main-b"), { strokeDashoffset: 0, duration: 0.7 })
    .to(q(".mg-node-after"), popIn, "-=0.2");
}

function animRebase(tl, q) {
  const copies = q(".rb-copy");

  prepareDraw(q(".rb-new-link"));
  gsap.set(q(".rb-n, .rb-c"), { scale: 0 });
  gsap.set(q(".rb-old"), { opacity: 0, y: -20 });
  gsap.set(copies, { opacity: 0, x: -160 });
  gsap.set(q(".rb-feat-label, .rb-main-label"), { opacity: 0 });

  tl.say("feature started from commit B", 0.01)
    .to(q(".rb-n"), { ...popIn, stagger: 0.2, duration: 0.4 })
    .to(q(".rb-old"), { opacity: 1, y: 0 })
    .to(q(".rb-feat-label"), { opacity: 1, duration: 0.3 }, "-=0.2")
    .say("Meanwhile, main moved ahead to C", "+=0.9")
    .to(q(".rb-c"), { ...popIn, duration: 0.45 })
    .to(q(".rb-main-label"), { opacity: 1, duration: 0.3 }, "<0.1")
    .say("git rebase main replays X and Y on top of C", "+=1")
    .to(q(".rb-old"), { opacity: 0.22, duration: 0.4 })
    .to(copies, { opacity: 1, duration: 0.2, stagger: 0.12 }, "<")
    .to(copies, { x: 0, duration: 0.9, stagger: 0.15, ease: "power2.inOut" })
    .to(q(".rb-new-link"), { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, "<")
    .to(q(".rb-feat-label"), { x: 160, duration: 0.9, ease: "power2.inOut" }, "<")
    .say("New commits X′ and Y′ make a straight, linear history", "+=0.5")
    .to(q(".rb-old, .rb-main-label"), { opacity: 0 });
}

function animConflict(tl, q) {
  const lines = q(".cf-line");

  gsap.set(q(".cf-yours"), { opacity: 0, x: -60 });
  gsap.set(q(".cf-theirs"), { opacity: 0, x: 60 });
  gsap.set(q(".cf-spark"), { scale: 0, opacity: 0, rotation: 0 });
  gsap.set(q(".cf-file"), { opacity: 0, y: 24 });
  gsap.set(q(".cf-flag, .cf-line, .cf-resolved, .cf-check-label"), { opacity: 0 });
  gsap.set(q(".cf-check"), { scale: 0 });

  tl.say("You and a teammate changed the same line", 0.01)
    .to(q(".cf-yours"), { opacity: 1, x: 0, duration: 0.6 })
    .to(q(".cf-theirs"), { opacity: 1, x: 0, duration: 0.6 }, "<0.15")
    .say("Git can’t pick a winner on its own", "+=0.9")
    .to(q(".cf-yours"), { x: 50, duration: 0.3, ease: "power2.in" })
    .to(q(".cf-theirs"), { x: -50, duration: 0.3, ease: "power2.in" }, "<")
    .to(q(".cf-spark"), { scale: 1, opacity: 1, rotation: 45, duration: 0.35, ease: "back.out(3)" })
    .to(q(".cf-flag"), { opacity: 1, duration: 0.2 }, "<")
    .to(q(".cf-yours, .cf-theirs"), { x: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }, "<")
    .say("It writes both versions into the file between markers", "+=0.5")
    .to(q(".cf-file"), { opacity: 1, y: 0 })
    .to(lines, { opacity: 1, stagger: 0.14, duration: 0.25 })
    .say("You choose the final result, then commit it", "+=1.3")
    .to([lines[0], lines[2], lines[3], lines[4]], { opacity: 0.15, duration: 0.3 })
    .to(lines, { opacity: 0, duration: 0.3 }, "+=0.7")
    .to(q(".cf-resolved"), { opacity: 1, duration: 0.4 })
    .to(q(".cf-box"), { attr: { stroke: "#3aa6a0" }, duration: 0.3 }, "<")
    .to(q(".cf-check"), { ...popIn, duration: 0.4, ease: "back.out(2.4)" }, "<0.1")
    .to(q(".cf-check-label"), { opacity: 1, duration: 0.3 }, "<0.1")
    .to(q(".cf-spark, .cf-flag"), { opacity: 0, duration: 0.4 }, "<");
}

function animPr(tl, q) {
  const dots = q(".pr-dot");
  const marks = q(".pr-mark");

  prepareDraw(q(".pr-main, .pr-feat-out, .pr-feat-in"));
  prepareDraw(marks);
  gsap.set(q(".pr-node-m, .pr-node-f, .pr-join"), { scale: 0 });
  gsap.set(q(".pr-graph-label, .pr-btn-done"), { opacity: 0 });
  gsap.set(q(".pr-card"), { opacity: 0, y: 30 });

  tl.say("Open a pull request to propose merging your branch", 0.01)
    .to(q(".pr-main"), { strokeDashoffset: 0, duration: 0.8 })
    .to(q(".pr-node-m"), popIn, "-=0.5")
    .to(q(".pr-feat-out"), { strokeDashoffset: 0, duration: 0.7 })
    .to(q(".pr-node-f"), { ...popIn, stagger: 0.2 }, "-=0.4")
    .to(q(".pr-graph-label"), { opacity: 1, duration: 0.3 }, "<")
    .to(q(".pr-card"), { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
    .say("Automated checks run against the branch", "+=0.7");

  dots.forEach((dot, i) => {
    if (i === 2) tl.say("A teammate reviews and approves", "+=0.5");
    tl.to(dot, { attr: { fill: "#3aa6a0" }, duration: 0.25 }, i === 2 ? "+=0.4" : "+=0.5")
      .to(marks[i], { strokeDashoffset: 0, duration: 0.3 }, "<0.1");
  });

  tl.say("Merge — feature/login joins main", "+=0.7")
    .to(q(".pr-btn"), { attr: { fill: "#1f6f6a" }, duration: 0.3 })
    .to(q(".pr-btn"), { scale: 0.95, yoyo: true, repeat: 1, duration: 0.12 }, "+=0.4")
    .to(q(".pr-btn-text"), { opacity: 0, duration: 0.2 })
    .to(q(".pr-btn-done"), { opacity: 1, duration: 0.25 })
    .to(q(".pr-feat-in"), { strokeDashoffset: 0, duration: 0.6, ease: "power2.in" }, "<")
    .to(q(".pr-join"), { ...popIn, duration: 0.4, ease: "back.out(2.2)" });
}

function animIssue(tl, q) {
  gsap.set(q(".is-card"), { opacity: 0, y: -24, x: 0 });
  gsap.set(q(".is-branch, .is-pr"), { opacity: 0, scale: 0.8 });

  tl.say("An issue describes a bug, feature, or task", 0.01)
    .to(q(".is-card"), { opacity: 1, y: 0, ease: "back.out(1.6)" })
    .say("Someone picks it up and starts a branch", "+=1")
    .to(q(".is-card"), { x: 370, duration: 0.8, ease: "power2.inOut" })
    .to(q(".is-other"), { y: -110, duration: 0.6, ease: "power2.inOut" }, "<0.2")
    .to(q(".is-branch"), { opacity: 1, ...popIn })
    .say("A pull request links back to the issue", "+=0.9")
    .to(q(".is-pr"), { opacity: 1, ...popIn })
    .say("Merging the PR closes the issue automatically", "+=1")
    .to(q(".is-card"), { x: 740, duration: 0.8, ease: "power2.inOut" })
    .to(q(".is-dot"), { attr: { fill: "#3aa6a0" }, duration: 0.3 })
    .to(q(".is-ticket"), { attr: { stroke: "#3aa6a0" }, duration: 0.3 }, "<");
}

const animators = {
  repository: animRepository,
  clone: animClone,
  branch: animBranch,
  commit: animCommit,
  "push-pull": animPushPull,
  diff: animDiff,
  merge: animMerge,
  rebase: animRebase,
  conflict: animConflict,
  pr: animPr,
  issue: animIssue,
};

function setupStage(section, build) {
  const stage = section.querySelector(".concept__stage");
  const q = gsap.utils.selector(section);

  gsap.set(stage.querySelectorAll(".viz g, .viz circle, .viz rect, .viz polygon, .viz path, .viz text"), {
    transformOrigin: "50% 50%",
  });

  const tl = storyline(section);
  build(tl, q);

  if (reduceMotion) {
    tl.progress(1);
  } else {
    // Loop while the stage is on screen; pause when it scrolls away.
    ScrollTrigger.create({
      trigger: stage,
      start: "top 80%",
      end: "bottom 20%",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
  }

  section.querySelector(".stage__replay").addEventListener("click", () => tl.restart());
}

function init() {
  heroIntro();

  document.querySelectorAll(".concept[data-anim]").forEach((section) => {
    gsap.from(section.querySelectorAll(".concept__head > *, .concept__notes"), {
      scrollTrigger: { trigger: section, start: "top 80%" },
      y: 22,
      opacity: 0,
      stagger: 0.1,
      duration: reduceMotion ? 0.01 : 0.6,
      ease: "power2.out",
    });

    const build = animators[section.dataset.anim];
    if (build) setupStage(section, build);
  });
}

init();
