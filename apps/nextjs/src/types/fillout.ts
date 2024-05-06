export type QuestionType =
	| "MultipleChoice"
	| "Dropdown"
	| "ShortAnswer"
	| "DatePicker"
	| "Checkboxes"
	| "StarRating"
	| "NumberInput"
	| "Slider";

export interface Question {
	id: string;
	name: string;
	type: QuestionType;
	value: string | number | string[] | null;
}

export interface Submission {
	submissionId: string;
	submissionTime: string;
	lastUpdatedAt: string;
	questions: Question[];
}

export interface FormEvent {
	formId: string;
	formName: string;
	submission: Submission;
}
