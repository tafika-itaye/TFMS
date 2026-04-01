
// Core TFMS functionality
document.addEventListener("DOMContentLoaded", function() {
  // Navigation
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section, .dashboard");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);

      // Update active nav
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // Show target section
      sections.forEach(s => s.classList.add("hidden"));
      document.getElementById(targetId).classList.remove("hidden");
    });
  });

  // Mobile nav toggle
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Sidebar functionality
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const sidebarClose = document.getElementById("sidebar-close");

  function openSidebar(content) {
    document.getElementById("sidebar-content").innerHTML = content;
    sidebar.classList.add("active");
    overlay.classList.add("active");
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    navMenu.classList.remove("active");
  }

  sidebarClose.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  // Auto GPS capture on field visit page
  if (document.getElementById("visit-loc")) {
    const visitLoc = document.getElementById("visit-loc");

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lon = position.coords.longitude.toFixed(6);
            visitLoc.textContent = `Lat: ${lat}, Lon: ${lon}`;
            visitLoc.dataset.lat = lat;
            visitLoc.dataset.lon = lon;
            console.log("GPS captured:", lat, lon);
          },
          (error) => {
            visitLoc.textContent = "Location access denied";
            console.error("GPS error:", error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      } else {
        visitLoc.textContent = "Geolocation not supported";
      }
    }

    // Auto-capture on page load (key feature!)
    getLocation();

    // Update every 30s for accuracy
    setInterval(getLocation, 30000);
  }

  // Visit buttons
  document.querySelectorAll(".btn-visit").forEach(btn => {
    btn.addEventListener("click", () => {
      const farmerId = btn.closest("tr").querySelector("td:first-child").textContent;
      const content = `
        <h4>Field Visit: Farmer ${farmerId}</h4>
        <div class="form-group">
          <label>GPS Location</label>
          <div id="visit-loc-sidebar">Getting location...</div>
        </div>
        <div class="form-group">
          <label>Crop Observations</label>
          <textarea placeholder="Describe crop condition, pests, irrigation..."></textarea>
        </div>
        <button class="btn-save-visit-sidebar">Save Visit Data</button>
      `;
      openSidebar(content);
    });
  });

  // Animate stats
  function animateStats() {
    const stats = document.querySelectorAll(".stat-number[data-target]");
    stats.forEach(stat => {
      const target = parseFloat(stat.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = current.toLocaleString();
      }, 16);
    });
  }

  // Trigger stats animation when dashboard visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  });

  if (document.querySelector(".stats-grid")) {
    observer.observe(document.querySelector(".stats-grid"));
  }

  // Range slider
  const rangeInputs = document.querySelectorAll("input[type='range']");
  rangeInputs.forEach(input => {
    const valueSpan = input.nextElementSibling;
    input.addEventListener("input", () => {
      valueSpan.textContent = input.value;
    });
  });

  // Save visit demo
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-save-visit")) {
      alert("✅ Field visit saved with GPS coordinates!");
    }
    if (e.target.classList.contains("btn-save-visit-sidebar")) {
      alert("✅ Visit data saved to farmer record!");
      closeSidebar();
    }
  });
});
