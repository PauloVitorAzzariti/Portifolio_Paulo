/* ==========================================
   MOBILE MENU
========================================== */

const menuButton = document.getElementById("menuButton");
const nav = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
    nav.classList.toggle("active");
});


/* ==========================================
   CLOSE MOBILE MENU AFTER CLICK
========================================== */

document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });

});


/* ==========================================
   CAROUSEL
========================================== */

const track = document.getElementById("carouselTrack");
const cards = document.querySelectorAll(".champion-card");

const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");

const progressBar = document.getElementById("progressBar");

let currentIndex = 0;


/*
    Quantidade de cards visíveis
    muda automaticamente de acordo
    com o tamanho da tela.
*/

function getVisibleCards() {

    if (window.innerWidth <= 600) {
        return 1;
    }

    if (window.innerWidth <= 1000) {
        return 2;
    }

    return 3;

}

function getRows() {
    if (window.innerWidth <= 900) return 1;
    return 2;
}


/*
    Calcula o tamanho de deslocamento
*/

function getCardWidth() {

    if (!cards.length) return 0;

    const card = cards[0];

    const style = window.getComputedStyle(track);

    const gap = parseFloat(style.gap) || 0;

    return card.offsetWidth + gap;

}


/*
    Atualiza o carrossel
*/

function updateCarousel() {

    const visibleCards = getVisibleCards();
    const rows = getRows();

    const totalColumns = Math.ceil(cards.length / rows);

    const maxIndex = Math.max(0, totalColumns - visibleCards);

    currentIndex = Math.min(currentIndex, maxIndex);

    const movement = currentIndex * getCardWidth();

    track.style.transform = `translateX(-${movement}px)`;

    const progress = ((currentIndex + visibleCards) / totalColumns) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;

}


/*
    Próximo
*/

nextButton.addEventListener("click", () => {

    const visibleCards = getVisibleCards();
    const rows = getRows();
    const totalColumns = Math.ceil(cards.length / rows);
    const maxIndex = Math.max(0, totalColumns - visibleCards);

    if (currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }

    updateCarousel();

});


/*
    Anterior
*/

prevButton.addEventListener("click", () => {

    const visibleCards = getVisibleCards();
    const rows = getRows();
    const totalColumns = Math.ceil(cards.length / rows);
    const maxIndex = Math.max(0, totalColumns - visibleCards);

    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = maxIndex;
    }

    updateCarousel();

});


/*
    Recalcula quando a tela muda
*/

window.addEventListener("resize", () => {

    updateCarousel();

});


/* ==========================================
   DRAG / SWIPE
========================================== */

let startX = 0;
let currentX = 0;
let isDragging = false;
let activePointerId = null;

track.addEventListener("pointerdown", (event) => {

    // start potential drag but do not immediately capture pointer
    isDragging = false;

    startX = event.clientX;
    currentX = startX;
    activePointerId = event.pointerId;

});


track.addEventListener("pointermove", (event) => {

    // update current position
    currentX = event.clientX;

    // if movement exceeds threshold, enable dragging and capture pointer
    if (!isDragging && Math.abs(startX - currentX) > 10) {
        isDragging = true;
        try {
            track.setPointerCapture(event.pointerId);
        } catch (e) {
            // ignore if capture fails
        }
    }

});


track.addEventListener("pointerup", (event) => {

    // if we never entered dragging mode, let click handlers run (open modal)
    if (!isDragging) {
        activePointerId = null;
        return;
    }

    isDragging = false;

    const difference = startX - currentX;

    if (Math.abs(difference) > 50) {
        if (difference > 0) {
            nextButton.click();
        } else {
            prevButton.click();
        }
    }

    // release pointer capture if held
    try {
        if (activePointerId !== null) track.releasePointerCapture(activePointerId);
    } catch (e) {
        // ignore
    }

    activePointerId = null;

});


track.addEventListener("pointercancel", () => {

    isDragging = false;
    activePointerId = null;

});


/* ==========================================
   KEYBOARD
========================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {

        nextButton.click();

    }

    if (event.key === "ArrowLeft") {

        prevButton.click();

    }

});


/* ==========================================
   REVEAL ANIMATION
========================================== */

const revealElements = document.querySelectorAll(
    ".about-content, .about-image, .champion-card, .philosophy-item, .cta"
);

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform =
                    "translateY(0)";

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(30px)";

    element.style.transition =
        "opacity .8s ease, transform .8s ease";

    observer.observe(element);

});


/* ==========================================
   INITIALIZE
========================================== */

updateCarousel();

