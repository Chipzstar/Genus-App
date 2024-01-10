import * as z from "zod";

export const genders = ["male", "female", "non-binary", "other"] as const;
export const career_interests = ["banking_finance", "consulting", "law", "tech"] as const;
export const broad_course_categories = ["accounting-and-finance", "agriculture-and-environmental-sciences", "architecture-and-planning", "arts-and-design", "business-and-management", "computer-science-and-it", "economics", "education", "engineering", "health-and-medicine", "humanities-and-social-sciences", "law-and-legal-studies", "language-and-linguistics", "mathematics-and-statistics", "media-and-communications", "natural-sciences", "sports-and-exercise-science"] as const

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
    "liverpool-john-moores-university",
    "liverpool-school-of-tropical-medicine",
    "london-business-school",
    "london-metropolitan-university",
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
    "royal-college-of-art",
    "royal-college-of-music",
    "royal-conservatoire-of-scotland",
    "royal-holloway,-university-of-london",
    "royal-northern-college-of-music",
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
    "the-courtauld-institute-of-art,-university-of-london",
    "the-glasgow-school-of-art",
    "the-liverpool-institute-for-performing-arts",
    "the-london-institute-of-banking-and-finance",
    "the-london-school-of-economics-and-political-science",
    "the-royal-academy-of-music,-university-of-london",
    "the-royal-agricultural-university",
    "the-royal-central-school-of-speech-and-drama",
    "the-royal-veterinary-college-university-of-london",
    "the-university-of-law",
    "the-university-of-northampton",
    "the-university-of-york",
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

export const completion_years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"] as const

const gendersSchema = z.enum(genders)

const careerInterestsSchema = z.enum(career_interests)

const broadCourseCategorySchema = z.enum(broad_course_categories)

const universitiesSchema = z.enum(universities)

const completionYearSchema = z.enum(completion_years)

export const loginSchema = z.object({
    email: z
        .string({
            required_error: "Please enter your email address.",
        })
        .email({message: "Invalid email address."}),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})

export const signupSchema = z.object({
    firstname: z
        .string({required_error: "Please enter your first name."})
        .min(2, {
            message: "First name must be at least 2 characters.",
        })
        .max(30, {
            message: "First name must not be longer than 30 characters.",
        }),
    lastname: z
        .string({required_error: "Please enter your last name."})
        .min(2, {
            message: "Last name must be at least 2 characters.",
        })
        .max(30, {
            message: "Last name must not be longer than 30 characters.",
        }),
    email: z
        .string({
            required_error: "Please enter your email address.",
        })
        .email(),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string(),
    gender: gendersSchema,
    university: universitiesSchema,
    broad_degree_course: broadCourseCategorySchema,
    degree_name: z.string({required_error: "Please enter your degree."}).min(2),
    completion_year: completionYearSchema,
    career_interests: careerInterestsSchema,
}).refine(
    (values) => {
        return values.password === values.confirmPassword;
    },
    {
        message: "Passwords must match!",
        path: ["confirmPassword"],
    })
