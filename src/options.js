(function(){
	let section=window.location.hash;
	if(!section)window.location.hash="#options";
	else changeActive(section.substr(1));
	translate();
	document.getElementById("notificationVolume").addEventListener("change",e=>{document.getElementById("oVolume").value=e.target.value;});
	document.getElementById("notificationTime").addEventListener("change",e=>{document.getElementById("oTime").value=parseInt(e.target.value/1000);});
	document.getElementById("openWindow").addEventListener("change",e=>{
		let checked=e.target.checked,
			more=document.getElementById("openWindowMore"),
			moreLabel=document.getElementById("labelOpenWindowMore");
		more.className=checked;
		more.disabled=!checked;
		moreLabel.className=checked;
	});
	document.getElementById("showNotification").addEventListener("change",e=>{
		let checked=e.target.checked;
		document.getElementById("trTime").className="row "+checked;
		document.getElementById("notificationTime").disabled=!checked;
	});
	document.getElementById("showNextPrev").addEventListener("change",e=>{
		let checked=e.target.checked,
			autoScroll=document.getElementById("scrollToFirstChange"),
			autoScrollLabel=document.getElementById("labelScrollToFirstChange"),
			skip=document.getElementById("skipMinorChanges"),
			skipLabel=document.getElementById("labelSkipMinorChanges");
		autoScroll.className=checked;
		autoScroll.disabled=!checked;
		autoScrollLabel.className=checked;
		skip.className=checked;
		skip.disabled=!checked;
		skipLabel.className=checked;
	});
	document.addEventListener("DOMContentLoaded",restoreOptions);
	document.getElementById("optionsForm").addEventListener("change",saveOptions);
	document.getElementById("backup").addEventListener("click",createBackup);
	document.getElementById("file").addEventListener("change",handleFileSelect);
	document.getElementById("restore").addEventListener("click",restoreBackup);
	window.addEventListener("hashchange",e=>{changeActive(e.newURL.split("#")[1]);});
	document.getElementById("addToContextMenu").addEventListener("change",e=>{browser.runtime.sendMessage({"addToContextMenu":e.target.checked});});
	document.getElementById("theme").addEventListener("change",e=>{browser.runtime.sendMessage({"changeTheme":e.target.value});});
	document.getElementById("import").addEventListener("click",importFolder);
	document.getElementById("export").addEventListener("click",exportFolder);
	document.getElementById("importContinue").addEventListener("click",e=>{e.preventDefault();importFinish(document.getElementById("folderList").value);});
	document.getElementById("folderList").addEventListener("change",importBookmarksList);
	document.getElementById("deleteDuplicates").addEventListener("click",deleteDuplicates);
	document.getElementById("deleteBroken").addEventListener("click",deleteBroken);
	document.getElementById("deleteDuplicatesConfirm").addEventListener("click",deleteDuplicatesConfirm);
	document.getElementById("deleteBrokenConfirm").addEventListener("click",deleteBrokenConfirm);
})();

function saveOptions(){
	const rqstTime=parseInt(document.getElementById("requestTime").value*1000);
	let settings={
		notificationVolume:	parseInt(document.getElementById("notificationVolume").value),
		notificationTime:	parseInt(document.getElementById("notificationTime").value),
		showNotification:	document.getElementById("showNotification").checked,
		autoOpen:			document.getElementById("autoOpen").checked,
		hideHeader:			document.getElementById("hideHeader").checked,
		defaultView:		document.getElementById("defaultView").value,
		openWindow:			document.getElementById("openWindow").checked,
		openWindowMore:		document.getElementById("openWindowMore").checked?1:0,
		requestTime:		rqstTime>0?rqstTime:10000,
		diffOld:			document.getElementById("diffOld").checked,
		popupList:			document.getElementById("popupList").checked,
		theme:				document.getElementById("theme").value,
		showNextPrev:		document.getElementById("showNextPrev").checked,
		scrollToFirstChange:document.getElementById("scrollToFirstChange").checked,
		skipMinorChanges:	document.getElementById("skipMinorChanges").checked,
		addToContextMenu:	document.getElementById("addToContextMenu").checked,
		changelog:			document.getElementById("openChangelog").checked,
		charset:			document.getElementById("defaultCharset").value?document.getElementById("defaultCharset").value:"utf-8"
	};
	browser.storage.local.set({settings:settings});
	if(!settings.popupList)browser.browserAction.setPopup({popup:"/popup.html"});
	else browser.browserAction.setPopup({popup:"/sidebar.html"});
}

