// function runQuiz(questions, minutes) {
//     let index = 0;
//     let selectedVariant = null;
//     const answers = [];

//     const questionEl = document.getElementById("question");
//     const variantsEl = document.getElementById("variants");
//     const nextBtn = document.getElementById("nextBtn");
//     const progressEl = document.getElementById("progress");
//     const timerEl = document.getElementById("timer");

//     let timeLeft = minutes * 60; // sekundga o'tkazamiz
//     let timerInterval;

//     function startTimer(resolve) {
//         timerEl.textContent = formatTime(timeLeft);

//         timerInterval = setInterval(() => {
//             timeLeft--;
//             timerEl.textContent = formatTime(timeLeft);

//             if (timeLeft <= 0) {
//                 clearInterval(timerInterval);
//                 finishQuiz(resolve, true);
//             }
//         }, 1000);
//     }

//     function formatTime(seconds) {
//         const m = Math.floor(seconds / 60);
//         const s = seconds % 60;
//         return `${m}:${s < 10 ? "0" + s : s}`;
//     }

//     function loadQuestion() {
//         selectedVariant = null;
//         variantsEl.innerHTML = "";

//         const q = questions[index];
//         questionEl.textContent = q.question;
//         progressEl.textContent = `Savol ${index + 1} / ${questions.length}`;

//         q.variants.forEach(variant => {
//             const div = document.createElement("div");
//             div.className = "variant";
//             div.textContent = variant.text;

//             div.onclick = () => {
//                 document.querySelectorAll(".variant")
//                     .forEach(el => el.classList.remove("active"));

//                 div.classList.add("active");
//                 selectedVariant = variant;
//             };

//             variantsEl.appendChild(div);
//         });
//     }

//     function finishQuiz(resolve, isTimeOver = false) {
//         clearInterval(timerInterval);

//         questionEl.textContent = isTimeOver
//             ? "⏰ Vaqt tugadi!"
//             : "Test yakunlandi!";

//         variantsEl.innerHTML = "<p style='text-align:center'>Natijalar yuborildi!</p>";
//         nextBtn.style.display = "none";
//         progressEl.textContent = "";

//         showNotification("", "Natijalar muvaffaqiyatli yuborildi", "success", 3000)

//         resolve(answers);
//     }

//     return new Promise((resolve) => {
//         nextBtn.onclick = () => {
//             if (!selectedVariant) {
//                 showNotification("", "Iltimos variant tanlang!", "warning", 3000)
//                 return;
//             }

//             answers.push({
//                 questionId: questions[index].id,
//                 answerVariantId: selectedVariant.id
//             });

//             index++;

//             if (index < questions.length) {
//                 loadQuestion();
//             } else {
//                 finishQuiz(resolve);
//             }
//         };

//         loadQuestion();
//         startTimer(resolve);
//     });
// }

function runQuiz(questions, minutes) {
    let index = 0;
    let selectedVariant = null;
    let correctAnswers = 0;

    const questionEl = document.getElementById("question");
    const variantsEl = document.getElementById("variants");
    const nextBtn = document.getElementById("nextBtn");
    const progressEl = document.getElementById("progress");
    const timerEl = document.getElementById("timer");

    let timeLeft = minutes * 60;
    let timerInterval;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" + s : s}`;
    }

    function startTimer(resolve) {
        timerEl.textContent = formatTime(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                finishQuiz(resolve, true);
            }
        }, 1000);
    }

    function loadQuestion() {
        selectedVariant = null;
        variantsEl.innerHTML = "";

        const q = questions[index];
        questionEl.textContent = q.question;
        progressEl.textContent = `Savol ${index + 1} / ${questions.length}`;

        q.variants.forEach(variant => {
            const div = document.createElement("div");
            div.className = "variant";
            div.textContent = variant.text;

            div.onclick = () => {
                document
                    .querySelectorAll(".variant")
                    .forEach(el => el.classList.remove("active"));

                div.classList.add("active");
                selectedVariant = variant;
            };

            variantsEl.appendChild(div);
        });
    }

    function finishQuiz(resolve, isTimeOver = false) {
        clearInterval(timerInterval);

        questionEl.textContent = isTimeOver
            ? "⏰ Vaqt tugadi!"
            : "Test yakunlandi!";

        variantsEl.innerHTML = `
            <p style="font-size:16px">
                Siz ${questions.length} ta savoldan
                ${correctAnswers} tasiga to'g'ri javob berdingiz ✅
            </p>
        `;

        nextBtn.style.display = "none";
        progressEl.textContent = "";
        timerEl.textContent = "";

        resolve({
            questions: questions.length,
            correctAnswers: correctAnswers
        });
    }

    return new Promise((resolve) => {
        nextBtn.onclick = () => {
            if (!selectedVariant) {
                showNotification("", "Iltimos variant tanlang!", "warning", 3000);
                return;
            }

            if (selectedVariant.is_correct) {
                correctAnswers++;
            }

            index++;

            if (index < questions.length) {
                loadQuestion();
            } else {
                finishQuiz(resolve);
            }
        };

        loadQuestion();
        startTimer(resolve);
    });
}

