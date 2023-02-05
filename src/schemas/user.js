import * as yup from 'yup';

export default yup.object().shape({
  email: yup
    .string()
    .email('formErrors.email')
    .required('formErrors.required'),
  role: yup
    .string()
    .required('formErrors.required')
});
