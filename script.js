const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const siteHeader = document.getElementById("siteHeader");
const navbar = document.querySelector(".navbar");
const pageLoader = document.getElementById("pageLoader");
const bookingModal = document.getElementById("bookingModal");
const closeBooking = document.getElementById("closeBooking");
const appointmentForm = document.getElementById("appointmentForm");
const bookingStatus = document.getElementById("bookingStatus");
const confirmationPanel = document.getElementById("confirmationPanel");
const confirmationText = document.getElementById("confirmationText");
const downloadPdf = document.getElementById("downloadPdf");
const serviceSelect = document.getElementById("serviceSelect");
const doctorSelect = document.getElementById("doctorSelect");
const timeSlotSelect = document.getElementById("timeSlotSelect");
const scrollProgress = document.getElementById("scrollProgress");

const testimonials = [
    {
        quote: "The team explained every step of my implant plan, showed me the scan, and gave me a clear timeline before we started.",
        meta: "Maya R. | Dental Implant"
    },
    {
        quote: "I was nervous about whitening and bonding, but the result still looks like my own smile, just brighter and balanced.",
        meta: "Daniel P. | Cosmetic Dentistry"
    },
    {
        quote: "My daughter left smiling after her first dental visit. The doctor spoke to her kindly and kept us informed throughout.",
        meta: "Alicia M. | Pediatric Dentistry"
    }
];

let testimonialIndex = 0;
let lastAppointment = null;

document.body.classList.add("is-loading");

function hidePageLoader() {
    window.setTimeout(() => {
        pageLoader?.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
    }, 5000);

    window.setTimeout(() => {
        pageLoader?.remove();
    }, 5700);
}

if (document.readyState === "complete") {
    hidePageLoader();
} else {
    window.addEventListener("load", hidePageLoader, { once: true });
    window.setTimeout(hidePageLoader, 5200);
}

const supabaseClient = (() => {
    const isConfigured = SUPABASE_URL.includes("supabase.co") &&
        !SUPABASE_URL.includes("YOUR_PROJECT_REF") &&
        !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY");

    if (!isConfigured || !window.supabase) {
        return null;
    }

    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();

function setMenu(open) {
    navMenu.classList.toggle("active", open);
    navToggle.setAttribute("aria-expanded", String(open));
}

navToggle?.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("active"));
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 36);
    updateScrollProgress();
    setActiveNav();
});

function updateScrollProgress() {
    if (!scrollProgress) return;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
}

function setActiveNav() {
    const anchors = document.querySelectorAll(".nav-menu a");
    let currentId = "";

    document.querySelectorAll("main section[id]").forEach((section) => {
        const top = section.offsetTop - 140;
        if (window.scrollY >= top) {
            currentId = section.id;
        }
    });

    anchors.forEach((anchor) => {
        anchor.classList.toggle("active", anchor.getAttribute("href") === `#${currentId}`);
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

function openBooking(options = {}) {
    if (options.service && serviceSelect) {
        serviceSelect.value = options.service;
    }

    if (options.doctor && doctorSelect) {
        doctorSelect.value = options.doctor;
    }

    if (options.slot && timeSlotSelect) {
        const match = options.slot.match(/(\d{1,2}:\d{2}\s?[AP]M)/i);
        if (match) timeSlotSelect.value = match[1].toUpperCase();
    }

    confirmationPanel.hidden = true;
    appointmentForm.hidden = false;
    appointmentForm.classList.remove("form-ready");
    bookingModal.classList.add("open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => appointmentForm.classList.add("form-ready"));
    appointmentForm.querySelector("input, select, textarea")?.focus();
}

function closeBookingModal() {
    bookingModal.classList.remove("open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    appointmentForm?.classList.remove("form-ready");
}

document.querySelectorAll("[data-open-booking]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
        openBooking({
            service: trigger.dataset.serviceChoice,
            doctor: trigger.dataset.doctorChoice
        });
    });
});

document.querySelectorAll("[data-slot]").forEach((slot) => {
    slot.addEventListener("click", () => openBooking({ slot: slot.dataset.slot }));
});

closeBooking?.addEventListener("click", closeBookingModal);

bookingModal?.addEventListener("click", (event) => {
    if (event.target === bookingModal) {
        closeBookingModal();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bookingModal.classList.contains("open")) {
        closeBookingModal();
    }
});

document.querySelectorAll("[data-suggest]").forEach((button) => {
    button.addEventListener("click", () => {
        const service = button.dataset.suggest;
        const result = document.getElementById("quizResult");
        result.textContent = service === "Emergency Dentistry"
            ? "Pain or swelling should be triaged today. Use the emergency call option or book an emergency visit."
            : `${service} is the best first step. We can pre-select it in the booking form.`;
        result.dataset.selectedService = service;
        serviceSelect.value = service;
    });
});

document.getElementById("quizResult")?.addEventListener("click", (event) => {
    const service = event.currentTarget.dataset.selectedService;
    if (service) openBooking({ service });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        document.querySelectorAll(".gallery-grid [data-category]").forEach((item) => {
            item.classList.toggle("hidden", filter !== "all" && item.dataset.category !== filter);
        });
    });
});

