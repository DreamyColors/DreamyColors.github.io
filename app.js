// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDIWizvGK3AxdRELeCRzk7rJ3ONzjT-0Zk",
    authDomain: "mychild-9a4e9.firebaseapp.com",
    databaseURL: "https://mychild-9a4e9-default-rtdb.firebaseio.com",
    projectId: "mychild-9a4e9",
    storageBucket: "mychild-9a4e9.firebasestorage.app",
    messagingSenderId: "636633882504",
    appId: "1:636633882504:android:eb352e61ce9aa7d32a643d"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const milestonesRef = database.ref("milestones");
const vaccinationsRef = database.ref("vaccinations");

milestonesRef.on("value", (snapshot) => {
    const data = snapshot.val();
    const list = document.getElementById("milestones-list");
    list.innerHTML = "";

    if (!data) {
        list.innerHTML = "<p>لا توجد بيانات</p>";
        return;
    }

    Object.keys(data).forEach(key => {
        const m = data[key];
        list.innerHTML += `
            <div style="border:1px solid #ddd;padding:15px;margin-bottom:10px;">
                <h3>${m.title}</h3>
                <p>${m.description}</p>
                <small>من ${m.monthStart} إلى ${m.monthEnd} شهر</small>
            </div>
        `;
    });
});

vaccinationsRef.on("value", (snapshot) => {
    const data = snapshot.val();
    const list = document.getElementById("vaccinations-list");
    list.innerHTML = "";

    if (!data) {
        list.innerHTML = "<p>لا توجد بيانات</p>";
        return;
    }

    Object.keys(data).forEach(key => {
        const v = data[key];
        list.innerHTML += `
            <div style="border:1px solid #ddd;padding:15px;margin-bottom:10px;">
                <h3>${v.title}</h3>
                <p>${v.description}</p>
                <small>عند عمر ${v.dueMonth} شهر</small>
            </div>
        `;
    });
});
