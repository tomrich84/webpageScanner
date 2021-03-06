"use strict";

let prevContext;

(function(){
	if(!document.getElementById("scanSites"))return;
	translate();
	document.getElementById("scanSites").addEventListener("click",scanSites);
	document.getElementById("addSite").addEventListener("click",addSite);
	getSettings().then(s=>{
		if(s.theme==="dark")document.documentElement.className="dark";
		if(s.search){
			document.documentElement.dataset.search=true;
			document.getElementById("searchBar").classList.remove("none");
		}
		let openSiteBtn=document.getElementById("openSite");
		if(!s.autoOpen){
			openSiteBtn.removeAttribute("class");
			openSiteBtn.addEventListener("click",openSite);
		}
	});
	document.getElementById("showAdd").addEventListener("click",showAdd);
	document.getElementById("addFolder").addEventListener("click",showAddFolder);
	document.getElementById("addSaveF").addEventListener("click",e=>{
		addFolder(document.getElementById("nameFolderA").value);
		document.getElementById("addingFolder").classList.add("hidden");
		document.getElementById("addFolder").classList.remove("open");
	});
	document.getElementById("editCancel").addEventListener("click",hideAll);
	document.getElementById("addCancel").addEventListener("click",hideAll);
	document.getElementById("addCancelF").addEventListener("click",hideAll);
	document.getElementById("deleteCancel").addEventListener("click",hideAll);
	document.getElementById("editCancelF").addEventListener("click",hideAll);
	document.getElementById("deleteCancelF").addEventListener("click",hideAll);
	document.getElementById("options").addEventListener("click",()=>{browser.runtime.openOptionsPage();});
	window.addEventListener('contextmenu',e=>{if(!(e.target.tagName==="INPUT"&&(e.target.type==="text"||e.target.type==="number")))e.preventDefault();});
	document.addEventListener('selectstart',e=>{if(!(e.target.tagName==="INPUT"&&(e.target.type==="text"||e.target.type==="number"||e.target.type==="search")))e.preventDefault();});
	document.getElementById("lista").addEventListener('contextmenu',context);
	document.getElementById("fillForm").addEventListener("click",fillForm);
	document.getElementById("statusbar").addEventListener("mousemove",e=>{e.target.removeAttribute("class");});
	document.getElementById("editSite").addEventListener("click",e=>{editSite(e.target.dataset.id);});
	document.getElementById("deleteSite").addEventListener("click",e=>{deleteSite(parseInt(e.target.dataset.id));});
	document.getElementById("editSaveF").addEventListener("click",e=>{editFolder(e.target.dataset.id);});
	document.getElementById("deleteSaveF").addEventListener("click",e=>{deleteFolder(e.target.dataset.id);});
	document.getElementById("search").addEventListener("input",search);
	document.documentElement.addEventListener("click",e=>{
		if(e.target.id!=="filter"&&e.target.parentElement.id!=="popupFilter"){
			document.getElementById("filter").classList.remove("open");
			document.getElementById("popupFilter").classList.add("hidden");
		}
	});
	document.getElementById("filter").addEventListener("click",()=>{
		document.getElementById("filter").classList.toggle("open");
		document.getElementById("popupFilter").classList.toggle("hidden");
	});
	let filterPopup=document.getElementById("popupFilter").children;
		filterPopup[1].addEventListener("click",e=>{e.target.classList.toggle("checked");search();});
		filterPopup[2].addEventListener("click",e=>{e.target.classList.toggle("checked");search();});
		filterPopup[3].addEventListener("click",e=>{e.target.classList.toggle("checked");search();});
		filterPopup[4].addEventListener("click",e=>{e.target.classList.toggle("checked");search();});
	listSite();
	if(document.URL.slice(-1)==="?")document.body.classList.add("onPopup");
	document.getElementById("clear").addEventListener("click",e=>{
		document.getElementById("search").value="";
		search();
	});
})();