function renderTestimonial() {
    const testimonial = testimonials[testimonialIndex];
    document.getElementById("testimonialQuote").textContent = testimonial.quote;
    document.getElementById("testimonialMeta").textContent = testimonial.meta;
}

document.getElementById("prevTestimonial")?.addEventListener("click", () => {
    testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial();
});

document.getElementById("nextTestimonial")?.addEventListener("click", () => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    renderTestimonial();
});

function updateOpenStatus() {
    const status = document.getElementById("openStatus");
    if (!status) return;

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;
    const weekdayOpen = day >= 1 && day <= 4 && hour >= 9 && hour < 18;
    const fridayOpen = day === 5 && hour >= 9 && hour < 17;
    const saturdayOpen = day === 6 && hour >= 10 && hour < 14;
    const isOpen = weekdayOpen || fridayOpen || saturdayOpen;

    status.textContent = isOpen ? "Open now" : "Closed | opens next clinic day";
}

function animateCounts() {
    const counters = document.querySelectorAll("[data-count]");
    counters.forEach((counter) => {
        const target = Number(counter.dataset.count);
        const suffix = counter.textContent.includes("k") ? "k+" : "+";
        const displayTarget = suffix === "k+" ? target / 1000 : target;
        let frame = 0;
        const totalFrames = 42;

        const tick = () => {
            frame += 1;
            const progress = Math.min(frame / totalFrames, 1);
            const value = Math.round(displayTarget * progress);
            counter.textContent = suffix === "k+" ? `${value}k+` : `${value}+`;
            if (progress < 1) requestAnimationFrame(tick);
        };

        tick();
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".service-card, .doctor-card, .before-after article, .timeline article, .testimonial-card, .gallery-grid a, .contact-cards div, .accordion details").forEach((item) => {
    item.classList.add("reveal");
    revealObserver.observe(item);
});

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHover && motionAllowed) {
    navbar?.addEventListener("pointermove", (event) => {
        const rect = navbar.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        navbar.style.setProperty("--nav-x", `${x}%`);
    });

    document.querySelectorAll(".service-card, .doctor-card, .before-after article").forEach((card) => {
        card.classList.add("is-tilting");

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 5;
            const rotateX = ((0.5 - (y / rect.height)) * 5);

            card.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`);
            card.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`);
            card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
}

const servicesSlider = document.getElementById("servicesSlider");
const servicePrev = document.getElementById("servicePrev");
const serviceNext = document.getElementById("serviceNext");
let serviceSlideTimer = null;

function serviceCardStep() {
    const card = servicesSlider?.querySelector(".service-card");
    if (!card) return 320;

    const styles = window.getComputedStyle(servicesSlider);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "18");
    return card.getBoundingClientRect().width + gap;
}

function moveServices(direction = 1) {
    if (!servicesSlider) return;

    const maxScroll = servicesSlider.scrollWidth - servicesSlider.clientWidth;
    const nearEnd = servicesSlider.scrollLeft >= maxScroll - 12;
    const nearStart = servicesSlider.scrollLeft <= 12;

    if (direction > 0 && nearEnd) {
        servicesSlider.scrollTo({ left: 0, behavior: "smooth" });
        return;
    }

    if (direction < 0 && nearStart) {
        servicesSlider.scrollTo({ left: maxScroll, behavior: "smooth" });
        return;
    }

    servicesSlider.scrollBy({ left: serviceCardStep() * direction, behavior: "smooth" });
}

function startServiceSlider() {
    if (!servicesSlider || !motionAllowed) return;
    stopServiceSlider();
    serviceSlideTimer = window.setInterval(() => moveServices(1), 4200);
}

function stopServiceSlider() {
    if (serviceSlideTimer) {
        window.clearInterval(serviceSlideTimer);
        serviceSlideTimer = null;
    }
}

servicePrev?.addEventListener("click", () => {
    stopServiceSlider();
    moveServices(-1);
    startServiceSlider();
});

serviceNext?.addEventListener("click", () => {
    stopServiceSlider();
    moveServices(1);
    startServiceSlider();
});

servicesSlider?.addEventListener("pointerenter", stopServiceSlider);
servicesSlider?.addEventListener("pointerleave", startServiceSlider);
servicesSlider?.addEventListener("focusin", stopServiceSlider);
servicesSlider?.addEventListener("focusout", startServiceSlider);
startServiceSlider();

const statObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
        animateCounts();
        statObserver.disconnect();
    }
}, { threshold: 0.4 });