/* ==========================================
   SHOW FIRST 3 MEDALS ON CARD (mini chips)
========================================== */
function populateCardChips() {
    cards.forEach(card => {
        // avoid duplicating
        if (card.querySelector('.card-mini-list')) return;

        const fullNode = card.querySelector('.card-full');
        if (!fullNode) return;

        const allItems = Array.from(fullNode.querySelectorAll('ul li'));
        if (!allItems.length) return;

        const firstThree = allItems.slice(0, 3);
        const chips = firstThree.map(li => {
            const text = li.textContent.trim();
            return `<li class="mini-chip"><span class="mini-dot"></span><span class="mini-text">${text}</span></li>`;
        }).join('');

        const ul = document.createElement('ul');
        ul.className = 'card-mini-list';
        ul.innerHTML = chips;

        const achContainer = card.querySelector('.card-achievement');
        if (achContainer) {
            achContainer.insertBefore(ul, achContainer.firstChild);
        }
    });
}

populateCardChips();


/* ==========================================
   CARD MODAL (robust handlers)
========================================== */

const modal = document.getElementById('cardModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalCategory = document.getElementById('modalCategory');
const modalFull = document.getElementById('modalFull');
const modalAchievement = document.getElementById('modalAchievement');

if (modal && modalOverlay && modalClose) {

    let _lastActiveElement = null;
    let _modalKeyHandler = null;

    function openModal(card) {
        const img = card.querySelector('img');
        const name = card.querySelector('h3')?.innerText || '';
        const category = card.querySelector('.card-category')?.innerText || '';
        // prefer an explicit full content block if present, otherwise use the visible paragraph
        const fullNode = card.querySelector('.card-full');
        const full = fullNode ? fullNode.innerHTML : (card.querySelector('.card-content p')?.innerHTML || '');
        const achievement = card.querySelector('.card-achievement')?.innerHTML || '';

        if (modalImage) {
            modalImage.src = img ? img.src : '';
            modalImage.alt = img ? img.alt : 'Foto do aluno';
        }

        if (modalName) modalName.textContent = name;
        if (modalCategory) modalCategory.textContent = category;
        // Show a human-friendly description in the modal body instead of the raw lists.
        // Prefer the short paragraph visible on the card (last <p> inside .card-content).
        if (modalFull) {
            const descNode = card.querySelector('.card-content p:last-of-type');
            if (descNode && descNode.textContent.trim()) {
                modalFull.innerHTML = `<p class="athlete-desc">${descNode.innerHTML}</p>`;
            } else {
                modalFull.innerHTML = full;
            }
        }
        // Build individual chips from every <li> inside .card-full
        if (modalAchievement) {
            if (fullNode) {
                const items = Array.from(fullNode.querySelectorAll('ul li'));
                if (items.length) {
                    // helper to escape text
                    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    const svgMedal = (fill, shade) =>
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="${fill}"/><rect x="10" y="12" width="4" height="6" rx="1" fill="${shade}"/></svg>`;
                    const svgTrophy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 3h12v2a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V3z" fill="#F4C430"/><path d="M9 14v2a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-2" fill="none" stroke="#000" stroke-opacity="0.06"/></svg>`;

                    const chips = items.map(li => {
                        const text = li.textContent.trim();
                        const lower = text.toLowerCase();
                        let svg = svgTrophy;
                        if (lower.includes('ouro')) svg = svgMedal('#D4AF37', '#B8860B');
                        else if (lower.includes('prata')) svg = svgMedal('#C0C0C0', '#9EA0A2');
                        else if (lower.includes('bronze')) svg = svgMedal('#CD7F32', '#8C5A2E');

                        return `<li><span class="ach-icon">${svg}</span><strong>${esc(text)}</strong></li>`;
                    }).join('');
                    modalAchievement.innerHTML = `<ul class="achievements-list">${chips}</ul>`;
                } else {
                    modalAchievement.innerHTML = achievement;
                }
            } else {
                modalAchievement.innerHTML = achievement;
            }
        }

        console.log('Opening modal for', name);
        // save last focused element so we can restore focus on close
        _lastActiveElement = document.activeElement;

        // show modal and lock background
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // focus management: move focus to close button
        modalClose.focus();

        // trap focus inside modal
        _modalKeyHandler = function(e) {
            if (e.key === 'Tab') {
                const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
                const list = Array.from(focusable).filter(el => el.offsetParent !== null);
                if (!list.length) return;
                const first = list[0];
                const last = list[list.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            } else if (e.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', _modalKeyHandler);
    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        if (modalImage) modalImage.src = '';
        // restore scroll and focus
        document.body.style.overflow = '';
        if (_modalKeyHandler) {
            document.removeEventListener('keydown', _modalKeyHandler);
            _modalKeyHandler = null;
        }
        if (_lastActiveElement && typeof _lastActiveElement.focus === 'function') {
            _lastActiveElement.focus();
        }
        _lastActiveElement = null;
    }

    cards.forEach(card => {
        // attach to the article
        card.addEventListener('click', () => openModal(card));

        // also attach directly to the image to bypass pointer capture on the track
        const img = card.querySelector('img');
        if (img) {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(card);
            });
        }

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    // open modal when user clicks the 'Ver todos' button
    document.querySelectorAll('.view-all').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // find nearest card
            const card = btn.closest('.champion-card');
            if (card) openModal(card);
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

} else {
    console.warn('Modal elements missing; modal disabled.');
}