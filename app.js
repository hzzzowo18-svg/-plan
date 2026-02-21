const TASKS_KEY = "daily-planner-tasks";
const SUMMARY_KEY = "daily-planner-summary";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskTemplate = document.querySelector("#task-template");
const summaryInput = document.querySelector("#summary-input");
const saveSummaryBtn = document.querySelector("#save-summary");
const saveTip = document.querySelector("#save-tip");

let tasks = loadTasks();
summaryInput.value = localStorage.getItem(SUMMARY_KEY) || "";
renderTasks();

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (!text) {
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
});

saveSummaryBtn.addEventListener("click", () => {
  localStorage.setItem(SUMMARY_KEY, summaryInput.value.trim());
  saveTip.textContent = `已保存：${new Date().toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
});

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "还没有任务，先写下今天最重要的三件事吧。";
    empty.style.color = "#7280a7";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    const fragment = taskTemplate.content.cloneNode(true);
    const item = fragment.querySelector(".task-item");
    const checkbox = fragment.querySelector(".task-checkbox");
    const text = fragment.querySelector(".task-text");
    const deleteBtn = fragment.querySelector(".delete-btn");

    text.textContent = task.text;
    checkbox.checked = task.done;
    item.classList.toggle("completed", task.done);

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      item.classList.toggle("completed", task.done);
      saveTasks();
    });

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((value) => value.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(fragment);
  });
}