function context(e){
	const a=e.target.parentElement;
	if(a.tagName==="A")return;
	if(a.classList.contains("folder")){
		const id=parseInt(a.getAttribute("id").substr(6)),
			  c=document.getElementById(`editFolder${id}`);
		if(!c){
			hideAll();
			removeContext();
			let dInput=document.createElement('img');
				dInput.className="deleteFolder";
				dInput.id=`deleteFolder${id}`;
				dInput.src="icons/delete.svg";
				dInput.title=i18n("delete");
				dInput.addEventListener('click',()=>{
					showDeleteFolder(`folder${id}`,e.target.childNodes[1].textContent);
				});
			let eInput=document.createElement('img');
				eInput.className="editFolder";
				eInput.id=`editFolder${id}`;
				eInput.src="icons/edit.svg";
				eInput.title=i18n("edit");
				eInput.addEventListener('click',()=>{
					showEditFolder(`folder${id}`,e.target.childNodes[1].textContent);
				});
			let sInput=document.createElement('img');
				sInput.className="scanFolder";
				sInput.id=`scanFolder${id}`;
				sInput.src="icons/scan2.svg";
				sInput.title=i18n("scanWebpage");
				sInput.addEventListener('click',()=>{
					scanFolder(`folder${id}`);
				});
			e.target.appendChild(sInput);
			e.target.appendChild(eInput);
			e.target.appendChild(dInput);
			prevContext=id;
		}
	}else if(a.tagName==="LI"){
		const id=parseInt(a.getAttribute("id").substr(4)),
			  c=document.getElementById(`edititem${id}`);
		if(!c){
			hideAll();
			removeContext();
			let eInput=document.createElement('input');
				eInput.className="editSite";
				eInput.id=`edititem${id}`;
				eInput.type="image";
				eInput.src="icons/edit.svg";
				eInput.title=i18n("edit");
				eInput.addEventListener('click',()=>{
					showEdit(id);
				});
			let dInput=document.createElement('input');
				dInput.className="deleteSite";
				dInput.id=`deleteitem${id}`;
				dInput.type="image";
				dInput.src="icons/delete.svg";
				dInput.title=i18n("delete");
				dInput.addEventListener('click',()=>{
					showDelete(id);
				});
			let sInput=document.createElement('input');
				sInput.className="scanPage";
				sInput.id=`scanitem${id}`;
				sInput.type="image";
				sInput.src="icons/scan2.svg";
				sInput.title=i18n("scanWebpage");
				browser.storage.local.get('sites').then(result=>{
					let local=result.sites[id];
					sInput.addEventListener('click',()=>{
						scanPage(local,id,false,true);
					});
				});
			let pInput=document.createElement('input');
				pInput.id=`pauseitem${id}`;
				pInput.type="image";
				if(a.dataset.paused==="true"){
					pInput.className="playScan";
					pInput.src="icons/play.svg";
					pInput.title=i18n("playScan");
				}else{
					pInput.className="pauseScan";
					pInput.src="icons/pause.svg";
					pInput.title=i18n("pauseScan");
				}
				pInput.addEventListener('click',()=>{
					browser.storage.local.get('sites').then(result=>{
						let sites=result.sites,
							paused=(pInput.className==="pauseScan")?true:false;
						sites[id]=Object.assign(sites[id],{paused});
						browser.storage.local.set({sites}).then(()=>{
							if(paused){
								pInput.className="playScan";
								pInput.src="icons/play.svg";
								pInput.title=i18n("playScan");
							}else{
								pInput.className="pauseScan";
								pInput.src="icons/pause.svg";
								pInput.title=i18n("pauseScan");
							}
							a.dataset.paused=paused;
						});
					});
				});
			a.insertBefore(dInput,a.firstChild);
			a.insertBefore(eInput,dInput);
			a.insertBefore(sInput,eInput);
			a.insertBefore(pInput,dInput);
			prevContext=id;
		}
	}
}