function restoreOptions(){
	browser.storage.local.get('settings').then(result=>{
		let s=result.settings,
			openWindowMore=s.openWindowMore?true:false;
		document.getElementById("notificationVolume").value=s.notificationVolume;
		document.getElementById("oVolume").value=s.notificationVolume;
		document.getElementById("notificationTime").value=s.notificationTime;
		document.getElementById("oTime").value=parseInt(s.notificationTime/1000);
		document.getElementById("autoOpen").checked=s.autoOpen;
		document.getElementById("hideHeader").checked=s.hideHeader;
		document.getElementById("showNotification").checked=s.showNotification;
		document.getElementById("defaultView").value=s.defaultView;
		document.getElementById("trTime").className="row "+s.showNotification;
		document.getElementById("notificationTime").disabled=!s.showNotification;
		document.getElementById("openWindow").checked=s.openWindow;
		document.getElementById("openWindowMore").checked=openWindowMore;
		document.getElementById("openWindowMore").disabled=!s.openWindow;
		document.getElementById("openWindowMore").className=s.openWindow;
		document.getElementById("labelOpenWindowMore").className=s.openWindow;
		document.getElementById("requestTime").value=parseInt(s.requestTime/1000);
		document.getElementById("diffOld").checked=s.diffOld;
		document.getElementById("popupList").checked=s.popupList;
		document.getElementById("theme").value=s.theme?s.theme:"light";
		document.getElementById("showNextPrev").checked=s.showNextPrev;
		document.getElementById("scrollToFirstChange").checked=s.scrollToFirstChange;
		document.getElementById("skipMinorChanges").checked=s.skipMinorChanges;
		document.getElementById("scrollToFirstChange").className=s.showNextPrev;
		document.getElementById("skipMinorChanges").className=s.showNextPrev;
		document.getElementById("scrollToFirstChange").disabled=!s.showNextPrev;
		document.getElementById("skipMinorChanges").disabled=!s.showNextPrev;
		document.getElementById("labelScrollToFirstChange").className=s.showNextPrev;
		document.getElementById("labelSkipMinorChanges").className=s.showNextPrev;
		document.getElementById("addToContextMenu").checked=s.addToContextMenu;
		document.getElementById("openChangelog").checked=s.changelog;
		document.getElementById("defaultCharset").value=s.charset;
	});
}

function createBackup(e){
	e.preventDefault();
	browser.storage.local.get().then(result=>{
		let a=document.createElement("a");
		document.body.appendChild(a);
		let json=JSON.stringify(result),
			blob=new Blob([json],{type:"octet/stream"}),
			url=window.URL.createObjectURL(blob),
			d=new Date(),
			date=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
		a.href=url;
		a.download=`${i18n("extensionName")} - ${date}.json`;
		a.style.display="none";
		a.click();
		window.URL.revokeObjectURL(url);
	});
}

