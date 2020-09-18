import React from 'react';
import styles from './FormsControls.module.scss'
import { Field } from 'redux-form';
 

const FormControl = ({ input, meta: {touched, error, warning}, children }) => { // children = <input {...input} {...restProps} /> or children = <input {...input} {...restProps} />
    const hasError = touched && error;
    const hasWarn = touched && warning;
    return (
        <div className={styles.formControl + ' ' + (hasError ? styles.error: "") + ' ' + (hasWarn ? styles.warning: "")}>
            <div className=''>
                {children}
            </div>
            <div className=''>
                {
                (hasError && <span>{error}</span>) ||
                (hasWarn && <span>{warning}</span>)
                }
            </div>
        </div>
    )
}


export const TextArea = (props) => {
    const { input, meta, child, ...restProps } = props;
    return (<FormControl {...props}><textarea {...input} {...restProps} /></FormControl>)
}

export const Input = (props) => {
    const { input, meta, child, ...restProps } = props; 
    return (<FormControl {...props}><input {...input} {...restProps}/></FormControl>)
}

export const createField = (placeholder, name, component, validators, props={}, text="") => { 
    return <div className=''><Field placeholder={placeholder} name={name} component={component} validate={validators} {...props}/>{text}</div>
};
