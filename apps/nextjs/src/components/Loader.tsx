import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader = () => {
	return (
		<div className="flex grow items-center justify-center p-6 sm:px-12">
			<div className="text-white">
				<ThreeDots
					visible={true}
					height="80"
					width="80"
					color="white"
					radius="9"
					ariaLabel="three-dots-loading"
					wrapperStyle={{}}
					wrapperClass=""
				/>
			</div>
		</div>
	);
};

export default Loader;
