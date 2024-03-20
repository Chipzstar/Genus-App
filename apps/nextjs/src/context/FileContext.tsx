import type { ReactNode} from "react";
import React, { useContext } from "react";
import { toast } from 'sonner'

interface IFileContext {
	files: File[];
	updateFile: (updatedFiles: File[]) => void;
}

const EIGHT_MB = 8 * 1024 * 1024

const FileContext = React.createContext<IFileContext | undefined>(undefined);

interface IFileProviderProps {
	children: ReactNode | React.JSX.Element | React.JSX.Element[];
}

export const FileProvider: React.FC<IFileProviderProps> = ({ children }) => {
	const [files, setFiles] = React.useState<File[]>([]);

	const updateFile = (updatedFiles: File[]) => {
		for (const file of updatedFiles) {
			if(file.size >= EIGHT_MB) { // file size is greater than 8MB
				toast.error("File Size Error", {
					description: "The file size should not exceed 8MB.",
					duration: 5000,
					closeButton: true
				});
				return; // Exit the function if a file is too large
			}
		}
		setFiles(updatedFiles);
	};

	return <FileContext.Provider value={{ files, updateFile }}>{children}</FileContext.Provider>;
};

export const useFileContext = (): IFileContext => {
	const context = useContext(FileContext);
	if (!context) {
		throw new Error("useFileContext must be used within a FileProvider");
	}
	return context;
};
