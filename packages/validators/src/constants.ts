export const university_years = [
	"1st_year",
	"2nd_year",
	"3rd_year",
	"4th_year",
	"graduate",
	"postgraduate",
	"phd",
	"other"
] as const;

export const completion_years = [
	"2020",
	"2021",
	"2022",
	"2023",
	"2024",
	"2025",
	"2026",
	"2027",
	"2028",
	"2029",
	"2030"
] as const;

export const profile_types = ["student", "graduate", "admin", "expert"] as const;

export const genders = ["male", "female", "non_binary", "other"] as const;

export const ethnicity_dictionary = [
	{
		key: "white",
		label: "White",
		values: [
			"english__welsh__scottish__northern_irish_or_british",
			"irish",
			"gypsy_or_irish_traveller",
			"roma",
			"any_other_white_background"
		]
	},
	{
		key: "black",
		label: "Black, Black British, Caribbean or African",
		values: ["caribbean", "african", "any_other_black__black_british__or_caribbean_background"]
	},
	{
		key: "asian",
		label: "Asian or Asian British",
		values: ["indian", "pakistani", "bangladeshi", "chinese", "any_other_asian_background"]
	},
	{
		key: "mixed",
		label: "Mixed or multiple ethnic groups",
		values: [
			"white_and_black_caribbean",
			"white_and_black_african",
			"white_and_asian",
			"any_other_mixed_or_multiple_ethnic_background"
		]
	},
	{
		key: "other",
		label: "Other ethnic group",
		values: ["arab", "any_other_ethnic_group"]
	}
];

export const ethnicities = [
	"english__welsh__scottish__northern_irish_or_british",
	"irish",
	"gypsy_or_irish_traveller",
	"roma",
	"any_other_white_background",
	"caribbean",
	"african",
	"any_other_black__black_british__or_caribbean_background",
	"indian",
	"pakistani",
	"bangladeshi",
	"chinese",
	"any_other_asian_background",
	"white_and_black_caribbean",
	"white_and_black_african",
	"white_and_asian",
	"any_other_mixed_or_multiple_ethnic_background",
	"arab",
	"any_other_ethnic_group"
] as const;

export const career_interests = ["banking_finance", "law", "consulting", "tech"] as const;

export enum CAREER_INTERESTS {
	banking_finance = 1,
	law = 2,
	consulting = 3,
	tech = 4
}

export const broad_course_categories = [
	"accounting-and-finance",
	"agriculture-and-environmental-sciences",
	"architecture-and-planning",
	"arts-and-design",
	"business-and-management",
	"computer-science-and-it",
	"economics",
	"education",
	"engineering",
	"health-and-medicine",
	"humanities-and-social-sciences",
	"law-and-legal-studies",
	"language-and-linguistics",
	"mathematics-and-statistics",
	"media-and-communications",
	"natural-sciences",
	"sports-and-exercise-science"
] as const;

