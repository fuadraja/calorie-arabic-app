const STORAGE_KEY = "arabic-calorie-assistant";

const fallbackFoodDatabase = [
  { name: "أرز أبيض", englishName: "White Rice", category: "حبوب - Grains", caloriesPer100g: 130, calories: 205, weight: 158, aliases: ["أرز أبيض", "White Rice"] },
  { name: "دجاج مشوي", englishName: "Grilled Chicken", category: "لحوم - Meat", caloriesPer100g: 165, calories: 220, weight: 133, aliases: ["دجاج مشوي", "Grilled Chicken"] },
  { name: "سمك مشوي", englishName: "Grilled Fish", category: "أسماك - Fish", caloriesPer100g: 128, calories: 190, weight: 148, aliases: ["سمك مشوي", "Grilled Fish"] },
  { name: "بيض مسلوق", englishName: "Boiled Egg", category: "ألبان - Dairy", caloriesPer100g: 155, calories: 78, weight: 50, aliases: ["بيض مسلوق", "Boiled Egg"] },
  { name: "زبادي قليل الدسم", englishName: "Low Fat Yogurt", category: "ألبان - Dairy", caloriesPer100g: 63, calories: 95, weight: 150, aliases: ["زبادي قليل الدسم", "Low Fat Yogurt"] },
  { name: "تفاح", englishName: "Apple", category: "فواكه - Fruits", caloriesPer100g: 52, calories: 95, weight: 182, aliases: ["تفاح", "Apple"] },
  { name: "موز", englishName: "Banana", category: "فواكه - Fruits", caloriesPer100g: 89, calories: 105, weight: 118, aliases: ["موز", "Banana"] }
];

const foodDatabase = Array.isArray(window.FOODS_LIBRARY) && window.FOODS_LIBRARY.length
  ? window.FOODS_LIBRARY
  : fallbackFoodDatabase;

const foodLookupMap = buildFoodLookupMap(foodDatabase);

const foodSearchAliases = {
  "زيت الزيتون": ["olive oil", "extra virgin olive oil"],
  "الجرجير": ["arugula", "rocket", "rucola"],
  "لبن يوناني": ["greek yogurt", "griekse yoghurt", "yoghurt greek style"],
  "زبادي يوناني": ["greek yogurt", "griekse yoghurt"],
  "لبن": ["yogurt", "yoghurt", "curd"],
  "لبنة": ["labneh", "strained yogurt", "yoghurt spread"],
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
  "عسل": ["honey"],
  "بروتين": ["protein powder", "whey protein", "eiwitpoeder"],
  "واي بروتين": ["whey protein", "whey"],
  "مكمل بروتين": ["protein powder", "whey protein"],
  "كرياتين": ["creatine", "creatine monohydrate"],
  "بار بروتين": ["protein bar", "eiwitreep"],
  "سكير": ["skyr", "islandse yoghurt"],
  "جبنة قريش": ["cottage cheese", "huttenkase"],
  "زبدة فول سوداني": ["peanut butter", "pindakaas"],
  "حليب بروتين": ["protein milk", "high protein milk"],
  "خبز أسمر": ["whole wheat bread", "volkoren brood"],
  "تونة": ["tuna"],
  "جبن قليل الدسم": ["low fat cheese", "light cheese", "30+ kaas"]
};

