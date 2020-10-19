// Table object that represents the seats around the table
function Table() {
    this.seats = [];
    this.freeSeats = [];
    this.groups = [];

    // set size of the table
    this.setTable = function(n) {
        for (var i = 0; i < n; i++) {
            this.seats.push(false);
        }
    }
    // after every adding or removing of a group, update the seats according to their availability
    // false = free, true = taken
    // use checker to make sure all of required seats (howMany) have been updated
    this.update = function(comeOrGo, from, howMany) {
        var checker = 0;
        for (let i = from; i < from + howMany; i++) {
            if (i <= table.seats.length-1) {
                this.seats[i] = comeOrGo;
                checker++;
            }
            // if end of seats array is reached, but checker is smaller than howMany, start from beginning of the array
            // and update the remaining seats
            else if (checker < howMany) {
                for (let i = 0; i < howMany - checker; i++) {
                    this.seats[i] = comeOrGo;
                }
                
            }
        }    
       
        }
}

// object to store free raws of seats and the index of the first seat in the row
function FreeSeat() {
    this.seatCount = 0;
    this.firstSeat = undefined;
}
// object to store groups that are sitting at the table
function Group() {
    this.groupSize = 0;
    this.firstSeat = undefined;
    this.groupId = undefined;
}

// counts unbroken sequences of free seats around the table and stores them as objects to the freeSeats array of the Table object
// while noting their count and the index of the first free seat in that sequence
function getFreeSeats() {
    table.freeSeats = [];
    var seatCounter = 0;
    var firstLast = (table.seats[0] == false && table.seats[table.seats.length-1] == false) ? true : false;

    for (let i = 0; i < table.seats.length; i++) {
        if (table.seats[i] == false) {
            seatCounter++;
        }
        // if taken seat is found, store the free seats before it and reset the counter
        else {
            if (seatCounter != 0) {
                var platz = new FreeSeat();               
                platz.firstSeat = i - seatCounter;
                platz.seatCount = seatCounter; 
                table.freeSeats.push(platz);
                seatCounter = 0;
            }
        }
        // when the end of the table is reached, continue counting free seats from the start of the table to "connect" both ends
        // as "circle"
        if (i == table.seats.length-1 && seatCounter != 0) {
            if (firstLast == true && seatCounter != table.seats.length) {
                var platz = new FreeSeat(); //
                platz.firstSeat = i - seatCounter + 1; //
                platz.seatCount = seatCounter + table.freeSeats[0].seatCount;
                table.freeSeats.push(platz); //
                table.freeSeats.splice(0, 1);
            } 
            // if all seats are free, there is no need for the "connection trick"
            else {
                var platz = new FreeSeat(); //                
                platz.firstSeat = i - seatCounter + 1; //
                platz.seatCount = seatCounter; 
                table.freeSeats.push(platz); //
            }
        }
    }
    return table.freeSeats;
}

// returns the greatest free seat row which will be used for deciding about placement of new groups in the addGroup() function
function getMax() {
    var seats = getFreeSeats();
    var max = seats[0];
    for (var i = 0; i<seats.length-1; i++) {
        if (seats[i+1].seatCount > seats[i].seatCount) {
            max = seats[i+1];
        }
    }
    return max;
}

// place a group of k to the table
function addGroup(k) {
    var seats = getFreeSeats();
    var max = getMax();
    var firstPlace;
    var placeFound = false;

    for (var i = 0; i< seats.length; i++) {
        // first check if free seat row exists that matches the group size exactly, if yes, choose it
        if (seats[i].seatCount == k) {
            firstPlace = seats[i].firstSeat;
            placeFound = true;
            break;
        }
        // or check if any free seat row exists where the group could fit into 
        // if yes, choose the greatest one to spare space for future smaller groups
        else if (k < max.seatCount ) {
            firstPlace = max.firstSeat;
            placeFound = true;
        }
        
    }
    // if places for the group were found, update the table seats and store the group as Group object in the groups array of Table object
    if (placeFound == true) {
        table.update(true, firstPlace, k);
        var group = new Group();
        group.groupSize = k;
        group.firstSeat = firstPlace;
        // add group Id to ease their removing later       
        if (table.groups.length != 0) {
            group.groupId = table.groups[table.groups.length-1].groupId + 1;
        } else group.groupId = 1;
        table.groups.push(group);      
    } else alert("there are not enough places for this group :(");
}

// remove group of given index and set the seats in the seat array as free
function removeGroup(k) {
    for (let i = 0; i < table.groups.length; i++) {
        if (table.groups[i].groupId == k) {
            table.update(false, table.groups[i].firstSeat, table.groups[i].groupSize);
            table.groups.splice(i, 1);
            break;
        }
    }
}