export const universities = [
	"abertay-university",
	"aberystwyth-university",
	"anglia-ruskin-university",
	"arts-university-bournemouth",
	"arts-university-plymouth",
	"aston-university",
	"bangor-university",
	"bath-spa-university",
	"birkbeck,-university-of-london",
	"birmingham-city-university",
	"birmingham-newman-university",
	"bishop-grosseteste-university",
	"bournemouth-university",
	"bpp-university",
	"brunel-university-london",
	"buckinghamshire-new-university",
	"canterbury-christ-church-university",
	"cardiff-metropolitan-university",
	"cardiff-university",
	"city,-university-of-london",
	"coventry-university",
	"cranfield-university",
	"de-montfort-university",
	"durham-university",
	"edge-hill-university",
	"edinburgh-napier-university",
	"european-school-of-economics",
	"falmouth-university",
	"glasgow-caledonian-university",
	"glasgow-school-of-art",
	"goldsmiths,-university-of-london",
	"guildhall-school-of-music-and-drama",
	"harper-adams-university",
	"hartpury-university-and-hartpury-college",
	"heriot-watt-university",
	"imperial-college-london",
	"keele-university",
	"king's-college-london",
	"kingston-university",
	"lancaster-university",
	"leeds-arts-university",
	"leeds-beckett-university",
	"leeds-conservatoire",
	"leeds-trinity-university",
	"liverpool-hope-university",
	"liverpool-institute-for-performing-arts",
	"liverpool-john-moores-university",
	"liverpool-school-of-tropical-medicine",
	"london-business-school",
	"london-institute-of-banking-and-finance",
	"london-metropolitan-university",
	"london-school-of-economics-and-political-science",
	"london-school-of-hygiene-and-tropical-medicine,-university-of-london",
	"london-south-bank-university",
	"loughborough-university",
	"manchester-metropolitan-university",
	"middlesex-university",
	"newcastle-university",
	"northern-school-of-contemporary-dance",
	"northumbria-university",
	"norwich-university-of-the-arts",
	"nottingham-trent-university",
	"oxford-brookes-university",
	"plymouth-marjon-university",
	"queen-margaret-university",
	"queen-mary-university-of-london",
	"queen's-university-belfast",
	"ravensbourne-university-london",
	"regent's-university-london",
	"richmond,-the-american-international-university-in-london",
	"robert-gordon-university",
	"rose-bruford-college",
	"royal-academy-of-music,-university-of-london",
	"royal-agricultural-university",
	"royal-central-school-of-speech-and-drama",
	"royal-college-of-art",
	"royal-college-of-music",
	"royal-conservatoire-of-scotland",
	"royal-holloway,-university-of-london",
	"royal-northern-college-of-music",
	"royal-veterinary-college-university-of-london",
	"school-of-advanced-study,-university-of-london",
	"scotland's-rural-college",
	"sheffield-hallam-university",
	"soas,-university-of-london",
	"solent-university",
	"st-george's,-university-of-london",
	"st-mary's-university,-twickenham",
	"staffordshire-university",
	"swansea-university",
	"teesside-university",
	"trinity-laban-conservatoire-of-music-and-dance",
	"ulster-university",
	"university-college-birmingham",
	"university-college-london",
	"university-for-the-creative-arts",
	"university-of-aberdeen",
	"university-of-bath",
	"university-of-bedfordshire",
	"university-of-birmingham",
	"university-of-bolton",
	"university-of-bradford",
	"university-of-brighton",
	"university-of-bristol",
	"university-of-buckingham",
	"university-of-cambridge",
	"university-of-central-lancashire",
	"university-of-chester",
	"university-of-chichester",
	"university-of-cumbria",
	"university-of-derby",
	"university-of-dundee",
	"university-of-east-anglia",
	"university-of-east-london",
	"university-of-edinburgh",
	"university-of-essex",
	"university-of-exeter",
	"university-of-glasgow",
	"university-of-gloucestershire",
	"university-of-greenwich",
	"university-of-hertfordshire",
	"university-of-huddersfield",
	"university-of-hull",
	"university-of-kent",
	"university-of-leeds",
	"university-of-leicester",
	"university-of-lincoln",
	"university-of-liverpool",
	"university-of-london",
	"university-of-manchester",
	"university-of-nottingham",
	"university-of-oxford",
	"university-of-plymouth",
	"university-of-portsmouth",
	"university-of-reading",
	"university-of-roehampton",
	"university-of-salford",
	"university-of-sheffield",
	"university-of-south-wales",
	"university-of-southampton",
	"university-of-st-andrews",
	"university-of-stirling",
	"university-of-strathclyde",
	"university-of-suffolk",
	"university-of-sunderland",
	"university-of-surrey",
	"university-of-sussex",
	"university-of-the-arts-london",
	"university-of-the-highlands-and-islands",
	"university-of-the-west-of-england",
	"university-of-the-west-of-scotland",
	"university-of-wales",
	"university-of-wales-trinity-saint-david",
	"university-of-warwick",
	"university-of-west-london",
	"university-of-westminster",
	"university-of-winchester",
	"university-of-wolverhampton",
	"university-of-worcester",
	"wrexham-glyndwr-university",
	"writtle-university-college",
	"york-st-john-university"
] as const;