const stats = document.querySelector(".hero-stats");
if (stats) statObserver.observe(stats);

function appointmentPayload(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    return {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        patient_type: data.patient_type,
        preferred_date: data.preferred_date,
        time_slot: data.time_slot,
        service: data.service,
        dentist: data.dentist || "Any available dentist",
        payment_preference: data.payment_preference,
        notes: data.notes || "",
        status: "requested",
        source: "website"
    };
}

appointmentForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = appointmentForm.querySelector('button[type="submit"]');
    const payload = appointmentPayload(appointmentForm);
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-tooth"></i> Saving request...';

    try {
        if (supabaseClient) {
            const { error } = await supabaseClient.from("appointments").insert(payload);
            if (error) throw error;
            bookingStatus.textContent = "Saved securely. Your confirmation is ready.";
        } else {
            bookingStatus.textContent = "Supabase keys are not configured yet, so this request was confirmed locally.";
        }

        lastAppointment = payload;
        appointmentForm.hidden = true;
        confirmationPanel.hidden = false;
        confirmationText.textContent = `${payload.full_name}, we received your ${payload.service} request for ${payload.preferred_date} at ${payload.time_slot}. A coordinator will confirm by phone, WhatsApp, or email.`;
        appointmentForm.reset();
    } catch (error) {
        bookingStatus.textContent = `We could not save to Supabase: ${error.message}`;
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Confirm Appointment Request';
    }
});

function escapePdfText(text) {
    return String(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createPdfBlob(lines) {
    const contentLines = [
        "BT",
        "/F1 22 Tf",
        "60 760 Td",
        "(SmileCare Dental) Tj",
        "0 -34 Td",
        "/F1 15 Tf",
        "(Appointment Request Confirmation) Tj",
        "0 -34 Td",
        "/F1 11 Tf",
        ...lines.map((line) => `0 -22 Td (${escapePdfText(line)}) Tj`),
        "ET"
    ];
    const stream = contentLines.join("\n");
    const objects = [
        "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
        "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
        "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
        "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
        `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];

    objects.forEach((object) => {
        offsets.push(pdf.length);
        pdf += object;
    });

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return new Blob([pdf], { type: "application/pdf" });
}

downloadPdf?.addEventListener("click", () => {
    if (!lastAppointment) return;

    const blob = createPdfBlob([
        `Patient: ${lastAppointment.full_name}`,
        `Patient type: ${lastAppointment.patient_type}`,
        `Service: ${lastAppointment.service}`,
        `Dentist: ${lastAppointment.dentist}`,
        `Preferred date: ${lastAppointment.preferred_date}`,
        `Time slot: ${lastAppointment.time_slot}`,
        `Phone: ${lastAppointment.phone}`,
        `Email: ${lastAppointment.email}`,
        `Payment preference: ${lastAppointment.payment_preference || "Not provided"}`,
        `Notes: ${lastAppointment.notes || "None"}`,
        "",
        "Clinic: SmileCare Dental",
        "Address: 123 Smile Street, New York, NY 10001",
        "Phone: +1 (555) 123-4567",
        "",
        "A coordinator will confirm this request by phone, WhatsApp, or email."
    ]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smilecare-appointment-confirmation.pdf";
    link.click();
    URL.revokeObjectURL(url);
});

updateOpenStatus();
updateScrollProgress();
setActiveNav();
