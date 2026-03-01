// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase configuration from google-services.json
const firebaseConfig = {
    apiKey: "AIzaSyDIWizvGK3AxdRELeCRzk7rJ3ONzjT-0Zk",
    authDomain: "mychild-9a4e9.firebaseapp.com",
    databaseURL: "https://mychild-9a4e9-default-rtdb.firebaseio.com",
    projectId: "mychild-9a4e9",
    storageBucket: "mychild-9a4e9.firebasestorage.app",
    messagingSenderId: "636633882504",
    appId: "1:636633882504:android:eb352e61ce9aa7d32a643d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const milestonesList = document.getElementById('milestones-list');
const milestoneModal = document.getElementById('milestone-modal');
const addBtn = document.getElementById('add-milestone-btn');
const closeBtn = document.querySelector('.close');
const milestoneForm = document.getElementById('milestone-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const ageFilter = document.getElementById('age-filter');

let allMilestones = [];

// Load Milestones
function loadMilestones() {
    const milestonesRef = ref(db, 'milestones');
    onValue(milestonesRef, (snapshot) => {
        const data = snapshot.val();
        allMilestones = [];
        if (data) {
            Object.keys(data).forEach(key => {
                allMilestones.push({ id: key, ...data[key] });
            });
        }
        renderMilestones();
    });
}

// Render Milestones
function renderMilestones() {
    const searchTerm = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    const age = ageFilter.value;

    const filtered = allMilestones.filter(m => {
        const matchSearch = m.title.toLowerCase().includes(searchTerm) || m.description.toLowerCase().includes(searchTerm);
        const matchCat = cat === 'all' || m.category === cat;
        const matchAge = age === 'all' || (parseInt(age) >= m.monthStart && parseInt(age) <= m.monthEnd);
        return matchSearch && matchCat && matchAge;
    });

    if (filtered.length === 0) {
        milestonesList.innerHTML = '<div class="loader">لا توجد معالم تطابق بحثك</div>';
        return;
    }

    milestonesList.innerHTML = filtered.map(m => `
        <div class="milestone-card">
            <span class="category-tag tag-${m.category.toLowerCase()}">${getCategoryName(m.category)}</span>
            <h3>${m.title}</h3>
            <p>${m.description}</p>
            <div class="age-range">
                <i class="far fa-calendar-alt"></i>
                <span>العمر: من ${m.monthStart} إلى ${m.monthEnd} شهر</span>
            </div>
            <div class="card-actions">
                <button class="btn-icon btn-edit" onclick="editMilestone('${m.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteMilestone('${m.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getCategoryName(cat) {
    const map = {
        'MOTOR': 'حركي',
        'LANGUAGE': 'لغوي',
        'COGNITIVE': 'معرفي',
        'SOCIAL': 'اجتماعي'
    };
    return map[cat] || cat;
}

// Global functions for inline JS
window.editMilestone = (id) => {
    const m = allMilestones.find(item => item.id === id);
    if (!m) return;

    document.getElementById('milestone-id').value = m.id;
    document.getElementById('title').value = m.title;
    document.getElementById('description').value = m.description;
    document.getElementById('monthStart').value = m.monthStart;
    document.getElementById('monthEnd').value = m.monthEnd;
    document.getElementById('category').value = m.category;
    document.getElementById('modal-title').innerText = 'تعديل المعلم';
    milestoneModal.style.display = 'block';
};

window.deleteMilestone = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المعلم؟')) {
        remove(ref(db, `milestones/${id}`));
    }
};

// Event Listeners
addBtn.onclick = () => {
    milestoneForm.reset();
    document.getElementById('milestone-id').value = '';
    document.getElementById('modal-title').innerText = 'إضافة معلم جديد';
    milestoneModal.style.display = 'block';
};

closeBtn.onclick = () => {
    milestoneModal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == milestoneModal) {
        milestoneModal.style.display = 'none';
    }
};

milestoneForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('milestone-id').value;
    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        monthStart: parseInt(document.getElementById('monthStart').value),
        monthEnd: parseInt(document.getElementById('monthEnd').value),
        category: document.getElementById('category').value
    };

    if (id) {
        update(ref(db, `milestones/${id}`), data);
    } else {
        push(ref(db, 'milestones'), data);
    }

    milestoneModal.style.display = 'none';
};

searchInput.oninput = renderMilestones;
categoryFilter.onchange = renderMilestones;
ageFilter.onchange = renderMilestones;

// Start app
loadMilestones();