function removeContext(){
	if(prevContext!==undefined){
		if(prevContext<10000){
			let aParent=document.getElementById(`item${prevContext}`),
				e1=document.getElementById(`edititem${prevContext}`),
				e2=document.getElementById(`deleteitem${prevContext}`),
				e3=document.getElementById(`scanitem${prevContext}`),
				e4=document.getElementById(`pauseitem${prevContext}`);
			aParent.removeChild(e1);
			aParent.removeChild(e2);
			aParent.removeChild(e3);
			aParent.removeChild(e4);
		}else{
			let aParent=document.getElementById(`folder${prevContext}`).firstElementChild,
				e1=document.getElementById(`editFolder${prevContext}`),
				e2=document.getElementById(`deleteFolder${prevContext}`),
				e3=document.getElementById(`scanFolder${prevContext}`);
			aParent.removeChild(e1);
			aParent.removeChild(e2);
			aParent.removeChild(e3);
		}
	}
}

function listSite(send){
	if(send)browser.runtime.sendMessage({"listSite":true});
	if(document.getElementById("search").value||document.getElementById("popupFilter").classList.contains("checked"))
		search();
	else{
	browser.storage.local.get(['sites','sort']).then(result=>{
		prevContext=undefined;
		document.getElementById("lista").textContent="";
		const sites=result.sites,
			  sort=result.sort,
			  list=document.getElementById("lista");
		let lastFolder;
		sort.forEach((value,i)=>{
			if(value[2]==="item"){
				let id=parseInt(value[0].substr(4));
				let iLi=document.createElement('li');
					iLi.id=value[0];
					iLi.dataset.row="a"+i;
					iLi.dataset.folder=value[1];
					iLi.draggable=true;
					if(sites[id].changed){
						iLi.classList.add("changed");
						if(value[1]!=="root")document.getElementById(value[1]).classList.add("changedFolder");
					}
					if(sites[id].broken>1)iLi.classList.add("gray");
					if(sites[id].paused)iLi.dataset.paused=true;
					iLi.addEventListener('dragstart',dragStart);
				let iA=document.createElement('a');
				iA.textContent=sites[id].title;
				iA.addEventListener('mouseup',e=>{openItem(e,id);});
				let iImg=document.createElement('img');
					iImg.className="favicon";
					iImg.src=sites[id].favicon;
					iImg.draggable=false;
				iA.insertBefore(iImg,iA.firstChild);
				iLi.appendChild(iA);
				if(value[1]==="root"){
					list.appendChild(iLi);
				}else
					lastFolder.appendChild(iLi);
			}else{
				let iUl=document.createElement('ul');
					iUl.id=value[0];
					iUl.dataset.row="a"+i;
					iUl.dataset.folder="root";
					iUl.draggable=true;
					iUl.addEventListener('dragstart',dragStart);
					iUl.className=value[4]?"folder collapsed":"folder";
				let iA=document.createElement('a');
					iA.textContent=value[3];
				let iImg=document.createElement('img');
					iImg.className="folderIcon";
					iImg.src="icons/blank.svg";
					iImg.draggable=false;
				iUl.addEventListener("click",e=>{
					if(!e.ctrlKey){
						e.target.parentElement.classList.toggle("collapsed");
						saveSort();
					}
				});
				iImg.addEventListener("click",e=>{
					if(!e.ctrlKey){
						e.target.parentElement.parentElement.classList.toggle("collapsed");
						saveSort();
					}
				});
				iA.addEventListener("mousedown",e=>{
					updateHeight(iUl);
				});
				iA.addEventListener("mouseup",e=>{
					if(e.button===1||(e.button===0&&e.ctrlKey)){
						const folder=e.target.parentElement;					
						[...folder.childNodes].forEach(v=>{
							if(v.tagName==="LI"){
								const id=v.id.substr(4)*1;
								openItem(true,id);
							}
						});
					}
				});
				iA.insertBefore(iImg,iA.firstChild);
				iUl.appendChild(iA);
				list.appendChild(iUl);
				lastFolder=iUl;
			}
		});
	});
	}
}

