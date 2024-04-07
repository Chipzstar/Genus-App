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

export const profile_types = ["STUDENT", "GRADUATE", "ADMIN", "EXPERT"] as const;

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

export const career_interests = ["banking_finance", "consulting", "law", "tech"] as const;
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

export const experience_types = [
	"insight_day_/_programme",
	"spring_week",
	"vacation_scheme",
	"internship",
	"graduate_role",
	"off-cycle_internship",
	"other"
] as const;