function translate(){
	document.title=i18n("extensionName");
	document.getElementById("optionsA").textContent=i18n("options");
	document.getElementById("managementA").textContent=i18n("management");
	document.getElementById("changelogA").textContent=i18n("changelog");
	document.getElementById("supportA").textContent=i18n("support");
	document.getElementById("h2options").textContent=i18n("options");
	document.getElementById("thGeneral").textContent=i18n("general");
	document.getElementById("labelAutoOpen").textContent=i18n("autoOpen");
	document.getElementById("labelHideHeader").textContent=i18n("hideHeader");
	document.getElementById("labelDefaultView").textContent=i18n("defaultView");
	let defaultViewSelect=document.getElementById("defaultView").options;
		defaultViewSelect[0].text=i18n("highlight");
		defaultViewSelect[1].text=i18n("newElements");
		defaultViewSelect[2].text=i18n("deletedElements");
		defaultViewSelect[3].text=i18n("newVersion");
		defaultViewSelect[4].text=i18n("oldVersion");
	document.getElementById("thNotifications").textContent=i18n("notifications");
	document.getElementById("labelShow").textContent=i18n("showNotification");
	document.getElementById("volumeLabel").textContent=i18n("volume");
	document.getElementById("timeLabel").textContent=i18n("notificationTime");
	document.getElementById("labelRequestTime").textContent=i18n("maxRequestTime");
	document.getElementById("thChangedPages").textContent=i18n("changedPages");
	document.getElementById("labelOpenWindow").textContent=i18n("openNewWindow");
	document.getElementById("labelOpenWindowMore").textContent=i18n("openNewWindowMore");
	document.getElementById("labelDiffOld").textContent=i18n("diffOld");
	document.getElementById("labelPopupList").textContent=i18n("popupList");	
	document.getElementById("labelTheme").textContent=i18n("theme");
	let theme=document.getElementById("theme").options;
		theme[0].text=i18n("lightTheme");
		theme[1].text=i18n("darkTheme");
	document.getElementById("h3pageView").textContent=i18n("h3PageView");
	document.getElementById("labelShowNextPrev").textContent=i18n("showNextPrev");
	document.getElementById("labelScrollToFirstChange").textContent=i18n("scrollToFirstChange");
	document.getElementById("labelSkipMinorChanges").textContent=i18n("skipMinorChanges");
	document.getElementById("thBackup").textContent=i18n("thBackup");
	document.getElementById("backup").textContent=i18n("backup");
	document.getElementById("fileText").textContent=i18n("restoreBackup");
	document.getElementById("restoreAlertH4").textContent=i18n("restoreAlertH4");
	document.getElementById("restoreAlertP").textContent=i18n("restoreAlertP");
	document.getElementById("restore").textContent=i18n("restoreButton");
	document.getElementById("restoreError").textContent=i18n("restoreError");
	document.getElementById("restoreOk").textContent=i18n("restoreOk");
	document.getElementById("h2changelog").textContent=i18n("changelog");
	document.getElementById("h2support").textContent=i18n("support");
	document.getElementById("h3bugReport").textContent=i18n("bugReport");
	document.getElementById("spanBugReport").textContent=i18n("spanBugReport");
	document.getElementById("h3translation").textContent=i18n("translation");
	document.getElementById("spanTranslation1").textContent=i18n("spanTranslation1");
	document.getElementById("spanTranslation2").textContent=i18n("spanTranslation2");
	document.getElementById("spanTranslation3").textContent=i18n("spanTranslation3");
	document.getElementById("h3share").textContent=i18n("share");
	document.getElementById("spanShare").textContent=i18n("spanShare");
	document.getElementById("labelAddToContextMenu").textContent=i18n("addToContextMenu");
	document.getElementById("labelOpenChangelog").textContent=i18n("openChangelog");
	document.getElementById("labelDefaultCharset").textContent=i18n("defaultCharset");
	document.getElementById("thImport").textContent=i18n("importExport");
	document.getElementById("import").textContent=i18n("importBtn");
	document.getElementById("importFolder").placeholder=i18n("folderName");
	document.getElementById("importAlertH4").textContent=i18n("importAlertH4");
	document.getElementById("importAlertP").textContent=i18n("importAlertP");
	document.getElementById("importContinue").textContent=i18n("continue");
	document.getElementById("export").textContent=i18n("exportBtn");
	document.getElementById("exportOK").textContent=i18n("exportOK");
	document.getElementById("h2management").textContent=i18n("management");
	document.getElementById("h3management").textContent=i18n("general");
	document.getElementById("deleteDuplicates").textContent=i18n("deleteDuplicates");
	document.getElementById("deleteBroken").textContent=i18n("deleteBroken");
	document.getElementById("deleteDuplicatesConfirm").textContent=i18n("delete");
	document.getElementById("deleteBrokenConfirm").textContent=i18n("delete");
}

function i18n(e,s1){
	return browser.i18n.getMessage(e,s1);
}