function openItem(e,id){
	if(e.button!=2){
		browser.tabs.create({
			url:`${extURL}view.html?${id}`,
			active:(e===true||e.button===1||(e.button===0&&e.ctrlKey===true))?false:true
		});
		const eLi=document.getElementById("item"+id);
		if(eLi.classList.contains("changed")){
			updateBadge(-1);
			unchange([id]);
			eLi.classList.remove("changed");
			const parentFolder=eLi.parentElement;
			if(parentFolder.id!=="lista"&&parentFolder.classList.contains("changedFolder")){
				if(e===true) parentFolder.classList.remove("changedFolder");
				else unchangeFolder(parentFolder.id);
			}
		}
	}
}
				
function search(){
	const s=document.getElementById("search").value,
		  cha=document.getElementById("popupFilter").children[1].classList.contains("checked"),
		  pau=document.getElementById("popupFilter").children[2].classList.contains("checked"),
		  bro=document.getElementById("popupFilter").children[3].classList.contains("checked"),
		  nor=document.getElementById("popupFilter").children[4].classList.contains("checked");
	if(cha||pau||bro||nor)
		document.getElementById("popupFilter").classList.add("checked");
	else
		document.getElementById("popupFilter").classList.remove("checked");
	if(s||cha||pau||bro||nor){
		browser.storage.local.get(['sites']).then(result=>{
			prevContext=undefined;
			document.getElementById("lista").textContent="";
			const sites=result.sites,
				  list=document.getElementById("lista");
			let filtred=sites.filter(v=>{
				return v.title.toUpperCase().includes(s.toUpperCase())||v.url.toUpperCase().includes(s.toUpperCase());
			});
			filtred=filtred.filter(v=>{
				return (cha&&v.changed===true)||(pau&&v.paused===true)||(bro&&v.broken>=2)||(nor&&v.changed!=true&&v.paused!=true&&v.broken<2)||(!cha&&!pau&&!bro&&!nor);
			});
			filtred.forEach(value=>{
				let id=sites.indexOf(value),
					iLi=document.createElement('li');
					iLi.id="item"+id;
					if(value.changed)iLi.classList.add("changed");
					if(value.broken>1)iLi.classList.add("gray");
					if(value.paused)iLi.dataset.paused=true;
					iLi.addEventListener('dragstart',dragStart);
				let iA=document.createElement('a');
				iA.textContent=value.title;
				iA.addEventListener('mouseup',e=>{
					if(e.button!=2){
						if(e.target.parentNode.classList.contains("changed"))updateBadge(-1);
						browser.tabs.create({
							url:`${extURL}view.html?${id}`,
							active:(e.button===1||(e.button===0&&e.ctrlKey===true))?false:true
						});
						unchange([id]);
						iLi.classList.remove("changed");
					}
				});
				let iImg=document.createElement('img');
					iImg.className="favicon";
					iImg.src=value.favicon;
				iA.insertBefore(iImg,iA.firstChild);
				iLi.appendChild(iA);
				list.appendChild(iLi);
			});
		});
	}else{
		listSite();
	}
}

function showAddFolder(){
	hideAll("addFolder");
	document.getElementById("nameFolderA").value="";
	document.getElementById("addingFolder").classList.toggle("hidden");
	document.getElementById("addFolder").classList.toggle("open");
}

function showEditFolder(id,name){
	hideAll("editFolder");
	document.getElementById("editSaveF").dataset.id=id;
	document.getElementById("nameFolder").value=name;
	document.getElementById("editingFolder").classList.remove("hidden");
}

function editFolder(id){
	let newName=document.getElementById("nameFolder").value;
	newName=newName?newName:i18n("newFolder");
	document.getElementById("editingFolder").classList.add("hidden");
	document.getElementById(id).firstElementChild.childNodes[1].textContent=newName;
	saveSort();
	statusbar(i18n("savedWebpage",newName));
}

function showDeleteFolder(id,name){
	hideAll("deleteFolder");
	document.getElementById("deleteSaveF").dataset.id=id;
	document.getElementById("deleteFolderName").textContent=name;
	document.getElementById("deletingFolder").classList.remove("hidden");
}