function showNotification(
    title,
    text,
    type = "info",
    duration = 3000
) {
    const container = document.getElementById("notification-container");

    const icons = {
        success: "✓",
        error: "✕",
        warning: "!",
        info: "i"
    };

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    notification.innerHTML = `
    <div class="notification-icon">${icons[type]}</div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-text">${text}</div>
      <div class="notification-progress">
        <div class="notification-progress-bar"></div>
      </div>
    </div>
  `;

    container.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    const bar = notification.querySelector(".notification-progress-bar");
    bar.animate(
        [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
        { duration, easing: "linear", fill: "forwards" }
    );

    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hide");

        setTimeout(() => notification.remove(), 450);
    }, duration);
}

const SERVER = "http://localhost:3051"


// {
//     id: 5,
//     question: "CSS nima qiladi? 2",
//     variants: [
//         { id: 1, text: "Ma’lumot saqlaydi" },
//         { id: 2, text: "Dizayn beradi" },
//         { id: 3, text: "Server yozadi" },
//         { id: 4, text: "Test qiladi" }
//     ]
// }

async function sendRequest(url, method, body = null) {
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        showNotification("Error", "Xatolik yuz berdi 1", "error", 3000)
        console.log(error)
        return null;
    }
}

function parseDMY(dateStr) {
    const [day, month, year] = dateStr.split(":");
    return new Date(year, month - 1, day);
}

function isSameDateDMY(d1, d2) {
    const date1 = parseDMY(d1);
    const date2 = parseDMY(d2);

    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

const questions = []

function randomArr(arr) {
    const result = [...arr]

    for (let i = result.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
    }

    return result;
}



const loadData = async () => {
    try {
        const questionsData = await sendRequest(`${SERVER}/api/questions`, "GET")

        for (let i = 0; i < questionsData.length; i++) {
            const question_id = questionsData[i].id
            const question_text = questionsData[i].body

            const options = await sendRequest(`${SERVER}/api/options/question/${question_id}`, "GET")

            const variants = []

            for (let i = 0; i < options.length; i++) {
                variants.push({ id: options[i].id, text: options[i].option_text, is_correct: options[i].is_correct })
            }

            questions.push({ id: question_id, question: question_text, variants })
        }
        hideLoader()

        const timer = await sendRequest(`${SERVER}/api/timer`, 'GET')
        const results = await runQuiz(randomArr(questions), timer.time)
        const user = window.Telegram.WebApp.initDataUnsafe.user
        const user_id = user.id
        const first_name = user.first_name || "first_name"
        const last_name = user.last_name
        const full_name = first_name + (last_name || "")

        const time = await sendRequest(`${SERVER}/api/time`, "GET")
        await sendRequest(
            `${SERVER}/api/userresults`,
            "POST",
            {
                questions: results.questions,
                correctAnswers: results.correctAnswers,
                user_id: user_id,
                date: time.date
            }
        )

        await sendRequest(`${SERVER}/api/users`, "POST", { user_id, full_name })
        showNotification("", "Natijalar muvaffaqiyatli yuborildi", "success", 3000)
    } catch (err) {
        showNotification("", "xatolik yuz berdi 2", "error", 3000)
        console.log(err)
    }
}

function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}

function showQuiz() {
    document.getElementById("quiz_card").classList.remove("hidden")
    document.getElementById("box").classList.add("hidden")
}


document.addEventListener("DOMContentLoaded", async () => {
    try {
        showLoader()
        const timer = await sendRequest(`${SERVER}/api/timer`, "GET")

        const box_p = document.getElementById("box_p")
        box_p.textContent = `Barcha savollarga javob berish uchun umumiy ${timer.time} daqiqa vaqtingiz bor!`
        hideLoader()
    } catch (err) {
        showNotification("Error", "Xatolik yuz berdi 3", "error", 3000)
        console.log(err)
    }
})

const box_btn = document.getElementById("box_btn")
box_btn.addEventListener("click", async (ctx) => {
    try {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
            const user_id = window.Telegram.WebApp.initDataUnsafe.user.id

            const data = await sendRequest(`${SERVER}/api/userresults/${user_id}`, "GET")
            console.log(data)
            const time = await sendRequest(`${SERVER}/api/time`, "GET")
            console.log(time)

            if (data) {
                if (isSameDateDMY(data.date, time.date)) {
                    showNotification("", "Siz bugun qatnashib bo'lgansiz ertaga urinib ko'ring!", "warning", 3000)
                    return
                } else {
                    showLoader()
                    showQuiz()
                    await loadData()
                }
            }


        } else {
            showNotification("Error", "Telegram WebApp orqali kiring!", "error", 3000);
        }
    } catch (err) {
        showNotification("Error", "Xatolik yuz berdi", "error", 3000)
        console.log(err)
    }
})