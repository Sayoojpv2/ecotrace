// --- CONFIGURATION ---
const PROJECT_URL = 'REDACTED_SUPABASE_URL'; // redacted during 2026-11 recovery
const ANON_KEY = 'REDACTED_ANON_KEY'; // redacted during 2026-11 recovery
const supabase = supabase.createClient(PROJECT_URL, ANON_KEY);

let currentUser = null;

// --- AUTHENTICATION (Self-Healing) ---
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role-select').value;
    const orgName = document.getElementById('org-name').value;
    const msg = document.getElementById('auth-msg');

    if (!email || !password) { msg.innerText = "Please enter email and password"; return; }

    msg.innerText = "🔄 Connecting...";

    // 1. Try to Login
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // 2. If Login fails (User doesn't exist?), try SignUp
    if (error) {
        console.log("Login error:", error.message);
        const { data: upData, error: upError } = await supabase.auth.signUp({ email, password });
        
        if (upError) {
            // Check if it's the "User already registered" error
            if (upError.message.includes("already registered")) {
                msg.innerText = "❌ User exists but password might be wrong.";
            } else {
                msg.innerText = "❌ Error: " + upError.message;
            }
            return;
        }
        data = upData; // Signup succeeded
    }

    // 3. Login Successful - Now Fix the Profile
    if (data.user) {
        currentUser = data.user;
        msg.innerText = "✅ User found. Checking profile...";

        // Check if the "Profile" row exists
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();

        // IF MISSING: Create it now (The Self-Healing Part)
        if (!profile) {
            msg.innerText = "🛠 Creating missing profile...";
            await supabase.from('profiles').insert([{ 
                id: currentUser.id, 
                email: email, 
                role: role, 
                org_name: orgName 
            }]);
        }

        // 4. Launch App
        msg.innerText = "🚀 Launching Dashboard...";
        setTimeout(initApp, 1000); // Small delay so you see the success message
    }
}

async function doLogout() {
    await supabase.auth.signOut();
    location.reload();
}

// --- APP INITIALIZATION ---
async function initApp() {
    document.getElementById('auth-page').classList.remove('active');
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
    if(profile) {
        document.getElementById('user-display').innerText = profile.org_name || profile.email;
    }

    loadActivities();
    loadStats();
    loadWasteLogs(); // Load waste logs too
}

// --- NAVIGATION ---
function showPage(pageName) {
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.querySelectorAll('.page-section').forEach(el => {
        if(el.id.startsWith('view-')) el.classList.add('hidden');
    });
    document.getElementById(`view-${pageName}`).classList.remove('hidden');
}

// --- ACTIVITIES LOGIC ---
async function loadActivities() {
    const { data } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('activity-list');
    list.innerHTML = '';

    if(data) {
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = "bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center";
            div.innerHTML = `
                <div>
                    <h4 class="font-bold text-gray-800">${item.description}</h4>
                    <p class="text-xs text-gray-500">${new Date(item.activity_date).toLocaleDateString()}</p>
                </div>
                <span class="badge badge-${item.status}">${item.status}</span>
            `;
            list.appendChild(div);
        });
    }
}

async function submitActivity() {
    const desc = document.getElementById('act-desc').value;
    const status = document.getElementById('act-status').value;
    const date = document.getElementById('act-date').value;

    if(!desc) return alert("Description required");

    await supabase.from('activities').insert([{ 
        description: desc, 
        status: status, 
        activity_date: date 
    }]);

    closeModal();
    loadActivities();
    loadStats();
}

// --- WASTE LOGIC ---
async function loadWasteLogs() {
    const { data } = await supabase.from('waste_logs').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('waste-list');
    list.innerHTML = ''; // Clear list

    if(data && data.length > 0) {
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = "bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center";
            div.innerHTML = `
                <div>
                    <h4 class="font-bold text-gray-800">${item.waste_type} <span class="text-gray-400 text-sm">(${item.quantity_kg} kg)</span></h4>
                    <p class="text-xs text-gray-500">Status: ${item.status}</p>
                </div>
                <button class="text-blue-600 font-bold text-sm">View OTP</button>
            `;
            list.appendChild(div);
        });
    } else {
        list.innerHTML = `<p class="text-gray-400 text-center">No pickup requests yet.</p>`;
    }
}

async function requestPickup() {
    const type = document.getElementById('waste-type').value;
    const qty = document.getElementById('waste-qty').value;
    
    const { error } = await supabase.from('waste_logs').insert([{
        waste_type: type,
        quantity_kg: qty,
        status: 'pending',
        institution_id: currentUser.id
    }]);

    if(error) alert(error.message);
    else {
        alert("Pickup Requested!");
        loadWasteLogs();
    }
}

// --- STATS LOGIC ---
async function loadStats() {
    const { data } = await supabase.from('activities').select('status');
    if(data) {
        document.getElementById('stat-count').innerText = data.length;
        document.getElementById('stat-pending').innerText = data.filter(i => i.status === 'pending').length;
    }
}

function openModal() { document.getElementById('activity-modal').classList.remove('hidden'); }
function closeModal() { document.getElementById('activity-modal').classList.add('hidden'); }
