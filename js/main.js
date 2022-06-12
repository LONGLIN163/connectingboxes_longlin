let boxArr=[] // Store the info of the selected boxes
const lineContainer=document.getElementById("lineContainer") // Store the connecting line

// 1. Select boxes
$(".smallbox").on("click",this,function(){
    // 1.1 Check if there is any connection created
    if(lineContainer.childNodes.length!==0){
        alert("There is a connection exist, please reset the panel")
        return
    }
    // 1.2 Check if the box has been selected
    let hasItemInboxArr=false;
    for(k of boxArr){
        if(k.id===this.id){
            hasItemInboxArr=true
        }
    }
    if(hasItemInboxArr===true){ // If the clicked item has been selected before, remove selected class and remove this selected box info from the boxArr
        $(this).toggleClass("redBorder")
        boxArr=boxArr.filter(item=>item.id!==this.id) 
    }else{ // If the clicked item has not been selected, set selected and add this selected box info to the boxArr
        $(this).toggleClass("redBorder")
        boxArr.push(
            {
                id:this.id,
                rowNumber:$(this).attr("data-row"),
                rowIndex:$(this).attr("data-index")
            }
        )
    }
    // 1.3 Reorder the boxArr list for drawing the line
    boxArr.sort(function(a, b) {
        const idA = a.id.toUpperCase(); 
        const idB = b.id.toUpperCase(); 
        if (idA < idB) {
            return -1;
        }
        if (idA > idB) {
            return 1;
        }
        return 0;
    });            
})

// 2. Connect boxes
$("#connect").click(function() {
    connect(boxArr,lineContainer);
});

// 3. Reset boxes
$("#reset").click(function() {
    // 3.1 Prevent unnecessary reset
    if(boxArr.length===0){
        alert("There is no any selected box yet!")
        return
    }else{ 
        if(lineContainer.childNodes.length!==0){ // If there is already some connection, remove the connection and selected class, empty boxArr. 
            lineContainer.firstElementChild.remove()
            boxArr=[]
            $(".smallbox").removeClass("redBorder")
        }else{// If there is no any connection, remove selected class, empty boxArr. 
            boxArr=[]
            $(".smallbox").removeClass("redBorder")
        }
    }
    $("#connect").attr("disabled",false) 
});

/** 
 * Collect selected boxs' info and connect them with svg lines.
 * @param {object[]} arr - collect each selected box's info(contain id and some custom attributes)
 * @return {null}
 */
function connect(arr){
    // 1. Create polyline
    const pl=document.createElementNS("http://www.w3.org/2000/svg","polyline")
    
    // 2. Calc coordinate points according to the different conditions and connecting them
    let coordinates
    const boxLength=100
    const middleBar=` ${boxLength*1.5},${boxLength*0.5} ${boxLength*1.5},${boxLength*2.5} `
    if(arr.length<2){
        alert("You need to choose at least 2 box!")
        return
    }else if(arr.length===2){ // Connect 2 boxes
        if(arr[0].rowNumber===arr[1].rowNumber){
            if(arr[0].rowNumber==="line1"){
                coordinates=`${boxLength},${boxLength*0.5} ${boxLength*2},${boxLength*0.5}`
            }else{
                coordinates=`${boxLength},${boxLength*2.5} ${boxLength*2},${boxLength*2.5}`
            }
        }else if(arr[0].rowNumber!==arr[1].rowNumber){
            if(arr[0].rowIndex===arr[1].rowIndex && arr[0].rowIndex==="1"){
                coordinates=`${boxLength*0.5},${boxLength} ${boxLength*0.5},${boxLength*2}`
            }else if(arr[0].rowIndex===arr[1].rowIndex && arr[0].rowIndex==="2"){
                coordinates=`${boxLength*2.5},${boxLength} ${boxLength*2.5},${boxLength*2}`
            }else if(arr[0].rowIndex!==arr[1].rowIndex && arr[0].rowIndex==="1"){
                coordinates=`${boxLength},${boxLength*0.5}`+`${middleBar}`+`${boxLength*2},${boxLength*2.5}`
            }else if(arr[0].rowIndex!==arr[1].rowIndex && arr[0].rowIndex==="2"){
                coordinates=`${boxLength*2},${boxLength*0.5}`+`${middleBar}`+`${boxLength},${boxLength*2.5}`
            }else{
                alert("wooo, there is a bug!")
            }
        }else{
            alert("wooo, there is a bug!")
        }
    }else if(arr.length===3){ // Connect 3 boxes
        let counter=0
        for(k of arr){
            if(k.rowNumber==="line1") counter++
        }
        if(counter<2){
            if(arr[0].rowIndex==="1"){
                coordinates=`${boxLength},${boxLength*0.5}`+
                `${middleBar}`+
                `${boxLength},${boxLength*2.5} ${boxLength*2},${boxLength*2.5}`
            }else if(arr[0].rowIndex==="2"){
                coordinates=`${boxLength*2},${boxLength*0.5}`+
                `${middleBar}`+
                `${boxLength},${boxLength*2.5} ${boxLength*2},${boxLength*2.5}`
            }
        }else{
            if(arr[2].rowIndex==="1"){
                coordinates=`${boxLength},${boxLength*0.5} ${boxLength*2},${boxLength*0.5}`+
                    `${middleBar}`+
                    `${boxLength},${boxLength*2.5}`
            }else if(arr[2].rowIndex==="2"){
                coordinates=`${boxLength},${boxLength*0.5} ${boxLength*2},${boxLength*0.5}`+ 
                    `${middleBar}`+
                    `${boxLength*2},${boxLength*2.5}`
            }
        }
    }
    else{ // Connect all the boxes
        coordinates=`${boxLength},${boxLength*0.5} ${boxLength*2},${boxLength*0.5}`+ 
        `${middleBar}`+
        `${boxLength},${boxLength*2.5} ${boxLength*2},${boxLength*2.5}` 
    }

    // 3. Set points attr and value,mount the lines to the lineContainer
    pl.setAttribute("points",coordinates)
    lineContainer.appendChild(pl)

    $("#connect").attr("disabled",true)
}