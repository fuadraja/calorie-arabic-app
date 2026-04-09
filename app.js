const STORAGE_KEY = "arabic-calorie-assistant";

const foodDatabase = [
  { name: "أرز أبيض", caloriesPer100g: 130, servingCalories: 205 },
  { name: "خبز عربي", caloriesPer100g: 275, servingCalories: 165 },
  { name: "دجاج مشوي", caloriesPer100g: 165, servingCalories: 220 },
  { name: "سمك مشوي", caloriesPer100g: 128, servingCalories: 190 },
  { name: "بيض مسلوق", caloriesPer100g: 155, servingCalories: 78 },
  { name: "سلطة خضراء", caloriesPer100g: 35, servingCalories: 60 },
  { name: "شوفان", caloriesPer100g: 389, servingCalories: 150 },
  { name: "زبادي قليل الدسم", caloriesPer100g: 63, servingCalories: 95 },
  { name: "تفاح", caloriesPer100g: 52, servingCalories: 95 },
  { name: "موز", caloriesPer100g: 89, servingCalories: 105 },
  { name: "تمر", caloriesPer100g: 282, servingCalories: 66 },
  { name: "عدس مطبوخ", caloriesPer100g: 116, servingCalories: 180 },
  { name: "حمص", caloriesPer100g: 164, servingCalories: 135 },
  { name: "بطاطا مشوية", caloriesPer100g: 93, servingCalories: 161 },
  { name: "لحم مشوي", caloriesPer100g: 250, servingCalories: 280 },
  { name: "فاصوليا مطبوخة", caloriesPer100g: 127, servingCalories: 170 },
  { name: "شوربة خضار", caloriesPer100g: 40, servingCalories: 90 },
  { name: "معكرونة مسلوقة", caloriesPer100g: 131, servingCalories: 220 },
  { name: "رز بني", caloriesPer100g: 123, servingCalories: 216 },
  { name: "مكسرات", caloriesPer100g: 607, servingCalories: 170 }
];

const foodSearchAliases = {
  "زيت الزيتون": ["olive oil", "extra virgin olive oil"],
  "الجرجير": ["arugula", "rocket", "rucola"],
  "خس": ["lettuce"],
  "خيار": ["cucumber"],
  "طماطم": ["tomato"],
  "بندورة": ["tomato"],
  "بصل": ["onion"],
  "ثوم": ["garlic"],
  "ليمون": ["lemon"],
  "تفاح": ["apple"],
  "موز": ["banana"],
  "برتقال": ["orange"],
  "بيض": ["egg"],
  "بيض مسلوق": ["boiled egg"],
  "جبن": ["cheese"],
  "لبنة": ["labneh", "strained yogurt"],
  "زبادي": ["yogurt"],
  "حليب": ["milk"],
  "رز": ["rice"],
  "أرز": ["rice"],
  "دجاج": ["chicken"],
  "سمك": ["fish"],
  "لحم": ["beef", "meat"],
  "بطاطا": ["potato"],
  "بطاطس": ["potato"],
  "عدس": ["lentils"],
  "حمص": ["chickpeas", "hummus"],
  "فاصوليا": ["beans"],
  "شوفان": ["oats"],
  "تمر": ["dates"],
  "عسل": ["honey"]
};

const ingredientFallbackDatabase = {
  "زيت الزيتون": 884,
  "الجرجير": 25,
  "خس": 15,
  "خيار": 15,
  "طماطم": 18,
  "بندورة": 18,
  "بصل": 40,
  "ثوم": 149,
  "ليمون": 29,
  "تفاح": 52,
  "موز": 89,
  "برتقال": 47,
  "بيض": 155,
  "جبن": 402,
  "لبنة": 180,
  "زبادي": 61,
  "حليب": 42,
  "رز": 130,
  "أرز": 130,
  "دجاج": 165,
  "سمك": 128,
  "لحم": 250,
  "بطاطا": 77,
  "بطاطس": 77,
  "عدس": 116,
  "حمص": 164,
  "فاصوليا": 127,
  "شوفان": 389,
  "تمر": 282,
  "عسل": 304
};

