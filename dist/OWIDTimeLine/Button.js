import React from 'react';
const Button = ({ type, text, onClick }) => {
    return (React.createElement("button", { type: "button", className: `Button Butto-${type}`, onClick: onClick }, text));
};
export default Button;
//# sourceMappingURL=Button.js.map