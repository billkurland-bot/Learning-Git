/* global gsap, ScrollTrigger */

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function prepareDraw(selector, scope) {
  const root = scope || document;
  root.querySelectorAll(selector).forEach((el) => {
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

function animRepository(section) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" },
    defaults: { ease: "power2.out" },
  });

  tl.from(".repo-folder, .repo-tab", { y: 30, opacity: 0, duration: 0.5 })
    .from(".repo-dotgit", { scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.15")
    .from(".repo-dotgit-label, .repo-caption", { opacity: 0, y: 8, duration: 0.35 }, "-=0.1");

  if (!reduceMotion) {
    gsap.to(".repo-dotgit", {
      scale: 1.04,
      transformOrigin: "50% 50%",
      repeat: -1,
      yoyo: true,
      duration: 1.4,
      delay: 0.8,
      ease: "sine.inOut",
    });
  }
}

function animClone(section) {
  gsap.set(section.querySelector(".clone-packet"), { opacity: 0, x: 0 });
  gsap.set(section.querySelector(".clone-local"), {
    opacity: 0.35,
    scale: 0.92,
    transformOrigin: "50% 50%",
  });
  gsap.set(section.querySelectorAll(".clone-arrow, .clone-arrowhead"), { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    repeat: reduceMotion ? 0 : -1,
    repeatDelay: 1.1,
  });

  tl.from(section.querySelector(".clone-remote"), { x: -20, opacity: 0, duration: 0.4 })
    .to(section.querySelector(".clone-packet"), { opacity: 1, duration: 0.2 })
    .to(section.querySelectorAll(".clone-arrow, .clone-arrowhead"), { opacity: 1, duration: 0.2 }, "<")
    .from(section.querySelector(".clone-arrow"), {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.5,
    }, "<")
    .to(section.querySelector(".clone-packet"), { x: 70, duration: 0.8, ease: "power1.inOut" })
    .to(section.querySelector(".clone-local"), {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: "back.out(1.4)",
    }, "-=0.25")
    .to(section.querySelector(".clone-packet"), { opacity: 0, duration: 0.25 })
    .to(section.querySelector(".clone-local"), {
      opacity: 0.35,
      scale: 0.92,
      duration: 0.35,
    }, "+=0.6")
    .set(section.querySelector(".clone-packet"), { x: 0 })
    .set(section.querySelectorAll(".clone-arrow, .clone-arrowhead"), { opacity: 0 });
}

function animBranch(section) {
  prepareDraw(".branch-side", section);
  prepareDraw(".branch-main", section);

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" },
  });

  tl.to(".branch-main", { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" })
    .from(".branch-node:not(.branch-node--side)", {
      scale: 0,
      transformOrigin: "50% 50%",
      duration: 0.3,
      stagger: 0.1,
      ease: "back.out(1.7)",
    }, "-=0.35")
    .to(".branch-side", { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" })
    .from(".branch-node--side", {
      scale: 0,
      transformOrigin: "50% 50%",
      duration: 0.35,
      stagger: 0.12,
      ease: "back.out(1.7)",
    }, "-=0.45")
    .from(".branch-label", { opacity: 0, y: -8, duration: 0.3 }, "-=0.2");
}

function animCommit(section) {
  const items = section.querySelectorAll(".commit-item");
  gsap.set(items, { opacity: 0, y: 16 });
  gsap.set(".commit-line", { scaleX: 0, transformOrigin: "left center" });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" },
  });

  tl.to(".commit-line", { scaleX: 1, duration: 0.6, ease: "power2.out" });

  items.forEach((item, i) => {
    tl.to(item, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }, i === 0 ? "-=0.2" : "-=0.15");
  });

  if (!reduceMotion) {
    gsap.to(items[items.length - 1].querySelector("circle"), {
      scale: 1.15,
      transformOrigin: "50% 50%",
      yoyo: true,
      repeat: -1,
      duration: 0.9,
      ease: "sine.inOut",
      delay: 1.2,
    });
  }
}

function animPushPull(section) {
  gsap.set(".pp-push, .pp-pull", { scaleX: 0 });
  gsap.set(".pp-push", { transformOrigin: "left center" });
  gsap.set(".pp-pull", { transformOrigin: "right center" });
  gsap.set(".pp-push-head, .pp-pull-head", { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    repeat: reduceMotion ? 0 : -1,
    repeatDelay: 0.8,
  });

  tl.to(".pp-push", { scaleX: 1, duration: 0.55, ease: "power2.inOut" })
    .to(".pp-push-head", { opacity: 1, duration: 0.15 }, "-=0.1")
    .to(".pp-pull", { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, "+=0.25")
    .to(".pp-pull-head", { opacity: 1, duration: 0.15 }, "-=0.1")
    .to(".pp-push, .pp-pull, .pp-push-head, .pp-pull-head", {
      opacity: 0.25,
      duration: 0.35,
    }, "+=0.4")
    .set(".pp-push, .pp-pull", { scaleX: 0, opacity: 1 })
    .set(".pp-push-head, .pp-pull-head", { opacity: 0 });
}

function animDiff(section) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" },
  });

  tl.from(section.querySelectorAll(".diff-line"), {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 0.35,
    stagger: 0.06,
    ease: "power2.out",
  })
    .from(".diff-remove", {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.1")
    .from(".diff-add", {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out",
    }, "-=0.15");

  if (!reduceMotion) {
    gsap.to(".diff-add", {
      opacity: 0.65,
      yoyo: true,
      repeat: -1,
      duration: 1.1,
      stagger: 0.15,
      ease: "sine.inOut",
      delay: 1,
    });
  }
}

function animMerge(section) {
  prepareDraw(".merge-main", section);
  prepareDraw(".merge-side", section);

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" },
  });

  gsap.set(".merge-join", { scale: 0, transformOrigin: "50% 50%" });

  tl.to(".merge-main", { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" })
    .to(".merge-side", { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }, "<")
    .from(".merge-node", {
      scale: 0,
      transformOrigin: "50% 50%",
      duration: 0.3,
      stagger: 0.08,
      ease: "back.out(1.6)",
    }, "-=0.6")
    .to(".merge-join", { scale: 1, duration: 0.45, ease: "back.out(1.8)" }, "-=0.2");

  if (!reduceMotion) {
    gsap.to(".merge-join", {
      scale: 1.12,
      transformOrigin: "50% 50%",
      yoyo: true,
      repeat: -1,
      duration: 1.1,
      ease: "sine.inOut",
      delay: 1.5,
    });
  }
}

function animRebase(section) {
  const feats = section.querySelectorAll(".rebase-feat");
  gsap.set(feats, { x: 0, y: 0 });
  gsap.set(".rebase-caption", { opacity: 0 });
  gsap.set(".rebase-main--new", { scale: 0, transformOrigin: "50% 50%" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  tl.from(".rebase-main:not(.rebase-main--new)", {
    scale: 0,
    transformOrigin: "50% 50%",
    stagger: 0.1,
    duration: 0.3,
    ease: "back.out(1.5)",
  })
    .from(".rebase-link", { opacity: 0, duration: 0.3 })
    .from(feats, { scale: 0, transformOrigin: "50% 50%", stagger: 0.12, duration: 0.3, ease: "back.out(1.5)" })
    .to(".rebase-caption", { opacity: 1, duration: 0.3 })
    .to(".rebase-link", { opacity: 0, duration: 0.25 }, "+=0.35")
    .to(feats[0], { x: 40, y: 90, duration: 0.7, ease: "power2.inOut" })
    .to(feats[1], { x: 70, y: 90, duration: 0.7, ease: "power2.inOut" }, "<0.1")
    .to(".rebase-main--new", { scale: 1, duration: 0.35, ease: "back.out(1.6)" }, "-=0.35");
}

function animConflict(section) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" },
  });

  gsap.set(".conflict-result", { scale: 0.85, opacity: 0, transformOrigin: "50% 50%" });
  gsap.set(".conflict-result-label", { opacity: 0 });

  tl.from(".conflict-a", { x: -40, opacity: 0, duration: 0.45, ease: "power2.out" })
    .from(".conflict-b", { x: 40, opacity: 0, duration: 0.45, ease: "power2.out" }, "<")
    .from(".conflict-burst", { opacity: 0, scaleX: 0, transformOrigin: "center", duration: 0.3 })
    .to(".conflict-a, .conflict-b", {
      x: (i) => (i === 0 ? 10 : -10),
      duration: 0.12,
      yoyo: true,
      repeat: 5,
      ease: "power1.inOut",
    })
    .to(".conflict-result", { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.5)" })
    .to(".conflict-result-label", { opacity: 1, duration: 0.3 }, "-=0.2");
}

function animPr(section) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" },
  });

  tl.from(".pr-card", { y: 28, opacity: 0, duration: 0.5, ease: "power2.out" })
    .from(".pr-from", { opacity: 0, y: 8, duration: 0.3 })
    .from(".pr-btn, .pr-btn-label", { scale: 0.85, opacity: 0, duration: 0.35, ease: "back.out(1.6)" });

  if (!reduceMotion) {
    gsap.to(".pr-btn", {
      scale: 1.04,
      transformOrigin: "50% 50%",
      yoyo: true,
      repeat: -1,
      duration: 1.1,
      ease: "sine.inOut",
      delay: 1,
    });
  }
}

function animIssue(section) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" },
  });

  tl.from(".issue-board", { y: 20, opacity: 0, duration: 0.45 })
    .from(".issue-ticket", {
      y: -24,
      opacity: 0,
      duration: 0.45,
      stagger: 0.18,
      ease: "back.out(1.5)",
    });

  if (!reduceMotion) {
    gsap.to(".issue-ticket circle", {
      scale: 1.2,
      transformOrigin: "50% 50%",
      yoyo: true,
      repeat: -1,
      duration: 0.9,
      stagger: 0.2,
      ease: "sine.inOut",
      delay: 1,
    });
  }
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

function init() {
  heroIntro();

  document.querySelectorAll(".concept[data-anim]").forEach((section) => {
    gsap.from(section.querySelector(".concept__copy"), {
      scrollTrigger: { trigger: section, start: "top 78%" },
      y: 22,
      opacity: 0,
      duration: reduceMotion ? 0.01 : 0.5,
      ease: "power2.out",
    });

    const key = section.dataset.anim;
    const fn = animators[key];
    if (fn) fn(section);
  });
}

init();
