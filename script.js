/* ====================================================
   PORTFOLIO APP — Firstlyo Eilen Rizqulloh
   localStorage CRUD + Base64 Image Upload
==================================================== */

// ===== DEFAULT DATA =====
const DEFAULT_DATA = {
  password: 'admin123',
  profile: {
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600',
    about: "I'm Firstlyo Eilen Rizqulloh — a creative developer passionate about building beautiful, functional, and meaningful digital products. I blend design thinking with technical expertise to craft experiences that leave a lasting impression."
  },
  projects: [
    {id:1, title:'Nebula Dashboard', category:'Web App', desc:'A futuristic analytics dashboard with real-time data visualization.', img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', link:'#'},
    {id:2, title:'Aurora Brand', category:'Branding', desc:'Complete brand identity for a sustainable fashion label.', img:'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800', link:'#'},
    {id:3, title:'Mobile Banking', category:'UI/UX', desc:'Redesigned mobile banking experience for Gen-Z users.', img:'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', link:'#'},
    {id:4, title:'E-Commerce Store', category:'Web Design', desc:'Premium e-commerce platform with 3D product views.', img:'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800', link:'#'}
  ],
  skills: [
    {id:1, icon:'🎨', name:'UI/UX Design', level:95},
    {id:2, icon:'💻', name:'Web Development', level:90},
    {id:3, icon:'📱', name:'Mobile Apps', level:85},
    {id:4, icon:'🎬', name:'Motion Design', level:80},
    {id:5, icon:'📷', name:'Photography', level:75},
    {id:6, icon:'🚀', name:'Branding', level:88}
  ]
};

// ===== STORAGE HELPERS =====
function getData(){
  const d = localStorage.getItem('portfolio_data');
  if(!d){
    localStorage.setItem('portfolio_data', JSON.stringify(DEFAULT_DATA));
    return DEFAULT_DATA;
  }
  return JSON.parse(d);
}
function saveData(data){
  localStorage.setItem('portfolio_data', JSON.stringify(data));
}

// ===== RENDER PORTFOLIO =====
function renderPortfolio(){
  const data = getData();

  // Profile photo
  const profileImg = document.getElementById('profileImg');
  if(profileImg) profileImg.src = data.profile.photo;

  // About
  const aboutText = document.getElementById('aboutText');
  if(aboutText) aboutText.textContent = data.profile.about;

  // Projects
  const worksGrid = document.getElementById('worksGrid');
  if(worksGrid){
    worksGrid.innerHTML = data.projects.map(p => `
      <div class="work-card" onclick="${p.link && p.link!=='#' ? `window.open('${p.link}','_blank')` : ''}">
        <div class="work-img"><img src="${p.img}" alt="${p.title}"/></div>
        <div class="work-info">
          <span class="work-cat">${p.category}</span>
          <h3 class="work-title">${p.title}</h3>
          <p class="work-desc">${p.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Skills
  const skillsGrid = document.getElementById('skillsGrid');
  if(skillsGrid){
    skillsGrid.innerHTML = data.skills.map(s => `
      <div class="skill-card">
        <div class="skill-icon">${s.icon}</div>
        <div class="skill-name">${s.name}</div>
        <div class="skill-bar"><div class="skill-bar-fill" style="width:${s.level}%"></div></div>
      </div>
    `).join('');
  }
}

// ===== CLOCK =====
function updateClock(){
  const el = document.getElementById('clock');
  if(!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
}

// ===== CUSTOM CURSOR =====
function initCursor(){
  const cursor = document.querySelector('.cursor');
  const follow = document.querySelector('.cursor-follow');
  if(!cursor) return;
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX+'px';
    cursor.style.top = e.clientY+'px';
    follow.style.left = e.clientX+'px';
    follow.style.top = e.clientY+'px';
  });
  document.querySelectorAll('a,button,.work-card,.bento').forEach(el=>{
    el.addEventListener('mouseenter',()=>follow.style.transform='translate(-50%,-50%) scale(1.5)');
    el.addEventListener('mouseleave',()=>follow.style.transform='translate(-50%,-50%) scale(1)');
  });
}

// ===== ADMIN LOGIN =====
function doLogin(){
  const pass = document.getElementById('loginPass').value;
  const data = getData();
  if(pass === data.password){
    sessionStorage.setItem('admin_auth','true');
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('dashboard').style.display='grid';
    loadAdminData();
  } else {
    alert('❌ Wrong password!');
  }
}
function doLogout(){
  sessionStorage.removeItem('admin_auth');
  location.reload();
}
function checkAuth(){
  if(sessionStorage.getItem('admin_auth')==='true'){
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('dashboard').style.display='grid';
    loadAdminData();
  }
}

// ===== ADMIN TABS =====
function initTabs(){
  document.querySelectorAll('.nav-item').forEach(item=>{
    item.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
      item.classList.add('active');
      document.getElementById('tab-'+item.dataset.tab).classList.add('active');
    });
  })
}
// ===== LOAD ADMIN DATA =====
function loadAdminData(){
  const data = getData();
  document.getElementById('previewPhoto').src = data.profile.photo;
  document.getElementById('aboutInput').value = data.profile.about;
  renderProjectsTable();
  renderSkillsTable();
}

// ===== PROFILE =====
function handlePhotoUpload(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('previewPhoto').src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function saveProfile(){
  const data = getData();
  data.profile.photo = document.getElementById('previewPhoto').src;
  data.profile.about = document.getElementById('aboutInput').value;
  saveData(data);
  alert('✅ Profile saved!');
}

// ===== PROJECTS CRUD =====
function renderProjectsTable(){
  const data = getData();
  const tbody = document.getElementById('projectsTable');
  if(!tbody) return;
  tbody.innerHTML = data.projects.map(p => `
    <tr>
      <td><img src="${p.img}" alt=""/></td>
      <td>${p.title}</td>
      <td>${p.category}</td>
      <td class="actions">
        <button class="edit" onclick="editProject(${p.id})">Edit</button>
        <button class="del" onclick="deleteProject(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:40px">No projects yet</td></tr>';
}
function openProjectModal(){
  document.getElementById('projectModalTitle').textContent = 'New Project';
  document.getElementById('projectId').value = '';
  document.getElementById('projectTitle').value = '';
  document.getElementById('projectCategory').value = '';
  document.getElementById('projectDesc').value = '';
  document.getElementById('projectLink').value = '';
  document.getElementById('projectPreview').src = '';
  document.getElementById('projectModal').classList.add('show');
}
function closeProjectModal(){
  document.getElementById('projectModal').classList.remove('show');
}
function previewProjectImage(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('projectPreview').src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function saveProject(){
  const data = getData();
  const id = document.getElementById('projectId').value;
  const title = document.getElementById('projectTitle').value.trim();
  const category = document.getElementById('projectCategory').value.trim();
  const desc = document.getElementById('projectDesc').value.trim();
  const link = document.getElementById('projectLink').value.trim();
  const img = document.getElementById('projectPreview').src;

  if(!title || !category){ alert('⚠ Title & Category required'); return; }

  if(id){
    const idx = data.projects.findIndex(p=>p.id==id);
    data.projects[idx] = {...data.projects[idx], title, category, desc, link, img};
  } else {
    const newId = Date.now();
    data.projects.push({id:newId, title, category, desc, link, img});
  }
  saveData(data);
  renderProjectsTable();
  closeProjectModal();
}
function editProject(id){
  const data = getData();
  const p = data.projects.find(x=>x.id===id);
  document.getElementById('projectModalTitle').textContent = 'Edit Project';
  document.getElementById('projectId').value = p.id;
  document.getElementById('projectTitle').value = p.title;
  document.getElementById('projectCategory').value = p.category;
  document.getElementById('projectDesc').value = p.desc;
  document.getElementById('projectLink').value = p.link || '';
  document.getElementById('projectPreview').src = p.img;
  document.getElementById('projectModal').classList.add('show');
}
function deleteProject(id){
  if(!confirm('Delete this project?')) return;
  const data = getData();
  data.projects = data.projects.filter(p=>p.id!==id);
  saveData(data);
  renderProjectsTable();
}

// ===== SKILLS CRUD =====
function renderSkillsTable(){
  const data = getData();
  const tbody = document.getElementById('skillsTable');
  if(!tbody) return;
  tbody.innerHTML = data.skills.map(s => `
    <tr>
      <td style="font-size:24px">${s.icon}</td>
      <td>${s.name}</td>
      <td>${s.level}%</td>
      <td class="actions">
        <button class="edit" onclick="editSkill(${s.id})">Edit</button>
        <button class="del" onclick="deleteSkill(${s.id})">Delete</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:40px">No skills yet</td></tr>';
}
function openSkillModal(){
  document.getElementById('skillModalTitle').textContent = 'New Skill';
  document.getElementById('skillId').value = '';
  document.getElementById('skillIcon').value = '';
  document.getElementById('skillName').value = '';
  document.getElementById('skillLevel').value = '';
  document.getElementById('skillModal').classList.add('show');
}
function closeSkillModal(){
  document.getElementById('skillModal').classList.remove('show');
}
function saveSkill(){
  const data = getData();
  const id = document.getElementById('skillId').value;
  const icon = document.getElementById('skillIcon').value.trim() || '⚡';
  const name = document.getElementById('skillName').value.trim();
  const level = parseInt(document.getElementById('skillLevel').value) || 0;

  if(!name){ alert('⚠ Name required'); return; }

  if(id){
    const idx = data.skills.findIndex(s=>s.id==id);
    data.skills[idx] = {id:+id, icon, name, level};
  } else {
    data.skills.push({id:Date.now(), icon, name, level});
  }
  saveData(data);
  renderSkillsTable();
  closeSkillModal();
}
function editSkill(id){
  const data = getData();
  const s = data.skills.find(x=>x.id===id);
  document.getElementById('skillModalTitle').textContent = 'Edit Skill';
  document.getElementById('skillId').value = s.id;
  document.getElementById('skillIcon').value = s.icon;
  document.getElementById('skillName').value = s.name;
  document.getElementById('skillLevel').value = s.level;
  document.getElementById('skillModal').classList.add('show');
}
function deleteSkill(id){
  if(!confirm('Delete this skill?')) return;
  const data = getData();
  data.skills = data.skills.filter(s=>s.id!==id);
  saveData(data);
  renderSkillsTable();
}

// ===== SETTINGS =====
function changePassword(){
  const newPass = document.getElementById('newPass').value.trim();
  if(!newPass || newPass.length<4){ alert('⚠ Password min 4 chars'); return; }
  const data = getData();
  data.password = newPass;
  saveData(data);
  alert('✅ Password updated!');
  document.getElementById('newPass').value = '';
}
function resetAll(){
  if(!confirm('⚠ Reset ALL data to default? This cannot be undone!')) return;
  localStorage.removeItem('portfolio_data');
  location.reload();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', ()=>{
  renderPortfolio();
  updateClock();
  setInterval(updateClock, 1000);
  initCursor();
  initTabs();
  checkAuth();
});
