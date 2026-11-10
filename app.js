const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const names={home:"الرئيسية",calendar:"التاريخ والتقويم",tasks:"المهام",notes:"الملاحظات",base:"القاعدة الرئيسية",settings:"الإعدادات"};
function showView(id){$$('.page').forEach(p=>p.classList.toggle('active-page',p.id===id));$$('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));$('#pageTitle').textContent=names[id]||'الرئيسية';$('#sidebar').classList.remove('mobile-open');window.scrollTo({top:0,behavior:'smooth'});}
$$('.nav-item[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
$('#collapseBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('collapsed'));
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('mobile-open'));
function updateClock(){const d=new Date();$('#clock').innerHTML=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false})+'<span>'+(d.getHours()<12?'ص':'م')+'</span>';$('#topDate').textContent=d.toLocaleDateString('ar-QA',{weekday:'long',day:'numeric',month:'long'});$('#fullDate').textContent=d.toLocaleDateString('ar-QA',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}
updateClock();setInterval(updateClock,30000);
function makeDays(target,large=false){const el=$(target);if(!el)return;el.innerHTML='';const offset=large?0:0;for(let i=1;i<=30;i++){const s=document.createElement('span');s.textContent=i;if(i===10)s.className='today';if([4,10,16,22,27].includes(i))s.classList.add('has-event');el.append(s)}}
makeDays('#miniDays');makeDays('#largeDays',true);
const modal=$('#modal'),input=$('#newTitle');let mode='مهمة';
function openModal(kind){mode=kind;$('#modalTitle').textContent='إضافة '+kind;input.value='';modal.classList.add('open');setTimeout(()=>input.focus(),80)}
function closeModal(){modal.classList.remove('open')}
$('#quickAdd').onclick=()=>openModal('عنصر جديد');$('#addTask').onclick=()=>openModal('مهمة');$('#tasksAdd').onclick=()=>openModal('مهمة');$('#addReminder').onclick=()=>openModal('تذكير');$('#notesAdd').onclick=()=>openModal('ملاحظة');
$('#modalClose').onclick=closeModal;$('#cancelModal').onclick=closeModal;modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
$('#saveModal').onclick=()=>{if(!input.value.trim()){input.focus();return}closeModal();showToast('تمت إضافة '+mode+' في النموذج التجريبي');};
function showToast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2300)}
$$('.task-row input').forEach(c=>c.addEventListener('change',()=>showToast(c.checked?'أحسنت! تم تحديد المهمة كمكتملة':'تمت إعادة المهمة إلى القائمة')));