const ingredientFallbackDatabase = {
  "زيت الزيتون": 884,
  "الجرجير": 25,
  "لبن يوناني": 97,
  "زبادي يوناني": 97,
  "لبن": 61,
  "لبنة": 180,
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
  "عسل": 304,
  "واي بروتين": 400,
  "بروتين": 400,
  "مكمل بروتين": 400,
  "كرياتين": 0,
  "بار بروتين": 360,
  "سكير": 63,
  "جبنة قريش": 98,
  "زبدة فول سوداني": 588,
  "حليب بروتين": 60,
  "خبز أسمر": 247,
  "تونة": 132,
  "جبن قليل الدسم": 240
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
const generateSummaryButton = document.getElementById("generateSummaryButton");
const shareEmailButton = document.getElementById("shareEmailButton");
const shareWhatsappButton = document.getElementById("shareWhatsappButton");
const summaryOutput = document.getElementById("summaryOutput");
const generateMealPlanButton = document.getElementById("generateMealPlanButton");
const refreshMealPlanButton = document.getElementById("refreshMealPlanButton");
const mealPlanBox = document.getElementById("mealPlanBox");
let latestLookup = null;
let mealPlanSeed = Date.now();

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
  generateSummaryButton.addEventListener("click", handleGenerateSummary);
  shareEmailButton.addEventListener("click", handleShareEmail);
  shareWhatsappButton.addEventListener("click", handleShareWhatsapp);
  generateMealPlanButton.addEventListener("click", handleGenerateMealPlan);
  refreshMealPlanButton.addEventListener("click", handleRefreshMealPlan);
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
  const selectedFood = findFoodInLibrary(foodNameInput.value.trim());
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
  const tokenAliases = normalized
    .split(/\s+/)
    .flatMap((token) => foodSearchAliases[token] || []);

  const candidates = [
    query.trim(),
    normalized,
    ...directAliases,
    ...partialAliases,
    ...tokenAliases
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
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ");
}

function buildFoodLookupMap(foods) {
  const map = new Map();
  foods.forEach((food) => {
    const keys = new Set([
      food.name,
      food.englishName,
      ...(Array.isArray(food.aliases) ? food.aliases : [])
    ].filter(Boolean));

    keys.forEach((key) => {
      map.set(normalizeArabicText(key), food);
    });
  });
  return map;
}

function findFoodInLibrary(query) {
  if (!query) {
    return null;
  }

  const normalized = normalizeArabicText(query);
  if (foodLookupMap.has(normalized)) {
    return foodLookupMap.get(normalized);
  }

  for (const [key, food] of foodLookupMap.entries()) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return food;
    }
  }

  return null;
}

