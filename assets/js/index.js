let navLinks = document.querySelectorAll(".nav-link");
let sections = document.querySelectorAll(".app-section");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    sections.forEach(function (section) {
      section.classList.add("hidden");
    });

    let sectionId = link.getAttribute("data-section");
    document.getElementById(sectionId).classList.remove("hidden");

    navLinks.forEach(function (item) {
      item.classList.remove("bg-blue-500/10", "text-blue-400");
      item.classList.add("text-slate-300");
    });

    link.classList.add("bg-blue-500/10", "text-blue-400");
    link.classList.remove("text-slate-300");
  });
});

let sidebarBtn = document.getElementById("sidebar-toggle");
let sidebar = document.getElementById("sidebar");

sidebarBtn.addEventListener("click", function () {
  sidebar.classList.toggle("-translate-x-full");
});

let today = new Date();

// تاريخ اليوم بصيغة ISO عشان نحطه في الـ input
let todayISO = today.toISOString().split("T")[0];

// تاريخ اليوم بصيغة منسقة عشان نحطه في الـ span
let todayFormatted = today.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// تحديث الـ span اللي جوا الـ label
document.querySelector(".date-input-wrapper span").innerHTML = todayFormatted;

// تحديد قيمة الـ input بتاريخ اليوم
document.getElementById("apod-date-input").value = todayISO;

// تحديد أقصى تاريخ = اليوم (مش هيقدر يختار تاريخ في المستقبل)
document.getElementById("apod-date-input").max = todayISO;

// ============================================================
//  1. NASA API — صورة اليوم
// ============================================================
async function loadAPOD(date) {

  let url =
"https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
  if (date) {
    url = url + "&date=" + date;
  }

  let apodImg = document.getElementById("apod-image");
  apodImg.classList.add("hidden");

  let response = await fetch(url);
  let data = await response.json();
console.log(document.getElementById("apod-date"));
console.log(document.getElementById("apod-date-detail"));
console.log(document.getElementById("apod-date-info"));
console.log(document.getElementById("apod-media-type"));
console.log(document.getElementById("apod-copyright"));

  document.getElementById("apod-loading").classList.add("hidden");

  // ملء البيانات
  document.getElementById("apod-title").innerHTML = data.title;
  document.getElementById("apod-explanation").innerHTML = data.explanation;
  document.getElementById("apod-date").innerHTML = "Astronomy Picture of the Day - " + data.date;
  document.getElementById("apod-date-detail").innerHTML = '<i class="far fa-calendar mr-2"></i>' + data.date;
  document.getElementById("apod-date-info").innerHTML = data.date;
  document.getElementById("apod-media-type").innerHTML = data.media_type === "image" ? "Image" : "Video";
  document.getElementById("apod-copyright").innerHTML = data.copyright ? "&copy; " + data.copyright : "&copy; NASA";

  // الصورة أو الفيديو
  if (data.media_type === "image") {
    apodImg.src = data.url;
    apodImg.onload = function () {
      apodImg.classList.remove("hidden");
    };
  } else {
    // لو فيديو خلي الصورة تظهر عادي
    apodImg.classList.remove("hidden");
  }

  // التاريخ بدون Invalid Date
  let parts = data.date.split("-");
  let dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  document.querySelector(".date-input-wrapper span").innerHTML =
    dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
}

// تحميل صورة اليوم أول ما الصفحة تفتح
loadAPOD();

// زرار Load — تحميل بتاريخ معين
document.getElementById("load-date-btn").addEventListener("click", function () {
  let date = document.getElementById("apod-date-input").value;
  loadAPOD(date);
});

// زرار Today — رجوع لصورة اليوم
document.getElementById("today-apod-btn").addEventListener("click", function () {
  document.getElementById("apod-date-input").value = todayISO;
  loadAPOD();
});