function deleteFolder(id){
	let name=document.getElementById("deleteFolderName").textContent;
	document.getElementById("deletingFolder").classList.add("hidden");
	browser.storage.local.get('sort').then(result=>{
		let sort=result.sort;
		sort.forEach((value,i)=>{
			if(value[0]===id)
				sort.splice(i,1);
		});	
		sort.forEach((value,i)=>{
			if(value[1]===id)
				sort[i][1]="root";
		});
		browser.storage.local.set({sort}).then(()=>{
			statusbar(i18n("deletedWebpage",name));
			listSite(true);
		});
	});
}

function showEdit(e){
	hideAll("edit");
	browser.storage.local.get(['sites','settings']).then(result=>{
		const table=result.sites;
		document.getElementById("editSite").dataset.id=e;
		document.getElementById("editingSite").classList.remove("hidden");
		document.getElementById("eUrl").value=table[e].url;
		document.getElementById("eTitle").value=table[e].title;
		document.getElementById("eCharset").value=table[e].charset?table[e].charset:result.settings.charset;
		const freq=table[e].freq;
		let multi;
		if(!(freq%168))
			multi=168;
		else if(!(freq%24))
			multi=24;
		else if(freq<1)
			multi=0.0166667;
		else
			multi=1;
		document.getElementById("eFreq").value=parseInt(freq/multi);
		document.getElementById("eMulti").value=multi;		
		document.getElementById("eMode").value=table[e].mode;
	});
}

function editSite(e){
	document.getElementById("editingSite").classList.add("hidden");
	browser.storage.local.get(['sites','settings']).then(result=>{
		let sites=result.sites,
			freq=parseInt(document.getElementById("eFreq").value);
		let obj={
			title:	document.getElementById("eTitle").value,
			url:	document.getElementById("eUrl").value,
			mode:	document.getElementById("eMode").value,
			favicon:"https://www.google.com/s2/favicons?domain="+document.getElementById("eUrl").value,
			freq:	freq>0?freq*parseFloat(document.getElementById("eMulti").value):8,
			charset:document.getElementById("eCharset").value?document.getElementById("eCharset").value:result.settings.charset
		};
		sites[e]=Object.assign(sites[e],obj);
		browser.storage.local.set({sites}).then(()=>{
			statusbar(i18n("savedWebpage",sites[e].title));
			listSite(true);
		});
	});
}

function showDelete(e){
	hideAll("delete");
	browser.storage.local.get('sites').then(result=>{
		const sites=result.sites;
		document.getElementById("deleteSite").dataset.id=e;
		document.getElementById("deleteTitle").textContent=sites[e].title;
		document.getElementById("deleteUrl").textContent=sites[e].url;
		document.getElementById("deletingSite").classList.remove("hidden");
	});
}

function deleteSite(e){
	document.getElementById("deletingSite").classList.add("hidden");
	browser.storage.local.get(['sites','changes','sort']).then(result=>{
		let sites=result.sites,
			changes=result.changes,
			sort=result.sort,
			sSort;
		statusbar(i18n("deletedWebpage",sites[e].title));
		sites.splice(e,1);
		changes.splice(e,1);
		if(sort){
			sort.forEach((value,i)=>{
				const id=parseInt(value[0].substr(4));
				if(id===e)sSort=i;
				else if(id>e)sort[i][0]=`item${id-1}`;
			});
			sort.splice(sSort,1);
		}
		browser.storage.local.set({sites:sites,changes:changes,sort:sort}).then(()=>{
			listSite(true);
			browser.runtime.sendMessage({"deletedSite":true,"id":e});
		});
	});
}

function showAdd(){
	hideAll("add");
	document.getElementById("addingSite").classList.toggle("hidden");
	document.getElementById("showAdd").classList.toggle("open");
	document.getElementById("aUrl").value="";
	document.getElementById("aTitle").value="";
	document.getElementById("aFreq").value=8;
	document.getElementById("aMulti").value=1;
	document.getElementById("aMode").value="m0";
}

