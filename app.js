let mainSect = document.getElementById("mainSect")
let addIconSect = document.getElementById("addIconSect")

let cancelBtn = document.getElementById("cancelBtn")
let addShortCut = document.getElementById("addShortCut")

let userShortCutName = document.getElementById("userShortCutName")
let userShortCutUrl = document.getElementById("userShortCutUrl")



addShortCut.addEventListener("click" , () => {

    mainSect.classList.add("hidden")
    addIconSect.classList.remove("hidden")

})

cancelBtn.addEventListener("click" , () => {

    mainSect.classList.remove("hidden")
    addIconSect.classList.add("hidden")
})