function pickBestProductMatch(products, originalQuery, attemptedQuery) {
  const originalNormalized = normalizeArabicText(originalQuery);
  const attemptedNormalized = normalizeArabicText(attemptedQuery);
  const originalTokens = new Set(originalNormalized.split(/\s+/).filter(Boolean));
  const attemptedTokens = new Set(attemptedNormalized.split(/\s+/).filter(Boolean));

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
      for (const token of originalTokens) {
        if (token.length > 1 && comparableName.includes(token)) {
          score += 1;
        }
      }
      for (const token of attemptedTokens) {
        if (token.length > 1 && comparableName.includes(token)) {
          score += 1;
        }
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
  const knownFood = findFoodInLibrary(foodName);

  let totalCalories = 0;
  if (grams > 0 && caloriesPer100g > 0) {
    totalCalories = (grams / 100) * caloriesPer100g;
  } else if (knownFood) {
    totalCalories = quantity * (knownFood.calories || knownFood.servingCalories || knownFood.caloriesPer100g || 0);
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
    source: !!findFoodInLibrary(foodName)
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
  renderMealPlanPlaceholder();
  renderSummaryPlaceholder();
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

function renderSummaryPlaceholder() {
  if (!summaryOutput.dataset.generated) {
    summaryOutput.textContent = "يمكنك إنشاء ملخص يومي ثم مشاركته يدوياً عبر البريد أو واتساب.";
  }
}

function renderMealPlanPlaceholder() {
  if (!mealPlanBox.dataset.generated) {
    mealPlanBox.innerHTML = '<div class="info-box subtle">أدخل بياناتك الشخصية ثم اضغط على زر الاقتراح للحصول على خطة يومية مناسبة.</div>';
  }
}

function handleGenerateSummary() {
  const summary = buildDailySummary();
  summaryOutput.textContent = summary;
  summaryOutput.dataset.generated = "true";
}

function handleShareEmail() {
  const summary = buildDailySummary();
  summaryOutput.textContent = summary;
  summaryOutput.dataset.generated = "true";

  const subject = encodeURIComponent(`ملخصي الصحي اليومي - ${today}`);
  const body = encodeURIComponent(summary);
  window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
}

function handleShareWhatsapp() {
  const summary = buildDailySummary();
  summaryOutput.textContent = summary;
  summaryOutput.dataset.generated = "true";

  const text = encodeURIComponent(summary);
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

function handleGenerateMealPlan() {
  mealPlanSeed = Date.now();
  renderGeneratedMealPlan();
}

function handleRefreshMealPlan() {
  mealPlanSeed = Date.now() + Math.floor(Math.random() * 100000);
  renderGeneratedMealPlan();
}

function renderGeneratedMealPlan() {
  const plan = buildDailyMealPlan();
  if (!plan) {
    mealPlanBox.dataset.generated = "true";
    mealPlanBox.innerHTML = '<div class="info-box subtle">أدخل العمر والطول والوزن أولاً حتى أستطيع اقتراح طعام مناسب لك.</div>';
    return;
  }

  mealPlanBox.dataset.generated = "true";
  mealPlanBox.innerHTML = `
    <div class="plan-card">
      <h3>الهدف اليومي</h3>
      <p>${plan.goalText}</p>
    </div>
    ${plan.meals.map((meal) => `
      <div class="plan-card">
        <h3>${meal.title}</h3>
        <p>${meal.summary}</p>
        <div class="plan-options">
          ${meal.options.map((option, index) => `
            <div class="plan-option">
              <strong>الخيار ${index + 1} - ${option.total} سعرة تقريباً</strong>
              <span>${option.description}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("")}
    <div class="plan-card">
      <h3>ملاحظة</h3>
      <p>${plan.note}</p>
    </div>
  `;
}

function buildDailySummary() {
  const meals = getTodayMeals();
  const caloriesToday = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const bmi = calculateBmi(state.profile.weight, state.profile.height);
  const bmiLabel = getBmiCategory(bmi).label;
  const latestProgress = [...state.progress].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const mealNames = meals.length
    ? meals.map((meal) => `${meal.foodName} (${meal.totalCalories} سعرة)`).join("، ")
    : "لم أسجل وجبات اليوم بعد";

  const lines = [
    `ملخص يومي بتاريخ ${today}`,
    `إجمالي السعرات اليوم: ${caloriesToday} سعرة`,
    `الوجبات: ${mealNames}`,
    state.profile.weight ? `الوزن الحالي: ${state.profile.weight} كغ` : "الوزن الحالي: غير مسجل",
    state.profile.height ? `الطول: ${state.profile.height} سم` : "الطول: غير مسجل",
    bmi ? `BMI: ${bmi.toFixed(1)} (${bmiLabel})` : "BMI: غير محسوب",
    latestProgress ? `آخر سجل تقدم: ${latestProgress.date} - ${latestProgress.weight} كغ` : "آخر سجل تقدم: لا يوجد",
    "نصيحة اليوم:",
    ...buildAdviceLinesForSummary(caloriesToday)
  ];

  return lines.join("\n");
}

function buildAdviceLinesForSummary(caloriesToday) {
  const lines = [];
  const bmi = calculateBmi(state.profile.weight, state.profile.height);
  const trend = getWeightTrend();
  const topCalories = summarizeTopCalorieFoods();

  if (bmi >= 25) {
    lines.push("حاول تقليل الأطعمة الأعلى بالسعرات والتركيز على البروتين الخفيف والخضار.");
  } else if (bmi > 0) {
    lines.push("استمر على التوازن الحالي مع متابعة السعرات بشكل يومي.");
  } else {
    lines.push("أدخل بيانات الوزن والطول للحصول على نصيحة أدق.");
  }

  if (caloriesToday === 0) {
    lines.push("لم يتم تسجيل وجبات اليوم بعد.");
  }

  if (topCalories.length) {
    lines.push(`أكثر الأطعمة تأثيراً بالسعرات: ${topCalories.join("، ")}.`);
  }

  if (trend !== null) {
    if (trend < 0) {
      lines.push(`اتجاه الوزن جيد: انخفاض ${Math.abs(trend).toFixed(1)} كغ بين آخر سجلين.`);
    } else if (trend > 0) {
      lines.push(`اتجاه الوزن صاعد: زيادة ${trend.toFixed(1)} كغ بين آخر سجلين.`);
    } else {
      lines.push("اتجاه الوزن ثابت بين آخر سجلين.");
    }
  }

  return lines;
}

function buildDailyMealPlan() {
  const { age, weight, height, gender } = state.profile;
  if (!age || !weight || !height) {
    return null;
  }

  const bmi = calculateBmi(weight, height);
  const bmr = calculateBmr(gender, weight, height, age);
  const targetCalories = bmi >= 25
    ? Math.max(Math.round(bmr - 350), 1200)
    : Math.max(Math.round(bmr), 1400);

  const breakfastTarget = Math.round(targetCalories * 0.25);
  const lunchTarget = Math.round(targetCalories * 0.35);
  const dinnerTarget = Math.round(targetCalories * 0.25);
  const snackTarget = Math.max(targetCalories - breakfastTarget - lunchTarget - dinnerTarget, 100);

  const breakfast = buildMealOptions(
    breakfastTarget,
    ["لبن يوناني", "زبادي يوناني", "زبادي قليل الدسم", "شوفان", "تفاح", "موز", "سكير", "حليب"]
  );
  const lunch = buildMealOptions(
    lunchTarget,
    ["دجاج مشوي", "دجاج", "سمك مشوي", "سمك", "أرز أبيض", "أرز بني", "برغل", "عدس مطبوخ", "عدس", "حمص", "سلطة خضراء", "الجرجير"]
  );
  const dinner = buildMealOptions(
    dinnerTarget,
    ["تونة", "سمك مشوي", "زبادي", "لبن يوناني", "عدس", "سلطة خضراء", "الجرجير", "خيار", "طماطم"]
  );
  const snack = buildMealOptions(
    snackTarget,
    ["تفاح", "موز", "سكير", "زبادي قليل الدسم", "مكسرات", "حليب", "تمر"]
  );

  return {
    goalText: `النطاق المناسب لك اليوم تقريباً هو ${targetCalories} سعرة. هذا الاقتراح موزع على الفطور والغداء والعشاء والوجبة الخفيفة.`,
    meals: [
      { title: "فطور", summary: `3 اقتراحات ضمن حدود تقارب ${breakfast.target} سعرة.`, options: breakfast.options },
      { title: "غداء", summary: `3 اقتراحات ضمن حدود تقارب ${lunch.target} سعرة.`, options: lunch.options },
      { title: "عشاء", summary: `3 اقتراحات ضمن حدود تقارب ${dinner.target} سعرة.`, options: dinner.options },
      { title: "وجبة خفيفة", summary: `3 اقتراحات ضمن حدود تقارب ${snack.target} سعرة.`, options: snack.options }
    ],
    note: bmi >= 25
      ? "بما أن الهدف يميل إلى نزول الوزن، حاول اختيار الشوي أو السلق وقلل الزيوت والحلويات والخبز الزائد."
      : "هذا الاقتراح مناسب للمحافظة أو التنظيم المعتدل. راقب الجوع الحقيقي وحجم الحصص."
  };
}

function buildMealOptions(targetCalories, preferredNames) {
  const matchedFoods = preferredNames
    .map((name) => findFoodInLibrary(name) || createFallbackFood(name))
    .filter(Boolean)
    .map((food) => ({
      ...food,
      calories: Math.round(food.calories || food.caloriesPer100g || 0)
    }))
    .filter((food) => food.calories > 0);

  const uniqueFoods = [];
  const seen = new Set();
  for (const food of matchedFoods) {
    const key = normalizeArabicText(food.name || "");
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFoods.push(food);
    }
  }

  return {
    target: targetCalories,
    options: createMealOptionSets(uniqueFoods, targetCalories)
  };
}

function createMealOptionSets(foods, targetCalories) {
  if (!foods.length) {
    return [{
      total: 0,
      description: "لم أجد اقتراحاً مناسباً في المكتبة الحالية."
    }];
  }

  const rotated = rotateArray(foods, mealPlanSeed);
  const options = [];

  for (let offset = 0; offset < 3; offset += 1) {
    const pool = rotateArray(rotated, offset * 2 + mealPlanSeed);
    const selected = [];
    let total = 0;

    for (const food of pool) {
      if (selected.some((item) => normalizeArabicText(item.name) === normalizeArabicText(food.name))) {
        continue;
      }

      const calories = food.calories;
      if (!calories || calories > targetCalories) {
        continue;
      }

      selected.push(food);
      total += calories;

      if (selected.length >= 3 || total >= targetCalories * 0.8) {
        break;
      }
    }

    if (!selected.length) {
      selected.push(pool[0]);
      total = pool[0].calories;
    }

    options.push({
      total,
      description: selected.map((food) => `${food.name} (${food.calories} سعرة)`).join(" + ")
    });
  }

  return dedupeMealOptions(options);
}

function dedupeMealOptions(options) {
  const seen = new Set();
  const unique = [];

  for (const option of options) {
    const key = normalizeArabicText(option.description);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(option);
    }
  }

  return unique;
}

function rotateArray(items, seed) {
  if (!items.length) {
    return [];
  }
  const offset = Math.abs(seed) % items.length;
  return items.slice(offset).concat(items.slice(0, offset));
}

function createFallbackFood(name) {
  const calories = lookupFallbackIngredientValue(name);
  if (!calories) {
    return null;
  }

  return {
    name,
    englishName: "",
    aliases: [name],
    calories,
    caloriesPer100g: calories
  };
}

function lookupFallbackIngredientValue(query) {
  const normalized = normalizeArabicText(query);
  const directEntry = Object.entries(ingredientFallbackDatabase).find(
    ([key]) => normalizeArabicText(key) === normalized
  );

  if (directEntry) {
    return directEntry[1];
  }

  const partialEntry = Object.entries(ingredientFallbackDatabase).find(([key]) =>
    normalized.includes(normalizeArabicText(key)) || normalizeArabicText(key).includes(normalized)
  );

  return partialEntry ? partialEntry[1] : 0;
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
