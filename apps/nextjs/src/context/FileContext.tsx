import React, { ReactNode, useContext } from "react";

interface IFileContext {
	files: File[];
	updateFile: (updatedFiles: File[]) => void;
}

const FileContext = React.createContext<IFileContext | undefined>(undefined);

interface IFileProviderProps {
	children: ReactNode | React.JSX.Element | React.JSX.Element[];
}

export const FileProvider: React.FC<IFileProviderProps> = ({ children }) => {
	const [files, setFiles] = React.useState<File[]>([]);

	const updateFile = (updatedFiles: File[]) => {
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