function addSite(){
	const url=document.getElementById("aUrl").value,
		  title=document.getElementById("aTitle").value,
		  mode=document.getElementById("aMode").value,
		  aFreq=parseInt(document.getElementById("aFreq").value),
		  freq=aFreq>0?aFreq*parseFloat(document.getElementById("aMulti").value):8;
	rqstAdd(url,title,mode,freq);
	document.getElementById("addingSite").classList.add("hidden");
	document.getElementById("showAdd").classList.remove("open");
}

function fillForm(){
	browser.tabs.query({currentWindow:true,active:true}).then(tabs=>{
		let tab=tabs[0];
		document.getElementById("aUrl").value=tab.url;
		document.getElementById("aTitle").value=tab.title;
	});
}

function hideAll(e){
	if(e!="add"){
		document.getElementById("addingSite").classList.add("hidden");
		document.getElementById("aUrl").value="";
		document.getElementById("aTitle").value="";
		document.getElementById("aFreq").value=8;
		document.getElementById("aMulti").value=1;
		document.getElementById("aMode").value="m0";
		document.getElementById("showAdd").classList.remove("open");
	}
	if(e!="edit"){
		document.getElementById("editingSite").classList.add("hidden");
		document.getElementById("eUrl").value="";
		document.getElementById("eTitle").value="";
		document.getElementById("eCharset").value="";
		document.getElementById("eFreq").value=8;
		document.getElementById("eMulti").value=1;
		document.getElementById("eMode").value="m0";
	}
	if(e!="delete"){
		document.getElementById("deletingSite").classList.add("hidden");
		document.getElementById("deleteTitle").textContent="";
		document.getElementById("deleteUrl").textContent="";
	}
	if(e!="addFolder"){
		document.getElementById("addingFolder").classList.add("hidden");
		document.getElementById("nameFolderA").value="";
		document.getElementById("addFolder").classList.remove("open");
	}
	if(e!="editFolder"){
		document.getElementById("editingFolder").classList.add("hidden");
		document.getElementById("nameFolder").value="";
	}
	if(e!="deleteFolder"){
		document.getElementById("deletingFolder").classList.add("hidden");
		document.getElementById("deleteFolderName").textContent="";
	}
}

function statusbar(e){
	let statusbar=document.getElementById("statusbar");
	if(typeof(e)==="string"){
		statusbar.textContent=e;
		setTimeout(()=>{if(statusbar.textContent===e)statusbar.removeAttribute("class");},5000);
	}else{
		let progress;
		if(e[0]===1){
			statusbar.textContent="";
			progress=document.createElement('progress');
			progress.max=e[1];
			statusbar.appendChild(progress);
		}else{
			progress=document.getElementsByTagName("progress")[0];
		}
		progress.value=e[0];
	}
	statusbar.className="visible";
}


function updateHeight(elm,remove){
	if(remove)elm.style.height=null
	else elm.style.height=elm.scrollHeight+"px";
}

function unchangeFolder(id){
	if(id===true){
		[...document.getElementsByClassName("changedFolder")].forEach(v=>{
			v.classList.remove("changedFolder");
		});
	}else{
		const folder=document.getElementById(id);
		let changedInFolder=[...folder.childNodes].filter(v=>{
			return v.classList.contains("changed");
		});
		if(changedInFolder.length===0)folder.classList.remove("changedFolder");
	}
}

function scanFolder(id){
	hideAll();
	const folder=document.getElementById(id);
	let ids=[...folder.childNodes].map(v=>{
		if(v.tagName==="LI")
			return v.id.substr(4)*1;
	});
	ids.shift();
	browser.storage.local.get('sites').then(result=>{
		const sites=result.sites,
			  len=ids.length;
		ids.forEach(i=>{
			let local=sites[i];
			if(local.changed||local.paused){
				scanCompleted(len,false);
			}else{
				scanPage(local,i,false,len);
			}
		});
	});
}

browser.runtime.onMessage.addListener(run);
function run(m){
	if(m.listSite)listSite();
	if(m.changeTheme)document.documentElement.className=m.changeTheme;
	if(m.search!==undefined)document.documentElement.dataset.search=m.search;
}

