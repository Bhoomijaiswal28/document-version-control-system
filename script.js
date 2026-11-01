const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const STORAGE_KEY = "docuvault_docs";
const AUDIT_KEY = "docuvault_audit";

let documents = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let auditLog = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");

const today = () => new Date().toLocaleDateString();
const dateTime = () => new Date().toLocaleString();
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, ch => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
}[ch]));
const latest = doc => doc.versions[doc.versions.length - 1];
const versionText = number => "V" + Number(number).toFixed(1);
const statusBadge = status => `<span class="status ${status.replace(/\s/g,"-")}">${escapeHTML(status)}</span>`;

function recordActivity(action, doc) {
  auditLog.unshift({ action, document: doc?.title || "—", user: doc?.owner || "Admin", date: dateTime() });
  auditLog = auditLog.slice(0, 300);
}
function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog));
  render();
}
function documentRow(doc, compact = false) {
  const ver = latest(doc);
  const categoryCell = compact ? "" : `<td>${escapeHTML(doc.category)}</td>`;
  return `<tr>
    <td><div class="doc-title"><span class="file-icon">${escapeHTML((ver.fileName.split(".").pop()||"FILE").slice(0,3).toUpperCase())}</span>${escapeHTML(doc.title)}</div></td>
    <td class="doc-id">${escapeHTML(doc.docId)}</td>${categoryCell}
    <td><span class="version">${versionText(ver.number)}</span></td>
    <td>${escapeHTML(doc.owner)}</td><td>${statusBadge(ver.status)}</td><td>${escapeHTML(ver.updated)}</td>
    <td><div class="action-group"><button class="mini" onclick="showDetails('${doc.id}')">History</button>${compact?"":`<button class="mini" onclick="downloadFile('${doc.id}',${doc.versions.length-1})">↓</button>`}</div></td>
  </tr>`;
}
function render() {
  $("#totalCount").textContent = documents.length;
  $("#pendingCount").textContent = documents.filter(d=>latest(d).status==="Under Review").length;
  $("#approvedCount").textContent = documents.filter(d=>latest(d).status==="Approved").length;
  $("#versionCount").textContent = documents.reduce((sum,d)=>sum+d.versions.length,0);
  $("#pendingBadge").textContent = documents.filter(d=>latest(d).status==="Under Review").length;

  const recent = [...documents].sort((a,b)=>new Date(latest(b).updatedAt)-new Date(latest(a).updatedAt)).slice(0,5);
  $("#recentTable").innerHTML = recent.map(d=>documentRow(d,true)).join("");
  $("#recentEmpty").hidden = recent.length > 0;

  const query = ($("#search")?.value || "").toLowerCase();
  const status = $("#statusFilter")?.value || "";
  const category = $("#categoryFilter")?.value || "";
  const filtered = documents.filter(d =>
    `${d.title} ${d.docId} ${d.owner}`.toLowerCase().includes(query) &&
    (!status || latest(d).status === status) &&
    (!category || d.category === category)
  );
  $("#documentTable").innerHTML = filtered.map(d=>documentRow(d)).join("");
  $("#documentEmpty").hidden = filtered.length > 0;

  const pending = documents.filter(d=>latest(d).status==="Under Review");
  $("#approvalList").innerHTML = pending.map(d=>`
    <article class="approval-card"><div><h4>${escapeHTML(d.title)} <span class="version">${versionText(latest(d).number)}</span></h4>
    <p>${escapeHTML(d.docId)} · ${escapeHTML(d.owner)} · ${escapeHTML(latest(d).change)}</p></div>
    <div class="approval-actions"><button class="mini" onclick="showDetails('${d.id}')">History</button><button class="btn primary" onclick="approveDocument('${d.id}')">Approve</button></div></article>
  `).join("") || '<div class="empty">No documents waiting for approval.</div>';

  $("#auditTable").innerHTML = auditLog.map(a=>`<tr><td>${escapeHTML(a.action)}</td><td>${escapeHTML(a.document)}</td><td>${escapeHTML(a.user)}</td><td>${escapeHTML(a.date)}</td></tr>`).join("");
  $("#auditEmpty").hidden = auditLog.length > 0;
}
function showPage(page) {
  $$(".page").forEach(section=>section.classList.add("hidden"));
  $("#"+page+"Page").classList.remove("hidden");
  $$(".nav").forEach(button=>button.classList.toggle("active",button.dataset.page===page));
  $("#pageTitle").textContent = ({dashboard:"Dashboard",documents:"All Documents",approvals:"Approval Center",audit:"Audit Log"})[page];
  render();
}
$$(".nav").forEach(button=>button.addEventListener("click",()=>showPage(button.dataset.page)));
$$("[data-open]").forEach(button=>button.addEventListener("click",()=>showPage(button.dataset.open)));
$("#search").addEventListener("input",render);
$("#statusFilter").addEventListener("change",render);
$("#categoryFilter").addEventListener("change",render);

