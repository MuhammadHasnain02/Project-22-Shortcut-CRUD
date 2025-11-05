let overlayBg = document.getElementById("overlayBg")
let addIconSect = document.getElementById("addIconSect")
let shortCutsDiv = document.getElementById("shortCutsDiv")

let cancelBtn = document.getElementById("cancelBtn")
let doneBtn = document.getElementById("doneBtn")

let userShortCutName = document.getElementById("userShortCutName")
let userShortCutUrl = document.getElementById("userShortCutUrl")

let defaultShortCut = [
    {
        name : "Webstore",
        url : "https://chromewebstore.google.com/"
    }
]

let shortCuts = JSON.parse(localStorage.getItem("shortCuts")) || [

    {
        name: "Webstore",
        url: "https://chromewebstore.google.com/"
    }

];

if (!localStorage.getItem("shortCuts")) {
    saveToLocalStorage()
};

// ---------- Save ----------

function saveToLocalStorage() {
    localStorage.setItem("shortCuts" , JSON.stringify(shortCuts))
};

// ---------- Map Shortcuts ----------

function mapShortCuts() {
    
    let shortCutLclStrg = JSON.parse(localStorage.getItem("shortCuts")) || []
    if ( !Array.isArray(shortCutLclStrg) ) shortCutLclStrg = [];

    shortCutsDiv.innerHTML = ""

    shortCutLclStrg.map((shortCut) => {

        if (!shortCut || !shortCut.url) return

        // Generate favicon URL from Google API
        let domain = new URL(shortCut.url).hostname
        let favicon = `https://www.google.com/s2/favicons?domain=${domain}`;

        shortCutsDiv.innerHTML +=
        `<div draggable="true" class="icon group flex flex-col items-center hover:bg-gray-100 px-8 pt-4 rounded-md space-y-3 hover:cursor-pointer relative">
            
            <img src="images/icon_more_vert.svg" class="dotsHandl absolute top-1 right-0 w-8 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer rounded-full hover:bg-gray-200">
            <a href="${shortCut.url}">
                <img class="w-[55px] text-gray-200 bg-[#E4E2DF] px-3.5 py-3.5 rounded-full" src="${favicon}" alt="">
            </a>
            <p class="text-[13px] font-medium">${shortCut.name}</p>

            <!-- Hidden Popup Menu -->
            <div class="menu hidden absolute top-0 right-0 bg-white border border-gray-300 shadow-md rounded-md text-sm">
                <button class="editBtn text-[12px] text-left w-30 px-5 py-2 hover:bg-gray-100 cursor-pointer">Edit</button>
                <button class="deleteBtn text-[12px] text-left w-30 px-5 py-2 hover:bg-gray-100 cursor-pointer">Delete</button>
            </div>

        </div>
        `
    });

    // ----------<<< Add Shortcut Button >>>----------

    if (shortCuts.length < 10) {
        
        document.getElementById("shortCutsDiv").innerHTML +=
        `<div draggable="false" id="addShortCut" class="flex flex-col items-center hover:bg-gray-100 px-4 py-3 rounded-md space-y-3 hover:cursor-pointer">
            <i class="fa-solid fa-plus text-[23px] before:flex before:flex-row before:justify-center bg-gray-200 rounded-full text-gray-500 px-7.5 py-4.5"></i>
            <p class="text-[12px] font-medium">Add Shortcut</p>
        </div>
        `;

    }

    // ----------<<< Add Shortcut Popup >>>----------
    let addShortCut = document.getElementById("addShortCut")
    
    if (addShortCut) {
        addShortCut.addEventListener("click" , () => {
            doneBtn.dataset.mode = "add";
            overlayBg.classList.remove("hidden")
        });
    }

    // ----------<<< Dots Menu Handling >>>----------

    let allDotsBtn = document.querySelectorAll(".dotsHandl")
    let allEditBtn = document.querySelectorAll(".editBtn")
    let allDelBtn = document.querySelectorAll(".deleteBtn")

    allDotsBtn.forEach(btn => {

        btn.addEventListener("click" , (e) => {
            e.stopPropagation()
            
            let iconDiv = e.target.closest(".icon")
            if (!iconDiv) return

            let menu = iconDiv.querySelector(".menu")
            if (!menu) return

            document.querySelectorAll(".menu").forEach(m => m.classList.add("hidden"));
            menu.classList.remove("hidden")
        })

    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".menu").forEach(m => m.classList.add("hidden"));
    });

    // ----------<<< Edit Button (open popup) >>>----------

    allEditBtn.forEach((btn , i) => {
        
        btn.addEventListener("click" , () => {

            userShortCutName.value = shortCuts[i].name
            userShortCutUrl.value = shortCuts[i].url
            
                doneBtn.dataset.mode = "edit"
                doneBtn.dataset.index = i

            overlayBg.classList.remove("hidden")
        })

    });

    // ----------<<< Delete Button >>>----------

    allDelBtn.forEach((btn , i) => {

        btn.addEventListener("click" , () => {

            if (confirm("Are you sure you want to delete this shortcut?")) {
                shortCuts.splice(i, 1);
                saveToLocalStorage();
                mapShortCuts();
            }

        })

    });

    enableDragAndDrop()
};

