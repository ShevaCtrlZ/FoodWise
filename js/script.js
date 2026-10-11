
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const tanggal = document.getElementById("tanggal");

    const ingredientList = document.getElementById("ingredient-list");
    const searchInput = document.getElementById("search-input");
    const totalLabel = document.getElementById("total-label");
    const emptyState = document.getElementById("empty-state");

    const toast = document.getElementById("toast");

    if (tanggal) {
        tanggal.textContent =
            new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(new Date()) + " · Ringkasan dapur hari ini";
    }

    const lastUpdated = document.getElementById("last-updated");

    if (lastUpdated) {
        const now = new Date();

        lastUpdated.textContent =
            new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(now) + ", " +
            now.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });
    }

    document.querySelectorAll(".mobile-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".mobile-tab").forEach(item => {
                item.classList.remove("active");
                item.classList.remove("text-slate-900");
                item.classList.add("text-slate-500");

                const line = item.querySelector(".active-line");

                if (line) {
                    line.classList.add("hidden");
                }
            });

            tab.classList.add("active");
            tab.classList.remove("text-slate-500");
            tab.classList.add("text-slate-900");

            const line = tab.querySelector(".active-line");

            if (line) {
                line.classList.remove("hidden");
            }
        });
    });

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    const ingredients = [
        {
            name: "Telur",
            stock: "5 kg",
            status: "aman",
            label: "Aman",
            detail: "Batas pakai 16 Okt · Chiller",
            icon: "🥚"
        },
        {
            name: "Beras",
            stock: "8 kg",
            status: "aman",
            label: "Aman",
            detail: "Batas pakai 30 Nov · Rak kering",
            icon: "🌾"
        },
        {
            name: "Wortel",
            stock: "0,8 kg",
            status: "perhatian",
            label: "Menipis",
            detail: "Stok minimum 1,5 kg · Chiller",
            icon: "🥕"
        },
        {
            name: "Bayam",
            stock: "1,2 kg",
            status: "perhatian",
            label: "Perlu diperiksa",
            detail: "Batas pakai 11 Okt · Chiller",
            icon: "🌿"
        },
        {
            name: "Ayam fillet",
            stock: "2 kg",
            status: "perhatian",
            label: "Mendekati batas",
            detail: "Batas pakai 11 Okt · Chiller",
            icon: "🍗"
        },
        {
            name: "Minyak goreng",
            stock: "2 L",
            status: "aman",
            label: "Aman",
            detail: "Batas pakai 15 Des · Rak kering",
            icon: "💧"
        }
    ];

    let activeFilter = "semua";
    let searchTerm = "";

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }


    function renderIngredients() {

        if (!ingredientList) return;

        const filtered = ingredients.filter(item => {
            const matchesName = item.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesStatus =
                activeFilter === "semua" ||
                item.status === activeFilter;

            return matchesName && matchesStatus;
        });

        ingredientList.innerHTML = filtered.map(item => {

            let statusClass = "bg-[#e4f3df] text-[#287a35]";

            if (item.label === "Menipis") {
                statusClass = "bg-red-100 text-red-700";
            } else if (item.status === "perhatian") {
                statusClass = "bg-[#fff0ce] text-[#97600b]";
            }

            return `
                <article
                    class="ingredient-card flex items-center gap-3
                    rounded-2xl border border-slate-200 bg-white p-3
                    transition hover:border-green-200 sm:p-4">

                    <div class="flex h-12 w-12 shrink-0 items-center
                        justify-center rounded-xl bg-eco-50 text-2xl">
                        ${item.icon}
                    </div>

                    <div class="min-w-0 flex-1">
                        <h3 class="text-xs font-semibold text-slate-800
                            sm:text-sm">
                            ${escapeHTML(item.name)}
                        </h3>

                        <p class="mt-0.5 text-sm font-extrabold
                            text-slate-800 sm:text-base">
                            ${escapeHTML(item.stock)}
                        </p>

                        <div class="mt-2">
                            <span class="inline-block rounded-full px-2 py-1
                                text-[9px] font-semibold ${statusClass}">
                                ${escapeHTML(item.label)}
                            </span>

                            <p class="mt-1.5 text-[9px] leading-4
                                text-slate-500 sm:text-[10px]">
                                ${escapeHTML(item.detail)}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="qr-button flex h-9 w-9 shrink-0
                        items-center justify-center rounded-xl
                        border border-slate-200 text-slate-500
                        hover:bg-eco-50 hover:text-eco-700"
                        data-name="${escapeHTML(item.name)}"
                        aria-label="Lihat ${escapeHTML(item.name)}">

                        <svg class="h-5 w-5" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            stroke-width="1.4">
                            <rect x="3" y="3" width="7" height="7" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/>
                            <path d="M14 14h3v3h-3zM20 14v2m-3 3h3v2m-6-2v2"/>
                        </svg>
                    </button>

                </article>
            `;
        }).join("");

        if (totalLabel) {
            totalLabel.textContent = `${filtered.length} bahan`;
        }

        const countSemua = document.getElementById("count-semua");
        const countAman = document.getElementById("count-aman");
        const countPerhatian = document.getElementById("count-perhatian");

        if (countSemua) {
            countSemua.textContent = ingredients.length;
        }

        if (countAman) {
            countAman.textContent =
                ingredients.filter(item => item.status === "aman").length;
        }

        if (countPerhatian) {
            countPerhatian.textContent =
                ingredients.filter(item => item.status === "perhatian").length;
        }

        if (emptyState) {
            emptyState.classList.toggle("hidden", filtered.length > 0);
        }
    }



    if (searchInput && ingredientList) {
        searchInput.addEventListener("input", event => {
            searchTerm = event.target.value.trim();
            renderIngredients();
        });
    }


    document.querySelectorAll("[data-filter]").forEach(button => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter;

            document.querySelectorAll("[data-filter]").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            renderIngredients();
        });
    });

    const resetFilter = document.getElementById("reset-filter");

    if (resetFilter) {
        resetFilter.addEventListener("click", () => {
            searchTerm = "";
            activeFilter = "semua";

            if (searchInput) {
                searchInput.value = "";
            }

            document.querySelectorAll("[data-filter]").forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.filter === "semua"
                );
            });

            renderIngredients();
        });
    }


    const toggleFilters = document.getElementById("toggle-filters");
    const filterSection = document.getElementById("filter-section");

    if (toggleFilters && filterSection) {
        toggleFilters.addEventListener("click", () => {
            filterSection.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });
    }



    let productionToastTimer;

    function showToast(message) {
        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;
        toast.classList.remove("hidden");

        clearTimeout(productionToastTimer);

        productionToastTimer = setTimeout(() => {
            toast.classList.add("hidden");
        }, 2500);
    }

    if (ingredientList) {
        ingredientList.addEventListener("click", event => {
            const button = event.target.closest(".qr-button");

            if (!button) return;

            const name = button.dataset.name;
            const item = ingredients.find(
                ingredient => ingredient.name === name
            );

            if (item) {
                showToast(
                    `${item.name}: ${item.stock} · ${item.label}`
                );
            }
        });
    }


    renderIngredients();
    const recipes = {
        nasi: [
            { name: "Beras", perPortion: 0.10, unit: "kg", stock: 8 },
            { name: "Telur", perPortion: 0.05, unit: "kg", stock: 5 },
            { name: "Wortel", perPortion: 0.04, unit: "kg", stock: 0.8 },
            { name: "Minyak goreng", perPortion: 0.01, unit: "L", stock: 2 }
        ],
        ayam: [
            { name: "Beras", perPortion: 0.10, unit: "kg", stock: 8 },
            { name: "Ayam fillet", perPortion: 0.08, unit: "kg", stock: 2 },
            { name: "Wortel", perPortion: 0.04, unit: "kg", stock: 0.8 },
            { name: "Minyak goreng", perPortion: 0.01, unit: "L", stock: 2 }
        ],
        telur: [
            { name: "Telur", perPortion: 0.06, unit: "kg", stock: 5 },
            { name: "Bayam", perPortion: 0.03, unit: "kg", stock: 1.2 },
            { name: "Minyak goreng", perPortion: 0.01, unit: "L", stock: 2 }
        ]
    };

    const menuInput = document.getElementById("menu");
    const targetInput = document.getElementById("target");
    const stokInput = document.getElementById("stok-jadi");

    const hasilPorsi = document.getElementById("hasil-porsi");
    const rincianPorsi = document.getElementById("rincian-porsi");
    const progress = document.getElementById("progress");
    const bahanList = document.getElementById("bahan-list");
    const kebutuhanLabel = document.getElementById("kebutuhan-label");
    const peringatan = document.getElementById("peringatan");
    const peringatanText = document.getElementById("peringatan-text");
    const simpanButton = document.getElementById("simpan-rencana");
    const statusSimpan = document.getElementById("status-simpan");

    let toastTimer;

    function formatNumber(value) {
        return value.toLocaleString("id-ID", {
            maximumFractionDigits: 2
        });
    }

    function renderPlan() {
        const target = Math.max(0, Number(targetInput.value) || 0);
        const stokJadi = Math.max(0, Number(stokInput.value) || 0);

        const produksi = Math.max(0, target - stokJadi);
        const progressValue = target > 0
            ? Math.min(100, (stokJadi / target) * 100)
            : 0;

        hasilPorsi.textContent =
            `Perlu dibuat: ${formatNumber(produksi)} porsi`;

        rincianPorsi.textContent =
            `${formatNumber(target)} porsi target − ${formatNumber(stokJadi)} porsi stok jadi = ${formatNumber(produksi)} porsi`;

        progress.style.width = `${progressValue}%`;

        kebutuhanLabel.textContent =
            `Untuk ${formatNumber(produksi)} porsi`;

        const recipe = recipes[menuInput.value] || [];
        const shortages = [];

        bahanList.innerHTML = recipe.map(item => {
            const need = item.perPortion * produksi;
            const enough = item.stock >= need;
            const shortage = Math.max(0, need - item.stock);

            if (!enough) {
                shortages.push({
                    name: item.name,
                    amount: shortage,
                    unit: item.unit
                });
            }

            return `
                <article class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
                    <div class="min-w-0">
                        <h3 class="text-xs font-semibold text-slate-800">
                            ${item.name} · ${formatNumber(need)} ${item.unit}
                        </h3>
                        <p class="mt-1 text-[10px] text-slate-500">
                            Stok tersedia ${formatNumber(item.stock)} ${item.unit}
                        </p>
                    </div>

                    <span class="shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                        enough
                            ? "bg-eco-50 text-eco-700"
                            : "bg-red-100 text-red-700"
                    }">
                        ${enough ? "Cukup" : "Kurang"}
                    </span>
                </article>
            `;
        }).join("");

        if (shortages.length > 0 && produksi > 0) {
            peringatan.classList.remove("hidden");

            peringatanText.textContent = shortages.map(item =>
                `${item.name} kurang ${formatNumber(item.amount)} ${item.unit}`
            ).join(". ") + ". Lengkapi stok sebelum mulai produksi.";

            simpanButton.disabled = false;
            simpanButton.classList.remove("opacity-50", "cursor-not-allowed");

            statusSimpan.textContent ="Perhatian: ada bahan yang kurang. Periksa sebelum produksi.";
        } else {
            peringatan.classList.add("hidden");

            simpanButton.disabled = false;
            simpanButton.classList.remove("opacity-50", "cursor-not-allowed");

            statusSimpan.textContent =
                "Stok bahan mencukupi untuk rencana produksi ini.";
        }
    }

    function showToast(message) {
        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;
        toast.classList.remove("hidden");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.add("hidden");
        }, 2500);
    }

    menuInput.addEventListener("change", renderPlan);
    targetInput.addEventListener("input", renderPlan);
    stokInput.addEventListener("input", renderPlan);

    simpanButton.addEventListener("click", () => {
        if (simpanButton.disabled) return;

        const plan = {
            menu: menuInput.options[menuInput.selectedIndex].text,
            target: Number(targetInput.value) || 0,
            stokJadi: Number(stokInput.value) || 0,
            perluDibuat: Math.max(
                0,
                (Number(targetInput.value) || 0) -
                (Number(stokInput.value) || 0)
            )
        };

        try {
            localStorage.setItem(
                "ecokitchen-production-plan",
                JSON.stringify(plan)
            );

            statusSimpan.textContent =
                "Rencana tersimpan di browser. Stok bahan belum dikurangi.";

            showToast("Rencana produksi berhasil disimpan.");
        } catch (error) {
            showToast("Rencana belum dapat disimpan di browser.");
        }
    });

    renderPlan();

});