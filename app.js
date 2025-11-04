let mainSect = document.getElementById("mainSect")
let addIconSect = document.getElementById("addIconSect")
let shortCutsDiv = document.getElementById("shortCutsDiv")

let addShortCut = document.getElementById("addShortCut")
let cancelBtn = document.getElementById("cancelBtn")
let doneBtn = document.getElementById("doneBtn")

let userShortCutName = document.getElementById("userShortCutName")
let userShortCutUrl = document.getElementById("userShortCutUrl")

let shortCuts = JSON.parse(localStorage.getItem("shortCuts")) || [
    {
        name : "webstore",
        url : "https://chromewebstore.google.com/"
    }
]

function saveToLocalStorage() {
    localStorage.setItem("shortCuts" , JSON.stringify(shortCuts))
}

function mapShortCuts() {
    let shortCutLclStrg = JSON.parse(localStorage.getItem("shortCuts")) || []

    if (shortCutLclStrg.length === 0) {
        shortCutLclStrg = [
            {
                name : "webstore",
                url : "https://chromewebstore.google.com/"
            }
        ]
    }

    shortCutsDiv.innerHTML = ""

    shortCutLclStrg.map((shortCut) => {

        if (!shortCut || !shortCut.url) return

        // Generate favicon URL from Google API
        let domain = new URL(shortCut.url).hostname
        let favicon = `https://www.google.com/s2/favicons?domain=${domain}`;

        shortCutsDiv.innerHTML +=
        `<div draggable="true" class="icon flex flex-col items-center hover:bg-gray-100 px-6 py-3 rounded-md space-y-3 hover:cursor-pointer">
            <a href="${shortCut.url}" target="_blank">
                <img class="w-[58px] text-gray-200 bg-gray-200 px-3.5 py-3.5 rounded-full" src="${favicon}" alt="">
            </a>
            <p class="text-[13px] font-medium">${shortCut.name}</p>
        </div>
        `
    })

    shortCutsDiv.innerHTML +=
    `<div draggable="false" id="addShortCut" class="flex flex-col items-center hover:bg-gray-100 px-4 py-3 rounded-md space-y-3 hover:cursor-pointer">
        <i class="fa-solid fa-plus text-[23px] before:flex before:flex-row before:justify-center bg-gray-200 rounded-full text-gray-500 px-7.5 py-4.5"></i>
        <p class="text-[12px] font-medium">Add Shortcut</p>
    </div>
    `
    
    document.getElementById("addShortCut").addEventListener("click" , () => {

        mainSect.classList.add("hidden")
        addIconSect.classList.remove("hidden")

    })

    enableDragAndDrop()
}

mapShortCuts()

function enableDragAndDrop() {

    let icons = document.querySelectorAll(".icon")
    let draggedItem = null

    icons.forEach((icn) => {

        icn.addEventListener("dragstart" , () => {
            draggedItem = icn
            icn.classList.add("opacity-50")
        })

        icn.addEventListener("dragend" , () => {
            draggedItem = null
            icn.classList.remove("opacity-50")
            saveToLocalStorage();
        })

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
        })

    })

}

cancelBtn.addEventListener("click" , () => {

    mainSect.classList.remove("hidden")
    addIconSect.classList.add("hidden")

})

doneBtn.addEventListener("click" , () => {

    let name = userShortCutName.value.trim()
    let url = userShortCutUrl.value.trim()

    if (name && url) {
        
        shortCuts.push({
            name: name,
            url: url
        })

        saveToLocalStorage()
        mapShortCuts()

    }
    
    userShortCutName.value = ""
    userShortCutUrl.value = ""
    
    mainSect.classList.remove("hidden")
    addIconSect.classList.add("hidden")

})