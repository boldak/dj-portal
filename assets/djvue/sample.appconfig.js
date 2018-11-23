{
	"config": {
		"id": "5a12db4a7b58b86819b7807a",
		"name": "DJAppsExplorer",
		"skinName": "dj",
		"appWidgets": [
			{
				"type": "language-selector",
				"instanceName": "language-selector",
				"showFlags": true
			},
			{
				"type": "page-list",
				"instanceName": "page-list-nav"
			},
			{
				"instanceName": "AppTopbar",
				"type": "v2.topbar",
				"icon": "/widgets/v2.topbar/icon.png",
				"decoration": {
					"languageSelector": {
						"enable": true,
						"showFlag": true,
						"showTitle": true
					},
					"loginButton": true,
					"gotoApps": false
				},
				"content": []
			}
		],
		"collaborations": [],
		"pages": [
			{
				"shortTitle": "Home",
				"href": "",
				"template": "left-right-bottom",
				"holders": {
					"banner": {
						"widgets": [
							{
								"type": "html-widget",
								"name": "noname",
								"icon": "mdi-language-html5",
								"options": {},
								"data": {
									"source": "embedded",
									"embedded": "\n{{JSON.stringify(config, null,\"\\t\")}}\n"
								},
								"id": "nj3wr4n9y8"
							},

							{
								"enabled": true,
								"bgImage": "./img/apps-explorer.png",
								"type": "v2.banner",
								"instanceName": "veblwv9etfd2xlw0q9s02j4i",
								"icon": "/widgets/v2.banner/icon.png"
							},
							{
								"text": "",
								"type": "htmlwidget",
								"instanceName": "c6u4w3r4v1kf4ff0we8yc766r",
								"icon": "/widgets/htmlwidget/icon.png"
							}
						],
						"width": 1358
					},
					"column": {
						"widgets": [],
						"width": 1200
					},
					"topleft": {
						"widgets": [
							{
								"title": "#tags",
								"level": 2,
								"type": "title",
								"instanceName": "7ryr8f2qhi5845cu5efrey7gb9",
								"icon": "/widgets/title/icon.png"
							},
							{
								"listeners": "apps",
								"type": "v2.app-tags",
								"instanceName": "tags",
								"icon": "/widgets/v2.app-tags/icon.png"
							},
							{
								"title": "#apps",
								"level": 2,
								"type": "title",
								"instanceName": "6empoicajpso0hwlkur5ecow29",
								"icon": "/widgets/title/icon.png"
							},
							{
								"appWidget": "",
								"type": "v2.app-list",
								"instanceName": "apps",
								"icon": "/widgets/v2.app-list/icon.png"
							}
						],
						"width": 659
					},
					"topright": {
						"widgets": [
							{
								"title": "#info",
								"level": 2,
								"type": "title",
								"instanceName": "3q25i4iv6x34a9d2fln8z1tt9",
								"icon": "/widgets/title/icon.png"
							},
							{
								"appWidget": "apps",
								"tagListeners": "tags",
								"type": "v2.app-description",
								"instanceName": "ozfk4ilhtfao8ayzwz96n7b9",
								"icon": "/widgets/v2.app-description/icon.png",
								"appListeners": [
									"apps"
								]
							}
						],
						"width": 659
					},
					"bottom": {
						"widgets": [],
						"width": 1200
					}
				},
				"subscriptions": [
					{
						"emitter": "tags",
						"receiver": "apps",
						"signal": "appTags",
						"slot": "appTags"
					},
					{
						"emitter": "ozfk4ilhtfao8ayzwz96n7b9",
						"receiver": "tags",
						"signal": "setTag",
						"slot": "setTag"
					},
					{
						"emitter": "apps",
						"receiver": "ozfk4ilhtfao8ayzwz96n7b9",
						"signal": "setApplication",
						"slot": "setApplication"
					},
					{
						"emitter": "ozfk4ilhtfao8ayzwz96n7b9",
						"receiver": "apps",
						"signal": "refresh",
						"slot": "refresh"
					}
				]
			}
		],
		"icon": "./img/app.png",
		"i18n": {
			"uk": {
				"#aaa": "Uuu",
				"#about": "Про  DJ Data",
				"#pages": "Сторінки",
				"#Search_and_Download _Dataset": "Пошук та завантаження наборів даних",
				"#Datasets": "Набори даних",
				"#Sources": "Джерела",
				"#Authors": "Автори",
				"#Indicators": "Показники",
				"#Countries": "Країни",
				"#Total": "Всього:",
				"#Topics": "Теми",
				"#Keywords": "Ключові слова",
				"#Search_Result": "Результати пошуку",
				"#Key": "Ключ пошуку",
				"#url": "./api/resource/Exploration of WDC Datasets-dm-default-uk.html",
				"#Home": "Головна",
				"#WDC Datasets Exploration": "Розвідка даних СЦД",
				"#Data Management": "Управління даними",
				"#World Data System": "Світова система даних",
				"#Sustainable Development": "Сталий розвиток",
				"#WDC description": "\"Розвідка даних СЦД\" це застосунок, який допоможе знайти, вибрати та завантажити наші дані.",
				"#apps": "Доступні застосунки",
				"#info": "Інформація про застосунок",
				"#AvDS": "Доступні набори даних:",
				"#topics": "Теми",
				"#sources": "Джерела",
				"#countries": "Країни",
				"#ukraine": "Регіони України",
				"#keywords": "Ключові слова",
				"#title": "Як створити застосунок",
				"#description": "Портал \"Doggy Jam\" надає дружній  WEB интерфейс для дослідження даних",
				"#AvailableDatasets": "Доступні набори даних:",
				"#selectRegion": "Виберіть одну або декілька областей",
				"#tags": "Пошукові теги",
				"#bg": "./img/default-banner-uk.png",
				"#dataSource": "Джерело даних",
				"#Datasource": "Джерело даних",
				"#Topic": "Розділ",
				"#dataset": "Набір даних:",
				"#t": "Фактори впливу",
				"#st": "Ключові події та процеси",
				"#history": "Оновлення",
				"#searchRes": "Знайдені набори даних",
				"#MDL": "Метадані",
				"#go": "Вперед",
				"#Search data and get info about it": "Шукаємо дані та інформацію про них",
				"#roadmap": "СТАТИСТИЧНИЙ АНАЛІЗ ЗАЛЕЖНОСТЕЙ. Дорожня карта для платформи DJ",
				"#tutorial": "Покроковий підручник",
				"#prestate": "Стадія підготовки",
				"#workwithmeta": "Робота з метаданими",
				"#preproc": "Підготовка даних",
				"#analysis_state": "Стадія аналізу",
				"#cls": "Кластерний аналіз",
				"#corr": "Кореляційний аналіз",
				"#pca": "Аналіз головних компонент",
				"#conclusion": "Висновки",
				"#chIntro": "Відкритий доступ до даних інтегрованої системи автоматизованого мониторингу об'єкту \"Укриття\" Чорнобильської АЕС",
				"#chaboutText": "SSECHNPP Open Data є спільним проектом ДСП \"Чорнобильська АЕС\" та Світового центру даних \"Геоінформатика та сталий розвиток\", мета якого забезпечити відкритий доступ до даних інтегрованої системи автоматизованого мониторингу  об'єкту \"Укриття\" Чорнобильської АЕС. Ці дані можуть бути використані міжнародною науковою спільнотою для проведення різноманітних міждисциплінарних досліджень.",
				"#chDetails": "Опубліковані набори даних  містять серії значень для 65 параметрів, що вимірюються пристроями системи атомної безпеки, стаціонарної системи радіаційного контролю, а також системи моніторингу структурної цілісності. Ми надаємо зручний інтерфейс для пошуку наборів даних за назвою параметрів та за ключовими словами з можливістю отримання докладної інформації про набори даних, їх попереднього перегляду та завантаження.",
				"#chAboutRef": "Про проект",
				"#chExplorerRef": "Провідник даних",
				"#chAboutIAMS": "Більше про ІСАМ...",
				"#source": "Джерело даних",
				"#IAMS_Indicators": "ІАСК об'єкту \"Укриття\" (Чорнобильська АЕС)",
				"#Indicator": "Показник",
				"#SDM": "Сталий розвиток.",
				"appName": "Сталий розвиток",
				"lanMethod": "Методологія",
				"lanSust": "Сталий розвиток 2015",
				"lanMethMenu": "/app/SDI/methodology",
				"lanDinEu": "Динаміка індексу сталого розвитку для країн Європи",
				"Ірландія": "Ірландія"
			},
			"en": {
				"#aaa": "Aaa",
				"#about": "About DJ Data",
				"#pages": "Pages",
				"#Search_and_Download _Dataset": "Search and Download  Dataset",
				"#Datasets": "Datasets",
				"#Sources": "Sources",
				"#Authors": "Authors",
				"#Indicators": "Indicators",
				"#Countries": "Countries",
				"#Total": "Total:",
				"#Topics": "Topics",
				"#Keywords": "Keywords",
				"#Search_Result": "Search Result",
				"#Key": "Search Key",
				"#url": "./api/resource/Exploration of WDC Datasets-dm-default-en.html",
				"#Home": "Home",
				"#WDC Datasets Exploration": "Exploration of  WDC Datasets",
				"#Data Management": "Data Management",
				"#World Data System": "World Data System",
				"#Sustainable Development": "Sustainable Development",
				"#WDC description": "Exploration of WDC Datasets is the single page application. You can use it for search and retrieve WDC data.",
				"#apps": "Available Applications",
				"#info": "About App",
				"#AvDS": "Available Datasets:",
				"#topics": "Topics",
				"#sources": "Sources",
				"#countries": "Countries",
				"#ukraine": "Ukraine",
				"#keywords": "Keywords",
				"#title": "How to create app",
				"#description": "\"Doggy Jam\" portal provide user frendly WEB interface for data exploration",
				"#AvailableDatasets": "Available datasets:",
				"#selectRegion": "Select one or more regions",
				"#tags": "Tags",
				"#bg": "./img/default-banner.png",
				"#dataSource": "Data Source",
				"#Datasource": "Data Source",
				"#Topic": "Topic",
				"#dataset": "Dataset:",
				"#t": "Impact Factors",
				"#st": "Key Events and Processes",
				"#history": "Dataset History",
				"#searchRes": "Available Datasets",
				"#MDL": "Full Metadata List",
				"#go": "Go!",
				"#Search data and get info about it": "Search data and get info about it",
				"#roadmap": "STATISTICAL DEPENDENCE ANALYSIS: A Roadmap for DJ platform",
				"#tutorial": "Step by step tutorial",
				"#prestate": "Preparation Stage",
				"#workwithmeta": "Working with metadata",
				"#preproc": "Data preprocessing",
				"#analysis_state": "Analysis Stage",
				"#cls": "Cluster analysis",
				"#corr": "Correlation Analysis",
				"#pca": "Principal Component Analysis",
				"#conclusion": "Conclusion",
				"#chIntro": "Open access to data of the Integrated Automated Monitoring System for Chornobyl NPP Shelter Object",
				"#chaboutText": "SSECHNPP Open Data є спільним проектом ДСП \"Чорнобильська АЕС\" та Світового центру даних \"Геоінформатика та сталий розвиток\", мета якого забезпечити відкритий доступ до даних інтегрованої системи автоматизованого мониторингу  об'єкту \"Укриття\" Чорнобильської АЕС. Ці дані можуть бути використані міжнародною науковою спільнотою для проведення різноманітних міждисциплінарних досліджень.",
				"#chDetails": "Опубліковані набори даних  містять серії значень для 65 параметрів, що вимірюються пристроями Nucear Safety Monitoring System, Stationary Radiation Monitoring System, а також Structure Monitoring System. Ми надаємо зручний інтерфейс для пошуку наборів даних за назвою параметрів та за ключовими словами з можливістю отримання докладної інформації про набори даних, їх попереднього перегляду та завантаження.",
				"#chAboutRef": "About project",
				"#chExplorerRef": "Data Explorer",
				"#chAboutIAMS": "More about IAMS...",
				"#source": "Data source",
				"#IAMS_Indicators": "IAMS for Shilter object (Chernobyl NPP)",
				"#Indicator": "Indicator",
				"#SDM": "Sustainable Development. Milestones",
				"appName": "Sustainable development",
				"lanMethod": "Methodology",
				"lanSust": "Sustainable development 2015",
				"lanMethMenu": "/app/SDI/methodology",
				"lanDinEu": "Sustainable index dynamics for Europe",
				"Ірландія": "Ireland"
			},
			"ru": {
				"#aaa": "Rrr",
				"#Search_and_Download _Dataset": "Поиск и загрузка наборов данных",
				"#Datasets": "Наборы данных",
				"#Sources": "Источники",
				"#Authors": "Авторы",
				"#Indicators": "Показатели",
				"#Countries": "Страны",
				"#Total": "Всего:",
				"#Topics": "Темы",
				"#Keywords": "Ключевые слова",
				"#Search_Result": "Результаты поиска",
				"#Key": "Ключ поиска",
				"#url": "./api/resource/Exploration of WDC Datasets-dm-default-en.html",
				"#Home": "Главная",
				"#Sustainable Development": "Устойчивое развитие",
				"#AvDS": "Доступные наборы данных:",
				"#topics": "Темы",
				"#sources": "Источники",
				"#countries": "Страны",
				"#ukraine": "Регионы Украины",
				"#keywords": "Ключевые слова",
				"#about": "Про  DJ Data",
				"#title": "How to create app",
				"#description": "Портал \"Doggy Jam\" предоставляет дружественный  WEB интерфейс для исследования данных",
				"#AvailableDatasets": "Доступные наборы данных:",
				"#selectRegion": "Select one or more regions",
				"#tags": "Теги",
				"#bg": "./img/default-banner.png",
				"#dataSource": "Data Source",
				"#Datasource": "Data Source",
				"#Topic": "Topic",
				"#dataset": "Dataset:",
				"#t": "Фактори впливу",
				"#st": "Ключові події та процеси",
				"#history": "Dataset History",
				"#searchRes": "Available Datasets",
				"#MDL": "Full Metadata List",
				"#go": "Вперед",
				"#Search data and get info about it": "Search data and get info about it",
				"#roadmap": "STATISTICAL DEPENDENCE ANALYSIS: A Roadmap for DJ platform",
				"#tutorial": "Step by step tutorial",
				"#prestate": "Preparation Stage",
				"#workwithmeta": "Working with metadata",
				"#preproc": "Data preprocessing",
				"#analysis_state": "Analysis Stage",
				"#cls": "Cluster analysis",
				"#corr": "Correlation Analysis",
				"#pca": "Principal Component Analysis",
				"#conclusion": "Conclusion",
				"#chIntro": "Open access to data from Integrated Automated Monitoring System for Chornobyl NPP Shelter Object",
				"#chaboutText": "SSECHNPP Open Data є спільним проектом ДСП \"Чорнобильська АЕС\" та Світового центру даних \"Геоінформатика та сталий розвиток\", мета якого забезпечити відкритий доступ до даних інтегрованої системи автоматизованого мониторингу  об'єкту \"Укриття\" Чорнобильської АЕС. Ці дані можуть бути використані міжнародною науковою спільнотою для проведення різноманітних міждисциплінарних досліджень.",
				"#chDetails": "Опубліковані набори даних  містять серії значень для 65 параметрів, що вимірюються пристроями системи атомної безпеки, стаціонарної системи радіаційного контролю, а також системи моніторингу структурної цілісності. Ми надаємо зручний інтерфейс для пошуку наборів даних за назвою параметрів та за ключовими словами з можливістю отримання докладної інформації про набори даних, їх попереднього перегляду та завантаження.",
				"#chAboutRef": "About project",
				"#chExplorerRef": "Data Explorer",
				"#chAboutIAMS": "More about IAMS...",
				"#source": "Source",
				"#IAMS_Indicators": "IAMS for Shilter object (Chernobyl NPP)",
				"#Indicator": "Indicator",
				"#SDM": "Сталий розвиток.",
				"appName": "Сталий розвиток",
				"lanMethod": "Методологія",
				"lanSust": "Сталий розвиток 2015",
				"lanMethMenu": "/app/SDI/methodology",
				"lanDinEu": "Динаміка індексу сталого розвитку для країн Європи",
				"Ірландія": "Ірландія"
			}
		},
		"title": "DJ Apps Explorer",
		"description": "Explore our apps",
		"keywords": [
			"Widget",
			"Single Page App",
			"Angular"
		],
		"dps": "https://dj-dps.herokuapp.com",
		"importedFromURL": "http://dj-app.herokuapp.com/app/DJAppsExplorer",
		"importedFromAuthor": "Andrey Boldak",
		"isPublished": true
	},
	"mode": "development",
	"needSave": false,
	"id": "5a12db4a7b58b86819b7807a",
	"name": "DJAppsExplorer",
	"author": {
		"passports": [],
		"isAdmin": true,
		"email": "boldak.andrey@gmail.com",
		"name": "Andrey Boldak",
		"photo": "https://lh4.googleusercontent.com/-FXs5tjXLlzs/AAAAAAAAAAI/AAAAAAAAAMY/v9q_vfkyfGc/photo.jpg?sz=500",
		"createdAt": "2017-12-18T13:53:14.442Z",
		"updatedAt": "2018-11-20T14:00:13.898Z",
		"id": "5a37c84a4dd564c00875a351",
		"isLoggedIn": true,
		"isOwner": true,
		"isCollaborator": false
	},
	"user": {
		"passports": [],
		"isAdmin": true,
		"email": "boldak.andrey@gmail.com",
		"name": "Andrey Boldak",
		"photo": "https://lh4.googleusercontent.com/-FXs5tjXLlzs/AAAAAAAAAAI/AAAAAAAAAMY/v9q_vfkyfGc/photo.jpg?sz=500",
		"createdAt": "2017-12-18T13:53:14.442Z",
		"updatedAt": "2018-11-20T14:00:13.898Z",
		"id": "5a37c84a4dd564c00875a351",
		"isLoggedIn": true,
		"isOwner": true,
		"isCollaborator": false
	},
	"pages": [
		{
			"layout": "layout-1-2"
		},
		{
			"name": "1",
			"title": "Another Page",
			"layout": "layout-1"
		}
	]
}