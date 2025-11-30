window.onload = function () {

    // room prices per night
    const prices = {
        "Deluxe Room": 100,
        "Executive Room": 150,
        "Family Room": 200,
        "Twin Room": 150
    };

    let checkin = document.getElementById("checkin");
    let checkout = document.getElementById("checkout");
    let roomtype = document.getElementById("roomtype");
    let output = document.getElementById("price-output");

    // disable check out untill checkin is filled to prevent error, other wise user were just able to chose checkout and book the room
    checkout.disabled = true;

    // avoid selecting checkindate of yesterday in real world
    let today = new Date().toISOString().split("T")[0];
    checkin.min = today;

    // when user select checkin the checkout is enabled 
    checkin.onchange = function () {

        checkout.disabled = false;

        // checkout date choosing (check-in + 1 day)
        let nextDay = new Date(checkin.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkout.min = nextDay.toISOString().split("T")[0];

        // Clear incorrect checkout value
        if (checkout.value < checkout.min) {
            checkout.value = "";
        }

        calculatePrice();
    };

    // When checkout or room type changes
    checkout.onchange = calculatePrice;
    roomtype.onchange = calculatePrice;

    // function for calculating price to display
  function calculatePrice() {

        // wait intill user fill checkin , checkout, and roomtype the will display the prices
        if (!checkin.value || !checkout.value || !roomtype.value) {
            output.innerHTML = "";
            return;
        }

        // Convert dates into JS Date objects
        let start = new Date(checkin.value);
        let end = new Date(checkout.value);

        // calculate nights
        let nights = (end - start) / (1000 * 60 * 60 * 24);

        if (nights <= 0) {
            output.innerHTML = "";
            return;
        }

        // Get price per night and total
        let pricePerNight = prices[roomtype.value];
        let total = nights * pricePerNight;

        // display result
        output.innerHTML =
            "Nights: " + nights + "<br>" +
            "Price per night: £" + pricePerNight + "<br>" +
            "Total: £" + total;
        
    } 
};