function translate(){
	document.title=i18n("extensionName");
	document.getElementById("addCancel").textContent=i18n("cancel");
	document.getElementById("addSite").textContent=i18n("add");
	document.getElementById("addSaveF").textContent=i18n("add");
	document.getElementById("fillForm").textContent=i18n("fillForm");
	document.getElementById("editCancel").textContent=i18n("cancel");
	document.getElementById("editSite").textContent=i18n("save");
	document.getElementById("deleteCancel").textContent=i18n("cancel");
	document.getElementById("deleteSite").textContent=i18n("delete");
	document.getElementById("scanSites").title=i18n("scanWebpage");
	document.getElementById("openSite").title=i18n("openWebpage");
	document.getElementById("showAdd").title=i18n("addWebpage");
	document.getElementById("addFolder").title=i18n("addFolder");
	document.getElementById("options").title=i18n("options");
	document.getElementById("addWebpage").textContent=i18n("addWebpage");
	document.getElementById("addressA").textContent=i18n("address");
	document.getElementById("titleA").textContent=i18n("title");
	document.getElementById("scanFreqA").textContent=i18n("scanFreq");
	document.getElementById("addressE").textContent=i18n("address");
	document.getElementById("titleE").textContent=i18n("title");
	document.getElementById("scanFreqE").textContent=i18n("scanFreq");
	document.getElementById("charsetE").textContent=i18n("charset");
	document.getElementById("editWebpage").textContent=i18n("editWebpage");
	document.getElementById("modeTitleA").textContent=i18n("modeTitle");
	document.getElementById("modeTitleE").textContent=i18n("modeTitle");
	document.getElementById("deleteWebpage").textContent=i18n("deleteWebpage");
	document.getElementById("editFolder").textContent=i18n("editFolder");
	document.getElementById("nFolder").textContent=i18n("name");
	document.getElementById("nFolderA").textContent=i18n("name");
	document.getElementById("addCancelF").textContent=i18n("cancel");
	document.getElementById("editCancelF").textContent=i18n("cancel");
	document.getElementById("editSaveF").textContent=i18n("save");
	document.getElementById("deleteFolder").textContent=i18n("deleteFolder");
	document.getElementById("deleteFolderDesc").textContent=i18n("deleteFolderDesc");
	document.getElementById("deleteCancelF").textContent=i18n("cancel");
	document.getElementById("deleteSaveF").textContent=i18n("delete");
	document.getElementById("addFolderTitle").textContent=i18n("addFolder");
	document.getElementById("search").placeholder=i18n("search");
	document.getElementById("hidePages").textContent=i18n("hidePages");
	
	let selectMultiA=document.getElementById("aMulti").options;
		selectMultiA[0].text=i18n("minutes");
		selectMultiA[1].text=i18n("hours");
		selectMultiA[2].text=i18n("days");
		selectMultiA[3].text=i18n("weeks");
	let selectModeA=document.getElementById("aMode").options;
		selectModeA[0].text=i18n("modeM0");
		selectModeA[1].text=i18n("modeM3");
		selectModeA[2].text=i18n("modeM4");
		selectModeA[3].text=i18n("modeM1");
		selectModeA[4].text=i18n("modeM2");
	let selectMultiE=document.getElementById("eMulti").options;
		selectMultiE[0].text=i18n("minutes");
		selectMultiE[1].text=i18n("hours");
		selectMultiE[2].text=i18n("days");
		selectMultiE[3].text=i18n("weeks");
	let selectModeE=document.getElementById("eMode").options;
		selectModeE[0].text=i18n("modeM0");
		selectModeE[1].text=i18n("modeM3");
		selectModeE[2].text=i18n("modeM4");
		selectModeE[3].text=i18n("modeM1");
		selectModeE[4].text=i18n("modeM2");
	let popupFilter=document.getElementById("popupFilter").children;
		popupFilter[1].textContent=i18n("changed");
		popupFilter[2].textContent=i18n("paused");
		popupFilter[3].textContent=i18n("broken");
		popupFilter[4].textContent=i18n("normal");
}