mapShortCuts()

// ----------<<< Drag and Drop Logic >>>----------

function enableDragAndDrop() {

    let icons = document.querySelectorAll(".icon")
    let draggedItem = null

    icons.forEach((icn) => {

        icn.addEventListener("dragstart" , () => {
            draggedItem = icn
            icn.classList.add("opacity-50")
        });

        icn.addEventListener("dragend" , () => {
            draggedItem = null
            icn.classList.remove("opacity-50")
            saveToLocalStorage()
        });

        icn.addEventListener("dragover", (e) => e.preventDefault());

        icn.addEventListener("drop" , () => {
            if (draggedItem && draggedItem !== icn) {

                // move item in DOM
                shortCutsDiv.insertBefore(draggedItem , icn)

                // update array according to new order
                let newArr = []
                shortCutsDiv.querySelectorAll(".icon").forEach(icon => {

                    let name = icon.querySelector("p").textContent
                    let matched = shortCuts.find(s => s.name === name)
                    if (matched) newArr.push(matched)

                })
                
                shortCuts = newArr
                saveToLocalStorage()
                
            }
        });

    })

};

cancelBtn.addEventListener("click" , () => {
    overlayBg.classList.add("hidden")
    userShortCutName.value = "";
    userShortCutUrl.value = "";
});
    
[userShortCutName, userShortCutUrl].forEach(inp => {

  inp.addEventListener("input", () => {

    if (userShortCutName.value.length >= 1 && userShortCutUrl.value.length >= 1) {
        doneBtn.classList.remove("hover:cursor-not-allowed")
        doneBtn.classList.add("hover:cursor-pointer")
    } else {
        doneBtn.classList.add("hover:cursor-not-allowed")
        doneBtn.classList.remove("hover:cursor-pointer")
    }

  })

})

doneBtn.addEventListener("click" , () => {
    
    let name = userShortCutName.value.trim()
    let url = userShortCutUrl.value.trim()
    if (!name || !url) return

    if ( shortCuts.some((s , i) => s.name.toLowerCase() === name.toLowerCase() && i != doneBtn.dataset.index) )  {
        alert("Shortcut with this name already exists!");
        return;
    }

    if (doneBtn.dataset.mode === "edit") {
        let index = doneBtn.dataset.index
        shortCuts[index] = { name , url }
    }
    else {
        shortCuts.push({ name , url })
    }

    saveToLocalStorage()
    mapShortCuts()
    
    overlayBg.classList.add("hidden")
    userShortCutName.value = ""
    userShortCutUrl.value = ""

})