window.onload = function () {

    // Room prices per night
    const prices = {
        "Deluxe Room": 120,
        "Executive Room": 150,
        "Family Room": 180,
        "Twin Room": 100
    };

    let checkin = document.getElementById("checkin");
    let checkout = document.getElementById("checkout");
    let roomtype = document.getElementById("roomtype");
    let output = document.getElementById("price-output");

    // Disable checkout until check-in is selected
    checkout.disabled = true;

    // Stop selecting past check-in dates
    let today = new Date().toISOString().split("T")[0];
    checkin.min = today;

    // When user selects check-in date
    checkin.onchange = function () {

        // Enable checkout now
        checkout.disabled = false;

        // Set minimum checkout date (check-in + 1 day)
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

    // Price calculator function
    function calculatePrice() {

        // If any field is empty → do nothing
        if (!checkin.value || !checkout.value || !roomtype.value) {
            output.innerHTML = "";
            return;
        }

        // Convert dates into JS Date objects
        let start = new Date(checkin.value);
        let end = new Date(checkout.value);

        // Calculate nights
        let nights = (end - start) / (1000 * 60 * 60 * 24);

        if (nights <= 0) {
            output.innerHTML = "";
            return;
        }

        // Get price per night and total
        let pricePerNight = prices[roomtype.value];
        let total = nights * pricePerNight;

        // Show result
        output.innerHTML =
            "Nights: " + nights + "<br>" +
            "Price per night: £" + pricePerNight + "<br>" +
            "Total: £" + total;
    }
};
