export interface TypeformWebhookPayload {
	event_id: string;
	event_type: string;
	form_response: FormResponse;
}

export interface FormResponse {
	form_id: string;
	token: string;
	submitted_at: string;
	landed_at: string;
	calculated: Score;
	variables: Variable[];
	hidden: Hidden;
	definition: Definition;
	answers: Answer[];
	ending: Ending;
}

interface Score {
	score: number;
}

interface Variable {
	key: string;
	type: "number" | "text";
	text?: string;
	number?: number;
}

interface Hidden {
	user_id?: string;
}

interface Definition {
	id: string;
	title: string;
	fields: Field[];
	endings: Ending[];
}

interface Field {
	id: string;
	title: string;
	type:
		| "long_text"
		| "dropdown"
		| "email"
		| "short_text"
		| "date"
		| "picture_choice"
		| "number"
		| "legal"
		| "multiple_choice"
		| "yes_no"
		| "opinion_scale"
		| "rating"
		| "calendly";
	ref: string;
	allow_multiple_selections: boolean;
	allow_other_choice: boolean;
	choices?: Choice[];
	properties?: any;
}

interface Choice {
	id: string;
	ref: string;
	label: string;
}

interface BaseType {
	field: Field;
}

export type NumberType = BaseType & {
	type: "number";
	number: number;
};

type TextType = BaseType & {
	type: "text";
	text: string;
};

type BooleanType = BaseType & {
	type: "boolean";
	boolean: boolean;
};

type NonChoiceType = BaseType & {
	type: "email" | "date" | "choices" | "url";
	email?: string;
	date?: string;
	choices?: {
		ids: string[];
		labels: string[];
		refs: string[];
	};
	url?: string;
};

type ChoiceType = BaseType & {
	type: "choice";
	choice: Choice;
};

type Answer = NonChoiceType | ChoiceType | BooleanType | TextType | NumberType;

interface Ending {
	id: string;
	ref: string;
	title?: string;
	type?: "thankyou_screen";
	properties?: Properties;
}

interface Properties {
	button_text?: string;
	show_button?: boolean;
	share_icons?: boolean;
	button_mode?: "default_redirect";
}
