const globalError=(error , setErrors , setAlert)=>{
        const errors = error.response?.data;

        if (errors && errors.errors) {
            let fieldErrors = {};
            errors.errors.forEach(({ msg, field }) => {
                fieldErrors[field] = msg;
            });
            setErrors(fieldErrors);

        } else {
            setAlert({ msg: errors?.msg || "Something went wrong", field:true , error:true , success:false });
        }

        setTimeout(()=>{
            setAlert({msg:"" , field:false , success:false , error:false})
        },3000)
    };

export default globalError;