function changeActive(e){
	document.getElementById("optionsA").removeAttribute("class");
	document.getElementById("managementA").removeAttribute("class");
	document.getElementById("changelogA").removeAttribute("class");
	document.getElementById("supportA").removeAttribute("class");
	document.getElementById(e+"A").className="active";
}

let uploaded;

function handleFileSelect(e){
	let file=e.target.files[0];
	if(file.type==="application/json"||file.type==="application/x-javascript"){
		let reader=new FileReader();
		reader.onload=function(event){
			try{
				uploaded=JSON.parse(event.target.result);
				document.getElementById("restoreError").classList.add("none");
				document.getElementById("restoreAlert").classList.remove("none");
			}catch(e){
				document.getElementById("restoreAlert").classList.add("none");
				document.getElementById("restoreError").classList.remove("none");
			}
			document.getElementById("restoreOk").classList.add("none");
		};
		reader.onerror=function(event){
			document.getElementById("restoreAlert").classList.add("none");
			document.getElementById("restoreOk").classList.add("none");
			document.getElementById("restoreError").classList.remove("none");
		}
		reader.readAsText(file);
	}
}

function restoreBackup(){
	browser.storage.local.set({sites:uploaded.sites,changes:uploaded.changes,sort:uploaded.sort}).then(()=>{
		document.getElementById("restoreAlert").classList.add("none");
		document.getElementById("restoreOk").classList.remove("none");
		browser.runtime.sendMessage({"listSite":true});
	},()=>{
		document.getElementById("restoreAlert").classList.add("none");
		document.getElementById("restoreError").classList.remove("none");
	});
}

function importFolder(e){
	e.preventDefault();
	let folderName=document.getElementById("importFolder").value.trim()||i18n("extensionName"),
		folders=0,
		folderNum=0,
		folderList=document.getElementById("folderList");
		folderList.textContent="";
		document.getElementById("bookmarksList").textContent="";
	browser.bookmarks.search({title:folderName}).then(q=>{
		let empty=document.createElement("option");
			empty.hidden=true;
			folderList.add(empty); 
		q.forEach((v,i)=>{
			if(v.type==="folder"){
				folders++;
				let option=document.createElement("option");
				option.text=`${folderName} [${i}]`;
				option.value=v.id;
				folderList.add(option);
				folderNum=i;
			}	
		});
		switch(folders){
			case 0:
				document.getElementById("importOK").classList.add("none");
				document.getElementById("importAlert").classList.add("none");
				document.getElementById("importAlert2").classList.add("none");
				document.getElementById("importError").classList.remove("none");
				document.getElementById("importError").textContent=i18n("importError",folderName);
				break;
			case 1:
				importFinish(q[folderNum].id);
				break;
			default:
				document.getElementById("importError").classList.add("none");
				document.getElementById("importOK").classList.add("none");
				document.getElementById("importAlert2").classList.add("none");
				document.getElementById("importAlert").classList.remove("none");
		}
		document.getElementById("management").scrollIntoView(false);
	});
}

function importFinish(folderId){
	document.getElementById("importError").classList.add("none");
	document.getElementById("importAlert").classList.add("none");
	document.getElementById("importAlert2").classList.add("none");
	browser.bookmarks.getChildren(folderId).then(bookmarks=>{
		let urlList=[],
			folderList=[];
		browser.storage.local.get("sites").then(result=>{
			let sites=result.sites;
			sites.forEach(v=>{
				urlList.push(v.url);
			});
			bookmarks.forEach((v,i)=>{
				if(v.type==="bookmark"){
					folderList.push({url:v.url,title:v.title});
					if(urlList.indexOf(v.url)<0)
						setTimeout(()=>{browser.runtime.sendMessage({"addThis":true,"url":v.url,"title":v.title,"btn":1,"favicon":false});},i*1000);
					setTimeout(()=>{document.getElementById("importOK").textContent=i18n("importing",[i+1,bookmarks.length,v.title]);},i*1000);
				}
			});
			setTimeout(()=>{document.getElementById("importOK").textContent=i18n("checking");importCheck(folderList);},bookmarks.length*1000+5000);
			document.getElementById("importOK").classList.remove("none");
			document.getElementById("management").scrollIntoView(false);
		});
	});
}