export const companies = [
	"a&g_management_consulting",
	"accenture",
	"accountor",
	"addleshaw_goddard",
	"alixpartners",
	"allen_&_overy",
	"altran",
	"aon",
	"arthur_d._little",
	"ashfords",
	"ashurst",
	"aviva_investor",
	"bain_&_company",
	"balyasny_asset_management",
	"bank_of_america",
	"bank_of_england",
	"barclays",
	"baringa_partners",
	"barings",
	"bclp",
	"bdb_pitmans",
	"bdo_consulting",
	"bearingpoint",
	"berenberg",
	"bevan_brittan",
	"bird_&_bird",
	"birketts",
	"blackrock",
	"blake_morgan",
	"blm",
	"bloomberg",
	"bnp_paribas",
	"bny_mellon",
	"boston_consulting_group",
	"bow_&_arrow",
	"bp_trading",
	"brabners",
	"bristows",
	"brodies",
	"browne_jacobson",
	"burges_salmon",
	"burness_paull",
	"capco",
	"capgemini_invent",
	"capsticks",
	"charles_russell_speechlys",
	"citadel",
	"citi",
	"clarke_willmott",
	"clifford_chance",
	"clyde_&_co",
	"cms",
	"credit_suisse",
	"cripps_pemberton_greenish",
	"dac_beachcroft",
	"deloitte",
	"deutsche_bank",
	"devonshires",
	"dickson_minto",
	"digby_brown",
	"dwf",
	"ernst_&_young",
	"evercore",
	"eversheds_sutherland",
	"farrer_&_co",
	"fidelity",
	"fieldfisher",
	"fladgate",
	"fletchers",
	"foot_anstey",
	"forsters",
	"freeths",
	"freshfields_bruckhaus_deringer",
	"fti_consulting",
	"gateley",
	"goldman_sachs",
	"gowling_wlg",
	"gp_bullhound",
	"grant_thornton",
	"harbottle_&_lewis",
	"harper_macleod",
	"harrison_clark_rickerbys",
	"hay_group",
	"hcl_axon",
	"herbert_smith_freehills",
	"hewitt_associates",
	"hfw",
	"hill_dickinson",
	"hitachi_consulting",
	"hogan_lovells",
	"horváth_&_partners",
	"houlihan_lokey",
	"howard_kennedy",
	"hp_enterprise_services",
	"hsbc",
	"hugh_james",
	"huron_consulting_group",
	"ibm_global_business_services",
	"icf_international",
	"ince",
	"infosys_consulting",
	"irwin_mitchell",
	"jane_street_capital",
	"jefferies",
	"jmw",
	"jp_morgan",
	"kearney",
	"kennedys",
	"keoghs",
	"keystone_law",
	"kingsley_napley",
	"knights",
	"korn_ferry",
	"kpmg",
	"l.e.k._consulting",
	"lazard",
	"leigh_day",
	"lewis_silkin",
	"linklaters",
	"m_capital",
	"macfarlanes",
	"macquarie_group",
	"man_group",
	"marakon",
	"marsh_&_mclennan_companies",
	"maven_securities",
	"mckinsey_&_company",
	"michelmores",
	"mills_&_reeve",
	"minster_law",
	"mishcon_de_reya",
	"mitchell_madison_group",
	"morgan_stanley",
	"nomura",
	"norton_rose_fulbright",
	"o’neill_patient",
	"oliver_wyman",
	"osborne_clarke",
	"pa_consulting_group",
	"panmure_gordon",
	"penningtons_manches",
	"perella_weinberg_partners",
	"pinsent_masons",
	"piper_sandler",
	"pjt",
	"plexus_legal",
	"point72",
	"pwc",
	"rbc_capital_markets",
	"rbs",
	"roland_berger",
	"rothschild_&_co",
	"royds_withy_king",
	"rpc",
	"russell-cooke",
	"sackers",
	"santander",
	"savills_investment_management",
	"saxo_bank",
	"schroders",
	"shakespeare_martineau",
	"shepherd_&_wedderburn",
	"shoosmiths",
	"simmons_&_simmons",
	"simon-kucher_&_partners",
	"simpson_millar",
	"slalom_consulting",
	"slater_and_gordon",
	"slaughter_and_may",
	"sm&a",
	"societe_general",
	"st_james_place_wealth_management",
	"stephenson_harwood",
	"stewarts",
	"strategy&",
	"tata_consultancy_services",
	"taylor_wessing",
	"the_parthenon_group",
	"thorntons",
	"tlt",
	"travers_smith",
	"trowers_&_hamlins",
	"ubs",
	"veale_wasbrough_vizards",
	"walker_morris",
	"ward_hadaway",
	"watson_farley_&_williams",
	"wedlake_bell",
	"weightmans",
	"wells_fargo",
	"wiggin",
	"winckworth_sherwood",
	"withers",
	"womble_bond_dickinson",
	"other"
] as const;

