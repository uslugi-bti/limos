document.addEventListener("DOMContentLoaded", function () {
    function testWebP(callback) {
        var webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    testWebP(function (support) {
        if (support == true) {
            document.querySelector('body').classList.add('webp');
        } else {
            document.querySelector('body').classList.add('no-webp');
        }
    });

    const openSubitems = document.querySelectorAll(".header-bottom__item.sub>span#open");
    const subitems = document.querySelectorAll(".header-bottom__subitems");

    for (let i = 0; i < openSubitems.length; i++) {
        openSubitems[i].addEventListener("click", function () {
            if (openSubitems[i].classList.contains("open")) {
                openSubitems[i].classList.remove("open");
                subitems[i].classList.remove("open");
            } else {
                for (let i = 0; i < openSubitems.length; i++) {
                    openSubitems[i].classList.remove("open");
                    subitems[i].classList.remove("open");
                }
                openSubitems[i].classList.add("open");
                subitems[i].classList.add("open");
            }
        });
    }

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".header-bottom__item.sub>span#open") && !event.target.closest(".header-bottom__subitems")) {
            for (let i = 0; i < openSubitems.length; i++) {
                openSubitems[i].classList.remove("open");
                subitems[i].classList.remove("open");
            }
        }
    });

    const body = document.querySelector("body");
    const headerMenu = document.querySelector(".header-bottom__menu");
    const headerList = document.querySelector(".header-bottom__list");
    const headerClose = document.querySelector(".header-bottom__items>span#close");
    const heroButton = document.querySelector(".hero__button");

    const headerButton = document.querySelector(".header-bottom__button");
    const headerBody = document.querySelector(".header-bottom__body");

    headerMenu.addEventListener("click", function () {
        body.classList.add("header-lock");
        headerList.classList.add("active");
        if (heroButton) {
            heroButton.classList.add("active");
        }
    });

    headerClose.addEventListener("click", function () {
        body.classList.remove("header-lock");
        headerList.classList.remove("active");
        if (heroButton) {
            heroButton.classList.remove("active");
        }
    });

    function moveHeaderButton() {
        const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (viewport_width <= 767) {
            headerList.insertBefore(headerButton, headerList.children[1]);
        } else {
            headerBody.insertBefore(headerButton, headerBody.children[2]);
        }
    }
    moveHeaderButton();
    window.addEventListener("resize", moveHeaderButton);

    if (document.querySelector("form")) {
        const dropDowns = document.querySelectorAll(".form-group ul#dropdown");

        dropDowns.forEach((dropdown) => {
            const input = dropdown.parentNode.querySelector("input");
            const openBtn = dropdown.closest(".form-group").querySelector("span#open");
            const items = dropdown.querySelectorAll("li");

            if (items.length > 0 && input && input.value == "") {
                input.value = items[0].textContent.trim();
            }

            [input, openBtn].forEach((el) => {
                el.addEventListener("click", (e) => {
                    e.stopPropagation();
                    closeAllDropdowns();
                    input.classList.toggle("open");
                    dropdown.classList.toggle("open");
                    openBtn.classList.toggle("open");
                });
            });

            items.forEach((item) => {
                item.addEventListener("click", () => {
                    input.value = item.textContent.trim();
                    input.classList.remove("open");
                    dropdown.classList.remove("open");
                    openBtn.classList.remove("open");
                });
            });
        });

        document.addEventListener("click", () => {
            closeAllDropdowns();
        });

        function closeAllDropdowns() {
            document.querySelectorAll("input").forEach((d) => d.classList.remove("open"));
            document.querySelectorAll("ul#dropdown.open").forEach((d) => d.classList.remove("open"));
            document.querySelectorAll("span#open.open").forEach((b) => b.classList.remove("open"));
        }

        const dateInput = document.querySelector("#date");
        const timeInput = document.querySelector("#time");

        if (dateInput) {
            const dateOpenBtn = dateInput.closest(".form-group").querySelector("span#open");
            const datePicker = flatpickr(dateInput, {
                dateFormat: "D, M d, Y",
                defaultDate: new Date(),
                minDate: "today",
                disableMobile: true,
            });

            dateOpenBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                datePicker.open();
            });
        }

        if (timeInput) {
            const timeOpenBtn = timeInput.closest(".form-group").querySelector("span#open");
            const timePicker = flatpickr(timeInput, {
                enableTime: true,
                noCalendar: true,
                dateFormat: "h:i K",
                defaultDate: new Date(),
                time_24hr: false,
                minuteIncrement: 5,
                disableMobile: true,
            });

            timeOpenBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                timePicker.open();
            });
        }

        document.querySelectorAll(".upload-area").forEach((area) => {
            const maxFiles = parseInt(area.dataset.maxFiles) || 1;
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.multiple = maxFiles > 1;
            fileInput.accept = "image/*";
            fileInput.style.display = "none";
            area.appendChild(fileInput);

            const uploadText = area.querySelector(".upload-text p");
            const uploadIcon = area.querySelector(".upload-icon img");

            area.addEventListener("click", () => fileInput.click());

            area.addEventListener("dragover", (e) => {
                e.preventDefault();
                area.classList.add("dragover");
            });
            area.addEventListener("dragleave", () => {
                area.classList.remove("dragover");
            });

            area.addEventListener("drop", (e) => {
                e.preventDefault();
                area.classList.remove("dragover");

                const files = Array.from(e.dataTransfer.files);
                handleFiles(files);
            });

            fileInput.addEventListener("change", (e) => {
                handleFiles(Array.from(e.target.files));
            });

            function handleFiles(files) {
                if (files.length > maxFiles) {
                    alert(`You can upload up to ${maxFiles} file${maxFiles > 1 ? "s" : ""}.`);
                    return;
                }

                area.classList.add("has-files");

                area.querySelectorAll(".file-preview").forEach((p) => p.remove());

                files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const preview = document.createElement("div");
                        preview.className = "file-preview";
                        preview.innerHTML = `
                            <img src="${e.target.result}" alt="${file.name}">
                            <span class="file-name">${file.name}</span>
                        `;
                        area.appendChild(preview);
                    };
                    reader.readAsDataURL(file);
                });

                uploadText.textContent = `${files.length} file${files.length > 1 ? "s" : ""} selected`;
                uploadIcon.style.opacity = "0.5";
            }
        });
    }

    if (document.querySelector(".hero__form")) {
        function resizeForm() {
            const form = document.querySelector(".hero__form");
            const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const containerWidth = document.querySelector(".container").clientWidth + 30;
            const heroButtonHeight = document.querySelector(".hero__button").clientHeight;

            const resizeWidth = (viewport_width - containerWidth) / 2;

            if (viewport_width > 767) {
                if ((resizeWidth + 15 ) < heroButtonHeight) {
                    form.classList.add("resize");
                } else {
                    form.classList.remove("resize");
                }
            }
        }
        resizeForm();
        window.addEventListener("resize", resizeForm);
    }

    if (document.querySelector(".clients")) {
        const track = document.querySelector('.container');
        const speed = 100;

        function updateAnimation() {
            const width = track.scrollWidth / 2;
            const duration = width / speed;
            track.style.animationDuration = `${duration}s`;
        }

        updateAnimation();
        window.addEventListener('resize', updateAnimation);
    }

    if (document.querySelector(".services .swiper")) {
        const swiper = new Swiper('.services__body.swiper', {
            slidesPerView: 1,
            spaceBetween: 23,

            navigation: {
                nextEl: '.services__button.next',
                prevEl: '.services__button.prev',
            },

            breakpoints: {
                650: {
                    slidesPerView: 'auto',
                },
            },
        });
    }

    if (document.querySelector(".discover")) {
        function paddingDiscover() {
            const discover = document.querySelectorAll(".discover");
            const discoverContent = document.querySelectorAll(".discover__content");
            const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const containerWidth = document.querySelector(".container").clientWidth;

            const padding = ((viewport_width - containerWidth) / 2) + 15;

            for (let i = 0; i < discoverContent.length; i++) {
                if (discover[i].classList.contains("right")) {
                    discoverContent[i].style.paddingRight = padding + "px";
                } else {
                    discoverContent[i].style.paddingLeft = padding + "px";
                }
            }
        }
        paddingDiscover();
        window.addEventListener("resize", paddingDiscover);
    }

    if (document.querySelector(".discover__video")) {
        const openVideo = document.querySelector(".discover-video__icon");
        const popupVideo = document.querySelector(".video-popup");
        const closeVideo = document.querySelector(".video-popup__video>span#close");

        openVideo.addEventListener("click", function () {
            body.classList.add("lock");
            popupVideo.classList.add("open");
        });

        closeVideo.addEventListener("click", function () {
            body.classList.remove("lock");
            popupVideo.classList.remove("open");
        });

        popupVideo.addEventListener("click", function (event) {
            if (!event.target.closest(".video-popup__video")) {
                body.classList.remove("lock");
                popupVideo.classList.remove("open");
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.which == 27) {
                body.classList.remove("lock");
                popupVideo.classList.remove("open");
            }
        });
    }

    if (document.querySelector(".testimonials")) {
        const swiper = new Swiper('.testimonials__slider.swiper', {
            slidesPerView: 1,
            spaceBetween: 21,

            navigation: {
                nextEl: '.testimonials__button.next',
                prevEl: '.testimonials__button.prev',
            },

            breakpoints: {
                1600: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
            },
        });
    }

    if (document.querySelector(".feedbacks")) {
        const swiper = new Swiper('.feedbacks__body.swiper', {
            slidesPerView: 1,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
            },
            loop: true,
        });
    }

    if (document.querySelector(".fleethero")) {
        const swiper = new Swiper('.fleethero.swiper', {
            slidesPerView: 1,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
            },
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
        });
    }

    if (document.querySelector(".autos")) {
        const categories = document.querySelectorAll(".autos__categorie");
        const items = document.querySelectorAll(".autos__item");

        categories.forEach((category) => {
            category.addEventListener("click", () => {
                categories.forEach((c) => c.classList.remove("active"));
                category.classList.add("active");

                const selectedCategory = category.dataset.category;

                items.forEach((item) => {
                    const itemCategory = item.id;

                    if (selectedCategory === "all" || itemCategory === selectedCategory) {
                        item.style.display = "flex";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }

    if (document.querySelector(".nums")) {
        const blockTitles = document.querySelectorAll(".nums-item__title span");
        const blockColumns = document.querySelectorAll(".nums__item");
        const arrTexts = [];
        const animationDone = [];

        for (let i = 0; i < blockTitles.length; i++) {
            var blockTitlesText = Number(blockTitles[i].id);
            arrTexts.push(blockTitlesText);
            animationDone.push(false);
        }

        var animateCounter = function (element, endValue) {
            let startValue = 0;
            let duration = 1500;
            let startTime;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = (timestamp - startTime) / duration;

                if (progress < 1) {
                    const value = Math.floor(startValue + (endValue - startValue) * progress);
                    element.textContent = value;
                    requestAnimationFrame(step);
                } else {
                    element.textContent = endValue;
                }
            }

            requestAnimationFrame(step);
        };

        var increment = function () {
            for (let i = 0; i < blockTitles.length; i++) {
                var blockColumnTop = blockColumns[i].getBoundingClientRect().top;
                var koef = 2;

                if (blockColumnTop < window.innerHeight - (blockColumns[i].clientHeight / koef) && blockColumnTop > 0 && !animationDone[i]) {
                    blockTitles[i].classList.add("active");
                    animateCounter(blockTitles[i], arrTexts[i]);
                    animationDone[i] = true;
                }
            }
        }

        window.addEventListener("load", increment);
        window.addEventListener("scroll", increment);
    }
});