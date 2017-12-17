browser.runtime.onInstalled.addListener(handleInstalled);
function handleInstalled(details) {
	if(details.reason==="install"){
		browser.storage.local.get('sites').then(result=>{
			if(result.sites===undefined){
				browser.storage.local.set({sites:[],changes:[],sort:[]});
			}
		});
		browser.storage.local.get('settings').then(result=>{
			if(result.settings===undefined){
				browser.storage.local.set({settings:{
					"notificationVolume":60,
					"notificationTime":10000,
					"showNotification":true,
					"autoOpen":false,
					"hideHeader":false,
					"defaultView":"light",
					"openWindow":false,
					"openWindowMore":1,
					"requestTime":10000,
					"diffOld":false,
					"popupList":false,
					"theme":"light",
					"showNextPrev":true,
					"scrollToFirstChange":true,
					"skipMinorChanges":true,
					"addToContextMenu":true,
					"changelog":true
				}});
			}
			if(!result.settings.popupList)browser.browserAction.setPopup({popup:"/popup.html"});
			else browser.browserAction.setPopup({popup:"/sidebar.html"});
		});
	}else if(details.reason==="update"){
		browser.storage.local.get('settings').then(result=>{
			if(result.settings.showNextPrev===undefined){
				result.settings=Object.assign(result.settings,{
					"showNextPrev":true,
					"scrollToFirstChange":true,
					"skipMinorChanges":true,
					"addToContextMenu":true,
					"changelog":true
				});
				browser.storage.local.set({settings:result.settings});
			}else if(result.settings.addToContextMenu===undefined){
				result.settings=Object.assign(result.settings,{
					"addToContextMenu":true,
					"changelog":true
				});
				browser.storage.local.set({settings:result.settings});
			}
		});
	}
	if(!details.temporary&&result.settings.changelog!==false){
 			browser.tabs.create({
 				url:"options.html#changelog",
 				active:true
 			});
	}
}

(function(){
	browser.storage.local.get(['sites','sort','settings']).then(result=>{
		if(result.sort===undefined&&result.sites!==undefined){
			let sort=[];
			result.sites.forEach((value,i)=>{
				sort.push([`item${i}`,"root","item","",false]);
			});
			browser.storage.local.set({sort:sort});
		}
		showContext(result.settings.addToContextMenu);
	});
	scanLater(1);
})();

browser.alarms.onAlarm.addListener(alarm=>{
	scanLater(62);
	scanSites(0,true);
});

browser.runtime.onMessage.addListener(run);
function run(m){
	if(m.addThis)rqstAdd(m.url,m.title,"m0",8,true,m.favicon);
	if(m.scanSites)scanSites(0,true,true);
	if(m.openSites)openSite("webpagesScannertrue");
	if(m.addToContextMenu!=undefined)showContext(m.addToContextMenu);
}

function showContext(e){
	if(e){
		browser.contextMenus.create({
			id:			"addThis",
			title:		i18n("addThis"),
			contexts:	["page","tab"],
			onclick:	contextAdd
		});
	}else
		browser.contextMenus.remove("addThis");
}

function contextAdd(e){
	browser.tabs.query({
		url:e.pageUrl,
		currentWindow:true
	}).then(tabs=>{
		const tab=tabs[0];
		rqstAdd(tab.url,tab.title,"m0",8,true,tab.favicon);
	});
}