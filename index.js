<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function () {
    const clouds = document.querySelectorAll(".cloud");
    const lightning = document.querySelector(".lightning");

    clouds.forEach((cloud, index) => {
        let speed = 25 + index * 5; // Different speeds for realism
        cloud.style.animationDuration = `${speed}s`;
    });

    // Lightning effect randomness
    function triggerLightning() {
        lightning.style.animation = "none"; // Reset animation
        setTimeout(() => {
            lightning.style.animation = "lightningStrike 6s infinite";
        }, Math.random() * 5000 + 3000); // Random interval between 3s to 5s
    }

    setInterval(triggerLightning, 7000);
});
=======
document.addEventListener("DOMContentLoaded", function () {
    const clouds = document.querySelectorAll(".cloud");
    const lightning = document.querySelector(".lightning");

    clouds.forEach((cloud, index) => {
        let speed = 25 + index * 5; // Different speeds for realism
        cloud.style.animationDuration = `${speed}s`;
    });

    // Lightning effect randomness
    function triggerLightning() {
        lightning.style.animation = "none"; // Reset animation
        setTimeout(() => {
            lightning.style.animation = "lightningStrike 6s infinite";
        }, Math.random() * 5000 + 3000); // Random interval between 3s to 5s
    }

    setInterval(triggerLightning, 7000);
});
>>>>>>> b2744ed (add)
