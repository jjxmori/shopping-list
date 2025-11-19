const button = document.getElementById("enter");
const input = document.getElementById("userInput");
const ul = document.querySelector("ul");

// Load tasks from localStorage on page load
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("shoppingList")) || [];
    tasks.forEach((task) => {
        createTaskElement(task.text, task.done, task.id);
    });
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach((li) => {
        tasks.push({
            id: li.dataset.id,
            text: li.querySelector("span").textContent,
            done: li.classList.contains("done"),
        });
    });
    localStorage.setItem("shoppingList", JSON.stringify(tasks));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function createButtons(item) {
    const delBtn = document.createElement("button");
    const btnWrapper = document.createElement("div");

    delBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    delBtn.classList.add("delete-btn");

    btnWrapper.classList.add("li-buttons");
    btnWrapper.append(delBtn);
    item.append(btnWrapper);

    delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        item.classList.add("removing");
        setTimeout(() => {
            item.remove();
            saveTasks(); // Save after deletion
        }, 300);
    });

    item.addEventListener("click", (e) => {
        if (e.target.closest(".delete-btn")) return;

        item.classList.toggle("done");
        if (item.classList.contains("done")) {
            createConfetti(item);
        }
        saveTasks(); // Save after toggling done state
    });
}

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

    // Calculate center of the list item
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const confetti = document.createElement("div");
        confetti.style.position = "fixed";
        confetti.style.left = centerX + "px";
        confetti.style.top = centerY + "px";
        confetti.style.width = "6px";
        confetti.style.height = "6px";
        confetti.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = "50%";
        confetti.style.pointerEvents = "none";
        confetti.style.zIndex = "1000";

        document.body.appendChild(confetti);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50 + Math.random() * 30;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        confetti.animate(
            [
                { transform: "translate(0, 0) scale(1)", opacity: 1 },
                {
                    transform: `translate(${tx}px, ${ty}px) scale(0)`,
                    opacity: 0,
                },
            ],
            {
                duration: 600,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            }
        );

        setTimeout(() => confetti.remove(), 600);
    }
}

function createTaskElement(text, isDone = false, id = null) {
    const li = document.createElement("li");
    const itemText = document.createElement("span");

    li.dataset.id = id || generateId();
    itemText.textContent = text;
    li.appendChild(itemText);

    if (isDone) {
        li.classList.add("done");
    }

    createButtons(li);
    ul.appendChild(li);
}

function addToList() {
    const listContainer = document.querySelector(".list-container");
    const text = input.value.trim();

    createTaskElement(text);
    saveTasks(); // Save after adding new task

    input.value = "";
    input.focus();

    listContainer.scrollTop = listContainer.scrollHeight;
}

function isValidInput() {
    return input.value.trim().length > 0;
}

button.addEventListener("click", () => {
    if (isValidInput()) addToList();
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && isValidInput()) addToList();
});

// Load tasks when page loads
loadTasks();

// Focus input on load
input.focus();
