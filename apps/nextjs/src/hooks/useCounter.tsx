import React, { useState } from "react";

const useCounter = (initialValue = 0) => {
	const [count, setCount] = useState(initialValue);

	const increment = () => {
		setCount(count + 1);
	};

	const decrement = () => {
		setCount(count - 1);
	};

	return { count, setCount, increment, decrement };
};

export default useCounter;
