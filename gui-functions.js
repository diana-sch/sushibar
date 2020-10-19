// initialize the table object to be globally available
var table = new Table;

// set number of seats around the table
function setSize() {
    var size = parseInt(document.getElementById("tableSize").value);
    if (size > 0) {
        table.setTable(size);
        drawTable();
        document.getElementById("setSize").disabled = true;    
    }
}

// draw evenly spaced circles as seats around a parent circle as table
function drawTable() {
    const parentdiv = document.getElementById("parentdiv");
    var div = 360 / table.seats.length;
    var radius = 150;
    var offsetToParentCenter = parseInt(parentdiv.offsetWidth / 2);
    var offsetToChildCenter = 20;
    var totalOffset = offsetToParentCenter - offsetToChildCenter;
    
    for (var i = 1; i <= table.seats.length; i++) {
        var childdiv = document.createElement('div');
        childdiv.className = 'div2';
        childdiv.style.position = 'absolute';
        var y = Math.sin((div * i) * (Math.PI / 180)) * radius;
        var x = Math.cos((div * i) * (Math.PI / 180)) * radius;
        childdiv.style.top = (y + totalOffset).toString() + "px";
        childdiv.style.left = (x + totalOffset).toString() + "px";
        parentdiv.appendChild(childdiv);
    }
}

// after every adding and removing of a group, paint the seats according to their availability:
// free = white, taken = black
function updateColors() {
    getFreeSeats();
    showGroupList();
    const nodes = document.getElementById("parentdiv").children;   
    for (let i = 0; i< table.seats.length; i++) {
        if (table.seats[i] == false) {
            nodes[i].style.backgroundColor = "white";
        } else {
            nodes[i].style.backgroundColor = "black";
        }  
    }
    
}

// after every adding and removing of a group, update the group list
function showGroupList() {
    const parent = document.getElementById("groupList");
    while (parent.firstChild) {
        parent.firstChild.remove()
    }
    for (var i=0; i<table.groups.length; i++) {
        var newLi = document.createElement("LI");
        var inhalt = document.createTextNode("Group ID: "+ table.groups[i].groupId + ", Group size: " + table.groups[i].groupSize);
        newLi.appendChild(inhalt);
        parent.appendChild(newLi);
    } 
}
// add group of given size
function newGroup() {
    var newGroup = parseInt(document.getElementById("groups").value);
    if (newGroup >= 1) {
        addGroup(newGroup);
        updateColors();
    }
}

// remove group of given id
function deleteGroup() {
    var leavingGroup = parseInt(document.getElementById("groupId").value);
    removeGroup(leavingGroup);
    updateColors();
}

