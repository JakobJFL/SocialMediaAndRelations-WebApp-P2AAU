function startCountDown() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours("16");
    tomorrow.setMinutes("00");
    let countDownDate = new Date(tomorrow).getTime();
    setTime(countDownDate);

    // Update the count down every 1 second
    let x = setInterval(function() {
        setTime(countDownDate);
    }, 1000);

    function setTime(countDownDate) {
        let now = new Date().getTime();
        
        // Find the distance between now and the count down date
        let distance = countDownDate - now;
        
        // Time calculations for hours and minutes
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
        // Output the result in element
        if (document.getElementById("countdown"))
            document.getElementById("countdown").innerHTML = "Ny gruppe om: " + hours + "t " + minutes + "m ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "Du får ny gruppe nu";
        }
    }
}
