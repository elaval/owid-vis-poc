import React,{FC} from 'react'

import {ButtonProps} from './Button.types';



const Button: FC<ButtonProps> = ({type, text,onClick}) => {
    return (
        <button type="button" className={`Button Butto-${type}` } onClick={onClick}>
            {text}
        </button>
    )
}

export default Button;