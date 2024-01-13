import React, {Fragment} from "react";

interface Props {
    children: JSX.Element;
}

const ListBoxWrapper = (props: Props) => (
    <div className="w-full py-2">
        <Fragment>{props.children}</Fragment>
    </div>
);

export default ListBoxWrapper
