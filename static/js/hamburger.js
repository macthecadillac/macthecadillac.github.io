document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.querySelector(".nav-links");

  // Transparent navbar on home page in dark mode; glass effect when scrolled/menu/search active
  const siteNav = document.getElementById("site-nav");
  const searchContainer = document.getElementById("search-container");
  const isHomePage = document.body.getAttribute("data-page") === "home";
  const hasBanner = !!document.getElementById("banner-container");
  let menuOpen = false;

  const isDarkMode = () => {
    const explicit = document.documentElement.getAttribute("data-theme");
    if (explicit === "dark") return true;
    if (explicit === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const updateNavTransparency = () => {
    const dark = isDarkMode();
    const transparentNav = (dark && isHomePage) || !hasBanner;
    if (!transparentNav) return;
    const searchOpen =
      searchContainer && searchContainer.classList.contains("active");
    if (window.scrollY > 0 || menuOpen || searchOpen) {
      siteNav.classList.add("scrolled");
    } else {
      siteNav.classList.remove("scrolled");
    }
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("is-active");
      navLinks.classList.toggle("is-active");

      const expanded = hamburger.classList.contains("is-active");
      hamburger.setAttribute("aria-expanded", expanded);

      menuOpen = expanded;
      updateNavTransparency();
    });
  }

  if (siteNav) {
    window.addEventListener("scroll", updateNavTransparency, { passive: true });

    // React to theme changes (data-theme attribute on <html>)
    new MutationObserver(updateNavTransparency).observe(
      document.documentElement,
      { attributes: true, attributeFilter: ["data-theme"] },
    );

    // React to system color scheme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", updateNavTransparency);

    if (searchContainer) {
      new MutationObserver(updateNavTransparency).observe(searchContainer, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
  }
});