function openUploadModal() {
  $("#uploadForm").reset();
  $("#uploadModal").showModal();
}
$("#dashboardUpload").addEventListener("click",openUploadModal);
$("#uploadButton").addEventListener("click",openUploadModal);
$("#closeUpload").addEventListener("click",()=>$("#uploadModal").close());
$("#cancelUpload").addEventListener("click",()=>$("#uploadModal").close());

$("#uploadForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const file = formData.get("file");
  if (!file || !file.name) return alert("Please select a file.");
  if (file.size > 5 * 1024 * 1024) return alert("File must be 5 MB or less for this prototype.");

  const docId = formData.get("docId").trim();
  const existing = documents.find(d=>d.docId.toLowerCase()===docId.toLowerCase());
  if (existing) {
    const answer = confirm("This Document ID exists. Add this file as a new version?");
    if (!answer) return;
    await addVersionFromUpload(existing, file, formData.get("change"), formData.get("status"));
  } else {
    const dataUrl = await readFile(file);
    const now = new Date();
    const doc = {
      id: crypto.randomUUID(),
      title: formData.get("title").trim(),
      docId,
      category: formData.get("category"),
      owner: formData.get("owner").trim(),
      versions: [{
        number: 1.0, fileName: file.name, dataUrl, size: file.size,
        updated: today(), updatedAt: now.toISOString(),
        change: formData.get("change").trim() || "Initial upload",
        status: formData.get("status")
      }]
    };
    documents.unshift(doc);
    recordActivity("Document uploaded",doc);
  }
  persist();
  $("#uploadModal").close();
  form.reset();
  showPage("documents");
});
function readFile(file) {
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = ()=>resolve(reader.result);
    reader.onerror = ()=>reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
async function addVersionFromUpload(doc,file,change,status) {
  const previous = latest(doc);
  const dataUrl = await readFile(file);
  const number = Math.round((previous.number + 0.1) * 10) / 10;
  doc.versions.push({
    number,fileName:file.name,dataUrl,size:file.size,updated:today(),
    updatedAt:new Date().toISOString(),change:change.trim()||"Updated document",status
  });
  recordActivity("New version uploaded",doc);
}
window.showDetails = function(id) {
  const doc = documents.find(d=>d.id===id);
  if (!doc) return;
  $("#detailTitle").textContent = doc.title;
  $("#detailBody").innerHTML = `
    <div class="meta-grid">
      <div class="meta"><small>DOCUMENT ID</small><b>${escapeHTML(doc.docId)}</b></div>
      <div class="meta"><small>CATEGORY</small><b>${escapeHTML(doc.category)}</b></div>
      <div class="meta"><small>OWNER</small><b>${escapeHTML(doc.owner)}</b></div>
      <div class="meta"><small>STATUS</small><b>${escapeHTML(latest(doc).status)}</b></div>
    </div>
    <div class="section-title"><div><h3>Version history</h3><p>${doc.versions.length} saved revision(s)</p></div><button class="btn primary" onclick="chooseNewVersion('${doc.id}')">＋ New version</button></div>
    ${[...doc.versions].reverse().map((v,reverseIndex)=>{
      const index=doc.versions.length-1-reverseIndex;
      return `<div class="version-item"><div><b>${versionText(v.number)} · ${escapeHTML(v.fileName)}</b><small>${escapeHTML(v.updated)} · ${escapeHTML(v.change)} · ${statusBadge(v.status)}</small></div><button class="mini" onclick="downloadFile('${doc.id}',${index})">Download</button></div>`;
    }).join("")}`;
  $("#detailModal").showModal();
};
$("#closeDetail").addEventListener("click",()=>$("#detailModal").close());
window.downloadFile = function(id,index) {
  const doc=documents.find(d=>d.id===id), version=doc?.versions[index];
  if(!version)return;
  const link=document.createElement("a");
  link.href=version.dataUrl;link.download=version.fileName;link.click();
  recordActivity("Document downloaded",doc);persist();
};
window.chooseNewVersion = function(id) {
  const doc=documents.find(d=>d.id===id);
  if(!doc)return;
  $("#detailModal").close();
  const input=$("#newVersionFile");
  input.value="";
  input.onchange=async()=>{
    const file=input.files[0];if(!file)return;
    if(file.size>5*1024*1024)return alert("File must be 5 MB or less.");
    await addVersionFromUpload(doc,file,prompt("Describe changes in this revision:","Updated document")||"Updated document","Under Review");
    persist();showDetails(id);
  };
  input.click();
};
window.approveDocument = function(id) {
  const doc=documents.find(d=>d.id===id);if(!doc)return;
  latest(doc).status="Approved";
  latest(doc).updated=today();latest(doc).updatedAt=new Date().toISOString();
  recordActivity("Document approved",doc);persist();
};
$("#clearAudit").addEventListener("click",()=>{
  if(confirm("Clear all audit log entries?")){auditLog=[];persist();}
});
render();
