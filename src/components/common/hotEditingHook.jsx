import { useState, useEffect } from 'react';
export const useHotEditing = (startFieldValue, apiFunction, validators=[], maxLength=0) => { //  additionalData=null
    let [editMode, setEditMode] = useState(false);
    let [fieldValue, setFieldValue] = useState(startFieldValue);
    let [isInvalid, setisInvalid] = useState(false);

    let [charCount, setCharCount] = useState(`${startFieldValue.length}/${maxLength}`)

    useEffect(() => {
        setFieldValue(startFieldValue);
    }, [startFieldValue]);
    const activateEditMode = () => {
        setEditMode(true);
    }
    const deactivateEditMode = () => {
        setEditMode(false);
        !isInvalid && apiFunction(fieldValue)
    }
    const onFieldValueChange = (e) => {
        console.log('onChange now')
        console.log(e.currentTarget.value)
       if( validators.every(valid => valid(e.currentTarget.value)===undefined)) {
            setisInvalid(false)
            setFieldValue(e.currentTarget.value) 
            chars(e.currentTarget.value.length, maxLength)
       } else {
        setisInvalid(true)
       }
    }

    const chars = (currLen, maxLength) => {
        setCharCount(`${currLen}/${maxLength}`)
    }


    return [activateEditMode, deactivateEditMode, onFieldValueChange, editMode, fieldValue, isInvalid, charCount]
}


export const useRangeInput = (startFieldValue, apiFunction) => { //  additionalData=null 
    let [fieldValue, setFieldValue] = useState(startFieldValue); 

    useEffect(() => {
        setFieldValue(startFieldValue);
    }, [startFieldValue]);
    
    const onFieldValueChange = (e) => {
        // console.log('onChange now')
        // console.log(e.currentTarget.value)
        apiFunction(parseInt(e.currentTarget.value))
    }


    return [ onFieldValueChange, fieldValue]
}