/*export const company_options: CompanyOptions[] = [
	{
		label: "A&g Management Consulting",
		value: "a&g_management_consulting"
	},
	{ label: "Accenture", value: "accenture" },
	{ label: "Accountor", value: "accountor" },
	{ label: "Addleshaw Goddard", value: "addleshaw_goddard" },
	{ label: "Alixpartners", value: "alixpartners" },
	{ label: "Allen & Overy", value: "allen_&_overy" },
	{ label: "Altran", value: "altran" },
	{ label: "Aon", value: "aon" },
	{ label: "Arthur D. Little", value: "arthur_d._little" },
	{ label: "Ashfords", value: "ashfords" },
	{ label: "Ashurst", value: "ashurst" },
	{ label: "Aviva Investor", value: "aviva_investor" },
	{ label: "Bain & Company", value: "bain_&_company" },
	{
		label: "Balyasny Asset Management",
		value: "balyasny_asset_management"
	},
	{ label: "Bank Of America", value: "bank_of_america" },
	{ label: "Bank Of England", value: "bank_of_england" },
	{ label: "Barclays", value: "barclays" },
	{ label: "Baringa Partners", value: "baringa_partners" },
	{ label: "Barings", value: "barings" },
	{ label: "Bclp", value: "bclp" },
	{ label: "Bdb Pitmans", value: "bdb_pitmans" },
	{ label: "Bdo Consulting", value: "bdo_consulting" },
	{ label: "Bearingpoint", value: "bearingpoint" },
	{ label: "Berenberg", value: "berenberg" },
	{ label: "Bevan Brittan", value: "bevan_brittan" },
	{ label: "Bird & Bird", value: "bird_&_bird" },
	{ label: "Birketts", value: "birketts" },
	{ label: "Blackrock", value: "blackrock" },
	{ label: "Blake Morgan", value: "blake_morgan" },
	{ label: "Blm", value: "blm" },
	{ label: "Bloomberg", value: "bloomberg" },
	{ label: "Bnp Paribas", value: "bnp_paribas" },
	{ label: "Bny Mellon", value: "bny_mellon" },
	{
		label: "Boston Consulting Group",
		value: "boston_consulting_group"
	},
	{ label: "Bow & Arrow", value: "bow_&_arrow" },
	{ label: "Bp Trading", value: "bp_trading" },
	{ label: "Brabners", value: "brabners" },
	{ label: "Bristows", value: "bristows" },
	{ label: "Brodies", value: "brodies" },
	{ label: "Browne Jacobson", value: "browne_jacobson" },
	{ label: "Burges Salmon", value: "burges_salmon" },
	{ label: "Burness Paull", value: "burness_paull" },
	{ label: "Capco", value: "capco" },
	{ label: "Capgemini Invent", value: "capgemini_invent" },
	{ label: "Capsticks", value: "capsticks" },
	{
		label: "Charles Russell Speechlys",
		value: "charles_russell_speechlys"
	},
	{ label: "Citadel", value: "citadel" },
	{ label: "Citi", value: "citi" },
	{ label: "Clarke Willmott", value: "clarke_willmott" },
	{ label: "Clifford Chance", value: "clifford_chance" },
	{ label: "Clyde & Co", value: "clyde_&_co" },
	{ label: "Cms", value: "cms" },
	{ label: "Credit Suisse", value: "credit_suisse" },
	{
		label: "Cripps Pemberton Greenish",
		value: "cripps_pemberton_greenish"
	},
	{ label: "Dac Beachcroft", value: "dac_beachcroft" },
	{ label: "Deloitte", value: "deloitte" },
	{ label: "Deutsche Bank", value: "deutsche_bank" },
	{ label: "Devonshires", value: "devonshires" },
	{ label: "Dickson Minto", value: "dickson_minto" },
	{ label: "Digby Brown", value: "digby_brown" },
	{ label: "Dwf", value: "dwf" },
	{ label: "Ernst & Young", value: "ernst_&_young" },
	{ label: "Evercore", value: "evercore" },
	{ label: "Eversheds Sutherland", value: "eversheds_sutherland" },
	{ label: "Farrer & Co", value: "farrer_&_co" },
	{ label: "Fidelity", value: "fidelity" },
	{ label: "Fieldfisher", value: "fieldfisher" },
	{ label: "Fladgate", value: "fladgate" },
	{ label: "Fletchers", value: "fletchers" },
	{ label: "Foot Anstey", value: "foot_anstey" },
	{ label: "Forsters", value: "forsters" },
	{ label: "Freeths", value: "freeths" },
	{
		label: "Freshfields Bruckhaus Deringer",
		value: "freshfields_bruckhaus_deringer"
	},
	{ label: "Fti Consulting", value: "fti_consulting" },
	{ label: "Gateley", value: "gateley" },
	{ label: "Goldman Sachs", value: "goldman_sachs" },
	{ label: "Gowling Wlg", value: "gowling_wlg" },
	{ label: "Gp Bullhound", value: "gp_bullhound" },
	{ label: "Grant Thornton", value: "grant_thornton" },
	{ label: "Harbottle & Lewis", value: "harbottle_&_lewis" },
	{ label: "Harper Macleod", value: "harper_macleod" },
	{
		label: "Harrison Clark Rickerbys",
		value: "harrison_clark_rickerbys"
	},
	{ label: "Hay Group", value: "hay_group" },
	{ label: "Hcl Axon", value: "hcl_axon" },
	{
		label: "Herbert Smith Freehills",
		value: "herbert_smith_freehills"
	},
	{ label: "Hewitt Associates", value: "hewitt_associates" },
	{ label: "Hfw", value: "hfw" },
	{ label: "Hill Dickinson", value: "hill_dickinson" },
	{ label: "Hitachi Consulting", value: "hitachi_consulting" },
	{ label: "Hogan Lovells", value: "hogan_lovells" },
	{ label: "Horváth & Partners", value: "horváth_&_partners" },
	{ label: "Houlihan Lokey", value: "houlihan_lokey" },
	{ label: "Howard Kennedy", value: "howard_kennedy" },
	{ label: "Hp Enterprise Services", value: "hp_enterprise_services" },
	{ label: "Hsbc", value: "hsbc" },
	{ label: "Hugh James", value: "hugh_james" },
	{ label: "Huron Consulting Group", value: "huron_consulting_group" },
	{
		label: "Ibm Global Business Services",
		value: "ibm_global_business_services"
	},
	{ label: "Icf International", value: "icf_international" },
	{ label: "Ince", value: "ince" },
	{ label: "Infosys Consulting", value: "infosys_consulting" },
	{ label: "Irwin Mitchell", value: "irwin_mitchell" },
	{ label: "Jane Street Capital", value: "jane_street_capital" },
	{ label: "Jefferies", value: "jefferies" },
	{ label: "Jmw", value: "jmw" },
	{ label: "Jp Morgan", value: "jp_morgan" },
	{ label: "Kearney", value: "kearney" },
	{ label: "Kennedys", value: "kennedys" },
	{ label: "Keoghs", value: "keoghs" },
	{ label: "Keystone Law", value: "keystone_law" },
	{ label: "Kingsley Napley", value: "kingsley_napley" },
	{ label: "Knights", value: "knights" },
	{ label: "Korn Ferry", value: "korn_ferry" },
	{ label: "Kpmg", value: "kpmg" },
	{ label: "L.e.k. Consulting", value: "l.e.k._consulting" },
	{ label: "Lazard", value: "lazard" },
	{ label: "Leigh Day", value: "leigh_day" },
	{ label: "Lewis Silkin", value: "lewis_silkin" },
	{ label: "Linklaters", value: "linklaters" },
	{ label: "M Capital", value: "m_capital" },
	{ label: "Macfarlanes", value: "macfarlanes" },
	{ label: "Macquarie Group", value: "macquarie_group" },
	{ label: "Man Group", value: "man_group" },
	{ label: "Marakon", value: "marakon" },
	{
		label: "Marsh & Mclennan Companies",
		value: "marsh_&_mclennan_companies"
	},
	{ label: "Maven Securities", value: "maven_securities" },
	{ label: "Mckinsey & Company", value: "mckinsey_&_company" },
	{ label: "Michelmores", value: "michelmores" },
	{ label: "Mills & Reeve", value: "mills_&_reeve" },
	{ label: "Minster Law", value: "minster_law" },
	{ label: "Mishcon De Reya", value: "mishcon_de_reya" },
	{ label: "Mitchell Madison Group", value: "mitchell_madison_group" },
	{ label: "Morgan Stanley", value: "morgan_stanley" },
	{ label: "Nomura", value: "nomura" },
	{ label: "Norton Rose Fulbright", value: "norton_rose_fulbright" },
	{ label: "O’neill Patient", value: "o’neill_patient" },
	{ label: "Oliver Wyman", value: "oliver_wyman" },
	{ label: "Osborne Clarke", value: "osborne_clarke" },
	{ label: "Pa Consulting Group", value: "pa_consulting_group" },
	{ label: "Panmure Gordon", value: "panmure_gordon" },
	{ label: "Penningtons Manches", value: "penningtons_manches" },
	{
		label: "Perella Weinberg Partners",
		value: "perella_weinberg_partners"
	},
	{ label: "Pinsent Masons", value: "pinsent_masons" },
	{ label: "Piper Sandler", value: "piper_sandler" },
	{ label: "Pjt", value: "pjt" },
	{ label: "Plexus Legal", value: "plexus_legal" },
	{ label: "Point72", value: "point72" },
	{ label: "Pwc", value: "pwc" },
	{ label: "Rbc Capital Markets", value: "rbc_capital_markets" },
	{ label: "Rbs", value: "rbs" },
	{ label: "Roland Berger", value: "roland_berger" },
	{ label: "Rothschild & Co", value: "rothschild_&_co" },
	{ label: "Royds Withy King", value: "royds_withy_king" },
	{ label: "Rpc", value: "rpc" },
	{ label: "Russell-cooke", value: "russell-cooke" },
	{ label: "Sackers", value: "sackers" },
	{ label: "Santander", value: "santander" },
	{
		label: "Savills Investment Management",
		value: "savills_investment_management"
	},
	{ label: "Saxo Bank", value: "saxo_bank" },
	{ label: "Schroders", value: "schroders" },
	{ label: "Shakespeare Martineau", value: "shakespeare_martineau" },
	{ label: "Shepherd & Wedderburn", value: "shepherd_&_wedderburn" },
	{ label: "Shoosmiths", value: "shoosmiths" },
	{ label: "Simmons & Simmons", value: "simmons_&_simmons" },
	{
		label: "Simon-kucher & Partners",
		value: "simon-kucher_&_partners"
	},
	{ label: "Simpson Millar", value: "simpson_millar" },
	{ label: "Slalom Consulting", value: "slalom_consulting" },
	{ label: "Slater And Gordon", value: "slater_and_gordon" },
	{ label: "Slaughter And May", value: "slaughter_and_may" },
	{ label: "Sm&a", value: "sm&a" },
	{ label: "Societe General", value: "societe_general" },
	{
		label: "St James Place Wealth Management",
		value: "st_james_place_wealth_management"
	},
	{ label: "Stephenson Harwood", value: "stephenson_harwood" },
	{ label: "Stewarts", value: "stewarts" },
	{ label: "Strategy&", value: "strategy&" },
	{
		label: "Tata Consultancy Services",
		value: "tata_consultancy_services"
	},
	{ label: "Taylor Wessing", value: "taylor_wessing" },
	{ label: "The Parthenon Group", value: "the_parthenon_group" },
	{ label: "Thorntons", value: "thorntons" },
	{ label: "Tlt", value: "tlt" },
	{ label: "Travers Smith", value: "travers_smith" },
	{ label: "Trowers & Hamlins", value: "trowers_&_hamlins" },
	{ label: "Ubs", value: "ubs" },
	{
		label: "Veale Wasbrough Vizards",
		value: "veale_wasbrough_vizards"
	},
	{ label: "Walker Morris", value: "walker_morris" },
	{ label: "Ward Hadaway", value: "ward_hadaway" },
	{
		label: "Watson Farley & Williams",
		value: "watson_farley_&_williams"
	},
	{ label: "Wedlake Bell", value: "wedlake_bell" },
	{ label: "Weightmans", value: "weightmans" },
	{ label: "Wells Fargo", value: "wells_fargo" },
	{ label: "Wiggin", value: "wiggin" },
	{ label: "Winckworth Sherwood", value: "winckworth_sherwood" },
	{ label: "Withers", value: "withers" },
	{ label: "Womble Bond Dickinson", value: "womble_bond_dickinson" },
	{ label: "Other", value: "other" }
] as const;*/

export const experience_types = [
	"insight_day_/_programme",
	"spring_week",
	"vacation_scheme",
	"internship",
	"graduate_role",
	"off-cycle_internship",
	"other"
] as const;
