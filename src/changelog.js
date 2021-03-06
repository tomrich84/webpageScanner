"use strict";

let changelog=`[
	{"version":"1.8.0",
		"changes":["Added possibility to scan an entire folder","Added possibility to open all pages in the folder (middle mouse button or ctrl + left mouse button)","Folders that contain changed pages are highlighted","Added French language #25 (Mozinet-fr)","Added a 'clear' button to the search bar","Added an animation of opening / closing folders","Improved sorting pages","Fixed bugs","Minor changes"],
		"changesPL":["Dodano możliwość skanowania całego folderu","Dodano możliwość otwarcia wszystkich stron w folderze (środkowy przycisk myszy lub ctrl + lewy przycisk myszy)","Foldery zawierające zmienione strony są podświetlone","Dodano język francuski #25 (Mozinet-fr)","Dodano przycisk 'wyczyść' do paska wyszukiwania","Dodano animację otwierania/zamykania folderów","Usprawniono sortowanie stron","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.7.4",
		"changes":["Added possibility to change the keyboard shortcut","Restored progress bar","Fixed bugs","Minor changes"],
		"changesPL":["Dodano możliwość zmiany skrótu klawiaturowego","Przywrócono pasek postępu","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.7.3",
		"changes":["Strict mode for JS","Fixed bug #21"],
		"changesPL":["Tryb ścisły dla JS","Naprawiono błąd #21"]
	},
	{"version":"1.7.2",
		"changes":["Fixed major bug"],
		"changesPL":["Naprawiono poważny błąd"]
	},
	{"version":"1.7.1",
		"changes":["Added possibility to set the delay in the opening pages in new tabs","Minor changes","Fixed bugs"],
		"changesPL":["Dodano możliwość ustawienia opóźnienia w otwieraniu stron w nowych kartach","Drobne zmiany","Naprawiono błędy"]
	},
	{"version":"1.7.0",
		"changes":["Added search bar","Added possibility to set the scanning frequency in minutes #19","Minor changes","Fixed bugs"],
		"changesPL":["Dodano pasek wyszukiwania","Dodano możliwość ustawienia częstotliwości skanowania w minutach #19","Drobne zmiany","Naprawiono błędy"]
	},
	{"version":"1.6.7",
		"changes":["Improved function to import pages from a bookmark folder","Minor changes","Fixed bugs"],
		"changesPL":["Ulepszono funkcję importowania stron z folderu zakładek","Drobne zmiany","Naprawiono błędy"]
	},
	{"version":"1.6.6",
		"changes":["Access to the bookmarks requires permission","Favicons are generated by the Google service","Favicons are saved in the database as base64","Fixed bugs"],
		"changesPL":["Dostęp do zakładek wymaga pozwolenia","Ikony stron generowane są przez usługę Google","Ikony stron zapisane są w bazie danych w formacie base64","Naprawiono błędy"]
	},
	{"version":"1.6.5",
		"changes":["Added possibility to disable automatic scanning","Added possibility to stop scanning individual pages","Added possibility to change the frequency of automatic scanner startup","Fixed bugs","Minor changes"],
		"changesPL":["Dodano możliwość wyłączenia automatycznego skanowania","Dodano możliwość zatrzymania skanowania poszczególnych stron","Dodano możliwość zmiany częstotliwości automatycznego uruchamiania skanera","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.6.0",
		"changes":["Added possibility to delete duplicates","Added possibility to delete broken pages","Broken pages are marked as gray","Fixed bugs","Minor changes"],
		"changesPL":["Dodano zakładkę 'zarządzanie'","Dodano możliwość usuwania duplikatów","Dodano możliwość usuwania niedziałających stron","Niedziałające strony są oznacznone jako szare","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.5.6",
		"changes":["Fixed bugs"],
		"changesPL":["Naprawiono błędy"]
	},
	{"version":"1.5.5",
		"changes":["Possibility to import / export pages to a bookmark folder"],
		"changesPL":["Możliwość importowania / eksportowania stron do folderu zakładek"]
	},
	{"version":"1.5.2",
		"changes":["Added possibility to change the default charset #18","Fixed bugs","Minor changes"],
		"changesPL":["Dodano możliwość zmiany domyślnego kodowania tekstu #18","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.5.0",
		"changes":["Reorganized options","Added 'Changelog' and 'Support'","Added possibility to restore a backup","Fixed bugs","Minor changes"],
		"changesPL":["Przeorganizowano opcje","Dodano 'Historię zmian' oraz 'Wsparcie'","Dodano możliwość przywrócenia kopii zapasowej","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.4.0",
		"changes":["Added 'next/previous change' buttons #16","Fixed problem with blank page #15","Fixed bugs","Minor changes"],
		"changesPL":["Dodano przyciski 'poprzednia/następna zmiana' #16","Naprawiono problem z pustą stroną #15","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.3.6",
		"changes":["Added possibility to name the folder before it was created"],
		"changesPL":["Dodano możliwość nazwania folderu przed jego utworzeniem"]
	},
	{"version":"1.3.5",
		"changes":["Added dark theme"],
		"changesPL":["Dodano ciemny motyw"]
	},
	{"version":"1.3.4",
		"changes":["The possibility to create a backup","Updated light theme","Minor changes"],
		"changesPL":["Dodano możliwość utworzenia kopii zapasowej","Zaktualizowano jasny motyw","Drobne zmiany"]
	},
	{"version":"1.3.3",
		"changes":["Fixed bugs","Minor changes"],
		"changesPL":["Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.3.2",
		"changes":["Added possibility to accurately set the scan frequency","Fixed bugs"],
		"changesPL":["Dodano możliwość dokładnego ustawienia częstotliwości skanowania","Naprawiono błędy"]
	},
	{"version":"1.3.1",
		"changes":["Added highlighting for the folder","Fixed bug"],
		"changesPL":["Dodano podświetlenie dla folderów","Naprawiono błędy"]
	},
	{"version":"1.3.0",
		"changes":["Added possibility to sort and create folders #1","Restored context menu to input fields","Fixed bugs","Minor changes"],
		"changesPL":["Dodano mozliwość sortowania i tworzenia folderów #1","Przywrócono menu kontekstowe dla pól tekstowych","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.2.6",
		"changes":["Replaced innerHTML by DOM Parser"],
		"changesPL":["Zastąpiono innerHTML przez DOM Parser"]
	},
	{"version":"1.2.5",
		"changes":["Added possibility to display the scan list on the popup","Blocked text selection in the scan list","Added 'Fill' button to 'Add new page' panel","Minor changes"],
		"changesPL":["Dodano możliwość wyświetlania listy skanowania na wyskaującym oknie","Zablokowano zaznaczanie tekstu na liscie skanowania","Dodano przycisk 'Uzupełnij' do panelu 'Dodaj nową stronę'","Drobne zmiany"]
	},
	{"version":"1.2.4",
		"changes":["Added a badge to a toolbar button","The 'open changed pages' button is hidden if automatic opening is active","Added 'open changed pages' button to popup","Fixed bugs","Minor changes"],
		"changesPL":["Dodano znaczek do przycisku paska narzędzi","Przycisk 'otwórz zmienione strony' jest ukryty jeśli automatyczne otwieranie jest aktywne","Dodano przycisk 'otwórz zmienone strony' do wyskakującego okna","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.2.3",
		"changes":["More accurate comparison script. (Compares every word, not whole paragraphs)","Possibility to restore old script (via settings)","Automatically hidden statusbar","Views do not contain data are disabled","Minor chages"],
		"changesPL":["Dokładniejszy skrypt porównujący. (Porównuje każde słowo, nie całe praragrafy)","Możliwość przywrócenia starego skryptu (przez ustawienia)","Automatyczne ukrywanie paska statusu","Widoki nie zawierające danych są zablokowane","Drobne zmiany"]
	},
	{"version":"1.2.2",
		"changes":["More settings","Automatic save settings","The possibility to open pages in a new window","New view - 'deleted elements'","Minor chages"],
		"changesPL":["Więcej ustawień","Automatyczne zapisywanie ustawień","Możliwość otwierania stron w nowym oknie","Nowy widok - 'usunięte elementy'","Drobne zmiany"]
	},
	{"version":"1.2.0",
		"changes":["Asynchronous scanning (now it's only a few seconds)","Maximum query time for one page is 10s","Context buttons are displayed for only one page at a time","Removed progressbar","Fixed bugs","Minor changes and optimization"],
		"changesPL":["Asynchroniczne skanowanie (teraz to tylko kilka sekund)","Maksymalny czas skanowania dla jednej strony to 10 sekund","Przyciski kontekstowe są wyświetlane tylko dla jednej strony","Usunięto pasek postępu","Naprawiono błędy","Drobne zmiany i optymalizacje"]
	},
	{"version":"1.1.2",
		"changes":["Added 'scan this page' button to the context menu","Updated manifest file","Minor changes"],
		"changesPL":["Dodano przycisk 'skanuj tę stronę' do menu kontekstowego","Zaktualizowano plik manifest","Drobne zmiany"]
	},
	{"version":"1.1.1",
		"changes":["Removed unused file","Fixed bugs","Minor changes and optimizations"],
		"changesPL":["Usunięto nieużywany plik","Naprawiono błędy","Drobne zmiany i optymalizacje"]
	},
	{"version":"1.1.0",
		"changes":["Added setting for auto-hide interface","Minor changes"],
		"changesPL":["Dodano ustawienie dla automatycznego ukrywania interfejsu","Drobne zmiany"]
	},
	{"version":"1.0.9",
		"changes":["All icons changed to svg","Added possibility to hide the interface","Fixed bug","Minor changes"],
		"changesPL":["Wszystki ikony zmienone na svg","Dodano możliwość ukrycia interfejsu","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.0.8",
		"changes":["Added style for changed links","Code optimization","Fixed bugs","Minor changes"],
		"changesPL":["Dodano styl dla zmienoych odnośników","Zoptymalizowano kod","Naprawiono błędy","Drobne zmiany"]
	},
	{"version":"1.0.7",
		"changes":["Added settings","Added a shortcut to the settings","Improved sidebar (faster loading)","Fixed bugs"],
		"changesPL":["Dodano ustawienia","Dodano skrót do ustawień","Ulepszono panel boczny (szybsze ładowanie)","Naprawiono błędy"]
	},
	{"version":"1.0.6",
		"changes":["Added settings (volume control)","Added page title in 'new elements' view"],
		"changesPL":["Dodano ustawienia (kontrola głośności)","Dodano tytuł strony w widoku 'nowe elementy'"]
	},
	{"version":"1.0.5",
		"changes":["Fixed problem with loading styles etc., when the link starts with // (eg //example.com)","Changed mp3 file to opus"],
		"changesPL":["Naprawiono problem z ładowanie stylów itp., jeśli link zaczynał się od // (np. //example.com)","Zmienono plik mp3 na opus"]
	},
	{"version":"1.0.4",
		"changes":["Fixed bug","Optimized svg"],
		"changesPL":["Naprawiono błąd","Zoptymalizowano svg"]
	},
	{"version":"1.0.3",
		"changes":["Added notification sound"],
		"changesPL":["Dodano dźwięk powiadomień"]
	},
	{"version":"1.0.2",
		"changes":["'InnerHTML' is replaced by 'textContent'","New translation system (html files)","Minor changes"],
		"changesPL":["'Inner HTML' zastąpiono przez 'textContent'","Nowy system tłumaczenia (pliki html)","Drobne zmiany"]
	},
	{"version":"1.0",
		"changes":["Initial release"],
		"changesPL":["Pierwsze wydanie"]
	}
]`;

(function(){
	let container=document.getElementById("changelog"),
		lang=browser.i18n.getUILanguage();
	JSON.parse(changelog).forEach(v=>{
		let article=document.createElement("article"),
			h3=document.createElement("h3"),
			ul=document.createElement("ul"),
			changes=lang==="pl"?v.changesPL:v.changes;
		h3.textContent=browser.i18n.getMessage("version",v.version);
		changes.forEach(c=>{
			let li=document.createElement("li");
				li.textContent=c;
			ul.appendChild(li);
		});
		article.appendChild(h3);
		article.appendChild(ul);
		container.appendChild(article);
	});
})();
