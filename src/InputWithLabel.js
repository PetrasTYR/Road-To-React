import React from 'react';

const InputWithLabel = ({ id, value, type = 'text', isFocused, onInputChange, children }) => {
    // A
    const inputRef = React.useRef();

    // C
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            // D
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
        <label htmlFor={id} className="label">{children}</label>
        &nbsp;
        <input
            ref={inputRef}
            id={id}
            type={type}
            value={value}
            onChange={onInputChange}
            className="input"
        />
        </>
    )
};
export default InputWithLabel;