// ============================================================
//  2. SpaceDevs API — الرحلات الفضائية
// ============================================================
async function loadLaunches() {
  let response = await fetch(
    "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10"
  );
  let data = await response.json();
  let launches = data.results;

  // تحديث العداد في الـ header
  document.getElementById("launches-count").textContent =
    launches.length + " Launches";
  document.getElementById("launches-count-mobile").textContent =
    launches.length;

  // ===== أول رحلة = Featured Launch =====
  let first = launches[0];
  let firstDate = first.net ? new Date(first.net) : null;

  // حساب الأيام المتبقية
  let daysLeft = "TBD";
  if (firstDate) {
    let diff = Math.ceil((firstDate - new Date()) / (1000 * 60 * 60 * 24));
    daysLeft = diff > 0 ? diff : "Today";
  }

  let featuredStatusColor = "bg-green-500/20 text-green-400";
  let featuredStatusText = "TBD";
  if (first.status) {
    if (first.status.abbrev === "Go") {
      featuredStatusColor = "bg-green-500/20 text-green-400";
      featuredStatusText = "Go";
    } else if (first.status.abbrev === "TBC") {
      featuredStatusColor = "bg-yellow-500/20 text-yellow-400";
      featuredStatusText = "TBC";
    } else {
      featuredStatusColor = "bg-blue-500/20 text-blue-400";
      featuredStatusText = first.status.abbrev || "TBD";
    }
  }

  document.getElementById("featured-launch").innerHTML = `
    <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">

        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i> Featured Launch
              </span>
              <span class="px-4 py-1.5 ${featuredStatusColor} rounded-full text-sm font-semibold">
                ${featuredStatusText}
              </span>
            </div>

            <h3 class="text-3xl font-bold mb-3 leading-tight">${first.name}</h3>

            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${first.launch_service_provider ? first.launch_service_provider.name : "Unknown"}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${first.rocket && first.rocket.configuration ? first.rocket.configuration.name : "Unknown"}</span>
              </div>
            </div>

            <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
              <i class="fas fa-clock text-2xl text-blue-400"></i>
              <div>
                <p class="text-2xl font-bold text-blue-400">${daysLeft}</p>
                <p class="text-xs text-slate-400">Days Until Launch</p>
              </div>
            </div>

            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-calendar"></i> Launch Date
                </p>
                <p class="font-semibold">${firstDate ? firstDate.toDateString() : "TBD"}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-clock"></i> Launch Time
                </p>
                <p class="font-semibold">${firstDate ? firstDate.toUTCString().slice(17, 22) + " UTC" : "TBD"}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-map-marker-alt"></i> Location
                </p>
                <p class="font-semibold text-sm">${first.pad && first.pad.location ? first.pad.location.name : "TBD"}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-globe"></i> Country
                </p>
                <p class="font-semibold">${first.pad && first.pad.location ? first.pad.location.country_code : "N/A"}</p>
              </div>
            </div>

            <p class="text-slate-300 leading-relaxed mb-6">
              ${first.mission && first.mission.description ? first.mission.description : "No mission description available."}
            </p>
          </div>

          <div class="flex flex-col md:flex-row gap-3">
            <button class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i> View Full Details
            </button>
            <div class="icons self-end md:self-center">
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="far fa-heart"></i>
              </button>
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
            ${first.image
              ? `<img src="${first.image}" alt="${first.name}" class="w-full h-full object-cover" />`
              : `<div class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
                   <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                 </div>`
            }
            <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        </div>

      </div>
    </div>
  `;


  let cartona = "";

  for (let i = 1; i < launches.length; i++) {
    let launch = launches[i];
    let launchDate = launch.net ? new Date(launch.net) : null;

   
    let statusColor = "bg-blue-500/90";
    let statusText = "TBD";
    if (launch.status) {
      if (launch.status.abbrev === "Go") {
        statusColor = "bg-green-500/90";
        statusText = "Go";
      } else if (launch.status.abbrev === "TBC") {
        statusColor = "bg-yellow-500/90";
        statusText = "TBC";
      } else {
        statusText = launch.status.abbrev || "TBD";
      }
    }

    cartona += `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">

        <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
          ${launch.image
            ? `<img src="${launch.image}" class="w-full h-full object-cover absolute inset-0" />`
            : `<i class="fas fa-rocket text-5xl text-slate-700"></i>`
          }
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 ${statusColor} text-white rounded-full text-xs font-semibold">
              ${statusText}
            </span>
          </div>
        </div>

        <div class="p-5">
          <div class="mb-3">
            <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              ${launch.name}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${launch.launch_service_provider ? launch.launch_service_provider.name : "Unknown"}
            </p>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>
              <span class="text-slate-300">${launchDate ? launchDate.toDateString() : "TBD"}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>
              <span class="text-slate-300">${launchDate ? launchDate.toUTCString().slice(17, 22) + " UTC" : "TBD"}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-slate-500 w-4"></i>
              <span class="text-slate-300">${launch.rocket && launch.rocket.configuration ? launch.rocket.configuration.name : "Unknown"}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
              <span class="text-slate-300 line-clamp-1">${launch.pad ? launch.pad.name : "TBD"}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
            <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
              Details
            </button>
            <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>

      </div>
    `;
  }

  document.getElementById("launches-grid").innerHTML = cartona;
}

loadLaunches();


let planets = {
  mercury: { temp: "-180°C to 430°C", description: "Closest planet to the Sun" },
  venus:   { temp: "465°C",           description: "Hottest planet in the Solar System" },
  earth:   { temp: "15°C",            description: "Our home planet, only planet with life" },
  mars:    { temp: "-60°C",           description: "The Red Planet" },
  jupiter: { temp: "-110°C",          description: "Largest planet in the Solar System" },
  saturn:  { temp: "-140°C",          description: "Famous for its ring system" },
  uranus:  { temp: "-195°C",          description: "Rotates on its side" },
  neptune: { temp: "-200°C",          description: "Farthest planet from the Sun" },
};

function showPlanet(id) {
  let planet = planets[id];
  if (!planet) return;

  document.getElementById("planet-detail-name").innerHTML =
    id.charAt(0).toUpperCase() + id.slice(1);
  document.getElementById("planet-temp").innerHTML = planet.temp;
  document.getElementById("planet-detail-description").innerHTML =
    planet.description;
  document.getElementById("planet-detail-image").src =
    "./assets/images/" + id + ".png";
}

let cards = document.querySelectorAll(".planet-card");
cards.forEach(function (card) {
  card.addEventListener("click", function () {
    let planetId = card.getAttribute("data-planet-id");
    showPlanet(planetId);
  });
});


