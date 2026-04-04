const form = document.getElementById("form");
const status = document.getElementById("status");


function showMessage(msg, isError = false) {
    status.textContent = msg;
    status.style.color = isError ? "red" : "green";
}


function validate(name, id, value) {
    if (!name || !value) return "All fields are required!";
    if (isNaN(id) || id <= 0) return "Invalid ID!";
    return null;
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const id = Number(document.getElementById("id").value);
    const idpr = Number(document.getElementById("idpr").value);
    const value = document.getElementById("value").value.trim();


    const error = validate(name, id, value);
    if (error) {
        showMessage(error, true);
        return;
    }

    const data = { name, id, idpr, value };

    try {
        showMessage("Saving...");

        const res = await fetch("/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Server error");

        const msg = await res.text();

        showMessage(msg);
        form.reset();


        setTimeout(() => {
            status.textContent = "";
        }, 3000);

    } catch (err) {
        console.error(err);
        showMessage("Failed to save data!", true);
    }
});



const card = document.querySelector('.card');

if (card) {
    card.addEventListener('mousemove', (e) => {

        if (window.innerWidth < 850) {
            card.style.transform = `none`;
            return;
        }

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;


        const tiltX = -y / (rect.height / 2) * 4;
        const tiltY = x / (rect.width / 2) * 4;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease-out';
    });
}