const today = new Date().toISOString().split("T")[0];

const state = loadState();

const profileForm = document.getElementById("profileForm");
const mealForm = document.getElementById("mealForm");
const progressForm = document.getElementById("progressForm");
const foodNameInput = document.getElementById("foodName");
const caloriesPer100gInput = document.getElementById("caloriesPer100g");
const progressDateInput = document.getElementById("progressDate");
const lookupFoodButton = document.getElementById("lookupFoodButton");
const lookupStatus = document.getElementById("lookupStatus");
let latestLookup = null;

progressDateInput.value = today;

populateFoodOptions();
hydrateForms();
bindEvents();
render();

function loadState() {
  const fallback = {
    profile: {
      age: "",
      height: "",
      weight: "",
      gender: "male"
    },
    meals: [],
    progress: []
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch (error) {
    console.error("Failed to load state", error);
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents() {
  profileForm.addEventListener("submit", handleProfileSubmit);
  mealForm.addEventListener("submit", handleMealSubmit);
  progressForm.addEventListener("submit", handleProgressSubmit);
  foodNameInput.addEventListener("input", autoFillFoodValues);
  lookupFoodButton.addEventListener("click", lookupFoodOnline);
  document.getElementById("mealList").addEventListener("click", handleListActions);
  document.getElementById("progressList").addEventListener("click", handleListActions);
}

function populateFoodOptions() {
  const options = document.getElementById("foodOptions");
  options.innerHTML = foodDatabase
    .map((food) => `<option value="${food.name}"></option>`)
    .join("");
}

function hydrateForms() {
  const { age, height, weight, gender } = state.profile;
  document.getElementById("age").value = age;
  document.getElementById("height").value = height;
  document.getElementById("weight").value = weight;
  document.getElementById("gender").value = gender || "male";
}

function autoFillFoodValues() {
  const selectedFood = foodDatabase.find((food) => food.name === foodNameInput.value.trim());
  if (selectedFood) {
    latestLookup = { source: "القائمة المحلية", caloriesPer100g: selectedFood.caloriesPer100g };
    caloriesPer100gInput.value = selectedFood.caloriesPer100g;
    lookupStatus.textContent = "تم العثور على الطعام في القائمة المحلية.";
    lookupStatus.className = "lookup-status";
  } else if (foodNameInput.value.trim()) {
    latestLookup = null;
    lookupStatus.textContent = "الطعام غير موجود محلياً. يمكنك البحث عنه عبر الإنترنت.";
    lookupStatus.className = "lookup-status";
  } else {
    latestLookup = null;
    lookupStatus.textContent = "استخدم هذا الزر إذا كان الطعام غير موجود في القائمة.";
    lookupStatus.className = "lookup-status";
  }
}

async function lookupFoodOnline() {
  const query = foodNameInput.value.trim();
  if (!query) {
    lookupStatus.textContent = "اكتب اسم المادة الغذائية أولاً ثم ابدأ البحث.";
    lookupStatus.className = "lookup-status negative";
    return;
  }

  lookupFoodButton.disabled = true;
  lookupFoodButton.textContent = "جارٍ البحث...";
  lookupStatus.textContent = "يتم الآن الاتصال بقاعدة بيانات غذائية عبر الإنترنت...";
  lookupStatus.className = "lookup-status";

  try {
    const result = await fetchCaloriesFromInternet(query);
    if (!result) {
      lookupStatus.textContent = "لم أجد نتيجة مناسبة عبر الإنترنت. يمكنك إدخال السعرات يدوياً.";
      lookupStatus.className = "lookup-status negative";
      return;
    }

    caloriesPer100gInput.value = result.caloriesPer100g;
    latestLookup = result;
    if (!foodNameInput.value.trim() || foodNameInput.value.trim() === query) {
      foodNameInput.value = query;
    }
    lookupStatus.textContent = `تم العثور على ${result.caloriesPer100g} سعرة لكل 100غ من مصدر الإنترنت: ${result.source}.`;
    lookupStatus.className = "lookup-status positive";
  } catch (error) {
    console.error(error);
    lookupStatus.textContent = "تعذر جلب البيانات من الإنترنت حالياً. تحقق من الاتصال أو أدخل السعرات يدوياً.";
    lookupStatus.className = "lookup-status negative";
  } finally {
    lookupFoodButton.disabled = false;
    lookupFoodButton.textContent = "البحث عن السعرات عبر الإنترنت";
  }
}

async function fetchCaloriesFromInternet(query) {
  const queries = buildSearchQueries(query);
  for (const currentQuery of queries) {
    const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
    url.searchParams.set("search_terms", currentQuery);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page_size", "12");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Lookup failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.products || !Array.isArray(data.products)) {
      continue;
    }

    const match = pickBestProductMatch(data.products, query, currentQuery);
    if (match) {
      return {
        name: match.name,
        caloriesPer100g: Math.round(match.caloriesPer100g),
        source: `Open Food Facts (${currentQuery})`
      };
    }
  }

  const fallback = lookupFallbackIngredient(query);
  if (fallback) {
    return fallback;
  }

  return null;
}

function readCalories(product) {
  const nutriments = product.nutriments || {};
  const kcalCandidates = [
    nutriments["energy-kcal_100g"],
    nutriments["energy-kcal"],
    nutriments["energy-kcal_value"],
    nutriments["energy-kcal_serving"]
  ];

  const kcal = kcalCandidates.find((value) => Number(value) > 0);
  if (kcal) {
    return Number(kcal);
  }

  const kjCandidates = [
    nutriments.energy_100g,
    nutriments.energy,
    nutriments.energy_value
  ];
  const kj = kjCandidates.find((value) => Number(value) > 0);
  if (kj) {
    return Number(kj) / 4.184;
  }

  return 0;
}

function buildSearchQueries(query) {
  const normalized = normalizeArabicText(query);
  const directAliases = foodSearchAliases[query.trim()] || foodSearchAliases[normalized] || [];
  const partialAliases = Object.entries(foodSearchAliases)
    .filter(([key]) => normalized.includes(normalizeArabicText(key)))
    .flatMap(([, aliases]) => aliases);

  const candidates = [
    query.trim(),
    normalized,
    ...directAliases,
    ...partialAliases
  ]
    .map((item) => item.trim())
    .filter(Boolean);

  return [...new Set(candidates)];
}

function normalizeArabicText(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

function pickBestProductMatch(products, originalQuery, attemptedQuery) {
  const originalNormalized = normalizeArabicText(originalQuery);
  const attemptedNormalized = normalizeArabicText(attemptedQuery);

  const candidates = products
    .map((product) => {
      const name = [
        product.product_name,
        product.product_name_ar,
        product.product_name_en,
        product.generic_name
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      const caloriesPer100g = readCalories(product);
      const comparableName = normalizeArabicText(name);

      let score = 0;
      if (comparableName.includes(originalNormalized)) {
        score += 5;
      }
      if (comparableName.includes(attemptedNormalized)) {
        score += 4;
      }
      if (product.categories_tags?.some((tag) => tag.includes("en:plant-based-foods"))) {
        score += 1;
      }
      if (caloriesPer100g > 0) {
        score += 3;
      }

      return {
        name: name || product.brands || attemptedQuery,
        caloriesPer100g,
        score
      };
    })
    .filter((item) => item.caloriesPer100g > 0)
    .sort((a, b) => b.score - a.score);

  return candidates[0] || null;
}

function lookupFallbackIngredient(query) {
  const normalized = normalizeArabicText(query);
  const directEntry = Object.entries(ingredientFallbackDatabase).find(
    ([key]) => normalizeArabicText(key) === normalized
  );

  if (directEntry) {
    return {
      name: directEntry[0],
      caloriesPer100g: directEntry[1],
      source: "قاعدة احتياطية داخلية"
    };
  }

  const partialEntry = Object.entries(ingredientFallbackDatabase).find(([key]) =>
    normalized.includes(normalizeArabicText(key))
  );

  if (!partialEntry) {
    return null;
  }

  return {
    name: partialEntry[0],
    caloriesPer100g: partialEntry[1],
    source: "قاعدة احتياطية داخلية"
  };
}

function handleProfileSubmit(event) {
  event.preventDefault();
  state.profile = {
    age: Number(document.getElementById("age").value),
    height: Number(document.getElementById("height").value),
    weight: Number(document.getElementById("weight").value),
    gender: document.getElementById("gender").value
  };

  saveState();
  render();
}

function handleMealSubmit(event) {
  event.preventDefault();

  const foodName = foodNameInput.value.trim();
  const quantity = Number(document.getElementById("quantity").value || 1);
  const grams = Number(document.getElementById("grams").value || 0);
  const caloriesPer100g = Number(caloriesPer100gInput.value || 0);
  const knownFood = foodDatabase.find((food) => food.name === foodName);

  let totalCalories = 0;
  if (grams > 0 && caloriesPer100g > 0) {
    totalCalories = (grams / 100) * caloriesPer100g;
  } else if (knownFood) {
    totalCalories = quantity * knownFood.servingCalories;
  } else if (caloriesPer100g > 0) {
    totalCalories = quantity * caloriesPer100g;
  }

  state.meals.unshift({
    id: generateId(),
    date: today,
    foodName,
    quantity,
    grams,
    caloriesPer100g,
    totalCalories: Math.round(totalCalories),
    source: foodDatabase.some((food) => food.name === foodName)
      ? "القائمة المحلية"
      : latestLookup?.source || "إدخال يدوي"
  });

  saveState();
  mealForm.reset();
  document.getElementById("quantity").value = 1;
  latestLookup = null;
  lookupStatus.textContent = "استخدم هذا الزر إذا كان الطعام غير موجود في القائمة.";
  lookupStatus.className = "lookup-status";
  render();
}

function handleProgressSubmit(event) {
  event.preventDefault();

  const entry = {
    id: generateId(),
    date: progressDateInput.value,
    weight: Number(document.getElementById("progressWeight").value),
    note: document.getElementById("progressNote").value.trim()
  };

  state.progress = state.progress.filter((item) => item.date !== entry.date);
  state.progress.push(entry);
  state.progress.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!state.profile.weight) {
    state.profile.weight = entry.weight;
    document.getElementById("weight").value = entry.weight;
  }

  saveState();
  progressForm.reset();
  progressDateInput.value = today;
  render();
}

function handleListActions(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (!id) {
    return;
  }

  if (action === "delete-meal") {
    deleteMeal(id);
  }

  if (action === "delete-progress") {
    deleteProgress(id);
  }
}

function deleteMeal(id) {
  state.meals = state.meals.filter((meal) => meal.id !== id);
  saveState();
  render();
}

function deleteProgress(id) {
  state.progress = state.progress.filter((entry) => entry.id !== id);
  saveState();
  render();
}

function render() {
  renderMetrics();
  renderProfileSummary();
  renderMealList();
  renderProgress();
  renderAdvice();
}

function renderMetrics() {
  const caloriesToday = getTodayMeals().reduce((sum, meal) => sum + meal.totalCalories, 0);
  document.getElementById("todayCalories").textContent = caloriesToday;

  const bmi = calculateBmi(state.profile.weight, state.profile.height);
  const bmr = calculateBmr(
    state.profile.gender,
    state.profile.weight,
    state.profile.height,
    state.profile.age
  );

  document.getElementById("currentBmi").textContent = bmi ? bmi.toFixed(1) : "0.0";
  document.getElementById("currentBmr").textContent = bmr ? Math.round(bmr) : "0";
}

function renderProfileSummary() {
  const box = document.getElementById("profileSummary");
  const { age, height, weight } = state.profile;

  if (!age || !height || !weight) {
    box.innerHTML = '<span class="muted">أدخل بياناتك الشخصية ليظهر التحليل الصحي هنا.</span>';
    return;
  }

  const bmi = calculateBmi(weight, height);
  const category = getBmiCategory(bmi);
  const bmr = calculateBmr(state.profile.gender, weight, height, age);
  const suggestedDeficit = Math.max(Math.round(bmr - 400), 1200);

  box.innerHTML = `
    <strong>${category.label}</strong><br>
    مؤشر كتلة الجسم الحالي: ${bmi.toFixed(1)}<br>
    معدل الأيض الأساسي التقريبي: ${Math.round(bmr)} سعرة/اليوم<br>
    هدف يومي تقريبي لخسارة الوزن بشكل معتدل: ${suggestedDeficit} سعرة
  `;
}

function renderMealList() {
  const container = document.getElementById("mealList");
  const meals = getTodayMeals();

  if (!meals.length) {
    container.innerHTML = '<div class="list-item"><span class="muted">لم تتم إضافة وجبات اليوم بعد.</span></div>';
    return;
  }

  container.innerHTML = meals
    .map(
      (meal) => `
        <div class="list-item">
          <div>
            <strong>${meal.foodName}</strong>
            <span>
              ${meal.grams ? `${meal.grams} غرام` : `${meal.quantity} حصة`} - ${meal.date} - ${meal.source}
            </span>
          </div>
          <div class="item-actions">
            <div class="badge">${meal.totalCalories} سعرة</div>
            <button type="button" class="danger" data-action="delete-meal" data-id="${meal.id}">حذف</button>
          </div>
        </div>
      `
    )
    .join("");
}

function renderProgress() {
  renderProgressList();
  renderHistoryChart();
}

function renderProgressList() {
  const container = document.getElementById("progressList");

  if (!state.progress.length) {
    container.innerHTML = '<div class="list-item"><span class="muted">لا يوجد سجل تقدم حتى الآن.</span></div>';
    return;
  }

  const sorted = [...state.progress].sort((a, b) => new Date(b.date) - new Date(a.date));
  container.innerHTML = sorted
    .map(
      (entry) => `
        <div class="list-item">
          <div>
            <strong>${entry.date}</strong>
            <span>${entry.note || "بدون ملاحظة"}</span>
          </div>
          <div class="item-actions">
            <div class="badge">${entry.weight} كغ</div>
            <button type="button" class="danger" data-action="delete-progress" data-id="${entry.id}">حذف</button>
          </div>
        </div>
      `
    )
    .join("");
}

function renderHistoryChart() {
  const chart = document.getElementById("historyChart");
  if (state.progress.length < 2) {
    chart.innerHTML = '<div class="muted">أدخل سجلين أو أكثر لعرض الرسم البياني للتقدم.</div>';
    return;
  }

  const entries = [...state.progress].sort((a, b) => new Date(a.date) - new Date(b.date));
  const weights = entries.map((entry) => entry.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = Math.max(maxWeight - minWeight, 1);
  const width = 700;
  const height = 220;
  const padding = 24;

  const points = entries.map((entry, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(entries.length - 1, 1);
    const normalized = (entry.weight - minWeight) / range;
    const y = height - padding - normalized * (height - padding * 2);
    return `${x},${y}`;
  });

  const labels = entries
    .map((entry, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(entries.length - 1, 1);
      return `<text x="${x}" y="${height - 4}" text-anchor="middle" font-size="11" fill="#71675b">${entry.date.slice(5)}</text>`;
    })
    .join("");

  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="رسم بياني للوزن">
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="rgba(92,69,45,0.18)" />
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(92,69,45,0.18)" />
      <polyline
        fill="none"
        stroke="#b85c38"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        points="${points.join(" ")}"
      ></polyline>
      ${points
        .map((point) => {
          const [cx, cy] = point.split(",");
          return `<circle cx="${cx}" cy="${cy}" r="5" fill="#2f7d54"></circle>`;
        })
        .join("")}
      ${labels}
    </svg>
  `;
}

function renderAdvice() {
  const adviceBox = document.getElementById("adviceBox");
  const { weight, height } = state.profile;
  const bmi = calculateBmi(weight, height);
  const category = getBmiCategory(bmi);
  const todayMeals = getTodayMeals();
  const caloriesToday = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const recentTrend = getWeightTrend();
  const topCalories = summarizeTopCalorieFoods();

  const advice = [];

  if (!weight || !height) {
    advice.push("أدخل الوزن والطول أولاً للحصول على نصيحة دقيقة.");
  } else {
    advice.push(`حالتك الحالية حسب BMI: ${category.label}.`);

    if (bmi >= 25) {
      advice.push("لخسارة الوزن، ركّز على العشاء الخفيف وتقليل الأطعمة الأعلى كثافة بالسعرات.");
    } else {
      advice.push("وزنك ضمن نطاق جيد نسبياً، فحافظ على التوازن وراقب الزيادات الصغيرة مبكراً.");
    }
  }

  if (caloriesToday > 0) {
    advice.push(`سعرات اليوم الحالية: ${caloriesToday} سعرة.`);
  }

  if (topCalories.length) {
    advice.push(`الأطعمة الأكثر مساهمة بالسعرات في سجلك: ${topCalories.join("، ")}.`);
    advice.push("إذا كان هدفك نزول الوزن، استبدل بعض هذه الخيارات بسلطة خضراء، شوربة خضار، زبادي قليل الدسم، عدس، أو سمك مشوي.");
  } else {
    advice.push("كلما سجّلت وجبات أكثر، سيصبح التحليل أدق.");
  }

  if (recentTrend !== null) {
    if (recentTrend < 0) {
      advice.push(`ممتاز، وزنك ينخفض بمقدار ${Math.abs(recentTrend).toFixed(1)} كغ بين آخر سجلين.`);
    } else if (recentTrend > 0) {
      advice.push(`يوجد ارتفاع بمقدار ${recentTrend.toFixed(1)} كغ بين آخر سجلين، لذلك يُفضّل تقليل الخبز والمكسرات واللحوم الدسمة وزيادة البروتين الخفيف والخضار.`);
    } else {
      advice.push("وزنك ثابت بين آخر سجلين، ويمكنك خفض 200 إلى 300 سعرة يومياً لتحريك النزول تدريجياً.");
    }
  }

  adviceBox.innerHTML = advice.map((line) => `<div>${line}</div>`).join("");
}

function calculateBmi(weight, heightCm) {
  if (!weight || !heightCm) {
    return 0;
  }
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function calculateBmr(gender, weight, heightCm, age) {
  if (!gender || !weight || !heightCm || !age) {
    return 0;
  }
  if (gender === "female") {
    return 10 * weight + 6.25 * heightCm - 5 * age - 161;
  }
  return 10 * weight + 6.25 * heightCm - 5 * age + 5;
}

function getBmiCategory(bmi) {
  if (!bmi) {
    return { label: "غير محسوب بعد" };
  }
  if (bmi < 18.5) {
    return { label: "وزن أقل من الطبيعي" };
  }
  if (bmi < 25) {
    return { label: "وزن طبيعي" };
  }
  if (bmi < 30) {
    return { label: "زيادة في الوزن" };
  }
  return { label: "سمنة" };
}

function getTodayMeals() {
  return state.meals.filter((meal) => meal.date === today);
}

function getWeightTrend() {
  if (state.progress.length < 2) {
    return null;
  }
  const entries = [...state.progress].sort((a, b) => new Date(a.date) - new Date(b.date));
  const last = entries[entries.length - 1];
  const beforeLast = entries[entries.length - 2];
  return last.weight - beforeLast.weight;
}

function summarizeTopCalorieFoods() {
  const totals = {};
  state.meals.forEach((meal) => {
    totals[meal.foodName] = (totals[meal.foodName] || 0) + meal.totalCalories;
  });

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, total]) => `${name} (${Math.round(total)} سعرة)`);
}
