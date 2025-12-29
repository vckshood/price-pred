function getBathValue() {
  for (let r of document.getElementsByName("uiBathrooms")) {
    if (r.checked) return parseInt(r.value);
  }
  return -1;
}

function getBHKValue() {
  for (let r of document.getElementsByName("uiBHK")) {
    if (r.checked) return parseInt(r.value);
  }
  return -1;
}

function onClickedEstimatePrice() {
  const sqft = document.getElementById("uiSqft");
  const bhk = getBHKValue();
  const bath = getBathValue();
  const location = document.getElementById("uiLocations");
  const result = document.getElementById("uiEstimatedPrice");
  const btn = document.querySelector(".btn");

  if (!sqft.value || bhk === -1 || bath === -1 || !location.value) {
    result.classList.remove("hidden");
    result.innerHTML = "⚠️ Please fill all fields";
    return;
  }

  btn.disabled = true;
  btn.innerText = "Estimating...";
  result.classList.remove("hidden");
  result.innerHTML = "⏳ Calculating...";

  $.post("/api/predict_home_price", {
    total_sqft: parseFloat(sqft.value),
    bhk,
    bath,
    location: location.value
  })
  .done(data => {
    result.innerHTML = `₹ ${data.estimated_price} Lakh`;
  })
  .fail(() => {
    result.innerHTML = "❌ Server error";
  })
  .always(() => {
    btn.disabled = false;
    btn.innerText = "Estimate Price";
  });
}

function onPageLoad() {
  $.get("/api/get_location_names", data => {
    const select = document.getElementById("uiLocations");
    select.innerHTML = `<option value="" disabled selected>Choose Location</option>`;
    data.locations.forEach(loc => select.add(new Option(loc, loc)));
  });
}

function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");

  if (saved === "light") {
    document.body.classList.add("light");
    toggle.innerText = "☀️";
  }

  toggle.onclick = () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    toggle.innerText = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  };
}

document.addEventListener("DOMContentLoaded", () => {
  onPageLoad();
  initTheme();
});
