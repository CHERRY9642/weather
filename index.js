document.addEventListener("DOMContentLoaded", () => {
    // Lightning Effect
    function createLightning() {
        const lightning = document.createElement("div");
        lightning.classList.add("lightning");
        document.body.appendChild(lightning);

        setTimeout(() => {
            lightning.remove();
        }, 300);
    }

    setInterval(() => {
        if (Math.random() > 0.8) {
            createLightning();
        }
    }, 2000);
});