function importBookmarksList(e){
	document.getElementById("importContinue").classList.remove("none");
	browser.bookmarks.getChildren(e.target.value).then(bookmarks=>{
		let ul=document.getElementById("bookmarksList");
		document.getElementById("bookmarksList").textContent="";
		if(!bookmarks.length)document.getElementById("bookmarksList").textContent=i18n("emptyFolder");
		for(let i=0;(i<bookmarks.length&&i<10);i++){
			let li=document.createElement("li");
			li.appendChild(document.createTextNode(bookmarks[i].title));
			  ul.appendChild(li);
		}
	});
}

function importCheck(folderList){
	browser.storage.local.get("sites").then(result=>{
		let sites=result.sites,
			urlList=[],
			notAdded=[];
		sites.forEach(v=>{
			urlList.push(v.url);
		});
		folderList.forEach(v=>{
			if(urlList.indexOf(v.url)<0)
				notAdded.push({url:v.url,title:v.title});
		});
		if(notAdded.length){
			notAdded.forEach((v,i)=>{
				setTimeout(()=>{
					browser.runtime.sendMessage({"addThis":true,"url":v.url,"title":v.title,"btn":1,"favicon":false});
					document.getElementById("importOK").textContent=i18n("importing",[i+1,notAdded.length,v.title]);
				},i*2500);
			});
			setTimeout(()=>{document.getElementById("importOK").textContent=i18n("checking");importCheck2(notAdded);},notAdded.length*2500+5000);
		}else document.getElementById("importOK").textContent=i18n("importOK");
	});
}

function importCheck2(notAddedList){
	browser.storage.local.get("sites").then(result=>{
		let sites=result.sites,
			urlList=[],
			notAdded=[];
		sites.forEach(v=>{
			urlList.push(v.url);
		});
		notAddedList.forEach(v=>{
			if(urlList.indexOf(v.url)<0)
				notAdded.push({url:v.url,title:v.title});
		});
		document.getElementById("importOK").textContent=i18n("importOK");
		if(notAdded.length){
			document.getElementById("importAlert2H4").textContent=i18n("importAlert2H4",notAdded.length);
			document.getElementById("importAlert2").classList.remove("none");
			let ul=document.getElementById("notAdded");
			document.getElementById("notAdded").textContent="";
			notAdded.forEach(v=>{
				let li=document.createElement("li"),
					a=document.createElement("a");
				a.appendChild(document.createTextNode(v.title));
				a.href=v.url;
				a.target="_blank";
				li.appendChild(a);
				ul.appendChild(li);
			});
		}
		document.getElementById("management").scrollIntoView(false);
	});
}

function exportFolder(e){
	e.preventDefault();
	browser.bookmarks.search({
		title:i18n("extensionName")
	}).then(search=>{
		if(search.length){
			let folderId;
			search.forEach(v=>{
				if(v.type==="folder")folderId=v.id;
			});
			if(!folderId){
				browser.bookmarks.create({
					title:i18n("extensionName"),
					type:"folder",
					index:0
				}).then(folder=>{
					exportAddBookmarks(folder.id);
				});
			}else exportAddBookmarks(folderId);
		}else{
			browser.bookmarks.create({
				title:i18n("extensionName"),
				type:"folder",
				index:0
			}).then(folder=>{
				exportAddBookmarks(folder.id);
			});
		}
	});
}

function exportAddBookmarks(folderId){
	browser.storage.local.get("sites").then(result=>{
		let sites=result.sites,
			folderList=[];
		browser.bookmarks.getChildren(folderId).then(bookmarks=>{
			bookmarks.forEach(v=>{
				folderList.push(v.url);
			});
			sites.forEach(v=>{
				if(folderList.indexOf(v.url)<0){
					browser.bookmarks.create({
						parentId:folderId,
						title:v.title,
						url:v.url,
						index:0
					});
				}
			});
			document.getElementById("exportOK").classList.remove("none");
			document.getElementById("management").scrollIntoView(false);
		});
	});
}

let duplicatedSites,
	brokenSites;

function deleteDuplicates(e){
	e.preventDefault();
	browser.storage.local.get("sites").then(result=>{
		let sites=result.sites,
			urlList={},
			ul=document.getElementById("deletedDuplicates");
		duplicatedSites=[];
		sites.forEach((v,i)=>{
			if(urlList[v.url])
				duplicatedSites.unshift([i,v.url,v.title]);
			else
				urlList[v.url]=true;
		});
		if(duplicatedSites.length){
			document.getElementById("duplicatesAlertH4").textContent=i18n("deleteAlertH4",duplicatedSites.length);
			ul.textContent="";
			duplicatedSites.forEach(v=>{
				let li=document.createElement("li"),
					a=document.createElement("a");
				a.appendChild(document.createTextNode(v[2]));
				a.href=v[1];
				a.target="_blank";
				li.appendChild(a);
				ul.appendChild(li);
			});
			document.getElementById("duplicatesOK").classList.add("none");
			document.getElementById("duplicatesAlert").classList.remove("none");
		}else{
			document.getElementById("duplicatesOKH4").textContent=i18n("noDuplicates");
			document.getElementById("duplicatesAlert").classList.add("none");
			document.getElementById("duplicatesOK").classList.remove("none");
		}
	});
}

function deleteDuplicatesConfirm(e){
	e.preventDefault();
	deleteSite(0,"duplicates");
	document.getElementById("duplicatesOKH4").textContent=i18n("deleting");
	document.getElementById("duplicatesAlert").classList.add("none");
	document.getElementById("duplicatesOK").classList.remove("none");
}

function deleteBroken(e){
	e.preventDefault();
	browser.storage.local.get("sites").then(result=>{
		let sites=result.sites,
			urlList={},
			ul=document.getElementById("deletedBroken");
		brokenSites=[];
		sites.forEach((v,i)=>{
			if(v.broken)
				brokenSites.unshift([i,v.url,v.title]);
		});
		if(brokenSites.length){
			document.getElementById("brokenAlertH4").textContent=i18n("deleteAlertH4",brokenSites.length);
			ul.textContent="";
			brokenSites.forEach(v=>{
				let li=document.createElement("li"),
					a=document.createElement("a");
				a.appendChild(document.createTextNode(v[2]));
				a.href=v[1];
				a.target="_blank";
				li.appendChild(a);
				ul.appendChild(li);
			});
			document.getElementById("brokenOK").classList.add("none");
			document.getElementById("brokenAlert").classList.remove("none");
		}else{
			document.getElementById("brokenOKH4").textContent=i18n("noBroken");
			document.getElementById("brokenAlert").classList.add("none");
			document.getElementById("brokenOK").classList.remove("none");
		}
	});
}

function deleteBrokenConfirm(e){
	e.preventDefault();
	deleteSite(0,"broken");
	document.getElementById("brokenOKH4").textContent=i18n("deleting");
	document.getElementById("brokenAlert").classList.add("none");
	document.getElementById("brokenOK").classList.remove("none");
}

function deleteSite(j,mode){
	let e=mode==="duplicates"?duplicatedSites[j][0]:brokenSites[j][0];
	browser.storage.local.get(['sites','changes','sort']).then(result=>{
		let sites=result.sites,
			changes=result.changes,
			sort=result.sort,
			sSort;
		sites.splice(e,1);
		changes.splice(e,1);
		if(sort){
			sort.forEach((value,i)=>{
				id=parseInt(value[0].substr(4));
				if(id===e)sSort=i;
				else if(id>e)sort[i][0]=`item${id-1}`;
			});
			sort.splice(sSort,1);
		}
		browser.storage.local.set({sites:sites,changes:changes,sort:sort}).then(()=>{
			browser.runtime.sendMessage({"deletedSite":true,"id":e,"listSite":true});
			if(mode==="duplicates"){
				if(j+1<duplicatedSites.length)
					deleteSite(j+1,mode);
				else
					document.getElementById("duplicatesOKH4").textContent=i18n("deletedPages",duplicatedSites.length);
			}else{
				if(j+1<brokenSites.length)
					deleteSite(j+1,mode);
				else
					document.getElementById("brokenOKH4").textContent=i18n("deletedPages",brokenSites.length);
			}
		});
	});
}
